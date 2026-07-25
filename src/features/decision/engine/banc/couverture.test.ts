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
import { evaluateNode } from '../evaluateNode.ts'
import { criteresPertinents } from '../relevance.ts'
import { genererProfils, tailleBanc } from './profils.ts'

/**
 * Nœuds pour lesquels le test R5 (chaque critère saisissable est décisif quelque part) est une DETTE DE
 * CONTENU DÉJÀ DIAGNOSTIQUÉE (2026-07-25), PAS un artefact d'échantillonnage : `insuline.yaml` déclare
 * `IMC`, `TIR`, `TAR`, `GMI` et `dose_rapide_actuelle` (vérifié par grep sur le contenu) sans jamais les
 * référencer dans une `conditions`/`exclusions`/`priorite`/`alertes[].quand`/`derive` — `TIR`/`TAR`/`GMI`
 * ne sont cités qu'en PROSE (argumentaire, messages d'alerte en texte), jamais dans une expression
 * évaluée par le moteur ; `dose_rapide_actuelle` n'est même pas cité en prose. Aucun nombre de profils ne
 * peut les rendre décisifs : ce n'est pas le banc qui les rate, c'est le contenu qui ne les câble nulle
 * part. À corriger en YAML (les brancher, ou les retirer), jamais en affaiblissant ce test. Cette liste
 * ne doit grossir que sur un diagnostic similaire (jamais pour faire taire une régression ailleurs).
 */
const NOEUDS_AVEC_CRITERES_MORTS_CONNUS = new Set(['insuline'])

describe.each(noeuds.map((node) => [node.id, node] as const))('banc — couverture · nœud %s', (_id, node) => {
  const profils = genererProfils(node, tailleBanc(node))

  it(`chaque option est APPLICABLE pour au moins un profil (banc de ${profils.length} profils)`, () => {
    const jamaisApplicable = new Set(node.options.map((option) => option.intitule))
    for (const profil of profils) {
      for (const option of evaluateNode(node, profil).applicable) jamaisApplicable.delete(option.intitule)
    }
    expect([...jamaisApplicable]).toEqual([])
  })

  it('chaque option porteuse d’`exclusions` est EXCLUE pour au moins un profil', () => {
    const optionsAvecExclusions = node.options.filter((option) => (option.exclusions?.length ?? 0) > 0)
    const jamaisExclue = new Set(optionsAvecExclusions.map((option) => option.intitule))
    for (const profil of profils) {
      for (const option of evaluateNode(node, profil).excluded.keys()) jamaisExclue.delete(option.intitule)
    }
    expect([...jamaisExclue]).toEqual([])
  })

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
  })

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
  })

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
  })

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
