import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { inhaltsquelle } from "@/lib/content";
import { Seite, seiteMetadata } from "../Seite";

/**
 * Alle Unterseiten je Sprache. Im statischen Export zählt generateStaticParams jede Kombination
 * (Sprache, Slug) auf – nur echte Paare, keine kartesische Kombination; dynamicParams = false.
 * Next verlangt hier einen statischen Boolean (kein Ausdruck). Auf Vercel erscheinen neue Sanity-Slugs deshalb erst
 * nach einem Rebuild (Deploy Hook) – oder diesen Wert auf `true` setzen, sobald der GitHub-Pages-Export nicht mehr
 * gebraucht wird (docs/SANITY-VERCEL-EINRICHTUNG.md, Abschnitt 7).
 */
export const dynamicParams = false;

export async function generateStaticParams() {
  const alle = await (await inhaltsquelle()).getAlleSeiten();
  return alle.filter((s) => s.slug !== "start").map((s) => ({ sprache: s.sprache, slug: s.slug }));
}

type Props = { params: Promise<{ sprache: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { sprache, slug } = await params;
  return seiteMetadata(sprache, slug);
}

export default async function Unterseite({ params }: Props) {
  const { sprache, slug } = await params;
  if (slug === "start") notFound();
  return <Seite sprache={sprache} slug={slug} />;
}
