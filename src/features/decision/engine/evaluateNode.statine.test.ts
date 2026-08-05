/**
 * Banc de vignettes cliniques du nœud `statine` (`content/noeuds/diabete-type-2/statine.yaml`,
 * `docs/decision/noeuds/F-statine.md` §9). Le nœud n'avait ENCORE AUCUNE vignette exécutable — ce
 * fichier couvre les 9 vignettes F-01…F-09 VALIDÉES PAR LE RÉFÉRENT (recette in-app 2026-07-25/26,
 * DECISIONS.md D20 « valeur indéterminée » et D21 « canal d'un fait de sécurité »).
 *
 * RÈGLE DE CE BANC : l'attendu vient du RÉFÉRENT (tableau F-statine.md §9 / consigne de tâche), jamais
 * du moteur — on n'exécute pas `evaluateNode` pour EN DÉDUIRE l'attente. Quand attente et comportement
 * divergent, la vignette est ROUGE (`it.fails` avec le motif référent), et c'est le livrable.
 *
 * Modèle de style : `evaluateNode.prescription.test.ts` (MOTEUR RÉEL : `evaluateNode` +
 * `calculerCriteresDerives` ; ce dernier est un no-op pour `statine`, dont aucun critère ne porte de
 * `derive` — appelé quand même pour rester sur le même pipeline que les autres bancs, et rester correct
 * si un `derive` apparaît un jour sur ce nœud).
 *
 * PAS DE VIGNETTE SUR L'ÂGE COMME CRITÈRE DE DÉCISION (consigne de tâche, F-statine.md §9.4) : `age` est
 * délibérément NON DÉCISIF sur les options (référent : « tout dépend de l'ancienneté du diabète et des
 * atteintes d'organe, on colle à la grille ») — il n'agit que via l'alerte `> 75 ans`. F-06/F-07
 * vérifient SEULEMENT que cette alerte se déclenche/ne se déclenche pas, jamais que l'âge oriente le tier.
 */
import { describe, expect, it } from 'vitest'
import { getNoeudById } from '../content/loadNodes.ts'
import { calculerCriteresDerives } from './deriveCritere.ts'
import { evaluateNode } from './evaluateNode.ts'
import { construireVueDecision } from '../lib/vueDecision.ts'
import type { Criteria } from './conditions.ts'
import type { Option } from '../content/node.types.ts'

const node = getNoeudById('statine')
if (!node) throw new Error('Nœud "statine" introuvable (content/noeuds/diabete-type-2/statine.yaml).')

// Les 3 options du nœud (ordered-first-match, D11), retrouvées par référence pour indexer
// `excluded`/`nonRetenues`/`enAttente` (Map<Option, …>) — jamais par recherche de chaîne à l'assertion.
const OPT_HAUTE = node.options.find((o) => o.intitule.includes('Statine de haute intensité'))
const OPT_DISCUTER = node.options.find((o) => o.intitule.includes('Discuter la statine'))
const OPT_MODEREE = node.options.find((o) => o.intitule.includes('prévention primaire'))
if (!OPT_HAUTE || !OPT_DISCUTER || !OPT_MODEREE) {
  throw new Error('Les 3 options attendues du nœud "statine" sont introuvables (intitulés modifiés ?).')
}

/**
 * Profil « neutre » : diabète récent (5 ans), sans FDR additionnel, non compliqué, sans ASCVD, sans
 * dialyse, sans statine en cours, sans intolérance — tombe par défaut dans le tier « Discuter » (2e
 * option). Chaque vignette écrase les champs qui la caractérisent ; jamais `age` seul (cf. en-tête).
 */
const BASE: Criteria = {
  age: 60,
  ASCVD_etablie: false,
  anciennete_diabete_annees: 5,
  autres_FDRCV: 0,
  diabete_complique: false,
  dialyse: false,
  statine_deja_en_place: false,
  // ENUM depuis le 2026-07-27 (3 valeurs : non / rapportee / averee). `CK_x_normale` est le second critère
  // du même lot — d'abord un booléen `CK_sup_5N`, remplacé le soir même par un NOMBRE quand la lecture du
  // parcours NHS a montré que trois seuils distincts agissent (4 / 10 / 50). 0 = NON DOSÉ, et c'est la
  // valeur sûre : aucune comparaison `> 4` n'est vraie à 0.
  // Comme `BASE` est écrit à la main et ne dérive pas de `buildDefaultCriteria`, tout critère nouveau doit
  // y être ajouté explicitement, sous peine de `ConditionError: Variable de critère inconnue`.
  intolerance_statine: 'non',
  // `CK_x_normale` est devenu un critère DÉRIVÉ le 2026-08-03 (T-133, P12/S8) : `CK_UI_L / CK_normale_sup`,
  // plus jamais saisi directement (calculerCriteresDerives, appelé par `evalProfile` ci-dessous, ÉCRASE
  // toute valeur posée ici pour `CK_x_normale`). `CK_normale_sup: 1` évite toute division par zéro (qui
  // rendrait `CK_x_normale` INDÉTERMINÉ plutôt que 0) : diviser par 1 laisse `CK_UI_L` reproduire
  // EXACTEMENT l'ancien `CK_x_normale` dans chaque vignette qui écrase `CK_UI_L` ci-dessous.
  CK_UI_L: 0,
  CK_normale_sup: 1,
}

function evalProfile(overrides: Partial<Criteria>, renseignes?: ReadonlySet<string>) {
  const criteria = calculerCriteresDerives(node!.criteres_entree, { ...BASE, ...overrides } as Criteria)
  return evaluateNode(node!, criteria, renseignes)
}
const titles = (o: Partial<Criteria>) => evalProfile(o).applicable.map((opt: Option) => opt.intitule)
const alertMsgs = (o: Partial<Criteria>) => evalProfile(o).alertes.map((a) => a.message)
const has = (list: string[], sub: string) => list.some((t) => t.includes(sub))

