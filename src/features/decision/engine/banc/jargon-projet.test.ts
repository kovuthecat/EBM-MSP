/**
 * Banc — COUCHE 3 « invariants », I25 — LE JARGON DE PROJET NE S'AFFICHE JAMAIS AU PRATICIEN.
 *
 * POURQUOI CET INVARIANT EXISTE. Signalé le 30/07, partiellement corrigé (« → nœud E », « VÉRIFIÉ par le
 * référent » ont disparu), TOUJOURS présent le 02/08 (recette navigateur, chevron « Argumentaire complet ») :
 * « 6ᵉ série, collecte + red-team adversarial », « ÉTAT DES TROIS RÉSIDUELS au 2026-07-27 », et la consigne
 * au rédacteur « Bénéfice propre sur critère dur de preuve faible (ne pas afficher « bénéfice CV prouvé ») »
 * — une note de méthode interne à l'équipe, laissée dans un champ que l'écran affiche tel quel. C'est la
 * TROISIÈME passe consécutive qui relève ce défaut (30/07, une passe intermédiaire, 02/08) : un nettoyage
 * ponctuel ne suffit pas, il faut un garde-fou qui échoue tant qu'une trace en reste et qui empêche la
 * quatrième.
 *
 * CE QUE C'EST — ET CE QUE ÇA N'EST PAS. Le contenu YAML est plein de commentaires `#` qui documentent le
 * PROCESS (numéro de lot/série de red-team, dates d'arbitrage référent, chantiers, PMID vérifiés…) : ils
 * ne sont JAMAIS un défaut, parce qu'un commentaire YAML n'est JAMAIS chargé par `loadNodes.ts`/
 * `loadModules.ts` ni affiché où que ce soit — c'est la mémoire de chantier du dépôt, elle a sa place. Le
 * défaut ne commence QUE quand la même prose de méthode migre dans un CHAMP DE VALEUR — une chaîne que
 * `noeuds`/`modules` charge réellement et qu'un composant React rend à l'écran.
 *
 * PORTÉE — TOUT CE QUI EST AFFICHÉ, pas seulement les `*.argumentaire.md` (la 3ᵉ passe n'avait balayé
 * qu'eux) : `titre`, `population_cible`, `cadrage`, `alertes[].message`, `incertitudes`, les colonnes
 * `sources.*` de l'écran « Reco officielle vs position critique » (`ArgumentPanel.tsx`), et, par option,
 * `intitule`, `avantages`, `inconvenients`, `effet_attendu`, `delai_benefice`, `apercu`,
 * `contre_indications`, `motifs`, `alertes[].message` — la liste exacte que rend `OptionCard.tsx`/
 * `ArgumentPanel.tsx`, croisée avec `content/node.types.ts`. PLUS les fichiers `*.argumentaire.md`,
 * l'argumentaire exhaustif (niveau de lecture 3, `MiniMarkdown`) : rendus À 100 % tels quels, sans aucun
 * tri de section — une phrase de méthode n'importe où dans ce fichier s'affiche.
 *
 * CE QUI N'EST PAS DANS CETTE PORTÉE, et pourquoi. `meta`/`changelog` (jamais rendu, vérifié dans
 * `ArgumentPanel.tsx` — aucune trace de `.changelog` ni `.meta.` côté affichage) ; les commentaires `#`
 * (jamais chargés, cf. ci-dessus) ; `Noeud.argumentaire` (le champ COURT, requis par le schéma mais que
 * `ArgumentPanel.tsx` ne lit nulle part — seul `argumentaire_exhaustif` l'est, vérifié par recherche).
 *
 * LES MARQUEURS — calibrés sur les 4 défauts RÉELLEMENT relevés en recette (cf. citation ci-dessus), pas
 * une liste au jugé. Chacun a été vérifié à la main contre le corpus affiché réel avant d'entrer ici, pour
 * la même raison que I9 restreint ses tournures : un marqueur qui produit du bruit dévalue le rouge pour
 * tous les marqueurs suivants (cf. `invariants-contenu.test.ts`, commentaire d'I9). Notamment :
 *   - `\d+\s*[eEᵉ]\s*(série|lot)\b` (jamais `/série/` ni `/lot/` seuls) : une « série de 40 patients »
 *     (Munshi, taille d'échantillon) ou un « hors-série n° 1 » (référence bibliographique SFD) sont des
 *     usages cliniques/bibliographiques légitimes du mot — seule la forme ORDINALE « 6ᵉ série », « 4e lot »
 *     désigne une itération de chantier ;
 *   - `collecte` : MESURÉ, pas supposé — une première exécution sans restriction a trouvé 3 faux positifs
 *     RÉELS, tous de la même forme : « ce nœud ne collecte pas/que/aucun… » (`cible-glycemique`,
 *     `rhd-alimentation`), le verbe « collecter » employé pour dire ce qu'un nœud NE demande PAS comme
 *     critère — un usage fonctionnel légitime, sans rapport avec l'étape « collecte » de la veille
 *     documentaire (`docs/veille/SOP.md`). Les trois s'écrivent tous « ne collecte » (négation immédiate) ;
 *     le sens PROJET, lui, s'écrit toujours en nom (« la collecte », « cette collecte », « deux collectes »,
 *     « après collecte », « post-collecte ») ou en verbe NON négativement adjacent (« la collecte
 *     attribuait… », « une collecte affirmait… »). Le marqueur exclut donc spécifiquement la forme verbale
 *     négative directe (lookbehind `(?<!ne )`), la seule forme clinique constatée ;
 *   - `ne pas afficher` : une INSTRUCTION AU RÉDACTEUR ne peut, par construction, être un fait clinique —
 *     un praticien ne lit jamais une consigne de rédaction sur *lui-même*.
 *
 * DETTE — VOLONTAIREMENT AUCUNE. Contrairement à I6/I7/I9 (qui protègent un contenu déjà validé
 * cliniquement, où une correction peut attendre un arbitrage référent), une trace de jargon de projet n'a
 * JAMAIS de justification clinique à attendre : c'est un défaut de FORME pur, toujours corrigible sans
 * toucher une seule `condition`. Une entrée de dette ici serait la case vide que ce fichier existe
 * justement pour empêcher de rouvrir.
 */
