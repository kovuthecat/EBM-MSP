/**
 * Mise en page du formulaire de critères (P3 · S7‑ui Lot 2) — GÉNÉRIQUE, aucun nœud ni critère connu
 * par son nom (CLAUDE.md invariant 5 / DECISIONS.md D8). Deux mécanismes, tous deux pilotés par le
 * CONTENU (`groupe`, `visible_si` de `criteres_entree`), pour que l'ordre de saisie suive le
 * raisonnement de consultation au lieu du type de donnée :
 *
 *  - **Visibilité conditionnelle** (`visible_si`) : un champ sans objet pour la situation en cours est
 *    masqué, pas seulement estompé (ex. « traitements en cours » quand l'intention est d'INITIER ;
 *    « nature de l'intolérance » quand il n'y a pas d'intolérance). Pure présentation : le critère garde
 *    sa valeur par défaut côté moteur — masquer un champ ne change donc jamais la sortie de `evaluateNode`
 *    tant que le contenu déclare `visible_si` cohérent avec les règles (cf. `champsMasquesInfluents`).
 *  - **Groupes** (`groupe`) : sections dans l'ordre de PREMIÈRE apparition des critères, libellé rendu
 *    tel quel. Le repli (aucun `groupe` déclaré) rend une section unique = comportement historique.
 *
 * Ce module ne décide d'AUCUNE sémantique clinique : il n'invente ni intitulé de section, ni ordre, ni
 * règle de visibilité — tout vient du YAML, donc de l'auteur du contenu.
 *
 * VALEUR INDÉTERMINÉE (DECISIONS.md D20, `docs/decision/validation/chantier-2026-07-26/
 * SPEC-valeur-indeterminee.md` §2, point 5 de la tâche) : `champEstVisible` accepte un troisième
 * paramètre optionnel `renseignes` — un `visible_si` INDÉTERMINÉ rend le champ **VISIBLE**, jamais
 * masqué. Justification : masquer un champ sur une donnée qu'on ignore encore le réinitialiserait à sa
 * valeur par défaut (`reinitialiserChampsMasques`), ce qui AFFIRMERAIT une valeur — exactement le défaut
 * que ce chantier corrige (un champ masqué à tort sur `intention` non renseignée, par exemple, effacerait
 * silencieusement un `traitements_en_cours` déjà saisi). Mieux vaut montrer un champ qui se révélera
 * sans objet une fois le champ dont il dépend renseigné, que masquer — et donc potentiellement
 * réinitialiser — un champ dont on ne sait pas encore s'il l'est. `grouperChamps`/
 * `reinitialiserChampsMasques`/`champsVisibles` acceptent le même paramètre optionnel et le traduisent,
 * UNE SEULE FOIS par appel (pas par champ), en ensemble EFFECTIF via `determinesEffectifs`
 * (`engine/deriveCritere.ts`) avant de le transmettre à `champEstVisible`. Absent (repli) : comportement
 * RIGOUREUSEMENT INCHANGÉ, comme partout ailleurs dans ce chantier.
 */
import type { CritereEntree } from '../content/node.types.ts'
import type { Criteria, CriteriaValue } from '../engine/conditions.ts'
import { INDETERMINE, evaluateCondition } from '../engine/conditions.ts'
import { calculerCriteresDerives, determinesEffectifs } from '../engine/deriveCritere.ts'

/** Une section du formulaire : un libellé (issu du contenu) et ses champs saisissables visibles. */
export interface GroupeChamps {
  /** Libellé de section tel que déclaré dans le contenu ; `undefined` = section sans titre (repli à plat). */
  libelle: string | undefined
  champs: CritereEntree[]
}

/**
 * Valeur de départ générique d'un critère (T-006 étape 1), sans aucune connaissance clinique
 * (CLAUDE.md invariant 5) : `nombre` → 0, `bool` → false, `enum` → la première valeur déclarée,
 * `liste` → tableau vide. Sert à la fois à l'initialisation du formulaire et à la remise à zéro d'un
 * champ redevenu masqué (`reinitialiserChampsMasques`) — une seule définition, pas deux.
 */
export function valeurParDefaut(critere: CritereEntree): CriteriaValue {
  if (critere.type === 'nombre') return 0
  if (critere.type === 'bool') return false
  if (critere.type === 'liste') return []
  return critere.valeurs?.[0] ?? ''
}

