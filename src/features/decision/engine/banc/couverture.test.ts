/**
 * Banc d'un nœud — COUCHE 2 « couverture » (docs/decision/GRAMMAIRE-NOEUD.md, section « Le banc d'un
 * nœud — trois couches »). Validation PUREMENT MÉCANIQUE (aucune relecture clinique requise) : sur un
 * échantillon de profils tiré à graine fixe (`profils.ts`), chaque règle du contenu doit se déclencher
 * au moins une fois. Une règle qui ne se déclenche JAMAIS est soit morte (à retirer), soit mal câblée
 * (à corriger) — c'est le test de R5 généralisé aux options et aux règles de sélection.
 *
 * Générique : itère sur TOUS les nœuds renvoyés par `loadNodes` (`noeuds`), aucun id ni nom de critère
 * codé en dur. Le message d'échec NOMME l'option/l'expression/le critère non couvert (les assertions
 * `toEqual([])` impriment la liste manquante telle quelle — c'est la valeur du test, cf. consigne).
 */
import { describe, expect, it } from 'vitest'
import { noeuds } from '../../content/loadNodes.ts'
import { evaluateCondition } from '../conditions.ts'
import { evaluateAlertesDeListe, evaluateNode } from '../evaluateNode.ts'
import { criteresPertinents } from '../relevance.ts'
import { genererProfils, tailleBanc } from './profils.ts'

/**
 * Nœuds pour lesquels le test R5 (chaque critère saisissable est décisif quelque part) est une DETTE DE
 * CONTENU DÉJÀ DIAGNOSTIQUÉE, PAS un artefact d'échantillonnage. Vide depuis le 2026-07-25 : les quatre
 * critères morts d'`insuline.yaml` (`IMC`, `TIR`, `TAR`, `GMI`) ont été retirés du contenu et
 * `dose_rapide_actuelle` a été branché dans un `calculs` (arbitrage référent) — R5 passe désormais sur ce
 * nœud. Cette liste ne doit grossir que sur un diagnostic similaire (jamais pour faire taire une
 * régression ailleurs).
 */
const NOEUDS_AVEC_CRITERES_MORTS_CONNUS = new Set<string>([])

/**
 * Nœuds dont une option n'est JAMAIS applicable sur le banc — **défaut du GÉNÉRATEUR, pas du contenu**.
 * Diagnostiqué le 2026-07-26 (poids/DFG ci-dessous), **CORRIGÉ le même jour** par la déclaration de
 * bornes `min`/`max` sur les critères `nombre` (table validée référent, docs/decision/GRAMMAIRE-NOEUD.md,
 * schema/noeud.schema.json) et leur application aux DEUX extracteurs de valeurs candidates
 * (`engine/banc/profils.ts` `seuilsNumeriques`, `engine/relevance.ts` `valeursCandidates`) : tout littéral
 * hors `[min, max]` est désormais écarté, avec repli sur un tirage dans `[min, max]` quand plus aucun
 * littéral ne subsiste. Vérifié après correction : `genererProfils` sur `insuline` ne produit plus de
 * poids candidat à 0,5 kg (domaine observé : bornes + tirages dans [35, 250]) ; sur `prescription`, le
 * domaine de tirage du DFG ne contient plus 1000/2000 (domaine observé : bornes + seuils réels dans
 * [3, 150]). Liste laissée VIDE (constatation, pas seulement l'absence de nouveau diagnostic) — l'historique
 * du défaut reste ci-dessous pour qui chercherait pourquoi `min`/`max` existent sur le schéma.
 *
 * **Historique du diagnostic (avant correction).** `valeursCandidates` (`profils.ts`, même principe que
 * `relevance.ts`) extrayait les seuils numériques de TOUTE règle mentionnant un critère — **y compris
 * quand le littéral porte sur un autre opérande**. La seule règle citant `poids` dans `insuline.yaml` est
 * le dérivé `dose_basale_actuelle / poids > 0.5` : le `0.5`, seuil de RATIO, devenait une valeur candidate
 * de POIDS (patients de 0, 0,49, 0,5, 0,51 et 9999 kg). Le même mécanisme touchait `DFG` : la condition de
 * « Réduire la posologie de la metformine » mentionne à la fois `DFG` et les seuils de dose `1000`/`2000`,
 * qui entraient dans le domaine de tirage du DFG (patients à 2000 mL/min). Le défaut était GÉNÉRIQUE :
 * toute règle associant deux critères d'échelles différentes corrompait le domaine de l'un par les
 * littéraux de l'autre, et s'aggravait à mesure que le contenu s'enrichissait — d'où la correction
 * générique (bornes de contenu, pas un correctif ad hoc par nœud).
 */
