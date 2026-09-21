import { defineArrayMember, defineField, defineType } from "sanity";

/**
 * Seitenbausteine – ein begrenzter Satz, mit dem die Praxis später Seiten zusammenstellt.
 * Jeder Baustein hat optional Anker, Kurzzeile und Titel; gestalterische Werte sind nicht editierbar.
 */
const kopf = [
  defineField({ name: "anker", title: "Sprungziel (Anker)", type: "slug", description: "Optional, z. B. «philosophie» → /de/praxis/#philosophie", options: { source: "titel", maxLength: 40 } }),
  defineField({ name: "kurzzeile", title: "Kurzzeile", type: "string", description: "Kleine Zeile über dem Titel – sparsam einsetzen." }),
  defineField({ name: "titel", title: "Titel", type: "string" }),
];

export const textBaustein = defineType({
  name: "textBaustein",
  title: "Text",
  type: "object",
  fields: [
    ...kopf,
    defineField({ name: "inhalt", title: "Inhalt", type: "richText", validation: (r) => r.required() }),
    defineField({ name: "bild", title: "Bild neben dem Text", type: "bild" }),
    defineField({ name: "bildPosition", title: "Bildposition", type: "string", options: { list: [{ title: "Rechts", value: "rechts" }, { title: "Links", value: "links" }], layout: "radio" }, initialValue: "rechts" }),
  ],
  preview: { select: { title: "titel" }, prepare: ({ title }) => ({ title: title || "Text" }) },
});

export const hinweisBaustein = defineType({
  name: "hinweisBaustein",
  title: "Hinweis",
  type: "object",
  description: "Hervorgehobener Kasten, z. B. für Tarifhinweise oder Prüfhinweise.",
  fields: [
    ...kopf,
    defineField({ name: "inhalt", title: "Inhalt", type: "richText", validation: (r) => r.required() }),
    defineField({ name: "art", title: "Art", type: "string", options: { list: [{ title: "Information", value: "info" }, { title: "Wichtig", value: "wichtig" }], layout: "radio" }, initialValue: "info" }),
  ],
  preview: { select: { title: "titel" }, prepare: ({ title }) => ({ title: title || "Hinweis" }) },
});

export const behandlungenBaustein = defineType({
  name: "behandlungenBaustein",
  title: "Behandlungen",
  type: "object",
  fields: [
    ...kopf,
    defineField({ name: "einleitung", title: "Einleitung", type: "text", rows: 3 }),
    defineField({
      name: "darstellung",
      title: "Darstellung",
      type: "string",
      options: { list: [{ title: "Aufklappbare Liste (vollständig)", value: "akkordeon" }, { title: "Kurzliste mit Link", value: "kurzliste" }], layout: "radio" },
      initialValue: "akkordeon",
      validation: (r) => r.required(),
    }),
    defineField({ name: "behandlungen", title: "Auswahl", type: "array", of: [defineArrayMember({ type: "reference", to: [{ type: "behandlung" }] })], description: "Leer lassen = alle Behandlungen dieser Sprache." }),
    defineField({ name: "weiterLink", title: "Link am Ende", type: "link" }),
  ],
  preview: { select: { title: "titel" }, prepare: ({ title }) => ({ title: title || "Behandlungen" }) },
});

export const teamBaustein = defineType({
  name: "teamBaustein",
  title: "Team",
  type: "object",
  fields: [
    ...kopf,
    defineField({ name: "einleitung", title: "Einleitung", type: "text", rows: 3 }),
    defineField({ name: "mitLebenslauf", title: "Lebensläufe aufklappbar anzeigen", type: "boolean", initialValue: true }),
    defineField({ name: "team", title: "Auswahl", type: "array", of: [defineArrayMember({ type: "reference", to: [{ type: "teammitglied" }] })], description: "Leer lassen = alle Teammitglieder dieser Sprache." }),
  ],
  preview: { select: { title: "titel" }, prepare: ({ title }) => ({ title: title || "Team" }) },
});

