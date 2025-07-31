'use client';

import { useEffect, useRef, useState } from 'react';

export function useTranscription() {
  const socket = useRef<WebSocket | null>(null);
  const audioContext = useRef<AudioContext | null>(null);
  const mediaStream = useRef<MediaStream | null>(null);
  const scriptProcessor = useRef<ScriptProcessorNode | null>(null);

  const [isRecording, setIsRecording] = useState(false);
  const [transcripts, setTranscripts] = useState<Record<string, string>>({});

  const getToken = async (): Promise<string | null> => {
    try {
      const response = await fetch("/api/getAssemblyToken", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      });
      const data = await response.json();
      return data.token ?? null;
    } catch (error) {
      console.error("Error fetching token:", error);
      return null;
    }
  };

  const downsampleBuffer = (
    buffer: Float32Array,
    inputSampleRate: number,
    outputSampleRate: number
  ): Int16Array => {
    if (outputSampleRate === inputSampleRate) {
      const int16Buffer = new Int16Array(buffer.length);
      for (let i = 0; i < buffer.length; i++) {
        int16Buffer[i] = Math.max(-1, Math.min(1, buffer[i])) * 0x7fff;
      }
      return int16Buffer;
    }

    const sampleRateRatio = inputSampleRate / outputSampleRate;
    const newLength = Math.round(buffer.length / sampleRateRatio);
    const result = new Int16Array(newLength);

    let offsetResult = 0;
    let offsetBuffer = 0;

    while (offsetResult < result.length) {
      const nextOffsetBuffer = Math.round((offsetResult + 1) * sampleRateRatio);
      let accum = 0;
      let count = 0;

      for (let i = offsetBuffer; i < nextOffsetBuffer && i < buffer.length; i++) {
        accum += buffer[i];
        count++;
      }

      result[offsetResult] = Math.max(-1, Math.min(1, accum / count)) * 0x7fff;
      offsetResult++;
      offsetBuffer = nextOffsetBuffer;
    }

    return result;
  };

  const startRecording = async () => {
    const token = await getToken();
    if (!token) {
      alert("Failed to fetch token");
      return;
    }

    const wsUrl = `wss://streaming.assemblyai.com/v3/ws?sample_rate=16000&formatted_finals=true&token=${token}`;
    socket.current = new WebSocket(wsUrl);
    const turns: Record<string, string> = {};

    socket.current.onopen = async () => {
      console.log("WebSocket connected");
      setIsRecording(true);

      mediaStream.current = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContext.current = new AudioContext();

      const inputSampleRate = audioContext.current.sampleRate;
      const source = audioContext.current.createMediaStreamSource(mediaStream.current);
      scriptProcessor.current = audioContext.current.createScriptProcessor(4096, 1, 1);

      source.connect(scriptProcessor.current);
      scriptProcessor.current.connect(audioContext.current.destination);

      scriptProcessor.current.onaudioprocess = (event) => {
        if (!socket.current || socket.current.readyState !== WebSocket.OPEN) return;

        const input = event.inputBuffer.getChannelData(0);
        const downsampled = downsampleBuffer(input, inputSampleRate, 16000);
        socket.current.send(downsampled.buffer);
      };
    };

    socket.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === "Turn") {
        const { turn_order, transcript } = message;
        turns[turn_order] = transcript;

        setTranscripts({ ...turns });
      }
    };

    socket.current.onerror = (error) => {
      console.error("WebSocket error:", error);
      stopRecording();
    };

    socket.current.onclose = () => {
      console.log("WebSocket closed");
      socket.current = null;
    };
  };

  const stopRecording = () => {
    setIsRecording(false);

    if (scriptProcessor.current) {
      scriptProcessor.current.disconnect();
      scriptProcessor.current = null;
    }

    if (audioContext.current) {
      audioContext.current.close();
      audioContext.current = null;
    }

    if (mediaStream.current) {
      mediaStream.current.getTracks().forEach((track) => track.stop());
      mediaStream.current = null;
    }

    if (socket.current) {
      try {
        socket.current.send(JSON.stringify({ type: "Terminate" }));
      } catch (err) {
        console.warn("WebSocket already closed before terminate message.");
      }
      socket.current.close();
      socket.current = null;
    }
  };

  useEffect(() => {
    return () => {
      stopRecording(); 
    };
  }, []);

  const orderedTranscript = Object.keys(transcripts)
    .sort((a, b) => Number(a) - Number(b))
    .map((key) => transcripts[key])
    .join(" ");

  return {
    startRecording,
    stopRecording,
    isRecording,
    orderedTranscript,
  };
}