/**
 * Construit l'état initial des critères depuis `criteres_entree`. Garantit que chaque critère du nœud
 * est présent dans l'objet renvoyé, pour que `evaluateNode`/`evaluateCondition` ne lève jamais une
 * "variable de critère inconnue" (`ConditionError`, `engine/conditions.ts`) sur un critère simplement
 * pas encore modifié à l'écran. Un critère `liste` initialisé comme une chaîne (au lieu d'un tableau)
 * ferait lever `contient`/`ne_contient_pas` dès la 1re évaluation (`conditions.ts` : "réservé aux
 * critères de type liste") — non rattrapé, d'où l'écran blanc autrefois constaté sur le nœud C.
 */
export function buildDefaultCriteria(criteresEntree: CritereEntree[]): Criteria {
  const criteria: Criteria = {}
  for (const critere of criteresEntree) criteria[critere.nom] = valeurParDefaut(critere)
  return criteria
}

/**
 * Le champ est‑il visible pour ces critères ? `visible_si` absent → toujours visible. L'expression est
 * évaluée sur les critères DÉRIVÉS inclus (mêmes variables que les règles du moteur). Une expression
 * invalide ne doit pas faire disparaître un champ en silence : on relaie l'erreur (même parti pris que
 * `DecisionNodeScreen` — propager plutôt que masquer un écart contenu/moteur).
 *
 * `renseignes` (D20, cf. docstring de tête) : un `visible_si` qui s'évalue à `INDETERMINE` rend le champ
 * VISIBLE (`!== false`, pas seulement `=== true`) — jamais masqué sur une donnée inconnue. ATTENDU DÉJÀ
 * EFFECTIF (fold bool/liste + dérivés déterminés) : cette fonction, générique, ne connaît aucun `type`
 * de critère — c'est aux appelants (`grouperChamps`/`reinitialiserChampsMasques` ci-dessous) de le
 * calculer, une seule fois par appel plutôt qu'une fois par champ.
 */
export function champEstVisible(
  critere: CritereEntree,
  criteriaDerives: Criteria,
  renseignes?: ReadonlySet<string>,
): boolean {
  // `cache` masque INCONDITIONNELLEMENT (2026-08-10) : à distinguer de `visible_si` ci-dessous, dont le
  // masquage est repris par `reinitialiserChampsMasques` (remise à la valeur par défaut). Un champ
  // `cache` n'entre PAS dans ce mécanisme (cf. la boucle dédiée dans `reinitialiserChampsMasques`) —
  // c'est cette fonction-ci qui reste néanmoins la seule source de vérité pour le RENDU du formulaire
  // (`grouperChamps`), d'où le court-circuit ici plutôt qu'une seconde fonction de visibilité.
  if (critere.cache === true) return false
  if (critere.visible_si == null) return true
  const verdict = evaluateCondition(critere.visible_si, criteriaDerives, renseignes)
  // OPT-IN FAIL-CLOSED (`masque_si_indetermine`, 2026-07-29) : le repli « fail open » ci-dessus reste LA
  // POLITIQUE PAR DÉFAUT et n'est pas touché — un contenu peut seulement s'en EXCEPTER, champ par champ.
  // Cf. la docstring du champ dans `content/node.types.ts` pour la condition d'emploi (une sous-question
  // dont le défaut est vide, donc sans valeur à effacer en la masquant).
  if (verdict === INDETERMINE) return critere.masque_si_indetermine !== true
  return verdict !== false
}

/**
 * VALEURS d'un critère `liste` actuellement PROPOSÉES (A4/F, 2026-07-27). Le contenu peut masquer une
 * valeur sans masquer le champ : `valeurs_visible_si` associe à une valeur l'expression sous laquelle elle
 * reste cochable.
 *
 * MÊME RÈGLE QUE `champEstVisible`, et pour la même raison : `!== false`, donc une expression INDÉTERMINÉE
 * laisse la valeur VISIBLE. On ne retire jamais une case au praticien sur une donnée qu'on ignore encore
 * (R7/D20) — le sens sûr du doute est de montrer, pas de cacher.
 *
 * Un critère sans `valeurs_visible_si` renvoie ses `valeurs` telles quelles, même référence : le chemin
 * courant ne paie rien pour un mécanisme qu'un seul critère utilise aujourd'hui.
 */
export function valeursProposees(
  critere: CritereEntree,
  criteriaDerives: Criteria,
  renseignes?: ReadonlySet<string>,
): string[] {
  const valeurs = critere.valeurs ?? []
  const gardes = critere.valeurs_visible_si
  if (gardes == null) return valeurs
  return valeurs.filter((valeur) => {
    const garde = gardes[valeur]
    if (garde == null) return true
    return evaluateCondition(garde, criteriaDerives, renseignes) !== false
  })
}

