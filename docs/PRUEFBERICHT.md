# Prüfbericht – praxis-zuerichberg-website (Stand 21.09.2026)

Alle Browser-Tests sind **Geräte-Emulation** (Chrome headless via puppeteer-core gegen `npm run vorschau:pages`, Viewports 360/390/768/1440,
`isMobile` + `hasTouch` bei < 500 px). **Keine Tests auf echten Geräten (iOS Safari, Android Chrome) und kein echter Screenreader
(VoiceOver/NVDA)** – offen. Prüfskripte lagen im Scratchpad der Erstellungssitzung (`pzb-pruefen.mjs`, `pzb-shots2.mjs`, `pzb-widerruf.mjs`);
Ablauf unten beschrieben, damit er wiederholbar ist.

## Build und Export

| Prüfung | Ergebnis |
|---|---|
| `npm run typecheck`, `npm run lint` | fehlerfrei |
| `npm run inhalt:pruefen` | 18 Seiten (9 Paare), 32 Behandlungen, 6 Teamprofile, 14 Downloads, 4 Rechtstexte; Sprachpaare, interne Links, Hash-Anker, Öffnungszeiten-Intervalle in Ordnung |
| `npm run build:pages` **ohne jede Env-Variable** | 22 HTML-Dateien (18 Seiten, Wurzel-Weiterleitung, 404, _not-found, icon); Wurzel-Canonical absolut, noindex |
| `npm run export:pruefen` | 847 interne Verweise unter `/praxis-zuerichberg-website`, keine fehlenden Ziele, keine externen Ressourcen, noindex überall, `<html lang>` je Ordner korrekt, Canonicals absolut, hreflang inkl. x-default auf allen Sprachseiten |
| `INDEXIERUNG=1 node scripts/export-pruefen.mjs` gegen den Demo-Export | meldet erwartungsgemäss «noindex trotz INDEXIERUNG=1» (Prüfer erkennt beide Zustände) |
| `npm run seed -- --probe` | 77 Dokumente (1 Einstellungen, 2 Texte, 18 Seiten, 32 Behandlungen, 6 Team, 14 Downloads, 4 Rechtstexte) + 10 Bilder + 7 PDFs ohne Schreibzugriff zusammengestellt |
| `npm run build:vercel` (Platzhalter-Projekt-ID, lokale Inhalte) | kompiliert: `/de`, `/en`, 16 Unterseiten, `/api/revalidate`, `/api/vorschau/*` (dynamisch), `/studio/[[...tool]]` – nur lokal, nicht auf Vercel |

## GitHub Pages (live, 21.09.2026)

- Workflow `.github/workflows/pages.yml` (Inhalte → Lint → Typecheck → Build → Export-Check → Deploy) erfolgreich; Pages per API mit `build_type=workflow` aktiviert.
- Direktaufruf ohne Login (anonymes `curl`): `/` 200 (Meta-Refresh → `/de/`), `/de/`, `/en/`, `/de/behandlungen/`, `/en/treatments/`,
  `/de/patienteninformationen/`, `/en/privacy-settings/`, `/downloads/PAR.pdf` → 200; `/gibtsnicht/` → 404 mit der gestalteten zweisprachigen Seite.
- Browser (Chrome headless, 390 px): `/` landet auf `/de/`; `<html lang>` de-CH/en korrekt; `/en/treatments/#root-canal-treatment` öffnet genau ein Akkordeon;
  Schrift Source Sans 3 lokal geladen; **vor Einwilligung nur Host `nick8952.github.io`**, 0 Cookies, 0 localStorage; nach «Alle akzeptieren»
  Google-Maps-Iframe + Hosts www.google.com/maps.gstatic.com/maps.googleapis.com; Widerruf im Footer → 0 Iframes, Speicher gelöscht, Banner zurück;
  keine Konsolenfehler.

## Layout (360 / 390 / 768 / 1440)

- 19 Seiten (9 DE, 9 EN, 404) × 4 Breiten: kein horizontales Scrollen (`scrollWidth` = `clientWidth`), keine Elemente über den Viewport hinaus.
  Behoben: Titel «Patienteninformationen» lief bei 360 px über → `hyphens: auto` (ab 14 Zeichen) nur für `h1`.
