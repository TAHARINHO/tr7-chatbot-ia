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
  const result: ApiMessage[] = [];

  for (const msg of messages) {
    const hasText = msg.content.trim().length > 0;
    const hasAttachments = msg.attachments && msg.attachments.length > 0;

    // Skip entirely empty messages — these cause "text content blocks must be non-empty"
    if (!hasText && !hasAttachments) continue;
    // Skip stored error messages that were saved as assistant replies
    if (msg.role === "assistant" && msg.content.trim().startsWith("⚠️")) continue;

    if (!hasAttachments) {
      // Plain text message — Anthropic requires non-empty string
      result.push({ role: msg.role, content: msg.content.trim() });
      continue;
    }

    // Multimodal message
    const parts: ApiMessageContent[] = [];
    if (hasText) {
      parts.push({ type: "text", text: msg.content.trim() });
    }
    for (const att of msg.attachments!) {
      if (att.type === "image") {
        parts.push({ type: "image", image: att.base64, mimeType: att.mimeType });
      } else if (att.type === "document") {
        parts.push({ type: "file", data: att.base64, mimeType: att.mimeType, filename: att.name });
      }
    }
    if (parts.length > 0) {
      result.push({ role: msg.role, content: parts });
    }
  }

  // Enforce user/assistant alternation (Anthropic requirement)
  const deduped: ApiMessage[] = [];
  for (const msg of result) {
    const last = deduped[deduped.length - 1];
    if (last && last.role === msg.role) {
      deduped[deduped.length - 1] = msg; // keep latest of same role
    } else {
      deduped.push(msg);
    }
  }

  // Must start with user
  while (deduped.length > 0 && deduped[0].role !== "user") {
    deduped.shift();
  }

  return deduped;
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey || apiKey === "your_anthropic_api_key_here") {
    return Response.json({ error: "ANTHROPIC_API_KEY manquante." }, { status: 500 });
  }

  const body: ChatRequestBody = await req.json();
  const { messages, model = "claude-sonnet-4-6", systemPrompt } = body;

  if (!messages || messages.length === 0) {
    return Response.json({ error: "Messages requis" }, { status: 400 });
  }

  const apiMessages = buildApiMessages(messages);

  if (apiMessages.length === 0) {
    return Response.json({ error: "Aucun message valide à envoyer." }, { status: 400 });
  }

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
            const errMsg = part.error instanceof Error ? part.error.message : String(part.error);
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
