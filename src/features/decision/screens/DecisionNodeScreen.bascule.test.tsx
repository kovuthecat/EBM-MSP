// @vitest-environment jsdom

/**
 * T-142/T-143 (P13/S3, 2026-08-05) — UNE BASCULE D'INTENTION OU DE SITUATION NE DÉTRUIT PLUS DE SAISIE.
 *
 * L'INVARIANT, vu rouge d'abord (livrable central de la session) : pour toute saisie S sur un nœud,
 * toute bascule de primer A→B→A ramène exactement S (valeurs ET `touched`). Ce fichier le rejoue sur les
 * DEUX parcours réels de la revue de conception (`docs/decision/validation/revue-conception-fable-
 * 2026-08-04.md` §4.1 parcours C, §5.1 « bascule destructrice ») — le nœud RÉEL, pas une approximation
 * synthétique, contrairement aux autres fichiers `DecisionNodeScreen.*.test.tsx` de ce dossier :
 *  - `prescription` : Optimiser → Initier → Intensifier, avec metformine + dose + intolérance ;
 *  - `insuline` : Basale seule → Naïf → Basale seule, avec MCG + TBR + CV + dose de basale.
 *
 * `getNoeudById` N'EST PAS MOCKÉ (contrairement à `DecisionNodeScreen.reentree.test.tsx` etc.) : c'est le
 * point du test — le contenu réel, avec ses `visible_si` et `groupe` réels, est ce qui a révélé le défaut
 * en revue. `getModuleDuNoeud` non plus (le lien de retour n'a aucun effet sur ce qui est testé ici).
 *
 * ACCORDÉON À UN SEUL PANNEAU OUVERT (constaté en écrivant ce test, pas supposé) : ouvrir une section EN
 * FERME une autre déjà ouverte. `ouvrirSection` ci-dessous est donc IDEMPOTENTE (elle ne clique que si la
 * section n'est pas déjà développée) et chaque bloc d'assertions RÉ-OUVRE sa section avant de lire ses
 * champs — jamais une hypothèse que deux sections ouvertes précédemment le restent encore.
 *
 * `reinitialiserSession` en `afterEach` : plusieurs critères réels de `prescription`/`insuline` portent
 * `partage: true` (ex. `esperance_vie`, `preference_injection`) — sans purge, une valeur saisie par un
 * test polluerait le suivant (même fichier, même registre de session, `lib/sessionCriteres.ts`).
 */
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { reinitialiserSession } from '../lib/sessionCriteres'
import { DecisionNodeScreen } from './DecisionNodeScreen'

afterEach(() => {
  cleanup()
  reinitialiserSession()
})

// Helpers DOM génériques — le contenu réel n'a pas partout une association `<label for>`/`aria-label`
// exploitable par `getByRole(..., {name})` (ex. le `<select>` des paliers de metformine, les `<input
// type=number>` de TBR/CV) : on retombe sur la STRUCTURE CSS réelle du formulaire
// (`.criteria-form__field` / `.criteria-form__field-label`), observée au navigateur pendant le
// diagnostic T-142, plutôt que de deviner une accessibilité que le composant ne fournit pas encore.

/** Une section est « ouverte » si elle contient déjà un contrôle de saisie (checkbox/input/select) ou un
 * groupe segmenté — PAS une classe CSS précise : le PRIMER (le tout premier champ du nœud, cf.
 * `criteresPilotes`) n'a AUCUN bouton d'en-tête tant qu'il n'a jamais été répondu (il est montré
 * D'OFFICE, sans accordéon à replier) — une détection par bouton d'en-tête le manquerait à tort. */
function estOuverte(section: Element): boolean {
  return section.querySelector('input, select, [role="group"]') != null
}

