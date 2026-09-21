/**
 * Signatur «Horizont»: die Bergsilhouette des Zürichbergs aus dem Logo, als feine Linie über die
 * volle Breite. Nur an zwei Stellen (unter dem Panorama der Startseite und über dem Seitenfuss),
 * damit sie ein Erkennungszeichen bleibt und nicht zur Dekoration verkommt. Rein dekorativ.
 */
export function Horizont({ className = "" }: { className?: string }) {
  return (
    <svg className={`horizont ${className}`} viewBox="0 0 1200 40" preserveAspectRatio="none" aria-hidden="true" focusable="false">
      <path d="M0 36 L120 36 L210 12 L260 6 L330 20 L420 30 L1200 36" fill="none" stroke="currentColor" strokeWidth="2.5" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
    </svg>
  );
}
