"use client";
import ProductInteractionPanel from "@/components/ProductInteractionPanel";
import { categories, products } from "@/constants/data";
import { useTextToSpeech } from "@/hooks/ai/useTextToSpeech";
import { AIModel } from "@/services/AIModel";
import { Message } from "@/utils/types";
import { StreamingTranscriber } from "assemblyai";
import React, { useEffect, useRef, useState } from "react";
import { FaRegCircleStop } from "react-icons/fa6";
import { IoMicOutline } from "react-icons/io5";

export default function VoiceChat() {
  const [conversation, setConversation] = useState<Message[]>([]);
  const { speak } = useTextToSpeech();
  const [isRecordingReady, setIsRecordingReady] = useState(false);

  const [enableMic, setEnableMic] = useState(false);
  const realtimeTranscriber = useRef<StreamingTranscriber | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recorder = useRef<any>(null);
  const silenceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [session, setSession] = useState<{
    step:
      | "intro"
      | "category"
      | "product"
      | "quantity"
      | "cart"
      | "confirmation";
    selectedCategory?: string;
    selectedProduct?: string;
    cart: { name: string; quantity: number }[];
  }>({
    step: "intro",
    cart: [],
  });

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

  const aiSpeak = (text: string) => {
    speak({
      text: text,
      onStart: () => console.log("🔊 Speaking..."),
      onEnd: () => console.log("✅ Done speaking"),
    });
  };
  useEffect(() => {
    async function getAIData() {
      if (
        conversation.length < 1 ||
        conversation[conversation.length - 1].role !== "user"
      )
        return;

      const lastTwoMsg = conversation.slice(-2);

      const aiResponse = await AIModel(lastTwoMsg, session);

      setConversation((prev) => [
        ...prev,
        {
          role: "assistant",
          content: aiResponse ?? "Sorry, I couldn’t process that.",
        },
      ]);

      if (!aiResponse) return;

      // Move to next step only if valid input is found
      switch (session.step) {
        case "intro":
          setSession((prev) => ({ ...prev, step: "category" }));
          break;

        case "category": {
          const matchedCategory = categories.find((c) =>
            aiResponse.toLowerCase().includes(c.label.toLowerCase())
          );
          if (matchedCategory) {
            setSession((prev) => ({
              ...prev,
              step: "product",
              selectedCategory: matchedCategory.value,
            }));
          }
          break;
        }

        case "product": {
          const selectedProducts = products.filter(
            (p) =>
              p.category === session.selectedCategory &&
              aiResponse.toLowerCase().includes(p.name.toLowerCase())
          );

          if (selectedProducts.length > 0) {
            setSession((prev) => ({
              ...prev,
              step: "quantity",
              selectedProduct: selectedProducts[0].name,
            }));
          }
          break;
        }

        case "quantity": {
          const quantity = parseInt(aiResponse.match(/\d+/)?.[0] ?? "0");

          if (session.selectedProduct && quantity > 0) {
            const updatedCart = [
              ...session.cart,
              { name: session.selectedProduct, quantity },
            ];
            setSession({
              step: "cart",
              selectedCategory: undefined,
              selectedProduct: undefined,
              cart: updatedCart,
            });
          }
          break;
        }

        case "cart": {
          const lower = aiResponse.toLowerCase();
          if (lower.includes("yes") || lower.includes("confirm")) {
            setSession((prev) => ({ ...prev, step: "confirmation" }));
          } else if (lower.includes("add") || lower.includes("more")) {
            setSession((prev) => ({ ...prev, step: "category" }));
          }
          break;
        }

        default:
          break;
      }
    }

    getAIData();
  }, [conversation]);

  const connectToServer = async () => {
    setEnableMic(true);

    const token = await getToken();
    if (!token) {
      console.error("No AssemblyAI token available");
      return;
    }

    realtimeTranscriber.current = new StreamingTranscriber({
      token,
      sampleRate: 16_000,
    });

    realtimeTranscriber.current.on("open", () => {
      console.log("✅ AssemblyAI connection opened!");

      // Start recording only after socket is open
      startRecording();
    });

    realtimeTranscriber.current.on("turn", async (turn) => {
      console.log(turn);
      if (!turn.end_of_turn) return;

      if (turn.transcript !== "") {
        console.log("Transcript:", turn.transcript);

        setConversation((prev) => [
          ...prev,
          {
            role: "user",
            content: turn.transcript,
          },
        ]);
      }
    });

    realtimeTranscriber.current.on("error", (err) => {
      setEnableMic(false);
      console.error("AssemblyAI Error:", err);
    });

    realtimeTranscriber.current.on("close", () => {
      setEnableMic(false);
      console.log("🔌 AssemblyAI connection closed");
    });

    await realtimeTranscriber.current.connect();
  };

  const startRecording = async () => {
    setIsRecordingReady(false); // Reset before starting
    const RecordRTC = (await import("recordrtc")).default;
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        recorder.current = new RecordRTC(stream, {
          type: "audio",
          mimeType: "audio/webm;codecs=pcm",
          recorderType: RecordRTC.StereoAudioRecorder,
          timeSlice: 250,
          desiredSampRate: 16000,
          numberOfAudioChannels: 1,
          bufferSize: 4096,
          audioBitsPerSecond: 128000,
          ondataavailable: async (blob) => {
            if (!realtimeTranscriber.current) return;

            if (silenceTimeout.current) clearTimeout(silenceTimeout.current);

            const buffer = await blob.arrayBuffer();
            try {
              realtimeTranscriber.current.sendAudio(buffer);
            } catch (e) {
              console.error("⚠️ Failed to send audio:", e);
            }

            silenceTimeout.current = setTimeout(() => {
              console.log("User stopped talking");
            }, 2000);
          },
        });

        recorder.current.startRecording();
        setIsRecordingReady(true);
      })
      .catch((err) => {
        console.error("Error starting recording:", err);
        setEnableMic(false);
      });
  };

  const disconnect = async () => {
    setIsRecordingReady(false);

    // Stop recorder and release stream
    if (recorder.current) {
      const stream = recorder.current?.stream;

      recorder.current.stopRecording(() => {
        if (stream) {
          stream.getTracks().forEach((track: MediaStreamTrack) => {
            track.stop(); // ✅ Properly stop all tracks
          });
        }

        recorder.current.destroy?.(); // Optional: if destroy method is available
        recorder.current = null;
      });
    }

    // Clear timeout
    if (silenceTimeout.current) {
      clearTimeout(silenceTimeout.current);
      silenceTimeout.current = null;
    }

    // Close AssemblyAI WebSocket
    if (realtimeTranscriber.current) {
      await realtimeTranscriber.current.close();
      realtimeTranscriber.current = null;
    }

    setEnableMic(false); // Will reset button UI
  };

  return (
    <div className="customMargin">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-semibold">
          👋 Hi there, I&apos;m <span className="text-primary">Cynthia</span> —
          your AI assistant.
        </h1>
        <p className="text-lg text-gray-600 mt-3">
          I&apos;m here to help you browse the menu, take orders, and assist
          with anything you need.
        </p>
      </div>

      <div className="flex justify-center my-4">
        {!enableMic ? (
          <button
            onClick={connectToServer}
            className="bg-primary text-white rounded-full p-4 shadow-lg transition-transform duration-200 ease-in-out hover:scale-110"
          >
            <IoMicOutline size={28} />
          </button>
        ) : !isRecordingReady ? (
          <button
            disabled
            className="bg-gray-400 text-white rounded-full p-4 shadow-lg animate-pulse cursor-not-allowed"
          >
            <svg className="w-6 h-6 animate-spin" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="white"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="white"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          </button>
        ) : (
          <button
            onClick={disconnect}
            className="bg-green-600 text-white rounded-full p-4 shadow-lg transition-transform duration-200 ease-in-out hover:scale-110"
          >
            <FaRegCircleStop size={28} />
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Dynamic product panel */}
        <div className="grid col-span-2 w-full border rounded">
          <ProductInteractionPanel session={session} />
        </div>

        <div className="grid col-span-1 w-full border rounded p-3 h-80 overflow-y-auto bg-gray-50 space-y-2">
          {conversation.map((msg, idx) => (
            <div
              key={idx}
              className={`p-2 rounded max-w-[80%] ${
                msg.role === "user"
                  ? "bg-blue-500 text-white self-end ml-auto"
                  : "bg-gray-300 text-gray-800 self-start mr-auto"
              }`}
            >
              {msg.content}
            </div>
          ))}
        </div>
      </div>
      {/* Chat Box */}

      <div className="text-xs text-gray-500 mt-2">
        Step: <strong>{session.step}</strong>
        {session.selectedCategory && ` | Category: ${session.selectedCategory}`}
        {session.selectedProduct && ` | Product: ${session.selectedProduct}`}
        {session.cart.length > 0 && ` | Cart: ${session.cart.length} items`}
      </div>
    </div>
  );
}