/** Ouvre une section repliée (accordéon) en cherchant la `.criteria-form__group` dont l'en-tête COMMENCE
 * par `libelle` — jamais une regex `/libelle/` seule : plusieurs boutons contiennent le même mot en
 * substring (ex. le lien "Suivant : Traitement →" d'une section précédente contient "Traitement"). NE
 * CLIQUE PAS si la section est DÉJÀ développée (`estOuverte`) : constaté en écrivant ce test, l'en-tête
 * d'une section DÉVELOPPÉE N'EST PLUS UN `<button>` cliquable pour la refermer (seule l'ouverture d'une
 * AUTRE section referme la précédente, accordéon à un seul panneau) — chercher un bouton nommé `libelle`
 * échouerait donc à tort sur une section déjà ouverte. */
function ouvrirSection(container: HTMLElement, libelle: string): void {
  const sections = Array.from(container.querySelectorAll('.criteria-form__group'))
  const section = sections.find((s) => {
    const entete = s.querySelector('.criteria-form__group-header-texte, .criteria-form__label')
    return entete?.textContent?.trim().toLowerCase().startsWith(libelle.toLowerCase())
  })
  if (!section) {
    throw new Error(
      `Section "${libelle}" introuvable parmi : ${sections
        .map((s) => s.querySelector('.criteria-form__group-header-texte, .criteria-form__label')?.textContent)
        .join(' | ')}`,
    )
  }
  if (estOuverte(section)) return
  fireEvent.click(within(section as HTMLElement).getByRole('button'))
}

function segment(nomGroupe: string, libelleBouton: string): HTMLButtonElement {
  const groupe = screen.getByRole('group', { name: nomGroupe })
  return within(groupe).getByRole('button', { name: libelleBouton }) as HTMLButtonElement
}

/** Bascule un critère PRIMER : ouvre sa section (au besoin, cf. `ouvrirSection`/`estOuverte` — un primer
 * déjà répondu redevient un accordéon repliable comme les autres) puis clique la valeur demandée. */
function primer(container: HTMLElement, sectionLibelle: string, groupeLibelle: string, boutonLibelle: string): void {
  ouvrirSection(container, sectionLibelle)
  fireEvent.click(segment(groupeLibelle, boutonLibelle))
}

function checkbox(nom: RegExp): HTMLInputElement {
  return screen.getByRole('checkbox', { name: nom }) as HTMLInputElement
}

/** Champ number/select SANS accessible name exploitable : retrouvé par le texte de son libellé visuel
 * (`.criteria-form__field-label`), qui peut être suivi d'un badge (« · à confirmer ») — d'où `startsWith`
 * plutôt qu'une égalité stricte. */
function champParLabel(container: HTMLElement, libelle: string): HTMLInputElement | HTMLSelectElement {
  const champs = Array.from(container.querySelectorAll('.criteria-form__field'))
  const champ = champs.find((c) => c.querySelector('.criteria-form__field-label')?.textContent?.trim().startsWith(libelle))
  if (!champ) throw new Error(`Champ "${libelle}" introuvable`)
  const controle = champ.querySelector('input, select')
  if (!controle) throw new Error(`Aucun input/select dans le champ "${libelle}"`)
  return controle as HTMLInputElement | HTMLSelectElement
}

