import { buildPrompt, SessionState } from "@/utils/prompt";
import { Role } from "@/utils/types";
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.NEXT_PUBLIC_AI_OPEN_ROUTER, 
  dangerouslyAllowBrowser: true,
});


export const AIModel = async (
  history: { role: Role; content: string }[],
  session?:SessionState
): Promise<string> => {
  const prompt = buildPrompt(session);

  const completion = await openai.chat.completions.create({
    model: "google/gemma-3-27b-it:free",
    messages: [
      { role: "system", content: prompt },
      ...history,
    ],
  });

  return completion.choices[0]?.message?.content?.trim() || "Sorry, I didn’t catch that.";
};

