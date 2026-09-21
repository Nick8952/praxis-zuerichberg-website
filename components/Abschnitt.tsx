import type { ReactNode } from "react";

interface Props {
  id?: string;
  kurzzeile?: string;
  titel?: string;
  einleitung?: string;
  grund?: "weiss" | "nebel" | "aubergine-hell";
  breite?: "schmal" | "normal";
  children: ReactNode;
  className?: string;
  /** h2 (Standard) oder h1, wenn der Abschnitt der Seitentitel ist */
  ebene?: "h1" | "h2";
}

const GRUND = { weiss: "bg-weiss", nebel: "bg-nebel", "aubergine-hell": "bg-aubergine-hell" };

/** Einheitlicher Seitenabschnitt: optional Kurzzeile, Titel, Einleitung; Inhalt mit Scroll-Erscheinen. */
export function Abschnitt({ id, kurzzeile, titel, einleitung, grund = "weiss", breite = "normal", children, className, ebene = "h2" }: Props) {
  const Titel = ebene;
  return (
    <section id={id} className={`py-abschnitt ${GRUND[grund]} ${className ?? ""}`}>
      <div className={`container-seite ${breite === "schmal" ? "max-w-3xl" : ""}`}>
        {(kurzzeile || titel || einleitung) && (
          <header className="erscheinen mb-10 max-w-3xl">
            {kurzzeile && <p className="etikett mb-2">{kurzzeile}</p>}
            {titel && <Titel className="text-display-lg">{titel}</Titel>}
            {einleitung && <p className="mt-4 text-lead text-grau">{einleitung}</p>}
          </header>
        )}
        {children}
      </div>
    </section>
  );
}
