// 60 presets de mapa: 12 temas × 5 variações, com layout procedural determinístico.

export interface MapTheme {
  key: string;
  name: string;
  icon: string;
  palette: Record<string, string>; // terrainId -> cor
  defaultTerrain: string;
  variants: string[];
  features: string[]; // terrains extras usados na geração
  ambience: string;
}

export const TERRAIN_INFO: Record<string, { name: string; kind: "chao" | "parede" | "objeto" | "perigo" | "agua" }> = {
  piso: { name: "Piso", kind: "chao" },
  grama: { name: "Grama", kind: "chao" },
  terra: { name: "Terra Batida", kind: "chao" },
  pedra: { name: "Pedra", kind: "chao" },
  areia: { name: "Areia", kind: "chao" },
  neve: { name: "Neve", kind: "chao" },
  madeira: { name: "Madeira", kind: "chao" },
  mosaico: { name: "Mosaico", kind: "chao" },
  parede: { name: "Parede", kind: "parede" },
  rocha: { name: "Rocha", kind: "parede" },
  arvore: { name: "Árvore", kind: "parede" },
  arbusto: { name: "Arbusto", kind: "objeto" },
  agua: { name: "Água", kind: "agua" },
  lava: { name: "Lava", kind: "perigo" },
  espinhos: { name: "Espinhos", kind: "perigo" },
  gelo: { name: "Gelo Escorregadio", kind: "perigo" },
  fogo: { name: "Fogo", kind: "perigo" },
  portao: { name: "Portão", kind: "objeto" },
  bau: { name: "Baú", kind: "objeto" },
  altar: { name: "Altar", kind: "objeto" },
  pilar: { name: "Pilar", kind: "objeto" },
  tumulo: { name: "Túmulo", kind: "objeto" },
  poco: { name: "Poço Raso", kind: "agua" },
  armadilha: { name: "Armadilha", kind: "perigo" },
  trono: { name: "Trono", kind: "objeto" },
};

