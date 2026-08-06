import { useEffect, useId, useRef, useState } from 'react'
import type { Navigation } from '../navigation'
import { AccountMenu } from './AccountMenu'
import { criteresSession, tailleSession } from '../../decision/lib/sessionCriteres'
import { labelForCritere } from '../../decision/lib/labels'
import './Header.css'

// T-034/P5 — durée d'affichage du retour transitoire après la purge « Nouveau patient ». Assez long pour
// être remarqué au coin de l'œil, assez court pour ne pas gêner un second geste volontaire.
const JUST_CLEARED_DURATION_MS = 1800

// T-055/P8 — durée pendant laquelle le bouton reste en « Confirmer ? · Annuler » avant de revenir seul à
// « Nouveau patient » si rien n'est cliqué. Volontairement un peu PLUS longue que
// `JUST_CLEARED_DURATION_MS` : ce dernier ne fait que confirmer visuellement une action déjà faite,
// tandis que cette fenêtre-ci laisse le temps de LIRE la question et de choisir — la refermer aussi vite
// risquerait de la faire disparaître avant qu'un praticien distrait en consultation l'ait vue.
const CONFIRMATION_DURATION_MS = 2600

// T-055/P8 — le sens du message conservé MOT POUR MOT (S1.md T-055 étape 2) : ce n'est plus le texte d'un
// `window.confirm()` natif (supprimé, cf. Décision clé), mais l'`aria-label` du bouton « Confirmer ? ».
const MESSAGE_CONFIRMATION =
  'Vider la session en cours et repartir avec un nouveau patient ? Les valeurs saisies non enregistrées seront perdues.'

type EtatNouveauPatient = 'repos' | 'confirmation' | 'vide'

interface HeaderProps {
  nav: Navigation
  /**
   * T-026/D33 — « Nouveau patient » : purge la mémoire de session ET force le remontage des écrans.
   * Orchestré par le composant racine (`App.tsx`, seul endroit qui connaît à la fois `sessionCriteres.ts`
   * et le mécanisme de remontage par `key`, D28) ; ce composant ne porte que le geste et sa confirmation.
   */
  onNouveauPatient: () => void
}

/**
 * Header sticky : logo, pills Décision/Veille (état actif selon l'écran),
 * lien Méthode, bouton « Nouveau patient » (T-026/D33, confirmation en deux temps T-055/P8), compteur de
 * session (T-056/P8), menu compte. Reproduit le bloc `showChrome` du prototype (lignes ~19-54 du
 * `.dc.html`), à l'exception du bouton « Nouveau patient » et du compteur, qui n'existent pas dans le
 * prototype (défaut de recette D-13, corrigé le 2026-07-28 puis complété le 2026-07-30).
 */
