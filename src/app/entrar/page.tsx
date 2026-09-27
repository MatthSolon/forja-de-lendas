"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Crown, Users, ChevronLeft, KeyRound, Castle, Loader2 } from "lucide-react";

function EntrarContent() {
  const router = useRouter();
  const params = useSearchParams();
  const initial = params.get("papel") === "jogador" ? "jogador" : "mestre";
  const [mode, setMode] = useState<"mestre" | "jogador">(initial);
  const [name, setName] = useState("");
  const [masterName, setMasterName] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createCampaign = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, masterName }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Falha ao criar");
      router.push(`/mestre/${json.code}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro inesperado");
      setLoading(false);
    }
  };

  const joinCampaign = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/campaigns/${code.trim().toUpperCase()}`);
      if (!res.ok) throw new Error(res.status === 404 ? "Código não encontrado. Confira com o mestre." : "Erro ao entrar");
      router.push(`/jogador/${code.trim().toUpperCase()}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erro inesperado");
      setLoading(false);
    }
  };

  return (
    <main className="noise-overlay min-h-screen flex items-center justify-center px-6 py-16 relative">
      <div className="absolute inset-0 bg-[radial-gradient(800px_400px_at_50%_0%,rgba(201,162,39,0.08),transparent_70%)]" />
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="relative w-full max-w-lg">
        <Link href="/" className="inline-flex items-center gap-1 text-parch-dim hover:text-gold-400 text-sm mb-6 transition-colors">
          <ChevronLeft className="w-4 h-4" /> Voltar à taverna
        </Link>

        <div className="panel p-8 md:p-10">
          <div className="text-center mb-8">
            <KeyRound className="w-10 h-10 text-gold-400 mx-auto mb-3" />
            <h1 className="font-display font-black text-3xl gold-text">Entrar na Mesa</h1>
            <p className="text-parch-dim mt-2 text-sm">Escolha seu lado do escudo do mestre</p>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-8">
            <button onClick={() => { setMode("mestre"); setError(null); }}
              className={`flex flex-col items-center gap-2 py-5 rounded-xl border transition-all cursor-pointer ${
                mode === "mestre"
                  ? "border-gold-400 bg-gold-500/10 gold-border-glow text-gold-300"
                  : "border-gold-500/15 bg-ink-800/50 text-parch-dim hover:border-gold-500/40"
              }`}>
              <Crown className="w-7 h-7" />
              <span className="font-display font-bold text-sm">MESTRE</span>
            </button>
            <button onClick={() => { setMode("jogador"); setError(null); }}
              className={`flex flex-col items-center gap-2 py-5 rounded-xl border transition-all cursor-pointer ${
                mode === "jogador"
                  ? "border-gold-400 bg-gold-500/10 gold-border-glow text-gold-300"
                  : "border-gold-500/15 bg-ink-800/50 text-parch-dim hover:border-gold-500/40"
              }`}>
              <Users className="w-7 h-7" />
              <span className="font-display font-bold text-sm">JOGADOR</span>
            </button>
          </div>

          {mode === "mestre" ? (
            <div className="space-y-4">
              <div>
                <label className="block font-display text-xs tracking-widest text-gold-500 mb-2">NOME DA CAMPANHA</label>
                <input className="input-fantasy" placeholder="Ex.: As Cinzas de Valdris"
                  value={name} onChange={(e) => setName(e.target.value)} maxLength={60} />
              </div>
              <div>
                <label className="block font-display text-xs tracking-widest text-gold-500 mb-2">SEU TÍTULO DE MESTRE</label>
                <input className="input-fantasy" placeholder="Ex.: Arquimago Narrador"
                  value={masterName} onChange={(e) => setMasterName(e.target.value)} maxLength={40} />
              </div>
              <button onClick={createCampaign} disabled={loading || !name.trim() || !masterName.trim()}
                className="btn-gold w-full !py-3.5 disabled:opacity-40 disabled:cursor-not-allowed">
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Castle className="w-5 h-5" />}
                Forjar Campanha
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block font-display text-xs tracking-widest text-gold-500 mb-2">CÓDIGO DA CAMPANHA</label>
                <input className="input-fantasy text-center font-display text-2xl tracking-[0.5em] uppercase"
                  placeholder="XXXXX" value={code} maxLength={5}
                  onChange={(e) => setCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""))} />
              </div>
              <button onClick={joinCampaign} disabled={loading || code.length !== 5}
                className="btn-gold w-full !py-3.5 disabled:opacity-40 disabled:cursor-not-allowed">
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Users className="w-5 h-5" />}
                Sentar à Mesa
              </button>
            </div>
          )}

          {error && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="mt-4 text-center text-blood-400 text-sm bg-blood-600/10 border border-blood-600/30 rounded-lg px-4 py-2.5">
              {error}
            </motion.p>
          )}
        </div>

        <p className="text-center text-parch-dim/50 text-xs mt-6 italic">
          O mestre cria a sala e compartilha o código de 5 letras com os jogadores.
        </p>
      </motion.div>
    </main>
  );
}

export default function EntrarPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-ink-950" />}>
      <EntrarContent />
    </Suspense>
  );
}
