/**
 * Types TS miroir de `schema/noeud.schema.json` (docs/decision/BRIEF_DECISION.md §5.1/§11).
 *
 * Source de verite = le schema JSON ; ces types le reflètent 1:1 (T-002). Toute évolution du
 * schéma doit être répercutée ici.
 *
 * NB `NiveauPreuve` : cette enum utilise l'underscore `tres_faible`, identique au commentaire du
 * brief §5.1 et au gabarit §11. `src/features/shared/types.ts` définit un `NiveauPreuve` distinct
 * ('tres-faible', trait d'union) pour l'affichage transverse (créé en S1). Écart de forme signalé,
 * non résolu ici — hors périmètre S2 (shared ne se modifie pas sans décision) ; à trancher avant le
 * câblage des écrans (S4), probablement par une fonction de mapping plutôt qu'en unifiant les deux.
 */

/** Échelle GRADE simplifiée telle qu'exprimée dans le contenu YAML des nœuds (brief §4/§5.1). */
export type NiveauPreuve = 'eleve' | 'modere' | 'faible' | 'tres_faible'

/** Nature du critère évalué par une référence primaire (brief §4 : dur vs substitution). */
export type TypeCritere = 'dur' | 'mixte' | 'substitution'

export interface CritereEntree {
  nom: string
  /** `liste` = critère multivalué (valeur = tableau de libellés), opéré par `contient`/`ne_contient_pas` (D13). */
  type: 'nombre' | 'bool' | 'enum' | 'liste'
  /** Valeurs possibles ; pertinent quand `type` vaut `'enum'` ou `'liste'`. */
  valeurs?: string[]
  /**
   * Critère DÉRIVÉ (câblage P3) : expression calculée par le formulaire depuis d'autres critères
   * (`engine/deriveCritere.ts`), non saisie à la main. Résout la limite du DSL `conditions.ts`
   * (`variable OP littéral` seulement) — permet var-vs-var (`HbA1c_actuelle <= HbA1c_cible`) et
   * arithmétique (`dose_basale_actuelle / poids > 0.5`). Un critère dérivé n'est pas rendu comme champ.
   */
  derive?: string
  /**
   * Section d'affichage du formulaire (P3 S7‑ui Lot 2) : libellé rendu tel quel comme titre de section,
   * l'ordre des sections suivant celui de leur PREMIÈRE apparition dans `criteres_entree`. Ordonne la
   * saisie selon le raisonnement clinique (intention → état des lieux → ce qui oriente → garde‑fous)
   * plutôt que par type de donnée. Pure présentation, aucun effet moteur ; absent partout → rendu à plat.
   */
  groupe?: string
  /**
   * Condition DSL (`conditions.ts`, évaluée dérivés inclus) sous laquelle le champ est AFFICHÉ. Fausse →
   * champ masqué (ex. « traitements en cours » sans objet à l'initiation). Pure présentation : le critère
   * garde sa valeur par défaut côté moteur tant que le champ est masqué.
   */
  visible_si?: string
  /**
   * Valeur indéterminée (DECISIONS.md D20, `docs/decision/validation/chantier-2026-07-26/
   * SPEC-valeur-indeterminee.md` §2.2) : réservé aux critères `bool`/`liste` dont le « non »/« aucun »
   * par défaut NE PEUT PAS être présumé sans risque clinique (ex. une comorbidité qui, non cochée,
   * pourrait n'avoir simplement pas encore été demandée plutôt qu'activement exclue). Quand `true`, le
   * critère est traité comme `nombre`/`enum` : indéterminé tant qu'il n'a pas été explicitement
   * renseigné par le praticien, plutôt que de garder sa valeur par défaut (`false`/`[]`). Absent ou
   * `false` (repli) → comportement historique inchangé : `bool`/`liste` restent déterminés par défaut
   * (une case non cochée EST une réponse clinique). Sans effet sur `nombre`/`enum`, déjà toujours
   * indéterminés tant que non saisis.
   */
  confirmation_requise?: boolean
  /**
   * Borne basse plausible du domaine clinique d'un critère `nombre` (table validée par le référent,
   * `docs/decision/GRAMMAIRE-NOEUD.md`). Triple rôle, aucun lu par le moteur (`evaluateNode` l'ignore) :
   * (1) le formulaire (`components/CriteriaForm.tsx`) la répercute sur l'attribut HTML `min` de l'input,
   * pour bloquer une saisie hors domaine (ex. -1 sur `autres_FDRCV`, qui fait basculer la sortie de
   * `statine` d'un tier à l'autre) ; (2) les deux extracteurs de valeurs candidates du banc
   * (`engine/banc/profils.ts`, `engine/relevance.ts`) écartent tout littéral hors de `[min, max]` trouvé
   * dans une règle du nœud, pour ne plus attribuer à ce critère le seuil littéral d'un AUTRE critère
   * mentionné dans la même expression (ex. le 0,5 d'un ratio dose/poids devenant un poids candidat, les
   * 1000/2000 d'une dose de metformine devenant un DFG candidat) ; (3) sert de domaine de repli pour le
   * tirage aléatoire du banc quand le filtre (2) n'a laissé aucun littéral valide. Optionnel : absent =
   * comportement historique inchangé (aucune borne).
   */
  min?: number
  /**
   * Borne haute plausible du domaine clinique d'un critère `nombre` — voir `min` pour le triple rôle
   * (saisie du formulaire, filtre des valeurs candidates du banc, domaine de repli du tirage). Optionnel,
   * symétrique de `min`.
   */
  max?: number
}