/**
 * Même chose depuis la SAISIE BRUTE (dérivés et ensemble effectif calculés ici) — point d'entrée du
 * formulaire, qui n'a pas à refaire ce que `grouperChamps` fait déjà de son côté. Deux fonctions plutôt
 * qu'une parce que les deux appelants n'ont pas la même chose en main : `reinitialiserChampsMasques`
 * tient déjà ses dérivés (il itère jusqu'à stabilité), le composant non.
 */
export function valeursProposeesDepuisSaisie(
  criteresEntree: CritereEntree[],
  critere: CritereEntree,
  criteria: Criteria,
  renseignes?: ReadonlySet<string>,
): string[] {
  if (critere.valeurs_visible_si == null) return critere.valeurs ?? []
  const derives = calculerCriteresDerives(criteresEntree, criteria)
  const effectifs = determinesEffectifs(criteresEntree, derives, renseignes)
  return valeursProposees(critere, derives, effectifs)
}

/**
 * PRÉ-REMPLISSAGE CALCULÉ (K6, `CritereEntree.preremplissage`) : pour chaque critère saisi que le
 * praticien n'a PAS encore renseigné, la première règle dont le `quand` est vrai AU SENS STRICT fournit
 * une valeur de départ.
 *
 * CINQ GARDE-FOUS, et chacun répond à un travers précis :
 *  - `!== true` ne suffit pas, on exige `=== true` : une expression INDÉTERMINÉE (opérande non renseigné)
 *    ne pré-remplit RIEN. Deviner sur une donnée manquante serait exactement ce que R7/D20 proscrit ;
 *  - un critère DÉJÀ RENSEIGNÉ n'est jamais touché — « sinon c'est la position déclarée qui fait foi »
 *    (référent). C'est ce qui garde le critère DÉCLARÉ au sens de R1 : le mécanisme propose un point de
 *    départ, il ne transforme pas un critère saisi en critère `derive` ;
 *  - la valeur pré-remplie doit appartenir aux `valeurs` déclarées pour un `enum` — un contenu qui se
 *    tromperait de libellé injecterait sinon une valeur que le formulaire ne sait pas rendre ;
 *  - (T-137, garde-fou 1) une `valeur` TABLEAU n'est acceptée que sur un critère `type: liste` ; une
 *    `valeur` CHAÎNE n'est en miroir jamais posée sur un critère `liste` — sans ce garde, elle le serait
 *    aujourd'hui sans aucun contrôle, et le critère recevrait une chaîne là où le moteur (`contient`/
 *    `ne_contient_pas`, `conditions.ts`) attend un tableau ;
 *  - (T-137, garde-fou 2) chaque ÉLÉMENT d'une `valeur` tableau doit appartenir aux `valeurs` déclarées du
 *    critère `liste` — même esprit que le garde-fou `enum` ci-dessus, à la maille de l'élément.
 *
 * (T-137, garde-fou 3 — « déjà à cette valeur, ne rien faire ») La ligne `suivant[critere.nom] ===
 * regle.valeur` n'est PAS spécialisée pour les tableaux, et c'est DÉLIBÉRÉ, pas un oubli. `tableau` est
 * assigné TEL QUEL ci-dessous (`suivant[critere.nom] = tableau`, jamais un `[...tableau]` cloné) — sûr,
 * parce qu'aucun code d'écran ne mute une liste en place (`toggleListeValeur`, `CriteriaForm.tsx`,
 * reconstruit toujours un tableau NEUF par `spread`/`filter`). Une fois posée, `criteria[nom]` EST
 * `regle.valeur`, littéralement le même objet : une comparaison PAR RÉFÉRENCE suffit donc à reconnaître un
 * rejeu sans rien changer (elle empêche « · calculé, à vérifier » de clignoter à chaque frappe ailleurs
 * dans le formulaire).
 *
 * ⚠ UNE COMPARAISON DE CONTENU SERAIT UN PIÈGE ICI, PAS UNE AMÉLIORATION — vérifié en écrivant le test de
 * contrat T-138 (`formLayout.test.ts`), qui a rougi sur cette version avant d'être corrigé.
 * `reinitialiserChampsMasques` (R8) remet elle aussi un critère masqué à `[]`, par un AUTRE chemin
 * (`valeurParDefaut`, une NOUVELLE liste vide à chaque appel) : ce `[]` fraîchement défauté n'a JAMAIS été
 * marqué dans `preremplis`. Une comparaison de CONTENU le confondrait avec un `[]` déjà posé par ce
 * mécanisme (même contenu, deux objets distincts) et empêcherait pour toujours le critère d'entrer dans
 * `preremplis` dès que la valeur ciblée égale la valeur par défaut — exactement le cas visé par T-138
 * (« aucun traitement » = la valeur par défaut d'une liste vide). La comparaison PAR RÉFÉRENCE, elle, ne
 * confond jamais les deux : seul un `[]` posé PAR CETTE FONCTION (donc littéralement `regle.valeur`) est
 * reconnu comme « déjà fait ».
 *
 * Renvoie les critères effectivement pré-remplis, pour que l'appelant les SIGNALE à l'écran : un champ
 * qui paraît répondu alors que personne n'a répondu sur cet écran est le défaut A du lot 1.
 *
 * `renseignesEffectifs` (optionnel, replie sur `renseignes` — RÉTRO-COMPATIBLE) : ensemble à utiliser
 * pour déterminer si les VARIABLES RÉFÉRENCÉES par un `quand` (ex. `HbA1c_cible` dans le `quand` de
 * `position_vs_cible`) sont connues. DISTINCT de `renseignes` à dessein : `renseignes` sert aussi à
 * exclure un candidat déjà répondu (`!renseignes.has(c.nom)`), et un champ PUBLIÉ (D50) ou pré-rempli par
 * une règle PRÉCÉDENTE (K6) doit rester un candidat RECONSIDÉRABLE (rebasculer `au_dessus` →
 * `nettement_au_dessus` si l'HbA1c bouge, cf. `DecisionNodeScreen.tsx`) tout en comptant comme DÉTERMINÉ
 * quand un AUTRE critère le référence. Sans cette distinction, un critère publié (jamais dans `touched`,
 * donc absent de `renseignes` côté appelant) reste `INDETERMINE` pour toute règle qui le lit — le
 * `quand: "HbA1c_actuelle > 0 AND HbA1c_cible > 0 AND …"` de `position_vs_cible` ne se déclenche alors
 * jamais tant que `HbA1c_cible` n'a pas été TAPÉ à la main, ce qui contredit D50 (« le SEUL lecteur de
 * `HbA1c_cible` est le `preremplissage` de `position_vs_cible` »).
 */
