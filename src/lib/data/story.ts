// Motor narrativo: 5 arcos × 4 capítulos = 20 capítulos de campanha,
// com missões, escolhas de consequência, encontros e bosses escaláveis.

export interface QuestDef {
  id: string;
  title: string;
  desc: string;
  kind: "combate" | "exploracao" | "social" | "misterio";
  xp: number; // XP por personagem
}

export interface ChoiceDef {
  id: string;
  prompt: string;
  options: { label: string; outcome: string; xp: number }[];
}

export interface ChapterDef {
  id: string;
  title: string;
  levelRange: [number, number];
  reading: string[];
  quests: QuestDef[];
  choice: ChoiceDef;
  encounterKeys: string[];
  bossKey?: string;
  isFinale?: boolean;
}

export interface ArcDef {
  id: string;
  name: string;
  tagline: string;
  levels: string;
  summary: string;
  recEnv: string[];
  chapters: ChapterDef[];
}

export const ARCS: ArcDef[] = [
  {
    id: "cinzas",
    name: "As Cinzas de Valdris",
    tagline: "Uma vila em chamas. Um culto nas sombras. Um dragão despertando.",
    levels: "Níveis 1–4",
    summary: "A vila fronteiriça de Valdris sofre ataques do Culto da Brasa, fanáticos que preparam o despertar de uma dragoa vermelha jovem, Cinderax. Os heróis começam como ninguém — e terminam como a última esperança da região.",
    recEnv: ["floresta", "dungeon", "caverna", "planicie"],
    chapters: [
      {
        id: "cinzas-1", title: "Fumaça no Horizonte", levelRange: [1, 2],
        reading: [
          "A estrada para Valdris cheira a fumaça três dias antes de vocês avistarem a vila. Viajantes fogem na direção contrária com carroças carregadas e olhos vazios.",
          "Na taverna do Javali Dourado, a estalajadeira Mirra conta entre lágrimas: granjas queimadas, branding de brasas nas portas dos que resistem, e desaparecidos toda lua nova.",
          "O prefeito Aldric oferece 50 po por cabeça de cultista — mas algo em seu aperto de mão sugere que ele sabe mais do que diz.",
        ],
        quests: [
          { id: "c1q1", title: "Patrulha das Cinzas", desc: "Investigue a Granja dos Corvos e sobreviva à emboscada de 4 cultistas + 2 mastins.", kind: "combate", xp: 250 },
          { id: "c1q2", title: "O Símbolo Queimado", desc: "Descrição ou esboço do símbolo do culto para o sábio Halven (teste de Investigação CD 12).", kind: "misterio", xp: 150 },
          { id: "c1q3", title: "Corações e Brasas", desc: "Convença três famílias a não fugirem da vila (Persuasão CD 11) ou ajude-as a partir em segurança.", kind: "social", xp: 200 },
        ],
        choice: {
          id: "c1c1", prompt: "Um cultista capturado oferece a localização do esconderijo em troca da própria vida.",
          options: [
            { label: "Aceitar o acordo", outcome: "Ele revela o Antigo Poço de Sal — e foge para avisar os demais. Vocês terão informação, mas não surpresa.", xp: 100 },
            { label: "Entregá-lo à justiça da vila", outcome: "A vila faz 'justiça' com as próprias mãos. O culto responde queimando o moinho. A informação morre com ele.", xp: 50 },
            { label: "Interrogatório sob juramento mágico", outcome: "Com magia ou intuição aguçada (CD 13), vocês extraem o esconderijo e a senha: 'A Brasa Purifica'.", xp: 200 },
          ],
        },
        encounterKeys: ["cultista", "lobo", "bandido"],
      },
      {
        id: "cinzas-2", title: "O Poço de Sal", levelRange: [2, 3],
        reading: [
          "O Poço de Sal desce 30 metros em espiral até minas abandonadas. Nas paredes, sal impregnado de fuligem forma veios negras — como se a própria terra estivesse se queimando por dentro.",
          "O culto transformou as galerias em templo profano: jaulas com reféns, um altar de brasas eternas e mapas marcando cada estrada do vale.",
          "No coração das minas, a Sacerdotisa Vex conduz o Rito da Fagulha — e o primeiro sacrifício pode acontecer a qualquer momento.",
        ],
        quests: [
          { id: "c2q1", title: "Infiltração nas Minas", desc: "Entre sem alertar o complexo inteiro (senha, disfarce ou furtividade em grupo CD 13).", kind: "exploracao", xp: 300 },
          { id: "c2q2", title: "Os Reféns do Altar", desc: "Liberte 6 reféns das jaulas — cada alarme soado torna a fuga mais mortal.", kind: "combate", xp: 350 },
          { id: "c2q3", title: "Interromper o Rito", desc: "Derrote Vex e seus fiéis antes que o altar seja alimentado (chefe menor: use Sacerdotisa escalada).", kind: "combate", xp: 500 },
          { id: "c2q4", title: "Os Mapas do Vale", desc: "Recupere ou destrua os mapas estratégicos do culto antes que rolem para Cinderax.", kind: "misterio", xp: 200 },
        ],
        choice: {
          id: "c2c1", prompt: "Vex, derrotada, oferece um segredo: 'A dragoa não escolheu os cultistas. Eles escolheram a dragoa — e alguém em Valdris escolheu os cultistas.'",
          options: [
            { label: "Poupar Vex em troca do nome", outcome: "Ela sussurra um nome que gela o sangue: Prefeito Aldric. Vex desaparece nas sombras, viva.", xp: 350 },
            { label: "Cumprir a lei ali mesmo", outcome: "A verdade morre com ela — mas em suas vestes, cartas lacradas com o selo da prefeitura.", xp: 250 },
          ],
        },
        encounterKeys: ["cultista", "esqueleto", "goblin", "zumbi"],
      },
      {
        id: "cinzas-3", title: "O Preço da Traição", levelRange: [3, 4],
        reading: [
          "De volta a Valdris, a vila celebra — vinho barato, música alta, e o prefeito Aldric abraçando heróis com o mesmo abraço que abraçava cultistas.",
          "À meia-noite, os sinos calam. O culto, liderado agora pelo próprio Aldric, abre os portões para a retribuição final: a vila queimará como oferenda.",
          "Vocês têm até o amanhecer para desmascarar um prefeito diante de sua própria guarda — enquanto o céu ao norte começa a brilhar em vermelho vivo.",
        ],
        quests: [
          { id: "c3q1", title: "Provas contra o Prefeito", desc: "Apresente as cartas com selo ou testemunhas (Investigação/Persuasão CD 14) à milícia da vila.", kind: "social", xp: 400 },
          { id: "c3q2", title: "A Batalha de Valdris", desc: "Defenda os três portões em ondas coordenadas (3 encontros em sequência).", kind: "combate", xp: 600 },
          { id: "c3q3", title: "Julgamento em Praça", desc: "Capture Aldric vivo — seus guarda-costas são fiéis até o fim (Cavaleiro Negro escalado + guardas).", kind: "combate", xp: 500 },
        ],
        choice: {
          id: "c3c1", prompt: "Aldric, acuado, ri sem medo: 'Matem-me e perdem o caminho até o Covil. Poupem-me e eu levo vocês até o rugido do tesouro.'",
          options: [
            { label: "Guiado pelo traidor", outcome: "Aldric guia o grupo pelo Passo dos Abutres. Cada passo pode ser uma armadilha (Atletismo/Sobrevivência CD 13 para reagir).", xp: 400 },
            { label: "Justiça na praça", outcome: "A vila executa seu tirano. Sem guia, vocês terão de rastrear a dragoa por 2 dias de montanha instável.", xp: 300 },
          ],
        },
        encounterKeys: ["cultista", "bandido", "harpy"],
      },
      {
        id: "cinzas-4", title: "O Covil da Brasa", levelRange: [4, 5], isFinale: true, bossKey: "boss-dragao-cinderax",
        reading: [
          "O vulcão menor de Mount Kar'desh vomita fumaça há uma semana. Lendas diziam que era mau presságio. Agora vocês sabem: era uma contagem regressiva.",
          "No interior da cratera, o ouro de um século de saques forma montes que rangem sob as garras de Cinderax, a Devastadora Jovem. O culto ajoelhado entoa o último verso do rito.",
          "A dragoa abre um olho do tamanho de um escudo. 'Vocês cheiram a cidadezinha', ela ronrona. 'Tragam-me suas histórias — elas queimam tão devagar quanto as aldeias.'",
        ],
        quests: [
          { id: "c4q1", title: "Ascensão da Cratera", desc: "Escale o Kar'desh enfrentando lava rasa e cultistas suicidas (1 encontro de travessia).", kind: "exploracao", xp: 400 },
          { id: "c4q2", title: "Silenciar o Rito Final", desc: "Elimine os 6 sacerdotes do altar ANTES de provocar a dragoa, ou ela desperta fúria extra.", kind: "combate", xp: 600 },
          { id: "c4q3", title: "Cinderax, a Devastadora Jovem", desc: "Enfrente a dragoa em seu covil — lair actions: tremor de magma, chuva de brasas. Use o boss 'Pyraxion' escalado para ND 5.", kind: "combate", xp: 1500 },
        ],
        choice: {
          id: "c4c1", prompt: "Com Cinderax ferida aos últimos golpes, ela oferece um acordo: 'Metade do tesouro, minha partida, e juro sobre as Chamas Eternas nunca mais olhar para este vale.'",
          options: [
            { label: "Ouro e um juramento", outcome: "A dragoa parte rindo. O vale está salvo — por enquanto. Em algum lugar do mundo, um novo bolso do mapa fica vermelho.", xp: 700 },
            { label: "Sem acordos com dragões", outcome: "Batalha até o fim. A lendária teimosia heroica — mas quem bancará os funerais se darem errado?", xp: 1000},
          ],
        },
        encounterKeys: ["cultista", "quimera", "elemental-fogo"],
      },
    ],
  },
  {
    id: "umbralia",
    name: "O Véu de Umbrália",
    tagline: "Os mortos não descansam. Alguém roubou o sono deles.",
    levels: "Níveis 4–7",
    summary: "Na província de Umbrália, os cemitérios esvaziam de madrugada. Um lich chamado Morvanyx reconstrói a Corte dos Mortos em sua torre invertida, e nobres mortos-vivos pagam tributo em almas. Os heróis descem às catacumbas para descobrir quem abriu o Véu — e como fechá-lo antes que ele fique aberto para sempre.",
    recEnv: ["cripta", "templo", "dungeon", "pantano", "tore"],
    chapters: [
      {
        id: "umbralia-1", title: "A Noite dos Túmulos Vazios", levelRange: [4, 5],
        reading: [
          "O coveiro Vannic jura que os túmulos abriram de dentro para fora. A Igreja das Sete Chamas nega — mas seus sacerdotes queimam incenso dia e noite.",
          "Selos necromânticos nas lápides foram quebrados por mãos que conheciam cada trava. Profissional. A Voz dos Mortos, guilda de ladrões supostamente extinta, deixou sua marca.",
          "Sob o mausoléu da família Corvino, um túnel fresco desce em direção ao antigo aqueduto. Está em uso recente — e algo grande passou por aqui.",
        ],
        quests: [
          { id: "u1q1", title: "Vigília do Cemitério", desc: "Passe uma noite no Pátio dos Mártires e resista à Onda dos Revividos (3 carniçais + 6 zumbis).", kind: "combate", xp: 450 },
          { id: "u1q2", title: "A Marca da Guilda", desc: "Rastreie a Voz dos Mortos pelo submundo de Umbrália (Lábia/Investigação CD 14).", kind: "social", xp: 350 },
          { id: "u1q3", title: "O Aqueduto Silencioso", desc: "Explore os túneis e descubra o que está sendo transportado para a Torre (urnas de almas).", kind: "exploracao", xp: 400 },
        ],
        choice: {
          id: "u1c1", prompt: "Na guilda, a ladra mestre Sable oferece aliança: 'Nós roubamos os selos por contrato. O cliente pagou em moedas com caveiras — e agora nossos mortos não descansam também.'",
          options: [
            { label: "Aceitar a guilda como aliada", outcome: "Ladrões conhecem passagens que exércitos ignoram. Vocês ganham uma rota para a Torre — e uma dívida com a guilda.", xp: 400 },
            { label: "Entregar a guilda à Igreja", outcome: "A Igreja executa os professores de necromancia menor. Mas nos cárceres sagrados, murmúrios sugerem que a Corte tem olhos até dentro da fé.", xp: 300 },
          ],
        },
        encounterKeys: ["zumbi", "esqueleto", "carnical", "espectro"],
      },
      {
        id: "umbralia-2", title: "As Catacumbas do Véu", levelRange: [5, 6],
        reading: [
          "As catacumbas sob a Catedral Afogada guardam séculos de reis e pecadores — e, agora, novos moradores que não pedem licença.",
          "O Véu brilha como seda fendida no ar: uma cicatriz entre mundos por onde sussurros gelados vazam. Urnas de almas aguardam coleta em fileiras ordenadas.",
          "Boa notícia: vocês encontraram onde os mortos estão sendo encaminhados. Má notícia: a coleta acontece esta noite, e o coletor é um Vulto Tumular com nome e passado: Ser Corvino, o Cavaleiro Traído.",
        ],
        quests: [
          { id: "u2q1", title: "Mapear as Catacumbas", desc: "Encontre as três capelas seladas e os pontos fracos do Véu (Percepção/Arcano CD 14).", kind: "exploracao", xp: 500 },
          { id: "u2q2", title: "O Coletor de Almas", desc: "Derrote Ser Corvino e liberte as urnas — ou convença o cavaleiro caído a se rebelar (CD 15).", kind: "combate", xp: 700 },
          { id: "u2q3", title: "Fragmentos do Selo", desc: "Recupere 3 fragmentos do Selo de Meridia para poder fechar o Véu.", kind: "misterio", xp: 500 },
        ],
        choice: {
          id: "u2c1", prompt: "Ser Corvino hesita ao ouvir o nome de sua antiga ordem. Por trás do vazio necrótico, resta um homem que jurou proteger estes mortos.",
          options: [
            { label: "Despertar o cavaleiro", outcome: "Corvino volta-se contra seu senhor. Um aliado morto-vivo de honra marcha com vocês — a Igreja não vai aprovar.", xp: 700 },
            { label: "Dar-lhe descanso eterno", outcome: "Um duelo honroso. O último golpe libera não um monstro, mas um homem aliviado. Suas cinzas apontam o caminho.", xp: 550 },
          ],
        },
        encounterKeys: ["esqueleto", "tumular", "carnical", "gargula"],
      },
      {
        id: "umbralia-3", title: "A Corte dos Mortos", levelRange: [6, 7],
        reading: [
          "A Torre Invertida de Morvanyx despenca sob a cidade como um dente negro. Nobres esqueléticos dançam no salão eterno, condenados a uma festa que nunca termina.",
          "Cada membro da Corte guarda uma chave do Trono do Lich: a Baronesa Costurada, o Rei Numismático, os Gêmeos Lamentação. Cada um tem uma história — e uma fraqueza.",
          "Boatos dizem que Morvanyx pode ser enfraquecido desfazendo a Corte. O filactéria do lich, porém, permanece oculto. Sem destruí-lo, o rei morto é apenas demitido — nunca derrotado.",
        ],
        quests: [
          { id: "u3q1", title: "O Baile Macabro", desc: "Infiltre-se no salão e identifique os três Senhores da Corte sem revelar seu disfarce (Enganação CD 14).", kind: "social", xp: 600 },
          { id: "u3q2", title: "Derrubar os Três Senhores", desc: "Cada duelo é um mini-chefe (use Vampiro Prole / Múmia / Necromante escalados).", kind: "combate", xp: 900 },
          { id: "u3q3", title: "A Caça ao Filactéria", desc: "Decifre os diários da Corte e localize o filactéria de Morvanyx: a coroa da Baronesa? O coração do Rei? (Investigação/Arcano CD 15).", kind: "misterio", xp: 800 },
        ],
        choice: {
          id: "u3c1", prompt: "A Baronesa Costurada, derrotada, implora: 'O filactéria está no coração do Rei Numismático. Deixe meu Amor em paz — e eu revelo onde a Torre é frágil.'",
          options: [
            { label: "Misericórdia macabra", outcome: "Ela revela a Câmara de Fundação: pilares arcanos que podem derrubar a Torre. Um amor morto-vivo é ainda amor?", xp: 800 },
            { label: "O martírio purificador", outcome: "Vocês purgam os dois. A informação morre — mas encontram um diário com o plano geral da Torre nos aposentos dela.", xp: 600 },
          ],
        },
        encounterKeys: ["vampiro-prole", "mumia", "necromante", "espectro"],
      },
      {
        id: "umbralia-4", title: "O Trono do Lich", levelRange: [7, 8], isFinale: true, bossKey: "boss-lich",
        reading: [
          "No apogeu da Torre Invertida, um trono de ossos flutua sobre o Véu escancarado. Morvanyx recita o Canto Imortal enquanto almas sobem como fumaça ao contrário.",
          "Sem a Corte, o lich sangra poder. Com o filactéria localizado, cada ferida é permanente. Pela primeira vez em 300 anos, Morvanyx sente medo.",
          "O Véu oscila: fechá-lo exige um sacrifício — o Selo de Meridia absorverá uma vida voluntária... a menos que outra solução seja encontrada às pressas.",
        ],
        quests: [
          { id: "u4q1", title: "Queda da Torre Invertida", desc: "Suba sob desabamento (salvar 3 aliados de escombros concede bônus na luta final).", kind: "exploracao", xp: 700 },
          { id: "u4q2", title: "Morvanyx, o Lich-Rei", desc: "Batalha de 4 fases contra o lich. Destruir o filactéria primeiro remove sua regeneração lendária.", kind: "combate", xp: 2500 },
          { id: "u4q3", title: "Fechar o Véu", desc: "Complete o ritual com o Selo de Meridia antes das 10 rodadas de colapso — ou escolha um sacrifício.", kind: "misterio", xp: 1500 },
        ],
        choice: {
          id: "u4c1", prompt: "O Selo fracassa sem energia vital. Ser Corvino (se vivo) oferece sua não-vida. Caso contrário... alguém do grupo precisará dar um ano de vida por selo.",
          options: [
            { label: "Aceitar o sacrifício de Corvino", outcome: "O cavaleiro sorri pela primeira vez em 40 anos e atravessa o Véu empurrando-o fechado. Poesia se escreve com perdas assim.", xp: 1500 },
            { label: "Cada um doa um ano", outcome: "O grupo envelhece um inverno em silêncio. O Véu fecha selado para sempre. Sobreviver, às vezes, é o ato heroico.", xp: 1200 },
            { label: "Improviso arcano (CD 17)", outcome: "Canalizar a energia residual do lich para o Selo: brilhante, ousado e instável — com 20% de chance de consequências futuras...", xp: 2000 },
          ],
        },
        encounterKeys: ["espectro", "tumular", "golem-carne"],
      },
    ],
  },
  {
    id: "mares",
    name: "Marés de Sangue",
    tagline: "O mar esconde o que o céu esqueceu de afogar.",
    levels: "Níveis 7–11",
    summary: "Os portos da Costa dos Naufrágios pagam tributo a algo sob as ondas. A Frota Escarlate, piratas liderados pela Capitã Morra, caça os mesmos tesouros que um culto abissal usa para despertar Vethis, o kraken adormecido. Entre tavernas, tempestades e convés encharcado de sangue, os heróis navegam uma guerra de três frentes.",
    recEnv: ["costa", "cidade", "pantano"],
    chapters: [
      {
        id: "mares-1", title: "O Porto dos Contrabandistas", levelRange: [7, 8],
        reading: [
          "Porto Sombrio não aparece em mapas oficiais — pagam bem demais pelos funcionários do almirantado. Em 'A Sereia Cega', tudo tem preço menos confiança.",
          "Navios mercantes somem no Estreito dos Ossos sem deixar destroços. Sobreviventes falam de 'olhos sob a água' e fogem do mar para sempre.",
          "A Capitã Morra recruta: sua Frota Escarlate caça o culto abissal, mas seus métodos incluem afogar portos inteiros que pagam tributo ao 'Terror' — inclusive os inocentes que nela moram.",
        ],
        quests: [
          { id: "m1q1", title: "Briga de Taberna Oficial", desc: "Vença (ou sobreviva) à tradicional briga da Sereia Cega para ganhar respeito no porto.", kind: "combate", xp: 500 },
          { id: "m1q2", title: "O Mapa Roubado", desc: "Roube ou negocie a carta náutica cofre do Contramestre Bico-de-Ferro (Furtividade/Enganação CD 14).", kind: "misterio", xp: 600 },
          { id: "m1q3", title: "Escolher uma Bandeira", desc: "Ganhe a confiança de Morra, do contrabandista Vex'Thor ou da Igreja das Marés (rotas exclusivas).", kind: "social", xp: 700 },
        ],
        choice: {
          id: "m1c1", prompt: "Três bandeiras, três ofertas: Morra oferece fogo e honra; Vex'Thor, ouro e segredos; a Igreja das Marés, rota segura... e amnésia para os pecados do porto.",
          options: [
            { label: "Frota Escarlate", outcome: "Morra sorri: 'Tripulação nova! Aprendam rápido.' Logo aliados de combate navais, logo também problemas morais.", xp: 700 },
            { label: "Sombras e Contrabando", outcome: "Vex'Thor ensina as correntes secretas e os preços reais das coisas. Ninguém governa vocês — ninguém protege vocês.", xp: 700 },
            { label: "Bênção das Marés", outcome: "Sacerdotes curam e guiam. Mas o confessionário deles tem formatos estranhos e profundos...", xp: 700 },
          ],
        },
        encounterKeys: ["bandido", "harpy", "tumular"],
      },
      {
        id: "mares-2", title: "O Estreito dos Ossos", levelRange: [8, 9],
        reading: [
          "O Estreito ganhou o nome honestamente: quilhas apodrecidas formam corais brancos em torno da passagem. Correntes invisíveis guiam navios para as rochas — ou as rochas guiam navios para algo que espera embaixo.",
          "No Fundo do Estreito repousa o 'Galeão Púrpura', nau capitânia do culto abissal, com o Tridente do Chamado no cofre. A operação exige respiração subaquática, nervos de aço e conhecimento sobre hidras.",
          "Uma hidra ocupa o casco do galeão como madrasta de pérolas. Ela não é o problema. O problema é o que vibra mais fundo sob a areia.",
        ],
        quests: [
          { id: "m2q1", title: "Travessia do Estreito", desc: "Navegue por correntes letais e bancos de areia vivos (Sobrevivência/Veículos CD 13).", kind: "exploracao", xp: 700 },
          { id: "m2q2", title: "A Hidra do Galeão", desc: "Derrote a hidra entre os mastros afundados (use Hidra escalada para ND 8-9).", kind: "combate", xp: 1100 },
          { id: "m2q3", title: "O Tridente do Chamado", desc: "Recupere o artefato antes que o culto o recupere — e decida quem fica com ele depois.", kind: "misterio", xp: 900 },
        ],
        choice: {
          id: "m2c1", prompt: "O Tridente sussurra promessas: controlar monstros marinhos... por um preço em memórias. Um cultista moribundo jura que só ele pode ser destruído na Forja Abissal.",
          options: [
            { label: "Usar o Tridente", outcome: "Poder real: o mar obedece uma vez por dia. O preço chega devagar — nomes, rostos, canções de ninar esquecidos.", xp: 900 },
            { label: "Selá-lo na Igreja das Marés", outcome: "A Igreja esconde o artefato em cofre sagrado. Pela primeira vez, vocês veem o que os sacerdotes temem de verdade.", xp: 800 },
            { label: "Levá-lo à Forja Abissal", outcome: "A única opção definitiva — e um caminho direto ao covil do culto. A rota deles. A expectativa deles.", xp: 1000 },
          ],
        },
        encounterKeys: ["hidra", "harpy", "salamandra"],
      },
      {
        id: "mares-3", title: "A Corte do Terrores Abissais", levelRange: [9, 11],
        reading: [
          "O culto abissal habita a Basilisco Dourado, um templo-afundado entre penhascos onde a água parece respirar. Eles não fingem ser sanos: usam vestes de algas e sorrisos largos demais.",
          "O Patriarca das Profundezas conduz o Grande Chamado: cidades costeiras entregaram sacrifícios por séculos em troca de pesca farta. Agora o preço subiu.",
          "Morra lança sua frota contra o templo enquanto vocês infiltram por baixo. O destino de milhares navega com vocês — e nos canhões da Capitã, caso falhem em silêncio.",
        ],
        quests: [
          { id: "m3q1", title: "Infiltração Abissal", desc: "Vestes de cultista, senhas profundas, cantos submersos (Enganação/Religião CD 15).", kind: "exploracao", xp: 900 },
          { id: "m3q2", title: "O Patriarca e o Concílio", desc: "Duelo contra o Patriarca (Devorador de Mentes escalado) + Devotos Abissais de elite.", kind: "combate", xp: 1400 },
          { id: "m3q3", title: "Destruir a Forja Abissal", desc: "Coloque o Tridente na Forja e sobreviva ao colapso do templo (10 rodadas de fuga).", kind: "misterio", xp: 1200 },
        ],
        choice: {
          id: "m3c1", prompt: "A Capitã Morra ataca navalmente o templo — matando reféns do culto junto. Detê-la significa trair a frota; deixá-la significa manchar cada vitória de hoje.",
          options: [
            { label: "Sinal de cessar-fogo", outcome: "Morra obedece, furiosa, e vocês liberam os reféns. A missão vence com honra — e a Capitã guarda sua insubordinação como um daqueles troféus que ela emoldura.", xp: 1200 },
            { label: "Fogo amigo aceitável", outcome: "Silêncio covarde, vitória eficiente. O templo colapsa com todos dentro. O mar se lembra.", xp: 900 },
          ],
        },
        encounterKeys: ["devorador-mente", "gigante-pedra", "harpy"],
      },
      {
        id: "mares-4", title: "O Despertar de Vethis", levelRange: [10, 11], isFinale: true, bossKey: "boss-kraken",
        reading: [
          "A Forja se parte — e com ela, o último selo. Vethis ergue-se do abismo com sete tentáculos e uma fome de mil anos. O mar torna-se uma boca.",
          "A Frota Escarlate forma anel em torno do Terror. Navios orbitam um deus furioso como folhas em redemoinho. Vocês lutam no convés do Tombador de Reis enquanto o mundo inteiro é convés.",
          "A cada tentáculo cortado, outro levanta. A vitória só vem ao cegar o coração: o quilha-quebrada, a âncora sagrada no peito da besta. Mergulhar é a única rota.",
        ],
        quests: [
          { id: "m4q1", title: "Tempestade Naval", desc: "Sobreviva às ondas de 12m e aos tentáculos menores no convés (2 encontros em sequência).", kind: "combate", xp: 1400 },
          { id: "m4q2", title: "Ao Coração do Redemoinho", desc: "Mergulho heróico com respiração mágica até a âncora sagrada (3 testes encadeados CD 14-16).", kind: "exploracao", xp: 1200 },
          { id: "m4q3", title: "Vethis, o Terror Abissal", desc: "Batalha final em 3 fases: convés, ar, coração. Use o boss Kraken escalado para ND 11.", kind: "combate", xp: 4000 },
        ],
        choice: {
          id: "m4c1", prompt: "Com Vethis cegado mas não morto, o kraken oferece tratado: o mar devolverá os afogados perdidos (todos!) em troca de sua liberdade para as profundezas inexploradas.",
          options: [
            { label: "O tratado afogado", outcome: "Milhares sobem dos mares — algumas famílias reencontram mortos que choraram por décadas. O kraken desaparece rumo a fossos sem nome. Bom negócio ou apocalipse adiado?", xp: 2500 },
            { label: "Acabar com ele aqui", outcome: "O mar fica vermelho por uma semana. Os peixes retornam em três meses. Os afogados não. A Costa dorme tranquila — com berço vazio, porém tranquila.", xp: 3000 },
          ],
        },
        encounterKeys: ["harpy", "gigante-pedra", "salamandra"],
      },
    ],
  },
  {
    id: "inferno",
    name: "A Corte do Rei Demônio",
    tagline: "Há um trono nos Infernos com espaço para novos súditos.",
    levels: "Níveis 11–15",
    summary: "Portais infernais se abrem sobre as sete cidades livres. Balgor, o Rei Demônio banido, oferece a cada governante um pacto: um século de prosperidade por uma alma real. Cinco reis já assinaram. Os heróis atravessam cortes corrompidas e os próprios Círculos do Inferno para quebrar os pactos — antes que o sexto selo transforme o mundo no oitavo círculo.",
    recEnv: ["vulcanico", "castelo", "templo", "cidade"],
    chapters: [
      {
        id: "inferno-1", title: "Pactos em Pergaminho de Pele", levelRange: [11, 12],
        reading: [
          "Cinco pactos, cinco coroas vendidas. Na Corte de Solaria, o Rei Aldan exibe o pergaminho com orgulho: comida nas praças, ouro nas ruas e algo que cresce na barriga da cidade.",
          "Os pactos são literais e imutáveis — exceto por uma cláusula esquecida: um desafio formal no salão do trono pode anular o contrato. As regras do desafio variam por corte: duelo, enigma, dança, jejum, julgamento.",
          "O sexto pacto aguarda apenas a coroa de Valéria — a rainha mais jovem, mais brilhante e mais desconfiada do continente. Balgor ainda precisa de sete.",
        ],
        quests: [
          { id: "i1q1", title: "O Desafio de Solaria", desc: "Vença o torneio real (duelo de campeões, provas de arco e lógica) sem perder a honra — ou a vida.", kind: "combate", xp: 1400 },
          { id: "i1q2", title: "A Cláusula Esquecida", desc: "Decifre o juridiquês infernal do pergaminho com o arquivista cego Sextus (Investigação/Religião CD 16).", kind: "misterio", xp: 1000 },
          { id: "i1q3", title: "Asseclas na Corte", desc: "Identifique e neutralize os 4 cambiones infiltrados (testes de Intuição em cadeia).", kind: "social", xp: 1200 },
        ],
        choice: {
          id: "i1c1", prompt: "Um cambion capturado revela que Balgor também ofereceu pacto ao grupo, deixado 'em algum lugar que eles respeitem'. Há mesmo um pergaminho com seus nomes... no quarto de vocês.",
          options: [
            { label: "Rasgar imediatamente", outcome: "O pergaminho queima com fogo verde e uma promessa: 'Eu volto.' Feito. Agora vocês estão no radar dele — para sempre.", xp: 1300 },
            { label: "Ler antes de decidir", outcome: "O contrato é tentador de forma quase física. Sabem o custo exato de tudo agora — inclusive de si mesmos. Informação perigosa vale XP.", xp: 1500 },
          ],
        },
        encounterKeys: ["salamandra", "cavaleiro-negro", "golem-carne"],
      },
      {
        id: "inferno-2", title: "Os Cinco Pactos", levelRange: [12, 13],
        reading: [
          "Cada corte, um teatro distinto de corrupção dourada. Em Marmina, o pacto alimenta a frota; em Vulgaris, os mortos marcham com capacetes inoxidáveis; em Petrella, a comida cresce — e quem a come, cresce junto da maneira errada.",
          "Quebrar pactos exige a Lei do Desafio. Alguns reis aceitam com dignidade humilhante. Outros precisam de um golpe de teatro: prova demoníaca, revelação pública ou um bom duelo de insultos com a guarda real.",
          "A cada pacto quebrado, Balgor sangra: a escuridão em volta do seu trono afrouxa e as almas assinadas sussurram de volta — guardiãs inesperadas do lugar onde o trono repousa.",
        ],
        quests: [
          { id: "i2q1", title: "Pacto Um: Marmina", desc: "Desafie o Almirante-Demônio para uma regata ritual pelos canais (Veículos/Arcano CD 15).", kind: "exploracao", xp: 1600 },
          { id: "i2q2", title: "Pacto Dois: Vulgaris", desc: "Duelo de campeões no Coliseu dos Ossos (Cavaleiro Negro ND 9 + devotos).", kind: "combate", xp: 1800 },
          { id: "i2q3", title: "Pacto Três: Petrella", desc: "A Dança de Inverno — vença o Rei Glutão num duelo de resistência e venenos (Constituição em cadeia).", kind: "social", xp: 1600 },
          { id: "i2q4", title: "Pactos Quatro e Cinco", desc: "O Enigma da Duquesa Gêmea e o Jejum do Rei Eremita (Resolução CD 16 / autocontrole).", kind: "misterio", xp: 1800 },
        ],
        choice: {
          id: "i2c1", prompt: "A Duquesa Gêmea oferece seu voto no Concílio — e uma noite na masmorra de veludo dela — em troca do nome de quem traiu o esquema dos pactos. Vocês suspeitam que sabem quem foi.",
          options: [
            { label: "Vender o informante", outcome: "O meio-mundo sussurra que foi Sextus, e Sextus desaparece. A Duquesa cumpre o voto. Negócios infernais são apenas isso: negócios.", xp: 1900 },
            { label: "Proteger a identidade", outcome: "A Duquesa respeita a recusa — com o sorriso de quem acabou de ganhar uma dívida de vocês. Dívidas infernais vencem juros em coincidências.", xp: 1700 },
          ],
        },
        encounterKeys: ["golem-pedra", "gargula", "cavaleiro-negro"],
      },
      {
        id: "inferno-3", title: "Descida aos Círculos", levelRange: [13, 14],
        reading: [
          "O portão sob Solaria engole heróis como um tribunal engole réus. Os Círculos não são lugares — são julgamentos com arquitetura. Cada círculo cobra sua passagem na moeda de quem atravessa.",
          "Luxúria cobra memórias felizes. Avareza cobra ouro que carrega significado. Ira cobra contenção; quem socar primeiro, perde. O Círculo da Fraude exige verdades inconvenientes ditas em voz alta.",
          "No fundo, a Sala dos Pergaminhos guarda o Pacto Original de Balgor — aquele que o Diabo assinou para baní-lo. Se o Rei Demônio conseguir fraude na própria pena... não haverá Inferno nem mundo que o segure.",
        ],
        quests: [
          { id: "i3q1", title: "Os Pagamentos dos Círculos", desc: "Atravesse os 7 círculos resolvendo cada cobrança (escolhas de roleplay + testes CD 14-17).", kind: "misterio", xp: 2200 },
          { id: "i3q2", title: "Guardiões do Abismo", desc: "Os Corníferos de Gaze (elementais de fogo ND 11) e o Tremor de Bhaal (golem de carne ND 12).", kind: "combate", xp: 2400 },
          { id: "i3q3", title: "A Sala dos Pergaminhos", desc: "Roube o Pacto Original sob o nariz do Arquivista Cego — ou convença a burocracia infernal do erro (Enganação/Persuasão CD 17).", kind: "social", xp: 2000 },
        ],
        choice: {
          id: "i3c1", prompt: "No Círculo da Fraude, cada um deve confessar em voz alta a mentira que mais contou na aventura. Balgor assiste. Balgor sempre assiste nesta parte.",
          options: [
            { label: "Verdades completas", outcome: "O grupo sangra honestidade. O caminho abre. Ninguém se olha nos olhos por uma hora — e depois ninguém precisa mais.", xp: 2200 },
            { label: "Enganar a Fraude", outcome: "Possível (CD 18)! Enganar o próprio Círculo é a maior blasfêmia — e o maior barato. Há rumores e há penalidades; o mestre decide ambos.", xp: 2500 },
          ],
        },
        encounterKeys: ["elemental-fogo", "golem-carne", "beholder"],
      },
      {
        id: "inferno-4", title: "O Trono de Balgor", levelRange: [14, 15], isFinale: true, bossKey: "boss-balgor",
        reading: [
          "O Trono de Balgor é uma montanha de coroas derretidas. O Rei Demônio espera de pé — reis não se levantam para réus, mas vocês não são réus. Vocês são término de contrato.",
          "Com cinco pactos anulados, as almas presas ao redor do trono mordem suas correntes. Com o Pacto Original em mãos, há uma alternativa final: lê-lo em voz alta inverte a fraude — o banido vira carcereiro.",
          "Balgor sorri: 'Eu já perdi tronos antes. Vocês já viram alguém perder o mundo?' Ataque ao trono é guerra total; lê-lo é risco total. A lei do inferno não esclareceu as apostas — vocês terão de escrever.",
        ],
        quests: [
          { id: "i4q1", title: "A Guarda do Trono", desc: "Os Sete Campeões dos Pactos Quebrados (elite de Cavaleiros Negros + Golem escalados).", kind: "combate", xp: 3000 },
          { id: "i4q2", title: "Ler ou Não Ler", desc: "Recitar o Pacto Original durante o combate (3 rodadas de concentração sob interrupção) inverte o banimento.", kind: "misterio", xp: 2800 },
          { id: "i4q3", title: "Balgor, o Rei Demônio", desc: "O duelo final em 4 fases. Os pactos anulados enfraquecem cada fase — contem seus sucessos.", kind: "combate", xp: 5000 },
        ],
        choice: {
          id: "i4c1", prompt: "No estertor final, Balgor ri: 'Os Infernos precisam de um Rei no trono agora. A vaga é minha. Ou sua.' A coroa flutua entre vocês.",
          options: [
            { label: "Recusar o trono", outcome: "O vácuo exige dono; o Diabo retorna às pressas. Vocês saem pelas portas da frente com as almas salvas como prêmio — e mil demônios anotando seus nomes.", xp: 4500 },
            { label: "Um herói assume (o mais sombrio)", outcome: "Alguém fica. O preço é despedida. O Reino ganha um Rei Demônio 'razoável'— como a história nunca cansa de comprovar, absolutamente nada pode dar errado.", xp: 5000 },
          ],
        },
        encounterKeys: ["golem-carne", "salamandra", "beholder"],
      },
    ],
  },
  {
    id: "eternus",
    name: "O Trono de Eternus",
    tagline: "Toda história tem um final. Nem toda merece.",
    levels: "Níveis 15–20",
    summary: "Sob o continente inteiro dorme Eternus, a máquina-dinastia dos Primeiros Reis: um trono que decide quem governa a própria realidade. Reativado pelo tumulto dos arcos anteriores, o Trono convoca 'herdeiros dignos' para a Provação Final. Reis, liches, dragões e deuses menores aceitaram o convite. Os heróis foram convocados por engano — ou talvez sejam o único engano do sistema.",
    recEnv: ["dungeon", "templo", "torre", "castelo"],
    chapters: [
      {
        id: "eternus-1", title: "A Convocação", levelRange: [15, 16],
        reading: [
          "Marcas douradas aparecem nas palmas dos convocados — inclusive nas suas. O Trono despertou e conclui que o mundo carece de administrador. A Provação decidirá quem senta.",
          "No Vale dos Candidatos, tendas de deuses menores, dragões anciães com sorrisos políticos e liches diplomáticos armam acampamento. Cada um carrega uma campanha, um exército e um esqueleto no armário — às vezes literal.",
          "O Arquiteto, constructo portavoz do Trono, explica as regras: provas em sete esferas (Força, Mente, Coração, Juízo, Coragem, Tempo e Verdade). Trapaça é premio; ser pego trapaçeando é penalidade.",
        ],
        quests: [
          { id: "e1q1", title: "Cartório dos Candidatos", desc: "Registre títulos e façanhas diante do Arquiteto (Persuasão/Atuação CD 16; façanhas reais dos arcos contam como bônus).", kind: "social", xp: 2600 },
          { id: "e1q2", title: "Espiões de Campanha", desc: "Descubra quem sabotou o acampamento do Centauro de Prata (encenação ou Investigação CD 17).", kind: "misterio", xp: 2800 },
          { id: "e1q3", title: "A Primeira Prova: Coragem", desc: "A Arena do Valor julga não se vocês vencem — mas como vocês reagem quando já perderam (encontro difícil intencional).", kind: "combate", xp: 3000 },
        ],
        choice: {
          id: "e1c1", prompt: "O Olho dos Candidatos registra: 3 dos rivais são assassinos confessos, 2 deuses de mentira, 1 criança-deus, e 1 é... vocês em outro tempo. O Arquiteto pergunta: 'Objeções?'",
          options: [
            { label: "Objeção formal", outcome: "O Arquiteto anota: 'Primeira objeção da história.' Vocês ganham jurisprudência — e rivais permanentes.", xp: 3000 },
            { label: "Sem objeções", outcome: "Respeito não gasta papel. Os outros candidatos começam a temê-los silenciosamente.", xp: 2600 },
          ],
        },
        encounterKeys: ["golem-pedra", "cavaleiro-negro", "beholder"],
      },
      {
        id: "eternus-2", title: "As Sete Esferas", levelRange: [16, 17],
        reading: [
          "As provas tornam-se personais. Na Esfera da Mente, cada um enfrenta o próprio pior argumento. Na Esfera do Coração, um pedido impossível e uma balança que não mente.",
          "Na Esfera do Tempo, versões de vocês mesmos com escolhas diferentes jogam contra. Ganhar de si mesmo é uma arte; perder para si mesmo, um diagnóstico.",
          "Os rivais caem um a um — não pela dificuldade, mas por interpretarem mal o que o Trono chama de digno. O Trono não quer o mais forte. Nunca quis.",
        ],
        quests: [
          { id: "e2q1", title: "Esfera da Mente & Verdade", desc: "Debates com espelhos e confissões diante de uma audiência de estátuas (Inteligência/Sabedoria encadeados).", kind: "misterio", xp: 3200 },
          { id: "e2q2", title: "Esfera da Força & Juízo", desc: "Um combate onde vencer é punido e render-se no instante exato é a solução (leitura tática).", kind: "combate", xp: 3400 },
          { id: "e2q3", title: "Esfera do Tempo", desc: "Duelo com o grupo inteiro espelhado (use as fichas dos próprios personagens como monstros de ND igual).", kind: "combate", xp: 3600 },
          { id: "e2q4", title: "Esfera do Coração", desc: "A Balança pede a contribuição mais cara. O que o grupo está disposto a depositar: memórias, laços, ouro, nome?", kind: "social", xp: 3400 },
        ],
        choice: {
          id: "e2c1", prompt: "A criança-deus candidata chora na Esfera do Coração. Ela não entende a oferenda exigida: 'doe o que mais ama'.",
          options: [
            { label: "Ajudá-la (custa a prova)", outcome: "Vocês abdicam de pontos preciosos. O Trono anota algo indecifrável. A criança-deus guardará isto por éons.", xp: 3600 },
            { label: "Cada um por si", outcome: "A prova a elimina com gentileza. O Trono não pune. Os deuses mais antigos, que assistem, fazem suas anotações.", xp: 3000 },
          ],
        },
        encounterKeys: ["devorador-mente", "beholder", "golem-pedra"],
      },
      {
        id: "eternus-3", title: "A Provação Final", levelRange: [17, 19],
        reading: [
          "Restam três: vocês, um dragão ancião com discurso pacífico e um lich com proposta administrativa. A Prova Final acontece no Trono em si — e Eternus, o Colosso que o guarda, não distingue candidatos de insetos.",
          "Eternus executa protocolos escritos quando a realidade era jovem. O Colosso não odeia. Isso é o mais ofensivo.",
          "O Arquiteto cochicha a regra última: 'A Prova termina quando um candidato senta no Trono. O Colosso executa todos os outros. Escolham a ordem com sabedoria — ou lutem para mudar as regras.'",
        ],
        quests: [
          { id: "e3q1", title: "Aliança ou Emboscada", desc: "Negocie com os dois finalistas: aliança de três, ataque coordenado ao Colosso, ou emboscada mútua (a história decide com dados).", kind: "social", xp: 3800 },
          { id: "e3q2", title: "Eternus, o Colosso do Trono", desc: "A maior construção bélica já erguida, em 4 fases com protocolos crescentes (use o boss Colosso escalado para ND 18).", kind: "combate", xp: 6000 },
          { id: "e3q3", title: "As Regras por Baixo do Trono", desc: "Descubra a nota de rodapé de Meridia: 'O Trono serve a quem serve.' (Investigação/Religião CD 18), o que muda tudo.", kind: "misterio", xp: 4200 },
        ],
        choice: {
          id: "e3c1", prompt: "Com o Colosso em autodestruição, o Trono oferece um atalho: sente AGORA e interrompa o protocolo. A primeira alma a sentar governa; governa de verdade; governa tudo.",
          options: [
            { label: "Alguém senta", outcome: "O protocolo para. Um herói sobe ao trono do mundo — e o grupo decide juntos que tipo de deus recém-nascido ele será. Os deuses antigos aguardam com interesse.", xp: 5500 },
            { label: "Ninguém senta (coragem extrema)", outcome: "O Colosso conta até o fim. O Trono desmorona sob a própria lógica. A história herdou um vácuo de poder — e só vocês viram como ele se encheu.", xp: 6000 },
          ],
        },
        encounterKeys: ["golem-pedra", "beholder"],
      },
      {
        id: "eternus-4", title: "O Que o Trono Guardava", levelRange: [19, 20], isFinale: true, bossKey: "boss-dragao-vermelho",
        reading: [
          "Sob o Trono não havia mecanismo: havia um prisioneiro. Pyraxion-Prime, o primeiro dragão, acorrentado como bateria da realidade. Os Primeiros Reis não inventaram o Trono — inventaram a necessidade dele.",
          "Libertá-lo devolve magia selvagem ao mundo (e o caos de dragões antigos). Mantê-lo preso perpetua a máquina. Encerrar a máquina sem libertá-lo exige trazer a linhagem dos carcereiros de volta — e a última portadora é Mirra, a estalajadeira do Javali Dourado, bisneta de dois mil anos esquecida.",
          "Syncronicamente, todos os seus antigos inimigos escolhem este momento: Cinderax. Morvanyx, remendado. Balgor em exílio. Todos vêm pelo prisioneiro. A última mesa do jogo é jogada aqui.",
        ],
        quests: [
          { id: "e4q1", title: "A Linhagem de Mirra", desc: "Convença a estalajadeira a buscar seu posto — e proteja-a de todos os que a querem não-morta e não-viva.", kind: "social", xp: 5000 },
          { id: "e4q2", title: "A Conciliação Final", desc: "Todos os bosses derrotados retornam, envelhecidos: Cinderax, Morvanyx remendado, Balgor exilado (escale para ND 17-18 em cadeia).", kind: "combate", xp: 7000 },
          { id: "e4q3", title: "Pyraxion-Prime", desc: "O primeiro réptil sob o mundo. Derrotá-lo não exige matá-lo — exige libertá-lo, acalmá-lo ou trancá-lo por mais um ciclo (ND 20).", kind: "combate", xp: 9000 },
        ],
        choice: {
          id: "e4c1", prompt: "A última escolha da saga, com o destino de dragões, máquinas e contos em equilíbrio:",
          options: [
            { label: "Libertar Pyraxion", outcome: "O primeiro dragão ergue-se até as estrelas. A magia corre selvagem novamente; os contos recomeçam do zero, em algum bloco de ferro. Época terminada com honra.", xp: 10000 },
            { label: "Herdeiros do Trono (com Mirra)", outcome: "A máquina ganha uma administradora que serve cerveja. A era da estabilidade começa com humor. Brindes são emitidos pelo próprio Trono, ocasionalmente em forma de moedas.", xp: 9000 },
            { label: "Um de vocês fica sentado", outcome: "A deusa/o deus da mesa de jogo rege com sabedoria. Quando alguém pergunta quem governa, estalajadeiras de todo mundo levantam os olhos do copo e sorriem.", xp: 11000 },
          ],
        },
        encounterKeys: ["boss-dragao-vermelho", "boss-lich", "boss-balgor"],
      },
    ],
  },
];

