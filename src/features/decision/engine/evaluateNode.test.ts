/**
 * Tests du sélecteur d'options (`evaluateNode.ts`) sur le nœud **réel**
 * `content/noeuds/diabete-type-2/cible-glycemique.yaml`, dans sa version **validée** (T-007bis) :
 * nœud à **sortie unique** (`selection: ordered-first-match`), bandes HAS < 9 / ≤ 8 / ~6,5 / ≤ 7.
 * Couvre notamment les corrections de la 2ᵉ passe (`docs/decision/noeuds/A-cible-glycemique.verification-p2.md`) :
 * borne d'âge sur le strict (A1), CV grave routé vers ≤ 8 % (A2), exclusivité (A3).
 */
import { describe, expect, it } from 'vitest'
import { getNoeudById } from '../content/loadNodes.ts'
import { buildDefaultCriteria } from '../lib/formLayout.ts'
import type { Criteria } from './conditions.ts'
import { ConditionError } from './conditions.ts'
import { evaluateNode } from './evaluateNode.ts'

const node = getNoeudById('cible-glycemique')
if (node === undefined) {
  throw new Error(
    'Nœud "cible-glycemique" introuvable sous content/noeuds/diabete-type-2 — prérequis de ces tests (S2/T-007bis).',
  )
}

const MOINS_CONTRAIGNANTE = 'Cible < 9 %'
const SOUPLE = 'Cible ≤ 8 %'
const STRICTE = 'Cible ~6,5 % (6,5–7 %)'
const DEFAUT = 'Cible ≤ 7 %'

/**
 * Critères complets à partir d'un profil « défaut » (le moteur lève sur toute variable manquante).
 * `risque_hypoglycemie_schema` ne fait PLUS partie de `criteres_entree` depuis la révision référent
 * du 2026-07-26 (retiré du nœud : le risque hypoglycémique est une propriété du schéma thérapeutique,
 * pas du patient — cf. `cible-glycemique.yaml` meta v2.1 et son changelog) : ce helper ne le porte
 * donc plus, comme les six critères qui restent listés ci-dessous.
 */
function criteria(overrides: Partial<Criteria> = {}): Criteria {
  return {
    age: 60,
    anciennete_diabete_annees: 8,
    esperance_vie: 'intermediaire',
    fragilite: false,
    antecedent_cv: false,
    comorbidite_grave: false,
    ...overrides,
  }
}

function cible(c: Criteria): string[] {
  return evaluateNode(node!, c).applicable.map((o) => o.intitule)
}

