"use client";

import { useTranscription } from "@/hooks/useTranscript";
import React from "react";

export default function LiveTranscriber() {
  const {
    startRecording,
    stopRecording,
    isRecording,
    orderedTranscript,
  } = useTranscription();

  return (
    <div className="p-6 max-w-lg mx-auto rounded-2xl shadow-lg bg-gray-900 text-white">
      <h2 className="text-xl font-bold mb-4">🎙️ Live Speech Transcription</h2>

      <div className="mb-4 p-4 bg-gray-800 rounded-lg min-h-[100px]">
        {orderedTranscript ? (
          <p className="text-lg">{orderedTranscript}</p>
        ) : (
          <p className="text-gray-400">Speak to see your transcript...</p>
        )}
      </div>

      <button
        onClick={isRecording ? stopRecording : startRecording}
        className={`w-full py-3 rounded-lg font-semibold ${
          isRecording
            ? "bg-red-600 hover:bg-red-700"
            : "bg-green-600 hover:bg-green-700"
        }`}
      >
        {isRecording ? "Stop Recording" : "Start Recording"}
      </button>
    </div>
  );
}
