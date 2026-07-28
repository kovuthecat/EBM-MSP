/**
 * Banc d'un nœud — COUCHE 3 « invariants » — I21 : **un formulaire vierge ne recommande rien, sur tout
 * nœud publié** (P4/S1, T-019, 2026-07-28).
 *
 * ⚠ CET INVARIANT A CORRIGÉ LA LISTE MÉCANIQUE DE T-018 ÉTAPE 4, PAS SEULEMENT VÉRIFIÉ. La règle
 * d'éligibilité LITTÉRALE de T-018 (« ne participe à aucune condition d'option `role: securite` ni à
 * aucune `exclusions` ») avait déclaré éligibles `rupture_sedentarite_habituelle` et
 * `offre_proximite_connue` sur `rhd-activite-physique` — et cet invariant, exécuté pour la première fois,
 * a reproduit EXACTEMENT le défaut D-01 (les 4 mêmes cartes) que ce lot existe pour éliminer : ces deux
 * critères sont lus comme `nom == false` dans une disjonction `OR` d'options `role: geste` — les présumer
 * « non » rend ce terme VRAI À LUI SEUL, sans qu'aucune autre donnée n'ait été saisie. La règle littérale
 * (role: securite + exclusions) ne protège donc PAS contre ce cas : un critère peut n'apparaître dans
 * AUCUN garde-fou de sécurité et pourtant faire basculer une recommandation ORDINAIRE à tort, dès lors que
 * son défaut sert de déclencheur POSITIF d'un `OR` plutôt que de simple repli neutre. Les deux
 * déclarations ont été RETIRÉES du contenu (`presomption_non` absent, cf. `rhd-activite-physique.yaml`) ;
 * `difficulte_acces_activite`/`experience_activite_negative`, elles, restent posées — vérifiées sûres
 * parce que leur seule lecture les cite en `== true` (jamais `== false`). I21 est donc l'arbitre EMPIRIQUE
 * final de l'éligibilité mécanique, au-delà de la lecture littérale du texte de tâche — cf. rapport de
 * tâche T-018 pour le détail complet de cette correction.
 *
 * VALIDÉ en le cassant volontairement (consigne de tâche) : réintroduire `presomption_non: true` sur
 * `rupture_sedentarite_habituelle` fait échouer ce test sur `rhd-activite-physique` (vérifié, puis
 * annulé) — la découverte ci-dessus n'est pas une supposition. NUANCE relevée pendant cette même
 * vérification : réintroduire `presomption_non: true` sur `limitation_physique_connue` (un des 4 signes
 * du verrou sécurité à l'effort) NE fait PAS échouer ce test — parce que `verrou_effort` est une
 * disjonction de 4 signes, et qu'il suffit qu'UN SEUL des 3 autres reste indéterminé pour que la
 * disjonction entière (et donc l'exclusion qu'elle porte) reste indéterminée : la redondance des 4 signes
 * fournit une défense en profondeur qui absorbe une présomption isolée. Ce n'est PAS une preuve que
 * `limitation_physique_connue` serait éligible à `presomption_non` (elle porte un fait de sécurité réel,
 * hors de portée de toute présomption, cf. `DECISIONS.md` D21) — seulement une limite de ce test précis
 * (un seul flag cassé à la fois) qu'un lecteur pressé pourrait mal interpréter.
 *
 * LE DÉFAUT RÉEL QUI L'A MOTIVÉ (`docs/decision/validation/recette-navigateur-2026-07-28.md`, D-01,
 * famille F-A). Le formulaire vierge du nœud `rhd-activite-physique` affichait QUATRE cartes
 * « Recommandée » — dont une orientation vers une structure d'activité physique adaptée — sans qu'aucune
 * donnée n'ait été saisie ; le moteur lisait l'absence de réponse comme un « non » affirmé
 * (`Interrompt habituellement les longues périodes assises : non`, `Offre d'activité de proximité connue :
 * non`). Trois autres nœuds (`cible-glycemique`, `statine`, `insuline`) montraient la même famille de
 * défaut (D-02) sous une forme voisine : un fait présumé sur un critère jamais renseigné entrait dans le
 * « pourquoi » d'une carte. C'est exactement le défaut que 769 tests ne posaient jamais comme question :
 * aucun d'eux ne demandait « et si le praticien n'a RIEN saisi ? ».
 *
 * CE QUE CET INVARIANT ATTRAPE. Sur CHAQUE nœud publié (`content/loadNodes.ts`, `noeuds` — même
 * périmètre que `invariants.test.ts`/`coherence-inter-noeuds.test.ts`, aucun filtre par `meta.statut` :
 * un nœud `brouillon` est servi par l'écran au même titre qu'un nœud `valide`, cf.
 * `docs/decision/CONSTRUIRE-UN-MODULE.md` « Statut de contenu invisible »), un profil VIERGE — `criteria`
 * = les valeurs par défaut génériques (`lib/formLayout.ts` `buildDefaultCriteria`, aucune connaissance
 * clinique), `renseignes` = ensemble VIDE (rien de saisi) :
 *
 * 1. `applicable` doit être VIDE. Le moteur ne doit jamais affirmer une recommandation fondée sur des
 *    critères que personne n'a renseignés.
 * 2. `enAttente` doit être NON VIDE — sa contrepartie, tout aussi nécessaire (D20 §I2′, révisé) : l'écran
 *    doit avoir quelque chose à dire (le registre « en attente » prend le relais du panneau vide). Un
 *    nœud qui ne propose rien et n'attend rien serait un écran muet — hors périmètre ici (c'est un défaut
 *    d'une autre nature, cf. S2), mais cet invariant l'attrape en passant : soit c'est déjà couvert
 *    ailleurs (`NOEUDS_AVEC_SORTIE_VIDE_CONNUE`, `invariants.test.ts`), soit c'est un `STOP` (cf. plus bas).
 *
 * `criteria` VIA `buildDefaultCriteria` (pas un objet littéralement `{}`) : le moteur lève
 * `ConditionError` sur toute variable absente de `criteria` (`engine/conditions.ts`, "Variable de critère
 * inconnue" — distinct de « non renseigné », brief §7 « aucun score caché »), donc un objet vide ferait
 * échouer l'évaluation avant même d'atteindre la question posée ici. `buildDefaultCriteria` garantit une
 * clé par critère sans y injecter aucune connaissance clinique (valeurs génériques par TYPE : 0 / false /
 * première valeur d'énumération / tableau vide) ; `calculerCriteresDerives` complète les critères DÉRIVÉS
 * (nécessaires pour que toute expression qui les nomme trouve `variable in criteria`) — même pipeline que
 * partout ailleurs dans ce banc (`profils.ts`, chaque `evalProfile` des bancs de vignettes).
 *
 * DÉSIGNER LE COUPABLE, PAS SEULEMENT DIRE NON (consigne de la tâche). Un message d'échec nomme le nœud,
 * l'option indûment applicable, ET le ou les critères `bool`/`liste` `presomption_non: true` qui l'ont
 * fait passer (le mécanisme précis que D30/T-018 vient d'introduire et que cet invariant surveille en
 * premier lieu) — ou, si l'option est un sentinel `["toujours"]`/`["default"]` sans critère présumé en
 * cause, le signale comme tel : c'est alors un défaut D'UNE AUTRE NATURE (une option qui conclut sans lire
 * aucun critère), cf. « Si bloqué » ci-dessous.
 *
 * GÉNÉRIQUE (CLAUDE.md invariant 5 / DECISIONS.md D8) : aucun id de nœud ni nom de critère codé en dur
 * dans la LOGIQUE — un futur domaine obtient l'invariant sans modification de ce fichier.
 */
