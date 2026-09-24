# Übergabe – praxis-zuerichberg-website

## Links

- Demo (GitHub Pages, noindex): https://nick8952.github.io/praxis-zuerichberg-website/ → `/de/` · Englisch: `/en/`
- Vercel (seit 24.09.2026, von Nick angelegt, lokale Inhalte, noindex): https://praxis-zuerichberg-website.vercel.app/ → `/de/`
- Repository: https://github.com/Nick8952/praxis-zuerichberg-website
- Verantwortlich für die Demo: Nick Holzbecher (Impressum); dargestellte Praxis: Praxis am Zürichberg, PD Dr. med. dent. Andreas Bindl,
  Attenhoferstrasse 8a, 8032 Zürich, 044 261 33 30, info@praxiszuerichberg.ch

## Was fertig ist

- Statische, zweisprachige Demo: Start, Praxis, Behandlungen (16 Akkordeons), Team (3 Personen, 2 Lebensläufe), Patienteninformationen (7 PDFs),
  Kontakt (Karte nach Einwilligung, E-Mail-Vorbereitung), Impressum, Datenschutzerklärung, Datenschutz-Einstellungen, 404 – je in DE und EN.
- Nur belegte Inhalte (`docs/INHALTSINVENTUR.md`); medizinische Texte wörtlich, Abweichungen in `docs/MEDIZINISCHE-TEXTE.md`.
- Echter Cookie-/Einwilligungsbanner (Google Maps), keine Cookies, keine externen Requests vor Einwilligung (`docs/PRUEFBERICHT.md`).
- Sanity-Schemas (zweisprachig, Prüffelder), Sanity-Adapter, Studio-Konfiguration, Seed-Skript, Vercel-Routen: **vorbereitet, nicht angeschlossen**.

## Nur vorbereitet – erst nach Einrichtung überprüfbar (CMS-Funktionen)

Sanity Studio (`/studio`, Bereiche Deutsch/English), GROQ-Abfragen, Übersetzungs-Zuordnung im Studio, Draft-Vorschau/Visual Editing,
Webhook-Revalidierung, Seed-Upload inkl. Bilder/PDFs, Sanity-CDN-Bilder, Vercel-Build in der Cloud, `/`-Redirect auf Vercel.
Im Code als «VORBEREITET» kommentiert (`lib/content/sanity.ts`, `server-routes/`, `sanity/`).

## Offene Praxisangaben (bei der Praxis abfragen)

1. **Öffnungszeiten bestätigen** (Demo zeigt Google-Profil: Mo–Fr 08.00–12.00 / 13.00–17.00, Sa/So geschlossen, mit sichtbarem Hinweis; **nicht** im JSON-LD). Danach `oeffnungszeitenHinweis` leeren – erst dann erscheinen die Zeiten auch als strukturierte Daten.
2. **Team bestätigen**: DE nannte Ruwen Friedl, EN «Anne Buttin-Fasel» (gleiches Foto). Demo zeigt Friedl in beiden Sprachen. Aktuelle Besetzung, Funktionen, Sprachen, Bildfreigaben (Teamfotos Stand 2020).
3. **Preise/Taxpunktwert**: alte Werte (CHF 3.90 Bindl, CHF 3.70 Dr. Deak, Obergrenze Fr. 5.80) nicht übernommen; gültige Angaben oder Verzicht.
4. **Allgemeine Bedingungen (PDF, 2015)**: nennt Dr. Deak und alte Taxpunktwerte → aktualisieren oder entfernen. PDF-Metadaten «Thomas Muster» in 6 Dateien bereinigen.
5. **Zahnunfall.pdf**: Faltblatt der Gesundheitsdirektion Kanton Zürich – Weiterverbreitung erlaubt? Aktuelle Version?
6. **E-Mail-Adresse**: `info@praxiszuerichberg.ch` (alte Site zeigte zusätzlich eine Umlaut-Domain-Variante) – gültig?
7. **Rechtsform, UID, kantonale Praxisbewilligung, Inhaberschaft** für das Impressum (nicht erfunden, Zefix nicht abfragbar).
8. **Bildrechte** an Praxisfotos (2018), Teamfotos, Logo und SSO-Signet (Fotograf? Nutzungsrecht?).
9. **SSO-Mitgliedschaft** aktuell? (nur von der Website übernommen).
10. Wunsch nach **Google-Bewertungen**, **Online-Terminbuchung**, Notfall-/Ferienregelung, Kassen-/Zahlungsinfos, Barrierefreiheit der Praxis – nur wenn bestätigt.
11. Medizinische **Freigabe aller Behandlungstexte** durch PD Dr. Bindl (`docs/MEDIZINISCHE-TEXTE.md`), inkl. Gruppierung und der beiden Hinweise.

