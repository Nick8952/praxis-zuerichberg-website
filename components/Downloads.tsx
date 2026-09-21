import type { Download, Texte } from "@/lib/content/types";
import { assetUrl } from "@/lib/assets";
import { DateiIcon } from "./Icons";

/** Liste der PDF-Downloads: Titel, Hinweis, Format und Grösse; Links öffnen die Datei direkt (nichts wird eingebettet). */
export function Downloads({ downloads, t }: { downloads: Download[]; t: Texte }) {
  return (
    <ul className="erscheinen divide-y divide-linie border-y border-linie" role="list">
      {downloads.map((d) => (
        <li key={d.id}>
          <a href={assetUrl(d.datei)} className="group grid min-h-14 grid-cols-[auto_1fr_auto] items-center gap-4 py-4 text-tinte no-underline" download={d.dateiname} type="application/pdf">
            <span className="text-aubergine">
              <DateiIcon />
            </span>
            <span>
              <span className="block font-semibold text-aubergine underline-offset-4 group-hover:underline">{d.titel}</span>
              {d.hinweis && <span className="block text-[0.95rem] text-grau">{d.hinweis}</span>}
            </span>
            <span className="text-right text-[0.95rem] text-grau">
              {t.ui.dateiGroesse}
              {d.groesseKb ? `, ${d.groesseKb >= 1024 ? `${(d.groesseKb / 1024).toFixed(1)} MB` : `${d.groesseKb} KB`}` : ""}
            </span>
          </a>
        </li>
      ))}
    </ul>
  );
}
