/**
 * BADGE RENDU par `OptionCard` — arbitrage référent du 2026-07-29 (quatrième valeur de la prop `badge`,
 * cf. sa docstring dans `OptionCard.tsx`).
 *
 * POURQUOI UN TEST DE RENDU EN PLUS DE `lib/optionBadges.test.ts`. Ce dernier vérifie la VALEUR calculée
 * (`'securite'` plutôt que `'recommandee'`) ; il resterait vert si la carte n'affichait rien du tout pour
 * cette valeur, ou si elle affichait toujours « Recommandée ». Ce que le référent a tranché, c'est le
 * TEXTE que lit le praticien — c'est donc lui qu'on assert ici, sur le rendu réel.
 *
 * DEUX NIVEAUX, et le second est celui qui compte :
 *  1. la carte seule, badge par badge (le rendu porte le bon libellé, et JAMAIS deux à la fois) ;
 *  2. la chaîne COMPLÈTE contenu → moteur → `construireVueDecision` → `OptionCard`, sur le profil réel
 *     qui a motivé l'arbitrage (`statine`, D-03/D32). C'est la seule assertion qui casserait si le calcul
 *     du badge et le rendu se déphasaient un jour.
 *
 * `renderToStaticMarkup` plutôt qu'un DOM complet : convention du dépôt pour les composants
 * (`CriteriaForm.test.tsx`, `banc/carte-affichage.test.tsx`) — aucune interaction n'est en jeu ici.
 */
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { getNoeudById } from '../content/loadNodes'
import type { Option } from '../content/node.types'
import type { Criteria } from '../engine/conditions'
import { calculerCriteresDerives } from '../engine/deriveCritere'
import { buildDefaultCriteria } from '../lib/formLayout'
import { construireVueDecision } from '../lib/vueDecision'
import { OptionCard } from './OptionCard'

const LIBELLE_SECURITE = 'Mesure de sécurité'
const LIBELLE_RECOMMANDEE = 'Recommandée'

function optionMinimale(extra: Partial<Option> = {}): Option {
  return {
    intitule: 'Option de test',
    role: 'geste',
    conditions: ['a == true'],
    avantages: [],
    inconvenients: [],
    effet_attendu: 'non chiffrable',
    niveau_preuve: 'faible',
    ...extra,
  }
}

function rendre(badge: 'recommandee' | 'reco-officielle' | 'securite' | null, option = optionMinimale()) {
  return renderToStaticMarkup(
    <OptionCard
      option={option}
      badge={badge}
      reasons={['a == true']}
      calculs={[]}
      motifRang={undefined}
      alertes={[]}
    />,
  )
}

describe('OptionCard — badge « Mesure de sécurité » (arbitrage référent 2026-07-29)', () => {
  it('`badge="securite"` rend « Mesure de sécurité » et JAMAIS « Recommandée »', () => {
    const html = rendre('securite', optionMinimale({ role: 'securite' }))
    expect(html).toContain(LIBELLE_SECURITE)
    expect(html).not.toContain(LIBELLE_RECOMMANDEE)
  })

  it('`badge="recommandee"` reste INCHANGÉ : « Recommandée », et aucune trace du badge de sécurité', () => {
    const html = rendre('recommandee')
    expect(html).toContain(LIBELLE_RECOMMANDEE)
    expect(html).not.toContain(LIBELLE_SECURITE)
  })

  it('`badge="reco-officielle"` reste INCHANGÉ (D16) : ni « Recommandée », ni « Mesure de sécurité »', () => {
    const html = rendre('reco-officielle')
    expect(html).toContain('Recommandation officielle (France)')
    expect(html).not.toContain(LIBELLE_SECURITE)
  })

  it('`badge={null}` : aucun des trois libellés (carte non mise en avant, inchangé)', () => {
    const html = rendre(null)
    expect(html).not.toContain(LIBELLE_RECOMMANDEE)
    expect(html).not.toContain(LIBELLE_SECURITE)
    expect(html).not.toContain('Recommandation officielle')
  })

  /**
   * LA CARTE N'A PAS À CONNAÎTRE `option.role`. Contrôle explicite du couplage que la docstring de la
   * prop `badge` interdit : une option `role: securite` à qui l'on passe `badge="recommandee"` doit
   * afficher « Recommandée » — si ce test se met à échouer, c'est qu'un `if (option.role === …)` a été
   * greffé dans la carte, et la décision de badge a quitté `lib/optionBadges.ts` sans que personne ne
   * le voie.
   */
  it('la carte rend le badge QU’ON LUI DONNE, jamais celui qu’elle déduirait de `option.role`', () => {
    const html = rendre('recommandee', optionMinimale({ role: 'securite' }))
    expect(html).toContain(LIBELLE_RECOMMANDEE)
    expect(html).not.toContain(LIBELLE_SECURITE)
  })
})

