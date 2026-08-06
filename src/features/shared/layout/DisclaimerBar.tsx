import { Icon } from '../icons/Icon'
import './DisclaimerBar.css'

/**
 * Bandeau disclaimer permanent (chrome), non intrusif mais toujours visible.
 *
 * TEXTE REFORMULÉ (2026-08-06, T-150, demande utilisateur, 2e passe) — l'ancienne formule (« le
 * praticien reste le seul responsable de la décision médicale ») se lisait comme un avertissement
 * défensif, sans valeur juridique propre, plutôt que comme ce que ce bandeau doit faire : rassurer le
 * praticien sur la place de son jugement. Texte final choisi par l'utilisateur (variante A proposée en
 * chat, ajustée : « et permettent de construire ensemble la décision »). Icône `info` (kit
 * `shared/icons`) remplace le simple caractère « i » — cohérent avec le reste de l'app, lisible en mode
 * sombre (`currentColor`). `disclaimer-bar__highlight` distingue les points clés du reste du texte
 * (couleur accent plutôt que gras seul, demande explicite « mets en valeur les points importants »).
 *
 * 3e PASSE (même jour, retour utilisateur) : (1) mise en page CENTRÉE (icône au-dessus du texte, plutôt
 * qu'à gauche) — colonne plus lisible pour un bloc qui doit se lire d'un coup d'œil. (2) Retour à la
 * ligne avant « et permettent… » : la phrase complète tenait sur une ligne trop dense. (3) Couleur du
 * `highlight` FONCÉE (pas la simple `--c-accent-decision`, trop proche en luminosité du fond bleu pâle
 * `--c-disclaimer-bg` ET du gris-bleu du texte courant `--c-text-secondary` — les deux à ~40-50 % L, peu
 * de contraste entre eux) : `oklch(32% 0.15 254)`, plus sombre ET plus saturée, se détache des deux.
 */
export function DisclaimerBar() {
  return (
    <div className="disclaimer-bar">
      <span className="disclaimer-bar__icon" aria-hidden="true">
        <Icon nom="info" taille={16} />
      </span>
      <p className="disclaimer-bar__text">
        <strong className="disclaimer-bar__lead">
          Outil d'aide à la décision fondé{' '}
          <span className="disclaimer-bar__highlight">exclusivement</span> sur des données probantes.
        </strong>
        <br />
        Le praticien, son <span className="disclaimer-bar__highlight">jugement clinique</span> et sa{' '}
        <span className="disclaimer-bar__highlight">relation avec le patient</span> font le lien avec sa
        situation individuelle
        <br />
        et permettent de construire <span className="disclaimer-bar__highlight">ensemble</span> la
        décision.
      </p>
    </div>
  )
}
