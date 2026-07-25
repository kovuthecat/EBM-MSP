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
}

export interface ReferencePrimaire {
  titre: string
  annee: number
  lien: string
  type_critere: TypeCritere
}

export interface Source {
  references_primaires: ReferencePrimaire[]
  medicalement_geek: {
    synthese: string
    lien: string
  }
  prescrire: {
    synthese: string
  }
  reco_officielle: {
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
   * Familles d'actes cliniques déclarées explicitement (correctif « ordre accidentel / badge
   * multi-natures », 2026-07-25) : ordre d'affichage des sections + `exclusive` (alternatives vs
   * cumulables), référencées par `Option.famille`. Absent → repli intégral sur le rendu à plat
   * historique (voir `Option.famille`, `engine/evaluateNode.ts` `groupesParFamille`).
   */
  familles?: Famille[]
}
