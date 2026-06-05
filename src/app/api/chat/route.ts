import { anthropic } from "@ai-sdk/anthropic";
import { openai } from "@ai-sdk/openai";
import { google } from "@ai-sdk/google";
import { streamText } from "ai";
import { NextRequest } from "next/server";
import { AIModel, Attachment, MODELS } from "@/types/chat";

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

function getModelInstance(modelId: AIModel) {
  const config = MODELS.find((m) => m.id === modelId);
  switch (config?.provider) {
    case "openai":  return openai(modelId);
    case "google":  return google(modelId);
    default:        return anthropic(modelId);
  }
}

function buildApiMessages(messages: ChatRequestBody["messages"]): ApiMessage[] {
  const result: ApiMessage[] = [];

  for (const msg of messages) {
    const hasText = msg.content.trim().length > 0;
    const hasAttachments = msg.attachments && msg.attachments.length > 0;

    if (!hasText && !hasAttachments) continue;
    if (msg.role === "assistant" && msg.content.trim().startsWith("⚠️")) continue;
    if (msg.role === "assistant" && msg.content.trim() === "_Génération arrêtée._") continue;

    if (!hasAttachments) {
      result.push({ role: msg.role, content: msg.content.trim() });
      continue;
    }

    const parts: ApiMessageContent[] = [];
    if (hasText) parts.push({ type: "text", text: msg.content.trim() });
    for (const att of msg.attachments!) {
      if (att.type === "image") {
        parts.push({ type: "image", image: att.base64, mimeType: att.mimeType });
      } else if (att.type === "document") {
        parts.push({ type: "file", data: att.base64, mimeType: att.mimeType, filename: att.name });
      }
    }
    if (parts.length > 0) result.push({ role: msg.role, content: parts });
  }

  // Alternance stricte user/assistant
  const deduped: ApiMessage[] = [];
  for (const msg of result) {
    const last = deduped[deduped.length - 1];
    if (last && last.role === msg.role) {
      deduped[deduped.length - 1] = msg;
    } else {
      deduped.push(msg);
    }
  }
  while (deduped.length > 0 && deduped[0].role !== "user") deduped.shift();

  return deduped;
}

export async function POST(req: NextRequest) {
  const body: ChatRequestBody = await req.json();
  const { messages, model = "claude-sonnet-4-6", systemPrompt } = body;

  const modelConfig = MODELS.find((m) => m.id === model);
  const provider = modelConfig?.provider ?? "anthropic";

  // Validation des clés API par provider
  if (provider === "anthropic") {
    const key = process.env.ANTHROPIC_API_KEY;
    if (!key || key === "your_anthropic_api_key_here") {
      return Response.json({ error: "ANTHROPIC_API_KEY manquante." }, { status: 500 });
    }
  } else if (provider === "openai") {
    const key = process.env.OPENAI_API_KEY;
    if (!key || key === "your_openai_api_key_here") {
      return Response.json({ error: "OPENAI_API_KEY manquante." }, { status: 500 });
    }
  } else if (provider === "google") {
    const key = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!key || key === "your_google_api_key_here") {
      return Response.json({ error: "GOOGLE_GENERATIVE_AI_API_KEY manquante." }, { status: 500 });
    }
  }

  if (!messages || messages.length === 0) {
    return Response.json({ error: "Messages requis." }, { status: 400 });
  }

  const apiMessages = buildApiMessages(messages);
  if (apiMessages.length === 0) {
    return Response.json({ error: "Aucun message valide." }, { status: 400 });
  }

  // Les modèles o1/o1-mini ne supportent pas system prompt ni temperature
  const isReasoningModel = model === "o1" || model === "o1-mini";

  const result = streamText({
    model: getModelInstance(model),
    ...(isReasoningModel ? {} : { system: systemPrompt, temperature: 0.7 }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    messages: apiMessages as any,
    maxOutputTokens: isReasoningModel ? 8192 : 4096,
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