/**
 * Règle de rang conditionnel (DECISIONS.md D14) : si `quand` (condition DSL, ou `"default"` pour le
 * repli) est vraie pour le patient, l'option prend ce `rang`. Utilisée dans `Option.priorite` sous
 * forme de liste évaluée en première-correspondance.
 */
export interface PrioriteConditionnelle {
  quand: string
  rang: number
}

/**
 * Dose/valeur CALCULÉE affichée avec une option (câblage P3) : `expression` (grammaire arithmétique de
 * `engine/deriveCritere.ts`, ex. `poids * 0.15`) évaluée depuis les critères du patient, rendue
 * « libelle : valeur unite ». Omise à l'affichage si non calculable (primitive non saisie).
 */
export interface Calcul {
  libelle: string
  expression: string
  unite?: string
}

export interface Option {
  intitule: string
  avantages: string[]
  inconvenients: string[]
  /** Effet absolu / NNT / NNH, sinon la chaîne `"non chiffrable"`. */
  effet_attendu: string
  /**
   * R2 (`docs/decision/GRAMMAIRE-NOEUD.md`) : délai d'apparition du bénéfice **tel qu'observé dans les
   * essais cités** (« 16-26 mois »), ou `"immédiat"`, ou `"non établi"`.
   *
   * **Affichage seul — le moteur ne le lit jamais.** Un patient a un horizon, une option a un délai ;
   * les rapprocher est l'arbitrage central de la prescription gériatrique, et il revient au praticien.
   * Le calculer automatiquement supposerait de convertir « espérance de vie limitée » en mois, ce qui
   * produirait une fausse précision et un arbitrage clinique caché — interdit par l'invariant 2. L'outil
   * pose les deux faits côte à côte, rien de plus. Quand une réserve explicite est voulue, elle s'écrit
   * comme une alerte portée par l'option, sous la plume du référent.
   */
  delai_benefice?: string
  niveau_preuve: NiveauPreuve
  /**
   * Ids des références de `sources.references_primaires` qui PORTENT les revendications de cette option
   * (son `effet_attendu`, les chiffres de ses `avantages`/`inconvenients`). Ajouté le 2026-07-27.
   *
   * MOTIF, et il vaut d'être retenu : rien ne reliait une option à ses sources, et le décrochage est passé
   * inaperçu deux jours. Des options affichaient un NNT tiré d'un essai que le nœud n'avait jamais versé
   * dans sa bibliographie. L'invariant I8c l'exige désormais pour toute option en preuve `modere` ou
   * `eleve` : revendiquer un niveau de preuve oblige à dire d'où il vient. Une option en preuve `faible`
   * peut s'en passer (accord d'experts, savoir-faire) mais gagne à en porter si une référence existe.
   */
  references?: string[]
  /**
   * Règles d'affichage : expressions booléennes sur les `criteres_entree`, ou `['default']` (repli,
   * seulement si aucune autre option ne s'applique), ou `['toujours']` (systématiquement applicable,
   * ex. socle metformine — D16), soumise à ses `exclusions`.
   */
  conditions: string[]
  /**
   * R6 (`docs/decision/GRAMMAIRE-NOEUD.md`, arbitrage indication/prérequis) : garde-fous de COHÉRENCE,
   * évalués EXACTEMENT comme les `conditions` (même grammaire DSL, mêmes règles d'applicabilité : une
   * option est applicable si TOUTES ses `conditions` ET TOUS ses `prerequis` sont vrais) mais JAMAIS
   * affichés comme justification — `OptionVue.reasons` (`lib/vueDecision.ts`) ne lit que `conditions`.
   *
   * Distinction : une `condition` répond à « pourquoi cette option est proposée à CE patient » (une
   * indication clinique, ex. `ASCVD_etablie == true`) ; un `prerequis` répond à « qu'est-ce qui ne
   * l'empêche pas » (ex. `traitements_en_cours ne_contient_pas iSGLT2` — ne pas déjà prendre la classe ;
   * `classes_a_benefice_indisponibles == false` — la niche de repli n'est pas ouverte) — vrai pour la
   * quasi-totalité des patients, son énoncé n'apprend rien au praticien (double négation illisible pour
   * le second exemple). Les deux sont ÉVALUÉS : une option retirée par un `prerequis` faux est « non
   * retenue », comme pour une condition (R4, `EvaluateNodeResult.nonRetenues`). Seule la première
   * justifie ce qui est montré. Optionnel : absent → comportement rigoureusement identique à avant ce
   * champ.
   */
  prerequis?: string[]
  /** Optionnel : omis dans le gabarit §11 pour les options sans contre-indication propre. Prose
   * d'affichage destinée au lecteur — distincte de `exclusions`, qui est évaluée par le moteur (D13). */
  contre_indications?: string[]
  /**
   * Rang de priorité en mode `multi-options` : les options applicables sont triées par rang
   * croissant (tri stable ; absente = rang le plus faible). Soit un **entier** (rang FIXE, D13),
   * soit une **liste de règles** `{ quand, rang }` (rang CONDITIONNEL, D14 : 1re règle dont `quand`
   * — condition DSL ou `"default"` — est vraie l'emporte). Ignoré en `ordered-first-match`.
   */
  priorite?: number | PrioriteConditionnelle[]
  /**
   * Exclusions dures : expressions DSL (même grammaire que `conditions`). Une option par ailleurs
   * applicable est RETIRÉE si l'une d'elles est vraie, et reportée dans `EvaluateNodeResult.excluded`
   * (jamais en silence). Pendant machine-évaluable des `contre_indications` (prose) — DECISIONS.md D13.
   */
  exclusions?: string[]
  /** Doses/valeurs calculées affichées avec l'option (câblage P3, ex. dose d'initiation = poids × 0,1-0,2 U/kg). */
  calculs?: Calcul[]
  /**
   * RÉFÉRENCE au `libelle` d'une entrée de `Noeud.familles` (correctif « ordre accidentel / badge
   * multi-natures », 2026-07-25) : SECTION d'affichage du panneau de résultats, distincte du rang
   * `priorite` qui reste l'unique base du tri et du regroupement en égalité (`engine/evaluateNode.ts`
   * `groupesParFamille`). Depuis l'introduction de `Noeud.familles`, ni l'ordre des sections ni la
   * sémantique « alternatives vs cumulables » ne sont plus portés par CE CHAMP : ils viennent de
   * l'entrée `familles[]` correspondante (ordre du tableau, `exclusive`). Présentation pure, aucun
   * effet sur la sélection ni le tri. Absent de toutes les options d'un nœud (ou nœud sans `familles`
   * déclarées) → repli sur le rendu à plat historique.
   */
  famille?: string
  /**
   * Alertes PORTÉES PAR CETTE OPTION (`docs/decision/GRAMMAIRE-NOEUD.md`, § additions au schéma) : même
   * forme que `Noeud.alertes` (`quand`, `message`, `niveau`), mais rendues UNIQUEMENT quand cette option
   * est APPLICABLE pour le patient (`lib/vueDecision.ts` `OptionVue.alertes` — jamais dans
   * `EvaluateNodeResult`, cf. docstring `engine/evaluateNode.ts` `evaluateAlertesDeListe`).
   *
   * Distinction avec une alerte de NŒUD (`Noeud.alertes`, DECISIONS.md D15) : celle-ci porte sur la
   * SITUATION du patient (un état, un terrain) — vraie ou fausse indépendamment de ce que le moteur a
   * retenu parmi les options. Une alerte d'OPTION porte sur un GESTE que le moteur propose EFFECTIVEMENT
   * à ce patient — elle n'a de sens que si ce geste est sur la table. Cas réel qui a motivé ce champ : une
   * alerte de nœud sur « un incrétine en cours ou envisagé » s'affichait alors que l'AR GLP‑1 venait
   * justement d'être écarté (garde-fou de terrain) — l'expression `quand` d'une alerte de nœud ne voit que
   * les critères, jamais ce que le moteur a sélectionné.
   *
   * Écrire une clause d'exclusion dans le `quand` d'une alerte de nœud pour obtenir le même effet serait
   * une DUPLICATION : la même information (les conditions/exclusions déjà portées par l'option) serait
   * alors maintenue à deux endroits, et dériverait au premier changement des exclusions de l'option.
   * Optionnel : absent = aucune alerte propre à l'option (comportement identique à avant ce champ).
   */
  alertes?: Alerte[]
}