export function getArc(id: string): ArcDef {
  return ARCS.find((a) => a.id === id) ?? ARCS[0];
}

export function getChapter(arcId: string, chapterId: string): ChapterDef {
  const arc = getArc(arcId);
  return arc.chapters.find((c) => c.id === chapterId) ?? arc.chapters[0];
}

// ============================================================
// Geradores de conteúdo lateral (anti-repetição)
// ============================================================

export const TAVERN_RUMORS: string[] = [
  "Um pescador jura ter visto luzes caminhando sob o lago congelado. Desde então, ele se recusa a molhar os pés.",
  "O filho do ferreiro conversa com o poço. O poço, segundo o menino, responde com vontade de aprender.",
  "Caravanas do norte chegam com carga intacta e sem nenhum condutor vivo. Os cavalos estão bem tratados.",
  "Um dos guardas do portão envelheceu 20 anos em uma noite de patrulha e agora se recusa a dizer onde estava.",
  "A bibliotecária vendeu um livro que devora outros livros. O comprador deixou apenas uma caixa de cinzas alfabetizadas.",
  "Há um torneio clandestino na adega do templo — os monges quebram mais do que jejuns lá embaixo.",
  "O cemitério novo já está cheio. O estranho: metade das lápides têm dados de nascimento de amanhã.",
  "Uma mercadora vende sonhos engarrafados. O mais caro é sempre 'o último sonho do ancião que morreu sem herdeiros'.",
  "Dragões menores foram vistos voando em formação de luto. Ornitólogos confirmam: dragões não voam em formação.",
  "O alfaiate confecciona roupas que se ajustam ao corpo do morto. Clientes pagam adiantado por encomendas póstumas.",
  "Dois caçadores trouxeram um veado de pelagem prateada com uma coroa crescida nos chifres como raízes.",
  "O juiz da cidade recebeu um mandado de prisão contra si mesmo, assinado por ele mesmo, datado de segunda-feira.",
];

