/**
 * Banc d'un nœud — COUCHE 2 « couverture » (docs/decision/GRAMMAIRE-NOEUD.md, section « Le banc d'un
 * nœud — trois couches »). Validation PUREMENT MÉCANIQUE (aucune relecture clinique requise) : sur un
 * échantillon de profils tiré à graine fixe (`profils.ts`), chaque règle du contenu doit se déclencher
 * au moins une fois. Une règle qui ne se déclenche JAMAIS est soit morte (à retirer), soit mal câblée
 * (à corriger) — c'est le test de R5 généralisé aux options et aux règles de sélection.
 *
 * Générique : itère sur TOUS les nœuds renvoyés par `loadNodes` (`noeuds`), aucun id ni nom de critère
 * codé en dur. Le message d'échec NOMME l'option/l'expression/le critère non couvert (les assertions
 * `toEqual([])` impriment la liste manquante telle quelle — c'est la valeur du test, cf. consigne).
 */
import { describe, expect, it } from 'vitest'
import { noeuds } from '../../content/loadNodes.ts'
import { evaluateCondition } from '../conditions.ts'
import { evaluateAlertesDeListe, evaluateNode } from '../evaluateNode.ts'
import { criteresPertinents } from '../relevance.ts'
import { genererProfils, tailleBanc } from './profils.ts'

/**
 * Nœuds pour lesquels le test R5 (chaque critère saisissable est décisif quelque part) est une DETTE DE
 * CONTENU DÉJÀ DIAGNOSTIQUÉE, PAS un artefact d'échantillonnage. Vide depuis le 2026-07-25 : les quatre
 * critères morts d'`insuline.yaml` (`IMC`, `TIR`, `TAR`, `GMI`) ont été retirés du contenu et
 * `dose_rapide_actuelle` a été branché dans un `calculs` (arbitrage référent) — R5 passe désormais sur ce
 * nœud. Cette liste ne doit grossir que sur un diagnostic similaire (jamais pour faire taire une
 * régression ailleurs).
 */
const NOEUDS_AVEC_CRITERES_MORTS_CONNUS = new Set<string>([])

/**
 * EXCEPTIONS R5 **PAR CRITÈRE** — ajouté le 2026-07-27, et le grain compte.
 *
 * `NOEUDS_AVEC_CRITERES_MORTS_CONNUS` ci-dessus désactive R5 pour un nœud ENTIER : accepter une exception
 * de cette maille pour un seul critère aveuglerait les 26 autres de `prescription`, exactement le travers
 * que ce fichier dénonce (« ne doit grossir que sur un diagnostic similaire »). Cette table-ci retire un
 * critère nommé, avec son motif, et rien d'autre.
 *
 * AUTO-EXPIRANTE : le test échoue AUSSI quand une entrée devient périmée — critère redevenu décisif, ou
 * disparu du contenu. Une exception qui ne signale pas sa propre résorption devient du papier peint.
 */
