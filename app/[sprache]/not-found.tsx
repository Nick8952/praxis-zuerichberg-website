import Link from "next/link";
import { inhaltsquelle } from "@/lib/content";
import { SPRACHEN } from "@/lib/content/types";
import { telefonInternational } from "@/lib/seo";
import { Kopfzeile } from "@/components/Kopfzeile";
import { PfeilIcon, TelefonIcon } from "@/components/Icons";

/**
 * 404 innerhalb einer Sprache (z. B. /de/gibtsnicht/ im Vercel-Modus). Ohne Zugriff auf die URL-Parameter
 * im not-found: zweisprachig, mit den Navigationen beider Sprachen. Der statische Export nutzt
 * app/global-not-found.tsx als out/404.html.
 */
export default async function NichtGefunden() {
  const q = await inhaltsquelle();
  const e = await q.getEinstellungen();
  const texte = await Promise.all(SPRACHEN.map((s) => q.getTexte(s)));
  const t = texte[0];
  return (
    <>
      <Kopfzeile e={e} t={t} sprache="de" aktuellerPfad="/de/404/" />
      <main id="inhalt" className="flex-1">
        <section className="container-seite py-abschnitt">
          <div className="mx-auto max-w-2xl rounded-[12px] border border-linie bg-weiss p-6 sm:p-10">
            {texte.map((tx) => (
              <div key={tx.sprache} lang={tx.sprache === "de" ? "de-CH" : "en"} className="mb-8 last:mb-0">
                <p className="etikett">404</p>
                <h1 className="mt-2 text-display-lg">{tx.ui.nichtGefundenTitel}</h1>
                <p className="mt-3 text-grau">{tx.ui.nichtGefundenText}</p>
                <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-1">
                  {[{ titel: tx.ui.startseite, ziel: `/${tx.sprache}/` }, ...tx.navigation].map((l) => (
                    <li key={l.ziel}>
                      <Link href={l.ziel} className="inline-flex min-h-11 items-center gap-1 font-semibold text-aubergine underline-offset-4 hover:underline">
                        {l.titel}
                        <PfeilIcon />
                      </Link>
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
    </>
  );
}
