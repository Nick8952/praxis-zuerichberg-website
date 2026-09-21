/**
 * Prüft die lokalen Inhaltsdateien (data/) auf Vollständigkeit – läuft ohne Sanity.
 *   npm run inhalt:pruefen
 * Meldet fehlende Bilder/Alt-Texte, doppelte Slugs/_keys/Anker, unbekannte Bausteine, fehlende
 * Downloads, unzulässige Linkziele, interne Links auf nicht vorhandene Seiten und – wichtig für
 * die Zweisprachigkeit – Übersetzungsschlüssel ohne Gegenstück in der anderen Sprache.
 */
import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";

const DATA = path.resolve(process.cwd(), "data");
const PUBLIC = path.resolve(process.cwd(), "public");
const SPRACHEN = ["de", "en"] as const;
type Roh = Record<string, unknown>;
const json = async <T,>(p: string): Promise<T> => JSON.parse(await readFile(path.join(DATA, p), "utf8")) as T;
const fehler: string[] = [];
const warnungen: string[] = [];
const bilder = await json<Record<string, unknown>>("bilder.json");
const BAUSTEINE = new Set(["textBaustein", "hinweisBaustein", "behandlungenBaustein", "teamBaustein", "downloadsBaustein", "galerieBaustein", "bildBaustein", "kontaktBaustein", "aufrufBaustein", "rechtstextBaustein"]);
const GRUPPEN = new Set(["diagnostik", "vorsorge", "restaurativ", "chirurgie", "weiteres"]);
const linkErlaubt = (z: string) => /^\/(?!\/)/.test(z) || /^(https?:\/\/[^\s]+|mailto:[^\s]+|tel:\+?[\d\s()-]+)$/.test(z);
const kennung = /^[a-z0-9-]+$/;

function bildPruefen(ref: { bild?: string; alt?: string } | undefined, ort: string) {
  if (!ref) return;
  if (!ref.bild || !bilder[ref.bild]) fehler.push(`${ort}: Bild «${ref.bild}» fehlt in bilder.json`);
  if (typeof ref.alt !== "string") fehler.push(`${ort}: Alt-Text fehlt`);
}
const interneLinks: [string, string][] = [];
const linkSammeln = (ziel: unknown, ort: string) => {
  if (typeof ziel !== "string") return;
  if (!linkErlaubt(ziel)) fehler.push(`${ort}: unzulässiges Linkziel «${ziel}»`);
  if (ziel.startsWith("/")) interneLinks.push([ziel, ort]);
};
function richTextLinks(inhalt: unknown, ort: string) {
  for (const block of (inhalt as { markDefs?: { href?: string }[] }[]) ?? []) for (const m of block.markDefs ?? []) linkSammeln(m.href, ort);
}
/** Alle Dokumente mit Übersetzungsschlüssel: typ → schlüssel → Sprachen */
const schluessel = new Map<string, Map<string, Set<string>>>();
const merken = (typ: string, key: unknown, sprache: string, ort: string) => {
  if (typeof key !== "string" || !kennung.test(key)) { fehler.push(`${ort}: Übersetzungsschlüssel fehlt oder ungültig`); return; }
  const m = schluessel.get(typ) ?? new Map<string, Set<string>>();
  const s = m.get(key) ?? new Set<string>();
  if (s.has(sprache)) fehler.push(`${ort}: Übersetzungsschlüssel «${key}» doppelt in ${sprache}`);
  s.add(sprache); m.set(key, s); schluessel.set(typ, m);
};

const e = await json<Roh>("einstellungen.json");
for (const k of ["praxisname", "inhaber", "inhaberTitel", "inhaberName", "telefon", "email", "routenlink", "kartenEinbettung"]) if (!e[k]) fehler.push(`Einstellungen: ${k} fehlt`);
bildPruefen(e.logo as never, "Einstellungen Logo");
bildPruefen(e.seoBild as never, "Einstellungen SEO-Bild");
bildPruefen((e.mitgliedschaft as Roh | undefined)?.logo as never, "Einstellungen Mitgliedschaft");
{
  const ZEIT = /^([01]\d|2[0-3]):[0-5]\d$/;
  const zk = new Set<string>();
  for (const z of (e.oeffnungszeiten as Roh[]) ?? []) {
    if (!z._key || zk.has(z._key as string)) fehler.push(`Öffnungszeiten: _key fehlt oder doppelt`);
    zk.add(z._key as string);
    for (const sp of SPRACHEN) if (!(z.tage as Roh)?.[sp] || !(z.zeiten as Roh)?.[sp]) fehler.push(`Öffnungszeiten ${z._key}: Text für ${sp} fehlt`);
    const intervalle = (z.intervalle as { _key?: string; von?: string; bis?: string }[] | undefined) ?? [];
    for (const i of intervalle) if (!i._key || !ZEIT.test(i.von ?? "") || !ZEIT.test(i.bis ?? "")) fehler.push(`Öffnungszeiten ${z._key}: Zeitspanne ungültig (HH:MM, _key)`);
    if (!z.geschlossen && (((z.wochentage as unknown[])?.length ?? 0) > 0) !== intervalle.length > 0) fehler.push(`Öffnungszeiten ${z._key}: «wochentage» und «intervalle» gehören zusammen`);
  }
}

