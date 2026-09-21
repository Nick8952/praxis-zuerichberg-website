import type { Bild as BildTyp } from "@/lib/content/types";
import { Bild } from "./Bild";

/**
 * Praxisbilder als ruhiges Raster (kein Karussell): ein grosses Bild links (2×2), rechts zwei kleinere.
 * Ein einzelnes viertes Bild würde als Waise in Zeile 3 stehen – es wird deshalb als breiter
 * Detailstreifen über die volle Breite gesetzt; ab dem fünften Bild folgen normale 4:3-Kacheln.
 */
function Unterschrift({ b }: { b: BildTyp }) {
  return b.bildunterschrift ? <figcaption className="px-3 py-2 text-[0.95rem] text-grau">{b.bildunterschrift}</figcaption> : null;
}

export function Galerie({ bilder }: { bilder: BildTyp[] }) {
  const [erstes, ...rest] = bilder;
  if (!erstes) return null;
  return (
    <div className="erscheinen grid gap-3 sm:grid-cols-3">
      <figure className="overflow-hidden rounded-[12px] bg-nebel sm:col-span-2 sm:row-span-2">
        <Bild bild={erstes} sizes="(min-width: 64rem) 48rem, 100vw" className="aspect-[4/3] h-full w-full object-cover sm:aspect-auto" />
        <Unterschrift b={erstes} />
      </figure>
      {rest.map((b, i) => {
        const streifen = i === 2 && rest.length === 3;
        return (
          <figure key={b.id + b.alt} className={`overflow-hidden rounded-[12px] bg-nebel ${streifen ? "sm:col-span-3" : ""}`}>
            <Bild
              bild={b}
              sizes={streifen ? "(min-width: 64rem) 72rem, 100vw" : "(min-width: 64rem) 24rem, (min-width: 40rem) 33vw, 100vw"}
              className={`${streifen ? "aspect-[4/3] sm:aspect-[3/1]" : "aspect-[4/3]"} h-full w-full object-cover`}
            />
            <Unterschrift b={b} />
          </figure>
        );
      })}
    </div>
  );
}