const NOEUDS_AVEC_OPTION_INATTEIGNABLE_PAR_LE_GENERATEUR = new Set<string>([])

/**
 * Délai par test, relevé du défaut vitest (5 000 ms) le 2026-07-27 — même constante et même raison que
 * dans `banc/invariants.test.ts`. Conséquence VOULUE du relèvement de
 * `PLAFOND_ENUMERATION_EXHAUSTIVE` (20 000 → 60 000, cf. `banc/profils.ts`) : `statine` et
 * `rhd-activite-physique` sont repassés en couverture EXHAUSTIVE, donc de 720 et 1 120 profils à 47 520
 * et 55 296. Le budget de R5 plus bas reste distinct : il est dimensionné pour son propre cas d'ÉCHEC,
 * qui doit parcourir tout le banc en réévaluant la pertinence par perturbation.
 */
const DELAI_BANC_MS = 120_000

describe.each(noeuds.map((node) => [node.id, node] as const))('banc — couverture · nœud %s', (_id, node) => {
  const profils = genererProfils(node, tailleBanc(node))

  const testApplicable = NOEUDS_AVEC_OPTION_INATTEIGNABLE_PAR_LE_GENERATEUR.has(node.id) ? it.fails : it
  testApplicable(`chaque option est APPLICABLE pour au moins un profil (banc de ${profils.length} profils)`, () => {
    const jamaisApplicable = new Set(node.options.map((option) => option.intitule))
    for (const profil of profils) {
      for (const option of evaluateNode(node, profil).applicable) jamaisApplicable.delete(option.intitule)
    }
    expect([...jamaisApplicable]).toEqual([])
  }, DELAI_BANC_MS)

  it('chaque option porteuse d’`exclusions` est EXCLUE pour au moins un profil', () => {
    const optionsAvecExclusions = node.options.filter((option) => (option.exclusions?.length ?? 0) > 0)
    const jamaisExclue = new Set(optionsAvecExclusions.map((option) => option.intitule))
    for (const profil of profils) {
      for (const option of evaluateNode(node, profil).excluded.keys()) jamaisExclue.delete(option.intitule)
    }
    expect([...jamaisExclue]).toEqual([])
  }, DELAI_BANC_MS)

  it('chaque EXPRESSION d’`exclusions` est déclenchée (vraie) pour au moins un profil', () => {
    const nonDeclenchees = new Set<string>()
    for (const option of node.options) {
      for (const expr of option.exclusions ?? []) nonDeclenchees.add(`${option.intitule} :: exclusion "${expr}"`)
    }
    for (const profil of profils) {
      for (const option of node.options) {
        for (const expr of option.exclusions ?? []) {
          if (evaluateCondition(expr, profil)) nonDeclenchees.delete(`${option.intitule} :: exclusion "${expr}"`)
        }
      }
    }
    expect([...nonDeclenchees]).toEqual([])
  }, DELAI_BANC_MS)

  it('chaque règle de `priorite` CONDITIONNELLE matche pour au moins un profil', () => {
    const nonAtteintes = new Set<string>()
    for (const option of node.options) {
      if (!Array.isArray(option.priorite)) continue
      for (const regle of option.priorite) {
        if (regle.quand === 'default') continue // toujours vraie par construction (repli) : rien à couvrir
        nonAtteintes.add(`${option.intitule} :: priorite quand "${regle.quand}" -> rang ${regle.rang}`)
      }
    }
    for (const profil of profils) {
      for (const option of node.options) {
        if (!Array.isArray(option.priorite)) continue
        for (const regle of option.priorite) {
          if (regle.quand === 'default') continue
          if (evaluateCondition(regle.quand, profil)) {
            nonAtteintes.delete(`${option.intitule} :: priorite quand "${regle.quand}" -> rang ${regle.rang}`)
          }
        }
      }
    }
    expect([...nonAtteintes]).toEqual([])
  }, DELAI_BANC_MS)

  it('chaque ALERTE du nœud se déclenche pour au moins un profil', () => {
    const nonDeclenchees = new Set<string>()
    for (const alerte of node.alertes ?? []) {
      if (alerte.quand === 'default') continue // toujours vraie par construction : rien à couvrir
      nonDeclenchees.add(alerte.message)
    }
    for (const profil of profils) {
      for (const alerte of evaluateNode(node, profil).alertes) nonDeclenchees.delete(alerte.message)
    }
    expect([...nonDeclenchees]).toEqual([])
  }, DELAI_BANC_MS)

  /**
   * AJOUTÉ le 2026-07-27 (chantier, cause racine S2). Le banc exigeait la couverture des `exclusions`,
   * des `priorite` conditionnelles et des alertes de NŒUD — **jamais celle des alertes d'OPTION**, alors
   * que D21 en fait un canal de sécurité à part entière. Un canal sans obligation de couverture est un
   * canal dont on n'apprendra jamais qu'il est mort : c'est très exactement ce qui s'est produit, un
   * golden master ayant figé 11 profils portant un trou de sécurité, en vert.
   *
   * L'exigence est la BONNE (celle qui a un sens clinique), pas la plus facile : une alerte d'option
   * n'est RENDUE que si son option est applicable (`lib/vueDecision.ts`). On vérifie donc qu'elle est
   * réellement AFFICHÉE au moins une fois — `quand` vrai ET option applicable — et non que son
   * expression peut être vraie dans le vide.
   */
  it('chaque alerte d’OPTION est AFFICHÉE pour au moins un profil (quand vrai ET option applicable)', () => {
    const jamaisAffichee = new Set<string>()
    for (const option of node.options) {
      for (const alerte of option.alertes ?? []) {
        jamaisAffichee.add(`${option.intitule} :: alerte quand "${alerte.quand}"`)
      }
    }
    for (const profil of profils) {
      for (const option of evaluateNode(node, profil).applicable) {
        for (const alerte of evaluateAlertesDeListe(option.alertes, profil)) {
          jamaisAffichee.delete(`${option.intitule} :: alerte quand "${alerte.quand}"`)
        }
      }
    }
    expect([...jamaisAffichee]).toEqual([])
  }, DELAI_BANC_MS)

  /**
   * AJOUTÉ le 2026-07-27 (S2), symétrique exact de la règle sur les `exclusions` juste au-dessus. Un
   * `prerequis` est un garde-fou (R6) : évalué comme une condition, il RETIRE l'option quand il est faux.
   * Un garde-fou qui n'est jamais faux sur tout le banc ne garde rien — il est mort, ou mal câblé.
   *
   * Sens de l'assertion, à ne pas inverser : on exige que le prérequis soit **FAUX** au moins une fois
   * (le cas où il mord), là où pour une `exclusions` on exige qu'elle soit **VRAIE** au moins une fois.
   * Les deux disent la même chose — « ce garde-fou retire réellement quelque chose » — dans les deux
   * polarités que le contenu utilise.
   */
  it('chaque expression de `prerequis` est FAUSSE (mord) pour au moins un profil', () => {
    const jamaisFausses = new Set<string>()
    for (const option of node.options) {
      for (const expr of option.prerequis ?? []) jamaisFausses.add(`${option.intitule} :: prerequis "${expr}"`)
    }
    for (const profil of profils) {
      for (const option of node.options) {
        for (const expr of option.prerequis ?? []) {
          if (evaluateCondition(expr, profil) === false) jamaisFausses.delete(`${option.intitule} :: prerequis "${expr}"`)
        }
      }
    }
    expect([...jamaisFausses]).toEqual([])
  }, DELAI_BANC_MS)

  // Timeout relevé (défaut vitest 5000ms) : `criteresPertinents` réévalue le nœud par PERTURBATION
  // (une évaluation par valeur candidate de chaque critère, cf. engine/relevance.ts) — coûteux mais pur
  // et déterministe ; sur un nœud riche (~25 critères saisissables) × 2000 profils, la mécanique seule
  // (hors E/S, hors réseau) dépasse le défaut sans indiquer un problème de performance du moteur.
  const testR5 = NOEUDS_AVEC_CRITERES_MORTS_CONNUS.has(node.id) ? it.fails : it
  testR5(
    'R5 — chaque critère SAISISSABLE (non `derive`) est pertinent pour au moins un profil',
    () => {
      const saisissables = node.criteres_entree.filter((critere) => critere.derive == null).map((c) => c.nom)
      const jamaisDecisif = new Set(saisissables)
      for (const profil of profils) {
        for (const nom of criteresPertinents(node, profil)) jamaisDecisif.delete(nom)
        // Sortie anticipée — n'affaiblit PAS l'assertion : dès que chaque critère a été vu décisif au
        // moins une fois, la conclusion est acquise et les profils restants ne peuvent plus la changer.
        // Le cas d'ÉCHEC (un critère jamais décisif), lui, exige toujours d'épuiser le banc : c'est
        // seulement le cas passant qui devient rapide. Sans cela, ce test frôlait son budget de 30 s sur
        // `prescription` (~29,5 s mesurés) et basculait en échec selon la seule charge machine — un test
        // dont le verdict dépend de la machine apprend à ignorer le rouge.
        if (jamaisDecisif.size === 0) break
      }
      expect([...jamaisDecisif]).toEqual([])
    },
    // Filet, dimensionné pour le cas d'échec qui doit parcourir tout le banc (nœud `insuline`), pas pour
    // le cas passant que la sortie anticipée rend court.
    120_000,
  )
})
