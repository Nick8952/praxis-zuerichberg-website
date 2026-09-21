import { adresseTyp, bildTyp, linkTyp, oeffnungszeitTyp, richTextTyp, zweisprachigTyp } from "./objekte";
import { bausteine } from "./bausteine";
import { behandlungTyp, downloadTyp, einstellungenTyp, rechtstextTyp, seiteTyp, teammitgliedTyp, texteTyp } from "./dokumente";

export const schemaTypes = [
  // Objekte
  bildTyp,
  linkTyp,
  richTextTyp,
  adresseTyp,
  zweisprachigTyp,
  oeffnungszeitTyp,
  ...bausteine,
  // Dokumente
  einstellungenTyp,
  texteTyp,
  seiteTyp,
  behandlungTyp,
  teammitgliedTyp,
  downloadTyp,
  rechtstextTyp,
];
