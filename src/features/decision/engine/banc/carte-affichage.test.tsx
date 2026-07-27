/**
 * Banc d'un nœud — COUCHE 3 « invariants », lot **affichage**.
 *
 * I12 — **le dépli d'une carte n'avale jamais un fait de sécurité.**
 *
 * POURQUOI CET INVARIANT EXISTE, ET POURQUOI SUR LES NŒUDS RÉELS. Le 2026-07-27 au matin, un repli
 * d'affichage (« Autres pistes possibles (N) ») a caché la carte d'insuline d'initiation d'un patient
 * en état catabolique. Le repli a été neutralisé le jour même. A5 réintroduit un dépli — au niveau de
 * la CARTE cette fois, pas de la liste — et il serait absurde de refaire la même chose douze heures
 * plus tard sans garde-fou.
 *
 * C'est le DEUXIÈME invariant du dépôt à confronter le moteur à la couche d'affichage, après I11
 * (`banc/impasse.test.ts`). Le constat qui l'a motivé : sur 31 fichiers de test, 19 tournent sur les six
 * nœuds réels, mais parmi eux **un seul composant** (`CadrageList`). Les quatre défauts d'affichage de
 * la journée — primer allumé sans clic, doses non calculées muettes, compteur insoluble, état
 * inaudible — ont tous été trouvés par un humain devant l'écran, aucun par la suite de tests. Le
 * contenu a un banc ; l'écran n'en avait pas.
 *
 * MÉCANIQUE. Pour chaque nœud et chaque profil du banc, on rend la carte RÉELLE
 * (`renderToStaticMarkup(<OptionCard …>)`, alimentée par `construireVueDecision` — donc exactement ce
 * que `DecisionNodeScreen` affiche) et l'on découpe le HTML sur `<details>`. Tout ce que le socle doit
 * porter doit se trouver AVANT. Le test ne connaît ni nœud ni critère par son nom (D8) : il lit les
 * `contre_indications`, les alertes et les doses depuis le contenu chargé.
 */
import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { noeuds } from '../../content/loadNodes.ts'
import { OptionCard } from '../../components/OptionCard.tsx'
import { construireVueDecision } from '../../lib/vueDecision.ts'
import { calculerCriteresDerives } from '../deriveCritere.ts'
import { genererProfils, tailleBanc } from './profils.ts'

/** Nombre de profils par nœud, et délai associé — MESURÉS, pas devinés. Le rendu React SSR coûte trois
 * ordres de grandeur de plus qu'une évaluation du moteur : à 120 profils, `rhd-activite-physique` (qui
 * sort jusqu'à 10 cartes par profil) prenait 58 s et dépassait le délai par défaut de Vitest.
 *
 * 40 profils suffisent au but poursuivi : le défaut visé est STRUCTUREL (un bloc du socle passé dans le
 * dépli), donc identique pour toutes les cartes — il se voit dès la première. La largeur de
 * l'échantillon ne sert qu'à faire varier les contre-indications, alertes et doses réellement portées,
 * et le test vérifie lui-même en fin de parcours qu'il a bien rendu des cartes (sinon il serait
 * trivialement vert). */
const PROFILS = 40
const DELAI_MS = 120_000

/** Première moitié du HTML d'une carte : tout ce qui précède le dépli. Une carte sans dépli renvoie
 * tout son HTML (il n'y a rien à avaler). */
function socle(html: string): string {
  const index = html.indexOf('<details')
  return index === -1 ? html : html.slice(0, index)
}

/** Échappement HTML minimal, aligné sur ce que produit `renderToStaticMarkup`. */
function echappe(texte: string): string {
  return texte
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
}

describe('I12 — le dépli d’une carte n’avale jamais un fait de sécurité (moteur × affichage)', () => {
  it.each(noeuds.map((node) => [node.id, node] as const))(
    'nœud %s',
    (_id, node) => {
    const manquements: string[] = []
    const optionsVues = new Set<string>()

    for (const criteria of genererProfils(node, Math.min(PROFILS, tailleBanc(node)))) {
      const derives = calculerCriteresDerives(node.criteres_entree, criteria)
      const vue = construireVueDecision(node, derives)

      for (const famille of vue.familles) {
        for (const groupe of famille.groupes) {
          for (const optionVue of groupe) {
            optionsVues.add(optionVue.option.intitule)
            const html = renderToStaticMarkup(
              <OptionCard
                option={optionVue.option}
                badge={optionVue.badge}
                reasons={optionVue.reasons}
                calculs={optionVue.calculs}
                calculsEnAttente={optionVue.calculsEnAttente}
                motifRang={optionVue.motifRang}
                alertes={optionVue.alertes}
              />,
            )
            const avantDepli = socle(html)

            // (1) CONTRE-INDICATIONS — D21 : un fait de sécurité s'affiche avec son motif.
            for (const ci of optionVue.option.contre_indications ?? []) {
              // Un extrait suffit et évite les faux négatifs sur la ponctuation typographique.
              const extrait = echappe(ci.slice(0, 40))
              if (!avantDepli.includes(extrait)) {
                manquements.push(`contre-indication repliée — « ${optionVue.option.intitule} » : ${ci.slice(0, 60)}…`)
              }
            }

            // (2) ALERTES D'OPTION — même canal, même raison (D21).
            for (const alerte of optionVue.alertes) {
              const extrait = echappe(alerte.message.slice(0, 40))
              if (!avantDepli.includes(extrait)) {
                manquements.push(`alerte d'option repliée — « ${optionVue.option.intitule} »`)
              }
            }

            // (3) DOSES — calculées ET non calculées. La seconde est le défaut J, corrigé le matin même :
            // la replier le ferait revenir le jour de sa correction.
            for (const ligne of optionVue.calculsEnAttente) {
              if (!avantDepli.includes(echappe(ligne.libelle.slice(0, 30)))) {
                manquements.push(`« doses non calculées » repliée — « ${optionVue.option.intitule} »`)
              }
            }
            for (const ligne of optionVue.calculs) {
              if (!avantDepli.includes(echappe(ligne.libelle.slice(0, 30)))) {
                manquements.push(`dose calculée repliée — « ${optionVue.option.intitule} »`)
              }
            }

            // (4) LA JUSTIFICATION — « Proposé parce que » rend la carte auditable en consultation.
            if (!avantDepli.includes('Proposé parce que')) {
              manquements.push(`« Proposé parce que » replié — « ${optionVue.option.intitule} »`)
            }
          }
        }
      }
    }

    // Garde-fou du garde-fou : un test qui ne rend aucune carte serait vert pour rien.
      expect(optionsVues.size).toBeGreaterThan(0)
      expect([...new Set(manquements)]).toEqual([])
    },
    DELAI_MS,
  )
})
