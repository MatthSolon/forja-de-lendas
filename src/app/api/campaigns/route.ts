import { db } from "@/db";
import { campaigns } from "@/db/schema";
import { defaultCampaignState } from "@/lib/types";

function makeCode(): string {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  let c = "";
  for (let i = 0; i < 5; i++) c += chars[Math.floor(Math.random() * chars.length)];
  return c;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = String(body.name ?? "").trim();
    const masterName = String(body.masterName ?? "").trim();
    if (!name || !masterName) {
      return Response.json({ error: "Nome da campanha e do mestre são obrigatórios" }, { status: 400 });
    }
    for (let attempt = 0; attempt < 5; attempt++) {
      const code = makeCode();
      try {
        const [created] = await db
          .insert(campaigns)
          .values({ code, name, masterName, state: defaultCampaignState() })
          .returning();
        return Response.json({ ok: true, code: created.code, id: created.id });
      } catch {
        // colisão de código, tenta de novo
      }
    }
    return Response.json({ error: "Não foi possível gerar código" }, { status: 500 });
  } catch {
    return Response.json({ error: "Requisição inválida" }, { status: 400 });
  }
}
