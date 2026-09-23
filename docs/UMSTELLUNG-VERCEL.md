# Checkliste: GitHub Pages → Vercel (+ Sanity, Kundendomain praxiszuerichberg.ch)

Solange diese Punkte offen sind, läuft die Demo unverändert auf GitHub Pages. Markierung: **[vorbereitet]** = Code vorhanden, nicht
gegen echte Dienste geprüft.

## Konfiguration

- [ ] `DEPLOY_TARGET=vercel` → `next.config.ts` verzichtet automatisch auf `output: 'export'`, `basePath`, `trailingSlash`, Stub; Redirect `/` → `/de/` aktiv. [vorbereitet]
- [ ] `CONTENT_SOURCE=sanity` + Sanity-Variablen (`docs/SANITY-VERCEL-EINRICHTUNG.md`). Ohne Projekt-ID bricht der Build ab – gewollt.
- [ ] Build Command `npm run build:vercel`; `SITE_URL` auf die tatsächliche Domain (Canonical, hreflang, Open Graph, JSON-LD `url`).

## Pfade und Assets

- [ ] Unterpfad entfällt: `assetUrl()` liefert wurzelrelative Pfade, `next/link` ohne Präfix – nichts im Code zu ändern.
- [ ] Bilder kommen mit `CONTENT_SOURCE=sanity` vom Sanity-CDN (`sanity/bild.ts`, Hotspot/Crop). `public/images/` kann bleiben. [vorbereitet]
- [ ] PDFs kommen als Sanity-`file`-Assets (`DOWNLOAD`-Projektion liefert `datei.asset->url`). [vorbereitet]
- [ ] `public/index.html` (Meta-Refresh) wird auf Vercel nicht gebraucht (Redirect greift zuerst); kann bleiben.

## Sprachen

- [ ] Optional: Sprachwahl aus `Accept-Language` nur für `/` (Middleware/Proxy), manuelle Wahl in Cookie mit Vorrang; nie tiefe URLs umschalten (Codex-Empfehlung). Heute: `/` → `/de/`.
- [ ] `x-default` zeigt auf `/de/` (bewusst, weil `/` immer nach Deutsch führt). Bei automatischer Sprachwahl auf `/` umstellen.

## Domain

- [ ] Vercel → Domains: `praxiszuerichberg.ch` + `www` hinzufügen; DNS beim Registrar (A/ALIAS + CNAME laut Vercel); Weiterleitung Apex ↔ www.
- [ ] Alte URLs `index.html`, `index_en.html`, `pdf/*.pdf` → 301 auf `/de/`, `/en/`, `/downloads/*.pdf` in `next.config.ts` → `redirects()` (nur Vercel-Modus).
- [ ] GitHub-Pages-Demo danach abschalten oder als «umgezogen» stehen lassen (bleibt noindex).

## SEO

- [ ] `INDEXIERUNG=1` setzen → Meta-Robots `index, follow`; vorher **nicht**.
- [ ] `app/sitemap.ts` und `app/robots.ts` ergänzen (in der Demo bewusst nicht: robots.txt im Unterpfad wirkt auf GitHub Pages nicht; Sitemap für noindex widersprüchlich). Sitemap aus `getAlleSeiten()` mit hreflang-Alternativen.
- [ ] Google Search Console, Google Business Profile (Adresse, Telefon, Website, **Öffnungszeiten von der Praxis bestätigen**) abgleichen.
- [ ] JSON-LD `Dentist` (`lib/seo.ts`): Team/Öffnungszeiten erscheinen automatisch; weiterhin keine Bewertungen einbauen, sofern nicht ausdrücklich gewünscht und belegt.

## Datenschutz und Rechtstexte (Zahnarztpraxis = Gesundheitsdaten, Berufsgeheimnis)

- [ ] **Impressum**: Demo-Betreiber-Abschnitt entfernen; Praxis als Betreiberin mit Rechtsform, Inhaber, Adresse, E-Mail, ggf. UID und Praxisbewilligung (Angaben von der Praxis).
- [ ] **Datenschutzerklärung** neu fassen (Rechtstext im Studio, beide Sprachen): Verantwortliche = Praxis; Hosting **Vercel Inc.** (USA – Region/Logs/Übermittlung);
      **Sanity** (Content Lake + `cdn.sanity.io`: Browser rufen Bild-/PDF-URLs direkt ab → IP-Adresse an Sanity); Google Maps nach Einwilligung (bleibt);
      Studio-/Draft-Cookies nur für Redaktion; Kontaktwege (Telefon/E-Mail sind keine sicheren Kanäle für Gesundheitsdaten); Betroffenenrechte nach DSG; Stand.
      Juristische Prüfung durch die Praxis/Anwalt – die Demo-Texte sind **nicht anwaltlich geprüft**.
- [ ] **Cookie-Banner** bleibt (Google Maps). Kommt Analytics/Video/Terminwidget dazu: Kategorie in `lib/einwilligung.ts` (`KATEGORIEN`), Texte in `texte.json`, Datenschutzerklärung.
- [ ] Online-Terminbuchung (z. B. Drittanbieter): nur mit Auftragsverarbeitungsvertrag, Einwilligungskategorie, Hinweis auf Gesundheitsdaten; nie Selbstbau mit Speicherung.
- [ ] Kontaktformular mit echtem Versand (Vercel Function + E-Mail-Dienst) nur, wenn Praxis das will: Felder organisatorisch belassen, Spam-Schutz, keine Speicherung, Dienst in der Datenschutzerklärung.
- [ ] Prüfung aus dem Prüfbericht wiederholen: externe Requests vor Einwilligung, Cookies, Storage (jetzt Vercel + Sanity-CDN erwartet).

## Inhaltsaktualisierung

- [ ] Sanity-Webhook → `/api/revalidate` (Tag `inhalt`), Secret gesetzt.
- [ ] Neue Seiten: Deploy Hook oder `dynamicParams = true`.
- [ ] `data/**/*.json` bleibt als Backup/Ausgangszustand im Repo; nach dem Import ist Sanity die Quelle der Wahrheit.
- [ ] Medizinische Texte: `pruefstatus`/`freigabedatum` im Studio pflegen; Änderungen an Behandlungstexten nur nach Freigabe durch die Praxis.

## Nach dem Umzug testen

- [ ] Alle Seiten beider Sprachen direkt aufrufen/neu laden, 404, Weiterleitungen, Sprachwechsel, Hash-Links auf Behandlungen.
- [ ] Studio-Login der Praxis, Publish → Website aktualisiert (Sekunden).
- [ ] Tastatur, Screenreader, Mobil auf echten Geräten; Karte nach Einwilligung; Widerruf.

## Sicherheits-Header (erst auf Vercel möglich)

GitHub Pages kann keine eigenen Header setzen. Auf Vercel in `next.config.ts` (`headers()`) ergänzen: `Content-Security-Policy` mit
`default-src 'self'`, `frame-src https://www.google.com` (nur Karte nach Einwilligung), `img-src 'self' https://cdn.sanity.io data:`,
Next-Inline-Skripte per Nonce (Proxy) oder Hash; `/studio` braucht eine eigene, lockerere Policy. Dazu `Referrer-Policy`,
`X-Content-Type-Options: nosniff`, `Permissions-Policy`. Nach dem Setzen Karte, Studio und Vorschau erneut testen.