import { describe, expect, it } from 'vitest'
import { getArgumentaireExhaustif } from '../../content/loadArgumentaires.ts'
import { modules } from '../../content/loadModules.ts'
import { noeuds } from '../../content/loadNodes.ts'
import type { ModuleDecision } from '../../content/module.types.ts'
import type { ContreIndication, Noeud, Option } from '../../content/node.types.ts'

/** Un fragment de texte AFFICHÉ, avec un chemin lisible pour un message d'échec exploitable. */
interface Fragment {
  chemin: string
  texte: string
}

function texteContreIndication(ci: string | ContreIndication): string {
  return typeof ci === 'string' ? ci : ci.texte
}

/** Tout ce que `OptionCard.tsx`/`ArgumentPanel.tsx` rendent d'UNE option (cf. `node.types.ts` pour le
 * détail champ par champ — `role`/`action`/`conditions`/`prerequis`/`exclusions`/`priorite`/`famille`/
 * `references`/`niveau_preuve`/`calculs` sont des jetons TECHNIQUES ou des valeurs contrôlées (DSL, enum,
 * nombre) que le praticien ne lit jamais comme PROSE — hors périmètre par construction, pas par oubli). */
function fragmentsOption(option: Option, prefixe: string): Fragment[] {
  const fragments: Fragment[] = [{ chemin: `${prefixe}.intitule`, texte: option.intitule }]
  option.avantages.forEach((texte, i) => fragments.push({ chemin: `${prefixe}.avantages[${i}]`, texte }))
  option.inconvenients.forEach((texte, i) => fragments.push({ chemin: `${prefixe}.inconvenients[${i}]`, texte }))
  fragments.push({ chemin: `${prefixe}.effet_attendu`, texte: option.effet_attendu })
  if (option.delai_benefice) fragments.push({ chemin: `${prefixe}.delai_benefice`, texte: option.delai_benefice })
  if (option.apercu) fragments.push({ chemin: `${prefixe}.apercu`, texte: option.apercu })
  for (const [i, ci] of (option.contre_indications ?? []).entries()) {
    fragments.push({ chemin: `${prefixe}.contre_indications[${i}]`, texte: texteContreIndication(ci) })
  }
  for (const [cle, texte] of Object.entries(option.motifs ?? {})) {
    fragments.push({ chemin: `${prefixe}.motifs["${cle.slice(0, 40)}"]`, texte })
  }
  for (const [i, alerte] of (option.alertes ?? []).entries()) {
    fragments.push({ chemin: `${prefixe}.alertes[${i}].message`, texte: alerte.message })
  }
  return fragments
}

