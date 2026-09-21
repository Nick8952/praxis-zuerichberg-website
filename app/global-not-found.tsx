import type { Metadata } from "next";
import "./globals.css";
import { inhaltsquelle } from "@/lib/content";
import { SPRACHEN, type Sprache } from "@/lib/content/types";
import { assetUrl } from "@/lib/assets";
import { telefonInternational } from "@/lib/seo";
import { Horizont } from "@/components/Horizont";
import { TelefonIcon } from "@/components/Icons";

/**
 * Globale 404 (wird als out/404.html exportiert; GitHub Pages liefert sie für jede unbekannte URL).
 * Läuft ausserhalb des Sprach-Layouts, deshalb eigenes <html> und zweisprachig. Keine Kopfzeile
 * (kein Sprachkontext), aber vollständige Einstiege in beide Sprachen und die Telefonnummer.
 */
export const metadata: Metadata = { title: "404", robots: { index: false, follow: false } };

export default async function GlobalNichtGefunden() {
  const q = await inhaltsquelle();
  const e = await q.getEinstellungen();
  const texte = await Promise.all(SPRACHEN.map((s: Sprache) => q.getTexte(s)));
  const logo = e.logo.quellen[e.logo.quellen.length - 1];
  return (
    <html lang="de-CH" className="h-full">
      <body className="flex min-h-full flex-col">
        <header className="border-b border-linie bg-weiss">
          <div className="container-seite flex h-[4.25rem] items-center md:h-20">
            {/* eslint-disable-next-line @next/next/no-img-element -- statischer Export */}
            <img src={assetUrl(logo.url)} width={e.logo.breite} height={e.logo.hoehe} alt={e.logo.alt} className="h-auto w-[176px] sm:w-[200px]" />
          </div>
        </header>
        <main id="inhalt" className="flex-1 bg-nebel">
          <section className="container-seite py-abschnitt">
            <div className="mx-auto max-w-2xl rounded-[12px] border border-linie bg-weiss p-6 sm:p-10">
              {/* Genau eine h1 (unsichtbar, beide Sprachen); je Sprache ein h2-Block */}
              <h1 className="sr-only">{texte.map((t) => t.ui.nichtGefundenTitel).join(" / ")}</h1>
              {texte.map((t) => (
                <div key={t.sprache} lang={t.sprache === "de" ? "de-CH" : "en"} className="mb-8 last:mb-0">
                  <p className="etikett">404</p>
                  <h2 className="mt-2 text-display-lg">{t.ui.nichtGefundenTitel}</h2>
                  <p className="mt-3 text-grau">{t.ui.nichtGefundenText}</p>
                  <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-1">
                    {[{ titel: t.ui.startseite, ziel: `/${t.sprache}/` }, ...t.navigation].map((l) => (
                      <li key={l.ziel}>
                        <a href={assetUrl(l.ziel)} className="inline-flex min-h-11 min-w-11 items-center font-semibold text-aubergine underline-offset-4 hover:underline">
                          {l.titel}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              <a href={`tel:${telefonInternational(e.telefon)}`} className="knopf knopf-primaer mt-2">
                <TelefonIcon />
                {e.telefon}
              </a>
            </div>
          </section>
        </main>
        <Horizont className="text-lime" />
      </body>
    </html>
  );
}
