/**
 * Banc — I34 — AUCUNE INCISE DE CITATION NE REVIENT DANS LA LIGNE DE LECTURE DE POSOLOGIE
 * (P15/S10, T-204, dernière session de contenu du plan).
 *
 * POURQUOI CET INVARIANT EXISTE, ET POURQUOI MAINTENANT SEULEMENT. P15/S1-S3 a posé un canal PROPRE pour
 * sourcer `Option.posologie_detail` — `{ texte, sources? }`, `sources[]` portant des ids résolus contre
 * la bibliographie du nœud plutôt qu'une parenthèse dans le texte de conduite. S5/S6/S7 ont MIGRÉ le
 * contenu existant vers ce canal, nœud par nœud (`insuline` v0.61, `prescription` v0.75, `statine`
 * v1.31). Un canal propre posé À CÔTÉ des incises, sans qu'un garde-fou n'empêche d'en réécrire une, ne
 * tient pas dans la durée — la prochaine rédaction remettrait une parenthèse de citation dans un texte de
 * conduite, exactement le défaut que la migration vient de corriger. Cet invariant vient EN DERNIER dans
 * le plan (décision de conception, `plans/P15/S10.md`) parce qu'il ne peut être vert qu'une fois les
 * trois migrations livrées : l'écrire plus tôt aurait imposé un `it.fails` de plusieurs semaines, ou pire,
 * la tentation de bâcler une migration pour le verdir.
 *
 * FICHIER DÉDIÉ, ET POURQUOI NI `rendu-textuel.test.ts` NI `jargon-projet.test.ts` NI
 * `invariants-contenu.test.ts`. Cet invariant est STATIQUE — il lit `option.apercu`/
 * `option.posologie_detail[].texte` directement sur le contenu chargé, sans passer par `evaluateNode`/
 * `construireVueDecision` : exactement la distinction que la docstring de tête de `rendu-textuel.test.ts`
 * (I28-I31) donne pour justifier sa PROPRE séparation d'avec `invariants-contenu.test.ts` (« ils testent le
 * texte RÉELLEMENT RENDU... donc `evaluateNode` en amont » — FAUX ici, cet invariant ne l'utilise jamais).
 * Il n'entre donc pas dans `rendu-textuel.test.ts`, qui resterait mal nommé s'il mélangeait scan statique
 * et scan dynamique. Il n'entre pas non plus dans `jargon-projet.test.ts` : même PÉRIMÈTRE de champs
 * (I25 scanne déjà `apercu`/`posologie_detail` via `fragmentsOption`/`texteItemPosologie`, modèle repris
 * ci-dessous), mais famille de défaut DIFFÉRENTE — le jargon de PROJET (I25) contre l'incise de CITATION
 * (ici) — et `invariants-contenu.test.ts` fait déjà 4600+ lignes, au-delà de la taille où un nouveau lot
 * thématiquement distinct reste facile à situer par un lecteur qui n'a besoin que de lui (même raisonnement
 * de taille que celui qui a fait naître `rendu-textuel.test.ts`).
 *
 * PÉRIMÈTRE — EXACTEMENT `option.apercu` et `option.posologie_detail[].texte`, RIEN D'AUTRE. Ce N'EST PAS
 * un oubli que `contre_indications`/`alertes[].message` en soient absents : ces deux types
 * (`ContreIndication`, `Alerte`) NE PORTENT PAS de champ `sources` au schéma — S7 (`statine`, T-201) l'a
 * documenté nommément en laissant le paragraphe CYP3A4 sourcé en PROSE LIBRE (« — ESC/EAS 2019, Table 10 »)
 * à ces deux emplacements, contrainte de schéma explicitement hors périmètre de cette session (aucun code,
 * schéma ni test de banc en dehors de `engine/banc/`, bandeau S10). Le jour où `ContreIndication`/`Alerte`
 * recevront un `sources[]` (sur le modèle d'`ItemPosologie`), l'invariant devra être étendu — pas avant.
 * De même, une seconde occurrence d'« ACC 2020 » vit dans un `alertes[].message` de `prescription`
 * (délai avant chirurgie programmée) : hors périmètre pour la même raison, aucune exemption n'est due ici.
 *
 * LE MARQUEUR — CIBLE LA FORME D'UNE CITATION, PAS TOUTE PARENTHÈSE (`plans/P15/S10.md`, « Décision clé »).
 * Méthode : chaque groupe PARENTHÉSÉ non imbriqué du texte est examiné ISOLÉMENT — le corpus mesuré (les
 * 39 citations relevées par `docs/decision/validation/posologie-sourcage-2026-08-11.md` §1, migrées ou
 * non) n'écrit JAMAIS une citation autrement qu'entre parenthèses. Un groupe est une INCISE DE CITATION
 * si, et seulement si :
 *   1. il NE CONTIENT NI « : » NI GUILLEMET (« »/quotes) — un deux-points ou une citation entre
 *      guillemets À L'INTÉRIEUR de la même parenthèse signale que celle-ci porte une clause explicative
 *      propre à cet emplacement, pas une simple note de bas de page (§4.1 du rapport, les TROIS cas
 *      protégés ci-dessous) ;
 *   2. ET son contenu correspond à au moins UNE forme de citation : organisme/journal + millésime
 *      (« KDIGO 2022 », « JAMA Cardiol 2020 », « SFD 2025 » — un nom d'essai suivi d'un chiffre d'année a
 *      exactement la même forme, aucun sous-marqueur séparé n'est nécessaire), « RCP », « Avis n° »/
 *      « Avis N », ou « R.N » (le grade HAS).
 *
 * TROIS FAUX POSITIFS CONNUS, MESURÉS UN À UN CONTRE LE MARQUEUR (§4.1 du rapport, tous sur `insuline`,
 * AVANT d'écrire l'invariant final — cf. les tests « cas négatif légitime » ci-dessous) :
 *   - la glose de HAS R.87 (« Corriger l'hypoglycémie... ») : « (HAS 2024, R.87, qui écrit la règle dans
 *     les deux sens : « augmentée ou réduite de 1 ou 2 UI ») » — CONTIENT un « : » et des guillemets à
 *     l'intérieur de LA MÊME parenthèse → exclu par la règle 1, malgré « HAS 2024 » et « R.87 » présents ;
 *   - le protocole de FullSTEP (« Bolus au repas principal ») : « (FullSTEP : bande 4,0-7,2 mmol/L, pas de
 *     ± 1 U) » — même raison, le « : » interne l'exclut ;
 *   - « BRIGHT, CONCLUDE » comme sujet de phrase (« Insuline basale ») : ce groupe ne contient NI deux-points
 *     ni guillemet, mais il ne porte non plus AUCUN millésime, aucun « RCP », aucun « Avis n° », aucun
 *     « R.N » — deux noms d'essai nus, sans année accolée, ne remplissent la règle 2 d'AUCUNE façon. C'est
 *     une limite ASSUMÉE, pas un oubli : un essai cité SANS millésime (comme cette forme, ou comme
 *     `(TECOS)`/`(ebmfrance)` avant leur migration) n'est structurellement PAS distinguable, par la seule
 *     forme du texte, d'un nom propre en position de sujet — c'est très exactement ce que demande
 *     `plans/P15/S10.md` (« doit viser la FORME d'une citation... et NE DOIT PAS déclencher sur ces trois
 *     cas »). Un futur essai nu réintroduit en incise NE SERA PAS attrapé par cet invariant ; ce n'est pas
 *     un défaut de ce lot, c'est la frontière que la mission a explicitement tracée.
 *
 * DEUX PRÉCAUTIONS (même discipline qu'I28-I31, `rendu-textuel.test.ts`) :
 *   1. le marqueur est testé contre les VRAIS cas positifs et VRAIS cas négatifs du corpus AVANT d'être
 *      lancé sur les 6 nœuds, jamais un motif au jugé ;
 *   2. les exemptions sont NOMMÉES une par une (nœud + champ + texte EXACT), avec leur motif COPIÉ depuis
 *      le `meta.changelog` du nœud concerné — jamais une règle générique du type « sauf sur tel nœud » —
 *      précédent : `EXEMPTIONS_I28` (`rendu-textuel.test.ts`), qui nomme 8 violations une par une sur
 *      `statine`. AUCUNE exemption n'est due pour les trois faux positifs ci-dessus : ils ne sont jamais
 *      détectés comme violations, ils n'ont donc rien à exempter (à la différence d'une dette qui SERAIT
 *      détectée puis couverte).
 */
