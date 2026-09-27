import { db } from "@/db";
import { characters } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const numId = parseInt(id, 10);
  if (Number.isNaN(numId)) return Response.json({ error: "ID inválido" }, { status: 400 });

  const body = await req.json();
  const allowed = [
    "name", "race", "classKey", "subclassKey", "level", "xp", "stats", "hp", "maxHp",
    "ac", "gold", "color", "equipment", "spells", "inventory", "bio",
  ];
  const updates: Record<string, unknown> = {};
  for (const key of allowed) {
    if (body[key] !== undefined) updates[key] = body[key];
  }
  if (Object.keys(updates).length === 0) return Response.json({ error: "Nada a atualizar" }, { status: 400 });

  const [updated] = await db.update(characters).set(updates).where(eq(characters.id, numId)).returning();
  if (!updated) return Response.json({ error: "Personagem não encontrado" }, { status: 404 });
  return Response.json({ ok: true, character: updated });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const numId = parseInt(id, 10);
  if (Number.isNaN(numId)) return Response.json({ error: "ID inválido" }, { status: 400 });
  await db.delete(characters).where(eq(characters.id, numId));
  return Response.json({ ok: true });
}