- Touch-Ziele: alle Knöpfe/Links ≥ 44 × 44 px. Behoben: Sprachwechsel (41 px), Footer-Link «Team» (41 px), 404-Links (42 px).
  Bewusste Ausnahmen: Skip-Link (1 × 1 px bis Fokus), Links im Fliesstext der Rechtstexte, die Checkbox im Einwilligungsdialog (24 px, liegt in
  einem 44-px-Label, das die Klickfläche bildet).
- Screenshots aller Seiten visuell geprüft (Ganzseite mit Viewport = Seitenhöhe, damit lazy-Bilder und `view()`-Reveals geladen sind).
  Behoben: Team-Karte «Ruwen Friedl» (Foto 365 × 341) dehnte den 4:3-Rahmen → `overflow-hidden`; viertes Galeriebild stand als Waise → breiter
  Streifen (`3:1`); Dialogtitel «Datenschutz-Einstellungen» wurde bei 390 px getrennt → Trennung auf `h1` beschränkt.
- Zoom-200-%-Simulation (720 px Viewport, Behandlungen): kein Überlauf.

## Funktionen

| Funktion | Ergebnis |
|---|---|
| Sprachwechsel | `/de/behandlungen/` → `/en/treatments/`, `/en/patient-information/` → `/de/patienteninformationen/`, `/de/` → `/en/` (über Übersetzungsschlüssel); ohne Gegenstück sichtbar «EN – Startseite» (derzeit haben alle Seiten ein Gegenstück) |
| Mobilmenü (`<dialog>`) | öffnet per Knopf, Fokus im Dialog, Esc schliesst, Fokus kehrt zu «Menü öffnen» zurück; Sprachlink 81 × 44 px |
| Behandlungs-Akkordeons | `#wurzelbehandlungen` öffnet genau 1 von 16, Fokus auf `summary`; «Alle öffnen» öffnet 16; ungültiger Hash (`#%`) bricht nicht ab |
| Team-Lebensläufe | `<details>` mit Jahres-Tabellen (zeitleiste) |
| Downloads | 7 PDFs, Grösse aus der Datei, `download`-Attribut, Hinweise (AGB 2015, Zahnunfall Fremddokument, EN «German only») |
| Kontaktformular | Pflichtfeld «Name» leer → `role=alert` «Bitte geben Sie Ihren Namen an.», `aria-invalid`, Fokus auf Feld; mit Angaben → `mailto:` an info@praxiszuerichberg.ch mit Betreff/Body, kein Versand, kein Speicher; Warnung «keine medizinischen Angaben» sichtbar |
| Telefon-/Routen-/E-Mail-Links, Adresse kopieren | `tel:+41442613330`, Google-Maps-Route (neuer Tab, `rel="noopener noreferrer"`), `mailto:`; Clipboard-Kopie mit Statusmeldung |
| Alle internen Links | 66 Ziele gesammelt, kaputt: 0 |
| Tastatur | Skip-Link → Wortmarke → Praxis → Behandlungen → Team → Patienteninformationen → Kontakt → EN → Telefon; sichtbarer Fokus (3 px Outline) überall |
| Reduzierte Bewegung | `prefers-reduced-motion: reduce`: Hero `animation: none`, Scroll-Reveal `none`; ohne: `auftauchen` + `animation-timeline: view()` |
| 404 | `out/404.html` zweisprachig, eine `h1` (unsichtbar, beide Titel), je Sprache `h2` + Einstiege, Telefon |
| Konsole | keine Fehler ausser dem erwarteten 404 bei `/gibtsnicht/` |

## Einwilligung und Datenschutztechnik (alle Zustände)

