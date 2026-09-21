import type { Teammitglied, Texte } from "@/lib/content/types";
import { Bild } from "./Bild";
import { RichText } from "./RichText";
import { PlusIcon } from "./Icons";

/** Teamkarten mit Portrait, Titel, Funktion, Sprachen; Lebensläufe optional aufklappbar (details/summary). */
export function Team({ team, mitLebenslauf, t }: { team: Teammitglied[]; mitLebenslauf: boolean; t: Texte }) {
  return (
    <ul className="grid gap-8 md:grid-cols-2 xl:grid-cols-3" role="list">
      {team.map((p) => {
        const name = [p.titelVor, p.vorname, p.nachname].filter(Boolean).join(" ");
        return (
          <li key={p.id} className="erscheinen flex flex-col overflow-hidden rounded-[12px] border border-linie bg-weiss">
            {p.bild && (
              // overflow-hidden: sonst dehnt ein fast quadratisches Bild (Friedl 365×341) den 4:3-Rahmen
              <div className="aspect-[4/3] w-full overflow-hidden bg-nebel">
                <Bild bild={p.bild} sizes="(min-width: 80rem) 24rem, (min-width: 48rem) 45vw, 100vw" className="h-full w-full object-cover object-top" />
              </div>
            )}
            <div className="flex flex-1 flex-col p-6">
              <h3 className="text-display-md">{name}</h3>
              <p className="mt-1 text-lead text-grau">{p.funktion}</p>
              {p.sprachen.length > 0 && (
                <p className="mt-3 text-grau">
                  <span className="font-semibold text-tinte">{t.ui.sprachen}:</span> {p.sprachen.join(", ")}
                </p>
              )}
              {mitLebenslauf && (p.lebenslauf?.length || p.lebenslaufEinleitung) && (
                <details className="akkordeon mt-5">
                  <summary>
                    <span>{t.ui.lebenslauf}</span>
                    <span className="zeichen" aria-hidden="true">
                      <PlusIcon />
                    </span>
                  </summary>
                  <div className="inhalt">
                    {p.lebenslaufEinleitung && <p className="mb-4 text-grau">{p.lebenslaufEinleitung}</p>}
                    {p.lebenslauf && <RichText inhalt={p.lebenslauf} className="text-[1rem]" />}
                  </div>
                </details>
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