describe('statine — F-01/F-04 : tiers de base (ordered-first-match, D11)', () => {
  it('F-01 — ASCVD établie, 60 ans : haute intensité, prévention secondaire (seule condition retenue)', () => {
    const o = { ASCVD_etablie: true, age: 60, anciennete_diabete_annees: 8, autres_FDRCV: 1 } as Partial<Criteria>
    const result = evalProfile(o)
    expect(result.applicable).toEqual([OPT_HAUTE])
    expect(result.reasons.get(OPT_HAUTE)).toEqual(['ASCVD_etablie == true'])
    expect(has(titles(o), 'Discuter la statine')).toBe(false)
    expect(has(titles(o), 'intensité modérée')).toBe(false)
  })

  it('F-04 — 55 ans, diabète 12 ans, 2 FDR, non compliqué, pas d’ASCVD : prévention primaire, intensité modérée (repli)', () => {
    const o = {
      age: 55,
      ASCVD_etablie: false,
      anciennete_diabete_annees: 12,
      autres_FDRCV: 2,
      diabete_complique: false,
    } as Partial<Criteria>
    const result = evalProfile(o)
    expect(result.applicable).toEqual([OPT_MODEREE])
    // Contenu du "pourquoi PAS" : la 1re et unique condition de "haute intensité" est fausse ; la
    // PREMIÈRE des 3 conditions de "Discuter" à échouer est l'ancienneté (12 ans, pas < 10).
    expect(result.nonRetenues.get(OPT_HAUTE)).toBe('ASCVD_etablie == true')
    expect(result.nonRetenues.get(OPT_DISCUTER)).toBe('anciennete_diabete_annees < 10')
    expect(result.excluded.size).toBe(0)
  })
})

describe('statine — F-02/F-03 : dialyse × statine déjà en place (D21, cœur du lot)', () => {
  // Ces deux vignettes verrouillent l'équilibre du nœud : 3 options en ordered-first-match dont la 3e
  // est le repli — une exclusion mal posée sur la 1re viderait le nœud entier si les 2 autres options ne
  // relayaient pas. C'est précisément pour cela que le référent a fait ajouter `statine_deja_en_place`
  // et `intolerance_statine` (F-statine.md §9.1).

  it('F-02 — dialysé SANS statine en place, ASCVD établie : haute intensité ÉCARTÉE avec son motif, le nœud continue (jamais muet)', () => {
    const o = {
      ASCVD_etablie: true,
      dialyse: true,
      statine_deja_en_place: false,
    } as Partial<Criteria>
    const result = evalProfile(o)
    // Écartée, PAS silencieusement : `excluded`, avec le motif exact de l'exclusion structurelle D21.
    expect(result.excluded.has(OPT_HAUTE)).toBe(true)
    expect(result.excluded.get(OPT_HAUTE)).toEqual(['dialyse == true AND statine_deja_en_place == false'])
    expect(result.nonRetenues.has(OPT_HAUTE)).toBe(false) // écartée, pas "non indiquée" : deux registres distincts
    // Le nœud CONTINUE : un autre tier est désigné (ici "Discuter", conditions par ailleurs satisfaites
    // par le profil neutre BASE) — jamais d'écran vide derrière l'exclusion.
    expect(result.applicable).toEqual([OPT_DISCUTER])
    // L'alerte dialyse reste affichée (canal alerte de nœud, D21) — rappel EBM, indépendant du tier retenu.
    expect(alertMsgs(o).some((m) => m.includes("l'option de haute intensité") && m.includes("n'est plus proposée"))).toBe(true)
  })

  it('F-03 — dialysé AVEC statine en place, ASCVD établie : haute intensité MAINTENUE, la poursuite reste offerte', () => {
    const o = {
      ASCVD_etablie: true,
      dialyse: true,
      statine_deja_en_place: true,
    } as Partial<Criteria>
    const result = evalProfile(o)
    expect(result.excluded.has(OPT_HAUTE)).toBe(false) // exclusion NON déclenchée : statine_deja_en_place == true
    expect(result.applicable).toEqual([OPT_HAUTE])
    expect(result.reasons.get(OPT_HAUTE)).toEqual(['ASCVD_etablie == true'])
    // Même alerte dialyse affichée (elle ne dépend que de `dialyse == true`) — son texte couvre
    // explicitement ce cas : "si une statine est DÉJÀ en place, sa poursuite reste raisonnable".
    expect(alertMsgs(o).some((m) => m.includes('poursuite reste raisonnable'))).toBe(true)
  })
})

describe('statine — F-05/F-08 : alertes (D15)', () => {
  it('F-05 — 45 ans, diabète 3 ans, 0 FDR, non compliqué : "Discuter la statine" + alerte SCORE2 portant la réserve "40-69 ans"', () => {
    const o = {
      age: 45,
      ASCVD_etablie: false,
      anciennete_diabete_annees: 3,
      autres_FDRCV: 0,
      diabete_complique: false,
    } as Partial<Criteria>
    const result = evalProfile(o)
    expect(result.applicable).toEqual([OPT_DISCUTER])
    const score2 = result.alertes.find((a) => a.message.includes('SCORE2-Diabète'))
    expect(score2).toBeDefined()
    expect(score2?.message).toContain('40-69 ans')
  })

  it('F-06 — 82 ans, prévention primaire (pas d’ASCVD) : alerte "> 75 ans" présente', () => {
    const o = {
      age: 82,
      ASCVD_etablie: false,
      anciennete_diabete_annees: 15,
      autres_FDRCV: 1,
      diabete_complique: false,
    } as Partial<Criteria>
    expect(alertMsgs(o).some((m) => m.includes('75 ans'))).toBe(true)
  })

  it('F-07 — 82 ans AVEC ASCVD établie : alerte "> 75 ans" ABSENTE — point correct à PROTÉGER, pas à "corriger"', () => {
    // F-statine.md §9.3 : « chez un patient de 90 ans avec ASCVD établie, l'alerte > 75 ans ne se
    // déclenche pas — c'est délibéré [...] le gate ASCVD_etablie == false fait exactement ce qu'il doit. »
    // Cette vignette existe pour empêcher qu'une passe de correction zélée « répare » ce comportement :
    // en prévention SECONDAIRE, le bénéfice de la statine persiste à tout âge (texte même de l'alerte).
    const o = { age: 82, ASCVD_etablie: true } as Partial<Criteria>
    const result = evalProfile(o)
    expect(result.applicable).toEqual([OPT_HAUTE]) // prévention secondaire, comme F-01/F-03
    expect(alertMsgs(o).some((m) => m.includes('75 ans'))).toBe(false)
  })

  it('F-08 — intolérance à la statine déclarée : l’alerte intolérance se déclenche', () => {
    const o = { intolerance_statine: 'rapportee' } as Partial<Criteria>
    expect(alertMsgs(o).some((m) => m.includes('Intolérance aux statines RAPPORTÉE'))).toBe(true)
  })
})

