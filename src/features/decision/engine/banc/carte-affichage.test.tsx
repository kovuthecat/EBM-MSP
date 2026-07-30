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
 *
 * AMENDEMENT SB3 (P6, 2026-07-28) — LES CONTRE-INDICATIONS NE SONT PLUS DANS CE PÉRIMÈTRE. Décision
 * référent (Thibault, même jour, tension avec T-025 explicitement tranchée) : elles rejoignent
 * délibérément le dépli, EN PREMIÈRE POSITION, compensées par le libellé du `<summary>` qui annonce
 * leur présence carte FERMÉE (`OptionCard.tsx`) — l'énoncé « le dépli n'avale jamais un fait de
 * sécurité » ne s'applique donc plus littéralement aux contre-indications : le dépli les porte
 * DÉLIBÉRÉMENT. Ce que ce test vérifie pour elles a changé de forme (§1 ci-dessous, dans la boucle) :
 * non plus « avant `<details>` », mais « toujours présentes, et toujours EN TÊTE du dépli, jamais
 * reléguées derrière l'effet attendu » — la garantie « jamais silencieusement absente » survit,
 * seule sa position de référence change. Les alertes d'option et les doses (§2-3), elles, restent
 * intégralement dans le socle, hors du dépli — I12 continue de les protéger sans changement.
 *
 * AMENDEMENT SB6 (P6, 2026-07-29) — LE COMPENSATEUR TEXTUEL DE SB3 NE SUFFISAIT PAS. La recette de
 * contrôle S6 (point 3) a rejoué le test des 20 secondes sur le libellé neutre laissé par SB3 et n'a
 * RIEN retenu (le `<summary>` fermé avait la même couleur bleu-lien qu'« en savoir plus », aucune
 * icône). §1b ci-dessous vérifie donc, en plus, que le rendu COMPLET (pas seulement `avantDepli`, la
 * carte fermée elle-même) porte l'icône ⚠ et le décompte exact quand des contre-indications existent —
 * et ne porte AUCUNE trace de ce registre d'alerte quand il n'y en a pas.
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

/** Rendus maximum par OPTION (et non par profil) — cf. le commentaire dans la boucle. Trois suffisent :
 * les profils successifs font varier ce que l'option porte réellement, et le défaut visé est le même sur
 * toutes ses cartes. */
const RENDUS_PAR_OPTION = 3

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
    const rendus = new Map<string, number>()

    for (const criteria of genererProfils(node, Math.min(PROFILS, tailleBanc(node)))) {
      const derives = calculerCriteresDerives(node.criteres_entree, criteria)
      const vue = construireVueDecision(node, derives)

      for (const famille of vue.familles) {
        for (const groupe of famille.groupes) {
          for (const optionVue of groupe) {
            optionsVues.add(optionVue.option.intitule)
            // COÛT — corrigé après incident. La première rédaction rendait CHAQUE carte de CHAQUE
            // profil : des milliers de `renderToStaticMarkup` par nœud, la suite complète passée de
            // 35 s à 535 s, et un worker Vitest tué en cours de route (« Worker exited unexpectedly »,
            // 3 tests silencieusement perdus). Un test qui fait tomber le banc ne protège rien.
            //
            // Ce qui est vérifié ici est STRUCTUREL — un bloc du socle passé dans le dépli est le même
            // pour toutes les cartes d'une option. Il suffit donc de rendre chaque option quelques fois,
            // le temps que les profils lui aient fait porter ses différents contenus (contre-indications,
            // alertes, doses), pas une fois par profil.
            const vues = rendus.get(optionVue.option.intitule) ?? 0
            if (vues >= RENDUS_PAR_OPTION) continue
            rendus.set(optionVue.option.intitule, vues + 1)
            const html = renderToStaticMarkup(
              <OptionCard
                option={optionVue.option}
                badge={optionVue.badge}
                reasons={optionVue.reasons}
                calculs={optionVue.calculs}
                calculsEnAttente={optionVue.calculsEnAttente}
                motifRang={optionVue.motifRang}
                alertes={optionVue.alertes}
                contreIndications={optionVue.contreIndications}
              />,
            )
            const avantDepli = socle(html)

            // (1) CONTRE-INDICATIONS — D21 : un fait de sécurité s'affiche avec son motif. AMENDEMENT
            // SB3 (voir docstring de tête) : la contre-indication vit désormais DANS le dépli, en
            // PREMIÈRE position — ce test ne cherche donc plus `avantDepli` pour elle, mais vérifie
            // qu'elle est (a) toujours présente dans le rendu complet, jamais absente en silence, et
            // (b) toujours EN TÊTE du dépli, avant l'effet attendu (`option-card__effet`), jamais
            // reléguée derrière lui.
            //
            // T-068 (P9, 2026-07-30) : la liste lue est désormais `optionVue.contreIndications`
            // (texte + état, `lib/vueDecision.ts`) et non plus le champ brut du contenu — qui accepte
            // depuis ce lot DEUX formes (chaîne / objet `{ texte, condition }`). L'exigence est
            // INCHANGÉE et vaut pour les TROIS états, y compris `levee` : une contre-indication
            // désamorcée est affichée en retrait, jamais retirée du rendu (c'est précisément ce que ce
            // test empêche de régresser — « désamorcée, pas effacée »).
            const indexEffet = html.indexOf('option-card__effet')
            for (const { texte } of optionVue.contreIndications) {
              // Un extrait suffit et évite les faux négatifs sur la ponctuation typographique.
              const extrait = echappe(texte.slice(0, 40))
              const indexCi = html.indexOf(extrait)
              if (indexCi === -1) {
                manquements.push(
                  `contre-indication absente du rendu — « ${optionVue.option.intitule} » : ${texte.slice(0, 60)}…`,
                )
              } else if (indexEffet !== -1 && indexCi > indexEffet) {
                manquements.push(
                  `contre-indication reléguée après l'effet attendu — « ${optionVue.option.intitule} » : ${texte.slice(0, 60)}…`,
                )
              }
            }

            // (1b) SB6 — le résumé fermé du dépli doit porter l'icône ⚠ et le décompte EXACT quand des
            // contre-indications existent (défaut GRAVE mesuré par S6, voir docstring de tête), et
            // n'afficher AUCUNE trace de ce registre d'alerte en leur absence (le libellé neutre reste
            // inchangé — carte non affectée).
            //
            // T-068 : le décompte annoncé ne porte que sur les contre-indications NON LEVÉES — celles
            // que le dépli montre effectivement dans le registre d'alerte. Une contre-indication levée
            // (`condition` fausse pour ce patient) est affichée en retrait et ne doit plus gonfler ce
            // chiffre ; l'écrire ici avec `.length` du champ brut ferait échouer le test le jour où une
            // contre-indication conditionnelle est encodée (S3-S6), alors que ce serait le comportement
            // ATTENDU.
            const nombreCi = optionVue.contreIndications.filter((ci) => ci.etat !== 'levee').length
            if (nombreCi > 0) {
              if (!html.includes('⚠')) {
                manquements.push(`résumé fermé sans icône d'alerte alors que des CI existent — « ${optionVue.option.intitule} »`)
              }
              if (!html.includes(`${nombreCi} contre-indication`)) {
                manquements.push(
                  `résumé fermé sans décompte exact (attendu ${nombreCi}) — « ${optionVue.option.intitule} »`,
                )
              }
            } else if (html.includes('⚠')) {
              manquements.push(`résumé fermé porte une icône d'alerte sans aucune CI — « ${optionVue.option.intitule} »`)
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