| Zustand | Ergebnis |
|---|---|
| Vor jeder Interaktion (alle 19 Seiten) | **0 externe Requests**, 0 Cookies, 0 localStorage; kein `<iframe>`, kein preconnect/dns-prefetch zu Google |
| Banner | drei gleichwertige Knöpfe «Alle akzeptieren / Nur notwendige / Einstellungen», Link Datenschutzerklärung; nichts vorausgewählt |
| Dialog «Einstellungen» (`<dialog>`) | Fokus auf «Schliessen ohne zu speichern», Checkbox «Karte» **unchecked**, Esc schliesst ohne zu speichern (Banner bleibt) |
| «Nur notwendige» | Banner weg, kein iframe, localStorage `{"version":1,"zeitpunkt":…,"kategorien":{"karte":false}}`, extern: keine |
| «Alle akzeptieren» | iframe `https://www.google.com/maps?q=…` erscheint; erst jetzt Requests an www.google.com, maps.gstatic.com, maps.googleapis.com; `karte:true` gespeichert |
| Reload | Entscheidung bleibt (Banner weg, Karte geladen) |
| Widerruf auf `/de/datenschutz-einstellungen/` | localStorage gelöscht, Statusmeldung; auf Kontakt: Banner wieder da, iframe 0, extern keine |
| **Widerruf im Footer** (neu nach Codex-Review) | Knopf erscheint nur bei gespeicherter Einwilligung (44 px hoch); Klick → iframe sofort entfernt, localStorage `null`, Banner wieder sichtbar, Statusmeldung |
| Cookies gesamt | 0 (auch nach Google-Maps-Einbettung im First-Party-Kontext keine eigenen) |

## Kontraste (berechnet)

Aubergine `#663d4a` auf Weiss 9.0:1 · Weiss auf Aubergine 9.0:1 · Grau `#5f6672` auf Weiss 5.9:1, auf Nebel `#f4f4f6` 5.2:1 ·
Lime-dunkel `#7f8400` auf Weiss 4.6:1 (Lime `#cbd300` selbst nie als Text) · Formularrand `#7b818c` auf Weiss 3.6:1 (≥ 3:1) ·
Fokus `#1d5fd1` auf Weiss 5.6:1 · Fehler `#a3282f` auf Weiss 7.3:1.

## SEO-Stichproben im Export

`<html lang="de-CH">`/`"en"` je Ordner; Title/Description je Seite und Sprache verschieden; Canonical absolut; `hreflang` de-CH/en/x-default (x-default → DE,
für EN-only-Seiten die eigene URL); JSON-LD `Dentist` mit Adresse, Telefon, Fax, E-Mail, Geo, Team (`employee`), SSO (`memberOf`) – **ohne** `founder`
(Übernahme 2007, keine Gründung), **ohne** Öffnungszeiten, solange `oeffnungszeitenHinweis` gesetzt ist (unbestätigte Google-Zeiten), **ohne** Bewertungen.
`robots.txt` erlaubt Crawlen, Meta `noindex, nofollow` überall (auch Wurzel-Weiterleitung).

## Vercel-Modus (nur lokal kompiliert)

`npm run build:vercel` mit `CONTENT_SOURCE` leer und Platzhalter-Projekt-ID kompiliert (Studio-Layout jetzt mit eigenem `<html>/<body>`).
Nicht geprüft: Studio, GROQ gegen echte Daten, Draft Mode, Webhook, Seed-Upload, `/`-Redirect auf Vercel.

## Codex-Prüfung (unabhängige Zweitmeinung, nur Lesezugriff)

**Runde 1 – Architektur (vor der Umsetzung):** Empfehlungen umgesetzt: symmetrische `/de/`–`/en/`-Pfade mit statischer Wurzel-Weiterleitung,
Document-level Translation mit `uebersetzungsSchluessel` (kein Slug-Ersetzen), eine Übersichtsseite mit `<details>`-Akkordeons und Hash-Deep-Links
statt dünner Einzelseiten, `[sprache]`-Root-Layout für korrektes `<html lang>`, `dynamicParams=false` ohne kartesische Slugs, Consent in localStorage
ohne preconnect/Vorschaubild, Widerruf ohne Reload, Formular ohne Gesundheitsfelder mit Warnhinweis, Datenschutzerklärung mit GitHub-Pages-Logs/
Google-Maps/mailto, Prüffelder (`quelle`/`pruefstatus`/`freigabedatum`) an medizinischen Inhalten, Export-Test gegen basePath/PDFs/Hash-Links.

