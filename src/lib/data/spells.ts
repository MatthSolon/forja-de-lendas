export interface SpellDef {
  id: string;
  name: string;
  lvl: number; // 0 = truque
  school: string;
  classes: string[];
  time: string;
  range: string;
  desc: string;
  dmg?: string;
}

const S = (id: string, name: string, lvl: number, school: string, classes: string[], time: string, range: string, desc: string, dmg?: string): SpellDef =>
  ({ id, name, lvl, school, classes, time, range, desc, dmg });

export const SPELLS: SpellDef[] = [
  // Truques
  S("rajada-mistica", "Rajada Mística", 0, "Evocação", ["bruxo"], "1 ação", "36m", "Feixe de energia crepitante. 1d10 de dano de força; raios extras nos níveis 5/11/17.", "1d10"),
  S("raio-de-fogo", "Raio de Fogo", 0, "Evocação", ["mago", "feiticeiro"], "1 ação", "36m", "Dardo flamejante. 1d10 de dano de fogo; objeto inflamável pega fogo.", "1d10"),
  S("raio-de-gelo", "Raio de Gelo", 0, "Evocação", ["mago", "feiticeiro", "druida"], "1 ação", "18m", "1d8 de dano de frio e -3m de deslocamento até o próximo turno.", "1d8"),
  S("palavra-zombeteira", "Palavra Zombeteira", 0, "Encantamento", ["bardo"], "1 ação", "18m", "Insulto mágico: 1d4 psíquico e desvantagem no próximo ataque.", "1d4"),
  S("chama-sagrada", "Chama Sagrada", 0, "Evocação", ["clerigo"], "1 ação", "18m", "1d8 radiante (salvaguarda de DES); ignora cobertura.", "1d8"),
  S("guia", "Guia", 0, "Adivinhação", ["clerigo", "druida"], "1 ação", "Toque", "Alvo soma 1d4 em um teste de perícia à escolha."),
  S("taumaturgia", "Taumaturgia", 0, "Transmutação", ["clerigo"], "1 ação", "9m", "Pequenos milagres: voz trovejante, chamas tremulando, portas que se abrem."),
  S("prestidigitacao", "Prestidigitação", 0, "Transmutação", ["mago", "feiticeiro", "bardo", "bruxo"], "1 ação", "3m", "Truques menores: acender velas, limpar, saborizar, pequenas ilusões."),
  S("misticismo", "Mão Invisível", 0, "Conjuração", ["mago", "feiticeiro", "bruxo", "bardo"], "1 ação", "9m", "Mão espectral flutuante que manipula até 4,5 kg."),
  S("luz", "Luz", 0, "Evocação", ["clerigo", "mago", "bardo"], "1 ação", "Toque", "Objeto emite luz plena por 6m + penumbra 6m por 1 hora."),
  S("orientacao", "Orientação", 0, "Adivinhação", ["druida"], "1 ação", "Toque", "Como Guia: soma 1d4 a um teste de atributo."),
  S("resistencia", "Resistência", 0, "Abjuração", ["clerigo", "druida"], "1 ação", "Toque", "Alvo soma 1d4 em uma salvaguarda (concentração, 1 min)."),
  S("chicote-espinhos", "Chicote de Espinhos", 0, "Transmutação", ["druida"], "1 ação", "9m", "1d6 perfurante e puxa 3m se Grande ou menor.", "1d6"),
  S("globulos-luz", "Glóbulos de Luz", 0, "Evocação", ["mago", "feiticeiro"], "1 ação", "36m", "1d6 radiante; ofusca o alvo (-1d4 no próximo ataque).", "1d6"),
  S("toque-vampirico-m", "Toque Profano", 0, "Necromancia", ["bruxo"], "1 ação", "Toque", "1d8 necrótico; o alvo não recupera PV até o próximo turno.", "1d8"),

  // 1º círculo
  S("cura-ferimentos", "Curar Ferimentos", 1, "Evocação", ["clerigo", "druida", "paladino", "patrulheiro", "bardo"], "1 ação", "Toque", "Cura 1d8 + modificador de conjuração. +1d8 por círculo acima.", "1d8"),
  S("palavra-curadora", "Palavra Curadora", 1, "Evocação", ["clerigo", "bardo", "druida"], "1 ação bônus", "18m", "Cura 1d4 + modificador à distância. +1d4 por círculo.", "1d4"),
  S("escudo-fe", "Escudo da Fé", 1, "Abjuração", ["clerigo", "paladino"], "1 ação bônus", "18m", "+2 de CA por 10 minutos (concentração)."),
  S("bencao", "Bênção", 1, "Encantamento", ["clerigo", "paladino"], "1 ação", "9m", "3 alvos somam 1d4 em ataques e salvaguardas (concentração)."),
  S("inflingir-ferimentos", "Inflingir Ferimentos", 1, "Necromancia", ["clerigo"], "1 ação", "Toque", "3d10 necrótico no toque. +1d10 por círculo acima.", "3d10"),
  S("misseis-magicos", "Mísseis Mágicos", 1, "Evocação", ["mago", "feiticeiro"], "1 ação", "36m", "3 dardos certeiros de 1d4+1 cada (nunca erram). +1 dardo por círculo.", "3d4+3"),
  S("escudo-arcano", "Escudo Arcano", 1, "Abjuração", ["mago", "feiticeiro"], "1 reação", "Pessoal", "+5 de CA até o início do próximo turno; bloqueia mísseis mágicos."),
  S("mago-armadura", "Armadura Arcana", 1, "Abjuração", ["mago", "feiticeiro"], "1 ação", "Toque", "CA vira 13 + DES por 8 horas."),
  S("raio-ardente", "Raio Ardente", 1, "Evocação", ["mago", "feiticeiro"], "1 ação", "36m", "Ataque à distância: 2d6 de fogo. +d6 por círculo.", "2d6"),
  S("maos-flamejantes", "Mãos Flamejantes", 1, "Evocação", ["mago", "feiticeiro"], "1 ação", "Cone 4,5m", "3d6 de fogo em cone (DES metade). +1d6 por círculo.", "3d6"),
  S("onda-trovejante", "Onda Trovejante", 1, "Evocação", ["mago", "feiticeiro", "bardo", "druida"], "1 ação", "Cubo 4,5m", "2d8 de trovão e empurra 3m (CON metade). +1d8 por círculo.", "2d8"),
  S("hex", "Maldição (Hex)", 1, "Encantamento", ["bruxo"], "1 ação bônus", "27m", "+1d6 necrótico por ataque ao alvo; desvantagem em um atributo (conc., até 8h).", "1d6"),
  S("riso-nevrotico", "Riso Histérico", 1, "Encantamento", ["bardo", "mago"], "1 ação", "9m", "Alvo cai gargalhando incapacitado (SAB anula; repete a cada turno)."),
  S("dormir", "Dormir", 1, "Encantamento", ["mago", "feiticeiro", "bardo", "bruxo"], "1 ação", "27m", "5d8 PV de criaturas adormecem, das mais fracas às mais fortes.", "5d8"),
  S("flecha-anelada", "Marca do Caçador", 1, "Adivinhação", ["patrulheiro"], "1 ação bônus", "27m", "Marca alvo: +1d6 de dano por ataque; você o rastreia (conc., 1h).", "1d6"),
  S("falar-animais", "Falar com Animais", 1, "Adivinhação", ["druida", "patrulheiro", "bardo"], "1 ação", "Pessoal", "Comunica-se com feras por 10 minutos."),
  S("crescer-espinhos", "Crescer Espinhos", 1, "Transmutação", ["druida", "patrulheiro"], "1 ação", "45m", "Terreno difícil com 2d4 perfurante a cada 1,5m percorrido (conc.).", "2d4"),
  S("heroismo", "Heroísmo", 1, "Encantamento", ["bardo", "paladino"], "1 ação", "Toque", "Imunidade a medo + PV temporários = CAR por turno (conc., 1 min)."),
  S("comando", "Comando", 1, "Encantamento", ["clerigo", "paladino"], "1 ação", "18m", "Palavra de ordem: Fuja! Ajoelhe! Largue! (SAB anula)."),
  S("detectar-magia", "Detectar Magia", 1, "Adivinhação", ["mago", "clerigo", "druida", "bardo", "patrulheiro", "paladino", "feiticeiro"], "1 ação", "Pessoal", "Sente magia em 9m e identifica a escola (conc., 10 min)."),
  S("enfeiticar-pessoa", "Enfeitiçar Pessoa", 1, "Encantamento", ["bardo", "mago", "feiticeiro", "bruxo", "druida"], "1 ação", "9m", "Humanoide o trata como amigo (SAB anula; sabe que foi enfeitiçado)."),

  // 2º círculo
  S("invisibilidade", "Invisibilidade", 2, "Ilusão", ["mago", "feiticeiro", "bardo", "bruxo"], "1 ação", "Toque", "Invisível até atacar/conjurar (conc., 1h). +1 alvo por círculo."),
  S("imagem-espelhada", "Imagem Espelhada", 2, "Ilusão", ["mago", "feiticeiro", "bruxo"], "1 ação", "Pessoal", "3 duplicatas ilusórias desviam ataques (1 min)."),
  S("raio-enfraquecer", "Raio do Enfraquecimento", 2, "Necromancia", ["mago", "bruxo"], "1 ação", "18m", "2d8 necrótico e metade do dano com armas de FOR (CON metade).", "2d8"),
  S("coroa-loucura", "Coroa da Loucura", 2, "Encantamento", ["mago", "feiticeiro", "bruxo", "bardo"], "1 ação", "36m", "Humanoide ataca quem você escolher a cada turno (SAB anula; conc.)."),
  S("sussurros-sombrios", "Sussurros Sombrios", 2, "Ilusão", ["bruxo", "mago", "feiticeiro", "bardo"], "1 ação", "18m", "Vozes aterrorizantes: 3d6 psíquico e foge (SAB metade).", "3d6"),
  S("area-escorregadia", "Área Escorregadia", 2, "Conjuração", ["mago", "bardo"], "1 ação", "18m", "Gordura mágica: caem os que cruzarem (DES; conc., 1 min)."),
  S("arma-espiritual", "Arma Espiritual", 2, "Evocação", ["clerigo"], "1 ação bônus", "18m", "Arma flutuante: 1d8 + SAB de força por ação bônus (1 min).", "1d8"),
  S("augurio", "Augúrio", 2, "Adivinhação", ["clerigo"], "1 min", "Pessoal", "Presságio sobre ações das próximas horas: glória, perigo, ambos ou nada."),
  S("passo-nevoa", "Passo da Névoa", 2, "Conjuração", ["mago", "feiticeiro", "bruxo", "patrulheiro"], "1 ação bônus", "Pessoal", "Teleporta 9m envolto em névoa prateada."),
  S("imobilizar-pessoa", "Imobilizar Pessoa", 2, "Encantamento", ["clerigo", "mago", "bardo", "druida", "feiticeiro", "bruxo"], "1 ação", "18m", "Paralisa humanoide (SAB, repete a cada turno; conc., 1 min)."),
  S("patas-aranha", "Patas de Aranha", 2, "Transmutação", ["mago", "feiticeiro", "bruxo", "druida"], "1 ação", "Toque", "Escala paredes e tetos com deslocamento pleno (conc., 1h)."),
  S("aprimorar-atributo", "Aprimorar Atributo", 2, "Transmutação", ["clerigo", "druida", "bardo", "feiticeiro"], "1 ação", "Toque", "Vantagem em um atributo à escolha por 1 hora (conc.)."),
  S("chama-continua", "Chama Contínua", 2, "Evocação", ["clerigo", "druida", "patrulheiro"], "1 ação", "18m", "Coluna de fogo: 2d6 (DES metade); chama persiste em área.", "2d6"),
  S("silencio", "Silêncio", 2, "Ilusão", ["clerigo", "bardo", "patrulheiro"], "1 ação", "36m", "Esfera de 6m sem som algum; imune a dano de trovão (conc., 10 min)."),
  S("curar-grupo", "Oração de Cura", 2, "Evocação", ["clerigo"], "10 min", "9m", "Até 6 criaturas curam 2d8 + SAB.", "2d8"),

  // 3º círculo
  S("bola-de-fogo", "Bola de Fogo", 3, "Evocação", ["mago", "feiticeiro"], "1 ação", "45m", "8d6 de fogo em esfera de 6m (DES metade). +1d6 por círculo.", "8d6"),
  S("relampago", "Relâmpago", 3, "Evocação", ["mago", "feiticeiro"], "1 ação", "Linha 30m", "8d6 elétrico em linha (DES metade). +1d6 por círculo.", "8d6"),
  S("contramagica", "Contra-mágica", 3, "Abjuração", ["mago", "feiticeiro", "bruxo", "bardo", "clerigo", "paladino", "patrulheiro"], "1 reação", "18m", "Anula magia de círculo igual/menor; maior exige teste de conjuração."),
  S("dissipar-magia", "Dissipar Magia", 3, "Abjuração", ["mago", "clerigo", "druida", "bardo", "feiticeiro", "bruxo", "paladino"], "1 ação", "36m", "Encerra magias ativas de 3º círculo ou menos automaticamente."),
  S("levantar-mortos", "Animar Mortos", 3, "Necromancia", ["mago", "clerigo"], "1 min", "3m", "Ergue zumbi/esqueleto por 24h sob seu comando. +2 por círculo."),
  S("sopro-infernal", "Toque Vampírico", 3, "Necromancia", ["mago", "bruxo"], "1 ação", "Toque", "3d6 necrótico e cura metade do dano (conc., 1 min; repete a cada turno).", "3d6"),
  S("espiritos-guardioes", "Espíritos Guardiões", 3, "Conjuração", ["clerigo"], "1 ação", "Pessoal", "Aura de 4,5m: 3d8 radiante/necrótico por turno em hostis (SAB metade).", "3d8"),
  S("palavra-massa", "Palavra Curativa em Massa", 3, "Evocação", ["clerigo"], "1 ação bônus", "18m", "Até 6 criaturas curam 1d4 + modificador. +1d4 por círculo.", "1d4"),
  S("revivificar", "Revivificar", 3, "Necromancia", ["clerigo", "paladino"], "1 ação", "Toque", "Retorna criatura morta há menos de 1 minuto com 1 PV (custa diamante)."),
  S("luz-do-dia", "Luz do Dia", 3, "Evocação", ["clerigo", "druida", "paladino", "patrulheiro", "feiticeiro"], "1 ação", "18m", "Luz solar plena em 18m; dissipa escuridão mágica de 3º círculo ou menor."),
  S("padrao-hipnotico", "Padrão Hipnótico", 3, "Ilusão", ["mago", "feiticeiro", "bardo", "bruxo"], "1 ação", "36m", "Cores dançantes enfeitiçam todos na área (SAB; conc., 1 min)."),
  S("velocidade", "Velocidade", 3, "Transmutação", ["mago", "feiticeiro", "patrulheiro"], "1 ação", "9m", "Dobra deslocamento, +2 CA, ação extra (conc., 1 min; sonolência após)."),
  S("respirar-agua", "Respirar sob Água", 3, "Transmutação", ["druida", "mago", "feiticeiro", "patrulheiro"], "1 ação", "9m", "Aliados respiram debaixo d'água por 24 horas."),
  S("invocar-enxame", "Conjurar Enxame", 3, "Conjuração", ["druida", "patrulheiro"], "1 ação", "27m", "Invoca feras/espectros com ND somado ≤ 2 (conc., 1h)."),
  S("neve-negra", "Tempestade de Neve", 3, "Conjuração", ["druida", "mago", "feiticeiro"], "1 ação", "45m", "2d8 de frio em cilindro de 12m; terreno difícil e visão prejudicada.", "2d8"),
  S("circulo-morte", "Aura de Vitalidade", 3, "Evocação", ["druida", "paladino", "clerigo"], "1 ação", "Pessoal", "Ação bônus: aliado a 9m cura 2d6 por turno (conc., 1 min).", "2d6"),

  // 4º círculo
  S("invisibilidade-maior", "Invisibilidade Maior", 4, "Ilusão", ["mago", "bardo", "feiticeiro"], "1 ação", "Toque", "Invisibilidade que NÃO termina ao atacar (conc., 1 min)."),
  S("muralha-fogo", "Muralha de Fogo", 4, "Evocação", ["mago", "feiticeiro", "druida"], "1 ação", "36m", "Muro de 18m: 5d8 ao atravessar (DES metade); queima projéteis.", "5d8"),
  S("tempestade-gelo", "Tempestade de Gelo", 4, "Evocação", ["mago", "feiticeiro", "druida"], "1 ação", "90m", "2d8 contuso + 4d6 frio em cilindro de 6m (DES metade).", "2d8+4d6"),
  S("banimento", "Banimento", 4, "Abjuração", ["clerigo", "paladino", "mago", "feiticeiro", "bruxo"], "1 ação", "18m", "Expulsa criatura para outro plano (CAR; conc., 1 min; permanente se extraplanar)."),
  S("confusao", "Confusão", 4, "Encantamento", ["mago", "feiticeiro", "bardo", "druida"], "1 ação", "27m", "Alvos agem aleatoriamente: atacam aliados, fogem, ficam parados (SAB)."),
  S("guardiao-fe", "Guardião da Fé", 4, "Conjuração", ["clerigo"], "1 ação", "9m", "Espírito vigilante: 20 radiante a quem se aproximar (SAB metade; até 60 total).", "20"),
  S("polimorfia", "Polimorfia", 4, "Transmutação", ["mago", "feiticeiro", "druida", "bardo"], "1 ação", "18m", "Transforma alvo em fera (SAB; conc., 1h; PV da fera primeiro)."),
  S("invocar-elemental", "Conjurar Elemental", 4, "Conjuração", ["druida", "mago"], "1 min", "27m", "Elemental menor ND controlado por 1 hora (conc.)."),

  // 5º círculo
  S("cone-frio", "Cone de Frio", 5, "Evocação", ["mago", "feiticeiro"], "1 ação", "Cone 18m", "8d8 de frio em cone devastador (CON metade). +1d8 por círculo.", "8d8"),
  S("mao-arcana", "Mão Arcana", 5, "Evocação", ["mago", "bruxo"], "1 ação", "36m", "Mão gigante: 4d8 força, agarra, empurra, bloqueia (conc., 1 min).", "4d8"),
  S("coluna-chamas", "Coluna de Chama Sagrada", 5, "Evocação", ["clerigo"], "1 ação bônus", "18m", "4d6 fogo + 4d6 radiante criatura por turno (DES metade; conc.).", "4d6+4d6"),
  S("imobilizar-monstro", "Imobilizar Monstro", 5, "Encantamento", ["mago", "feiticeiro", "bardo", "bruxo", "druida"], "1 ação", "27m", "Paralisa QUALQUER criatura (SAB a cada turno; conc., 1 min)."),
  S("ressurgir", "Ressurgir", 5, "Necromancia", ["clerigo", "bardo", "paladino"], "1 hora", "Toque", "Ressuscita morto há até 10 dias (custo em diamantes; penalidades temporárias)."),
  S("legado-druida", "Coluna de Chamas Selvagens", 5, "Evocação", ["druida"], "1 ação", "18m", "4d6 fogo + 4d6 radiante por ação bônus durante 1 minuto.", "4d6"),
  S("nuvem-mortal", "Nuvem Pestilenta", 5, "Conjuração", ["mago", "feiticeiro"], "1 ação", "36m", "5d8 veneno por turno em nuvem de 12m que se move (CON metade).", "5d8"),
  S("sonho", "Sonho", 5, "Ilusão", ["mago", "bardo", "bruxo"], "1 min", "Especial", "Aparição aterroriza o sono do alvo: 3d6 psíquico e impede descanso (SAB).", "3d6"),

  // 6º+ círculo (poder épico)
  S("desintegrar", "Desintegrar", 6, "Transmutação", ["mago", "feiticeiro"], "1 ação", "18m", "10d6+40 de força (DES anula); a 0 PV vira pó. Objetos mágicos resistem.", "10d6+40"),
  S("circulo-morte-6", "Círculo da Morte", 6, "Necromancia", ["mago", "feiticeiro", "bruxo"], "1 ação", "45m", "8d6 necrótico em esfera de 9m (CON metade).", "8d6"),
  S("curar-plenamente", "Cura Completa", 6, "Evocação", ["clerigo", "druida"], "1 ação", "18m", "Cura 70 PV, encerra cegueira, surdez e todas as doenças.", "70"),
  S("muralha-laminas", "Muralha de Lâminas", 6, "Evocação", ["mago"], "1 ação", "36m", "Muro de 6d10 cortante; fornece cobertura de três-quartos.", "6d10"),
  S("dedo-morte", "Dedo da Morte", 7, "Necromancia", ["mago", "feiticeiro", "bruxo"], "1 ação", "18m", "7d8+30 necrótico (CON metade); morto vira zumbi sob seu comando.", "7d8+30"),
  S("inverter-gravidade", "Inverter Gravidade", 7, "Transmutação", ["mago", "feiticeiro"], "1 ação", "27m", "Cilindro de 15m cai para cima; criaturas despencam contra o teto."),
  S("terremoto", "Terremoto", 8, "Evocação", ["clerigo", "druida", "feiticeiro"], "1 ação", "150m", "Abala estruturas, abre fendas de 1d6 dano/turno, derruba todos (conc.).", "5d6"),
  S("explosao-solar", "Explosão Solar", 8, "Evocação", ["mago", "feiticeiro", "druida"], "1 ação", "45m", "12d6 radiante + cegueira por 1 minuto (CON metade). Mortos-vivos dobram.", "12d6"),
  S("desejo", "Desejo", 9, "Conjuração", ["mago", "feiticeiro"], "1 ação", "Pessoal", "A magia mais poderosa: reescreve a realidade. O preço é com o mestre."),
  S("meteoro", "Enxame de Meteoros", 9, "Evocação", ["mago", "feiticeiro"], "1 ação", "1,5km", "4 esferas de 12m: 20d6 fogo + 20d6 concussão cada (DES metade).", "20d6+20d6"),
];

export function spellsForClass(classKey: string, maxLvl = 9): SpellDef[] {
  return SPELLS.filter((s) => s.classes.includes(classKey) && s.lvl <= maxLvl);
}

export function getSpell(id: string): SpellDef | undefined {
  return SPELLS.find((s) => s.id === id);
}

const CIRCLES = ["Truque", "1º círculo", "2º círculo", "3º círculo", "4º círculo", "5º círculo", "6º círculo", "7º círculo", "8º círculo", "9º círculo"];
export function circleName(lvl: number): string {
  return CIRCLES[lvl] ?? `${lvl}º círculo`;
}
