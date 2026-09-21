/**
 * Gemeinsame Inhaltsstruktur der Website «Praxis am Zürichberg».
 *
 * Schnittstelle zwischen Inhaltsquelle und Darstellung:
 * - lib/content/local.ts  liefert sie aus data/ (GitHub-Pages-Demo, JETZT)
 * - lib/content/sanity.ts liefert sie aus Sanity (SPÄTER, Vercel)
 * Seitenkomponenten kennen nur diese Typen, nie die Quelle.
 *
 * Zweisprachigkeit nach dem Muster «Übersetzung auf Dokumentebene»: Jede lokalisierte
 * Einheit (Seite, Behandlung, Teammitglied, Download, Rechtstext, Texte) existiert je
 * Sprache als eigenes Dokument mit `sprache` und einem stabilen `uebersetzungsSchluessel`,
 * über den die Entsprechung in der anderen Sprache gefunden wird (Sprachwechsel, hreflang).
 * Feldnamen sind deutsch und decken sich 1:1 mit den Sanity-Schemas in sanity/schemas/.
 */
import type { PortableTextBlock } from "@portabletext/types";

export type RichText = PortableTextBlock[];

export const SPRACHEN = ["de", "en"] as const;
export type Sprache = (typeof SPRACHEN)[number];
export const STANDARD_SPRACHE: Sprache = "de";
/** BCP-47 für <html lang> und hreflang */
export const SPRACH_CODE: Record<Sprache, string> = { de: "de-CH", en: "en" };

/** Fertig aufbereitetes Bild – beide Provider liefern dieselbe Form. */
export interface Bild {
  id: string;
  alt: string;
  breite: number;
  hoehe: number;
  bildunterschrift?: string;
  /** Renditions aufsteigend nach Breite; `url` absolut (Sanity) oder wurzelrelativ ohne Unterpfad (lokal). */
  quellen: { breite: number; url: string }[];
}

export interface Link {
  titel: string;
  /** Interner Pfad («/de/kontakt»), externe URL (https://…), tel: oder mailto: */
  ziel: string;
  extern?: boolean;
}

export interface Adresse {
  strasse: string;
  plz: string;
  ort: string;
  land?: string;
}

export interface Oeffnungszeit {
  _key: string;
  /** Sichtbarer Text je Sprache */
  tage: Record<Sprache, string>;
  zeiten: Record<Sprache, string>;
  /** Strukturiert für JSON-LD; ohne diese Felder erscheint der Eintrag nur im Text */
  wochentage?: Wochentag[];
  /** Geöffnete Zeitspannen (HH:MM), z. B. Vormittag und Nachmittag getrennt */
  intervalle?: { _key: string; von: string; bis: string }[];
  geschlossen?: boolean;
}
export type Wochentag = "Montag" | "Dienstag" | "Mittwoch" | "Donnerstag" | "Freitag" | "Samstag" | "Sonntag";

/** Nicht lokalisierte Praxisdaten (ein Dokument). */
export interface Einstellungen {
  praxisname: string;
  /** Vollständiger Name der verantwortlichen Person inkl. akademischer Titel */
  inhaber: string;
  inhaberTitel: string; // z. B. «PD Dr. med. dent.»
  inhaberName: string; // z. B. «Andreas Bindl»
  adresse: Adresse;
  telefon: string;
  fax?: string;
  email: string;
  /** Verbands-/Mitgliedschaftssignet (z. B. SSO) – nur, wenn belegt */
  mitgliedschaft?: { titel: string; url?: string; logo?: Bild };
  logo: Bild;
  /** Externer Routenlink (nur Link, nie Einbettung) */
  routenlink: string;
  /** Einbettungs-URL der Karte – wird ausschliesslich nach Einwilligung geladen */
  kartenEinbettung: string;
  /** Koordinaten für JSON-LD */
  geo?: { breite: number; laenge: number };
  oeffnungszeiten: Oeffnungszeit[];
  /** Herkunft der Öffnungszeiten je Sprache, wenn nicht von der Praxis bestätigt (leer = bestätigt) */
  oeffnungszeitenHinweis?: Record<Sprache, string>;
  seoBild?: Bild;
}

