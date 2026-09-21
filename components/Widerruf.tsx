"use client";
import { useState } from "react";
import type { Texte } from "@/lib/content/types";
import { useEinwilligung } from "@/lib/einwilligung-hook";

/**
 * Direkter Widerruf im Seitenfuss (Codex-Befund: der Link auf die Einstellungsseite allein ist kein
 * Widerruf). Erscheint nur, wenn eine Einwilligung gespeichert ist; löscht die Entscheidung, die Karte
 * verschwindet über den gemeinsamen Store sofort, der Banner erscheint wieder.
 */
export function Widerruf({ t }: { t: Texte["einwilligung"] }) {
  const { einwilligung, geladen, widerrufen } = useEinwilligung();
  const [meldung, setMeldung] = useState<string | null>(null);
  if (!geladen) return null;
  if (!einwilligung) return meldung ? <span role="status" className="text-[0.9rem] text-weiss/90">{meldung}</span> : null;
  return (
    <button
      type="button"
      className="inline-flex min-h-11 min-w-11 items-center text-left underline-offset-4 hover:underline"
      onClick={() => {
        widerrufen();
        setMeldung(t.widerrufenMeldung);
      }}
    >
      {t.widerrufen}
    </button>
  );
}
