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
 * AMENDEMENT SB3 (P6, 2026-07-28), DEUX REVERTS LE 2026-08-01 — ÉTAT ACTUEL : DEUX DÉPLIS SÉPARÉS. SB3
 * avait déplacé les contre-indications dans UN dépli partagé avec l'argumentaire (compensé par le
 * libellé du `<summary>`, puis par une icône dédiée après SB6). Un premier correctif du 2026-08-01
 * (matin) les avait ressorties dans une zone TOUJOURS visible du socle, mesurant que le dépli partagé
 * mélangeait trois registres de lecture. Rendu au référent, un second passage LE MÊME JOUR a demandé
 * autre chose : la sécurité ne doit pas rester une bannière permanente du socle — elle retourne
 * derrière SON PROPRE dépli, SÉPARÉ de celui de l'argumentaire, replié par défaut, mais dont le
 * `<summary>` fermé porte le signal rouge dès qu'une contre-indication n'est pas écartée (D20/T-068).
 *
 * CE QUE §1 VÉRIFIE MAINTENANT : les contre-indications (TOUS états, actives ET levées) sont toujours
 * présentes dans le rendu, et TOUJOURS situées dans le PREMIER `<details>` (le dépli sécurité — il est
 * toujours rendu en premier quand il existe, cf. `OptionCard.tsx`), jamais dans le socle, jamais dans le
 * second `<details>` (l'argumentaire). Le helper `segments()` ci-dessous découpe le HTML aux frontières
 * des `<details>` successifs pour distinguer les trois zones.
 *
 * « PROPOSÉ PARCE QUE » ET « CE RANG TIENT COMPTE DE » REJOIGNENT LE DÉPLI ARGUMENTAIRE depuis le
 * 2026-08-01 (décision référent explicite, confirmée au second passage) : ils poussaient l'action vers
 * le bas alors qu'ils se lisent une fois par option. §4 vérifie qu'ils sont dans le dépli ARGUMENTAIRE
 * (le dernier), jamais dans le socle ni dans le dépli sécurité.
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

/** Première partie du HTML d'une carte : tout ce qui précède le premier `<details>`. Une carte sans
 * aucun dépli renvoie tout son HTML (il n'y a rien à avaler). */
function socle(html: string): string {
  const index = html.indexOf('<details')
  return index === -1 ? html : html.slice(0, index)
}

/**
 * Découpe le HTML d'une carte en (au plus) TROIS zones, aux frontières des `<details>` successifs :
 * `avant` (le socle, jamais un dépli), puis un dépli par `<details>` rencontré, dans l'ordre du DOM.
 * `OptionCard.tsx` rend AU PLUS deux `<details>` — sécurité (seulement si l'option porte au moins une
 * contre-indication, tous états confondus) puis argumentaire (toujours présent) — donc `zones.length`
 * vaut 2 (juste l'argumentaire) ou 3 (sécurité + argumentaire) selon le cas. Ni le nom du nœud ni celui
 * du critère n'y figurent (D8) : la fonction ne lit que la structure du HTML rendu.
 */
function zones(html: string): string[] {
  const indices: number[] = []
  let i = html.indexOf('<details')
  while (i !== -1) {
    indices.push(i)
    i = html.indexOf('<details', i + 1)
  }
  const bornes = [0, ...indices, html.length]
  const decoupes: string[] = []
  for (let k = 0; k < bornes.length - 1; k++) {
    decoupes.push(html.slice(bornes[k], bornes[k + 1]))
  }
  return decoupes
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
            // Zones du HTML rendu : [avant, sécurité?, argumentaire] ou [avant, argumentaire] selon que
            // l'option porte au moins une contre-indication (cf. docstring de `zones()`).
            const decoupes = zones(html)
            const depliArgumentaire = decoupes[decoupes.length - 1]
            const depliSecurite = optionVue.contreIndications.length > 0 ? decoupes[1] : ''

            // (1) CONTRE-INDICATIONS, TOUS ÉTATS — D21 : un fait de sécurité s'affiche avec son motif.
            // SECOND PASSAGE DU 2026-08-01 (voir docstring de tête) : actives, indéterminées ET levées
            // vivent TOUTES dans le dépli SÉCURITÉ, jamais dans le socle, jamais dans l'argumentaire.
            for (const { texte } of optionVue.contreIndications) {
              // Un extrait suffit et évite les faux négatifs sur la ponctuation typographique.
              const extrait = echappe(texte.slice(0, 40))
              if (!html.includes(extrait)) {
                manquements.push(
                  `contre-indication absente du rendu — « ${optionVue.option.intitule} » : ${texte.slice(0, 60)}…`,
                )
              } else if (!depliSecurite.includes(extrait)) {
                manquements.push(
                  `contre-indication hors du dépli sécurité — « ${optionVue.option.intitule} » : ${texte.slice(0, 60)}…`,
                )
              }
            }

            // (1b) SB6, RESTAURÉ le 2026-08-01 (second passage) — le `<summary>` FERMÉ du dépli sécurité
            // doit porter l'icône ⚠ et le décompte EXACT quand des contre-indications actives/
            // indéterminées existent, et n'afficher AUCUNE trace de ce registre d'alerte en leur absence
            // (une carte qui ne porte QUE des CI levées garde un dépli sécurité neutre, cf.
            // `OptionCard.test.tsx`).
            //
            // Le décompte ne porte que sur les contre-indications NON LEVÉES — celles que le dépli
            // sécurité montre effectivement en registre d'alerte. Une contre-indication levée (`condition`
            // fausse pour ce patient) ne doit plus gonfler ce chiffre.
            const nombreCi = optionVue.contreIndications.filter((ci) => ci.etat !== 'levee').length
            if (nombreCi > 0) {
              if (!depliSecurite.includes('⚠')) {
                manquements.push(`dépli sécurité sans icône d'alerte alors que des CI existent — « ${optionVue.option.intitule} »`)
              }
              if (!depliSecurite.includes(`${nombreCi} contre-indication`)) {
                manquements.push(
                  `dépli sécurité sans décompte exact (attendu ${nombreCi}) — « ${optionVue.option.intitule} »`,
                )
              }
            } else if (depliSecurite.includes('⚠')) {
              manquements.push(`dépli sécurité porte une icône d'alerte sans aucune CI active — « ${optionVue.option.intitule} »`)
            }

            // (2) ALERTES D'OPTION — même canal, même raison (D21). Restent dans le SOCLE, inchangé
            // depuis A5 : elles ne se déplient jamais, quel que soit le passage sur les contre-
            // indications.
            for (const alerte of optionVue.alertes) {
              const extrait = echappe(alerte.message.slice(0, 40))
              if (!avantDepli.includes(extrait)) {
                manquements.push(`alerte d'option repliée — « ${optionVue.option.intitule} »`)
              }
            }

            // (3) DOSES — calculées ET non calculées. La seconde est le défaut J, corrigé le matin même :
            // la replier le ferait revenir le jour de sa correction. Restent dans le SOCLE, inchangé.
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
            // Vit dans le dépli ARGUMENTAIRE (le dernier `<details>`) depuis le 2026-08-01 (décision
            // référent explicite, confirmée au second passage) : jamais dans le socle, jamais dans le
            // dépli sécurité.
            if (!html.includes('Proposé parce que')) {
              manquements.push(`« Proposé parce que » absente du rendu — « ${optionVue.option.intitule} »`)
            } else if (!depliArgumentaire.includes('Proposé parce que')) {
              manquements.push(
                `« Proposé parce que » hors du dépli argumentaire — « ${optionVue.option.intitule} »`,
              )
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
