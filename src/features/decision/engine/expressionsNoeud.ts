/**
 * LE collecteur d'expressions d'un nœud — source unique de vérité pour la question « où, dans un nœud,
 * une expression DSL peut-elle vivre ? » (chantier 2026-07-27, cause racine S1 du
 * `PLAN-CORRECTION.md`).
 *
 * POURQUOI CE FICHIER EXISTE. Cette question était recopiée à **trois** endroits, et les trois copies
 * DIVERGEAIENT :
 *
 * | fragment | `relevance.ts` (avant) | `banc/profils.ts` (avant) |
 * |---|---|---|
 * | `option.conditions`        | ✅ | ✅ |
 * | `option.prerequis`         | ✅ (ajouté le 26/07) | ❌ |
 * | `option.exclusions`        | ✅ | ✅ |
 * | `option.priorite[].quand`  | ✅ | ✅ |
 * | `Noeud.alertes[].quand`    | ✅ | ✅ |
 * | **`option.alertes[].quand`** | ❌ | ❌ |
 * | `criteres_entree[].derive` | ✅ | ✅ |
 *
 * Les deux fonctions portaient LE MÊME NOM (`reglesDuNoeud`), dans deux fichiers, et chacune affirmait
 * dans sa docstring être le miroir de l'autre — « *les deux extracteurs ne doivent jamais diverger* »
 * (`profils.ts`, 26/07). Elles divergeaient déjà au moment où cette phrase a été écrite.
 *
 * CE QUE CETTE DIVERGENCE A COÛTÉ, concrètement : un seuil numérique qui ne vit QUE dans une alerte
 * d'option n'entrait dans le domaine de tirage d'AUCUN des deux moteurs. Le critère n'était donc jamais
 * engendré à cette valeur (banc) ni perturbé à cette valeur (pertinence). Trois défauts constatés le
 * 2026-07-27 en découlent directement, et un seul mécanisme les explique :
 *   - `statine` — CK > 50 N sans statine en place ne déclenchait aucune alerte de rhabdomyolyse, et
 *     11 profils du golden master figeaient ce trou **en vert** ;
 *   - `statine` — la bande CK 10-50 n'était couverte par aucun profil (diagnostiqué à tort comme un
 *     aléa de tirage) ;
 *   - `insuline` — TBR > 4 % ne déclenchait aucune alerte (défaut K de la recette référent).
 *
 * LE CORRECTIF N'EST PAS « ajouter la ligne manquante ». Ç'aurait été fermer ces trois cas en laissant
 * la divergence intacte : le prochain champ ajouté au schéma serait oublié dans une copie sur deux,
 * exactement comme `prerequis` l'a été. Le correctif est cette fonction unique **plus** l'invariant qui
 * la garde honnête (`banc/grammaire.test.ts`) :
 *   - toute propriété du schéma est CLASSÉE ci-dessous (`CHAMPS_DU_SCHEMA`) — un champ ajouté au schéma
 *     et non classé fait échouer le banc, ce qui force la question « porte-t-il une expression ? » ;
 *   - tout champ classé `decision` est réellement VISITÉ par le collecteur — vérifié sur un nœud
 *     synthétique où chaque emplacement porte un marqueur distinct.
 *
 * GÉNÉRIQUE (CLAUDE.md invariant 5 / DECISIONS.md D8) : aucun nom de nœud, de domaine ni de critère.
 */
import type { Noeud } from '../content/node.types.ts'