export function appliquerPreremplissage(
  criteresEntree: CritereEntree[],
  criteria: Criteria,
  renseignes: ReadonlySet<string>,
  renseignesEffectifs: ReadonlySet<string> = renseignes,
): { criteria: Criteria; preremplis: string[] } {
  const candidats = criteresEntree.filter(
    (c) => c.derive == null && (c.preremplissage ?? []).length > 0 && !renseignes.has(c.nom),
  )
  if (candidats.length === 0) return { criteria, preremplis: [] }

  const derives = calculerCriteresDerives(criteresEntree, criteria)
  const effectifs = determinesEffectifs(criteresEntree, derives, renseignesEffectifs)
  const suivant = { ...criteria }
  const preremplis: string[] = []

  for (const critere of candidats) {
    const regle = (critere.preremplissage ?? []).find(
      (r) => evaluateCondition(r.quand, derives, effectifs) === true,
    )
    if (regle == null) continue
    const valeurEstTableau = Array.isArray(regle.valeur)
    // Garde-fou 1 : une forme tableau et un critère `liste` vont toujours ensemble, dans les deux sens.
    if (valeurEstTableau !== (critere.type === 'liste')) continue
    if (valeurEstTableau) {
      const tableau = regle.valeur as string[]
      // Garde-fou 2.
      if (!tableau.every((v) => (critere.valeurs ?? []).includes(v))) continue
      // Garde-fou 3 (cf. docstring ci-dessus : référence, pas contenu — volontaire).
      if (suivant[critere.nom] === tableau) continue
      suivant[critere.nom] = tableau
      preremplis.push(critere.nom)
      continue
    }
    if (critere.type === 'enum' && !(critere.valeurs ?? []).includes(regle.valeur as string)) continue
    if (suivant[critere.nom] === regle.valeur) continue
    suivant[critere.nom] = regle.valeur
    preremplis.push(critere.nom)
  }
  return preremplis.length > 0 ? { criteria: suivant, preremplis } : { criteria, preremplis: [] }
}

/**
 * Champs SAISISSABLES (non `derive`) actuellement visibles, groupés par `groupe` dans l'ordre de première
 * apparition. Les critères dérivés ne sont jamais rendus (calculés, cf. `deriveCritere.ts`) ; un groupe
 * dont tous les champs sont masqués disparaît entièrement.
 */
