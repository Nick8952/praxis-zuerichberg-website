# praxis-zuerichberg-website – Anweisungen für Claude Code und Codex

Zweisprachige (DE/EN) **Verkaufs-Demo** für die **Praxis am Zürichberg, PD Dr. med. dent. Andreas Bindl, Attenhoferstrasse 8a,
8032 Zürich** (Zahnarztpraxis – **keine Fahrschule**). Auftraggeber der Demo: Nick Holzbecher. Kein offizieller Auftritt der Praxis;
keine Praxis-Zugänge, keine Patientendaten. Inhalte ausschliesslich vom bestehenden Webauftritt https://www.praxiszuerichberg.ch/
und vom öffentlichen Google-Unternehmensprofil (siehe `docs/INHALTSINVENTUR.md`). Die Next.js-Agent-Regeln aus `AGENTS.md` gelten zusätzlich:

@AGENTS.md

## Betriebsarten (eine Codebasis, zwei Ziele)

| | **GitHub Pages (JETZT)** | **Vercel + Sanity (SPÄTER)** |
|---|---|---|
| Build | `npm run build:pages` (= `npm run build`) | `npm run build:vercel` |
| Env | **keine nötig** | `DEPLOY_TARGET=vercel`, `CONTENT_SOURCE=sanity`, Sanity-Variablen (`.env.example`) |
| Ausgabe | `out/` statisch, Unterpfad `/praxis-zuerichberg-website`, `trailingSlash` | Server-Rendering, ISR, `/studio`, `/api/*`, Redirect `/` → `/de/` |
| Inhalte | `data/**/*.json` | Sanity Content Lake (nur öffentliche Website-Inhalte, nie Patientendaten) |
| Bilder | `public/images/*` (vorgerechnet, Hash im Namen) | Sanity-CDN via `@sanity/image-url` |
| Status | **live, geprüft** | **vorbereitet, nicht angeschlossen** – erst nach Einrichtung prüfbar |

Umschaltung ausschliesslich über `lib/deploy-ziel.ts` und `next.config.ts`. Sanity-/Vercel-Projekte **nicht** anlegen und keine
Zugänge verlangen – das macht Nick selbst (`docs/SANITY-VERCEL-EINRICHTUNG.md`). Keine Zugangsdaten in Dateien.

## Architektur

- **Next.js 16 App Router, TypeScript, Tailwind v4**, Node ≥ 20.9 (lokal Node 26, CI Node 24). Architektur-Ausgangspunkt (Inhaltsschnittstelle,
  Skripte, Server-Routen, Workflow) war `vm-garage-website`; **Design, Komponenten und Sprachlogik sind eigenständig** (kein CSS/JS daraus).
- **Sprachrouting**: `app/[sprache]/layout.tsx` ist das Root-Layout (setzt `<html lang="de-CH"|"en">`), `app/[sprache]/page.tsx` (Slug `start`),
  `app/[sprache]/[slug]/page.tsx` (`generateStaticParams` aus den echten Seitenpaaren, `dynamicParams = false` – ein englischer Slug existiert
  nie unter `/de/`). `app/global-not-found.tsx` = zweisprachige `out/404.html`. `public/index.html` leitet `/` per Meta-Refresh nach `./de/`.
  Sprachwechsel (`components/Sprachwechsel.tsx`) nur über `uebersetzungsSchluessel` (`app/[sprache]/Seite.tsx`), **nie** per Slug-Ersetzung;
  ohne Gegenstück → Startseite der anderen Sprache mit Hinweis «Diese Seite gibt es nur auf Deutsch».
- **Inhaltsschnittstelle `lib/content/`**: Komponenten importieren nur `lib/content` (Typen + `inhaltsquelle()`). `local.ts` liest `data/`,
  `sanity.ts` fragt GROQ ab – beide liefern dieselben Typen aus `types.ts`. Lokalisierte Dokumente tragen `sprache` + `uebersetzungsSchluessel`
  (Document-level Translation, Codex-Empfehlung). `CONTENT_SOURCE=sanity` ohne Projekt-ID bricht den Build absichtlich ab.
- **Daten**: `data/einstellungen.json` (nicht lokalisiert: Praxis, Adresse, Telefon, Fax, E-Mail, Geo, Öffnungszeiten mit `intervalle`, SSO),
  `data/<sprache>/texte.json` (Navigation, UI, Einwilligung, Formular), `seiten/<slug>.json`, `behandlungen.json` (16, mit `quelle`/`pruefstatus`),
  `team.json`, `downloads.json`, `rechtstexte/{impressum,datenschutz}.json`. Bausteine: text, hinweis, behandlungen, team, downloads, galerie,
  bild, kontakt, aufruf, rechtstext (`components/Bausteine.tsx`). Neuer Baustein = Typ + Sanity-Schema + Fall im Renderer + `inhalt-pruefen` + Seed.
