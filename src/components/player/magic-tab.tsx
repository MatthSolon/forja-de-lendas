"use client";

import type { CharacterRow, LogEntry } from "@/lib/types";
import { getClass } from "@/lib/data/classes";
import { getSpell, circleName } from "@/lib/data/spells";
import { getWeapon } from "@/lib/data/equipment";
import { mod, fmt, profBonus, rollDice } from "@/lib/game";
import { SPELLS } from "@/lib/data/spells";
import { Sparkles, Wand2, Zap, BookOpen } from "lucide-react";

type LogInput = Omit<LogEntry, "id" | "ts">;

export default function MagicTab({ char, appendLog }: { char: CharacterRow; appendLog: (e: LogInput[]) => void }) {
  const cls = getClass(char.classKey);
  const known = char.spells.map((id) => getSpell(id) ?? SPELLS.find((s) => s.id === id)).filter(Boolean);
  const spellAbility = cls.spellAbility ?? "cha";
  const atkMod = profBonus(char.level) + mod(char.stats[spellAbility]);

  function rollFor(text: string, expr: string) {
    const r = rollDice(expr);
    appendLog([{ who: char.name, kind: "roll", text: `${text}: ${expr} = ${r.total}`, detail: r.detail }]);
  }

  const circles = [...new Set(known.map((s) => s!.lvl))].sort((a, b) => a - b);

  return (
    <div className="space-y-4">
      {/* MAGIAS */}
      <div className="panel p-5">
        <h3 className="font-display text-xs tracking-[0.25em] text-gold-500 mb-3 flex items-center gap-2">
          <Wand2 className="w-4 h-4" /> GRIMÓRIO {cls.caster ? `· Ataque mágico ${fmt(atkMod)}` : ""}
        </h3>
        {!cls.caster && (
          <p className="text-parch-dim italic text-sm">Esta classe não conjura magias — mas seus combos abaixo são lendários.</p>
        )}
        {cls.caster && known.length === 0 && (
          <p className="text-parch-dim italic text-sm">
            {cls.caster === "half" ? `${cls.name} aprende magias a partir do nível 2. Aguarde o mestre conceder XP!` : "Nenhuma magia conhecida ainda."}
          </p>
        )}
        {circles.map((lvl) => (
          <div key={lvl} className="mb-4">
            <p className="font-display text-[11px] tracking-[0.3em] text-purple-300 mb-2">{circleName(lvl).toUpperCase()}</p>
            <div className="grid md:grid-cols-2 gap-2">
              {known.filter((s) => s!.lvl === lvl).map((s) => (
                <div key={s!.id} className="panel-inset p-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-display font-bold text-parch">{s!.name}</span>
                    <span className="text-[10px] text-purple-300/80 font-display">{s!.school}</span>
                  </div>
                  <p className="text-parch-dim/80 text-sm mt-1 leading-snug">{s!.desc}</p>
                  <p className="text-[10px] text-parch-dim/50 mt-1">{s!.time} · {s!.range}</p>
                  <div className="flex gap-2 mt-2">
                    {(s!.desc.includes("salvaguarda") || s!.dmg) && <span className="text-[10px] text-parch-dim/60 italic self-center">CD {8 + atkMod} contra resistência</span>}
                    {s!.dmg && (
                      <button onClick={() => rollFor(s!.name, s!.dmg!)} className="ml-auto btn-ghost !py-1 !px-2.5 text-[11px]">
                        <Zap className="w-3 h-3" /> {s!.dmg}
                      </button>
                    )}
                    {!s!.dmg && /ataque|raio|toque/i.test(s!.desc) && (
                      <button onClick={() => rollFor(`Conjurar ${s!.name}`, `1d20${fmt(atkMod)}`)} className="ml-auto btn-ghost !py-1 !px-2.5 text-[11px]">
                        Acertar {fmt(atkMod)}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* COMBOS */}
      <div className="panel p-5">
        <h3 className="font-display text-xs tracking-[0.25em] text-gold-500 mb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4" /> COMBOS DE {cls.name.toUpperCase()}
        </h3>
        <div className="grid md:grid-cols-3 gap-3">
          {cls.combos.map((combo) => (
            <div key={combo.name} className="panel-inset p-4 flex flex-col">
              <p className="font-display font-bold text-parch leading-tight">{combo.name}</p>
              <p className="text-[10px] text-blood-400 font-display mt-0.5">EXIGE: {combo.req.toUpperCase()}</p>
              <p className="text-parch-dim/80 text-sm mt-1.5 leading-snug flex-1">{combo.desc}</p>
              <button
                onClick={() => {
                  const weapon = getWeapon(char.equipment.weapon);
                  const entries = combo.rolls.map((r) => {
                    const expr = /\d+d\d+/.test(r.expr) ? r.expr : `1d20`;
                    const res = rollDice(expr);
                    return {
                      who: char.name, kind: "roll" as const,
                      text: `${combo.name} — ${r.label}: ${expr} = ${res.total}`,
                      detail: res.detail,
                    };
                  });
                  appendLog([{ who: char.name, kind: "event", text: `desencadeia o combo "${combo.name}"${weapon ? ` com ${weapon.name}` : ""}!` }, ...entries]);
                }}
                className="btn-gold !py-1.5 text-xs mt-3">
                <Zap className="w-3.5 h-3.5" /> Executar Combo
              </button>
            </div>
          ))}
        </div>
      </div>

      {cls.caster && (
        <div className="panel p-4 text-xs text-parch-dim/70 flex items-start gap-2">
          <BookOpen className="w-4 h-4 text-gold-500 shrink-0 mt-0.5" />
          <p>Espaços de magia seguem a tabela clássica: conjurador completo recupera tudo em descanso longo; bruxo recupera em descanso curto mas tem poucos espaços; combine com o mestre. CD das suas magias: <span className="text-gold-300 font-bold">{8 + atkMod}</span>.</p>
        </div>
      )}
    </div>
  );
}