export const THEMES: MapTheme[] = [
  { key: "dungeon", name: "Masmorra", icon: "Castle", defaultTerrain: "pedra", ambience: "Tochas sibilam nos corredores úmidos.",
    palette: { piso: "#3a3632", pedra: "#454038", mosaico: "#4d4438", parede: "#191612", rocha: "#2a251f", agua: "#1e3a4a", pilar: "#55504a", bau: "#6b4c22", altar: "#5a4a6a", armadilha: "#7a3030", portao: "#4a3c28", fogo: "#8a4a20", terra: "#4d4234" },
    variants: ["Cela dos Condenados", "Corredores Sombrios", "Sala do Ritual", "Cripta Opressora", "A Fortaleza Interna"],
    features: ["pilar", "bau", "armadilha", "portao", "altar"] },
  { key: "caverna", name: "Caverna", icon: "Mountain", defaultTerrain: "pedra", ambience: "Gotas ecoam na escuridão mineral.",
    palette: { piso: "#453f3a", pedra: "#4e4844", terra: "#574c3c", parede: "#1c1815", rocha: "#332d28", agua: "#1c4254", poco: "#28525e", pilar: "#5c5248", fogo: "#8a4a20", bau: "#6b4c22" },
    variants: ["Gruta de Cristais", "Túneis Sinuosos", "Câmara do Subterrâneo", "Ponte sobre o Abismo", "Ninho Umbral"],
    features: ["rocha", "poco", "pilar", "bau"] },
  { key: "floresta", name: "Floresta", icon: "Trees", defaultTerrain: "grama", ambience: "Luz filtrada por copas anciãs.",
    palette: { grama: "#2e4a2c", piso: "#3d5238", terra: "#5a4a34", arbusto: "#3f6a3a", arvore: "#1d3018", agua: "#204a5e", poco: "#2a5a68", pedra: "#5a5a52" },
    variants: ["Clareira Sagrada", "Bosque Sombrio", "Rio Entre Raízes", "Acampamento Abandonado", "Corredor de Carvalhos"],
    features: ["arvore", "arbusto", "agua", "poco"] },
  { key: "pantano", name: "Pântano", icon: "Waves", defaultTerrain: "terra", ambience: "Névoa baixa e coisas que borbulham.",
    palette: { terra: "#4a4434", grama: "#3d4530", agua: "#263c34", poco: "#1e3028", arvore: "#24301f", arbusto: "#3a4a2e", pedra: "#4e4c44", espinhos: "#5a3a3a" },
    variants: ["Lamaçal dos Sussurros", "Ruínas Alagadas", "Ilha do Salgueiro", "Passagem dos Répteis", "Olhos na Água"],
    features: ["agua", "poco", "arvore", "arbusto", "espinhos"] },
  { key: "castelo", name: "Castelo", icon: "Landmark", defaultTerrain: "mosaico", ambience: "Estandartes flamejam nas ameias.",
    palette: { mosaico: "#565258", piso: "#4c4850", pedra: "#5c585c", parede: "#25232a", madeira: "#5a4632", agua: "#223c58", trono: "#6a5426", altar: "#4a3c5c", portao: "#3c3428" },
    variants: ["Salão do Trono", "Pátio das Armas", "Capela Real", "Torre de Menagem", "Salão de Banquetes"],
    features: ["pilar", "trono", "altar", "portao", "madeira"] },
  { key: "deserto", name: "Deserto", icon: "Sun", defaultTerrain: "areia", ambience: "O vento esculpe ossos e dunas.",
    palette: { areia: "#8a744e", terra: "#7c6a48", pedra: "#6e6250", rocha: "#4e463c", parede: "#332d24", agua: "#3a6a72", poco: "#2e565e", fogo: "#8a4a20" },
    variants: ["Ruínas dos Reis de Areia", "Oásis Escondido", "Dunas do Lamento", "Tumba ao Relento", "Cânion do Vento"],
    features: ["rocha", "pedra", "poco", "agua"] },
  { key: "neve", name: "Tundra", icon: "Snowflake", defaultTerrain: "neve", ambience: "O frio racha como aço.",
    palette: { neve: "#b8c4cc", piso: "#9fb0ba", gelo: "#7ea6b8", rocha: "#5a626a", parede: "#323a40", arvore: "#3c4a44", agua: "#2e5866" },
    variants: ["Vale Congelado", "Passo da Nevasca", "Lago de Vidro", "Ruínas Geladas", "Covil do Inverno"],
    features: ["rocha", "arvore", "gelo", "agua"] },
  { key: "vulcanico", name: "Terra Vulcânica", icon: "Flame", defaultTerrain: "rocha", ambience: "O chão respira calor e cinza.",
    palette: { rocha: "#3a3230", pedra: "#443c38", terra: "#4a3c34", lava: "#a03a1a", fogo: "#c2602a", parede: "#1a1512", agua: "#26424e" },
    variants: ["Rios de Fogo", "Caldeira Negra", "Câmara do Magma", "Ponte de Obsidiana", "Coração Ardente"],
    features: ["lava", "fogo", "rocha", "pilar"] },
  { key: "cripta", name: "Cripta", icon: "Skull", defaultTerrain: "pedra", ambience: "O silêncio dos séculos pesa como chumbo.",
    palette: { pedra: "#423e40", piso: "#38343a", parede: "#161318", tumulo: "#4e4850", altar: "#3c3444", agua: "#1e3038", fogo: "#5a3a20" },
    variants: ["Catacumbas dos Reis", "Ossário Sem Fim", "Tumba Selada", "Câmara dos Lamentos", "Corredor dos Ancestrais"],
    features: ["tumulo", "altar", "pilar", "fogo"] },
  { key: "costa", name: "Costa & Porto", icon: "Anchor", defaultTerrain: "areia", ambience: "Sal, gaviotas e segredos de marinheiros.",
    palette: { areia: "#9a8a62", agua: "#2a5a78", poco: "#1e485e", madeira: "#6a5236", piso: "#7a6a4c", rocha: "#5e5a50", pedra: "#6e6860" },
    variants: ["Docas ao Entardecer", "Praia dos Naufrágios", "Caverna dos Contrabandistas", "Farol Abandonado", "Baía dos Corsários"],
    features: ["agua", "poco", "madeira", "rocha", "bau"] },
  { key: "templo", name: "Templo", icon: "Church", defaultTerrain: "mosaico", ambience: "Incenso antigo e ouro intocado.",
    palette: { mosaico: "#5c5348", piso: "#4e463c", pedra: "#565040", parede: "#211c16", altar: "#6a5a34", trono: "#756130", agua: "#264452", fogo: "#7a4a22" },
    variants: ["Santuário Dourado", "Nave dos Penitentes", "Câmara do Oráculo", "Jardim Suspenso", "Adega Sacra"],
    features: ["altar", "pilar", "trono", "fogo", "agua"] },
  { key: "torre", name: "Torre Arcana", icon: "Wand2", defaultTerrain: "madeira", ambience: "Energia arcanítica estala no ar.",
    palette: { madeira: "#5a4634", piso: "#4e4032", mosaico: "#4a4254", pedra: "#4c4854", parede: "#1c1a24", agua: "#243c58", altar: "#564a6a", fogo: "#6a3a6a" },
    variants: ["Biblioteca Flutuante", "Laboratório de Alquimia", "Observatório Estelar", "Sala dos Portais", "Aposentos do Arquimago"],
    features: ["pilar", "altar", "bau", "fogo", "madeira"] },
];

