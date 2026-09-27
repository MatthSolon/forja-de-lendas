"use client";

import { useMemo, useRef, useState } from "react";
import type { BoardState, CharacterRow, TokenState } from "@/lib/types";
import { MAP_PRESETS, getTheme, DEFAULT_COLORS, TERRAIN_INFO, PALETTE_ORDER, generatePresetCells } from "@/lib/data/maps";
import { classArtIndex, monsterArtIndex, monsterKeyFromRef, spriteStyle } from "@/lib/art";
import TokenAvatar from "@/components/token-art";
import { uid, TOKEN_COLORS } from "@/lib/game";
import { Hand, Eraser, CloudFog, ZoomIn, ZoomOut, Grid3x3, UserPlus, Trash2 } from "lucide-react";

const CS = 44;

// ---------- utilidades de cor/ruído ----------
function shade(hex: string, amt: number): string {
  const n = hex.replace("#", "");
  const r = parseInt(n.slice(0, 2), 16), g = parseInt(n.slice(2, 4), 16), b = parseInt(n.slice(4, 6), 16);
  const f = (v: number) => Math.max(0, Math.min(255, Math.round(amt >= 0 ? v + (255 - v) * amt : v * (1 + amt))));
  return `#${[f(r), f(g), f(b)].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}
function hash2(x: number, y: number): number {
  let h = (x * 374761393 + y * 668265263) ^ 0x5bf03635;
  h = (h ^ (h >> 13)) * 1274126177;
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
}

const KIND_BY_TERRAIN = TERRAIN_INFO;

interface BattleMapProps {
  board: BoardState;
  onChange?: (b: BoardState) => void;
  characters?: CharacterRow[];
  editable?: boolean;
  moverRefId?: string;
  activeRefId?: string;
  mini?: boolean;
}

export default function BattleMap({ board, onChange, characters = [], editable = false, moverRefId, activeRefId, mini = false }: BattleMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [tool, setTool] = useState<string>("move");
  const [drag, setDrag] = useState<{ id: string; x: number; y: number } | null>(null);
  const [painting, setPainting] = useState(false);
  const [zoom, setZoom] = useState(1);

  const preset = MAP_PRESETS[board.presetId % MAP_PRESETS.length];
  const theme = getTheme(preset.themeKey);
  const palette = useMemo(() => ({ ...DEFAULT_COLORS, ...theme.palette }), [theme]);
  const defaultFill = palette[theme.defaultTerrain] ?? "#3a3632";
  const tone = (terrain: string | undefined, amt: number) => shade(terrain ? palette[terrain] ?? defaultFill : defaultFill, amt);

  const charByRef = useMemo(() => {
    const m: Record<string, CharacterRow> = {};
    characters.forEach((c) => (m[String(c.id)] = c));
    return m;
  }, [characters]);

  // todas as células preenchidas (override + padrão para decoração)
  const isWall = (terrain: string | undefined) => {
    if (!terrain) return false;
    const kind = KIND_BY_TERRAIN[terrain]?.kind;
    return kind === "parede";
  };

  function eventCell(e: React.PointerEvent): { x: number; y: number } | null {
    const el = wrapRef.current;
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    const x = Math.floor(((e.clientX - rect.left) / rect.width) * board.width);
    const y = Math.floor(((e.clientY - rect.top) / rect.height) * board.height);
    if (x < 0 || y < 0 || x >= board.width || y >= board.height) return null;
    return { x, y };
  }

  function applyTool(x: number, y: number, currentTool: string) {
    if (!editable || !onChange) return;
    const key = `${x},${y}`;
    const b = { ...board, cells: { ...board.cells }, fog: { ...board.fog } };
    if (currentTool === "erase") delete b.cells[key];
    else if (currentTool === "fog") {
      if (b.fog[key]) delete b.fog[key];
      else b.fog[key] = true;
    } else if (currentTool !== "move") b.cells[key] = currentTool;
    else return;
    onChange(b);
  }

  function canControl(t: TokenState): boolean {
    if (editable) return true;
    return !!(moverRefId && t.refId === moverRefId);
  }

  function onSvgPointerDown(e: React.PointerEvent) {
    const cell = eventCell(e);
    if (!cell) return;
    if (editable && tool !== "move") {
      applyTool(cell.x, cell.y, tool);
      setPainting(true);
    }
  }

  function onPointerMove(e: React.PointerEvent) {
    const cell = eventCell(e);
    if (drag && cell) setDrag({ ...drag, x: cell.x, y: cell.y });
    else if (painting && editable && cell && tool !== "move") applyTool(cell.x, cell.y, tool);
  }

  function onPointerUp() {
    if (drag && onChange) {
      const tokens = board.tokens.map((t) => (t.id === drag.id ? { ...t, x: drag.x, y: drag.y } : t));
      onChange({ ...board, tokens });
      setDrag(null);
    }
    setPainting(false);
  }

  function startDragToken(e: React.PointerEvent, t: TokenState) {
    if (!canControl(t) || tool !== "move") return;
    e.stopPropagation();
    setDrag({ id: t.id, x: t.x, y: t.y });
  }

  function spawnHeroes() {
    if (!onChange) return;
    const existing = new Set(board.tokens.map((t) => t.refId));
    const cx = Math.floor(board.width / 2);
    const cy = Math.floor(board.height / 2);
    const newTokens: TokenState[] = [];
    characters.forEach((c, i) => {
      const refId = String(c.id);
      if (existing.has(refId)) return;
      newTokens.push({
        id: uid(), kind: "player", name: c.name, color: c.color || TOKEN_COLORS[i % TOKEN_COLORS.length],
        x: cx + (i % 4) - 2, y: cy + Math.floor(i / 4), size: 1, refId, hp: c.hp, maxHp: c.maxHp,
      });
    });
    if (newTokens.length) onChange({ ...board, tokens: [...board.tokens, ...newTokens] });
  }

  const tokens = board.tokens.map((t) => (drag && t.id === drag.id ? { ...t, x: drag.x, y: drag.y } : t));

  // ---------- decorações procedurais por célula ----------
  function renderDecor(x: number, y: number, terrain: string | undefined) {
    const t = terrain ?? theme.defaultTerrain;
    const h = hash2(x, y);
    const h2 = hash2(y * 7 + 3, x * 5 + 11);
    const px = x * CS, py = y * CS;
    const j = (v: number) => v + (h - 0.5) * 6;
    const j2 = (v: number) => v + (h2 - 0.5) * 6;
    const els: React.ReactNode[] = [];

    switch (t) {
      case "grama": {
        els.push(
          <path key="b1" d={`M${j(10)} ${j(32)} q2 -8 4 0 M${j(13)} ${j(33)} q1 -6 3 -1`} stroke={tone("grama", 0.28)} strokeWidth="1.4" fill="none" strokeLinecap="round" />,
          <path key="b2" d={`M${j2(28)} ${j2(14)} q2 -7 4 0`} stroke={tone("grama", 0.22)} strokeWidth="1.2" fill="none" strokeLinecap="round" />,
          h > 0.6 && <circle key="f" cx={j2(20)} cy={j(24)} r="1.3" fill={tone("grama", 0.45)} />
        );
        break;
      }
      case "terra":
        els.push(<circle key="d1" cx={j(12)} cy={j(12)} r="1.4" fill={tone("terra", -0.2)} />, <circle key="d2" cx={j2(30)} cy={j2(28)} r="1.1" fill={tone("terra", 0.15)} />);
        break;
      case "areia":
        els.push(<circle key="s1" cx={j(14)} cy={j(12)} r="1.2" fill={tone("areia", -0.15)} />, <circle key="s2" cx={j2(30)} cy={j2(30)} r="1" fill={tone("areia", 0.15)} />, <path key="s3" d={`M${j(8)} ${j(28)} q6 3 12 0`} stroke={tone("areia", -0.12)} strokeWidth="1" fill="none" />);
        break;
      case "neve":
        els.push(<path key="n1" d={`M${j(14)} ${j(12)} l2 2 -2 2 -2 -2 z`} fill={tone("neve", 0.35)} opacity="0.8" />, <path key="n2" d={`M${j2(30)} ${j2(28)} l2 2 -2 2 -2 -2 z`} fill={tone("neve", 0.3)} opacity="0.7" />);
        break;
      case "gelo":
        els.push(<line key="g1" x1={j(8)} y1={j(30)} x2={j(30)} y2={j(8)} stroke={tone("gelo", 0.4)} strokeWidth="1.2" opacity="0.7" />, <circle key="g2" cx={j2(30)} cy={j2(24)} r="1.2" fill={tone("gelo", 0.5)} />);
        break;
      case "pedra":
      case "piso":
        els.push(
          <rect key="sl" x={px + 0.7} y={py + 0.7} width={CS - 1.4} height={CS - 1.4} fill="none" stroke={tone(t, -0.25)} strokeWidth="0.8" opacity="0.55" />,
          <line key="c1" x1={j(10)} y1={py + 2} x2={j(14)} y2={j(16)} stroke={tone(t, -0.3)} strokeWidth="0.8" opacity="0.6" />
        );
        break;
      case "mosaico":
        els.push(
          <rect key="m1" x={px + 2} y={py + 2} width={CS - 4} height={CS - 4} fill="none" stroke={tone("mosaico", 0.18)} strokeWidth="1" opacity="0.8" />,
          <circle key="m2" cx={px + CS / 2} cy={py + CS / 2} r="2" fill={tone("mosaico", 0.25)} opacity="0.6" />
        );
        break;
      case "madeira":
        els.push(
          <line key="w1" x1={px} y1={py + CS / 3} x2={px + CS} y2={py + CS / 3} stroke={tone("madeira", -0.28)} strokeWidth="1.1" />,
          <line key="w2" x1={px} y1={py + (2 * CS) / 3} x2={px + CS} y2={py + (2 * CS) / 3} stroke={tone("madeira", -0.28)} strokeWidth="1.1" />,
          <line key="w3" x1={px + (h > 0.5 ? 14 : 28)} y1={py + (h > 0.5 ? 0 : CS / 3)} x2={px + (h > 0.5 ? 14 : 28)} y2={py + (h > 0.5 ? CS / 3 : (2 * CS) / 3)} stroke={tone("madeira", -0.28)} strokeWidth="1" />
        );
        break;
      case "agua":
      case "poco": {
        const dark = tone(t, -0.12);
        els.push(<rect key="bg" x={px} y={py} width={CS} height={CS} fill={dark} />);
        els.push(
          <path key="wv1" d={`M${px + j(6)} ${py + j(14)} q5 -4 10 0 t10 0`} stroke={tone(t, 0.35)} strokeWidth="1.5" fill="none" strokeLinecap="round">
            <animate attributeName="opacity" values="0.25;0.75;0.25" dur={`${2.4 + h * 2}s`} repeatCount="indefinite" />
          </path>,
          <path key="wv2" d={`M${px + j2(10)} ${py + j2(28)} q5 -4 10 0 t10 0`} stroke={tone(t, 0.28)} strokeWidth="1.3" fill="none" strokeLinecap="round">
            <animate attributeName="opacity" values="0.6;0.2;0.6" dur={`${3 + h2 * 2}s`} repeatCount="indefinite" />
          </path>
        );
        break;
      }
      case "lava":
        els.push(
          <circle key="lg" cx={px + CS / 2} cy={py + CS / 2} r="12" fill={tone("lava", 0.35)} opacity="0.5">
            <animate attributeName="r" values="10;14;10" dur="2.2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.35;0.6;0.35" dur="2.2s" repeatCount="indefinite" />
          </circle>,
          <path key="lk" d={`M${px + 4} ${py + j(20)} l10 -4 l8 6 l12 -5 M${px + 10} ${py + CS - 6} l8 -5 l10 4`} stroke={tone("lava", 0.5)} strokeWidth="1.8" fill="none" strokeLinecap="round" />
        );
        break;
      case "fogo":
        els.push(
          <circle key="fg" cx={px + CS / 2} cy={py + CS - 10} r="10" fill={tone("fogo", 0.3)} opacity="0.45">
            <animate attributeName="opacity" values="0.3;0.65;0.3" dur="1.1s" repeatCount="indefinite" />
          </circle>,
          <path key="fl" d={`M${px + CS / 2} ${py + CS - 6} c-8 -4 -7 -14 0 -22 c1 8 8 9 7 16 c4 -2 5 -6 4 -9 c6 6 3 17 -6 21 z`} fill={tone("fogo", 0.45)}>
            <animate attributeName="opacity" values="0.75;1;0.8;1;0.75" dur="0.9s" repeatCount="indefinite" />
          </path>
        );
        break;
      case "arvore": {
        els.push(<ellipse key="sh" cx={px + CS / 2} cy={py + CS - 5} rx="14" ry="5" fill="rgba(0,0,0,0.4)" />);
        els.push(<rect key="tr" x={px + CS / 2 - 2.5} y={py + CS - 14} width="5" height="10" rx="1" fill={tone("terra", -0.25)} />);
        els.push(
          <circle key="c1" cx={px + CS / 2 + (h - 0.5) * 4} cy={py + 13} r="12" fill={tone("arvore", 0.12)} stroke={tone("arvore", -0.25)} strokeWidth="1" />,
          <circle key="c2" cx={px + 11} cy={py + 20} r="8" fill={tone("arvore", 0.2)} opacity="0.9" />,
          <circle key="c3" cx={px + CS - 11} cy={py + 21} r="8" fill={tone("arvore", 0.05)} opacity="0.9" />
        );
        break;
      }
      case "arbusto":
        els.push(<circle key="u1" cx={px + 13 + (h - 0.5) * 6} cy={py + 24} r="8" fill={tone("arbusto", 0.08)} stroke={tone("arbusto", -0.2)} strokeWidth="0.8" />, <circle key="u2" cx={px + 28 + (h2 - 0.5) * 6} cy={py + 18} r="7" fill={tone("arbusto", 0.18)} />);
        break;
      case "parede":
      case "rocha": {
        els.push(
          <rect key="cap" x={px} y={py} width={CS} height="8" fill={tone(t, 0.22)} />,
          <rect key="bd" x={px} y={py} width={CS} height={CS} fill="none" stroke={tone(t, -0.35)} strokeWidth="1" />,
          t === "parede"
            ? <line key="brk" x1={px} y1={py + CS / 2} x2={px + CS} y2={py + CS / 2} stroke={tone(t, -0.3)} strokeWidth="1.2" />
            : <path key="crk" d={`M${px + 6 + h * 10} ${py + 12} l6 8 l-4 7 M${px + CS - 8} ${py + 6} l-5 10 l6 8`} stroke={tone(t, -0.3)} strokeWidth="1.2" fill="none" opacity="0.7" />
        );
        if (t === "parede" && h > 0.5) els.push(<line key="brk2" x1={px + CS / 2} y1={py} x2={px + CS / 2} y2={py + CS / 2} stroke={tone(t, -0.3)} strokeWidth="1" />);
        break;
      }
      case "tumulo":
        els.push(
          <rect key="sl" x={px + 9} y={py + 8} width={CS - 18} height={CS - 12} rx="8" fill={tone("tumulo", 0.12)} stroke={tone("tumulo", -0.25)} strokeWidth="1" />,
          <path key="cr" d={`M${px + CS / 2} ${py + 14} v12 M${px + CS / 2 - 5} ${py + 19} h10`} stroke={tone("tumulo", -0.3)} strokeWidth="2" strokeLinecap="round" />
        );
        break;
      case "altar":
        els.push(
          <rect key="a1" x={px + 7} y={py + 7} width={CS - 14} height={CS - 14} fill="none" stroke={tone("altar", 0.3)} strokeWidth="1.4" />,
          <circle key="a2" cx={px + CS / 2} cy={py + CS / 2} r="4.5" fill={tone("altar", 0.4)}>
            <animate attributeName="opacity" values="0.6;1;0.6" dur="2.6s" repeatCount="indefinite" />
          </circle>
        );
        break;
      case "bau":
        els.push(
          <rect key="b1" x={px + 8} y={py + 15} width={CS - 16} height={CS - 24} rx="3" fill={tone("bau", 0.12)} stroke={tone("bau", -0.3)} strokeWidth="1.2" />,
          <path key="b2" d={`M${px + 8} ${py + 15} q${CS / 2 - 8} -10 ${CS - 16} 0`} fill={tone("bau", 0.25)} stroke={tone("bau", -0.3)} strokeWidth="1.2" />,
          <circle key="b3" cx={px + CS / 2} cy={py + 18} r="2" fill={tone("bau", 0.5)} />
        );
        break;
      case "pilar":
        els.push(
          <ellipse key="sh" cx={px + CS / 2} cy={py + CS - 6} rx="10" ry="3.5" fill="rgba(0,0,0,0.4)" />,
          <circle key="p1" cx={px + CS / 2} cy={py + CS / 2} r="11" fill={tone("pilar", 0.15)} stroke={tone("pilar", -0.3)} strokeWidth="1.4" />,
          <circle key="p2" cx={px + CS / 2 - 3} cy={py + CS / 2 - 3} r="4" fill={tone("pilar", 0.35)} opacity="0.8" />
        );
        break;
      case "trono":
        els.push(
          <rect key="t1" x={px + 12} y={py + 5} width={CS - 24} height={CS - 20} rx="2" fill={tone("trono", 0.2)} stroke={tone("trono", -0.3)} strokeWidth="1.2" />,
          <rect key="t2" x={px + 9} y={py + CS - 16} width={CS - 18} height="7" rx="2" fill={tone("trono", -0.15)} />,
          <circle key="t3" cx={px + CS / 2} cy={py + 10} r="2" fill={tone("trono", 0.5)} />
        );
        break;
      case "portao":
        els.push(
          <line key="1" x1={px + 7} y1={py + 2} x2={px + 7} y2={py + CS - 2} stroke={tone("portao", 0.3)} strokeWidth="2.5" />,
          <line key="2" x1={px + 14} y1={py + 2} x2={px + 14} y2={py + CS - 2} stroke={tone("portao", -0.1)} strokeWidth="2.5" />,
          <line key="3" x1={px + 21} y1={py + 2} x2={px + 21} y2={py + CS - 2} stroke={tone("portao", 0.3)} strokeWidth="2.5" />,
          <line key="4" x1={px + 28} y1={py + 2} x2={px + 28} y2={py + CS - 2} stroke={tone("portao", -0.1)} strokeWidth="2.5" />,
          <line key="5" x1={px + 35} y1={py + 2} x2={px + 35} y2={py + CS - 2} stroke={tone("portao", 0.3)} strokeWidth="2.5" />
        );
        break;
      case "espinhos":
      case "armadilha":
        els.push(
          <path key="e1" d={`M${px + 8} ${py + CS - 8} l4 -10 l4 10 z M${px + 18} ${py + CS - 8} l4 -12 l4 12 z M${px + 28} ${py + CS - 8} l4 -9 l4 9 z`}
            fill={t === "armadilha" ? tone("armadilha", 0.4) : tone("espinhos", 0.25)} stroke="#00000066" strokeWidth="0.6" />,
          t === "armadilha" && <circle key="gl" cx={px + CS / 2} cy={py + 10} r="2" fill="#c0534b">
            <animate attributeName="opacity" values="1;0.3;1" dur="1.8s" repeatCount="indefinite" />
          </circle>
        );
        break;
      default:
        break;
    }
    return <g key={`${x},${y}`}>{els}</g>;
  }

  // sombra projetada das paredes sobre o chão ao sul
  const wallShadows = useMemo(() => {
    const shadows: React.ReactNode[] = [];
    for (let x = 0; x < board.width; x++) {
      for (let y = 0; y < board.height - 1; y++) {
        const here = board.cells[`${x},${y}`];
        const below = board.cells[`${x},${y + 1}`];
        if (isWall(here) && !isWall(below)) {
          shadows.push(<rect key={`sh${x},${y}`} x={x * CS} y={(y + 1) * CS} width={CS} height={CS * 0.32} fill="url(#wallShade)" opacity="0.75" />);
        }
      }
    }
    return shadows;
  }, [board.cells, board.width, board.height]);
  void generatePresetCells;

  const gridDecor = useMemo(() => {
    const els: React.ReactNode[] = [];
    for (let x = 0; x < board.width; x++) for (let y = 0; y < board.height; y++) {
      els.push(renderDecor(x, y, board.cells[`${x},${y}`]));
    }
    return els;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [board.cells, board.width, board.height, palette]);

  return (
    <div className="space-y-3">
      {editable && !mini && (
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={() => setTool("move")}
            className={`btn-ghost !py-1.5 !px-3 text-xs ${tool === "move" ? "!border-gold-400 !bg-gold-500/15 text-gold-300" : ""}`}>
            <Hand className="w-3.5 h-3.5" /> Mover
          </button>
          <button onClick={() => setTool("erase")}
            className={`btn-ghost !py-1.5 !px-3 text-xs ${tool === "erase" ? "!border-gold-400 !bg-gold-500/15 text-gold-300" : ""}`}>
            <Eraser className="w-3.5 h-3.5" /> Apagar
          </button>
          <button onClick={() => setTool("fog")}
            className={`btn-ghost !py-1.5 !px-3 text-xs ${tool === "fog" ? "!border-gold-400 !bg-gold-500/15 text-gold-300" : ""}`}>
            <CloudFog className="w-3.5 h-3.5" /> Névoa
          </button>
          <span className="w-px h-6 bg-gold-500/20 mx-1" />
          <button onClick={spawnHeroes} className="btn-ghost !py-1.5 !px-3 text-xs">
            <UserPlus className="w-3.5 h-3.5" /> Invocar Heróis
          </button>
          <button onClick={() => onChange?.({ ...board, tokens: [] })} className="btn-ghost !py-1.5 !px-3 text-xs hover:text-blood-400">
            <Trash2 className="w-3.5 h-3.5" /> Limpar Tokens
          </button>
          <span className="w-px h-6 bg-gold-500/20 mx-1" />
          <button onClick={() => onChange?.({ ...board, showGrid: !board.showGrid })} className="btn-ghost !py-1.5 !px-3 text-xs">
            <Grid3x3 className="w-3.5 h-3.5" /> Grade
          </button>
          <button onClick={() => setZoom((z) => Math.max(0.6, +(z - 0.15).toFixed(2)))} className="btn-ghost !py-1.5 !px-2.5 text-xs">
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => setZoom((z) => Math.min(2.2, +(z + 0.15).toFixed(2)))} className="btn-ghost !py-1.5 !px-2.5 text-xs">
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {editable && !mini && (
        <div className="flex flex-wrap gap-1.5">
          {PALETTE_ORDER.filter((t) => palette[t]).map((t) => (
            <button key={t} onClick={() => setTool(t)} title={TERRAIN_INFO[t]?.name ?? t}
              className={`w-7 h-7 rounded-md border-2 transition-all cursor-pointer ${
                tool === t ? "border-gold-300 scale-110 shadow-[0_0_10px_rgba(201,162,39,0.4)]" : "border-black/40 hover:border-gold-500/50"
              }`}
              style={{ backgroundColor: palette[t] }} />
          ))}
          <span className="text-[11px] text-parch-dim/50 self-center ml-1 italic">clique num terreno e pinte o mapa</span>
        </div>
      )}

      <div className="overflow-auto" style={{ maxHeight: mini ? 320 : "72vh" }}>
        <div style={{ width: `${zoom * 100}%`, minWidth: "100%" }}>
          <div
            ref={wrapRef}
            className="map-frame relative select-none"
            style={{ aspectRatio: `${board.width}/${board.height}`, touchAction: "none", containerType: "inline-size" }}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerLeave={onPointerUp}
          >
            <svg
              ref={svgRef}
              viewBox={`0 0 ${board.width * CS} ${board.height * CS}`}
              className="absolute inset-0 w-full h-full"
              style={{ backgroundColor: defaultFill, cursor: tool === "move" ? "grab" : "crosshair" }}
              onPointerDown={onSvgPointerDown}
            >
              <defs>
                <linearGradient id="wallShade" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="rgba(0,0,0,0.55)" />
                  <stop offset="100%" stopColor="rgba(0,0,0,0)" />
                </linearGradient>
              </defs>

              {/* células customizadas */}
              {Object.entries(board.cells).map(([key, terrain]) => {
                const [cx, cy] = key.split(",").map(Number);
                return <rect key={key} x={cx * CS} y={cy * CS} width={CS} height={CS} fill={palette[terrain] ?? defaultFill} />;
              })}

              {/* decorações */}
              {gridDecor}

              {/* sombras de parede */}
              {wallShadows}

              {/* grade */}
              {board.showGrid && (
                <g stroke="rgba(232, 217, 181, 0.07)" strokeWidth="1">
                  {Array.from({ length: board.width + 1 }, (_, i) => (
                    <line key={`v${i}`} x1={i * CS} y1={0} x2={i * CS} y2={board.height * CS} />
                  ))}
                  {Array.from({ length: board.height + 1 }, (_, i) => (
                    <line key={`h${i}`} x1={0} y1={i * CS} x2={board.width * CS} y2={i * CS} />
                  ))}
                </g>
              )}

              {/* névoa */}
              {Object.keys(board.fog).map((key) => {
                const [fx, fy] = key.split(",").map(Number);
                return <rect key={`f${key}`} x={fx * CS} y={fy * CS} width={CS} height={CS} fill="rgba(6, 5, 4, 0.86)" stroke="rgba(201,162,39,0.08)" strokeWidth="0.5" />;
              })}
            </svg>

            {/* vinheta / luz ambiente */}
            <div className="map-light" />

            {/* tokens (HTML) */}
            {tokens.map((t) => {
              const char = t.refId ? charByRef[t.refId] : undefined;
              let portrait: ReturnType<typeof spriteStyle> | null = null;
              if (t.kind === "player") {
                portrait = spriteStyle("classes", char?.portrait ?? (char ? classArtIndex(char.classKey) : 0));
              } else if (t.kind === "monster") {
                const mKey = monsterKeyFromRef(t.refId ?? undefined);
                const idx = mKey ? monsterArtIndex(mKey) : null;
                if (idx != null) portrait = spriteStyle("monsters", idx);
              }
              const size = t.size || 1;
              const isActive = !!(activeRefId && activeRefId === t.refId);
              const isDead = t.maxHp != null && (t.hp ?? 0) <= 0;
              return (
                <div
                  key={t.id}
                  className={`board-token ${isActive ? "token-active-turn" : ""} ${isDead ? "token-dead" : ""} ${drag?.id === t.id ? "token-dragging" : ""}`}
                  style={{
                    left: `${(t.x / board.width) * 100}%`,
                    top: `${(t.y / board.height) * 100}%`,
                    width: `${(size / board.width) * 100}%`,
                    aspectRatio: "1/1",
                    padding: "0.55%",
                    pointerEvents: editable && tool !== "move" ? "none" : "auto",
                    zIndex: drag?.id === t.id ? 50 : isActive ? 35 : 30,
                  }}
                  onPointerDown={(e) => startDragToken(e, t)}
                >
                  <TokenAvatar
                    name={t.name}
                    color={t.color}
                    kind={t.kind}
                    portrait={portrait}
                    hp={t.hp}
                    maxHp={t.maxHp}
                    active={isActive}
                    dead={isDead}
                    plate={!mini && size <= 2}
                    initialsFontSize={`${Math.max(1.6, 40 / board.width)}cqw`}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-[11px] text-parch-dim/60 font-display tracking-wide">
        <span>{preset.name.toUpperCase()} · {board.width}×{board.height}</span>
        <span className="italic">{preset.ambience}</span>
      </div>
    </div>
  );
}
