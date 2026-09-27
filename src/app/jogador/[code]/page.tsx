import PlayerClient from "@/components/player/player-client";

export const dynamic = "force-dynamic";

export default async function JogadorPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  return <PlayerClient code={code.toUpperCase()} />;
}
