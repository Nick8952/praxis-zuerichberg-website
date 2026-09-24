// `npm run build` wählt die Betriebsart selbst: Vercel setzt beim Build VERCEL=1 → Vercel-Build
// (Server-Rendering, /studio, API-Routen, ohne Unterpfad); überall sonst → statischer GitHub-Pages-Export.
// So funktioniert ein Vercel-Import mit den Standardeinstellungen, ohne Build Command im Dashboard.
import { spawnSync } from "node:child_process";

const aufVercel = process.env.VERCEL === "1";
const skript = aufVercel ? "build:vercel" : "build:pages";
console.log(`→ npm run ${skript}${aufVercel ? " (Vercel erkannt)" : ""}`);

const ergebnis = spawnSync("npm", ["run", skript], { stdio: "inherit", shell: process.platform === "win32" });
process.exit(ergebnis.status ?? 1);