describe('DecisionNodeScreen — une bascule d’intention ne détruit plus de saisie (T-142/T-143, nœud réel `prescription`)', () => {
  // Timeout explicite (20 s) : contenu RÉEL (`prescription`, groupes/champs nombreux), plusieurs rendus
  // et ouvertures d'accordéon successives — plus lourd que les nœuds synthétiques des autres fichiers de
  // ce dossier. Vu passer sous 5 s en isolation ; le défaut Vitest (5 s) a expiré sous charge (suite
  // complète, plusieurs fichiers de test en parallèle) — pas un défaut de logique, cf. bilan de session.
  it('Optimiser → Initier → Intensifier : metformine, dose 2000 et intolérance digestive reviennent EXACTEMENT, avec leur marque `touched`', () => {
    const { container } = render(<DecisionNodeScreen nodeId="prescription" go={() => {}} />)

    // 1. Optimiser, metformine, dose 2000, intolérance digestive — la saisie S de l'invariant.
    primer(container, 'Je souhaite', 'Intention thérapeutique (« je souhaite… »)', 'Optimiser')
    ouvrirSection(container, 'Traitement')
    fireEvent.click(checkbox(/^Metformine$/))
    fireEvent.change(champParLabel(container, 'Dose de metformine (mg/j)'), { target: { value: '2000' } })
    // Ré-ouvre 'Traitement' avant de vérifier (l'accordéon à un seul panneau n'a pas encore fermé
    // quoi que ce soit ici, mais la vérification suit toujours immédiatement sa propre ouverture —
    // jamais une hypothèse sur ce qui est resté ouvert depuis un bloc précédent).
    ouvrirSection(container, 'Traitement')
    expect(checkbox(/^Metformine$/).checked).toBe(true)
    expect(champParLabel(container, 'Dose de metformine (mg/j)').value).toBe('2000')

    ouvrirSection(container, 'Tolérance et préférences')
    fireEvent.click(checkbox(/Intolérance à un traitement en cours/))
    fireEvent.click(checkbox(/^Digestive$/))
    ouvrirSection(container, 'Tolérance et préférences')
    expect(checkbox(/Intolérance à un traitement en cours/).checked).toBe(true)
    expect(checkbox(/^Digestive$/).checked).toBe(true)

    // 2. A→B : Initier masque Traitement et Tolérance/intolérance en cascade — ROUGE avant T-143 (les
    // sections réapparaissaient vides, cf. S3.md « Le défaut, en une phrase »).
    primer(container, 'Je souhaite', 'Intention thérapeutique (« je souhaite… »)', 'Initier')

    // 3. B→A : Intensifier — l'invariant exige exactement S, valeurs ET `touched`.
    primer(container, 'Je souhaite', 'Intention thérapeutique (« je souhaite… »)', 'Intensifier')
    ouvrirSection(container, 'Traitement')

    expect(checkbox(/^Metformine$/).checked).toBe(true)
    expect(champParLabel(container, 'Dose de metformine (mg/j)').value).toBe('2000')
    // `touched`, pas seulement la valeur : aucun badge « à confirmer » ne doit rester sur ce qui vient
    // d'être restauré (sinon la restauration serait un pré-remplissage déguisé, pas une réponse reprise).
    expect(within(container).queryByText('· à confirmer')).toBeNull()
    // La mention de restauration N'EST PAS celle du pré-remplissage : une valeur restaurée n'est jamais
    // « calculé, à vérifier » (mention réservée à K6/T-061, propriété 2 de la mémoire de restauration).
    expect(within(container).queryByText('· calculé, à vérifier', { exact: false })).toBeNull()

    ouvrirSection(container, 'Tolérance et préférences')
    expect(checkbox(/Intolérance à un traitement en cours/).checked).toBe(true)
    expect(checkbox(/^Digestive$/).checked).toBe(true)
  }, 20000)
})