export interface SideQuestGen {
  hook: string;
  objective: string;
  twist: string;
  kind: string;
}

export const SIDE_QUESTS: SideQuestGen[] = [
  { hook: "Uma criança segue o grupo há três dias", objective: "Descobrir quem a enviou e protegê-la no caminho", twist: "Ela é a herdeira legítima de um ducado que caiu há 60 anos — e não parece ter envelhecido", kind: "social" },
  { hook: "Um alquimista precisa de 3 ovos de basilisco", objective: "Infiltrar-se no ninho sem ser petrificado", twist: "Ele quer os ovos para chocar e criar um guardião contra algo pior que vem chegando", kind: "combate" },
  { hook: "O coveiro enterra as mesmas pessoas toda semana", objective: "Vigiar o cemitério à noite e descobrir o que acontece", twist: "Um necromante benevolente mantém 'consultório dos mortos' para viúvas se despedirem", kind: "misterio" },
  { hook: "Um mapa tatuado nas costas de um mendigo bêbado", objective: "Convencê-lo a guiar a expedição ao tesouro", twist: "O mapa é da prisão onde um falso deus está trancado dormindo", kind: "exploracao" },
  { hook: "Cartas de amor aparecem no quarto do grupo toda noite", objective: "Descobrir quem deixa e o que quer", twist: "É o fantasma de quem escreveu a carta original — de 200 anos — presa no loop", kind: "misterio" },
  { hook: "Um cavaleiro desafia qualquer um para duelo na ponte", objective: "Vencer ou convencê-lo a ceder a passagem", twist: "Ele guarda a ponte não por honra — é o único que segura o portão dimensional no fundo do rio", kind: "combate" },
  { hook: "O prefeito oferece 500 po pela cabeça de um 'monstro da floresta'", objective: "Caçar a criatura", twist: "O 'monstro' é um guardião druídico mantendo uma maldição antiga baixa desde antes da vila existir", kind: "combate" },
  { hook: "Uma casa assombrada na colina grita toda lua cheia", objective: "Passar uma noite dentro e encerrar o fenômeno", twist: "A casa é inocente: o verdadeiro fantasma é o corretor imobiliário, que assassinou os donos originais", kind: "misterio" },
  { hook: "Pássaros atacam qualquer um que tente sair do vale", objective: "Escoltar um mensageiro vivo para fora", twist: "Os pássaros são mantidos por uma profecia: 'Se a notícia sair, a guerra chega.'", kind: "exploracao" },
  { hook: "Um brinde no bar: qualquer um que consiga provar que não é um simulacro ganha 100 po", objective: "Provar identidade para um filósofo-apassarinamento", twist: "O dono do bar é um mago paranoico que perdeu o elo consigo mesmo e precisa de testemunhas para existir", kind: "social" },
  { hook: "Uma vinícola produz vinho que diz verdades", objective: "Roubar uma garrafa sem beber do produto", twist: "O vinho faz o dono plantar a verdade mais inconveniente de cada um na adega — física e literalmente", kind: "exploracao" },
  { hook: "Há um homem na prisão que se confessa de crimes ainda não cometidos", objective: "Investigar se é loucura ou vidência", twist: "Ele sonha com cada crime uma semana antes — e o próximo é o assassinato da pessoa mais importante da cidade", kind: "misterio" },
];

