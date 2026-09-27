"use client";

import { useState } from "react";
import type { CharacterRow, LogEntry } from "@/lib/types";
import { RACES } from "@/lib/data/races";
import { getClass, getSubclass } from "@/lib/data/classes";
import { WEAPONS, ARMORS, ITEMS, getWeapon, getArmor, computeAc } from "@/lib/data/equipment";
import { mod, fmt, profBonus, XP_TABLE, nextLevelXp, ABILITY_NAMES, rollDice } from "@/lib/game";
import { spriteStyle } from "@/lib/art";
import {
  Heart, Shield, Coins, Dices, Package, Star, Swords, Sparkles, Backpack, Pencil,
} from "lucide-react";

const ABILITY_KEYS = ["str", "dex", "con", "int", "wis", "cha"] as const;
type LogInput = Omit<LogEntry, "id" | "ts">;

interface Props {
  char: CharacterRow;
  appendLog: (e: LogInput[]) => void;
  onUpdate: () => void;
}

export default function SheetTab({ char, appendLog, onUpdate }: Props) {
  const [invName, setInvName] = useState("");
  const [invQty, setInvQty] = useState("1");

  const race = RACES.find((r) => r.key === char.race);
  const cls = getClass(char.classKey);
  const sub = getSubclass(char.classKey, char.subclassKey);
  const pb = profBonus(char.level);
  const next = nextLevelXp(char.level);
  const prev = XP_TABLE[char.level - 1];
  const xpPct = next ? Math.min(100, ((char.xp - prev) / (next - prev)) * 100) : 100;

  async function patch(updates: Record<string, unknown>) {
    await fetch(`/api/characters/${char.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });
    onUpdate();
  }

  const weapon = getWeapon(char.equipment.weapon);
  const armor = getArmor(char.equipment.armor);
  const weaponAbility = weapon?.ability === "dex" ? "dex" : weapon?.ability === "str" ? "str" : Math.max(mod(char.stats.str), mod(char.stats.dex)) === mod(char.stats.dex) ? "dex" : "str";
  const atkBonus = pb + mod(char.stats[weaponAbility]);
  const dmgMod = mod(char.stats[weaponAbility]);

  function rollAtk() {
    const r = rollDice(`1d20${fmt(atkBonus)}`);
    appendLog([{ who: char.name, kind: "roll", text: `Ataque com ${weapon?.name ?? "arma"}: 1d20${fmt(atkBonus)} = ${r.total}`, detail: r.detail }]);
  }

  function rollDmg() {
    if (!weapon) return;
    const r = rollDice(`${weapon.damage}${fmt(Math.max(0, dmgMod))}`);
    appendLog([{ who: char.name, kind: "roll", text: `Dano de ${weapon.name} (${weapon.type}) = ${r.total}`, detail: r.detail }]);
  }

  const classFeatures = cls.features.filter((f) => f.level <= char.level);
  const subFeatures = sub ? sub.features.filter((f) => f.level <= char.level) : [];

  return (
    <div className="space-y-4">
      {/* CABEÇALHO */}
      <div className="panel p-5">
        <div className="flex flex-wrap items-center gap-4">
          <span className="w-16 h-16 rounded-2xl border-2 overflow-hidden bg-cover shrink-0"
            style={{ borderColor: char.color, ...spriteStyle("classes", char.portrait ?? 0) }} />
          <div className="flex-1 min-w-40">
            <h2 className="font-display font-black text-2xl gold-text leading-tight">{char.name}</h2>
            <p className="text-parch-dim text-sm">{race?.name ?? char.race} · {cls.name} {sub ? `— ${sub.name}` : ""}</p>
          </div>
          <div className="stat-chip"><span className="text-[9px] text-parch-dim/60 font-display">NÍVEL</span><span className="font-display font-black text-2xl gold-text">{char.level}</span></div>
          <div className="stat-chip"><span className="text-[9px] text-parch-dim/60 font-display">PROF.</span><span className="font-display font-black text-2xl text-parch">{fmt(pb)}</span></div>
          <div className="stat-chip"><span className="text-[9px] text-parch-dim/60 font-display">INICIATIVA</span><span className="font-display font-black text-2xl text-parch">{fmt(mod(char.stats.dex))}</span></div>
        </div>
        <div className="mt-4">
          <div className="flex justify-between text-xs text-parch-dim/70 mb-1">
            <span className="font-display tracking-widest">EXPERIÊNCIA</span>
            <span>{char.xp.toLocaleString("pt-BR")} XP {next ? `/ ${next.toLocaleString("pt-BR")} para nível ${char.level + 1}` : "· nível máximo"}</span>
          </div>
          <div className="hp-bar !h-2.5"><div className="hp-fill" style={{ width: `${xpPct}%`, background: "linear-gradient(90deg,#6f5914,#e0b64c,#f0d688)" }} /></div>
        </div>
      </div>

      <div className="grid xl:grid-cols-2 gap-4">
        {/* VITALIDADE */}
        <div className="panel p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-xs tracking-[0.25em] text-gold-500 flex items-center gap-2"><Heart className="w-4 h-4" /> PONTOS DE VIDA</h3>
            {char.hp === 0 && <span className="text-blood-400 font-display text-xs animate-pulse">MORIBUNDO — testes de morte!</span>}
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => patch({ hp: Math.max(0, char.hp - 5) })} className="btn-ghost !py-2 !px-3 text-blood-400">-5</button>
            <button onClick={() => patch({ hp: Math.max(0, char.hp - 1) })} className="btn-ghost !py-2 !px-3 text-blood-400">-1</button>
            <div className="flex-1 text-center">
              <span className={`font-display font-black text-4xl ${char.hp === 0 ? "text-blood-400" : "text-parch"}`}>{char.hp}</span>
              <span className="text-parch-dim/60 text-lg"> / {char.maxHp}</span>
            </div>
            <button onClick={() => patch({ hp: Math.min(char.maxHp, char.hp + 1) })} className="btn-ghost !py-2 !px-3 text-emerald-400">+1</button>
            <button onClick={() => patch({ hp: Math.min(char.maxHp, char.hp + 5) })} className="btn-ghost !py-2 !px-3 text-emerald-400">+5</button>
          </div>
          <div className="hp-bar">
            <div className="hp-fill" style={{
              width: `${(char.hp / char.maxHp) * 100}%`,
              background: char.hp / char.maxHp > 0.5 ? "linear-gradient(90deg,#4a8a4f,#6a9a4a)" : char.hp / char.maxHp > 0.25 ? "linear-gradient(90deg,#a07f1c,#e0b64c)" : "linear-gradient(90deg,#7e2d2d,#c0534b)",
            }} />
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-parch-dim"><Shield className="w-4 h-4 text-gold-400" /> Classe de Armadura</span>
            <span className="font-display font-black text-xl text-parch">{char.ac}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-parch-dim text-sm"><Coins className="w-4 h-4 text-gold-400" /> Ouro</span>
            <div className="flex items-center gap-1.5">
              <button onClick={() => patch({ gold: Math.max(0, char.gold - 10) })} className="btn-ghost !p-1.5 text-xs">-10</button>
              <span className="font-display font-bold text-gold-300 w-14 text-center">{char.gold}</span>
              <button onClick={() => patch({ gold: char.gold + 10 })} className="btn-ghost !p-1.5 text-xs">+10</button>
            </div>
          </div>
        </div>

        {/* ATRIBUTOS */}
        <div className="panel p-5">
          <h3 className="font-display text-xs tracking-[0.25em] text-gold-500 mb-3 flex items-center gap-2"><Star className="w-4 h-4" /> ATRIBUTOS & PROTEÇÕES</h3>
          <div className="grid grid-cols-3 gap-2">
            {ABILITY_KEYS.map((k) => (
              <div key={k} className={`stat-chip !py-3 ${cls.primary.includes(k) ? "!border-gold-400/60" : ""}`}>
                <span className="text-[9px] text-gold-500 font-display tracking-widest">{ABILITY_NAMES[k].toUpperCase()}</span>
                <span className="font-display font-black text-2xl text-parch">{char.stats[k]}</span>
                <span className="text-sm text-gold-400 font-display">{fmt(mod(char.stats[k]))}</span>
                {cls.saves.includes(k) && <span className="text-[8px] text-emerald-400 font-display">SALVAGUARDA ✦</span>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ATAQUE & EQUIPAMENTO */}
      <div className="grid xl:grid-cols-2 gap-4">
        <div className="panel p-5 space-y-4">
          <h3 className="font-display text-xs tracking-[0.25em] text-gold-500 flex items-center gap-2"><Swords className="w-4 h-4" /> ATAQUE PRINCIPAL</h3>
          {weapon ? (
            <>
              <div className="panel-inset p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-display font-bold text-lg text-parch">{weapon.name}</p>
                    <p className="text-xs text-parch-dim/70">{weapon.props.join(" · ") || "—"}</p>
                  </div>
                  <span className="font-mono text-gold-400">{weapon.damage} {weapon.type}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-3">
                  <button onClick={rollAtk} className="btn-gold !py-2 text-sm"><Dices className="w-4 h-4" /> Ataque {fmt(atkBonus)}</button>
                  <button onClick={rollDmg} className="btn-ghost !py-2 text-sm">Dano {weapon.damage}{fmt(Math.max(0, dmgMod))}</button>
                </div>
              </div>
            </>
          ) : <p className="text-parch-dim italic text-sm">Nenhuma arma equipada.</p>}

          <div className="grid grid-cols-2 gap-2">
            <label className="block">
              <span className="font-display text-[10px] tracking-widest text-gold-500">ARMA</span>
              <select className="input-fantasy !py-2 text-sm mt-1" value={char.equipment.weapon ?? ""}
                onChange={async (e) => { await patch({ equipment: { ...char.equipment, weapon: e.target.value } }); }}>
                <option value="">—</option>
                {WEAPONS.map((w) => <option key={w.id} value={w.id}>{w.name} ({w.damage})</option>)}
              </select>
            </label>
            <label className="block">
              <span className="font-display text-[10px] tracking-widest text-gold-500">ARMADURA</span>
              <select className="input-fantasy !py-2 text-sm mt-1" value={char.equipment.armor ?? "nenhuma"}
                onChange={async (e) => {
                  const armorId = e.target.value;
                  const shield = char.equipment.offhand === "escudo";
                  const ac = computeAc(armorId, char.stats, shield);
                  await patch({ equipment: { ...char.equipment, armor: armorId }, ac });
                }}>
                {ARMORS.filter((a) => a.category !== "escudo").map((a) => <option key={a.id} value={a.id}>{a.name} (CA {a.baseAc})</option>)}
              </select>
            </label>
          </div>
          <label className="flex items-center gap-2 text-sm text-parch-dim cursor-pointer">
            <input type="checkbox" checked={char.equipment.offhand === "escudo"} className="accent-[#c9a227]"
              onChange={async (e) => {
                const offhand = e.target.checked ? "escudo" : undefined;
                const ac = computeAc(char.equipment.armor, char.stats, e.target.checked);
                await patch({ equipment: { ...char.equipment, offhand }, ac });
              }} />
            Empunhando escudo (+2 CA)
          </label>
        </div>

        {/* INVENTÁRIO */}
        <div className="panel p-5 space-y-3">
          <h3 className="font-display text-xs tracking-[0.25em] text-gold-500 flex items-center gap-2"><Backpack className="w-4 h-4" /> INVENTÁRIO</h3>
          <div className="space-y-1.5 max-h-52 overflow-y-auto pr-1">
            {char.inventory.length === 0 && <p className="text-parch-dim/60 text-sm italic">Mochila vazia. A aventura supre.</p>}
            {char.inventory.map((it, i) => (
              <div key={i} className="flex items-center gap-2 text-sm bg-ink-800/60 rounded-lg px-3 py-2 border border-gold-500/10">
                <Package className="w-3.5 h-3.5 text-gold-500 shrink-0" />
                <span className="text-parch flex-1">{it.name}</span>
                <span className="text-parch-dim/70 font-mono text-xs">×{it.qty}</span>
                <button onClick={() => patch({ inventory: char.inventory.filter((_, j) => j !== i) })}
                  className="text-parch-dim/50 hover:text-blood-400 text-xs cursor-pointer">remover</button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <select value={invName} onChange={(e) => setInvName(e.target.value)} className="input-fantasy !py-2 text-sm flex-1">
              <option value="">Adicionar item...</option>
              {ITEMS.map((it) => <option key={it.id} value={it.name}>{it.name} — {it.price} po</option>)}
            </select>
            <input value={invQty} onChange={(e) => setInvQty(e.target.value.replace(/\D/g, "") || "1")} className="input-fantasy !py-2 w-14 text-center text-sm" />
            <button disabled={!invName} onClick={async () => {
              const qty = Math.max(1, parseInt(invQty) || 1);
              const existing = char.inventory.find((i) => i.name === invName);
              const inv = existing
                ? char.inventory.map((i) => (i.name === invName ? { ...i, qty: i.qty + qty } : i))
                : [...char.inventory, { name: invName, qty }];
              const item = ITEMS.find((i) => i.name === invName);
              const cost = item ? item.price * qty : 0;
              await patch({ inventory: inv, gold: Math.max(0, char.gold - cost) });
              setInvName("");
            }} className="btn-gold !py-2 !px-4 text-xs disabled:opacity-40">Comprar</button>
          </div>
        </div>
      </div>

      {/* TALENTOS */}
      <div className="panel p-5">
        <h3 className="font-display text-xs tracking-[0.25em] text-gold-500 mb-3 flex items-center gap-2"><Sparkles className="w-4 h-4" /> TALENTOS & RECURSOS (NÍVEL {char.level})</h3>
        <div className="grid md:grid-cols-2 gap-2">
          {race?.traits.map((t) => (
            <div key={t} className="panel-inset p-3"><p className="text-xs font-display text-gold-400 mb-0.5">TRAÇO RACIAL</p><p className="text-sm text-parch-dim">{t}</p></div>
          ))}
          {classFeatures.map((f) => (
            <div key={f.name} className="panel-inset p-3"><p className="text-xs font-display text-gold-400 mb-0.5">NÍVEL {f.level} · {f.name.toUpperCase()}</p><p className="text-sm text-parch-dim">{f.text}</p></div>
          ))}
          {subFeatures.map((f) => (
            <div key={f.name} className="panel-inset p-3 !border-purple-500/25">
              <p className="text-xs font-display text-purple-300 mb-0.5">{sub?.name.toUpperCase()} · NÍVEL {f.level} · {f.name.toUpperCase()}</p>
              <p className="text-sm text-parch-dim">{f.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* BIO */}
      <div className="panel p-5">
        <h3 className="font-display text-xs tracking-[0.25em] text-gold-500 mb-2 flex items-center gap-2"><Pencil className="w-4 h-4" /> HISTÓRIA</h3>
        <textarea defaultValue={char.bio} onBlur={(e) => patch({ bio: e.target.value })}
          className="input-fantasy min-h-24 text-sm resize-y" placeholder="Escreva a lenda do seu herói..." />
      </div>
    </div>
  );
}
