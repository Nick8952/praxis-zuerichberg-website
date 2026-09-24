/**
 * Importskript: lokale Demo-Inhalte (data/), freigegebene Originalbilder (assets/originale/)
 * und PDFs (public/downloads/) → Sanity.
 *
 * NUR NACH DER SANITY-EINRICHTUNG AUSFÜHREN (docs/SANITY-VERCEL-EINRICHTUNG.md).
 * Braucht in .env.local: NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, SANITY_API_WRITE_TOKEN.
 *
 *   npm run seed -- --probe zeigt nur, was passieren würde (kein Schreibzugriff) – EMPFOHLENER ERSTER SCHRITT
 *   npm run seed            legt fehlende Dokumente an, überschreibt NICHTS Vorhandenes
 *   npm run seed -- --force ersetzt die vom Skript verwalteten Dokumente (nur die mit bekannten IDs)
 *
 * Dokument-IDs sind deterministisch (einstellungen, texte-<sprache>, seite-<sprache>-<slug>,
 * behandlung-…, team-…, download-…, rechtstext-…), _key-Werte stammen unverändert aus den JSON-Dateien.
 * Sanity dedupliziert Assets anhand des Dateiinhalts – Wiederholungen legen keine Duplikate an.
 */
import { createClient, type SanityClient } from "@sanity/client";
import nextEnv from "@next/env";
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

nextEnv.loadEnvConfig(process.cwd());

