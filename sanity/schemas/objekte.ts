import { defineField, defineType, defineArrayMember } from "sanity";

export const SPRACHEN_LISTE = [
  { title: "Deutsch", value: "de" },
  { title: "English", value: "en" },
];

/** Bild mit Pflicht-Alt-Text und optionaler Bildunterschrift. */
export const bildTyp = defineType({
  name: "bild",
  title: "Bild",
  type: "image",
  options: { hotspot: true },
  fields: [
    defineField({ name: "alt", title: "Alternativtext", type: "string", description: "Beschreibt das Bild für Screenreader. Pflichtfeld.", validation: (r) => r.required().max(200) }),
    defineField({ name: "bildunterschrift", title: "Bildunterschrift", type: "string" }),
  ],
});

/** Gemeinsame Regel für Linkziele (Link-Objekt und Links im Fliesstext) – blockiert javascript:, data: und //… */
function linkZielPruefen(wert: unknown): true | string {
  if (typeof wert !== "string") return true;
  const ok = /^\/(?!\/)/.test(wert) || /^(https?:\/\/[^\s]+|mailto:[^\s]+|tel:\+?[\d\s()-]+)$/.test(wert);
  return ok || "Erlaubt sind interne Pfade (/…), https://…, mailto:… und tel:…";
}

export const linkTyp = defineType({
  name: "link",
  title: "Link",
  type: "object",
  fields: [
    defineField({ name: "titel", title: "Beschriftung", type: "string", validation: (r) => r.required() }),
    defineField({
      name: "ziel",
      title: "Ziel",
      type: "string",
      description: "Interner Pfad mit Sprache (z. B. /de/kontakt/), externe Adresse (https://…), tel:… oder mailto:…",
      validation: (r) => r.required().custom(linkZielPruefen),
    }),
    defineField({ name: "extern", title: "In neuem Tab öffnen", type: "boolean", initialValue: false }),
  ],
  preview: { select: { title: "titel", subtitle: "ziel" } },
});

/** Formatierter Text: Absätze, Zwischentitel, Listen, Links, fett/kursiv, einfache Tabelle (Lebenslauf). */
export const richTextTyp = defineType({
  name: "richText",
  title: "Text",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [
        { title: "Absatz", value: "normal" },
        { title: "Zwischentitel", value: "h2" },
        { title: "Untertitel", value: "h3" },
      ],
      lists: [
        { title: "Aufzählung", value: "bullet" },
        { title: "Nummerierung", value: "number" },
      ],
      marks: {
        decorators: [
          { title: "Fett", value: "strong" },
          { title: "Kursiv", value: "em" },
        ],
        annotations: [
          {
            name: "link",
            title: "Link",
            type: "object",
            fields: [
              defineField({ name: "href", title: "Adresse", type: "string", validation: (r) => r.required().custom(linkZielPruefen) }),
              defineField({ name: "extern", title: "In neuem Tab öffnen", type: "boolean", initialValue: false }),
            ],
          },
        ],
      },
    }),
    defineArrayMember({
      type: "object",
      name: "zeitleiste",
      title: "Zeitleiste (Lebenslauf)",
      fields: [
        defineField({
          name: "eintraege",
          title: "Einträge",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              name: "eintrag",
              fields: [
                defineField({ name: "zeitraum", title: "Zeitraum", type: "string", validation: (r) => r.required() }),
                defineField({ name: "text", title: "Text", type: "text", rows: 2, validation: (r) => r.required() }),
              ],
              preview: { select: { title: "zeitraum", subtitle: "text" } },
            }),
          ],
        }),
      ],
      preview: { select: { eintraege: "eintraege" }, prepare: ({ eintraege }) => ({ title: `Zeitleiste (${eintraege?.length ?? 0} Einträge)` }) },
    }),
  ],
});

export const adresseTyp = defineType({
  name: "adresse",
  title: "Adresse",
  type: "object",
  fields: [
    defineField({ name: "strasse", title: "Strasse und Nr.", type: "string", validation: (r) => r.required() }),
    defineField({ name: "plz", title: "PLZ", type: "string", validation: (r) => r.required() }),
    defineField({ name: "ort", title: "Ort", type: "string", validation: (r) => r.required() }),
    defineField({ name: "land", title: "Land", type: "string", initialValue: "Schweiz" }),
  ],
});

