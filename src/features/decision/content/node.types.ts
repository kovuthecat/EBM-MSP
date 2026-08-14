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

import type { NomIcone } from '../../shared/icons/paths.ts'

/** Échelle GRADE simplifiée telle qu'exprimée dans le contenu YAML des nœuds (brief §4/§5.1). */
export type NiveauPreuve = 'eleve' | 'modere' | 'faible' | 'tres_faible'

/** Nature du critère évalué par une référence primaire (brief §4 : dur vs substitution). */
export type TypeCritere = 'dur' | 'mixte' | 'substitution'

/**
 * Une règle de pré-remplissage (`CritereEntree.preremplissage`, K6). Première vraie = retenue.
 *
 * `valeur` — DEUX FORMES depuis T-137 (2026-08-04) : une **chaîne** non vide (forme historique, critère
 * `enum`/`nombre`/`bool`) ou un **tableau de chaînes**, réservé aux critères `type: liste` (`[]` compris
 * — l'usage visé : rendre exprimable « ce critère de type liste vaut *aucun élément* », ex. `intention ==
 * initier` ⇒ `traitements_en_cours = []`). Le pré-remplissage porte déjà les trois propriétés qu'il faut
 * (proposé et non imposé, signalé « · calculé, à vérifier », effacé dès que le praticien répond) ;
 * étendre `valeur` évite de dupliquer le concept dans un second mécanisme `derive`-pour-listes.
 *
 * VÉRIFIÉ PAR `appliquerPreremplissage` (`lib/formLayout.ts`), pas seulement par le schéma : une valeur
 * tableau posée sur un critère non-`liste`, ou une valeur chaîne posée sur un critère `liste`, est
 * REFUSÉE au runtime (garde-fou de code, en miroir de celui déjà en place pour les `enum`).
 */
export interface ReglePreremplissage {
  quand: string
  valeur: string | string[]
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
  /**
   * SAISIE TOLÉRANTE d'un critère `nombre` (2026-08-04, demande utilisateur sur `taille`) : le champ
   * devient un `<input type="text">` (au lieu du `<input type="number">` natif) qui accepte la VIRGULE
   * comme séparateur décimal (« 1,70 » aussi bien que « 1.70 »), et se corrige tout seul si la valeur
   * saisie tombe hors du domaine [`min`, `max`] mais que la diviser par 10 ou 100 l'y ramène (« 170 » →
   * 1,70 si `min`/`max` bornent des mètres). Motif : un `<input type="number">` REFUSE la virgule dans la
   * plupart des navigateurs (le clavier français la tape par réflexe), et une taille en CENTIMÈTRES est la
   * confusion d'unité la plus commune sur ce champ précis.
   *
   * LA CORRECTION D'UNITÉ NE S'APPLIQUE QU'AU FLOU (`CriteriaForm.tsx`) — jamais au moteur : la valeur
   * COMMISE reste toujours en mètres (ou l'unité déclarée par le libellé du champ, cf. `taille`), la
   * correction a simplement lieu AVANT l'écriture dans `criteria`, au blur, jamais pendant la frappe (sans
   * quoi taper « 170 » caractère par caractère se ferait réécrire sous les doigts dès « 17 »).
   *
   * REQUIERT `min`/`max` déclarés (sans eux, aucun domaine où « atterrir » : le champ accepte la virgule
   * mais ne tente aucune correction d'échelle). GÉNÉRIQUE, pas réservé à `taille` (invariant CLAUDE.md 5) :
   * tout critère `nombre` dont l'unité se prête à une confusion d'échelle par 10 peut le déclarer. Optionnel
   * : absent ou `false` → `<input type="number">` natif, comportement historique inchangé.
   */
  unite_flexible?: boolean
  /**
   * SUPPRIME LE LIBELLÉ PROPRE DU CHAMP dans le formulaire (amélioration de lisibilité, 2026-08-01) —
   * opt-in, réservé au champ SEUL dans sa section, dont le titre de `groupe` porte déjà toute
   * l'information (« Je souhaite : » au-dessus des quatre boutons d'intention, par exemple). Répéter le
   * libellé du champ juste en dessous du titre de section était une redondance pure, mesurée sur
   * `prescription` (« Intention thérapeutique (« je souhaite… ») » sous un titre de section « Intention
   * thérapeutique »).
   *
   * PORTÉE EXACTE DE CE QUI DISPARAÎT : le texte du libellé ET ses suffixes (« · détermine la suite »,
   * « · à confirmer », « · repris de votre saisie »). Les marqueurs VISUELS qui ne dépendent pas de ce
   * texte survivent intacts (bord ambre `[data-confirmer]`, aide `CritereEntree.aide`) : seule la ligne
   * de texte redondante est retirée, jamais l'information qu'elle codait ailleurs par la couleur ou la
   * position.
   *
   * OPT-IN EXPLICITE, PAS UNE RÈGLE AUTOMATIQUE (« groupe à un seul champ ⇒ masquer ») : une règle
   * automatique aurait changé le rendu de toute section à champ unique du domaine sans que personne ne
   * l'ait demandé pour elles — ce champ ne fait rien tant qu'aucun contenu ne le déclare explicitement à
   * `true`. Absent ou `false` → rendu historique inchangé.
   */
  libelle_masque?: boolean
  /**
   * CHAMP JAMAIS RENDU DANS LE FORMULAIRE (2026-08-10, demande utilisateur sur `HbA1c_cible`), à ne pas
   * confondre avec `visible_si` : celui-ci masque CONDITIONNELLEMENT (et `reinitialiserChampsMasques`
   * remet alors le critère à sa valeur par défaut dès qu'il devient masqué — sûreté nécessaire puisque le
   * praticien pourrait avoir saisi une valeur avant que le champ ne se masque). `cache: true` masque
   * INCONDITIONNELLEMENT, et à dessein N'EST PAS TRAITÉ PAR `reinitialiserChampsMasques` (cf. sa
   * docstring) : un critère `cache` n'est jamais saisi à l'écran, sa valeur ne peut donc venir que d'une
   * REPRISE (`partage`) ou d'une PUBLICATION (D50) — la réinitialiser au premier rendu détruirait
   * exactement la valeur que ce mécanisme est censé transporter.
   *
   * CAS D'USAGE : `HbA1c_cible` sur `prescription`/`insuline` — la cible n'est plus SAISIE sur ces
   * nœuds, elle est PUBLIÉE par « Déterminer la cible » (D50) et ne sert plus qu'à alimenter le
   * `preremplissage` de `position_vs_cible` (« rapport à l'objectif »), qui reste lui un champ normal,
   * visible et modifiable par le praticien (R1 : l'état reste déclaré, jamais imposé). Le nombre
   * chiffré n'a donc plus de raison d'occuper une case du formulaire.
   *
   * GÉNÉRIQUE (invariant CLAUDE.md 5) : aucun nom de critère connu du socle. Absent ou `false` → rendu
   * historique inchangé (le champ suit `visible_si` comme avant).
   */
  cache?: boolean
}