import { describe, expect, it } from 'vitest'
import { noeuds } from '../../content/loadNodes.ts'
import type { ItemPosologie, Noeud, Option } from '../../content/node.types.ts'

/** Une violation recensée — nœud, champ, texte EXACT (clé d'exemption, même convention qu'I28/I31). */
interface Violation {
  noeud: string
  champ: string
  texte: string
}

function cleViolation(v: Violation): string {
  return `I34 :: ${v.noeud} :: ${v.champ} :: ${v.texte}`
}

// `posologie_detail` accepte une CHAÎNE ou un objet `ItemPosologie` (T-194, P15/S1) — même normalisation
// que `jargon-projet.test.ts` (`texteItemPosologie`) et `invariants-contenu.test.ts`
// (`texteContreIndication`) : c'est le `texte`, jamais `sources` (des ids, pas de la prose), qui est
// examiné.
function texteItemPosologie(item: string | ItemPosologie): string {
  return typeof item === 'string' ? item : item.texte
}

// =====================================================================================================
// LE MARQUEUR — cf. docstring de tête pour la justification complète de chacune des deux règles.
// =====================================================================================================

/** Contenu d'UN groupe parenthésé (sans les parenthèses) : forme-t-il, À LUI SEUL, une citation ? */
function contenuEstCitation(contenu: string): boolean {
  const aPlat = contenu.trim()
  // Règle 1 — un deux-points ou un guillemet À L'INTÉRIEUR de la même parenthèse signale une clause
  // explicative propre à cet emplacement (la glose HAS R.87, le protocole FullSTEP, §4.1) : ce n'est plus
  // une simple note de bas de page, l'extraire perdrait de l'information clinique.
  if (/[:«»]/.test(aPlat)) return false
  // Règle 2 — la FORME d'une citation, et seulement elle. `\p{L}`/`\p{Lu}` (pas `\w`, qui ignore les
  // lettres accentuées — même piège déjà documenté dans `rendu-textuel.test.ts` I31 et `conditionText.ts`)
  // pour couvrir les organismes accentués sans faux négatif.
  const ORGANISME_MILLESIME = /\p{Lu}[\p{L}]*(?:[\s/]\p{Lu}[\p{L}]*)*\s+(?:19|20)\d{2}\b/u
  const RCP = /\bRCP\b/
  const AVIS_N = /\bAvis\s*(?:n[°o]?\.?)?\s*\d+/iu
  const R_POINT = /\bR\.\d+/
  return ORGANISME_MILLESIME.test(aPlat) || RCP.test(aPlat) || AVIS_N.test(aPlat) || R_POINT.test(aPlat)
}

