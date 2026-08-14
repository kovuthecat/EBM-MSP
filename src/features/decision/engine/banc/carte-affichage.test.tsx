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
 * - `.option-card__panneau--posologie` — le geste et ses chiffres, ses modalités, les doses calculées,
 *   les doses EN ATTENTE (défaut J). Depuis le 2026-08-11, `option.apercu` n'y paraît QUE faute de
 *   `option.posologie_detail` — cf. le lot « I12 (posologie) » en fin de fichier ;
 * - `.option-card__panneau--ci` — contre-indications, TOUS états (actif/indéterminé/levé, T-068) ;
 * - `.option-card__panneau--preuves` — effet chiffré, délai, essais qui les portent (2026-08-04) ;
 * - `.option-card__panneau--argumentaire` — avantages/inconvénients.
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
import type { Option } from '../../content/node.types.ts'
import { OptionCard } from '../../components/OptionCard.tsx'
import type { OptionVue } from '../../lib/vueDecision.ts'
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
 * Découpe le HTML d'une carte en SIX zones : `avant` (le socle, jamais un panneau), puis les cinq
 * panneaux dans l'ordre du DOM (`pourquoi`, `posologie`, `ci`, `preuves`, `argumentaire` —
 * `OptionCard.tsx` les rend TOUJOURS, dans CET ordre, qu'ils aient ou non du contenu). Ni le nom du nœud
 * ni celui du critère n'y figurent (D8) : la fonction ne lit que la structure du HTML rendu.
 *
 * ⚠ LE DÉCOUPAGE EST POSITIONNEL, et c'est un piège avéré. L'ajout du panneau `--preuves` le 2026-08-04
 * a décalé d'un cran tout ce qui le suit : les destructurations écrites pour quatre panneaux ont continué
 * de PASSER en désignant, sous le nom `argumentaire`, le panneau `preuves` qui venait de prendre sa
 * place — et le vrai panneau `--argumentaire` n'était alors plus vérifié du tout. Un vert obtenu sans
 * rien garantir. `panneauNomme` ci-dessous ferme cette porte : on désigne un panneau par son MODIFICATEUR,
 * jamais par son rang. Toute destructuration positionnelle ajoutée ici rouvrirait le même piège.
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

/**
 * Le panneau portant CE modificateur (`pourquoi`, `posologie`, `ci`, `preuves`, `argumentaire`), désigné
 * par son nom et jamais par son rang — cf. l'avertissement de `zones` ci-dessus. Lève si le panneau est
 * absent : `OptionCard.tsx` les rend tous, toujours ; une absence est un défaut, pas un cas à ignorer.
 */
