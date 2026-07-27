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
const OPT_MODEREE = node.options.find((o) => o.intitule.includes('intensité modérée'))
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
  CK_x_normale: 0,
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

describe('statine — F-09 : formulaire vierge, valeur indéterminée (D20)', () => {
  it('F-09 — `renseignes` vide : aucun tier désigné, "Discuter" en attente sur ses 3 critères manquants, "haute intensité" non retenue (ASCVD par défaut = false), le repli n’est jamais atteint', () => {
    // D20 : `nombre`/`enum` non renseignés sont INDÉTERMINÉS ; `diabete_complique` porte
    // `confirmation_requise: true` (F-statine §9.2) donc reste indéterminé même si "bool". Les autres
    // bool (ASCVD_etablie, dialyse, statine_deja_en_place, intolerance_statine) gardent leur défaut
    // "non" (une réponse clinique réelle, D20) : ils sont donc DÉTERMINÉS, à `false`, sans être dans
    // `renseignes`. Les valeurs des champs `nombre` ci-dessous sont des PLACEHOLDERS non lus par le
    // moteur (indéterminés avant toute lecture de leur valeur) — présentes seulement pour satisfaire
    // `variable in criteria` (le moteur distingue "absent" -> erreur de "non renseigné" -> indéterminé).
    const vierge: Criteria = {
      age: 0,
      ASCVD_etablie: false,
      anciennete_diabete_annees: 0,
      autres_FDRCV: 0,
      diabete_complique: false,
      dialyse: false,
      statine_deja_en_place: false,
      // PLACEHOLDERS depuis le 2026-07-27 : `intolerance_statine` est passé de `bool` à `enum`, il est donc
      // désormais INDÉTERMINÉ sur formulaire vierge (D20 : seuls les `bool` gardent un défaut « non »
      // cliniquement lisible). `CK_x_normale` est un nombre : indéterminé lui aussi sur formulaire vierge.
      intolerance_statine: 'non',
      CK_x_normale: 0,
    }
    const result = evaluateNode(node!, vierge, new Set())

    // Le défaut 13.1 corrigé par D20 : sur formulaire vierge, AUCUN tier n'est désigné (ni "haute
    // intensité", ni "Discuter", ni "intensité modérée" par défaut de convergence) — jamais un tier
    // affirmé sur des critères non renseignés.
    expect(result.applicable).toEqual([])

    // "haute intensité" : sa seule condition (ASCVD_etablie == true) est DÉTERMINÉE à `false` (bool sans
    // confirmation_requise, défaut clinique réel) → non retenue normalement, PAS en attente.
    expect(result.nonRetenues.get(OPT_HAUTE)).toBe('ASCVD_etablie == true')
    expect(result.enAttente.has(OPT_HAUTE)).toBe(false)

    // "Discuter" : ses 3 conditions portent sur anciennete_diabete_annees/autres_FDRCV (nombre, jamais
    // renseignés) et diabete_complique (bool à confirmation_requise) → toutes indéterminées → EN ATTENTE,
    // avec le nom des 3 primitifs à renseigner (D20 §2.5, "à renseigner : …").
    expect(result.enAttente.has(OPT_DISCUTER)).toBe(true)
    expect(new Set(result.enAttente.get(OPT_DISCUTER))).toEqual(
      new Set(['anciennete_diabete_annees', 'autres_FDRCV', 'diabete_complique']),
    )

    // Halte ordered-first-match sur indéterminé (D20) : l'ordre du nœud fait foi, "intensité modérée"
    // (le repli) n'est JAMAIS atteinte — ni en attente, ni non retenue, ni applicable.
    expect(result.enAttente.has(OPT_MODEREE)).toBe(false)
    expect(result.nonRetenues.has(OPT_MODEREE)).toBe(false)
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
    expect(alertes.some((a) => a.message.includes('TRANCHE PAS'))).toBe(true)
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
    expect(alertes.some((a) => a.message.includes('TRANCHE PAS'))).toBe(true)
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
    const o = { ASCVD_etablie: true, CK_x_normale: 6 } as Partial<Criteria>
    const result = evalProfile(o)
    expect(result.excluded.get(OPT_HAUTE)).toContain('CK_x_normale > 4 AND statine_deja_en_place == false')
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
    const o = { ASCVD_etablie: true, statine_deja_en_place: true, CK_x_normale: 3 } as Partial<Criteria>
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
    // L'`effet_attendu` doit la mentionner, mais UNIQUEMENT pour la nier.
    expect(OPT_TERMINALE.effet_attendu ?? '').toMatch(/Mortalité\s*:\s*NON démontrée/)
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

describe('statine — F-21/F-25 : conduite CK sous traitement (parcours NHS, lot du soir)', () => {
  it('F-21 — CK à 6 N sous statine : l’interruption 4-6 semaines PREND LA MAIN sur le tier de risque', () => {
    // Le point structurel : cette option est la PREMIÈRE du nœud, donc en ordered-first-match elle gagne
    // sur « haute intensité » même chez un patient ASCVD. Afficher d'abord « atorvastatine 40-80 mg » à un
    // patient dont les CK sont à 6 N serait le défaut que D21 corrige ailleurs dans ce même fichier.
    const o = { ASCVD_etablie: true, statine_deja_en_place: true, CK_x_normale: 6 } as Partial<Criteria>
    expect(evalProfile(o).applicable).toEqual([OPT_INTERRUPTION])
  })

  it('F-22 — CK à 3 N sous statine : rien ne se déclenche, le tier de risque reste affiché', () => {
    // Contre-épreuve du seuil. Le parcours laisse continuer sous CK < 4 N quand les symptômes sont
    // tolérables : sans ce test, un seuil accidentellement posé à 2 ou à 0 passerait inaperçu.
    const o = { ASCVD_etablie: true, statine_deja_en_place: true, CK_x_normale: 3 } as Partial<Criteria>
    expect(evalProfile(o).applicable).toEqual([OPT_HAUTE])
  })

  it('F-23 — CK à 6 N : aucune des deux alertes de bande haute ne s’affiche', () => {
    const o = { statine_deja_en_place: true, CK_x_normale: 6 } as Partial<Criteria>
    const msgs = alertesDeCetteOption(o, OPT_INTERRUPTION).map((a) => a.message)
    expect(msgs.some((m) => m.includes('FONCTION RÉNALE'))).toBe(false)
    expect(msgs.some((m) => m.includes('RHABDOMYOLYSE'))).toBe(false)
  })

  it('F-24 — CK à 20 N : bande 10-50, l’alerte demande la fonction rénale (et pas l’urgence)', () => {
    const o = { statine_deja_en_place: true, CK_x_normale: 20 } as Partial<Criteria>
    const msgs = alertesDeCetteOption(o, OPT_INTERRUPTION).map((a) => a.message)
    expect(msgs.some((m) => m.includes('FONCTION RÉNALE'))).toBe(true)
    expect(msgs.some((m) => m.includes('RHABDOMYOLYSE'))).toBe(false)
  })

  it('F-25 — CK à 60 N : bande > 50, l’alerte bascule sur l’urgence — les deux bandes sont EXCLUSIVES', () => {
    // Les bornes des deux `quand` doivent se toucher sans se recouvrir : à 60 N, afficher AUSSI l'alerte
    // « vérifier la fonction rénale » enverrait un message de temporisation dans une situation urgente.
    const o = { statine_deja_en_place: true, CK_x_normale: 60 } as Partial<Criteria>
    const msgs = alertesDeCetteOption(o, OPT_INTERRUPTION).map((a) => a.message)
    expect(msgs.some((m) => m.includes('RHABDOMYOLYSE'))).toBe(true)
    expect(msgs.some((m) => m.includes('FONCTION RÉNALE'))).toBe(false)
  })

  it('F-26 — CK à 6 N SANS statine en place : c’est l’initiation qui est bloquée, pas une interruption', () => {
    // Les deux voies ne doivent jamais se croiser : sans statine en cours, il n'y a rien à interrompre.
    const o = { ASCVD_etablie: true, statine_deja_en_place: false, CK_x_normale: 6 } as Partial<Criteria>
    const result = evalProfile(o)
    expect(result.applicable).toEqual([OPT_TERMINALE])
    expect(result.excluded.get(OPT_HAUTE)).toContain('CK_x_normale > 4 AND statine_deja_en_place == false')
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
