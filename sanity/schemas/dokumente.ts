import { defineField, defineType, defineArrayMember } from "sanity";
import { bausteinMitglieder } from "./bausteine";
import { lokalisierungsFelder, pruefFelder, SPRACHEN_LISTE } from "./objekte";

const RESERVIERTE_SLUGS = ["studio", "api", "images", "downloads", "fonts", "_next", "de", "en"];
const slugRegel = (r: import("sanity").SlugRule) =>
  r.required().custom((slug) => {
    const wert = slug?.current ?? "";
    if (RESERVIERTE_SLUGS.includes(wert)) return `«${wert}» ist reserviert.`;
    if (!/^[a-z0-9-]+$/.test(wert)) return "Nur Kleinbuchstaben, Ziffern und Bindestriche.";
    return true;
  });

/** Nicht lokalisierte Praxisdaten (Einzeldokument). */
export const einstellungenTyp = defineType({
  name: "einstellungen",
  title: "Praxisdaten",
  type: "document",
  groups: [
    { name: "praxis", title: "Praxis", default: true },
    { name: "kontakt", title: "Kontakt & Öffnungszeiten" },
    { name: "bilder", title: "Logo & Bilder" },
  ],
  fields: [
    defineField({ name: "praxisname", title: "Praxisname", type: "string", group: "praxis", validation: (r) => r.required() }),
    defineField({ name: "inhaberTitel", title: "Akademische Titel der verantwortlichen Person", type: "string", group: "praxis", description: "z. B. «PD Dr. med. dent.» – sorgfältig pflegen, erscheint im Impressum und in den strukturierten Daten.", validation: (r) => r.required() }),
    defineField({ name: "inhaberName", title: "Name der verantwortlichen Person", type: "string", group: "praxis", validation: (r) => r.required() }),
    defineField({ name: "inhaber", title: "Vollständige Bezeichnung", type: "string", group: "praxis", description: "z. B. «PD Dr. med. dent. Andreas Bindl»", validation: (r) => r.required() }),
    defineField({
      name: "mitgliedschaft",
      title: "Mitgliedschaft / Verband",
      type: "object",
      group: "praxis",
      description: "Nur eintragen, wenn die Mitgliedschaft belegt ist.",
      fields: [
        defineField({ name: "titel", title: "Bezeichnung", type: "string", validation: (r) => r.required() }),
        defineField({ name: "url", title: "Website des Verbands", type: "url" }),
        defineField({ name: "logo", title: "Signet", type: "bild" }),
      ],
    }),
    defineField({ name: "adresse", title: "Adresse", type: "adresse", group: "kontakt", validation: (r) => r.required() }),
    defineField({ name: "telefon", title: "Telefon", type: "string", group: "kontakt", validation: (r) => r.required() }),
    defineField({ name: "fax", title: "Fax", type: "string", group: "kontakt" }),
    defineField({ name: "email", title: "E-Mail", type: "string", group: "kontakt", validation: (r) => r.required().email() }),
    defineField({ name: "routenlink", title: "Routenlink", type: "url", group: "kontakt", description: "Link zu einem Kartendienst (wird nur verlinkt)." }),
    defineField({ name: "kartenEinbettung", title: "Karten-Einbettungsadresse", type: "url", group: "kontakt", description: "Google-Maps-Embed-URL. Wird ausschliesslich nach Einwilligung der Besucherin geladen." }),
    defineField({
      name: "geo",
      title: "Koordinaten (für Suchmaschinen)",
      type: "object",
      group: "kontakt",
      fields: [
        defineField({ name: "breite", title: "Breitengrad", type: "number" }),
        defineField({ name: "laenge", title: "Längengrad", type: "number" }),
      ],
    }),
    defineField({ name: "oeffnungszeiten", title: "Öffnungszeiten", type: "array", group: "kontakt", of: [defineArrayMember({ type: "oeffnungszeit" })], description: "Leer lassen, solange keine verbindlichen Zeiten bekannt sind." }),
    defineField({ name: "oeffnungszeitenHinweis", title: "Herkunft der Öffnungszeiten", type: "zweisprachig", group: "kontakt", description: "Nur ausfüllen, wenn die Zeiten nicht von der Praxis bestätigt sind. Leer lassen, sobald bestätigt." }),
    defineField({ name: "logo", title: "Logo", type: "bild", group: "bilder", validation: (r) => r.required() }),
    defineField({ name: "seoBild", title: "Vorschaubild (Teilen in sozialen Medien)", type: "bild", group: "bilder" }),
  ],
  preview: { prepare: () => ({ title: "Praxisdaten" }) },
});

