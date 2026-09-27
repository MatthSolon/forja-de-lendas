import type { CSSProperties } from "react";

// Sprite sheets geradas: classes = 4×3, monstros = 4×4
export const ART = {
  classes: { url: "/images/art/classes.jpg", cols: 4, rows: 3 },
  monsters: { url: "/images/art/monsters.jpg", cols: 4, rows: 4 },
} as const;

// Ordem EXATA da sprite de classes (esquerda→direita, cima→baixo)
export const CLASS_ART_INDEX: Record<string, number> = {
  guerreiro: 0, barbaro: 1, mago: 2, clerigo: 3,
  ladino: 4, paladino: 5, patrulheiro: 6, bardo: 7,
  bruxo: 8, feiticeiro: 9, druida: 10, monge: 11,
};

// Ordem da sprite de monstros:
// 0 goblin · 1 esqueleto · 2 zumbi · 3 orc · 4 lobo · 5 aranha · 6 troll · 7 dragão
// 8 observador · 9 lich · 10 vampiro · 11 minotauro · 12 golem · 13 demônio · 14 kraken · 15 espectro
export const MONSTER_ART_INDEX: Record<string, number> = {
  "rato-gigante": 4, goblin: 0, kobold: 0, esqueleto: 1, zumbi: 2,
  lobo: 4, bandido: 3, cultista: 9, "aranha-gigante": 5, "lobo-atroz": 4,
  orc: 3, carnical: 2, harpy: 10, ogro: 6, "urso-coruja": 4,
  troll: 6, gargula: 12, necromante: 9, "cavaleiro-negro": 10, minotauro: 11,
  manticora: 4, quimera: 7, hidra: 14, tumular: 15, espectro: 15,
  mumia: 1, "vampiro-prole": 10, "gigante-colina": 6, "golem-carne": 2,
  salamandra: 13, "elemental-fogo": 13, "dragao-jovem-verde": 7, abominavel: 6,
  "devorador-mente": 8, "golem-pedra": 12, "gigante-pedra": 6, beholder: 8,
  "boss-aranha-rainha": 5, "boss-lich": 9, "boss-dragao-vermelho": 7,
  "boss-dragao-cinderax": 7, "boss-balgor": 13, "boss-kraken": 14, "boss-colosso": 12,
};

export function classArtIndex(classKey: string): number {
  return CLASS_ART_INDEX[classKey] ?? 0;
}

export function monsterArtIndex(monsterKey: string): number | null {
  return MONSTER_ART_INDEX[monsterKey] ?? null;
}

// Recorta a célula da sprite via CSS background
export function spriteStyle(sheet: keyof typeof ART, index: number): CSSProperties {
  const s = ART[sheet];
  const col = ((index % s.cols) + s.cols) % s.cols;
  const row = Math.floor(index / s.cols) % s.rows;
  return {
    backgroundImage: `url(${s.url})`,
    backgroundSize: `${s.cols * 100}% ${s.rows * 100}%`,
    backgroundPosition: `${(col / (s.cols - 1)) * 100}% ${(row / (s.rows - 1)) * 100}%`,
    backgroundRepeat: "no-repeat",
  };
}

// Extrai o índice de um refId de monstro no formato "chave@nd"
export function monsterKeyFromRef(refId?: string): string | null {
  if (!refId) return null;
  if (!refId.includes("@")) return null;
  return refId.split("@")[0];
}
