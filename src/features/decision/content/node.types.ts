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

/** Une règle de pré-remplissage (`CritereEntree.preremplissage`, K6). Première vraie = retenue. */
export interface ReglePreremplissage {
  quand: string
  valeur: string
}

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
   * EXCEPTION, champ par champ, au repli « fail open » de `visible_si` (D20/R7, `lib/formLayout.ts`
   * `champEstVisible`). Ajouté le 2026-07-29 (recette référent).
   *
   * LA POLITIQUE PAR DÉFAUT NE CHANGE PAS, et c'est le point : un `visible_si` INDÉTERMINÉ (le critère
   * qu'il interroge n'a pas encore été répondu) laisse le champ VISIBLE, parce que masquer sur une donnée
   * inconnue REMET LE CHAMP À SA VALEUR PAR DÉFAUT (`reinitialiserChampsMasques`) — donc affirme une
   * valeur que personne n'a donnée. Ce repli protège des champs réels ailleurs et ne se retire pas.
   *
   * `masque_si_indetermine: true` inverse ce repli POUR CE SEUL CRITÈRE : il reste masqué tant que son
   * `visible_si` n'est pas VRAI. Le constat qui l'a motivé : sur un formulaire vierge, « Dose de
   * metformine » et « Nature de l'intolérance » s'affichaient d'emblée, alors qu'elles n'ont aucun sens
   * avant que la case dont elles dépendent soit cochée — et se masquaient correctement seulement après
   * avoir été cochées PUIS décochées. Une sous-question posée avant sa question principale n'est pas une
   * prudence, c'est du bruit.
   *
   * CONDITION D'EMPLOI, à vérifier avant de le poser : la valeur par défaut du critère doit être VIDE
   * (`nombre` non saisi, `liste` vide, `bool` faux), de sorte que le masquage initial n'efface rien. Le
   * danger que le repli par défaut prévient — effacer en silence une saisie déjà faite — n'existe pas
   * tant que le champ n'a pas pu être rempli, ce qui est exactement le cas d'une sous-question masquée
   * depuis l'ouverture du formulaire. Ne PAS le poser sur un critère `partage` (une valeur reprise d'un
   * autre nœud arriverait déjà remplie) ni sur un critère qui porte un `preremplissage`.
   *
   * GÉNÉRIQUE (invariant CLAUDE.md 5) : aucun nom de critère n'est connu du socle — n'importe quel
   * critère de n'importe quel domaine obtient ce comportement en le déclarant. Absent ou `false` →
   * repli « fail open » historique, rigoureusement inchangé.
   */
  masque_si_indetermine?: boolean
  /**
   * CE CHAMP COMMENCE UNE NOUVELLE LIGNE de la grille du formulaire (`grid-column-start: 1`). Ajouté le
   * 2026-07-29 (recette référent).
   *
   * LE PROBLÈME, qui n'est pas cosmétique : la grille à 2 colonnes remplit les champs dans l'ordre du
   * contenu, donc la COLONNE d'un champ dépend de la PARITÉ de ce qui le précède — or ce qui le précède
   * apparaît et disparaît selon `visible_si`. « HbA1c actuelle » et « HbA1c cible » se retrouvaient ainsi
   * côte à côte ou séparées par un saut de ligne selon que « Dose de metformine » (juste avant, masquée
   * tant que la metformine n'est pas cochée) était affichée ou non. Deux champs qui se lisent ensemble
   * changeaient de disposition sans que rien les concernant n'ait changé.
   *
   * POSÉ SUR LE PREMIER CHAMP D'UNE PAIRE, il suffit à la stabiliser : le champ est renvoyé en colonne 1
   * (la grille saute une case si besoin), et le champ suivant tombe donc TOUJOURS en colonne 2, à côté de
   * lui. Aucun appariement explicite à déclarer, aucune référence croisée entre critères à maintenir —
   * c'est ce qui a fait préférer ce mécanisme à un `paire_avec: <nom>` : une seule information locale,
   * portée par le champ qui ouvre la ligne, au lieu d'un lien à tenir cohérent des deux côtés.
   *
   * LIMITE À CONNAÎTRE : sans effet utile si le champ SUIVANT occupe toute la largeur (un `liste` ou un
   * `enum` court, rendus `--wide`) — la paire est alors impossible par construction, et le champ marqué
   * reste simplement seul sur sa ligne. Sans effet non plus en une seule colonne (écrans étroits), où la
   * question ne se pose pas. Pure présentation, aucun effet moteur. Absent → flux naturel de la grille.
   */
  debut_de_ligne?: boolean
  /**
   * Valeur indéterminée (DECISIONS.md D30, amende D20 ; `docs/decision/validation/chantier-2026-07-26/
   * SPEC-valeur-indeterminee.md` §2.2) — NOUVEAU DÉFAUT depuis D30 : un critère `bool`/`liste` non
   * renseigné est INDÉTERMINÉ, exactement comme `nombre`/`enum`. `presomption_non: true` est
   * l'EXCEPTION, réservée aux critères dont le défaut (`false`/`[]`) est une déclaration explicite de
   * contenu sûre à présumer tant que non répondu — établi mécaniquement (ne participe à aucune
   * condition d'option `role: securite` ni à aucune `exclusions` du nœud), jamais deviné. Absent ou
   * `false` (repli, désormais le cas par défaut) → le critère reste indéterminé tant qu'il n'a pas été
   * explicitement renseigné par le praticien. Sans effet sur `nombre`/`enum` (déjà toujours
   * indéterminés tant que non saisis) ni sur un critère `derive` (`critereEstDetermine`,
   * `engine/deriveCritere.ts`, ne l'évalue jamais sur un dérivé).
   *
   * RENOMMÉ le 2026-07-28 (P4/S1, T-018) depuis `confirmation_requise` — MÊME CHAMP, SENS INVERSÉ :
   * `confirmation_requise: true` signifiait « ce bool reste indéterminé sauf confirmation » (exception
   * à l'ancien défaut « déterminé ») ; `presomption_non: true` signifie l'inverse littéral, « ce bool
   * PEUT être présumé faux » (exception au nouveau défaut « indéterminé »).
   */
  presomption_non?: boolean
  /**
   * TEXTE D'AIDE À LA SAISIE, affiché sous le champ. Ajouté le 2026-07-27 pour la fusion des trois signes
   * d'appel TCA de `rhd-alimentation` — le référent a arbitré qu'ils formaient UNE question de repérage et
   * non trois, mais les trois items de l'encadré 11 de la HAS devaient rester lisibles. Générique, et pas
   * un correctif ponctuel : il répond aussi au constat de recette sur les libellés bruts.
   *
   * Ce qu'il n'est PAS : ni une justification clinique (elle vit dans `argumentaire`/`avantages`/`sources`),
   * ni une alerte (qui a un `quand` et porte sur le patient). Le libellé répond à « quel champ ? »,
   * l'aide à « qu'est-ce que je coche exactement ? ». Aucun effet moteur.
   */
  aide?: string
  /**
   * MASQUE UNE VALEUR d'un critère `liste`, plutôt que le champ entier (A4/F, 2026-07-27). Clé = une
   * valeur déclarée dans `valeurs` ; valeur = l'expression DSL sous laquelle cette case est PROPOSÉE. Une
   * valeur absente de cet objet est toujours proposée.
   *
   * Le contenu réclamait ce champ de lui-même — « `visible_si` porte sur un champ entier : impossible de
   * masquer UNE valeur d'une liste dont les quatre autres restent pertinentes ». Chez un patient déclaré
   * naïf d'insuline, « Insuline basale » et « Insuline rapide » restaient cochables dans
   * `traitements_en_cours`. Le contournement employé deux fois (scinder la valeur en critère propre) ne
   * passe pas à l'échelle sur un critère PARTAGÉ entre plusieurs nœuds.
   *
   * MÊME SÉMANTIQUE que `visible_si`, et ce n'est pas un détail : une expression INDÉTERMINÉE laisse la
   * valeur VISIBLE (R7/D20 — on ne masque jamais sur une donnée qu'on ignore encore). MÊME SÛRETÉ aussi :
   * une valeur cochée puis masquée est RETIRÉE de la saisie, sans quoi elle continuerait de piloter le
   * moteur en silence pendant que l'écran affirme le contraire.
   */
  valeurs_visible_si?: Record<string, string>
  /**
   * Cette valeur SAISIE peut être REPRISE d'un nœud à l'autre dans la même session (K6, décision référent
   * du 2026-07-27). Sortir d'un nœud et y revenir remettait le formulaire à zéro : chaque nœud est monté à
   * neuf, et rien ne circulait.
   *
   * CE QUI CIRCULE EST UNE VALEUR SAISIE PAR LE PRATICIEN, JAMAIS UNE CONCLUSION DU MOTEUR — c'est
   * exactement la distinction que le garde-fou R1 protège (aucun chaînage entre nœuds), et elle est
   * respectée. La valeur est PRÉ-REMPLIE, jamais imposée : l'écran signale d'où elle vient et le praticien
   * peut la corriger.
   *
   * Périmètre conforme à l'invariant CLAUDE.md 1 : mémoire de session, aucune écriture disque, aucun
   * réseau, remise à zéro complète au rechargement (« un reload de la page reset tout »).
   *
   * DÉCLARÉ PAR LE CONTENU et non par le socle : celui-ci n'a pas le droit de connaître `HbA1c_cible` par
   * son nom (D8). Un critère `partage` doit être déclaré à l'IDENTIQUE partout où il apparaît — invariant
   * du banc, sans quoi on ferait circuler un concept sous un nom commun avec deux encodages (dette I4).
   */
  partage?: boolean
  /**
   * PRÉ-REMPLISSAGE CALCULÉ d'un critère SAISI (K6). La première règle dont le `quand` est vrai AU SENS
   * STRICT fournit la valeur ; une expression indéterminée ne pré-remplit rien — on ne devine pas sur une
   * donnée manquante (R7/D20).
   *
   * NE S'APPLIQUE QUE TANT QUE LE PRATICIEN N'A PAS RÉPONDU LUI-MÊME. Dès qu'il touche au champ, le
   * pré-remplissage cesse définitivement : « sinon c'est la position à la cible DÉCLARÉE qui fait foi »
   * (référent). Le critère reste donc déclaré au sens de R1 — ce mécanisme propose un point de départ, il
   * ne transforme pas un critère saisi en critère `derive`.
   *
   * Même idiome que la suggestion d'espérance de vie déjà en place dans l'écran, mais DÉCLARÉ PAR LE
   * CONTENU au lieu d'être codé en dur.
   */
  preremplissage?: ReglePreremplissage[]
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
  /**
   * PALIERS STANDARD d'un critère `nombre` (recette référent du 2026-07-29) : la liste FERMÉE des valeurs
   * proposées à la saisie. Le formulaire (`components/CriteriaForm.tsx`) rend alors un SÉLECTEUR au lieu
   * du champ numérique libre.
   *
   * GÉNÉRIQUE, et pas un correctif ponctuel (invariant CLAUDE.md 5) : beaucoup de grandeurs cliniques ne
   * se prescrivent pas en valeurs arbitraires mais par paliers (dosages de comprimés, doses journalières,
   * paliers d'escalade). Une dose de metformine à 1743 mg/j n'existe pas ; un champ libre invite pourtant
   * à la saisir, tout en coûtant plus de gestes qu'un choix dans une liste.
   *
   * LE TYPE RESTE `nombre` ET LA VALEUR STOCKÉE RESTE UN NOMBRE, et c'est le point de conception : les
   * comparaisons numériques du DSL (`dose_metformine > 2000`) continuent de fonctionner à l'identique.
   * Basculer le critère en `enum` aurait cassé ces seuils — `engine/conditions.ts` n'admet que `==`/`!=`
   * sur une énumération, jamais un ordre.
   *
   * AUCUN EFFET MOTEUR : `evaluateNode` ne lit pas ce champ, et rien n'en déduit une validation — une
   * valeur hors paliers (reprise de session, pré-remplissage, profil du banc) reste valide. Ce champ
   * restreint la SAISIE, il ne redéfinit pas le domaine (que `min`/`max` continuent seuls de borner).
   *
   * RÈGLE D'AUTEUR : les paliers doivent encadrer chaque seuil littéral que les règles du nœud appliquent
   * à ce critère (au moins une valeur de part et d'autre), sans quoi le sélecteur rendrait une branche des
   * règles inatteignable à la saisie. Absent → champ numérique libre (comportement historique inchangé).
   */
  paliers?: number[]
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