/** Lokalisierte Website-Texte (ein Dokument je Sprache). */
export const texteTyp = defineType({
  name: "texte",
  title: "Website-Texte",
  type: "document",
  groups: [
    { name: "navigation", title: "Navigation & Footer", default: true },
    { name: "seo", title: "Suchmaschinen" },
    { name: "ui", title: "Bedienelemente" },
    { name: "einwilligung", title: "Cookie-/Datenschutz-Einstellungen" },
    { name: "formular", title: "Kontaktanfrage" },
  ],
  fields: [
    defineField({ name: "sprache", title: "Sprache", type: "string", options: { list: SPRACHEN_LISTE, layout: "radio" }, validation: (r) => r.required(), group: "navigation" }),
    defineField({ name: "navigation", title: "Hauptnavigation", type: "array", of: [defineArrayMember({ type: "link" })], validation: (r) => r.required().min(1).max(6), group: "navigation" }),
    defineField({ name: "rechtslinks", title: "Links im Footer (Rechtliches)", type: "array", of: [defineArrayMember({ type: "link" })], group: "navigation" }),
    defineField({ name: "demoHinweis", title: "Demo-Hinweis", type: "string", group: "navigation", description: "Kurzer Hinweis am Seitenende, solange die Website eine Demo ist. Leer = kein Hinweis." }),
    defineField({
      name: "seo",
      title: "Suchmaschinen",
      type: "object",
      group: "seo",
      fields: [
        defineField({ name: "titelZusatz", title: "Zusatz im Browser-Titel", type: "string", validation: (r) => r.required() }),
        defineField({ name: "beschreibung", title: "Standard-Beschreibung", type: "text", rows: 3, validation: (r) => r.required().max(160) }),
      ],
    }),
    defineField({
      name: "ui",
      title: "Bedienelemente",
      type: "object",
      group: "ui",
      description: "Beschriftungen von Knöpfen und Hinweisen. Die Feldnamen sind technisch, die Werte frei.",
      fields: [
        "zumInhalt", "menueOeffnen", "menueSchliessen", "sprache", "sprachwechselFehlt", "anrufen", "emailSchreiben", "routePlanen", "adresseKopieren", "kopiert", "kopierenFehler",
        "alleOeffnen", "alleSchliessen", "lebenslauf", "sprachen", "download", "dateiGroesse", "zeitenErfragen", "kontaktSeite", "startseite", "nichtGefundenTitel", "nichtGefundenText", "datenschutzEinstellungen",
      ].map((name) => defineField({ name, title: name, type: "string", validation: (r) => r.required() })),
    }),
    defineField({
      name: "einwilligung",
      title: "Cookie-/Datenschutz-Einstellungen",
      type: "object",
      group: "einwilligung",
      fields: [
        "bannerTitel", "bannerText", "alleAkzeptieren", "nurNotwendige", "einstellungen", "dialogTitel", "dialogText", "auswahlSpeichern", "schliessen", "notwendigTitel", "notwendigText", "immerAktiv",
        "karteTitel", "karteAnbieter", "karteText", "kartePlatzhalter", "karteAnzeigen", "karteAusblenden", "widerrufen", "keineEntscheidung", "entscheidungVom", "fussnote", "gespeichert", "alleErlaubt", "nurNotwendigeGespeichert", "widerrufenMeldung", "datenschutzerklaerung",
      ].map((name) => defineField({ name, title: name, type: "text", rows: 2, validation: (r) => r.required() })),
    }),
    defineField({
      name: "formular",
      title: "Kontaktanfrage",
      type: "object",
      group: "formular",
      fields: [
        ...["titel", "einleitung", "warnung", "name", "rueckruf", "kontaktwunsch", "nachricht", "nachrichtHilfe", "pflicht", "fehlerName", "emailVorbereiten", "hinweisNachher"].map((name) =>
          defineField({ name, title: name, type: "text", rows: 2, validation: (r) => r.required() }),
        ),
        defineField({
          name: "kontaktwunschOptionen",
          title: "Auswahl «Kontaktwunsch»",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              name: "option",
              fields: [
                defineField({ name: "wert", title: "Kennung", type: "string", validation: (r) => r.required() }),
                defineField({ name: "titel", title: "Beschriftung", type: "string", validation: (r) => r.required() }),
              ],
              preview: { select: { title: "titel", subtitle: "wert" } },
            }),
          ],
          validation: (r) => r.required().min(1),
        }),
      ],
    }),
  ],
  preview: { select: { sprache: "sprache" }, prepare: ({ sprache }) => ({ title: `Website-Texte (${sprache === "en" ? "English" : "Deutsch"})` }) },
});