describe('statine — F-09 : formulaire vierge, valeur indéterminée (D20, révisé D30)', () => {
  // ⚠ VIGNETTE RÉVISÉE le 2026-07-27 (soir), passage A1+A2, PUIS À NOUVEAU le 2026-07-28 (P4/S1, T-018,
  // D30) — et c'est de nouveau un CHANGEMENT DE COMPORTEMENT, pas une correction de test.
  //
  // CE QUI A CHANGÉ ENTRE-TEMPS (D30, amende D20) : `bool`/`liste` sont désormais INDÉTERMINÉS PAR
  // DÉFAUT, comme `nombre`/`enum`, sauf `presomption_non: true`. Sur `statine`, l'audit mécanique de
  // T-018 (étape 4) a posé `presomption_non: true` sur `ASCVD_etablie` (n'y garde aucune `exclusions` ni
  // condition d'option `role: securite`) mais PAS sur `dialyse` ni `statine_deja_en_place` — tous deux
  // gardent une `exclusions`/condition `role: securite` réelle sur ce nœud, donc restent indéterminés
  // tant que non renseignés. `diabete_complique` perd le champ `confirmation_requise` (devenu
  // `presomption_non`, jamais posé sur lui) mais reste indéterminé par défaut, comme avant.
  //
  // CONSÉQUENCE SUR LA HALTE : la toute PREMIÈRE option du nœud, « Interrompre la statine 4 à 6 semaines
  // et réévaluer », porte la condition « intolerance_statine == rapportee AND CK_x_normale > 5 AND
  // statine_deja_en_place == true ». Auparavant, `statine_deja_en_place == false` (déterminé par défaut)
  // rendait ce ET FAUX avec certitude (court-circuit), et le moteur passait à l'option suivante — jusqu'à
  // « Débuter la statine à dose plus faible », où il finissait par haltrer sur `intolerance_statine`/
  // `CK_x_normale`. `statine_deja_en_place` étant désormais INDÉTERMINÉ (aucune présomption possible), ce
  // ET ne peut plus être tranché FAUX : le moteur HALTE dès la toute première option (D11 : l'ordre du
  // nœud fait foi, il ne saute jamais une option indéterminée).
  //
  // POURQUOI CE N'EST PAS UNE RÉGRESSION DE SÉCURITÉ, AU CONTRAIRE. `applicable` reste VIDE : le nœud
  // n'a jamais rien affirmé sur un formulaire vierge, et il ne le fait toujours pas. Ce qui change est
  // que le moteur cesse d'affirmer silencieusement « ce patient n'est pas déjà sous statine » — exactement
  // le défaut de fond que D30 corrige (D-02 de la recette navigateur du 2026-07-28 portait précisément
  // sur `statine_deja_en_place` lu comme « non » alors que jamais renseigné).
  it('F-09 — `renseignes` vide : aucun tier désigné, halte dès « Interrompre la statine 4 à 6 semaines et réévaluer » (indéterminée, D30 : `statine_deja_en_place` ne peut plus être présumé), ni "haute intensité" ni "Discuter" ni le repli ne sont atteints', () => {
    // D30 : `nombre`/`enum`/`bool`/`liste` non renseignés sont TOUS INDÉTERMINÉS, sauf `presomption_non:
    // true` (seul `ASCVD_etablie` ici). Les valeurs ci-dessous sont des PLACEHOLDERS non lus par le
    // moteur avant renseignement (indéterminés) — présentes seulement pour satisfaire `variable in
    // criteria` (le moteur distingue "absent" -> erreur de "non renseigné" -> indéterminé).
    const vierge: Criteria = {
      age: 0,
      ASCVD_etablie: false,
      anciennete_diabete_annees: 0,
      autres_FDRCV: 0,
      diabete_complique: false,
      dialyse: false,
      statine_deja_en_place: false,
      intolerance_statine: 'non',
      // `CK_x_normale` reste un placeholder ici : ce test appelle `evaluateNode` DIRECTEMENT (jamais
      // `calculerCriteresDerives`), donc cette valeur brute est bien celle que le moteur lit pour évaluer
      // les CONDITIONS des options — inchangé par T-133. `CK_UI_L`/`CK_normale_sup` (les nouvelles
      // PRIMITIVES) sont ajoutés pour la même raison que les autres champs de cet objet : satisfaire
      // `variable in criteria` si jamais un futur appelant les évalue directement.
      CK_x_normale: 0,
      CK_UI_L: 0,
      CK_normale_sup: 0,
    }
    const result = evaluateNode(node!, vierge, new Set())

    // Le défaut 13.1 corrigé par D20/D30 : sur formulaire vierge, AUCUN tier n'est désigné (ni "haute
    // intensité", ni "Discuter", ni "intensité modérée" par défaut de convergence) — jamais un tier
    // affirmé sur des critères non renseignés.
    expect(result.applicable).toEqual([])

    // LA HALTE A LIEU ICI DÉSORMAIS, dès la première option du nœud : elle est EN ATTENTE, et elle nomme
    // les trois critères qui la lèveraient (les trois opérandes de son ET sont indéterminés).
    const OPT_INTERROMPRE_RAPPORTEE = node!.options.find((o) =>
      o.intitule.startsWith('Interrompre la statine 4 à 6 semaines'),
    )!
    expect(result.enAttente.has(OPT_INTERROMPRE_RAPPORTEE)).toBe(true)
    // `CK_x_normale` (mentionné littéralement dans la condition de l'option) est désormais DÉROULÉ vers
    // SES PROPRES primitives par `primitivesReferencees` (`engine/evaluateNode.ts`) — T-133, P12/S8 : un
    // critère dérivé n'est jamais un champ saisissable, la liste « à renseigner » doit nommer ce que le
    // formulaire montre réellement (`CK_UI_L`/`CK_normale_sup`), jamais l'ex-nom du champ direct.
    expect(new Set(result.enAttente.get(OPT_INTERROMPRE_RAPPORTEE))).toEqual(
      new Set(['intolerance_statine', 'CK_UI_L', 'CK_normale_sup', 'statine_deja_en_place']),
    )

    // Halte ordered-first-match sur indéterminé (D20/D11) : TOUT ce qui suit dans l'ordre du nœud n'est
    // jamais atteint — ni en attente, ni non retenu, ni applicable. Y compris l'ancienne option de halte
    // (« Débuter à dose plus faible ») et « haute intensité »/« Discuter ».
    const OPT_DOSE_FAIBLE = node!.options.find((o) => o.intitule.startsWith('Débuter la statine à dose plus faible'))!
    for (const option of [OPT_DOSE_FAIBLE, OPT_HAUTE, OPT_DISCUTER, OPT_MODEREE]) {
      expect(result.enAttente.has(option)).toBe(false)
      expect(result.nonRetenues.has(option)).toBe(false)
    }
  })
})

