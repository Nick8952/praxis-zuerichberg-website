/** Kopf der Unterseiten: kurzer Lime-Strich (Zitat der Horizontlinie), Titel, Einleitung. */
export function Seitenkopf({ titel, einleitung }: { titel: string; einleitung?: string }) {
  return (
    <header className="bg-weiss">
      <div className="container-seite pb-8 pt-10 md:pb-10 md:pt-14">
        <div className="auftauchen mb-5 h-1.5 w-14 rounded-full bg-lime" aria-hidden="true" />
        <h1 className="auftauchen text-display-xl max-w-[22ch]">{titel}</h1>
        {einleitung && <p className="auftauchen auftauchen-2 mt-5 max-w-[40rem] text-lead text-grau">{einleitung}</p>}
      </div>
    </header>
  );
}