const force = process.argv.includes("--force");
const probe = process.argv.includes("--probe");
const WURZEL = process.cwd();
const SPRACHEN = ["de", "en"] as const;
const json = async <T,>(p: string): Promise<T> => JSON.parse(await readFile(path.join(WURZEL, "data", p), "utf8")) as T;

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const token = process.env.SANITY_API_WRITE_TOKEN;
if (!probe && (!projectId || !token)) {
  console.error("Fehlend: NEXT_PUBLIC_SANITY_PROJECT_ID und/oder SANITY_API_WRITE_TOKEN in .env.local (siehe .env.example).");
  process.exit(1);
}
const client: SanityClient = createClient({ projectId: projectId ?? "probe", dataset, token, apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2026-09-21", useCdn: false });

type BildRef = { bild: string; alt: string; bildunterschrift?: string };
type BildEintrag = { id: string; original: string };
type Roh = Record<string, unknown>;

const bilder = await json<Record<string, BildEintrag>>("bilder.json");
const assetIds = new Map<string, string>();

async function hochladen(art: "image" | "file", datei: string, kennung: string): Promise<string> {
  const schluessel = `${art}:${kennung}`;
  if (assetIds.has(schluessel)) return assetIds.get(schluessel)!;
  if (probe) {
    await readFile(datei); // Datei muss existieren
    console.log(`  [probe] würde hochladen (${art}): ${path.relative(WURZEL, datei)}`);
    assetIds.set(schluessel, `probe-${kennung}`);
    return `probe-${kennung}`;
  }
  const asset = await client.assets.upload(art, await readFile(datei), { filename: path.basename(datei), label: kennung });
  console.log(`  hochgeladen (${art}): ${path.relative(WURZEL, datei)} → ${asset._id}`);
  assetIds.set(schluessel, asset._id);
  return asset._id;
}

async function bild(ref: BildRef | undefined) {
  if (!ref) return undefined;
  const eintrag = bilder[ref.bild];
  if (!eintrag) throw new Error(`Bild «${ref.bild}» fehlt in data/bilder.json`);
  return {
    _type: "bild",
    asset: { _type: "reference", _ref: await hochladen("image", path.join(WURZEL, eintrag.original), ref.bild) },
    alt: ref.alt,
    ...(ref.bildunterschrift ? { bildunterschrift: ref.bildunterschrift } : {}),
  };
}

const ref = (_ref: string, key?: string) => ({ _type: "reference", _ref, ...(key ? { _key: key } : {}) });
const link = (l: unknown) => (l && typeof l === "object" ? { _type: "link", ...(l as object) } : undefined);
const slug = (s: unknown) => (typeof s === "string" ? { _type: "slug", current: s } : undefined);

async function bausteinUmwandeln(b: Roh, sprache: string) {
  const kopie: Roh = { ...b, anker: slug(b.anker) };
  for (const k of ["knopf", "zweiterKnopf", "weiterLink"]) if (k in b) kopie[k] = link(b[k]);
  if (b._type === "textBaustein") kopie.bild = await bild(b.bild as BildRef | undefined);
  if (b._type === "bildBaustein") kopie.bild = await bild(b.bild as BildRef);
  if (b._type === "galerieBaustein") kopie.bilder = await Promise.all(((b.bilder as BildRef[]) ?? []).map(async (x, i) => ({ _key: `bild-${i}`, ...(await bild(x)) })));
  if (b._type === "behandlungenBaustein") kopie.behandlungen = ((b.behandlungen as string[] | undefined) ?? []).map((id) => ref(id, id));
  if (b._type === "teamBaustein") kopie.team = ((b.team as string[] | undefined) ?? []).map((id) => ref(id, id));
  if (b._type === "downloadsBaustein") kopie.downloads = ((b.downloads as string[] | undefined) ?? []).map((id) => ref(id, id));
  if (b._type === "rechtstextBaustein") kopie.rechtstext = ref(`rechtstext-${sprache}-${b.rechtstext as string}`);
  return kopie;
}

const dokumente: Roh[] = [];

// Praxisdaten
const e = await json<Roh>("einstellungen.json");
const m = e.mitgliedschaft as Roh | undefined;
dokumente.push({
  ...e,
  _id: "einstellungen",
  _type: "einstellungen",
  adresse: { _type: "adresse", ...(e.adresse as object) },
  oeffnungszeiten: ((e.oeffnungszeiten as Roh[]) ?? []).map((z) => ({ _type: "oeffnungszeit", ...z, tage: { _type: "zweisprachig", ...(z.tage as object) }, zeiten: { _type: "zweisprachig", ...(z.zeiten as object) }, intervalle: ((z.intervalle as Roh[]) ?? []).map((i) => ({ _type: "intervall", ...i })) })),
  oeffnungszeitenHinweis: e.oeffnungszeitenHinweis ? { _type: "zweisprachig", ...(e.oeffnungszeitenHinweis as object) } : undefined,
  mitgliedschaft: m ? { ...m, logo: await bild(m.logo as BildRef | undefined) } : undefined,
  logo: await bild(e.logo as BildRef),
  seoBild: await bild(e.seoBild as BildRef | undefined),
});

for (const sprache of SPRACHEN) {
  // Website-Texte
  const t = await json<Roh>(`${sprache}/texte.json`);
  dokumente.push({
    ...t,
    _id: `texte-${sprache}`,
    _type: "texte",
    navigation: (t.navigation as Roh[]).map((l, i) => ({ _type: "link", _key: `nav-${i}`, ...l })),
    rechtslinks: (t.rechtslinks as Roh[]).map((l, i) => ({ _type: "link", _key: `recht-${i}`, ...l })),
    formular: { ...(t.formular as Roh), kontaktwunschOptionen: ((t.formular as Roh).kontaktwunschOptionen as Roh[]).map((o, i) => ({ _type: "option", _key: `opt-${i}`, ...o })) },
  });
  // Behandlungen, Team, Downloads
  for (const b of await json<Roh[]>(`${sprache}/behandlungen.json`)) dokumente.push({ ...b, _id: b.id as string, _type: "behandlung", id: undefined, anker: slug(b.anker) });
  for (const p of await json<Roh[]>(`${sprache}/team.json`)) dokumente.push({ ...p, _id: p.id as string, _type: "teammitglied", id: undefined, bild: await bild(p.bild as BildRef | undefined) });
  for (const d of await json<Roh[]>(`${sprache}/downloads.json`)) {
    const datei = path.join(WURZEL, "public", d.datei as string);
    dokumente.push({ ...d, _id: d.id as string, _type: "download", id: undefined, datei: { _type: "file", asset: { _type: "reference", _ref: await hochladen("file", datei, d.dateiname as string) } }, dateiname: undefined, groesseKb: undefined, seiten: undefined });
  }
  // Rechtstexte
  for (const datei of await readdir(path.join(WURZEL, "data", sprache, "rechtstexte"))) {
    const r = await json<Roh>(`${sprache}/rechtstexte/${datei}`);
    // Sanity läuft nur zusammen mit Vercel → nur Blöcke ohne `nurBetrieb` oder mit `nurBetrieb: "vercel"` importieren
    const inhalt = (r.inhalt as Roh[])
      .filter((b) => !b.nurBetrieb || b.nurBetrieb === "vercel")
      .map(({ nurBetrieb: _weg, ...rest }) => (void _weg, rest));
    dokumente.push({ ...r, inhalt, _id: r.id as string, _type: "rechtstext", id: undefined });
  }
  // Seiten
  for (const datei of await readdir(path.join(WURZEL, "data", sprache, "seiten"))) {
    const s = await json<Roh>(`${sprache}/seiten/${datei}`);
    const hero = s.hero as Roh | undefined;
    dokumente.push({
      ...s,
      _id: s.id as string,
      _type: "seite",
      id: undefined,
      slug: slug(s.slug),
      hero: hero ? { ...hero, knopf: link(hero.knopf), zweiterKnopf: link(hero.zweiterKnopf), bild: await bild(hero.bild as BildRef | undefined) } : undefined,
      bausteine: await Promise.all(((s.bausteine as Roh[]) ?? []).map((b) => bausteinUmwandeln(b, sprache))),
    });
  }
}

console.log(`${dokumente.length} Dokumente, ${assetIds.size} Dateien. Modus: ${probe ? "PROBE (kein Schreiben)" : force ? "FORCE (ersetzen)" : "nur fehlende anlegen"}`);
if (probe) {
  for (const d of dokumente) console.log(`  ${d._type}: ${d._id}`);
  process.exit(0);
}
const tx = client.transaction();
for (const d of dokumente) {
  const sauber = JSON.parse(JSON.stringify(d)); // undefined-Felder entfernen
  if (force) tx.createOrReplace(sauber);
  else tx.createIfNotExists(sauber);
}
const ergebnis = await tx.commit();
console.log(`Fertig: ${ergebnis.results.length} Operationen (${ergebnis.results.filter((r) => r.operation === "create").length} neu angelegt).`);
console.log("Nächster Schritt: im Studio prüfen (/studio) – der Seed schreibt direkt veröffentlichte Dokumente.");
