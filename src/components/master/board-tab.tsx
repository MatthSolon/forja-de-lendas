"use client";

import { useEffect, useRef, useState } from "react";
import type { BoardState } from "@/lib/types";
import { MAP_PRESETS, THEMES, generatePresetCells } from "@/lib/data/maps";
import BattleMap from "@/components/battle-map";
import type { TabProps } from "./master-client";
import { LayoutGrid, Maximize2, Minimize2 } from "lucide-react";

export default function BoardTab({ data, patchSection }: TabProps) {
  const board = data.state.board;
  const [local, setLocal] = useState<BoardState>(board);
  const dirtyUntil = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [themeFilter, setThemeFilter] = useState<string | null>(null);
  const [galleryOpen, setGalleryOpen] = useState(false);

  // sincroniza do servidor quando não estamos editando
  useEffect(() => {
    if (Date.now() > dirtyUntil.current) setLocal(board);
  }, [board]);

  function push(b: BoardState) {
    setLocal(b);
    dirtyUntil.current = Date.now() + 1600;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => patchSection({ board: b }), 500);
  }

  function applyPreset(presetId: number) {
    const preset = MAP_PRESETS[presetId % MAP_PRESETS.length];
    const cells = generatePresetCells(presetId, preset.width, preset.height);
    const tokens = local.tokens.filter((t) => t.x < preset.width && t.y < preset.height);
    push({ ...local, presetId, width: preset.width, height: preset.height, cells, tokens, fog: {} });
  }

  function resize(dw: number, dh: number) {
    const width = Math.min(26, Math.max(8, local.width + dw));
    const height = Math.min(20, Math.max(6, local.height + dh));
    if (width === local.width && height === local.height) return;
    const tokens = local.tokens.filter((t) => t.x < width && t.y < height);
    push({ ...local, width, height, tokens });
  }

  const presets = themeFilter ? MAP_PRESETS.filter((p) => p.themeKey === themeFilter) : MAP_PRESETS;

  return (
    <div className="space-y-4">
      <div className="panel p-4 flex flex-wrap items-center gap-3">
        <button onClick={() => setGalleryOpen((g) => !g)}
          className={`btn-gold !py-2 !px-4 text-xs ${galleryOpen ? "opacity-90" : ""}`}>
          <LayoutGrid className="w-4 h-4" /> Galeria de Mapas (60 presets)
        </button>
        <div className="flex items-center gap-1 text-parch-dim text-sm">
          <span className="font-display text-xs tracking-widest text-gold-500">TAMANHO</span>
          <button onClick={() => resize(-2, 0)} className="btn-ghost !p-1.5"><Minimize2 className="w-3.5 h-3.5 rotate-90" /></button>
          <span className="font-display text-gold-300 w-16 text-center">{local.width} × {local.height}</span>
          <button onClick={() => resize(2, 0)} className="btn-ghost !p-1.5"><Maximize2 className="w-3.5 h-3.5 rotate-90" /></button>
          <button onClick={() => resize(0, -2)} className="btn-ghost !p-1.5"><Minimize2 className="w-3.5 h-3.5" /></button>
          <button onClick={() => resize(0, 2)} className="btn-ghost !p-1.5"><Maximize2 className="w-3.5 h-3.5" /></button>
        </div>
        <span className="text-parch-dim/60 text-xs italic ml-auto hidden md:block">
          Heróis e monstros entram pela galeria/bestiário · arraste tokens para mover
        </span>
      </div>

      {galleryOpen && (
        <div className="panel p-4 space-y-3">
          <div className="flex flex-wrap gap-1.5">
            <button onClick={() => setThemeFilter(null)}
              className={`px-3 py-1.5 rounded-full text-xs font-display border cursor-pointer ${!themeFilter ? "border-gold-400 bg-gold-500/15 text-gold-300" : "border-gold-500/15 text-parch-dim hover:border-gold-500/40"}`}>
              Todos (60)
            </button>
            {THEMES.map((t) => (
              <button key={t.key} onClick={() => setThemeFilter(t.key === themeFilter ? null : t.key)}
                className={`px-3 py-1.5 rounded-full text-xs font-display border cursor-pointer ${themeFilter === t.key ? "border-gold-400 bg-gold-500/15 text-gold-300" : "border-gold-500/15 text-parch-dim hover:border-gold-500/40"}`}>
                {t.name}
              </button>
            ))}
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 max-h-[42vh] overflow-y-auto pr-1">
            {presets.map((p) => (
              <button key={p.id} onClick={() => { applyPreset(p.id); }}
                className={`text-left panel-inset p-3 hover:border-gold-400/50 hover:bg-gold-500/5 transition-all group cursor-pointer ${local.presetId === p.id ? "!border-gold-400/70 bg-gold-500/10" : ""}`}>
                <div className="flex items-center justify-between gap-2">
                  <span className="font-display text-xs text-gold-400">#{String(p.id + 1).padStart(2, "0")} · {p.themeName}</span>
                  <span className="text-[10px] text-parch-dim/60">{p.width}×{p.height}</span>
                </div>
                <p className="text-parch text-sm mt-1 leading-snug group-hover:text-gold-200">{p.name}</p>
                <p className="text-parch-dim/50 text-[10px] italic mt-1">{p.ambience}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="panel p-4">
        <BattleMap
          board={local}
          onChange={push}
          characters={data.characters}
          editable
          activeRefId={data.state.combat.active ? data.state.combat.combatants[data.state.combat.turn]?.refId : undefined}
        />
      </div>
    </div>
  );
}