const CRITERES_NON_DECISIFS_ADMIS: Record<string, Record<string, string>> = {
  // RÉOUVERTE le 2026-08-06 (P14/S11, T-180/T-181, D50 — amende D28) — même exception que celle VIDÉE le
  // 2026-07-29 (cf. l'historique ci-dessous), pour le même motif structurel, mais sur les DEUX nœuds cette
  // fois : `position_vs_cible` devient la définition UNIQUE de « où en est ce patient » (décision référent :
  // « la position déclarée par le praticien prime »), et `cible_atteinte`/`ecart_sous_objectif_cible` sont
  // RÉÉCRITS pour la lire — ils cessent tous deux de lire `HbA1c_actuelle`/`HbA1c_cible` directement.
  //
  // `HbA1c_cible` (les deux nœuds) et `HbA1c_actuelle` (`insuline` SEULEMENT — `prescription` le lit encore
  // directement dans `hba1c_sous_cible`, garde-fou absolu indépendant de la cible, donc reste DÉCISIF là-bas)
  // perdent donc tout lecteur de SÉLECTION. Leur SEUL lecteur restant est le `preremplissage` de
  // `position_vs_cible` (D50/T-181, cf. le contenu) : il suggère une position de départ depuis l'écart à la
  // cible PUBLIÉE par `cible-glycemique`, un effet que `criteresPertinents`/`evaluateNode` (ce fichier) sont
  // STRUCTURELLEMENT incapables de mesurer — `preremplissage` est un mécanisme d'ÉCRAN
  // (`DecisionNodeScreen.tsx`), jamais lu par le moteur. C'est EXACTEMENT le rôle que R5/T-164
  // (`invariants-contenu.test.ts`) reconnaît explicitement à `preremplissage` comme lecteur légitime — cette
  // table-ci est la contrepartie DYNAMIQUE de cette même reconnaissance, pas une dette nouvelle.
  //
  // GARDE-FOU D50 VÉRIFIÉ (condition MÊME de la légitimité de cette exception) : ni `HbA1c_actuelle` ni
  // `HbA1c_cible` ne sont cités par aucune `conditions`/`prerequis`/`exclusions`/`alertes`/`derive`/
  // `contraintes` de ces deux nœuds — invariant dédié du banc (D50/T-179, `invariants-contenu.test.ts`).
  //
  // AUTO-EXPIRANTE comme le reste de cette table : si `HbA1c_actuelle`/`HbA1c_cible` redevenaient décisifs
  // (une règle future les relisant directement), le test réclamerait le retrait de l'entrée correspondante.
  insuline: {
    HbA1c_actuelle: 'D50/T-180 (P14/S11) — ne nourrit plus que `preremplissage` de `position_vs_cible` (via cet écart), plus aucun `derive`/`conditions` de sélection ne le lit sur ce nœud.',
    HbA1c_cible: 'D50/T-181 (P14/S11) — seul lecteur : `preremplissage` de `position_vs_cible`, jamais une règle de sélection (garde-fou D50).',
  },
  prescription: {
    HbA1c_cible: 'D50/T-181 (P14/S11) — RÉTABLI après la suppression du 2026-07-29 (cf. l\'historique de cette table), sous la forme D50 : seul lecteur, `preremplissage` de `position_vs_cible`, jamais une règle de sélection (garde-fou D50).',
  },
  // ---------------------------------------------------------------------------------------------------
  // HISTORIQUE — VIDE du 2026-07-29 au 2026-08-06, dette résorbée puis rouverte sous une forme différente.
  //
  // L'unique entrée était alors `prescription :: HbA1c_cible` : ce critère n'agissait sur AUCUNE décision
  // (aucune option, aucune alerte, aucun rang ne le lisait), seulement sur le FORMULAIRE, où il
  // pré-remplissait `position_vs_cible` en calculant l'écart à la cible (K6/D28) — le même effet
  // structurellement invisible à `criteresPertinents` qui motive les entrées ci-dessus.
  //
  // Le référent avait retiré ce pré-remplissage le 2026-07-29 (retour assumé sur K6/D28 : `position_vs_cible`
  // redevenait purement DÉCLARÉ). `HbA1c_cible` avait alors perdu son dernier lecteur sur ce nœud et avait
  // été supprimé avec les quatre dérivés d'écart qu'il alimentait. `HbA1c_cible` existait alors toujours sur
  // `insuline`, où il restait DÉCISIF (il y nourrissait `cible_atteinte`, lu par des règles) — pas
  // d'exception à déclarer là-bas à l'époque. C'est cette dernière lecture directe que T-180 retire
  // aujourd'hui (`cible_atteinte` lit désormais `position_vs_cible`), d'où la nouvelle entrée `insuline` ci-
  // dessus — la dette n'est pas la même qu'en juillet, elle a la même FORME pour une raison structurelle
  // différente (D50, publication inter-nœuds, plutôt que K6, reprise de saisie).
}

