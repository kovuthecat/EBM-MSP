/**
 * Banc d'un nœud — COUCHE 3 « invariants », lot **moteur × formulaire**.
 *
 * I11 — **une option en attente ne réclame jamais un champ que le formulaire ne montre pas.**
 *
 * CE QUE CET INVARIANT A DE PARTICULIER, ET POURQUOI IL A SON PROPRE FICHIER. Tous les invariants
 * antérieurs vivent d'un seul côté de la frontière : I1→I5 et 1→7 (`invariants.test.ts`) interrogent le
 * MOTEUR seul ; I6→I10 (`invariants-contenu.test.ts`) lisent le CONTENU seul, sans jamais importer le
 * moteur — c'est même une contrainte explicite de leur docstring. S7 (`coherence-inter-noeuds.test.ts`)
 * a été le premier à regarder deux nœuds à la fois. Celui-ci est le premier à confronter **ce que le
 * moteur réclame** à **ce que la couche d'affichage rend** (`lib/formLayout.ts` `champsVisibles`) : il
 * échoue si les deux divergent, quel que soit celui des deux qui a tort.
 *
 * LE DÉFAUT QUI L'A FAIT ÉCRIRE (recette visuelle du 2026-07-27, écart 2 — moitié résiduelle du défaut
 * G). Sur `prescription`, un patient à DFG 45 sous metformine ayant répondu « pas d'intolérance » et
 * n'ayant pas saisi sa dose voyait :
 *
 *     EN ATTENTE — Réduire la posologie de la metformine
 *        à renseigner : Dose metformine, Nature de l'intolérance
 *
 * — or « Nature de l'intolérance » est masqué derrière `visible_si: "intolerance_traitement == true"`,
 * donc absent de l'écran. **Une demande sans issue.** Le lot 1 avait pourtant traité le défaut G : il
 * avait corrigé l'ÉVALUATION (garde R8 ajouté au contenu) sans voir que le NOMMAGE des critères
 * manquants, lui, lisait l'expression entière en ignorant les termes déjà faux. Un correctif d'un seul
 * côté d'une frontière que rien ne vérifiait — d'où ce fichier.
 *
 * MÉCANIQUE. Pour chaque nœud, sur des profils PARTIELLEMENT renseignés (`genererProfilsPartiels`, mêmes
 * graines que la caractérisation), on évalue le nœud puis on demande au formulaire quels champs il
 * afficherait pour ce même état. Tout critère réclamé et non affiché est une impasse. Le message
 * d'échec nomme le nœud, l'option, le critère et le `visible_si` fautif — c'est ce qui rend le test
 * réparable sans enquête.
 *
 * Générique (CLAUDE.md invariant 5 / D8) : aucun id de nœud ni nom de critère codé en dur.
 */
import { describe, expect, it } from 'vitest'
import { noeuds } from '../../content/loadNodes.ts'
import { champsVisibles } from '../../lib/formLayout.ts'
import { calculerCriteresDerives } from '../deriveCritere.ts'
import { evaluateNode } from '../evaluateNode.ts'
import { genererProfilsPartiels } from './profils.ts'

/** Profils partiels par nœud. Au-delà, le temps de banc croît sans rien ajouter : la mesure du
 * 2026-07-27 trouvait les 20 occurrences du seul défaut connu dès les 400 premiers profils. */
const PROFILS_PAR_NOEUD = 400

interface Impasse {
  option: string
  critere: string
  visibleSi: string | undefined
}

describe('I11 — une option en attente ne réclame jamais un champ invisible (moteur × formulaire)', () => {
  it.each(noeuds.map((node) => [node.id, node] as const))('nœud %s', (_id, node) => {
    const gardes = new Map(node.criteres_entree.map((c) => [c.nom, c.visible_si]))
    const impasses: Impasse[] = []

    for (const profil of genererProfilsPartiels(node, PROFILS_PAR_NOEUD)) {
      const derives = calculerCriteresDerives(node.criteres_entree, profil.criteria)
      const { enAttente } = evaluateNode(node, derives, profil.renseignes)
      if (enAttente.size === 0) continue
      // Même appel, mêmes arguments que `screens/DecisionNodeScreen.tsx` : c'est bien l'écran réel qu'on
      // interroge, pas une reconstitution de ce qu'il ferait.
      const visibles = champsVisibles(node.criteres_entree, derives, profil.renseignes)
      for (const [option, manquants] of enAttente) {
        for (const critere of manquants) {
          if (visibles.has(critere)) continue
          impasses.push({ option: option.intitule, critere, visibleSi: gardes.get(critere) })
        }
      }
    }

    // Dédoublonné : le même couple (option, critère) revient sur des dizaines de profils, et la liste
    // brute noierait le diagnostic. Le NOMBRE de profils touchés n'ajoute rien — une seule impasse est
    // déjà une impasse.
    const uniques = [...new Map(impasses.map((i) => [`${i.option}§${i.critere}`, i])).values()]
    expect(
      uniques.map((i) => `« ${i.critere} » réclamé par « ${i.option} » — masqué par : ${i.visibleSi ?? '(aucun visible_si)'}`),
    ).toEqual([])
  })
})