- **Bilder**: Originale in `assets/originale/` (Herkunft + Freigabe: `HERKUNFT.md`), `npm run bilder` → `public/images/` + `data/bilder.json`.
  Ausgabe über `components/Bild.tsx` (`<img srcset>`). Unterpfad nur über `lib/assets.ts#assetUrl`. **Keine Stock-/KI-Bilder als Praxis- oder Teambilder,
  keine Patientenbilder**; die private Landschaftsgalerie von Dr. Bindl wurde bewusst nicht übernommen.
- **Server-Routen** (Studio, Webhook, Vorschau) in `server-routes/app/`, werden nur beim Vercel-Build nach `app/` kopiert (`scripts/vercel-routen.mjs`).
- **Schrift** lokal aus `app/fonts/` (Source Sans 3 Variable, OFL – die Markenschrift des Logos). Kein Google-Fonts-Request.
- **Downloads**: 7 PDFs unter `public/downloads/` (unverändert vom alten Auftritt, alle nur Deutsch; `Zahnunfall.pdf` ist ein Faltblatt der
  Gesundheitsdirektion Kanton Zürich). `local.ts` prüft Existenz/Grösse beim Build.

## Befehle

```bash
npm run dev              # Entwicklung (lokale Inhalte, http://localhost:3000/praxis-zuerichberg-website/de/)
npm run build:pages      # statischer Export nach out/ (ohne Env-Variablen); schreibt zuletzt out/index.html (scripts/wurzel-schreiben.mjs)
npm run export:pruefen   # out/ prüfen: Unterpfad, fehlende Ziele, externe Ressourcen, noindex, erwartete Seiten aus data/
npm run vorschau:pages   # out/ wie GitHub Pages ausliefern (Port 4321; PORT=… falls belegt)
npm run inhalt:pruefen && npm run lint && npm run typecheck   # vor jedem Commit (Sprachpaare, Links, Anker, Öffnungszeiten-Intervalle)
npm run bilder           # Bildvarianten + data/bilder.json
npm run text:konvertieren -- datei.md   # Markdown → Portable Text
npm run build:vercel     # Vercel-Modus (kopiert server-routes → app/; danach räumt build:pages wieder auf)
npm run seed -- --probe  # Import nach Sanity nur simulieren
```

Browser-Prüfung: puppeteer-core im Scratchpad gegen den Vorschau-Server (Ablauf in `docs/PRUEFBERICHT.md`). Für Ganzseiten-Screenshots
den Viewport auf die Seitenhöhe setzen oder `prefers-reduced-motion: reduce` emulieren, sonst wirken die `view()`-Scroll-Reveals wie
fehlender Inhalt und lazy-Bilder bleiben leer.

## Designregeln («Horizont»)

- Herkunft: Logo (Wortmarke in Source Sans, Lime «praxis», graue Bergsilhouette des Zürichbergs), alte Website (Aubergine `#663d4a`,
  Lime `#cbd300`) und die hellen Praxisfotos. Design-Read: Redesign-preserve, vertrauensbildende Gesundheitsseite, auch für ältere
  Menschen und Menschen mit Schmerzen. Dials **VARIANCE 4 · MOTION 2 · DENSITY 4**, helles Thema fest.
- Farben (`app/globals.css`, `@theme static`): Aubergine (Titel, Knöpfe; 9.0:1 auf Weiss), Lime **nur grafisch** (Horizontlinie, Marker, offene
  Akkordeon-Kante – nie als Text auf Weiss; als Text `--color-lime-dunkel` 4.6:1), Tinte `#2a2429`, Grau `#5f6672` (5.9:1), Nebel `#f4f4f6`,
  Fokus `#1d5fd1`. Eine Schriftfamilie, Grundschrift 18 px, Zeilenlänge ≤ 42rem.
- **Signatur**: die Bergsilhouette als `Horizont`-Trennlinie **nur unter dem Hero und über dem Footer**; Lime-Strich über Seitentiteln.
  Behandlungen als native `<details>`-Akkordeons in vier Gruppen mit Hash-Deep-Links (`#wurzelbehandlungen`), Lebensläufe als Jahres-Tabellen.
  Nichts davon in anderen Demos wiederverwenden.
- Bewegung: Hero-Auftauchen, Abschnitte per `animation-timeline: view()`; `prefers-reduced-motion` schaltet alles ab. Kein Scroll-Hijacking,
  keine Countdowns, keine Autoplay-Karussells.