/**
 * Nœuds dont une option n'est JAMAIS applicable sur le banc — **défaut du GÉNÉRATEUR, pas du contenu**.
 * Diagnostiqué le 2026-07-26 (poids/DFG ci-dessous), **CORRIGÉ le même jour** par la déclaration de
 * bornes `min`/`max` sur les critères `nombre` (table validée référent, docs/decision/GRAMMAIRE-NOEUD.md,
 * schema/noeud.schema.json) et leur application aux DEUX extracteurs de valeurs candidates
 * (`engine/banc/profils.ts` `seuilsNumeriques`, `engine/relevance.ts` `valeursCandidates`) : tout littéral
 * hors `[min, max]` est désormais écarté, avec repli sur un tirage dans `[min, max]` quand plus aucun
 * littéral ne subsiste. Vérifié après correction : `genererProfils` sur `insuline` ne produit plus de
 * poids candidat à 0,5 kg (domaine observé : bornes + tirages dans [35, 250]) ; sur `prescription`, le
 * domaine de tirage du DFG ne contient plus 1000/2000 (domaine observé : bornes + seuils réels dans
 * [3, 150]). Liste laissée VIDE (constatation, pas seulement l'absence de nouveau diagnostic) — l'historique
 * du défaut reste ci-dessous pour qui chercherait pourquoi `min`/`max` existent sur le schéma.
 *
 * **Historique du diagnostic (avant correction).** `valeursCandidates` (`profils.ts`, même principe que
 * `relevance.ts`) extrayait les seuils numériques de TOUTE règle mentionnant un critère — **y compris
 * quand le littéral porte sur un autre opérande**. La seule règle citant `poids` dans `insuline.yaml` est
 * le dérivé `dose_basale_actuelle / poids > 0.5` : le `0.5`, seuil de RATIO, devenait une valeur candidate
 * de POIDS (patients de 0, 0,49, 0,5, 0,51 et 9999 kg). Le même mécanisme touchait `DFG` : la condition de
 * « Réduire la posologie de la metformine » mentionne à la fois `DFG` et les seuils de dose `1000`/`2000`,
 * qui entraient dans le domaine de tirage du DFG (patients à 2000 mL/min). Le défaut était GÉNÉRIQUE :
 * toute règle associant deux critères d'échelles différentes corrompait le domaine de l'un par les
 * littéraux de l'autre, et s'aggravait à mesure que le contenu s'enrichissait — d'où la correction
 * générique (bornes de contenu, pas un correctif ad hoc par nœud).
 */
const NOEUDS_AVEC_OPTION_INATTEIGNABLE_PAR_LE_GENERATEUR = new Set<string>([])

/**
 * OPTIONS DE REPLI VÉRIFIÉES NON COUVERTES PAR LE BANC FIGÉ, POUR UNE RAISON DOCUMENTÉE — deux root causes
 * distinctes, chaque entrée précise laquelle. DIFFÉRENT de `NOEUDS_AVEC_OPTION_INATTEIGNABLE_PAR_LE_
 * GENERATEUR` ci-dessus (réservé à un vrai BUG du générateur, aujourd'hui vide) : ici le générateur et le
 * contenu sont corrects, seul le banc à graine fixe ne lève pas le cas.
 *
 * **Cause A — structurellement inatteignable PAR CONSTRUCTION** (`rhd-activite-physique`,
 * `rhd-alimentation`, décision référent 2026-08-06, P14/S7/T-170) : ces deux nœuds couvrent aujourd'hui
 * *tout* leur domaine par arithmétique des énums actuels. Le repli est un filet posé pour une évolution
 * FUTURE du contenu, pas un cas vivant aujourd'hui — vérifié sur le banc EXHAUSTIF (110 592 / 1 360
 * profils) : aucune combinaison de valeurs actuellement déclarées ne l'atteint, et aucune ne pourra
 * jamais l'atteindre tant que le contenu actuel ne change pas.
 *
 * **Cause B — trou de DENSITÉ D'ÉCHANTILLONNAGE, contenu vérifié correct** (`prescription`, P14/S8/T-177) :
 * le repli « Mesures hygiéno‑diététiques seules — réévaluer » a un `prerequis` volontairement élargi à
 * `intention == initier` seul (fermeture du trou de couverture R10 identifié par S2/T-163). Sur un profil
 * construit à la main, il s'affiche correctement, seul avec le socle, dans les deux états de
 * `cible_atteinte` — le contenu N'EST PAS en cause. Mais sur les 1840 profils du banc à graine fixe,
 * seuls 61 ont `intention == initier`, et AUCUN des 61 n'a par ailleurs zéro autre option applicable
 * (chacun porte un déclencheur clinique réel distinct — glucotoxicité, indication iSGLT2, etc.) —
 * vérifié indépendamment par l'orchestrateur (script de diagnostic ad hoc, supprimé après vérification :
 * 61 profils `initier`, 0 sans autre option). C'est une propriété statistique de cette graine
 * d'échantillonnage stratifié (indépendant par critère, pas par combinaison), pas un défaut de contenu :
 * agrandir le banc ou raffiner la stratification dépasse le mandat de contenu de P14 (signalé, non fait).
 *
 * Grain : `${node.id} :: ${intitulé de l'option}`, JAMAIS le nœud entier — un nœud aussi actif que
 * `prescription` (touché par de nombreuses sessions du plan) garderait sinon toutes ses AUTRES options
 * sans surveillance de couverture.
 *
 * AUTO-EXPIRANTE : si un profil du banc atteint un jour réellement l'option (contenu enrichi, ou banc
 * élargi/re-stratifié pour la cause B), le test réclame le retrait de l'entrée.
 */