export const RANDOM_EVENTS: string[] = [
  "Um mercador ambulante oferece 'pó de fada legítimo' com garantia de 30 dias. O pó é legítimo.",
  "Um corvo pousa no ombro de um herói e recita, com voz humana: 'Ainda dá tempo de voltar.'",
  "Chove durante 1h apenas sobre a fogueira do grupo. Tudo ao redor permanece seco.",
  "Dois goblins choram abraçados à beira da estrada. Perderam o dragão de estimação ('era pequeno!').",
  "Um mensageiro entrega carta para um herói: datada de 10 anos atrás, avisa sobre a aventura atual com precisão assustadora.",
  "A lua parece mais próxima esta noite. Druidas do grupo sentem náusea sorrindo.",
  "Uma porta flutuante aparece. Do outro lado: a taverna do início da campanha, 5 minutos depois da partida de vocês.",
  "Todos os reflexos em espelhos d'água estão adiantados em 2 segundos em relação ao mundo real.",
  "Um grupo de peregrinos cego segue um caixão que flutua meio metro acima do chão. Eles cantam em vozes que não estão sincronizadas.",
  "Um vendedor de seguros mágicos oferece apólice contra amaldiçoamento, possessão e preço de pocão. O contrato tem 400 fichas de letra miúda.",
];

