import Link from "next/link";
import type { Sprache } from "@/lib/content/types";

interface Props {
  sprache: Sprache;
  /** Pfad der Entsprechung in der anderen Sprache (über den Übersetzungsschlüssel ermittelt). */
  ziel?: string;
  /** Name der anderen Sprache in ihrer eigenen Schreibweise («English» / «Deutsch»). */
  beschriftung: string;
  /** Wort «Startseite»/«Home» der aktuellen Sprache – sichtbare Kennzeichnung, wenn keine Entsprechung existiert. */
  startseite: string;
  /** Vollständige Erklärung für Screenreader/Tooltip, wenn keine Entsprechung existiert. */
  fehltText: string;
  /** true: voller Sprachname sichtbar (Mobilmenü); false: Kürzel «EN»/«DE» (Kopfzeile). */
  voll?: boolean;
  className?: string;
}

/**
 * Sprachwechsel: führt zur Entsprechung der aktuellen Seite (über den Übersetzungsschlüssel).
 * Gibt es keine, zur Startseite der anderen Sprache – und das steht dann **sichtbar** dabei
 * («EN – Startseite»), nicht nur im Tooltip (Codex-Befund). Fehlende Übersetzungen werden nie als
 * vorhanden ausgegeben.
 */
export function Sprachwechsel({ sprache, ziel, beschriftung, startseite, fehltText, voll = false, className = "" }: Props) {
  const andere: Sprache = sprache === "de" ? "en" : "de";
  const href = ziel ?? `/${andere}/`;
  const sichtbar = voll ? beschriftung : andere.toUpperCase();
  return (
    <Link
      href={href}
      hrefLang={andere === "de" ? "de-CH" : "en"}
      lang={ziel ? andere : undefined}
      className={`inline-flex min-h-11 min-w-11 items-center justify-center gap-1 rounded-[6px] px-3 font-semibold text-aubergine hover:bg-aubergine-hell ${className}`}
      title={ziel ? undefined : fehltText}
    >
      {/* Kürzel «EN» ist für Screenreader verborgen und wird durch den vollen Namen ersetzt; der volle Name (Mobilmenü) spricht für sich. */}
      <span aria-hidden={voll ? undefined : true} className={voll ? "" : "text-sm uppercase tracking-wide"}>
        <span lang={andere}>{sichtbar}</span>
        {!ziel && <span className="font-normal normal-case tracking-normal text-grau"> – {startseite}</span>}
      </span>
      {(!voll || !ziel) && <span className="sr-only">{ziel ? beschriftung : fehltText}</span>}
    </Link>
  );
}