/**
 * Nature d'une propriété du schéma vis-à-vis du DSL. La distinction n'est pas cosmétique : elle décide
 * quels fragments alimentent l'extraction de seuils numériques du banc et de la pertinence.
 *
 * - `decision` — expression BOOLÉENNE lue par le moteur de décision pour trancher l'applicabilité, le
 *   rang, l'exclusion ou une alerte. C'est le SEUL groupe dont on extrait des seuils : un littéral y
 *   est une frontière clinique, franchir cette frontière change la sortie.
 * - `affichage` — expression booléenne évaluée HORS du moteur de décision (`visible_si`, couche
 *   formulaire). **Délibérément exclue de l'extraction de seuils** : un littéral n'y déplace aucune
 *   sortie (`signatureVue` ne contient pas la visibilité des champs), il n'engendrerait donc que des
 *   profils indiscernables — du bruit qui dilue le banc sans rien couvrir de plus.
 * - `arithmetique` — expression NON booléenne (`calculs[].expression`, ex. `poids * 0.1`). Exclue de
 *   l'extraction pour une raison plus forte encore : ses littéraux sont des COEFFICIENTS, pas des
 *   seuils. Les verser dans le domaine d'un critère y injecterait des valeurs qui ne correspondent à
 *   aucune frontière — la famille de défaut déjà corrigée le 26/07 par les bornes `min`/`max`.
 * - `saisie` — expression booléenne portant sur la COHÉRENCE DE LA SAISIE (`contraintes[].expression`,
 *   ajouté le 2026-07-27), pas sur la conduite à tenir. Évaluée par le formulaire et par le générateur
 *   du banc, **jamais par `evaluateNode`** : une contrainte violée ne retire aucune option et n'en ajoute
 *   aucune. C'est pourquoi elle ne peut pas être classée `decision` — `reglesDeDecision` sert de
 *   définition à « ce qui décide », et y verser une contrainte ferait extraire ses littéraux comme des
 *   frontières cliniques alors qu'ils n'en sont pas. Limite connue et assumée : une contrainte dont la
 *   frontière serait un littéral (plutôt qu'une relation entre deux critères, sa forme normale) ne verrait
 *   pas ce littéral entrer dans le domaine de tirage du banc. L'invariant de violabilité
 *   (`banc/invariants-contenu.test.ts`) le rattrape en exigeant qu'un profil au moins la viole.
 * - `inerte` — ne porte aucune expression.
 */
export type NatureChamp = 'decision' | 'affichage' | 'arithmetique' | 'saisie' | 'inerte'

/**
 * CLASSIFICATION EXHAUSTIVE des propriétés de `schema/noeud.schema.json`, par définition. Tenue à jour
 * **sous contrainte de test** : `banc/grammaire.test.ts` compare cette table aux propriétés réellement
 * déclarées par le schéma et échoue à la moindre divergence, dans les deux sens (champ du schéma non
 * classé, champ classé qui n'existe plus).
 *
 * C'est la pièce qui rend l'oubli impossible plutôt qu'improbable. Un contributeur qui ajoute une
 * propriété au schéma ne peut pas ne pas se poser la question : le banc ne passe pas tant qu'il ne l'a
 * pas tranchée ici.
 *
 * Les définitions purement scalaires du schéma (`niveauPreuve`, `typeCritere` : des `enum` de chaînes,
 * sans `properties`) n'ont rien à classer et n'apparaissent donc pas.
 */
