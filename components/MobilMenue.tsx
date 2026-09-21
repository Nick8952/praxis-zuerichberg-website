"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import type { Link as LinkTyp, Sprache, Texte } from "@/lib/content/types";
import { MenueIcon, SchliessenIcon, TelefonIcon } from "./Icons";
import { Sprachwechsel } from "./Sprachwechsel";

interface Props {
  sprache: Sprache;
  t: Texte;
  telefon: string;
  tel: string;
  praxisname: string;
  sprachZiel?: string;
}

/** Mobile Navigation als natives <dialog> (modal): Fokusfang, Esc, Klick auf den Hintergrund; Fokus kehrt zurück. */
export function MobilMenue({ sprache, t, telefon, tel, praxisname, sprachZiel }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const pfad = usePathname();
  useEffect(() => {
    dialog.current?.close();
  }, [pfad]);
  const eintraege: LinkTyp[] = [{ titel: t.ui.startseite, ziel: `/${sprache}/` }, ...t.navigation];
  return (
    <div className="lg:hidden">
      <button type="button" onClick={() => dialog.current?.showModal()} className="knopf knopf-sekundaer min-h-11 w-11 px-0" aria-label={t.ui.menueOeffnen} aria-haspopup="dialog">
        <MenueIcon />
      </button>
      <dialog
        ref={dialog}
        aria-label={t.ui.menueOeffnen}
        className="m-0 h-dvh max-h-none w-full max-w-none overflow-y-auto bg-weiss text-tinte backdrop:bg-tinte/40"
        onClick={(ev) => {
          if (ev.target === dialog.current) dialog.current?.close();
        }}
      >
        <div className="flex min-h-full flex-col px-rand pb-8 pt-4">
          <div className="flex h-12 items-center justify-between">
            <span className="font-semibold text-aubergine">{praxisname}</span>
            <button type="button" onClick={() => dialog.current?.close()} className="knopf knopf-sekundaer min-h-11 w-11 px-0" aria-label={t.ui.menueSchliessen}>
              <SchliessenIcon />
            </button>
          </div>
          <nav aria-label={t.ui.menueOeffnen} className="mt-6">
            <ul className="divide-y divide-linie border-y border-linie">
              {eintraege.map((l) => {
                const aktiv = pfad === l.ziel || (l.ziel !== `/${sprache}/` && pfad.startsWith(l.ziel));
                return (
                  <li key={l.ziel}>
                    <Link href={l.ziel} className={`flex min-h-14 items-center text-xl font-semibold ${aktiv ? "border-l-4 border-lime pl-3 text-aubergine" : "text-aubergine"}`} aria-current={aktiv ? "page" : undefined}>
                      {l.titel}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          <a href={`tel:${tel}`} className="knopf knopf-primaer mt-6 w-full">
            <TelefonIcon />
            {t.ui.anrufen} {telefon}
          </a>
          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-grau">
            <Sprachwechsel sprache={sprache} ziel={sprachZiel} beschriftung={t.ui.sprache} startseite={t.ui.startseite} fehltText={t.ui.sprachwechselFehlt} voll className="-ml-3" />
            {t.rechtslinks.map((l) => (
              <Link key={l.ziel} href={l.ziel} className="inline-flex min-h-11 items-center underline-offset-4 hover:underline">
                {l.titel}
              </Link>
            ))}
          </div>
        </div>
      </dialog>
    </div>
  );
}