/**
 * FORME COURTE d'un critère d'entrée (T-188, P14/S15) : référence une DÉFINITION commune de domaine
 * (`content/decision/criteres-communs/<domaine>.yaml`, miroir TS de `criteres-communs.schema.json`, cf.
 * `CritereCommun` ci-dessous) au lieu de la redéclarer. `loadNodes.ts` résout chaque `ref` en
 * `CritereEntree` complet AU CHARGEMENT, avant que quoi que ce soit d'autre voie le nœud — cette forme
 * n'apparaît donc JAMAIS dans un `Noeud` résolu (`Noeud.criteres_entree: CritereEntree[]`, inchangé) : le
 * moteur, le formulaire et le banc ne savent rien de ce mécanisme.
 *
 * N'ADMET QUE `ref` PLUS LES CHAMPS DE MISE EN SCÈNE — c'est le point de conception central (plans/P14/
 * S15.md § Décision clé, principe P2 de la revue du 2026-08-04) : le partage porte sur la DÉFINITION du
 * fait (`type`, `valeurs`, `min`, `max`, `paliers`, `derive`, `partage`, `aide` — aucun n'apparaît ici),
 * jamais sur sa présentation. `presomption_non` est l'EXCEPTION notable : il ressemble à un champ de
 * définition mais reste délibérément LOCAL (D30 — son éligibilité dépend de l'usage du critère DANS CE
 * NŒUD, canal de sécurité ou non, jamais de la définition du fait ; c'est l'asymétrie voulue de
 * `traitements_en_cours`, vérifiée par l'invariant S2/T-165, `engine/banc/coherence-inter-noeuds.test.ts`
 * — la rendre globale la rendrait impossible). Le schéma JSON (`critereEntreeRef`) REFUSE tout autre champ
 * (`additionalProperties: false`) : une entrée qui porterait `ref` ET un champ de définition serait
 * rejetée, plutôt que de réintroduire en silence la divergence que ce mécanisme élimine.
 */
export interface CritereEntreeRef {
  /** Nom du critère dans le fichier de critères communs du domaine de ce nœud. */
  ref: string
  groupe?: string
  debut_de_ligne?: boolean
  libelle_masque?: boolean
  visible_si?: string
  valeurs_visible_si?: Record<string, string>
  masque_si_indetermine?: boolean
  preremplissage?: ReglePreremplissage[]
  /** LOCAL, délibérément — voir la docstring de l'interface. */
  presomption_non?: boolean
  /** MISE EN SCÈNE locale au nœud — voir `CritereEntree.cache`. */
  cache?: boolean
}

/**
 * Une entrée de `FichierCriteresCommuns.criteres` (T-188, P14/S15) — la DÉFINITION d'un fait clinique,
 * partagée par tous les nœuds du domaine qui la référencent via `{ ref: nom }` (`CritereEntreeRef`).
 * Miroir TS de `schema/decision/criteres-communs.schema.json#/definitions/critereCommun`.
 *
 * Porte EXACTEMENT les champs qu'un nœud ne peut plus surcharger une fois qu'il pose un `ref` sur ce
 * `nom` : le même sous-ensemble que la colonne gauche de la table de `plans/P14/S15.md` § Décision clé.
 * `presomption_non` en est absent SANS EXCEPTION (contrairement à `CritereEntreeRef`, qui l'admet
 * lui-même comme champ LOCAL) : ce fichier ne le porte jamais, précisément parce qu'il reste au nœud.
 */
