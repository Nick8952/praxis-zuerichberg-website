import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import "../globals.css";
import { inhaltsquelle } from "@/lib/content";
import { SPRACHEN, SPRACH_CODE, type Sprache } from "@/lib/content/types";
import { siteUrl } from "@/lib/deploy-ziel";
import { indexierungErlaubt } from "@/lib/seo";
import { Einwilligungsbanner } from "@/components/Einwilligung";
import { Fusszeile } from "@/components/Fusszeile";
import { VorschauWerkzeuge } from "@/lib/vorschau/VorschauWerkzeuge";

/**
 * Root-Layout im Sprachsegment (dokumentiertes Next-Muster für i18n): <html lang> kommt aus der URL,
 * nicht nachträglich per JavaScript. Kopfzeile rendert die Seite selbst (braucht Sprachziel der Seite).
 */
export const dynamicParams = false;

export function generateStaticParams() {
  return SPRACHEN.map((sprache) => ({ sprache }));
}

type Props = { children: React.ReactNode; params: Promise<{ sprache: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { sprache } = await params;
  if (!SPRACHEN.includes(sprache as Sprache)) return {};
  const q = await inhaltsquelle();
  const [e, t] = await Promise.all([q.getEinstellungen(), q.getTexte(sprache as Sprache)]);
  return {
    metadataBase: new URL(siteUrl),
    title: { default: e.praxisname, template: `%s | ${t.seo.titelZusatz}` },
    description: t.seo.beschreibung,
    robots: indexierungErlaubt ? { index: true, follow: true } : { index: false, follow: false },
  };
}

export const viewport: Viewport = { themeColor: "#663d4a", width: "device-width", initialScale: 1 };

export default async function SprachLayout({ children, params }: Props) {
  const { sprache } = await params;
  if (!SPRACHEN.includes(sprache as Sprache)) notFound();
  const sp = sprache as Sprache;
  const q = await inhaltsquelle();
  const [e, t] = await Promise.all([q.getEinstellungen(), q.getTexte(sp)]);
  return (
    <html lang={SPRACH_CODE[sp]} className="h-full">
      <body className="flex min-h-full flex-col">
        {children}
        <Fusszeile e={e} t={t} sprache={sp} />
        <Einwilligungsbanner sprache={sp} t={t.einwilligung} />
        <VorschauWerkzeuge />
      </body>
    </html>
  );
}
