"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Swords, Dices, Map as MapIcon, Skull, BookOpen, Crown, ChevronRight,
  Sparkles, Users, ScrollText, Layers, HeartHandshake, Flame,
} from "lucide-react";
import LandingDice from "@/components/landing-dice";

const features = [
  {
    icon: Swords, title: "Classes & Subclasses",
    desc: "12 classes fiéis a D&D com 36 subclasses, recursos por nível até o 20, estilos de luta, truques, pactos e juramentos.",
  },
  {
    icon: Dices, title: "Rolagem de Dados Viva",
    desc: "d4 a d100 com expressões (2d6+3), vantagem/desvantagem, críticos destacados e histórico compartilhado em tempo real na mesa.",
  },
  {
    icon: MapIcon, title: "Tabuleiro do Mestre",
    desc: "60 presets de mapas personalizáveis, pintura de terreno, névoa de guerra, tokens de heróis e monstros que os jogadores veem ao vivo.",
  },
  {
    icon: Skull, title: "Bestiário Escalável",
    desc: "Mais de 40 criaturas e 6 bosses com fases e ações lendárias. Escale qualquer monstro de ND 0 a 20 com um clique.",
  },
  {
    icon: Layers, title: "Níveis & Progressão",
    desc: "Tabela oficial de XP, bônus de proficiência, HP por dado de vida e level-up automático narrado no registro da sessão.",
  },
  {
    icon: BookOpen, title: "Campanha Épica",
    desc: "5 arcos, 20 capítulos, 60+ missões com escolhas de consequência, além de geradores infinitos de rumores, eventos e tesouros.",
  },
];

const classes = [
  "Guerreiro", "Bárbaro", "Mago", "Feiticeiro", "Clérigo", "Paladino",
  "Ladino", "Patrulheiro", "Bardo", "Bruxo", "Druida", "Monge",
];

