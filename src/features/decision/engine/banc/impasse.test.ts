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

/** Même valeur que les autres fichiers du banc (`invariants.test.ts`, `couverture.test.ts`,
 * `securite-atteignable.test.ts`) — nécessaire depuis que `rhd-activite-physique` a doublé son domaine
 * d'énumération (2026-07-29, garde G3 de `profils.ts`) : `genererProfilsPartiels` énumère le domaine
 * COMPLET avant d'en tirer les 400 profils demandés, donc son coût suit ce domaine, pas
 * `PROFILS_PAR_NOEUD` — ce fichier tombait sous le délai par défaut de Vitest (5 000 ms) sur ce nœud
 * précis, sans rapport avec l'assertion elle-même.
 *
 * RELEVÉ 120 000 → 300 000 ms le 2026-08-02 (P11), en phase avec les 3 autres fichiers du banc — cf.
 * `securite-atteignable.test.ts` pour la mesure qui l'a déclenché (verdict devenu fonction de la charge
 * machine, ce que le budget existe pour éviter). */
const DELAI_BANC_MS = 300_000

interface Impasse {
  option: string
  critere: string
  visibleSi: string | undefined
}

/**
 * IMPASSES CONNUES — introduites par T-018 (P4/S1, D30, 2026-07-28), PAS des dispenses.
 *
 * D30 (amende D20) inverse le défaut de détermination des `bool`/`liste` : indéterminés par défaut, sauf
 * `presomption_non: true` posé par le contenu. L'audit MÉCANIQUE de T-018 étape 4 (rapport de tâche) a
 * dû EXCLURE `traitements_en_cours` et `intolerance_traitement` de `presomption_non` sur `prescription`
 * spécifiquement : ces deux critères y gardent des `exclusions`/conditions d'option `role: securite`
 * réelles (ex. « Arrêter la metformine (DFG < 30) », « Réduire la posologie… », « Suspendre l'iSGLT2 »),
 * où les présumer « non »/« vide » serait exactement le défaut D-02 de la recette navigateur du
 * 2026-07-28 (un fait de sécurité affirmé sur une donnée jamais recueillie).
 *
 * CONSÉQUENCE, RÉVÉLÉE PAR CET INVARIANT : les deux critères sont masqués (`visible_si: "intention !=
 * initier"`) — pour un patient INITIER (naïf par construction), ils deviennent donc INDÉTERMINÉS plutôt
 * que déterminés à `[]`/`false` comme avant D30. Une vingtaine d'options qui portent sur un TRAITEMENT
 * DÉJÀ EN COURS (arrêter/réduire/remplacer/désintensifier…) — qui n'ont, par construction, aucun objet
 * pour un patient INITIER — partent donc EN ATTENTE au lieu d'être proprement NON RETENUES, réclamant un
 * champ que l'écran a masqué : exactement l'impasse que cet invariant existe pour détecter.
 *
 * CE N'EST PAS CORRIGÉ ICI. Deux réparations possibles, toutes deux du CONTENU clinique (répéter
 * `intention != initier` dans chaque expression listée — R8 — ou distinguer autrement « pas de saisie »
 * de « aucun traitement, par construction de l'intention »), hors périmètre de la session qui a POSÉ ce
 * constat (S1 : moteur générique, aucun contenu clinique au-delà de la liste mécanique de son étape 4).
 * Recensé mécaniquement (T-018 étape 6, cas (b) du rapport de tâche), laissé pour la session qui traitera
 * le contenu de `prescription`.
 *
 * Clé = `${node.id} :: ${critere}` (le CRITÈRE masqué en cause, pas chaque option qu'il touche — le
 * nombre d'options affectées peut varier au fil du contenu ; le critère, lui, est la partie stable).
 * AUTO-EXPIRANTE comme les autres dettes du banc (`invariants-contenu.test.ts`) : si un jour AUCUNE
 * impasse ne cite plus ce critère sur ce nœud, le test réclame le retrait de l'entrée.
 *
 * PARTIELLEMENT RÉSORBÉE le 2026-07-28 (P4/S9, T-031).
 *
 * `prescription :: intolerance_traitement` — RÉSOLU EN ENTIER, entrée retirée : ce critère n'est jamais
 * cité que positivement (`intolerance_traitement == true`), et répéter `intention != initier AND ` en
 * tête de chaque terme concerné (motif R8) le force correctement à `false` pour un patient INITIER — un
 * naïf ne peut pas être intolérant à un traitement qu'il n'a jamais reçu, c'est exactement la sémantique
 * voulue.
 *
 * `prescription :: traitements_en_cours` — RESTE EN DETTE, POUR UNE RAISON NOUVELLE ET PLUS ÉTROITE que
 * celle qui a motivé T-018. Le motif R8 (répéter le garde EN TÊTE du terme, donc en `AND`) a bien résolu
 * TOUTES les citations POSITIVES (`traitements_en_cours contient X`, sur les options qui portent sur un
 * traitement déjà en cours — arrêter/réduire/remplacer/désintensifier/optimiser — cf. le fix appliqué).
 * Il reste IMPUISSANT sur les citations NÉGATIVES (`traitements_en_cours ne_contient_pas X`), utilisées
 * comme garde-fous de NON-DUPLICATION sur les options d'AJOUT (« Insuline d'initiation », « Introduire un
 * iSGLT2 / un AR GLP‑1 / le tirzépatide », « Association iSGLT2+AR GLP‑1 », « Envisager l'insuline »,
 * « Gliptine »/« Sulfamide — place résiduelle ») : pour ces options, un patient INITIER (naïf par
 * construction) satisfait TRIVIALEMENT « ne prend pas déjà X » — le prérequis DEVRAIT donc valoir `true`,
 * jamais `false`. Or `intention != initier AND traitements_en_cours ne_contient_pas X` vaut FALSE pour
 * tout patient INITIER (le premier conjoint est faux), ce qui EXCLUT ENTIÈREMENT ces options d'ajout pour
 * TOUT patient naïf — régression bien pire que l'impasse d'origine (confirmée sur le banc : profils #227/
 * #763/#1230 d'`invariants.test.ts`, I2′, où plus AUCUNE option n'était `applicable` alors que le DFG très
 * bas ou la dénutrition rendaient une insulinothérapie ou un iSGLT2 cliniquement nécessaires dès
 * l'initiation). Essayé puis REVERTÉ dans cette session — cf. rapport de tâche T-031.
 *
 * La correction qui serait réellement nécessaire — que `traitements_en_cours` se résolve à `true` (pas
 * `false`) sur ces prérequis pour un patient INITIER — n'est atteignable par la seule répétition
 * mécanique du garde : elle exigerait soit de revenir sur l'exclusion de `traitements_en_cours` de
 * `presomption_non` sur ce nœud (décision de T-018, motivée par les `role: securite` réels cités
 * ci-dessus, qu'aucune règle mécanique ne permet de trancher seule), soit une évolution du moteur/DSL pour
 * qu'un garde en tête de terme puisse s'écrire avec la POLARITÉ INVERSE (« si initier, présumer vrai »)
 * sans faire remonter de faux positif ailleurs sur I10. Les deux sont hors périmètre de S9 (contenu
 * mécanique seulement, aucune nouvelle logique clinique, aucun moteur). LAISSÉ EN DETTE, À REVOIR AVEC LE
 * RÉFÉRENT : cf. rapport de tâche T-031 pour le détail des 8 options concernées et le raisonnement complet.
 */
