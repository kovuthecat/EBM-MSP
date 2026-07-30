// @vitest-environment jsdom

/**
 * Test d'INTERACTION pour `CriteriaForm` seul (P5 · S1, T-032) — même infrastructure que
 * `screens/DecisionNodeScreen.interaction.test.tsx` (RTL + jsdom, cf. sa docstring de tête pour le
 * raisonnement complet), volontairement dans un FICHIER SÉPARÉ de `CriteriaForm.test.tsx` : celui-ci
 * reste en `react-dom/server` (HTML statique, aucun événement rejoué) pour ne pas faire tourner jsdom
 * sur les ~30 tests qui n'en ont pas besoin — `@vitest-environment` ne se déclare qu'en tête de fichier.
 *
 * CE QUE `CriteriaForm.test.tsx` NE PEUT PAS VÉRIFIER, et pourquoi ce fichier existe : il confirme déjà,
 * en HTML statique, qu'un segment non `touched` ne s'affiche jamais sélectionné. Il ne peut pas vérifier
 * le GESTE — cliquer sur le segment DÉJÀ sélectionné doit appeler `onEffacer(critere.nom)` plutôt que
 * `onChange(critere.nom, valeur)` (BILAN-P4-2026-07-28.md §2/§6, "Décision clé" de T-032) — faute
 * d'événement DOM rejoué. Le harnais ci-dessous tient `criteria`/`touched` en état RÉEL (`useState`),
 * avec le même contrat qu'`onEffacer` documente (`CriteriaForm.tsx` ≈ lignes 55-63) et que
 * `DecisionNodeScreen.tsx` `handleCriteriaEffacer` applique : `onEffacer` retire le nom de `touched` ET
 * remet `valeurParDefaut(critere)` — sans état réel, un second clic recevrait encore les `criteria`/
 * `touched` d'avant le premier, et le test ne distinguerait pas un correctif réel d'un correctif qui se
 * contente d'appeler la bonne fonction sans que l'écran en tienne compte.
 */
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { useState } from 'react'
import { afterEach, describe, expect, it } from 'vitest'
import type { CritereEntree } from '../content/node.types'
import type { Criteria, CriteriaValue } from '../engine/conditions'
import { valeurParDefaut } from '../lib/formLayout'
import { buildDefaultCriteria, CriteriaForm } from './CriteriaForm'

afterEach(cleanup)

// `risque_hypoglycemie_schema` / `faible`|`eleve` : noms déjà catalogués (`lib/labels.ts`), et c'est
// littéralement le champ cité par le défaut réel de BILAN-P4-2026-07-28.md §2 (« le clic suivant a
// atterri sur "Risque hypoglycémique = Faible" ... recliquer dessus ne ramène jamais à "non répondu" »).
const CRITERES: CritereEntree[] = [
  { nom: 'risque_hypoglycemie_schema', type: 'enum', valeurs: ['faible', 'eleve'], groupe: 'Sécurité' },
]

/**
 * Harnais avec état RÉEL — `onEffacer` reproduit EXACTEMENT le contrat de `DecisionNodeScreen.tsx`
 * `handleCriteriaEffacer` (retire `nom` de `touched`, remet `valeurParDefaut(critere)`), pas une
 * simplification : c'est ce contrat, déjà câblé pour le `nombre`, que T-032 étend au segment `enum`.
 */
function Harnais() {
  const [criteria, setCriteria] = useState<Criteria>(() => buildDefaultCriteria(CRITERES))
  const [touched, setTouched] = useState<ReadonlySet<string>>(new Set())

  const onChange = (nom: string, valeur: CriteriaValue) => {
    setCriteria((c) => ({ ...c, [nom]: valeur }))
    setTouched((t) => new Set(t).add(nom))
  }
  const onEffacer = (nom: string) => {
    const critere = CRITERES.find((c) => c.nom === nom)
    if (critere) setCriteria((c) => ({ ...c, [nom]: valeurParDefaut(critere) }))
    setTouched((t) => {
      const suivant = new Set(t)
      suivant.delete(nom)
      return suivant
    })
  }

  return (
    <CriteriaForm
      criteresEntree={CRITERES}
      criteria={criteria}
      touched={touched}
      pertinents={new Set(CRITERES.map((c) => c.nom))}
      aConfirmer={touched.has('risque_hypoglycemie_schema') ? new Set() : new Set(['risque_hypoglycemie_schema'])}
      onEffacer={onEffacer}
      onChange={onChange}
    />
  )
}