const WOCHENTAGE = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"];

export const zweisprachigTyp = defineType({
  name: "zweisprachig",
  title: "Text (DE/EN)",
  type: "object",
  fields: [
    defineField({ name: "de", title: "Deutsch", type: "string", validation: (r) => r.required() }),
    defineField({ name: "en", title: "English", type: "string", validation: (r) => r.required() }),
  ],
});

export const oeffnungszeitTyp = defineType({
  name: "oeffnungszeit",
  title: "Öffnungszeit",
  type: "object",
  description: "«Tage»/«Zeiten» sind der sichtbare Text. Die Felder darunter sind optional und nur für die strukturierten Daten (Suchmaschinen).",
  fields: [
    defineField({ name: "tage", title: "Tage", type: "zweisprachig", validation: (r) => r.required() }),
    defineField({ name: "zeiten", title: "Zeiten", type: "zweisprachig", validation: (r) => r.required() }),
    defineField({ name: "wochentage", title: "Wochentage (für Suchmaschinen)", type: "array", of: [defineArrayMember({ type: "string" })], options: { list: WOCHENTAGE } }),
    defineField({
      name: "intervalle",
      title: "Geöffnete Zeitspannen (für Suchmaschinen)",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "intervall",
          fields: [
            defineField({ name: "von", title: "Öffnet um", type: "string", description: "HH:MM", validation: (r) => r.required().regex(/^([01]\d|2[0-3]):[0-5]\d$/, { name: "Uhrzeit", invert: false }) }),
            defineField({ name: "bis", title: "Schliesst um", type: "string", description: "HH:MM", validation: (r) => r.required().regex(/^([01]\d|2[0-3]):[0-5]\d$/, { name: "Uhrzeit", invert: false }) }),
          ],
          preview: { select: { von: "von", bis: "bis" }, prepare: ({ von, bis }) => ({ title: `${von} bis ${bis}` }) },
        }),
      ],
    }),
    defineField({ name: "geschlossen", title: "Geschlossen", type: "boolean", initialValue: false }),
  ],
  preview: { select: { title: "tage.de", subtitle: "zeiten.de" } },
});

/** Gemeinsame Felder aller lokalisierten Dokumente. */
export const lokalisierungsFelder = (gruppe?: string) => [
  defineField({ name: "sprache", title: "Sprache", type: "string", options: { list: SPRACHEN_LISTE, layout: "radio" }, validation: (r) => r.required(), group: gruppe }),
  defineField({
    name: "uebersetzungsSchluessel",
    title: "Übersetzungsschlüssel",
    type: "string",
    description: "Gleicher Schlüssel für die deutsche und die englische Fassung (z. B. «behandlung-implantate»). Verbindet die Sprachversionen für den Sprachwechsel.",
    validation: (r) => r.required().regex(/^[a-z0-9-]+$/, { name: "Kennung", invert: false }),
    group: gruppe,
  }),
];

/** Redaktionelle Prüfangaben für medizinische Inhalte – informativ, kein technischer Freigabezwang. */
export const pruefFelder = (gruppe?: string) => [
  defineField({ name: "quelle", title: "Quelle des Textes", type: "string", description: "Woher stammt der Text? z. B. «praxiszuerichberg.ch, Abschnitt Behandlung (2026-09-21)»", group: gruppe }),
  defineField({
    name: "pruefstatus",
    title: "Prüfstatus",
    type: "string",
    options: {
      list: [
        { title: "Übernommen (unverändert)", value: "uebernommen" },
        { title: "Sprachlich angepasst (Aussage unverändert)", value: "sprachlich-angepasst" },
        { title: "Fachlich geprüft und freigegeben", value: "fachlich-geprueft" },
      ],
      layout: "radio",
    },
    group: gruppe,
  }),
  defineField({ name: "freigabedatum", title: "Freigabedatum", type: "date", description: "Datum der fachlichen Freigabe durch die Praxis (falls erfolgt).", group: gruppe }),
];
