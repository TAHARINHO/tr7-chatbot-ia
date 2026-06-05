import { anthropic } from "@ai-sdk/anthropic";
import { streamText } from "ai";
import { NextRequest } from "next/server";
import { AIModel, Attachment } from "@/types/chat";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

type ApiMessageContent =
  | { type: "text"; text: string }
  | { type: "image"; image: string; mimeType: string }
  | { type: "file"; data: string; mimeType: string; filename?: string };

interface ApiMessage {
  role: "user" | "assistant";
  content: string | ApiMessageContent[];
}

interface ChatRequestBody {
  messages: Array<{
    role: "user" | "assistant";
    content: string;
    attachments?: Attachment[];
  }>;
  model?: AIModel;
  systemPrompt?: string;
}

function buildApiMessages(messages: ChatRequestBody["messages"]): ApiMessage[] {
  return messages.map((msg) => {
    if (!msg.attachments || msg.attachments.length === 0) {
      return { role: msg.role, content: msg.content };
    }

    const contentParts: ApiMessageContent[] = [];

    // Add text first
    if (msg.content.trim()) {
      contentParts.push({ type: "text", text: msg.content });
    }

    // Add attachments
    for (const att of msg.attachments) {
      if (att.type === "image") {
        contentParts.push({
          type: "image",
          image: att.base64,
          mimeType: att.mimeType,
        });
      } else if (att.type === "document") {
        contentParts.push({
          type: "file",
          data: att.base64,
          mimeType: att.mimeType,
          filename: att.name,
        });
      }
    }

    // Fallback text if no content
    if (contentParts.length === 0) {
      return { role: msg.role, content: msg.content };
    }

    return { role: msg.role, content: contentParts };
  });
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

  const apiMessages = buildApiMessages(messages);

  const result = streamText({
    model: anthropic(model),
    system: systemPrompt,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    messages: apiMessages as any,
    maxOutputTokens: 4096,
    temperature: 0.7,
  });

  const encoder = new TextEncoder();

  const readableStream = new ReadableStream({
    async start(controller) {
      try {
        for await (const part of result.fullStream) {
          if (part.type === "text-delta") {
            controller.enqueue(encoder.encode(part.text));
          } else if (part.type === "error") {
            const errMsg =
              part.error instanceof Error
                ? part.error.message
                : String(part.error);
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