/**
 * CE QU'UNE OPTION EST (arbitrage A3, 2026-07-27). Le contenu n'avait aucun moyen de le dire : `priorite`
 * portait trois sens incompatibles à la fois — ordre de tri (D13/D14), porte d'affichage pour le repli,
 * marqueur de socle via le rang 0 — et le seul indice restant de la nature d'une carte était un LIBELLÉ DE
 * FAMILLE en français, que le moteur a interdiction de lire (invariant CLAUDE.md 5 / D8).
 *
 * C'est ce manque qui explique cinq constats de recette d'un coup : le socle metformine préemptait tout
 * l'écran, le repli d'affichage a caché une carte de sécurité, l'option terminale de `statine` n'est
 * protégée que par sa POSITION dans le fichier, le « pourquoi pas d'autres options » est pollué, et deux
 * options `default` coexistent sur `prescription` sans qu'on puisse les distinguer.
 *
 * - `socle` — le geste de fond, proposé quel que soit le reste (sentinelle `conditions: ["toujours"]`) ;
 * - `securite` — à faire d'emblée, **jamais replié ni plafonné** : un fait de sécurité ne se négocie pas
 *   contre la place à l'écran ;
 * - `geste` — une piste thérapeutique ordinaire, le cas courant ;
 * - `repli` — ce qu'on propose quand rien d'autre ne s'applique (sentinelle `conditions: ["default"]`).
 */