export const CHAMPS_DU_SCHEMA: Record<string, Record<string, NatureChamp>> = {
  '(racine)': {
    id: 'inerte',
    module: 'inerte',
    domaine: 'inerte',
    titre: 'inerte',
    population_cible: 'inerte',
    criteres_entree: 'inerte', // conteneur : ses propres champs sont classés sous `critereEntree`
    options: 'inerte', // conteneur : cf. `option`
    argumentaire: 'inerte',
    sources: 'inerte',
    incertitudes: 'inerte',
    veille_liee: 'inerte',
    meta: 'inerte',
    selection: 'inerte',
    argumentaire_exhaustif: 'inerte',
    alertes: 'inerte', // conteneur : cf. `alerte`
    cadrage: 'inerte', // D24 : prose inconditionnelle, sans `quand` — c'est sa définition même
    familles: 'inerte',
    contraintes: 'inerte', // conteneur : cf. `contrainte`
  },
  contrainte: {
    expression: 'saisie', // cf. `NatureChamp` : cohérence de la saisie, jamais lue par `evaluateNode`
    message: 'inerte',
  },
  option: {
    intitule: 'inerte',
    role: 'inerte', // A3 : déclaration de nature, pas une expression (cf. `RoleOption`)
    action: 'inerte', // P6/S0 (2026-07-28) : même nature que `role` — un verbe descriptif, pas une expression (cf. `ActionOption`)
    avantages: 'inerte',
    inconvenients: 'inerte',
    effet_attendu: 'inerte',
    // R2 : « 16-26 mois », « immédiat », « non établi ». Prose d'affichage, jamais évaluée — le moteur
    // ne la lit pas (cf. `Option.delai_benefice`). Contient des NOMBRES sans être une expression : c'est
    // exactement le champ que la classification protège d'une extraction de seuils accidentelle.
    delai_benefice: 'inerte',
    niveau_preuve: 'inerte',
    references: 'inerte',
    conditions: 'decision',
    prerequis: 'decision',
    // P10/S2 (T-079) — `inerte`, et ce classement demande d'être justifié parce que les CLÉS de cette
    // carte SONT des expressions du DSL. Deux raisons de ne pas les récolter :
    //  1. elles ne sont jamais ÉVALUÉES — ni par `evaluateNode`, ni par l'affichage, qui s'en sert
    //     uniquement comme d'un index (comparaison de chaînes, cf. `lib/conditionText.ts`) ;
    //  2. ce sont, par construction, des branches DÉJÀ récoltées depuis `conditions`/`prerequis` —
    //     l'invariant I24 (`banc/invariants-contenu.test.ts`) refuse toute clé qui n'en est pas une. Les
    //     récolter dupliquerait donc les mêmes littéraux dans les domaines de tirage du banc, sans y
    //     ajouter une seule frontière clinique.
    // La VALEUR, elle, est de la prose d'affichage — même nature que `contre_indications` et `apercu`.
    motifs: 'inerte',
    // Conteneur depuis T-068 (P9) : le tableau mêle des CHAÎNES (prose seule, inerte) et des objets
    // `{ texte, condition }` — cf. la définition `contreIndication` ci-dessous, qui porte la seule
    // expression du lot. Le champ lui-même ne porte donc rien, comme `alertes`.
    contre_indications: 'inerte',
    apercu: 'inerte', // T-076 (P9/S9) : prose d'affichage pure (titre du <summary> replié), aucune expression
    priorite: 'decision', // entier (D13) ou liste de règles `{ quand, rang }` (D14) — seul `quand` est une expression
    exclusions: 'decision',
    calculs: 'arithmetique',
    famille: 'inerte',
    alertes: 'inerte', // conteneur : cf. `alerte`
  },
  alerte: {
    // Une seule définition pour les alertes de NŒUD et d'OPTION — le schéma ne les a jamais distinguées.
    // C'est le code qui l'a fait, et de façon incohérente : voir la docstring de tête.
    quand: 'decision',
    message: 'inerte',
    niveau: 'inerte',
  },
  contreIndication: {
    texte: 'inerte',
    // T-068 (P9) : `decision`, et le classement mérite d'être justifié parce qu'il n'est pas évident.
    // Cette expression ne décide PAS de l'applicabilité d'une option (une contre-indication n'a jamais
    // retiré quoi que ce soit — c'est le rôle d'`exclusions`) : elle décide de l'ÉTAT AFFICHÉ d'un fait
    // de sécurité. `affichage` serait pourtant le mauvais classement : cette nature existe pour les
    // expressions dont les littéraux ne déplacent AUCUNE sortie (`visible_si` — « `signatureVue` ne
    // contient pas la visibilité des champs », cf. `NatureChamp`). Ici c'est l'inverse : l'état d'une
    // contre-indication ENTRE dans `signatureVue` (`lib/vueDecision.ts` `serialiseContreIndications`),
    // donc un seuil écrit ici EST une frontière clinique — franchir « DFG < 30 » change ce que le
    // praticien lit. Le banc doit engendrer des profils de part et d'autre, sinon aucun profil ne verrait
    // jamais la contre-indication se désamorcer.
    condition: 'decision',
  },
  critereEntree: {
    nom: 'inerte',
    type: 'inerte',
    valeurs: 'inerte',
    derive: 'decision',
    groupe: 'inerte',
    visible_si: 'affichage',
    aide: 'inerte', // prose d'aide à la saisie, jamais évaluée (cf. `CritereEntree.aide`)
    // A4/F : même nature que `visible_si` — expressions d'AFFICHAGE, hors extraction de seuils (leurs
    // littéraux ne déplacent aucune sortie du moteur).
    valeurs_visible_si: 'affichage',
    partage: 'inerte', // K6 : drapeau de reprise entre nœuds, pas une expression
    preremplissage: 'inerte', // conteneur : cf. `reglePreremplissage`
    presomption_non: 'inerte', // renommé le 2026-07-28 (P4/S1, T-018), ex-`confirmation_requise`
    min: 'inerte',
    max: 'inerte',
    // 2026-07-29 — les trois sont des drapeaux/listes de PRÉSENTATION, jamais des expressions DSL :
    // `paliers` = valeurs standard proposées à la saisie d'un `nombre` (le type et la valeur stockée
    // restent numériques, aucun seuil n'en dérive) ; `masque_si_indetermine` = exception au repli
    // « fail open » de `visible_si` (c'est `visible_si`, déjà classé `affichage`, qui porte l'expression) ;
    // `debut_de_ligne` = position du champ dans la grille.
    paliers: 'inerte',
    masque_si_indetermine: 'inerte',
    debut_de_ligne: 'inerte',
  },
  // `prioritaire_si` (arbitrage référent A3, 2026-08-01) = expression d'AFFICHAGE, au même titre que
  // `visible_si` : elle hisse une famille en tête de l'écran quand elle est vraie pour ce patient, et
  // ne décide JAMAIS de l'applicabilité d'une option — `evaluateNode` ne s'en sert que pour l'ORDRE des
  // sections, aucune option n'apparaît ni ne disparaît par son fait.
  famille: { libelle: 'inerte', exclusive: 'inerte', prioritaire_si: 'affichage' },
  // K6 — `quand` est une expression d'AFFICHAGE : elle décide d'une valeur de DÉPART dans le formulaire,
  // jamais de l'applicabilité d'une option. `evaluateNode` ne la lit pas.
  reglePreremplissage: { quand: 'affichage', valeur: 'inerte' },
  referencePrimaire: { id: 'inerte', titre: 'inerte', annee: 'inerte', lien: 'inerte', type_critere: 'inerte' },
  referenceCritique: { nom: 'inerte', lien: 'inerte', detail: 'inerte' },
  sources: { references_primaires: 'inerte', synthese_critique: 'inerte', reco_officielle: 'inerte' },
  changelogEntry: { date: 'inerte', auteur: 'inerte', resume: 'inerte', veille_source: 'inerte' },
  meta: { date_revue: 'inerte', auteur: 'inerte', statut: 'inerte', version: 'inerte', changelog: 'inerte' },
}