describe('DecisionNodeScreen — une bascule de situation ne détruit plus de saisie (T-142/T-143, nœud réel `insuline`)', () => {
  it('Basale seule → Naïf → Basale seule : MCG, TBR, CV et dose de basale reviennent EXACTEMENT', () => {
    const { container } = render(<DecisionNodeScreen nodeId="insuline" go={() => {}} />)

    // 1. Basale seule, MCG, TBR 9, CV 41, dose de basale 38 — la saisie S.
    primer(container, "Situation d'insulinothérapie", "Situation d'insulinothérapie", 'Basale seule')
    ouvrirSection(container, 'Surveillance glycémique')
    fireEvent.click(checkbox(/MCG disponible/))
    fireEvent.change(champParLabel(container, 'TBR'), { target: { value: '9' } })
    fireEvent.change(champParLabel(container, 'Coefficient de variation glycémique'), { target: { value: '41' } })
    ouvrirSection(container, 'Surveillance glycémique')
    expect(checkbox(/MCG disponible/).checked).toBe(true)
    expect(champParLabel(container, 'TBR').value).toBe('9')
    expect(champParLabel(container, 'Coefficient de variation glycémique').value).toBe('41')

    ouvrirSection(container, 'Traitement actuel')
    fireEvent.change(champParLabel(container, 'Dose de basale actuelle (U/j)'), { target: { value: '38' } })
    ouvrirSection(container, 'Traitement actuel')
    expect(champParLabel(container, 'Dose de basale actuelle (U/j)').value).toBe('38')

    // 2. A→B : Naïf masque MCG/TBR/CV/dose de basale en cascade.
    primer(container, "Situation d'insulinothérapie", "Situation d'insulinothérapie", "Naïf d'insuline")

    // 3. B→A : Basale seule — l'invariant exige exactement S.
    primer(container, "Situation d'insulinothérapie", "Situation d'insulinothérapie", 'Basale seule')
    ouvrirSection(container, 'Surveillance glycémique')

    expect(checkbox(/MCG disponible/).checked).toBe(true)
    expect(champParLabel(container, 'TBR').value).toBe('9')
    expect(champParLabel(container, 'Coefficient de variation glycémique').value).toBe('41')
    expect(within(container).queryByText('· à confirmer')).toBeNull()

    ouvrirSection(container, 'Traitement actuel')
    expect(champParLabel(container, 'Dose de basale actuelle (U/j)').value).toBe('38')
  }, 20000)

  /**
   * T-142 — LE CAS QUI A TRANCHÉ LE DIAGNOSTIC (issue 2, bug de cascade dans `reinitialiserChampsMasques`,
   * corrigé par cette session dans `lib/formLayout.ts`). `profil_nocturne` est un `enum` dont la 1re
   * valeur déclarée (`baisse_continue`, cf. `valeurParDefaut`) est justement « Baisse continue » — AVANT
   * le correctif, un champ répondu PAR CETTE valeur précise restait `touched` après un masquage (la
   * coïncidence valeur=défaut empêchait `reinitialiserChampsMasques` de le signaler), alors qu'une réponse
   * « Hausse continue » (non coïncidente) se réinitialisait déjà correctement. CE TEST VERROUILLE LES
   * DEUX CAS SYMÉTRIQUEMENT : la coïncidence ne doit plus rien changer au résultat.
   */
  it('un `enum` répondu par sa 1re valeur déclarée (« Baisse continue », coïncide avec le défaut) revient aussi fidèlement qu’une réponse non coïncidente', () => {
    const { container } = render(<DecisionNodeScreen nodeId="insuline" go={() => {}} />)

    primer(container, "Situation d'insulinothérapie", "Situation d'insulinothérapie", 'Basale seule')
    ouvrirSection(container, 'Surveillance glycémique')
    fireEvent.click(checkbox(/MCG disponible/))
    ouvrirSection(container, 'Profil glycémique nocturne')
    fireEvent.click(segment('Profil glycémique nocturne (lecture AGP)', 'Baisse continue de la glycémie nocturne'))

    ouvrirSection(container, 'Profil glycémique nocturne')
    const groupeNocturne = screen.getByRole('group', { name: 'Profil glycémique nocturne (lecture AGP)' })
    expect(
      within(groupeNocturne).getByRole('button', { name: 'Baisse continue de la glycémie nocturne' }).getAttribute('aria-pressed'),
    ).toBe('true')

    primer(container, "Situation d'insulinothérapie", "Situation d'insulinothérapie", "Naïf d'insuline")
    primer(container, "Situation d'insulinothérapie", "Situation d'insulinothérapie", 'Basale seule')
    ouvrirSection(container, 'Profil glycémique nocturne')

    const groupeApres = screen.getByRole('group', { name: 'Profil glycémique nocturne (lecture AGP)' })
    expect(
      within(groupeApres).getByRole('button', { name: 'Baisse continue de la glycémie nocturne' }).getAttribute('aria-pressed'),
    ).toBe('true')
    // La restauration n'est pas un pré-remplissage : `profil_nocturne` n'a d'ailleurs aucune règle
    // `preremplissage` dans le contenu réel (vérifié en lecture, `content/.../insuline.yaml`).
    expect(within(container).queryByText('· calculé, à vérifier', { exact: false })).toBeNull()
  }, 20000)
})
