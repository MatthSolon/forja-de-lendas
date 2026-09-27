import MasterClient from "@/components/master/master-client";

export const dynamic = "force-dynamic";

export default async function MestrePage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  return <MasterClient code={code.toUpperCase()} />;
}
