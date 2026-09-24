/**
 * Sanity Studio unter /studio – nur im Vercel-Betrieb (wird von scripts/vercel-routen.mjs nach app/ kopiert).
 * Anmeldung: Sanity-Konto mit Zugriff auf das Projekt.
 * Solange NEXT_PUBLIC_SANITY_PROJECT_ID/DATASET fehlen, erscheint ein Hinweis statt einer Sanity-Fehlermeldung.
 */
import { NextStudio } from "next-sanity/studio";
import config from "@/sanity.config";
import { sanityKonfiguriert } from "@/sanity/env";

export const dynamic = "force-static";
export { metadata, viewport } from "next-sanity/studio";

export default function StudioSeite() {
  if (!sanityKonfiguriert) {
    return (
      <main style={{ maxWidth: "36rem", margin: "15vh auto", padding: "0 1.5rem", fontFamily: "system-ui, sans-serif", lineHeight: 1.6, color: "#2a2429" }}>
        <h1 style={{ fontSize: "1.5rem", color: "#663d4a" }}>Sanity Studio ist noch nicht eingerichtet</h1>
        <p>
          Die Website läuft mit den lokalen Demo-Inhalten. Das Studio erscheint hier, sobald in Vercel die Umgebungsvariablen
          <code> NEXT_PUBLIC_SANITY_PROJECT_ID</code> und <code>NEXT_PUBLIC_SANITY_DATASET</code> gesetzt sind und neu deployt wurde
          (Anleitung: <code>docs/SANITY-VERCEL-EINRICHTUNG.md</code>).
        </p>
      </main>
    );
  }
  return <NextStudio config={config} />;
}
