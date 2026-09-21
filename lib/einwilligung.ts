/**
 * Einwilligungsverwaltung (ohne Framework-Abhängigkeit).
 *
 * Es gibt genau einen einwilligungspflichtigen Dienst: die Standortkarte von Google Maps auf der
 * Kontaktseite. Sie wird ausschliesslich nach Zustimmung geladen (kein iframe-src, kein preconnect
 * vorher). «Notwendig» ist nur die Speicherung der Entscheidung selbst in localStorage. Keine
 * weiteren Kategorien: keine Analyse, keine Werbung, kein eigener Server, keine Schriften von Google.
 */
export const KATEGORIEN = ["karte"] as const;
export type Kategorie = (typeof KATEGORIEN)[number];

export const SPEICHER_SCHLUESSEL = "praxis-zuerichberg-einwilligung";
/** Bei Änderungen an Kategorien oder Texten erhöhen: alte Entscheidungen gelten dann nicht mehr. */
export const VERSION = 1;

export type Einwilligung = {
  version: number;
  zeitpunkt: string;
  kategorien: Record<Kategorie, boolean>;
};

export const KEINE: Einwilligung["kategorien"] = { karte: false };
export const ALLE: Einwilligung["kategorien"] = { karte: true };

/** Zeichenkette aus localStorage in eine gültige Einwilligung überführen; sonst null. */
export function lesen(roh: string | null | undefined): Einwilligung | null {
  if (!roh) return null;
  try {
    const wert = JSON.parse(roh) as Partial<Einwilligung>;
    if (wert.version !== VERSION || typeof wert.zeitpunkt !== "string" || typeof wert.kategorien !== "object" || !wert.kategorien) return null;
    const kategorien = { ...KEINE };
    for (const k of KATEGORIEN) kategorien[k] = wert.kategorien[k] === true;
    return { version: VERSION, zeitpunkt: wert.zeitpunkt, kategorien };
  } catch {
    return null;
  }
}

export function erzeugen(kategorien: Partial<Einwilligung["kategorien"]>, jetzt = new Date()): Einwilligung {
  return { version: VERSION, zeitpunkt: jetzt.toISOString(), kategorien: { ...KEINE, ...kategorien } };
}

/** Rückfall im Speicher: Im Privatmodus oder bei gesperrtem Speicher gilt die Entscheidung nur für diese Seite. */
let imSpeicher: string | null = null;

export function rohLesen(): string | null {
  try {
    if (typeof window !== "undefined" && window.localStorage) return window.localStorage.getItem(SPEICHER_SCHLUESSEL) ?? imSpeicher;
  } catch {
    // Speicher gesperrt
  }
  return imSpeicher;
}

export function speichern(einwilligung: Einwilligung | null): void {
  const roh = einwilligung ? JSON.stringify(einwilligung) : null;
  imSpeicher = roh;
  try {
    if (typeof window === "undefined" || !window.localStorage) return;
    if (roh === null) window.localStorage.removeItem(SPEICHER_SCHLUESSEL);
    else window.localStorage.setItem(SPEICHER_SCHLUESSEL, roh);
  } catch {
    // Speicher gesperrt: Entscheidung gilt nur für diese Seite
  }
}

/** Andere Komponenten (Karte, Banner, Einstellungen) hören auf dieses Ereignis. */
export const EREIGNIS = "praxis-zuerichberg-einwilligung-geaendert";

export function bekanntgeben(): void {
  if (typeof window !== "undefined") window.dispatchEvent(new Event(EREIGNIS));
}