/** `texte` porte-t-il au moins une incise de citation ? Un groupe suffit — un texte qui en porte
 * plusieurs (ex. « Insuline basale » posologie_detail[4], SFD 2025 Avis 18 bis ET BRIGHT/CONCLUDE dans la
 * même phrase) n'est signalé qu'UNE fois, le champ entier étant l'unité de violation (même granularité
 * qu'I28/I31). Parenthèses NON IMBRIQUÉES : mesuré sur le corpus réel, aucune parenthèse du périmètre
 * `apercu`/`posologie_detail` n'en imbrique une autre (`(...)` ne contient jamais lui-même `(` ou `)`) —
 * si une seule échappait à cette hypothèse, le groupe extérieur ne matcherait simplement rien (le motif
 * `[^()]*` refuse tout caractère `(`/`)`), donc soit son contenu réel serait scanné via le(s) groupe(s)
 * intérieur(s) trouvés séparément, soit rien ne serait signalé à tort — jamais un faux positif.
 */
function porteUneIncise(texte: string): boolean {
  const groupes = [...texte.matchAll(/\(([^()]*)\)/g)].map((m) => m[1])
  return groupes.some(contenuEstCitation)
}

describe('I34 — le marqueur cible la FORME d’une citation, testé contre les trois faux positifs connus AVANT le balayage du corpus', () => {
  it('cas positif — les quatre formes de citation (organisme+millésime, RCP, Avis n°, R.n) rougissent, seules ou combinées', () => {
    expect(porteUneIncise('Réévaluer tous les 3 jours (SFD 2025, Avis 18).')).toBe(true)
    expect(porteUneIncise('Adaptation au DFG (RCP ANSM).')).toBe(true)
    expect(porteUneIncise('Suivre la règle (HAS 2024, R.87).')).toBe(true)
    expect(porteUneIncise('Dose maximale (KDIGO 2022 / RCP ANSM).')).toBe(true)
    expect(porteUneIncise('Arrêt franc (JAMA Cardiol 2020).')).toBe(true)
    expect(porteUneIncise('Contre-indication formelle (ACC 2020).')).toBe(true)
  })

  it('cas négatif légitime — les TROIS faux positifs documentés (§4.1 du rapport de sourçage) ne rougissent JAMAIS', () => {
    // La glose HAS R.87 (« Corriger l'hypoglycémie ou la variabilité », insuline.yaml) — un « : » et des
    // guillemets À L'INTÉRIEUR de la parenthèse : la glose EST l'argument, pas une note de bas de page.
    expect(
      porteUneIncise(
        "Réduire la basale de 2 U, ou de 10 % de la dose si elle dépasse 40 U/j — jusqu'à 4 U si l'hypoglycémie est symptomatique. Réévaluer tous les 3 jours (HAS 2024, R.87, qui écrit la règle dans les deux sens : « augmentée ou réduite de 1 ou 2 UI »).",
      ),
    ).toBe(false)

    // Le protocole de FullSTEP (« Bolus au repas principal », insuline.yaml) — même raison, le « : »
    // interne porte le protocole réel de l'essai, distinct de la cible affichée juste avant.
    expect(
      porteUneIncise(
        "Ajuster sur la glycémie mesurée AVANT LE REPAS SUIVANT, même cible que le matin (0,70-1,30 g/L) : c'est ainsi que les essais de basal-plus ont titré (FullSTEP : bande 4,0-7,2 mmol/L, pas de ± 1 U).",
      ),
    ).toBe(false)

    // « BRIGHT, CONCLUDE » sujet de phrase (« Insuline basale », insuline.yaml) — deux noms d'essai SANS
    // millésime : aucune des quatre formes de citation n'est remplie, cf. docstring de tête.
    expect(porteUneIncise('Les deux molécules de 2ᵉ génération ne se départagent pas entre elles en tête-à-tête (BRIGHT, CONCLUDE).')).toBe(
      false,
    )
  })

  it('cas négatif légitime — une parenthèse clinique ordinaire (posologie, molécule, seuil) ne rougit jamais', () => {
    expect(porteUneIncise('dapagliflozine 10 mg/j (fixe) ; empagliflozine 10→25 mg/j (DFG ≥ 60).')).toBe(false)
    expect(porteUneIncise('Repli fixe de 10 U le soir (poids non disponible).')).toBe(false)
    expect(porteUneIncise('préférer un analogue basal de 2ᵉ génération (glargine U300 ou dégludec).')).toBe(false)
    // « la SFD (2023/2025) » (Sulfamide DFG<30, prescription.yaml) : l'organisme est HORS parenthèse, le
    // groupe lui-même ne porte que des millésimes SANS lettre — limite assumée (cf. docstring de tête, la
    // règle 2 exige un mot capitalisé DANS le même groupe). N'affaiblit rien ici : la même option porte
    // par ailleurs « (RCP, rubrique 4.4) », qui rougit et couvre donc le champ entier.
    expect(porteUneIncise('seuil DFG < 30 cité par la SFD (2023/2025).')).toBe(false)
  })

  it('mord sur un cas fabriqué, et laisse passer un négatif fabriqué (preuve que l’invariant sert, patron I24)', () => {
    const optionAvecIncise: Option = {
      intitule: 'Option synthétique I34',
      role: 'geste',
      avantages: [],
      inconvenients: [],
      effet_attendu: 'non chiffrable',
      niveau_preuve: 'faible',
      conditions: ['default'],
      apercu: 'Geste fabriqué, à ajuster selon la réponse (ADA 2026).',
      posologie_detail: [{ texte: 'Titrer par paliers (Avis n° 7).' }, 'Aucune citation ici, rien à signaler.'],
    }
    expect(porteUneIncise(optionAvecIncise.apercu!)).toBe(true)
    expect(porteUneIncise(texteItemPosologie(optionAvecIncise.posologie_detail![0]))).toBe(true)
    expect(porteUneIncise(texteItemPosologie(optionAvecIncise.posologie_detail![1]))).toBe(false)
  })
})

