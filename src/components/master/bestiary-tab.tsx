"use client";

import { useMemo, useState } from "react";
import { MONSTERS, ENVIRONMENTS, type MonsterDef } from "@/lib/data/monsters";
import { scaleMonster, fmt, mod, encounterDifficulty } from "@/lib/game";
import { uid } from "@/lib/game";
import type { TabProps } from "./master-client";
import { Search, Crown, Swords, MapPin, Sparkles, Skull } from "lucide-react";

const CR_STEPS = [0, 0.125, 0.25, 0.5, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

function crLabel(cr: number): string {
  if (cr === 0.125) return "1/8";
  if (cr === 0.25) return "1/4";
  if (cr === 0.5) return "1/2";
  return String(cr);
}

export default function BestiaryTab({ data, patchSection, appendLog }: TabProps) {
  const [query, setQuery] = useState("");
  const [env, setEnv] = useState<string | null>(null);
  const [bossOnly, setBossOnly] = useState(false);
  const [selected, setSelected] = useState<string>(MONSTERS[0].key);
  const [crIdx, setCrIdx] = useState<number>(CR_STEPS.indexOf(1));

  const monsters = useMemo(
    () =>
      MONSTERS.filter(
        (m) =>
          (!query || m.name.toLowerCase().includes(query.toLowerCase()) || m.type.toLowerCase().includes(query.toLowerCase())) &&
          (!env || m.env.includes(env)) &&
          (!bossOnly || m.boss)
      ),
    [query, env, bossOnly]
  );

  const base: MonsterDef = MONSTERS.find((m) => m.key === selected) ?? MONSTERS[0];
  const scaled = scaleMonster(base, CR_STEPS[crIdx]);
  const party = data.characters;
  const avgLevel = party.length ? Math.round(party.reduce((a, c) => a + c.level, 0) / party.length) : 1;
  const diff = party.length ? encounterDifficulty(scaled.xp, party.length, avgLevel) : null;

  function selectMonster(m: MonsterDef) {
    setSelected(m.key);
    setCrIdx(CR_STEPS.indexOf(CR_STEPS.includes(m.cr) ? m.cr : 1));
  }

  function addToCombat() {
    const combat = { ...data.state.combat, combatants: [...data.state.combat.combatants] };
    combat.combatants.push({
      id: uid(), name: scaled.name, init: 0, hp: scaled.hp, maxHp: scaled.hp, ac: scaled.ac,
      kind: "monster", refId: `${scaled.key}@${scaled.cr}`, color: "#a33a3a", conditions: [],
    });
    patchSection({ combat });
    appendLog([{ who: "Mestre", kind: "event", text: `${scaled.name} (ND ${crLabel(scaled.cr)}) entra em cena! PV ${scaled.hp}, CA ${scaled.ac}.` }]);
  }

  function addToBoard() {
    const board = { ...data.state.board, tokens: [...data.state.board.tokens] };
    board.tokens.push({
      id: uid(), kind: "monster", name: scaled.name, color: "#a33a3a",
      x: Math.floor(board.width / 2), y: Math.floor(board.height / 2),
      size: ["Grande", "Enorme", "Colossal"].includes(scaled.size) ? Math.min(4, ["Grande", "Enorme", "Colossal"].indexOf(scaled.size) + 2) : 1,
      refId: `${scaled.key}@${scaled.cr}`, hp: scaled.hp, maxHp: scaled.hp,
    });
    patchSection({ board });
    appendLog([{ who: "Mestre", kind: "event", text: `${scaled.name} foi posicionado no tabuleiro.` }]);
  }

  return (
    <div className="grid xl:grid-cols-[minmax(280px,380px)_1fr] gap-4">
      {/* LISTA */}
      <div className="panel p-4 space-y-3 self-start">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-parch-dim/50" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar criatura..."
            className="input-fantasy !pl-9 !py-2 text-sm" />
        </div>
        <div className="flex items-center gap-2">
          <select value={env ?? ""} onChange={(e) => setEnv(e.target.value || null)} className="input-fantasy !py-2 text-sm flex-1">
            <option value="">Todos os habitats</option>
            {ENVIRONMENTS.map((e) => <option key={e.key} value={e.key}>{e.name}</option>)}
          </select>
          <button onClick={() => setBossOnly((b) => !b)}
            className={`btn-ghost !py-2 !px-3 text-xs whitespace-nowrap ${bossOnly ? "!border-gold-400 !bg-gold-500/15 text-gold-300" : ""}`}>
            <Crown className="w-3.5 h-3.5" /> Bosses
          </button>
        </div>
        <div className="space-y-1 max-h-[52vh] overflow-y-auto pr-1">
          {monsters.map((m) => (
            <button key={m.key} onClick={() => selectMonster(m)}
              className={`w-full text-left px-3 py-2 rounded-lg border transition-all cursor-pointer flex items-center gap-2 ${
                selected === m.key ? "border-gold-400/70 bg-gold-500/10" : "border-transparent hover:bg-gold-500/5 hover:border-gold-500/20"
              }`}>
              <span className={`w-8 h-8 rounded-lg flex items-center justify-center font-display font-black text-xs shrink-0 ${
                m.boss ? "bg-blood-600/30 text-blood-400 border border-blood-500/40" : "bg-ink-700 text-gold-400 border border-gold-500/20"
              }`}>
                {m.boss ? <Crown className="w-3.5 h-3.5" /> : crLabel(m.cr)}
              </span>
              <span className="min-w-0">
                <span className="block text-sm text-parch truncate">{m.name}</span>
                <span className="block text-[10px] text-parch-dim/60">{m.size} · {m.type}</span>
              </span>
            </button>
          ))}
          {!monsters.length && <p className="text-parch-dim/50 text-sm italic text-center py-6">Nenhuma criatura encontrada.</p>}
        </div>
      </div>

      {/* DETALHE */}
      <div className="space-y-4">
        <div className="panel p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="font-display font-black text-2xl gold-text leading-tight">{scaled.name}</h3>
              <p className="text-parch-dim text-sm">{scaled.size} · {scaled.type} {scaled.boss && <span className="text-blood-400 font-display">· BOSS LENDÁRIO</span>}</p>
            </div>
            <div className="stat-chip"><span className="text-[10px] text-parch-dim/60 font-display">XP</span><span className="font-display font-bold text-gold-300">{scaled.xp.toLocaleString("pt-BR")}</span></div>
          </div>

          {/* ESCALADOR */}
          <div className="mt-5 panel-inset p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="font-display text-xs tracking-[0.25em] text-gold-500 flex items-center gap-2"><Sparkles className="w-3.5 h-3.5" /> ESCALAR NÍVEL DE DESAFIO</span>
              <span className="font-display font-black text-xl text-gold-300">ND {crLabel(scaled.cr)}</span>
            </div>
            <input type="range" min={0} max={CR_STEPS.length - 1} value={crIdx} onChange={(e) => setCrIdx(parseInt(e.target.value))}
              className="w-full accent-[#c9a227] cursor-pointer" />
            <div className="flex justify-between text-[10px] text-parch-dim/50 font-display">
              <span>ND 0</span><span>ND 5</span><span>ND 10</span><span>ND 15</span><span>ND 20</span>
            </div>
            {scaled.scaled && <p className="text-[11px] text-purple-300/80 italic mt-2">Criatura {scaled.cr > scaled.baseCr ? "potencializada" : "enfraquecida"} a partir de ND {crLabel(scaled.baseCr)}.</p>}
            {diff && <p className="text-xs mt-2">Encontro contra o grupo atual ({party.length} heróis, nvl médio {avgLevel}): <span className={`font-bold ${diff.color}`}>{diff.label}</span></p>}
          </div>

          <div className="grid grid-cols-3 gap-2 mt-4">
            <div className="stat-chip"><span className="text-[10px] text-parch-dim/60 font-display">PV</span><span className="font-display font-bold text-lg text-blood-400">{scaled.hp}</span></div>
            <div className="stat-chip"><span className="text-[10px] text-parch-dim/60 font-display">CA</span><span className="font-display font-bold text-lg text-parch">{scaled.ac}</span></div>
            <div className="stat-chip"><span className="text-[10px] text-parch-dim/60 font-display">DESL.</span><span className="font-display font-bold text-sm text-parch mt-1">{scaled.speed}</span></div>
          </div>

          <div className="grid grid-cols-6 gap-1.5 mt-3">
            {(["str", "dex", "con", "int", "wis", "cha"] as const).map((k) => (
              <div key={k} className="stat-chip !min-w-0 !p-1.5">
                <span className="text-[9px] text-gold-500 font-display">{k.toUpperCase()}</span>
                <span className="font-bold text-parch text-sm">{scaled.stats[k]}</span>
                <span className="text-[10px] text-parch-dim/60">{fmt(mod(scaled.stats[k]))}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 space-y-2">
            <h4 className="font-display text-xs tracking-[0.25em] text-gold-500">ATAQUES</h4>
            {scaled.attacks.map((a, i) => (
              <div key={i} className="flex items-center gap-3 text-sm bg-ink-800/60 rounded-lg px-3 py-2 border border-gold-500/10">
                <Swords className="w-4 h-4 text-blood-400 shrink-0" />
                <span className="text-parch font-semibold">{a.name}</span>
                {a.bonus > 0 && <span className="text-gold-300 font-mono text-xs">{fmt(a.bonus)} p/ atingir</span>}
                <span className="ml-auto font-mono text-xs text-parch-dim">
                  {a.damage !== "0" ? a.damage : ""}{a.extra ? ` · ${a.extra}` : ""}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4">
            <h4 className="font-display text-xs tracking-[0.25em] text-gold-500 mb-2">CARACTERÍSTICAS</h4>
            <ul className="space-y-1">
              {scaled.traits.map((t, i) => <li key={i} className="text-sm text-parch-dim flex gap-2"><span className="text-gold-500">◆</span>{t}</li>)}
            </ul>
          </div>

          {scaled.phases && (
            <div className="mt-4">
              <h4 className="font-display text-xs tracking-[0.25em] text-blood-400 mb-2">FASES DO BOSS</h4>
              <div className="space-y-1.5">
                {scaled.phases.map((p, i) => (
                  <div key={i} className="text-sm bg-blood-600/10 border border-blood-600/25 rounded-lg px-3 py-2">
                    <span className="font-display text-blood-400 text-xs mr-2">{p.at}</span>
                    <span className="text-parch-dim">{p.text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {scaled.legendary && (
            <div className="mt-4">
              <h4 className="font-display text-xs tracking-[0.25em] text-gold-500 mb-2">AÇÕES LENDÁRIAS (3/rodada)</h4>
              <ul className="space-y-1">
                {scaled.legendary.map((l, i) => <li key={i} className="text-sm text-parch-dim flex gap-2"><Crown className="w-3.5 h-3.5 text-gold-400 mt-0.5 shrink-0" />{l}</li>)}
              </ul>
            </div>
          )}

          <p className="mt-4 text-sm italic text-parch-dim/80 border-l-2 border-gold-500/30 pl-3">{scaled.lore}</p>

          <div className="flex flex-wrap gap-2 mt-5">
            <button onClick={addToCombat} className="btn-gold !py-2 text-xs flex-1 min-w-36"><Swords className="w-4 h-4" /> Adicionar ao Combate</button>
            <button onClick={addToBoard} className="btn-ghost !py-2 text-xs flex-1 min-w-36"><MapPin className="w-4 h-4" /> Token no Tabuleiro</button>
          </div>
        </div>

        <div className="panel p-4 text-xs text-parch-dim/70 flex items-start gap-2">
          <Skull className="w-4 h-4 text-gold-500 shrink-0 mt-0.5" />
          <p>D&D na veia: um ND ≈ nível médio do grupo para 4 heróis. Escale livremente — o sistema recalcula PV, CA, bônus e dados de dano. Bosses possuem fases: narre a transição quando a barra de vida cruzar o limiar.</p>
        </div>
      </div>
    </div>
  );
}
