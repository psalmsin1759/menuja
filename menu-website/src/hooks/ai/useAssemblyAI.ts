'use client';

import { useEffect, useRef, useState } from "react";
import { Readable } from "stream";
import { AssemblyAI } from "assemblyai";
import recorder from "node-record-lpcm16-ts";

interface TranscriptTurn {
  transcript: string;
  end_of_turn?: boolean;
}

export function useAssemblyAI(apiKey: string) {
  const [listening, setListening] = useState(false);
  const [partialTranscript, setPartialTranscript] = useState<string>("");
  const [finalTranscripts, setFinalTranscripts] = useState<string[]>([]);

  const clientRef = useRef<AssemblyAI | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const transcriberRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recordingRef = useRef<any>(null);

  useEffect(() => {
    clientRef.current = new AssemblyAI({ apiKey });

    return () => {
      stopListening();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiKey]);

  const startListening = async () => {
    if (!clientRef.current) return;

    const client = clientRef.current;
    const transcriber = client.streaming.transcriber({
      sampleRate: 16_000,
      formatTurns: true,
    });

    transcriber.on("open", ({ id }: { id: string }) => {
      console.log(`🎤 AssemblyAI session opened with ID: ${id}`);
      setListening(true);
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    transcriber.on("error", (error: any) => {
      console.error("AssemblyAI error:", error);
      stopListening();
    });

    transcriber.on("close", (code: number, reason: string) => {
      console.log("AssemblyAI session closed:", code, reason);
      setListening(false);
    });

    transcriber.on("turn", (turn: TranscriptTurn) => {
      if (!turn.transcript) return;

      setPartialTranscript(turn.transcript);

      if (turn.end_of_turn) {
        setFinalTranscripts((prev) => [...prev, turn.transcript]);
        setPartialTranscript("");
      }
    });

    try {
      await transcriber.connect();

      const recording = recorder.record({
        channels: 1,
        sampleRate: 16_000,
        audioType: "wav", // Linear PCM
      });

      Readable.toWeb(recording.stream()).pipeTo(transcriber.stream());

      recordingRef.current = recording;
      transcriberRef.current = transcriber;

      console.log("🎙️ Started recording and streaming to AssemblyAI");
    } catch (error) {
      console.error("Error starting AssemblyAI transcriber:", error);
      stopListening();
    }
  };

  const stopListening = async () => {
    if (recordingRef.current) {
      recordingRef.current.stop();
      recordingRef.current = null;
    }

    if (transcriberRef.current) {
      try {
        await transcriberRef.current.close();
      } catch (err) {
        console.error("Error closing AssemblyAI transcriber:", err);
      }
      transcriberRef.current = null;
    }

    setListening(false);
    setPartialTranscript("");
  };

  return {
    startListening,
    stopListening,
    listening,
    partialTranscript,
    finalTranscripts,
  };
}
