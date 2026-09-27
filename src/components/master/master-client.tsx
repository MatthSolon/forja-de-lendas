"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Crown, Map as MapIcon, Swords, Skull, BookOpen, Users, Copy, Check,
  Wifi, WifiOff, Loader2, ChevronLeft, Dice5,
} from "lucide-react";
import { useCampaign, type CampaignData } from "@/lib/use-campaign";
import type { CampaignState, LogEntry } from "@/lib/types";
import DicePanel from "@/components/dice-panel";
import BoardTab from "./board-tab";
import CombatTab from "./combat-tab";
import BestiaryTab from "./bestiary-tab";
import StoryTab from "./story-tab";
import PlayersTab from "./players-tab";

export interface TabProps {
  data: CampaignData;
  code: string;
  patchSection: (s: Partial<CampaignState>) => Promise<void>;
  appendLog: (e: Omit<LogEntry, "id" | "ts">[]) => void;
  awardXp: (amount: number, reason: string, ids?: number[]) => Promise<void>;
  refresh: () => Promise<void>;
}

const TABS = [
  { key: "tabuleiro", name: "Tabuleiro", icon: MapIcon },
  { key: "combate", name: "Combate", icon: Swords },
  { key: "bestiario", name: "Bestiário", icon: Skull },
  { key: "historia", name: "História", icon: BookOpen },
  { key: "jogadores", name: "Heróis", icon: Users },
] as const;

type TabKey = (typeof TABS)[number]["key"];

export default function MasterClient({ code }: { code: string }) {
  const { data, error, connected, patchSection, appendLog, refresh } = useCampaign(code);
  const [tab, setTab] = useState<TabKey>("tabuleiro");
  const [copied, setCopied] = useState(false);

  const awardXp = async (amount: number, reason: string, ids?: number[]) => {
    try {
      const res = await fetch(`/api/campaigns/${code}/xp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, reason, characterIds: ids }),
      });
      const json = await res.json();
      if (json.ok) {
        const ups = json.results.filter((r: { leveledUp: boolean }) => r.leveledUp);
        appendLog([
          { who: "Mestre", kind: "system", text: `${amount} XP concedido — ${reason}` },
          ...ups.map((u: { name: string; newLevel: number }) => ({
            who: "Mestre", kind: "system" as const,
            text: `${u.name} alcançou o nível ${u.newLevel}! Que os bardos cantem.`,
          })),
        ]);
        await refresh();
      }
    } catch {
      /* noop */
    }
  };

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6">
        <div className="panel p-10 text-center max-w-md">
          <Skull className="w-12 h-12 text-blood-400 mx-auto mb-4" />
          <h1 className="font-display font-bold text-2xl text-parch mb-2">{error}</h1>
          <p className="text-parch-dim text-sm mb-6">O pergaminho desta campanha não foi encontrado na estante.</p>
          <Link href="/entrar" className="btn-gold">Criar nova campanha</Link>
        </div>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-gold-400">
          <Loader2 className="w-10 h-10 animate-spin" />
          <p className="font-display tracking-widest text-sm">ABRINDO O GRIMÓRIO...</p>
        </div>
      </main>
    );
  }

  const log = data.state.log;

  return (
    <main className="min-h-screen noise-overlay">
      {/* HEADER */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-ink-950/85 border-b border-gold-500/15">
        <div className="max-w-[1700px] mx-auto px-4 md:px-6 h-14 flex items-center gap-3">
          <Link href="/" className="text-parch-dim hover:text-gold-400 transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <Crown className="w-5 h-5 text-gold-400" />
          <div className="min-w-0">
            <h1 className="font-display font-bold text-sm md:text-base gold-text truncate">{data.name}</h1>
            <p className="text-[10px] text-parch-dim/60 -mt-0.5 truncate">Mestre: {data.masterName}</p>
          </div>
          <button onClick={() => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
            className="ml-2 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gold-500/30 bg-gold-500/10 hover:bg-gold-500/20 transition-all font-display text-sm tracking-[0.3em] text-gold-300 cursor-pointer">
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {code}
          </button>
          <div className="ml-auto flex items-center gap-2 text-xs">
            {connected ? (
              <span className="flex items-center gap-1.5 text-emerald-400"><Wifi className="w-4 h-4" /> <span className="hidden md:inline">Ao vivo</span></span>
            ) : (
              <span className="flex items-center gap-1.5 text-blood-400"><WifiOff className="w-4 h-4" /> <span className="hidden md:inline">Reconectando...</span></span>
            )}
          </div>
        </div>
        <div className="max-w-[1700px] mx-auto px-4 md:px-6 flex overflow-x-auto">
          {TABS.map((t) => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`tab-btn flex items-center gap-2 ${tab === t.key ? "active" : ""}`}>
              <t.icon className="w-4 h-4" /> {t.name}
            </button>
          ))}
        </div>
      </header>

      <div className="max-w-[1700px] mx-auto px-4 md:px-6 py-5 grid lg:grid-cols-[1fr_340px] gap-5">
        {/* CONTEÚDO */}
        <div className="min-w-0">
          <AnimatePresence mode="wait">
            <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.18 }}>
              {tab === "tabuleiro" && <BoardTab data={data} code={code} patchSection={patchSection} appendLog={appendLog} awardXp={awardXp} refresh={refresh} />}
              {tab === "combate" && <CombatTab data={data} code={code} patchSection={patchSection} appendLog={appendLog} awardXp={awardXp} refresh={refresh} />}
              {tab === "bestiario" && <BestiaryTab data={data} code={code} patchSection={patchSection} appendLog={appendLog} awardXp={awardXp} refresh={refresh} />}
              {tab === "historia" && <StoryTab data={data} code={code} patchSection={patchSection} appendLog={appendLog} awardXp={awardXp} refresh={refresh} />}
              {tab === "jogadores" && <PlayersTab data={data} code={code} patchSection={patchSection} appendLog={appendLog} awardXp={awardXp} refresh={refresh} />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* SIDEBAR: DADOS + REGISTRO */}
        <aside className="space-y-4 lg:sticky lg:top-32 self-start">
          <div className="panel p-4">
            <DicePanel rollerName={data.masterName} onRoll={appendLog} allowHidden />
          </div>
          <div className="panel p-4">
            <h4 className="font-display text-gold-500 text-xs tracking-[0.25em] mb-3 flex items-center gap-2">
              <Dice5 className="w-4 h-4" /> REGISTRO DA MESA
            </h4>
            <div className="space-y-1.5 max-h-[45vh] overflow-y-auto pr-1">
              {log.length === 0 && <p className="text-parch-dim/50 text-xs italic">O pergaminho aguarda os primeiros dados...</p>}
              {[...log].reverse().map((e) => (
                <div key={e.id} className={`text-xs rounded-lg px-3 py-2 border ${
                  e.kind === "roll" ? "bg-gold-500/5 border-gold-500/15"
                  : e.kind === "story" ? "bg-purple-500/5 border-purple-500/20"
                  : e.kind === "event" ? "bg-cyan-500/5 border-cyan-500/20"
                  : "bg-ink-800/60 border-gold-500/10"}`}>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-display text-[10px] tracking-wider text-gold-500">{e.who}</span>
                    {e.hidden && <span className="text-[9px] text-purple-300 border border-purple-500/40 rounded px-1">SECRETO</span>}
                  </div>
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
