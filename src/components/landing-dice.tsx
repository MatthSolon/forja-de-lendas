"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dices } from "lucide-react";

export default function LandingDice() {
  const [value, setValue] = useState(20);
  const [rolling, setRolling] = useState(false);
  const [result, setResult] = useState<"crit" | "fail" | null>("crit");

  const roll = () => {
    if (rolling) return;
    setRolling(true);
    setResult(null);
    let ticks = 0;
    const t = setInterval(() => {
      setValue(1 + Math.floor(Math.random() * 20));
      ticks++;
      if (ticks > 10) {
        clearInterval(t);
        const final = 1 + Math.floor(Math.random() * 20);
        setValue(final);
        setRolling(false);
        setResult(final === 20 ? "crit" : final === 1 ? "fail" : null);
      }
    }, 70);
  };

  return (
    <div className="flex flex-col items-center gap-3 select-none">
      <motion.button
        onClick={roll}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.92, rotate: -8 }}
        animate={rolling ? { rotate: [0, 12, -12, 8, -8, 0] } : {}}
        transition={{ duration: 0.6 }}
        className="relative w-28 h-28 cursor-pointer group"
        aria-label="Rolar d20"
      >
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_10px_30px_rgba(201,162,39,0.4)]">
          <defs>
            <linearGradient id="d20gold" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#f0d688" />
              <stop offset="55%" stopColor="#c9a227" />
              <stop offset="100%" stopColor="#6f5914" />
            </linearGradient>
          </defs>
          <polygon points="50,4 90,27 90,73 50,96 10,73 10,27" fill="url(#d20gold)" stroke="#f4e3b2" strokeWidth="1.5" />
          <polygon points="50,4 90,27 50,50" fill="rgba(255,248,220,0.22)" />
          <polygon points="10,27 50,50 50,4" fill="rgba(0,0,0,0.18)" />
          <polygon points="90,27 90,73 50,50" fill="rgba(0,0,0,0.3)" />
          <polygon points="10,73 50,50 90,73" fill="rgba(0,0,0,0.12)" />
          <polygon points="10,27 50,50 10,73" fill="rgba(0,0,0,0.05)" />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center font-display font-black text-3xl text-[#100e0b] dice-face">
          {value}
        </span>
      </motion.button>
      <div className="h-6">
        <AnimatePresence mode="wait">
          {result === "crit" && (
            <motion.span key="c" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="font-display text-gold-400 text-sm tracking-[0.25em] gold-text">ACERTO CRÍTICO!</motion.span>
          )}
          {result === "fail" && (
            <motion.span key="f" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="font-display text-blood-400 text-sm tracking-[0.25em]">FALHA CRÍTICA...</motion.span>
          )}
          {!result && !rolling && (
            <motion.span key="i" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="flex items-center gap-2 text-parch-dim/70 text-xs font-display tracking-widest">
              <Dices className="w-3.5 h-3.5" /> EXPERIMENTE O DADO DO DESTINO
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
