import { AGENTS } from "@/config/agents";
import { AgentChatPage } from "@/components/chat/AgentChatPage";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return AGENTS.map((agent) => ({ slug: agent.id }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const agent = AGENTS.find((a) => a.id === slug);
  if (!agent) return { title: "Agent introuvable" };
  const name = agent.persona?.name ?? agent.name;
  return {
    title: `${name} — TR7 ChatBot IA`,
    description: agent.description,
  };
}

export default async function AgentPage({ params }: Props) {
  const { slug } = await params;
  const agent = AGENTS.find((a) => a.id === slug);
  if (!agent) notFound();
  return <AgentChatPage agentId={slug as Parameters<typeof AgentChatPage>[0]["agentId"]} />;
}
