import { useState } from "react";

export function useTextToSpeech() {
  const [isPlaying, setIsPlaying] = useState(false);

  const speak = async ({
    text,
    voiceId = "Xb7hH8MSUJpSbSDYk0k2",
    onEnd,
    onStart,
  }: {
    text: string;
    voiceId?: string;
    onEnd?: () => void;
    onStart?: () => void;
  }) => {
    const apiKey = process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY;
    if (!apiKey) {
      console.error("Missing ElevenLabs API Key");
      return;
    }

    try {
      setIsPlaying(true);
      onStart?.();

      const response = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "xi-api-key": apiKey,
          },
          body: JSON.stringify({
            text,
            model_id: "eleven_multilingual_v2",
            voice_settings: {
              stability: 0.5,
              similarity_boost: 0.75,
            },
          }),
        }
      );

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "TTS request failed");
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);

      audio.onended = () => {
        setIsPlaying(false);
        onEnd?.();
      };

      audio.play();
    } catch (err) {
      console.error("TTS error:", err);
      setIsPlaying(false);
    }
  };

  return {
    isPlaying,
    speak,
  };
}
