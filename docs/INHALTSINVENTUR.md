# Inhaltsinventur – praxiszuerichberg.ch → Demo (Stand 21.09.2026, nachgeprüft 23.09.2026)

Quelle: https://www.praxiszuerichberg.ch/ (abgerufen 21.09.2026, erneut 23.09.2026: Struktur, Kerndaten und alle 7 PDFs byte-gleich, Satz-für-Satz-Abgleich DE/EN ohne fehlende Inhalte; gespeicherte Rohfassungen `index.html`/`index_en.html` im Scratchpad
der Erstellungssitzung; Text-Extrakte wurden programmatisch mit den Demo-Inhalten verglichen, siehe `docs/MEDIZINISCHE-TEXTE.md`).
Die alte Website ist ein **Einseiter** (`index.html`, Abschnitte `#div_page_1…8`, Menü per JavaScript) mit englischer Kopie
`index_en.html`. Weitere Quellen: öffentliches Google-Unternehmensprofil (Öffnungszeiten, Koordinaten), sso.ch (nur Link).
Nicht verfügbar: Zefix-API (401), Wayback-API (offline) – Handelsregister-/Historienprüfung offen.

Status-Legende: **übernommen** = wörtlich (ggf. Tippfehler korrigiert, dokumentiert) · **umgestellt** = Struktur/Reihenfolge geändert,
Inhalt gleich · **ergänzt** = neu verfasst, nicht aus der Quelle · **weggelassen** = bewusst nicht übernommen · **offen** = Praxis muss bestätigen.

## Seiten und Abschnitte