export function grouperChamps(
  criteresEntree: CritereEntree[],
  criteria: Criteria,
  renseignes?: ReadonlySet<string>,
): GroupeChamps[] {
  const derives = calculerCriteresDerives(criteresEntree, criteria)
  const effectifs = determinesEffectifs(criteresEntree, derives, renseignes)
  const groupes: GroupeChamps[] = []
  const indexParLibelle = new Map<string | undefined, number>()

  for (const critere of criteresEntree) {
    if (critere.derive != null) continue
    if (!champEstVisible(critere, derives, effectifs)) continue
    const index = indexParLibelle.get(critere.groupe)
    if (index === undefined) {
      indexParLibelle.set(critere.groupe, groupes.length)
      groupes.push({ libelle: critere.groupe, champs: [critere] })
    } else {
      groupes[index].champs.push(critere)
    }
  }
  return groupes
}

/**
 * SÛRETÉ : remet à leur valeur par défaut les champs devenus MASQUÉS. Sans cela, une valeur saisie puis
 * masquée continuerait de piloter le moteur en silence, sans que le praticien puisse la voir ni la
 * corriger (ex. cocher « metformine » en intensification, puis revenir à « initier » : le patient serait
 * évalué comme traité alors que l'écran affirme le contraire). Renvoie le même objet si rien ne change,
 * ainsi que les noms remis à zéro (pour que l'appelant les retire aussi de `touched`).
 *
 * Itère jusqu'à stabilité : réinitialiser un champ peut en masquer un autre (visibilités en cascade).
 *
 * CORRECTIF DE SÛRETÉ (T-142/T-143, P13/S3, 2026-08-05) — BUG DE CASCADE DÉCOUVERT AU DIAGNOSTIC DU
 * PROFIL NOCTURNE. `reinitialises` (donc `valeursEffacees` ci-dessous) doit signaler TOUT champ MASQUÉ,
 * PAS SEULEMENT ceux dont la valeur COURANTE diffère encore de la valeur par défaut du type. L'ancienne
 * version confondait deux questions distinctes : « courant[nom] a-t-il besoin d'être MUTÉ ? » (oui
 * seulement si la valeur diffère du défaut) et « nom doit-il sortir de `touched` chez l'appelant ? » (oui
 * DÈS QUE le champ est masqué, quelle que soit sa valeur). Un critère `enum` dont la 1re valeur déclarée
 * est justement celle choisie par le praticien (ex. `profil_nocturne` = « Baisse continue », qui est
 * `valeurs[0]`) a une valeur qui coïncide avec son défaut : il ne remplissait donc JAMAIS la première
 * condition, et ne sortait donc JAMAIS de `touched` chez l'appelant (`DecisionNodeScreen.tsx`,
 * `touchedApres.delete(efface)` ne le voyait jamais) — R8 cessait alors de le protéger, en silence, dès
 * que ce hasard de valeur se produisait : masqué puis démasqué, le champ réapparaissait « confirmé » sans
 * que le praticien ait jamais reconfirmé quoi que ce soit pour CETTE réapparition. Mesuré au navigateur en
 * isolant la coïncidence (`profil_nocturne` = « Hausse continue », qui n'est PAS le défaut, se
 * réinitialisait déjà correctement AVANT ce correctif — seule la coïncidence valeur=défaut était touchée).
 * Le calcul de la valeur elle-même (ci-dessous, `aMuter`) N'EST PAS TOUCHÉ : un champ masqué vaut TOUJOURS
 * sa valeur par défaut pour le moteur, exactement comme avant (R8 intact, golden master inchangé — ce
 * correctif ne bouge que le REGISTRE `touched`, jamais `evaluateNode`).
 */
