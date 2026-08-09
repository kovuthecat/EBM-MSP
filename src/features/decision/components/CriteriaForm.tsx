import { useEffect, useId, useMemo, useRef, useState } from 'react'
import type { Contrainte, CritereEntree } from '../content/node.types'
import type { Criteria, CriteriaValue } from '../engine/conditions'
import { determinesEffectifs, evaluerNombre } from '../engine/deriveCritere'
import type { GroupeChamps } from '../lib/formLayout'
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
  /**
   * D50/T-179 (P14/S10) — ORIGINE d'un champ pré-rempli PAR PUBLICATION (`Option.publie`, amende D28) :
   * nœud + option d'où vient la valeur, pour les seuls noms présents dans `preremplis` ci-dessus qui y
   * sont entrés PAR CE CANAL plutôt que par une règle de contenu (`CritereEntree.preremplissage`). NE
   * CRÉE PAS un second registre visuel — `estPrerempli`/`renderOrigine` (ci-dessous) restent le SEUL
   * chemin de rendu (étape 5, S10.md : « réutiliser le rendu en place, ne pas en créer un second ») :
   * cette carte n'ajoute que l'origine, en clair, à la mention « · calculé, à vérifier » déjà affichée.
   *
   * TEXTE DÉJÀ RÉSOLU par l'appelant (`noeudTitre`, pas un id) : ce composant reste générique, aucun nom
   * de nœud connu d'avance (D8) — c'est `DecisionNodeScreen.tsx`, qui importe déjà `getNoeudById`, qui
   * résout `OriginePublication.noeudId` (`lib/sessionCriteres.ts`) en un titre affichable. Optionnel :
   * absent, ou un nom sans entrée ⇒ mention inchangée (repli sur le pré-remplissage de contenu ordinaire,
   * sans origine détaillée) — rétro-compatible avec tout appelant qui ne connaît pas encore D50.
   */
  originesPubliees?: ReadonlyMap<string, { noeudTitre: string; optionIntitule: string }>
  /**
   * T-157 (P13/S8, P5) — OUVERTURE CIBLÉE DEPUIS L'EXTÉRIEUR DU FORMULAIRE. Décision clé (S8.md) : « le
   * plus simple qui marche : pas de contexte global, pas d'événement custom — une prop. » L'appelant (le
   * cartouche « en attente » de `DecisionNodeScreen.tsx`) pose ici le NOM d'un critère à atteindre ; ce
   * composant en déduit sa section (`groupes`, déjà calculé), l'ouvre si besoin, puis porte le focus
   * clavier sur le champ (cf. les `ref` posées par `renderChamp` dans `champsMontes`, plus bas).
   *
   * Objet plutôt que chaîne nue, et un NOUVEL OBJET à CHAQUE demande (l'appelant ne doit jamais réutiliser
   * la même référence) : un `useEffect` clé sur l'IDENTITÉ de cette prop (`[champCible]`) redéclenche
   * l'ouverture même si le practicien reclique sur EXACTEMENT le même critère sans qu'aucun autre état
   * n'ait changé entre-temps — une chaîne nue identique n'aurait pas relancé l'effet une seconde fois.
   * `null`/absent : aucune demande en cours, comportement rigoureusement inchangé (rétro-compatible).
   *
   * Un nom qui ne correspond à AUCUN champ actuellement dans `groupes` (section masquée, faute de frappe
   * de l'appelant) est silencieusement ignoré : ce composant ne connaît aucun nom de critère à l'avance
   * (invariant 5) et ne peut pas savoir si un nom absent est une erreur ou un champ redevenu masqué entre
   * le clic et ce rendu — mieux vaut ne rien faire qu'échouer bruyamment sur une course entre deux états.
   */
  champCible?: { nom: string } | null
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
  originesPubliees,
  champCible,
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

  /**
   * T-157 (P13/S8, P5) — OUVERTURE CIBLÉE + FOCUS, pilotées par `champCible` (cf. sa docstring dans
   * `CriteriaFormProps`). Deux registres, comme `sectionsMontees` ci-dessus pour les sections :
   *  - `champsMontes` : l'élément focalisable PRINCIPAL de chaque champ actuellement RENDU (posé par
   *    `renderChamp`, un seul par nom de critère — la case à cocher d'un `bool`, l'`<input>`/`<select>`
   *    d'un `nombre`, LE PREMIER bouton d'un `enum` segmenté, LE PREMIER `<input>` coché d'une `liste`) ;
   *  - `champAFocaliser` : le nom du critère qu'une demande EXTERNE (`champCible`) vise, tant que le focus
   *    n'a pas encore pu être posé. `useRef`, jamais `useState` : sa mutation ne doit PAS provoquer un
   *    second rendu, seulement être relue par l'effet ci-dessous au rendu SUIVANT (déjà déclenché par
   *    `setGroupeOuvertManuel` s'il a fallu changer de section).
   */
  const champsMontes = useRef(new Map<string, HTMLElement>())
  const champAFocaliser = useRef<string | null>(null)
  const registrerChamp = (nom: string) => (el: HTMLElement | null) => {
    if (el) champsMontes.current.set(nom, el)
    else champsMontes.current.delete(nom)
  }

  // EFFET A — réagit à une NOUVELLE demande externe (identité de `champCible`, cf. sa docstring : un objet
  // frais à chaque clic, même nom relance quand même l'effet). Ouvre la section porteuse si elle n'est pas
  // déjà la section ouverte ; sinon (nœud à un seul groupe, ou section déjà ouverte) ne fait qu'armer
  // `champAFocaliser` — l'EFFET B ci-dessous s'occupe du focus, qu'il y ait eu ouverture ou non.
  useEffect(() => {
    if (!champCible) return
    const groupe = groupes.find((g) => g.champs.some((c) => c.nom === champCible.nom))
    if (!groupe) return // nom introuvable dans les champs actuels : silencieusement ignoré, cf. docstring.
    champAFocaliser.current = champCible.nom
    if (accordeon) {
      const cle = clesGroupes[groupes.indexOf(groupe)]
      if (cle !== groupeOuvert) ouvrirGroupe(cle)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- ne réagit QU'À une nouvelle demande externe
    // (`champCible`), jamais à l'ouverture de section qui peut en découler (gérée par l'EFFET B) : inclure
    // `groupes`/`groupeOuvert` (recalculés à CHAQUE rendu, jamais mémoïsés) redéclencherait cet effet en
    // boucle sur un rendu qui n'a rien à voir avec une demande.
  }, [champCible])

  // EFFET B — sans tableau de dépendances : tourne après CHAQUE rendu (sortie immédiate si rien n'est en
  // attente, coût négligeable), pour attraper le PREMIER rendu où le champ visé est enfin monté (soit tout
  // de suite si sa section était déjà ouverte, soit un rendu plus tard si l'EFFET A vient de basculer
  // `groupeOuvertManuel`). Le focus déclenche lui-même un défilement navigateur si le champ est hors
  // viewport (comportement natif de `HTMLElement.focus()`), en plus du `scrollIntoView` déjà posé par
  // `ouvrirGroupe` — les deux visent le même endroit, jamais en conflit.
  useEffect(() => {
    if (champAFocaliser.current == null) return
    const el = champsMontes.current.get(champAFocaliser.current)
    if (!el) return // section pas encore ouverte à CE rendu : retente au rendu suivant.
    el.focus()
    champAFocaliser.current = null
  })

  // T-108 — description des valeurs atteignable au clic. Un seul panneau ouvert à la fois (nom du
  // critère concerné, `null` si aucun) : même registre que `groupeOuvertManuel` ci-dessus, à une échelle
  // plus fine (le champ, pas la section). `idBase` (React 19 `useId`) évite toute collision d'`id` si ce
  // composant devait un jour être monté deux fois sur la même page (aucun cas actuel, mais l'`id` doit
  // être unique dans TOUT le document, pas seulement dans ce formulaire).
  const idBase = useId()
  const [detailOuvert, setDetailOuvert] = useState<string | null>(null)

  // SAISIE TOLÉRANTE (`CritereEntree.unite_flexible`, 2026-08-04) — texte TEL QUE TAPÉ pour les champs
  // concernés, le temps de la frappe : `criteria[nom]` reste la valeur COMMISE (un nombre), mais l'input
  // affiche cette mémoire tampon locale tant qu'elle existe, pour ne jamais réécrire sous les doigts du
  // praticien un « 1, » intermédiaire (pas encore un nombre valide) ou un « 170 » pas encore corrigé en
  // 1,70 (la correction d'échelle n'a lieu qu'au blur, cf. `onBlur` plus bas). Vidée (retrait de la clé)
  // dès le blur, pour que le champ retombe sur `criteria[nom]` — source de vérité — au prochain rendu.
  const [texteFlexible, setTexteFlexible] = useState<Record<string, string>>({})
  const retirerTexteFlexible = (nom: string) =>
    setTexteFlexible((etat) => {
      if (!(nom in etat)) return etat
      const suivant = { ...etat }
      delete suivant[nom]
      return suivant
    })
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
   * AUTO-AVANCE QUAND UNE SECTION À PLUSIEURS CHAMPS N'A PLUS RIEN « À CONFIRMER » (demande référent
   * 2026-08-09). Complète T-156 (`autoAvanceVersGroupe` plus bas, qui ne couvre qu'une section à UN SEUL
   * champ `enum` segmenté) : ici, la section ouverte peut porter plusieurs champs (bool, enum, nombre) —
   * dès que le dernier champ DÉCISIF encore réclamé vient d'être répondu, elle cède la place à la
   * suivante. Appelée EXPLICITEMENT depuis chaque geste qui répond à un champ (case `bool`, bouton `enum`,
   * `onBlur` d'un `nombre`, clic « Rien à signaler ») — jamais depuis un `useEffect` réactif.
   *
   * POURQUOI PAS UN EFFET RÉACTIF (« le compte de la section ouverte vient-il de tomber à 0 ? ») —
   * PREMIÈRE VERSION DE CETTE TÂCHE, RETIRÉE APRÈS UN DÉFAUT TROUVÉ AU BANC
   * (`DecisionNodeScreen.bascule.test.tsx`, cas `insuline` « Basale seule → Naïf → Basale seule ») : sur ce
   * nœud réel, changer `situation_insulinotherapie` démasque/remasque plusieurs sections EN CASCADE
   * (`visible_si`) — le compte « à confirmer » d'une section peut donc tomber à 0 parce que SES CHAMPS
   * VIENNENT D'ÊTRE MASQUÉS (retirés du décompte), pas parce que le praticien vient d'y répondre. Un effet
   * qui ne regarde que « le compte a-t-il baissé » ne peut pas distinguer les deux cas et avance à tort
   * pendant une cascade de masquage sans rapport avec une réponse. En appelant cette fonction SEULEMENT
   * depuis le geste qui répond à un champ précis, l'ambiguïté disparaît par construction : elle ne
   * s'exécute jamais pendant un simple démasquage.
   *
   * EXCLUSION VOLONTAIRE, à la demande du référent : une section qui porte un critère `type: liste`
   * (cases à cocher multiples, ex. « Traitements en cours ») n'a AUCUN signal de fin — cocher une case
   * puis une autre ne dit jamais « j'ai fini d'énumérer », contrairement à un `bool`/`enum`/`nombre` où
   * CHAQUE réponse est déjà complète. Auto-avancer là pousserait le praticien plus loin avant qu'il ait
   * fini de cocher.
   *
   * `nomsRepondus` : un seul nom (une saisie individuelle) ou plusieurs (« Rien à signaler », qui répond à
   * toute une volée de champs d'un coup) — la section avance si, une fois CES noms retirés, plus aucun
   * champ de la section ne reste dans `aConfirmer`.
   *
   * `valeursPatch` (T-156bis, 2026-08-09, bug trouvé au banc sur `prescription` juste après le premier
   * correctif ci-dessus) — LA MÊME classe de défaut, à une échelle plus fine : cocher `intolerance_traitement`
   * (section « Tolérance et préférences ») RÉVÈLE dans la MÊME section un `type: liste` (`nature_intolerance`,
   * `visible_si: "intolerance_traitement == true"`) — mais `groupes`/`aConfirmer`, capturés dans CE rendu,
   * datent d'AVANT ce clic : ni l'un ni l'autre ne voit encore ce nouveau champ, donc ni l'exclusion `liste`
   * ni le calcul « reste-t-il un décisif ? » ne peuvent le compter. Résultat observé : la section avançait
   * quand même, une fraction de rendu avant que la case à cocher tout juste révélée n'existe pour de bon.
   * `valeursPatch` reconstruit la composition RÉELLE de la section (`grouperChamps` rejoué avec la valeur
   * qu'on vient de poser) avant de statuer — jamais sur la base d'un rendu déjà périmé.
   */
  const avanceSiSectionComplete = (nomsRepondus: readonly string[], valeursPatch: Record<string, CriteriaValue> = {}) => {
    if (!accordeon || groupeOuvert == null || !aConfirmer) return
    const criteriaPatchee: Criteria = { ...criteria, ...valeursPatch }
    const touchedPatchee = new Set([...touched, ...nomsRepondus])
    const groupesActuels = grouperChamps(criteresEntree, criteriaPatchee, touchedPatchee)
    const clesActuelles = groupesActuels.map((g, i) => g.libelle ?? `__sans-groupe-${i}`)
    const index = clesActuelles.indexOf(groupeOuvert)
    if (index === -1 || index >= groupesActuels.length - 1) return
    const groupe = groupesActuels[index]
    if (!groupe.champs.some((c) => nomsRepondus.includes(c.nom))) return // pas cette section.
    if (groupe.champs.some((c) => c.type === 'liste')) return
    const resteAConfirmer = groupe.champs.some(
      (c) => !nomsRepondus.includes(c.nom) && aConfirmer.has(c.nom),
    )
    if (!resteAConfirmer) ouvrirGroupe(clesActuelles[index + 1])
  }

  /**
   * AUTO-AVANCE QUAND LE DERNIER CHAMP MANQUANT VIENT D'ÊTRE PRÉ-REMPLI (bug référent 2026-08-09,
   * `formLayout.ts` `appliquerPreremplissage`/`renseignesEffectifs`) — cas que `avanceSiSectionComplete`
   * ci-dessus ne couvre PAS : un champ répond directement à un GESTE (case cochée, bouton cliqué…), mais
   * un pré-remplissage (K6/D50) est un EFFET DE BORD calculé par l'appelant (`DecisionNodeScreen.tsx`
   * `handleCriteriaChange`), APRÈS le rendu où le geste a eu lieu — le nom du champ pré-rempli n'est donc
   * ni dans `nomsRepondus` ni dans `valeursPatch` de l'appel fait depuis le geste d'origine (souvent un
   * AUTRE champ, ex. `HbA1c_actuelle`, qui pré-remplit `position_vs_cible`). Sans ce second déclencheur,
   * la section restait ouverte bien que complète — seul un aller-retour manuel (décocher/recocher un
   * champ quelconque de la section) relançait `avanceSiSectionComplete` et révélait qu'elle était déjà
   * complète. Symptôme exact remonté par le référent : « le nœud cible pré-remplit HbA1c cible mais pas
   * le rapport à la cible […] doit être décoché puis recoché ».
   *
   * DÉCLENCHEUR CIBLÉ, PAS UN EFFET GÉNÉRAL SUR `aConfirmer` — même prudence que ci-dessus (docstring de
   * `avanceSiSectionComplete`) : on ne réagit qu'à des noms qui VIENNENT D'ENTRER dans `preremplis`
   * (diff avec le rendu précédent), jamais à une simple baisse du compte « à confirmer ». `preremplis`
   * n'est JAMAIS purgé par un masquage en cascade (contrat T-138, cf. commentaires `DecisionNodeScreen.tsx`
   * autour de `setPreremplis`) — il ne peut donc pas produire le faux positif qui avait fait retirer la
   * première version de ce mécanisme (cascade `situation_insulinotherapie`/`intention`, cf. plus haut).
   * Ignoré au tout premier rendu (la ref de comparaison démarre déjà alignée sur `preremplis`) : un nœud
   * ouvert avec des champs déjà pré-remplis à l'initialisation garde son comportement historique, seul un
   * pré-remplissage survenant EN COURS DE SAISIE déclenche l'avance.
   */
  const preremplisPrecedents = useRef<ReadonlySet<string>>(preremplis ?? new Set())
  useEffect(() => {
    const precedents = preremplisPrecedents.current
    const actuels = preremplis ?? new Set()
    const nouveaux = [...actuels].filter((nom) => !precedents.has(nom))
    preremplisPrecedents.current = actuels
    if (nouveaux.length > 0) avanceSiSectionComplete(nouveaux)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- ne réagit QU'à un changement de `preremplis`
    // (diff calculé ci-dessus) : inclure `avanceSiSectionComplete`/`groupeOuvert`/`aConfirmer` (recalculés
    // à CHAQUE rendu) redéclencherait cet effet sans rapport avec un pré-remplissage, cf. la docstring.
  }, [preremplis])

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

  /**
   * Résumé d'une ligne pour une section repliée : `Libellé : valeur` par champ renseigné, séparés par
   * « · ». Texte fixe si aucun champ du groupe n'est renseigné — le même quel que soit le nœud.
   *
   * T-148 (P13/S5, P6) — LES DRAPEAUX RÉPONDUS « NON » SE REGROUPENT, forme COMPACTE mais EXHAUSTIVE
   * (« 5 drapeaux : non », jamais un sous-ensemble) : c'est le seul contrôle dont dispose le praticien
   * sur ce qu'une déclaration « Rien à signaler » a réellement couvert — les nommer un par un ferait
   * revenir la même longueur de résumé qu'avant le geste global, ce qui n'aide personne à vérifier qu'il
   * a bien été exhaustif. Un `bool` répondu « Oui », lui, reste nommé INDIVIDUELLEMENT : c'est un constat
   * positif, jamais anodin, à la différence d'un « non » de série (même distinction que le marqueur
   * « · à confirmer », qui ne s'affiche jamais sur une case cochée).
   */
  const resumeGroupe = (champs: CritereEntree[]): string => {
    const boolsNonRepondus = champs.filter(
      (c) => c.type === 'bool' && touched.has(c.nom) && !criteria[c.nom],
    )
    const nomsBoolsNon = new Set(boolsNonRepondus.map((c) => c.nom))
    const parties = champs
      .map((c) => {
        if (nomsBoolsNon.has(c.nom)) return null // regroupés ci-dessous, jamais énumérés un par un.
        const v = valeurResumeChamp(c)
        return v == null ? null : `${labelForCritere(c.nom)} : ${v}`
      })
      .filter((partie): partie is string => partie != null)
    if (boolsNonRepondus.length > 0) {
      parties.push(`${boolsNonRepondus.length} drapeau${boolsNonRepondus.length > 1 ? 'x' : ''} : non`)
    }
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

  /**
   * Mention d'origine d'une valeur que le praticien n'a pas tapée sur CET écran.
   *
   * D50/T-179 — MÊME branche `estPrerempli`, MÊME texte de base (« · calculé, à vérifier ») qu'un
   * pré-remplissage de contenu ordinaire : une valeur PUBLIÉE (`Option.publie`) suit la sémantique de
   * `preremplissage` telle quelle (D50), et `originesPubliees` (optionnel) ne fait qu'AJOUTER l'origine en
   * clair après ce même texte — aucun second registre visuel créé (étape 5, S10.md). Un pré-remplissage de
   * CONTENU (sans entrée dans `originesPubliees`) garde le rendu HISTORIQUE, byte à byte : `origine` vaut
   * alors `undefined`, et le fragment ajouté est une chaîne vide.
   */
  const renderOrigine = (critere: CritereEntree) => {
    if (estRepris(critere)) {
      return <span className="criteria-form__field-repris"> · repris de votre saisie</span>
    }
    if (estPrerempli(critere)) {
      const origine = originesPubliees?.get(critere.nom)
      return (
        <span className="criteria-form__field-repris">
          {' · calculé, à vérifier'}
          {origine ? ` — d'après « ${origine.optionIntitule} » (${origine.noeudTitre})` : ''}
        </span>
      )
    }
    return null
  }

  /**
   * T-156 (P13/S8, P4) — AUTO-AVANCE APRÈS UN CHOIX SEGMENTÉ UNIQUE. Décision clé (S8.md) : « une section
   * qui ne contient qu'UN SEUL champ, de type `enum` rendu en boutons segmentés, ouvre la section suivante
   * dès qu'une valeur est choisie ». Condition EXACTE, calculée ici pour être passée à `renderChamp`
   * (lui-même appelé PAR CHAMP, sans savoir combien de champs porte sa section) : `groupe.champs.length
   * === 1` (jamais une section à cases à cocher, où « fini » n'a pas de signal, cf. Décision clé) et ce
   * champ unique est un `enum` segmenté au SENS DU RENDU (même seuil `MAX_VALEURS_SEGMENTE` que la
   * branche `segmente` de `renderChamp`, pas une seconde définition qui pourrait diverger).
   *
   * `autoAvanceVersGroupe` (deuxième argument de `renderChamp` ci-dessous) ne porte donc de valeur QUE
   * pour ce champ précis, et seulement s'il existe une section suivante à ouvrir (dernière section : rien
   * n'avance, cf. Étape 2 "pas sur la dernière section").
   */
  const champUniqueDeLaSection = (groupe: GroupeChamps): CritereEntree | null =>
    groupe.champs.length === 1 ? groupe.champs[0] : null
  const estAutoAvancable = (critere: CritereEntree): boolean =>
    critere.type === 'enum' &&
    (critere.valeurs?.length ?? 0) > 0 &&
    (critere.valeurs?.length ?? 0) <= MAX_VALEURS_SEGMENTE

  const renderChamp = (critere: CritereEntree, autoAvanceVersGroupe: string | null = null) => {
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
          {/* Drapeau plutôt que case à cocher (2026-08-04, demande utilisateur) : contour au repos,
              rempli une fois coché — la classe `criteria-form__field--flag` portait déjà ce nom avant ce
              changement, la case native n'en avait encore que le nom. La case reste dans le DOM
              (accessibilité clavier/lecteur d'écran, `:checked` pilote l'icône en CSS pur) mais devient
              visuellement invisible (`criteria-form__flag-input`) au profit de l'icône juste à côté. */}
          <input
            type="checkbox"
            className="criteria-form__flag-input"
            checked={Boolean(criteria[critere.nom])}
            onChange={(event) => {
              onChange(critere.nom, event.target.checked)
              avanceSiSectionComplete([critere.nom], { [critere.nom]: event.target.checked })
            }}
            ref={registrerChamp(critere.nom)}
          />
          <Icon nom="drapeau" taille={16} className="criteria-form__flag-icon" />
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
            {valeursListe.map((valeur, index) => {
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
                    // T-157 — une `liste` n'a pas UN champ focalisable mais plusieurs cases : la PREMIÈRE
                    // sert de point d'entrée (cf. docstring de `champsMontes`), cohérent avec la lecture au
                    // clavier (Tab depuis là parcourt les suivantes).
                    ref={index === 0 ? registrerChamp(critere.nom) : undefined}
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
            onChange={(event) => {
              const valeur = Number(event.target.value)
              onChange(critere.nom, valeur)
              avanceSiSectionComplete([critere.nom], { [critere.nom]: valeur })
            }}
            ref={registrerChamp(critere.nom)}
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
        ) : critere.type === 'nombre' && critere.unite_flexible ? (
          // SAISIE TOLÉRANTE (`CritereEntree.unite_flexible`, 2026-08-04) — `<input type="text">` : un
          // `<input type="number">` REFUSE la virgule dans la plupart des navigateurs, donc `taille` ne
          // peut pas rester un input natif si la virgule doit être acceptée. `inputMode="decimal"` garde
          // un clavier numérique sur mobile malgré le `type="text"`.
          <input
            type="text"
            inputMode="decimal"
            className="criteria-form__input"
            placeholder="—"
            value={
              texteFlexible[critere.nom] ??
              (touched.has(critere.nom) ? String(criteria[critere.nom] ?? '') : '')
            }
            onChange={(event) => {
              const brut = event.target.value
              setTexteFlexible((etat) => ({ ...etat, [critere.nom]: brut }))
              if (brut.trim() === '') {
                if (onEffacer) onEffacer(critere.nom)
                else onChange(critere.nom, 0)
                return
              }
              // Commis TEL QUEL pendant la frappe (virgule → point, AUCUNE correction d'échelle ici : cf.
              // docstring `unite_flexible`, la réécrire sous les doigts casserait la saisie de « 170 »
              // dès « 17 »). Une chaîne pas encore un nombre valide (« 1, », « - ») ne commet rien : le
              // tampon local (`texteFlexible`) garde l'affichage, `criteria[nom]` reste sa dernière valeur
              // valide.
              const normalise = Number(brut.replace(',', '.'))
              if (Number.isFinite(normalise)) onChange(critere.nom, normalise)
            }}
            onBlur={(event) => {
              const brut = event.target.value
              if (brut.trim() === '') {
                retirerTexteFlexible(critere.nom)
                return
              }
              const normalise = Number(brut.replace(',', '.'))
              if (!Number.isFinite(normalise)) {
                retirerTexteFlexible(critere.nom)
                return
              }
              // CORRECTION D'ÉCHELLE (« 170 » → 1,70) — seulement au blur, seulement si `min`/`max` sont
              // déclarés (sinon aucun domaine où atterrir) et seulement si la valeur brute est HORS
              // domaine : une saisie déjà dans [min, max] n'est jamais retouchée, même si sa forme
              // divisée y tomberait aussi (ex. 1,7 ÷ 10 = 0,17 ne doit jamais remplacer 1,7 valide).
              let valeurFinale = normalise
              if (
                critere.min != null &&
                critere.max != null &&
                !(normalise >= critere.min && normalise <= critere.max)
              ) {
                const candidate = [normalise / 10, normalise / 100].find(
                  (v) => v >= critere.min! && v <= critere.max!,
                )
                if (candidate != null) valeurFinale = candidate
              }
              onChange(critere.nom, valeurFinale)
              // Retombe sur `criteria[nom]` (source de vérité) au prochain rendu plutôt que de garder ce
              // tampon : évite un texte figé qui ne suivrait plus une valeur changée par ailleurs (reprise
              // de session, pré-remplissage).
              retirerTexteFlexible(critere.nom)
              avanceSiSectionComplete([critere.nom], { [critere.nom]: valeurFinale })
            }}
            ref={registrerChamp(critere.nom)}
          />
        ) : critere.type === 'nombre' ? (
          <input
            type="number"
            className="criteria-form__input"
            placeholder="—"
            ref={registrerChamp(critere.nom)}
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
            // `onBlur`, pas `onChange` : avancer dès la première frappe couperait la saisie en cours
            // (« 1 » de « 180 » suffirait à faire fuir le champ) — la perte de focus est le seul signal
            // fiable de « fini de taper ce nombre » (même principe que la correction d'échelle de la
            // variante `unite_flexible`, `onBlur` ci-dessus).
            onBlur={() => avanceSiSectionComplete([critere.nom])}
          />
        ) : segmente ? (
          <div className="criteria-form__segmented" role="group" aria-label={labelForCritere(critere.nom)}>
            {valeurs.map((valeur, index) => {
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
                  // T-157 — point d'entrée clavier du champ : LE PREMIER bouton du groupe (jamais celui
                  // sélectionné — cf. docstring de `champsMontes` : un critère réclamé par le cartouche
                  // « en attente » est par construction NON RÉPONDU, aucun segment n'est sélectionné).
                  ref={index === 0 ? registrerChamp(critere.nom) : undefined}
                  // GÉNÉRIQUE, indexé par la VALEUR d'énumération (2026-08-04, demande utilisateur :
                  // icônes plus lisibles au premier coup d'œil) — même mécanisme que `data-on`/`data-ton`
                  // ci-dessous, jamais un nom de critère en dur. Pilote UNIQUEMENT la couleur de l'icône
                  // (`.criteria-form__segment-icon`, `CriteriaForm.css`), scopée aux 4 valeurs d'`intention`
                  // qui n'ont pas de `ton` clinique (`iconForEnumValue` en est le seul autre consommateur) :
                  // une valeur qui a déjà un `ton` (position_vs_cible, albuminurie…) n'est pas concernée,
                  // ces règles ne ciblent que les 4 verbes par leur nom exact.
                  data-valeur={valeur}
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
                    if (selectionne && onEffacer) {
                      onEffacer(critere.nom)
                      return
                    }
                    // T-156 — PREMIER CHOIX SEULEMENT : `touched` lu AVANT cet `onChange`, donc encore
                    // fidèle à l'état d'AVANT ce clic (garde-fou 1, S8.md — « si le praticien revient en
                    // arrière et change son choix, on n'auto-avance pas une seconde fois »). Un champ
                    // REPRIS de session arrive déjà `touched` (`sessionCriteres.ts`) : le premier clic du
                    // praticien sur un tel champ est donc une CORRECTION, pas une première saisie — même
                    // garde-fou, aucun cas particulier à écrire.
                    const premierChoix = !touched.has(critere.nom)
                    onChange(critere.nom, valeur)
                    if (premierChoix && autoAvanceVersGroupe) ouvrirGroupe(autoAvanceVersGroupe)
                    // Section à PLUSIEURS champs (T-156 ci-dessus ne couvre que le champ UNIQUE d'une
                    // section) : avance si ce choix vient de solder le dernier décisif encore réclamé.
                    else avanceSiSectionComplete([critere.nom], { [critere.nom]: valeur })
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
            onChange={(event) => {
              onChange(critere.nom, event.target.value)
              avanceSiSectionComplete([critere.nom], { [critere.nom]: event.target.value })
            }}
            ref={registrerChamp(critere.nom)}
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
        // T-148 (P13/S5) — DEUX NOTIONS DISTINCTES, qui vivaient confondues sous un seul nom
        // (`boolsAConfirmer`) et c'était précisément le défaut (D13, revue de conception du 2026-08-04,
        // T5/P6) : « Rien à signaler » ne répondait qu'aux `bool` DÉCISIFS À L'INSTANT DU CLIC — un
        // drapeau devenu décisif ENSUITE (ex. « Dénutrition », une fois poids/taille connus) redevenait
        // « à confirmer » dans une section que le praticien croyait soldée.
        //
        //  - CE QUI DÉCLENCHE L'AFFICHAGE du bouton (inchangé, seuil >= 1, cf. le commentaire l.9xx
        //    ci-dessus sur la raison du seuil) : les `bool` DÉCISIFS non confirmés de la section.
        //  - CE À QUOI IL RÉPOND, une fois cliqué : TOUS les `bool` VISIBLES non renseignés de la
        //    section, décisifs ou non — répondre à tous d'un coup couvre par construction un drapeau qui
        //    deviendrait décisif plus tard, puisqu'il a déjà reçu sa réponse « non ».
        //
        // LE CAS RÉSIDUEL — un `bool` MASQUÉ (`visible_si` faux) au moment du clic — est réglé par
        // CONSTRUCTION, pas par un filtre ajouté ici : `groupe.champs` est déjà la liste des champs
        // VISIBLES à cet instant (`grouperChamps`, lib/formLayout.ts) ; un champ masqué n'y figure pas,
        // donc n'est jamais répondu. C'est un ARBITRAGE RENDU par le référent (2026-08-04,
        // `plans/P13/index.md` §Arbitrages n° 2, réponse OUI À UNE CONDITION) : seuls les drapeaux
        // EFFECTIVEMENT AFFICHÉS au moment du clic sont couverts, peu importe leur décisivité à cet
        // instant — un drapeau masqué ne l'est pas. Ce n'est plus une préférence d'implémentation.
        const boolsDecisifsNonConfirmes = aConfirmer
          ? groupe.champs.filter((c) => c.type === 'bool' && aConfirmer.has(c.nom))
          : []
        const boolsVisiblesNonRenseignes = groupe.champs.filter((c) => c.type === 'bool' && !touched.has(c.nom))
        // Demande référent 2026-08-09 : « Rien à signaler » répond aussi aux `enum` SANS EFFET SUR LA
        // RECO actuelle (`estDim`, cf. sa définition plus haut — exige déjà `!touched`) — ex. « Préférence
        // vis-à-vis de l'injectable » → se retrouve marquée à sa valeur par défaut (déjà celle que porte
        // `criteria`, `lib/formLayout.ts` `valeurParDefaut` : la 1ʳᵉ valeur déclarée). JAMAIS un `enum`
        // DÉCISIF (R1/D20) : le mécanisme ne doit jamais inventer une réponse qui compte pour la reco,
        // seulement acter qu'un champ SANS EFFET n'a rien à dire.
        const enumsSansEffetNonRenseignes = groupe.champs.filter(
          (c) => c.type === 'enum' && !touched.has(c.nom) && estDim(c.nom),
        )
        const champsConfirmablesEnUnClic = [...boolsVisiblesNonRenseignes, ...enumsSansEffetNonRenseignes]
        const confirmerBools = boolsDecisifsNonConfirmes.length >= 1 ? onConfirmerChamps : undefined
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
        // T-156 — cf. la docstring de `champUniqueDeLaSection`/`estAutoAvancable` ci-dessus : `null` sauf
        // pour LE champ unique d'une section auto-avançable QUI A une section suivante (jamais la
        // dernière, Étape 2).
        const champUnique = champUniqueDeLaSection(groupe)
        const autoAvanceVersGroupe =
          champUnique != null && estAutoAvancable(champUnique) && groupeSuivant != null
            ? clesGroupes[index + 1]
            : null

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
                <div className="criteria-form__grid">
                  {groupe.champs.map((c) => renderChamp(c, autoAvanceVersGroupe))}
                </div>

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
                        // T-148 : répond à TOUS les `bool` visibles non renseignés, pas seulement aux
                        // décisifs qui ont déclenché l'affichage du bouton — cf. le commentaire ci-dessus.
                        // 2026-08-09 : + les `enum` sans effet sur la reco (`champsConfirmablesEnUnClic`),
                        // et avance à la section suivante si ce geste solde tous les décisifs restants.
                        onClick={() => {
                          const noms = champsConfirmablesEnUnClic.map((c) => c.nom)
                          confirmerBools(noms)
                          avanceSiSectionComplete(noms)
                        }}
                      >
                        Rien à signaler
                      </button>
                    )}
                  </div>
                )}

                {groupeSuivant && (
                  <div className="criteria-form__group-suivant">
                    {/* 2026-08-09 (demande référent, allègement de page) : icône seule plutôt que
                        « Suivant : {libellé} → » — le libellé de la section suivante reste porté par
                        `aria-label` (lecteurs d'écran) et par son propre titre, visible juste en dessous
                        une fois la section ouverte. */}
                    <button
                      type="button"
                      className="criteria-form__group-suivant-bouton"
                      onClick={() => ouvrirGroupe(clesGroupes[index + 1])}
                      aria-label={`Suivant : ${groupeSuivant.libelle ?? 'section suivante'}`}
                    >
                      <Icon nom="chevron-bas" taille={18} />
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
