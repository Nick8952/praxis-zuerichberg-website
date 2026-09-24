"use client";
/**
 * Sanity Studio – wird unter /studio eingebettet, sobald DEPLOY_TARGET=vercel gesetzt ist
 * (siehe server-routes/app/studio). In der GitHub-Pages-Demo ist das Studio nicht enthalten.
 * Status: vorbereitet, nicht gegen ein echtes Projekt getestet.
 * Struktur: getrennte Bereiche «Deutsch» und «English», damit die Praxis je Sprache pflegt.
 */
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { presentationTool, defineLocations } from "sanity/presentation";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./sanity/schemas";
import { apiVersion, dataset, projectId, studioUrl } from "./sanity/env";
import { deDELocale } from "@sanity/locale-de-de";

const LOKALISIERT = [
  ["seite", "Seiten"],
  ["behandlung", "Behandlungen"],
  ["teammitglied", "Team"],
  ["download", "Downloads (PDF)"],
  ["rechtstext", "Rechtstexte"],
] as const;

export default defineConfig({
  name: "praxis-zuerichberg",
  title: "Praxis am Zürichberg – Inhalte",
  basePath: studioUrl,
  projectId,
  dataset,
  schema: { types: schemaTypes },
  plugins: [
    deDELocale(),
    structureTool({
      structure: (S) =>
        S.list()
          .title("Inhalte")
          .items([
            S.listItem().title("Praxisdaten").id("einstellungen").child(S.document().schemaType("einstellungen").documentId("einstellungen")),
            S.divider(),
            ...(["de", "en"] as const).map((sprache) =>
              S.listItem()
                .title(sprache === "de" ? "Deutsch" : "English")
                .id(`sprache-${sprache}`)
                .child(
                  S.list()
                    .title(sprache === "de" ? "Deutsch" : "English")
                    .items([
                      S.listItem().title("Website-Texte").id(`texte-${sprache}`).child(S.document().schemaType("texte").documentId(`texte-${sprache}`)),
                      ...LOKALISIERT.map(([typ, titel]) =>
                        S.listItem()
                          .title(titel)
                          .id(`${typ}-${sprache}`)
                          .child(S.documentTypeList(typ).title(`${titel} (${sprache})`).filter(`_type == $typ && sprache == $sprache`).params({ typ, sprache })),
                      ),
                    ]),
                ),
            ),
          ]),
    }),
    presentationTool({
      previewUrl: { previewMode: { enable: "/api/vorschau/aktivieren/", disable: "/api/vorschau/beenden/" } },
      resolve: {
        mainDocuments: [{ route: "/:sprache/:slug", filter: `_type == "seite" && sprache == $sprache && slug.current == $slug` }, { route: "/:sprache", filter: `_type == "seite" && sprache == $sprache && slug.current == "start"` }],
        locations: {
          seite: defineLocations({
            select: { titel: "titel", slug: "slug.current", sprache: "sprache" },
            resolve: (doc) => ({ locations: [{ title: doc?.titel ?? "Seite", href: doc?.slug === "start" ? `/${doc?.sprache ?? "de"}/` : `/${doc?.sprache ?? "de"}/${doc?.slug ?? ""}/` }] }),
          }),
          behandlung: defineLocations({
            select: { titel: "titel", sprache: "sprache", anker: "anker.current" },
            resolve: (doc) => ({ locations: [{ title: doc?.titel ?? "Behandlung", href: `/${doc?.sprache ?? "de"}/${doc?.sprache === "en" ? "treatments" : "behandlungen"}/#${doc?.anker ?? ""}` }] }),
          }),
          teammitglied: defineLocations({
            select: { nachname: "nachname", sprache: "sprache" },
            resolve: (doc) => ({ locations: [{ title: doc?.nachname ?? "Team", href: `/${doc?.sprache ?? "de"}/team/` }] }),
          }),
          rechtstext: defineLocations({
            select: { art: "art", titel: "titel", sprache: "sprache" },
            resolve: (doc) => ({ locations: [{ title: doc?.titel ?? "Rechtstext", href: `/${doc?.sprache ?? "de"}/${doc?.art === "datenschutz" ? (doc?.sprache === "en" ? "privacy" : "datenschutz") : doc?.sprache === "en" ? "legal-notice" : "impressum"}/` }] }),
          }),
          einstellungen: defineLocations({ message: "Praxisdaten wirken auf allen Seiten.", locations: [{ title: "Startseite (DE)", href: "/de/" }, { title: "Kontakt (DE)", href: "/de/kontakt/" }] }),
        },
      },
    }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
  document: {
    actions: (prev, ctx) => (["einstellungen", "texte"].includes(ctx.schemaType) ? prev.filter((a) => !["duplicate", "delete", "unpublish"].includes(a.action ?? "")) : prev),
  },
});