/** Lokalisierte Website-Texte: Navigation, Footer, Bedienelemente, Einwilligung. */
export interface Texte {
  sprache: Sprache;
  navigation: Link[];
  rechtslinks: Link[];
  seo: { titelZusatz: string; beschreibung: string };
  demoHinweis?: string;
  ui: {
    zumInhalt: string;
    menueOeffnen: string;
    menueSchliessen: string;
    sprache: string; // Beschriftung des Sprachwechsels, z. B. «English»
    sprachwechselFehlt: string; // «Diese Seite gibt es nur auf Deutsch»
    anrufen: string;
    emailSchreiben: string;
    routePlanen: string;
    adresseKopieren: string;
    kopiert: string;
    kopierenFehler: string;
    alleOeffnen: string;
    alleSchliessen: string;
    lebenslauf: string;
    sprachen: string;
    download: string;
    dateiGroesse: string; // «PDF, 105 KB»
    zeitenErfragen: string;
    kontaktSeite: string;
    startseite: string;
    nichtGefundenTitel: string;
    nichtGefundenText: string;
    datenschutzEinstellungen: string;
  };
  einwilligung: {
    bannerTitel: string;
    bannerText: string;
    alleAkzeptieren: string;
    nurNotwendige: string;
    einstellungen: string;
    dialogTitel: string;
    dialogText: string;
    auswahlSpeichern: string;
    schliessen: string;
    notwendigTitel: string;
    notwendigText: string;
    immerAktiv: string;
    karteTitel: string;
    karteAnbieter: string;
    karteText: string;
    kartePlatzhalter: string;
    karteAnzeigen: string;
    karteAusblenden: string;
    widerrufen: string;
    keineEntscheidung: string;
    entscheidungVom: string;
    fussnote: string;
    gespeichert: string;
    alleErlaubt: string;
    nurNotwendigeGespeichert: string;
    widerrufenMeldung: string;
    datenschutzerklaerung: string;
  };
  formular: {
    titel: string;
    einleitung: string;
    warnung: string;
    name: string;
    rueckruf: string;
    kontaktwunsch: string;
    kontaktwunschOptionen: { wert: string; titel: string }[];
    nachricht: string;
    nachrichtHilfe: string;
    pflicht: string;
    fehlerName: string;
    emailVorbereiten: string;
    hinweisNachher: string;
  };
}

export type BehandlungsGruppe = "diagnostik" | "vorsorge" | "restaurativ" | "chirurgie" | "weiteres";

export interface Behandlung {
  id: string;
  sprache: Sprache;
  uebersetzungsSchluessel: string;
  titel: string;
  /** Ankerkennung auf der Behandlungsseite (je Sprache), z. B. «wurzelbehandlung» */
  anker: string;
  inhalt: RichText;
  gruppe: BehandlungsGruppe;
  reihenfolge: number;
  /** Redaktionelle Herkunfts-/Prüfangaben – informativ, kein technischer Freigabezwang */
  quelle?: string;
  pruefstatus?: "uebernommen" | "sprachlich-angepasst" | "fachlich-geprueft";
  freigabedatum?: string;
}

export interface Teammitglied {
  id: string;
  sprache: Sprache;
  uebersetzungsSchluessel: string;
  /** Akademische Titel getrennt, damit sie sorgfältig gepflegt werden können */
  titelVor?: string; // «PD Dr. med. dent.»
  vorname: string;
  nachname: string;
  funktion: string; // «Zahnarzt», «Dentalhygieniker HF»
  sprachen: string[]; // «Deutsch», «Englisch»
  bild?: Bild;
  lebenslaufEinleitung?: string;
  lebenslauf?: RichText;
  reihenfolge: number;
}

export interface Download {
  id: string;
  sprache: Sprache;
  uebersetzungsSchluessel: string;
  titel: string;
  /** Pfad unter public/ (lokal) bzw. Datei-URL (Sanity) */
  datei: string;
  dateiname: string;
  groesseKb?: number;
  seiten?: number;
  /** z. B. «Faltblatt der Gesundheitsdirektion Kanton Zürich» */
  hinweis?: string;
  /** Sprache des Dokuments selbst (alle vorhandenen PDFs sind deutsch) */
  dokumentSprache: Sprache;
  reihenfolge: number;
}

export interface Rechtstext {
  id: string;
  sprache: Sprache;
  uebersetzungsSchluessel: string;
  art: "impressum" | "datenschutz";
  titel: string;
  stand?: string;
  inhalt: RichText;
}

/* ------------------------------------------------------------------ */
/* Seitenbausteine                                                      */
/* ------------------------------------------------------------------ */

