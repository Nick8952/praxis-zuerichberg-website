# praxis-zuerichberg-website

Zweisprachige Gestaltungs-Demo (DE/EN) für die Praxis am Zürichberg, Zürich – Next.js 16, statischer Export für GitHub Pages,
vorbereitet für Sanity + Vercel. **Unverbindliche Demo, kein offizieller Auftritt der Praxis.** Alle Seiten sind `noindex`.

- Demo: https://nick8952.github.io/praxis-zuerichberg-website/
- Anweisungen für Agenten und Entwicklung: `CLAUDE.md`
- Dokumentation: `docs/` (Inhaltsinventur, medizinische Textänderungen, Pflege, Sanity/Vercel, Übergabe, Prüfbericht)

```bash
npm ci
npm run dev                 # http://localhost:3000/praxis-zuerichberg-website/de/
npm run build:pages && npm run export:pruefen
```
