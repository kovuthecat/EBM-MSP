// @vitest-environment jsdom

/**
 * T-112 (P11/S7) — LÉGENDE DES COULEURS D'ACTION, DÉRIVÉE DES VERBES RÉELLEMENT PRÉSENTS.
 *
 * Les pastilles d'action colorées livrées en S6 (`OptionCard.tsx`, `--c-action-*`) n'avaient aucune clé
 * de lecture. Ce fichier vérifie les DEUX bords de la « Décision clé » de la tâche :
 *
 * 1. Sur un nœud dont AUCUNE option ne porte `option.action` (le cas réel de `cible-glycemique`,
 *    `statine`, `rhd-alimentation`, `rhd-activite-physique` — `content/node.types.ts` `ActionOption`),
 *    la légende ne doit RIEN rendre. Une légende fixe à 4 (ou 5) items sur un nœud qui n'emploie pas ce
 *    vocabulaire serait un contresens.
 * 2. Sur un nœud qui emploie CE vocabulaire (le cas réel de `prescription`/`insuline`), la légende doit
 *    lister EXACTEMENT les verbes présents — ni plus (pas de verbe absent du nœud), ni moins (pas de
 *    déduplication manquante) — dans l'ORDRE FIXE de l'énumération `ActionOption`
 *    (ajouter/remplacer/arreter/reduire/maintenir), jamais l'ordre de rencontre dans le contenu.
 *
 * NŒUDS SYNTHÉTIQUES plutôt que le contenu réel `cible-glycemique`/`prescription` — même discipline que
 * `DecisionNodeScreen.interaction.test.tsx`/`.esperanceVie.test.tsx` (« un test d'interaction doit rester
 * stable quand le contenu clinique évolue », périmètre de ce lot : jamais `content/**`). Chacun des deux
 * nœuds ci-dessous reproduit fidèlement la caractéristique réelle qui déclenche le comportement testé
 * (zéro `action` déclaré / plusieurs verbes déclarés), sans dépendre du contenu DT2 lui-même.
 */
import { cleanup, render } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { Noeud, Option } from '../content/node.types'
import { DecisionNodeScreen } from './DecisionNodeScreen'

const { NODE_SANS_ACTION, NODE_AVEC_ACTIONS } = vi.hoisted(() => {
  function opt(intitule: string, extra: Partial<Option> = {}): Option {
    return {
      intitule,
      role: 'geste',
      conditions: ['toujours'],
      avantages: [],
      inconvenients: [],
      effet_attendu: 'non chiffrable',
      niveau_preuve: 'faible',
      ...extra,
    }
  }

  function metaCommune(): Pick<Noeud, 'argumentaire' | 'sources' | 'incertitudes' | 'veille_liee' | 'meta'> {
    return {
      argumentaire: 'x',
      sources: {
        references_primaires: [],
        synthese_critique: { donnee: '' },
        reco_officielle: { source: '', position: '', divergence: false, explication: '' },
      },
      incertitudes: [],
      veille_liee: [],
      meta: { date_revue: '2026-01-01', auteur: 'test', statut: 'valide' as const, version: '1.0', changelog: [] },
    }
  }

  // Un seul critère NEUTRE (`presomption_non`, jamais lu par les options ci-dessous, sentinelle
  // `toujours`) — sert seulement à éviter le repli `isPlaceholder` (`DecisionNodeScreen.tsx` :
  // `criteres_entree.length === 0 || options.length === 0`), même parti pris que
  // `DecisionNodeScreen.interaction.test.tsx` `buildEgaliteNode`.
  const critereNeutre: Noeud['criteres_entree'][number] = {
    nom: 'critere_neutre',
    type: 'bool',
    groupe: 'Divers',
    presomption_non: true,
  }

  // Aucune des deux options ne porte `action` — reproduit fidèlement `cible-glycemique` (0 occurrence de
  // `action:` dans son YAML), sans en dépendre.
  const nodeSansAction: Noeud = {
    id: 'noeud-legende-sans-action-test',
    domaine: 'test',
    titre: 'Nœud de test (sans verbe d’action)',
    population_cible: 'test',
    selection: 'multi-options',
    criteres_entree: [critereNeutre],
    options: [opt('Option A'), opt('Option B')],
    ...metaCommune(),
  }

  // 5 options (≤ PLAFOND_PISTES) : aucun repli K5 en jeu, pour isoler strictement le comportement de la
  // légende (T-112) de celui du plafond d'affichage (T-113, testé ailleurs). Verbes déclarés dans le
  // DÉSORDRE et avec une répétition (`ajouter` deux fois) — la légende doit malgré tout ressortir
  // « Ajouter, Arrêter, Réduire », dédupliqués et dans l'ordre fixe de `ActionOption`, jamais l'ordre de
  // déclaration ci-dessous (reduire, ajouter, ajouter, arreter). `Remplacer`/`Maintenir` : jamais employés
  // par ce nœud, donc absents de la légende — la preuve qu'elle n'est pas une liste à 4/5 items en dur.
  const nodeAvecActions: Noeud = {
    id: 'noeud-legende-avec-actions-test',
    domaine: 'test',
    titre: 'Nœud de test (verbes d’action)',
    population_cible: 'test',
    selection: 'multi-options',
    criteres_entree: [critereNeutre],
    options: [
      opt('Socle', { role: 'socle' }),
      opt('Option réduire', { action: 'reduire' }),
      opt('Option ajouter (1)', { action: 'ajouter' }),
      opt('Option ajouter (2)', { action: 'ajouter' }),
      opt('Option arrêter', { action: 'arreter' }),
    ],
    ...metaCommune(),
  }

  return { NODE_SANS_ACTION: nodeSansAction, NODE_AVEC_ACTIONS: nodeAvecActions }
})

vi.mock('../content/loadNodes', () => {
  const tousLesNoeudsTest = [NODE_SANS_ACTION, NODE_AVEC_ACTIONS]
  return {
    getNoeudById: (id: string) => tousLesNoeudsTest.find((n) => n.id === id),
    getNoeudsByDomaine: () => tousLesNoeudsTest,
    noeuds: tousLesNoeudsTest,
    noeudsParDomaine: { test: tousLesNoeudsTest },
  }
})

afterEach(cleanup)

describe('DecisionNodeScreen — légende des couleurs d’action (T-112)', () => {
  it('ne rend aucune légende sur un nœud dont aucune option ne porte `action` (cas `cible-glycemique`)', () => {
    const { container } = render(<DecisionNodeScreen nodeId={NODE_SANS_ACTION.id} go={() => {}} />)
    // Sanity : les cartes sont bien affichées (le test porte sur l'ABSENCE de légende, pas sur un panneau
    // vide qui n'afficherait rien du tout par accident).
    expect(container.querySelectorAll('.option-card').length).toBeGreaterThan(0)
    expect(container.querySelector('.decision-node__legende')).toBeNull()
  })

  it('liste exactement les verbes présents, dédupliqués, dans l’ordre fixe de `ActionOption` (cas `prescription`)', () => {
    const { container } = render(<DecisionNodeScreen nodeId={NODE_AVEC_ACTIONS.id} go={() => {}} />)
    const legende = container.querySelector('.decision-node__legende')
    expect(legende).not.toBeNull()
    const verbes = [...container.querySelectorAll('.decision-node__legende-item')].map(
      (el) => el.textContent?.trim(),
    )
    expect(verbes).toEqual(['Ajouter', 'Arrêter', 'Réduire'])
  })
})