export interface ReferencePrimaire {
  /**
   * Identifiant court et stable, unique DANS le nœud (`clear-outcomes`, `cards`…). Ajouté le 2026-07-27
   * pour rendre une référence CITABLE depuis une option (`Option.references`). À choisir de façon à
   * survivre à une reformulation du titre : c'est le titre qui bouge, jamais l'id.
   *
   * **OBLIGATOIRE depuis le 2026-07-27 (soir)**, alors qu'il avait été introduit facultatif le matin
   * même. Motif, relevé par la passe adversariale transverse : facultatif, il rendait l'invariant I8
   * CONTOURNABLE — une référence sans id ne pouvait être citée par aucune option, donc aucune option ne
   * pouvait manquer de la citer, donc I8c passait au vert sans rien garantir. Le nœud
   * `cible-glycemique` échappait ainsi INTÉGRALEMENT à I8 : ses 8 références étaient toutes sans id.
   * Un invariant qu'on désactive en omettant un champ facultatif n'est pas un invariant.
   */
  id: string
  titre: string
  annee: number
  lien: string
  type_critere: TypeCritere
}

/**
 * Citation bibliographique d'une revue secondaire indépendante (DECISIONS.md D23) : jamais évaluée par
 * le moteur, jamais le sujet grammatical d'un argument affiché — seulement une référence à côté de la
 * donnée qui, elle, porte l'argument (`Source.synthese_critique.donnee`).
 */