**Runde 2 – Implementierung (11 Befunde: 1 Blocker, 7 Wichtig, 3 Klein; plus Anforderungsabgleich und Risikoliste).** Codex bestätigte: Export,
Sprachzuordnung, Consent-Technik (kein Google vor Einwilligung), Formularfelder, individuelle Meta-Daten, lokale Schriften, native Akkordeons/Dialoge,
gemeinsamer Typ-Vertrag lokal/Sanity, Seed-Probe (77 Dokumente, 17 Dateien); `tsc`/ESLint/Prüfskripte liefen in der Sandbox fehlerfrei.
Umgesetzt (9): Studio-Root-Layout mit `<html>/<body>` (Blocker im Vercel-Modus); **direkter Widerruf im Footer** (`components/Widerruf.tsx`);
fehlende Übersetzung im Sprachwechsel **sichtbar** gekennzeichnet («EN – Startseite»), Mobilmenü nutzt dieselbe Komponente; `x-default` auch für
EN-only-Seiten; JSON-LD ohne unbestätigte Öffnungszeiten und ohne `founder`; Wurzel-`index.html` nach dem Export mit absolutem Canonical und
`INDEXIERUNG`-abhängigem robots (`scripts/wurzel-schreiben.mjs`); `decodeURIComponent` im Akkordeon mit `try/catch`; `export-pruefen` prüft jetzt
`<html lang>`, absolute Canonicals, hreflang/x-default und beide `INDEXIERUNG`-Zustände.
Nicht übernommen (2, begründet): `dynamicParams` je Betriebsart – Next verlangt einen statischen Boolean (Build bricht sonst ab, reproduziert);
bleibt `false`, Deploy Hook dokumentiert. Atomare Bildoptimierung (temporärer Ordner) – geringer Nutzen, Skript läuft nur lokal und ist idempotent.
Dokumentiert statt behoben (Risiken C): Behandlungstexte nur `sprachlich-angepasst` (keine fachliche Freigabe) → Freigabeliste in `docs/MEDIZINISCHE-TEXTE.md`;
Formulierungen «schonend und dauerhaft beseitigen» (Philosophie) und «must be performed»/«best seal in the long term» (EN Endodontie) stammen
wörtlich von der Praxis-Website und stehen zur Prüfung; AGB-PDF (2015) bleibt mit Warnhinweis bis die Praxis entscheidet; Freitextfeld kann trotz
Warnung Gesundheitsdaten enthalten – deshalb nur mailto (kein Server), Hinweis am Feld und in der Datenschutzerklärung. Sanity-Schema erzwingt
keine Eindeutigkeit des Übersetzungsschlüssels je Sprache (nur der lokale Prüfer) – im Studio-Abschnitt der Einrichtungsanleitung vermerkt.

## Prüfablauf (wiederholbar)

1. `npm run build:pages && npm run export:pruefen`, dann `PORT=4390 npm run vorschau:pages`.
2. Puppeteer (Chrome headless): je Breite alle Seiten laden, `lang`/`h1`/robots/iframes/Überlauf/kleine Ziele/Alt-Texte prüfen, Request-Log auf fremde Hosts,
   Ganzseiten-Screenshot mit Viewport = Seitenhöhe.
3. Einwilligung durchspielen: Dialog (Fokus, Vorauswahl, Esc), Ablehnen, Zustimmen (iframe/Requests), Reload, Widerruf (Einstellungsseite + Footer).
4. Formular (Pflichtfeld, mailto), Akkordeon per Hash + «Alle öffnen», Sprachwechsel auf drei Seiten, Mobilmenü (Esc/Fokus), Tab-Reihenfolge, Zoom 200 %,
   reduzierte Bewegung, alle Links per HEAD, Konsole.

## Offen

- Tests auf echten Geräten und mit echtem Screenreader.
- Alles, was Sanity/Vercel betrifft (erst nach Einrichtung prüfbar).
- Inhalte, die die Praxis bestätigen muss (`docs/UEBERGABE.md`), medizinische Freigabe (`docs/MEDIZINISCHE-TEXTE.md`).