// =====================================================================================================
// BALAYAGE DU CORPUS RÉEL.
// =====================================================================================================

/** Violations d'I34 sur UN nœud : `apercu` et chaque item de `posologie_detail`, TOUTES options. */
function violationsNoeud(node: Noeud): Violation[] {
  const violations: Violation[] = []
  for (const option of node.options) {
    if (option.apercu && porteUneIncise(option.apercu)) {
      violations.push({ noeud: node.id, champ: `option "${option.intitule}".apercu`, texte: option.apercu })
    }
    ;(option.posologie_detail ?? []).forEach((item, i) => {
      const texte = texteItemPosologie(item)
      if (porteUneIncise(texte)) {
        violations.push({ noeud: node.id, champ: `option "${option.intitule}".posologie_detail[${i}]`, texte })
      }
    })
  }
  return violations
}

/**
 * EXEMPTIONS NOMMÉES — une par citation restée en incise VOLONTAIREMENT, motif COPIÉ depuis le
 * `meta.changelog` du nœud (entrée la plus récente qui documente la migration de sourçage, S5/S6/S7 du
 * plan P15). Auto-expirante (même convention qu'`EXEMPTIONS_I28`, `rendu-textuel.test.ts`) : une
 * reformulation, même minime, du texte affiché fait EXPIRER l'exemption — vérifié en fin de bloc.
 *
 * `statine` (S7, T-201) : AUCUNE exemption — les 5 citations du nœud sont TOUTES converties en
 * `{ texte, sources }`, et le paragraphe CYP3A4 non sourcé par ce canal vit dans `contre_indications`/
 * `alertes[].message`, hors périmètre de cet invariant (cf. docstring de tête). `violationsNoeud('statine')`
 * doit rester vide — c'est un FAIT vérifié, pas une case à cocher.
 */
