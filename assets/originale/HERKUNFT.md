# Herkunft der Originaldateien

Alle Dateien stammen vom bestehenden Webauftritt https://www.praxiszuerichberg.ch/ (Download 21.09.2026,
Freigabe durch Nick Holzbecher am 21.09.2026: «Ja, alles ausser Landschaftsgalerie»). Urheber- bzw. Nutzungsrechte
liegen bei der Praxis am Zürichberg bzw. den beauftragten Fotografen – vor einem Go-Live mit der Praxis bestätigen.

| Datei | Quelle (Original-URL) | Inhalt | Anmerkung |
|---|---|---|---|
| `img_logo.png` | /images/img_logo.png (270 × 79 px, PNG mit Transparenz) | Logo «praxis am zürichberg» mit Bergsilhouette und Zeile «PD Dr. med. dent. Andreas Bindl Zahnarzt» | einzige Logodatei; klein, für die Kopfzeile ausreichend, für Druck zu klein |
| `sso.png` | /images/sso.png (250 × 51 px) | Signet «Mitglied SSO» | Verbandslogo der Schweizerischen Zahnärzte-Gesellschaft; Nutzungsrecht via Mitgliedschaft, Bestätigung durch Praxis |
| `icon_google.png`, `icon_facebook.png` | /images/… | Social-Icons der alten Seite | **nicht verwendet** – die Links dahinter waren leer (`href=""`) |
| `team/img_team_1.jpg` | /images/img_team_1.jpg (548 × 350) | Portrait PD Dr. med. dent. Andreas Bindl (schwarz-weiss) | Stand 24.03.2020 |
| `team/img_team_2.jpg` | /images/img_team_2.jpg (548 × 350) | Portrait Dr. med. dent. Corinna Fritschi (schwarz-weiss) | Stand 24.03.2020 |
| `team/friedl.jpg` | /images/team/friedl.jpg (365 × 341) | Portrait Ruwen Friedl, Dentalhygieniker HF (schwarz-weiss) | Stand 24.03.2020; auf der EN-Seite fälschlich mit «Anne Buttin-Fasel» beschriftet |
| `praxis/img_teaser_1.jpg` | /images/img_teaser_1.jpg (1700 × 1223) | Praxisschild vor dem Gebäude, Winter | 2018 |
| `praxis/img_teaser_2.jpg` | /images/img_teaser_2.jpg (1700 × 1223) | Behandlungsraum | 2018 |
| `praxis/img_teaser_3.jpg` | /images/img_teaser_3.jpg (1700 × 1223) | Behandlungsplatz mit CEREC-Bildschirm | 2018 |
| `praxis/img_teaser_4.jpg` | /images/img_teaser_4.jpg (1700 × 1223) | Behandlungsraum mit Fenster | 2018 |
| `praxis/img_teaser_5.jpg` | /images/img_teaser_5.jpg (1700 × 1223) | OP-Mikroskop | 2018 |
| `praxis/img_teaser_6.jpg` | /images/img_teaser_6.jpg (1700 × 1223) | Polierinstrumente im Kasten | 2018 |
| `praxis/img_teaser_7.jpg` | /images/img_teaser_7.jpg (1700 × 1130) | Empfang, Mitarbeiterin am Telefon (Person nicht namentlich bekannt) | 2018 |
| `praxis/bg_page_2.jpg` | /images/bg_page_2.jpg (1980 × 598) | Behandlungsraum mit Behandlungsleuchte und CEREC-Bildschirmen (Schlüssel `panorama-arbeitsplatz`) | Hintergrundbild der alten Seite; **Hero der Demo** |
| `praxis/bg_page_4.jpg` | /images/bg_page_4.jpg (1980 × 600) | Panorama über Zürich mit Alpen, Winter (Schlüssel `panorama-zuerich`) | Hintergrundbild der alten Seite; in der Demo derzeit nicht verwendet |
| `praxis/bg_page_5.jpg` | /images/bg_page_5.jpg (1980 × 600) | Gleisfeld bei Nacht (Schlüssel `panorama-gleise`) | Hintergrundbild der alten Seite; in der Demo nicht verwendet (kein Praxisbezug) |
| `pdf/*.pdf` | /pdf/… | 7 Patienteninformationen/AGB | unverändert übernommen; Metadaten-Titel «Thomas Muster» in 6 Dateien (Vorlagenfehler), `Zahnunfall.pdf` ist ein Faltblatt der Gesundheitsdirektion Kanton Zürich |

Nicht heruntergeladen (Entscheid Nick): `galerie_1…7.jpg` (private Landschaftsfotos von Dr. Bindl) – nur Link auf andreasbindl.zenfolio.com.

**Korrektur 23.09.2026:** Die Beschreibungen und Schlüssel von `bg_page_2/4/5` waren am 21.09. vertauscht (Hero-Alt-Text «Blick über Zürich» zeigte in Wahrheit den Behandlungsraum). Zuordnung in `scripts/bilder-optimieren.mjs` und Alt-Texte in `data/*/seiten/start.json` berichtigt. Das Hero-Hintergrundbild der alten Seite (`images/bg_page_1-new-black.jpg`, verschneites Stadtpanorama) wurde nicht übernommen.
