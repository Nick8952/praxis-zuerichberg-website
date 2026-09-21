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
              <td>{e.zeitraum}</td>
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

export function RichText({ inhalt, className }: { inhalt: RichTextTyp; className?: string }) {
  return (
    <div className={`fliesstext ${className ?? ""}`}>
      <PortableText value={inhalt} components={komponenten} />
    </div>
  );
}
