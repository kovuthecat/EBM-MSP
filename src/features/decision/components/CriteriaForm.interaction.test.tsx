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
import { afterEach, describe, expect, it, vi } from 'vitest'
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

/**
 * T-148 (P13/S5) — « Rien à signaler » répond à toute la section, durablement. Défaut corrigé (D13,
 * revue de conception du 2026-08-04) : le bouton ne répondait qu'aux `bool` DÉCISIFS à l'instant du
 * clic (`aConfirmer`) — un drapeau devenu décisif ENSUITE redevenait « à confirmer » dans une section
 * que le praticien croyait soldée. `CriteriaForm.test.tsx` (HTML statique) couvre déjà le résumé
 * compact/exhaustif qui en découle ; ce fichier couvre le GESTE lui-même, qu'un rendu statique ne peut
 * pas rejouer (aucun événement DOM) — même raison d'être que le reste de ce fichier, cf. sa docstring de
 * tête. Hors du périmètre strict « Modifier » de `plans/P13/S5.md` (qui ne nommait que
 * `CriteriaForm.test.tsx`), mais nécessaire pour honorer l'étape 2 de la tâche (« test vu rouge
 * d'abord... après le clic ») : un clic ne se simule qu'avec un DOM réel (RTL/jsdom), pas en HTML
 * statique — l'architecture de ce dépôt sépare déjà les deux pour cette raison précise.
 */