const EXEMPTIONS_I34 = new Map<string, string>([
  // ── insuline v0.62 (S5, T-199) — 1 CITATION SUR 14 NON MAPPABLE ────────────────────────────────────
  [
    cleViolation({
      noeud: 'insuline',
      champ: 'option "Insuline basale".posologie_detail[4]',
      texte:
        "Choix de la MOLÉCULE, piloté par le risque hypoglycémique — fragilité, espérance de vie limitée, âge ≥ 75 ans, schéma à risque hypoglycémique élevé, ou antécédent d'hypoglycémie sévère récurrente : préférer un analogue basal de 2ᵉ génération (glargine U300 ou dégludec) à glargine U100, détémir, a fortiori à la NPH (SFD 2025, Avis 18 bis). Les deux molécules de 2ᵉ génération ne se départagent pas entre elles en tête-à-tête (BRIGHT, CONCLUDE) : la préférence se joue au niveau de la CLASSE, pas d'une molécule nommée. Hors ce contexte de risque élevé, glargine U100, détémir ou NPH restent des choix valides, à surcoût moindre.",
    }),
    "P15/S5, T-199 (insuline.yaml meta.changelog 2026-08-11) — « (SFD 2025, Avis 18 bis) » NON MAPPABLE : " +
      "le libellé correspond à sources.reco_officielle.references[0].detail (« Avis 18 bis »), qui ne porte " +
      "pas d'id sur ce nœud ; sfd-2025-avis18 (seul id « SFD » du registre references_primaires) couvre les " +
      'Avis 18, 19 et 23, PAS le 18 bis — lui attacher cet id aurait été une fausse traçabilité. Reste en ' +
      "incise jusqu'à ce que ce texte de reco_officielle reçoive son propre id. (Le « (BRIGHT, CONCLUDE) » " +
      'de la même phrase ne déclenche pas le marqueur — cf. les trois faux positifs de la docstring de tête.)',
  ],
  // ── prescription v0.75 (S6, T-200) — 8 OPTIONS « apercu SEUL » NE PASSENT PAS PAR LA FORME LONGUE ───
  // (13 options à `apercu` seul existent sur ce nœud ; `apercu` reste `string` au schéma — la migration
  // R4 ne s'applique qu'à `posologie_detail`, convertir ces options est un déplacement de contenu hors
  // périmètre de S6, cf. son changelog.)
  [
    cleViolation({
      noeud: 'prescription',
      champ: 'option "Metformine (DFG < 30)".apercu',
      texte: 'arrêt immédiat, sans décroissance : contre-indication formelle dès DFG < 30 (KDIGO 2022).',
    }),
    'P15/S6, T-200 (prescription.yaml meta.changelog 2026-08-11) — sourcée RECO (KDIGO 2022) mais ' +
      "apercu-only : la forme longue { texte, sources } n'existe que sur posologie_detail, pas sur apercu " +
      '(string au schéma) ; convertir est un déplacement de contenu, hors périmètre de S6.',
  ],
  // « Metformine » (option réduire) : exemption RÉSORBÉE le 2026-08-14 (retour utilisateur en
  // consultation) — cette option est désormais migrée vers `posologie_detail` avec `sources:
  // [kdigo-2022, rcp-ansm]`, et son `apercu` ne porte plus l'incise « initiation ≤ 500 mg (KDIGO 2022 /
  // RCP ANSM) » (retirée, hors de propos sur une option `action: reduire`). Entrée supprimée.
  [
    cleViolation({
      noeud: 'prescription',
      champ: 'option "Sulfamide (DFG < 30)".apercu',
      texte:
        "arrêt, sans décroissance ; l'hypoglycémie peut persister après la dernière prise, par accumulation (RCP, rubrique 4.4) — seuil DFG < 30 cité par la SFD (2023/2025).",
    }),
    'P15/S6, T-200 — deux points « À ARBITRER » du rapport de sourçage (§1.2), non résorbés par S6 : ' +
      '« RCP, rubrique 4.4 » (quel RCP de sulfamide ? gliclazide, glimépiride ?) et « la SFD (2023/2025) » ' +
      "(le millésime 2023 est-il un reliquat ?) — les entrées bibliographiques rcp-sulfamides/sfd-2023 " +
      "existent désormais, mais l'incise reste en place faute de canal (apercu-only), et faute d'arbitrage " +
      'sur CE que chaque citation désigne exactement.',
  ],
  [
    cleViolation({
      noeud: 'prescription',
      champ: 'option "iSGLT2".apercu',
      texte: 'arrêt net, sans demi-dose : aucune relation dose-effet démontrée sur le bénéfice cardio-rénal (ACC 2020).',
    }),
    'P15/S6, T-200 — ACC 2020 vérifié et versé en bibliographie (acc-2020) mais apercu-only, hors ' +
      'périmètre de S6.',
  ],
  [
    cleViolation({
      noeud: 'prescription',
      champ: 'option "Gliptine (redondante)".apercu',
      texte: 'arrêt franc, sans fenêtre de chevauchement ni décroissance (JAMA Cardiol 2020).',
    }),
    "P15/S6, T-200 — AUCUNE entrée bibliographique créée pour JAMA Cardiol 2020 (décision référent du " +
      '2026-08-11, §Q1 du rapport d’arbitrage) : sources.reco_officielle exclut nommément les revues ' +
      'secondaires (D48, amende D23) — JAMA Cardiol 2020 est une revue narrative à encadré de conduite, le ' +
      "cas exact que D48 vise. Le texte garde son attribution en prose libre, sans citation résolue, ET " +
      'apercu-only de toute façon.',
  ],
  [
    cleViolation({
      noeud: 'prescription',
      champ: 'option "Sulfamide".apercu',
      texte:
        "arrêt sans décroissance (pas de sevrage progressif requis pour un insulinosécréteur, comme pour « Sulfamide (DFG < 30) ») ; à l'introduction d'un AR GLP‑1, arrêt si HbA1c ≤ 7,5 % (avis d'experts, JAMA Cardiol 2020).",
    }),
    'P15/S6, T-200 — même motif que « Gliptine (redondante) » : JAMA Cardiol 2020 sans entrée ' +
      'bibliographique (D48), attribution en prose libre (« avis d’experts »), et apercu-only.',
  ],
  [
    cleViolation({
      noeud: 'prescription',
      champ: 'option "Insuline".apercu',
      texte:
        "en relais thérapeutique (introduction d'un autre agent) : −10 à −20 %, ou −20 à −30 % si à l'objectif ou hypoglycémie — jamais d'arrêt brutal sans relais (avis d'experts, AAFP 2026 / JAMA Cardiol 2020) ; en allègement isolé hors relais : au jugement clinique, aucun rythme chiffré sourcé.",
    }),
    'P15/S6, T-200 — DEUX citations non résorbées sur ce champ : JAMA Cardiol 2020 (D48, cf. ci-dessus) ET ' +
      'AAFP 2026, GARDÉE EN L’ÉTAT (décision référent : source réelle non identifiée avec certitude, ' +
      'recherche hors P15, remontée au backlog) ; apercu-only.',
  ],
  [
    cleViolation({
      noeud: 'prescription',
      champ: 'option "Sulfamide — réduire la posologie".apercu',
      texte:
        "à l'introduction d'un AR GLP‑1 : −50 % si HbA1c 7,6-8,5 % · maintien de la dose si > 8,5 % (avis d'experts, JAMA Cardiol 2020) ; en allègement isolé hors relais : au jugement clinique, aucun rythme chiffré sourcé.",
    }),
    'P15/S6, T-200 — même motif JAMA Cardiol 2020 (D48) qu’« Insuline »/« Gliptine (redondante) »/' +
      '« Sulfamide », apercu-only.',
  ],
])