/** Tout ce que `DecisionNodeScreen.tsx`/`ArgumentPanel.tsx`/`CadrageList.tsx` rendent d'UN nœud. */
function fragmentsNoeud(node: Noeud): Fragment[] {
  const fragments: Fragment[] = [
    { chemin: 'titre', texte: node.titre },
    { chemin: 'population_cible', texte: node.population_cible },
  ]
  ;(node.cadrage ?? []).forEach((texte, i) => fragments.push({ chemin: `cadrage[${i}]`, texte }))
  ;(node.alertes ?? []).forEach((alerte, i) =>
    fragments.push({ chemin: `alertes[${i}].message`, texte: alerte.message }),
  )
  node.incertitudes.forEach((texte, i) => fragments.push({ chemin: `incertitudes[${i}]`, texte }))
  if (node.sources.reco_officielle.source) {
    fragments.push({ chemin: 'sources.reco_officielle.source', texte: node.sources.reco_officielle.source })
  }
  if (node.sources.reco_officielle.position) {
    fragments.push({ chemin: 'sources.reco_officielle.position', texte: node.sources.reco_officielle.position })
  }
  if (node.sources.reco_officielle.explication) {
    fragments.push({ chemin: 'sources.reco_officielle.explication', texte: node.sources.reco_officielle.explication })
  }
  if (node.sources.synthese_critique.donnee) {
    fragments.push({ chemin: 'sources.synthese_critique.donnee', texte: node.sources.synthese_critique.donnee })
  }
  ;(node.sources.synthese_critique.references ?? []).forEach((reference, i) =>
    fragments.push({ chemin: `sources.synthese_critique.references[${i}].nom`, texte: reference.nom }),
  )
  ;(node.sources.references_primaires ?? []).forEach((reference, i) =>
    fragments.push({ chemin: `sources.references_primaires[${i}].titre`, texte: reference.titre }),
  )
  ;(node.contraintes ?? []).forEach((contrainte, i) =>
    fragments.push({ chemin: `contraintes[${i}].message`, texte: contrainte.message }),
  )
  node.options.forEach((option, i) => fragments.push(...fragmentsOption(option, `options[${i}]`)))
  return fragments
}

/** Tout ce que `DecisionModuleScreen.tsx` rend d'UN module. */
function fragmentsModule(module: ModuleDecision): Fragment[] {
  const fragments: Fragment[] = [{ chemin: 'titre', texte: module.titre }]
  if (module.population_cible) fragments.push({ chemin: 'population_cible', texte: module.population_cible })
  module.cadrage.forEach((texte, i) => fragments.push({ chemin: `cadrage[${i}]`, texte }))
  fragments.push({ chemin: 'primer.question', texte: module.primer.question })
  module.primer.orientations.forEach((orientation, i) => {
    fragments.push({ chemin: `primer.orientations[${i}].libelle`, texte: orientation.libelle })
    ;(orientation.indices ?? []).forEach((texte, j) =>
      fragments.push({ chemin: `primer.orientations[${i}].indices[${j}]`, texte }),
    )
  })
  return fragments
}

