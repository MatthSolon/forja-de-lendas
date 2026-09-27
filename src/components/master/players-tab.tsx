"use client";

import { useState } from "react";
import { RACES } from "@/lib/data/races";
import { getClass, getSubclass } from "@/lib/data/classes";
import { XP_TABLE, nextLevelXp } from "@/lib/game";
import { spriteStyle } from "@/lib/art";
import type { TabProps } from "./master-client";
import { Users, Trash2, Coins, Shield, Plus, Sparkles } from "lucide-react";

export default function PlayersTab({ data, awardXp, refresh }: TabProps) {
  const [xpAll, setXpAll] = useState("300");
  const [confirm, setConfirm] = useState<number | null>(null);

  async function patchChar(id: number, updates: Record<string, unknown>) {
    await fetch(`/api/characters/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    await refresh();
  }

  async function removeChar(id: number) {
    await fetch(`/api/characters/${id}`, { method: "DELETE" });
    setConfirm(null);
    await refresh();
  }

  return (
    <div className="space-y-4">
      <div className="panel p-4 flex flex-wrap items-center gap-3">
        <h3 className="font-display font-bold text-parch flex items-center gap-2">
          <Users className="w-5 h-5 text-gold-400" /> Heróis da Campanha ({data.characters.length})
        </h3>
        <div className="ml-auto flex items-center gap-2">
          <input value={xpAll} onChange={(e) => setXpAll(e.target.value.replace(/\D/g, ""))} placeholder="XP"
            className="input-fantasy !py-1.5 !px-3 w-24 text-center text-sm" />
          <button onClick={() => awardXp(parseInt(xpAll) || 0, "Recompensa do mestre")}
            className="btn-gold !py-1.5 !px-4 text-xs"><Sparkles className="w-3.5 h-3.5" /> XP p/ todos</button>
        </div>
      </div>

      {data.characters.length === 0 && (
        <div className="panel p-12 text-center">
          <Users className="w-12 h-12 text-gold-500/40 mx-auto mb-4" />
          <p className="text-parch-dim italic">Nenhum herói sentou à mesa ainda. Compartilhe o código da campanha!</p>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {data.characters.map((c) => {
          const race = RACES.find((r) => r.key === c.race);
          const cls = getClass(c.classKey);
          const sub = getSubclass(c.classKey, c.subclassKey);
          const next = nextLevelXp(c.level);
          const prev = XP_TABLE[c.level - 1];
          const pct = next ? Math.min(100, ((c.xp - prev) / (next - prev)) * 100) : 100;
          return (
            <div key={c.id} className="panel p-5 space-y-3">
              <div className="flex items-start gap-3">
                <span className="w-12 h-12 rounded-xl border-2 overflow-hidden bg-cover shrink-0"
                  style={{ borderColor: c.color, ...spriteStyle("classes", c.portrait ?? 0) }} />
                <div className="min-w-0 flex-1">
                  <h4 className="font-display font-bold text-parch leading-tight truncate">{c.name}</h4>
                  <p className="text-xs text-parch-dim">{race?.name ?? c.race} · {cls.name}{sub ? ` (${sub.name})` : ""} · por {c.player}</p>
                </div>
                <div className="stat-chip"><span className="text-[9px] text-parch-dim/60 font-display">NÍVEL</span><span className="font-display font-black text-gold-300 text-lg">{c.level}</span></div>
              </div>

              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1.5 text-parch-dim"><Shield className="w-4 h-4 text-gold-400" /> CA {c.ac}</span>
                <span className="flex items-center gap-1.5 text-parch-dim"><Coins className="w-4 h-4 text-gold-400" /> {c.gold} po</span>
                <span className="ml-auto text-xs text-parch-dim/70">{c.xp.toLocaleString("pt-BR")} XP {next ? `/ ${next.toLocaleString("pt-BR")}` : "(máx)"}</span>
              </div>
              <div className="hp-bar !h-2"><div className="hp-fill" style={{ width: `${pct}%`, background: "linear-gradient(90deg,#6f5914,#e0b64c)" }} /></div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-parch-dim/70 font-display whitespace-nowrap">PV</span>
                <button onClick={() => patchChar(c.id, { hp: Math.max(0, c.hp - 1) })} className="btn-ghost !p-1.5">-1</button>
                <div className="hp-bar flex-1">
                  <div className="hp-fill" style={{
                    width: `${(c.hp / c.maxHp) * 100}%`,
                    background: c.hp / c.maxHp > 0.5 ? "linear-gradient(90deg,#4a8a4f,#6a9a4a)" : c.hp / c.maxHp > 0.25 ? "linear-gradient(90deg,#a07f1c,#e0b64c)" : "linear-gradient(90deg,#7e2d2d,#c0534b)",
                  }} />
                </div>
                <span className="text-xs text-parch font-mono w-16 text-center">{c.hp}/{c.maxHp}</span>
                <button onClick={() => patchChar(c.id, { hp: Math.min(c.maxHp, c.hp + 1) })} className="btn-ghost !p-1.5">+1</button>
                <button onClick={() => patchChar(c.id, { hp: c.maxHp })} className="btn-ghost !p-1.5 text-emerald-400" title="Cura completa"><Plus className="w-3.5 h-3.5" /></button>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button onClick={() => awardXp(500, `Sessão heroica de ${c.name}`, [c.id])}
                  className="btn-ghost !py-1.5 !px-3 text-xs flex-1"><Sparkles className="w-3.5 h-3.5" /> +500 XP individual</button>
                {confirm === c.id ? (
                  <button onClick={() => removeChar(c.id)} className="btn-ghost !py-1.5 !px-3 text-xs text-blood-400 !border-blood-600/50">Confirmar?</button>
                ) : (
                  <button onClick={() => setConfirm(c.id)} className="btn-ghost !py-1.5 !px-3 text-xs hover:text-blood-400"><Trash2 className="w-3.5 h-3.5" /></button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
