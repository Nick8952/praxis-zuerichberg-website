# Medizinisch relevante Textänderungen – zur Freigabe durch die Praxis

Grundsatz: Behandlungs-, Team- und Praxistexte wurden **wörtlich** aus https://www.praxiszuerichberg.ch/ (21.09.2026) übernommen.
Geändert wurde nur Orthografie/Typografie; **kein medizinischer Sinn wurde verändert, nichts ergänzt** (Ausnahmen unten ausdrücklich
markiert). Jeder Behandlungseintrag trägt in `data/<sprache>/behandlungen.json` die Felder `quelle`, `pruefstatus: "sprachlich-angepasst"`
und `freigabedatum: null`. Nach Freigabe durch die Praxis: `pruefstatus: "freigegeben"` und Datum setzen (auch im Sanity-Studio vorgesehen).

Die Liste wurde programmatisch erzeugt (Wort-Diff zwischen Quelltext-Extrakt und Demo-Inhalt) und von Hand geprüft. Absatzumbrüche und
entfernte Menü-Reste (`[LINK javascript:void(0)]`) sind keine Textänderungen und nicht aufgeführt.

## A. Änderungen mit inhaltlicher Wirkung (Freigabe zwingend)

| Wo | Vorher (Original) | Nachher (Demo) | Grund |
|---|---|---|---|
| Praxis › Preisgestaltung (DE) | «Der Taxpunktwert wird vom Praxisinhaber festgelegt **und darf höchstens Fr. 5.80 betragen**. Dabei soll die Lage…» | «Der Taxpunktwert wird vom Praxisinhaber festgelegt; dabei soll die Lage…» | Obergrenze aus dem alten SSO-Tarif, Gültigkeit unklar → weggelassen, Hinweisbox «Taxpunktwert» verweist auf Bestätigung durch Praxis |
| Praxis › Preisgestaltung (DE/EN) | Nennung der Taxpunktwerte pro Zahnarzt (u. a. CHF 3.90 PD Dr. Bindl, CHF 3.70 Dr. Alexander Deak) | keine Beträge und keine Personen im Fliesstext; Hinweisbox nennt «unter anderem CHF 3.90 für PD Dr. med. dent. Andreas Bindl» als **unbestätigt** | Entscheid Nick («Preise ohne Personen»); Dr. Deak nicht mehr im Team |
| Praxis › Preisgestaltung (EN) | «Applied costs are managed according to the tariff of the Swiss Dental Association SSO (www.sso.ch) and are based on CHF 3.70 (TPW) for Dr. med. dent. Alexander Deak and CHF 3.90 (TPW) for PD Dr. med. dent. Andreas Bindl.» | «Applied costs are managed according to the tariff of the Swiss Dental Association SSO (www.sso.ch).» + Satz zu Kostenorientierung | wie oben |
| Praxis › Preisgestaltung (DE/EN) | – | ergänzt: «Details zur Rechnungsstellung finden Sie in den Allgemeinen Bedingungen (PDF).» / «Details on invoicing are given in the general terms and conditions (PDF, German).» | Verweis auf vorhandenes Dokument, keine neue Aussage |
| Team (EN) | «Anne Buttin-Fasel, Dental hygienist HF, Languages: D, E, F, SP» | «Ruwen Friedl, Dental hygienist HF, Languages: German, English» (wie DE) | Widerspruch DE/EN, Entscheid Nick «Team nach DE» → Praxis bestätigt |
| Behandlungen (DE/EN) | flache Liste | Gruppen «Diagnostik und Schmerzbehandlung / Vorsorge und Dentalhygiene / Restaurative und ästhetische Zahnmedizin / Chirurgie, Implantate und Zahnersatz / Weitere Leistungen» | redaktionelle Ordnung, keine medizinische Aussage; Praxis kann Zuordnung ändern (`gruppe`) |
| Behandlungen (DE/EN) | – | Hinweisbox unter den Akkordeons: «Die Beschreibungen geben einen Überblick … Diese Seite ersetzt keine individuelle zahnärztliche Beratung.» | Schutzhinweis, neu verfasst |
| Kontakt (DE/EN) | – | Öffnungszeiten (Google-Profil) mit Hinweis «noch nicht von der Praxis bestätigt» | siehe Inventur |
| Start (DE/EN) | – | Aufruf «Termin vereinbaren … Bei starken oder akuten Schmerzen versuchen wir, soweit möglich, am Tag Ihres Anrufs einen Termin zu vergeben.» | Umformulierung des Originalsatzes aus «Schmerzbehandlung» («Soweit möglich, versuchen wir … am Tag Ihres Anrufs einen Termin zu geben»); kein Versprechen («versuchen», «soweit möglich») |

