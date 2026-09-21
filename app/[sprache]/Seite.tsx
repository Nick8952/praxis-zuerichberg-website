import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { inhaltsquelle } from "@/lib/content";
import { SPRACHEN, seitenPfad, type Sprache } from "@/lib/content/types";
import { jsonLdSicher, praxisJsonLd, seitenMetadata, sprachversionen } from "@/lib/seo";
import { Bausteine } from "@/components/Bausteine";
import { Hero } from "@/components/Hero";
import { Kopfzeile } from "@/components/Kopfzeile";
import { Seitenkopf } from "@/components/Seitenkopf";

/** Gemeinsame Seitenlogik für Startseite (slug «start») und Unterseiten – eine Implementierung für beide Betriebsarten. */
export async function seiteMetadata(sprache: string, slug: string): Promise<Metadata> {
  if (!SPRACHEN.includes(sprache as Sprache)) return {};
  const q = await inhaltsquelle();
  const [seite, e, t, alle] = await Promise.all([q.getSeite(sprache as Sprache, slug), q.getEinstellungen(), q.getTexte(sprache as Sprache), q.getAlleSeiten()]);
  return seite ? seitenMetadata(seite, e, t, alle) : {};
}

export async function Seite({ sprache, slug }: { sprache: string; slug: string }) {
  if (!SPRACHEN.includes(sprache as Sprache)) notFound();
  const sp = sprache as Sprache;
  const q = await inhaltsquelle();
  const [seite, e, t, alle, team] = await Promise.all([q.getSeite(sp, slug), q.getEinstellungen(), q.getTexte(sp), q.getAlleSeiten(), q.getTeam(sp)]);
  if (!seite) notFound();
  const andere: Sprache = sp === "de" ? "en" : "de";
  const sprachZiel = sprachversionen(seite, alle)[andere];
  return (
    <>
      <Kopfzeile e={e} t={t} sprache={sp} sprachZiel={sprachZiel} aktuellerPfad={seitenPfad(sp, slug)} />
      <main id="inhalt" className="flex-1">
        {seite.hero ? <Hero hero={seite.hero} /> : <Seitenkopf titel={seite.titel} einleitung={seite.einleitung} />}
        <Bausteine bausteine={seite.bausteine} e={e} t={t} sprache={sp} slug={slug} />
      </main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdSicher(praxisJsonLd(e, sp, team)) }} />
    </>
  );
}
