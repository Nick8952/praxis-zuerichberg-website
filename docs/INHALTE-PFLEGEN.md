# Lokale Demo-Inhalte pflegen (ohne Sanity)

Alle Inhalte der GitHub-Pages-Demo liegen in `data/`. Nach jeder Änderung: `npm run inhalt:pruefen`, dann `git push` (der Workflow
baut und veröffentlicht automatisch). Lokal ansehen: `npm run dev` → http://localhost:3000/praxis-zuerichberg-website/de/

| Datei | Inhalt |
|---|---|
| `data/einstellungen.json` | nicht lokalisiert: Praxisname, Inhaber (Titel/Name), Adresse, Telefon, Fax, E-Mail, Mitgliedschaft (SSO), Logo, Routenlink, Karten-Einbettung, Geo, **Öffnungszeiten** (`tage`/`zeiten` je Sprache + `wochentage`/`intervalle` für JSON-LD, `geschlossen`), `oeffnungszeitenHinweis` (leeren, sobald die Praxis bestätigt), SEO-Bild |
| `data/<sprache>/texte.json` | Navigation, Footer-Rechtslinks, SEO-Standardtexte, Demo-Hinweis, Bedienelemente (`ui`), Einwilligung (`einwilligung`), Formular (`formular`) |
| `data/<sprache>/seiten/<slug>.json` | Eine Datei pro Seite und Sprache; `slug` = Dateiname, `uebersetzungsSchluessel` verbindet DE und EN (**Pflicht, gleich in beiden Sprachen**). `start` = Startseite (mit `hero`), sonst `einleitung`. `bausteine` in Anzeigereihenfolge, jeder mit eindeutigem `_key` |
| `data/<sprache>/behandlungen.json` | 16 Behandlungen: `id`, `titel`, `anker` (Hash-Ziel, je Sprache), `inhalt` (Portable Text), `gruppe` (`diagnostik`/`vorsorge`/`restaurativ`/`chirurgie`/`weiteres`), `reihenfolge`, `quelle`, `pruefstatus` (`uebernommen`/`sprachlich-angepasst`/`freigegeben`), `freigabedatum` |
| `data/<sprache>/team.json` | `titelVor`, `vorname`, `nachname`, `funktion`, `sprachen[]`, `bild`, `lebenslaufEinleitung`, `lebenslauf` (Portable Text mit `zeitleiste`-Blöcken: `eintraege[{jahr, text}]`) |
| `data/<sprache>/downloads.json` | `titel`, `datei` (`/downloads/…pdf` unter `public/`), `dateiname`, `hinweis`, `dokumentSprache` (`de`), `reihenfolge` |
| `data/<sprache>/rechtstexte/{impressum,datenschutz}.json` | Rechtstexte (Portable Text) mit `stand` |
| `data/bilder.json` | **generiert** durch `npm run bilder` – nicht von Hand bearbeiten |

## Bausteine (`_type`)

`textBaustein` (kurzzeile, titel, inhalt, bild, bildPosition `links`/`rechts`), `hinweisBaustein` (titel, inhalt, art `info`/`wichtig`),
`behandlungenBaustein` (einleitung, darstellung `akkordeon`/`kurzliste`, behandlungen = IDs oder `[]` für alle, weiterLink),
`teamBaustein` (einleitung, mitLebenslauf, team = IDs oder `[]`), `downloadsBaustein` (einleitung, downloads = IDs oder `[]`),
`galerieBaustein` (bilder[]), `bildBaustein` (bild, text), `kontaktBaustein` (einleitung, anfahrt, mitKarte, mitFormular),
`aufrufBaustein` (titel, text, knopf, zweiterKnopf), `rechtstextBaustein` (rechtstext = `impressum`/`datenschutz`).
Links: `{ "titel", "ziel", "extern" }` – Ziele `/de/…`, `/en/…`, `#anker`, `https://`, `mailto:`, `tel:`.

## Rich Text (Portable Text)

```bash
npm run text:konvertieren -- pfad/zum/text.md   # gibt Portable Text (JSON) aus → in `inhalt` einsetzen
```

Unterstützt: Absätze, `##`/`###`, `-` Listen, `1.` Listen, **fett**, *kursiv*, [Links](…). Lebenslauf-Tabellen sind `zeitleiste`-Blöcke
(von Hand oder im Studio).

## Medizinische Texte ändern

1. Nur ändern, was die Praxis freigegeben hat. Änderung in `docs/MEDIZINISCHE-TEXTE.md` eintragen (Vorher/Nachher).
2. `pruefstatus` und `freigabedatum` im Eintrag setzen.
3. Keine Versprechen («schmerzfrei», «garantiert»), keine neuen Behandlungen ohne Beleg, keine Preise ohne Bestätigung.
4. Beide Sprachen prüfen – die englische Fassung ist eigenständig, nicht maschinell.

## Neue Seite (in beiden Sprachen)

1. `data/de/seiten/<slug>.json` und `data/en/seiten/<slug-en>.json` mit gleichem `uebersetzungsSchluessel` anlegen.
2. In `texte.json` beider Sprachen die Navigation ergänzen (falls gewünscht).
3. `npm run inhalt:pruefen` – meldet fehlende Gegenstücke, unbekannte Bild-IDs, tote interne Links/Anker.
4. Nur eine Sprache? Dann fehlt das Gegenstück bewusst: der Sprachwechsel führt zur Startseite der anderen Sprache und sagt das («Diese Seite gibt es nur auf Deutsch»).

## Bilder

1. Original nach `assets/originale/` legen und in `assets/originale/HERKUNFT.md` Herkunft + Freigabe notieren (keine Stock-/KI-Bilder als Praxis- oder Teambilder, keine Patientenbilder).
2. In `scripts/bilder-optimieren.mjs` unter `BILDER` eine Kennung eintragen.
3. `npm run bilder` → `public/images/*.webp|png` (mehrere Breiten, Inhalts-Hash im Namen) und `data/bilder.json`.
4. In den Inhalten referenzieren: `{ "bild": "praxis-empfang", "alt": "…", "bildunterschrift": "…" }` – Alt-Text ist Pflicht (leerer String nur für rein dekorative Bilder).

## Downloads

PDF nach `public/downloads/` legen, Eintrag in `downloads.json` beider Sprachen (EN-Eintrag mit Hinweis «German only», wenn keine
Übersetzung existiert). Vor dem Hochladen PDF-Metadaten (Titel/Autor) prüfen – die alten Dateien tragen «Thomas Muster».

## Öffnungszeiten bestätigen

Sobald die Praxis die Zeiten bestätigt: `oeffnungszeitenHinweis` in `data/einstellungen.json` auf `null` setzen (beide Sprachen sind
in einem Objekt). Erst dann nimmt `lib/seo.ts` die Zeiten ins JSON-LD auf – unbestätigte Zeiten bleiben nur sichtbarer Text mit Herkunft. Ändern sich Zeiten, `intervalle` (für JSON-LD) und die sichtbaren `zeiten`-Texte gemeinsam anpassen –
`inhalt:pruefen` meldet Intervalle ohne Text und umgekehrt.

## Prüfen

```bash
npm run inhalt:pruefen                            # Inhalte, Sprachpaare, Links, Anker
npm run build:pages && npm run export:pruefen     # Export unter dem Unterpfad, noindex, keine externen Ressourcen
npm run vorschau:pages                            # http://localhost:4321/praxis-zuerichberg-website/de/
```
