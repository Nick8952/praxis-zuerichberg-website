// Erzeugt aus den Originalen in assets/originale/ die Web-Varianten in public/images/
// und schreibt das Bildverzeichnis data/bilder.json (Masse, Varianten).
// Aufruf: npm run bilder   (idempotent – public/images wird neu aufgebaut)
// Dateinamen tragen einen Inhalts-Hash, damit Browser nach Bildwechseln nichts Altes zeigen.
// Herkunft jeder Datei: assets/originale/HERKUNFT.md
import sharp from "sharp";
import { mkdir, readdir, rm, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";

const WURZEL = path.resolve(import.meta.dirname, "..");
const QUELLE = path.join(WURZEL, "assets/originale");
const ZIEL = path.join(WURZEL, "public/images");
const BREITEN = [480, 960, 1600];

// id → Originaldatei (relativ zu assets/originale). Die id ist die stabile Referenz
// aus den Inhaltsdateien (data/*.json) und später die Sanity-Asset-Kennung im Seed.
const BILDER = {
  "logo": { datei: "img_logo.png", format: "png", breiten: [270, 540] },
  "sso": { datei: "sso.png", format: "png", breiten: [250] },
  "team-bindl": { datei: "team/img_team_1.jpg", breiten: [274, 548] },
  "team-fritschi": { datei: "team/img_team_2.jpg", breiten: [274, 548] },
  "team-friedl": { datei: "team/friedl.jpg", breiten: [365] },
  "praxis-schild": { datei: "praxis/img_teaser_1.jpg" },
  "praxis-behandlungsraum": { datei: "praxis/img_teaser_2.jpg" },
  "praxis-cerec": { datei: "praxis/img_teaser_3.jpg" },
  "praxis-behandlungsraum-2": { datei: "praxis/img_teaser_4.jpg" },
  "praxis-mikroskop": { datei: "praxis/img_teaser_5.jpg" },
  "praxis-instrumente": { datei: "praxis/img_teaser_6.jpg" },
  "praxis-empfang": { datei: "praxis/img_teaser_7.jpg" },
  "panorama-zuerich": { datei: "praxis/bg_page_2.jpg", breiten: [640, 1280, 1980] },
  "panorama-gleise": { datei: "praxis/bg_page_4.jpg", breiten: [640, 1280, 1980] },
  "panorama-arbeitsplatz": { datei: "praxis/bg_page_5.jpg", breiten: [640, 1280, 1980] },
};

await mkdir(ZIEL, { recursive: true });
for (const alt of await readdir(ZIEL)) await rm(path.join(ZIEL, alt));
const verzeichnis = {};
for (const [id, cfg] of Object.entries(BILDER)) {
  const eingabe = sharp(path.join(QUELLE, cfg.datei)).rotate();
  const meta = await eingabe.metadata();
  const breiten = (cfg.breiten ?? BREITEN).filter((b) => b <= meta.width || b === Math.min(...(cfg.breiten ?? BREITEN)));
  const quellen = [];
  for (const b of breiten) {
    let pipe = eingabe.clone().resize({ width: Math.min(b, meta.width), withoutEnlargement: true });
    pipe = cfg.format === "png" ? pipe.png({ compressionLevel: 9 }) : pipe.webp({ quality: 80 });
    const { data, info } = await pipe.toBuffer({ resolveWithObject: true });
    const hash = createHash("sha1").update(data).digest("hex").slice(0, 8);
    const dateiname = `${id}-${info.width}-${hash}.${cfg.format === "png" ? "png" : "webp"}`;
    await writeFile(path.join(ZIEL, dateiname), data);
    quellen.push({ breite: info.width, url: `/images/${dateiname}` });
  }
  quellen.sort((a, b) => a.breite - b.breite);
  verzeichnis[id] = { id, original: `assets/originale/${cfg.datei}`, breite: meta.width, hoehe: meta.height, quellen };
  console.log(id, `${meta.width}x${meta.height}`, quellen.map((q) => q.breite).join("/"));
}
await mkdir(path.join(WURZEL, "data"), { recursive: true });
await writeFile(path.join(WURZEL, "data/bilder.json"), JSON.stringify(verzeichnis, null, 2) + "\n");
console.log(`\n${Object.keys(verzeichnis).length} Bilder → data/bilder.json`);
