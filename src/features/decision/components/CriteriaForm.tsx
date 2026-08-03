import { useId, useMemo, useRef, useState } from 'react'
import type { Contrainte, CritereEntree } from '../content/node.types'
import type { Criteria, CriteriaValue } from '../engine/conditions'
import { determinesEffectifs, evaluerNombre } from '../engine/deriveCritere'
import { champEstVisible, criteresPilotes, grouperChamps, valeursProposeesDepuisSaisie } from '../lib/formLayout'
import {
  describeEnumValue,
  iconForEnumValue,
  labelForCritere,
  labelForEnumValue,
  pastilleForEnumValue,
  toneForEnumValue,
} from '../lib/labels'
import { Icon } from '../../shared/icons/Icon'
import { PastilleInfo } from '../../shared/ui/PastilleInfo'
import './CriteriaForm.css'

interface CriteriaFormProps {
  criteresEntree: CritereEntree[]
  criteria: Criteria
  /**
   * Critères utilisés pour la VISIBILITÉ (`visible_si`, groupement en sections) — distincts de `criteria`
   * pour permettre à l'appelant de les TEMPORISER (P3 · S7‑ui Lot 3, tâche 6c : `useDeferredValue` côté
   * écran, cf. `screens/DecisionNodeScreen.tsx`) sans faire attendre la frappe elle‑même : les VALEURS
   * affichées dans les champs suivent toujours `criteria` en direct, seule l'apparition/disparition des
   * champs (et l'estompage, piloté par `pertinents` — calculé sur la MÊME source différée côté écran)
   * peut accuser un léger retard. Absent → replie sur `criteria` (comportement synchrone, tests).
   */
  criteriaGroupement?: Criteria
  /** Noms des critères déjà modifiés par l'utilisateur (T-009 : distingue « valeur par défaut » de « valeur saisie »). */
  touched: ReadonlySet<string>
  /** Texte d'aide optionnel par nom de critère (ex. suggestion auto d'`esperance_vie`) — générique, le contenu du texte est décidé par l'appelant (D8). */
  hints?: Partial<Record<string, string>>
  /**
   * Critères PERTINENTS pour le patient courant (moteur `engine/relevance.ts`, refonte UI P3). Fourni →
   * les champs hors de cet ensemble sont ESTOMPÉS (ils ne changent pas la reco actuelle, remarque 6).
   * Optionnel : absent → aucun estompage (rétro‑compatible, générique — aucun nom de critère en dur).
   * Un champ déjà `touched` n'est JAMAIS estompé (tâche 6b) : une saisie du praticien reste pleinement
   * lisible même si elle a cessé d'être décisive (ex. retour en arrière sur `intention`).
   *
   * T-058 (P8 · S3, 2026-07-30) — CE QUE L'ESTOMPAGE AFFIRME, ET CE QU'IL SE TAIT. L'estompage lui-même
   * (ci-dessus) reste fidèle à `pertinents` tel quel — inchangé par cette tâche. La MENTION TEXTUELLE
   * accolée (« · sans effet sur la reco actuelle », plus bas) est en revanche une AFFIRMATION du moteur,
   * et `pertinents` ne peut pas toujours la porter : `engine/relevance.ts` a une limite CONNUE, ASSUMÉE
   * (cf. sa docstring de tête, § LIMITE CONNUE, ASSUMÉE) — un critère décisif seulement EN CONJONCTION
   * avec un autre critère encore indéterminé produit la même signature quelle que soit sa valeur d'essai,
   * et se retrouve donc À TORT hors de `pertinents` tant que son co-critère reste indéterminé. Sur un
   * formulaire ENCORE VIERGE (aucun critère de ce nœud renseigné), c'est le cas de TOUS les critères
   * pris dans une telle conjonction à la fois — mesuré en recette (N2/N13b, `docs/decision/validation/
   * recette-praticien-naif-2026-07-30.md`) : `Âge`/`Ancienneté du diabète` s'affichaient « sans effet »
   * sur `cible-glycemique` vierge alors qu'ils décident, une fois remplis, entre deux cibles. La mention
   * ne s'affiche donc plus qu'une fois qu'AU MOINS UN critère de ce nœud est renseigné (`touched` non
   * vide) — le champ concerné, lui, reste estompé et MUET dans l'intervalle (pas contredit) ; ce n'est
   * qu'une approximation (elle ne prouve pas l'absence de conjonction bloquante une fois la première
   * réponse donnée), assumée faute d'une donnée par-nœud « reste-t-il une option en attente ? » côté
   * l'appelant (`DecisionNodeScreen.tsx`, hors périmètre P8 · S3) — cf. `moteurADeQuoiJuger` plus bas.
   */
  pertinents?: ReadonlySet<string>
  /**
   * Critères DÉCISIFS encore non confirmés (`lib/formLayout.ts` `decisifsAConfirmer`) : marqués sur place
   * plutôt qu'énumérés en prose ailleurs — une liste de 10 libellés dans un bandeau n'est pas actionnable,
   * un repère sur le champ l'est. Complémentaire de `pertinents` : un champ est soit estompé (sans effet),
   * soit à confirmer (décisif, pas encore renseigné), soit neutre — jamais deux à la fois.
   *
   * Le marqueur VISUEL (bord ambre + mention) ne s'affiche que sur les critères de type `nombre` (tâche 3,
   * recette référent) : une case à cocher non cochée EST une réponse clinique complète (« non » = `false`),
   * marquer une case comme « à confirmer » suggère à tort qu'il faut la cocher. **Exception (D20 R7,
   * SPEC-valeur-indeterminee.md §2.2)** : un `bool` `confirmation_requise: true` N'EST PAS une case
   * ordinaire — son « non » par défaut ne peut PAS être présumé sans risque (ex. `diabete_complique` sur
   * `statine`), il reste `indetermine` tant qu'il n'est pas explicitement répondu et porte donc le même
   * marqueur qu'un `nombre`. `decisifsAConfirmer` reste lui-même générique (tous types confondus) — c'est
   * le RENDU ici qui filtre par type (et par `confirmation_requise`), pas la fonction.
   */
  aConfirmer?: ReadonlySet<string>
  /**
   * Confirme d'un coup une liste de critères `bool` décisifs comme « rien à signaler » (tâche 4) : ils
   * passent `touched` SANS changer leur valeur (ils restent à `false`, qui EST la réponse). Optionnel :
   * absent → le bouton de pied de section ne s'affiche pas (rétro‑compatible).
   */
  onConfirmerChamps?: (noms: string[]) => void
  /**
   * Critères DÉCISIFS que le praticien a déclarés « je ne l'aurai pas » (T-134, P12/S9 — recette du
   * 02/08, N7 : l'albuminurie manque au dossier de l'EHPAD et n'y sera jamais). NE VIENT JAMAIS de
   * `touched`/`renseignes` — c'est un ensemble PARALLÈLE, purement d'ÉCRAN : `lib/formLayout.ts`
   * `decisifsAConfirmer` en tient déjà compte pour ne plus RÉCLAMER ce champ (donc `aConfirmer` reçu ici
   * ne le contient plus une fois déclaré), mais le moteur, lui, continue de tenir le critère pour NON
   * DÉTERMINÉ (R7/D20) — ce composant ne fait que RENDRE l'état, jamais le produire.
   */
  indisponibles?: ReadonlySet<string>
  /**
   * Déclare (ou annule, second clic — TOGGLE) qu'un critère décisif restera inconnu. Optionnel : absent →
   * aucune affordance « Indisponible » ne s'affiche (rétro-compatible), même repli que
   * `onConfirmerChamps`.
   */
  onDeclarerIndisponible?: (nom: string) => void
  /**
   * Un champ `nombre` vient d'être VIDÉ par le praticien (D20 R7, SPEC-valeur-indeterminee.md §2, défauts
   * de recette 12.2/13.3) : appelé À LA PLACE d'`onChange` quand l'input devient une chaîne vide — DISTINCT
   * d'un changement de valeur, sinon `Number('') = 0` ET `touched` marqué font enregistrer un « 0 » comme
   * une réponse confirmée (« 0 facteur de risque »), exactement le défaut constaté en recette. L'appelant
   * doit faire RESSORTIR `nom` de `touched`/`renseignes` (jamais l'y laisser avec une valeur par défaut) —
   * cf. `DecisionNodeScreen.tsx` `handleCriteriaEffacer`. Optionnel, repli sans `onEffacer` fourni (ex. un
   * test qui ne le passe pas) : ancien comportement (`onChange(nom, 0)`, `touched` ajouté quand même) — SEUL
   * cas où ce défaut peut encore se produire, volontairement, pour ne jamais casser un appelant existant.
   */
  onEffacer?: (nom: string) => void
  /**
   * CONTRAINTES DE SAISIE VIOLÉES (`Noeud.contraintes`, `engine/contraintes.ts`) — défaut K3 de la seconde
   * recette. Calculées par l'appelant et passées ici : ce composant reste sans connaissance du nœud.
   *
   * Rendues EN TÊTE DU FORMULAIRE, et non sur un champ : une contrainte relie deux critères qui vivent
   * souvent dans deux sections différentes (« situation » et « traitements en cours »), l'accrocher à l'un
   * des deux désignerait arbitrairement un coupable — alors que l'outil ne peut pas savoir lequel des deux
   * est faux. En tête, le message est vu avant qu'on ne fasse défiler, et il nomme la contradiction sans
   * la trancher.
   *
   * Ni blocage ni correction automatique : le praticien continue de saisir dans l'ordre qu'il veut.
   */
  contraintesViolees?: readonly Contrainte[]
  /**
   * Champs PRÉ-REMPLIS depuis la session (K6, `lib/sessionCriteres.ts`) : une valeur que le praticien a
   * saisie sur un AUTRE nœud de la même consultation, reprise ici.
   *
   * POURQUOI UNE MENTION EST INDISPENSABLE, et pas un simple confort : la valeur compte comme SAISIE
   * (elle l'est — sur un autre écran), donc le champ paraît répondu. Sans repère, on retombe exactement
   * sur le défaut A du lot 1 — « le rendu affiche répondu sans consulter `touched` » — à ceci près que
   * cette fois la valeur est réelle. Le praticien doit pouvoir distinguer ce qu'il vient de taper de ce
   * qui lui est proposé, sous peine de valider sans regarder une donnée venue d'ailleurs.
   */
  repris?: ReadonlySet<string>
  /**
   * Champs remplis par une RÈGLE DE CONTENU (`CritereEntree.preremplissage`, K6) plutôt que par le
   * praticien. Distincts de `repris` — là une valeur vient d'un autre nœud, ici elle est calculée depuis
   * d'autres réponses. Deux origines, deux mentions : « d'où sort cette valeur ? » n'a pas la même
   * réponse, et un praticien qui vérifie a besoin de la bonne.
   */
  preremplis?: ReadonlySet<string>
  onChange: (nom: string, value: CriteriaValue) => void
}