export function reinitialiserChampsMasques(
  criteresEntree: CritereEntree[],
  criteria: Criteria,
  renseignes?: ReadonlySet<string>,
): {
  criteria: Criteria
  reinitialises: string[]
  /**
   * T-143 (P13/S3) — extension PURE (les appelants existants ignorent ce champ) : les couples
   * `{nom, valeur}` des critères SIGNALÉS ci-dessus, avec la valeur qu'ils portaient juste avant
   * d'être masqués (pas nécessairement mutée : un champ déjà à sa valeur par défaut au moment où il
   * se masque est signalé — cf. le correctif de sûreté ci-dessus — mais `suivant[nom]` n'est réécrit
   * que si `valeurParDefaut` diffère réellement). Sert UNIQUEMENT à alimenter la mémoire de
   * restauration de l'écran (`DecisionNodeScreen.tsx`) — ce module ne sait pas lui-même quels noms
   * étaient `touched` : c'est à l'appelant de filtrer (un champ jamais `touched` n'a rien à
   * mémoriser, cf. `DecisionNodeScreen.tsx`).
   */
  valeursEffacees: Array<{ nom: string; valeur: CriteriaValue }>
  /**
   * T-143 (P13/S3) — A4/F, à la maille de la VALEUR : chaque valeur individuellement retirée d'une
   * `liste` (par la boucle `valeursARetirer` ci-dessous), avec le nom du critère qui la portait.
   * DÉLIBÉRÉMENT SÉPARÉ de `valeursEffacees` : une liste dont UNE valeur est retirée reste `touched`
   * (cf. le commentaire d'origine sur `valeursARetirer`, inchangé) — ce n'est donc jamais un champ
   * ENTIER qui disparaît ici, seulement une entrée. Restaurer par ce canal doit RÉ-AJOUTER la valeur
   * à la liste courante, jamais remplacer toute la liste (sinon un praticien qui aurait entre-temps
   * coché autre chose se verrait écrasé — cf. `DecisionNodeScreen.tsx`).
   */
  valeursListeRetirees: Array<{ nom: string; valeur: string }>
} {
  let courant = criteria
  const reinitialises: string[] = []
  const valeursEffacees: Array<{ nom: string; valeur: CriteriaValue }> = []
  const valeursListeRetirees: Array<{ nom: string; valeur: string }> = []
  const dejaSignales = new Set<string>()

  // Borne de sécurité : au pire un champ réinitialisé par tour, jamais de boucle infinie sur un contenu
  // dont les `visible_si` s'entre-déclencheraient.
  for (let tour = 0; tour <= criteresEntree.length; tour += 1) {
    const derives = calculerCriteresDerives(criteresEntree, courant)
    const effectifs = determinesEffectifs(criteresEntree, derives, renseignes)

    // TOUS les champs saisissables actuellement MASQUÉS (cf. correctif de sûreté ci-dessus) — signalés
    // une seule fois (`dejaSignales`), qu'ils appellent ou non une mutation de `courant`. `cache: true`
    // EXCLU DÉLIBÉRÉMENT (2026-08-10) : ce mécanisme protège contre une saisie qui continuerait de
    // piloter le moteur alors que le praticien ne peut plus la voir ni la corriger (`visible_si` devenu
    // faux) — un champ `cache`, lui, n'est JAMAIS saisi à l'écran (cf. sa docstring, `node.types.ts`) :
    // sa valeur ne peut venir que d'une reprise/publication de session, et la remettre à son défaut au
    // premier rendu détruirait précisément cette valeur, rendant le mécanisme de publication (D50)
    // inopérant sur tout champ `cache`.
    const masques = criteresEntree.filter(
      (critere) => critere.derive == null && critere.cache !== true && !champEstVisible(critere, derives, effectifs),
    )
    for (const critere of masques) {
      if (dejaSignales.has(critere.nom)) continue
      dejaSignales.add(critere.nom)
      reinitialises.push(critere.nom)
      valeursEffacees.push({ nom: critere.nom, valeur: courant[critere.nom] })
    }

    // Sous-ensemble de `masques` dont la valeur COURANTE diffère encore de la valeur par défaut du
    // type — seul celui-ci a besoin d'une mutation de `courant` (inchangé par rapport à avant ce
    // correctif : la VALEUR envoyée au moteur pendant le masquage ne bouge pas).
    const aMuter = masques.filter((critere) => {
      const defaut = valeurParDefaut(critere)
      const actuel = courant[critere.nom]
      return Array.isArray(defaut) || Array.isArray(actuel)
        ? !(Array.isArray(actuel) && actuel.length === 0)
        : actuel !== defaut
    })

    // A4/F — MÊME SÛRETÉ, À LA MAILLE DE LA VALEUR. Un champ peut rester visible alors qu'UNE de ses
    // valeurs vient d'être masquée (`valeurs_visible_si`). Sans ce retrait, cocher « insuline basale »
    // puis déclarer le patient naïf laisserait la valeur piloter le moteur en silence — exactement le
    // défaut que la boucle ci-dessus corrige au niveau du champ entier, transposé d'un cran plus bas.
    const valeursARetirer = criteresEntree.filter((critere) => {
      if (critere.derive != null || critere.type !== 'liste' || critere.valeurs_visible_si == null) return false
      if (!champEstVisible(critere, derives, effectifs)) return false // déjà traité au-dessus
      const actuel = courant[critere.nom]
      if (!Array.isArray(actuel) || actuel.length === 0) return false
      const proposees = new Set(valeursProposees(critere, derives, effectifs))
      return actuel.some((valeur) => !proposees.has(valeur))
    })

    if (aMuter.length === 0 && valeursARetirer.length === 0) break
    const suivant = { ...courant }
    for (const critere of aMuter) {
      suivant[critere.nom] = valeurParDefaut(critere)
    }
    for (const critere of valeursARetirer) {
      const proposees = new Set(valeursProposees(critere, derives, effectifs))
      const avant = courant[critere.nom] as string[]
      suivant[critere.nom] = avant.filter((valeur) => proposees.has(valeur))
      // T-143 : chaque valeur RETIRÉE (pas celles qui subsistent) va dans `valeursListeRetirees`, à la
      // maille de la valeur — cf. la docstring du champ de retour.
      for (const valeur of avant) {
        if (!proposees.has(valeur)) valeursListeRetirees.push({ nom: critere.nom, valeur })
      }
      // PAS ajouté à `reinitialises` : l'appelant s'en sert pour retirer le champ de `touched`, or le
      // champ reste répondu — le praticien a bien coché les valeurs qui subsistent. Le vider de `touched`
      // ferait réapparaître le marqueur « à confirmer » sur un champ auquel il vient de répondre.
    }
    courant = suivant
  }

  return { criteria: courant, reinitialises, valeursEffacees, valeursListeRetirees }
}

