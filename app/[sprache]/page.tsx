import type { Metadata } from "next";
import { Seite, seiteMetadata } from "./Seite";

type Props = { params: Promise<{ sprache: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { sprache } = await params;
  return seiteMetadata(sprache, "start");
}

export default async function Startseite({ params }: Props) {
  const { sprache } = await params;
  return <Seite sprache={sprache} slug="start" />;
}
