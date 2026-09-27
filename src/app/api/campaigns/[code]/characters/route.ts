import { db } from "@/db";
import { campaigns, characters } from "@/db/schema";
import { eq } from "drizzle-orm";
import type { AbilityBlock } from "@/lib/types";

export async function POST(req: Request, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const [camp] = await db.select().from(campaigns).where(eq(campaigns.code, code.toUpperCase()));
  if (!camp) return Response.json({ error: "Campanha não encontrada" }, { status: 404 });

  try {
    const body = await req.json();
    const required = ["name", "player", "race", "classKey"];
    for (const f of required) {
      if (!body[f] || !String(body[f]).trim()) {
        return Response.json({ error: `Campo obrigatório: ${f}` }, { status: 400 });
      }
    }
    const stats = body.stats as AbilityBlock;
    const [created] = await db
      .insert(characters)
      .values({
        campaignId: camp.id,
        name: String(body.name),
        player: String(body.player),
        race: String(body.race),
        classKey: String(body.classKey),
        subclassKey: String(body.subclassKey ?? ""),
        level: 1,
        xp: 0,
        stats,
        hp: Number(body.hp),
        maxHp: Number(body.maxHp),
        ac: Number(body.ac),
        gold: Number(body.gold ?? 0),
        color: String(body.color ?? "#c9a227"),
        portrait: Number(body.portrait ?? 0),
        equipment: body.equipment ?? {},
        spells: body.spells ?? [],
        inventory: body.inventory ?? [],
        bio: String(body.bio ?? ""),
      })
      .returning();
    return Response.json({ ok: true, character: created });
  } catch (e) {
    return Response.json({ error: "Falha ao criar personagem" }, { status: 500 });
  }
}
