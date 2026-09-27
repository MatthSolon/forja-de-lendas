import type { AbilityBlock } from "../types";

export interface ClassFeature {
  level: number;
  name: string;
  text: string;
}

export interface SubclassDef {
  key: string;
  name: string;
  desc: string;
  features: ClassFeature[];
}

export interface ComboDef {
  name: string;
  req: string;
  desc: string;
  rolls: { label: string; expr: string }[];
}

export interface ClassDef {
  key: string;
  name: string;
  hitDie: number;
  primary: (keyof AbilityBlock)[];
  saves: (keyof AbilityBlock)[];
  caster: "full" | "half" | "pact" | null;
  spellAbility?: keyof AbilityBlock;
  desc: string;
  flavor: string;
  armor: string;
  subclasses: SubclassDef[];
  features: ClassFeature[];
  combos: ComboDef[];
  gear: { weapons: string[]; armor: string; gold: number };
}

export const CLASSES: ClassDef[] = [
  {
    key: "guerreiro", name: "Guerreiro", hitDie: 10, primary: ["str", "dex"], saves: ["str", "con"],
    caster: null, desc: "Mestre de armas e táticas, o guerreiro vence pela disciplina e pelo aço.",
    flavor: "O campo de batalha é sua casa; cada cicatriz é uma lição.", armor: "Todas as armaduras e escudos",
    subclasses: [
      { key: "campeao", name: "Campeão", desc: "Atleta supremo de força bruta e precisão devastadora.", features: [
        { level: 3, name: "Crítico Aprimorado", text: "Crítico com 19-20 nas jogadas de ataque." },
        { level: 7, name: "Atleta Notável", text: "+metade do bônus de proficiência em testes físicos; salto ampliado." },
        { level: 15, name: "Crítico Superior", text: "Crítico com 18-20 nas jogadas de ataque." } ] },
      { key: "mestre-batalha", name: "Mestre de Batalha", desc: "Estrategista que usa manobras para dominar o combate.", features: [
        { level: 3, name: "Manobras", text: "4 dados de superioridade (d8): Desarmar, Derrubar, Ripostar, Provocar." },
        { level: 7, name: "Conheça seu Inimigo", text: "Avalia força relativa do oponente após observá-lo por 1 minuto." },
        { level: 15, name: "Implacável", text: "Recupera 1 dado de superioridade ao rolar iniciativa sem nenhum." } ] },
      { key: "cavaleiro-arcano", name: "Cavaleiro Arcano", desc: "Combina esgrima com magia de evocação e abjuração.", features: [
        { level: 3, name: "Conjuração", text: "Conjura truques e magias de até 4º círculo (INT)." },
        { level: 7, name: "Golpe de Guerra", text: "Ao conjurar truque, realiza 1 ataque como ação bônus." },
        { level: 15, name: "Golpe Arcano", text: "Alvo atingido tem desvantagem no próximo teste contra suas magias." } ] },
    ],
    features: [
      { level: 1, name: "Estilo de Luta", text: "Escolha: Defesa (+1 CA), Duelo (+2 dano), Armas Grandes (repete 1-2), Arquearia (+2 ataque)." },
      { level: 1, name: "Retomar o Fôlego", text: "1x/descanso: cura 1d10 + nível como ação bônus." },
      { level: 2, name: "Surto de Ação", text: "1x/descanso: uma ação extra no turno." },
      { level: 5, name: "Ataque Extra", text: "Ataca 2 vezes por ação (3 no nv.11, 4 no nv.20)." },
      { level: 9, name: "Indomável", text: "Repete uma jogada de proteção falha 1x/descanso." },
    ],
    combos: [
      { name: "Investida Esmagadora", req: "Surto de Ação disponível", desc: "Avança e desfere 4 ataques em sequência com Surto de Ação.", rolls: [ { label: "Ataque 1", expr: "1d20" }, { label: "Ataque 2", expr: "1d20" }, { label: "Ataque 3 (Surto)", expr: "1d20" }, { label: "Ataque 4 (Surto)", expr: "1d20" } ] },
      { name: "Derrubar + Execução", req: "Manobra Derrubar", desc: "Derruba o alvo e ataca com vantagem enquanto está caído.", rolls: [ { label: "Manobra", expr: "1d20+1d8" }, { label: "Ataque c/ vantagem", expr: "1d20" } ] },
      { name: "Fôlego do Campeão", req: "Retomar o Fôlego", desc: "Cura rápida mantendo a pressão ofensiva.", rolls: [ { label: "Cura", expr: "1d10" } ] },
    ],
    gear: { weapons: ["espada-longa", "machado-grande", "arco-longo"], armor: "cota-malha", gold: 120 },
  },
  {
    key: "barbaro", name: "Bárbaro", hitDie: 12, primary: ["str"], saves: ["str", "con"],
    caster: null, desc: "Fúria primal em forma humana. Quanto mais sangue, mais forte fica.",
    flavor: "A civilização o chama de selvagem. Os inimigos o chamam de pesadelo.", armor: "Leves, médias e escudos",
    subclasses: [
      { key: "furioso", name: "Caminho do Furioso", desc: "Fúria pura, sem frenesi ou controle — apenas destruição.", features: [
        { level: 3, name: "Frenesi", text: "Em fúria frenética, ataque extra como ação bônus." },
        { level: 6, name: "Fúria Irracional", text: "Fúria não pode ser encerrada por encantamento." },
        { level: 14, name: "Retaliação", text: "Ao ser atingido, reage com um ataque corpo a corpo." } ] },
      { key: "totemico", name: "Caminho do Totem", desc: "Espíritos animais guiam seus golpes e protegem sua alma.", features: [
        { level: 3, name: "Espírito Totêmico", text: "Urso: resistência a quase todo dano; Águia: mobilidade; Lobo: aliados atacam melhor." },
        { level: 6, name: "Aspecto da Fera", text: "Sentidos e força sobrenaturais do totem." },
        { level: 14, name: "Sintonia Totêmica", text: "Poder final do animal guardião em combate." } ] },
      { key: "ancestral", name: "Ancestral Guardião", desc: "Espíritos dos antepassados lutam ao seu lado.", features: [
        { level: 3, name: "Protetores Ancestrais", text: "Primeiro alvo atingido tem desvantagem contra seus aliados." },
        { level: 6, name: "Escudo Espiritual", text: "Reação reduz dano em aliado em 2d6." },
        { level: 14, name: "Vingança Ancestral", text: "Os espíritos revidam 3d6 de dano energético." } ] },
    ],
    features: [
      { level: 1, name: "Fúria", text: "+2 dano corpo a corpo, resistência a dano físico, vantagem em FOR. 2-6 usos/descanso longo." },
      { level: 1, name: "Defesa sem Armadura", text: "CA = 10 + DES + CON sem armadura." },
      { level: 2, name: "Ataque Imprudente", text: "Vantagem nos ataques, mas inimigos têm vantagem em você." },
      { level: 5, name: "Ataque Extra", text: "Ataca 2 vezes por ação." },
      { level: 7, name: "Instinto Selvagem", text: "Vantagem na iniciativa; não pode ser surpreendido." },
    ],
    combos: [
      { name: "Fúria Assassina", req: "Fúria ativa + Ataque Imprudente", desc: "Ataque imprudente com dano de fúria em ambos os golpes.", rolls: [ { label: "Ataque 1", expr: "1d20" }, { label: "Ataque 2", expr: "1d20" }, { label: "Dano + Fúria", expr: "1d12+2" } ] },
      { name: "Esmagamento Selvagem", req: "Arma de duas mãos", desc: "Golpe pesado com a margem de crítico do meio-orc / brutal.", rolls: [ { label: "Ataque", expr: "1d20" }, { label: "Dano", expr: "2d6+2" } ] },
      { name: "Carga do Urso", req: "Totem do Urso", desc: "Avança entre inimigos absorvendo dano e derrubando o alvo.", rolls: [ { label: "Ataque", expr: "1d20" }, { label: "Derrubar", expr: "1d20" } ] },
    ],
    gear: { weapons: ["machado-grande", "malho", "machadinha"], armor: "couro", gold: 80 },
  },
  {
    key: "mago", name: "Mago", hitDie: 6, primary: ["int"], saves: ["int", "wis"],
    caster: "full", spellAbility: "int", desc: "Erudito do arcano. Cada página do grimório é uma arma.",
    flavor: "O conhecimento é o único poder que não enferruja.", armor: "Nenhuma",
    subclasses: [
      { key: "evocacao", name: "Escola de Evocação", desc: "Mestre da destruição elemental pura.", features: [
        { level: 2, name: "Esculpir Magia", text: "Aliados salvam automaticamente de suas evocações." },
        { level: 6, name: "Evocação Potente", text: "+INT de dano em magias de evocação." },
        { level: 14, name: "Sobrecarregar", text: "Maximiza o dano de uma magia de até 5º círculo." } ] },
      { key: "ilusao", name: "Escola de Ilusão", desc: "Dobra a realidade até ninguém saber o que é real.", features: [
        { level: 2, name: "Ilusão Aprimorada", text: "Truque de ilusão aprimorado; 1 truque extra." },
        { level: 6, name: "Duplicata Ilusória", text: "Desvia um ataque por descanso com imagem espelhada." },
        { level: 14, name: "Realidade Ilusória", text: "Torna parte de uma ilusão real por 1 minuto." } ] },
      { key: "necromancia", name: "Escola de Necromancia", desc: "A morte é apenas o começo do serviço.", features: [
        { level: 2, name: "Colheita Sombria", text: "Cura PV ao matar com magia de necromancia." },
        { level: 6, name: "Servos Imortais", text: "Mortos-vivos animados têm PV e dano extras." },
        { level: 14, name: "Comandar Mortos", text: "Assume controle permanente de um morto-vivo inimigo." } ] },
    ],
    features: [
      { level: 1, name: "Recuperação Arcana", text: "1x/dia recupera espaços de magia somados = metade do nível." },
      { level: 1, name: "Grimório", text: "Registra magias encontradas; prepara INT + nível por dia." },
      { level: 5, name: "3º Círculo", text: "Acesso a magias de 3º círculo (bola de fogo!)." },
      { level: 11, name: "6º Círculo", text: "Acesso a magias de 6º círculo." },
      { level: 18, name: "Domínio Arcano", text: "Conjura magias de 1º-2º círculo à vontade." },
    ],
    combos: [
      { name: "Bola de Fogo Tática", req: "Magia de 3º círculo", desc: "Evocação esculpida protege aliados na área da explosão.", rolls: [ { label: "Dano (8d6)", expr: "8d6" } ] },
      { name: "Raio + Truque", req: "Ação + ação bônus", desc: "Raio ardente seguido de raio de gelo como truque.", rolls: [ { label: "Raio Ardente", expr: "1d20" }, { label: "Dano", expr: "2d6" }, { label: "Truque", expr: "1d10" } ] },
      { name: "Contra-mágica Perfeita", req: "Reação disponível", desc: "Anula a magia inimiga no último segundo.", rolls: [ { label: "Teste de INT", expr: "1d20" } ] },
    ],
    gear: { weapons: ["adaga", "cajado"], armor: "nenhuma", gold: 100 },
  },
  {
    key: "clerigo", name: "Clérigo", hitDie: 8, primary: ["wis"], saves: ["wis", "cha"],
    caster: "full", spellAbility: "wis", desc: "Canal do poder divino: cura, protege e esmaga profanos.",
    flavor: "Sua fé não é esperança — é arma carregada.", armor: "Leves, médias, pesadas e escudos",
    subclasses: [
      { key: "vida", name: "Domínio da Vida", desc: "A cura suprema; ninguém cai enquanto ele estiver de pé.", features: [
        { level: 1, name: "Discípulo da Vida", text: "Magias de cura +2 + círculo da magia em PV." },
        { level: 2, name: "Preservar Vida", text: "Canal Divino: cura 5x nível dividida entre aliados." },
        { level: 8, name: "Golpe Divino", text: "+1d8 radiante em ataques com arma 1x/turno." } ] },
      { key: "luz", name: "Domínio da Luz", desc: "Chama sagrada que queima trevas e hereges.", features: [
        { level: 1, name: "Truque da Luz", text: "Ganha o truque luz; fúria protetora com luz." },
        { level: 2, name: "Clarão Radiante", text: "Canal Divino: 2d10 + nível de dano radiante em área." },
        { level: 8, name: "Golpe Potente", text: "+1d8 radiante nos ataques com arma." } ] },
      { key: "guerra", name: "Domínio da Guerra", desc: "Sacerdote de batalha, bênção na ponta da maça.", features: [
        { level: 1, name: "Bônus de Guerra", text: "Ataque extra como ação bônus (SAB vezes/descanso)." },
        { level: 2, name: "Golpe Guiado", text: "Canal Divino: +10 em jogada de ataque." },
        { level: 8, name: "Golpe Divino", text: "+1d8 de dano da arma 1x/turno." } ] },
    ],
    features: [
      { level: 1, name: "Conjuração Divina", text: "Prepara magias de clérigo = SAB + nível." },
      { level: 2, name: "Canal Divino", text: "Expulsar mortos-vivos + efeito do domínio." },
      { level: 5, name: "Destruir Mortos-Vivos", text: "Expulsar destrói mortos-vivos de ND baixo." },
      { level: 10, name: "Intervenção Divina", text: "1x/semana: seu deus interfere (d100 ≤ nível)." },
    ],
    combos: [
      { name: "Martelo Sagrado", req: "Canal Divino + ataque", desc: "Golpe guiado com golpe divino radiante.", rolls: [ { label: "Ataque", expr: "1d20" }, { label: "Dano", expr: "1d8+1d8" } ] },
      { name: "Onda Curadora", req: "Destino: Preservar Vida", desc: "Cura em massa para erguer o grupo da beira da morte.", rolls: [ { label: "Cura total", expr: "5d10" } ] },
      { name: "Clarão Purificador", req: "Domínio da Luz", desc: "Explosão radiante que desintegra mortos-vivos.", rolls: [ { label: "Dano radiante", expr: "2d10" } ] },
    ],
    gear: { weapons: ["maca", "martelo-guerra"], armor: "cota-malha", gold: 110 },
  },
  {
    key: "ladino", name: "Ladino", hitDie: 8, primary: ["dex"], saves: ["dex", "int"],
    caster: null, desc: "Precisão cirúrgica, sombras e oportunismo letal.",
    flavor: "A morte chega em silêncio, pelas costas, com um sorriso.", armor: "Leves",
    subclasses: [
      { key: "assassino", name: "Assassino", desc: "Mestre dos disfarces e do primeiro golpe mortal.", features: [
        { level: 3, name: "Assassinar", text: "Vantagem contra quem ainda não agiu; crítico em surpresa." },
        { level: 9, name: "Infiltração", text: "Cria identidades falsas impecáveis." },
        { level: 17, name: "Golpe da Morte", text: "Alvo surpreso: dano dobrado (CD CON anula)." } ] },
      { key: "trapaceiro", name: "Trapaceiro Arcano", desc: "Ladrão de magia: mistura truques com malandragem.", features: [
        { level: 3, name: "Conjuração", text: "Aprende magias de mago de encantamento/ilusão." },
        { level: 3, name: "Mão Invisível Versátil", text: "Mão mágica pode roubar e plantar itens." },
        { level: 9, name: "Emboscada Mágica", text: "Alvos têm desvantagem se você estiver escondido." } ] },
      { key: "lamina", name: "Lâmina Sombria", desc: "Duelista das sombras que luta em duas frentes.", features: [
        { level: 3, name: "Golpe Sombrio", text: "Ataque Furtivo sem aliado próximo em combate 1v1." },
        { level: 9, name: "Panache", text: "Enfeitiça ou provoca com pura lábia." },
        { level: 17, name: "Mestre Duelista", text: "Repete um ataque perdido 1x/descanso." } ] },
    ],
    features: [
      { level: 1, name: "Ataque Furtivo", text: "+1d6 de dano com vantagem/aliado adjacente (sobe 1d6 a cada 2 níveis)." },
      { level: 1, name: "Especialização", text: "Dobra proficiência em 2 perícias." },
      { level: 2, name: "Ação Ardilosa", text: "Disparar, Desengajar ou Esconder como ação bônus." },
      { level: 5, name: "Esquiva Sobrenatural", text: "Reação: reduz dano de ataque que você vê pela metade." },
      { level: 7, name: "Evasão", text: "Sucesso em DES = 0 dano em área; falha = metade." },
    ],
    combos: [
      { name: "Emboscada Perfeita", req: "Escondido + Ataque Furtivo", desc: "Ataque furtivo crítico de assassinato saindo das sombras.", rolls: [ { label: "Ataque", expr: "1d20" }, { label: "Dano Furtivo", expr: "1d6+3d6" } ] },
      { name: "Sumir e Apunhalar", req: "Ação Ardilosa", desc: "Ataca, esconde-se como bônus e prepara o próximo furtivo.", rolls: [ { label: "Ataque", expr: "1d20" }, { label: "Furtividade", expr: "1d20" } ] },
      { name: "Lâminas Gêmeas", req: "Duas adagas", desc: "Ataque com a arma da mão inábil somando veneno.", rolls: [ { label: "Ataque 1", expr: "1d20" }, { label: "Ataque 2", expr: "1d20" }, { label: "Veneno", expr: "2d6" } ] },
    ],
    gear: { weapons: ["adaga", "rapieira", "arco-curto"], armor: "couro", gold: 140 },
  },
  {
    key: "paladino", name: "Paladino", hitDie: 10, primary: ["str", "cha"], saves: ["wis", "cha"],
    caster: "half", spellAbility: "cha", desc: "Juramento sagrado blindado em aço e fé.",
    flavor: "Onde ele pisa, as trevas recuam meio metro.", armor: "Todas as armaduras e escudos",
    subclasses: [
      { key: "devocao", name: "Juramento de Devoção", desc: "O clássico cavaleiro da luz e da honra.", features: [
        { level: 3, name: "Arma Sagrada", text: "Canal: +CAR em ataques com a arma por 1 minuto." },
        { level: 7, name: "Aura de Devoção", text: "Aliados próximos imunes a enfeitiçamento." },
        { level: 20, name: "Nimbus Sagrado", text: "Forma radiante: dano em inimigos ao redor e vantagem." } ] },
      { key: "vinganca", name: "Juramento de Vingança", desc: "Sem piedade para com os perversos.", features: [
        { level: 3, name: "Voto de Inimizade", text: "Canal: vantagem contra inimigo declarado." },
        { level: 7, name: "Vingador Implacável", text: "Reação: move-se após ataque de oportunidade." },
        { level: 20, name: "Anjo Vingador", text: "Asas espectrais e aura de terror por 1 hora." } ] },
      { key: "corrompido", name: "Juramento Quebrado", desc: "Paladino caído que abraçou a escuridão.", features: [
        { level: 3, name: "Toque Necrótico", text: "Canal: dano necrótico e controle de mortos-vivos." },
        { level: 7, name: "Aura de Ódio", text: "+CAR de dano corpo a corpo para si e aliados malignos." },
        { level: 20, name: "Senhor Sombrio", text: "Forma de trevas com resistência e terror." } ] },
    ],
    features: [
      { level: 1, name: "Sentido Divino", text: "Detecta celestiais, ímpios e mortos-vivos." },
      { level: 1, name: "Impor as Mãos", text: "Reserva de cura = 5x nível PV; remove doenças/venenos." },
      { level: 2, name: "Golpe Divino", text: "Gasta espaço de magia: +2d8 radiante (+1d8 por círculo)." },
      { level: 3, name: "Saúde Divina", text: "Imune a doenças." },
      { level: 6, name: "Aura de Proteção", text: "+CAR em salvaguardas de você e aliados a até 3m." },
    ],
    combos: [
      { name: "Julgamento Radiante", req: "Espaço de magia 2º+", desc: "Crítico com Golpe Divino de alto círculo: rajada de luz devastadora.", rolls: [ { label: "Ataque", expr: "1d20" }, { label: "Golpe Divino", expr: "2d8+3d8" } ] },
      { name: "Sentença do Vingador", req: "Voto de Inimizade", desc: "Vantagem permanente no alvo do juramento + golpe divino.", rolls: [ { label: "Ataque 1", expr: "1d20" }, { label: "Ataque 2", expr: "1d20" } ] },
      { name: "Baluarte da Fé", req: "Impor as Mãos", desc: "Cura aliado caído e mantém a linha de frente.", rolls: [ { label: "Cura", expr: "5d4" } ] },
    ],
    gear: { weapons: ["espada-longa", "malho", "alabarda"], armor: "cota-malha", gold: 100 },
  },
  {
    key: "patrulheiro", name: "Patrulheiro", hitDie: 10, primary: ["dex", "wis"], saves: ["str", "dex"],
    caster: "half", spellAbility: "wis", desc: "Caçador das fronteiras, senhor das trilhas e da flecha certeira.",
    flavor: "A floresta inteira é sua aliada — e sua armadilha.", armor: "Leves, médias e escudos",
    subclasses: [
      { key: "cacador", name: "Caçador", desc: "Especialista em abater presas grandes ou enxames.", features: [
        { level: 3, name: "Presa do Caçador", text: "Colosso: +1d8; Matador: ataque em área; Horda: 1 ataque extra." },
        { level: 7, name: "Tática Defensiva", text: "Escapar da Horda ou Defesa Multiataque." },
        { level: 15, name: "Defesa Superior", text: "Esquiva sobrenatural ou viagem plana." } ] },
      { key: "mestre-feras", name: "Mestre das Feras", desc: "Luta lado a lado com um companheiro animal.", features: [
        { level: 3, name: "Companheiro Animal", text: "Lobo, urso, águia ou pantera com vínculo mágico." },
        { level: 7, name: "Treinamento Excepcional", text: "Companheiro age com bônus de proficiência pleno." },
        { level: 15, name: "Fúria Compartilhada", text: "Vocês atacam em sincronia perfeita." } ] },
      { key: "rastreador", name: "Rastreador Sombrio", desc: "Caçador da escuridão, terror das criaturas subterrâneas.", features: [
        { level: 3, name: "Emboscada Umbral", text: "Primeiro turno: +10 deslocamento, ataque extra +1d8." },
        { level: 3, name: "Visão Umbral", text: "Visão no escuro 18m; invisível no escuro para visão noturna." },
        { level: 11, name: "Mente de Ferro", text: "Proficiência em salvaguardas de SAB." } ] },
    ],
    features: [
      { level: 1, name: "Inimigo Favorito", text: "Vantagem ao rastrear e conhecer um tipo de criatura." },
      { level: 1, name: "Explorador Natural", text: "Nunca se perde; grupo viaja em silêncio total." },
      { level: 2, name: "Estilo de Combate", text: "Arquearia (+2 ataque à distância) ou Duas Armas." },
      { level: 5, name: "Ataque Extra", text: "Ataca 2 vezes por ação." },
      { level: 8, name: "Terreno Predileto", text: "Segunda especialização de terreno." },
    ],
    combos: [
      { name: "Chuva de Flechas", req: "Marca do Caçador ativa", desc: "Múltiplos ataques à distância com dano de marca somado.", rolls: [ { label: "Flecha 1", expr: "1d20" }, { label: "Flecha 2", expr: "1d20" }, { label: "Marca", expr: "1d6" } ] },
      { name: "Presa e Fera", req: "Mestre das Feras", desc: "Você e seu companheiro atacam flanqueando a vítima.", rolls: [ { label: "Seu ataque", expr: "1d20" }, { label: "Ataque da fera", expr: "1d20" }, { label: "Dano da fera", expr: "2d4+2" } ] },
      { name: "Emboscada Umbral", req: "Rastreador Sombrio nv.3", desc: "Primeiro turno: ataque extra com dano adicional.", rolls: [ { label: "Ataque 1", expr: "1d20" }, { label: "Ataque 2", expr: "1d20" }, { label: "Bônus umbral", expr: "1d8" } ] },
    ],
    gear: { weapons: ["arco-longo", "espada-curta", "adaga"], armor: "couro-batido", gold: 110 },
  },
  {
    key: "bardo", name: "Bardo", hitDie: 8, primary: ["cha"], saves: ["dex", "cha"],
    caster: "full", spellAbility: "cha", desc: "A música é magia; a palavra é lâmina; o palco é o mundo.",
    flavor: "Heróis morrem. Canções sobre eles, jamais.", armor: "Leves",
    subclasses: [
      { key: "conhecimento", name: "Colégio do Conhecimento", desc: "Sabe de tudo — inclusive o que você esconde.", features: [
        { level: 3, name: "Palavras Cortantes", text: "Reação: subtrai dado de inspiração da rolagem inimiga." },
        { level: 6, name: "Segredos Mágicos", text: "2 magias de qualquer lista de classe." },
        { level: 14, name: "Sabedoria Inigualável", text: "Adiciona inspiração aos próprios testes de perícia." } ] },
      { key: "valor", name: "Colégio do Valor", desc: "Skalde de guerra: inspira com a espada na mão.", features: [
        { level: 3, name: "Proficiência Marcial", text: "Armaduras médias, escudos e armas marciais." },
        { level: 3, name: "Inspiração de Combate", text: "Inspiração também aumenta dano ou CA." },
        { level: 6, name: "Ataque Extra", text: "Ataca 2 vezes por ação." } ] },
      { key: "laminas", name: "Colégio das Lâminas", desc: "Dança mortal de adagas floreadas.", features: [
        { level: 3, name: "Florescer de Lâminas", text: "Ataque com duas armas + floreios especiais." },
        { level: 6, name: "Floreio Defensivo", text: "Joga adaga e ganha CA igual ao dano rolado." },
        { level: 14, name: "Floreio Mestre", text: "Dados de floreio viram d6 garantidos." } ] },
    ],
    features: [
      { level: 1, name: "Inspiração Bárdica", text: "d6 (cresce com nível) para aliados somarem em rolagens." },
      { level: 1, name: "Conjuração", text: "Magias de bardo usando CAR." },
      { level: 2, name: "Versatilidade", text: "+metade da proficiência em testes sem proficiência." },
      { level: 2, name: "Canção de Descanso", text: "Aliados curam +1d6 em descanso curto." },
      { level: 5, name: "Fonte de Inspiração", text: "Recupera inspirações em descanso curto." },
    ],
    combos: [
      { name: "Insulto Devastador", req: "Palavra Zombeteira (truque)", desc: "Zombaria mágica que fere a alma e atrapalha o ataque.", rolls: [ { label: "Dano psíquico", expr: "1d4" } ] },
      { name: "Sinfonia de Batalha", req: "Inspiração de Combate", desc: "Inspira aliado e ataca na mesma cadência.", rolls: [ { label: "Ataque", expr: "1d20" }, { label: "Inspiração", expr: "1d6" } ] },
      { name: "Gesto Final", req: "Magia hipnótica", desc: "Padrão hipnótico encerra um combate inteiro de uma vez.", rolls: [ { label: "CD da magia", expr: "1d20" } ] },
    ],
    gear: { weapons: ["rapieira", "adaga", "besta-leve"], armor: "couro", gold: 130 },
  },
  {
    key: "bruxo", name: "Bruxo", hitDie: 8, primary: ["cha"], saves: ["wis", "cha"],
    caster: "pact", spellAbility: "cha", desc: "Pacto com entidades antigas em troca de poder proibido.",
    flavor: "Todo poder tem um preço. Ele já assinou o contrato.", armor: "Leves",
    subclasses: [
      { key: "arquifada", name: "Pacto da Arquifada", desc: "Servo do povo das fadas: encantamento e ilusão.", features: [
        { level: 1, name: "Presença Feérica", text: "Enfeitiça ou amedronta criaturas em área 1x/descanso." },
        { level: 6, name: "Fuga Nebulosa", text: "Teleporta ao sofrer dano (1x/descanso curto)." },
        { level: 14, name: "Delírios Sombrios", text: "Cria ilusões dos piores medos do alvo." } ] },
      { key: "corruptor", name: "Pacto do Corruptor", desc: "Poder infernal: fogo, maldições e carisma sombrio.", features: [
        { level: 1, name: "Bênção Sombria", text: "Cura ao derrubar inimigos." },
        { level: 6, name: "Sorte do Corruptor", text: "Adiciona d10 em uma salvaguarda 1x/descanso." },
        { level: 14, name: "Arremesso Infernal", text: "Teleporta inimigo atingido para o inferno por 1 turno." } ] },
      { key: "antigo", name: "Pacto do Ancião", desc: "Conhecimento proibido de entidades além do véu.", features: [
        { level: 1, name: "Mente Desperta", text: "Telepatia de 9m com qualquer criatura." },
        { level: 6, name: "Barreira Entrópica", text: "Reação impõe desvantagem em ataque contra você." },
        { level: 14, name: "Criar Servo", text: "Anula dano e fica atordoado absorvendo conhecimento proibido." } ] },
    ],
    features: [
      { level: 1, name: "Rajada Mística", text: "O melhor truque do jogo: 1d10 (múltiplos raios com nível), força = CAR." },
      { level: 1, name: "Magia de Pacto", text: "Poucos espaços, mas sempre no círculo máximo e recuperam em descanso curto." },
      { level: 2, name: "Invocações Místicas", text: "Personaliza rajadas, visão, armadura das sombras." },
      { level: 3, name: "Dádiva do Pacto", text: "Lâmina / Corrente familiar / Tomo de segredos." },
      { level: 11, name: "Arcano Místico", text: "Uma magia de 6º+ círculo 1x/dia sem gastar espaço." },
    ],
    combos: [
      { name: "Barragem Mística", req: "Rajada Mística + Agonizante", desc: "Múltiplos raios com CAR somado ao dano e repulsão.", rolls: [ { label: "Raio 1", expr: "1d20" }, { label: "Raio 2", expr: "1d20" }, { label: "Dano 1", expr: "1d10" }, { label: "Dano 2", expr: "1d10" } ] },
      { name: "Pacto da Lâmina", req: "Dádiva do Pacto: Lâmina", desc: "Arma pactuada com Hex ativo: dano massivo consistente.", rolls: [ { label: "Ataque", expr: "1d20" }, { label: "Dano + Hex", expr: "1d8+1d6" } ] },
      { name: "Bênção do Corruptor", req: "Derrubar inimigo", desc: "Ao matar, drena vida e mantém a sequência de abates.", rolls: [ { label: "Cura", expr: "2d6" } ] },
    ],
    gear: { weapons: ["adaga", "cajado", "besta-leve"], armor: "couro", gold: 90 },
  },
  {
    key: "feiticeiro", name: "Feiticeiro", hitDie: 6, primary: ["cha"], saves: ["con", "cha"],
    caster: "full", spellAbility: "cha", desc: "Magia corre no sangue — ele não aprende, ele É a magia.",
    flavor: "O grimório dos outros é o reflexo no espelho dele.", armor: "Nenhuma",
    subclasses: [
      { key: "draconico", name: "Linhagem Dracônica", desc: "Sangue de dragão: escamas, resistência e sopro arcano.", features: [
        { level: 1, name: "Resiliência Dracônica", text: "PV máximo +1/nível; CA 13+DES sem armadura." },
        { level: 6, name: "Afinidade Elemental", text: "+CAR de dano no elemento do ancestral." },
        { level: 14, name: "Asas Dracônicas", text: "Voo de 18m como ação bônus." } ] },
      { key: "caotica", name: "Magia Caótica", desc: "A realidade se curva — às vezes até na direção certa.", features: [
        { level: 1, name: "Surto Caótico", text: "Efeitos aleatórios após magias (tabela do mestre)." },
        { level: 1, name: "Marés do Caos", text: "Vantagem em uma rolagem 1x/descanso; recarrega com surtos." },
        { level: 14, name: "Caos Controlado", text: "Rola 2 vezes na tabela de surtos e escolhe." } ] },
      { key: "sombria", name: "Magia Sombria", desc: "Sangue tocado pelo Plano das Sombras.", features: [
        { level: 1, name: "Olhos da Escuridão", text: "Visão no escuro 36m; conjura escuridão vendo através." },
        { level: 3, name: "Força do Sombrio", text: "Ao cair a 0 PV: teste de CAR para ficar de pé." },
        { level: 14, name: "Forma Sombria", text: "Resistência a todo dano exceto radiante." } ] },
    ],
    features: [
      { level: 2, name: "Pontos de Feitiçaria", text: "Converte em espaços de magia ou metagmagia." },
      { level: 3, name: "Metamagia", text: "Sutil, Distante, Duplicada, Acelerada, Potente, Cuidadosa..." },
      { level: 5, name: "3º Círculo", text: "Magias de 3º círculo." },
      { level: 20, name: "Restauração Arcana", text: "Recupera 4 pontos de feitiçaria em descanso curto." },
    ],
    combos: [
      { name: "Bola de Fogo Acelerada", req: "3 pontos de feitiçaria", desc: "Bola de fogo como ação bônus + truque no mesmo turno.", rolls: [ { label: "Dano", expr: "8d6" }, { label: "Truque", expr: "2d10" } ] },
      { name: "Raio Duplicado", req: "Metamagia Duplicada", desc: "Raio ardente atinge dois alvos simultâneos.", rolls: [ { label: "Alvo 1", expr: "1d20" }, { label: "Alvo 2", expr: "1d20" }, { label: "Dano", expr: "2d6" } ] },
      { name: "Surto do Dragão", req: "Afinidade Elemental", desc: "Explosão elemental do ancestral somando CAR ao dano.", rolls: [ { label: "Dano elemental", expr: "6d6" } ] },
    ],
    gear: { weapons: ["adaga", "dardo", "cajado"], armor: "nenhuma", gold: 80 },
  },
  {
    key: "druida", name: "Druida", hitDie: 8, primary: ["wis"], saves: ["int", "wis"],
    caster: "full", spellAbility: "wis", desc: "Guardião do equilíbrio: fera, tempestade e raiz em um só ser.",
    flavor: "Natureza não é cenário. É exército.", armor: "Leves e médias (não metálicas)",
    subclasses: [
      { key: "lua", name: "Círculo da Lua", desc: "Mestre da Forma Selvagem: urso, tigre, elementais.", features: [
        { level: 2, name: "Forma de Combate", text: "Forma Selvagem como ação bônus; feras até ND 1." },
        { level: 6, name: "Garras Primais", text: "Ataques de fera contam como mágicos." },
        { level: 10, name: "Forma Elemental", text: "Assume forma de elementais básicos." } ] },
      { key: "terra", name: "Círculo da Terra", desc: "Canaliza o poder dos biomas: floresta, montanha, pântano.", features: [
        { level: 2, name: "Recuperação Natural", text: "Recupera espaços de magia em descanso curto." },
        { level: 6, name: "Passo da Terra", text: "Terreno difícil natural não o afeta." },
        { level: 14, name: "Santuário Natural", text: "Bestas e plantas hesitam em atacá-lo." } ] },
      { key: "espinhos", name: "Círculo dos Espinhos", desc: "A natureza também tem lâminas: veneno e espinhos.", features: [
        { level: 2, name: "Armadura de Espinhos", text: "Invoca aura de espinhos: dano por turno em adjacente." },
        { level: 6, name: "Colheita Venenosa", text: "Extrai venenos potenciados de criaturas abatidas." },
        { level: 14, name: "Enxame Vingativo", text: "Espinhos atacam sozinhos quem o ferir." } ] },
    ],
    features: [
      { level: 1, name: "Conjuração Natural", text: "Prepara magias de druida = SAB + nível." },
      { level: 2, name: "Forma Selvagem", text: "2x/descanso: transforma-se em fera já vista (ND ≤ 1/4 a 1)." },
      { level: 8, name: "Forma Aprimorada", text: "Feras com deslocamento de natação/voo liberadas." },
      { level: 18, name: "Corpo Atemporal", text: "Envelhece 10x mais devagar; formas ilimitadas no nv.20." },
    ],
    combos: [
      { name: "Fúria da Lua", req: "Forma Selvagem de urso", desc: "Forma de urso pardo com mordida e garras no mesmo turno.", rolls: [ { label: "Mordida", expr: "1d20" }, { label: "Garras", expr: "1d20" }, { label: "Dano", expr: "1d8+2d6" } ] },
      { name: "Tempestade Crescente", req: "Magia de invocação", desc: "Invoca chicote de espinhos puxando o inimigo para a zona de área.", rolls: [ { label: "Ataque mágico", expr: "1d20" }, { label: "Dano", expr: "3d6" } ] },
      { name: "Raiz e Ruína", req: "Constrição ativa", desc: "Prende o inimigo com raízes e desfere relâmpagos com vantagem.", rolls: [ { label: "Relâmpago", expr: "1d20" }, { label: "Dano", expr: "4d8" } ] },
    ],
    gear: { weapons: ["cimitarra", "clava", "funda"], armor: "couro", gold: 70 },
  },
  {
    key: "monge", name: "Monge", hitDie: 8, primary: ["dex", "wis"], saves: ["str", "dex"],
    caster: null, desc: "O corpo é a arma; o ki é o motor; a mente é o muro.",
    flavor: "Enquanto você empunha a espada, ele já a tirou de sua mão.", armor: "Nenhuma (Defesa sem Armadura)",
    subclasses: [
      { key: "mao-aberta", name: "Caminho da Mão Aberta", desc: "Técnica marcial perfeita: controle total do corpo do inimigo.", features: [
        { level: 3, name: "Técnica da Mão Aberta", text: "Rajada de Golpes: derruba, empurra ou impede reações." },
        { level: 6, name: "Integridade Corporal", text: "Cura de 3x nível 1x/descanso longo." },
        { level: 17, name: "Palma do Tremor", text: "Vibrações letais: 10d10 necrótico ou o alvo cai." } ] },
      { key: "sombra", name: "Caminho da Sombra", desc: "Ninja contemplativo: teletransporte entre sombras.", features: [
        { level: 3, name: "Artes Sombrias", text: "Ki para conjurar escuridão, passos velados e silêncio." },
        { level: 6, name: "Passo Umbral", text: "Teleporta 18m entre sombras com vantagem no próximo ataque." },
        { level: 17, name: "Oportunista Sombrio", text: "Reação: ataca criatura que acabou de ser atingida." } ] },
      { key: "elementos", name: "Caminho dos Quatro Elementos", desc: "Avatar do ki elemental: fogo, água, ar e terra.", features: [
        { level: 3, name: "Discípulo Elemental", text: "Disciplinas: punho flamejante, chicote d'água, rajada de ar." },
        { level: 6, name: "Disciplina Avançada", text: "Onda de trovões, muralha de pedra, gume de ar." },
        { level: 11, name: "Mestre Elemental", text: "Disciplinas de grande poder por mais pontos de ki." } ] },
    ],
    features: [
      { level: 1, name: "Artes Marciais", text: "Ataque desarmado d4 (cresce); ataque como ação bônus." },
      { level: 1, name: "Defesa sem Armadura", text: "CA = 10 + DES + SAB." },
      { level: 2, name: "Ki", text: "Pontos para Rajada de Golpes, Defesa Paciente e Passo do Vento." },
      { level: 3, name: "Defletir Projéteis", text: "Reação reduz dano à distância; pode arremessar de volta." },
      { level: 5, name: "Golpe Atordoante", text: "1 ki: alvo atordoado por 1 turno (falha em CON)." },
    ],
    combos: [
      { name: "Rajada Relâmpago", req: "2 pontos de ki", desc: "Ataque + golpe desarmado + Rajada de Golpes (4 ataques).", rolls: [ { label: "Ataque 1", expr: "1d20" }, { label: "Ataque 2", expr: "1d20" }, { label: "Golpe 3", expr: "1d20" }, { label: "Golpe 4", expr: "1d20" } ] },
      { name: "Ponto de Pressão", req: "Golpe Atordoante", desc: "Atordoa e martela o inimigo indefeso com vantagem total.", rolls: [ { label: "Ataque", expr: "1d20" }, { label: "Atordoar (CON)", expr: "1d20" } ] },
      { name: "Dança das Sombras", req: "Passo Umbral", desc: "Teleporta pelas costas e ataca com vantagem.", rolls: [ { label: "Ataque c/ vantagem", expr: "1d20" } ] },
    ],
    gear: { weapons: ["adaga", "dardo", "cajado"], armor: "nenhuma", gold: 40 },
  },
];

export function getClass(key: string): ClassDef {
  return CLASSES.find((c) => c.key === key) ?? CLASSES[0];
}

export function getSubclass(classKey: string, subKey: string): SubclassDef | undefined {
  return getClass(classKey).subclasses.find((s) => s.key === subKey);
}

// Nível em que cada classe "desbloqueia" a subclasse no lore (exibido na ficha)
export const SUBCLASS_LEVEL: Record<string, number> = {
  barbaro: 3, bardo: 3, bruxo: 1, clerigo: 1, druida: 2, feiticeiro: 1,
  guerreiro: 3, ladino: 3, mago: 2, monge: 3, paladino: 3, patrulheiro: 3,
};