export const downloadsBaustein = defineType({
  name: "downloadsBaustein",
  title: "Downloads",
  type: "object",
  fields: [
    ...kopf,
    defineField({ name: "einleitung", title: "Einleitung", type: "text", rows: 3 }),
    defineField({ name: "downloads", title: "Auswahl", type: "array", of: [defineArrayMember({ type: "reference", to: [{ type: "download" }] })], description: "Leer lassen = alle Downloads dieser Sprache." }),
  ],
  preview: { select: { title: "titel" }, prepare: ({ title }) => ({ title: title || "Downloads" }) },
});

export const galerieBaustein = defineType({
  name: "galerieBaustein",
  title: "Bildergalerie",
  type: "object",
  fields: [
    ...kopf,
    defineField({ name: "einleitung", title: "Einleitung", type: "text", rows: 2 }),
    defineField({ name: "bilder", title: "Bilder", type: "array", of: [defineArrayMember({ type: "bild" })], validation: (r) => r.required().min(1) }),
  ],
  preview: { select: { title: "titel", bilder: "bilder" }, prepare: ({ title, bilder }) => ({ title: title || "Bildergalerie", subtitle: `${bilder?.length ?? 0} Bilder` }) },
});

export const bildBaustein = defineType({
  name: "bildBaustein",
  title: "Bild",
  type: "object",
  fields: [
    ...kopf,
    defineField({ name: "bild", title: "Bild", type: "bild", validation: (r) => r.required() }),
    defineField({ name: "text", title: "Begleittext", type: "text", rows: 3 }),
  ],
  preview: { select: { title: "titel", media: "bild" }, prepare: ({ title, media }) => ({ title: title || "Bild", media }) },
});

export const kontaktBaustein = defineType({
  name: "kontaktBaustein",
  title: "Kontakt",
  type: "object",
  description: "Adresse, Telefon, E-Mail, Öffnungszeiten und Routenlink kommen aus den Praxisdaten.",
  fields: [
    ...kopf,
    defineField({ name: "einleitung", title: "Einleitung", type: "text", rows: 2 }),
    defineField({ name: "anfahrt", title: "Anfahrt", type: "richText" }),
    defineField({ name: "mitKarte", title: "Karte anbieten (nur nach Einwilligung)", type: "boolean", initialValue: true }),
    defineField({ name: "mitFormular", title: "Kontaktanfrage anbieten (E-Mail vorbereiten)", type: "boolean", initialValue: true }),
  ],
  preview: { select: { title: "titel" }, prepare: ({ title }) => ({ title: title || "Kontakt" }) },
});

export const aufrufBaustein = defineType({
  name: "aufrufBaustein",
  title: "Handlungsaufforderung",
  type: "object",
  fields: [
    ...kopf,
    defineField({ name: "text", title: "Text", type: "text", rows: 2 }),
    defineField({ name: "knopf", title: "Knopf", type: "link", validation: (r) => r.required() }),
    defineField({ name: "zweiterKnopf", title: "Zweiter Knopf", type: "link" }),
  ],
  preview: { select: { title: "titel", subtitle: "knopf.titel" }, prepare: ({ title, subtitle }) => ({ title: title || "Handlungsaufforderung", subtitle }) },
});

export const rechtstextBaustein = defineType({
  name: "rechtstextBaustein",
  title: "Rechtstext",
  type: "object",
  fields: [defineField({ name: "rechtstext", title: "Rechtstext", type: "reference", to: [{ type: "rechtstext" }], validation: (r) => r.required() })],
  preview: { select: { title: "rechtstext.titel" }, prepare: ({ title }) => ({ title: title || "Rechtstext" }) },
});

export const bausteine = [textBaustein, hinweisBaustein, behandlungenBaustein, teamBaustein, downloadsBaustein, galerieBaustein, bildBaustein, kontaktBaustein, aufrufBaustein, rechtstextBaustein];
export const bausteinMitglieder = bausteine.map((b) => defineArrayMember({ type: b.name }));