const OPTIONS_REPLI_STRUCTURELLES_INATTEIGNABLES = new Map<string, string>([
  [
    "rhd-activite-physique :: Aucune piste prioritaire à proposer aujourd'hui",
    'Décision référent 2026-08-06 (P14/S7/T-170) — cause A, filet structurel pour une évolution future du ' +
      'contenu, domaine actuel déjà couvert en entier par les cartes réelles — accepté, cf. docstring ci-dessus.',
  ],
  [
    "rhd-alimentation :: Aucune piste prioritaire à proposer aujourd'hui",
    'Décision référent 2026-08-06 (P14/S7/T-170) — cause A, même motif, même mécanisme, cf. entrée ci-dessus.',
  ],
  [
    'prescription :: Mesures hygiéno‑diététiques seules — réévaluer',
    "Constaté 2026-08-06 (P14/S8/T-177) — cause B, trou de densité d'échantillonnage (61 profils " +
      "`initier` sur 1840, 0 sans autre option applicable), contenu vérifié correct par construction " +
      'manuelle ET par script indépendant — cf. docstring ci-dessus. Ne pas confondre avec une dette de ' +
      'contenu : T-163 (couverture logique des replis) est vert sur ce nœud depuis T-177.',
  ],
])

/**
 * Délai par test, relevé du défaut vitest (5 000 ms) le 2026-07-27 — même constante et même raison que
 * dans `banc/invariants.test.ts`. Conséquence VOULUE du relèvement de
 * `PLAFOND_ENUMERATION_EXHAUSTIVE` (20 000 → 60 000, cf. `banc/profils.ts`) : `statine` et
 * `rhd-activite-physique` sont repassés en couverture EXHAUSTIVE, donc de 720 et 1 120 profils à 47 520
 * et 55 296. Le budget de R5 plus bas reste distinct : il est dimensionné pour son propre cas d'ÉCHEC,
 * qui doit parcourir tout le banc en réévaluant la pertinence par perturbation.
 *
 * RELEVÉ 120 000 → 300 000 ms le 2026-08-02 (P11), en phase avec les 3 autres fichiers du banc — cf.
 * `securite-atteignable.test.ts` pour la mesure qui l'a déclenché (verdict devenu fonction de la charge
 * machine, ce que le budget existe pour éviter).
 */
const DELAI_BANC_MS = 300_000

