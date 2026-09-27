"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { CampaignState, CharacterRow, LogEntry } from "@/lib/types";
import { defaultCampaignState } from "@/lib/types";
import { uid } from "@/lib/game";

export interface CampaignData {
  id: number;
  code: string;
  name: string;
  masterName: string;
  state: CampaignState;
  characters: CharacterRow[];
  updatedAt: string;
}

export function useCampaign(code: string, pollMs = 2500) {
  const [data, setData] = useState<CampaignData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const busy = useRef(false);

  const fetchNow = useCallback(async () => {
    try {
      const res = await fetch(`/api/campaigns/${code}`, { cache: "no-store" });
      if (!res.ok) {
        setError(res.status === 404 ? "Campanha não encontrada" : "Erro ao carregar");
        return;
      }
      const json = await res.json();
      setData({ ...json, state: { ...defaultCampaignState(), ...json.state } });
      setConnected(true);
      setError(null);
    } catch {
      setConnected(false);
    }
  }, [code]);

  useEffect(() => {
    fetchNow();
    const t = setInterval(() => {
      if (!busy.current) fetchNow();
    }, pollMs);
    return () => clearInterval(t);
  }, [fetchNow, pollMs]);

  const patchSection = useCallback(
    async (section: Partial<CampaignState>) => {
      busy.current = true;
      setData((d) => (d ? { ...d, state: { ...d.state, ...section } } : d));
      try {
        const res = await fetch(`/api/campaigns/${code}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ section }),
        });
        const json = await res.json();
        setData((d) => (d ? { ...d, state: { ...defaultCampaignState(), ...json.state } } : d));
      } finally {
        busy.current = false;
      }
    },
    [code]
  );

  const appendLog = useCallback(
    async (entries: Omit<LogEntry, "id" | "ts">[]) => {
      const stamped = entries.map((e) => ({ ...e, id: uid(), ts: Date.now() }));
      setData((d) => (d ? { ...d, state: { ...d.state, log: [...d.state.log, ...stamped].slice(-80) } } : d));
      busy.current = true;
      try {
        await fetch(`/api/campaigns/${code}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ log: stamped }),
        });
      } finally {
        busy.current = false;
      }
    },
    [code]
  );

  return { data, error, connected, patchSection, appendLog, refresh: fetchNow };
}