## Rechtlich/medizinisch zu prüfen (nicht anwaltlich geprüft)

- Impressum: für die Demo nur Name + E-Mail der verantwortlichen Person, Praxis als «dargestellte Praxis». Beim Go-Live vollständige Praxisangaben.
- Datenschutzerklärung: GitHub-Pages-Hosting (USA), Google Maps nach Einwilligung, lokale Einwilligungsspeicherung, mailto-Formular, Hinweis
  «keine Gesundheitsdaten über diese Website», Betroffenenrechte nach DSG. Beim Umzug auf Vercel/Sanity neu fassen (`docs/UMSTELLUNG-VERCEL.md`).
- Heilmittel-/Werberecht: Texte enthalten keine Heilversprechen; «Mitglied SSO» und Titel nur von der Website übernommen.
- Urheberrecht an Fotos/Logo/PDFs vor Go-Live klären.
- **Rechtsgrundlagen** in der Datenschutzerklärung: bewusst **keine** genannt (die frühere Formulierung «berechtigtes Interesse» für die
  GitHub-Protokolle wurde am 23.09. entfernt, weil sie ungeprüft war). Ob und welche Rechtsgrundlagen (DSG/DSGVO) für die produktive
  Praxis-Website anzugeben sind, klärt die Praxis bzw. ihre Rechtsberatung.
- **Content-Security-Policy**: GitHub Pages erlaubt keine eigenen HTTP-Header → keine CSP in der Demo. Beim Wechsel auf Vercel CSP-Header
  setzen (`frame-src https://www.google.com` nur für die Karte, Next-Inline-Skripte per Nonce/Hash) – siehe `docs/UMSTELLUNG-VERCEL.md`.

## Unabhängige Übergabe an die Praxis

- **Code**: Repository übertragen (GitHub → Settings → Transfer) oder als ZIP; alles Nötige liegt im Repo, keine Geheimnisse, keine Patientendaten.
- **Inhalte**: heute `data/**/*.json` (Backup = Git-Historie). Nach Sanity-Einrichtung: `npx sanity@latest dataset export production` regelmässig
  als Backup; Praxis als Sanity-Editor, Projekt übertragbar.
- **Hosting**: GitHub Pages (kostenlos, statisch) oder später Vercel (für eine Praxis Pro-Plan prüfen) mit Kundendomain.
- **Abhängigkeiten (Stand 23.09.2026)**: Next 16.3.6, Sanity 6.16. `npm audit` meldet 15 Befunde (3 hoch) ausschliesslich in der Sanity-CLI-/Build-
  Werkzeugkette (adm-zip, js-yaml, smol-toml, uuid über `@sanity/cli`); der statische GitHub-Pages-Export enthält davon nichts. Der von npm
  vorgeschlagene «Fix» wäre ein Major-Downgrade (sanity 5) – nicht angewendet; bei der Sanity-Einrichtung auf aktuelle Sanity-Version prüfen.
- **Wartung**: `npm outdated` / `npm update` quartalsweise; Next.js-Major-Updates gezielt mit Build + Prüfskripten. Node ≥ 20.9.
  Prüfbefehle: `npm run inhalt:pruefen && npm run lint && npm run typecheck && npm run build:pages && npm run export:pruefen`.
- **Backup**: Repo klonen genügt (Originale in `assets/originale/`, PDFs in `public/downloads/`).
