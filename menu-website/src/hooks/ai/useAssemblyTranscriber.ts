'use client';

import { useEffect, useRef, useState } from 'react';

export function useAssemblyTranscriber(
  onFinalTranscript: (text: string) => void
) {
  const socket = useRef<WebSocket | null>(null);
  const audioContext = useRef<AudioContext | null>(null);
  const mediaStream = useRef<MediaStream | null>(null);
  const scriptProcessor = useRef<ScriptProcessorNode | null>(null);

  const [listening, setListening] = useState(false);
  const [partialTranscript, setPartialTranscript] = useState<string>("");

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
      console.error("Error fetching AssemblyAI token:", error);
      return null;
    }
  };

  const downsampleBuffer = (
    buffer: Float32Array,
    inputSampleRate: number,
    outputSampleRate: number
  ): Int16Array => {
    if (outputSampleRate === inputSampleRate) {
      return Int16Array.from(buffer.map((n) => Math.max(-1, Math.min(1, n)) * 0x7fff));
    }
    const sampleRateRatio = inputSampleRate / outputSampleRate;
    const newLength = Math.round(buffer.length / sampleRateRatio);
    const result = new Int16Array(newLength);
    let offsetResult = 0;
    let offsetBuffer = 0;

    while (offsetResult < result.length) {
      const nextOffsetBuffer = Math.round((offsetResult + 1) * sampleRateRatio);
      let accum = 0, count = 0;
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

  const startListening = async () => {
    const token = await getToken();
    if (!token) {
      alert("Failed to get AssemblyAI token");
      return;
    }

    const wsUrl = `wss://streaming.assemblyai.com/v3/ws?sample_rate=16000&token=${token}`;
    socket.current = new WebSocket(wsUrl);

    socket.current.onopen = async () => {
      console.log(" AssemblyAI WebSocket connected");
      setListening(true);

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
      const msg = JSON.parse(event.data);
      console.log("🎤 AssemblyAI:", msg);

      if (msg.type === "Turn") {
        // update partial transcript continuously
        if (msg.transcript) {
          setPartialTranscript(msg.transcript);
        }

        // when the turn ends, commit final transcript
        if (msg.end_of_turn && msg.transcript) {
          setPartialTranscript("");
          onFinalTranscript(msg.transcript);
        }
      }
    };

    socket.current.onerror = (err) => {
      console.error("AssemblyAI WebSocket error:", err);
      stopListening();
    };

    socket.current.onclose = () => {
      console.log("AssemblyAI WebSocket closed");
      socket.current = null;
    };
  };

  const stopListening = () => {
    setListening(false);
    setPartialTranscript("");

    scriptProcessor.current?.disconnect();
    scriptProcessor.current = null;

    audioContext.current?.close();
    audioContext.current = null;

    mediaStream.current?.getTracks().forEach((track) => track.stop());
    mediaStream.current = null;

    if (socket.current) {
      try {
        socket.current.send(JSON.stringify({ type: "Terminate" }));
      } catch {}
      socket.current.close();
      socket.current = null;
    }
  };

  useEffect(() => stopListening, []);

  return {
    startListening,
    stopListening,
    listening,
    partialTranscript,
  };
}
