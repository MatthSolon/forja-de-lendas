export interface WeaponDef {
  id: string;
  name: string;
  damage: string;
  type: string;
  category: "simples" | "marcial";
  price: number;
  props: string[];
  ability: "str" | "dex" | "ambas";
}

export const WEAPONS: WeaponDef[] = [
  { id: "adaga", name: "Adaga", damage: "1d4", type: "perfurante", category: "simples", price: 2, props: ["Acuidade", "Arremesso 6/18m", "Leve"], ability: "ambas" },
  { id: "clava", name: "Clava", damage: "1d4", type: "concussão", category: "simples", price: 1, props: ["Leve"], ability: "str" },
  { id: "cajado", name: "Cajado", damage: "1d6", type: "concussão", category: "simples", price: 2, props: ["Versátil 1d8"], ability: "str" },
  { id: "funda", name: "Funda", damage: "1d4", type: "concussão", category: "simples", price: 1, props: ["Munição", "Distância 9/36m"], ability: "dex" },
  { id: "machadinha", name: "Machadinha", damage: "1d6", type: "cortante", category: "simples", price: 5, props: ["Leve", "Arremesso 6/18m"], ability: "str" },
  { id: "dardo", name: "Dardo", damage: "1d4", type: "perfurante", category: "simples", price: 0.5, props: ["Acuidade", "Arremesso 6/18m"], ability: "ambas" },
  { id: "lanca", name: "Lança", damage: "1d6", type: "perfurante", category: "simples", price: 1, props: ["Arremesso 6/18m", "Versátil 1d8"], ability: "str" },
  { id: "martelo-leve", name: "Martelo Leve", damage: "1d4", type: "concussão", category: "simples", price: 2, props: ["Leve", "Arremesso 6/18m"], ability: "str" },
  { id: "besta-leve", name: "Besta Leve", damage: "1d8", type: "perfurante", category: "simples", price: 25, props: ["Munição", "Distância 24/96m", "Recarga", "Duas mãos"], ability: "dex" },
  { id: "arco-curto", name: "Arco Curto", damage: "1d6", type: "perfurante", category: "simples", price: 25, props: ["Munição", "Distância 24/96m", "Duas mãos"], ability: "dex" },
  { id: "maca", name: "Maça", damage: "1d6", type: "concussão", category: "simples", price: 5, props: [], ability: "str" },
  { id: "espada-curta", name: "Espada Curta", damage: "1d6", type: "perfurante", category: "marcial", price: 10, props: ["Acuidade", "Leve"], ability: "ambas" },
  { id: "espada-longa", name: "Espada Longa", damage: "1d8", type: "cortante", category: "marcial", price: 15, props: ["Versátil 1d10"], ability: "str" },
  { id: "rapieira", name: "Rapieira", damage: "1d8", type: "perfurante", category: "marcial", price: 25, props: ["Acuidade"], ability: "ambas" },
  { id: "cimitarra", name: "Cimitarra", damage: "1d6", type: "cortante", category: "marcial", price: 25, props: ["Acuidade", "Leve"], ability: "ambas" },
  { id: "machado-batalha", name: "Machado de Batalha", damage: "1d8", type: "cortante", category: "marcial", price: 10, props: ["Versátil 1d10"], ability: "str" },
  { id: "martelo-guerra", name: "Martelo de Guerra", damage: "1d8", type: "concussão", category: "marcial", price: 15, props: ["Versátil 1d10"], ability: "str" },
  { id: "machado-grande", name: "Machado Grande", damage: "1d12", type: "cortante", category: "marcial", price: 30, props: ["Pesada", "Duas mãos"], ability: "str" },
  { id: "malho", name: "Malho", damage: "2d6", type: "concussão", category: "marcial", price: 10, props: ["Pesada", "Duas mãos"], ability: "str" },
  { id: "espada-grande", name: "Espadão", damage: "2d6", type: "cortante", category: "marcial", price: 50, props: ["Pesada", "Duas mãos"], ability: "str" },
  { id: "alabarda", name: "Alabarda", damage: "1d10", type: "cortante", category: "marcial", price: 20, props: ["Pesada", "Alcance 3m", "Duas mãos"], ability: "str" },
  { id: "arco-longo", name: "Arco Longo", damage: "1d8", type: "perfurante", category: "marcial", price: 50, props: ["Munição", "Distância 45/180m", "Pesada", "Duas mãos"], ability: "dex" },
  { id: "besta-pesada", name: "Besta Pesada", damage: "1d10", type: "perfurante", category: "marcial", price: 50, props: ["Munição", "Distância 30/120m", "Pesada", "Recarga", "Duas mãos"], ability: "dex" },
  { id: "chicote", name: "Chicote", damage: "1d4", type: "cortante", category: "marcial", price: 2, props: ["Acuidade", "Alcance 3m"], ability: "ambas" },
];

export interface ArmorDef {
  id: string;
  name: string;
  baseAc: number;
  category: "leve" | "media" | "pesada" | "escudo";
  dexBonus: "full" | "max2" | "none";
  price: number;
  strMin?: number;
  desc: string;
}

