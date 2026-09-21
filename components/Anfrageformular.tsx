"use client";
import { useId, useState, type FormEvent } from "react";
import type { Texte } from "@/lib/content/types";
import { MailIcon } from "./Icons";

/**
 * Kontaktanfrage «E-Mail vorbereiten»: nur organisatorische Felder (Name, Rückrufnummer, Anliegen,
 * organisatorische Nachricht). Es wird nichts gesendet und nichts gespeichert; der Text wird an das
 * E-Mail-Programm der Person übergeben (mailto). Deutlicher Hinweis: keine Gesundheitsdaten.
 */
export function Anfrageformular({ email, praxisname, t }: { email: string; praxisname: string; t: Texte["formular"] }) {
  const id = useId();
  const [name, setName] = useState("");
  const [rueckruf, setRueckruf] = useState("");
  const [wunsch, setWunsch] = useState(t.kontaktwunschOptionen[0]?.wert ?? "");
  const [nachricht, setNachricht] = useState("");
  const [fehler, setFehler] = useState<string | null>(null);

  const wunschTitel = t.kontaktwunschOptionen.find((o) => o.wert === wunsch)?.titel ?? "";
  const body = [`${t.kontaktwunsch}: ${wunschTitel}`, `${t.name}: ${name}`, rueckruf ? `${t.rueckruf}: ${rueckruf}` : "", "", nachricht].filter((z, i) => z !== "" || i === 3).join("\n");
  const mailto = `mailto:${email}?subject=${encodeURIComponent(`${wunschTitel} (${praxisname})`)}&body=${encodeURIComponent(body)}`;

  function absenden(ev: FormEvent) {
    ev.preventDefault();
    if (!name.trim()) {
      setFehler(t.fehlerName);
      document.getElementById(`${id}-name`)?.focus();
      return;
    }
    setFehler(null);
    window.location.href = mailto;
  }

  return (
    <form onSubmit={absenden} noValidate className="rounded-[12px] border border-linie bg-weiss p-6 sm:p-8" aria-labelledby={`${id}-titel`}>
      <h3 id={`${id}-titel`} className="text-display-md">
        {t.titel}
      </h3>
      <p className="mt-3 text-grau">{t.einleitung}</p>
      <p className="mt-4 rounded-[6px] border-l-4 border-aubergine bg-aubergine-hell px-4 py-3 text-[1rem]" role="note">
        {t.warnung}
      </p>
      <div className="mt-6 grid gap-5">
        <div>
          <label htmlFor={`${id}-name`} className="mb-1.5 block font-semibold">
            {t.name} <span className="text-fehler" aria-hidden="true">*</span> <span className="sr-only">({t.pflicht})</span>
          </label>
          <input id={`${id}-name`} className="feld" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" required aria-required="true" aria-invalid={fehler ? "true" : undefined} aria-describedby={fehler ? `${id}-fehler` : undefined} />
          {fehler && (
            <p id={`${id}-fehler`} className="mt-1.5 text-[1rem] font-semibold text-fehler" role="alert">
              {fehler}
            </p>
          )}
        </div>
        <div>
          <label htmlFor={`${id}-rueckruf`} className="mb-1.5 block font-semibold">
            {t.rueckruf}
          </label>
          <input id={`${id}-rueckruf`} className="feld" type="tel" value={rueckruf} onChange={(e) => setRueckruf(e.target.value)} autoComplete="tel" inputMode="tel" />
        </div>
        <div>
          <label htmlFor={`${id}-wunsch`} className="mb-1.5 block font-semibold">
            {t.kontaktwunsch}
          </label>
          <select id={`${id}-wunsch`} className="feld" value={wunsch} onChange={(e) => setWunsch(e.target.value)}>
            {t.kontaktwunschOptionen.map((o) => (
              <option key={o.wert} value={o.wert}>
                {o.titel}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor={`${id}-nachricht`} className="mb-1.5 block font-semibold">
            {t.nachricht}
          </label>
          <textarea id={`${id}-nachricht`} className="feld min-h-28" value={nachricht} onChange={(e) => setNachricht(e.target.value)} rows={4} aria-describedby={`${id}-hilfe`} />
          <p id={`${id}-hilfe`} className="mt-1.5 text-[0.95rem] text-grau">
            {t.nachrichtHilfe}
          </p>
        </div>
      </div>
      <div className="mt-6 flex flex-wrap items-center gap-4">
        <button type="submit" className="knopf knopf-primaer">
          <MailIcon />
          {t.emailVorbereiten}
        </button>
      </div>
      <p className="mt-3 text-[0.95rem] text-grau">{t.hinweisNachher}</p>
    </form>
  );
}