export const DUNGEON_EVENTS: string[] = [
  "Espinhos sobem do chão em espiral lenta: sala com teste de agilidade crescente (1d4/turno falhado).",
  "Um goblin oferece mapa da masmorra em troca de 'uma história boa e um queijo'.",
  "Rocha cede e revela câmara cilíndrica vertical: 30m de urdidura viva descendo. Luz no fundo.",
  "Livro de anotações de um aventureiro anterior: última página diz 'ele está atrás de você' com letra trêmula.",
  "Fonte dourada: primeiro gole cura 2d8; segundo, teste CON ou amaldiçoado até próximo descanso.",
  "Sala com eco moral: cada palavra grosseira dita reverbera como sussurro aterrorizante na sala ao lado.",
  "Porta mentirosa: abre sozinha para corredores realizados de medo. Quem cruzar primeiro decide a qual medo.",
  "Ilusão de festa com convidados congelados: sentar à mesa revela o convite em branco para 'você'.",
  "Armadilha compassada: agulhas no ritmo do tambor distante; andar no compasso torna inofensivas.",
  "Estátua de herói com a mesma feição do membro mais velho do grupo. Placa: 'Em memória.'",
];

export const TREASURES = [
  { tier: "Menor (ND 1-4)", items: ["2d6×10 po", "Gema de quarto fumê (50 po)", "Poção de Cura", "Pergaminho 1º círculo", "Trinque mágico (sempre limpo)", "Ferramentas de ladrão de qualidade"] },
  { tier: "Moderado (ND 5-10)", items: ["3d6×100 po", "Poção de Cura Maior", "Arma +1", "Anel de Proteção (+1 CA)", "Capa Élfica", "Pergaminho 3º círculo", "Botas de Agilidade"] },
  { tier: "Maior (ND 11-16)", items: ["2d6×1000 po", "Arma +2", "Armadura +1", "Amuleto de Escudos (3 cargas/dia, 2d6+2 redução)", "Manto de Deslocamento", "Pergaminho 5º círculo", "Figurina de Bronze (cavalo)"] },
  { tier: "Lendário (ND 17+)", items: ["Relíquia dos Primeiros Reis", "Arma +3 com nome próprio", "Orbe da Realidade (1 desejo menor)", "Asas de Voo", "Tomo do Conhecimento Proibido (+2 INT permanente, custo com mestre)", "Lâmina da Noite Eterna"] },
];

export function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function generateSideQuest(): SideQuestGen & { xp: number } {
  const q = pick(SIDE_QUESTS);
  return { ...q, xp: 200 + Math.floor(Math.random() * 300) };
}

export function xpForLevelRange(level: number): { minor: number; standard: number; major: number } {
  const mult = Math.pow(2.6, (level - 1) / 4);
  return { minor: Math.round(100 * mult), standard: Math.round(250 * mult), major: Math.round(500 * mult) };
}