import { describe, expect, it } from 'vitest'
import { noeuds } from '../../content/loadNodes.ts'
import type { Noeud, Option } from '../../content/node.types.ts'
import { buildDefaultCriteria } from '../../lib/formLayout.ts'
import { calculerCriteresDerives } from '../deriveCritere.ts'
import { evaluateNode } from '../evaluateNode.ts'

/** Mot entier : `\b` seul suffirait mais le nom explicite documente l'intention à la lecture. */
function citeLeCritere(expression: string, nom: string): boolean {
  return new RegExp(`\\b${nom}\\b`).test(expression)
}

/**
 * Critères `presomption_non: true` du nœud référencés (mot entier) par au moins une expression de
 * `option` (`conditions`/`prerequis`/`exclusions`) — les suspects mécaniques d'une applicabilité obtenue
 * sur un formulaire vierge. Ne prétend pas prouver la causalité logique (indécidable sans un second
 * moteur de preuve, même limite qu'ailleurs dans ce banc, cf. `invariants-contenu.test.ts`) : nommer les
 * critères MENTIONNÉS dans les expressions de l'option est le niveau de diagnostic que permet une lecture
 * mécanique du contenu, et c'est suffisant pour désigner le coupable le plus probable.
 */
function suspectsPresomption(node: Noeud, option: Option): string[] {
  const presumes = node.criteres_entree.filter(
    (c) => (c.type === 'bool' || c.type === 'liste') && c.presomption_non === true,
  )
  const expressions = [...option.conditions, ...(option.prerequis ?? []), ...(option.exclusions ?? [])]
  return presumes.filter((c) => expressions.some((expr) => citeLeCritere(expr, c.nom))).map((c) => c.nom)
}

