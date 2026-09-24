import "server-only";
import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";
import type {
  Baustein,
  Behandlung,
  Bild,
  Download,
  Einstellungen,
  Inhaltsquelle,
  Rechtstext,
  Seite,
  SeitenVerweis,
  Sprache,
  Teammitglied,
  Texte,
} from "./types";
import { SPRACHEN } from "./types";
import { deployZiel } from "../deploy-ziel";

/**
 * Lokale Inhaltsquelle: liest die JSON-Dateien in data/.
 *
 * Aufbau (spiegelt die Sanity-Dokumente, gleiche Feldnamen, Rich Text als Portable Text):
 *   data/einstellungen.json          nicht lokalisierte Praxisdaten
 *   data/bilder.json                 von `npm run bilder` erzeugt
 *   data/<sprache>/texte.json        Navigation, Footer, Bedienelemente, Einwilligung
 *   data/<sprache>/seiten/<slug>.json
 *   data/<sprache>/behandlungen.json, team.json, downloads.json
 *   data/<sprache>/rechtstexte/<art>.json
 * Bilder werden per Kennung referenziert (`{ "bild": "team-bindl", "alt": "…" }`).
 * Downloads liegen unter public/downloads/ und werden hier auf Existenz/Grösse geprüft.
 */

const DATA = path.resolve(process.cwd(), "data");
const PUBLIC = path.resolve(process.cwd(), "public");

interface BildEintrag {
  id: string;
  breite: number;
  hoehe: number;
  quellen: { breite: number; url: string }[];
}
interface BildReferenz {
  bild: string;
  alt: string;
  bildunterschrift?: string;
}

async function json<T>(datei: string): Promise<T> {
  const text = await readFile(path.join(DATA, datei), "utf8");
  return JSON.parse(text) as T;
}
/** Nur «Datei fehlt» ist ein erwarteter Fall; kaputtes JSON soll den Build laut abbrechen. */
const fehltNur = (err: unknown) => (err as NodeJS.ErrnoException)?.code === "ENOENT";

let bilderCache: Record<string, BildEintrag> | undefined;
async function bilder(): Promise<Record<string, BildEintrag>> {
  bilderCache ??= await json<Record<string, BildEintrag>>("bilder.json");
  return bilderCache;
}

async function bild(ref: BildReferenz | undefined, kontext: string): Promise<Bild | undefined> {
  if (!ref) return undefined;
  const eintrag = (await bilder())[ref.bild];
  if (!eintrag) throw new Error(`Bild «${ref.bild}» (${kontext}) fehlt in data/bilder.json – \`npm run bilder\` ausführen?`);
  if (typeof ref.alt !== "string") throw new Error(`Bild «${ref.bild}» (${kontext}) hat keinen Alt-Text.`);
  return { id: eintrag.id, alt: ref.alt, breite: eintrag.breite, hoehe: eintrag.hoehe, bildunterschrift: ref.bildunterschrift, quellen: eintrag.quellen };
}
async function bildPflicht(ref: BildReferenz, kontext: string): Promise<Bild> {
  const b = await bild(ref, kontext);
  if (!b) throw new Error(`Pflichtbild fehlt: ${kontext}`);
  return b;
}

/* ---------- Rohformen der JSON-Dateien ---------- */
type RohEinstellungen = Omit<Einstellungen, "logo" | "seoBild" | "mitgliedschaft"> & {
  logo: BildReferenz;
  seoBild?: BildReferenz;
  mitgliedschaft?: Omit<NonNullable<Einstellungen["mitgliedschaft"]>, "logo"> & { logo?: BildReferenz };
};
type RohTeammitglied = Omit<Teammitglied, "bild"> & { bild?: BildReferenz };
type RohDownload = Omit<Download, "groesseKb"> & { groesseKb?: number };
type RohBaustein =
  | (Omit<Extract<Baustein, { _type: "textBaustein" }>, "bild"> & { bild?: BildReferenz })
  | (Omit<Extract<Baustein, { _type: "behandlungenBaustein" }>, "behandlungen"> & { behandlungen?: string[] })
  | (Omit<Extract<Baustein, { _type: "teamBaustein" }>, "team"> & { team?: string[] })
  | (Omit<Extract<Baustein, { _type: "downloadsBaustein" }>, "downloads"> & { downloads?: string[] })
  | (Omit<Extract<Baustein, { _type: "galerieBaustein" }>, "bilder"> & { bilder: BildReferenz[] })
  | (Omit<Extract<Baustein, { _type: "bildBaustein" }>, "bild"> & { bild: BildReferenz })
  | (Omit<Extract<Baustein, { _type: "rechtstextBaustein" }>, "rechtstext"> & { rechtstext: Rechtstext["art"] })
  | Extract<Baustein, { _type: "hinweisBaustein" | "kontaktBaustein" | "aufrufBaustein" }>;
type RohSeite = Omit<Seite, "bausteine" | "hero"> & {
  hero?: Omit<NonNullable<Seite["hero"]>, "bild"> & { bild?: BildReferenz };
  bausteine: RohBaustein[];
};

async function behandlungen(sprache: Sprache): Promise<Behandlung[]> {
  const liste = await json<Behandlung[]>(`${sprache}/behandlungen.json`);
  return [...liste].sort((a, b) => a.reihenfolge - b.reihenfolge);
}

async function team(sprache: Sprache): Promise<Teammitglied[]> {
  const liste = await json<RohTeammitglied[]>(`${sprache}/team.json`);
  const fertig = await Promise.all(liste.map(async (t) => ({ ...t, bild: await bild(t.bild, `Team ${t.id}`) })));
  return fertig.sort((a, b) => a.reihenfolge - b.reihenfolge);
}

