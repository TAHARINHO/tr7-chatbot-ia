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
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey || apiKey === "your_anthropic_api_key_here") {
    return Response.json(
      { error: "ANTHROPIC_API_KEY manquante." },
      { status: 500 }
    );
  }

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

  const encoder = new TextEncoder();

  // Use fullStream to intercept error events before they reach the client
  const readableStream = new ReadableStream({
    async start(controller) {
      try {
        for await (const part of result.fullStream) {
          if (part.type === "text-delta") {
            controller.enqueue(encoder.encode(part.text));
          } else if (part.type === "error") {
            // Error event from the AI SDK
            const errMsg =
              part.error instanceof Error
                ? part.error.message
                : String(part.error);
            // Send a special marker so the client knows it's an error
            controller.enqueue(encoder.encode(`\x00ERR:${errMsg}`));
            controller.close();
            return;
          }
        }
        controller.close();
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        controller.enqueue(encoder.encode(`\x00ERR:${msg}`));
        controller.close();
      }
    },
  });

  return new Response(readableStream, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