export interface MapPreset {
  id: number;
  themeKey: string;
  themeName: string;
  name: string;
  width: number;
  height: number;
  ambience: string;
}

export const MAP_PRESETS: MapPreset[] = THEMES.flatMap((theme, ti) =>
  theme.variants.map((v, vi) => ({
    id: ti * 5 + vi,
    themeKey: theme.key,
    themeName: theme.name,
    name: `${theme.name} — ${v}`,
    width: 16 + ((ti + vi) % 4) * 2,
    height: 10 + ((ti * 2 + vi) % 3) * 2,
    ambience: theme.ambience,
  }))
);

export function getTheme(key: string): MapTheme {
  return THEMES.find((t) => t.key === key) ?? THEMES[0];
}

// PRNG determinístico (mulberry32)
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Gera o layout base de um preset: bordas, rochas/árvores, pilares, água/lava, objetos.
export function generatePresetCells(presetId: number, width: number, height: number): Record<string, string> {
  const preset = MAP_PRESETS[presetId % MAP_PRESETS.length];
  const theme = getTheme(preset.themeKey);
  const rand = rng(presetId * 9973 + 42);
  const cells: Record<string, string> = {};
  const wall = theme.palette["parede"] !== undefined ? "parede" : "rocha";
  const useRocha = ["caverna", "pantano", "deserto", "neve", "vulcanico", "costa"].includes(theme.key);
  const wallTerrain = useRocha && ["caverna", "deserto", "neve", "vulcanico"].includes(theme.key) ? "rocha" : theme.key === "floresta" || theme.key === "pantano" ? "arvore" : wall;

  // bordas
  for (let x = 0; x < width; x++) for (let y = 0; y < height; y++) {
    if (x === 0 || y === 0 || x === width - 1 || y === height - 1) cells[`${x},${y}`] = wallTerrain;
  }

  // aglomerados internos
  const clusters = 3 + Math.floor(rand() * 3);
  for (let c = 0; c < clusters; c++) {
    const feature = theme.features[Math.floor(rand() * theme.features.length)];
    const cx = 2 + Math.floor(rand() * (width - 4));
    const cy = 2 + Math.floor(rand() * (height - 4));
    const r = 1 + Math.floor(rand() * 2);
    for (let dx = -r; dx <= r; dx++) for (let dy = -r; dy <= r; dy++) {
      if (Math.abs(dx) + Math.abs(dy) <= r && rand() > 0.25) {
        const x = cx + dx, y = cy + dy;
        if (x > 0 && y > 0 && x < width - 1 && y < height - 1) cells[`${x},${y}`] = feature;
      }
    }
  }

  // manchas de piso alternativo
  const alt = theme.key === "floresta" ? "terra" : theme.key === "castelo" || theme.key === "templo" ? "piso" : "piso";
  for (let i = 0; i < width * height * 0.06; i++) {
    const x = 1 + Math.floor(rand() * (width - 2));
    const y = 1 + Math.floor(rand() * (height - 2));
    const k = `${x},${y}`;
    if (!cells[k]) cells[k] = alt;
  }

  // objetos únicos do tema (2-4)
  const special = theme.features.filter((f) => ["bau", "altar", "trono", "armadilha", "portao", "tumulo"].includes(f));
  const n = 2 + Math.floor(rand() * 2);
  for (let i = 0; i < n; i++) {
    const x = 2 + Math.floor(rand() * (width - 4));
    const y = 2 + Math.floor(rand() * (height - 4));
    const k = `${x},${y}`;
    if (!cells[k] && special.length) cells[k] = special[Math.floor(rand() * special.length)];
  }
  return cells;
}

export const PALETTE_ORDER = ["piso", "grama", "terra", "pedra", "areia", "neve", "madeira", "mosaico", "parede", "rocha", "arvore", "arbusto", "agua", "poco", "gelo", "lava", "fogo", "espinhos", "armadilha", "portao", "bau", "altar", "pilar", "tumulo", "trono"];

export const DEFAULT_COLORS: Record<string, string> = {
  piso: "#4a4238", grama: "#3a5a36", terra: "#5c4a34", pedra: "#565249", areia: "#9a8a62", neve: "#bcc8d0",
  madeira: "#6a5236", mosaico: "#5c5348", parede: "#241f1a", rocha: "#3a342c", arvore: "#20331b", arbusto: "#3f6a3a",
  agua: "#2a5a7a", poco: "#23485c", gelo: "#8ab4c4", lava: "#b0441e", fogo: "#c2602a", espinhos: "#6a3a3a",
  armadilha: "#8a3030", portao: "#52422c", bau: "#7a5a26", altar: "#5a4a6e", pilar: "#5c564e", tumulo: "#4e4850", trono: "#7a6228",
};