async function downloads(sprache: Sprache): Promise<Download[]> {
  const liste = await json<RohDownload[]>(`${sprache}/downloads.json`);
  const fertig = await Promise.all(
    liste.map(async (d) => {
      const datei = path.join(PUBLIC, d.datei);
      let groesseKb = d.groesseKb;
      try {
        groesseKb ??= Math.round((await stat(datei)).size / 1024);
      } catch {
        throw new Error(`Download «${d.id}»: Datei public${d.datei} fehlt.`);
      }
      return { ...d, groesseKb };
    }),
  );
  return fertig.sort((a, b) => a.reihenfolge - b.reihenfolge);
}

/**
 * Rechtstexte dürfen Blöcke mit `nurBetrieb: "pages" | "vercel"` enthalten (z. B. Hosting-Absatz der Datenschutzerklärung):
 * Es erscheint nur der Block der aktuellen Betriebsart – die Vercel-Fassung darf nicht «GitHub Pages» nennen und umgekehrt.
 */
function nachBetrieb(inhalt: Rechtstext["inhalt"]): Rechtstext["inhalt"] {
  return inhalt
    .filter((b) => {
      const nur = (b as { nurBetrieb?: string }).nurBetrieb;
      return !nur || nur === deployZiel;
    })
    .map((b) => {
      const { nurBetrieb: _weg, ...rest } = b as typeof b & { nurBetrieb?: string };
      void _weg;
      return rest as typeof b;
    });
}

async function rechtstext(sprache: Sprache, art: Rechtstext["art"]): Promise<Rechtstext | null> {
  try {
    const roh = await json<Rechtstext>(`${sprache}/rechtstexte/${art}.json`);
    return { ...roh, inhalt: nachBetrieb(roh.inhalt) };
  } catch (err) {
    if (fehltNur(err)) return null;
    throw err;
  }
}

async function baustein(roh: RohBaustein, sprache: Sprache, seite: string): Promise<Baustein> {
  const ort = `Seite ${sprache}/${seite}, Baustein ${roh._key}`;
  switch (roh._type) {
    case "textBaustein":
      return { ...roh, bild: await bild(roh.bild, ort) };
    case "behandlungenBaustein": {
      const alle = await behandlungen(sprache);
      const auswahl = roh.behandlungen?.length ? alle.filter((b) => roh.behandlungen!.includes(b.id)) : alle;
      return { ...roh, behandlungen: auswahl };
    }
    case "teamBaustein": {
      const alle = await team(sprache);
      const auswahl = roh.team?.length ? alle.filter((t) => roh.team!.includes(t.id)) : alle;
      return { ...roh, team: auswahl };
    }
    case "downloadsBaustein": {
      const alle = await downloads(sprache);
      const auswahl = roh.downloads?.length ? alle.filter((d) => roh.downloads!.includes(d.id)) : alle;
      return { ...roh, downloads: auswahl };
    }
    case "galerieBaustein":
      return { ...roh, bilder: await Promise.all(roh.bilder.map((b, i) => bildPflicht(b, `${ort} Bild ${i + 1}`))) };
    case "bildBaustein":
      return { ...roh, bild: await bildPflicht(roh.bild, ort) };
    case "rechtstextBaustein": {
      const text = await rechtstext(sprache, roh.rechtstext);
      if (!text) throw new Error(`Rechtstext «${roh.rechtstext}» (${sprache}) fehlt (${ort}).`);
      return { ...roh, rechtstext: text };
    }
    default:
      return roh;
  }
}

export const lokaleQuelle: Inhaltsquelle = {
  async getEinstellungen() {
    const roh = await json<RohEinstellungen>("einstellungen.json");
    return {
      ...roh,
      logo: await bildPflicht(roh.logo, "Einstellungen: Logo"),
      seoBild: await bild(roh.seoBild, "Einstellungen: SEO-Bild"),
      mitgliedschaft: roh.mitgliedschaft ? { ...roh.mitgliedschaft, logo: await bild(roh.mitgliedschaft.logo, "Einstellungen: Mitgliedschaft") } : undefined,
    };
  },

  async getTexte(sprache) {
    return json<Texte>(`${sprache}/texte.json`);
  },

  async getSeite(sprache, slug) {
    let roh: RohSeite;
    try {
      roh = await json<RohSeite>(`${sprache}/seiten/${slug}.json`);
    } catch (err) {
      if (fehltNur(err)) return null;
      throw err;
    }
    return {
      ...roh,
      hero: roh.hero ? { ...roh.hero, bild: await bild(roh.hero.bild, `Hero ${sprache}/${slug}`) } : undefined,
      bausteine: await Promise.all(roh.bausteine.map((b) => baustein(b, sprache, slug))),
    };
  },

  async getAlleSeiten() {
    const liste: SeitenVerweis[] = [];
    for (const sprache of SPRACHEN) {
      const dateien = await readdir(path.join(DATA, sprache, "seiten"));
      for (const d of dateien.filter((f) => f.endsWith(".json"))) {
        const s = await json<{ slug: string; uebersetzungsSchluessel: string }>(`${sprache}/seiten/${d}`);
        liste.push({ sprache, slug: s.slug, uebersetzungsSchluessel: s.uebersetzungsSchluessel });
      }
    }
    return liste;
  },

  getBehandlungen: behandlungen,
  getTeam: team,
  getDownloads: downloads,
  getRechtstext: rechtstext,
};