describe('statine — F-10/F-11 : alerte ASCVD restaurée sur le tier atteint après l’exclusion dialyse (red-team HAUTE-4, 2026-07-26)', () => {
  // docs/decision/validation/chantier-2026-07-26/redteam-clinique-securite.md, finding HAUTE-4 : le nœud
  // est ordered-first-match — quand l'exclusion dialyse (D21) retire « haute intensité », la boucle
  // continue vers l'option suivante, qui ignore tout de `ASCVD_etablie`. Un patient de prévention
  // SECONDAIRE (ASCVD établie) atterrissait donc sur une carte « faible risque »/« prévention primaire »
  // SANS AUCUNE correction à l'écran. Fixé par une alerte PORTÉE PAR L'OPTION (`option.alertes`, D21 :
  // « le fait qualifie un geste sans l'interdire »), visible UNIQUEMENT quand l'option atteinte l'est
  // réellement pour ce patient — donc jamais pour les patients qui atteignent la même carte pour de
  // vraies raisons de bas risque / prévention primaire. `option.alertes` n'existe PAS dans
  // `EvaluateNodeResult` (coût-par-perturbation, cf. docstring `lib/vueDecision.ts`) : il faut passer par
  // `construireVueDecision`, modèle de vue de l'écran réel, pour l'observer — même méthode que
  // `evaluateNode.prescription.test.ts` (F3).
  const alertesDeLOption = (o: Partial<Criteria>, option: Option) =>
    construireVueDecision(node!, calculerCriteresDerives(node!.criteres_entree, { ...BASE, ...o } as Criteria))
      .familles.flatMap((famille) => famille.groupes.flat())
      .filter((optionVue) => optionVue.option === option)
      .flatMap((optionVue) => optionVue.alertes)

  it('F-10 — dialysé + ASCVD établie, SANS statine en place (profil F-02) : « Discuter » toujours reçu (routage inchangé), mais qualifié comme prévention SECONDAIRE, pas comme faible risque', () => {
    const o = { ASCVD_etablie: true, dialyse: true, statine_deja_en_place: false } as Partial<Criteria>
    const result = evalProfile(o)
    expect(result.applicable).toEqual([OPT_DISCUTER]) // routage rigoureusement identique à F-02
    const alertes = alertesDeLOption(o, OPT_DISCUTER)
    expect(alertes.some((a) => a.message.includes('PRÉVENTION') && a.message.includes('SECONDAIRE'))).toBe(true)
    // Le sujet de la phrase est passé du « dossier de preuve » (un artefact du dépôt, que le praticien
    // ne peut pas ouvrir) aux « données disponibles » — d'où l'accord au pluriel. Ce qui est vérifié
    // reste que l'alerte DIT explicitement ce qui n'est pas tranché.
    expect(alertes.some((a) => /TRANCHE(?:NT)? PAS/.test(a.message))).toBe(true)
  })

  it('F-11 — dialysé + ASCVD établie, AVEC statine en place (profil F-03) : haute intensité MAINTENUE (routage inchangé), et cette option ne porte PAS l’alerte de requalification — elle n’a pas d’objet, le tier est déjà le bon', () => {
    const o = { ASCVD_etablie: true, dialyse: true, statine_deja_en_place: true } as Partial<Criteria>
    const result = evalProfile(o)
    expect(result.applicable).toEqual([OPT_HAUTE]) // routage rigoureusement identique à F-03
    expect(alertesDeLOption(o, OPT_HAUTE)).toEqual([]) // l'option 1 ne porte pas cette alerte : elle n'existe que sur "Discuter"/le repli
  })

  it('F-12 — même profil que F-10 mais routé vers le REPLI (« intensité modérée ») : même alerte, portée cette fois par la 3e option', () => {
    // Profil B de la vignette HAUTE-4 du red-team : mêmes ASCVD/dialyse/statine_deja_en_place que F-10,
    // mais ancienneté/FDR/complication qui font sortir des 3 conditions de "Discuter" — la boucle continue
    // jusqu'au repli. Vérifie que la 2e alerte (posée sur l'option 3, pas seulement l'option 2) fonctionne.
    const o = {
      ASCVD_etablie: true,
      dialyse: true,
      statine_deja_en_place: false,
      anciennete_diabete_annees: 12,
      autres_FDRCV: 3,
      diabete_complique: true,
    } as Partial<Criteria>
    const result = evalProfile(o)
    expect(result.applicable).toEqual([OPT_MODEREE])
    const alertes = alertesDeLOption(o, OPT_MODEREE)
    expect(alertes.some((a) => a.message.includes('PRÉVENTION') && a.message.includes('SECONDAIRE'))).toBe(true)
    // Le sujet de la phrase est passé du « dossier de preuve » (un artefact du dépôt, que le praticien
    // ne peut pas ouvrir) aux « données disponibles » — d'où l'accord au pluriel. Ce qui est vérifié
    // reste que l'alerte DIT explicitement ce qui n'est pas tranché.
    expect(alertes.some((a) => /TRANCHE(?:NT)? PAS/.test(a.message))).toBe(true)
  })
})

/**
 * Lot « intolérance aux statines » du 2026-07-27 (6e série). Arbitrages référent pris après collecte de
 * preuve (`docs/decision/validation/chantier-2026-07-27/preuve-intolerance-statine.md`) puis red-team
 * adversarial (`redteam-intolerance-statine.md`, 5 findings HAUTE sur la collecte).
 *
 * CE QUE CES VIGNETTES VERROUILLENT. Le nœud avait, sur l'intolérance, exactement le défaut que D21 existe
 * pour interdire et qui avait déjà été corrigé ici six semaines plus tôt sur la dialyse : une carte
 * PRESCRIVANT une statine de haute intensité à un patient dont le dossier déclare qu'il ne peut pas en
 * prendre, contredite par une seule alerte. Une alerte qualifie un geste ; elle ne le retire pas.
 */
