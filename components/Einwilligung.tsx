"use client";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { ALLE, KATEGORIEN, KEINE, type Kategorie } from "@/lib/einwilligung";
import { useEinwilligung } from "@/lib/einwilligung-hook";
import type { Sprache, Texte } from "@/lib/content/types";
import { SchliessenIcon } from "./Icons";

type T = Texte["einwilligung"];

function datenschutzPfad(sprache: Sprache) {
  return sprache === "de" ? "/de/datenschutz/" : "/en/privacy/";
}

function Kategorienliste({ auswahl, setAuswahl, t }: { auswahl: Record<Kategorie, boolean>; setAuswahl: (a: Record<Kategorie, boolean>) => void; t: T }) {
  const praefix = useId();
  return (
    <ul role="list" className="divide-y divide-linie border-y border-linie">
      <li className="py-4">
        <div className="flex items-center justify-between gap-4">
          <span className="font-semibold">{t.notwendigTitel}</span>
          <span className="text-[0.95rem] text-grau">{t.immerAktiv}</span>
        </div>
        <p className="mt-1 text-[1rem] text-grau">{t.notwendigText}</p>
      </li>
      {KATEGORIEN.map((k) => {
        const id = `${praefix}-${k}`;
        return (
          <li key={k} className="py-4">
            <div className="flex items-center justify-between gap-4">
              <label htmlFor={id} className="inline-flex min-h-11 items-center font-semibold">
                {t.karteTitel}
              </label>
              {/* Touch-Ziel 44 px: die Fläche ist Teil des Labels, die Checkbox selbst 24 px */}
              <label htmlFor={id} className="grid h-11 w-11 shrink-0 cursor-pointer place-items-center">
                <input id={id} type="checkbox" className="h-6 w-6 accent-aubergine" checked={auswahl[k]} onChange={(e) => setAuswahl({ ...auswahl, [k]: e.target.checked })} />
              </label>
            </div>
            <p className="mt-1 text-[1rem] text-grau">{t.karteText}</p>
            <p className="mt-1 text-[0.95rem] text-grau">{t.karteAnbieter}</p>
          </li>
        );
      })}
    </ul>
  );
}

/** Einstellungsansicht: im Dialog (Banner → Einstellungen) und eingebettet auf der Seite Datenschutz-Einstellungen. */
export function Einwilligungseinstellungen({ sprache, t, eingebettet = false, onFertig }: { sprache: Sprache; t: T; eingebettet?: boolean; onFertig?: () => void }) {
  const { einwilligung, geladen, setzen, widerrufen } = useEinwilligung();
  const [auswahl, setAuswahl] = useState<Record<Kategorie, boolean>>({ ...KEINE });
  const [meldung, setMeldung] = useState("");
  // Gespeicherte Entscheidung als Ausgangswert übernehmen (Muster «Zustand beim Rendern anpassen», kein Effekt nötig).
  const [gesehen, setGesehen] = useState(einwilligung);
  if (einwilligung !== gesehen) {
    setGesehen(einwilligung);
    setAuswahl(einwilligung ? { ...einwilligung.kategorien } : { ...KEINE });
  }
  const speichernUndMelden = (kategorien: Record<Kategorie, boolean>, text: string) => {
    setzen(kategorien);
    setMeldung(text);
    onFertig?.();
  };
  return (
    <div>
      {eingebettet && geladen && (
        <p className="mb-4 rounded-[6px] bg-nebel px-4 py-3" aria-live="polite">
          {einwilligung
            ? `${t.entscheidungVom} ${new Date(einwilligung.zeitpunkt).toLocaleString(sprache === "de" ? "de-CH" : "en-GB", { dateStyle: "medium", timeStyle: "short" })}: ${einwilligung.kategorien.karte ? t.karteTitel : t.nurNotwendigeGespeichert}`
            : t.keineEntscheidung}
        </p>
      )}
      <Kategorienliste auswahl={auswahl} setAuswahl={setAuswahl} t={t} />
      <div className="mt-5 flex flex-wrap gap-3">
        <button type="button" className="knopf knopf-primaer" onClick={() => speichernUndMelden(auswahl, t.gespeichert)}>
          {t.auswahlSpeichern}
        </button>
        <button type="button" className="knopf knopf-sekundaer" onClick={() => speichernUndMelden({ ...ALLE }, t.alleErlaubt)}>
          {t.alleAkzeptieren}
        </button>
        <button type="button" className="knopf knopf-sekundaer" onClick={() => speichernUndMelden({ ...KEINE }, t.nurNotwendigeGespeichert)}>
          {t.nurNotwendige}
        </button>
        {eingebettet && einwilligung && (
          <button
            type="button"
            className="inline-flex min-h-11 items-center font-semibold text-fehler underline-offset-4 hover:underline"
            onClick={() => {
              widerrufen();
              setAuswahl({ ...KEINE });
              setMeldung(t.widerrufenMeldung);
            }}
          >
            {t.widerrufen}
          </button>
        )}
      </div>
      {meldung && (
        <p className="mt-4 font-semibold text-aubergine" role="status">
          {meldung}
        </p>
      )}
      <p className="mt-4 text-[0.95rem] text-grau">
        {t.fussnote} <Link href={datenschutzPfad(sprache)} className="textlink">{t.datenschutzerklaerung}</Link>
      </p>
    </div>
  );
}

