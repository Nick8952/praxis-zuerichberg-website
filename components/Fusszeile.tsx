import Link from "next/link";
import type { Einstellungen, Sprache, Texte } from "@/lib/content/types";
import { telefonInternational } from "@/lib/seo";
import { Bild } from "./Bild";
import { Horizont } from "./Horizont";
import { Widerruf } from "./Widerruf";
import { MailIcon, RouteIcon, TelefonIcon } from "./Icons";

/** Seitenfuss: Horizontlinie, Praxisadresse mit allen Kontaktwegen, Navigation, Rechtslinks, Datenschutz-Einstellungen. */
export function Fusszeile({ e, t, sprache }: { e: Einstellungen; t: Texte; sprache: Sprache }) {
  const tel = telefonInternational(e.telefon);
  const einstellungenPfad = sprache === "de" ? "/de/datenschutz-einstellungen/" : "/en/privacy-settings/";
  return (
    <footer className="mt-auto">
      <Horizont className="text-lime" />
      <div className="bg-aubergine text-weiss auf-dunkel">
        <div className="container-seite grid gap-10 py-12 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] md:py-16">
          <div>
            <p className="text-2xl font-semibold">{e.praxisname}</p>
            <address className="mt-3 not-italic leading-relaxed text-weiss">
              {e.inhaber}
              <br />
              {e.adresse.strasse}, {e.adresse.plz} {e.adresse.ort}
            </address>
            <div className="mt-5 flex flex-wrap gap-3">
              <a href={`tel:${tel}`} className="knopf knopf-hell">
                <TelefonIcon />
                {e.telefon}
              </a>
              <a href={`mailto:${e.email}`} className="knopf knopf-umriss-hell">
                <MailIcon />
                {t.ui.emailSchreiben}
              </a>
              <a href={e.routenlink} target="_blank" rel="noopener noreferrer" className="knopf knopf-umriss-hell">
                <RouteIcon />
                {t.ui.routePlanen}
              </a>
            </div>
            {e.mitgliedschaft?.logo && (
              <p className="mt-6 inline-flex items-center gap-3 rounded-[6px] bg-weiss px-3 py-2">
                <Bild bild={e.mitgliedschaft.logo} sizes="125px" className="h-auto w-[125px]" />
              </p>
            )}
          </div>
          <nav aria-label={t.ui.startseite} className="md:justify-self-end">
            <ul className="grid gap-1 sm:grid-cols-2 md:grid-cols-1">
              {[{ titel: t.ui.startseite, ziel: `/${sprache}/` }, ...t.navigation].map((l) => (
                <li key={l.ziel}>
                  <Link href={l.ziel} className="inline-flex min-h-11 min-w-11 items-center underline-offset-4 hover:underline">
                    {l.titel}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="border-t border-white/15">
          <div className="container-seite flex flex-col gap-3 py-5 md:flex-row md:items-center md:justify-between">
            <ul className="flex flex-wrap gap-x-6 gap-y-1 text-[0.95rem]">
              {t.rechtslinks.map((l) => (
                <li key={l.ziel}>
                  <Link href={l.ziel} className="inline-flex min-h-11 min-w-11 items-center underline-offset-4 hover:underline">
                    {l.titel}
                  </Link>
                </li>
              ))}
              <li>
                <Link href={einstellungenPfad} className="inline-flex min-h-11 min-w-11 items-center underline-offset-4 hover:underline">
                  {t.ui.datenschutzEinstellungen}
                </Link>
              </li>
              <li>
                <Widerruf t={t.einwilligung} />
              </li>
            </ul>
            {t.demoHinweis && <p className="text-[0.9rem] text-weiss/80">{t.demoHinweis}</p>}
          </div>
        </div>
      </div>
    </footer>
  );
}
