import type { AbilityBlock } from "../types";

export interface RaceDef {
  key: string;
  name: string;
  bonus: Partial<AbilityBlock>;
  speed: number;
  traits: string[];
  desc: string;
}

export const RACES: RaceDef[] = [
  { key: "humano", name: "Humano", bonus: { str: 1, dex: 1, con: 1, int: 1, wis: 1, cha: 1 }, speed: 9,
    traits: ["Versátil: +1 em todos os atributos", "Ambição: +5% de XP em missões" ],
    desc: "Adaptáveis e ambiciosos, os humanos dominam cidades, rotas comerciais e campos de batalha." },
  { key: "elfo", name: "Elfo", bonus: { dex: 2, int: 1 }, speed: 9,
    traits: ["Visão no escuro 18m", "Transe: 4h de meditação substituem o sono", "Sentidos Aguçados" ],
    desc: "Longevos e graciosos, elfos vivem em harmonia com magia e florestas anciãs." },
  { key: "elfo-noturno", name: "Elfo Sombrio (Drow)", bonus: { dex: 2, cha: 1 }, speed: 9,
    traits: ["Visão superior no escuro 36m", "Magia Drow: luzes dançantes,Globo de Darkness no nv.3", "Sensibilidade ao sol" ],
    desc: "Filhos das profundezas, mestres de intrigas, venenos e magia das trevas." },
  { key: "anao", name: "Anão", bonus: { con: 2, str: 1 }, speed: 7.5,
    traits: ["Visão no escuro 18m", "Resistência a veneno", "Proficiência com machados e martelos" ],
    desc: "Forjados na pedra, anões valem por dez em defesa de suas fortalezas e tesouros." },
  { key: "halfling", name: "Halfling", bonus: { dex: 2, cha: 1 }, speed: 7.5,
    traits: ["Sortudo: repete 1 natural em d20", "Bravura contra medo", "Agilidade Halfling" ],
    desc: "Pequenos, corajosos e absurdamente sortudos — nunca subestime um halfling faminto." },
  { key: "meio-orc", name: "Meio-Orc", bonus: { str: 2, con: 1 }, speed: 9,
    traits: ["Resistência Implacável: 1x/dia fica com 1 PV", "Ataques Selvagens: dado extra no crítico", "Visão no escuro" ],
    desc: "Herdeiros de fúria ancestral, meio-orcs sobrevivem onde qualquer outro cairia." },
  { key: "meio-elfo", name: "Meio-Elfo", bonus: { cha: 2, dex: 1, wis: 1 }, speed: 9,
    traits: ["Visão no escuro 18m", "Herança Feérica: vantagem contra encantamento", "Versatilidade" ],
    desc: "Entre dois mundos, meio-elfos são diplomatas naturais e aventureiros incansáveis." },
  { key: "tiefling", name: "Tiefling", bonus: { cha: 2, int: 1 }, speed: 9,
    traits: ["Resistência a fogo", "Herança Infernal: taumaturgia, repreensão infernal nv.3", "Visão no escuro" ],
    desc: "Sangue infernal corre em suas veias — chifres, cauda e um olhar que queima." },
  { key: "draconato", name: "Draconato", bonus: { str: 2, cha: 1 }, speed: 9,
    traits: ["Arma de sopro ancestral (2d6, cone/linha)", "Resistência elemental do dragão", "Presença intimidadora" ],
    desc: "Descendentes de dragões, carregam escamas, orgulho e o sopro de seus antepassados." },
  { key: "gnomo", name: "Gnomo", bonus: { int: 2, dex: 1 }, speed: 7.5,
    traits: ["Esperteza Gnômica: vantagem em INT/SAB/CAR vs magia", "Visão no escuro", "Inventividade" ],
    desc: "Curiosos e brilhantes, gnomos misturam engenhocas, ilusões e bom humor." },
  { key: "goblin", name: "Goblin", bonus: { dex: 2, con: 1 }, speed: 9,
    traits: ["Fúria Pequena: dano extra = nível 1x/descanso", "Fuga Ágil: desengajar como ação bônus", "Visão no escuro" ],
    desc: "Rápidos, traiçoeiros e surpreendentemente engenhosos quando sobrevivem tempo suficiente." },
];
