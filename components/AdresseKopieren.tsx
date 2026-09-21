"use client";
import { useState } from "react";
import { HakenIcon, KopierenIcon } from "./Icons";

export function AdresseKopieren({ adresse, beschriftung, kopiert, fehler }: { adresse: string; beschriftung: string; kopiert: string; fehler: string }) {
  const [zustand, setZustand] = useState<"bereit" | "kopiert" | "fehler">("bereit");
  async function kopieren() {
    try {
      await navigator.clipboard.writeText(adresse);
      setZustand("kopiert");
    } catch {
      setZustand("fehler");
    }
    setTimeout(() => setZustand("bereit"), 2500);
  }
  return (
    <span className="inline-flex flex-wrap items-center gap-2">
      <button type="button" onClick={kopieren} className="knopf knopf-sekundaer min-h-11 py-2 text-[1rem]">
        {zustand === "kopiert" ? <HakenIcon /> : <KopierenIcon />}
        {zustand === "kopiert" ? kopiert : beschriftung}
      </button>
      <span role="status" aria-live="polite" className="text-[0.95rem] text-grau">
        {zustand === "fehler" ? fehler : ""}
      </span>
    </span>
  );
}
