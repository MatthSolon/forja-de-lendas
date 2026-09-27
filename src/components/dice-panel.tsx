"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dices, RotateCcw, EyeOff } from "lucide-react";
import { rollDice } from "@/lib/game";
import type { LogEntry } from "@/lib/types";

const QUICK = [4, 6, 8, 10, 12, 20, 100];

interface DicePanelProps {
  rollerName: string;
  onRoll: (entries: Omit<LogEntry, "id" | "ts">[]) => void;
  allowHidden?: boolean;
}

export default function DicePanel({ rollerName, onRoll, allowHidden = false }: DicePanelProps) {
  const [expr, setExpr] = useState("1d20");
  const [label, setLabel] = useState("");
  const [advMode, setAdvMode] = useState<"normal" | "vantagem" | "desvantagem">("normal");
  const [hidden, setHidden] = useState(false);
  const [last, setLast] = useState<{ total: number; text: string; crit: boolean; fumble: boolean } | null>(null);
  const [spinKey, setSpinKey] = useState(0);

  function doRoll(customExpr?: string, customLabel?: string) {
    const expression = (customExpr ?? expr).trim() || "1d20";
    const isD20 = /^1d20([+-]\d+)?$/.test(expression.replace(/\s/g, ""));
    let result = rollDice(expression);
    let note = "";

    if (isD20 && advMode !== "normal") {
      const second = rollDice(expression);
      const pick = advMode === "vantagem" ? Math.max(result.total, second.total) : Math.min(result.total, second.total);
      note = `${advMode === "vantagem" ? "com vantagem" : "com desvantagem"} (${result.total} / ${second.total})`;
      const chosen = result.total === pick ? result : second;
      result = { ...chosen, total: pick };
    }

    const name = customLabel ?? label;
    const text = `${name ? `${name}: ` : ""}${expression} = ${result.total}${note ? ` ${note}` : ""}`;
    setLast({ total: result.total, text, crit: result.natural20, fumble: result.natural1 });
    setSpinKey((k) => k + 1);
    onRoll([{
      who: rollerName, kind: "roll", text,
      detail: result.detail + (note ? ` · ${note}` : ""),
      hidden: hidden || undefined,
    }]);
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="font-display text-gold-500 text-xs tracking-[0.25em]">ROLAR DADOS</h4>
        <AnimatePresence mode="wait">
          {last && (
            <motion.div key={spinKey} initial={{ scale: 0.5, opacity: 0, rotate: -10 }} animate={{ scale: 1, opacity: 1, rotate: 0 }}
              className={`font-display font-black text-2xl ${
                last.crit ? "text-gold-300 drop-shadow-[0_0_12px_rgba(224,182,76,0.8)]"
                : last.fumble ? "text-blood-400" : "text-parch"}`}>
              {last.crit ? `${last.total} ⚡ CRÍT!` : last.fumble ? `${last.total} ...` : last.total}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-7 gap-1.5">
        {QUICK.map((s) => (
          <button key={s} onClick={() => doRoll(`1d${s}`)}
            className="panel-inset py-2 font-display text-sm font-bold text-parch hover:border-gold-400/60 hover:text-gold-300 hover:bg-gold-500/10 transition-all cursor-pointer active:scale-90">
            d{s}
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        <input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Rótulo (ex.: Ataque)"
          className="input-fantasy !py-2 text-sm flex-1 min-w-0" />
        <input value={expr} onChange={(e) => setExpr(e.target.value)} placeholder="2d6+3"
          className="input-fantasy !py-2 text-sm w-24 text-center font-mono"
          onKeyDown={(e) => e.key === "Enter" && doRoll()} />
      </div>

      <div className="flex items-center gap-2">
        <button onClick={() => doRoll()} className="btn-gold !py-2 flex-1 text-sm">
          <Dices className="w-4 h-4" /> Rolar
        </button>
        <button onClick={() => setExpr("1d20")} title="Limpar" className="btn-ghost !py-2 !px-3">
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      <div className="flex gap-1.5">
        {(["normal", "vantagem", "desvantagem"] as const).map((m) => (
          <button key={m} onClick={() => setAdvMode(m)}
            className={`flex-1 text-[11px] font-display py-1.5 rounded-md border transition-all cursor-pointer ${
              advMode === m
                ? m === "vantagem" ? "border-emerald-400/60 bg-emerald-500/15 text-emerald-300"
                : m === "desvantagem" ? "border-blood-400/60 bg-blood-600/15 text-blood-400"
                : "border-gold-400/60 bg-gold-500/15 text-gold-300"
                : "border-gold-500/15 text-parch-dim/70 hover:border-gold-500/40"
            }`}>
            {m === "normal" ? "Normal" : m === "vantagem" ? "Vantagem" : "Desvantagem"}
          </button>
        ))}
        {allowHidden && (
          <button onClick={() => setHidden((h) => !h)} title="Rolagem secreta (só o mestre vê)"
            className={`px-2.5 rounded-md border transition-all cursor-pointer ${
              hidden ? "border-purple-400/60 bg-purple-500/15 text-purple-300" : "border-gold-500/15 text-parch-dim/70 hover:border-gold-500/40"
            }`}>
            <EyeOff className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