/** Une option de repli/socle systématique (`["default"]`/`["toujours"]`, D11/D16) : sentinel, pas une
 * expression évaluable — si elle est indûment applicable sur vierge, aucun critère présumé n'en est la
 * cause possible (cf. docstring de tête, « défaut d'une autre nature »). */
function estSentinelle(option: Option): boolean {
  return option.conditions.length === 1 && (option.conditions[0] === 'default' || option.conditions[0] === 'toujours')
}

describe('I21 — un formulaire vierge ne produit aucune recommandation, sur tout nœud publié (D30, T-019)', () => {
  it.each(noeuds.map((node) => [node.id, node] as const))('nœud %s', (_id, node) => {
    const criteria = calculerCriteresDerives(node.criteres_entree, buildDefaultCriteria(node.criteres_entree))
    const renseignes = new Set<string>()

    const result = evaluateNode(node, criteria, renseignes)

    if (result.applicable.length > 0) {
      const detail = result.applicable.map((option) => {
        const suspects = suspectsPresomption(node, option)
        if (suspects.length > 0) {
          return (
            `option "${option.intitule}" — critère(s) présumé(s) en cause : ${suspects.join(', ')} ` +
            `(presomption_non: true — vérifier que cette présomption est légitime, ou qu'aucune autre ` +
            `expression de l'option ne s'appuie dessus à tort)`
          )
        }
        if (estSentinelle(option)) {
          return (
            `option "${option.intitule}" — sentinel ${JSON.stringify(option.conditions)} (D11/D16), AUCUN ` +
            `critère présumé identifié dans ses conditions/prerequis/exclusions : conclut sans lire aucun ` +
            `critère du patient — défaut D'UNE AUTRE NATURE, cf. section « Si bloqué » de T-019 (P4/S1).`
          )
        }
        return (
          `option "${option.intitule}" — AUCUN critère presomption_non identifié dans ses ` +
          `conditions/prerequis/exclusions : la cause n'est pas une présomption mal posée, cf. section ` +
          `« Si bloqué » de T-019 (P4/S1).`
        )
      })
      expect(
        result.applicable,
        `nœud "${node.id}" :: formulaire vierge (criteria par défaut, renseignes vide) : ` +
          `${result.applicable.length} option(s) indûment APPLICABLE(S) :\n  - ${detail.join('\n  - ')}`,
      ).toEqual([])
    }

    expect(
      result.enAttente.size,
      `nœud "${node.id}" :: formulaire vierge : "applicable" est bien vide, mais "enAttente" L'EST AUSSI ` +
        `— un écran qui ne propose rien et n'attend rien n'a rien à montrer au praticien (I2′ révisé, D20).`,
    ).toBeGreaterThan(0)
  })
})
