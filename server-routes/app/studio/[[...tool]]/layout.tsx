import { NextStudioLayout } from "next-sanity/studio";

/**
 * Root-Layout der Studio-Route. Das Sprach-Layout (app/[sprache]/layout.tsx) deckt /studio nicht ab,
 * deshalb braucht diese Route ein eigenes <html>/<body> (Codex-Befund, Review 21.09.2026).
 * Nur im Vercel-Modus vorhanden (scripts/vercel-routen.mjs). Status: VORBEREITET.
 */
export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de-CH">
      <body style={{ margin: 0 }}>
        <NextStudioLayout>{children}</NextStudioLayout>
      </body>
    </html>
  );
}
