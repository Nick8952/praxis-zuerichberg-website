import type { Einstellungen, KontaktBaustein, Sprache, Texte } from "@/lib/content/types";
import { telefonInternational } from "@/lib/seo";
import { AdresseKopieren } from "./AdresseKopieren";
import { Anfrageformular } from "./Anfrageformular";
import { Karte } from "./Karte";
import { RichText } from "./RichText";
import { MailIcon, RouteIcon, TelefonIcon } from "./Icons";

/** Kontaktbereich: Adresse, Telefon, Fax, E-Mail, Öffnungszeiten (mit Herkunftshinweis), Anfahrt, Karte nach Einwilligung, Anfrage. */
export function Kontakt({ b, e, t, sprache }: { b: KontaktBaustein; e: Einstellungen; t: Texte; sprache: Sprache }) {
  const tel = telefonInternational(e.telefon);
  const adresseText = `${e.praxisname}, ${e.adresse.strasse}, ${e.adresse.plz} ${e.adresse.ort}`;
  const zeilen = e.oeffnungszeiten.filter((z) => z.tage[sprache]);
  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14">
      <div className="erscheinen">
        <dl className="divide-y divide-linie border-y border-linie">
          <div className="grid gap-1 py-5 sm:grid-cols-[7.5rem_1fr]">
            <dt className="etikett pt-1">{sprache === "de" ? "Adresse" : "Address"}</dt>
            <dd>
              <address className="not-italic">
                <span className="text-xl font-semibold text-aubergine">{e.praxisname}</span>
                <br />
                {e.inhaber}
                <br />
                {e.adresse.strasse}
                <br />
                {e.adresse.plz} {e.adresse.ort}
              </address>
              <div className="mt-3 flex flex-wrap gap-2">
                <a href={e.routenlink} target="_blank" rel="noopener noreferrer" className="knopf knopf-sekundaer min-h-11 py-2 text-[1rem]">
                  <RouteIcon />
                  {t.ui.routePlanen}
                </a>
                <AdresseKopieren adresse={adresseText} beschriftung={t.ui.adresseKopieren} kopiert={t.ui.kopiert} fehler={t.ui.kopierenFehler} />
              </div>
            </dd>
          </div>
          <div className="grid gap-1 py-5 sm:grid-cols-[7.5rem_1fr]">
            <dt className="etikett pt-1">{sprache === "de" ? "Telefon" : "Phone"}</dt>
            <dd>
              <a href={`tel:${tel}`} className="inline-flex min-h-11 items-center gap-2 text-2xl font-semibold text-aubergine hover:underline">
                <TelefonIcon />
                {e.telefon}
              </a>
              {e.fax && <p className="text-grau">Fax {e.fax}</p>}
            </dd>
          </div>
          <div className="grid gap-1 py-5 sm:grid-cols-[7.5rem_1fr]">
            <dt className="etikett pt-1">E-Mail</dt>
            <dd>
              <a href={`mailto:${e.email}`} className="inline-flex min-h-11 items-center gap-2 font-semibold text-aubergine underline-offset-4 hover:underline">
                <MailIcon />
                {e.email}
              </a>
            </dd>
          </div>
          <div className="grid gap-1 py-5 sm:grid-cols-[7.5rem_1fr]">
            <dt className="etikett pt-1">{sprache === "de" ? "Zeiten" : "Hours"}</dt>
            <dd>
              {zeilen.length ? (
                <>
                  <ul>
                    {zeilen.map((z) => (
                      <li key={z._key} className="flex flex-wrap gap-x-3">
                        <span className="font-semibold">{z.tage[sprache]}</span>
                        <span>{z.zeiten[sprache]}</span>
                      </li>
                    ))}
                  </ul>
                  {e.oeffnungszeitenHinweis?.[sprache] && <p className="mt-2 text-[0.95rem] text-grau">{e.oeffnungszeitenHinweis[sprache]}</p>}
                </>
              ) : (
                <p>{t.ui.zeitenErfragen}</p>
              )}
            </dd>
          </div>
        </dl>
        {b.anfahrt && (
          <div className="mt-8">
            <h3 className="text-display-md">{sprache === "de" ? "Anfahrt" : "How to find us"}</h3>
            <RichText inhalt={b.anfahrt} className="mt-3" />
          </div>
        )}
      </div>
      <div className="erscheinen grid gap-8">
        {b.mitKarte && <Karte einbettung={e.kartenEinbettung} routenlink={e.routenlink} adresse={`${e.adresse.strasse}, ${e.adresse.plz} ${e.adresse.ort}`} t={t.einwilligung} ui={t.ui} />}
        {b.mitFormular && <Anfrageformular email={e.email} praxisname={e.praxisname} t={t.formular} />}
      </div>
    </div>
  );
}
