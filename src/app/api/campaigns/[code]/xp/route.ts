import { db } from "@/db";
import { campaigns, characters } from "@/db/schema";
import { eq } from "drizzle-orm";
import { levelForXp } from "@/lib/game";
import { getClass } from "@/lib/data/classes";
import { mod } from "@/lib/game";
import type { AbilityBlock } from "@/lib/types";

// Concede XP a personagens e processa level-ups automaticamente (regras D&D)
export async function POST(req: Request, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const [camp] = await db.select().from(campaigns).where(eq(campaigns.code, code.toUpperCase()));
  if (!camp) return Response.json({ error: "Campanha não encontrada" }, { status: 404 });

  const body = await req.json();
  const amount = Math.max(0, parseInt(String(body.amount), 10) || 0);
  const ids: number[] | undefined = Array.isArray(body.characterIds) ? body.characterIds : undefined;
  const reason = String(body.reason ?? "Recompensa");
  if (amount <= 0) return Response.json({ error: "XP inválido" }, { status: 400 });

  let targets = await db.select().from(characters).where(eq(characters.campaignId, camp.id));
  if (ids && ids.length) targets = targets.filter((c) => ids.includes(c.id));
  if (!targets.length) return Response.json({ error: "Sem personagens" }, { status: 400 });

  const results: { name: string; leveledUp: boolean; newLevel: number }[] = [];

  for (const ch of targets) {
    const newXp = ch.xp + amount;
    const newLevel = levelForXp(newXp);
    let newMaxHp = ch.maxHp;
    let newHp = ch.hp;
    if (newLevel > ch.level) {
      const cls = getClass(ch.classKey);
      const stats = ch.stats as AbilityBlock;
      const conMod = mod(stats.con);
      let gain = 0;
      for (let l = ch.level; l < newLevel; l++) {
        gain += Math.max(1, Math.floor(cls.hitDie / 2) + 1 + conMod); // média do dado + CON
      }
      newMaxHp = ch.maxHp + gain;
      newHp = Math.min(newMaxHp, ch.hp + gain);
    }
    await db.update(characters).set({ xp: newXp, level: newLevel, maxHp: newMaxHp, hp: newHp }).where(eq(characters.id, ch.id));
    results.push({ name: ch.name, leveledUp: newLevel > ch.level, newLevel });
  }
  void reason;
  return Response.json({ ok: true, results });
}