export const seiteTyp = defineType({
  name: "seite",
  title: "Seite",
  type: "document",
  groups: [
    { name: "inhalt", title: "Inhalt", default: true },
    { name: "kopf", title: "Seitenanfang" },
    { name: "sprache", title: "Sprache" },
    { name: "seo", title: "Suchmaschinen" },
  ],
  fields: [
    ...lokalisierungsFelder("sprache"),
    defineField({ name: "titel", title: "Titel", type: "string", group: "inhalt", validation: (r) => r.required() }),
    defineField({ name: "slug", title: "URL-Segment", type: "slug", group: "inhalt", description: "«start» ist die Startseite der Sprache. Sonst z. B. «behandlungen» → /de/behandlungen/", options: { source: "titel", maxLength: 60 }, validation: slugRegel }),
    defineField({ name: "einleitung", title: "Einleitung", type: "text", rows: 3, group: "kopf" }),
    defineField({
      name: "hero",
      title: "Seitenanfang mit Panorama (nur Startseite)",
      type: "object",
      group: "kopf",
      fields: [
        defineField({ name: "kurzzeile", title: "Kurzzeile", type: "string" }),
        defineField({ name: "titel", title: "Titel", type: "string", validation: (r) => r.required().max(90) }),
        defineField({ name: "text", title: "Text darunter", type: "text", rows: 3 }),
        defineField({ name: "knopf", title: "Knopf", type: "link" }),
        defineField({ name: "zweiterKnopf", title: "Zweiter Knopf", type: "link" }),
        defineField({ name: "bild", title: "Panoramabild", type: "bild" }),
      ],
    }),
    defineField({ name: "bausteine", title: "Bausteine", type: "array", group: "inhalt", of: bausteinMitglieder }),
    defineField({ name: "seoTitel", title: "Seitentitel (Browser-Tab)", type: "string", group: "seo", validation: (r) => r.max(70).warning("Suchmaschinen kürzen Titel über ~70 Zeichen.") }),
    defineField({ name: "seoBeschreibung", title: "Beschreibung (Suchergebnis)", type: "text", rows: 3, group: "seo", validation: (r) => r.max(160).warning("Suchmaschinen zeigen meist nur ~160 Zeichen.") }),
  ],
  preview: { select: { title: "titel", slug: "slug.current", sprache: "sprache" }, prepare: ({ title, slug, sprache }) => ({ title, subtitle: `${sprache}/${slug}` }) },
});

export const behandlungTyp = defineType({
  name: "behandlung",
  title: "Behandlung",
  type: "document",
  groups: [
    { name: "inhalt", title: "Inhalt", default: true },
    { name: "sprache", title: "Sprache" },
    { name: "pruefung", title: "Herkunft & Prüfung" },
  ],
  fields: [
    ...lokalisierungsFelder("sprache"),
    defineField({ name: "titel", title: "Titel", type: "string", group: "inhalt", validation: (r) => r.required() }),
    defineField({ name: "anker", title: "Sprungziel (Anker)", type: "slug", group: "inhalt", description: "z. B. «wurzelbehandlung» → /de/behandlungen/#wurzelbehandlung", options: { source: "titel", maxLength: 50 }, validation: slugRegel }),
    defineField({ name: "inhalt", title: "Beschreibung", type: "richText", group: "inhalt", description: "Medizinischer Inhalt: Änderungen bitte fachlich freigeben (Gruppe «Herkunft & Prüfung»).", validation: (r) => r.required() }),
    defineField({
      name: "gruppe",
      title: "Gruppe",
      type: "string",
      group: "inhalt",
      options: {
        list: [
          { title: "Diagnostik & Schmerzbehandlung", value: "diagnostik" },
          { title: "Vorsorge & Dentalhygiene", value: "vorsorge" },
          { title: "Restaurative & ästhetische Zahnmedizin", value: "restaurativ" },
          { title: "Chirurgie, Implantate & Zahnersatz", value: "chirurgie" },
          { title: "Weitere Leistungen", value: "weiteres" },
        ],
      },
      validation: (r) => r.required(),
    }),
    defineField({ name: "reihenfolge", title: "Reihenfolge", type: "number", group: "inhalt", validation: (r) => r.required().integer() }),
    ...pruefFelder("pruefung"),
  ],
  orderings: [{ title: "Reihenfolge", name: "reihenfolge", by: [{ field: "reihenfolge", direction: "asc" }] }],
  preview: { select: { title: "titel", sprache: "sprache", gruppe: "gruppe" }, prepare: ({ title, sprache, gruppe }) => ({ title, subtitle: `${sprache} · ${gruppe}` }) },
});