const OPT_TERMINALE = node.options.find((o) => o.intitule.includes('Statine indisponible'))
if (!OPT_TERMINALE) throw new Error('Option terminale « Statine indisponible » introuvable.')

// Même helper que celui du bloc F-10/F-12, redéclaré ici : celui-là est local à son `describe`.
const alertesDeCetteOption = (o: Partial<Criteria>, option: Option) =>
  construireVueDecision(node!, calculerCriteresDerives(node!.criteres_entree, { ...BASE, ...o } as Criteria))
    .familles.flatMap((famille) => famille.groupes.flat())
    .filter((optionVue) => optionVue.option === option)
    .flatMap((optionVue) => optionVue.alertes)

describe('statine — F-13/F-19 : intolérance avérée et garde-fou CK (D21, lot 2026-07-27)', () => {
  it('F-13 — intolérance RAPPORTÉE + ASCVD : la haute intensité reste PROPOSÉE (le doute ne retire rien)', () => {
    // Le cœur de la distinction à 3 valeurs. Une intolérance seulement rapportée n'est pas une
    // contre-indication : la conduite est la réintroduction en aveugle, pas le renoncement.
    const o = { ASCVD_etablie: true, intolerance_statine: 'rapportee' } as Partial<Criteria>
    const result = evalProfile(o)
    expect(result.applicable).toEqual([OPT_HAUTE])
    expect(result.excluded.has(OPT_HAUTE)).toBe(false)
  })

  it('F-14 — intolérance AVÉRÉE + ASCVD : la haute intensité est RETIRÉE, et la carte terminale la relaie', () => {
    const o = { ASCVD_etablie: true, intolerance_statine: 'averee' } as Partial<Criteria>
    const result = evalProfile(o)
    // Retirée AVEC son motif (R4 : jamais un silence).
    expect(result.excluded.get(OPT_HAUTE)).toContain('intolerance_statine == averee')
    // Et le patient n'est pas laissé sans conduite à tenir : la terminale est la sortie retenue.
    expect(result.applicable).toEqual([OPT_TERMINALE])
  })

  it('F-15 — intolérance avérée + ASCVD : la carte terminale REQUALIFIE le patient en prévention secondaire', () => {
    // Sans cette alerte, la carte terminale ne dirait rien du risque absolu du patient — or c'est
    // précisément le sous-groupe où le NNT de l'abaissement du LDL est le plus bas.
    const o = { ASCVD_etablie: true, intolerance_statine: 'averee' } as Partial<Criteria>
    const alertes = alertesDeCetteOption(o, OPT_TERMINALE)
    expect(alertes.some((a) => a.message.includes('SECONDAIRE'))).toBe(true)
    // L'alerte CK, elle, n'a pas d'objet sur cette voie d'accès : elle ne doit PAS s'afficher.
    expect(alertes.some((a) => a.message.includes('5 fois la normale'))).toBe(false)
  })

  it('F-16 — intolérance avérée SANS ASCVD (profil « discuter ») : « Discuter » aussi est retirée', () => {
    // Le red-team avait relevé que retirer la seule option de haute intensité aurait fait tomber le patient
    // sur « Discuter » — c'est-à-dire lui proposer, en repli, une statine qu'il ne peut pas davantage
    // prendre, tout en le présentant comme à faible risque. Les deux options portent donc l'exclusion.
    const o = { intolerance_statine: 'averee' } as Partial<Criteria> // BASE = profil du tier « Discuter »
    const result = evalProfile(o)
    expect(result.excluded.get(OPT_DISCUTER)).toContain('intolerance_statine == averee')
    expect(result.applicable).toEqual([OPT_TERMINALE])
  })

  it('F-17 — intolérance avérée sur un profil de REPLI : le repli n’est jamais atteint (la terminale le précède)', () => {
    // C'est ici que se joue la garantie décrite dans le commentaire du repli : celui-ci ne porte AUCUNE
    // exclusion, il est protégé par la seule POSITION de l'option terminale devant lui. Si un jour on
    // déplaçait la terminale après le repli, ce test tomberait — et c'est tout son objet.
    const o = {
      intolerance_statine: 'averee',
      anciennete_diabete_annees: 12, autres_FDRCV: 3, diabete_complique: true,
    } as Partial<Criteria>
    const result = evalProfile(o)
    expect(result.applicable).toEqual([OPT_TERMINALE])
    expect(result.applicable).not.toContain(OPT_MODEREE)
  })

  it('F-18 — CK > 5 N avant initiation : seconde voie d’accès à la terminale, avec son alerte propre', () => {
    // La seule phrase de la reco française employant le mot « contre-indication ». Voie DISTINCTE de
    // l'intolérance : la conduite y est d'abord diagnostique, ce que dit l'alerte dédiée.
    // `CK_UI_L`/`CK_normale_sup` (T-133) : `CK_normale_sup: 1` reproduit CK_x_normale = 6 tel quel (6 / 1 = 6).
    const o = { ASCVD_etablie: true, intolerance_statine: 'rapportee', CK_UI_L: 6, CK_normale_sup: 1 } as Partial<Criteria>
    const result = evalProfile(o)
    expect(result.excluded.get(OPT_HAUTE)).toContain('intolerance_statine != non AND CK_x_normale > 5 AND statine_deja_en_place == false')
    expect(result.applicable).toEqual([OPT_TERMINALE])
    expect(alertesDeCetteOption(o, OPT_TERMINALE).some((a) => a.message.includes('5 fois la normale'))).toBe(true)
  })

  it('F-19 — CK > 5 N chez un patient DÉJÀ sous statine : aucun retrait, MÊME si la case est cochée', () => {
    // Le point que ce test protège vraiment. `visible_si: statine_deja_en_place == false` masque le champ
    // dans le formulaire — mais `visible_si` n'est lu QUE par la couche formulaire, jamais par le moteur.
    // La vignette pose délibérément une CK élevée AVEC une statine en place : si la portée « avant
    // initiation » ne vivait que dans le `visible_si`, ce patient serait retiré à tort de son option
    // d'initiation. Elle est donc écrite AUSSI dans l'expression (`AND statine_deja_en_place == false`).
    // Valeur choisie SOUS le seuil de 4 : au-dessus, c'est l'option d'interruption qui prend la main (F-21),
    // et le test ne dirait plus rien de l'exclusion qu'il vise.
    // `CK_UI_L`/`CK_normale_sup` (T-133) : reproduisent CK_x_normale = 3 (3 / 1 = 3).
    const o = { ASCVD_etablie: true, statine_deja_en_place: true, intolerance_statine: 'rapportee', CK_UI_L: 3, CK_normale_sup: 1 } as Partial<Criteria>
    const result = evalProfile(o)
    expect(result.applicable).toEqual([OPT_HAUTE])
    expect(result.excluded.has(OPT_HAUTE)).toBe(false)
  })

  it('F-20 — la carte terminale ne revendique JAMAIS un bénéfice de mortalité (garde-fou de rédaction)', () => {
    // Dans CLEAR Outcomes, les estimations ponctuelles de mortalité sont DÉFAVORABLES (décès CV HR 1,04 ;
    // toutes causes HR 1,03). La collecte proposait des libellés qui gommaient ce point ; le red-team l'a
    // relevé. Ce test protège la rédaction, pas le moteur.
    // Les `avantages` — la colonne que le prescripteur lit en premier — ne doivent porter AUCUNE mention
    // de mortalité, ni pour la revendiquer ni pour la nuancer : ce n'est pas là que se traite le point.
    // « morbi-mortalité » est retiré avant le test : c'est le NOM d'une catégorie d'essai (« essai de
    // morbi-mortalité »), pas une revendication d'effet. Ce qui est interdit ici, c'est de parler du
    // critère mortalité lui-même dans la colonne des bénéfices.
    const bénéfices = (OPT_TERMINALE.avantages ?? []).join(' ').replace(/morbi-mortalité/gi, '')
    expect(/mortalit[ée]/i.test(bénéfices)).toBe(false)
    // L'`effet_attendu` doit la mentionner, mais UNIQUEMENT pour la nier. Insensible à la CASSE depuis
    // la passe de lisibilité du 2026-08-05, qui réserve les capitales d'emphase aux faits de sécurité :
    // ce qui est vérifié est la NÉGATION du bénéfice de mortalité, pas la typographie qui la porte.
    expect(OPT_TERMINALE.effet_attendu ?? '').toMatch(/Mortalité\s*:\s*non démontrée/i)
    // Et les chiffres défavorables doivent être écrits, pas seulement résumés en « neutre ».
    const contre = (OPT_TERMINALE.inconvenients ?? []).join(' ')
    expect(contre).toContain('HR 1,04')
    expect(contre).toContain('HR 1,03')
  })
})

