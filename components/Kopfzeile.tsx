import Link from "next/link";
import type { Einstellungen, Sprache, Texte } from "@/lib/content/types";
import { telefonInternational } from "@/lib/seo";
import { Logo } from "./Logo";
import { MobilMenue } from "./MobilMenue";
import { Sprachwechsel } from "./Sprachwechsel";
import { TelefonIcon } from "./Icons";

interface Props {
  e: Einstellungen;
  t: Texte;
  sprache: Sprache;
  /** Pfad der Entsprechung in der anderen Sprache (falls vorhanden) */
  sprachZiel?: string;
  aktuellerPfad: string;
}

export function Kopfzeile({ e, t, sprache, sprachZiel, aktuellerPfad }: Props) {
  const tel = telefonInternational(e.telefon);
  return (
    <header className="sticky top-0 z-40 border-b border-linie bg-weiss/95 backdrop-blur-sm">
      <a href="#inhalt" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded focus:bg-aubergine focus:px-3 focus:py-2 focus:text-weiss">
        {t.ui.zumInhalt}
      </a>
      <div className="container-seite flex h-[4.25rem] items-center justify-between gap-4 md:h-20">
        <Logo logo={e.logo} praxisname={e.praxisname} href={`/${sprache}/`} startseite={t.ui.startseite} />
        <nav aria-label={t.ui.menueOeffnen} className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {t.navigation.map((l) => {
              const aktiv = aktuellerPfad.startsWith(l.ziel);
              return (
                <li key={l.ziel}>
                  <Link
                    href={l.ziel}
                    className={`inline-flex min-h-11 items-center rounded-[6px] px-3 font-semibold text-aubergine transition-colors hover:bg-aubergine-hell ${aktiv ? "shadow-[inset_0_-3px_0_0_var(--color-lime)]" : ""}`}
                    aria-current={aktiv ? "page" : undefined}
                  >
                    {l.titel}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="flex items-center gap-2">
          <Sprachwechsel sprache={sprache} ziel={sprachZiel} beschriftung={t.ui.sprache} startseite={t.ui.startseite} fehltText={t.ui.sprachwechselFehlt} className="hidden lg:inline-flex" />
          <a href={`tel:${tel}`} className="knopf knopf-primaer hidden min-h-11 py-2 sm:inline-flex" aria-label={`${t.ui.anrufen}: ${e.telefon}`}>
            <TelefonIcon />
            <span>{e.telefon}</span>
          </a>
          <a href={`tel:${tel}`} className="knopf knopf-primaer min-h-11 w-11 px-0 sm:hidden" aria-label={`${t.ui.anrufen}: ${e.telefon}`}>
            <TelefonIcon />
          </a>
          <MobilMenue sprache={sprache} t={t} telefon={e.telefon} tel={tel} praxisname={e.praxisname} sprachZiel={sprachZiel} />
        </div>
      </div>
    </header>
  );
}
