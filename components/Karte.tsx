"use client";
import { useEinwilligung } from "@/lib/einwilligung-hook";
import type { Texte } from "@/lib/content/types";
import { OrtIcon, RouteIcon } from "./Icons";

/**
 * Standortkarte (Google Maps) ausschliesslich nach Einwilligung «karte». Vorher ein Platzhalter mit
 * Adresse, «Karte anzeigen» und Routenlink. Kein iframe-src, kein preconnect vor der Zustimmung;
 * beim Widerruf wird das iframe sofort entfernt.
 */
export function Karte({ einbettung, routenlink, adresse, t, ui }: { einbettung: string; routenlink: string; adresse: string; t: Texte["einwilligung"]; ui: Texte["ui"] }) {
  const { erlaubt, geladen, setzen, einwilligung } = useEinwilligung();
  const aktiv = geladen && erlaubt("karte");
  const routen = (
    <a className="knopf knopf-sekundaer" href={routenlink} target="_blank" rel="noopener noreferrer">
      <RouteIcon />
      {ui.routePlanen}
    </a>
  );
  if (aktiv) {
    return (
      <div className="overflow-hidden rounded-[12px] border border-linie">
        <iframe className="block aspect-[4/3] w-full sm:aspect-[16/9]" src={einbettung} title={`Google Maps: ${adresse}`} loading="lazy" referrerPolicy="strict-origin-when-cross-origin" allow="" sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox" />
        <div className="flex flex-wrap items-center gap-3 bg-nebel p-4">
          {routen}
          <button type="button" className="inline-flex min-h-11 items-center font-semibold text-aubergine underline-offset-4 hover:underline" onClick={() => setzen({ ...einwilligung!.kategorien, karte: false })}>
            {t.karteAusblenden}
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-col items-start gap-4 rounded-[12px] border border-linie bg-nebel p-6 sm:p-8">
      <span className="text-aubergine">
        <OrtIcon />
      </span>
      <p className="text-lg font-semibold text-aubergine">{adresse}</p>
      <p className="text-grau">{t.kartePlatzhalter}</p>
      <div className="flex flex-wrap gap-3">
        <button type="button" className="knopf knopf-primaer" onClick={() => setzen({ ...(einwilligung?.kategorien ?? {}), karte: true })} disabled={!geladen}>
          {t.karteAnzeigen}
        </button>
        {routen}
      </div>
    </div>
  );
}
