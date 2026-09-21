import type { Metadata } from "next";
import { stegaClean } from "@sanity/client/stega";
import { SPRACH_CODE, seitenPfad, type Einstellungen, type Seite, type SeitenVerweis, type Sprache, type Teammitglied, type Texte } from "./content/types";
import { siteUrl } from "./deploy-ziel";

/** Indexierung nur, wenn ausdrücklich freigegeben (nach Go-Live auf der Kundendomain). */
export const indexierungErlaubt = process.env.INDEXIERUNG === "1";

/** Entfernt Stega-Markierungen (Visual Editing) aus Strings, bevor sie in Metadaten/JSON-LD landen. */
const sauber = (s: string | undefined) => (s ? stegaClean(s) : undefined);

/** Sprachversionen derselben Seite (über den Übersetzungsschlüssel), für hreflang und Sprachwechsel. */
export function sprachversionen(seite: Pick<Seite, "uebersetzungsSchluessel">, alle: SeitenVerweis[]): Partial<Record<Sprache, string>> {
  const ergebnis: Partial<Record<Sprache, string>> = {};
  for (const s of alle) if (s.uebersetzungsSchluessel === seite.uebersetzungsSchluessel) ergebnis[s.sprache] = seitenPfad(s.sprache, s.slug);
  return ergebnis;
}

export function seitenMetadata(seite: Seite, e: Einstellungen, t: Texte, alle: SeitenVerweis[]): Metadata {
  const titel = sauber(seite.seoTitel) ?? sauber(seite.titel) ?? "";
  const beschreibung = sauber(seite.seoBeschreibung) ?? sauber(t.seo.beschreibung);
  const pfad = seitenPfad(seite.sprache, seite.slug);
  const versionen = sprachversionen(seite, alle);
  const languages: Record<string, string> = {};
  for (const [sp, p] of Object.entries(versionen)) languages[SPRACH_CODE[sp as Sprache]] = `${siteUrl}${p}`;
  // x-default: deutsche Fassung, sonst (Seite nur auf Englisch) die kanonische URL der Seite selbst
  languages["x-default"] = `${siteUrl}${versionen.de ?? pfad}`;
  const bild = seite.hero?.bild ?? e.seoBild;
  const bildUrl = bild ? bild.quellen[bild.quellen.length - 1]?.url : undefined;
  return {
    title: seite.slug === "start" ? `${sauber(e.praxisname)} – ${titel}` : titel,
    description: beschreibung,
    alternates: { canonical: `${siteUrl}${pfad}`, languages },
    openGraph: {
      title: `${titel} | ${sauber(t.seo.titelZusatz)}`,
      description: beschreibung,
      url: `${siteUrl}${pfad}`,
      siteName: sauber(e.praxisname),
      locale: seite.sprache === "de" ? "de_CH" : "en_GB",
      type: "website",
      images: bildUrl ? [{ url: bildUrl.startsWith("http") ? bildUrl : `${siteUrl}${bildUrl}`, width: bild?.breite, height: bild?.hoehe, alt: sauber(bild?.alt) }] : undefined,
    },
    robots: indexierungErlaubt ? { index: true, follow: true } : { index: false, follow: false },
  };
}

const SCHEMA_WOCHENTAG: Record<string, string> = {
  Montag: "https://schema.org/Monday",
  Dienstag: "https://schema.org/Tuesday",
  Mittwoch: "https://schema.org/Wednesday",
  Donnerstag: "https://schema.org/Thursday",
  Freitag: "https://schema.org/Friday",
  Samstag: "https://schema.org/Saturday",
  Sonntag: "https://schema.org/Sunday",
};

/**
 * Strukturierte Daten «Dentist» – ausschliesslich belegte Angaben (Name, Adresse, Telefon, E-Mail, Team, SSO).
 * Öffnungszeiten nur, wenn sie von der Praxis bestätigt sind (kein `oeffnungszeitenHinweis` mehr) – unbestätigte
 * Google-Zeiten bleiben sichtbar mit Herkunftshinweis, gelangen aber nicht ins JSON-LD (Codex-Befund).
 * Kein `founder`: PD Dr. Bindl hat die Praxis 2007 übernommen, gegründet wurde die Station 1992 (Prof. Mörmann);
 * er erscheint als `employee` mit Funktion. Keine Bewertungen, keine Preise, keine erfundenen Fachbezeichnungen.
 */
export function praxisJsonLd(e: Einstellungen, sprache: Sprache, team: Teammitglied[] = []): Record<string, unknown> {
  const bestaetigt = !e.oeffnungszeitenHinweis || (!e.oeffnungszeitenHinweis.de && !e.oeffnungszeitenHinweis.en);
  const zeiten = (bestaetigt ? e.oeffnungszeiten : [])
    .filter((z) => !z.geschlossen && z.wochentage?.length && z.intervalle?.length)
    .flatMap((z) => z.intervalle!.map((i) => ({ "@type": "OpeningHoursSpecification", dayOfWeek: z.wochentage!.map((w) => SCHEMA_WOCHENTAG[w]).filter(Boolean), opens: i.von, closes: i.bis })));
  return {
    "@context": "https://schema.org",
    "@type": "Dentist",
    "@id": `${siteUrl}/${sprache}/#praxis`,
    name: sauber(e.praxisname),
    url: `${siteUrl}/${sprache}/`,
    telephone: telefonInternational(e.telefon),
    faxNumber: e.fax ? telefonInternational(e.fax) : undefined,
    email: sauber(e.email),
    image: e.seoBild ? `${siteUrl}${e.seoBild.quellen[e.seoBild.quellen.length - 1].url}` : undefined,
    address: { "@type": "PostalAddress", streetAddress: sauber(e.adresse.strasse), postalCode: sauber(e.adresse.plz), addressLocality: sauber(e.adresse.ort), addressCountry: "CH" },
    geo: e.geo ? { "@type": "GeoCoordinates", latitude: e.geo.breite, longitude: e.geo.laenge } : undefined,
    openingHoursSpecification: zeiten.length ? zeiten : undefined,
    employee: team.length
      ? team.map((p) => ({ "@type": "Person", name: [p.titelVor, p.vorname, p.nachname].filter(Boolean).map(sauber).join(" "), honorificPrefix: sauber(p.titelVor), givenName: sauber(p.vorname), familyName: sauber(p.nachname), jobTitle: sauber(p.funktion), knowsLanguage: p.sprachen.map(sauber) }))
      : undefined,
    memberOf: e.mitgliedschaft ? { "@type": "Organization", name: sauber(e.mitgliedschaft.titel), url: e.mitgliedschaft.url } : undefined,
    inLanguage: SPRACH_CODE[sprache],
  };
}

/** «044 261 33 30», «+41 44 …», «0041 44 …» → «+41442613330» (E.164). */
export function telefonInternational(tel: string): string {
  const ziffern = tel.replace(/\D/g, "");
  if (ziffern.startsWith("00")) return `+${ziffern.slice(2)}`;
  if (ziffern.startsWith("0")) return `+41${ziffern.slice(1)}`;
  return `+${ziffern}`;
}

/** JSON-LD sicher in ein <script> einbetten: «<» wird escaped, damit kein HTML entsteht. */
export function jsonLdSicher(daten: unknown): string {
  return JSON.stringify(daten).replace(/</g, "\\u003c");
}