function panneauNomme(html: string, nom: string): string {
  const zone = zones(html).find((z) => z.startsWith(`${MARQUEUR_PANNEAU}${nom}`))
  if (zone === undefined) throw new Error(`panneau --${nom} absent du rendu de la carte`)
  return zone
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
            // Désignation PAR NOM, jamais par rang (cf. l'avertissement de `zones`) : les cinq panneaux
            // sont toujours rendus, mais leur ORDRE n'est pas un contrat de ce banc.
            const depliPourquoi = panneauNomme(html, 'pourquoi')
            const depliPosologie = panneauNomme(html, 'posologie')
            const depliCi = panneauNomme(html, 'ci')
            const depliPreuves = panneauNomme(html, 'preuves')
            const depliArgumentaire = panneauNomme(html, 'argumentaire')

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

            // (5) LES CINQ PANNEAUX SONT FERMÉS PAR DÉFAUT — nouveau (P11/S6) : aucun n'est ouvert au
            // premier rendu, condition nécessaire pour que la carte tienne sur une ligne.
            for (const [nom, zone] of [
              ['pourquoi', depliPourquoi],
              ['posologie', depliPosologie],
              ['ci', depliCi],
              ['preuves', depliPreuves],
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

/**
 * I12 (carte unique) — P12/S10, T-136. Le lot ci-dessus (§5) affirme que les cinq panneaux sont
 * fermés par défaut ; c'est vrai UNIQUEMENT sans la prop `carteUnique` (arbitrage référent du
 * 2026-08-02, point 4 — « quand un écran ne porte qu'une seule option, sa carte s'affiche ouverte »,
 * cf. `OptionCard.tsx` docstring de tête). Ce lot distingue ce second cas : SEUL `--preuves` s'ouvre par
 * défaut, les quatre autres restent fermés — c'est là, depuis le 2026-08-04, que vit l'argument EBM que
 * P11 avait mis derrière le chevron (`effet_attendu`, délai, essais). Il vivait jusque-là dans
 * `--argumentaire` : c'est le CONTENU qui a déménagé, l'intention de l'arbitrage est inchangée — ce qui
 * est rouvert d'office est la donnée EBM, pas un nom de panneau.
 *
 * Ce qui est testé ici est le comportement du COMPOSANT (une prop booléenne, cf. `OptionCard.tsx`), pas
 * un contenu particulier (D8) : une seule option réelle, prise au premier profil qui en produit une sur
 * le banc, suffit — inutile de reparcourir les 40 profils × 6 nœuds du lot ci-dessus pour ça.
 */
describe('I12 (carte unique) — le panneau --preuves s’ouvre par défaut quand la carte est seule sur son écran (P12/S10, T-136)', () => {
  function premiereOptionReelle(): OptionVue {
    for (const node of noeuds) {
      for (const criteria of genererProfils(node, Math.min(5, tailleBanc(node)))) {
        const derives = calculerCriteresDerives(node.criteres_entree, criteria)
        const vue = construireVueDecision(node, derives)
        for (const famille of vue.familles) {
          for (const groupe of famille.groupes) {
            if (groupe.length > 0) return groupe[0]
          }
        }
      }
    }
    throw new Error('aucune option trouvée sur le banc — I12 (carte unique) ne peut pas se monter')
  }

  const optionVue = premiereOptionReelle()

  function rendre(carteUnique: boolean) {
    return renderToStaticMarkup(
      <OptionCard
        option={optionVue.option}
        badge={optionVue.badge}
        reasons={optionVue.reasons}
        calculs={optionVue.calculs}
        calculsEnAttente={optionVue.calculsEnAttente}
        motifRang={optionVue.motifRang}
        alertes={optionVue.alertes}
        contreIndications={optionVue.contreIndications}
        carteUnique={carteUnique}
      />,
    )
  }

  const TOUS = ['pourquoi', 'posologie', 'ci', 'preuves', 'argumentaire'] as const

  it('sans `carteUnique` (défaut, comme tout appelant d’avant cette session) : les cinq panneaux restent fermés', () => {
    const html = rendre(false)
    for (const nom of TOUS) {
      expect(panneauFerme(panneauNomme(html, nom)), `panneau --${nom}`).toBe(true)
    }
  })

  it('avec `carteUnique={true}` : SEUL le panneau --preuves est ouvert par défaut, les quatre autres restent fermés', () => {
    const html = rendre(true)
    for (const nom of TOUS) {
      expect(panneauFerme(panneauNomme(html, nom)), `panneau --${nom}`).toBe(nom !== 'preuves')
    }
  })

  it('avec `carteUnique={true}`, l’argument EBM (`effet_attendu`) vit dans le panneau --preuves OUVERT — lisible sans clic', () => {
    const html = rendre(true)
    const extrait = optionVue.option.effet_attendu.slice(0, 40)
    const preuves = panneauNomme(html, 'preuves')
    expect(preuves).toContain(echappe(extrait))
    expect(panneauFerme(preuves)).toBe(false)
    // ET NULLE PART AILLEURS : c'est ce que la destructuration positionnelle ne prouvait plus après
    // l'insertion du panneau (cf. l'avertissement de `zones`). Sans cette seconde assertion, un
    // `effet_attendu` resté en double dans `--argumentaire` passerait inaperçu.
    expect(panneauNomme(html, 'argumentaire')).not.toContain(echappe(extrait))
  })

  /**
   * LE BADGE DE NIVEAU DE PREUVE EST LA COMMANDE DU PANNEAU (2026-08-04). Vérifié sur la STRUCTURE
   * (`aria-controls` pointe vers l'`id` du panneau `--preuves`) et non sur un clic : le rendu est
   * statique ici, et c'est de toute façon le lien ARIA — pas le gestionnaire d'événement — qui fait
   * qu'une *disclosure* est utilisable au clavier et par un lecteur d'écran.
   */
  it('le badge de niveau de preuve commande le panneau --preuves (aria-controls vers son id)', () => {
    const html = rendre(false)
    const bouton = /<button[^>]*class="option-card__preuves-toggle"[^>]*>/.exec(html)?.[0]
    expect(bouton, 'aucun bouton .option-card__preuves-toggle dans la rangée').toBeTruthy()
    const cible = /aria-controls="([^"]+)"/.exec(bouton!)?.[1]
    expect(cible, 'le bouton du badge ne déclare aucun aria-controls').toBeTruthy()
    // Sur le HTML ENTIER, pas sur la zone : `zones` découpe AU marqueur, qui est à l'intérieur de
    // l'attribut `class` — l'`id` du panneau, écrit juste avant, tombe donc à la fin de la zone
    // PRÉCÉDENTE. C'est une propriété du découpage, pas un défaut du rendu.
    expect(html).toContain(`id="${cible}" class="option-card__panneau option-card__panneau--preuves"`)
  })
})

/**
 * I12 (posologie) — **le panneau posologie ne redit jamais deux fois la même chose, et ne se vide
 * jamais** (R2, 2026-08-11).
 *
 * POURQUOI CE LOT EXISTE. `option.apercu` a été créé par T-076 (P9/S9) pour le titre du `<summary>`
 * REPLIÉ ; P11/S6 a supprimé ce `<summary>` le 2026-08-01. Il n'en restait qu'une première ligne du
 * panneau ouvert, redondante avec `posologie_detail[0]` dès que ce champ (2026-08-04) est renseigné : sur
 * le nœud `insuline`, « Titrer la basale » affichait « +2 U si la glycémie à jeun reste haute 3 matins de
 * suite… » puis, immédiatement dessous, la même consigne en plus précis et sourcée. `OptionCard.tsx` ne
 * rend donc plus l'aperçu QUE faute de détail.
 *
 * ET POURQUOI SUR LE CONTENU RÉEL, comme tout ce fichier. Le correctif est CONDITIONNEL parce que la
 * répartition du contenu l'impose, et cette répartition est contre-intuitive : au 2026-08-11, 16 options
 * portent les deux champs, mais **20 portent `apercu` SANS `posologie_detail`** (13 sur `prescription`,
 * 6 sur `rhd-activite-physique`, 1 sur `insuline`) — l'aperçu y est TOUT le contenu de posologie du
 * panneau. Un rendu supprimé sans condition les aurait vidées, et aucun test sur une option synthétique
 * ne l'aurait montré. C'est exactement le registre de défaut que ce fichier existe pour attraper.
 *
 * TOUTES LES OPTIONS, PAS UN ÉCHANTILLON PAR PROFILS — à la différence du lot §1 ci-dessus. Ce qui est
 * vérifié ne dépend d'aucun critère patient (c'est une règle de rendu sur deux champs de contenu), et la
 * population à couvrir est justement le contenu ENTIER : un tirage par profils laisserait au hasard le
 * soin de croiser les deux cas. 87 rendus, une fois — négligeable devant les 40 profils × 6 nœuds du §1.
 */
describe('I12 (posologie) — l’aperçu ne double jamais le détail, et ne disparaît jamais là où il est seul', () => {
  const toutesLesOptions = noeuds.flatMap((node) => node.options.map((option) => [node.id, option] as const))

  /**
   * Rendu MINIMAL — la carte, sans rien du patient. Le panneau `--posologie` ne lit que `option.apercu`,
   * `option.posologie_detail` et les doses passées en props : `calculs`/`calculsEnAttente` vides isolent
   * exactement les deux champs de contenu que ce lot vérifie.
   */
  function rendreOptionNue(option: Option): string {
    return renderToStaticMarkup(
      <OptionCard
        option={option}
        badge={null}
        reasons={['toujours']}
        calculs={[]}
        calculsEnAttente={[]}
        motifRang={undefined}
        alertes={[]}
      />,
    )
  }

  const aDuDetail = (option: Option) => (option.posologie_detail?.length ?? 0) > 0
  const avecLesDeux = toutesLesOptions.filter(([, option]) => Boolean(option.apercu) && aDuDetail(option))
  const apercuSeul = toutesLesOptions.filter(([, option]) => Boolean(option.apercu) && !aDuDetail(option))

  it('le contenu porte bien LES DEUX cas de figure — sans quoi les deux tests suivants seraient verts sans rien prouver', () => {
    expect(avecLesDeux.length, 'aucune option ne porte apercu + posologie_detail').toBeGreaterThan(0)
    expect(apercuSeul.length, 'aucune option ne porte apercu seul').toBeGreaterThan(0)
  })

  it('`apercu` ET `posologie_detail` : l’aperçu n’est PAS rendu dans le panneau — c’est le défaut de redondance visé', () => {
    const manquements: string[] = []
    for (const [idNoeud, option] of avecLesDeux) {
      // `option.apercu` est non vide par construction du filtre ; TypeScript ne le déduit pas d'un
      // `filter` sans prédicat de type, d'où cette relecture locale plutôt qu'un `!`.
      const apercu = option.apercu
      if (!apercu) continue
      if (panneauNomme(rendreOptionNue(option), 'posologie').includes(echappe(apercu))) {
        manquements.push(`aperçu dupliqué dans --posologie — ${idNoeud} / « ${option.intitule} »`)
      }
    }
    expect(manquements).toEqual([])
  })

  it('`apercu` SEUL : il reste rendu dans le panneau --posologie — c’est là tout le contenu de posologie de ces 20 options', () => {
    const manquements: string[] = []
    for (const [idNoeud, option] of apercuSeul) {
      const apercu = option.apercu
      if (!apercu) continue
      if (!panneauNomme(rendreOptionNue(option), 'posologie').includes(echappe(apercu))) {
        manquements.push(`aperçu perdu — ${idNoeud} / « ${option.intitule} »`)
      }
    }
    expect(manquements).toEqual([])
  })

  /**
   * LA RÉGRESSION REDOUTÉE, dite en une phrase et vérifiée sur les 87 options : une option qui DÉCLARE
   * une posologie doit toujours en afficher une. C'est le test qui aurait attrapé une suppression
   * inconditionnelle du rendu d'`apercu`.
   *
   * NOMBRE ATTENDU DE BLOCS « GESTE », REVU LE 2026-08-14 (`ItemPosologie.accent`) : la règle historique
   * (`index === 0`, un seul bloc) ne tient QUE pour les options sans item `accent` explicite — le cas de
   * TOUTES les options avant cette date, encore le cas de la quasi-totalité aujourd'hui. Une option à
   * PLUSIEURS molécules alternatives peut désormais en déclarer plusieurs (ex. « AR GLP‑1 ») ; l'attendu
   * suit alors le nombre d'items `accent: true`, pas une constante.
   */
  it('toute option déclarant une posologie (aperçu ou détail) rend le nombre attendu de blocs « geste » dans son panneau', () => {
    const manquements: string[] = []
    for (const [idNoeud, option] of toutesLesOptions) {
      if (!option.apercu && !aDuDetail(option)) continue
      const items = option.posologie_detail ?? []
      const accentues = items.filter((item) => typeof item !== 'string' && item.accent === true).length
      const attendu = accentues > 0 ? accentues : 1
      const gestes = panneauNomme(rendreOptionNue(option), 'posologie').match(/option-card__posologie-geste/g) ?? []
      if (gestes.length !== attendu) {
        manquements.push(
          `${gestes.length} bloc(s) « geste » au lieu de ${attendu} — ${idNoeud} / « ${option.intitule} »`,
        )
      }
    }
    expect(manquements).toEqual([])
  })

  /**
   * DÉFAUT PRÉEXISTANT, corrigé le 2026-08-11 — indépendant de R2 mais du même mécanisme. Un panneau
   * rempli ne sert à rien si rien ne l'ouvre : la garde `aDuContenuPosologie` (`OptionCard.tsx`)
   * n'interrogeait pas `posologie_detail`, de sorte qu'une option ne portant QUE ce champ n'obtenait
   * aucune pastille. Vérifié en conditions réelles ci-dessous parce que le corpus contient exactement un
   * cas de cette forme — « Envisager l'insuline » (`prescription.yaml`) — et qu'aucun test sur option
   * synthétique n'aurait signalé qu'il existait.
   *
   * C'est la contrepartie exacte du reste de ce fichier : le §1 vérifie qu'un texte n'est pas AVALÉ par
   * un panneau replié, celui-ci qu'un panneau rempli reste OUVRABLE.
   */
  it('toute option déclarant une posologie porte une pastille « Posologie » qui commande SON panneau (aria-controls)', () => {
    const manquements: string[] = []
    for (const [idNoeud, option] of toutesLesOptions) {
      if (!option.apercu && !aDuDetail(option)) continue
      const html = rendreOptionNue(option)
      const bouton = /<button[^>]*aria-label="Posologie"[^>]*>/.exec(html)?.[0]
      if (!bouton) {
        manquements.push(`panneau --posologie rempli mais AUCUNE pastille pour l’ouvrir — ${idNoeud} / « ${option.intitule} »`)
        continue
      }
      const cible = /aria-controls="([^"]+)"/.exec(bouton)?.[1]
      if (!cible || !html.includes(`id="${cible}" class="option-card__panneau option-card__panneau--posologie"`)) {
        manquements.push(`la pastille posologie ne pointe pas vers le panneau --posologie — ${idNoeud} / « ${option.intitule} »`)
      }
    }
    expect(manquements).toEqual([])
  })
})