- Touch-Ziele ≥ 44 px (Ausnahme: Links im Fliesstext; Checkbox 24 px in 44-px-Label), sichtbarer Fokus (3 px), Icons nur als Inline-SVG
  (`components/Icons.tsx`), keine Emojis. Lange deutsche Titel dürfen unter 480 px getrennt werden (`hyphens: auto`, ab 14 Zeichen).

## Medizinische Inhalte und Sprachversionen

- Behandlungs-, Team- und Praxistexte sind **wörtlich** übernommen; nur Tippfehler/Orthografie korrigiert – jede Abweichung steht in
  `docs/MEDIZINISCHE-TEXTE.md` (Vorher/Nachher, Freigabe durch die Praxis offen). Keine Heilversprechen, keine erfundenen Behandlungen,
  Qualifikationen, Teammitglieder, Bewertungen, Preise, Öffnungszeiten. Öffnungszeiten stammen vom Google-Profil (Hinweis sichtbar,
  `oeffnungszeitenHinweis`), Bewertungen bewusst nicht übernommen. Kein Symptom-Checker, kein Chatbot.
- DE und EN sind eigenständige Fassungen (die alte Site hatte beide). Schweizer Schreibweise (ss statt ß, «Guillemets»). Fehlende
  Übersetzungen nie als vorhanden ausgeben (Downloads: «nur Deutsch» im Hinweis).
- **Kontakt**: Telefon/E-Mail-Links; Formular = `mailto:`-Vorbereitung «E-Mail vorbereiten» (`components/Anfrageformular.tsx`) mit Name (Pflicht),
  Rückrufnummer, Anliegen, organisatorischer Nachricht. **Keine Gesundheitsdaten, keine Uploads, nichts in localStorage/URL/Repo**, Warnhinweis
  am Formular. Kein eigenes Buchungssystem. Nur fiktive Testdaten verwenden.

## Datenschutz-Technik (Demo)

Google-Maps-Karte (`components/Karte.tsx`) lädt **erst nach Einwilligung**; vorher kein Request, kein preconnect, kein Vorschaubild.
Einwilligung: Banner «Alle akzeptieren / Nur notwendige / Einstellungen» (nichts vorausgewählt), Dialog per `<dialog>`, Speicherung nur in
`localStorage` (`praxis-zuerichberg-einwilligung`, `lib/einwilligung.ts`, Version 1), Widerruf im Footer / auf `datenschutz-einstellungen`
(`components/Widerruf.tsx`) entfernt das Iframe sofort. Keine Cookies, keine Analytics. Kommt ein weiterer Dienst dazu: Kategorie in `KATEGORIEN` + Texte + Datenschutzerklärung.

## SEO

Alle Seiten `noindex, nofollow` (Demo); `robots.txt` erlaubt das Crawlen. Indexierung erst mit `INDEXIERUNG=1` + `SITE_URL` auf der Kundendomain.
Individuelle Title/Description je Seite und Sprache (`seoTitel`/`seoBeschreibung`), Canonical absolut, `hreflang` de-CH/en/x-default (→ de),
JSON-LD `Dentist` (`lib/seo.ts`) nur mit belegten Angaben (Adresse, Telefon, Geo, Team, SSO; Öffnungszeiten aus `intervalle` **erst**, wenn
`oeffnungszeitenHinweis` leer ist = von der Praxis bestätigt) – **kein** `founder` (Übernahme 2007), **kein** `aggregateRating`/`review`. Favicon `app/icon.svg`, gestaltete 404.

## Deployment GitHub Pages

`.github/workflows/pages.yml`: Push auf `main` → `inhalt:pruefen`, `lint`, `typecheck` → `build:pages` → `export:pruefen` → Pages (`build_type=workflow`).
Repo `Nick8952/praxis-zuerichberg-website` (public). Demo-URL: https://nick8952.github.io/praxis-zuerichberg-website/ (→ `/de/`).
Das Repo darf nicht auf privat gestellt werden – sonst ist die Pages-Site weg (Erfahrung aus `vm-garage-website`).

## Dokumentation

`README.md` · `SKILL-ANWENDUNG.md` · `docs/INHALTSINVENTUR.md` · `docs/MEDIZINISCHE-TEXTE.md` · `docs/INHALTE-PFLEGEN.md` ·
`docs/SANITY-VERCEL-EINRICHTUNG.md` · `docs/UMSTELLUNG-VERCEL.md` · `docs/UEBERGABE.md` · `docs/PRUEFBERICHT.md` · `assets/originale/HERKUNFT.md`.
Secrets nur in `.env.local` (ignoriert) bzw. Vercel-Env.
