/**
 * Banc d'un nœud — COUCHE 3 « invariants », lot **affichage**.
 *
 * I12 — **un panneau replié d'une carte n'avale jamais un fait de sécurité.**
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
 * que `DecisionNodeScreen` affiche) et l'on découpe le HTML sur les quatre panneaux
 * `.option-card__panneau--*`. Le test ne connaît ni nœud ni critère par son nom (D8) : il lit les
 * `contre_indications`, les alertes et les doses depuis le contenu chargé.
 *
 * REFONDU le 2026-08-01 par P11/S6 (T-111, « carte en une ligne, tout au clic ») — TROISIÈME évolution
 * de la structure de la carte après SB3 (P6, un dépli partagé) et le double revirement du 2026-08-01
 * matin (dépli sécurité toujours visible, puis dépli sécurité propre et séparé de l'argumentaire —
 * cf. l'historique complet dans `OptionCard.tsx`). L'arbitrage référent du même jour (question 3) fait
 * tomber l'acquis « posologie toujours visible » : les DEUX `<details>` d'hier deviennent QUATRE
 * panneaux `hidden`, TOUJOURS RENDUS dans le DOM (jamais en montage conditionnel — c'est précisément ce
 * qui permet à CE test de continuer à localiser un texte fermé via `renderToStaticMarkup`), ouverts un
 * par un par des `PastilleInfo` (P11/S3) dans la rangée :
 *
 * - `.option-card__panneau--pourquoi` — « Proposé parce que » et « Ce rang tient compte de » ;
 * - `.option-card__panneau--posologie` — `option.apercu`, doses calculées, doses EN ATTENTE (défaut J) ;
 * - `.option-card__panneau--ci` — contre-indications, TOUS états (actif/indéterminé/levé, T-068) ;
 * - `.option-card__panneau--argumentaire` — effet attendu, délai, avantages/inconvénients.
 *
 * CE QUE §1 VÉRIFIE MAINTENANT : les contre-indications (TOUS états) sont toujours présentes dans le
 * rendu, et TOUJOURS situées dans `.option-card__panneau--ci` — jamais dans le socle (badges + rangée +
 * `AlertList`), jamais dans un autre panneau. Le helper `zones()` ci-dessous découpe le HTML aux
 * frontières des quatre panneaux (toujours quatre désormais, qu'il y ait ou non une contre-indication —
 * c'est la différence structurelle majeure avec l'ancienne version de ce test, où le dépli sécurité
 * n'existait que conditionnellement).
 *
 * §6 EST NOUVEAU : le ton (`PastilleInfo`) remplace l'ex-icône ⚠ comme signal de sécurité fermé —
 * `.option-card__rangee` doit porter une pastille de ton `danger` si et seulement si une contre-
 * indication n'est pas levée.
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

/**
 * Marqueur commun aux quatre panneaux (`OptionCard.tsx` : chaque panneau porte la classe de base
 * `option-card__panneau` PUIS son modificateur `--pourquoi`/`--posologie`/`--ci`/`--argumentaire`) —
 * unique dans le HTML rendu, aucun autre élément de la carte ne porte ce préfixe de classe.
 *
 * VOLONTAIREMENT sans le `<div class="` qui le précède dans le JSX : React rend l'attribut `id` AVANT
 * `class` sur ces `<div>` (ordre des props dans `OptionCard.tsx`), donc `<div id="…" class="option-card
 * __panneau…`. Ancrer le marqueur sur `class="` supposerait un ordre d'attributs qui n'est pas garanti
 * — chercher directement le nom de classe, où qu'il tombe dans la balise, ne dépend d'aucun ordre.
 */
const MARQUEUR_PANNEAU = 'option-card__panneau--'

/** Première partie du HTML d'une carte : tout ce qui précède le premier panneau (badges, rangée,
 * `AlertList`) — jamais un panneau. Une carte sans aucun panneau rendu (ne devrait plus arriver depuis
 * P11/S6, les quatre sont toujours rendus) renverrait tout son HTML, par défense symétrique de l'ancien
 * comportement. */
function socle(html: string): string {
  const index = html.indexOf(MARQUEUR_PANNEAU)
  return index === -1 ? html : html.slice(0, index)
}

/**
 * Découpe le HTML d'une carte en CINQ zones : `avant` (le socle, jamais un panneau), puis les quatre
 * panneaux dans l'ordre du DOM (`pourquoi`, `posologie`, `ci`, `argumentaire` — `OptionCard.tsx` les
 * rend TOUJOURS, dans CET ordre, qu'ils aient ou non du contenu). Ni le nom du nœud ni celui du critère
 * n'y figurent (D8) : la fonction ne lit que la structure du HTML rendu.
 */
