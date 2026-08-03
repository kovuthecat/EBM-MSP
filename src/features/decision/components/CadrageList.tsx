import './CadrageList.css'

interface CadrageListProps {
  cadrage: string[]
}

/**
 * Positions de lecture d'un nœud (DECISIONS.md D24) : énoncés vrais pour TOUS ses patients, qui disent
 * comment lire l'ensemble de ses options (« l'insuline n'a pas de bénéfice cardiovasculaire démontré »,
 * « la décision se grade sur le risque absolu, pas sur une cible LDL chiffrée »). Rendus en tête du nœud,
 * AVANT le formulaire — on les lit avant de saisir quoi que ce soit, ce qui est précisément leur fonction.
 *
 * Pourquoi un composant distinct d'`AlertList` alors que le rendu est proche : ces énoncés s'écrivaient
 * avant comme des alertes en `quand: "default"`, que D21 proscrit. Les rendre avec le style d'une alerte
 * reproduirait à l'écran exactement le défaut que D24 corrige dans le contenu — un avertissement affiché
 * à tout le monde, qui dévalue par contagion les alertes réellement conditionnelles rendues juste en
 * dessous. D'où un traitement visuel délibérément NEUTRE (ni fond d'alerte, ni couleur de vigilance) :
 * c'est du cadre de lecture, pas un signal. Générique, comme tout le socle : aucun nœud ni domaine connu
 * par son nom (invariant CLAUDE.md 5).
 */
export function CadrageList({ cadrage }: CadrageListProps) {
  if (cadrage.length === 0) return null

  // REPLIÉ PAR DÉFAUT (2026-08-01, amélioration de lisibilité au fil de l'eau) : deux paragraphes denses
  // en tête d'écran, avant tout formulaire, poussaient le premier champ hors du premier écran visible.
  // `<details>` natif — même choix que le dépli d'argumentaire d'`OptionCard.tsx` (ouverture au clic,
  // état géré par le navigateur, accessibilité clavier/lecteur d'écran acquise sans code). Le contenu
  // reste TOUJOURS présent dans le DOM (replié ≠ absent) : rien n'est perdu, seule la mise en avant
  // change — même principe que le dépli du panneau « en attente » (B2, `lib/prioritesSaisie.ts`).
  //
  // ACCROCHE CHIFFRÉE (P12/S10, T-135, arbitrage référent du 2026-08-02, point 1) : un `<summary>`
  // générique ne donnait au praticien aucune raison d'ouvrir un bloc qu'il n'ouvre jamais — la recette du
  // 02/08 (N15) notait que la liste repliée était « exactement » ce qui le faisait hésiter, mais qu'il ne
  // savait pas qu'elle était là. Le compte est DÉRIVÉ de `cadrage.length` (jamais écrit en dur) : un
  // libellé qui annoncerait un nombre faux serait pire qu'un titre générique. Toujours ≥ 1 ici (le early
  // return ci-dessus élimine le cas vide, donc jamais de « 0 position »).
  const nombre = cadrage.length
  const libelle = `Ce que dit la preuve — ${nombre} position${nombre > 1 ? 's' : ''} de lecture`
  return (
    <details className="cadrage-list" aria-label={libelle}>
      <summary className="cadrage-list__summary">{libelle}</summary>
      {cadrage.map((enonce, index) => (
        <p className="cadrage-list__item" key={`${index}-${enonce.slice(0, 24)}`}>
          {enonce}
        </p>
      ))}
    </details>
  )
}