/**
 * Lot du 2026-07-27 (soir) — reprise du garde-fou CK sur SOURCE PRIMAIRE, après que le référent a récupéré
 * le *Statin Intolerance Pathway* (NHS England / AAC, janvier 2022, avalisé par NICE en décembre 2021)
 * que ni la collecte ni le red-team n'avaient pu ouvrir. Il a corrigé quatre choses : quand doser (jamais
 * chez un asymptomatique), le seuil d'initiation (4 N et non 5), la conduite au-delà de 10 N (interruption
 * de 4-6 semaines, pas arrêt définitif) et les doses de réintroduction (la collecte annonçait
 * « atorvastatine 20 → 40 mg », le parcours écrit 10 ou 20, ou rosuvastatine 5 ou 10).
 */
const OPT_INTERRUPTION = node.options.find((o) => o.intitule.includes('Interrompre la statine'))
if (!OPT_INTERRUPTION) throw new Error('Option « Interrompre la statine » introuvable.')
// T-153 (P13/S7, D6) : la bande CK > 50 N a sa PROPRE carte depuis ce lot — l'ex-alerte de bande haute
// de `OPT_INTERRUPTION`, qui démentait le titre « … 4 à 6 semaines et réévaluer » sous lequel elle
// s'affichait, est devenue une option à part entière avec son propre titre.
const OPT_ARRET_URGENCE = node.options.find((o) => o.intitule.includes('suspicion de rhabdomyolyse'))
if (!OPT_ARRET_URGENCE) throw new Error('Option « Arrêter la statine — suspicion de rhabdomyolyse » introuvable.')

