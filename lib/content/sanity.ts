import "server-only";
import { defineQuery } from "next-sanity";
import { client, vorschauClient } from "@/sanity/client";
import { sanityPruefen } from "@/sanity/env";
import { BILD_PROJEKTION, sanityBild, type SanityBildRoh } from "@/sanity/bild";
import { istVorschau } from "@/lib/vorschau/status";
import type { Baustein, Behandlung, Download, Einstellungen, Inhaltsquelle, Rechtstext, Seite, SeitenVerweis, Teammitglied, Texte } from "./types";

/**
 * Sanity-Inhaltsquelle (für Vercel). Liefert exakt dieselben Typen wie lib/content/local.ts.
 *
 * Lokalisierte Dokumente tragen `sprache` und `uebersetzungsSchluessel`; Abfragen filtern
 * immer nach Sprache. Cache: veröffentlichte Inhalte mit Tag «inhalt», Invalidierung per
 * Webhook (server-routes/app/api/revalidate). Im Draft Mode ungecacht mit Perspektive «drafts».
 *
 * Status: VORBEREITET – erst nach Anlegen eines Sanity-Projekts überprüfbar.
 */
export const INHALT_TAG = "inhalt";

async function abfrage<T>(query: string, params: Record<string, unknown> = {}): Promise<T> {
  sanityPruefen();
  const vorschau = await istVorschau();
  const c = vorschau ? vorschauClient() : client();
  return c.fetch<T>(query, params, vorschau ? { cache: "no-store" } : { next: { revalidate: false, tags: [INHALT_TAG] } });
}

const LINK = `{ titel, ziel, extern }`;
const BEHANDLUNG = `{ "id": _id, sprache, uebersetzungsSchluessel, titel, "anker": anker.current, inhalt, gruppe, reihenfolge, quelle, pruefstatus, freigabedatum }`;
const TEAM = `{ "id": _id, sprache, uebersetzungsSchluessel, titelVor, vorname, nachname, funktion, sprachen, bild ${BILD_PROJEKTION}, lebenslaufEinleitung, lebenslauf, reihenfolge }`;
const DOWNLOAD = `{ "id": _id, sprache, uebersetzungsSchluessel, titel, "datei": datei.asset->url, "dateiname": coalesce(datei.asset->originalFilename, titel), "groesseKb": round(datei.asset->size / 1024), hinweis, dokumentSprache, reihenfolge }`;
const RECHTSTEXT = `{ "id": _id, sprache, uebersetzungsSchluessel, art, titel, stand, inhalt }`;

const BAUSTEINE = `bausteine[] {
  _key, _type, "anker": anker.current, kurzzeile, titel,
  _type == "textBaustein" => { inhalt, bild ${BILD_PROJEKTION}, bildPosition },
  _type == "hinweisBaustein" => { inhalt, art },
  _type == "behandlungenBaustein" => {
    einleitung, darstellung, weiterLink ${LINK},
    "behandlungen": select(
      coalesce(count(behandlungen), 0) > 0 => behandlungen[]-> ${BEHANDLUNG},
      *[_type == "behandlung" && sprache == ^.^.sprache] | order(reihenfolge asc) ${BEHANDLUNG}
    )
  },
  _type == "teamBaustein" => {
    einleitung, mitLebenslauf,
    "team": select(
      coalesce(count(team), 0) > 0 => team[]-> ${TEAM},
      *[_type == "teammitglied" && sprache == ^.^.sprache] | order(reihenfolge asc) ${TEAM}
    )
  },
  _type == "downloadsBaustein" => {
    einleitung,
    "downloads": select(
      coalesce(count(downloads), 0) > 0 => downloads[]-> ${DOWNLOAD},
      *[_type == "download" && sprache == ^.^.sprache] | order(reihenfolge asc) ${DOWNLOAD}
    )
  },
  _type == "galerieBaustein" => { einleitung, bilder[] ${BILD_PROJEKTION} },
  _type == "bildBaustein" => { text, bild ${BILD_PROJEKTION} },
  _type == "kontaktBaustein" => { einleitung, anfahrt, mitKarte, mitFormular },
  _type == "aufrufBaustein" => { text, knopf ${LINK}, zweiterKnopf ${LINK} },
  _type == "rechtstextBaustein" => { rechtstext-> ${RECHTSTEXT} }
}`;

const EINSTELLUNGEN_QUERY = defineQuery(`*[_type == "einstellungen"][0] {
  praxisname, inhaber, inhaberTitel, inhaberName, adresse, telefon, fax, email, routenlink, kartenEinbettung, geo,
  mitgliedschaft { titel, url, logo ${BILD_PROJEKTION} },
  logo ${BILD_PROJEKTION}, seoBild ${BILD_PROJEKTION},
  oeffnungszeiten[] { _key, tage, zeiten, wochentage, intervalle[] { _key, von, bis }, geschlossen },
  oeffnungszeitenHinweis
}`);

const TEXTE_QUERY = defineQuery(`*[_type == "texte" && sprache == $sprache][0] {
  sprache, navigation[] ${LINK}, rechtslinks[] ${LINK}, seo, demoHinweis, ui, einwilligung, formular
}`);