## B. Orthografie/Typografie ohne Sinnänderung (zur Kenntnis)

### Deutsch

| Eintrag | Vorher → Nachher |
|---|---|
| Titel | «Computerzahnmedizin – Digitale Zahnmedizin» → «Computerzahnmedizin, digitale Zahnmedizin»; «Untersuchung – Befundung - Diagnostik» → «Untersuchung, Befundung, Diagnostik»; «Ästhetische Zahnmedizin/Bleaching» → «Ästhetische Zahnmedizin, Bleaching»; «Verschiedenes» → «Verschiedenes: Kinder, Kieferorthopädie, Aufbissschienen» (Inhalt des Eintrags) |
| Computerzahnmedizin | Original ist ein einziger Komma-Fliesstext («…Cerec-Kamera), Herstellung von computer-gefertigten Restaurationen…, digitale Volumentomographie…, Dokumentation: mit Hilfe…») → in der Demo als eigenständige Sätze/Absätze mit gleichem Wortlaut; «z.B.» → «z. B.»; «computer-gefertigten» → «computergefertigten»; «(=virtuelle Implantatplanung)» → «(virtuelle Implantatplanung)»; «Dieses Scans» → «Diese Scans» |
| Untersuchung | «Zahnhalteapperat» → «Zahnhalteapparat» |
| Prophylaxe | «Zahnhalteapperates» → «Zahnhalteapparates» (2×); «den umliegenden» → «der umliegenden»; «ihre Zähnen» → «Ihre Zähne»; «sie» → «Sie» |
| Digitales Röntgen | «Röntgenbilder» → «Röntgenbildern» (Kasus); «Panoramschichtaufnahmen» → «Panoramaschichtaufnahmen» |
| Computer-Inlays | «CEREC Methode» → «CEREC-Methode»; «der selben» → «derselben» |
| Veneers | «CEREC Veneers» → «CEREC-Veneers» |
| Wurzelbehandlungen | «vorhandene evtl.» → «vorhandene, eventuell»; «OP-Mikroskopes» → «OP-Mikroskops» |
| 3D-Röntgen | «z.B.» → «z. B.»; «Panorama Röntgenbild» → «Panorama-Röntgenbild»; «3D Röntgendiagnostik» → «3D-Röntgendiagnostik»; «unserem … Geräten» → «unseren 3D-Volumentomographie-Geräten» |
| Implantate | «3D Röntgendiagnostik» → «3D-Röntgendiagnostik» |
| Festsitzende Prothetik | «CEREC Kamera» → «CEREC-Kamera» |
| Verschiedenes | «2 Stützzonen» → «zwei Stützzonen»; «Desweiteren» → «Des Weiteren»; «NTI-Aufbisschienen» → «NTI-Aufbissschienen» |
| Philosophie (Praxis/Start) | «bis zu komplexen Versorgung» → «bis zur komplexen Versorgung»; «Zahnhalteapperates» → «Zahnhalteapparates»; «den umliegenden» → «der umliegenden» |
| Geschichte | «Zahnarzt in einer» → «Zahnarzt, in einer»; «90er Jahre» → «90er-Jahre»; «soweit ausgereift» → «so weit ausgereift» |
| Preisgestaltung | «wurde der von der Schweizerischen Zahnärzte Gesellschaft» → «wurde von der Schweizerischen Zahnärzte-Gesellschaft»; «zugeordnet:» → «zugeordnet.» |
| Lebenslauf Bindl | Anführungszeichen ‚…’/„…“ → «…»; «W.H.» → «W. H.»; «(20%» → «(20 %»; Struktur «Werdegang/Auszeichnungen» als Tabellen |

### Englisch

| Eintrag | Vorher → Nachher |
|---|---|
| Titel | «Computer-aided dentistry – digital dentistry» → «Computer-aided dentistry, digital dentistry»; «Examination – appraisal – diagnosis» → «Examination, appraisal, diagnosis»; «Other treatments» → «Other treatments: children, orthodontics, night guards» |
| Computer-aided dentistry | «purposes, digital 2D … have replaced» → «purposes; … has replaced»; «computer aided» → «computer-aided» |
| Examination | «digital x-rays images» → «digital x-ray images»; «decision making» → «decision-making» |
| Pain treatment | «is far the worst condition» → «is by far the worst condition» |
| Prophylaxis | «hygienists that» → «who»; «hygiene. She …» → Satz zusammengezogen; «Instructions» → «instructions»; «tooth supporting» → «tooth-supporting»; «consist» → «consists»; «close» → «closely»; Kommas |
| Teeth whitening | «process» → «process,»; Artikel «the» ergänzt |
| Fillings | Artikel «a» ergänzt |
| Inlays/crowns | «At the same appointment» → «In the same appointment»; Komma |
| Veneers | «Veneers Veneers» (Dublette) → «Veneers»; «(minimal invasive)» → «(minimally invasive)» |
| Root canal | «infected tooth canal treatment» → «infected, root canal treatment»; «Root canal treated» → «Root-canal-treated»; «(Ceramic)» → «(ceramic)»; «long-term.» → «long term.»; «the dentist» ergänzt als Subjekt |
| 3D x-ray | «allows» ergänzt (fehlendes Verb); «assessment. For» → «assessment, for» |
| Implants | «prosthesis» → «prostheses»; «deriving» → «derived»; «3D-Data» → «3D data» |
| Surgery | «removed, … is» → «removed … becomes» |
| Fixed prosthesis | «Tooth or implant supported fixed dental prosthesis provide» → «Tooth- or implant-supported fixed dental prostheses provide»; «Conventionally silicone» → «Conventionally, silicone»; «via internet» → «via the internet» |
| Removable prosthesis | «prosthesis» → «prostheses»; «(clasp,» → «(clasps,»; «etc. )» → «etc.)» |
| Other treatments | «joint of the jaw» → «jaw joint» |
| Practice/Start | «"Praxis am Zürichberg" are» → «Praxis am Zürichberg is»; «provide» → «providing»; «swiss» → «Swiss»; «well established» → «well-established»; «overlay» → «overlays»; «it’s» → «its»; «assess» → «provide» (Kostenorientierung) |
| CV Bindl | «W.H.» → «W. H.»; «[German …]» → «(German …)»; Interpunktion |
| CV Fritschi | «Dentist in the practice at Zürichberg, Zurich» → «Dentist at Praxis am Zürichberg, Zurich» |
| Start (Abschnittstitel) | – → «Together with you, we develop a treatment plan tailored to your needs.» (gekürzt aus dem Originalsatz «Together with you, we develop a transparent treatment plan that is tailored to your needs and expectations as well as your financial situation.» – Titel, kein neuer Inhalt) |

## C. Neu verfasste, nicht-medizinische Texte

Navigation, Hero-Kurzzeile «Zahnarzt, Mitglied SSO», Einleitungen der Unterseiten, Aufruf-Bausteine, Formular- und Einwilligungstexte,
Impressum, Datenschutzerklärung, 404, SEO-Titel/-Beschreibungen. Sie enthalten keine medizinischen Aussagen und keine Versprechen
(Formulierungen wie «versuchen wir, soweit möglich»).

## D. Nicht geändert, aber zu prüfen

- Alle Behandlungstexte sind Stand der alten Website; Fachaussagen (z. B. zur Strahlenbelastung beim digitalen Röntgen, zur Haltbarkeit
  von Restaurationen, zu Materialien) wurden **nicht** fachlich geprüft – Freigabe durch PD Dr. Bindl nötig.
- Bezeichnung «Mitglied SSO» und akademische Titel stammen von der Website; keine Registerprüfung möglich (Zefix 401).
- Von Codex als mögliche Erfolgs-/Dauerhaftigkeitsaussagen markiert (Original-Wortlaut der Praxis, unverändert übernommen): «Ihre Anliegen und
  Zahnbeschwerden schonend und **dauerhaft** zu beseitigen» (Philosophie, DE/EN) und in der EN-Endodontie «root canal treatment **must** be performed»,
  «the **best** seal in the long term». Entscheidung der Praxis: beibehalten, abschwächen oder streichen.
- Alle Behandlungen tragen `pruefstatus: "sprachlich-angepasst"` – eine fachliche Freigabe (`freigegeben` + Datum) hat noch keiner.
