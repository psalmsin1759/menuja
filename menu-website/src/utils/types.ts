export interface Message {
  id?: string;
  role: 'user' | 'system' | 'assistant';
  content: string;
  timestamp?: number;
}

export type Role = "system" | "user" | "assistant";