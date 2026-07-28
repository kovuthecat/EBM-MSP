/**
 * Banc d'un nœud — COUCHE 3 « invariants » — I22 et I23 (P4/S2, T-021, 2026-07-28).
 *
 * MOTIVATION COMMUNE (D-03, `docs/decision/validation/recette-navigateur-2026-07-28.md`) : un patient en
 * prévention secondaire (ASCVD établie) avec une intolérance avérée à la statine n'obtenait STRICTEMENT
 * RIEN — zéro carte — parce qu'une option `role: geste` plus tôt dans l'ordre `ordered-first-match`
 * (« Discuter la statine ») était INDÉTERMINÉE (deux critères non renseignés) et HALTAIT tout le
 * parcours (D20) avant d'atteindre la carte terminale de sécurité qui le couvrait pourtant déjà
 * (« Statine indisponible… alternatives hypolipémiantes », `role: securite`). T-020 (`engine/
 * evaluateNode.ts`, `evaluateOrderedFirstMatch`) corrige le MOTEUR : une halte n'arrête plus l'évaluation
 * des options `role: securite` restantes. Ce fichier VÉRIFIE mécaniquement, sur tout le contenu publié,
 * qu'aucun autre nœud/option ne reproduit ce défaut — et qu'aucun nœud ne peut, plus généralement,
 * afficher un écran totalement muet.
 *
 * POURQUOI UNE HALTE NE SE REPRODUIT JAMAIS SOUS INFORMATION COMPLÈTE (et pourquoi ces deux invariants
 * DOIVENT tester de l'information PARTIELLE pour avoir un pouvoir de détection réel). `evaluateNode`
 * accepte un `renseignes` optionnel ; ABSENT (ou égal à TOUS les critères saisissables), aucune expression
 * ternaire ne renvoie jamais `INDETERMINE` (docstring de tête d'`evaluateNode.ts`) — une halte OFM ne peut
 * donc SURVENIR qu'avec un `renseignes` PARTIEL (un sous-ensemble strict). Un invariant qui ne testerait
 * que l'information complète ne verrait donc jamais ce défaut, ni avant T-020 ni après — il faut EXERCER
 * le chemin ternaire pour que « la carte de sécurité reste atteignable malgré une halte » veuille dire
 * quelque chose. D'où le balayage « un seul critère masqué à la fois » ci-dessous (même mécanique qu'I3,
 * `banc/invariants.test.ts`), plutôt qu'un simple test sur `genererProfils` sans `renseignes` — cf. aussi
 * le commentaire en tête du bloc I22 : une simple existentielle (« au moins un profil où l'option
 * matche ») s'est avérée insuffisante sur le contenu réel, exactement parce que l'information complète
 * suffit déjà, seule, à rendre certaines options de sécurité atteignables — sans jamais exercer la halte.
 *
 * GÉNÉRIQUE (CLAUDE.md invariant 5 / DECISIONS.md D8) : aucun id de nœud ni nom de critère codé en dur —
 * un futur domaine obtient les deux invariants sans modification de ce fichier.
 */
import { describe, expect, it } from 'vitest'
import { noeuds } from '../../content/loadNodes.ts'
import type { Noeud } from '../../content/node.types.ts'
import type { Criteria } from '../conditions.ts'
import { evaluateNode } from '../evaluateNode.ts'
import { genererProfils, tailleBanc } from './profils.ts'

/**
 * Même délai que `banc/invariants.test.ts` (`DELAI_BANC_MS`) — non dupliqué à dessein léger : ce fichier
 * balaie, pour certains nœuds, `profils × critères indéterminables` (jusqu'au produit cartésien complet
 * sur un petit nœud comme `statine`, cf. `regimeDeBanc`/`profils.ts`), un ordre de grandeur au-dessus d'un
 * simple parcours de `profils`. Le délai vitest par défaut (5 000 ms) serait insuffisant sur `statine`
 * seul (~47 000 profils × 9 critères pour I22 quand ce nœud est `ordered-first-match` avec des options
 * `role: securite`) ; les autres nœuds du domaine n'ont pas cette combinaison (aucun n'est à la fois
 * `ordered-first-match` ET porteur de `role: securite`, sauf `statine`) et restent bornés à `tailleBanc`.
 */
const DELAI_BANC_MS = 120_000

/** Critères saisissables d'un nœud dont l'omission PEUT réellement produire une indétermination (même
 * filtre qu'I3, `banc/invariants.test.ts` : `nombre`/`enum` toujours, `bool`/`liste` seulement sans
 * `presomption_non`, D30). Un critère hors de cette liste ne change jamais rien à masquer seul. */