/** Au‑delà de ce nombre de valeurs, un `enum` est rendu en liste déroulante plutôt qu'en boutons. */
const MAX_VALEURS_SEGMENTE = 4

// `buildDefaultCriteria` vit désormais dans `lib/formLayout.ts` (même préoccupation que la visibilité
// conditionnelle : la remise à zéro d'un champ masqué doit réutiliser EXACTEMENT ces valeurs par défaut).
// Ré-export pour ne pas casser les importateurs existants.
export { buildDefaultCriteria } from '../lib/formLayout'

/**
 * Formulaire de critères (T-006 étape 1, refondu en P3 · S7‑ui Lot 2, accordéon en P6 · SB2). Ordonné par
 * le CONTENU : sections `groupe` dans l'ordre de première apparition, champs dans l'ordre de déclaration,
 * champs sans objet masqués par `visible_si` (`lib/formLayout.ts`). Le type d'input dérive du `type` de
 * contenu (`nombre` → input number, `enum` court → boutons segmentés, `enum` long → select, `bool` →
 * case, `liste` → cases multiples). Générique : aucun nom de critère ni de nœud connu d'avance
 * (DECISIONS.md D8) — le raisonnement clinique qui dicte l'ordre vit dans le YAML, pas ici.
 *
 * ACCORDÉON (P6 · SB2) : au-delà d'UN groupe, les sections deviennent repliables — une seule ouverte à la
 * fois, une barre de chips en tête pour naviguer, un résumé générique quand une section est repliée
 * (`resumeGroupe` ci-dessous, dérivé de `labelForCritere`/`labelForEnumValue`, jamais une phrase rédigée
 * à la main pour un nœud particulier — invariant 5). Un nœud à UN SEUL groupe n'a ni accordéon ni barre de
 * chips : la section reste toujours ouverte, comportement historique inchangé. Pure présentation, comme
 * le reste de ce fichier : la visibilité `visible_si` (`grouperChamps`, calculée AVANT ce découpage) n'est
 * ni recalculée ni contournée par le pli/dépli — un champ masqué le reste, ouvert ou replié.
 */