const seiten = new Map<string, Set<string>>();
for (const sprache of SPRACHEN) {
  const t = await json<Roh>(`${sprache}/texte.json`);
  if (t.sprache !== sprache) fehler.push(`${sprache}/texte.json: sprache ist «${t.sprache}»`);
  for (const l of [...(t.navigation as { ziel: string }[]), ...(t.rechtslinks as { ziel: string }[])]) linkSammeln(l.ziel, `${sprache} Texte`);
  for (const gruppe of ["ui", "einwilligung", "formular"]) for (const [k, v] of Object.entries((t[gruppe] as Roh) ?? {})) if (v === "" || v === undefined) fehler.push(`${sprache}/texte.json: ${gruppe}.${k} leer`);

  const behandlungen = await json<Roh[]>(`${sprache}/behandlungen.json`);
  const ids = new Set<string>(); const anker = new Set<string>();
  for (const b of behandlungen) {
    const ort = `Behandlung ${sprache}/${b.id}`;
    if (!b.id || ids.has(b.id as string)) fehler.push(`${ort}: ID fehlt oder doppelt`); ids.add(b.id as string);
    if (b.sprache !== sprache) fehler.push(`${ort}: sprache falsch`);
    if (!b.titel || !b.inhalt) fehler.push(`${ort}: Titel/Inhalt fehlt`);
    if (typeof b.anker !== "string" || !kennung.test(b.anker) || anker.has(b.anker)) fehler.push(`${ort}: Anker fehlt/ungültig/doppelt`); anker.add(b.anker as string);
    if (!GRUPPEN.has(b.gruppe as string)) fehler.push(`${ort}: unbekannte Gruppe «${b.gruppe}»`);
    if (!Number.isInteger(b.reihenfolge)) fehler.push(`${ort}: Reihenfolge fehlt`);
    if (!b.quelle) warnungen.push(`${ort}: keine Quellenangabe (medizinischer Inhalt)`);
    merken("behandlung", b.uebersetzungsSchluessel, sprache, ort);
    richTextLinks(b.inhalt, ort);
  }
  const team = await json<Roh[]>(`${sprache}/team.json`);
  for (const p of team) {
    const ort = `Team ${sprache}/${p.id}`;
    if (!p.vorname || !p.nachname || !p.funktion) fehler.push(`${ort}: Name/Funktion fehlt`);
    bildPruefen(p.bild as never, ort);
    if (!Number.isInteger(p.reihenfolge)) fehler.push(`${ort}: Reihenfolge fehlt`);
    merken("team", p.uebersetzungsSchluessel, sprache, ort);
    richTextLinks(p.lebenslauf, ort);
  }
  const downloads = await json<Roh[]>(`${sprache}/downloads.json`);
  for (const d of downloads) {
    const ort = `Download ${sprache}/${d.id}`;
    if (!d.titel || !d.datei) fehler.push(`${ort}: Titel/Datei fehlt`);
    try { await stat(path.join(PUBLIC, d.datei as string)); } catch { fehler.push(`${ort}: Datei public${d.datei} fehlt`); }
    if (!["de", "en"].includes(d.dokumentSprache as string)) fehler.push(`${ort}: dokumentSprache fehlt`);
    merken("download", d.uebersetzungsSchluessel, sprache, ort);
  }
  for (const f of await readdir(path.join(DATA, sprache, "rechtstexte"))) {
    const r = await json<Roh>(`${sprache}/rechtstexte/${f}`);
    if (`${r.art}.json` !== f) fehler.push(`${sprache}/rechtstexte/${f}: Dateiname passt nicht zu art «${r.art}»`);
    merken("rechtstext", r.uebersetzungsSchluessel, sprache, `Rechtstext ${sprache}/${r.art}`);
    richTextLinks(r.inhalt, `Rechtstext ${sprache}/${r.art}`);
  }

  const slugs = new Set<string>();
  for (const f of (await readdir(path.join(DATA, sprache, "seiten"))).filter((x) => x.endsWith(".json"))) {
    const s = await json<Roh>(`${sprache}/seiten/${f}`);
    const slug = s.slug as string;
    const ort = `${sprache}/${slug}`;
    if (slugs.has(slug)) fehler.push(`Doppelter Slug: ${ort}`); slugs.add(slug);
    if (`${slug}.json` !== f) fehler.push(`${sprache}/seiten/${f}: Dateiname passt nicht zum Slug «${slug}»`);
    if (s.sprache !== sprache) fehler.push(`${ort}: sprache falsch`);
    if (!s.titel) fehler.push(`${ort}: Titel fehlt`);
    merken("seite", s.uebersetzungsSchluessel, sprache, ort);
    const hero = s.hero as Roh | undefined;
    if (hero) { bildPruefen(hero.bild as never, `${ort} hero`); for (const k of ["knopf", "zweiterKnopf"]) linkSammeln((hero[k] as { ziel?: string } | undefined)?.ziel, `${ort} hero`); }
    const keys = new Set<string>(); const ankerSet = new Set<string>();
    for (const b of (s.bausteine as Roh[]) ?? []) {
      const bort = `${ort} › ${b._key}`;
      if (!BAUSTEINE.has(b._type as string)) fehler.push(`${bort}: unbekannter Baustein «${b._type}»`);
      if (!b._key || keys.has(b._key as string)) fehler.push(`${bort}: _key fehlt oder doppelt`); keys.add(b._key as string);
      if (b.anker !== undefined) { if (!kennung.test(b.anker as string) || ankerSet.has(b.anker as string)) fehler.push(`${bort}: Anker ungültig/doppelt`); ankerSet.add(b.anker as string); }
      if ("bild" in b) bildPruefen(b.bild as never, bort);
      if ("inhalt" in b) richTextLinks(b.inhalt, bort);
      if ("anfahrt" in b) richTextLinks(b.anfahrt, bort);
      if (b._type === "textBaustein" || b._type === "hinweisBaustein") if (!b.inhalt) fehler.push(`${bort}: inhalt fehlt`);
      if (b._type === "hinweisBaustein" && !["info", "wichtig"].includes(b.art as string)) fehler.push(`${bort}: art muss info/wichtig sein`);
      if (b._type === "behandlungenBaustein") { if (!["akkordeon", "kurzliste"].includes(b.darstellung as string)) fehler.push(`${bort}: darstellung ungültig`); for (const id of (b.behandlungen as string[]) ?? []) if (!ids.has(id)) fehler.push(`${bort}: Behandlung «${id}» existiert nicht`); }
      if (b._type === "teamBaustein") for (const id of (b.team as string[]) ?? []) if (!team.some((p) => p.id === id)) fehler.push(`${bort}: Teammitglied «${id}» existiert nicht`);
      if (b._type === "downloadsBaustein") for (const id of (b.downloads as string[]) ?? []) if (!downloads.some((d) => d.id === id)) fehler.push(`${bort}: Download «${id}» existiert nicht`);
      if (b._type === "galerieBaustein") for (const [i, x] of ((b.bilder as unknown[]) ?? []).entries()) bildPruefen(x as never, `${bort} Bild ${i + 1}`);
      if (b._type === "kontaktBaustein") for (const k of ["mitKarte", "mitFormular"]) if (typeof b[k] !== "boolean") fehler.push(`${bort}: ${k} muss true/false sein`);
      if (b._type === "aufrufBaustein" && !b.knopf) fehler.push(`${bort}: knopf fehlt`);
      for (const k of ["knopf", "zweiterKnopf", "weiterLink"]) linkSammeln((b[k] as { ziel?: string } | undefined)?.ziel, bort);
      if (b._type === "rechtstextBaustein") { try { await readFile(path.join(DATA, sprache, `rechtstexte/${b.rechtstext}.json`)); } catch { fehler.push(`${bort}: Rechtstext «${b.rechtstext}» fehlt`); } }
    }
  }
  seiten.set(sprache, slugs);
}