/**
 * Critères PILOTES : ceux dont la réponse commande l'affichage d'autres champs — autrement dit ceux
 * qu'un autre critère cite dans son `visible_si`.
 *
 * A7 (arbitrage référent, 2026-07-27 soir). La recette visuelle relevait qu'un formulaire `insuline`
 * vierge affiche le bloc MCG entier — TBR, coefficient de variation, dose de basale — avant que le
 * praticien ait dit si le patient prend de l'insuline. Le référent a maintenu R7 (« ne rien cacher tant
 * qu'on ne sait pas ») et tranché que le vrai grief était ailleurs : **rien ne désigne le champ qui
 * commande tous les autres.** Il est en haut de l'écran, mais ni mis en avant, ni distingué des trente
 * autres — sur `insuline` comme sur `prescription`, ce champ existe pourtant et décide de la moitié du
 * formulaire.
 *
 * ENTIÈREMENT DÉRIVÉ DU CONTENU (CLAUDE.md invariant 5 / D8) : aucun nom en dur. `situation_insuline` et
 * `intention` se désignent d'eux-mêmes parce que d'autres critères les citent ; un domaine futur qui
 * déclare un `visible_si` obtiendra le même traitement sans que cette fonction change. Un nœud sans
 * aucun `visible_si` n'a simplement pas de pilote, et rien ne s'affiche différemment.
 *
 * Ne dépend NI de `criteria` NI de `renseignes` : c'est une propriété STRUCTURELLE du nœud, stable pour
 * toute la session. L'appelant décide quand la montrer (`CriteriaForm` : tant que le pilote n'est pas
 * répondu — une fois répondu, il n'y a plus lieu d'y envoyer le praticien).
 */
export function criteresPilotes(criteresEntree: CritereEntree[]): Set<string> {
  const saisissables = criteresEntree.filter((critere) => critere.derive == null)
  const pilotes = new Set<string>()
  for (const critere of criteresEntree) {
    if (!critere.visible_si) continue
    for (const candidat of saisissables) {
      // Mot entier : sans `\b`, `age` matcherait `anciennete_diabete_annees`.
      if (new RegExp(`\\b${candidat.nom}\\b`).test(critere.visible_si)) pilotes.add(candidat.nom)
    }
  }
  // Un critère qui se cite lui-même dans son propre `visible_si` ne pilote rien : il ne peut pas être le
  // point de départ, puisqu'il faudrait déjà l'avoir répondu pour qu'il s'affiche.
  for (const critere of criteresEntree) {
    if (critere.visible_si && new RegExp(`\\b${critere.nom}\\b`).test(critere.visible_si)) pilotes.delete(critere.nom)
  }
  return pilotes
}

/** Noms des champs actuellement rendus à l'écran (saisissables et non masqués). */
export function champsVisibles(
  criteresEntree: CritereEntree[],
  criteria: Criteria,
  renseignes?: ReadonlySet<string>,
): Set<string> {
  return new Set(grouperChamps(criteresEntree, criteria, renseignes).flatMap((g) => g.champs.map((c) => c.nom)))
}