describe('CriteriaForm — « Rien à signaler » répond à toute la section (T-148, arbitrage référent 2026-08-04)', () => {
  it('un clic répond à TOUS les `bool` visibles non renseignés de la section, décisifs ou non — pas seulement au décisif', () => {
    // `ASCVD_etablie` est le seul DÉCISIF (`aConfirmer`) — c'est lui qui déclenche l'AFFICHAGE du
    // bouton. `denutrition` ne l'est pas : AVANT T-148, seul `boolsAConfirmer` (les décisifs) était
    // répondu par le clic — `denutrition` en restait hors, silencieusement.
    const CRITERES: CritereEntree[] = [
      { nom: 'ASCVD_etablie', type: 'bool', groupe: 'Terrain' },
      { nom: 'denutrition', type: 'bool', groupe: 'Terrain' },
    ]
    const onConfirmerChamps = vi.fn()
    render(
      <CriteriaForm
        criteresEntree={CRITERES}
        criteria={buildDefaultCriteria(CRITERES)}
        touched={new Set()}
        aConfirmer={new Set(['ASCVD_etablie'])}
        onConfirmerChamps={onConfirmerChamps}
        onChange={() => {}}
      />,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Rien à signaler' }))
    expect(onConfirmerChamps).toHaveBeenCalledTimes(1)
    // CE À QUOI LE CLIC RÉPOND (l'appel à `onConfirmerChamps`) : les DEUX `bool` visibles non
    // renseignés, décisif ET non décisif — l'ordre n'a pas de sens clinique, seul l'ensemble compte.
    expect(new Set(onConfirmerChamps.mock.calls[0][0])).toEqual(new Set(['ASCVD_etablie', 'denutrition']))
  })

  it("le `bool` MASQUÉ au moment du clic n'est pas répondu — arbitrage référent n° 2 (2026-08-04, `plans/P13/index.md` §Arbitrages), position (a) imposée", () => {
    // `revele` est déjà RÉPONDU « non » (touché, valeur `false`) AVANT ce test — une saisie directe
    // antérieure, hors du geste RAS sous test — donc `masque_au_clic` (`visible_si: "revele == true"`)
    // est réellement MASQUÉ à l'instant du clic, pas seulement « pas encore répondu » (un `visible_si`
    // INDÉTERMINÉ resterait VISIBLE par le repli « fail open » de R7, cf. `champEstVisible`,
    // `lib/formLayout.ts` — ce n'est pas le cas ici : `revele` est déterminé à `false`).
    const CRITERES: CritereEntree[] = [
      { nom: 'ASCVD_etablie', type: 'bool', groupe: 'Terrain' },
      { nom: 'revele', type: 'bool', groupe: 'Terrain' },
      { nom: 'masque_au_clic', type: 'bool', groupe: 'Terrain', visible_si: 'revele == true' },
    ]
    const onConfirmerChamps = vi.fn()
    render(
      <CriteriaForm
        criteresEntree={CRITERES}
        criteria={{ ...buildDefaultCriteria(CRITERES), revele: false }}
        touched={new Set(['revele'])}
        aConfirmer={new Set(['ASCVD_etablie', 'masque_au_clic'])}
        onConfirmerChamps={onConfirmerChamps}
        onChange={() => {}}
      />,
    )
    // `masque_au_clic` n'apparaît même pas dans le DOM : masqué, comme attendu.
    expect(screen.queryByRole('checkbox', { name: 'Masque au clic' })).toBeNull()

    fireEvent.click(screen.getByRole('button', { name: 'Rien à signaler' }))
    expect(onConfirmerChamps).toHaveBeenCalledTimes(1)
    const noms = onConfirmerChamps.mock.calls[0][0] as string[]
    // Le décisif VISIBLE (`ASCVD_etablie`) est répondu ; le décisif MASQUÉ (`masque_au_clic`) ne l'est
    // pas — exactement l'arbitrage rendu : seuls les drapeaux EFFECTIVEMENT AFFICHÉS au clic sont
    // couverts, peu importe leur décisivité à cet instant.
    expect(noms).toContain('ASCVD_etablie')
    expect(noms).not.toContain('masque_au_clic')
  })

  it("le `bool` masqué au clic redemande sa propre confirmation une fois révélé — la preuve qu'il n'avait pas été répondu par avance", () => {
    // Même point de départ que le test précédent (`revele` déjà répondu « non », `masque_au_clic`
    // masqué), mais avec un état RÉEL (harnais) pour rejouer la séquence complète : RAS, puis le
    // praticien révèle la section par une saisie DIRECTE (jamais par RAS) — le scénario même du « cas
    // résiduel » du plan, un drapeau masqué au clic qui réapparaît ensuite.
    const CRITERES: CritereEntree[] = [
      { nom: 'ASCVD_etablie', type: 'bool', groupe: 'Terrain' },
      { nom: 'revele', type: 'bool', groupe: 'Terrain' },
      { nom: 'masque_au_clic', type: 'bool', groupe: 'Terrain', visible_si: 'revele == true' },
    ]
    const DECISIFS = ['ASCVD_etablie', 'masque_au_clic']

    function Harnais() {
      const [criteria, setCriteria] = useState<Criteria>(() => ({ ...buildDefaultCriteria(CRITERES), revele: false }))
      const [touched, setTouched] = useState<ReadonlySet<string>>(new Set(['revele']))
      const onChange = (nom: string, valeur: CriteriaValue) => {
        setCriteria((c) => ({ ...c, [nom]: valeur }))
        setTouched((t) => new Set(t).add(nom))
      }
      const onConfirmerChamps = (noms: string[]) => {
        setTouched((t) => {
          const suivant = new Set(t)
          for (const nom of noms) suivant.add(nom)
          return suivant
        })
      }
      return (
        <CriteriaForm
          criteresEntree={CRITERES}
          criteria={criteria}
          touched={touched}
          aConfirmer={new Set(DECISIFS.filter((nom) => !touched.has(nom)))}
          onConfirmerChamps={onConfirmerChamps}
          onChange={onChange}
        />
      )
    }

    render(<Harnais />)
    fireEvent.click(screen.getByRole('button', { name: 'Rien à signaler' }))
    // Plus rien à confirmer PARMI CE QUI EST VISIBLE (`ASCVD_etablie` vient de l'être) : le bouton
    // disparaît (comportement normal — « on change ce à quoi il répond, pas quand il apparaît »).
    expect(screen.queryByRole('button', { name: 'Rien à signaler' })).toBeNull()

    // Le praticien révèle la section : coche `revele` (saisie DIRECTE, pas RAS).
    fireEvent.click(screen.getByRole('checkbox', { name: 'Revele' }))

    // `masque_au_clic` est maintenant VISIBLE et DÉCISIF NON CONFIRMÉ : le bouton REVIENT. Si le clic
    // précédent l'avait répondu par avance (lecture (b), écartée par le référent), il serait déjà
    // `touched` et le bouton resterait absent.
    expect(screen.getByRole('button', { name: 'Rien à signaler' })).not.toBeNull()
  })
})

/**
 * T-108 (P11/S4) — description des valeurs atteignable au clic (`PastilleInfo`), pas seulement en
 * `title=` (invisible sur tablette, invisible au lecteur d'écran). `esperance_vie` (nœud partagé, valeurs
 * `longue`/`intermediaire`/`limitee`) est une fixture RÉELLE : `longue` et `limitee` sont décrites dans
 * `lib/labels.ts` `ENUM_VALUE_DESCRIPTIONS`, `intermediaire` ne l'est pas (cf. sa docstring, T-069) —
 * donc le critère porte bien une pastille (au moins une valeur décrite). Test d'INTERACTION (le panneau
 * ne se rend qu'après un clic, RTL/jsdom requis) plutôt que du HTML statique.
 */
describe('CriteriaForm — description des valeurs atteignable au clic (T-108)', () => {
  const CRITERES: CritereEntree[] = [
    { nom: 'esperance_vie', type: 'enum', valeurs: ['longue', 'intermediaire', 'limitee'], groupe: 'Section' },
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

  it('un critère dont au moins une valeur est décrite rend une pastille, et son panneau au clic', () => {
    const { container } = render(<Harnais />)
    const pastille = screen.getByRole('button', { name: /Espérance de vie/i })
    expect(pastille.getAttribute('aria-expanded')).toBe('false')

    const panneauId = pastille.getAttribute('aria-controls')
    if (!panneauId) throw new Error('aria-controls absent de la pastille')
    // Attribut CSS (pas `#id`) : `useId()` (React 19) peut produire des `:` dans l'id, invalides tels
    // quels dans un sélecteur `#…`.
    expect(container.querySelector(`[id="${panneauId}"]`)).toBeNull()

    fireEvent.click(pastille)

    expect(pastille.getAttribute('aria-expanded')).toBe('true')
    const panneau = container.querySelector(`[id="${panneauId}"]`)
    expect(panneau).not.toBeNull()
    expect(panneau?.className).toContain('criteria-form__aide')
    expect(panneau?.textContent).toContain('Longue : Espérance de vie estimée supérieure à 15 ans')
    // `intermediaire` n'a pas de description cataloguée : absent de l'agrégat, comme un critère qui n'a
    // rien à en dire — ce n'est pas une valeur fantôme.
    expect(panneau?.textContent).not.toContain('Intermédiaire :')
  })

  it("un critère SANS aucune valeur décrite ne rend aucune pastille", () => {
    const SANS_DESCRIPTION: CritereEntree[] = [
      { nom: 'intolerance_statine', type: 'enum', valeurs: ['non', 'rapportee', 'averee'], groupe: 'Section' },
    ]
    render(
      <CriteriaForm
        criteresEntree={SANS_DESCRIPTION}
        criteria={buildDefaultCriteria(SANS_DESCRIPTION)}
        touched={new Set()}
        onChange={() => {}}
      />,
    )
    expect(screen.queryByRole('button', { name: /Intolérance aux statines/i })).toBeNull()
  })
})

/**
 * T-156 (P13/S8, P4) — auto-avance après un choix segmenté unique. Test d'INTERACTION (le geste — un
 * clic ouvre une AUTRE section — n'est pas rejouable en HTML statique, même raison d'être que le reste
 * de ce fichier). Le garde-fou 2 de la Décision clé (« rien ne bouge au-dessus du point de lecture »,
 * mesuré en pixels réels) ÉCHAPPE à jsdom (aucun moteur de mise en page, cf. `plans/P13/S8.md`) — DÉFÉRÉ
 * à une vérification au navigateur (`/verif-visuelle`, N1) ; ce qui suit vérifie ce que jsdom PEUT
 * garantir : la section quittée ne se démonte pas (elle persiste dans le DOM, repliée avec son résumé),
 * et rien d'autre ne se re-rend à sa place.
 */
describe('CriteriaForm — auto-avance après un choix segmenté unique (T-156)', () => {
  const CRITERES: CritereEntree[] = [
    { nom: 'intention', type: 'enum', valeurs: ['initier', 'optimiser'], groupe: 'Intention' },
    { nom: 'situation', type: 'enum', valeurs: ['naif', 'basale'], groupe: 'Situation' },
    { nom: 'age', type: 'nombre', groupe: 'Terrain' },
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

  const titreSection = (container: HTMLElement, libelle: string) =>
    [...container.querySelectorAll('.criteria-form__group-header-bouton')].find((bouton) =>
      bouton.textContent?.startsWith(libelle),
    ) as HTMLElement | undefined

  it('premier choix sur le champ segmenté unique d’« Intention » : « Situation » s’ouvre seule, « Intention » persiste repliée (pas démontée)', () => {
    const { container } = render(<Harnais />)

    // État initial : Intention ouverte (premier groupe), les deux autres repliées.
    expect(container.querySelectorAll('section.criteria-form__group').length).toBe(3)
    expect(container.querySelectorAll('.criteria-form__grid').length).toBe(1)

    fireEvent.click(screen.getByRole('button', { name: 'Initier' }))

    // Toujours 3 sections dans le DOM (aucune démontée) et UNE SEULE grille ouverte — « Situation », pas
    // « Intention » ni les deux à la fois.
    expect(container.querySelectorAll('section.criteria-form__group').length).toBe(3)
    expect(container.querySelectorAll('.criteria-form__grid').length).toBe(1)
    expect(titreSection(container, 'Intention')).toBeDefined() // repliée : redevenue un bouton de titre.
    expect(titreSection(container, 'Situation')).toBeUndefined() // ouverte : pas de bouton, juste le titre.
    // La section quittée porte désormais son résumé (preuve qu'elle n'a pas disparu, seul son CONTENU a
    // changé — même mécanisme que l'accordéon manuel, `CriteriaForm.tsx` `sectionsMontees`).
    const intentionSection = [...container.querySelectorAll('section.criteria-form__group')].find((s) =>
      s.textContent?.includes('Intention'),
    )
    expect(intentionSection?.querySelector('.criteria-form__group-resume')).not.toBeNull()
  })

  it('changement d’un choix déjà répondu : pas de réouverture automatique (garde-fou 1)', () => {
    const { container } = render(<Harnais />)

    // Premier choix : avance vers « Situation », comme ci-dessus.
    fireEvent.click(screen.getByRole('button', { name: 'Initier' }))
    expect(titreSection(container, 'Situation')).toBeUndefined()

    // Le praticien revient sur « Intention » (clic sur son titre replié) et CHANGE son choix.
    const intentionTitre = titreSection(container, 'Intention')
    if (!intentionTitre) throw new Error('titre « Intention » introuvable')
    fireEvent.click(intentionTitre)
    expect(container.querySelectorAll('.criteria-form__grid').length).toBe(1)
    fireEvent.click(screen.getByRole('button', { name: 'Optimiser' }))

    // Aucune deuxième auto-avance : « Intention » reste la section ouverte, « Situation » reste repliée.
    expect(titreSection(container, 'Situation')).toBeDefined()
    expect(titreSection(container, 'Intention')).toBeUndefined()
    expect(container.querySelectorAll('.criteria-form__grid').length).toBe(1)
  })

  it('section à PLUSIEURS champs : un choix segmenté n’avance jamais automatiquement', () => {
    const CRITERES_MULTI: CritereEntree[] = [
      { nom: 'intention', type: 'enum', valeurs: ['initier', 'optimiser'], groupe: 'Intention' },
      { nom: 'x', type: 'enum', valeurs: ['a', 'b'], groupe: 'Multi' },
      { nom: 'y', type: 'bool', groupe: 'Multi' },
      { nom: 'z', type: 'nombre', groupe: 'Dernière' },
    ]
    function HarnaisMulti() {
      const [criteria, setCriteria] = useState<Criteria>(() => buildDefaultCriteria(CRITERES_MULTI))
      const [touched, setTouched] = useState<ReadonlySet<string>>(new Set())
      const onChange = (nom: string, valeur: CriteriaValue) => {
        setCriteria((c) => ({ ...c, [nom]: valeur }))
        setTouched((t) => new Set(t).add(nom))
      }
      return (
        <CriteriaForm criteresEntree={CRITERES_MULTI} criteria={criteria} touched={touched} onChange={onChange} />
      )
    }
    const { container } = render(<HarnaisMulti />)

    // Ouvre « Multi » (2 champs) manuellement.
    const multiTitre = titreSection(container, 'Multi')
    if (!multiTitre) throw new Error('titre « Multi » introuvable')
    fireEvent.click(multiTitre)
    expect(container.querySelectorAll('.criteria-form__grid').length).toBe(1)

    // Premier choix sur le champ segmenté `x` — la section a DEUX champs (`x` et `y`) : pas d'auto-avance.
    fireEvent.click(screen.getByRole('button', { name: 'A' }))
    expect(titreSection(container, 'Multi')).toBeUndefined() // toujours ouverte
    expect(titreSection(container, 'Dernière')).toBeDefined() // toujours repliée
    expect(container.querySelectorAll('.criteria-form__grid').length).toBe(1)
  })

  it('dernière section : un choix segmenté unique n’a nulle part où avancer', () => {
    const CRITERES_FIN: CritereEntree[] = [
      { nom: 'a', type: 'bool', groupe: 'Alpha' },
      { nom: 'risque', type: 'enum', valeurs: ['faible', 'eleve'], groupe: 'Beta' },
    ]
    function HarnaisFin() {
      const [criteria, setCriteria] = useState<Criteria>(() => buildDefaultCriteria(CRITERES_FIN))
      const [touched, setTouched] = useState<ReadonlySet<string>>(new Set())
      const onChange = (nom: string, valeur: CriteriaValue) => {
        setCriteria((c) => ({ ...c, [nom]: valeur }))
        setTouched((t) => new Set(t).add(nom))
      }
      return <CriteriaForm criteresEntree={CRITERES_FIN} criteria={criteria} touched={touched} onChange={onChange} />
    }
    const { container } = render(<HarnaisFin />)

    // Ouvre « Beta » (dernier groupe, champ segmenté unique) manuellement.
    const betaTitre = titreSection(container, 'Beta')
    if (!betaTitre) throw new Error('titre « Beta » introuvable')
    fireEvent.click(betaTitre)
    expect(container.querySelectorAll('.criteria-form__grid').length).toBe(1)

    fireEvent.click(screen.getByRole('button', { name: 'Faible' }))

    // Rien à ouvrir après la dernière section : « Beta » reste la section ouverte, une seule grille.
    expect(titreSection(container, 'Beta')).toBeUndefined()
    expect(container.querySelectorAll('.criteria-form__grid').length).toBe(1)
  })
})

/**
 * T-157 (P13/S8, P5) — `champCible` (ouverture ciblée + focus depuis l'EXTÉRIEUR du formulaire, cf. sa
 * docstring dans `CriteriaFormProps`). Test au niveau du COMPOSANT SEUL (complète la couverture bout en
 * bout de `DecisionNodeScreen.champCible.test.tsx`, qui exerce le cartouche réel) : ici, la prop est posée
 * directement, sur plusieurs TYPES de champ, pour prouver que le point d'entrée focalisé (`champsMontes`,
 * `CriteriaForm.tsx`) est correctement posé quel que soit le type de rendu.
 */
describe('CriteriaForm — champCible : ouverture + focus depuis l’extérieur (T-157)', () => {
  const CRITERES: CritereEntree[] = [
    { nom: 'intro', type: 'bool', groupe: 'Intro' },
    { nom: 'flag', type: 'bool', groupe: 'Suite' },
    { nom: 'choix', type: 'enum', valeurs: ['a', 'b'], groupe: 'Suite' },
  ]

  function Harnais({ champCible }: { champCible: { nom: string } | null }) {
    const [criteria, setCriteria] = useState<Criteria>(() => buildDefaultCriteria(CRITERES))
    const [touched, setTouched] = useState<ReadonlySet<string>>(new Set())
    const onChange = (nom: string, valeur: CriteriaValue) => {
      setCriteria((c) => ({ ...c, [nom]: valeur }))
      setTouched((t) => new Set(t).add(nom))
    }
    return (
      <CriteriaForm
        criteresEntree={CRITERES}
        criteria={criteria}
        touched={touched}
        onChange={onChange}
        champCible={champCible}
      />
    )
  }

  it('cible un `bool` dans une section repliée : la section s’ouvre, le focus arrive sur la case', () => {
    const { container, rerender } = render(<Harnais champCible={null} />)
    expect(container.querySelectorAll('.criteria-form__grid').length).toBe(1) // « Intro » seule ouverte.

    rerender(<Harnais champCible={{ nom: 'flag' }} />)

    expect(container.querySelectorAll('.criteria-form__grid').length).toBe(1) // toujours UNE section ouverte…
    const checkboxFlag = screen.getByRole('checkbox', { name: 'Flag' })
    expect(document.activeElement).toBe(checkboxFlag) // … et c'est la bonne, focalisée.
  })

  it('cible un `enum` segmenté dans une section repliée : le focus arrive sur le PREMIER bouton (rien n’est encore sélectionné)', () => {
    const { rerender } = render(<Harnais champCible={null} />)
    rerender(<Harnais champCible={{ nom: 'choix' }} />)

    const boutonA = screen.getByRole('button', { name: 'A' })
    expect(document.activeElement).toBe(boutonA)
  })

  it("un nom qui ne correspond à AUCUN champ actuel est ignoré silencieusement (pas de crash, rien ne bouge)", () => {
    const { container, rerender } = render(<Harnais champCible={null} />)
    rerender(<Harnais champCible={{ nom: 'introuvable' }} />)

    // Toujours « Intro » ouverte (premier groupe), aucune exception levée par le rendu ci-dessus.
    expect(container.querySelectorAll('.criteria-form__grid').length).toBe(1)
    const titreSuite = [...container.querySelectorAll('.criteria-form__group-header-bouton')].find((b) =>
      b.textContent?.startsWith('Suite'),
    )
    expect(titreSuite).toBeDefined() // « Suite » reste repliée : aucune ouverture n'a eu lieu.
  })
})