describe('evaluateNode — "cible-glycemique" (T-007bis · ordered-first-match, sortie unique)', () => {
  // A-01 — remplacée le 2026-07-26 (relecture clinique `docs/decision/validation/chantier-2026-07-26/
  // vignettes-existantes-a-valider.md`, drapeau ASSERTION FAIBLE : l'ancienne A-01 ne vérifiait qu'un
  // `toHaveLength(1)` sur deux patients, jamais LAQUELLE des 4 cibles était retenue — un moteur qui
  // renverrait systématiquement la mauvaise cible passait ce test. Remplacée par A-01a/b/c ci-dessous,
  // qui verrouillent la gradation complète (décision référent) sur UN SEUL patient rendu
  // progressivement plus fragile.
  //
  // Le garde-fou d'EXCLUSIVITÉ (jamais 0, jamais 2 cibles) que testait l'ancienne A-01 ne disparaît
  // PAS pour autant :
  // - « jamais deux » est garanti STRUCTURELLEMENT par `evaluateOrderedFirstMatch`
  //   (`evaluateNode.ts:748-805`) : chaque chemin de cette fonction renvoie soit `[option]` soit `[]`,
  //   aucun ne peut pousser un second élément — ce n'est pas une propriété à revérifier par un test,
  //   c'est une invariante de la forme du code ;
  // - « jamais vide » (quand tout est renseigné) est déjà couvert, GÉNÉRIQUEMENT pour tous les nœuds
  //   (dont `cible-glycemique`), par l'invariant I2′ (`engine/banc/invariants.test.ts:131-142`), rejoué
  //   sur tout le banc de profils générés (`banc/profils.ts`) — une couverture bien plus large que les
  //   deux patients codés en dur de l'ancienne A-01. Je n'ajoute donc pas de doublon ici.
  // - de surcroît, chaque vignette de CONTENU ci-dessous fait `.toEqual([UNE_SEULE_VALEUR])` : elle
  //   revérifie l'exclusivité EN MÊME TEMPS que la valeur, profil par profil.
  it('A-01a — 60 ans, diabète 8 ans, EV intermédiaire, non fragile, hypo faible, sans antécédent CV ' +
    'ni comorbidité → ≤ 7 % (repli, profil médian par défaut du banc)', () => {
    expect(cible(criteria())).toEqual([DEFAUT])
  })

  it('A-01b — le même patient mais FRAGILE (EV encore intermédiaire) → ≤ 8 %', () => {
    expect(cible(criteria({ fragilite: true }))).toEqual([SOUPLE])
  })

  it('A-01c — le même patient, fragile ET EV LIMITÉE → < 9 % — troisième cran CONFIRMÉ par le ' +
    'référent (2026-07-26, mandat « Trois arbitrages du référent », point 3 : ≤ 8 % ne suffit pas ici, ' +
    'la mention « en attente de confirmation » est levée)', () => {
    expect(cible(criteria({ fragilite: true, esperance_vie: 'limitee' }))).toEqual([MOINS_CONTRAIGNANTE])
  })

  it('A-02 — jeune, récent, sans MCV, non fragile, hypo faible, EV longue → ~6,5 %', () => {
    expect(cible(criteria({ age: 52, anciennete_diabete_annees: 3, esperance_vie: 'longue' }))).toEqual([STRICTE])
  })

  it('A1 — sujet âgé (78) robuste, récent, sans MCV → ≤ 7 % (le ~6,5 % est verrouillé par age < 70)', () => {
    expect(cible(criteria({ age: 78, anciennete_diabete_annees: 3, esperance_vie: 'longue' }))).toEqual([DEFAUT])
  })

  it('profil intermédiaire → défaut ≤ 7 %', () => {
    expect(cible(criteria({ age: 68, anciennete_diabete_annees: 8, esperance_vie: 'intermediaire' }))).toEqual([DEFAUT])
  })

  it('A2 — CV établi grave (comorbidite_grave), non fragile, EV longue → ≤ 8 % (pas ≤ 7)', () => {
    expect(
      cible(criteria({ age: 64, antecedent_cv: true, comorbidite_grave: true, esperance_vie: 'longue' })),
    ).toEqual([SOUPLE])
  })

  it('fragile (EV non limitée) → ≤ 8 %', () => {
    expect(cible(criteria({ fragilite: true }))).toEqual([SOUPLE])
  })

  // Les deux tests qui suivaient ici (« ancienneté > 10 ans ET risque hypo élevé → ≤ 8 % » et
  // « risque hypo élevé seul → défaut ≤ 7 % ») exerçaient `risque_hypoglycemie_schema`, retiré du nœud
  // par la révision référent du 2026-07-26 (`cible-glycemique.yaml` meta v2.1 : le risque
  // hypoglycémique est une propriété du SCHÉMA thérapeutique, pas du patient — hors périmètre de ce
  // nœud). Fusionnés en un seul test ci-dessous, qui verrouille le nouveau comportement plutôt que
  // l'ancien : l'ancienneté seule (sans le critère hypo, qui n'existe plus) ne déclenche PLUS ≤ 8 % —
  // choix conservateur documenté dans le changelog et l'argumentaire (le sort de cette branche n'était
  // pas tranché par le référent, seul le critère `risque_hypoglycemie_schema` l'était).
  it('ancienneté > 10 ans SEULE (risque hypo retiré du nœud) → défaut ≤ 7 %, pas ≤ 8 % — la branche ' +
    'qui l’associait à risque_hypoglycemie_schema disparaît avec le critère (choix conservateur, cf. ' +
    'changelog cible-glycemique.yaml v2.1)', () => {
    expect(cible(criteria({ anciennete_diabete_annees: 15 }))).toEqual([DEFAUT])
  })

  it('fragile ET EV limitée → < 9 % (bande la plus relâchée, évaluée en premier)', () => {
    expect(cible(criteria({ age: 82, fragilite: true, esperance_vie: 'limitee' }))).toEqual([MOINS_CONTRAIGNANTE])
  })

  it('comorbidité grave ET EV limitée → < 9 %', () => {
    expect(cible(criteria({ comorbidite_grave: true, esperance_vie: 'limitee' }))).toEqual([MOINS_CONTRAIGNANTE])
  })

  it('EV limitée SANS fragilité ni comorbidité grave → ≤ 8 % (pas < 9)', () => {
    expect(cible(criteria({ esperance_vie: 'limitee' }))).toEqual([SOUPLE])
  })

  // A-12 — renforcée le 2026-07-26 (relecture clinique `docs/decision/validation/chantier-2026-07-26/
  // vignettes-existantes-a-valider.md`, drapeau ASSERTION FAIBLE : l'ancienne version ne vérifiait que
  // le texte de `reasons`, jamais la cible retenue elle-même — un moteur qui aurait sélectionné une
  // AUTRE option contenant par hasard « age < 70 » dans ses conditions serait passé inaperçu). Pas
  // supprimée : contrairement aux vignettes de contenu, c'est la SEULE de ce fichier qui exerce
  // `reasons` (la mécanique de traçabilité « pourquoi cette option »), un concern différent du contenu
  // clinique — cf. « Doublons » du document d'audit (réutilisation du profil d'A-02, jugée légitime).
  it('A-12 — reason = les conditions satisfaites de la cible retenue (même profil qu’A-02 : ~6,5 % ' +
    'ET la justification cite "age < 70")', () => {
    const c = criteria({ age: 52, anciennete_diabete_annees: 3, esperance_vie: 'longue' })
    const result = evaluateNode(node!, c)
    expect(result.applicable.map((o) => o.intitule)).toEqual([STRICTE])
    expect(result.reasons.get(result.applicable[0])).toContain('age < 70')
  })

  it('A-13 — variable de critère inconnue → ConditionError (jamais un faux silencieux)', () => {
    // `esperance_vie` manque : la 1re option évaluée ("< 9 %" : "esperance_vie == limitee") doit lever.
    const incomplete = {
      age: 52,
      anciennete_diabete_annees: 3,
      fragilite: false,
      antecedent_cv: false,
      comorbidite_grave: false,
    } as Criteria
    expect(() => evaluateNode(node!, incomplete)).toThrow(ConditionError)
    expect(() => evaluateNode(node!, incomplete)).toThrow(/esperance_vie/)
  })

  // ---------------------------------------------------------------------------------------------
  // A-14 et suivantes — nouvelles vignettes, chantier 2026-07-26 (`docs/decision/validation/
  // chantier-2026-07-26/vignettes-existantes-a-valider.md`, Travaux 2 et 3). Numérotation à la suite
  // de la relecture existante (A-01..A-13 ci-dessus) : ne réutilise aucun numéro.
  //
  // Non ajoutée : « 52 ans, diabète 3 ans, EV longue, ni fragile ni comorbidité, hypo faible → ~6,5 % »
  // (1re ligne du tableau « Travail 2 » du mandat) — profil et attendu STRICTEMENT identiques à A-02
  // ci-dessus (52 ans, diabète 3 ans, EV longue, non fragile, hypo faible, sans comorbidité grave,
  // sans antécédent CV). Dupliquer l'assertion n'aurait rien verrouillé de plus ; signalé ici pour que
  // le référent sache que ce cas est déjà couvert, plutôt que de l'ajouter en silence sous un nouveau
  // numéro.
  // ---------------------------------------------------------------------------------------------

  it('A-14 — 78 ans, fragile, EV limitée, antécédent CV établi (en plus) → < 9 % (le fragile n’est ' +
    'jamais poussé vers une cible serrée, quel que soit le reste du profil)', () => {
    expect(
      cible(
        criteria({
          age: 78,
          fragilite: true,
          esperance_vie: 'limitee',
          antecedent_cv: true,
        }),
      ),
    ).toEqual([MOINS_CONTRAIGNANTE])
  })

  // A-15 — décision référent 2026-07-26 (`vignettes-existantes-a-valider.md`, Travail 2, « la
  // frontière ancienneté / antécédent CV ») : un diabète ANCIEN (15 ans) avec ANTÉCÉDENT
  // CARDIOVASCULAIRE établi, à espérance de vie seulement intermédiaire, doit relâcher la cible à
  // ≤ 8 %.
  //
  // CORRIGÉ (2026-07-26, mandat « Trois arbitrages du référent », point 1) : `antecedent_cv == true`
  // est désormais un déclencheur à part entière (forme normale disjonctive) de « Cible ≤ 8 % »
  // (`content/noeuds/diabete-type-2/cible-glycemique.yaml`, changelog v2.1) — jusqu'ici le critère
  // n'apparaissait qu'en position d'EXCLUSION (`antecedent_cv == false` sur la cible stricte), jamais en
  // position positive. Cette vignette repasse VERTE (`it`, plus `it.fails`).
  it('A-15 — 68 ans, diabète 15 ans, antécédent CV établi, EV intermédiaire → ' +
    '≤ 8 % (décision référent 2026-07-26)', () => {
    expect(
      cible(
        criteria({
          age: 68,
          anciennete_diabete_annees: 15,
          antecedent_cv: true,
          esperance_vie: 'intermediaire',
        }),
      ),
    ).toEqual([SOUPLE])
  })

  it('A-16 — 85 ans, EV limitée, comorbidité grave → < 9 % (le cas où viser un chiffre n’a plus de ' +
    'sens)', () => {
    expect(
      cible(criteria({ age: 85, esperance_vie: 'limitee', comorbidite_grave: true })),
    ).toEqual([MOINS_CONTRAIGNANTE])
  })

  // A-17 — formulaire ENTIÈREMENT VIERGE (`renseignes` vide). Décision référent (Q1/Q2, `DECISIONS.md`
  // D20, `docs/decision/validation/chantier-2026-07-26/SPEC-valeur-indeterminee.md` §0/§2) : sur un
  // formulaire vierge, l'outil ne doit RIEN affirmer — aucune cible retenue, l'option bloquante part
  // dans le registre « en attente » avec la liste des champs à renseigner pour la lever.
  //
  // Le mandat de cette tâche signale ceci comme un « défaut connu : il propose aujourd'hui ~6,5 %, la
  // plus stricte » — c'est exact de l'état décrit par `SPEC-valeur-indeterminee.md` §1 (rédigé AVANT
  // l'implémentation de R7). **Depuis, R7 a été livré** (`engine/evaluateNode.ts`,
  // `engine/deriveCritere.ts`, `engine/conditions.ts` implémentent tous la sémantique ternaire D20) et
  // le banc de caractérisation dédié (`banc/__snapshots__/caracterisation-indetermine.cible-glycemique.
  // txt`, profil #0 « VIERGE ») montre déjà la sortie corrigée : `applicable` vide, « Cible ≤ 8 % » en
  // attente. Cette vignette repasse donc VERTE — elle ne documente plus un défaut ouvert, elle le
  // reverrouille comme garde-fou de non-régression pour ce nœud précis (vérifié en exécutant
  // réellement le moteur avant d'écrire l'assertion, pas déduit du mandat).
  //
  // MISE À JOUR (2026-07-26, révision v2.1) : l'option bloquante reste « Cible ≤ 8 % » (SOUPLE), mais la
  // liste des champs à renseigner pour lever l'indétermination a RÉTRÉCI de 3 à 1 élément. Vérifié en
  // exécutant le moteur (pas déduit) : avec `risque_hypoglycemie_schema` retiré du nœud et la branche
  // `anciennete_diabete_annees > 10 AND …` retirée avec lui (cf. changelog `cible-glycemique.yaml`), la
  // condition de « Cible ≤ 8 % » ne référence plus ni l'un ni l'autre — seul `esperance_vie` (encore
  // indéterminé sur formulaire vierge) reste à renseigner pour trancher cette option.
  it('A-17 — formulaire vierge (renseignes = ∅) → aucune cible retenue, « Cible ≤ 8 % » en attente ' +
    'faute d’espérance de vie renseignée', () => {
    const result = evaluateNode(node!, buildDefaultCriteria(node!.criteres_entree), new Set())
    expect(result.applicable).toEqual([])
    const enAttente = [...result.enAttente.entries()]
    expect(enAttente.map(([option]) => option.intitule)).toEqual([SOUPLE])
    expect(enAttente[0][1].slice().sort()).toEqual(['esperance_vie'])
  })

  // A-18 (« jeune sous sulfamide ») — SUPPRIMÉE (2026-07-26, mandat « Trois arbitrages du référent »,
  // point 2). Elle exerçait `risque_hypoglycemie_schema`, un critère que le référent a retiré DU NŒUD
  // (`cible-glycemique.yaml` meta v2.1) : son raisonnement — « quelle raison, sur un diabète récent chez
  // un sujet jeune, d'avoir un risque d'hypo élevé ? Le risque dépend de la palette de traitement » —
  // pose précisément que le risque hypoglycémique est une propriété du SCHÉMA THÉRAPEUTIQUE, pas du
  // patient, et que ce nœud « cible glycémique » (qui ne collecte aucun traitement) ne peut pas le
  // représenter. Le critère qu'elle testait n'existe donc plus : la vignette est sans objet, pas
  // remplacée — aucun cas équivalent ne garde de sens DANS CE NŒUD (la question qu'elle posait, "changer
  // le traitement plutôt que relâcher la cible", relève d'un nœud de PRESCRIPTION, hors périmètre ici ;
  // cf. `cible-glycemique.argumentaire.md`, section « Révision 2026-07-26 »).

  // Couverture — effet propre d'`antecedent_cv` (signalé par l'audit, section « Couverture » de
  // `vignettes-existantes-a-valider.md` : seule A-05 le manipule, toujours combiné à
  // `comorbidite_grave`, qui suffit seul à expliquer son résultat — l'effet propre n'était démontré
  // nulle part). Paire d'isolement : MÊME PROFIL qu'A-02 (52 ans, diabète 3 ans, EV longue, non
  // fragile, sans comorbidité grave), `antecedent_cv` seul bascule vrai/faux.
  // - Bras FAUX = A-02 elle-même (ci-dessus, → ~6,5 %) : pas redupliqué ici.
  // - Bras VRAI = A-19 ci-dessous : → ≤ 8 %, PAS ~6,5 % ni ≤ 7 %.
  //
  // MISE À JOUR (2026-07-26, mandat « Trois arbitrages du référent », point 1) : avant cette révision,
  // `antecedent_cv` n'EXCLUAIT que la cible stricte, sans jamais rien apporter en position positive —
  // c'était précisément le gap révélé par A-15 (alors `it.fails`). Depuis l'ajout d'`antecedent_cv ==
  // true` comme déclencheur de « Cible ≤ 8 % » (`cible-glycemique.yaml`, changelog v2.1), le faire
  // basculer à vrai sur ce même profil ne se contente plus d'EXCLURE ~6,5 % : il OUVRE directement
  // ≤ 8 % (et non plus le repli ≤ 7 %). Cette vignette verrouille donc désormais l'effet POSITIF
  // isolé du critère, pas seulement son effet d'exclusion.
  it('A-19 — même profil qu’A-02 mais antecedent_cv = TRUE (isolé, sans comorbidite_grave) → ' +
    '≤ 8 %, pas ~6,5 % ni ≤ 7 % — antecedent_cv ouvre bien une route positive à lui seul', () => {
    expect(
      cible(
        criteria({
          age: 52,
          anciennete_diabete_annees: 3,
          esperance_vie: 'longue',
          antecedent_cv: true,
        }),
      ),
    ).toEqual([SOUPLE])
  })
})