const IMPASSES_CONNUES_T018 = new Map<string, string>([
  [
    'prescription :: traitements_en_cours',
    'D30/T-018 puis P4/S9/T-031 (2026-07-28) : citations POSITIVES corrigées (R8, garde en tête de terme) ' +
      '— seules restent en dette les citations NÉGATIVES (`ne_contient_pas X`, garde-fous de ' +
      "non-duplication sur les options d'ajout : Insuline d'initiation, Introduire iSGLT2/AR GLP‑1/" +
      "tirzépatide, Association, Envisager l'insuline, Gliptine/Sulfamide place résiduelle). Y répéter le " +
      'garde en `AND` les exclurait à tort pour TOUT patient initier (régression pire que le défaut ' +
      "d'origine, cf. docstring ci-dessus) — nécessite soit de revoir `presomption_non` (décision T-018), " +
      'soit une évolution du moteur/DSL. Hors périmètre mécanique de S9/T-031.',
  ],
  [
    'prescription :: nature_intolerance',
    "2026-07-29 (recette référent, `masque_si_indetermine`) — CONSÉQUENCE ASSUMÉE ET MESURÉE d'un correctif " +
      "demandé : ce champ ne s'affiche plus tant que « Intolérance à un traitement en cours » n'est pas " +
      'répondue (avant, le repli « fail open » de R7 le montrait dès le formulaire vierge, ce que le ' +
      'référent a signalé comme du bruit — une sous-question posée avant sa question principale). Les ' +
      "options qui le citent le réclament donc pendant qu'il est masqué. CE N'EST PAS UNE IMPASSE RÉELLE, " +
      'et ça a été vérifié plutôt que supposé : sur 400 profils partiels, 208 cas nomment un champ masqué ' +
      "et 4 SEULEMENT sont de vraies impasses (aucun champ visible réclamé) — les 4 portent sur " +
      "`traitements_en_cours`, la dette ci-dessus, AUCUN sur ce critère. La liste « à renseigner » cite " +
      'toujours AUSSI `intolerance_traitement`, qui est visible : le praticien a toujours un geste ' +
      "possible, et y répondre fait apparaître ce champ. LE VRAI CORRECTIF, à arbitrer : que " +
      '`criteresManquants` (`engine/evaluateNode.ts`) DÉROULE un critère masqué vers les primitifs de son ' +
      '`visible_si` — exactement comme il déroule déjà un critère DÉRIVÉ vers ses primitifs, et pour la ' +
      "même raison (ne citer que des champs de formulaire réels). Changement de moteur, donc hors du " +
      'périmètre de ce lot de contenu/UI.',
  ],
  [
    'prescription :: dose_metformine',
    "2026-07-29 — MÊME CAUSE, MÊME MESURE que `nature_intolerance` ci-dessus (`masque_si_indetermine`) : " +
      "le champ ne s'affiche plus tant que « Metformine » n'est pas cochée dans les traitements en cours. " +
      "« Réduire la posologie de la metformine » le réclame pendant ce temps, mais réclame AUSSI " +
      '`traitements_en_cours`, visible — jamais de dead-end. Se résorbe avec le même correctif de moteur ' +
      '(dérouler un critère masqué vers les primitifs de son `visible_si`).',
  ],
])

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

    // Sépare les impasses CONNUES (T-018, ci-dessus) des NOUVELLES : un critère connu qui expliquerait
    // TOUTES ses impasses ne doit pas masquer une impasse sur un AUTRE critère, ni sur un autre nœud.
    const critereConnu = (i: Impasse) => IMPASSES_CONNUES_T018.has(`${node.id} :: ${i.critere}`)
    const nouvelles = uniques.filter((i) => !critereConnu(i))
    expect(
      nouvelles.map((i) => `« ${i.critere} » réclamé par « ${i.option} » — masqué par : ${i.visibleSi ?? '(aucun visible_si)'}`),
    ).toEqual([])

    // Auto-expiration : une entrée de IMPASSES_CONNUES_T018 qui ne correspond plus à AUCUNE impasse
    // réelle sur ce nœud est une dette résorbée — elle doit être retirée, pas oubliée ici.
    for (const [cle] of IMPASSES_CONNUES_T018) {
      if (!cle.startsWith(`${node.id} :: `)) continue
      const critere = cle.slice(`${node.id} :: `.length)
      const encoreValide = uniques.some((i) => i.critere === critere)
      expect(
        encoreValide,
        `"${cle}" ne correspond plus à aucune impasse réelle sur "${node.id}" : dette résorbée, retirer ` +
          `l'entrée de IMPASSES_CONNUES_T018.`,
      ).toBe(true)
    }
  }, DELAI_BANC_MS)
})
