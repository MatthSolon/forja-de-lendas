"use client";

import type { CSSProperties } from "react";

interface TokenAvatarProps {
  name: string;
  color: string;
  kind: "player" | "monster" | "npc" | "object";
  portrait?: CSSProperties | null;
  hp?: number;
  maxHp?: number;
  active?: boolean;
  dead?: boolean;
  plate?: boolean;
  initialsFontSize?: string;
}

// Avatar circular com anel de vida em conic-gradient: usado no tabuleiro,
// na ficha, no rastreador de combate e na lista de heróis.
export default function TokenAvatar({
  name, color, kind, portrait, hp, maxHp, active, dead, plate, initialsFontSize = "14px",
}: TokenAvatarProps) {
  const pct = maxHp != null && hp != null ? Math.max(0, Math.min(1, hp / maxHp)) : null;
  const hpColor = pct != null ? (pct > 0.5 ? "#6a9a4a" : pct > 0.25 ? "#e0b64c" : "#c0534b") : color;

  return (
    <div className={`relative w-full h-full ${active ? "token-active-turn" : ""} ${dead ? "token-dead" : ""}`}>
      <div className="token-shadow" />
      <div
        className="token-ring"
        style={{
          background:
            pct != null
              ? `conic-gradient(${hpColor} ${pct * 360}deg, rgba(8, 7, 5, 0.85) 0deg)`
              : `linear-gradient(180deg, ${color}, ${color}22)`,
          boxShadow: `0 0 0 2px ${color}${kind === "monster" ? "88" : ""}, 0 4px 10px rgba(0,0,0,0.55)`,
        }}
      />
      <div
        className="token-portrait"
        style={{ position: "absolute", inset: 3.5, ...(portrait ?? {}) }}
      >
        {!portrait && (
          <span
            className="font-display font-black select-none"
            style={{ color: `${""}#0d0b09`, fontSize: initialsFontSize, textShadow: `0 0 6px ${color}55` }}
          >
            {name.slice(0, 2).toUpperCase()}
          </span>
        )}
      </div>
      {pct != null && (
        <div className="token-hp">
          <div style={{ width: `${pct * 100}%`, height: "100%", background: hpColor, transition: "width .35s ease" }} />
        </div>
      )}
      {plate && <div className="token-plate font-display">{name}</div>}
    </div>
  );
}
