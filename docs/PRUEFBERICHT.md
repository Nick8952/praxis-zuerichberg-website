# Prüfbericht – praxis-zuerichberg-website (Stand 21.09.2026, Nachprüfung 23.09.2026)

Alle Browser-Tests sind **Geräte-Emulation** (Chrome headless via puppeteer-core gegen `npm run vorschau:pages`, Viewports 360/390/768/1440,
`isMobile` + `hasTouch` bei < 500 px). **Keine Tests auf echten Geräten (iOS Safari, Android Chrome) und kein echter Screenreader
(VoiceOver/NVDA)** – offen. Prüfskripte lagen im Scratchpad der Erstellungssitzung (`pzb-pruefen.mjs`, `pzb-shots2.mjs`, `pzb-widerruf.mjs`);
Ablauf unten beschrieben, damit er wiederholbar ist.

## Nachprüfung 23.09.2026 (Auftrag erneut vollständig gegengeprüft)

Wieder **Geräte-Emulation** (Chrome headless, puppeteer-core im Scratchpad, `npm run vorschau:pages` auf Port 4390) – keine echten Geräte,
kein echter Screenreader.

**Originalseite erneut abgerufen:** Struktur unverändert (Einseiter `index.html`/`index_en.html`, keine weiteren Seiten, `sitemap.xml`/Impressum-
URLs 404); Kerndaten bestätigt (Name, PD Dr. med. dent. Andreas Bindl, Attenhoferstrasse 8a, 8032 Zürich, 044 261 33 30, Fax 044 261 33 29,
info@praxiszuerichberg.ch); alle 7 PDFs **byte-gleich** (SHA-1) mit `public/downloads/`. Programmatischer Satz-Abgleich (DE 139 / EN 146 Sätze,
Trigramm-Abdeckung): alle Sätze in der Demo vorhanden; Abweichungen nur dokumentierte Korrekturen, Satzteilungen und die bewusst
weggelassenen Taxpunktwerte/Dr. Deak.

**Gefunden und behoben**

| Befund | Wirkung | Behebung | Nachweis |
|---|---|---|---|
| Fixierter Einwilligungsbanner verdeckte bei 360 px **17 Fokusziele vollständig** und die Fusszeilen-Links (Impressum/Datenschutz/Einstellungen lagen bei 661 px, Banner ab 416 px) | WCAG 2.4.11, Rechtstexte nicht erreichbar, solange keine Wahl getroffen | Banner misst seine Höhe (`ResizeObserver`) → `--banner-hoehe` → `scroll-padding-bottom` + `body` `padding-bottom`; wird beim Schliessen entfernt | Tab-Durchlauf 360 px: «Fokus komplett verdeckt: nie»; Fusszeile 337 px < Banner 416 px; alte Live-Version reproduziert den Fehler |
| Hero-Bild: Alt-Text «Blick vom Zürichberg über Zürich auf die Alpen», gezeigt wurde aber der **Behandlungsraum** (`bg_page_2/4/5` beim Import vertauscht) | falsche Bildbeschreibung für Screenreader, falsche Herkunftsliste | Zuordnung in `scripts/bilder-optimieren.mjs` berichtigt, Hero nutzt `panorama-arbeitsplatz` mit korrektem Alt-Text (DE/EN), `HERKUNFT.md` + Inventur korrigiert | Kontaktbogen aller Originale geprüft; Datei-Hashes bestätigen die Vertauschung |
| Hero-Unterzeile «…: schonend, dauerhaft und gemeinsam mit Ihnen geplant» | medizinische Verstärkung (neu verfasst, nicht dokumentiert) | neutrale Zeile: Adresse + wörtliches Spektrum; Vorher/Nachher in `MEDIZINISCHE-TEXTE.md` | Suchlauf nach Versprechens-Wörtern: übrige Treffer sind Originaltext |
| Grosse Browserschrift (Chrome «sehr gross» 24 px / 32 px) auf 390 px: Kontaktliste, Downloads, Lebensläufe, Behandlungs-Kurzliste, E-Mail-Adresse liefen seitlich über (bis 550 px) | WCAG 1.4.4/1.4.10 für ältere Menschen | `body { overflow-wrap: anywhere }` (wirkt nur, wenn ein Wort nicht passt), Lebenslauf-Tabelle stapelt unter 22rem | CDP `Page.setFontSizes` 24/32 px bei 390 und 1440 px sowie 320 px: 0 Überlauf auf 7 Seiten |
| Codex-Befunde (siehe unten) | | umgesetzt | |

