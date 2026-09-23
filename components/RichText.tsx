import { PortableText, type PortableTextComponents } from "@portabletext/react";
import type { RichText as RichTextTyp } from "@/lib/content/types";
import { SmartLink } from "./SmartLink";

interface Zeitleiste {
  _type: "zeitleiste";
  eintraege: { _key: string; zeitraum: string; text: string }[];
}

const komponenten: PortableTextComponents = {
  marks: {
    link: ({ value, children }) => (
      <SmartLink href={value?.href ?? "#"} extern={value?.extern}>
        {children}
      </SmartLink>
    ),
  },
  types: {
    // Lebenslauf: Zeitraum links, Text rechts – als Tabelle, damit Screenreader Jahr und Text zusammen lesen
    zeitleiste: ({ value }: { value: Zeitleiste }) => (
      <table>
        <tbody>
          {value.eintraege.map((e) => (
            <tr key={e._key}>
              <th scope="row">{e.zeitraum}</th>
              <td>{e.text}</td>
            </tr>
          ))}
        </tbody>
      </table>
    ),
  },
  unknownType: ({ value }) => {
    console.warn("Unbekannter Rich-Text-Block:", (value as { _type?: string })?._type);
    return null;
  },
};

// Lebensläufe stehen unter einer h3 (Name in der Teamkarte): dort werden h2/h3 des Rich Texts zu h4/h5,
// damit die Überschriftenhierarchie für Screenreader stimmt (WCAG 1.3.1).
const unterKarte: PortableTextComponents = {
  ...komponenten,
  block: {
    h2: ({ children }) => <h4>{children}</h4>,
    h3: ({ children }) => <h5>{children}</h5>,
  },
};

export function RichText({ inhalt, className, unterUeberschrift3 = false }: { inhalt: RichTextTyp; className?: string; unterUeberschrift3?: boolean }) {
  return (
    <div className={`fliesstext ${className ?? ""}`}>
      <PortableText value={inhalt} components={unterUeberschrift3 ? unterKarte : komponenten} />
    </div>
  );
}
