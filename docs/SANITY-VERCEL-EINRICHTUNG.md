# Spätere Einrichtung: Sanity (CMS) und Vercel (Hosting)

Status: **vorbereitet, nicht eingerichtet.** Nichts in diesem Dokument wurde gegen ein echtes Sanity- oder Vercel-Projekt getestet.
Lokal geprüft (21.09.2026): `npm run build:vercel` kompiliert mit Studio- und API-Routen (Platzhalter-Projekt-ID, lokale Inhalte);
`npm run seed -- --probe` stellt alle Dokumente (Einstellungen, 2× Texte, 18 Seiten, 32 Behandlungen, 6 Teammitglieder, 14 Downloads,
4 Rechtstexte) und die Bilder/PDFs zusammen (kein Schreibzugriff).

Voraussetzungen: Sanity-Konto, Vercel-Konto, Zugriff auf `Nick8952/praxis-zuerichberg-website`. Sanity- und Vercel-Projekt legt Nick an,
sobald die Praxis Interesse zeigt – **eigenes Sanity-Projekt** für diese Praxis, nicht das einer anderen Demo.

**Grundsatz Gesundheitsdaten**: Sanity enthält ausschliesslich öffentliche Website-Inhalte (Texte, Bilder, Öffnungszeiten, Rechtstexte).
Niemals Patientendaten, Terminlisten, Anfragen oder Formulareingaben in Sanity, Vercel-Logs oder im Repo speichern.

## 1. Sanity-Projekt anlegen

1. `npx sanity@latest login` (Browser-Login).
2. Projekt anlegen: https://www.sanity.io/manage → *Create project* → Name «Praxis am Zürichberg», Dataset `production`
   (public genügt: nur veröffentlichte Website-Inhalte).
3. Projekt-ID notieren.
4. Tokens unter *API → Tokens*: `Viewer` → `SANITY_API_READ_TOKEN` (Vorschau); `Editor` → `SANITY_API_WRITE_TOKEN` (nur für den Import, danach löschen).
5. CORS unter *API → CORS origins*: `http://localhost:3000` (Allow credentials) und später die Vercel-/Kundendomain.

## 2. Lokal verbinden

```bash
cp .env.example .env.local
# DEPLOY_TARGET=vercel, CONTENT_SOURCE=sanity, NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET=production,
# SANITY_API_READ_TOKEN, SANITY_API_WRITE_TOKEN, SANITY_REVALIDATE_SECRET (frei wählen: openssl rand -hex 24)
```

## 3. Inhalte importieren

```bash
npm run seed -- --probe   # zeigt, was angelegt würde – zuerst ausführen
npm run seed              # legt nur fehlende Dokumente an, überschreibt nichts
npm run seed -- --force   # ersetzt die vom Skript verwalteten Dokumente (nur bewusst)
```

Deterministische IDs (`einstellungen`, `texte-<sprache>`, `seite-<sprache>-<slug>`, `behandlung-<sprache>-…`, `team-<sprache>-…`,
`download-<sprache>-…`, `rechtstext-<sprache>-<art>`), `_key`-Werte unverändert aus `data/`. Bilder und PDFs werden als Assets hochgeladen
(Sanity dedupliziert per Hash). Dokumente werden **direkt veröffentlicht**. Die Felder `quelle`/`pruefstatus`/`freigabedatum` der
Behandlungen wandern mit – im Studio als Gruppe «Prüfung».

## 4. Studio lokal prüfen

```bash
npm run dev:vercel      # Studio: http://localhost:3000/studio
```

Struktur (`sanity.config.ts`): «Einstellungen» (Einzeldokument), dann je Sprache **Deutsch** / **English** mit Texten, Seiten,
Behandlungen, Team, Downloads, Rechtstexten. Deutsche Oberfläche (`@sanity/locale-de-de`). Lokalisierte Dokumente tragen `sprache`
(schreibgeschützt) und `uebersetzungsSchluessel` – für eine neue Seite in beiden Sprachen denselben Schlüssel eintragen; die Validierung
verlangt ihn.

## 5. Vercel-Projekt

1. https://vercel.com/new → Repo importieren (Next.js wird erkannt).
2. **Build Command**: `npm run build:vercel`.
3. Environment Variables (Production + Preview): `DEPLOY_TARGET=vercel`, `CONTENT_SOURCE=sanity`, `NEXT_PUBLIC_SANITY_PROJECT_ID`,
   `NEXT_PUBLIC_SANITY_DATASET`, `NEXT_PUBLIC_SANITY_API_VERSION=2026-09-21`, `SANITY_API_READ_TOKEN`, `SANITY_REVALIDATE_SECRET`,
   `SITE_URL=https://<projekt>.vercel.app`. **Kein** `BASE_PATH`, **kein** `INDEXIERUNG` (bleibt noindex bis Go-Live).
4. Deploy; prüfen: `/` → `/de/` (Redirect aus `next.config.ts`), alle `/de/…`- und `/en/…`-Seiten, `/studio` (Login),
   `/api/revalidate` (POST ohne Signatur → 401).
5. Sanity-CORS um die Vercel-Domain ergänzen, sonst lädt das Studio nicht.

## 6. Vorschau und Visual Editing

- Presentation-Tool in `sanity.config.ts`, Draft Mode über `/api/vorschau/aktivieren` (Geheimnisprüfung durch next-sanity) und `/api/vorschau/beenden`.
  Entwürfe werden ungecacht mit Perspektive `drafts` gelesen (`lib/content/sanity.ts`).
- Overlay `lib/vorschau/VorschauWerkzeuge.tsx` (nur Vercel + Draft Mode). Stega-Markierungen werden in Metadaten/JSON-LD entfernt (`jsonLdSicher`).
- Im statischen Export wird `next-sanity/visual-editing` durch einen Stub ersetzt (`next.config.ts`, `turbopack.resolveAlias`).

## 7. Inhaltsaktualisierung (ISR + Webhook)

- Sanity → *API → Webhooks → Create*: URL `https://<domain>/api/revalidate`, Dataset `production`, Trigger Create/Update/Delete,
  Projection `{_type}`, POST, **Secret = `SANITY_REVALIDATE_SECRET`**. Der Handler invalidiert das Cache-Tag `inhalt`.
- **Neue Seiten (neue Slugs)**: `app/[sprache]/[slug]/page.tsx` hat `dynamicParams = false` (nötig für den Export). Auf Vercel erscheinen neue
  Slugs erst nach einem Rebuild → Vercel *Deploy Hook* als zweiten Sanity-Webhook (`_type == "seite"`) eintragen, oder `dynamicParams = true`,
  sobald der GitHub-Pages-Export nicht mehr gebraucht wird.

## 8. Zugriffsrechte

- Sanity → *Members*: Praxis (z. B. Praxissekretariat) als **Editor** einladen (Inhalte pflegen, keine Schemas/Tokens). Nick bleibt Administrator;
  für die endgültige Übergabe Projekt an eine Organisation der Praxis übertragen.
- Vercel: Praxis optional als Member; Domain siehe `docs/UMSTELLUNG-VERCEL.md`.

## 9. Erst nach der Einrichtung überprüfbar

GROQ-Abfragen gegen echte Daten (insbesondere die `select(count(...) > 0 => refs, alle)`-Projektionen für Behandlungen/Team/Downloads),
Studio-Validierungen, Presentation-Tool, Draft Mode, Webhook-Signaturprüfung, Seed-Upload (nur `--probe` geprüft), Sanity-Bild-URLs
(`sanity/bild.ts`), PDF-Assets als `file`-Feld, Sprachstruktur im Studio.