/**
 * Chaîne complète sur le contenu RÉEL — profil D-03/D32 (recette navigateur du 2026-07-28, déjà
 * caractérisé côté moteur par `engine/evaluateNode.statine.test.ts`) : maladie athéromateuse établie,
 * intolérance AVÉRÉE, statine pas encore en place, ancienneté du diabète et autres FDRCV non renseignés.
 * Le parcours `ordered-first-match` fait halte et n'atteint plus que la carte terminale `role: securite`
 * — seule carte affichée, donc en tête, donc badgée. C'est la carte que le référent a vue.
 */
describe('OptionCard — chaîne complète (nœud `statine`, profil D-03/D32)', () => {
  const node = getNoeudById('statine')
  if (!node) throw new Error('Nœud "statine" introuvable.')

  function carteDeTete(criteria: Criteria, renseignes?: ReadonlySet<string>) {
    const vue = construireVueDecision(node!, calculerCriteresDerives(node!.criteres_entree, criteria), renseignes)
    const optionVue = vue.familles.flatMap((famille) => famille.groupes.flat())[0]
    expect(optionVue).toBeDefined()
    return {
      optionVue,
      html: renderToStaticMarkup(
        <OptionCard
          option={optionVue.option}
          badge={optionVue.badge}
          reasons={optionVue.reasons}
          calculs={optionVue.calculs}
          calculsEnAttente={optionVue.calculsEnAttente}
          motifRang={optionVue.motifRang}
          alertes={optionVue.alertes}
        />,
      ),
    }
  }

  it('la carte « Statine indisponible » affiche « Mesure de sécurité », pas « Recommandée »', () => {
    const { optionVue, html } = carteDeTete(
      {
        ...buildDefaultCriteria(node.criteres_entree),
        age: 62,
        ASCVD_etablie: true,
        diabete_complique: false,
        dialyse: false,
        statine_deja_en_place: false,
        intolerance_statine: 'averee',
        CK_x_normale: 6,
      } as Criteria,
      // `anciennete_diabete_annees` et `autres_FDRCV` délibérément absents : c'est ce qui provoque la halte.
      new Set([
        'age',
        'ASCVD_etablie',
        'diabete_complique',
        'dialyse',
        'statine_deja_en_place',
        'intolerance_statine',
        'CK_x_normale',
      ]),
    )
    expect(optionVue.option.intitule).toContain('Statine indisponible')
    expect(optionVue.option.role).toBe('securite')
    expect(html).toContain(LIBELLE_SECURITE)
    expect(html).not.toContain(LIBELLE_RECOMMANDEE)
  })

  it('profil ORDINAIRE du même nœud : la carte `geste` de tête affiche toujours « Recommandée »', () => {
    const { optionVue, html } = carteDeTete({
      ...buildDefaultCriteria(node.criteres_entree),
      age: 60,
      ASCVD_etablie: true,
      anciennete_diabete_annees: 8,
      autres_FDRCV: 1,
      diabete_complique: false,
      dialyse: false,
      statine_deja_en_place: false,
      intolerance_statine: 'non',
      CK_x_normale: 0,
    } as Criteria)
    expect(optionVue.option.role).toBe('geste')
    expect(html).toContain(LIBELLE_RECOMMANDEE)
    expect(html).not.toContain(LIBELLE_SECURITE)
  })
})
