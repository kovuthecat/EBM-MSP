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
  intolerance_statine: false,
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
    const o = { intolerance_statine: true } as Partial<Criteria>
    expect(alertMsgs(o).some((m) => m.includes('Intolérance aux statines rapportée'))).toBe(true)
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
      intolerance_statine: false,
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