export interface CritereCommun {
  nom: string
  type: 'nombre' | 'bool' | 'enum' | 'liste'
  valeurs?: string[]
  min?: number
  max?: number
  paliers?: number[]
  derive?: string
  partage?: boolean
  aide?: string
  /**
   * Libellés d'actes/classes thérapeutiques que ce fait rend pertinents (ex. `[sulfamide, glinide,
   * insuline]`). AUCUN EFFET MOTEUR NI DE PRÉSENTATION : `loadNodes.ts` ne le recopie PAS sur le
   * `CritereEntree` résolu — n'existe que pour l'invariant prévu en S16 (session ultérieure), qui doit
   * pouvoir dire « ce nœud prescrit une classe concernée par ce fait et ne le voit pas ».
   */
  concerne?: string[]
}

/** Fichier de critères communs d'UN domaine (`content/decision/criteres-communs/<domaine>.yaml`, un
 * fichier par domaine). Miroir TS de `criteres-communs.schema.json` (racine). */
export interface FichierCriteresCommuns {
  domaine: string
  criteres: CritereCommun[]
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
 * Règle d'action CONDITIONNELLE (2026-08-04, demande utilisateur), même forme que
 * `PrioriteConditionnelle` ci-dessus : si `quand` (condition DSL, même grammaire que `conditions`) est
 * vraie AU SENS STRICT (jamais `INDETERMINE`, D20) pour le patient courant, le badge d'action affiché
 * bascule sur `action` PLUTÔT QUE la valeur statique d'`Option.action` — cf. `Option.action_si`.
 */
export interface ActionConditionnelle {
  quand: string
  action: ActionOption
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
 * VALEUR PUBLIÉE par l'option RETENUE d'un nœud à sortie unique (`docs/commun/decisions/
 * 2026-08-06-d50-*.md`, D50, amende D28) : `critere` — un NOM, jamais connu du socle par avance (D8) —
 * reçoit `valeur`, un NOMBRE LITTÉRAL déclaré par le contenu, **jamais une expression calculée, jamais une
 * valeur reprise de la saisie**.
 *
 * AUCUN EFFET MOTEUR : `evaluateNode` ne lit jamais ce champ. La publication a lieu APRÈS que le moteur a
 * rendu son verdict, hors de lui (`screens/DecisionNodeScreen.tsx`, sur la sortie d'`evaluateNode`) — donc
 * jamais dans la boucle de perturbation d'`engine/relevance.ts`. Elle N'A LIEU QU'UNE FOIS LE NŒUD SORTI :
 * un nœud `enAttente` (le moteur ne s'est pas prononcé, R7/D20) ne publie rien.
 *
 * RÉSERVÉ à `Noeud.selection === 'ordered-first-match'` (D50, § « Raison du choix » : seul un nœud à
 * sortie unique a UNE conclusion à publier ; en `multi-options`, plusieurs options concurrentes
 * publieraient des valeurs sans règle d'arbitrage) — NON vérifié par ce type ni par le schéma (une
 * propriété d'option ne voit pas le `selection` de son nœud) : c'est l'écran qui n'agit sur `publie` que
 * pour un nœud `ordered-first-match`.
 *
 * CE QUE `publie` N'EST PAS, et c'est tout le sujet de D50 : PAS un chaînage de règles. La valeur publiée
 * n'atteint JAMAIS une `condition` / un `prerequis` / une `exclusions` / un `derive` / un `visible_si` /
 * ... d'un autre critère — SEUL un `preremplissage` peut la lire (garde-fou opposable de D50, mécanisé par
 * l'invariant dédié d'`engine/banc/invariants-contenu.test.ts`). Elle n'est JAMAIS IMPOSÉE : posée en
 * mémoire de session (`lib/sessionCriteres.ts`, fonction `publierCritere`), elle ne fait que PRÉ-REMPLIR —
 * exactement comme un `preremplissage` de contenu (K6) — un champ d'un AUTRE nœud qui déclare le même nom
 * de critère. Le praticien la voit, l'écran signale son origine (ce nœud + cette option), et il l'écrase
 * d'un geste comme n'importe quel pré-remplissage : ce qui circule reste une SUGGESTION DE SAISIE, jamais
 * une CONCLUSION imposée.
 */
export interface Publication {
  critere: string
  valeur: number
}

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

/**
 * FORME LONGUE d'un item de `Option.posologie_detail` (T-194, P15/S1, 2026-08-11) : le texte **et**,
 * optionnellement, `sources[]` — un second registre de sourçage, séparé de la prose de conduite que le
 * praticien recopie sur l'ordonnance — **et**, depuis T-202 (P15/S8, 2026-08-11), `quand` — un item
 * conditionnel au patient. La forme courte (une simple chaîne) reste valide et strictement équivalente à
 * `{ texte }` sans `sources` ni `quand`.
 *
 * MODÈLE CALQUÉ SUR `ContreIndication` ci-dessus — même principe de conception : un objet OUVERT qui
 * accepte un champ de plus sans casser une seule ligne de YAML existante.
 */
export interface ItemPosologie {
  texte: string
  /**
   * OPTIONNEL — ids résolus contre LES DEUX registres de la bibliographie du nœud :
   * `Source.references_primaires[].id` OU `Source.reco_officielle.references[].id` (arbitrage du
   * 2026-08-11, `plans/P15/index.md` §Arbitrage — une posologie vient légitimement d'un RCP ou d'une
   * table de recommandation, pas seulement d'un essai ; la distinction preuve / reco officielle est déjà
   * la doctrine du projet, D16). Un id absent des deux registres est ignoré EN SILENCE par la carte, par
   * politique (même régime qu'`Option.contre_indications`/`Option.references`) : le signaler est le
   * travail d'un invariant de contenu (S3 du même plan), jamais de ce type ni du composant de rendu.
   */
  sources?: string[]
  /**
   * OPTIONNEL (T-202, P15/S8, 2026-08-11) — expression DSL (même grammaire qu'`exclusions`/`conditions`,
   * même évaluateur `engine/conditions.ts`) sous laquelle CET ITEM est affiché à ce patient. FAUSSE (au
   * sens STRICT, jamais `INDETERMINE`, D20) ⇒ l'item n'est PAS RENDU DU TOUT — DISTINCT de
   * `ContreIndication.condition` ci-dessus, qui ne retire JAMAIS un item (seul son état visuel change,
   * l'item reste affiché désamorcé) : ici un item écarté sort réellement de la liste retenue
   * (`engine/evaluateNode.ts` `evaluerPosologieDetail`), parce qu'il ne décrit PAS la conduite pour ce
   * patient — un item de titration piloté par la MCG chez un patient sans capteur, par exemple, n'a rien
   * à faire à l'écran, à la différence d'une contre-indication qui reste montrée « levée ».
   * INDÉTERMINÉE ⇒ également NON rendu (même politique que `evaluateAlertesDeListe`,
   * `engine/evaluateNode.ts` : « une alerte dont le `quand` est indéterminé ne s'affiche pas »).
   * ABSENTE ⇒ l'item est toujours affiché, comportement historique inchangé.
   *
   * PRÉREQUIS D'ARCHITECTURE (R6, `docs/decision/GRAMMAIRE-NOEUD.md`, encadré « Même prérequis
   * d'architecture », 5ᵉ occurrence documentée) : un critère qui ne pilote QUE la posologie affichée
   * (aucune autre dimension de l'écran ne varie) doit rester vu comme AGISSANT par `engine/relevance.ts`
   * — d'où l'entrée de la liste des items RETENUS dans `lib/vueDecision.ts` `signatureVue`, sans quoi ce
   * critère serait estompé à tort dans le formulaire de saisie. **CE LOT (S8) LIVRE LE MÉCANISME SEUL** :
   * aucun contenu ne déclare encore `quand` (premier usage prévu S9, sur `insuline`).
   */
  quand?: string
  /**
   * OPTIONNEL (2026-08-14, retour utilisateur en consultation sur l'option « AR GLP‑1 ») — marque CET
   * item pour le registre visuel « geste » (`.option-card__posologie-geste`, gras/13px) plutôt que
   * « modalité » (muet/12px, cf. la hiérarchie de lecture documentée dans `OptionCard.tsx`).
   *
   * PURE PRÉSENTATION, AUCUN EFFET MOTEUR — classée `inerte` (`engine/expressionsNoeud.ts`), comme
   * `sources`.
   *
   * POURQUOI CE CHAMP EXISTE — le défaut trouvé : la règle historique (premier paragraphe = geste,
   * `index === 0`, vérifiée sur 17 options) tient pour une option à UN SEUL geste titré par paliers. Elle
   * ne tient plus pour une option À PLUSIEURS MOLÉCULES ALTERNATIVES (ex. « AR GLP‑1 » : liraglutide,
   * sémaglutide, dulaglutide) : le rang de DÉCLARATION dans le YAML, arbitraire, décidait alors seul
   * quelle molécule paraissait visuellement première — sur `prescription.yaml`, c'était liraglutide,
   * la moins prescrite des trois (injection quotidienne contre hebdomadaire).
   *
   * RÉTROCOMPATIBLE PAR CONSTRUCTION : `OptionCard.tsx` ne bascule sur `accent` QUE si au moins un item
   * du tableau le déclare `true` ; en son absence totale, la règle historique (`index === 0`) s'applique
   * inchangée — aucune des 17 options existantes n'a besoin d'être touchée.
   */
  accent?: boolean
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
   * PUBLICATION en mémoire de session (D50, amende D28) — cf. `Publication` ci-dessus pour la doctrine
   * complète (ce que c'est, ce que ça n'est PAS, le garde-fou). Résumé : quand CETTE option est celle que
   * le moteur RETIENT pour un nœud `ordered-first-match`, l'écran écrit `publie.valeur` en mémoire de
   * session sous le nom `publie.critere` — une SUGGESTION pour pré-remplir ce même nom sur un AUTRE nœud,
   * jamais un chaînage de règles. Optionnel, et réservé de fait aux options d'un nœud à sortie unique :
   * absent = comportement rigoureusement inchangé (aucune publication, comme avant ce champ).
   */
  publie?: Publication
  /**
   * Verbe d'action pour piloter un badge couleur à l'écran (SB3) — réservé aux nœuds dont le contenu
   * emploie déjà ce vocabulaire (`prescription`, `insuline`). Optionnel : les 4 autres nœuds
   * n'emploient pas ce vocabulaire et n'en auront jamais besoin.
   */
  action?: ActionOption
  /**
   * SURCHARGE CONDITIONNELLE du badge d'action (2026-08-04, demande utilisateur) — ex. la metformine
   * socle : « Ajouter » pour un patient qui n'en prend pas encore, « Maintenir » pour un patient déjà
   * sous metformine, alors que c'est TOUJOURS LA MÊME OPTION (`conditions: ["toujours"]`, `role: socle`)
   * qui s'affiche dans les deux cas — un `Option.action` statique ne peut représenter qu'UNE valeur.
   *
   * Règles évaluées EN ORDRE, PREMIÈRE VRAIE retenue (même sémantique que `Option.priorite`
   * conditionnel) ; `action` (ci-dessus) reste le REPLI si aucune règle ne matche (y compris
   * indéterminée, D20 — jamais de bascule sur une donnée manquante). PUR AFFICHAGE, calculé une fois par
   * rendu dans `lib/vueDecision.ts` (`OptionVue.actionEffective`), jamais par `evaluateNode` : ne change
   * ni la sélection, ni le tri, ni aucune `condition`/`exclusion` — seulement le mot lu sur la pastille et
   * la couleur de bordure de la carte (`OptionCard.tsx`).
   *
   * Optionnel, générique à tout domaine : absent → `action` seule pilote l'affichage, comportement
   * rigoureusement inchangé.
   */
  action_si?: ActionConditionnelle[]
  /**
   * Option clinique de BAS RANG, proposée faute de mieux (ex. gliptine/sulfamide sans bénéfice sur
   * critère dur, en l'absence d'iSGLT2/AR GLP‑1 disponibles) — DISTINCT de `role` (qui reste `geste` :
   * c'est un choix thérapeutique ordinaire, pas une sécurité ni un repli mécanique `["default"]`).
   *
   * PUR AFFICHAGE (`OptionCard.tsx`) : une étiquette + un attenuement visuel de la carte. Aucun effet
   * sur la sélection, le tri ni le badge `recommandee`/`securite` — une option `bas_rang` peut très
   * bien rester `recommandee` : c'est alors la MEILLEURE option DISPONIBLE pour ce patient, pas la
   * meilleure dans l'absolu, et les deux signaux ont vocation à coexister.
   *
   * Optionnel, générique à tout domaine (invariant CLAUDE.md 5) : absent ou `false` → rendu historique
   * inchangé. Ajouté le 2026-08-04 (demande utilisateur sur `prescription`).
   */
  bas_rang?: boolean
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
   * MOTIFS RÉDIGÉS (P10/S2, T-079), indexés par le **texte exact d'une branche** de `conditions` /
   * `prerequis` de CETTE option. Le motif remplace, pour cette branche et pour elle seule, la branche
   * HUMANISÉE que l'écran affiche par défaut (`lib/conditionText.ts`) — dans « Proposé parce que », dans
   * « Ce rang tient compte de » et dans « Pourquoi pas d'autres options ? ».
   *
   * CARTE OPTIONNELLE ET PARTIELLE, jamais une migration : on n'écrit un motif que pour les branches qui
   * se lisent mal (« DFG > 0 et DFG < 30 et Cible atteinte : non »), partout ailleurs le rendu mécanique
   * reste en place, inchangé.
   *
   * ```yaml
   * conditions:
   *   - "ASCVD_etablie == true OR IMC >= 30"
   * motifs:
   *   "ASCVD_etablie == true": "Maladie cardiovasculaire établie"
   * ```
   *
   * RÈGLE D'INDEXATION — la clé est un TERME `OR` ENTIER (`AND` compris : `"DFG > 0 AND DFG < 30"`),
   * jamais un atome isolé d'une conjonction, jamais une expression contenant encore un `OR`. Seuls les
   * espaces de bord sont ignorés. Une clé mal recopiée ne lèverait rien au runtime — le motif serait
   * ignoré en silence : c'est l'invariant **I24** du banc (`engine/banc/invariants-contenu.test.ts`) qui
   * la refuse, et lui seul. Ne jamais désactiver cet invariant sans retirer ce champ.
   *
   * AUCUN EFFET MOTEUR : `evaluateNode` ne lit pas ce champ (classé `inerte` dans
   * `engine/expressionsNoeud.ts`) — un motif ne rend et ne retire aucune option, il ne fait que remplacer
   * un texte affiché.
   */
  motifs?: Record<string, string>
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
   * COURT APERÇU DE LA POSOLOGIE DE L'OPTION (T-076, P9/S9) — ex. les molécules/doses déjà citées
   * ailleurs dans l'option, jamais un texte différent ni un chiffre recalculé.
   *
   * UNE LIGNE COURTE, PAS UNE PROSE. C'est la contrainte d'origine du champ et elle reste vraie, même si
   * le support a changé (cf. ci-dessous) : il doit tenir sur une ligne condensée.
   *
   * MOTIF D'ORIGINE, ET CE QUI EN RESTE. T-076 l'avait créé pour le titre du `<summary>` REPLIÉ d'alors,
   * qui ne portait qu'un compte de contre-indications (« ⚠ N contre-indication(s), effet attendu et
   * plus ») : un praticien qui cherchait une posologie n'avait aucune raison d'ouvrir le dépli sur la
   * seule promesse de contre-indications (rapport de recette cité par S9). **CE `<summary>` N'EXISTE
   * PLUS** — la refonte P11/S6 (2026-08-01, « carte en une ligne ») l'a remplacé par des panneaux
   * `hidden` ouverts par des pastilles. Ce champ n'est donc plus jamais lu « carte repliée » au sens
   * d'origine. IL N'A PLUS QU'UN SEUL RENDU RÉEL (`OptionCard.tsx`) : la PREMIÈRE LIGNE DU PANNEAU
   * `--posologie`, et **seulement en l'absence de `posologie_detail`** (correctif de redondance du
   * 2026-08-11 — quand les deux champs coexistent, `posologie_detail[0]` dit la même chose en plus précis
   * et en sourcé). Il alimente bien aussi `texteSurvolPosologie`, mais cette valeur est jetée par
   * `PastilleInfo`, dont la bulle affiche son `libelle` depuis le 2026-08-04 : ce n'est pas un second
   * canal d'affichage sur lequel compter.
   *
   * CE QUI EN DÉCOULE POUR LE CONTENU, ET C'EST CONTRE-INTUITIF : sur une option qui porte déjà
   * `posologie_detail`, `apercu` n'est plus affiché nulle part — l'y renseigner ne sert à rien tant que ce
   * champ existe. Sur une option qui n'a que lui (20 des 87 options au 2026-08-11 : 13 sur
   * `prescription`, 6 sur `rhd-activite-physique`, 1 sur `insuline`), il EST toute la posologie du
   * panneau : l'y supprimer viderait le panneau.
   *
   * OPTIONNEL ET GÉNÉRIQUE, appliqué au cas par cas par le contenu — T-076 ne l'avait renseigné que sur
   * l'option statine haute intensité de `statine.yaml`, pour valider le principe avant généralisation.
   * Une option qui ne le porte pas ne rend simplement pas cette ligne.
   */
  apercu?: string
  /**
   * TEXTE DÉTAILLÉ DE POSOLOGIE (schéma de titration, adaptation posologique, conseils d'observance) —
   * 2026-08-04, demande utilisateur : ce texte vivait jusqu'ici dans `avantages` (ex. le protocole de
   * titration de la metformine), ce qui le noyait dans l'argumentaire clinique (bénéfice/risque) au lieu
   * du panneau POSOLOGIE où un praticien qui cherche « comment je prescris » le cherche réellement.
   *
   * DISTINCT d'`apercu`, ET PRIORITAIRE SUR LUI DANS LE PANNEAU (2026-08-11) : `apercu` est UNE LIGNE
   * COURTE, celui-ci est la PROSE COMPLÈTE. Les deux CHAMPS peuvent coexister dans le contenu (16 options
   * le font), mais ils ne s'affichent PLUS tous les deux dans le panneau `--posologie` — le détail y
   * remplace l'aperçu, qui n'y était qu'une redite. `apercu` conserve dans ce cas le survol de la
   * pastille. Cf. la docstring d'`apercu` ci-dessus et celle de tête d'`OptionCard.tsx` pour la cause
   * racine (le `<summary>` pour lequel `apercu` avait été écrit n'existe plus depuis P11/S6).
   *
   * LE PREMIER PARAGRAPHE EST LE GESTE, les suivants ses modalités. Ce n'est pas qu'une convention de
   * rédaction : `OptionCard.tsx` rend `posologie_detail[0]` au premier plan (gabarit de l'intitulé de la
   * carte) et les suivants en retrait. Rédiger le schéma de dose ailleurs qu'en tête enterrerait donc le
   * geste — c'est l'ordre du contenu qui porte la hiérarchie de lecture.
   *
   * DEUX FORMES depuis T-194 (P15/S1, 2026-08-11) : une **chaîne** (forme historique) ou un **objet**
   * `{ texte, sources? }` (`ItemPosologie` ci-dessus), dont `sources[]` porte un second registre de
   * sourçage séparé de la prose. Les deux formes cohabitent dans le même tableau ; une chaîne équivaut
   * exactement à un objet sans `sources`. **Ce lot ne migre aucun contenu** : aucune option n'utilise
   * encore la forme objet, et `OptionCard.tsx` ne la rend pas encore (S2).
   *
   * Optionnel : absent → le panneau posologie retombe sur `apercu` + `calculs` + `calculsEnAttente`.
   */
  posologie_detail?: (string | ItemPosologie)[]
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
 * Citation PRÉCISE d'un texte de recommandation officielle (`Source.reco_officielle.references`) : un
 * organisme + l'endroit exact du texte (numéro d'avis, de recommandation, de tableau, de rubrique de
 * RCP). Jamais évaluée par le moteur.
 *
 * REMPLACE `ReferenceCritique` (2026-08-04). Celle-ci portait les revues secondaires indépendantes de
 * `synthese_critique.references`, canal SUPPRIMÉ : elles s'affichaient à l'écran comme la référence
 * d'une position, ce qui laissait le nom d'une revue tenir lieu de preuve — l'inverse exact de ce que
 * D23 visait en les sortant du sujet grammatical des phrases. Ce qui a été LU pour construire une
 * position reste tracé en commentaire YAML et dans l'argumentaire exhaustif : c'est de la méthode, pas
 * de la preuve, et ça n'a rien à faire sur un écran de consultation.
 */
export interface CitationReco {
  /** Organisme + année, court (ex. « SFD 2025 », « RCP metformine (ANSM) »). */
  nom: string
  /** URL ou DOI, si disponible. */
  lien?: string
  /** Référence interne au texte — c'est ce qui rend la citation vérifiable, sa raison d'être. */
  detail?: string
  /**
   * OPTIONNEL (T-194, P15/S1, 2026-08-11) — identifiant court et stable, unique DANS le nœud, ajouté
   * pour rendre une citation de recommandation officielle CITABLE depuis `Option.posologie_detail[].
   * sources` (arbitrage du 2026-08-11, `plans/P15/index.md` §Arbitrage), au même titre qu'un id de
   * `ReferencePrimaire`. NON REQUIS : ce registre n'en porte aucun aujourd'hui, et le rendre requis
   * casserait les 6 nœuds existants — il ne devient nécessaire que pour une entrée effectivement citée.
   */
  id?: string
}

/**
 * UNE divergence entre la recommandation officielle et la position de l'outil, en forme COMPARABLE
 * (ajouté le 2026-08-04).
 *
 * MOTIF : `reco_officielle.explication` mélangeait convergences et divergences dans un seul paragraphe
 * de prose numéroté « (1)… (2)… (3)… », rendu en bas de panneau sous les deux colonnes. Le lecteur n'y
 * pouvait ni compter les divergences, ni voir pour chacune qui dit quoi, ni sur quelles données l'écart
 * se fonde. Les trois faces d'une divergence sont trois champs distincts, pas trois propositions d'une
 * même phrase.
 *
 * Aucun effet moteur : `evaluateNode` ne le lit pas.
 */
export interface DivergenceReco {
  /** Le point en litige, en quelques mots — sert de titre au bloc. */
  sujet: string
  /** Ce que dit la recommandation, énoncé SANS le contredire dans la même phrase. */
  position_officielle: string
  /** Ce que fait l'outil, et en quoi c'est différent. */
  position_outil: string
  /**
   * SUR QUELLES DONNÉES l'écart se fonde : essais, méta-analyses, ou absence de donnée. Jamais « le
   * référent a tranché », jamais le nom d'une revue de synthèse — une divergence sans appui dans les
   * données n'est pas une divergence argumentée, c'est une préférence (invariant CLAUDE.md 6). « Aucun
   * essai n'a testé ce point » est un appui parfaitement valide.
   */
  appui: string
}

/**
 * Modèle réorganisé PAR NATURE de source (DECISIONS.md D23), pas par titre de publication : une donnée
 * publiée (`references_primaires`), une lecture des données qui les interprète (`synthese_critique`),
 * une recommandation OFFICIELLE (`reco_officielle` — HAS, SFD, ADA/EASD, KDIGO... des organismes qui
 * émettent une recommandation formelle).
 *
 * AMENDEMENT DU 2026-08-04 : `synthese_critique.references` est supprimé (cf. `CitationReco`), remplacé
 * par `appuis` qui pointe vers les ESSAIS de `references_primaires`. L'écran ne cite plus que des
 * sources primaires et des textes officiels.
 */
export interface Source {
  references_primaires: ReferencePrimaire[]
  synthese_critique: {
    /** Argument sourcé par la donnée. Chaîne vide acceptée si le nœud n'a pas de lecture distincte de la recommandation officielle. */
    donnee: string
    /**
     * Ids de `references_primaires` qui portent `donnee` — même mécanique et même raison d'être que
     * `Option.sources_ids` : une position doit dire de quoi elle est tirée. Optionnel.
     */
    appuis?: string[]
  }
  reco_officielle: {
    /** Organisme(s) + année, COURT : c'est un titre de bloc à l'écran, pas un paragraphe d'argumentation. */
    source: string
    /** Citations précises des textes officiels (numéros d'avis, de tableau, de rubrique). Optionnel. */
    references?: CitationReco[]
    /** Ce que la recommandation DIT, énoncé pour lui-même — ni sa critique, ni sa bibliographie. */
    position: string
    divergence: boolean
    /** Les divergences, une par entrée. Absent : l'écran retombe sur `explication` seule (rendu historique). */
    divergences?: DivergenceReco[]
    /** LECTURE D'ENSEMBLE : sur quoi outil et recommandation sont d'accord, et dans quel cadre lire les écarts. */
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
 *
 * `prioritaire_si` (arbitrage référent A3, P10/S10 puis S… suivante, 2026-08-01) : expression DSL
 * optionnelle, MÊME grammaire que `Option.conditions` (`engine/conditions.ts`) — quand elle s'évalue à
 * VRAI (au sens strict, jamais `INDETERMINE`, D20) pour le patient courant, cette famille passe en TÊTE
 * de l'affichage (`engine/evaluateNode.ts` `groupesParFamille`), devant les familles qui ne la portent
 * pas ou dont l'expression n'est pas vraie pour ce patient — une PARTITION STABLE, jamais un tri : entre
 * elles, les familles hissées gardent leur ordre relatif (celui de ce tableau), et les autres aussi.
 * C'est le CONTENU qui décide QUELLE famille remonte et À QUELLE CONDITION (invariant 5, CLAUDE.md) : le
 * moteur se contente d'évaluer l'expression, sans connaître aucun nom de critère ni de famille. Optionnel
 * : absente = cette famille ne peut jamais être hissée, comportement RIGOUREUSEMENT IDENTIQUE à avant ce
 * champ (repli explicite, cf. docstring `groupesParFamille`).
 */
export interface Famille {
  libelle: string
  exclusive: boolean
  prioritaire_si?: string
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
  /**
   * OPTIONNEL — icône affichée à côté du titre sur l'écran de sélection des nœuds
   * (`screens/DecisionDomainsScreen.tsx`). Même principe que `module`/`groupe`/`famille` : un nom porté
   * par le contenu, le composant reste générique (aucun nœud connu par son nom, invariant CLAUDE.md 5).
   * Un nœud sans `icone` reçoit un repli visuel générique côté écran, jamais une erreur. Ajouté 2026-08-05
   * (T-149, amélioration esthétique de l'écran d'accueil du module).
   */
  icone?: NomIcone
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
  /**
   * FAITS COMMUNS DÉLIBÉRÉMENT HORS PÉRIMÈTRE de ce nœud (principe P2, T-189, P14/S16) — cf.
   * `CritereHorsPerimetre` pour la doctrine complète (ce que c'est, ce que ça n'est PAS, l'unique
   * consommateur). Optionnel : absent = aucune exclusion déclarée pour ce nœud, comportement
   * rigoureusement inchangé — l'invariant I33 exige alors que tout fait commun pertinent pour ce nœud
   * soit DÉCLARÉ (forme complète ou `{ ref }`), faute de quoi il signale une absence silencieuse.
   */
  criteres_hors_perimetre?: CritereHorsPerimetre[]
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

/**
 * ENTRÉE de `Noeud.criteres_hors_perimetre` (principe P2 de la revue de conception du 2026-08-04, T-189,
 * P14/S16) : déclare qu'un fait de sécurité du fichier commun de domaine
 * (`content/decision/criteres-communs/<domaine>.yaml`) — CONCERNÉ par une classe/geste que CE nœud
 * prescrit (une valeur de `CritereCommun.concerne` citée dans une `conditions`/`prerequis`/`exclusions`
 * d'au moins une option de ce nœud) — a été délibérément jugé SANS OBJET ici, et pourquoi.
 *
 * DÉCLARATION D'INTENTION OPPOSABLE, PAS UNE EXCLUSION MÉCANIQUE : `evaluateNode` ne lit JAMAIS ce champ,
 * il n'a AUCUN effet sur la sélection, le tri, une exclusion ou une alerte. Le SEUL consommateur est
 * l'invariant du banc I33 (`src/features/decision/engine/banc/invariants-contenu.test.ts`), qui
 * mécanise le principe P2 : « un critère de sécurité déclarable quelque part est évalué (ou explicitement
 * déclaré hors périmètre) par tout nœud qui prescrit une classe concernée ». Sans ce champ, un fait de
 * sécurité qu'un nœud ne voit pas est indiscernable d'un OUBLI ; avec lui, l'absence devient une DÉCISION
 * OPPOSABLE — quelqu'un a lu, jugé, et écrit pourquoi.
 *
 * LES DEUX CHAMPS SONT OBLIGATOIRES ET NON VIDES (schéma, `additionalProperties: false` des deux côtés) :
 * `motif` est lu par un HUMAIN, jamais par la machine — I33 vérifie seulement que ce champ EXISTE et
 * n'est pas vide, jamais ce qu'il dit : c'est son existence, pas son contenu rédactionnel, qui transforme
 * un oubli en décision.
 */
export interface CritereHorsPerimetre {
  /** Nom du fait commun jugé hors périmètre — doit correspondre EXACTEMENT au `nom` d'une entrée de
   * `content/decision/criteres-communs/<domaine>.yaml` (le domaine de ce nœud). */
  nom: string
  /** Pourquoi ce fait, bien que concerné par une classe que ce nœud prescrit, n'a pas d'objet ICI. */
  motif: string
}

/**
 * Nœud TEL QU'ÉCRIT en YAML (T-188, P14/S15) — AVANT la résolution des `{ ref }` de `criteres_entree`.
 * SEUL `loadNodes.ts` importe ce type : c'est la forme brute que lit `import.meta.glob` sur
 * `content/decision/noeuds/**\/*.yaml`, transformée en `Noeud` (résolu, ci-dessus) avant d'être exposée
 * par `export const noeuds`. Aucun autre fichier ne doit importer `NoeudBrut` — le moteur, le formulaire
 * et le banc travaillent exclusivement sur `Noeud`/`CritereEntree`, complets, sans savoir que ce
 * mécanisme existe (c'est tout le point de résoudre AVANT que quoi que ce soit d'autre voie le nœud).
 */
export interface NoeudBrut extends Omit<Noeud, 'criteres_entree'> {
  criteres_entree: (CritereEntree | CritereEntreeRef)[]
}
