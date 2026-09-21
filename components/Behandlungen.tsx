"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Behandlung, BehandlungsGruppe, Link as LinkTyp, Sprache, Texte } from "@/lib/content/types";
import { RichText } from "./RichText";
import { PfeilIcon, PlusIcon } from "./Icons";

const GRUPPEN_TITEL: Record<Sprache, Record<BehandlungsGruppe, string>> = {
  de: { diagnostik: "Diagnostik und Schmerzbehandlung", vorsorge: "Vorsorge und Dentalhygiene", restaurativ: "Restaurative und ästhetische Zahnmedizin", chirurgie: "Chirurgie, Implantate und Zahnersatz", weiteres: "Weitere Leistungen" },
  en: { diagnostik: "Diagnostics and pain treatment", vorsorge: "Prevention and dental hygiene", restaurativ: "Restorative and esthetic dentistry", chirurgie: "Surgery, implants and prostheses", weiteres: "Other services" },
};
const REIHENFOLGE: BehandlungsGruppe[] = ["diagnostik", "vorsorge", "restaurativ", "chirurgie", "weiteres"];

interface Props {
  behandlungen: Behandlung[];
  darstellung: "akkordeon" | "kurzliste";
  weiterLink?: LinkTyp;
  sprache: Sprache;
  t: Texte;
}

/**
 * Behandlungen: als aufklappbare Liste (native details/summary, nach Gruppen) oder als Kurzliste
 * mit Links auf die Anker der Behandlungsseite. Öffnet beim Laden den Eintrag aus dem #anker der URL
 * und setzt den Hash beim Öffnen, damit einzelne Behandlungen verlinkbar bleiben.
 */
export function Behandlungen({ behandlungen, darstellung, weiterLink, sprache, t }: Props) {
  const wurzel = useRef<HTMLDivElement>(null);
  const [alleOffen, setAlleOffen] = useState(false);

  useEffect(() => {
    if (darstellung !== "akkordeon") return;
    const oeffnenAusHash = () => {
      let id = "";
      try {
        id = decodeURIComponent(window.location.hash.slice(1));
      } catch {
        return; // ungültig codierter Hash (z. B. «#%») – ignorieren statt abbrechen
      }
      if (!id) return;
      const el = wurzel.current?.querySelector<HTMLDetailsElement>(`details[id="${CSS.escape(id)}"]`);
      if (el) {
        el.open = true;
        el.querySelector<HTMLElement>("summary")?.focus({ preventScroll: true });
        el.scrollIntoView({ block: "start" });
      }
    };
    oeffnenAusHash();
    window.addEventListener("hashchange", oeffnenAusHash);
    return () => window.removeEventListener("hashchange", oeffnenAusHash);
  }, [darstellung]);

  const alleSetzen = (offen: boolean) => {
    wurzel.current?.querySelectorAll<HTMLDetailsElement>("details").forEach((d) => (d.open = offen));
    setAlleOffen(offen);
  };

  if (darstellung === "kurzliste") {
    const behandlungsPfad = sprache === "de" ? "/de/behandlungen/" : "/en/treatments/";
    return (
      <div className="erscheinen">
        <ul className="grid gap-x-8 gap-y-1 sm:grid-cols-2 lg:grid-cols-3">
          {behandlungen.map((b) => (
            <li key={b.id}>
              <Link href={`${behandlungsPfad}#${b.anker}`} className="flex min-h-11 items-center gap-2 border-b border-linie py-2 font-semibold text-aubergine underline-offset-4 hover:underline">
                <span className="h-1.5 w-1.5 flex-none rounded-full bg-lime" aria-hidden="true" />
                {b.titel}
              </Link>
            </li>
          ))}
        </ul>
        {weiterLink && (
          <Link href={weiterLink.ziel} className="knopf knopf-sekundaer mt-8">
            {weiterLink.titel}
            <PfeilIcon />
          </Link>
        )}
      </div>
    );
  }

  return (
    <div ref={wurzel} className="erscheinen">
      <div className="mb-4 flex justify-end">
        <button type="button" className="inline-flex min-h-11 items-center gap-2 font-semibold text-aubergine underline-offset-4 hover:underline" onClick={() => alleSetzen(!alleOffen)}>
          {alleOffen ? t.ui.alleSchliessen : t.ui.alleOeffnen}
        </button>
      </div>
      {REIHENFOLGE.map((g) => {
        const liste = behandlungen.filter((b) => b.gruppe === g);
        if (!liste.length) return null;
        return (
          <section key={g} aria-labelledby={`gruppe-${g}`} className="mb-10">
            <h2 id={`gruppe-${g}`} className="text-display-md mb-3">
              {GRUPPEN_TITEL[sprache][g]}
            </h2>
            <div>
              {liste.map((b) => (
                <details
                  key={b.id}
                  id={b.anker}
                  className="akkordeon"
                  onToggle={(ev) => {
                    if ((ev.currentTarget as HTMLDetailsElement).open) history.replaceState(null, "", `#${b.anker}`);
                  }}
                >
                  <summary>
                    <span>{b.titel}</span>
                    <span className="zeichen" aria-hidden="true">
                      <PlusIcon />
                    </span>
                  </summary>
                  <div className="inhalt">
                    <RichText inhalt={b.inhalt} />
                  </div>
                </details>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
