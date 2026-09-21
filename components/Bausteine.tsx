import type { Baustein, Einstellungen, Sprache, Texte } from "@/lib/content/types";
import { Abschnitt } from "./Abschnitt";
import { Behandlungen } from "./Behandlungen";
import { Bild } from "./Bild";
import { Downloads } from "./Downloads";
import { Einwilligungseinstellungen } from "./Einwilligung";
import { Galerie } from "./Galerie";
import { Kontakt } from "./Kontakt";
import { RichText } from "./RichText";
import { SmartLink } from "./SmartLink";
import { Team } from "./Team";
import { MailIcon, PfeilIcon, TelefonIcon } from "./Icons";

interface Props {
  bausteine: Baustein[];
  e: Einstellungen;
  t: Texte;
  sprache: Sprache;
  /** Slug der Seite (für Sonderfälle wie die Einstellungsseite) */
  slug: string;
}

/** Rendert die Bausteinliste einer Seite. Neuer Baustein: Typ in lib/content/types.ts, Schema in sanity/schemas/bausteine, Fall hier, Prüfung in scripts/inhalt-pruefen.mts. */
export function Bausteine({ bausteine, e, t, sprache, slug }: Props) {
  const knopfIcon = (ziel: string) => (ziel.startsWith("tel:") ? <TelefonIcon /> : ziel.startsWith("mailto:") ? <MailIcon /> : <PfeilIcon />);
  return (
    <>
      {bausteine.map((b, i) => {
        const grund = i % 2 === 1 ? "nebel" : "weiss";
        switch (b._type) {
          case "textBaustein":
            return (
              <Abschnitt key={b._key} id={b.anker} kurzzeile={b.kurzzeile} grund={grund}>
                <div className={`grid gap-8 ${b.bild ? "lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-14" : ""}`}>
                  <div className={`erscheinen ${b.bild && b.bildPosition === "links" ? "lg:order-2" : ""}`}>
                    {b.titel && <h2 className="text-display-lg mb-6 max-w-[24ch]">{b.titel}</h2>}
                    <RichText inhalt={b.inhalt} />
                  </div>
                  {b.bild && (
                    <figure className={`erscheinen self-start overflow-hidden rounded-[12px] bg-nebel ${b.bildPosition === "links" ? "lg:order-1" : ""}`}>
                      <Bild bild={b.bild} sizes="(min-width: 64rem) 28rem, 100vw" className="h-auto w-full" />
                      {b.bild.bildunterschrift && <figcaption className="px-3 py-2 text-[0.95rem] text-grau">{b.bild.bildunterschrift}</figcaption>}
                    </figure>
                  )}
                </div>
              </Abschnitt>
            );
          case "hinweisBaustein":
            return (
              <section key={b._key} id={b.anker} className={`py-8 ${grund === "nebel" ? "bg-nebel" : "bg-weiss"}`}>
                <div className="container-seite">
                  <div className={`erscheinen max-w-3xl rounded-[12px] border-l-4 p-6 ${b.art === "wichtig" ? "border-aubergine bg-aubergine-hell" : "border-lime bg-nebel"}`}>
                    {b.titel && <h2 className="text-lg">{b.titel}</h2>}
                    <RichText inhalt={b.inhalt} className="mt-2 text-[1rem]" />
                  </div>
                </div>
              </section>
            );
          case "behandlungenBaustein":
            return (
              <Abschnitt key={b._key} id={b.anker} kurzzeile={b.kurzzeile} titel={b.titel} einleitung={b.einleitung} grund={grund}>
                <Behandlungen behandlungen={b.behandlungen} darstellung={b.darstellung} weiterLink={b.weiterLink} sprache={sprache} t={t} />
              </Abschnitt>
            );
          case "teamBaustein":
            return (
              <Abschnitt key={b._key} id={b.anker} kurzzeile={b.kurzzeile} titel={b.titel} einleitung={b.einleitung} grund={grund}>
                <Team team={b.team} mitLebenslauf={b.mitLebenslauf} t={t} />
              </Abschnitt>
            );
          case "downloadsBaustein":
            return (
              <Abschnitt key={b._key} id={b.anker} kurzzeile={b.kurzzeile} titel={b.titel} einleitung={b.einleitung} grund={grund} breite="schmal">
                <Downloads downloads={b.downloads} t={t} />
              </Abschnitt>
            );
          case "galerieBaustein":
            return (
              <Abschnitt key={b._key} id={b.anker} kurzzeile={b.kurzzeile} titel={b.titel} einleitung={b.einleitung} grund={grund}>
                <Galerie bilder={b.bilder} />
              </Abschnitt>
            );
          case "bildBaustein":
            return (
              <Abschnitt key={b._key} id={b.anker} kurzzeile={b.kurzzeile} titel={b.titel} grund={grund}>
                <figure className="erscheinen grid gap-6 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] md:items-end">
                  <div className="overflow-hidden rounded-[12px] bg-nebel">
                    <Bild bild={b.bild} sizes="(min-width: 48rem) 40rem, 100vw" className="h-auto w-full" />
                  </div>
                  <figcaption>
                    {b.text && <p className="text-lead">{b.text}</p>}
                    {b.bild.bildunterschrift && <p className="mt-3 text-[0.95rem] text-grau">{b.bild.bildunterschrift}</p>}
                  </figcaption>
                </figure>
              </Abschnitt>
            );
          case "kontaktBaustein":
            return (
              <Abschnitt key={b._key} id={b.anker} kurzzeile={b.kurzzeile} titel={b.titel} einleitung={b.einleitung} grund={grund}>
                <Kontakt b={b} e={e} t={t} sprache={sprache} />
              </Abschnitt>
            );
          case "aufrufBaustein":
            return (
              <Abschnitt key={b._key} id={b.anker} grund={grund}>
                <div className="erscheinen grid gap-6 rounded-[12px] bg-aubergine-hell p-6 sm:p-10 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
                  <div>
                    {b.kurzzeile && <p className="etikett mb-2">{b.kurzzeile}</p>}
                    {b.titel && <h2 className="text-display-md max-w-[26ch]">{b.titel}</h2>}
                    {b.text && <p className="mt-3 max-w-[40rem] text-grau">{b.text}</p>}
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <SmartLink href={b.knopf.ziel} extern={b.knopf.extern} className="knopf knopf-primaer">
                      {knopfIcon(b.knopf.ziel)}
                      {b.knopf.titel}
                    </SmartLink>
                    {b.zweiterKnopf && (
                      <SmartLink href={b.zweiterKnopf.ziel} extern={b.zweiterKnopf.extern} className="knopf knopf-sekundaer">
                        {b.zweiterKnopf.ziel.startsWith("mailto:") && <MailIcon />}
                        {b.zweiterKnopf.titel}
                      </SmartLink>
                    )}
                  </div>
                </div>
              </Abschnitt>
            );
          case "rechtstextBaustein":
            return (
              <Abschnitt key={b._key} grund="weiss" breite="schmal">
                {b.rechtstext.stand && (
                  <p className="etikett mb-6">
                    {sprache === "de" ? "Stand" : "Last updated"} {new Date(b.rechtstext.stand).toLocaleDateString(sprache === "de" ? "de-CH" : "en-GB", { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                )}
                <RichText inhalt={b.rechtstext.inhalt} />
              </Abschnitt>
            );
          default:
            return null;
        }
      })}
      {(slug === "datenschutz-einstellungen" || slug === "privacy-settings") && (
        <Abschnitt grund="nebel" breite="schmal" titel={t.ui.datenschutzEinstellungen}>
          <Einwilligungseinstellungen sprache={sprache} t={t.einwilligung} eingebettet />
        </Abschnitt>
      )}
    </>
  );
}