export interface ReferenceCritique {
  nom: string
  /** URL, si disponible. */
  lien?: string
  /** Précision bibliographique libre (référence d'article, restriction d'accès, date d'édition...). */
  detail?: string
}

/**
 * Modèle réorganisé PAR NATURE de source (DECISIONS.md D23), pas par titre de publication : une donnée
 * publiée (`references_primaires`), une synthèse critique INDÉPENDANTE qui interprète ces données
 * (`synthese_critique` — fusion des ex-champs `medicalement_geek`/`prescrire` : Prescrire, Médicalement
 * Geek/DragiWebdo, Minerva, ebmfrance/Duodecim... y sont citables en RÉFÉRENCE, jamais le sujet
 * grammatical de l'argument), une recommandation OFFICIELLE (`reco_officielle` — HAS, SFD, ADA/EASD,
 * KDIGO... des organismes qui émettent une recommandation formelle, à distinguer d'une revue secondaire
 * indépendante même riche en données).
 */
export interface Source {
  references_primaires: ReferencePrimaire[]
  synthese_critique: {
    /** Argument sourcé par la donnée. Chaîne vide acceptée si aucune synthèse critique indépendante n'a été identifiée pour ce nœud. */
    donnee: string
    /** Revues secondaires indépendantes consultées — citables en bibliographie, ne portent jamais elles-mêmes l'argument de `donnee`. */
    references: ReferenceCritique[]
  }
  reco_officielle: {
    /** Organisme(s) émettant une recommandation OFFICIELLE. Une revue secondaire indépendante n'a pas sa place ici — cf. `synthese_critique.references` (D23). */
    source: string
    position: string
    divergence: boolean
    explication: string
  }
}

export interface ChangelogEntry {
  date: string
  auteur: string
  resume: string
  /** Id de l'entrée de veille à l'origine de la modification, si applicable (DECISIONS.md D5). */
  veille_source?: string
}

export interface Meta {
  date_revue: string
  auteur: string
  statut: 'brouillon' | 'valide'
  version: string
  changelog: ChangelogEntry[]
}

/**
 * Alerte clinique conditionnelle (DECISIONS.md D15) : rappel/avertissement affiché quand `quand`
 * (condition DSL, ou `"default"` pour toujours) est vrai pour le patient — indépendant de la
 * sélection des options (ex. « contrôler la cétonémie », « adapter la dose de metformine au DFG »).
 * `niveau` pilote la présentation (info neutre vs point de vigilance).
 */
