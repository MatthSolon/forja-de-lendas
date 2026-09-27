"use client";

import { useEffect, useRef, useState } from "react";
import {
  ARCS, getArc, getChapter, TAVERN_RUMORS, RANDOM_EVENTS, DUNGEON_EVENTS, TREASURES,
  generateSideQuest, pick,
} from "@/lib/data/story";
import { xpForLevelRange } from "@/lib/data/story";
import type { TabProps } from "./master-client";
import {
  BookOpen, CheckCircle2, Circle, Compass, ScrollText, Sparkles, MessageCircleQuestion,
  Swords, ChevronRight, Skull, Coins, Landmark, StickyNote, Crown, GitBranch,
} from "lucide-react";

const KIND_LABEL: Record<string, string> = {
  combate: "Combate", exploracao: "Exploração", social: "Social", misterio: "Mistério",
};
const KIND_COLOR: Record<string, string> = {
  combate: "border-blood-500/40 text-blood-400",
  exploracao: "border-emerald-500/40 text-emerald-400",
  social: "border-cyan-500/40 text-cyan-300",
  misterio: "border-purple-500/40 text-purple-300",
};

export default function StoryTab({ data, patchSection, appendLog, awardXp }: TabProps) {
  const story = data.state.story;
  const arc = getArc(story.arcId);
  const chapter = getChapter(story.arcId, story.chapterId);
  const [genResult, setGenResult] = useState<{ title: string; text: string; xp?: number } | null>(null);
  const [notes, setNotes] = useState(story.notes);
  const notesTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => setNotes(data.state.story.notes), [data.state.story.notes]);

  function setArc(arcId: string) {
    const a = getArc(arcId);
    patchSection({ story: { ...story, arcId, chapterId: a.chapters[0].id, doneQuests: [], doneChoices: [] } });
    appendLog([{ who: "Mestre", kind: "story", text: `A campanha mergulha no arco "${a.name}".` }]);
  }

  function setChapter(chapterId: string) {
    const ch = getChapter(story.arcId, chapterId);
    patchSection({ story: { ...story, chapterId } });
    appendLog([{ who: "Mestre", kind: "story", text: `Novo capítulo aberto: "${ch.title}"` }]);
  }

  function toggleQuest(questId: string, title: string, xp: number) {
    const done = story.doneQuests.includes(questId);
    const doneQuests = done ? story.doneQuests.filter((q) => q !== questId) : [...story.doneQuests, questId];
    patchSection({ story: { ...story, doneQuests } });
    if (!done) {
      awardXp(xp, `Missão concluída: ${title}`);
    }
  }

  function chooseOption(choiceId: string, label: string, outcome: string, xp: number) {
    if (story.doneChoices.includes(choiceId)) return;
    patchSection({ story: { ...story, doneChoices: [...story.doneChoices, choiceId] } });
    appendLog([{ who: "Mestre", kind: "story", text: `Escolha do grupo: "${label}" — ${outcome}` }]);
    if (xp > 0) awardXp(xp, `Consequência: ${label}`);
  }

  function saveNotes(v: string) {
    setNotes(v);
    if (notesTimer.current) clearTimeout(notesTimer.current);
    notesTimer.current = setTimeout(() => patchSection({ story: { ...story, notes: v } }), 800);
  }

  const avgLevel = data.characters.length
    ? Math.max(1, Math.round(data.characters.reduce((a, c) => a + c.level, 0) / data.characters.length))
    : 1;

  function gen(kind: "rumor" | "side" | "event" | "dungeon" | "treasure") {
    if (kind === "rumor") setGenResult({ title: "Rumor de Taverna", text: pick(TAVERN_RUMORS) });
    if (kind === "event") setGenResult({ title: "Evento de Viagem", text: pick(RANDOM_EVENTS) });
    if (kind === "dungeon") setGenResult({ title: "Evento de Masmorra", text: pick(DUNGEON_EVENTS) });
    if (kind === "side") {
      const q = generateSideQuest();
      const xs = xpForLevelRange(avgLevel);
      setGenResult({ title: `Missão Lateral (${KIND_LABEL[q.kind]})`, text: `${q.hook} → ${q.objective}. Reviravolta: ${q.twist}.`, xp: xs.standard + q.xp });
    }
    if (kind === "treasure") {
      const tier = avgLevel <= 4 ? TREASURES[0] : avgLevel <= 10 ? TREASURES[1] : avgLevel <= 16 ? TREASURES[2] : TREASURES[3];
      setGenResult({ title: `Tesouro ${tier.tier}`, text: `Espólio: ${pick(tier.items)} · ${pick(tier.items)}${Math.random() > 0.5 ? ` · ${pick(tier.items)}` : ""}` });
    }
  }

  const chapterIdx = arc.chapters.findIndex((c) => c.id === story.chapterId);

  return (
    <div className="space-y-4">
      {/* ARCOS */}
      <div className="panel p-4">
        <h3 className="font-display font-bold text-parch flex items-center gap-2 mb-3">
          <BookOpen className="w-5 h-5 text-gold-400" /> A Saga — 5 Arcos, 20 Capítulos
        </h3>
        <div className="grid md:grid-cols-5 gap-2">
          {ARCS.map((a) => (
            <button key={a.id} onClick={() => setArc(a.id)}
              className={`text-left p-3 rounded-xl border transition-all cursor-pointer ${
                story.arcId === a.id ? "border-gold-400 bg-gold-500/10 gold-border-glow" : "border-gold-500/15 hover:border-gold-500/40 bg-ink-800/50"
              }`}>
              <div className="font-display text-[10px] tracking-widest text-gold-500">{a.levels.toUpperCase()}</div>
              <div className="font-display font-bold text-sm text-parch leading-tight mt-0.5">{a.name}</div>
              <div className="text-[10px] text-parch-dim/70 italic mt-1 line-clamp-2">{a.tagline}</div>
            </button>
          ))}
        </div>
        <p className="text-parch-dim/80 text-sm mt-3 leading-relaxed">{arc.summary}</p>
      </div>

      {/* CAPÍTULOS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {arc.chapters.map((c, i) => (
          <button key={c.id} onClick={() => setChapter(c.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border font-display text-sm whitespace-nowrap transition-all cursor-pointer ${
              story.chapterId === c.id
                ? "border-gold-400 bg-gold-500/15 text-gold-300"
                : "border-gold-500/15 text-parch-dim hover:border-gold-500/40"
            }`}>
            {c.bossKey ? <Crown className="w-4 h-4 text-blood-400" /> : <span className="text-gold-500">{["I", "II", "III", "IV"][i]}</span>}
            {c.title}
          </button>
        ))}
      </div>

      <div className="grid xl:grid-cols-[1fr_360px] gap-4">
        {/* LEITURA + MISSÕES */}
        <div className="space-y-4 min-w-0">
          <div className="panel p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display font-black text-2xl gold-text">{chapter.title}</h3>
              <span className="text-xs font-display text-parch-dim border border-gold-500/25 rounded-full px-3 py-1">
                Níveis {chapter.levelRange[0]}–{chapter.levelRange[1]}
              </span>
            </div>
            <div className="space-y-3">
              {chapter.reading.map((p, i) => (
                <p key={i} className="text-parch/90 leading-relaxed text-[15px] font-light">
                  <span className="text-gold-500 font-display mr-1">{i === 0 ? "❧" : "◆"}</span> {p}
                </p>
              ))}
            </div>
            {chapter.encounterKeys.length > 0 && (
              <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
                <span className="font-display text-gold-500 tracking-widest flex items-center gap-1"><Swords className="w-3.5 h-3.5" /> ENCONTROS SUGERIDOS:</span>
                {chapter.encounterKeys.filter((k) => !k.startsWith("boss")).map((k) => (
                  <span key={k} className="px-2 py-0.5 rounded bg-blood-600/15 border border-blood-600/30 text-blood-400">{k.replace(/-/g, " ")}</span>
                ))}
                <span className="text-parch-dim/50 italic">(escale no Bestiário)</span>
              </div>
            )}
            {chapter.bossKey && (
              <div className="mt-4 p-3 rounded-lg bg-blood-600/10 border border-blood-600/30 flex items-center gap-3">
                <Skull className="w-6 h-6 text-blood-400" />
                <div>
                  <p className="font-display font-bold text-blood-400 text-sm">BOSS DO ARCO: {chapter.bossKey.replace("boss-", "").replace(/-/g, " ").toUpperCase()}</p>
                  <p className="text-parch-dim/70 text-xs">Escalone para ND {chapter.levelRange[1]} no Bestiário e narre as fases conforme a vida cai.</p>
                </div>
              </div>
            )}
          </div>

          {/* MISSÕES */}
          <div className="panel p-5">
            <h4 className="font-display text-xs tracking-[0.25em] text-gold-500 mb-3">MISSÕES DO CAPÍTULO</h4>
            <div className="space-y-2">
              {chapter.quests.map((q) => {
                const done = story.doneQuests.includes(q.id);
                return (
                  <button key={q.id} onClick={() => toggleQuest(q.id, q.title, q.xp)}
                    className={`w-full text-left p-3 rounded-lg border transition-all cursor-pointer group ${
                      done ? "border-emerald-500/40 bg-emerald-500/5" : "border-gold-500/15 hover:border-gold-500/40 bg-ink-800/40"
                    }`}>
                    <div className="flex items-center gap-2">
                      {done ? <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> : <Circle className="w-4 h-4 text-parch-dim/40 shrink-0 group-hover:text-gold-400" />}
                      <span className={`font-display font-bold text-sm ${done ? "text-emerald-300 line-through/0" : "text-parch"}`}>{q.title}</span>
                      <span className={`ml-auto text-[10px] px-1.5 py-0.5 rounded border ${KIND_COLOR[q.kind]}`}>{KIND_LABEL[q.kind]}</span>
                      <span className="text-xs font-display text-gold-400 whitespace-nowrap">+{q.xp} XP</span>
                    </div>
                    <p className="text-parch-dim/80 text-sm mt-1 ml-6">{q.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ESCOLHA */}
          <div className="panel p-5 border-l-4 !border-l-purple-500/50">
            <h4 className="font-display text-xs tracking-[0.25em] text-purple-300 mb-2 flex items-center gap-2">
              <GitBranch className="w-4 h-4" /> ENCruzilhada DA HISTÓRIA
            </h4>
            <p className="text-parch/90 leading-relaxed mb-3">{chapter.choice.prompt}</p>
            {story.doneChoices.includes(chapter.choice.id) ? (
              <p className="text-sm text-purple-300/80 italic">Destino selado nesta encruzilhada. As consequências seguem o grupo.</p>
            ) : (
              <div className="space-y-2">
                {chapter.choice.options.map((o, i) => (
                  <button key={i} onClick={() => chooseOption(chapter.choice.id, o.label, o.outcome, o.xp)}
                    className="w-full text-left p-3 rounded-lg border border-purple-500/25 hover:border-purple-400/60 hover:bg-purple-500/5 transition-all cursor-pointer">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-display font-bold text-sm text-parch">{o.label}</span>
                      <span className="text-xs font-display text-purple-300 whitespace-nowrap">+{o.xp} XP</span>
                    </div>
                    <p className="text-parch-dim/70 text-sm mt-0.5">{o.outcome}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* GERADORES + NOTAS */}
        <div className="space-y-4">
          <div className="panel p-4">
            <h4 className="font-display text-xs tracking-[0.25em] text-gold-500 mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> FORJA DE IMPROVISO
            </h4>
            <p className="text-[11px] text-parch-dim/70 -mt-1 mb-3 italic">Nunca mais uma sessão monótona: conteúdo novo a cada clique.</p>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => gen("rumor")} className="btn-ghost !py-2 text-xs"><MessageCircleQuestion className="w-3.5 h-3.5" /> Rumor</button>
              <button onClick={() => gen("side")} className="btn-ghost !py-2 text-xs"><ScrollText className="w-3.5 h-3.5" /> Missão Lateral</button>
              <button onClick={() => gen("event")} className="btn-ghost !py-2 text-xs"><Compass className="w-3.5 h-3.5" /> Evento de Viagem</button>
              <button onClick={() => gen("dungeon")} className="btn-ghost !py-2 text-xs"><Landmark className="w-3.5 h-3.5" /> Evento Masmorra</button>
              <button onClick={() => gen("treasure")} className="btn-ghost !py-2 text-xs col-span-2"><Coins className="w-3.5 h-3.5" /> Tesouro (nvl {avgLevel})</button>
            </div>
            {genResult && (
              <div className="mt-3 panel-inset p-3 space-y-2">
                <p className="font-display font-bold text-gold-300 text-sm">{genResult.title}</p>
                <p className="text-parch-dim text-sm leading-relaxed">{genResult.text}</p>
                <div className="flex gap-2">
                  <button onClick={() => appendLog([{ who: "Forja", kind: "story", text: `${genResult.title}: ${genResult.text}` }])}
                    className="btn-gold !py-1.5 text-xs flex-1">Registrar na mesa</button>
                  {genResult.xp && (
                    <button onClick={() => awardXp(genResult.xp!, `Missão lateral: ${genResult.title}`)}
                      className="btn-ghost !py-1.5 text-xs">+{genResult.xp} XP</button>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="panel p-4">
            <h4 className="font-display text-xs tracking-[0.25em] text-gold-500 mb-3 flex items-center gap-2">
              <StickyNote className="w-4 h-4" /> NOTAS DO MESTRE
            </h4>
            <textarea value={notes} onChange={(e) => saveNotes(e.target.value)}
              placeholder="Segredos, nomes improvisados, promessas dos jogadores..."
              className="input-fantasy min-h-40 text-sm resize-y" />
          </div>

          <div className="panel p-4">
            <h4 className="font-display text-xs tracking-[0.25em] text-gold-500 mb-3 flex items-center gap-2">
              <ChevronRight className="w-4 h-4" /> PROGRESSÃO
            </h4>
            <div className="flex items-center gap-1 mb-2">
              {arc.chapters.map((c, i) => (
                <div key={c.id} className={`h-2 flex-1 rounded-full ${i <= chapterIdx ? "bg-gold-500" : "bg-ink-600"}`} />
              ))}
            </div>
            <p className="text-xs text-parch-dim">
              Capítulo {chapterIdx + 1} de {arc.chapters.length} · {story.doneQuests.length + story.doneChoices.length} marcos concluídos neste arco.
            </p>
            {chapterIdx < arc.chapters.length - 1 && (
              <button onClick={() => setChapter(arc.chapters[chapterIdx + 1].id)} className="btn-gold !py-2 text-xs w-full mt-3">
                Avançar: {arc.chapters[chapterIdx + 1].title} <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