describe('I34 — aucune incise de citation dans `apercu`/`posologie_detail[].texte` (P15/S10, T-204)', () => {
  const violations = noeuds.flatMap(violationsNoeud)

  it('dette NOMMÉE au plus fin (S5/S6/S7 la documentent) ; toute violation NOUVELLE (non nommée) fait échouer le test', () => {
    const nonExemptees = violations.filter((v) => !EXEMPTIONS_I34.has(cleViolation(v)))
    expect(nonExemptees).toEqual([])
    // Auto-expiration (même convention qu'I28/I31) : une exemption qui ne correspond plus à AUCUNE
    // violation réelle est une dette résorbée — à retirer, pas à oublier ici. Une reformulation, même
    // minime, du texte affiché fait donc échouer CETTE assertion tant que la Map n'est pas mise à jour.
    for (const cle of EXEMPTIONS_I34.keys()) {
      expect(violations.some((v) => cleViolation(v) === cle), `exemption I34 résorbée ou reformulée, à retirer/mettre à jour : ${cle}`).toBe(
        true,
      )
    }
  })

  it('statine — AUCUNE citation en incise (S7, T-201 : 5 sur 5 converties, aucune exemption due)', () => {
    expect(violationsNoeud(noeuds.find((n) => n.id === 'statine')!)).toEqual([])
  })

  it('BILAN — imprime le tableau des violations I34 (nœud · champ · texte), pour traçabilité', () => {
    const tri = [...violations].sort((a, b) => a.noeud.localeCompare(b.noeud))
    // eslint-disable-next-line no-console
    console.log(
      `\n[I34 — ${tri.length} violations, toutes exemptées nommément — cf. docstring de tête]\n` +
        tri.map((v) => `  - ${v.noeud} :: ${v.champ} :: "${v.texte}"`).join('\n'),
    )
    expect(tri.length).toBeGreaterThanOrEqual(0) // assertion factice : ce test sert à IMPRIMER, pas à trancher.
  })
})