/**
 * Critères que l'on RÉCLAME au praticien avant de considérer la reco comme stabilisée : décisifs pour ce
 * patient (`pertinents`), pas encore renseignés, et VISIBLES à l'écran.
 *
 * C'est le correctif du défaut de conception constaté en recette : l'écran exigeait auparavant tous les
 * nombres référencés par une règle (`age`, via le dérivé `terrain_fragile`) tandis que le moteur de
 * pertinence estompait ces mêmes champs comme « sans effet » — un champ pouvait donc être à la fois
 * estompé et bloquant, sans issue pour l'utilisateur. En dérivant réclamé ET estompé de la MÊME source
 * (`pertinents`), la contradiction devient impossible par construction ; le filtre de visibilité ajoute
 * la seconde impasse à éviter (réclamer un champ que l'écran n'affiche pas).
 *
 * `indisponibles` (T-134, P12/S9, optionnel) — critères que le praticien a déclarés « je ne l'aurai
 * pas » (recette du 02/08, N7 : l'albuminurie manque au dossier de l'EHPAD et n'y sera jamais). PUREMENT
 * SOUSTRACTIF, et volontairement HORS MOTEUR : ce paramètre ne touche ni `touched`, ni `effectifs`
 * ci-dessous — un nom qui y figure reste NON DÉTERMINÉ pour `determinesEffectifs`/`evaluateCondition`
 * exactement comme avant (R7/D20, aucune option ne peut donc changer par ce geste). Il est retiré
 * seulement de la LISTE renvoyée ici, celle que l'écran lit pour compter « à confirmer » et marquer le
 * champ — c'est la distinction que la recette réclamait : le critère cesse d'être RÉCLAMÉ sans jamais
 * devenir RENSEIGNÉ. Absent (repli) : comportement RIGOUREUSEMENT INCHANGÉ, comme le reste de ce fichier.
 */
export function decisifsAConfirmer(
  criteresEntree: CritereEntree[],
  criteria: Criteria,
  touched: ReadonlySet<string>,
  pertinents: ReadonlySet<string> | undefined,
  indisponibles?: ReadonlySet<string>,
): string[] {
  if (!pertinents) return []
  // `touched` PASSÉ COMME `renseignes` (correctif du 2026-07-27, cause racine S3). Cet appel omettait
  // le 3ᵉ paramètre et retombait donc sur « tout est renseigné » — alors que le formulaire réel, lui,
  // calcule sa visibilité EN TERNAIRE (`CriteriaForm` passe `touched` à `grouperChamps`).
  //
  // L'écart n'est pas théorique : sur un `visible_si` INDÉTERMINÉ, les deux couches divergeaient dans
  // des sens opposés. Le formulaire applique le repli « fail open » de R7 et AFFICHE le champ ; ce
  // calcul-ci l'évaluait strictement et pouvait le tenir pour MASQUÉ, donc ne pas le réclamer. Un champ
  // décisif, affiché, non répondu, et silencieusement absent de « à confirmer » — exactement la classe
  // de défaut que ce chantier corrige ailleurs (l'écran affirme une chose, le calcul en croit une
  // autre), à une couche de plus.
  //
  // Les deux couches lisent désormais la même chose. La docstring ci-dessus insiste sur le fait que
  // réclamé et estompé dérivent de la MÊME source pour rendre la contradiction impossible : la
  // visibilité devait suivre la même règle.
  const visibles = champsVisibles(criteresEntree, criteria, touched)
  // « À confirmer » = NON DÉTERMINÉ (correctif du 2026-07-28, P4/S1, T-018, D30) : ce filtre lisait
  // auparavant `!touched.has(nom)` — un critère `bool`/`liste` répondu par sa seule valeur PAR DÉFAUT
  // (jamais touché) comptait donc comme « à confirmer » MÊME quand le contenu déclare `presomption_non:
  // true` (cas où le moteur, lui, le tient pour DÉTERMINÉ et ne réclame plus rien). Les deux couches
  // divergeaient exactement comme ci-dessus, un cran plus loin : le compteur/marqueur de l'écran aurait
  // pu réclamer un champ que le moteur avait déjà cessé d'attendre. `determinesEffectifs` — LA MÊME
  // fonction que celle qu'`evaluateNode` appelle pour trancher `enAttente` — est donc désormais la SEULE
  // source de vérité des deux côtés : un critère est à confirmer s'il n'est PAS dans l'ensemble qu'elle
  // renvoie (ni renseigné, ni couvert par une présomption de contenu), et visible à l'écran. Les deux
  // couches sont depuis structurellement incapables de diverger sur cette question : elles appellent le
  // même code, pas deux copies qui pourraient un jour différer.
  const derives = calculerCriteresDerives(criteresEntree, criteria)
  const effectifs = determinesEffectifs(criteresEntree, derives, touched) ?? new Set<string>()
  return [...pertinents].filter(
    (nom) => !effectifs.has(nom) && visibles.has(nom) && indisponibles?.has(nom) !== true,
  )
}