describe('statine — F-21/F-25 : conduite CK sous traitement (parcours NHS, lot du soir)', () => {
  it('F-21 — CK à 6 N sous statine : l’interruption 4-6 semaines PREND LA MAIN sur le tier de risque', () => {
    // Le point structurel : cette option est la PREMIÈRE du nœud, donc en ordered-first-match elle gagne
    // sur « haute intensité » même chez un patient ASCVD. Afficher d'abord « atorvastatine 40-80 mg » à un
    // patient dont les CK sont à 6 N serait le défaut que D21 corrige ailleurs dans ce même fichier.
    const o = { ASCVD_etablie: true, statine_deja_en_place: true, intolerance_statine: 'rapportee', CK_UI_L: 6, CK_normale_sup: 1 } as Partial<Criteria>
    expect(evalProfile(o).applicable).toEqual([OPT_INTERRUPTION])
  })

  it('F-22 — CK à 3 N sous statine : rien ne se déclenche, le tier de risque reste affiché', () => {
    // Contre-épreuve du seuil. Le parcours laisse continuer sous CK < 4 N quand les symptômes sont
    // tolérables : sans ce test, un seuil accidentellement posé à 2 ou à 0 passerait inaperçu.
    const o = { ASCVD_etablie: true, statine_deja_en_place: true, intolerance_statine: 'rapportee', CK_UI_L: 3, CK_normale_sup: 1 } as Partial<Criteria>
    expect(evalProfile(o).applicable).toEqual([OPT_HAUTE])
  })

  it('F-23 — CK à 6 N : aucune des deux alertes de bande haute ne s’affiche', () => {
    const o = { statine_deja_en_place: true, intolerance_statine: 'rapportee', CK_UI_L: 6, CK_normale_sup: 1 } as Partial<Criteria>
    const msgs = alertesDeCetteOption(o, OPT_INTERRUPTION).map((a) => a.message)
    expect(msgs.some((m) => m.includes('FONCTION RÉNALE'))).toBe(false)
    expect(msgs.some((m) => m.includes('RHABDOMYOLYSE'))).toBe(false)
  })

  it('F-24 — CK à 20 N : bande 10-50, l’alerte demande la fonction rénale (et pas l’urgence)', () => {
    const o = { statine_deja_en_place: true, intolerance_statine: 'rapportee', CK_UI_L: 20, CK_normale_sup: 1 } as Partial<Criteria>
    const msgs = alertesDeCetteOption(o, OPT_INTERRUPTION).map((a) => a.message)
    expect(msgs.some((m) => m.includes('FONCTION RÉNALE'))).toBe(true)
    expect(msgs.some((m) => m.includes('RHABDOMYOLYSE'))).toBe(false)
  })

  it('F-25 — CK à 60 N : bande > 50, carte DÉDIÉE « Arrêter — suspicion de rhabdomyolyse » (T-153, D6) — les deux bandes sont EXCLUSIVES', () => {
    // RÉÉCRIT (T-153, P13/S7) : avant ce lot, la bande > 50 N restait sur `OPT_INTERRUPTION` et se
    // signalait par une simple alerte, qui démentait le titre de la carte sous laquelle elle
    // s'affichait (« … 4 à 6 semaines et réévaluer », alors que le message disait l'inverse). La carte
    // change désormais de TITRE avec la conduite (P3, GRAMMAIRE-NOEUD.md §7) : ce test vérifie que la
    // carte affichée est bien la nouvelle, jamais `OPT_INTERRUPTION`, et que les deux cartes restent
    // mutuellement exclusives (bornes `<= 50` / `> 50`, sans recouvrement).
    const o = { statine_deja_en_place: true, intolerance_statine: 'rapportee', CK_UI_L: 60, CK_normale_sup: 1 } as Partial<Criteria>
    const result = evalProfile(o)
    expect(result.applicable).toEqual([OPT_ARRET_URGENCE])
    expect(result.applicable).not.toContain(OPT_INTERRUPTION)
    expect((OPT_ARRET_URGENCE.avantages ?? []).join(' ')).toContain('RHABDOMYOLYSE')
    // La carte < 50 N ne doit plus jamais afficher l'ex-alerte d'urgence, ni être atteignable à 60 N.
    const msgsInterruption = alertesDeCetteOption(o, OPT_INTERRUPTION).map((a) => a.message)
    expect(msgsInterruption.some((m) => m.includes('RHABDOMYOLYSE'))).toBe(false)
    expect(msgsInterruption.some((m) => m.includes('FONCTION RÉNALE'))).toBe(false)
  })

  it('F-25b — CK à 50 N pile (borne) : reste sur la carte « Interrompre… » (`<= 50`), pas sur l’urgence', () => {
    // Contre-épreuve de la borne exacte : `CK_x_normale > 50` exclut 50 lui-même, `<= 50` l'inclut côté
    // « Interrompre… ». Sans ce test, un décalage de borne (`>=`/`>`) entre les deux cartes passerait
    // inaperçu alors qu'il ouvrirait soit un trou de couverture, soit un recouvrement.
    const o = { statine_deja_en_place: true, intolerance_statine: 'rapportee', CK_UI_L: 50, CK_normale_sup: 1 } as Partial<Criteria>
    const result = evalProfile(o)
    expect(result.applicable).toEqual([OPT_INTERRUPTION])
    expect(result.applicable).not.toContain(OPT_ARRET_URGENCE)
  })

  it('F-26 — CK à 6 N SANS statine en place : c’est l’initiation qui est bloquée, pas une interruption', () => {
    // Les deux voies ne doivent jamais se croiser : sans statine en cours, il n'y a rien à interrompre.
    const o = { ASCVD_etablie: true, statine_deja_en_place: false, intolerance_statine: 'rapportee', CK_UI_L: 6, CK_normale_sup: 1 } as Partial<Criteria>
    const result = evalProfile(o)
    expect(result.applicable).toEqual([OPT_TERMINALE])
    expect(result.excluded.get(OPT_HAUTE)).toContain('intolerance_statine != non AND CK_x_normale > 5 AND statine_deja_en_place == false')
  })

  it('F-27 — la divergence France / NHS sur l’arrêt définitif est ÉCRITE, pas effacée', () => {
    // Garde-fou de rédaction. Le référent a suivi le parcours NHS (interruption temporaire) contre la
    // recommandation française (« stopped permanently ») : le nœud doit dire qu'il tranche, et dans quel
    // sens, plutôt que de laisser croire à un consensus qui n'existe pas.
    const texte = (OPT_INTERRUPTION.inconvenients ?? []).join(' ')
    expect(texte).toContain('DÉFINITIVEMENT')
    expect(texte).toContain('française')
  })
})

/**
 * P4/S2, T-020 (D32) — CARACTÉRISATION du défaut D-03 (`docs/decision/validation/
 * recette-navigateur-2026-07-28.md`) : « Sortie muette : intolérance avérée sans statine en place ».
 *
 * Profil EXACT de la « Décision clé » de T-020 : ASCVD établie = oui, intolérance = avérée, statine déjà
 * en place = non (RENSEIGNÉ explicitement — « Rien à signaler » sur les sections concernées, D30/T-018),
 * âge 62, et `anciennete_diabete_annees` / `autres_FDRCV` NON renseignés. Le parcours OFM atteint
 * « Discuter la statine » (2ᵉ option restante après les exclusions dialyse/intolérance sur « haute
 * intensité ») dont les 3 conditions testent `anciennete_diabete_annees`/`autres_FDRCV`/`diabete_complique`
 * — les deux premiers non renseignés → INDÉTERMINÉ → HALTE (D20). Avant ce lot, la halte retournait
 * `applicable: []` sans jamais atteindre la carte terminale « Statine indisponible » (`role: securite`),
 * qui aurait pourtant matché sur `intolerance_statine == averee` seule (OR, court-circuit, ne dépend
 * d'aucun des deux critères manquants). C'est très exactement D-03 : « la seule ligne qui le concerne est
 * une expression booléenne dans un repli ».
 */
