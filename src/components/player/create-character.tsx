"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RACES, type RaceDef } from "@/lib/data/races";
import { CLASSES, getClass, type ClassDef } from "@/lib/data/classes";
import { WEAPONS, ARMORS, computeAc } from "@/lib/data/equipment";
import { spellsForClass, circleName } from "@/lib/data/spells";
import { TOKEN_COLORS, mod, fmt, ABILITY_NAMES, ABILITY_SHORT } from "@/lib/game";
import { CLASS_ART_INDEX, spriteStyle, classArtIndex } from "@/lib/art";
import type { AbilityBlock } from "@/lib/types";
import { ChevronLeft, ChevronRight, Dices, Loader2, Sparkles } from "lucide-react";

const ABILITY_KEYS: (keyof AbilityBlock)[] = ["str", "dex", "con", "int", "wis", "cha"];
const STANDARD_ARRAY = [15, 14, 13, 12, 10, 8];

interface Props {
  code: string;
  onDone: (id: number) => void;
  onCancel?: () => void;
}

export default function CreateCharacter({ code, onDone, onCancel }: Props) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [player, setPlayer] = useState("");
  const [color, setColor] = useState(TOKEN_COLORS[0]);
  const [race, setRace] = useState<RaceDef>(RACES[0]);
  const [cls, setCls] = useState<ClassDef>(CLASSES[0]);
  const [subKey, setSubKey] = useState(CLASSES[0].subclasses[0].key);
  const [stats, setStats] = useState<AbilityBlock>({ str: 15, dex: 14, con: 13, int: 12, wis: 10, cha: 8 });
  const [weapon, setWeapon] = useState(CLASSES[0].gear.weapons[0]);
  const [shield, setShield] = useState(false);
  const [portrait, setPortrait] = useState(0);
  const [pickedSpells, setPickedSpells] = useState<string[]>([]);
  const [bio, setBio] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const finalStats = useMemo(() => {
    const s = { ...stats };
    ABILITY_KEYS.forEach((k) => { s[k] = Math.min(20, s[k] + (race.bonus[k] ?? 0)); });
    return s;
  }, [stats, race]);

  const isCaster = !!cls.caster;
  const isHalfCaster = cls.caster === "half"; // paladino/patrulheiro não conjuram no nv.1
  const learnSpells = isCaster && !isHalfCaster;
  const spellPool = useMemo(() => (learnSpells ? spellsForClass(cls.key, 1) : []), [cls, learnSpells]);
  const cantrips = spellPool.filter((s) => s.lvl === 0);
  const firstCircle = spellPool.filter((s) => s.lvl === 1);
  const maxCantrips = cls.caster === "full" ? 3 : 2;
  const maxFirst = cls.caster === "full" ? 4 : 2;

  const hp = cls.hitDie + mod(finalStats.con);
  const ac = computeAc(cls.gear.armor, finalStats, shield);
  const canShield = cls.armor.includes("escudos");

  function rollStats() {
    const rolled: number[] = [];
    for (let i = 0; i < 6; i++) {
      const d = [0, 0, 0, 0].map(() => 1 + Math.floor(Math.random() * 6)).sort((a, b) => b - a);
      rolled.push(d[0] + d[1] + d[2]);
    }
    const next: AbilityBlock = { ...stats };
    ABILITY_KEYS.forEach((k, i) => { next[k] = rolled[i]; });
    setStats(next);
  }

  function autoAssign() {
    // distribui a matriz padrão priorizando atributos da classe
    const next: AbilityBlock = { str: 8, dex: 8, con: 8, int: 8, wis: 8, cha: 8 };
    const order = [...ABILITY_KEYS].sort((a, b) => {
      const pa = cls.primary.includes(a) ? 1 : 0;
      const pb = cls.primary.includes(b) ? 1 : 0;
      return pb - pa;
    });
    const priority = [...cls.primary, ...order.filter((k) => !cls.primary.includes(k))];
    STANDARD_ARRAY.forEach((v, i) => { next[priority[i] ?? ABILITY_KEYS[i]] = v; });
    if (next.con < 12) { const tmp = next.con; next.con = 13; const low = ABILITY_KEYS.find((k) => next[k] === 13 && k !== "con" && !cls.primary.includes(k)); if (low) next[low] = tmp; }
    setStats(next);
  }

  function selectClass(c: ClassDef) {
    setCls(c);
    setSubKey(c.subclasses[0].key);
    setWeapon(c.gear.weapons[0]);
    setPickedSpells([]);
    setShield(false);
    setPortrait(classArtIndex(c.key));
  }

  function toggleSpell(id: string, lvl: number) {
    setPickedSpells((cur) => {
      if (cur.includes(id)) return cur.filter((s) => s !== id);
      const countOfLvl = cur.filter((s) => spellPool.find((p) => p.id === s)?.lvl === lvl).length;
      if (lvl === 0 && countOfLvl >= maxCantrips) return cur;
      if (lvl === 1 && countOfLvl >= maxFirst) return cur;
      return [...cur, id];
    });
  }

  const canNext =
    (step === 0 && name.trim() && player.trim()) ||
    step === 1 || step === 2 ||
    (step === 3) ||
    (step === 4 && (!learnSpells ||
      pickedSpells.filter((s) => cantrips.some((c) => c.id === s)).length === maxCantrips));

  async function save() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/campaigns/${code}/characters`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(), player: player.trim(), race: race.key, classKey: cls.key,
          subclassKey: subKey, stats: finalStats, hp, maxHp: hp, ac, gold: cls.gear.gold, color, portrait,
          equipment: { weapon, armor: cls.gear.armor, offhand: shield ? "escudo" : undefined },
          spells: pickedSpells,
          inventory: [{ name: "Kit do Aventureiro", qty: 1 }, { name: "Poção de Cura", qty: 1 }],
          bio: bio.trim(),
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Falha ao criar personagem");
      onDone(json.character.id);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro inesperado");
      setSaving(false);
    }
  }

  const STEPS = ["Identidade", "Raça", "Classe", "Atributos", "Equipamento & Magia", "Confirmação"];

  return (
    <div className="panel p-6 md:p-8">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="font-display font-black text-2xl md:text-3xl gold-text flex items-center gap-3">
          <Sparkles className="w-7 h-7" /> Forja de Heróis
        </h1>
        <div className="flex items-center gap-1.5">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-1.5">
              <span className={`w-7 h-7 rounded-full flex items-center justify-center font-display text-xs font-bold transition-colors ${
                i < step ? "bg-gold-500 text-ink-950" : i === step ? "border-2 border-gold-400 text-gold-300" : "border border-ink-500 text-parch-dim/40"
              }`}>{i + 1}</span>
              {i < STEPS.length - 1 && <span className="w-3 md:w-5 h-px bg-ink-500" />}
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.2 }}>

          {step === 0 && (
            <div className="space-y-5">
              <StepTitle>O primeiro verso da sua lenda</StepTitle>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-display text-xs tracking-widest text-gold-500 mb-2">NOME DO HERÓI</label>
                  <input className="input-fantasy" placeholder="Ex.: Kaelin Valdara" value={name} onChange={(e) => setName(e.target.value)} maxLength={40} autoFocus />
                </div>
                <div>
                  <label className="block font-display text-xs tracking-widest text-gold-500 mb-2">VOCÊ, JOGADOR(A)</label>
                  <input className="input-fantasy" placeholder="Ex.: Marina" value={player} onChange={(e) => setPlayer(e.target.value)} maxLength={40} />
                </div>
              </div>
              <div>
                <label className="block font-display text-xs tracking-widest text-gold-500 mb-2">COR SEU TOKEN NO TABULEIRO</label>
                <div className="flex gap-2">
                  {TOKEN_COLORS.map((c) => (
                    <button key={c} onClick={() => setColor(c)}
                      className={`w-10 h-10 rounded-lg border-2 transition-all cursor-pointer ${color === c ? "border-white scale-110" : "border-black/40 hover:scale-105"}`}
                      style={{ backgroundColor: c }} />
                  ))}
                </div>
              </div>
              <div>
                <label className="block font-display text-xs tracking-widest text-gold-500 mb-2">HISTÓRIA DE FUNDO (OPCIONAL)</label>
                <textarea className="input-fantasy min-h-24 resize-y" placeholder="Era um guarda da vila até a noite em que o céu queimou..."
                  value={bio} onChange={(e) => setBio(e.target.value)} maxLength={500} />
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <StepTitle>Qual sangue corre em suas veias?</StepTitle>
              <div className="grid md:grid-cols-2 gap-3 max-h-[46vh] overflow-y-auto pr-1">
                {RACES.map((r) => (
                  <button key={r.key} onClick={() => setRace(r)}
                    className={`text-left p-4 rounded-xl border transition-all cursor-pointer ${
                      race.key === r.key ? "border-gold-400 bg-gold-500/10 gold-border-glow" : "border-gold-500/15 hover:border-gold-500/40 bg-ink-800/40"
                    }`}>
                    <div className="flex items-center justify-between">
                      <span className="font-display font-bold text-parch">{r.name}</span>
                      <span className="text-[10px] text-gold-400 font-display">
                        {ABILITY_KEYS.filter((k) => r.bonus[k]).map((k) => `+${r.bonus[k]} ${ABILITY_SHORT[k]}`).join(" ")}
                      </span>
                    </div>
                    <p className="text-parch-dim/80 text-sm mt-1">{r.desc}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {r.traits.map((t) => (
                        <span key={t} className="text-[10px] px-1.5 py-0.5 rounded bg-ink-700/80 border border-gold-500/15 text-parch-dim">{t}</span>
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <StepTitle>Escolha seu caminho de poder</StepTitle>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-[38vh] overflow-y-auto pr-1">
                {CLASSES.map((c) => (
                  <button key={c.key} onClick={() => selectClass(c)}
                    className={`text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                      cls.key === c.key ? "border-gold-400 bg-gold-500/10 gold-border-glow" : "border-gold-500/15 hover:border-gold-500/40 bg-ink-800/40"
                    }`}>
                    <div className="flex items-center justify-between">
                      <span className="font-display font-bold text-parch">{c.name}</span>
                      <span className="text-[10px] font-display text-gold-500">d{c.hitDie}</span>
                    </div>
                    <p className="text-parch-dim/80 text-xs mt-1 line-clamp-2">{c.desc}</p>
                  </button>
                ))}
              </div>
              <div>
                <h4 className="font-display text-xs tracking-widest text-gold-500 mb-2">SUBCLASSE DE {cls.name.toUpperCase()}</h4>
                <div className="grid md:grid-cols-3 gap-2.5">
                  {cls.subclasses.map((s) => (
                    <button key={s.key} onClick={() => setSubKey(s.key)}
                      className={`text-left p-3.5 rounded-xl border transition-all cursor-pointer ${
                        subKey === s.key ? "border-gold-400 bg-gold-500/10" : "border-gold-500/15 hover:border-gold-500/40 bg-ink-800/40"
                      }`}>
                      <span className="font-display font-bold text-parch text-sm">{s.name}</span>
                      <p className="text-parch-dim/80 text-xs mt-1">{s.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-display text-xs tracking-widest text-gold-500 mb-2">
                  RETRATO DO HERÓI <span className="text-parch-dim/50 normal-case tracking-normal">(aparece no tabuleiro — o da sua classe já está marcado)</span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(CLASS_ART_INDEX).map(([key, idx]) => (
                    <button key={key} onClick={() => setPortrait(idx)} title={CLASSES.find((c) => c.key === key)?.name}
                      className={`relative w-14 h-14 md:w-16 md:h-16 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                        portrait === idx ? "border-gold-300 gold-border-glow scale-105" : "border-black/50 opacity-70 hover:opacity-100 hover:border-gold-500/50"
                      }`}
                      style={spriteStyle("classes", idx)}>
                      {portrait === idx && <span className="absolute inset-x-0 bottom-0 bg-ink-950/70 text-[8px] font-display text-gold-300 text-center py-0.5">{CLASSES.find((c) => c.key === key)?.name.slice(0, 7).toUpperCase()}</span>}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <StepTitle>Forje os seis pilares</StepTitle>
                <div className="flex gap-2">
                  <button onClick={autoAssign} className="btn-ghost !py-1.5 !px-3 text-xs">Matriz padrão (15/14/13/12/10/8)</button>
                  <button onClick={rollStats} className="btn-ghost !py-1.5 !px-3 text-xs"><Dices className="w-3.5 h-3.5" /> 4d6 tira o menor</button>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {ABILITY_KEYS.map((k) => (
                  <div key={k} className="panel-inset p-4 flex items-center gap-3">
                    <div className="flex-1">
                      <p className="font-display text-xs tracking-widest text-gold-500">{ABILITY_NAMES[k].toUpperCase()}</p>
                      <p className="text-[10px] text-parch-dim/60">
                        base {stats[k]}{race.bonus[k] ? ` + ${race.bonus[k]} (raça)` : ""}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => setStats((s) => ({ ...s, [k]: Math.max(3, s[k] - 1) }))} className="btn-ghost !p-1.5">−</button>
                      <div className="text-center w-16">
                        <span className="font-display font-black text-xl text-parch">{finalStats[k]}</span>
                        <span className="block text-[11px] text-gold-400">{fmt(mod(finalStats[k]))}</span>
                      </div>
                      <button onClick={() => setStats((s) => ({ ...s, [k]: Math.min(18, s[k] + 1) }))} className="btn-ghost !p-1.5">+</button>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-parch-dim/60 text-xs italic">Recomendado: os atributos-chave de {cls.name} são {cls.primary.map((k) => ABILITY_NAMES[k]).join(" e ")}.</p>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-5">
              <StepTitle>Armas na mão, magia na mente</StepTitle>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-display text-xs tracking-widest text-gold-500 mb-2">ARMA INICIAL</h4>
                  <div className="space-y-2">
                    {cls.gear.weapons.map((wid) => {
                      const w = WEAPONS.find((x) => x.id === wid);
                      if (!w) return null;
                      return (
                        <button key={wid} onClick={() => setWeapon(wid)}
                          className={`w-full text-left p-3 rounded-lg border transition-all cursor-pointer flex items-center justify-between ${
                            weapon === wid ? "border-gold-400 bg-gold-500/10" : "border-gold-500/15 hover:border-gold-500/40"
                          }`}>
                          <span className="text-sm text-parch font-semibold">{w.name}</span>
                          <span className="text-xs font-mono text-gold-400">{w.damage} {w.type}</span>
                        </button>
                      );
                    })}
                  </div>
                  <div className="mt-3 panel-inset p-3 flex items-center justify-between text-sm">
                    <span className="text-parch-dim">Armadura: {ARMORS.find((a) => a.id === cls.gear.armor)?.name ?? "Sem armadura"}</span>
                    {canShield && (
                      <label className="flex items-center gap-2 text-parch-dim cursor-pointer">
                        <input type="checkbox" checked={shield} onChange={(e) => setShield(e.target.checked)} className="accent-[#c9a227]" />
                        Escudo (+2 CA)
                      </label>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-3">
                    <div className="stat-chip"><span className="text-[9px] text-parch-dim/60 font-display">PV</span><span className="font-display font-bold text-blood-400">{hp}</span></div>
                    <div className="stat-chip"><span className="text-[9px] text-parch-dim/60 font-display">CA</span><span className="font-display font-bold text-parch">{ac}</span></div>
                    <div className="stat-chip"><span className="text-[9px] text-parch-dim/60 font-display">OURO</span><span className="font-display font-bold text-gold-300">{cls.gear.gold}</span></div>
                  </div>
                </div>

                <div>
                  {learnSpells ? (
                    <div>
                      <h4 className="font-display text-xs tracking-widest text-gold-500 mb-2">
                        MAGIAS CONHECIDAS ({maxCantrips} truques + {maxFirst} de 1º)
                      </h4>
                      <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
                        {[...cantrips, ...firstCircle].map((s) => {
                          const active = pickedSpells.includes(s.id);
                          return (
                            <button key={s.id} onClick={() => toggleSpell(s.id, s.lvl)}
                              className={`w-full text-left p-2.5 rounded-lg border transition-all cursor-pointer ${
                                active ? "border-purple-400/70 bg-purple-500/10" : "border-gold-500/15 hover:border-gold-500/40"
                              }`}>
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-parch font-semibold">{s.name}</span>
                                <span className="text-[10px] font-display text-purple-300">{circleName(s.lvl)}</span>
                              </div>
                              <p className="text-parch-dim/70 text-xs line-clamp-1">{s.desc}</p>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ) : isHalfCaster ? (
                    <div className="panel-inset p-4 text-sm text-parch-dim italic">
                      {cls.name} canaliza magia apenas a partir do nível 2. Seu aço e sua fé bastam por enquanto.
                    </div>
                  ) : (
                    <div className="panel-inset p-4 text-sm text-parch-dim italic">
                      {cls.name} não conjura magias — mas ninguém duvida de seus punhos, armas e instintos.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-4">
              <StepTitle>O herói está pronto para o mundo?</StepTitle>
              <div className="panel-inset p-5">
                <div className="flex items-center gap-4 flex-wrap">
                  <span className="w-16 h-16 rounded-2xl border-2 overflow-hidden bg-cover gold-border-glow shrink-0"
                    style={{ borderColor: color, ...spriteStyle("classes", portrait) }} />
                  <div>
                    <h3 className="font-display font-black text-2xl gold-text">{name}</h3>
                    <p className="text-parch-dim text-sm">{race.name} · {cls.name} · {cls.subclasses.find((s) => s.key === subKey)?.name}</p>
                    <p className="text-parch-dim/70 text-xs italic">por {player}</p>
                  </div>
                  <div className="ml-auto flex gap-2">
                    <div className="stat-chip"><span className="text-[9px] text-parch-dim/60 font-display">PV</span><span className="font-bold text-blood-400">{hp}</span></div>
                    <div className="stat-chip"><span className="text-[9px] text-parch-dim/60 font-display">CA</span><span className="font-bold text-parch">{ac}</span></div>
                  </div>
                </div>
                <div className="grid grid-cols-6 gap-1.5 mt-4">
                  {ABILITY_KEYS.map((k) => (
                    <div key={k} className="stat-chip !min-w-0 !p-1.5">
                      <span className="text-[9px] text-gold-500 font-display">{k.toUpperCase()}</span>
                      <span className="font-bold text-parch text-sm">{finalStats[k]}</span>
                      <span className="text-[10px] text-parch-dim/60">{fmt(mod(finalStats[k]))}</span>
                    </div>
                  ))}
                </div>
              </div>
              {error && <p className="text-blood-400 text-sm bg-blood-600/10 border border-blood-600/30 rounded-lg px-4 py-2.5">{error}</p>}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* NAV */}
      <div className="flex items-center gap-3 mt-8">
        {onCancel && step === 0 ? (
          <button onClick={onCancel} className="btn-ghost !py-2.5 text-sm"><ChevronLeft className="w-4 h-4" /> Cancelar</button>
        ) : step > 0 ? (
          <button onClick={() => setStep((s) => s - 1)} className="btn-ghost !py-2.5 text-sm"><ChevronLeft className="w-4 h-4" /> Voltar</button>
        ) : null}
        <div className="flex-1" />
        {step < STEPS.length - 1 ? (
          <button onClick={() => canNext && setStep((s) => s + 1)} disabled={!canNext}
            className="btn-gold !py-2.5 text-sm disabled:opacity-40">
            Continuar <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button onClick={save} disabled={saving} className="btn-gold !py-2.5 !px-8 text-sm disabled:opacity-40">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />} Entrar na Aventura
          </button>
        )}
      </div>
    </div>
  );
}

function StepTitle({ children }: { children: string }) {
  return <h2 className="font-display font-bold text-xl text-parch">{children}</h2>;
}

void getClass; void fmt;
