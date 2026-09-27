import type { AbilityBlock, ScaledMonster } from "./types";

export const ABILITY_NAMES: Record<keyof AbilityBlock, string> = {
  str: "Força",
  dex: "Destreza",
  con: "Constituição",
  int: "Inteligência",
  wis: "Sabedoria",
  cha: "Carisma",
};

export const ABILITY_SHORT: Record<keyof AbilityBlock, string> = {
  str: "FOR",
  dex: "DES",
  con: "CON",
  int: "INT",
  wis: "SAB",
  cha: "CAR",
};

export function mod(score: number): number {
  return Math.floor((score - 10) / 2);
}

export function fmt(n: number): string {
  return n >= 0 ? `+${n}` : `${n}`;
}

export function uid(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

// ---------------- Dados ----------------

export interface DiceResult {
  total: number;
  detail: string;
  rolls: number[];
  natural20: boolean;
  natural1: boolean;
  valid: boolean;
}

export function rollDice(expression: string): DiceResult {
  const clean = expression.toLowerCase().replace(/\s+/g, "");
  const terms = clean.match(/[+-]?[^+-]+/g) ?? [];
  let total = 0;
  const allRolls: number[] = [];
  const parts: string[] = [];
  let n20 = false;
  let n1 = false;
  let valid = terms.length > 0;

  for (const term of terms) {
    const sign = term.startsWith("-") ? -1 : 1;
    const body = term.replace(/^[+-]/, "");
    const diceMatch = body.match(/^(\d*)d(\d+)$/);
    if (diceMatch) {
      const count = parseInt(diceMatch[1] || "1", 10);
      const sides = parseInt(diceMatch[2], 10);
      if (count < 1 || count > 40 || sides < 2 || sides > 1000) {
        valid = false;
        continue;
      }
      const rolls: number[] = [];
      for (let i = 0; i < count; i++) {
        const r = 1 + Math.floor(Math.random() * sides);
        rolls.push(r);
        allRolls.push(r);
        if (sides === 20 && r === 20) n20 = true;
        if (sides === 20 && r === 1) n1 = true;
      }
      const sum = rolls.reduce((a, b) => a + b, 0);
      total += sign * sum;
      parts.push(`${sign < 0 ? "-" : parts.length ? "+" : ""}${count}d${sides}[${rolls.join(",")}]`);
    } else if (/^\d+$/.test(body)) {
      total += sign * parseInt(body, 10);
      parts.push(`${sign < 0 ? "-" : parts.length ? "+" : ""}${body}`);
    } else {
      valid = false;
    }
  }
  return { total, detail: parts.join(" "), rolls: allRolls, natural20: n20, natural1: n1, valid };
}

// ---------------- Níveis (tabela D&D 5e) ----------------

export const XP_TABLE = [
  0, 300, 900, 2700, 6500, 14000, 23000, 34000, 48000, 64000, 85000, 100000, 120000, 140000,
  165000, 195000, 225000, 265000, 305000, 355000,
];

export function levelForXp(xp: number): number {
  let lvl = 1;
  for (let i = 0; i < XP_TABLE.length; i++) if (xp >= XP_TABLE[i]) lvl = i + 1;
  return Math.min(lvl, 20);
}

export function nextLevelXp(level: number): number | null {
  return level >= 20 ? null : XP_TABLE[level];
}

export function profBonus(level: number): number {
  return 2 + Math.floor((level - 1) / 4);
}

// ---------------- CR / Escalonamento de monstros ----------------

export const CR_XP: Record<string, number> = {
  "0": 10, "0.125": 25, "0.25": 50, "0.5": 100, "1": 200, "2": 450, "3": 700, "4": 1100,
  "5": 1800, "6": 2300, "7": 2900, "8": 3900, "9": 5000, "10": 5900, "11": 7200, "12": 8400,
  "13": 10000, "14": 11500, "15": 13000, "16": 15000, "17": 18000, "18": 20000, "19": 22000, "20": 25000,
};

export function xpForCr(cr: number): number {
  const keys = Object.keys(CR_XP).map(parseFloat).sort((a, b) => a - b);
  let best = keys[0];
  for (const k of keys) if (Math.abs(k - cr) < Math.abs(best - cr)) best = k;
  return CR_XP[String(best)];
}

interface BaseMonster {
  key: string;
  name: string;
  size: string;
  type: string;
  cr: number;
  hp: number;
  ac: number;
  speed: string;
  stats: AbilityBlock;
  attacks: { name: string; bonus: number; damage: string; extra?: string }[];
  traits: string[];
  lore: string;
  boss?: boolean;
  phases?: { at: string; text: string }[];
  legendary?: string[];
}

// Escala qualquer monstro para um ND alvo, mantendo proporções de D&D.
export function scaleMonster(m: BaseMonster, targetCr: number): ScaledMonster {
  const diff = targetCr - m.cr;
  if (diff === 0) {
    return { ...m, baseCr: m.cr, xp: xpForCr(m.cr), scaled: false };
  }
  const factor = Math.max(0.3, Math.min(4, 1 + 0.33 * diff));
  const hp = Math.max(1, Math.round(m.hp * factor));
  const ac = Math.max(8, m.ac + Math.max(-4, Math.min(4, Math.round(diff / 2))));
  const atkShift = Math.max(-5, Math.min(6, Math.round(diff * 0.7)));
  const statShift = Math.max(-6, Math.min(8, diff));
  const stats = { ...m.stats };
  (Object.keys(stats) as (keyof AbilityBlock)[]).forEach((k) => {
    stats[k] = Math.max(3, Math.min(30, stats[k] + (k === "con" || k === "str" ? statShift : Math.round(statShift / 2))));
  });
  const attacks = m.attacks.map((a) => ({
    ...a,
    bonus: a.bonus + atkShift,
    damage: scaleDamage(a.damage, factor),
  }));
  return {
    ...m, hp, ac, stats, attacks,
    cr: targetCr, baseCr: m.cr, xp: xpForCr(targetCr),
    name: targetCr > m.cr ? `${m.name} (Potencializado)` : targetCr < m.cr ? `${m.name} (Enfraquecido)` : m.name,
    scaled: true,
  };
}

function scaleDamage(damage: string, factor: number): string {
  return damage.replace(/(\d+)d(\d+)/g, (_, c, s) => {
    const count = Math.max(1, Math.round(parseInt(c, 10) * factor));
    return `${count}d${s}`;
  }).replace(/([+-])\s*(\d+)(?!\w)/g, (_, sign, n) => {
    const v = Math.max(0, Math.round(parseInt(n, 10) * factor));
    return `${sign}${v}`;
  });
}

// Placar de dificuldade de encontro estilo D&D
export function encounterDifficulty(totalXp: number, partySize: number, avgLevel: number): { label: string; color: string } {
  const perChar: Record<string, number[]> = {};
  const easy = [25, 50, 75, 125, 250, 300, 350, 450, 550, 600, 800, 1000, 1100, 1250, 1400, 1600, 2000, 2100, 2400, 2800];
  const deadly = [100, 200, 400, 500, 1100, 1400, 1700, 2100, 2400, 3100, 4100, 4700, 5400, 6200, 7800, 9800, 11700, 14200, 15800, 16800];
  void perChar;
  const e = easy[Math.min(19, Math.max(0, avgLevel - 1))] * partySize;
  const d = deadly[Math.min(19, Math.max(0, avgLevel - 1))] * partySize;
  if (totalXp >= d) return { label: "Mortal", color: "text-red-400" };
  if (totalXp >= d * 0.6) return { label: "Difícil", color: "text-orange-400" };
  if (totalXp >= e) return { label: "Médio", color: "text-amber-300" };
  return { label: "Fácil", color: "text-emerald-400" };
}

export const CONDITION_LIST = [
  "Cego", "Caído", "Enfeitiçado", "Amedrontado", "Agarrado", "Incapacitado", "Invisível",
  "Paralisado", "Petrificado", "Envenenado", "Atordoado", "Inconsciente", "Exausto", "Concentrando",
];

export const TOKEN_COLORS = [
  "#c9a227", "#a33a3a", "#3a6ea3", "#4a8a4f", "#7a4fa3", "#a3662e", "#3aa39b", "#b0485f",
];