interface BausteinBasis {
  _key: string;
  /** Sprungziel-Kennung (#anker) für Navigation und Sprachwechsel */
  anker?: string;
  kurzzeile?: string;
  titel?: string;
}

export interface TextBaustein extends BausteinBasis {
  _type: "textBaustein";
  inhalt: RichText;
  /** Optionales Bild neben dem Text */
  bild?: Bild;
  bildPosition?: "links" | "rechts";
}

export interface HinweisBaustein extends BausteinBasis {
  _type: "hinweisBaustein";
  inhalt: RichText;
  art: "info" | "wichtig";
}

export interface BehandlungenBaustein extends BausteinBasis {
  _type: "behandlungenBaustein";
  einleitung?: string;
  /** Leer = alle Behandlungen der Sprache */
  behandlungen: Behandlung[];
  darstellung: "akkordeon" | "kurzliste";
  weiterLink?: Link;
}

export interface TeamBaustein extends BausteinBasis {
  _type: "teamBaustein";
  einleitung?: string;
  team: Teammitglied[];
  mitLebenslauf: boolean;
}

export interface DownloadsBaustein extends BausteinBasis {
  _type: "downloadsBaustein";
  einleitung?: string;
  downloads: Download[];
}

export interface GalerieBaustein extends BausteinBasis {
  _type: "galerieBaustein";
  einleitung?: string;
  bilder: Bild[];
}

export interface BildBaustein extends BausteinBasis {
  _type: "bildBaustein";
  bild: Bild;
  text?: string;
}

export interface KontaktBaustein extends BausteinBasis {
  _type: "kontaktBaustein";
  einleitung?: string;
  anfahrt?: RichText;
  mitKarte: boolean;
  mitFormular: boolean;
}

export interface AufrufBaustein extends BausteinBasis {
  _type: "aufrufBaustein";
  text?: string;
  knopf: Link;
  zweiterKnopf?: Link;
}

export interface RechtstextBaustein extends BausteinBasis {
  _type: "rechtstextBaustein";
  rechtstext: Rechtstext;
}

export type Baustein =
  | TextBaustein
  | HinweisBaustein
  | BehandlungenBaustein
  | TeamBaustein
  | DownloadsBaustein
  | GalerieBaustein
  | BildBaustein
  | KontaktBaustein
  | AufrufBaustein
  | RechtstextBaustein;

export const BAUSTEIN_TYPEN: Baustein["_type"][] = [
  "textBaustein",
  "hinweisBaustein",
  "behandlungenBaustein",
  "teamBaustein",
  "downloadsBaustein",
  "galerieBaustein",
  "bildBaustein",
  "kontaktBaustein",
  "aufrufBaustein",
  "rechtstextBaustein",
];

export interface Hero {
  kurzzeile?: string;
  titel: string;
  text?: string;
  knopf?: Link;
  zweiterKnopf?: Link;
  /** Breites Panoramabild unter dem Titel (Signatur «Horizont») */
  bild?: Bild;
}

export interface Seite {
  id: string;
  sprache: Sprache;
  uebersetzungsSchluessel: string;
  /** «start» für die Startseite der Sprache, sonst URL-Segment */
  slug: string;
  titel: string;
  einleitung?: string;
  seoTitel?: string;
  seoBeschreibung?: string;
  hero?: Hero;
  bausteine: Baustein[];
}

/** Kurzform für Routen/Sprachwechsel */
export interface SeitenVerweis {
  sprache: Sprache;
  slug: string;
  uebersetzungsSchluessel: string;
}

/** Vertrag, den jede Inhaltsquelle erfüllt. */
export interface Inhaltsquelle {
  getEinstellungen(): Promise<Einstellungen>;
  getTexte(sprache: Sprache): Promise<Texte>;
  getSeite(sprache: Sprache, slug: string): Promise<Seite | null>;
  getAlleSeiten(): Promise<SeitenVerweis[]>;
  getBehandlungen(sprache: Sprache): Promise<Behandlung[]>;
  getTeam(sprache: Sprache): Promise<Teammitglied[]>;
  getDownloads(sprache: Sprache): Promise<Download[]>;
  getRechtstext(sprache: Sprache, art: Rechtstext["art"]): Promise<Rechtstext | null>;
}

/** Pfad einer Seite inkl. Sprachsegment, immer mit Schrägstrich am Ende. */
export function seitenPfad(sprache: Sprache, slug: string): string {
  return slug === "start" ? `/${sprache}/` : `/${sprache}/${slug}/`;
}
