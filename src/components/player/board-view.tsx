"use client";

import type { CampaignState, CharacterRow } from "@/lib/types";
import BattleMap from "@/components/battle-map";
import { Swords } from "lucide-react";

interface Props {
  char: CharacterRow;
  state: CampaignState;
  patchSection: (s: Partial<CampaignState>) => Promise<void>;
  characters: CharacterRow[];
}

export default function BoardView({ char, state, patchSection, characters }: Props) {
  const combat = state.combat;

  return (
    <div className="space-y-4">
      {combat.active && (
        <div className="panel p-4 gold-border-glow">
          <p className="font-display text-[10px] tracking-[0.3em] text-gold-500 flex items-center gap-2">
            <Swords className="w-3.5 h-3.5" /> COMBATE EM ANDAMENTO · RODADA {combat.round}
          </p>
          <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
            {combat.combatants.map((c, i) => (
              <div key={c.id}
                className={`shrink-0 px-3 py-2 rounded-lg border text-sm ${
                  i === combat.turn ? "border-gold-400 bg-gold-500/15 text-gold-200" : "border-gold-500/15 text-parch-dim"
                }`}>
                <span className="inline-block w-2.5 h-2.5 rounded-full mr-1.5 align-middle" style={{ backgroundColor: c.color }} />
                {c.name}
                {i === combat.turn && <span className="block text-[9px] font-display tracking-widest text-gold-400 mt-0.5">TURNO ATUAL</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="panel p-4">
        <p className="text-parch-dim text-sm mb-3 italic">
          O mestre controla o mundo. Arraste <span className="text-gold-300 not-italic font-semibold">apenas o seu token</span> ({char.name.slice(0, 2).toUpperCase()}) pelo campo de batalha.
        </p>
        <BattleMap
          board={state.board}
          onChange={(b) => patchSection({ board: b })}
          characters={characters}
          editable={false}
          moverRefId={String(char.id)}
          activeRefId={combat.active ? combat.combatants[combat.turn]?.refId : undefined}
        />
      </div>
    </div>
  );
}