const SEITE_QUERY = defineQuery(`*[_type == "seite" && sprache == $sprache && slug.current == $slug][0] {
  "id": _id, sprache, uebersetzungsSchluessel, "slug": slug.current, titel, einleitung, seoTitel, seoBeschreibung,
  hero { kurzzeile, titel, text, knopf ${LINK}, zweiterKnopf ${LINK}, bild ${BILD_PROJEKTION} },
  ${BAUSTEINE}
}`);

type Roh = Record<string, unknown>;
const bildAus = (o: unknown, alt = "") => sanityBild(o as SanityBildRoh | undefined, alt);

function teamAufbereiten(t: Roh): Teammitglied {
  return { ...(t as object), sprachen: (t.sprachen as string[]) ?? [], bild: bildAus(t.bild, `${t.vorname} ${t.nachname}`) } as Teammitglied;
}
function bausteinAufbereiten(b: Roh): Baustein {
  switch (b._type) {
    case "textBaustein":
      return { ...(b as object), bild: bildAus(b.bild) } as Baustein;
    case "behandlungenBaustein":
      return { ...(b as object), behandlungen: ((b.behandlungen as Roh[]) ?? []).sort((x, y) => (x.reihenfolge as number) - (y.reihenfolge as number)) } as unknown as Baustein;
    case "teamBaustein":
      return { ...(b as object), team: ((b.team as Roh[]) ?? []).map(teamAufbereiten).sort((x, y) => x.reihenfolge - y.reihenfolge), mitLebenslauf: Boolean(b.mitLebenslauf) } as Baustein;
    case "downloadsBaustein":
      return { ...(b as object), downloads: ((b.downloads as Roh[]) ?? []).sort((x, y) => (x.reihenfolge as number) - (y.reihenfolge as number)) } as unknown as Baustein;
    case "galerieBaustein":
      return { ...(b as object), bilder: ((b.bilder as Roh[]) ?? []).map((x) => bildAus(x)).filter(Boolean) } as Baustein;
    case "bildBaustein": {
      const bild = bildAus(b.bild);
      if (!bild) throw new Error(`Sanity: bildBaustein ${b._key} ohne Bild.`);
      return { ...(b as object), bild } as Baustein;
    }
    case "kontaktBaustein":
      return { ...(b as object), mitKarte: Boolean(b.mitKarte), mitFormular: Boolean(b.mitFormular) } as Baustein;
    case "rechtstextBaustein":
      if (!b.rechtstext) throw new Error(`Sanity: rechtstextBaustein ${b._key} ohne Rechtstext.`);
      return b as unknown as Baustein;
    default:
      return b as unknown as Baustein;
  }
}

export const sanityQuelle: Inhaltsquelle = {
  async getEinstellungen() {
    const e = await abfrage<Roh | null>(EINSTELLUNGEN_QUERY);
    if (!e) throw new Error("Sanity: Dokument «einstellungen» fehlt – `npm run seed` ausführen.");
    const m = e.mitgliedschaft as Roh | undefined;
    return {
      ...(e as object),
      oeffnungszeiten: (e.oeffnungszeiten as Einstellungen["oeffnungszeiten"]) ?? [],
      logo: bildAus(e.logo, e.praxisname as string)!,
      seoBild: bildAus(e.seoBild),
      mitgliedschaft: m ? { ...(m as object), logo: bildAus(m.logo, m.titel as string) } : undefined,
    } as Einstellungen;
  },

  async getTexte(sprache) {
    const t = await abfrage<Roh | null>(TEXTE_QUERY, { sprache });
    if (!t) throw new Error(`Sanity: Dokument «texte» für Sprache ${sprache} fehlt.`);
    return { ...(t as object), navigation: (t.navigation as Texte["navigation"]) ?? [], rechtslinks: (t.rechtslinks as Texte["rechtslinks"]) ?? [] } as Texte;
  },

  async getSeite(sprache, slug) {
    const s = await abfrage<Roh | null>(SEITE_QUERY, { sprache, slug });
    if (!s) return null;
    const hero = s.hero as Roh | undefined;
    return {
      ...(s as object),
      hero: hero ? { ...(hero as object), bild: bildAus(hero.bild) } : undefined,
      bausteine: ((s.bausteine as Roh[]) ?? []).map(bausteinAufbereiten),
    } as Seite;
  },

  async getAlleSeiten() {
    return abfrage<SeitenVerweis[]>(`*[_type == "seite" && defined(slug.current)] { sprache, "slug": slug.current, uebersetzungsSchluessel }`);
  },

  async getBehandlungen(sprache) {
    return abfrage<Behandlung[]>(`*[_type == "behandlung" && sprache == $sprache] | order(reihenfolge asc) ${BEHANDLUNG}`, { sprache });
  },

  async getTeam(sprache) {
    return (await abfrage<Roh[]>(`*[_type == "teammitglied" && sprache == $sprache] | order(reihenfolge asc) ${TEAM}`, { sprache })).map(teamAufbereiten);
  },

  async getDownloads(sprache) {
    return abfrage<Download[]>(`*[_type == "download" && sprache == $sprache] | order(reihenfolge asc) ${DOWNLOAD}`, { sprache });
  },

  async getRechtstext(sprache, art) {
    return abfrage<Rechtstext | null>(`*[_type == "rechtstext" && sprache == $sprache && art == $art][0] ${RECHTSTEXT}`, { sprache, art });
  },
};