| Quelle (URL/Abschnitt) | Sprache | Inhalt | Zielseite Demo | Status |
|---|---|---|---|---|
| `index.html` `<title>` | DE | «Praxis am Zürichberg - PD Dr. med. dent. Andreas Bindl - Zahnarztpraxis - Zürich» | `seo.titelZusatz`, Start-`seoTitel` | umgestellt (kürzer, je Seite eigener Titel) |
| `#div_page_1` (Hero) | DE/EN | h1 «Praxis am Zürichberg», h2 «PD Dr. med. dent. Andreas Bindl Zahnarzt, Mitglied SSO» / «…Dentist, Member SSO», Hintergrund `bg_page_1-new-black.jpg` (verschneites Stadtpanorama) | `/de/`, `/en/` Hero (Kurzzeile + Behandlungsraum `bg_page_2.jpg`) | übernommen, Hintergrundbild **nicht** übernommen (Praxisraum statt Stadtansicht); Hero-Unterzeile seit 23.09. neutral (Adresse + wörtliches Spektrum, siehe MEDIZINISCHE-TEXTE); Hero-Satz «Gesunde Zähne bedeuten Wohlbefinden und Lebensqualität.» stammt aus «Philosophie» |
| `#div_page_2` Praxis › Philosophie | DE/EN | 4 Absätze (Gesunde Zähne…, Die wichtigste Person…, Oberstes Ziel…, Die Zahnärzte … als Team) | `/de/praxis/` (Baustein «Philosophie») + Auszug auf `/de/`; EN analog | übernommen |
| Praxis › Geschichte der Praxis | DE/EN | Station für Zahnfarbene und Computer-Restaurationen (1992, Prof. Mörmann, Cerec), Übernahme 2007 durch PD Dr. Bindl | `/de/praxis/` (Baustein «Geschichte der Praxis») | übernommen |
| Praxis › Preisgestaltung | DE/EN | SSO-Tarif, Taxpunkte, Taxpunktwert, Kostenorientierung; nennt **Taxpunktwerte pro Zahnarzt** (u. a. CHF 3.90 Bindl, CHF 3.70 Dr. Alexander Deak – EN) und «darf höchstens Fr. 5.80 betragen» (DE) | `/de/praxis/` (Baustein «Preisgestaltung» + Hinweisbox «Taxpunktwert») | umgestellt: Erklärung übernommen, **Personen/Beträge weggelassen** (Entscheid Nick: «Preise ohne Personen»; Dr. Deak nicht mehr im Team), Hinweisbox ergänzt → **offen** |
| Praxis › Downloads | DE/EN | 7 PDF-Links | `/de/patienteninformationen/`, `/en/patient-information/` | übernommen (eigene Seite) |
| Praxis › Impressum | DE/EN | Praxisangaben, Rechtliches der Praxis | `/de/impressum/`, `/en/legal-notice/` | **neu verfasst**: Demo-Betreiber (Nick Holzbecher) getrennt von «dargestellter Praxis»; keine erfundene UID/Registerangabe |
| `#div_page_4` Behandlung | DE/EN | Einleitung «Computerzahnmedizin – Digitale Zahnmedizin» + 15 Akkordeon-Einträge | `/de/behandlungen/`, `/en/treatments/` (16 Akkordeons in 4 Gruppen + Kurzliste auf Start) | übernommen; Gruppierung ergänzt (Diagnostik/Vorsorge/Restaurativ/Chirurgie/Weiteres – redaktionell, keine medizinische Aussage) |
| `#div_page_5` Team | DE | PD Dr. med. dent. Andreas Bindl (Zahnarzt, Mitglied SSO), Dr. med. dent. Corinna Fritschi (Zahnärztin), Ruwen Friedl (Dentalhygieniker HF), je Sprachen; 2 Lebensläufe (Werdegang, Auszeichnungen) | `/de/team/` + Karten auf Start | übernommen |
| `#div_page_5` Team | EN | wie DE, aber dritte Person **«Anne Buttin-Fasel, Dental hygienist HF, Languages D, E, F, SP»** mit Bild `friedl.jpg` | `/en/team/` zeigt **Ruwen Friedl** (Entscheid Nick: «Team nach DE») | umgestellt → **offen** (Praxis bestätigt aktuelles Team) |
| `#div_page_3` (Hintergrund Gleisfeld) | – | reines Stimmungsbild | – | weggelassen (kein Praxisbezug) |
| `#div_page_6` Kontakt › Adresse | DE/EN | Attenhoferstrasse 8a, 8032 Zürich, T 044 261 33 30, F 044 261 33 29, info@praxiszuerichberg.ch (zweiter Link mit Umlaut-Domain `info@praxiszürichberg.ch`), SSO-Signet | `/de/kontakt/`, Footer, JSON-LD | übernommen; Umlaut-Variante **weggelassen** (nur ASCII-Adresse) |
| Kontakt › Anfahrt | DE/EN | Tram 5/6 bis Voltastrasse, Fussweg ca. 300 m, 2 Parkplätze in der Tiefgarage (Reservation) | `/de/kontakt/` «Anfahrt» | übernommen |
| Kontakt › Karte | DE/EN | Google-Maps-Einbettung (alte Site: sofort geladen) | `/de/kontakt/` Karte nur nach Einwilligung | umgestellt (Datenschutz) |
| `#div_page_7` Bildergalerie | DE/EN | 7 private Landschaftsfotos (Mythen, Urner Boden, Gotthard, Furka, Aletsch, Gottschalkenberg) + Link andreasbindl.zenfolio.com | – | **weggelassen** (Entscheid Nick; auch der Zenfolio-Link wird nicht übernommen – seit 23.09. auch nicht mehr in Impressum/Datenschutz erwähnt) |
| Praxisfotos `img_teaser_1…7.jpg` (2018) | – | Schild, 2 Behandlungsräume, CEREC-Platz, Mikroskop, Instrumente, Empfang | Start (Galerie), Praxis, Hero/Team-Seiten | übernommen (Rechte: `assets/originale/HERKUNFT.md`, **offen** bis Praxis bestätigt) |
| Social-Icons Google/Facebook | – | Links waren leer (`href=""`) | – | weggelassen |
| Sprachumschalter | DE/EN | Link `index_en.html` / `index.html` | `components/Sprachwechsel.tsx` (Seitenpaar) | umgestellt |
| Google Fonts «Source Sans Pro» | – | extern geladen | Source Sans 3 lokal (`app/fonts/`) | umgestellt (kein externer Request) |
| Öffnungszeiten | – | **auf der alten Website nicht vorhanden** | Kontakt «Zeiten» + JSON-LD, Quelle Google-Profil: Mo–Fr 08.00–12.00 / 13.00–17.00, Sa/So geschlossen, Hinweis «nicht von der Praxis bestätigt» | ergänzt → **offen** |
| Google-Bewertungen | – | öffentlich vorhanden | – | weggelassen (nur auf Wunsch der Praxis; nie in JSON-LD) |
| Notfall-/Ferienregelung, Krankenkassen, Barrierefreiheit der Räume, Bewilligung/Kantonale Praxisbewilligung, Rechtsform/UID | – | nicht auf der alten Website | – | **offen** (nicht erfunden) |

