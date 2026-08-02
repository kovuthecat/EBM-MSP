import type { NomIcone } from '../icons/paths'
import { Icon } from '../icons/Icon'
import './PastilleInfo.css'

interface PastilleInfoProps {
  icone: NomIcone
  /** Nom accessible du bouton (« Contre-indications », « Posologie »…) — jamais décoratif. */
  libelle: string
  /** Texte montré au survol ET dans le panneau du parent. */
  texte: string
  /** État détenu par le PARENT (cf. Décision clé n° 2). */
  ouvert: boolean
  onToggle: () => void
  /** id du panneau rendu par le parent — câble `aria-controls`. */
  panneauId: string
  /** Registre visuel : `neutre` par défaut, `danger` pour une contre-indication active. */
  ton?: 'neutre' | 'danger'
}

/**
 * Bouton-icône « survol sur pointeur fin, clic partout » (P11/S3, T-105) — primitive qui rend possible
 * la carte en une ligne (S6) sans perdre l'accès tactile aux contre-indications.
 *
 * ARBITRAGE RÉFÉRENT DU 2026-08-01 (question 1). La maquette `traiter-refonte-ergonomie-v2` met tout en
 * `title=` (survol seul, l.276-278) ; le code d'`OptionCard.tsx` documentait l'inverse (A5 : « un survol
 * est inutilisable au doigt en consultation »). Retenu : LES DEUX — le survol en surcouche facultative,
 * le clic comme chemin garanti, sans exception. C'est pourquoi ce composant rend un vrai `<button>`
 * (jamais un `title=` seul, qui n'offre aucun geste tactile).
 *
 * POURQUOI `@media (hover: hover) and (pointer: fine)`, PAS UNE LARGEUR. L'arbitrage dit « desktop »,
 * mais la largeur est le mauvais proxy : un portable tactile large afficherait une info-bulle qu'aucun
 * doigt ne peut déclencher — exactement le défaut qu'A5 voulait éviter. La requête média de CAPACITÉ
 * exprime l'intention réelle (un pointeur fin qui peut survoler sans engager de clic). Le clic, lui,
 * fonctionne dans les deux branches, sans condition CSS ni JS.
 *
 * COMPOSANT CONTRÔLÉ (pas de `useState` interne). Le contenu déplié doit pouvoir s'afficher ailleurs que
 * sous le bouton — dans `OptionCard` (S6) il ira sous la rangée entière, pas dans la colonne d'icônes.
 * `PastilleInfo` rend donc UNIQUEMENT le bouton et l'info-bulle de survol ; c'est le PARENT qui détient
 * `ouvert` et rend le panneau déplié (identifié par `panneauId`, câblé via `aria-controls`). Un composant
 * auto-géré (état interne) rendrait cette mise en page impossible.
 *
 * L'INFO-BULLE N'EST JAMAIS L'UNIQUE PORTEUSE DE L'INFORMATION : elle est `aria-hidden="true"`, purement
 * visuelle (CSS `:hover`/`:focus-visible`). Le texte est déjà exposé aux technologies d'assistance par le
 * panneau que le bouton ouvre (`aria-expanded` + `aria-controls`, rendu par le parent). Sans ce
 * `aria-hidden`, on remplacerait un `title=` (déjà écarté) par un piège équivalent pour les lecteurs
 * d'écran : un second texte, non annoncé de façon fiable, dupliquant celui du panneau.
 *
 * Le texte de la bulle reste toujours présent dans le DOM, `ouvert` ou non : c'est le CSS seul (media
 * query + `:hover`/`:focus-visible`) qui la montre ou la masque, jamais le JSX — sinon aucune info-bulle
 * ne pourrait apparaître au survol.
 */
export function PastilleInfo({
  icone,
  libelle,
  texte,
  ouvert,
  onToggle,
  panneauId,
  ton = 'neutre',
}: PastilleInfoProps) {
  return (
    <button
      type="button"
      className={`pastille-info pastille-info--${ton}`}
      aria-label={libelle}
      aria-expanded={ouvert}
      aria-controls={panneauId}
      onClick={onToggle}
    >
      <Icon nom={icone} />
      <span className="pastille-info__bulle" aria-hidden="true">
        {texte}
      </span>
    </button>
  )
}