function criteresIndeterminables(node: Noeud) {
  return node.criteres_entree.filter(
    (c) => c.derive == null && (c.type === 'nombre' || c.type === 'enum' || c.presomption_non !== true),
  )
}

/** Tous les noms de critères SAISISSABLES d'un nœud (renseignes « tout est renseigné », repli D20). */
function tousLesNoms(node: Noeud): Set<string> {
  return new Set(node.criteres_entree.filter((c) => c.derive == null).map((c) => c.nom))
}

// =======================================================================================================
// I22 — aucune option `role: securite` d'un nœud publié n'est rendue INATTEIGNABLE par l'ordre du nœud.
//
// FORMULATION RETENUE, et pourquoi une simple « au moins un profil où l'option est applicable » ne
// suffisait PAS : sur `statine`, la carte terminale « Statine indisponible… » a une condition large
// (`intolerance_statine == averee OR …`) qui la rend de toute façon APPLICABLE sur une foule de profils
// PLEINEMENT renseignés, halte ou pas — le défaut D-03 ne portait pas sur son atteignabilité EN GÉNÉRAL,
// mais sur des profils PARTIELS PRÉCIS où une option antérieure indéterminée la rendait, elle,
// invisible. Un test « existe-t-il un profil où elle matche » aurait donc été VERT avant ET après T-020
// (vérifié empiriquement en rejouant le banc complet sous l'ancien moteur) — inapte à protéger contre une
// régression sur ce point précis. La propriété qui protège réellement est plus stricte, et directement
// lisible sur le contrat du moteur : quand AUCUNE option n'est retenue (`applicable` vide), CHAQUE option
// `role: securite` du nœud doit avoir été CLASSÉE quelque part (`excluded`, `nonRetenues` ou `enAttente`)
// — jamais absente des trois à la fois, ce qui ne peut arriver que si l'ordre l'a fait sauter sans
// l'évaluer (exactement ce que l'ancienne halte immédiate faisait). Vérifiée « mordante » (étape 5,
// T-021) : en remettant temporairement le `return` immédiat de l'étape 2 de T-020, cette même assertion
// échoue sur `statine`, exactement sur la carte terminale et sur « Interrompre… classe indisponible ».
// =======================================================================================================
describe.each(noeuds.map((node) => [node.id, node] as const))(
  'banc — I22 (D25, D32/T-020) — sécurité jamais rendue inatteignable par l’ordre OFM · nœud %s',
  (_id, node) => {
    const optionsSecurite = node.options.filter((o) => o.role === 'securite')
    // Seul un nœud `ordered-first-match` peut hériter du défaut D-03 (une halte n'existe pas en
    // `multi-options`, où chaque option est évaluée indépendamment) ; un nœud sans option `role: securite`
    // n'a rien à vérifier ici.
    const concerne = node.selection === 'ordered-first-match' && optionsSecurite.length > 0
    const testeur = concerne ? it : it.skip

    testeur(
      'quand `applicable` est vide, chaque option `role: securite` a été CLASSÉE (jamais absente des ' +
        'trois registres à la fois — signe qu’une halte antérieure l’a fait sauter sans l’évaluer)',
      () => {
        // Balayage « un seul critère masqué à la fois » (même mécanique qu'I3, `banc/invariants.test.ts`) :
        // sur un nœud `ordered-first-match` PETIT comme `statine` (produit cartésien ≤
        // `PLAFOND_ENUMERATION_EXHAUSTIVE`, cf. `profils.ts`), `genererProfils` renvoie le produit
        // cartésien COMPLET des critères énumérables — balayer les combinaisons des critères NON masqués
        // est alors une GARANTIE, pas une probabilité, de rencontrer toute combinaison susceptible de
        // rendre une autre option indéterminée pendant qu'une option de sécurité reste, elle, à classer.
        const profils = genererProfils(node, tailleBanc(node))
        const criteres = criteresIndeterminables(node)
        const noms = tousLesNoms(node)

        const violations: string[] = []
        for (const critere of criteres) {
          const renseignes = new Set([...noms].filter((n) => n !== critere.nom))
          profils.forEach((profil, i) => {
            const resultat = evaluateNode(node, profil, renseignes)
            if (resultat.applicable.length > 0) return // une option a matché (elle-même ou une antérieure) : rien à vérifier ici
            for (const option of optionsSecurite) {
              const classee =
                resultat.excluded.has(option) || resultat.nonRetenues.has(option) || resultat.enAttente.has(option)
              if (classee) continue
              // « L'option qui provoque la halte devant elle » (consigne T-021 étape 2) : les options DÉJÀ
              // classées `enAttente` dans ce même résultat sont, par construction, celles rencontrées AVANT
              // que le parcours ne s'arrête de considérer les options ordinaires — donc les candidates les
              // plus probables à avoir provoqué le saut.
              const haltesAnterieures = [...resultat.enAttente.keys()].map((o) => o.intitule)
              violations.push(
                `nœud "${node.id}" :: critère masqué "${critere.nom}" :: profil #${i} :: option de sécurité ` +
                  `"${option.intitule}" absente des trois registres (ni écartée, ni non retenue, ni en ` +
                  `attente) alors qu'aucune option n'est retenue — rendue inatteignable par l'ordre ` +
                  (haltesAnterieures.length > 0
                    ? `(halte(s) observée(s) devant elle : ${haltesAnterieures.join(' ; ')})`
                    : `(aucune halte observée dans ce résultat — à examiner directement)`),
              )
            }
          })
          if (violations.length > 0) break // un cas suffit à documenter le défaut ; pas la peine d'énumérer tout le banc
        }
        expect(violations).toEqual([])
      },
      DELAI_BANC_MS,
    )
  },
)