export interface Alerte {
  quand: string
  message: string
  niveau?: 'info' | 'attention'
}

/**
 * Famille d'actes cliniques déclarée au niveau du NŒUD (correctif « ordre accidentel / badge
 * multi-natures », 2026-07-25) : `option.famille` y fait désormais RÉFÉRENCE (`libelle`). Deux
 * informations explicites que le libellé français seul ne portait pas de façon exploitable par le
 * code (invariant CLAUDE.md 5 — jamais de libellé clinique en dur) :
 * - **l'ordre d'affichage des sections** = l'ordre de CE TABLEAU, indépendant de l'ordre d'écriture
 *   des options dans `Noeud.options` (un réordonnancement du fichier ne change plus rien à
 *   l'affichage — avant, l'ordre dérivait de la 1re apparition dans `options`, donc accidentel) ;
 * - **`exclusive`** : `true` = les options de cette famille sont des ALTERNATIVES (on en choisit
 *   une — le badge « recommandee » se limite alors au groupe d'égalité de TÊTE de la famille) ;
 *   `false` = des gestes CUMULABLES (tout ce qui est affiché est à faire — le badge « recommandee »
 *   va à TOUTES les options affichées de la famille, indépendamment de leur rang respectif).
 */
export interface Famille {
  libelle: string
  exclusive: boolean
}

/** Nœud de décision (brief §5.1). `domaine` obligatoire — module Décision multi-domaine (D8). */
export interface Noeud {
  id: string
  /**
   * Libellé de MODULE regroupant plusieurs nœuds d'un même domaine (DECISIONS.md D22) — valeur de
   * jointure avec `ModuleDecision.libelle` (`content/loadModules.ts`).
   *
   * Ce champ existait dans `schema/noeud.schema.json` et dans le contenu (`module: RHD` sur les deux
   * nœuds RHD) depuis le 2026-07-26, mais **manquait ici** : il n'était donc lu par aucun code, et rien
   * ne le signalait — ni le schéma (le YAML était valide), ni les tests. Ajouté avec l'écran de module.
   * Aucun effet moteur : `evaluateNode` l'ignore.
   */
  module?: string
  domaine: string
  titre: string
  population_cible: string
  criteres_entree: CritereEntree[]
  options: Option[]
  argumentaire: string
  sources: Source
  incertitudes: string[]
  /** Ids d'entrées de veille ayant modifié ce nœud (pont bidirectionnel avec la veille). */
  veille_liee: string[]
  meta: Meta
  /** Mode de sélection des options (D11). Absent = `'multi-options'`. */
  selection?: 'ordered-first-match' | 'multi-options'
  /** Chemin du Markdown d'argumentaire exhaustif — niveau 3 de lecture (D11). */
  argumentaire_exhaustif?: string
  /** Alertes cliniques conditionnelles, évaluées indépendamment des options (D15). */
  alertes?: Alerte[]
  /**
   * POSITIONS DE LECTURE du nœud (DECISIONS.md D24) : énoncés vrais pour TOUS les patients du nœud, qui
   * disent comment lire l'ensemble de ses options. Affichés en tête, avant le formulaire, sans condition.
   *
   * Distinction opposable avec une `Alerte` — ce n'est pas une nuance de style, c'est ce qui décide du
   * champ à employer : une alerte porte sur la SITUATION d'un patient (elle a un `quand`, elle peut être
   * fausse pour lui) ; un cadrage porte sur l'ÉTAT DES PREUVES du nœud (pas de `quand`, il ne peut pas
   * être faux pour un patient particulier). Un énoncé vrai pour certains patients seulement est une
   * alerte, jamais un cadrage.
   *
   * Ce champ existe parce que ces énoncés s'écrivaient auparavant comme des alertes en `quand: "default"`,
   * que D21 (interdit n°2) proscrit : une alerte affichée pour tout le monde ne signale plus rien et
   * dévalue les alertes réellement conditionnelles à côté desquelles elle apparaît. Le défaut n'était pas
   * le texte mais le canal. Aucun effet moteur : `evaluateNode` l'ignore.
   */
  cadrage?: string[]
  /**
   * Familles d'actes cliniques déclarées explicitement (correctif « ordre accidentel / badge
   * multi-natures », 2026-07-25) : ordre d'affichage des sections + `exclusive` (alternatives vs
   * cumulables), référencées par `Option.famille`. Absent → repli intégral sur le rendu à plat
   * historique (voir `Option.famille`, `engine/evaluateNode.ts` `groupesParFamille`).
   */
  familles?: Famille[]
}