export type RoleOption = 'socle' | 'securite' | 'geste' | 'repli'

/**
 * Verbe d'action pour piloter un badge couleur à l'écran (SB3) — réservé aux nœuds dont le contenu
 * emploie déjà ce vocabulaire (`prescription`, `insuline`). Les 4 autres nœuds (cible-glycemique,
 * statine, rhd-alimentation, rhd-activite-physique) n'ont pas ce vocabulaire et ne doivent jamais
 * le recevoir de force.
 */
export type ActionOption = 'ajouter' | 'remplacer' | 'arreter' | 'reduire' | 'maintenir'

/**
 * FORME LONGUE d'une contre-indication (T-068, P9) : le texte **et**, optionnellement, la `condition`
 * qui dit quand ce risque s'applique réellement à ce patient. La forme courte (une simple chaîne) reste
 * valide et strictement équivalente à `{ texte }` sans `condition`.
 *
 * CE N'EST PAS UN SECOND MÉCANISME D'EXCLUSION, et c'est la seule chose à retenir avant d'en écrire une :
 * `exclusions` (D13) RETIRE une option quand elle est vraie ; une `condition` de contre-indication ne
 * retire rien — ni l'option, ni la contre-indication elle-même, qui reste affichée dans tous les cas.
 * Elle ne fixe que son ÉTAT VISUEL (`engine/evaluateNode.ts` `evaluerContreIndications`) :
 *
 * | `condition` | sens clinique | rendu |
 * | --- | --- | --- |
 * | absente | non vérifiable automatiquement (ex. « alcoolisme ») | affichée, comme avant ce champ |
 * | vraie | s'applique à ce patient | affichée — c'est l'alerte active |
 * | fausse | le critère saisi l'exclut | **désamorcée, pas effacée** : en retrait, avec la mention |
 * | indéterminée | un critère qu'elle lit n'est pas renseigné | affichée normalement (D20) |
 *
 * La POLARITÉ est celle d'une `exclusion` (vraie = le fait est là), pas celle d'une `condition`
 * d'applicabilité de l'option : `condition: "DFG < 30"` se lit « cette contre-indication vaut pour un
 * DFG < 30 », jamais « cette option n'est proposée qu'en dessous de 30 ».
 */