describe('statine — T-020 (D32) : une halte OFM ne masque plus la carte de sécurité terminale (caractérisation D-03)', () => {
  it('D-03 — ASCVD établie + intolérance avérée + statine déjà en place = non (renseigné) + ancienneté/FDR non renseignés : la carte terminale reste atteignable malgré la halte sur « Discuter la statine »', () => {
    const renseignes = new Set([
      'age',
      'ASCVD_etablie',
      'diabete_complique',
      'dialyse',
      'statine_deja_en_place',
      'intolerance_statine',
      // `CK_x_normale` (T-133) : REMPLACÉ par ses deux primitives `CK_UI_L`/`CK_normale_sup` — un nom de
      // critère DÉRIVÉ dans `renseignes` (le `touched` brut) n'a aucun effet, `determinesEffectifs` ne le
      // consulte que pour les primitives (cf. `engine/deriveCritere.ts`).
      'CK_UI_L',
      'CK_normale_sup',
      // `anciennete_diabete_annees` et `autres_FDRCV` délibérément ABSENTS : c'est le cœur de D-03.
    ])
    const o = {
      age: 62,
      ASCVD_etablie: true,
      diabete_complique: false,
      dialyse: false,
      statine_deja_en_place: false,
      intolerance_statine: 'averee',
      // `CK_UI_L`/`CK_normale_sup` (T-133) : reproduisent CK_x_normale = 6 (6 / 1 = 6).
      CK_UI_L: 6,
      CK_normale_sup: 1,
    } as Partial<Criteria>
    const result = evalProfile(o, renseignes)

    // AVANT CE LOT (T-020) : `applicable` était vide — la halte sur « Discuter la statine » arrêtait tout
    // le parcours OFM, y compris la carte terminale de sécurité placée derrière elle. C'est exactement le
    // défaut D-03 : zéro carte pour le patient qui en a le plus besoin.
    // APRÈS CE LOT : la carte terminale reste atteignable — la halte ne bloque plus une option
    // `role: securite` placée derrière elle (D32).
    expect(result.applicable).toEqual([OPT_TERMINALE])

    // La halte reste RAPPORTÉE (D32, étape 3) : « Discuter la statine » demeure EN ATTENTE — l'écran doit
    // pouvoir dire à la fois « voici le filet » et « la décision principale reste suspendue ».
    expect(result.enAttente.has(OPT_DISCUTER)).toBe(true)
    expect(new Set(result.enAttente.get(OPT_DISCUTER))).toEqual(
      new Set(['anciennete_diabete_annees', 'autres_FDRCV']),
    )

    // Les options non-sécurité placées ENTRE la halte et la carte terminale (ici : aucune dans ce nœud,
    // la terminale suit immédiatement « Discuter ») ne sont pas concernées ; « haute intensité » (avant la
    // halte) reste ÉCARTÉE avec son motif, comme avant ce lot (non-régression D21).
    expect(result.excluded.has(OPT_HAUTE)).toBe(true)
  })

  /**
   * P6/SB4 (T-041, 2026-07-28/29) — REJEU DU MÊME PROFIL À TRAVERS `construireVueDecision`, le modèle de
   * vue qui alimente RÉELLEMENT la colonne sticky de `DecisionNodeScreen.tsx` (P6/SB1) — jusqu'ici seul
   * `evaluateNode` (couche moteur) avait été rejoué sur ce profil (test ci-dessus). SB4 doit vérifier que
   * le nouveau shell (formulaire + colonne résultats sticky) n'introduit aucun filtrage supplémentaire
   * entre le moteur et l'écran pour ce cas précis (D32) : la carte de sécurité doit apparaître dans
   * `vue.familles` (ce que la colonne résultats rend comme carte, `DecisionNodeScreen.tsx`
   * `rendreFamilles`) EN MÊME TEMPS que la halte reste nommée dans `vue.enAttente` (le registre « en
   * attente », rendu dans LA MÊME colonne depuis SB1 — ni l'un ni l'autre n'est plus hors de la colonne
   * sticky, cf. lecture du JSX). `DecisionNodeScreen.tsx` ne fait plus AUCUN calcul propre (il consomme
   * `VueDecision` telle quelle, cf. docstring de tête de `lib/vueDecision.ts`) : si cette assertion passe
   * ICI, le rendu DOM ne peut pas différer — pas besoin d'un navigateur pour ce point précis (S6 fait la
   * vérification visuelle réelle, cf. `plans/P6/SB4.md`).
   */
  it('P6/SB4 — le même profil, vu par `construireVueDecision` (modèle de la colonne sticky) : la carte de sécurité est bien dans `familles`, la halte reste dans `enAttente`, les deux dans le même panneau', () => {
    const renseignes = new Set([
      'age',
      'ASCVD_etablie',
      'diabete_complique',
      'dialyse',
      'statine_deja_en_place',
      'intolerance_statine',
      // `CK_x_normale` (T-133) : REMPLACÉ par ses deux primitives, cf. commentaire du test précédent.
      'CK_UI_L',
      'CK_normale_sup',
    ])
    const o = {
      age: 62,
      ASCVD_etablie: true,
      diabete_complique: false,
      dialyse: false,
      statine_deja_en_place: false,
      intolerance_statine: 'averee',
      // `CK_UI_L`/`CK_normale_sup` (T-133) : reproduisent CK_x_normale = 6 (6 / 1 = 6).
      CK_UI_L: 6,
      CK_normale_sup: 1,
    } as Partial<Criteria>
    const vue = construireVueDecision(
      node!,
      calculerCriteresDerives(node!.criteres_entree, { ...BASE, ...o } as Criteria),
      renseignes,
    )

    // La carte de sécurité est bien dans `familles` — ce que la colonne résultats rend comme carte
    // (`OptionCard`) — et nulle part ailleurs (ni écartée, ni non retenue) : c'est ELLE que le praticien
    // voit, pas seulement une entrée de registre.
    const optionsRendues = vue.familles.flatMap((famille) => famille.groupes.flat()).map((ov) => ov.option)
    expect(optionsRendues).toEqual([OPT_TERMINALE])
    expect(vue.ecartees.some((e) => e.option === OPT_TERMINALE)).toBe(false)
    expect(vue.nonRetenues.some((nr) => nr.option === OPT_TERMINALE)).toBe(false)

    // La halte reste nommée, dans le MÊME modèle de vue (donc le même panneau sticky, SB1) : le praticien
    // voit à la fois le filet ET pourquoi la décision principale reste ouverte.
    const enAttenteDiscuter = vue.enAttente.find((ea) => ea.option === OPT_DISCUTER)
    expect(enAttenteDiscuter).toBeTruthy()
    expect(new Set(enAttenteDiscuter?.manquants)).toEqual(new Set(['anciennete_diabete_annees', 'autres_FDRCV']))

    // `statine` ne déclare pas `familles` (repli à plat, D11 — nœud `ordered-first-match`) : une famille
    // unique SANS libellé, jamais le texte « — en choisir un » pensé pour un `multi-options` (cf.
    // `DecisionNodeScreen.tsx`, qui ne rend la mention QUE si `famille.libelle != null`).
    expect(vue.familles).toHaveLength(1)
    expect(vue.familles[0].libelle).toBeUndefined()
  })
})
