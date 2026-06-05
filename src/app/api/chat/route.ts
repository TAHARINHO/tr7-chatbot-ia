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
      { error: "ANTHROPIC_API_KEY manquante. Configurez-la dans .env.local ou dans les variables Vercel." },
      { status: 500 }
    );
  }

  const body: ChatRequestBody = await req.json();
  const { messages, model = "claude-sonnet-4-6", systemPrompt } = body;

  if (!messages || messages.length === 0) {
    return Response.json({ error: "Messages requis" }, { status: 400 });
  }

  try {
    const result = streamText({
      model: anthropic(model),
      system: systemPrompt,
      messages,
      maxOutputTokens: 4096,
      temperature: 0.7,
    });

    return result.toTextStreamResponse();
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Erreur interne du serveur";

    // Crédit insuffisant
    if (message.includes("credit balance")) {
      return Response.json(
        { error: "Crédits Anthropic insuffisants. Rechargez sur console.anthropic.com/settings/plans" },
        { status: 402 }
      );
    }
    // Clé invalide
    if (message.includes("invalid") || message.includes("auth")) {
      return Response.json(
        { error: "Clé API invalide. Vérifiez ANTHROPIC_API_KEY." },
        { status: 401 }
      );
    }

    return Response.json({ error: message }, { status: 500 });
  }
}
