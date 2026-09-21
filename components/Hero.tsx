import type { Hero as HeroTyp } from "@/lib/content/types";
import { Bild } from "./Bild";
import { Horizont } from "./Horizont";
import { SmartLink } from "./SmartLink";
import { PfeilIcon, TelefonIcon } from "./Icons";

/**
 * Startseite: Titel, Text und Knöpfe auf weissem Grund, darunter das breite Panorama vom Zürichberg
 * mit der Horizontlinie aus dem Logo. Kein Text auf dem Foto (Lesbarkeit), keine Verlaufsfläche.
 */
export function Hero({ hero }: { hero: HeroTyp }) {
  return (
    <section aria-labelledby="hero-titel" className="bg-weiss pt-10 md:pt-14">
      <div className="container-seite">
        {hero.kurzzeile && <p className="auftauchen etikett mb-4">{hero.kurzzeile}</p>}
        <h1 id="hero-titel" className="auftauchen text-display-xl max-w-[22ch]">
          {hero.titel}
        </h1>
        <div className="auftauchen auftauchen-2 mt-6 grid gap-6 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
          {hero.text && <p className="max-w-[36rem] text-lead text-grau">{hero.text}</p>}
          {(hero.knopf || hero.zweiterKnopf) && (
            <div className="flex flex-wrap gap-3">
              {hero.knopf && (
                <SmartLink href={hero.knopf.ziel} extern={hero.knopf.extern} className="knopf knopf-primaer">
                  {hero.knopf.ziel.startsWith("tel:") ? <TelefonIcon /> : <PfeilIcon />}
                  {hero.knopf.titel}
                </SmartLink>
              )}
              {hero.zweiterKnopf && (
                <SmartLink href={hero.zweiterKnopf.ziel} extern={hero.zweiterKnopf.extern} className="knopf knopf-sekundaer">
                  {hero.zweiterKnopf.titel}
                </SmartLink>
              )}
            </div>
          )}
        </div>
      </div>
      {hero.bild && (
        <div className="auftauchen auftauchen-3 relative mt-10 md:mt-14">
          <Bild bild={hero.bild} sizes="100vw" priority className="block h-[38vw] max-h-[26rem] min-h-[11rem] w-full object-cover object-center" />
          <Horizont className="absolute inset-x-0 bottom-0 text-lime" />
        </div>
      )}
    </section>
  );
}