**Erneut bestanden** (nach allen Änderungen): `inhalt:pruefen`, `lint`, `typecheck`, `build:pages` **ohne Env**, `export:pruefen` (22 HTML, 847 Verweise);
18 Seiten × 360/390/768/1440: kein horizontaler Überlauf, genau eine `h1`, `noindex`, keine kaputten Bilder/fehlenden Alt-Texte, 0 externe Hosts,
0 Konsolenfehler, 0 Cookies/localStorage vor Einwilligung; Touch-Ziele ≥ 44 px (einzige Ausnahme weiterhin die 24-px-Checkbox im 44-px-Label).
Einwilligung: Dialog mit Fokus auf «Schliessen ohne zu speichern», nichts vorausgewählt, Esc; «Nur notwendige» → kein Iframe/keine Requests;
«Alle akzeptieren» → Karte + Google-Hosts; Reload behält Wahl; Footer-Widerruf entfernt Iframe und Speicher, Banner kehrt zurück; Kategorie
einzeln wählen → Karte. Formular (Pflichtfeld/`role=alert`/`aria-invalid`, kein Upload, «E-Mail vorbereiten»), Sprachwechsel auf 4 Seitenpaaren,
Hash-Akkordeon, Mobilmenü (Esc → Fokus zurück). `build:vercel` mit Platzhalter-ID kompiliert, `seed --probe` läuft.
Abhängigkeiten: Next 16.3.5 → 16.3.6, Sanity 6.13 → 6.16 (Patch/Minor); `npm audit`-Befunde nur in der Sanity-CLI-Kette (siehe `UEBERGABE.md`).

**Codex Runde 3 (Implementierung, nur Lesezugriff):** keine Blocker; 6 «Wichtig», 3 «Klein». Umgesetzt: gleichwertige Banner-Knöpfe (alle drei
gleich gestaltet); ungeprüfte Rechtsgrundlage «berechtigtes Interesse» aus der Datenschutzerklärung entfernt (DE/EN); Hinweise auf einen
Zenfolio-Link entfernt, den es in der Demo nicht gibt (Impressum/Datenschutz DE/EN); JSON-LD-Bild-URL im Sanity-Modus (absolute CDN-URL nicht
doppelt präfixieren); Lebensläufe: Zwischentitel als `h4` unter dem Namen (`h3`), Zeitraum als `<th scope="row">`; Sanity-Linkregel auch für Links
im Fliesstext; `memberOf` (SSO) aus dem Praxis-JSON-LD entfernt (belegt ist nur «Andreas Bindl, Mitglied SSO», steht in seiner `jobTitle`).
Dokumentiert statt behoben: keine CSP auf GitHub Pages möglich → Header-Vorgabe für Vercel in `UMSTELLUNG-VERCEL.md`. Befund «noch nicht deployt»
erledigt sich mit dem Push.

**Codex Runde 4 (Review der Korrekturen, nur Lesezugriff):** keine Blocker, keine wichtigen Regressionen; bestätigt: Befunde 2–6 und Klein 1/3
korrekt behoben, Banner-Effekt räumt sauber auf, keine SSR-/Hydration-Probleme, Tabellen-Semantik, JSON-LD, Sanity-Validierung, Texte und
Hero-Alt-Text sachlich plausibel. Ein kleiner Hinweis: globales `overflow-wrap: anywhere` kann Navigation/Knöpfe mitten im Wort umbrechen →
für `header nav` zurückgesetzt; für `.knopf` **bewusst nicht**, weil der Test mit 32-px-Browserschrift zeigte, dass der Knopf «Adresse kopieren»
sonst die Kontaktseite auf 434 px verbreitert (seitliches Scrollen wiegt schwerer als ein Wortumbruch im Knopf bei Extremgrösse). Danach alle
Tests erneut grün.

## Build und Export (21.09.2026)

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