export default function Home() {
  return (
    <main className="noise-overlay min-h-screen overflow-x-hidden">
      {/* NAV */}
      <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-md bg-ink-950/70 border-b border-gold-500/10">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-gold-400 to-gold-700 flex items-center justify-center gold-border-glow">
              <Flame className="w-5 h-5 text-ink-950" strokeWidth={2.5} />
            </div>
            <span className="font-display font-bold text-lg gold-text tracking-wider">FORJA DE LENDAS</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm text-parch-dim font-display tracking-wide">
            <a href="#recursos" className="hover:text-gold-400 transition-colors">RECURSOS</a>
            <a href="#classes" className="hover:text-gold-400 transition-colors">CLASSES</a>
            <a href="#campanha" className="hover:text-gold-400 transition-colors">CAMPANHA</a>
          </nav>
          <Link href="/entrar" className="btn-gold !py-2 !px-4 text-sm">
            Jogar Agora <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center vignette">
        <Image src="/images/hero.jpg" alt="Aventureiros enfrentando um dragão" fill priority
          className="object-cover object-center opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink-950/70 via-transparent to-ink-950" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink-950/60 via-transparent to-ink-950/60" />

        <div className="relative z-10 max-w-5xl mx-auto px-6 pt-24 text-center">
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="font-display text-gold-400/90 tracking-[0.4em] text-xs md:text-sm mb-6 animate-flicker">
            ⚔ O SISTEMA DEFINITIVO DE RPG DE MESA ⚔
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.7 }}
            className="font-display font-black text-5xl md:text-8xl leading-[0.95] gold-text drop-shadow-2xl">
            FORJA DE<br />LENDAS
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
            className="mt-6 text-lg md:text-xl text-parch/80 max-w-2xl mx-auto font-light leading-relaxed">
            Reúna seu grupo, erga o tabuleiro e escreva uma saga de 20 capítulos.
            O mestre comanda o mundo. Os dados decidem quem vive para contar.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/entrar?papel=mestre" className="btn-gold text-base">
              <Crown className="w-5 h-5" /> Criar Campanha (Mestre)
            </Link>
            <Link href="/entrar?papel=jogador" className="btn-ghost text-base">
              <Users className="w-5 h-5" /> Entrar como Jogador
            </Link>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.8 }}
            className="mt-14 flex justify-center">
            <LandingDice />
          </motion.div>
        </div>

        <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-ink-950 to-transparent z-10" />
      </section>

      {/* STATS */}
      <section className="relative border-y border-gold-500/10 bg-ink-900/50">
        <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-6 gap-6 text-center">
          {[
            ["12", "Classes"], ["36", "Subclasses"], ["60", "Mapas"], ["46", "Criaturas"],
            ["20", "Capítulos"], ["90+", "Magias"],
          ].map(([n, l], i) => (
            <motion.div key={l} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.06 }}>
              <div className="font-display font-black text-3xl md:text-4xl gold-text">{n}</div>
              <div className="text-parch-dim text-xs tracking-[0.2em] font-display mt-1">{l.toUpperCase()}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="recursos" className="max-w-7xl mx-auto px-6 py-24 md:py-32">
        <div className="text-center mb-16">
          <p className="font-display text-gold-500 tracking-[0.3em] text-xs mb-4">TUDO QUE UMA MESA PRECISA</p>
          <h2 className="font-display font-black text-4xl md:text-6xl gold-text">Um grimório completo</h2>
          <div className="rune-divider max-w-md mx-auto mt-6"><Sparkles className="w-5 h-5" /></div>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div key={f.title} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }} transition={{ delay: (i % 3) * 0.1 }}
              className="panel p-7 group hover:border-gold-500/40 hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-gold-500/10 border border-gold-500/25 flex items-center justify-center mb-5 group-hover:bg-gold-500/20 transition-colors">
                <f.icon className="w-6 h-6 text-gold-400" />
              </div>
              <h3 className="font-display font-bold text-xl text-parch mb-2">{f.title}</h3>
              <p className="text-parch-dim/90 leading-relaxed text-[15px]">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CLASSES MARQUEE */}
      <section id="classes" className="border-y border-gold-500/10 bg-ink-900/40 py-16 overflow-hidden">
        <p className="text-center font-display text-gold-500 tracking-[0.3em] text-xs mb-8">DOZE CAMINHOS PARA A GLÓRIA</p>
        <div className="flex flex-wrap justify-center gap-3 max-w-5xl mx-auto px-6">
          {classes.map((c, i) => (
            <motion.span key={c} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }} transition={{ delay: i * 0.04 }}
              className="px-5 py-2.5 rounded-full border border-gold-500/25 bg-ink-800/80 font-display text-parch text-sm tracking-wide hover:border-gold-400/60 hover:text-gold-300 transition-colors cursor-default">
              {c}
            </motion.span>
          ))}
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section id="campanha" className="max-w-6xl mx-auto px-6 py-24 md:py-32">
        <div className="text-center mb-16">
          <h2 className="font-display font-black text-4xl md:text-5xl gold-text">Três passos para a aventura</h2>
          <div className="rune-divider max-w-md mx-auto mt-6"><ScrollText className="w-5 h-5" /></div>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: Crown, n: "I", t: "O Mestre Forja o Mundo", d: "Crie a campanha, receba um código de 5 letras e compartilhe com a mesa. Controle o tabuleiro, monstros, XP e a história." },
            { icon: Users, n: "II", t: "Os Jogadores Criam Heróis", d: "Cada jogador entra com o código, escolhe raça, classe, subclasse, atributos, equipamento e magias — a ficha calcula tudo." },
            { icon: HeartHandshake, n: "III", t: "A Mesa Vive em Tempo Real", d: "Dados, tabuleiro, iniciativa e capítulos sincronizam para todos. Role, mova, escolha — a lenda se escreve em conjunto." },
          ].map((s, i) => (
            <motion.div key={s.n} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.12 }}
              className="relative panel p-8 pt-12 text-center">
              <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-gradient-to-br from-gold-400 to-gold-700 flex items-center justify-center font-display font-black text-ink-950 text-xl gold-border-glow">
                {s.n}
              </div>
              <s.icon className="w-8 h-8 text-gold-400 mx-auto mb-4" />
              <h3 className="font-display font-bold text-lg text-parch mb-3">{s.t}</h3>
              <p className="text-parch-dim/90 text-[15px] leading-relaxed">{s.d}</p>
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-16">
          <Link href="/entrar" className="btn-gold text-lg !px-10 !py-4">
            Começar a Saga <ChevronRight className="w-5 h-5" />
          </Link>
          <p className="text-parch-dim/60 text-sm mt-4 italic">Gratuito, sem cadastro — um código de campanha e pronto.</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-gold-500/10 bg-ink-950 py-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Flame className="w-5 h-5 text-gold-500" />
            <span className="font-display font-bold gold-text">FORJA DE LENDAS</span>
          </div>
          <p className="text-parch-dim/60 text-sm text-center">
            Sistema fan-made inspirado em D&D 5e · Que seus 20s sejam sempre críticos
          </p>
        </div>
      </footer>
    </main>
  );
}