/**
 * Une expression trouvée dans un nœud, avec son ORIGINE. Le `chemin` n'est pas décoratif : c'est ce qui
 * permet à un invariant de dire « l'alerte n° 2 de l'option "…" » plutôt que « une expression quelque
 * part », et au test de complétude (`banc/grammaire.test.ts`) de vérifier qu'un emplacement précis est
 * bien visité.
 */
export interface FragmentExpression {
  expression: string
  nature: NatureChamp
  /** Chemin lisible dans le nœud, ex. `options[3].alertes[1].quand`. */
  chemin: string
}

/**
 * TOUS les fragments porteurs d'expression d'un nœud, toutes natures confondues, dans un ordre stable
 * (options dans l'ordre du contenu, puis alertes de nœud, puis critères).
 *
 * Les sentinelles `"default"` et `"toujours"` ne sont PAS filtrées : elles remontent telles quelles,
 * comme dans les deux implémentations qu'elle remplace. Un consommateur qui les évalue doit les traiter
 * (le moteur le fait) ; un consommateur qui n'en extrait que des littéraux numériques ne les remarque
 * même pas. Les filtrer ici priverait les invariants de contenu d'un fragment qu'ils ont le droit de
 * vouloir examiner.
 */
export function fragmentsDuNoeud(node: Noeud): FragmentExpression[] {
  const fragments: FragmentExpression[] = []
  const pousser = (expression: string, nature: NatureChamp, chemin: string) => {
    fragments.push({ expression, nature, chemin })
  }

  node.options.forEach((option, i) => {
    const base = `options[${i}]`
    option.conditions.forEach((e, j) => pousser(e, 'decision', `${base}.conditions[${j}]`))
    ;(option.prerequis ?? []).forEach((e, j) => pousser(e, 'decision', `${base}.prerequis[${j}]`))
    ;(option.exclusions ?? []).forEach((e, j) => pousser(e, 'decision', `${base}.exclusions[${j}]`))
    if (Array.isArray(option.priorite)) {
      option.priorite.forEach((regle, j) => pousser(regle.quand, 'decision', `${base}.priorite[${j}].quand`))
    }
    // L'OMISSION HISTORIQUE, dans les deux copies à la fois. Une alerte d'option est un canal de sécurité
    // à part entière (D21) : son `quand` est une expression du même DSL, évaluée par la même brique
    // (`evaluateAlertesDeListe`) que celui d'une alerte de nœud.
    ;(option.alertes ?? []).forEach((alerte, j) => pousser(alerte.quand, 'decision', `${base}.alertes[${j}].quand`))
    // T-068 (P9) : seules les contre-indications de la FORME OBJET portant une `condition` sont récoltées
    // — une chaîne (forme historique) n'est que de la prose, il n'y a rien à récolter.
    ;(option.contre_indications ?? []).forEach((ci, j) => {
      if (typeof ci !== 'string' && ci.condition != null) {
        pousser(ci.condition, 'decision', `${base}.contre_indications[${j}].condition`)
      }
    })
    ;(option.calculs ?? []).forEach((c, j) => pousser(c.expression, 'arithmetique', `${base}.calculs[${j}].expression`))
  })

  ;(node.alertes ?? []).forEach((alerte, i) => pousser(alerte.quand, 'decision', `alertes[${i}].quand`))
  ;(node.contraintes ?? []).forEach((c, i) => pousser(c.expression, 'saisie', `contraintes[${i}].expression`))
  // `prioritaire_si` (A3, 2026-08-01) : expression d'AFFICHAGE portée par une FAMILLE, le premier
  // emplacement porteur d'expression hors `options`/`criteres_entree`/`alertes`/`contraintes`. Récoltée
  // ici pour que G1/G2 la voient : un champ classé `affichage` que le collecteur ne visiterait pas
  // échapperait à toute vérification de syntaxe et de cohérence de critères (c'est exactement
  // l'omission historique documentée plus haut pour les alertes d'option).
  ;(node.familles ?? []).forEach((famille, i) => {
    if (famille.prioritaire_si) pousser(famille.prioritaire_si, 'affichage', `familles[${i}].prioritaire_si`)
  })

  node.criteres_entree.forEach((critere, i) => {
    if (critere.derive) pousser(critere.derive, 'decision', `criteres_entree[${i}].derive`)
    if (critere.visible_si) pousser(critere.visible_si, 'affichage', `criteres_entree[${i}].visible_si`)
    for (const [valeur, expression] of Object.entries(critere.valeurs_visible_si ?? {})) {
      pousser(expression, 'affichage', `criteres_entree[${i}].valeurs_visible_si.${valeur}`)
    }
    ;(critere.preremplissage ?? []).forEach((regle, j) => {
      pousser(regle.quand, 'affichage', `criteres_entree[${i}].preremplissage[${j}].quand`)
    })
  })

  return fragments
}

/**
 * Les expressions de DÉCISION d'un nœud, à plat — remplaçant unique des deux ex-`reglesDuNoeud`
 * (`engine/relevance.ts`, `engine/banc/profils.ts`).
 *
 * C'est l'ensemble sur lequel les deux extracteurs de valeurs candidates cherchent les seuils
 * numériques d'un critère. Y ajouter `affichage` ou `arithmetique` engendrerait des profils qui ne
 * changent aucune sortie (cf. `NatureChamp`) : l'omission de ces deux natures est un choix, pas un
 * reste de l'ancienne implémentation.
 */
export function reglesDeDecision(node: Noeud): string[] {
  return fragmentsDuNoeud(node)
    .filter((f) => f.nature === 'decision')
    .map((f) => f.expression)
}
