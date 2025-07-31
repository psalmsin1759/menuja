"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AssemblyAI, RealtimeTranscriber } from "assemblyai";
import { getToken } from "@/services/AssemblyService";

interface Transcript {
  text: string;
  finalized: boolean;
}

export function useAI() {
  const [isConnected, setIsConnected] = useState(false);
  const [transcripts, setTranscripts] = useState<Transcript[]>([]);
  const [error, setError] = useState<string | null>(null);

  const transcriberRef = useRef<RealtimeTranscriber | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recorderRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startAI = useCallback(async () => {
    try {
      if (typeof window === "undefined") return; 

      const { token } = await getToken();

      // Dynamic import so it's only loaded in browser
      const RecordRTC = (await import("recordrtc")).default;
      const { StereoAudioRecorder } = await import("recordrtc");

      const client = new AssemblyAI({ apiKey: token });
      const transcriber = client.realtime.transcriber({ sampleRate: 16000 });
      transcriberRef.current = transcriber;

      transcriber.on("transcript.partial", (msg) =>
        setTranscripts((prev) => [...prev, { text: msg.text, finalized: false }])
      );

      transcriber.on("transcript.final", (msg) =>
        setTranscripts((prev) => [...prev, { text: msg.text, finalized: true }])
      );

      await transcriber.connect();
      setIsConnected(true);

      // Mic stream
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      recorderRef.current = new RecordRTC(stream, {
        type: "audio",
        mimeType: "audio/webm;codecs=pcm",
        recorderType: StereoAudioRecorder,
        desiredSampRate: 16000,
        numberOfAudioChannels: 1,
        timeSlice: 500,
        ondataavailable: async (blob: Blob) => {
          if (!transcriberRef.current) return;
          const buffer = await blob.arrayBuffer();
          transcriberRef.current.sendAudio(buffer);
        },
      });

      recorderRef.current.startRecording();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || "Failed to start transcription");
    }
  }, []);

  const stopAI = useCallback(async () => {
    try {
      recorderRef.current?.stopRecording();
      recorderRef.current = null;

      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;

      if (transcriberRef.current) {
        await transcriberRef.current.close();
        transcriberRef.current = null;
      }

      setIsConnected(false);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || "Failed to stop transcription");
    }
  }, []);

  useEffect(() => {
    return () => {
      stopAI();
    };
  }, [stopAI]);

  return { isConnected, transcripts, error, startAI, stopAI };
}