/** Banner beim ersten Besuch (unten, nicht blockierend) mit drei gleichwertigen Knöpfen; «Einstellungen» öffnet einen modalen Dialog. */
export function Einwilligungsbanner({ sprache, t }: { sprache: Sprache; t: T }) {
  const { einwilligung, geladen, setzen } = useEinwilligung();
  const [dialog, setDialog] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titelId = useId();

  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    if (dialog && !el.open) el.showModal();
    if (!dialog && el.open) el.close();
  }, [dialog]);

  if (!geladen || einwilligung) return null;

  return (
    <>
      {!dialog && (
        <section className="fixed inset-x-0 bottom-0 z-50 border-t-4 border-lime bg-weiss shadow-[0_-8px_30px_-12px_rgb(42_36_41/0.35)]" aria-labelledby={`${titelId}-banner`}>
          <div className="container-seite grid gap-4 py-5 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
            <div>
              <h2 id={`${titelId}-banner`} className="text-lg">
                {t.bannerTitel}
              </h2>
              <p className="mt-1 text-[1rem] text-grau">
                {t.bannerText} <Link href={datenschutzPfad(sprache)} className="textlink">{t.datenschutzerklaerung}</Link>
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button type="button" className="knopf knopf-primaer" onClick={() => setzen({ ...ALLE })}>
                {t.alleAkzeptieren}
              </button>
              <button type="button" className="knopf knopf-primaer" onClick={() => setzen({ ...KEINE })}>
                {t.nurNotwendige}
              </button>
              <button type="button" className="knopf knopf-sekundaer" onClick={() => setDialog(true)} aria-haspopup="dialog">
                {t.einstellungen}
              </button>
            </div>
          </div>
        </section>
      )}
      <dialog
        ref={dialogRef}
        aria-labelledby={`${titelId}-dialog`}
        className="m-auto max-h-[calc(100dvh-2rem)] w-[min(100%-2rem,38rem)] overflow-y-auto rounded-[12px] bg-weiss p-0 text-tinte shadow-2xl backdrop:bg-tinte/50"
        onClose={() => setDialog(false)}
        onClick={(ev) => {
          if (ev.target === dialogRef.current) setDialog(false);
        }}
      >
        <div className="p-6 sm:p-8">
          <div className="flex items-start justify-between gap-4">
            <h2 id={`${titelId}-dialog`} className="text-display-md">
              {t.dialogTitel}
            </h2>
            <button type="button" onClick={() => setDialog(false)} className="knopf knopf-sekundaer min-h-11 w-11 flex-none px-0" aria-label={t.schliessen}>
              <SchliessenIcon />
            </button>
          </div>
          <p className="mb-5 mt-2 text-grau">{t.dialogText}</p>
          <Einwilligungseinstellungen sprache={sprache} t={t} onFertig={() => setDialog(false)} />
          <button type="button" className="mt-4 inline-flex min-h-11 items-center font-semibold text-aubergine underline-offset-4 hover:underline" onClick={() => setDialog(false)}>
            {t.schliessen}
          </button>
        </div>
      </dialog>
    </>
  );
}