describe('CriteriaForm — reclic sur un segment déjà sélectionné désélectionne (P5 · S1 T-032)', () => {
  it('répondu puis reclique : `touched` le quitte, `aria-pressed="false"` sur les DEUX boutons, « à confirmer » revient', () => {
    render(<Harnais />)
    const faible = screen.getByRole('button', { name: 'Faible' })
    const eleve = screen.getByRole('button', { name: 'Élevé' })
    const champ = faible.closest('.criteria-form__field')
    if (!champ) throw new Error('champ introuvable')

    // Avant toute saisie : rien sélectionné, marqueur « à confirmer » présent (décisif, pas encore répondu).
    expect(faible.getAttribute('aria-pressed')).toBe('false')
    expect(eleve.getAttribute('aria-pressed')).toBe('false')
    expect(champ.textContent).toContain('à confirmer')

    // 1. RÉPONSE : clic sur « Faible ».
    fireEvent.click(faible)
    expect(faible.getAttribute('aria-pressed')).toBe('true')
    expect(eleve.getAttribute('aria-pressed')).toBe('false')
    expect(champ.textContent).not.toContain('à confirmer')

    // 2. RECLIC sur le MÊME segment : LE défaut de BILAN-P4 §2 — avant T-032, ce clic ne faisait rien
    // (`onChange` reposait la même valeur, `touched` restait acquis). Doit désormais effacer.
    fireEvent.click(faible)
    expect(faible.getAttribute('aria-pressed')).toBe('false')
    expect(eleve.getAttribute('aria-pressed')).toBe('false')
    // Le critère est redevenu non renseigné : le marqueur « à confirmer » réapparaît (même définition
    // que `decisifsAConfirmer`, `lib/formLayout.ts` — gouverné par `touched`, pas par la valeur stockée).
    expect(champ.textContent).toContain('à confirmer')
  })

  it("un clic sur le segment NON sélectionné reste inchangé : bascule vers l'autre valeur, ne l'efface pas", () => {
    render(<Harnais />)
    const faible = screen.getByRole('button', { name: 'Faible' })
    const eleve = screen.getByRole('button', { name: 'Élevé' })

    fireEvent.click(faible)
    expect(faible.getAttribute('aria-pressed')).toBe('true')

    // Clic sur L'AUTRE segment (non sélectionné au moment du clic) : comportement RÉGULIER, inchangé par
    // T-032 — seul le reclic sur le segment déjà sélectionné efface (cf. "Décision clé" de la tâche).
    fireEvent.click(eleve)
    expect(faible.getAttribute('aria-pressed')).toBe('false')
    expect(eleve.getAttribute('aria-pressed')).toBe('true')
  })
})

/**
 * P6 · SB2 — accordéon par groupe : le DYNAMIQUE (« ouvrir une section referme les autres »), qu'un HTML
 * statique ne peut pas rejouer — `CriteriaForm.test.tsx` vérifie déjà, en statique, l'état INITIAL (une
 * seule grille au premier rendu) et le résumé générique d'une section repliée ; ce fichier vérifie le
 * GESTE : cliquer sur une autre chip fait bien basculer LAQUELLE des sections est ouverte, jamais s'en
 * ajouter une deuxième à côté.
 */
describe('CriteriaForm — accordéon : ouvrir une section referme les autres (P6 · SB2)', () => {
  const CRITERES: CritereEntree[] = [
    { nom: 'a', type: 'bool', groupe: 'Alpha' },
    { nom: 'b', type: 'bool', groupe: 'Beta' },
    { nom: 'c', type: 'bool', groupe: 'Gamma' },
  ]

  function Harnais() {
    const [criteria, setCriteria] = useState<Criteria>(() => buildDefaultCriteria(CRITERES))
    const [touched, setTouched] = useState<ReadonlySet<string>>(new Set())
    const onChange = (nom: string, valeur: CriteriaValue) => {
      setCriteria((c) => ({ ...c, [nom]: valeur }))
      setTouched((t) => new Set(t).add(nom))
    }
    return <CriteriaForm criteresEntree={CRITERES} criteria={criteria} touched={touched} onChange={onChange} />
  }

  // BARRE DE CHIPS SUPPRIMÉE le 2026-07-29 (recette référent) : elle doublait le titre de section, qui
  // porte désormais lui-même le compteur « N à confirmer ». Ce test vérifiait le geste SUR LA CHIP ; il
  // vérifie maintenant le MÊME geste sur le canal de navigation qui subsiste — le titre d'une section
  // repliée, déjà un bouton d'ouverture avant ce changement (`criteria-form__group-header-bouton`).
  // L'invariant testé est inchangé : ouvrir une section en referme une autre, jamais deux ouvertes.
  const titreSection = (container: HTMLElement, libelle: string) =>
    [...container.querySelectorAll('.criteria-form__group-header-bouton')].find(
      (bouton) => bouton.textContent?.startsWith(libelle),
    ) as HTMLElement | undefined

  it('cliquer sur le titre replié « Beta » ouvre Beta et referme Alpha — une seule `.criteria-form__grid` à la fois', () => {
    const { container } = render(<Harnais />)

    // État initial : « Alpha » (premier groupe déclaré) ouvert par défaut, les deux autres repliés.
    expect(container.querySelectorAll('.criteria-form__grid').length).toBe(1)
    expect(container.querySelectorAll('.criteria-form__group-resume').length).toBe(2)
    // Alpha étant OUVERT, il n'a pas de bouton de titre (son libellé est un simple <div>).
    expect(titreSection(container, 'Alpha')).toBeUndefined()

    const beta = titreSection(container, 'Beta')
    if (!beta) throw new Error('titre de section « Beta » introuvable')
    fireEvent.click(beta)

    // Toujours UNE seule grille — Beta a REMPLACÉ Alpha, pas ajouté une deuxième section ouverte.
    expect(container.querySelectorAll('.criteria-form__grid').length).toBe(1)
    expect(container.querySelectorAll('.criteria-form__group-resume').length).toBe(2)
    // Le rapport s'est inversé : Beta n'a plus de bouton (ouvert), Alpha en a un (replié).
    expect(titreSection(container, 'Beta')).toBeUndefined()
    expect(titreSection(container, 'Alpha')).toBeDefined()

    // « Alpha », redevenu replié, porte désormais son propre résumé générique (jamais touché → vierge).
    const sections = [...container.querySelectorAll('section.criteria-form__group')]
    const alphaSection = sections.find(
      (section) => section.querySelector('.criteria-form__group-header-bouton')?.textContent?.startsWith('Alpha'),
    )
    if (!alphaSection) throw new Error('section « Alpha » introuvable')
    expect(alphaSection.textContent).toContain('Aucun champ renseigné')
  })
})