export function CriteriaForm({
  criteresEntree,
  criteria,
  criteriaGroupement,
  touched,
  hints,
  pertinents,
  aConfirmer,
  onConfirmerChamps,
  indisponibles,
  onDeclarerIndisponible,
  onEffacer,
  contraintesViolees,
  repris,
  preremplis,
  onChange,
}: CriteriaFormProps) {
  // `touched` fait aussi office de `renseignes` (D20 R7) pour la VISIBILITÉ (`visible_si`) : un champ dont
  // le `visible_si` porte sur un critère pas encore renseigné doit rester VISIBLE (repli « fail open » de
  // `champEstVisible`, `lib/formLayout.ts`), jamais masqué sur une donnée qu'on ignore encore — cf.
  // `criteriaGroupement`/`touched` ci-dessus : même source que partout ailleurs dans cet écran.
  const groupes = grouperChamps(criteresEntree, criteriaGroupement ?? criteria, touched)

  // ACCORDÉON (P6 · SB2). Clé stable d'un groupe = son libellé, avec le MÊME repli que la `key` React du
  // `<section>` ci-dessous (`__sans-groupe-${index}`) pour un nœud sans `groupe` déclaré — dans ce cas il
  // n'y a de toute façon qu'UN groupe, donc jamais d'accordéon (cf. `accordeon` ci-dessous).
  const clesGroupes = groupes.map((groupe, index) => groupe.libelle ?? `__sans-groupe-${index}`)
  // Décision clé (SB2.md) : « Nœud à une seule section : pas d'accordéon ni de barre de chips — la
  // section reste simplement toujours ouverte. »
  const accordeon = groupes.length > 1

  // `null` tant que le praticien n'a rien cliqué : le groupe ouvert par défaut est TOUJOURS le premier de
  // `groupes` (repli calculé à chaque rendu, pas figé une fois pour toutes) — s'il disparaît (tous ses
  // champs redevenus masqués, `grouperChamps` retire le groupe entier), le repère de départ suit
  // naturellement le nouveau premier groupe plutôt que de pointer sur une section qui n'existe plus.
  const [groupeOuvertManuel, setGroupeOuvertManuel] = useState<string | null>(null)
  const groupeOuvert = accordeon
    ? groupeOuvertManuel != null && clesGroupes.includes(groupeOuvertManuel)
      ? groupeOuvertManuel
      : clesGroupes[0]
    : null

  // Sections déjà montées (persistent qu'elles soient ouvertes ou repliées, seul leur CONTENU change) :
  // permet de scroller vers une section tout juste choisie sans attendre le prochain rendu.
  const sectionsMontees = useRef(new Map<string, HTMLElement>())
  const ouvrirGroupe = (cle: string) => {
    setGroupeOuvertManuel(cle)
    sectionsMontees.current.get(cle)?.scrollIntoView?.({ behavior: 'smooth', block: 'start' })
  }

  // T-108 — description des valeurs atteignable au clic. Un seul panneau ouvert à la fois (nom du
  // critère concerné, `null` si aucun) : même registre que `groupeOuvertManuel` ci-dessus, à une échelle
  // plus fine (le champ, pas la section). `idBase` (React 19 `useId`) évite toute collision d'`id` si ce
  // composant devait un jour être monté deux fois sur la même page (aucun cas actuel, mais l'`id` doit
  // être unique dans TOUT le document, pas seulement dans ce formulaire).
  const idBase = useId()
  const [detailOuvert, setDetailOuvert] = useState<string | null>(null)
  const toggleDetail = (nom: string) => setDetailOuvert((actuel) => (actuel === nom ? null : nom))

  /** `Libellé : description` par valeur du critère ayant une description cataloguée (`describeEnumValue`),
   *  séparées par ` · ` — même registre de formatage que `resumeGroupe` ci-dessus, réutilisé plutôt que
   *  réinventé (Décision clé, S4.md T-108). `null` si AUCUNE valeur n'est décrite : le champ n'a alors ni
   *  pastille ni panneau (étape 4, T-108) — aucune connaissance de nom de critère, aucun cas spécial
   *  `nombre`/`bool` : ces types n'ont simplement pas de `valeurs`, donc rien à décrire. */
  const texteDetailValeurs = (critere: CritereEntree): string | null => {
    const parties = (critere.valeurs ?? [])
      .map((v) => {
        const description = describeEnumValue(v)
        return description == null ? null : `${labelForEnumValue(v)} : ${description}`
      })
      .filter((partie): partie is string => partie != null)
    return parties.length > 0 ? parties.join(' · ') : null
  }

  /** Pastille ⓘ à droite du libellé de champ (maquette l.219-222) — rien si aucune valeur n'est décrite. */
  const renderDetailPastille = (critere: CritereEntree) => {
    const texte = texteDetailValeurs(critere)
    if (texte == null) return null
    return (
      <PastilleInfo
        icone="info"
        libelle={`Valeurs de ${labelForCritere(critere.nom)}`}
        texte={texte}
        ouvert={detailOuvert === critere.nom}
        onToggle={() => toggleDetail(critere.nom)}
        panneauId={`${idBase}-detail-${critere.nom}`}
      />
    )
  }

  /** Panneau déplié SOUS le champ (état détenu ici, PastilleInfo est un composant contrôlé) — réutilise
   *  `criteria-form__aide`, déjà le registre visuel « texte explicatif sous le champ » (étape 3, T-108). */
  const renderDetailPanneau = (critere: CritereEntree) => {
    const texte = texteDetailValeurs(critere)
    if (texte == null || detailOuvert !== critere.nom) return null
    return (
      <div id={`${idBase}-detail-${critere.nom}`} className="criteria-form__aide">
        {texte}
      </div>
    )
  }

  /** Nombre de champs « à confirmer » (même définition que le marqueur par champ, `estAConfirmer` plus
   *  bas) dans un groupe — pour le badge de la barre de chips. Trivial à dériver de ce qui existe déjà
   *  (`aConfirmer`, `groupes`) : pas besoin de toucher `lib/formLayout.ts` pour ce compteur. */
  const compteurAConfirmer = (champs: CritereEntree[]) =>
    aConfirmer ? champs.filter((c) => aConfirmer.has(c.nom)).length : 0

  /**
   * Valeur affichée d'un champ RENSEIGNÉ, pour le résumé d'une section repliée. `null` si rien à montrer
   * (champ jamais `touched`, ou `liste` cochée puis entièrement décochée). Formatage GÉNÉRIQUE par type,
   * même registre que le rendu du champ ouvert (`labelForEnumValue` déjà utilisé plus bas) — aucune
   * phrase composée à la main pour un nœud particulier (Décision clé, SB2.md).
   */
  const valeurResumeChamp = (critere: CritereEntree): string | null => {
    if (!touched.has(critere.nom)) return null
    const valeur = criteria[critere.nom]
    if (critere.type === 'liste') {
      const valeurs = Array.isArray(valeur) ? valeur : []
      if (valeurs.length === 0) return null
      return valeurs.map(labelForEnumValue).join(', ')
    }
    if (critere.type === 'bool') return valeur ? 'Oui' : 'Non'
    if (critere.type === 'nombre') return valeur === '' || valeur == null ? null : String(valeur)
    // `enum` : la valeur par défaut (première déclarée) ne peut pas apparaître ici sans `touched`, déjà
    // écarté par la garde ci-dessus.
    return valeur ? labelForEnumValue(String(valeur)) : null
  }

  /** Résumé d'une ligne pour une section repliée : `Libellé : valeur` par champ renseigné, séparés par
   *  « · ». Texte fixe si aucun champ du groupe n'est renseigné — le même quel que soit le nœud. */
  const resumeGroupe = (champs: CritereEntree[]): string => {
    const parties = champs
      .map((c) => {
        const v = valeurResumeChamp(c)
        return v == null ? null : `${labelForCritere(c.nom)} : ${v}`
      })
      .filter((partie): partie is string => partie != null)
    return parties.length > 0 ? parties.join(' · ') : 'Aucun champ renseigné'
  }

  // A7 (arbitrage référent, 2026-07-27 soir) : REPÈRE DE DÉPART. Propriété structurelle du nœud, donc
  // calculée une fois — `criteresPilotes` ne lit ni `criteria` ni `touched` (cf. sa docstring).
  // Le repère ne s'affiche que tant que le pilote n'est pas répondu : une fois la réponse donnée, il n'y
  // a plus lieu d'y envoyer le praticien, et le champ redevient un champ comme les autres.
  const pilotes = useMemo(() => criteresPilotes(criteresEntree), [criteresEntree])

  /**
   * VALEUR CALCULÉE D'UN CRITÈRE DÉRIVÉ NUMÉRIQUE (T-133, P12/S8) — le point que le brief avait
   * initialement omis du périmètre « Modifier » : un critère `type: nombre` porteur d'un `derive`
   * (IMC = poids / taille / taille, CK_x_normale = CK_UI_L / CK_normale_sup…) n'est jamais un champ
   * saisissable (`grouperChamps`, `lib/formLayout.ts`, l'exclut de `groupe.champs` plus bas) — mais SA
   * VALEUR doit rester visible, sans quoi une faute de frappe sur un OPÉRANDE (poids, taille) déplace
   * silencieusement la recommandation sans que rien à l'écran ne le signale. C'était le mode d'échec
   * qu'échanger « calcul de tête risqué » contre « calcul automatique invisible » aurait ouvert.
   *
   * GÉNÉRIQUE (invariant CLAUDE.md 5) : aucun nom de critère ni de nœud connu d'avance — n'importe quel
   * domaine obtient ce rendu en déclarant `type: nombre` + `derive`. Rendue dans LE MÊME `groupe` que le
   * critère le déclare (`critere.groupe`, laissé en place dans le contenu bien qu'il ne pilote plus le
   * rendu du CHAMP lui-même) : par construction du contenu, c'est celui de ses opérandes (IMC et
   * poids/taille partagent le même `groupe` sur `prescription`, CK_x_normale et CK_UI_L/CK_normale_sup le
   * même sur `statine`) — donc « près des champs qui l'alimentent », sans avoir à les identifier un par un.
   */
  const derivesNumeriques = useMemo(
    () => criteresEntree.filter((c) => c.derive != null && c.type === 'nombre'),
    [criteresEntree],
  )
  // Ensemble EFFECTIF des critères déterminés (D20, `engine/deriveCritere.ts`) : calculé UNE FOIS ici,
  // comme `pilotes` ci-dessus — mêmes `criteresEntree`/`criteria`/`touched` que le reste de ce composant
  // (`criteriaGroupement` n'entre pas ici : c'est `criteria`, la valeur EN DIRECT, qui doit décider si le
  // calcul affiché est à jour, pas la source temporisée de la visibilité).
  const effectifsDerives = useMemo(
    () => determinesEffectifs(criteresEntree, criteria, touched),
    [criteresEntree, criteria, touched],
  )

  /** Valeur calculée d'un critère DÉRIVÉ numérique, ou `null` si NON CALCULABLE (un opérande manque, ou
   *  une division par zéro, D20) — JAMAIS `0` par défaut : c'est la même garde que le moteur applique déjà
   *  (`engine/deriveCritere.ts` `evaluerNombre`), rendue visible ici plutôt que muette. */
  const valeurCalculee = (critere: CritereEntree): number | null =>
    critere.derive == null ? null : evaluerNombre(critere.derive, criteria, effectifsDerives)

  /** Ligne « Libellé valeur · calculé » — LECTURE SEULE, jamais un champ (ni `<input>`, ni saisissable) :
   *  MÊME registre visuel que « · calculé, à vérifier » (K6, suggestion d'espérance de vie,
   *  `criteria-form__field-repris` ci-dessous, réutilisé tel quel — aucun registre inventé). Absente tant
   *  qu'un opérande manque (jamais affichée à `0`) OU si le critère porte lui-même un `visible_si` faux
   *  (même règle de visibilité que n'importe quel autre champ du nœud). */
  const renderValeurCalculee = (critere: CritereEntree) => {
    if (!champEstVisible(critere, criteriaGroupement ?? criteria, touched)) return null
    const valeur = valeurCalculee(critere)
    if (valeur == null) return null
    return (
      <p key={critere.nom} className="criteria-form__valeur-calculee">
        {labelForCritere(critere.nom)} {valeur.toFixed(1).replace('.', ',')}
        <span className="criteria-form__field-repris"> · calculé</span>
      </p>
    )
  }

  // Estompage (remarque 6) : un critère hors de `pertinents` n'a, pour CE patient, aucun effet sur la reco.
  // Absent (`pertinents` non fourni) → jamais estompé. Un champ déjà `touched` n'est JAMAIS estompé (tâche
  // 6b) : la valeur saisie par le praticien reste pleinement lisible même redevenue non décisive. Générique :
  // aucun nom de critère connu d'avance.
  const estDim = (nom: string) => pertinents != null && !pertinents.has(nom) && !touched.has(nom)

  // T-058 (P8 · S3) — LE MOTEUR A-T-IL DE QUOI JUGER ? Gate la MENTION « · sans effet sur la reco
  // actuelle » (pas l'estompage ci-dessus, inchangé) — cf. la docstring de `pertinents`. Sur un
  // formulaire ENCORE VIERGE (aucun critère de ce nœud renseigné), la limite CONNUE, ASSUMÉE
  // d'`engine/relevance.ts` (conjonction de critères tous indéterminés à la fois, cf. sa docstring de
  // tête) s'applique à TOUS les critères pris dans une telle conjonction simultanément — l'estompage
  // resterait alors une simple hiérarchie de saisie (utile, cf. N5), mais la PHRASE affirmerait une
  // conclusion que le moteur n'a pas.
  //
  // APPROXIMATION ASSUMÉE, PAS LA RÈGLE GÉNÉRALE : la donnée exacte (« reste-t-il, sur CE nœud, une
  // option EN ATTENTE faute de critère renseigné ? » — `VueDecision.enAttente`) vit chez l'appelant
  // (`DecisionNodeScreen.tsx`, zone S2, hors périmètre de cette session, cf. S3.md "Si bloqué") : ce
  // composant n'a accès qu'à `touched`, déjà transmis. Dès qu'AU MOINS UN critère de ce nœud est
  // renseigné, on considère que le moteur a commencé à juger et la mention reprend son cours normal —
  // exactement le cas salué en N5 (trois champs neutralisés chez un patient déjà largement renseigné,
  // « l'outil me dit quoi ne pas remplir »). Sur un formulaire encore vierge, aucune mention n'est
  // affirmée nulle part sur ce nœud — y compris, ponctuellement, pour un champ sans lien avec une
  // conjonction : imprécision acceptée (une mention vraie peut se taire un instant de plus), strictement
  // plus sûre que l'inverse (affirmer une chose fausse qui fait sauter un champ décisif — le défaut
  // mesuré, N2/N13b).
  const moteurADeQuoiJuger = touched.size > 0
  // Marqueur visuel « · à confirmer » : EXACTEMENT les critères que `decisifsAConfirmer` compte, sans
  // aucun filtre de type — arbitrage référent A8 du 2026-07-27 (soir).
  //
  // CE QUE LE FILTRE DE TYPE PRODUISAIT, et que la recette visuelle a vu à l'écran : le bandeau
  // annonçait « 1 critère décisif non confirmé » sur `statine` alors qu'AUCUN champ ne portait de
  // marqueur. Le critère restant était un `bool` ORDINAIRE — délibérément exclu du marqueur, au motif
  // que « décoché EST la réponse non ». Le raisonnement est juste pour le MOTEUR (D20 : un `bool` sans
  // `confirmation_requise` est déterminé par défaut) mais il ne l'était pas pour le PRATICIEN, à qui on
  // affichait un compteur qu'aucun repère ne permettait de résoudre. Le mécanisme de résolution existe
  // pourtant — le bouton « Rien à signaler » de la section — mais rien ne disait LEQUEL des champs il
  // visait.
  //
  // Le compteur et les marqueurs ont donc désormais la MÊME définition, et c'est un invariant testé
  // (`CriteriaForm.test.tsx`) : le nombre annoncé est toujours le nombre de marqueurs affichés. C'est la
  // même exigence que le lot 1 tout entier — ce que l'écran affirme doit être ce que le calcul croit.
  //
  // ⚠ CONTREPARTIE ASSUMÉE PAR LE RÉFÉRENT : cela AUGMENTE la densité de marqueurs, que la recette
  // signalait déjà comme forte (56 % des champs sur `statine`, 65 % sur RHD Alimentation). L'effet réel
  // est mesuré dans `docs/decision/validation/chantier-2026-07-27/mesure-densite-marqueurs.md`.
  const estAConfirmer = (critere: CritereEntree) => aConfirmer?.has(critere.nom) === true

  /**
   * T-134 (P12/S9) — affordance « Indisponible » sur un champ DÉCISIF, à côté du marqueur « · à
   * confirmer » : le praticien y déclare qu'il ne renseignera jamais ce critère (« je ne l'aurai pas »,
   * recette du 02/08, N7). GÉNÉRIQUE PAR `aConfirmer` (tous types confondus, comme le marqueur lui-même,
   * A8) — pas restreint au `nombre` : contrairement à un `bool` ordinaire, dont le « non » par défaut EST
   * déjà une réponse clinique (D20), un `bool`/`liste` DÉCISIF encore `à confirmer` porte la MÊME
   * incertitude qu'un `nombre`/`enum` non saisi (aucune présomption ne s'applique, sinon il ne serait pas
   * dans `aConfirmer`) — la même impossibilité de dire « je ne sais pas » s'y pose donc identiquement.
   *
   * TOGGLE, pas une déclaration à sens unique : un second clic sur la mention DÉJÀ déclarée annule (même
   * `onDeclarerIndisponible`, cf. sa docstring) — une correction de saisie ne doit jamais être définitive.
   *
   * Une fois déclaré, `aConfirmer` reçu ICI ne contient plus ce nom (`decisifsAConfirmer` l'exclut déjà,
   * `lib/formLayout.ts`) : `estAConfirmer` redevient donc `false`, ce qui suffit à faire disparaître le
   * marqueur ambre « · à confirmer » sans aucune logique supplémentaire ici — seule la mention « ·
   * indisponible » (ci-dessous) reste affichée, portée par `indisponibles` et non par `aConfirmer`.
   *
   * `null` si ni décisif-non-confirmé, ni déjà déclaré (rien à montrer), ou si l'appelant n'a pas fourni
   * `onDeclarerIndisponible` (rétro-compatible, comme `onConfirmerChamps`).
   */
  const renderIndisponible = (critere: CritereEntree) => {
    if (!onDeclarerIndisponible) return null
    const declare = indisponibles?.has(critere.nom) === true
    if (!declare && !estAConfirmer(critere)) return null
    return (
      <button
        type="button"
        className={
          declare ? 'criteria-form__field-indisponible-tag' : 'criteria-form__field-indisponible-bouton'
        }
        onClick={() => onDeclarerIndisponible(critere.nom)}
        title={declare ? 'Redemander ce critère' : 'Ce critère restera inconnu : cesser de le réclamer'}
      >
        {declare ? '· indisponible' : 'Indisponible'}
      </button>
    )
  }

  /** Ce champ commande-t-il l'affichage d'autres champs, et attend-il encore sa réponse ? (A7) */
  const estPilote = (critere: CritereEntree) => pilotes.has(critere.nom) && !touched.has(critere.nom)

  /** Coche/décoche une valeur dans un critère `liste` (tableau de libellés, D13). */
  const toggleListeValeur = (nom: string, valeur: string, coche: boolean) => {
    const actuel = Array.isArray(criteria[nom]) ? (criteria[nom] as string[]) : []
    const suivant = coche ? [...actuel, valeur] : actuel.filter((v) => v !== valeur)
    onChange(nom, suivant)
  }

  // TEXTE D'AIDE de contenu (`CritereEntree.aide`, 2026-07-27) — rendu à l'identique dans les trois
  // branches de champ. Distinct de `hints`, qui vient de l'APPELANT (suggestion calculée) : celui-ci vient
  // du CONTENU et dit ce que le champ recouvre exactement — « qu'est-ce que je coche ? », là où le libellé
  // dit seulement « quel champ ? ». Les deux peuvent coexister sur un même critère.
  const renderAide = (critere: CritereEntree) =>
    critere.aide ? <div className="criteria-form__aide">{critere.aide}</div> : null

  /** K6 — mention « repris » : dit d'où vient une valeur que le praticien n'a pas tapée SUR CET ÉCRAN. */
  const estRepris = (critere: CritereEntree) => repris?.has(critere.nom) === true
  const estPrerempli = (critere: CritereEntree) => preremplis?.has(critere.nom) === true

  /** Mention d'origine d'une valeur que le praticien n'a pas tapée sur CET écran. */
  const renderOrigine = (critere: CritereEntree) => {
    if (estRepris(critere)) {
      return <span className="criteria-form__field-repris"> · repris de votre saisie</span>
    }
    if (estPrerempli(critere)) {
      return <span className="criteria-form__field-repris"> · calculé, à vérifier</span>
    }
    return null
  }

  const renderChamp = (critere: CritereEntree) => {
    const dim = estDim(critere.nom)
    const confirmer = estAConfirmer(critere)
    const pilote = estPilote(critere)
    const valeurs = critere.valeurs ?? []
    // `libelle_masque` (2026-08-01, cf. `content/node.types.ts`) : le titre de `groupe` porte déjà toute
    // l'information pour un champ SEUL dans sa section — la ligne de libellé (et ses suffixes) devient
    // redondante. Opt-in par le contenu, jamais déduit de la cardinalité du groupe ici.
    const libelleMasque = critere.libelle_masque === true

    if (critere.type === 'bool') {
      // L'aide est HORS du `<label>` : à l'intérieur, cliquer dessus pour la lire cocherait la case —
      // et sur un critère `confirmation_requise` (le cas de la fusion TCA), cocher par accident est
      // exactement ce qu'il ne faut pas.
      const champ = (
        <label
          key={critere.nom}
          className="criteria-form__field criteria-form__field--flag"
          data-dim={dim || undefined}
          data-confirmer={confirmer || undefined}
          data-pilote={pilote || undefined}
          data-debut-ligne={critere.debut_de_ligne || undefined}
        >
          <input
            type="checkbox"
            checked={Boolean(criteria[critere.nom])}
            onChange={(event) => onChange(critere.nom, event.target.checked)}
          />
          {!libelleMasque && (
            <span className="criteria-form__checkbox-label">
              {labelForCritere(critere.nom)}
              {pilote && <span className="criteria-form__field-pilote"> · détermine la suite</span>}
              {/* `confirmation_requise` seulement (D20 R7) : jamais sur un `bool` ordinaire, cf. `estAConfirmer`. */}
              {confirmer && <span className="criteria-form__field-todo"> · à confirmer</span>}
              {renderOrigine(critere)}
            </span>
          )}
        </label>
      )
      // T-134 (P12/S9) — même raison que l'aide juste au-dessus : l'affordance « Indisponible » DOIT
      // rester HORS du `<label>`, sinon cliquer dessus cocherait la case (le `<label>` propage le clic à
      // son `<input>` associé) — exactement le défaut que le commentaire ci-dessus évite déjà pour l'aide.
      const indisponible = renderIndisponible(critere)
      // SANS aide NI affordance indisponible : le `<label>` est rendu TEL QUEL, enfant direct de la
      // grille — aucun changement de structure pour les dizaines de booléens du domaine qui n'en portent
      // pas/ne sont pas décisifs. L'enveloppe n'existe que là où il y a quelque chose à envelopper.
      if (!critere.aide && !indisponible) return champ
      // Enveloppe SANS style propre au-delà de l'occupation de grille (`--avec-aide`) : elle ne doit pas
      // ajouter un second cadre autour du `<label>`, qui porte déjà le sien.
      return (
        <div key={critere.nom} className="criteria-form__avec-aide">
          {champ}
          {renderAide(critere)}
          {indisponible}
        </div>
      )
    }

    if (critere.type === 'liste') {
      const cochees = Array.isArray(criteria[critere.nom]) ? (criteria[critere.nom] as string[]) : []
      // A4/F : le contenu peut masquer UNE valeur sans masquer le champ (`valeurs_visible_si`). Calculé
      // sur la MÊME source que le groupement (`criteriaGroupement ?? criteria`, `touched` en `renseignes`),
      // pour que l'apparition d'une case suive exactement le rythme de l'apparition d'un champ — sans quoi
      // une case pourrait apparaître un cycle avant ou après la section qui la contient.
      const valeursListe = valeursProposeesDepuisSaisie(
        criteresEntree,
        critere,
        criteriaGroupement ?? criteria,
        touched,
      )
      return (
        <div
          key={critere.nom}
          className="criteria-form__field criteria-form__field--wide"
          data-dim={dim || undefined}
          data-confirmer={confirmer || undefined}
          data-pilote={pilote || undefined}
          data-debut-ligne={critere.debut_de_ligne || undefined}
        >
          {!libelleMasque && (
            <div className="criteria-form__field-label">
              {labelForCritere(critere.nom)}
              {pilote && <span className="criteria-form__field-pilote"> · détermine la suite</span>}
              {confirmer && <span className="criteria-form__field-todo"> · à confirmer</span>}
              {renderIndisponible(critere)}
              {renderOrigine(critere)}
              {renderDetailPastille(critere)}
            </div>
          )}
          {renderAide(critere)}
          {renderDetailPanneau(critere)}
          <div className="criteria-form__chips">
            {valeursListe.map((valeur) => {
              const cochee = cochees.includes(valeur)
              return (
                <label
                  key={valeur}
                  className="criteria-form__chip"
                  data-on={cochee || undefined}
                  // T-107 : même repli que `data-on` — le ton ne teinte la case qu'à l'état sélectionné,
                  // `undefined` sinon (aucune valeur `liste` n'est cataloguée dans `ENUM_VALUE_TONES`
                  // aujourd'hui : ce câblage sert un futur catalogue, sans effet visuel actuel).
                  data-ton={cochee ? toneForEnumValue(valeur) : undefined}
                  // Infobulle native (ex. lecture de l'AGP par profil, §8-3) — générique, absente si non cataloguée.
                  title={describeEnumValue(valeur)}
                >
                  <input
                    type="checkbox"
                    checked={cochee}
                    onChange={(event) => toggleListeValeur(critere.nom, valeur, event.target.checked)}
                  />
                  <span className="criteria-form__checkbox-label">{labelForEnumValue(valeur)}</span>
                </label>
              )
            })}
          </div>
        </div>
      )
    }

    // `enum` court → boutons segmentés (un geste au lieu de deux, la valeur retenue reste lisible sans
    // ouvrir le champ) ; `enum` long → select. Règle purement quantitative, aucune connaissance clinique.
    const segmente = critere.type === 'enum' && valeurs.length > 0 && valeurs.length <= MAX_VALEURS_SEGMENTE

    return (
      <div
        key={critere.nom}
        className={segmente ? 'criteria-form__field criteria-form__field--wide' : 'criteria-form__field'}
        data-dim={dim || undefined}
        data-confirmer={confirmer || undefined}
        data-pilote={pilote || undefined}
        // `debut_de_ligne` (2026-07-29) : renvoie le champ en colonne 1, ce qui stabilise la paire qu'il
        // ouvre — le champ suivant tombe alors toujours à côté de lui, que les champs PRÉCÉDENTS soient
        // affichés ou masqués. Cf. la docstring du champ dans `content/node.types.ts`.
        data-debut-ligne={critere.debut_de_ligne || undefined}
      >
        {!libelleMasque && (
          <div className="criteria-form__field-label">
            {labelForCritere(critere.nom)}
            {pilote && <span className="criteria-form__field-pilote"> · détermine la suite</span>}
            {dim && moteurADeQuoiJuger && <span className="criteria-form__field-note"> · sans effet sur la reco actuelle</span>}
            {confirmer && <span className="criteria-form__field-todo"> · à confirmer</span>}
            {renderIndisponible(critere)}
            {renderOrigine(critere)}
            {renderDetailPastille(critere)}
          </div>
        )}

        {critere.type === 'nombre' && critere.paliers != null && critere.paliers.length > 0 ? (
          // PALIERS STANDARD (`CritereEntree.paliers`, 2026-07-29) — un `nombre` dont le contenu déclare la
          // liste fermée de ses valeurs cliniques se saisit dans un SÉLECTEUR, jamais au clavier. Le type du
          // critère et la valeur stockée restent NUMÉRIQUES (`Number(...)` ci-dessous) : les seuils du DSL
          // (`dose_metformine > 2000`) continuent de s'évaluer à l'identique — c'est toute la raison de ne
          // pas avoir basculé le critère en `enum`, qui n'admet pas d'ordre (`engine/conditions.ts`).
          //
          // `<select>` plutôt que des boutons segmentés : le seuil `MAX_VALEURS_SEGMENTE` (4) qui gouverne
          // déjà les `enum` vaut ici pour la même raison quantitative — une série de paliers en compte
          // typiquement bien plus, et les rendre en boutons déborderait la grille.
          //
          // MÊME REPRÉSENTATION DE L'INDÉTERMINÉ que le `<select>` d'`enum` plus bas (D20/R7) : option vide
          // `disabled` en tête, sélectionnée tant que le critère n'est pas `touched`. Sans elle, le
          // navigateur afficherait le premier palier comme s'il avait été choisi, exactement le défaut A de
          // la recette du 2026-07-27.
          <select
            className="criteria-form__input"
            value={touched.has(critere.nom) ? String(criteria[critere.nom] ?? '') : ''}
            onChange={(event) => onChange(critere.nom, Number(event.target.value))}
          >
            <option value="" disabled>
              —
            </option>
            {critere.paliers.map((palier) => (
              <option key={palier} value={palier}>
                {palier}
              </option>
            ))}
          </select>
        ) : critere.type === 'nombre' ? (
          <input
            type="number"
            className="criteria-form__input"
            placeholder="—"
            // Bornes du domaine clinique (docs/decision/GRAMMAIRE-NOEUD.md, schema/noeud.schema.json) :
            // répercutées telles quelles sur l'attribut HTML natif, générique — aucun nom de critère en
            // dur (invariant 5). Absentes du contenu → `undefined`, input non borné (comportement
            // historique inchangé). Bloque la saisie absurde (ex. -1 sur un compte de facteurs de risque)
            // sans que le moteur (`evaluateNode`) n'ait à en connaître.
            min={critere.min}
            max={critere.max}
            // Champ non touché : reste vide (pas de "0" trompeur pris pour une valeur saisie).
            value={touched.has(critere.nom) ? Number(criteria[critere.nom] ?? 0) : ''}
            onChange={(event) => {
              const brut = event.target.value
              // D20 R7 (défauts de recette 12.2/13.3) : un champ VIDÉ n'est PAS une réponse « 0 » — cf.
              // docstring `onEffacer` ci-dessus. `event.target.value === ''` couvre le cas normal (touche
              // Suppr/Retour arrière) ; un état intermédiaire invalide (ex. juste "-") sanitize aussi vers
              // `''` côté navigateur pour un `<input type="number">` — traité pareil, limite acceptée.
              if (brut === '') {
                if (onEffacer) onEffacer(critere.nom)
                else onChange(critere.nom, 0) // repli rétro-compatible si `onEffacer` n'est pas fourni.
                return
              }
              onChange(critere.nom, Number(brut))
            }}
          />
        ) : segmente ? (
          <div className="criteria-form__segmented" role="group" aria-label={labelForCritere(critere.nom)}>
            {valeurs.map((valeur) => {
              // `touched` EXIGÉ (correctif du 2026-07-27, défaut A de la recette référent — le plus
              // rentable du rapport : une condition, quatre symptômes en cascade).
              //
              // Sans lui, ce test allumait le segment sur la seule égalité de valeur. Or
              // `valeurParDefaut` (`lib/formLayout.ts`) initialise tout `enum` à sa PREMIÈRE valeur
              // déclarée : le premier segment s'affichait donc SÉLECTIONNÉ dès le chargement, sans
              // qu'aucun clic n'ait eu lieu. `touched`, lui, n'est alimenté que par un `onChange` réel
              // — le moteur tenait donc le critère pour INDÉTERMINÉ (D20/R7) pendant que l'écran
              // affirmait le contraire.
              //
              // Ce que ça a produit en consultation : « Traitements en cours » restait affiché alors
              // que l'intention était d'INITIER (le `visible_si: "intention != initier"` ne se
              // déclenchait jamais) ; sur `insuline`, les 8 `visible_si` masquant le bloc MCG au
              // patient naïf étaient intégralement neutralisés, les 9 options passaient « en attente »
              // en réclamant un champ que l'écran montrait comme déjà répondu, et « Poursuivre le
              // schéma d'insuline en cours » était proposé à un naïf.
              //
              // P5 · S1 T-032 : ce booléen sert AUSSI à décider le GESTE (`onClick` ci-dessous), pas
              // seulement le rendu — cf. sa docstring pour pourquoi la répétition du clic doit effacer.
              const selectionne = touched.has(critere.nom) && String(criteria[critere.nom] ?? '') === valeur
              const icone = iconForEnumValue(valeur)
              const ton = toneForEnumValue(valeur)
              return (
                <button
                  key={valeur}
                  type="button"
                  className="criteria-form__segment"
                  data-on={selectionne || undefined}
                  // A9 (arbitrage référent, 2026-07-27 soir) : `data-on` ne pilote QUE le style — rien
                  // n'exposait la valeur retenue à un lecteur d'écran, qui annonçait trois boutons
                  // indiscernables. C'est le même invariant que tout le lot 1, appliqué à qui ne voit pas
                  // l'écran : ce que l'interface affirme doit être ce que le moteur croit.
                  // `false` sur TOUS les segments quand le critère n'est pas `touched` — c'est exactement
                  // la représentation de l'indéterminé de D20, sans avoir à l'inventer.
                  aria-pressed={selectionne}
                  // T-107 : le ton ne teinte le bouton qu'à l'état SÉLECTIONNÉ, même repli que `data-on`
                  // ci-dessus — sinon les options d'un même champ s'allumeraient toutes en couleur au
                  // repos, et plus rien ne distinguerait la réponse retenue (Décision clé, S4.md T-107
                  // étape 7). La PASTILLE ci-dessous, elle, reste visible en permanence : c'est un repère
                  // de lecture des options, pas un indicateur d'état.
                  data-ton={selectionne ? ton : undefined}
                  title={describeEnumValue(valeur)}
                  // P5 · S1 T-032 (BILAN-P4-2026-07-28.md §2/§6) : un clic sur le segment DÉJÀ sélectionné
                  // EFFACE la réponse au lieu de la reposer — seul moyen de revenir à « non répondu »,
                  // jusqu'ici réservé au champ `nombre` (`onEffacer` ci-dessus). C'est la répétition du
                  // clic qui bascule, pas un second élément d'interface (design fixé, cf. "Décision clé").
                  // Repli si `onEffacer` n'est pas fourni par l'appelant : ancien comportement inchangé
                  // (`onChange`), même contrat de repli que le champ `nombre`, pour ne jamais casser un
                  // appelant existant qui ne le passerait pas. Un clic sur un segment NON sélectionné
                  // n'est pas concerné : comportement inchangé dans tous les cas.
                  onClick={() => {
                    if (selectionne && onEffacer) onEffacer(critere.nom)
                    else onChange(critere.nom, valeur)
                  }}
                >
                  {/* Icône (2026-08-01, amélioration de lisibilité ; convertie en <Icon> SVG le
                      2026-08-01, P11/S4 T-107) : dictionnaire générique par VALEUR (`lib/labels.ts`
                      `iconForEnumValue`, même mécanisme que `labelForEnumValue`/`describeEnumValue` — un
                      catalogue de contenu, jamais un nom de critère en dur dans ce composant). Absente
                      pour toute valeur non cataloguée → repli sur la pastille de ton (ci-dessous), puis
                      sur le texte seul. */}
                  {icone ? (
                    <span aria-hidden="true" className="criteria-form__segment-icon">
                      <Icon nom={icone} />
                    </span>
                  ) : (
                    // T-107 étape 6 : pastille ronde pour les valeurs à ton SANS icône, réservée aux 4
                    // crans de `position_vs_cible` (`pastilleForEnumValue`, cf. sa docstring dans
                    // `lib/labels.ts` — un sous-ensemble de `ENUM_VALUE_TONES`, pas « toute valeur à ton
                    // sans icône » : l'albuminurie et le risque hypoglycémique restent sans pastille dans
                    // la maquette). Visible en permanence (pas conditionnée à `selectionne`) : c'est un
                    // repère de lecture des options, pas un indicateur d'état — cf. le commentaire sur
                    // `data-ton` ci-dessus.
                    ton &&
                    pastilleForEnumValue(valeur) && (
                      <span className="criteria-form__segment-pastille" aria-hidden="true" data-ton={ton} />
                    )
                  )}
                  {labelForEnumValue(valeur)}
                </button>
              )
            })}
          </div>
        ) : (
          <select
            className="criteria-form__input"
            // Même correctif que le `data-on` ci-dessus, pour la variante `<select>` (enum de plus de
            // MAX_VALEURS_SEGMENTE valeurs) : un `<select>` affiche sa première `<option>` quand aucune
            // ne correspond à sa `value`. L'option vide ci-dessous rend l'état « pas encore répondu »
            // REPRÉSENTABLE — sans elle, il n'existe aucune valeur à donner au champ pour ne rien dire.
            value={touched.has(critere.nom) ? String(criteria[critere.nom] ?? '') : ''}
            onChange={(event) => onChange(critere.nom, event.target.value)}
          >
            <option value="" disabled>
              —
            </option>
            {valeurs.map((valeur) => (
              <option key={valeur} value={valeur}>
                {labelForEnumValue(valeur)}
              </option>
            ))}
          </select>
        )}

        {renderAide(critere)}
        {renderDetailPanneau(critere)}
        {hints?.[critere.nom] && <div className="criteria-form__hint">{hints[critere.nom]}</div>}
      </div>
    )
  }

  return (
    <div className="criteria-form">
      {contraintesViolees != null && contraintesViolees.length > 0 && (
        <div className="criteria-form__contraintes" role="alert">
          {contraintesViolees.map((contrainte) => (
            <p key={contrainte.expression} className="criteria-form__contrainte">
              {contrainte.message}
            </p>
          ))}
        </div>
      )}
      {/* BARRE DE CHIPS RETIRÉE le 2026-07-29 (recette référent). Elle doublait, en tête de formulaire,
          exactement ce que porte déjà le titre de chaque section dans le flux : son libellé et son nombre
          de champs à confirmer. Deux affichages pour une même information coûtaient de la hauteur d'écran
          (elle passait sur deux lignes avec des libellés tronqués) sans rien ajouter.

          LA NAVIGATION NE REPOSAIT PAS SUR ELLE : le titre d'une section repliée est lui-même un bouton
          d'ouverture (`criteria-form__group-header-bouton`, plus bas), et le pied de section porte un
          bouton « Suivant : … ». Les deux existaient déjà et sont conservés. Le compteur, lui, a migré à
          côté du titre — cf. `criteria-form__group-compte`.

          RECONFIRMÉ PAR P11 (S4.md T-106, arbitrage référent du 2026-08-01, question 2) : le retrait
          reste acquis, la barre ne revient pas. En contrepartie, un en-tête replié était devenu un bouton
          SANS AUCUN indicateur visuel d'ouverture — corrigé par le chevron (`criteria-form__group-
          chevron`, plus bas), l'affordance retenue à sa place. */}
      {groupes.map((groupe, index) => {
        // Pied de section (tâches 4 & 5) : entièrement dérivé du TYPE + de `aConfirmer`, aucun nom de
        // champ ni de section en dur (invariant 5). Deux informations indépendantes, qui peuvent cohabiter :
        //  - les `nombre` décisifs non renseignés (mêmes que le marqueur ambre, tâche 3) → rappel textuel ;
        //  - les `bool` décisifs non renseignés → bouton « Rien à signaler ». Seuil À PARTIR DE 1 (D20 R7,
        //    revu depuis 2 — SPEC-valeur-indeterminee.md §2.2) : un `bool` `confirmation_requise` ISOLÉ
        //    (ex. `diabete_complique` sur `statine`) reste `indetermine` tant qu'il n'est pas confirmé — sans
        //    ce bouton, un seul drapeau de ce type n'aurait AUCUN moyen d'être confirmé (le marqueur ambre
        //    s'allume, mais cocher/décocher la case revient à choisir une valeur, pas à dire « pas demandé »).
        const nombresARenseigner = aConfirmer
          ? groupe.champs.filter((c) => c.type === 'nombre' && aConfirmer.has(c.nom))
          : []
        const boolsAConfirmer = aConfirmer
          ? groupe.champs.filter((c) => c.type === 'bool' && aConfirmer.has(c.nom))
          : []
        const confirmerBools = boolsAConfirmer.length >= 1 ? onConfirmerChamps : undefined
        const afficherPiedDeSection = nombresARenseigner.length > 0 || confirmerBools != null

        const cle = clesGroupes[index]
        // Compteur porté par le TITRE de section depuis le retrait de la barre de chips (2026-07-29) —
        // même définition qu'elle employait (`compteurAConfirmer`), donc aucun changement de sémantique :
        // le nombre affiché reste EXACTEMENT le nombre de marqueurs « · à confirmer » rendus dans la
        // section, invariant testé dans `CriteriaForm.test.tsx`.
        const compteGroupe = compteurAConfirmer(groupe.champs)
        // Sans accordéon (un seul groupe) : TOUJOURS ouvert, comportement historique inchangé.
        const estOuvert = !accordeon || cle === groupeOuvert
        const groupeSuivant = accordeon && index < groupes.length - 1 ? groupes[index + 1] : null

        return (
          <section
            key={cle}
            className="criteria-form__group"
            ref={(el) => {
              if (el) sectionsMontees.current.set(cle, el)
              else sectionsMontees.current.delete(cle)
            }}
          >
            {/* Repli sans `groupe` déclaré : intitulé historique unique, pour ne pas laisser la section nue. */}
            {estOuvert ? (
              <div className="criteria-form__label">
                {groupe.libelle ?? 'Critères du patient'}
                {compteGroupe > 0 && <span className="criteria-form__group-compte">{compteGroupe} à confirmer</span>}
              </div>
            ) : (
              // Section repliée : le libellé devient LUI-MÊME un bouton d'ouverture — le « bouton pour
              // l'ouvrir » de la Décision clé, distinct du clic sur la barre de chips (qui couvre déjà
              // l'ouverture, mais depuis le haut du formulaire plutôt que depuis la section elle-même).
              <button
                type="button"
                className="criteria-form__label criteria-form__group-header-bouton"
                onClick={() => ouvrirGroupe(cle)}
              >
                {/* T-106 — chevron d'affordance : SEULEMENT sur un en-tête REPLIÉ (ce `<button>`-ci),
                    jamais sur l'en-tête OUVERT (le `<div>` juste au-dessus, pas un bouton — l'accordéon
                    garantit qu'une section reste toujours ouverte, « la replier » n'est pas un geste
                    possible, cf. Décision clé de la tâche). Libellé+compteur regroupés dans un seul
                    élément flex pour que le chevron, poussé à l'opposé par `justify-content:
                    space-between` (`CriteriaForm.css`), ne sépare jamais le compteur de son libellé. */}
                <span className="criteria-form__group-header-texte">
                  {groupe.libelle ?? 'Critères du patient'}
                  {compteGroupe > 0 && <span className="criteria-form__group-compte">{compteGroupe} à confirmer</span>}
                </span>
                <Icon nom="chevron-bas" className="criteria-form__group-chevron" />
              </button>
            )}

            {estOuvert ? (
              <>
                <div className="criteria-form__grid">{groupe.champs.map(renderChamp)}</div>

                {/* T-133 (P12/S8) : valeur(s) calculée(s) des critères DÉRIVÉS numériques de CETTE section
                    (même `groupe` que leurs opérandes, cf. docstring de `derivesNumeriques`) — rendues
                    APRÈS la grille des champs saisissables, jamais MÊLÉES à elle (ce ne sont pas des champs). */}
                {derivesNumeriques
                  .filter((d) => (d.groupe ?? undefined) === groupe.libelle)
                  .map(renderValeurCalculee)}

                {afficherPiedDeSection && (
                  <div className="criteria-form__group-footer">
                    {nombresARenseigner.length > 0 && (
                      <p className="criteria-form__group-reminder">
                        À renseigner dans cette section : {nombresARenseigner.map((c) => labelForCritere(c.nom)).join(', ')}
                      </p>
                    )}
                    {confirmerBools != null && (
                      <button
                        type="button"
                        className="criteria-form__group-rien"
                        onClick={() => confirmerBools(boolsAConfirmer.map((c) => c.nom))}
                      >
                        Rien à signaler
                      </button>
                    )}
                  </div>
                )}

                {groupeSuivant && (
                  <div className="criteria-form__group-suivant">
                    <button
                      type="button"
                      className="criteria-form__group-suivant-bouton"
                      onClick={() => ouvrirGroupe(clesGroupes[index + 1])}
                    >
                      Suivant : {groupeSuivant.libelle ?? 'section suivante'} →
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="criteria-form__group-resume">{resumeGroupe(groupe.champs)}</div>
            )}
          </section>
        )
      })}
    </div>
  )
}