// ---------------------------------------------------------------------------------------------------
// MARQUEURS — cf. docstring de tête pour la calibration de chacun.
// ---------------------------------------------------------------------------------------------------
const MARQUEURS_JARGON: { motif: RegExp; nom: string }[] = [
  { motif: /red[-\s]?team/i, nom: 'red-team' },
  { motif: /\d+\s*[eEᵉ]\s*(?:série|lot)\b/iu, nom: 'Nᵉ série / Nᵉ lot' },
  { motif: /RÉSIDUELS?\b/, nom: 'RÉSIDUEL(S)' },
  { motif: /ne pas afficher/i, nom: 'ne pas afficher' },
  { motif: /(?<!ne )\bcollectes?\b/i, nom: 'collecte' },
  { motif: /VÉRIFIÉ par le référent/i, nom: 'VÉRIFIÉ par le référent' },
  { motif: /→\s*nœud\s+[A-Z]\b/u, nom: '→ nœud <lettre>' },
  { motif: /\badversarial\b/i, nom: 'adversarial' },
  { motif: /\bchantier\b/i, nom: 'chantier' },
]

/** Fragments qui contiennent AU MOINS UN marqueur — chaque violation nomme le marqueur ET la chaîne. */
function violationsDeFragments(fragments: Fragment[], origine: string): string[] {
  const violations: string[] = []
  for (const { chemin, texte } of fragments) {
    for (const { motif, nom } of MARQUEURS_JARGON) {
      if (motif.test(texte)) {
        const aPlat = texte.replace(/\s+/g, ' ').trim()
        const extrait = aPlat.length > 140 ? `${aPlat.slice(0, 140)}…` : aPlat
        violations.push(`${origine} :: ${chemin} :: marqueur "${nom}" :: "${extrait}"`)
      }
    }
  }
  return violations
}

describe('I25 — aucun jargon de projet dans un champ affiché au praticien', () => {
  it.each(noeuds.map((node) => [node.id, node] as const))(
    'nœud %s — aucun champ de contenu affiché ne porte un marqueur de jargon de projet',
    (_id, node) => {
      const violations = violationsDeFragments(fragmentsNoeud(node), `nœud "${node.id}"`)
      expect(violations).toEqual([])
    },
  )

  it.each(modules.map((module) => [module.id, module] as const))(
    'module %s — aucun champ de contenu affiché ne porte un marqueur de jargon de projet',
    (_id, module) => {
      const violations = violationsDeFragments(fragmentsModule(module), `module "${module.id}"`)
      expect(violations).toEqual([])
    },
  )

  /**
   * ARGUMENTAIRE EXHAUSTIF — rendu À 100 % tel quel par `MiniMarkdown` derrière le chevron « Argumentaire
   * exhaustif » (niveau de lecture 3, D11) : AUCUNE section n'est filtrée avant affichage, donc AUCUNE
   * section du fichier `.md` n'est hors de portée pour cet invariant, contrairement à un champ YAML
   * structuré où seuls certains champs sont rendus. C'est le lot cité par la mission comme concentrant le
   * plus de traces (`insuline.argumentaire.md`).
   */
  it.each(
    noeuds
      .filter((node) => node.argumentaire_exhaustif)
      .map((node) => [node.id, node] as const),
  )('nœud %s — son argumentaire exhaustif ne porte aucun marqueur de jargon de projet', (_id, node) => {
    const markdown = getArgumentaireExhaustif(node.argumentaire_exhaustif)
    expect(markdown, `argumentaire_exhaustif="${node.argumentaire_exhaustif}" introuvable`).toBeTruthy()
    const violations = violationsDeFragments(
      [{ chemin: node.argumentaire_exhaustif!, texte: markdown! }],
      `nœud "${node.id}"`,
    )
    // Un fichier entier peut porter PLUSIEURS occurrences du même marqueur : signaler chacune plutôt que
    // dédupliquer, pour que le message d'échec serve directement de liste de correction — la fonction
    // `violationsDeFragments` traite déjà tout le texte du fichier comme UN SEUL fragment, un `.match`
    // global donne donc le compte réel de correspondances plutôt qu'un simple booléen.
    const occurrences = MARQUEURS_JARGON.flatMap(({ motif, nom }) => {
      const global = new RegExp(motif.source, motif.flags.includes('g') ? motif.flags : `${motif.flags}g`)
      return [...markdown!.matchAll(global)].map((m) => `${nom} :: "${m[0]}" (position ${m.index})`)
    })
    expect(violations.length === 0 ? [] : occurrences, `occurrences détaillées dans ${node.argumentaire_exhaustif}`).toEqual([])
  })
})
