import type { Screen } from '../navigation'
import { Icon } from '../icons/Icon'
import './HomeScreen.css'

interface HomeScreenProps {
  go: (screen: Screen) => void
}

/**
 * D1 — Accueil : point d'entrée, deux cartes module + disclaimer.
 * Reproduit l'écran `isHome` du prototype (lignes ~56-91 du `.dc.html`).
 *
 * Le libellé de la carte Décision reste volontairement sans chiffre : le
 * nombre d'algorithmes DT2 n'est pas encore connu côté contenu (S2 non fait,
 * cf. plans/P1/S1.md T-008 « Si bloqué »).
 */
export function HomeScreen({ go }: HomeScreenProps) {
  return (
    <div className="home">
      <div className="home__topbar">
        <div className="home__brand">
          <span className="home__logo-mark" aria-hidden="true" />
          <span className="home__brand-label">MSP Ménilmontant</span>
        </div>
        <div className="home__topbar-actions">
          <button type="button" className="home__link-button" onClick={() => go('methode')}>
            Méthode
          </button>
          <button type="button" className="home__ghost-button" onClick={() => go('auth')}>
            Se connecter
          </button>
        </div>
      </div>

      <div className="home__hero">
        <h1 className="home__title">Aide clinique &amp; veille scientifique</h1>
        <p className="home__subtitle">
          Deux outils pensés pour la consultation : une aide à la décision fondée sur les preuves,
          et une veille hebdomadaire triée par thème et profession.
        </p>
      </div>

      {/* TEXTE REFORMULÉ (2026-08-06, T-150, demande utilisateur) — même texte final que
          `DisclaimerBar.tsx` (choisi par l'utilisateur en chat) ; icône `coeur` plutôt que `info` (déjà
          utilisée dans le bandeau permanent juste au-dessus dans l'app) pour incarner la relation
          praticien-patient, pas seulement signaler une information. `home__disclaimer-highlight` : même
          motif que `disclaimer-bar__highlight` (couleur foncée/saturée, pas l'accent-decision brut —
          contraste insuffisant sur le fond bleu pâle, retour utilisateur 3e passe). Mise en page centrée
          et retour à la ligne avant « et permettent… », même motif que `DisclaimerBar.tsx`. */}
      <div className="home__disclaimer">
        <span className="home__disclaimer-icon" aria-hidden="true">
          <Icon nom="coeur" taille={18} />
        </span>
        <p className="home__disclaimer-text">
          <strong className="home__disclaimer-lead">
            Outil d'aide à la décision fondé{' '}
            <span className="home__disclaimer-highlight">exclusivement</span> sur des données
            probantes.
          </strong>
          <br />
          Le praticien, son <span className="home__disclaimer-highlight">jugement clinique</span> et
          sa <span className="home__disclaimer-highlight">relation avec le patient</span> font le lien
          avec sa situation individuelle
          <br />
          et permettent de construire{' '}
          <span className="home__disclaimer-highlight">ensemble</span> la décision.
        </p>
      </div>

      <div className="home__grid">
        <button
          type="button"
          className="home__card"
          onClick={() => go('decisionDomains')}
        >
          <span className="home__card-icon home__card-icon--decision" aria-hidden="true">
            D
          </span>
          <h2 className="home__card-title">Aide à la décision</h2>
          <p className="home__card-text">
            Saisissez les critères d'une situation clinique ; l'outil affiche les options avec
            preuve, effet attendu, et l'écart entre reco officielle et position critique.
          </p>
          <span className="home__card-cta home__card-cta--decision">
            Diabète de type 2 — voir les algorithmes disponibles →
          </span>
        </button>

        <button
          type="button"
          className="home__card"
          onClick={() => go('veilleList')}
        >
          <span className="home__card-icon home__card-icon--veille" aria-hidden="true">
            V
          </span>
          <h2 className="home__card-title">Veille hebdomadaire</h2>
          <p className="home__card-text">
            Une sélection critique classée par thème et profession, avec un badge d'impact
            pratique pour trier votre temps de lecture.
          </p>
          <span className="home__card-cta home__card-cta--veille">Voir la semaine en cours →</span>
        </button>
      </div>
    </div>
  )
}
