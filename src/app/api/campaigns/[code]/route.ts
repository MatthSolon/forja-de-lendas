import { db } from "@/db";
import { campaigns, characters } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { defaultCampaignState, type CampaignState } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET(_req: Request, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const [camp] = await db.select().from(campaigns).where(eq(campaigns.code, code.toUpperCase()));
  if (!camp) return Response.json({ error: "Campanha não encontrada" }, { status: 404 });
  const chars = await db.select().from(characters).where(eq(characters.campaignId, camp.id)).orderBy(asc(characters.id));
  return Response.json({
    id: camp.id, code: camp.code, name: camp.name, masterName: camp.masterName,
    state: camp.state, updatedAt: camp.updatedAt, characters: chars,
  });
}

export async function PATCH(req: Request, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const [camp] = await db.select().from(campaigns).where(eq(campaigns.code, code.toUpperCase()));
  if (!camp) return Response.json({ error: "Campanha não encontrada" }, { status: 404 });

  const body = (await req.json()) as { section?: Partial<CampaignState>; log?: unknown };
  const current = { ...defaultCampaignState(), ...(camp.state as Partial<CampaignState>) } as CampaignState;

  if (body.section) {
    for (const key of ["board", "story", "combat"] as const) {
      const part = body.section[key];
      if (part && typeof part === "object") {
        current[key] = { ...current[key], ...part } as never;
      }
    }
  }
  // append de entradas de log (rolagens / eventos)
  if (Array.isArray(body.log)) {
    const incoming = body.log as CampaignState["log"];
    current.log = [...current.log, ...incoming].slice(-80);
  }

  await db.update(campaigns).set({ state: current, updatedAt: new Date() }).where(eq(campaigns.id, camp.id));
  return Response.json({ ok: true, state: current });
}