// =======================================================================================================
// I23 — aucun écran muet : jamais `applicable` vide ET `enAttente` vide EN MÊME TEMPS.
// =======================================================================================================
//
// FORME GÉNÉRALE du défaut dont I22 n'est qu'UNE cause (celle de D-03 : une halte OFM qui masque une
// sécurité). Un écran qui ne propose RIEN et n'attend RIEN n'a rien à montrer au praticien — ni un
// résultat, ni même la raison de son silence (cf. I21, `banc/vierge.test.ts`, qui vérifie la contrepartie
// symétrique sur le seul profil VIERGE : « applicable vide » DOIT s'accompagner d'un « enAttente » non
// vide). I23 généralise cette même propriété à TOUT profil PARTIELLEMENT renseigné du banc, sur TOUS les
// nœuds publiés (`multi-options` ET `ordered-first-match`) : la garantie ne doit pas dépendre du mécanisme
// interne qui la produit.
//
// NUANCE DE VÉRIFICATION (étape 5, T-021), consignée honnêtement plutôt que masquée (invariant 6) : en
// remettant temporairement le `return` immédiat de l'ancienne halte (annule T-020 étape 2), I22 échoue
// bien sur `statine` (vérifié) — mais CETTE assertion-ci (I23), sur ce même nœud, RESTE VERTE. Raison,
// vérifiée par la trace du moteur : le repli terminal de `statine` (`["default"]`) ne porte NI `prerequis`
// NI `exclusions` (commentaire du fichier YAML : « ce repli est protégé par la seule POSITION de l'option
// terminale devant lui ») — `classerOption` le déclare donc TOUJOURS applicable dès qu'il est atteint,
// haltes ou pas, ce qui maintient `applicable` non vide et empêche structurellement le cas « les deux
// vides » sur ce nœud précis, indépendamment de l'ancienne ou de la nouvelle halte. I23 reste une
// propriété générique utile (elle mordrait sur un nœud OFM SANS repli, ou dont le repli porte lui-même un
// garde-fou faux) ; ce n'est simplement pas CE nœud-ci qui la fait mordre. I22, ciblée spécifiquement sur
// l'atteignabilité d'une option `role: securite`, reste la garde-fou qui protège réellement contre une
// régression de T-020.
describe.each(noeuds.map((node) => [node.id, node] as const))(
  'banc — I23 (D20/D32) — aucun écran muet (jamais `applicable` et `enAttente` vides ensemble) · nœud %s',
  (_id, node) => {
    it(
      'sur tout profil du banc et tout critère masqué seul, jamais `applicable` vide ET `enAttente` vide',
      () => {
        const profils = genererProfils(node, tailleBanc(node))
        const criteres = criteresIndeterminables(node)
        if (criteres.length === 0) return // rien à masquer : aucune indétermination possible sur ce nœud
        const noms = tousLesNoms(node)

        const violations: string[] = []
        for (const critere of criteres) {
          const renseignes = new Set([...noms].filter((n) => n !== critere.nom))
          profils.forEach((profil: Criteria, i: number) => {
            const { applicable, enAttente } = evaluateNode(node, profil, renseignes)
            if (applicable.length === 0 && enAttente.size === 0) {
              violations.push(
                `nœud "${node.id}" :: critère masqué "${critere.nom}" :: profil #${i} :: écran MUET — ` +
                  `"applicable" et "enAttente" vides simultanément (le patient n'obtient ni recommandation ` +
                  `ni indication de ce qui manque)`,
              )
            }
          })
          if (violations.length > 0) break // un cas suffit à documenter le défaut ; pas la peine d'énumérer tout le banc
        }
        expect(violations).toEqual([])
      },
      DELAI_BANC_MS,
    )
  },
)
