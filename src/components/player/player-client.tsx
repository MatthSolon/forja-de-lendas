"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserRound, Map as MapIcon, BookOpen, ChevronLeft, Sparkles,
  Wifi, WifiOff, Loader2, Skull, ScrollText, Dice5,
} from "lucide-react";
import { useCampaign } from "@/lib/use-campaign";
import type { CampaignState } from "@/lib/types";
import { spriteStyle } from "@/lib/art";
import DicePanel from "@/components/dice-panel";
import CreateCharacter from "./create-character";
import SheetTab from "./sheet-tab";
import MagicTab from "./magic-tab";
import BoardView from "./board-view";

const STORAGE_KEY = (code: string) => `forja:char:${code}`;

export default function PlayerClient({ code }: { code: string }) {
  const { data, error, connected, patchSection, appendLog, refresh } = useCampaign(code);
  const [charId, setCharId] = useState<number | null>(null);
  const [creating, setCreating] = useState(false);
  const [tab, setTab] = useState("ficha");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY(code));
    if (saved) setCharId(parseInt(saved, 10) || null);
  }, [code]);

  const myChar = data?.characters.find((c) => c.id === charId) ?? null;

  function pick(id: number | null) {
    setCharId(id);
    if (id) localStorage.setItem(STORAGE_KEY(code), String(id));
    else localStorage.removeItem(STORAGE_KEY(code));
    setCreating(false);
  }

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6">
        <div className="panel p-10 text-center max-w-md">
          <Skull className="w-12 h-12 text-blood-400 mx-auto mb-4" />
          <h1 className="font-display font-bold text-2xl text-parch mb-2">{error}</h1>
          <Link href="/entrar" className="btn-gold mt-4">Tentar outro código</Link>
        </div>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-gold-400">
          <Loader2 className="w-10 h-10 animate-spin" />
          <p className="font-display tracking-widest text-sm">EMBARQUE NA TAVERNA...</p>
        </div>
      </main>
    );
  }

  // Tela de seleção / criação de personagem
  if (!myChar || creating) {
    return (
      <main className="min-h-screen noise-overlay py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Link href="/entrar" className="inline-flex items-center gap-1 text-parch-dim hover:text-gold-400 text-sm transition-colors">
              <ChevronLeft className="w-4 h-4" /> Sair da campanha
            </Link>
            <div className="text-right">
              <p className="font-display font-bold gold-text">{data.name}</p>
              <p className="text-xs text-parch-dim/60">Código {code} · Mestre {data.masterName}</p>
            </div>
          </div>

          {creating || data.characters.length === 0 ? (
            <CreateCharacter code={code} onDone={(id) => pick(id)} onCancel={data.characters.length ? () => setCreating(false) : undefined} />
          ) : (
            <div className="panel p-8">
              <h1 className="font-display font-black text-3xl gold-text text-center mb-2">Quem é você nesta saga?</h1>
              <p className="text-center text-parch-dim mb-8">Escolha seu herói ou forje um novo.</p>
              <div className="grid sm:grid-cols-2 gap-3 mb-6">
                {data.characters.map((c) => (
                  <button key={c.id} onClick={() => pick(c.id)}
                    className="panel-inset p-4 text-left hover:border-gold-400/60 hover:bg-gold-500/5 transition-all cursor-pointer flex items-center gap-3 group">
                    <span className="w-11 h-11 rounded-xl border-2 overflow-hidden bg-cover shrink-0"
                      style={{ borderColor: c.color, ...spriteStyle("classes", c.portrait ?? 0) }} />
                    <span className="min-w-0">
                      <span className="block font-display font-bold text-parch group-hover:text-gold-300 truncate">{c.name}</span>
                      <span className="block text-xs text-parch-dim truncate">Nível {c.level} · de {c.player}</span>
                    </span>
                  </button>
                ))}
              </div>
              <button onClick={() => setCreating(true)} className="btn-gold w-full !py-3.5">
                <UserRound className="w-5 h-5" /> Forjar Novo Herói
              </button>
            </div>
          )}
        </div>
      </main>
    );
  }

  const TABS = [
    { key: "ficha", name: "Ficha", icon: ScrollText },
    { key: "magia", name: "Magias & Combos", icon: Sparkles },
    { key: "tabuleiro", name: "Tabuleiro", icon: MapIcon },
    { key: "diario", name: "Diário", icon: BookOpen },
  ];

  return (
    <main className="min-h-screen noise-overlay">
      <header className="sticky top-0 z-40 backdrop-blur-md bg-ink-950/85 border-b border-gold-500/15">
        <div className="max-w-[1700px] mx-auto px-4 md:px-6 h-14 flex items-center gap-3">
          <Link href="/entrar" className="text-parch-dim hover:text-gold-400 transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <span className="w-9 h-9 rounded-lg border-2 flex items-center justify-center font-display font-black text-sm"
            style={{ borderColor: myChar.color, color: myChar.color }}>
            {myChar.name.slice(0, 2).toUpperCase()}
          </span>
          <div className="min-w-0">
            <h1 className="font-display font-bold text-sm md:text-base gold-text truncate">{myChar.name}</h1>
            <p className="text-[10px] text-parch-dim/60 -mt-0.5 truncate">{data.name} · Nível {myChar.level}</p>
          </div>
          <button onClick={() => pick(null)} className="ml-2 btn-ghost !py-1 !px-2.5 text-[11px]">Trocar herói</button>
          <div className="ml-auto text-xs">
            {connected ? (
              <span className="flex items-center gap-1.5 text-emerald-400"><Wifi className="w-4 h-4" /><span className="hidden md:inline">Ao vivo</span></span>
            ) : (
              <span className="flex items-center gap-1.5 text-blood-400"><WifiOff className="w-4 h-4" /></span>
            )}
          </div>
        </div>
        <div className="max-w-[1700px] mx-auto px-4 md:px-6 flex overflow-x-auto">
          {TABS.map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)} className={`tab-btn flex items-center gap-2 ${tab === t.key ? "active" : ""}`}>
              <t.icon className="w-4 h-4" /> {t.name}
            </button>
          ))}
        </div>
      </header>

      <div className="max-w-[1700px] mx-auto px-4 md:px-6 py-5 grid lg:grid-cols-[1fr_340px] gap-5">
        <div className="min-w-0">
          <AnimatePresence mode="wait">
            <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.18 }}>
              {tab === "ficha" && <SheetTab char={myChar} appendLog={appendLog} onUpdate={refresh} />}
              {tab === "magia" && <MagicTab char={myChar} appendLog={appendLog} />}
              {tab === "tabuleiro" && <BoardView char={myChar} state={data.state} patchSection={patchSection} characters={data.characters} />}
              {tab === "diario" && <JournalTab state={data.state} />}
            </motion.div>
          </AnimatePresence>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-32 self-start">
          <div className="panel p-4">
            <DicePanel rollerName={myChar.name} onRoll={appendLog} />
          </div>
          <div className="panel p-4">
            <h4 className="font-display text-gold-500 text-xs tracking-[0.25em] mb-3 flex items-center gap-2">
              <Dice5 className="w-4 h-4" /> REGISTRO DA MESA
            </h4>
            <div className="space-y-1.5 max-h-[42vh] overflow-y-auto pr-1">
              {[...data.state.log].reverse().filter((e) => !e.hidden).map((e) => (
                <div key={e.id} className={`text-xs rounded-lg px-3 py-2 border ${
                  e.kind === "roll" ? "bg-gold-500/5 border-gold-500/15"
                  : e.kind === "story" ? "bg-purple-500/5 border-purple-500/20"
                  : "bg-ink-800/60 border-gold-500/10"}`}>
                  <span className="font-display text-[10px] tracking-wider text-gold-500">{e.who}</span>
                  <p className="text-parch mt-0.5">{e.text}</p>
                  {e.detail && <p className="text-parch-dim/60 text-[10px] mt-0.5 font-mono">{e.detail}</p>}
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}

// ---------------- Diário do herói (somente leitura da história) ----------------

import { getArc, getChapter } from "@/lib/data/story";
import { CheckCircle2 } from "lucide-react";

function JournalTab({ state }: { state: CampaignState }) {
  const arc = getArc(state.story.arcId);
  const chapter = getChapter(state.story.arcId, state.story.chapterId);
  return (
    <div className="space-y-4">
      <div className="panel p-5">
        <p className="font-display text-[10px] tracking-[0.3em] text-gold-500 mb-1">ARCO ATUAL · {arc.levels.toUpperCase()}</p>
        <h3 className="font-display font-black text-2xl gold-text">{arc.name}</h3>
        <p className="text-parch-dim italic text-sm mt-1">{arc.tagline}</p>
      </div>
      <div className="panel p-5">
        <h4 className="font-display font-bold text-xl text-parch mb-3">Capítulo {arc.chapters.indexOf(chapter) + 1}: {chapter.title}</h4>
        <div className="space-y-3">
          {chapter.reading.map((p, i) => (
            <p key={i} className="text-parch/85 text-[15px] leading-relaxed font-light">
              <span className="text-gold-500 mr-1">◆</span>{p}
            </p>
          ))}
        </div>
      </div>
      <div className="panel p-5">
        <h4 className="font-display text-xs tracking-[0.25em] text-gold-500 mb-3">MISSÕES DESTE CAPÍTULO</h4>
        <div className="space-y-2">
          {chapter.quests.map((q) => {
            const done = state.story.doneQuests.includes(q.id);
            return (
              <div key={q.id} className={`p-3 rounded-lg border ${done ? "border-emerald-500/40 bg-emerald-500/5" : "border-gold-500/15 bg-ink-800/40"}`}>
                <div className="flex items-center gap-2">
                  {done && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                  <span className={`font-display font-bold text-sm ${done ? "text-emerald-300" : "text-parch"}`}>{q.title}</span>
                  <span className="ml-auto text-xs text-gold-400 font-display">+{q.xp} XP</span>
                </div>
                <p className="text-parch-dim/80 text-sm mt-1">{q.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