export const teammitgliedTyp = defineType({
  name: "teammitglied",
  title: "Teammitglied",
  type: "document",
  groups: [
    { name: "person", title: "Person", default: true },
    { name: "lebenslauf", title: "Lebenslauf" },
    { name: "sprache", title: "Sprache" },
  ],
  fields: [
    ...lokalisierungsFelder("sprache"),
    defineField({ name: "titelVor", title: "Akademische Titel", type: "string", group: "person", description: "z. B. «PD Dr. med. dent.» – nur belegte Titel." }),
    defineField({ name: "vorname", title: "Vorname", type: "string", group: "person", validation: (r) => r.required() }),
    defineField({ name: "nachname", title: "Nachname", type: "string", group: "person", validation: (r) => r.required() }),
    defineField({ name: "funktion", title: "Funktion", type: "string", group: "person", description: "z. B. «Zahnarzt», «Dentalhygieniker HF»", validation: (r) => r.required() }),
    defineField({ name: "sprachen", title: "Sprachen", type: "array", group: "person", of: [defineArrayMember({ type: "string" })] }),
    defineField({ name: "bild", title: "Portrait", type: "bild", group: "person" }),
    defineField({ name: "lebenslaufEinleitung", title: "Einleitung Lebenslauf", type: "text", rows: 3, group: "lebenslauf" }),
    defineField({ name: "lebenslauf", title: "Lebenslauf", type: "richText", group: "lebenslauf", description: "Werdegang und Auszeichnungen; Zeitleiste-Block für Jahr/Text-Paare." }),
    defineField({ name: "reihenfolge", title: "Reihenfolge", type: "number", group: "person", validation: (r) => r.required().integer() }),
  ],
  orderings: [{ title: "Reihenfolge", name: "reihenfolge", by: [{ field: "reihenfolge", direction: "asc" }] }],
  preview: { select: { vorname: "vorname", nachname: "nachname", sprache: "sprache", media: "bild" }, prepare: ({ vorname, nachname, sprache, media }) => ({ title: `${vorname} ${nachname}`, subtitle: sprache, media }) },
});

export const downloadTyp = defineType({
  name: "download",
  title: "Download (PDF)",
  type: "document",
  fields: [
    ...lokalisierungsFelder(),
    defineField({ name: "titel", title: "Titel", type: "string", validation: (r) => r.required() }),
    defineField({ name: "datei", title: "Datei", type: "file", options: { accept: "application/pdf" }, validation: (r) => r.required() }),
    defineField({ name: "hinweis", title: "Hinweis", type: "string", description: "z. B. «Faltblatt der Gesundheitsdirektion Kanton Zürich»" }),
    defineField({ name: "dokumentSprache", title: "Sprache des Dokuments", type: "string", options: { list: SPRACHEN_LISTE, layout: "radio" }, validation: (r) => r.required() }),
    defineField({ name: "reihenfolge", title: "Reihenfolge", type: "number", validation: (r) => r.required().integer() }),
  ],
  orderings: [{ title: "Reihenfolge", name: "reihenfolge", by: [{ field: "reihenfolge", direction: "asc" }] }],
  preview: { select: { title: "titel", subtitle: "sprache" } },
});

export const rechtstextTyp = defineType({
  name: "rechtstext",
  title: "Rechtstext",
  type: "document",
  fields: [
    ...lokalisierungsFelder(),
    defineField({ name: "titel", title: "Titel", type: "string", validation: (r) => r.required() }),
    defineField({ name: "art", title: "Art", type: "string", options: { list: [{ title: "Impressum", value: "impressum" }, { title: "Datenschutzerklärung", value: "datenschutz" }], layout: "radio" }, validation: (r) => r.required() }),
    defineField({ name: "stand", title: "Stand (Datum)", type: "date" }),
    defineField({ name: "inhalt", title: "Inhalt", type: "richText", validation: (r) => r.required() }),
  ],
  preview: { select: { title: "titel", subtitle: "sprache" } },
});