export const ARMORS: ArmorDef[] = [
  { id: "nenhuma", name: "Sem Armadura", baseAc: 10, category: "leve", dexBonus: "full", price: 0, desc: "Roupas de viagem simples." },
  { id: "acolchoada", name: "Acolchoada", baseAc: 11, category: "leve", dexBonus: "full", price: 5, desc: "Camadas de tecido reforçado." },
  { id: "couro", name: "Couro", baseAc: 11, category: "leve", dexBonus: "full", price: 10, desc: "Peitoral e ombreiras de couro curtido." },
  { id: "couro-batido", name: "Couro Batido", baseAc: 12, category: "leve", dexBonus: "full", price: 45, desc: "Couro reforçado com rebites de metal." },
  { id: "camuflagem", name: "Camisa de Malha Leve", baseAc: 13, category: "media", dexBonus: "max2", price: 50, desc: "Anéis entrelaçados sob as roupas." },
  { id: "brunea", name: "Brunea", baseAc: 14, category: "media", dexBonus: "max2", price: 50, desc: "Couraça de couro com placas metálicas sobrepostas." },
  { id: "peitoral", name: "Peitoral", baseAc: 14, category: "media", dexBonus: "max2", price: 400, desc: "Peitoral de aço moldado, confortável e resistente." },
  { id: "meia-armadura", name: "Meia Armadura", baseAc: 15, category: "media", dexBonus: "max2", price: 750, desc: "Placas parciais sobre cota de malha." },
  { id: "cota-aneis", name: "Cota de Anéis", baseAc: 14, category: "pesada", dexBonus: "none", price: 30, desc: "Anéis de metal costurados em couro pesado." },
  { id: "cota-malha", name: "Cota de Malha", baseAc: 16, category: "pesada", dexBonus: "none", price: 75, strMin: 13, desc: "Malha completa de anéis forjados." },
  { id: "talhar", name: "Armadura Talhada", baseAc: 17, category: "pesada", dexBonus: "none", price: 200, strMin: 15, desc: "Placas articuladas em pontos vitais." },
  { id: "placas", name: "Armadura de Placas", baseAc: 18, category: "pesada", dexBonus: "none", price: 1500, strMin: 15, desc: "Aço completo dos pés à cabeça. Uma fortaleza ambulante." },
  { id: "escudo", name: "Escudo", baseAc: 2, category: "escudo", dexBonus: "none", price: 10, desc: "+2 de CA como item à parte." },
];

export interface ItemDef { id: string; name: string; price: number; desc: string; heal?: string; }

export const ITEMS: ItemDef[] = [
  { id: "pocao-cura", name: "Poção de Cura", price: 50, desc: "Recupera 2d4+2 PV ao beber (ação).", heal: "2d4+2" },
  { id: "pocao-cura-maior", name: "Poção de Cura Maior", price: 150, desc: "Recupera 4d4+4 PV.", heal: "4d4+4" },
  { id: "pocao-cura-sup", name: "Poção de Cura Superior", price: 500, desc: "Recupera 8d4+8 PV.", heal: "8d4+8" },
  { id: "pocao-forca", name: "Poção de Força do Gigante", price: 900, desc: "FOR 21 por 1 hora." },
  { id: "antitoxina", name: "Antitoxina", price: 50, desc: "Vantagem contra venenos por 1 hora." },
  { id: "corda", name: "Corda de Cânhamo (15m)", price: 1, desc: "Clássica solucionadora de problemas." },
  { id: "tocha", name: "Tocha", price: 0.2, desc: "Luz por 1 hora; 1 de dano de fogo improvisado." },
  { id: "kit-curandeiro", name: "Kit de Curandeiro", price: 5, desc: "10 usos para estabilizar moribundos sem teste." },
  { id: "ferramentas-ladrao", name: "Ferramentas de Ladrão", price: 25, desc: "Abre fechaduras e desarma armadilhas." },
  { id: "simbolo-sagrado", name: "Símbolo Sagrado", price: 5, desc: "Foco divino para conjuração." },
  { id: "grimorio-vazio", name: "Grimório Virgem", price: 50, desc: "50 páginas de pergaminho para copiar magias." },
  { id: "mochila-aventureiro", name: "Kit do Aventureiro", price: 12, desc: "Mochila, cantil, rações (10), pederneira, cobertor." },
  { id: "veneno-basico", name: "Veneno Básico", price: 100, desc: "1 aplicação: +1d4 veneno em arma c/c por 1 min (CON 10).", heal: "1d4" },
  { id: "bomba-fumaca", name: "Bomba de Fumaça", price: 30, desc: "Área de 3m fortemente obscurecida por 1 minuto." },
  { id: "grilhoes", name: "Grilhões de Ferro", price: 2, desc: "Para prisioneiros cooperativos demais." },
];

export function getWeapon(id?: string): WeaponDef | undefined {
  return WEAPONS.find((w) => w.id === id);
}
export function getArmor(id?: string): ArmorDef | undefined {
  return ARMORS.find((a) => a.id === id);
}

import { mod } from "../game";
import type { AbilityBlock } from "../types";

// Calcula CA final com base na armadura equipada (+ escudo opcional)
export function computeAc(armorId: string | undefined, stats: AbilityBlock, shield: boolean): number {
  if (stats.dex >= 99) return 10; // classe com defesa especial tratada fora
  const armor = getArmor(armorId ?? "nenhuma") ?? ARMORS[0];
  if (armor.category === "escudo") return 10;
  const dex = mod(stats.dex);
  const bonus = armor.dexBonus === "full" ? dex : armor.dexBonus === "max2" ? Math.min(2, dex) : 0;
  return armor.baseAc + bonus + (shield ? 2 : 0);
}
