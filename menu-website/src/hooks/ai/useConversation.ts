import { useState } from "react";
import { useTextToSpeech } from "./useTextToSpeech";
import { useAssemblyAI } from "./useAssemblyAI"; 
import { Message, Role } from "@/utils/types";
import { AIModel } from "@/services/AIModel";

export function useConversation() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const { speak } = useTextToSpeech();

  const addMessage = (sender: "user" | "system", text: string) => {
    setMessages((prev) => [...prev, { id: crypto.randomUUID(), sender, text }]);
  };

  const processUserMessage = async (userMessage: string) => {
    setLoading(true);
    addMessage("user", userMessage);

    try {
      const history = messages.map((m) => ({
        role: m.sender === "user" ? "user" : ("assistant" as Role),
        content: m.text,
      }));

      const aiReply = await AIModel(userMessage, history);
      addMessage("system", aiReply);

      await speak({
        text: aiReply,
        onStart: () => addMessage("system", "[Speaking...]"),
        onEnd: () => {
          addMessage("system", "[Speech finished]");
          setTimeout(() => startListening(), 500);
        },
      });
    } catch (error) {
      console.error("AI error:", error);
      addMessage("system", "⚠️ Error: Unable to get AI response.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Replaced useAssemblyTranscriber with useAssemblyAI
  const {
    startListening,
    stopListening,
    listening,
    partialTranscript,
    finalTranscripts,
  } = useAssemblyAI(process.env.NEXT_PUBLIC_ASSEMBLY_AI_KEY!);

  // Listen for completed transcripts
  if (finalTranscripts.length > 0) {
    const lastTranscript = finalTranscripts[finalTranscripts.length - 1];
    processUserMessage(lastTranscript);
  }

  return {
    messages,
    loading,
    startListening,
    stopListening,
    listening,
    partialTranscript,
    addMessage,
  };
}
