/**
 * Banc d'un nœud — COUCHE 3 « invariants », lot **discernabilité**.
 *
 * I13 — **tout drapeau booléen saisissable change quelque chose à l'écran.**
 *
 * CE QUE R5 NE DIT PAS. La règle R5 (`docs/decision/GRAMMAIRE-NOEUD.md`, « un critère doit agir ») est
 * vérifiée par `couverture.test.ts` : chaque critère saisissable est cité quelque part et sa citation se
 * déclenche au moins une fois. C'est une propriété du TEXTE du contenu. Elle est satisfaite par un
 * critère qui n'alimente qu'un dérivé en `OU` avec trois autres — et alors, dès que l'un des quatre est
 * vrai, les trois autres ne changent plus rien, ni carte, ni alerte.
 *
 * CE QUE CET INVARIANT EXIGE DE PLUS. Non pas « le critère est cité » mais « le critère est
 * DISCERNABLE » : il existe deux patients identiques à ce seul drapeau près dont l'écran diffère —
 * cartes proposées, alertes affichées, ou options écartées. C'est la généralisation de R5 du texte vers
 * l'effet, et elle attrape le drapeau réellement inerte, celui dont AUCUN patient ne verrait la
 * différence.
 *
 * ⚠ CE QU'IL N'ATTRAPE PAS, ET IL FAUT LE DIRE ICI PLUTÔT QUE DE LAISSER CROIRE LE CONTRAIRE. Cet
 * invariant a été écrit pour la classe K8 de la recette navigateur du 2026-07-27 — quatre drapeaux de
 * sécurité de `rhd-activite-physique` alimentant le dérivé `verrou_effort` en OU, dont deux sans aucun
 * canal propre. Il les trouve VERTS, et à juste titre : sur un profil où les trois autres drapeaux sont
 * faux, les retourner change bel et bien l'écran. La première rédaction de ce fichier les avait
 * déclarés en dette ; c'est le contrôle de dette PÉRIMÉE (assertion 2 ci-dessous) qui a signalé
 * l'erreur, en refusant une dette que le test ne constatait pas.
 *
 * La propriété qui manquait n'était donc pas « ce drapeau agit » mais « ce drapeau a une voix qui LUI
 * est propre » — et elle se lit dans le contenu seul, sans profil ni tirage : c'est **I14**
 * (`banc/invariants-contenu.test.ts`), qui exige qu'un drapeau soit cité ailleurs que dans le `derive`
 * d'un autre critère. Les deux invariants sont complémentaires et aucun ne remplace l'autre.
 *
 * COMPARAISON APPARIÉE, et c'est l'instrument imposé. `genererPairesBooleennes` produit, pour un même
 * patient, les deux versions du drapeau toutes choses égales par ailleurs, dérivés recompilés. C'est le
 * même instrument que la mesure du sur-blocage `fragilite` (`mesure-surblocage-fragilite.md`), dont la
 * leçon consignée dans `CONSTRUIRE-UN-MODULE.md` est que mesurer un ÉTAT au lieu d'un EFFET gonfle ou
 * masque le constat. Un comptage brut de profils ne dirait rien ici.
 *
 * AUCUNE DÉCLARATION NOUVELLE. Le rapport de recette proposait de marquer les critères `securite: true`
 * pour restreindre l'invariant aux drapeaux de sécurité. Ce n'est pas nécessaire, et l'éviter a deux
 * mérites : la propriété vaut pour TOUS les booléens (un critère qu'on saisit sans effet est un défaut
 * quel que soit son objet), et aucun impôt n'est prélevé sur les domaines futurs, qui devraient sinon
 * classer chacun de leurs critères. On ne peut tester que ce que le contenu déclare — ici, il ne
 * déclare rien de plus, et il n'en a pas besoin.
 *
 * PORTÉE : `bool` saisissables uniquement. `nombre` et `enum` demanderaient un balayage de valeurs (pas
 * une paire), et `liste` une combinatoire. Limite assumée : c'est la classe où le défaut a été observé,
 * et celle que le dépôt sait apparier.
 */
import { describe, expect, it } from 'vitest'
import { noeuds } from '../../content/loadNodes.ts'
import { signatureVue } from '../../lib/vueDecision.ts'
import { construireVueDecision } from '../../lib/vueDecision.ts'
import { genererPairesBooleennes } from './profils.ts'

/** Paires par critère. Mesuré : 200 suffisent à discerner tous les drapeaux qui le sont réellement sur
 * les six nœuds — les indiscernables le restent à 2 000, parce qu'ils le sont par construction. */
const PAIRES = 200
const DELAI_MS = 120_000

/**
 * DETTE DÉCLARÉE — drapeaux dont on SAIT qu'ils ne changent rien à l'écran, en attente d'une décision
 * clinique du référent. Chaque entrée porte la question posée, pas seulement le constat.
 *
 * Le test échoue AUSSI quand une entrée devient inutile (le drapeau est redevenu discernable) : la dette
 * s'éteint d'elle-même et ne peut pas se fossiliser — même mécanique que `CRITERES_DIVERGENTS_CONNUS`
 * dans `coherence-inter-noeuds.test.ts`.
 */
const DRAPEAUX_INDISCERNABLES_CONNUS: Record<string, Record<string, string>> = {}

describe('I13 — tout drapeau booléen saisissable est DISCERNABLE à l’écran (généralisation de R5)', () => {
  it.each(noeuds.map((node) => [node.id, node] as const))(
    'nœud %s',
    (id, node) => {
      const connus = DRAPEAUX_INDISCERNABLES_CONNUS[id] ?? {}
      const indiscernables: string[] = []

      const drapeaux = node.criteres_entree.filter((critere) => critere.type === 'bool' && critere.derive == null)
      for (const drapeau of drapeaux) {
        const paires = genererPairesBooleennes(node, PAIRES, drapeau.nom)
        // Discernable dès qu'UNE paire produit deux écrans différents. `signatureVue` sérialise la
        // TOTALITÉ du modèle de vue (familles, badges, raisons, doses, alertes, écartées, non retenues,
        // en attente) : un drapeau qui ne changerait qu'une alerte compte donc comme discernable, ce qui
        // est bien l'intention — le rapport de recette demandait « une conduite OU une alerte ».
        const discernable = paires.some(
          (paire) =>
            signatureVue(construireVueDecision(node, paire.aVrai)) !==
            signatureVue(construireVueDecision(node, paire.aFaux)),
        )
        if (!discernable) indiscernables.push(drapeau.nom)
      }

      // 1. Aucun drapeau indiscernable NON déclaré.
      expect(indiscernables.filter((nom) => connus[nom] == null)).toEqual([])

      // 2. Aucune dette PÉRIMÉE : une entrée qui ne correspond plus à rien doit être retirée, sinon elle
      //    fossilise un constat qui n'est plus vrai et masquerait une régression future.
      expect(Object.keys(connus).filter((nom) => !indiscernables.includes(nom))).toEqual([])
    },
    DELAI_MS,
  )
})
