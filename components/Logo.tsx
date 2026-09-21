import Link from "next/link";
import type { Bild as BildTyp } from "@/lib/content/types";
import { Bild } from "./Bild";

/** Das Original-Logo (Wortmarke mit Bergsilhouette) als Link zur Startseite der Sprache. */
export function Logo({ logo, praxisname, href, startseite }: { logo: BildTyp; praxisname: string; href: string; startseite: string }) {
  return (
    <Link href={href} className="inline-flex min-h-11 items-center" aria-label={`${praxisname}: ${startseite}`}>
      <Bild bild={logo} sizes="200px" className="h-auto w-[176px] sm:w-[200px]" priority />
    </Link>
  );
}