## Behandlungen (16 Einträge je Sprache, `data/<sprache>/behandlungen.json`)

| Anker DE | Anker EN | Gruppe (redaktionell) |
|---|---|---|
| computerzahnmedizin | computer-aided-dentistry | diagnostik |
| untersuchung-befundung-diagnostik | examination-diagnosis | diagnostik |
| schmerzbehandlung | pain-treatment | diagnostik |
| digitales-roentgen | digital-x-rays | diagnostik |
| 3d-roentgen | 3d-x-ray-imaging | diagnostik |
| prophylaxe-dentalhygiene | prophylaxis-dental-hygiene | vorsorge |
| aesthetische-zahnmedizin-bleaching | teeth-whitening | restaurativ |
| minimalinvasive-fuellungen | minimally-invasive-fillings | restaurativ |
| computer-inlays-teilkronen-kronen | computer-aided-inlays-crowns | restaurativ |
| veneers | veneers | restaurativ |
| wurzelbehandlungen | root-canal-treatment | restaurativ |
| implantate | dental-implants | chirurgie |
| zahnaerztliche-chirurgie | dental-surgery | chirurgie |
| festsitzende-prothetik | fixed-prosthesis | chirurgie |
| abnehmbare-prothetik | removable-prosthesis | chirurgie |
| verschiedenes | other-treatments | weiteres |

(Anker aus dem Feld `anker` der JSON-Dateien, Stand 21.09.2026; `inhalt:pruefen` prüft, dass jeder Hash-Link ein Ziel hat. Die Reihenfolge
auf der Seite folgt `reihenfolge`, nicht dieser Tabelle.)

## Downloads (`public/downloads/`, alle nur Deutsch)

| Datei | Titel alt | Anmerkung |
|---|---|---|
| Allg_Bedingungen.pdf | Allgemeine Bedingungen | Stand 2015, nennt Taxpunktwerte und «Dr. med. dent. Alexander Deak» → **offen** (veraltet?) |
| Post-OP.pdf | Verhalten nach chirurgischen Eingriffen | |
| PAR.pdf | Parodontitisbehandlung | |
| Prothesenreinigung.pdf | Reinigung abnehmbarer Zahnersatz, Knirsch-Schiene, Sportschutz | |
| Bleaching.pdf | Bleaching von Zähnen | |
| Schallzahnbuersten.pdf | Schallzahnbürsten | |
| Zahnunfall.pdf | Zahnunfall | Faltblatt Gesundheitsdirektion Kanton Zürich, nicht von der Praxis verfasst; PDF nicht barrierefrei geprüft |

PDF-Metadaten: 6 von 7 Dateien tragen den Dokumenttitel «Thomas Muster» (Vorlagenfehler) → vor Go-Live bereinigen (**offen**).

## Widersprüche und Unklarheiten (dokumentiert, nicht aufgelöst)

1. **Dentalhygiene-Person**: DE «Ruwen Friedl», EN «Anne Buttin-Fasel» (gleiches Bild). Demo folgt DE.
2. **Taxpunktwerte**: DE-Text «darf höchstens Fr. 5.80 betragen» entspricht dem alten SSO-Tarif; EN nennt TPW für Dr. Deak (nicht mehr im Team). Demo nennt keine Beträge im Fliesstext.
3. **E-Mail**: zwei Schreibweisen (ASCII/Umlaut-Domain). Demo: `info@praxiszuerichberg.ch`.
4. **Öffnungszeiten** nur von Google; Google-Profil und Website nennen dieselbe Adresse/Telefonnummer.
5. **Bildstände**: Teamfotos 24.03.2020, Praxisfotos 2018 – Aktualität offen.
6. Behandlungseinleitung DE («Computerzahnmedizin – Digitale Zahnmedizin») ist im Original ein Komma-Fliesstext; in der Demo als Absätze (siehe MEDIZINISCHE-TEXTE).