export function Header({ nav, onNouveauPatient }: HeaderProps) {
  const [accountMenuOpen, setAccountMenuOpen] = useState(false)

  // T-055/P8 — confirmation EN DEUX TEMPS SUR LE BOUTON LUI-MÊME, plus de `window.confirm` natif :
  // 'repos' → (clic) → 'confirmation' → (clic « Confirmer ? ») → purge + 'vide' (le `justCleared`
  // d'origine), ou (clic « Annuler » / silence) → retour à 'repos'. Même famille que l'ancien
  // `justCleared` : état local au composant, aucun composant de dialogue ni de toast partagé.
  const [etat, setEtat] = useState<EtatNouveauPatient>('repos')
  const confirmationTimeoutRef = useRef<number | null>(null)
  const justClearedTimeoutRef = useRef<number | null>(null)

  // Nettoie les deux timeouts si le composant démonte pendant un état transitoire (évite un setState
  // orphelin).
  useEffect(() => {
    return () => {
      if (confirmationTimeoutRef.current !== null) {
        window.clearTimeout(confirmationTimeoutRef.current)
      }
      if (justClearedTimeoutRef.current !== null) {
        window.clearTimeout(justClearedTimeoutRef.current)
      }
    }
  }, [])

  // Premier clic (depuis 'repos', ou depuis 'vide' si le praticien rouvre tout de suite le geste) : passe
  // en confirmation et arme le retour automatique si rien n'est cliqué.
  const handleDemarrerConfirmation = () => {
    setEtat('confirmation')
    if (confirmationTimeoutRef.current !== null) {
      window.clearTimeout(confirmationTimeoutRef.current)
    }
    confirmationTimeoutRef.current = window.setTimeout(() => {
      setEtat('repos')
      confirmationTimeoutRef.current = null
    }, CONFIRMATION_DURATION_MS)
  }

  // Second clic, sur « Confirmer ? » : geste DESTRUCTIF confirmé (D-13) — purge réelle.
  const handleConfirmer = () => {
    if (confirmationTimeoutRef.current !== null) {
      window.clearTimeout(confirmationTimeoutRef.current)
      confirmationTimeoutRef.current = null
    }

    onNouveauPatient()

    // Affiche le retour transitoire, puis revient à l'état normal après un court délai. Le bouton reste
    // cliquable entre-temps (pas de `disabled`) : un praticien qui rouvre tout de suite doit pouvoir le
    // refaire — il repart alors en confirmation, jamais en purge silencieuse.
    setEtat('vide')
    if (justClearedTimeoutRef.current !== null) {
      window.clearTimeout(justClearedTimeoutRef.current)
    }
    justClearedTimeoutRef.current = window.setTimeout(() => {
      setEtat('repos')
      justClearedTimeoutRef.current = null
    }, JUST_CLEARED_DURATION_MS)
  }

  const handleAnnuler = () => {
    if (confirmationTimeoutRef.current !== null) {
      window.clearTimeout(confirmationTimeoutRef.current)
      confirmationTimeoutRef.current = null
    }
    setEtat('repos')
  }

  const isDecisionActive =
    nav.screen === 'decisionDomains' ||
    nav.screen === 'decisionDomainNodes' ||
    nav.screen === 'decisionModule' ||
    nav.screen === 'decisionNode'
  const isVeilleActive = nav.screen === 'veilleList' || nav.screen === 'veilleDetail'

  // T-056/P8 — compteur d'état de la mémoire de session : lu AU RENDU, sans abonnement ni événement
  // (`sessionCriteres.ts` reste volontairement TRIVIALE, cf. sa docstring). `Header` se re-rend au
  // changement d'écran (nouvelle référence `nav` produite par `useNavigation`, `App.tsx`) : la valeur
  // affichée est donc à jour à chaque fois qu'un praticien ARRIVE sur un écran — le moment où une reprise
  // pourrait le surprendre. Limite ASSUMÉE (S1.md T-056 étape 2) : elle peut rester en retard d'une
  // frappe pendant la saisie SUR l'écran déjà ouvert, puisque `Header` ne se re-rend pas à chaque frappe
  // du formulaire — fabriquer un mécanisme de rafraîchissement pour combler ça est explicitement exclu.
  const sessionSize = tailleSession()

  // T-159 (P13/S8) — LE COMPTEUR DEVIENT CLIQUABLE (revue de conception du 2026-08-04, §8 : « le seul
  // témoin fiable de l'état de la session » doit être « cliquable, listant les valeurs portées, avec leur
  // origine »). ⚠ INVARIANT CLAUDE.md 1 : `criteresSession()` n'expose QUE des `{ nom, origine }` — ni
  // cette fonction ni ce composant ne lisent, ni ne peuvent lire, la moindre VALEUR de critère (cf. sa
  // docstring dans `sessionCriteres.ts`, et le test nommé sur l'invariant, `sessionCriteres.test.ts`).
  // Lu AU RENDU comme `sessionSize` ci-dessus, même limite assumée (pas de rafraîchissement en cours de
  // frappe sur un autre écran).
  const [sessionDetailOuvert, setSessionDetailOuvert] = useState(false)
  const idBase = useId()
  const sessionDetailId = `${idBase}-session-detail`

  return (
    <header className="header">
      <button
        type="button"
        className="header__brand"
        onClick={() => nav.go('home')}
      >
        <span className="header__logo-mark" aria-hidden="true" />
        <span className="header__brand-label">MSP Ménilmontant</span>
      </button>

      <nav className="header__pills" aria-label="Modules">
        <button
          type="button"
          className={
            isDecisionActive ? 'header__pill header__pill--decision-active' : 'header__pill'
          }
          onClick={() => nav.go('decisionDomains')}
        >
          Décision
        </button>
        <button
          type="button"
          className={
            isVeilleActive ? 'header__pill header__pill--veille-active' : 'header__pill'
          }
          onClick={() => nav.go('veilleList')}
        >
          Veille
        </button>
      </nav>

      <button type="button" className="header__methode" onClick={() => nav.go('methode')}>
        Méthode
      </button>

      <div className="header__spacer" />

      {/* T-056/P8 — un COMPTEUR, jamais un contenu, à l'origine (aucun nom de critère, aucune valeur,
          invariant CLAUDE.md 1). À 0, n'affiche rien plutôt qu'un « Session : 0 » qui ajouterait du bruit
          permanent (S1.md T-056 étape 3).

          T-159 (P13/S8) — DEVENU CLIQUABLE : un `button` (il ouvre un panneau, ce n'est pas un lien),
          `aria-expanded`/`aria-controls` comme le reste de ce header (`PastilleInfo`, même registre). Le
          panneau liste des NOMS DE CRITÈRES ET LEUR ORIGINE, JAMAIS DE VALEUR (cf. `criteresSession()`,
          `sessionCriteres.ts`, et son test d'invariant nommé) — le compteur reste, à ce titre, l'endroit
          où l'invariant CLAUDE.md 1 se joue le plus près du texte affiché : un nom de critère informe
          SANS rien dire du patient (« Espérance de vie » n'est pas une donnée patient, sa valeur l'est).
          `header__nouveau-patient` reste juste à côté, dans le flux normal du header — « à portée »
          (Décision clé, S8.md) sans dupliquer le bouton à l'intérieur du panneau. */}
      {sessionSize > 0 && (
        <div className="header__session-zone">
          <button
            type="button"
            className="header__session-compteur"
            aria-expanded={sessionDetailOuvert}
            aria-controls={sessionDetailId}
            onClick={() => setSessionDetailOuvert((ouvert) => !ouvert)}
          >
            Session : {sessionSize} valeur{sessionSize > 1 ? 's' : ''}
          </button>
          {sessionDetailOuvert && (
            <div
              id={sessionDetailId}
              className="header__session-detail"
              role="region"
              aria-label="Critères mémorisés dans la session"
            >
              <ul className="header__session-detail-liste">
                {criteresSession().map(({ nom, origine }) => (
                  <li key={nom} className="header__session-detail-item">
                    {labelForCritere(nom)}
                    <span className="header__session-detail-origine">
                      {' '}
                      · {origine === 'repris' ? "repris d'un autre écran" : 'saisi'}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* T-026/D33 · T-055/P8 — à droite, hors du chemin de lecture du contenu clinique (jamais dans le
          formulaire ni près d'une action de saisie), à distance du menu compte pour ne pas se confondre
          avec un réglage de profil : c'est un geste de fin de consultation, pas un réglage.
          `aria-live="polite"` porté par une zone TOUJOURS présente dans le DOM (son contenu change, elle
          ne disparaît jamais) : le passage en confirmation doit être annoncé à qui ne voit pas l'écran —
          même exigence que `aria-pressed` sur les segments de `CriteriaForm.tsx` (arbitrage A9). */}
      <div className="header__nouveau-patient-zone" aria-live="polite">
        {etat === 'confirmation' ? (
          <>
            <button
              type="button"
              className="header__nouveau-patient header__nouveau-patient--confirmer"
              onClick={handleConfirmer}
              aria-label={`Confirmer : ${MESSAGE_CONFIRMATION}`}
            >
              Confirmer ?
            </button>
            <button
              type="button"
              className="header__nouveau-patient"
              onClick={handleAnnuler}
              aria-label="Annuler, garder la session en cours"
            >
              Annuler
            </button>
          </>
        ) : (
          <button
            type="button"
            className={
              etat === 'vide'
                ? 'header__nouveau-patient header__nouveau-patient--vide'
                : 'header__nouveau-patient'
            }
            onClick={handleDemarrerConfirmation}
          >
            {etat === 'vide' ? 'Session vidée' : 'Nouveau patient'}
          </button>
        )}
      </div>

      <AccountMenu
        open={accountMenuOpen}
        onToggle={() => setAccountMenuOpen((open) => !open)}
        onNavigate={(screen) => {
          setAccountMenuOpen(false)
          nav.go(screen)
        }}
      />
    </header>
  )
}