// Übersetzungspaare: jeder Schlüssel muss in beiden Sprachen existieren (fehlende Übersetzungen werden nicht verschwiegen)
for (const [typ, m] of schluessel) for (const [key, sprachen] of m) for (const sp of SPRACHEN) if (!sprachen.has(sp)) warnungen.push(`${typ} «${key}»: keine Fassung in ${sp}`);

// Interne Links: /<sprache>/<slug>/ (mit optionalem #anker oder ?query)
for (const [ziel, ort] of interneLinks) {
  const m = ziel.match(/^\/(de|en)\/([a-z0-9-]*)\/?(?:[#?].*)?$/);
  if (!m) { fehler.push(`${ort}: interner Link «${ziel}» hat nicht die Form /<sprache>/<slug>/`); continue; }
  const slug = m[2] || "start";
  if (!seiten.get(m[1])?.has(slug)) fehler.push(`${ort}: interner Link «${ziel}» zeigt auf keine Seite`);
}

for (const w of warnungen) console.warn(`  ! ${w}`);
if (fehler.length) {
  console.error(`✗ ${fehler.length} Problem(e):\n` + fehler.map((f) => `  - ${f}`).join("\n"));
  process.exit(1);
}
console.log(`✓ Inhalte in Ordnung: ${[...seiten.values()].reduce((n, s) => n + s.size, 0)} Seiten in ${SPRACHEN.length} Sprachen, ${schluessel.get("behandlung")?.size ?? 0} Behandlungen, ${Object.keys(bilder).length} Bilder, ${interneLinks.length} interne Links; ${warnungen.length} Hinweis(e).`);