function zones(html: string): string[] {
  const indices: number[] = []
  let i = html.indexOf(MARQUEUR_PANNEAU)
  while (i !== -1) {
    indices.push(i)
    i = html.indexOf(MARQUEUR_PANNEAU, i + 1)
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

/**
 * Un panneau FERMÉ au rendu statique porte-t-il l'attribut `hidden` ? `zoneHtml` commence AU MILIEU de
 * l'attribut `class` du `<div>` du panneau (`zones()` coupe au marqueur, pas au début de la balise) —
 * il suffit de chercher `hidden` avant la première fermeture `>` de balise rencontrée, qui est
 * nécessairement celle de CE `<div>` (aucun attribut de ce panneau ne contient `>`).
 */
function panneauFerme(zoneHtml: string): boolean {
  const finBalise = zoneHtml.indexOf('>')
  return finBalise !== -1 && zoneHtml.slice(0, finBalise).includes('hidden')
}

describe('I12 — un panneau replié d’une carte n’avale jamais un fait de sécurité (moteur × affichage)', () => {
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
            // Ce qui est vérifié ici est STRUCTUREL — un bloc du socle passé dans un panneau est le même
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
            const avant = socle(html)
            // [avant, pourquoi, posologie, ci, argumentaire] — toujours 5 zones (P11/S6 : les quatre
            // panneaux sont toujours rendus, cf. docstring de tête).
            const [, depliPourquoi, depliPosologie, depliCi, depliArgumentaire] = zones(html)

            // (1) CONTRE-INDICATIONS, TOUS ÉTATS — D21 : un fait de sécurité s'affiche avec son motif.
            // P11/S6 : actives, indéterminées ET levées vivent TOUTES dans le panneau `--ci`, jamais
            // dans le socle, jamais dans un autre panneau.
            for (const { texte } of optionVue.contreIndications) {
              // Un extrait suffit et évite les faux négatifs sur la ponctuation typographique.
              const extrait = echappe(texte.slice(0, 40))
              if (!html.includes(extrait)) {
                manquements.push(
                  `contre-indication absente du rendu — « ${optionVue.option.intitule} » : ${texte.slice(0, 60)}…`,
                )
              } else if (!depliCi.includes(extrait)) {
                manquements.push(
                  `contre-indication hors du panneau --ci — « ${optionVue.option.intitule} » : ${texte.slice(0, 60)}…`,
                )
              }
            }

            // (2) ALERTES D'OPTION — même canal, même raison (D21). Restent HORS de tout panneau,
            // inchangé depuis A5 : elles ne se replient jamais, quel que soit l'état des contre-
            // indications.
            for (const alerte of optionVue.alertes) {
              const extrait = echappe(alerte.message.slice(0, 40))
              if (!avant.includes(extrait)) {
                manquements.push(`alerte d'option repliée — « ${optionVue.option.intitule} »`)
              }
            }

            // (3) DOSES — calculées ET non calculées. NOUVEAU CONTRAT P11/S6 : les deux vivent désormais
            // dans le panneau `--posologie` (elles étaient dans le socle avant P11 — c'est exactement
            // l'acquis que l'arbitrage référent du 2026-08-01 fait tomber, cf. docstring de tête
            // `OptionCard.tsx`). La seconde est le défaut J, corrigé le 2026-07-27 : la replier sans
            // signal la ferait revenir — §6 ci-dessous vérifie que le ton `attention` prend le relais.
            for (const ligne of optionVue.calculsEnAttente) {
              if (!depliPosologie.includes(echappe(ligne.libelle.slice(0, 30)))) {
                manquements.push(`« doses non calculées » hors du panneau --posologie — « ${optionVue.option.intitule} »`)
              }
            }
            for (const ligne of optionVue.calculs) {
              if (!depliPosologie.includes(echappe(ligne.libelle.slice(0, 30)))) {
                manquements.push(`dose calculée hors du panneau --posologie — « ${optionVue.option.intitule} »`)
              }
            }

            // (4) LA JUSTIFICATION — « Proposé parce que » rend la carte auditable en consultation.
            // Vit dans le panneau `--pourquoi` (P11/S6) : jamais dans le socle, jamais dans un autre
            // panneau.
            if (!html.includes('Proposé parce que')) {
              manquements.push(`« Proposé parce que » absente du rendu — « ${optionVue.option.intitule} »`)
            } else if (!depliPourquoi.includes('Proposé parce que')) {
              manquements.push(
                `« Proposé parce que » hors du panneau --pourquoi — « ${optionVue.option.intitule} »`,
              )
            }

            // (5) LES QUATRE PANNEAUX SONT FERMÉS PAR DÉFAUT — nouveau (P11/S6) : aucun n'est ouvert au
            // premier rendu, condition nécessaire pour que la carte tienne sur une ligne.
            for (const [nom, zone] of [
              ['pourquoi', depliPourquoi],
              ['posologie', depliPosologie],
              ['ci', depliCi],
              ['argumentaire', depliArgumentaire],
            ] as const) {
              if (!panneauFerme(zone)) {
                manquements.push(`panneau --${nom} pas fermé par défaut (hidden manquant) — « ${optionVue.option.intitule} »`)
              }
            }

            // (6) LE TON PORTE LE SIGNAL DE SÉCURITÉ — nouveau (P11/S6), remplace les anciennes
            // assertions littérales sur `'⚠'` : quand au moins une contre-indication n'est PAS levée, la
            // rangée contient une pastille de ton `danger` ; sinon aucune.
            const nombreCiNonLevee = optionVue.contreIndications.filter((ci) => ci.etat !== 'levee').length
            const rangeeDangerPresente = avant.includes('pastille-info--danger')
            if (nombreCiNonLevee > 0 && !rangeeDangerPresente) {
              manquements.push(`pastille de ton danger absente alors que des CI actives existent — « ${optionVue.option.intitule} »`)
            } else if (nombreCiNonLevee === 0 && rangeeDangerPresente) {
              manquements.push(`pastille de ton danger présente sans aucune CI active — « ${optionVue.option.intitule} »`)
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
