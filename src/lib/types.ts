// ---- Tipos compartilhados do estado da campanha ----

export interface TokenState {
  id: string;
  kind: "player" | "monster" | "npc" | "object";
  name: string;
  color: string;
  x: number;
  y: number;
  size: number; // 1 = ocupa 1 célula
  hp?: number;
  maxHp?: number;
  refId?: string; // id do personagem ou do monstro escalado
  label?: string;
}

export interface BoardState {
  presetId: number;
  width: number;
  height: number;
  cells: Record<string, string>; // "x,y" -> terrainId
  tokens: TokenState[];
  showGrid: boolean;
  fog: Record<string, boolean>; // "x,y" -> coberto por névoa de guerra
}

export interface LogEntry {
  id: string;
  ts: number;
  who: string;
  kind: "roll" | "event" | "story" | "system";
  text: string;
  detail?: string;
  hidden?: boolean; // rolagem secreta do mestre
}

export interface StoryState {
  arcId: string;
  chapterId: string;
  doneQuests: string[];
  doneChoices: string[];
  notes: string;
}

export interface Combatant {
  id: string;
  name: string;
  init: number;
  hp: number;
  maxHp: number;
  ac: number;
  kind: "player" | "monster" | "npc";
  refId?: string;
  color: string;
  conditions: string[];
}

export interface CombatState {
  active: boolean;
  round: number;
  turn: number;
  combatants: Combatant[];
}

export interface CampaignState {
  board: BoardState;
  log: LogEntry[];
  story: StoryState;
  combat: CombatState;
}

export function defaultBoard(): BoardState {
  return { presetId: 0, width: 18, height: 12, cells: {}, tokens: [], showGrid: true, fog: {} };
}

export function defaultCampaignState(): CampaignState {
  return {
    board: defaultBoard(),
    log: [],
    story: { arcId: "cinzas", chapterId: "cinzas-1", doneQuests: [], doneChoices: [], notes: "" },
    combat: { active: false, round: 1, turn: 0, combatants: [] },
  };
}

// ---- Personagem ----

export interface AbilityBlock {
  str: number;
  dex: number;
  con: number;
  int: number;
  wis: number;
  cha: number;
}

export interface CharacterRow {
  id: number;
  campaignId: number;
  name: string;
  player: string;
  race: string;
  classKey: string;
  subclassKey: string;
  level: number;
  xp: number;
  stats: AbilityBlock;
  hp: number;
  maxHp: number;
  ac: number;
  gold: number;
  color: string;
  portrait: number;
  equipment: { weapon?: string; offhand?: string; armor?: string };
  spells: string[];
  inventory: { name: string; qty: number }[];
  bio: string;
}

export interface ScaledMonster {
  key: string;
  name: string;
  size: string;
  type: string;
  cr: number;
  baseCr: number;
  xp: number;
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
  scaled: boolean;
}