describe.each(noeuds.map((node) => [node.id, node] as const))('banc — couverture · nœud %s', (_id, node) => {
  const profils = genererProfils(node, tailleBanc(node))

  const testApplicable = NOEUDS_AVEC_OPTION_INATTEIGNABLE_PAR_LE_GENERATEUR.has(node.id) ? it.fails : it
  testApplicable(`chaque option est APPLICABLE pour au moins un profil (banc de ${profils.length} profils)`, () => {
    const jamaisApplicable = new Set(node.options.map((option) => option.intitule))
    for (const profil of profils) {
      for (const option of evaluateNode(node, profil).applicable) jamaisApplicable.delete(option.intitule)
    }
    for (const [cle] of OPTIONS_REPLI_STRUCTURELLES_INATTEIGNABLES) {
      if (!cle.startsWith(`${node.id} :: `)) continue
      const intitule = cle.slice(`${node.id} :: `.length)
      expect(
        jamaisApplicable.has(intitule),
        `"${cle}" ne correspond plus à aucune option inatteignable — dette résorbée (ou contenu changé), ` +
          `retirer l'entrée de OPTIONS_REPLI_STRUCTURELLES_INATTEIGNABLES.`,
      ).toBe(true)
      jamaisApplicable.delete(intitule)
    }
    expect([...jamaisApplicable]).toEqual([])
  }, DELAI_BANC_MS)

  it('chaque option porteuse d’`exclusions` est EXCLUE pour au moins un profil', () => {
    const optionsAvecExclusions = node.options.filter((option) => (option.exclusions?.length ?? 0) > 0)
    const jamaisExclue = new Set(optionsAvecExclusions.map((option) => option.intitule))
    for (const profil of profils) {
      for (const option of evaluateNode(node, profil).excluded.keys()) jamaisExclue.delete(option.intitule)
    }
    expect([...jamaisExclue]).toEqual([])
  }, DELAI_BANC_MS)

  it('chaque EXPRESSION d’`exclusions` est déclenchée (vraie) pour au moins un profil', () => {
    const nonDeclenchees = new Set<string>()
    for (const option of node.options) {
      for (const expr of option.exclusions ?? []) nonDeclenchees.add(`${option.intitule} :: exclusion "${expr}"`)
    }
    for (const profil of profils) {
      for (const option of node.options) {
        for (const expr of option.exclusions ?? []) {
          if (evaluateCondition(expr, profil)) nonDeclenchees.delete(`${option.intitule} :: exclusion "${expr}"`)
        }
      }
    }
    expect([...nonDeclenchees]).toEqual([])
  }, DELAI_BANC_MS)

  it('chaque règle de `priorite` CONDITIONNELLE matche pour au moins un profil', () => {
    const nonAtteintes = new Set<string>()
    for (const option of node.options) {
      if (!Array.isArray(option.priorite)) continue
      for (const regle of option.priorite) {
        if (regle.quand === 'default') continue // toujours vraie par construction (repli) : rien à couvrir
        nonAtteintes.add(`${option.intitule} :: priorite quand "${regle.quand}" -> rang ${regle.rang}`)
      }
    }
    for (const profil of profils) {
      for (const option of node.options) {
        if (!Array.isArray(option.priorite)) continue
        for (const regle of option.priorite) {
          if (regle.quand === 'default') continue
          if (evaluateCondition(regle.quand, profil)) {
            nonAtteintes.delete(`${option.intitule} :: priorite quand "${regle.quand}" -> rang ${regle.rang}`)
          }
        }
      }
    }
    expect([...nonAtteintes]).toEqual([])
  }, DELAI_BANC_MS)

  it('chaque ALERTE du nœud se déclenche pour au moins un profil', () => {
    const nonDeclenchees = new Set<string>()
    for (const alerte of node.alertes ?? []) {
      if (alerte.quand === 'default') continue // toujours vraie par construction : rien à couvrir
      nonDeclenchees.add(alerte.message)
    }
    for (const profil of profils) {
      for (const alerte of evaluateNode(node, profil).alertes) nonDeclenchees.delete(alerte.message)
    }
    expect([...nonDeclenchees]).toEqual([])
  }, DELAI_BANC_MS)

  /**
   * AJOUTÉ le 2026-07-27 (chantier, cause racine S2). Le banc exigeait la couverture des `exclusions`,
   * des `priorite` conditionnelles et des alertes de NŒUD — **jamais celle des alertes d'OPTION**, alors
   * que D21 en fait un canal de sécurité à part entière. Un canal sans obligation de couverture est un
   * canal dont on n'apprendra jamais qu'il est mort : c'est très exactement ce qui s'est produit, un
   * golden master ayant figé 11 profils portant un trou de sécurité, en vert.
   *
   * L'exigence est la BONNE (celle qui a un sens clinique), pas la plus facile : une alerte d'option
   * n'est RENDUE que si son option est applicable (`lib/vueDecision.ts`). On vérifie donc qu'elle est
   * réellement AFFICHÉE au moins une fois — `quand` vrai ET option applicable — et non que son
   * expression peut être vraie dans le vide.
   */
  it('chaque alerte d’OPTION est AFFICHÉE pour au moins un profil (quand vrai ET option applicable)', () => {
    const jamaisAffichee = new Set<string>()
    for (const option of node.options) {
      for (const alerte of option.alertes ?? []) {
        jamaisAffichee.add(`${option.intitule} :: alerte quand "${alerte.quand}"`)
      }
    }
    for (const profil of profils) {
      for (const option of evaluateNode(node, profil).applicable) {
        for (const alerte of evaluateAlertesDeListe(option.alertes, profil)) {
          jamaisAffichee.delete(`${option.intitule} :: alerte quand "${alerte.quand}"`)
        }
      }
    }
    expect([...jamaisAffichee]).toEqual([])
  }, DELAI_BANC_MS)

  /**
   * AJOUTÉ le 2026-07-27 (S2), symétrique exact de la règle sur les `exclusions` juste au-dessus. Un
   * `prerequis` est un garde-fou (R6) : évalué comme une condition, il RETIRE l'option quand il est faux.
   * Un garde-fou qui n'est jamais faux sur tout le banc ne garde rien — il est mort, ou mal câblé.
   *
   * Sens de l'assertion, à ne pas inverser : on exige que le prérequis soit **FAUX** au moins une fois
   * (le cas où il mord), là où pour une `exclusions` on exige qu'elle soit **VRAIE** au moins une fois.
   * Les deux disent la même chose — « ce garde-fou retire réellement quelque chose » — dans les deux
   * polarités que le contenu utilise.
   */
  it('chaque expression de `prerequis` est FAUSSE (mord) pour au moins un profil', () => {
    const jamaisFausses = new Set<string>()
    for (const option of node.options) {
      for (const expr of option.prerequis ?? []) jamaisFausses.add(`${option.intitule} :: prerequis "${expr}"`)
    }
    for (const profil of profils) {
      for (const option of node.options) {
        for (const expr of option.prerequis ?? []) {
          if (evaluateCondition(expr, profil) === false) jamaisFausses.delete(`${option.intitule} :: prerequis "${expr}"`)
        }
      }
    }
    expect([...jamaisFausses]).toEqual([])
  }, DELAI_BANC_MS)

  // Timeout relevé (défaut vitest 5000ms) : `criteresPertinents` réévalue le nœud par PERTURBATION
  // (une évaluation par valeur candidate de chaque critère, cf. engine/relevance.ts) — coûteux mais pur
  // et déterministe ; sur un nœud riche (~25 critères saisissables) × 2000 profils, la mécanique seule
  // (hors E/S, hors réseau) dépasse le défaut sans indiquer un problème de performance du moteur.
  //
  // RELEVÉ 120 000 → `DELAI_BANC_MS` (300 000) le 2026-08-07 (P14, fin de vague 7) : `prescription` a
  // gagné des options et des critères au fil du plan (S6, S8, S17, S19…) et son cas PASSANT — pourtant
  // optimisé par la sortie anticipée ci-dessous — dépasse désormais 120 s à lui seul (mesuré 139-145 s,
  // machine libre, hors toute contention), sans qu'aucun critère ne soit réellement jamais décisif :
  // vérifié en isolant le test avec un budget temporaire de 300 s, il passe. Ce n'est donc pas la
  // fragilité machine-dépendante que ce fichier documente ailleurs (`DELAI_BANC_MS`) : c'est la
  // croissance du contenu qui rattrape un budget resté à sa valeur d'origine, dimensionnée pour un autre
  // nœud (`insuline`) à un stade antérieur du contenu.
  const testR5 = NOEUDS_AVEC_CRITERES_MORTS_CONNUS.has(node.id) ? it.fails : it
  testR5(
    'R5 — chaque critère SAISISSABLE (non `derive`) est pertinent pour au moins un profil',
    () => {
      const admis = CRITERES_NON_DECISIFS_ADMIS[node.id] ?? {}
      const saisissables = node.criteres_entree.filter((critere) => critere.derive == null).map((c) => c.nom)
      const jamaisDecisif = new Set(saisissables)
      for (const profil of profils) {
        for (const nom of criteresPertinents(node, profil)) jamaisDecisif.delete(nom)
        // Sortie anticipée — n'affaiblit PAS l'assertion : dès que chaque critère a été vu décisif au
        // moins une fois, la conclusion est acquise et les profils restants ne peuvent plus la changer.
        // Le cas d'ÉCHEC (un critère jamais décisif), lui, exige toujours d'épuiser le banc : c'est
        // seulement le cas passant qui devient rapide. Sans cela, ce test frôlait son budget de 30 s sur
        // `prescription` (~29,5 s mesurés) et basculait en échec selon la seule charge machine — un test
        // dont le verdict dépend de la machine apprend à ignorer le rouge.
        if (jamaisDecisif.size === 0) break
      }
      expect([...jamaisDecisif].filter((nom) => admis[nom] == null)).toEqual([])
      // Auto-expiration : une exception résorbée (ou dont le critère a disparu) doit réclamer son retrait.
      expect(
        Object.keys(admis).filter((nom) => !jamaisDecisif.has(nom)),
        `exception(s) R5 devenue(s) inutile(s) sur "${node.id}" — retirer de CRITERES_NON_DECISIFS_ADMIS`,
      ).toEqual([])
    },
    // Filet, dimensionné pour le cas d'échec qui doit parcourir tout le banc (nœud `insuline`) — et,
    // depuis le 2026-08-07, pour le cas passant de `prescription` lui-même, cf. commentaire ci-dessus.
    DELAI_BANC_MS,
  )
})
