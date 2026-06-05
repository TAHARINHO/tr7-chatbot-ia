import { anthropic } from "@ai-sdk/anthropic";
import { streamText } from "ai";
import { NextRequest } from "next/server";
import { AIModel } from "@/types/chat";

export const maxDuration = 60;

interface ChatRequestBody {
  messages: { role: "user" | "assistant"; content: string }[];
  model?: AIModel;
  systemPrompt?: string;
}

export async function POST(req: NextRequest) {
  const body: ChatRequestBody = await req.json();
  const { messages, model = "claude-sonnet-4-6", systemPrompt } = body;

  if (!messages || messages.length === 0) {
    return Response.json({ error: "Messages requis" }, { status: 400 });
  }

  const result = streamText({
    model: anthropic(model),
    system: systemPrompt,
    messages,
    maxOutputTokens: 4096,
    temperature: 0.7,
  });

  return result.toTextStreamResponse();
}
