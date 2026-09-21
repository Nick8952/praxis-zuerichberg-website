// Ergänzt die Wurzel-Weiterleitung out/index.html (aus public/index.html) nach dem Export:
//  - absolute Canonical-URL auf die deutsche Startseite (statt relativ «./de/»)
//  - robots je nach INDEXIERUNG (Demo: noindex, nofollow; Go-Live mit INDEXIERUNG=1: keine Sperre)
// Läuft als letzter Schritt von `npm run build:pages` (Codex-Befund: Root-Canonical war relativ, INDEXIERUNG griff dort nicht).
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const WURZEL = path.resolve(import.meta.dirname, "..", "out");
const datei = path.join(WURZEL, "index.html");
const basePath = (process.env.BASE_PATH ?? "/praxis-zuerichberg-website").trim().replace(/\/$/, "");
const siteUrl = (process.env.SITE_URL?.trim().replace(/\/$/, "") || `https://nick8952.github.io${basePath}`);
const indexierung = process.env.INDEXIERUNG === "1";

let html;
try {
  html = await readFile(datei, "utf8");
} catch {
  console.error("✗ out/index.html fehlt – public/index.html vorhanden? Zuerst `next build` ausführen.");
  process.exit(1);
}
const canonical = `${siteUrl}/de/`;
html = html.replace(/<link rel="canonical" href="[^"]*">/, `<link rel="canonical" href="${canonical}">`);
html = html.replace(/<meta name="robots" content="[^"]*">/, indexierung ? "" : '<meta name="robots" content="noindex, nofollow">');
if (!html.includes(`href="${canonical}"`)) { console.error("✗ Canonical konnte nicht gesetzt werden."); process.exit(1); }
await writeFile(datei, html, "utf8");
console.log(`✓ out/index.html: canonical ${canonical}, ${indexierung ? "indexierbar" : "noindex"}`);
