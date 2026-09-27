"use client";

import { useState } from "react";
import type { CombatState, Combatant } from "@/lib/types";
import { uid, rollDice } from "@/lib/game";
import { monsterArtIndex, monsterKeyFromRef, spriteStyle } from "@/lib/art";
import TokenAvatar from "@/components/token-art";
import type { TabProps } from "./master-client";
import {
  Swords, Play, Plus, Minus, X, SkipForward, Users, Flag, Download,
} from "lucide-react";

export default function CombatTab({ data, patchSection, appendLog }: TabProps) {
  const combat = data.state.combat;
  const [initMode, setInitMode] = useState(false);

  function push(c: CombatState) {
    patchSection({ combat: c });
  }

  function addPlayers() {
    const existing = new Set(combat.combatants.map((c) => c.refId));
    const additions: Combatant[] = data.characters
      .filter((ch) => !existing.has(String(ch.id)))
      .map((ch) => ({
        id: uid(), name: ch.name, init: 0, hp: ch.hp, maxHp: ch.maxHp, ac: ch.ac,
        kind: "player" as const, refId: String(ch.id), color: ch.color, conditions: [],
      }));
    if (additions.length) push({ ...combat, combatants: [...combat.combatants, ...additions] });
  }

  function rollAllInit() {
    const rolled = combat.combatants.map((c) => ({ ...c, init: c.init === 0 ? Math.ceil(Math.random() * 20) : c.init }));
    const sorted = [...rolled].sort((a, b) => b.init - a.init);
    push({ ...combat, combatants: sorted, active: true, turn: 0, round: 1 });
    appendLog([{ who: "Mestre", kind: "event", text: `Iniciativa rolada — a batalha começa! (${sorted.length} combatentes)` }]);
    setInitMode(false);
  }

  function nextTurn() {
    const n = combat.combatants.length;
    if (!n) return;
    let turn = combat.turn + 1;
    let round = combat.round;
    if (turn >= n) { turn = 0; round += 1; }
    push({ ...combat, turn, round });
  }

  function setInit(id: string, v: number) {
    const updated = combat.combatants.map((c) => (c.id === id ? { ...c, init: v } : c));
    push({ ...combat, combatants: updated });
  }

  function sortNow() {
    push({ ...combat, combatants: [...combat.combatants].sort((a, b) => b.init - a.init) });
  }

  function damage(id: string, delta: number) {
    push({
      ...combat,
      combatants: combat.combatants.map((c) =>
        c.id === id ? { ...c, hp: Math.max(0, Math.min(c.maxHp, c.hp + delta)) } : c
      ),
    });
  }

  function remove(id: string) {
    const rest = combat.combatants.filter((c) => c.id !== id);
    push({ ...combat, combatants: rest, turn: Math.min(combat.turn, Math.max(0, rest.length - 1)) });
  }

  function endCombat() {
    push({ active: false, round: 1, turn: 0, combatants: combat.combatants });
    appendLog([{ who: "Mestre", kind: "event", text: `Combate encerrado após ${combat.round} rodada(s).` }]);
  }

  const current = combat.active ? combat.combatants[combat.turn] : null;

  return (
    <div className="space-y-4">
      <div className="panel p-4 flex flex-wrap items-center gap-2">
        <h3 className="font-display font-bold text-parch flex items-center gap-2 mr-2">
          <Swords className="w-5 h-5 text-gold-400" /> Rastreador de Combate
        </h3>
        <button onClick={addPlayers} className="btn-ghost !py-1.5 !px-3 text-xs"><Users className="w-3.5 h-3.5" /> Heróis</button>
        <span className="text-parch-dim/50 text-xs italic">monstros entram pelo Bestiário →</span>
        <div className="ml-auto flex gap-2">
          {!combat.active ? (
            <button onClick={() => setInitMode(true)} disabled={!combat.combatants.length}
              className="btn-gold !py-1.5 !px-4 text-xs disabled:opacity-40">
              <Play className="w-3.5 h-3.5" /> Iniciar Combate
            </button>
          ) : (
            <>
              <button onClick={nextTurn} className="btn-gold !py-1.5 !px-4 text-xs"><SkipForward className="w-3.5 h-3.5" /> Próximo Turno</button>
              <button onClick={endCombat} className="btn-ghost !py-1.5 !px-3 text-xs hover:text-blood-400"><Flag className="w-3.5 h-3.5" /> Encerrar</button>
            </>
          )}
        </div>
      </div>

      {initMode && (
        <div className="panel p-4 space-y-3">
          <p className="text-parch-dim text-sm">Defina as iniciativas (d20 + DES) ou role automaticamente:</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {combat.combatants.map((c) => (
              <div key={c.id} className="panel-inset px-3 py-2 flex items-center gap-2">
                <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: c.color }} />
                <span className="text-sm text-parch truncate flex-1">{c.name}</span>
                <input type="number" value={c.init || ""} placeholder="d20"
                  onChange={(e) => setInit(c.id, parseInt(e.target.value) || 0)}
                  className="input-fantasy !py-1 !px-2 w-16 text-center text-sm" />
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={rollAllInit}
              onMouseEnter={() => combat.combatants.forEach((c) => { if (c.init === 0) setInit(c.id, rollDice("1d20").total); })}
              className="btn-gold !py-2 text-xs flex-1">Rolar vazios e começar</button>
            <button onClick={() => { sortNow(); setInitMode(false); push({ ...combat, active: true, turn: 0, round: 1 }); }}
              className="btn-ghost !py-2 text-xs flex-1">Começar com valores atuais</button>
          </div>
        </div>
      )}

      {combat.active && current && (
        <div className="panel p-4 gold-border-glow">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-display text-[10px] tracking-[0.3em] text-gold-500">RODADA {combat.round} · TURNO ATUAL</p>
              <p className="font-display font-black text-2xl gold-text">{current.name}</p>
            </div>
            <div className="text-right text-sm text-parch-dim">
              <p>Iniciativa <span className="text-gold-300 font-bold">{current.init}</span></p>
              <p>PV {current.hp}/{current.maxHp} · CA {current.ac}</p>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {combat.combatants.length === 0 && (
          <div className="panel p-10 text-center text-parch-dim/60 italic text-sm">
            Nenhum combatente em cena. Adicione os heróis acima e monstros pelo Bestiário.
          </div>
        )}
        {combat.combatants.map((c, i) => {
          const isActive = combat.active && i === combat.turn;
          const hpPct = c.maxHp ? c.hp / c.maxHp : 0;
          const charRow = c.kind === "player" ? data.characters.find((ch) => String(ch.id) === c.refId) : undefined;
          const mKey = c.kind === "monster" ? monsterKeyFromRef(c.refId ?? undefined) : null;
          const mIdx = mKey ? monsterArtIndex(mKey) : null;
          const portrait = charRow
            ? spriteStyle("classes", charRow.portrait ?? 0)
            : mIdx != null
              ? spriteStyle("monsters", mIdx)
              : null;
          return (
            <div key={c.id}
              className={`panel p-3 flex items-center gap-3 transition-all ${isActive ? "gold-border-glow !border-gold-400/70" : "opacity-90"}`}>
              <span className={`font-display font-bold text-lg w-8 text-center ${isActive ? "text-gold-300" : "text-parch-dim/60"}`}>{c.init || "–"}</span>
              <div className="w-11 h-11 shrink-0 relative">
                <TokenAvatar name={c.name} color={c.color} kind={c.kind === "npc" ? "npc" : c.kind} portrait={portrait} hp={c.hp} maxHp={c.maxHp} active={isActive} initialsFontSize="12px" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className={`font-display font-bold truncate ${isActive ? "text-gold-200" : "text-parch"}`}>{c.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded border ${
                    c.kind === "monster" ? "border-blood-500/40 text-blood-400" : "border-emerald-500/40 text-emerald-400"}`}>
                    {c.kind === "monster" ? "MONSTRO" : "HERÓI"}
                  </span>
                  <span className="text-[11px] text-parch-dim/70">CA {c.ac}</span>
                </div>
                <div className="hp-bar mt-1.5">
                  <div className="hp-fill" style={{
                    width: `${Math.max(0, Math.min(100, hpPct * 100))}%`,
                    background: hpPct > 0.5 ? "linear-gradient(90deg,#4a8a4f,#6a9a4a)" : hpPct > 0.25 ? "linear-gradient(90deg,#a07f1c,#e0b64c)" : "linear-gradient(90deg,#7e2d2d,#c0534b)",
                  }} />
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <button onClick={() => damage(c.id, -1)} className="btn-ghost !p-1.5 text-blood-400" title="-1 PV"><Minus className="w-3.5 h-3.5" /></button>
                <input type="number" value={c.hp} onChange={(e) => push({ ...combat, combatants: combat.combatants.map((x) => x.id === c.id ? { ...x, hp: Math.max(0, parseInt(e.target.value) || 0) } : x) })}
                  className="input-fantasy !py-1 !px-2 w-16 text-center text-sm" />
                <span className="text-parch-dim/50 text-xs">/ {c.maxHp}</span>
                <button onClick={() => damage(c.id, 1)} className="btn-ghost !p-1.5 text-emerald-400" title="+1 PV"><Plus className="w-3.5 h-3.5" /></button>
                <button onClick={() => remove(c.id)} className="btn-ghost !p-1.5 text-parch-dim hover:text-blood-400" title="Remover"><X className="w-3.5 h-3.5" /></button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="panel p-4 text-xs text-parch-dim/70 flex items-center gap-2">
        <Download className="w-4 h-4 text-gold-500" />
        Jogadores acompanham o tabuleiro nas próprias telas; o turno atual fica destacado para todos.
      </div>
    </div>
  );
}