export interface ContreIndication {
  texte: string
  condition?: string
}

export interface Option {
  intitule: string
  /**
   * Nature de l'option (A3). Obligatoire — un nœud qui n'en déclare pas est refusé par le schéma. La
   * cohérence avec les deux sentinelles de `conditions` est vérifiée par un invariant du banc DANS LES
   * DEUX SENS : une déclaration qui dérive de la mécanique serait pire que pas de déclaration du tout.
   */
  role: RoleOption
  /**
   * Verbe d'action pour piloter un badge couleur à l'écran (SB3) — réservé aux nœuds dont le contenu
   * emploie déjà ce vocabulaire (`prescription`, `insuline`). Optionnel : les 4 autres nœuds
   * n'emploient pas ce vocabulaire et n'en auront jamais besoin.
   */
  action?: ActionOption
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
  /**
   * Optionnel : omis dans le gabarit §11 pour les options sans contre-indication propre. Prose
   * d'affichage destinée au lecteur — distincte de `exclusions`, qui RETIRE l'option (D13) ; une
   * contre-indication, elle, reste toujours affichée.
   *
   * DEUX FORMES depuis T-068 (P9) : une **chaîne** (forme historique — contre-indication non vérifiable
   * automatiquement, ex. « alcoolisme ») ou un **objet** `{ texte, condition }` dont la `condition`
   * (même DSL qu'`exclusions`) ne retire rien mais fixe l'ÉTAT VISUEL de la contre-indication
   * (`ContreIndication` ci-dessus, `engine/evaluateNode.ts` `evaluerContreIndications`). Les deux formes
   * cohabitent dans le même tableau ; une chaîne équivaut exactement à un objet sans `condition`.
   */
  contre_indications?: (string | ContreIndication)[]
  /**
   * COURT APERÇU DU CONTENU DE L'OPTION (T-076, P9/S9), affiché dans le titre du `<summary>` REPLIÉ,
   * avant même de l'ouvrir — ex. les molécules/doses déjà citées dans `contre_indications`, jamais un
   * texte différent ni un chiffre recalculé.
   *
   * MOTIF : le titre du dépli ne portait jusqu'ici qu'un compte de contre-indications (« ⚠ N
   * contre-indication(s), effet attendu et plus ») ou un libellé générique, jamais un extrait du
   * contenu utile — un praticien qui cherche une posologie n'avait aucune raison de l'ouvrir sur la
   * seule promesse de contre-indications (rapport de recette cité par S9).
   *
   * UNE LIGNE COURTE, PAS UNE PROSE : ce champ est fait pour tenir sur la même ligne que le compte de
   * contre-indications (`OptionCard.tsx`, `libelleSummary`).
   *
   * OPTIONNEL ET GÉNÉRIQUE, appliqué au cas par cas par le contenu — T-076 ne l'a renseigné QUE sur
   * l'option statine haute intensité de `statine.yaml`, pour valider le principe avant une éventuelle
   * généralisation (hors périmètre de cette session). Une option qui ne le porte pas garde le rendu
   * actuel du titre, rigoureusement inchangé.
   */
  apercu?: string
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
  /**
   * RELATIONS ENTRE CRITÈRES qui doivent rester vraies : une saisie qui en viole une décrit un patient
   * **impossible**, pas un patient rare. Ajouté le 2026-07-27 (défaut K3 de la seconde recette :
   * `TBR = 1` avec `TBR sévère = 95` était accepté sans un mot, et le nœud en tirait trois cartes
   * « Recommandée » dont un ajout de bolus, chez un patient que la saisie décrit comme passant 95 % du
   * temps en hypoglycémie sévère).
   *
   * Même DSL que `conditions` — la comparaison entre deux critères numériques (`TBR_severe <= TBR`) a
   * été ajoutée à `engine/conditions.ts` pour ce champ, en extension pure d'un chemin qui n'existait
   * qu'en erreur.
   *
   * DEUX CONSOMMATEURS, et c'est le point : le FORMULAIRE signale la contrainte violée (jamais de
   * correction automatique — le praticien seul sait laquelle des deux valeurs est fausse), et le BANC
   * (`engine/banc/profils.ts`) cesse d'engendrer des profils qui la violent. Sans le second, le banc
   * dépense ses profils sur des états impossibles et fige leur sortie absurde dans un golden master.
   *
   * AUCUN effet sur la sélection : `evaluateNode` ne lit pas ce champ.
   */
  contraintes?: Contrainte[]
}

/**
 * Une RELATION ENTRE CRITÈRES qui doit rester vraie (`Noeud.contraintes`). Porte son `message` plutôt que
 * de laisser l'écran afficher son expression : « TBR_severe <= TBR » ne dit rien à un praticien, et le
 * signalement doit expliquer POURQUOI la combinaison est impossible pour qu'il puisse choisir laquelle des
 * deux valeurs corriger. L'outil ne le sait pas — il signale, il ne tranche pas.
 */
export interface Contrainte {
  /** Expression DSL qui doit rester VRAIE. Indéterminée (opérande non renseigné) ⇒ jamais violée. */
  expression: string
  /** Ce que le praticien lit quand elle est violée. En langage clinique, sans citer l'expression. */
  message: string
}
