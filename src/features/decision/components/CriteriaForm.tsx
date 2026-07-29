import { useMemo, useRef, useState } from 'react'
import type { Contrainte, CritereEntree } from '../content/node.types'
import type { Criteria, CriteriaValue } from '../engine/conditions'
import { criteresPilotes, grouperChamps, valeursProposeesDepuisSaisie } from '../lib/formLayout'
import { describeEnumValue, labelForCritere, labelForEnumValue } from '../lib/labels'
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

  // Estompage (remarque 6) : un critère hors de `pertinents` n'a, pour CE patient, aucun effet sur la reco.
  // Absent (`pertinents` non fourni) → jamais estompé. Un champ déjà `touched` n'est JAMAIS estompé (tâche
  // 6b) : la valeur saisie par le praticien reste pleinement lisible même redevenue non décisive. Générique :
  // aucun nom de critère connu d'avance.
  const estDim = (nom: string) => pertinents != null && !pertinents.has(nom) && !touched.has(nom)
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
        >
          <input
            type="checkbox"
            checked={Boolean(criteria[critere.nom])}
            onChange={(event) => onChange(critere.nom, event.target.checked)}
          />
          <span className="criteria-form__checkbox-label">
            {labelForCritere(critere.nom)}
            {pilote && <span className="criteria-form__field-pilote"> · détermine la suite</span>}
            {/* `confirmation_requise` seulement (D20 R7) : jamais sur un `bool` ordinaire, cf. `estAConfirmer`. */}
            {confirmer && <span className="criteria-form__field-todo"> · à confirmer</span>}
            {renderOrigine(critere)}
          </span>
        </label>
      )
      // SANS aide : le `<label>` est rendu TEL QUEL, enfant direct de la grille — aucun changement de
      // structure pour les dizaines de booléens du domaine qui n'en portent pas. L'enveloppe n'existe que
      // là où il y a quelque chose à envelopper.
      if (!critere.aide) return champ
      // Enveloppe SANS style propre au-delà de l'occupation de grille (`--avec-aide`) : elle ne doit pas
      // ajouter un second cadre autour du `<label>`, qui porte déjà le sien.
      return (
        <div key={critere.nom} className="criteria-form__avec-aide">
          {champ}
          {renderAide(critere)}
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
        >
          <div className="criteria-form__field-label">
            {labelForCritere(critere.nom)}
            {pilote && <span className="criteria-form__field-pilote"> · détermine la suite</span>}
            {confirmer && <span className="criteria-form__field-todo"> · à confirmer</span>}
            {renderOrigine(critere)}
          </div>
          {renderAide(critere)}
          <div className="criteria-form__chips">
            {valeursListe.map((valeur) => (
              <label
                key={valeur}
                className="criteria-form__chip"
                data-on={cochees.includes(valeur) || undefined}
                // Infobulle native (ex. lecture de l'AGP par profil, §8-3) — générique, absente si non cataloguée.
                title={describeEnumValue(valeur)}
              >
                <input
                  type="checkbox"
                  checked={cochees.includes(valeur)}
                  onChange={(event) => toggleListeValeur(critere.nom, valeur, event.target.checked)}
                />
                <span className="criteria-form__checkbox-label">{labelForEnumValue(valeur)}</span>
              </label>
            ))}
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
      >
        <div className="criteria-form__field-label">
          {labelForCritere(critere.nom)}
          {pilote && <span className="criteria-form__field-pilote"> · détermine la suite</span>}
          {dim && <span className="criteria-form__field-note"> · sans effet sur la reco actuelle</span>}
          {confirmer && <span className="criteria-form__field-todo"> · à confirmer</span>}
          {renderOrigine(critere)}
        </div>

        {critere.type === 'nombre' ? (
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
      {/* Barre de chips (SB2) : UNIQUEMENT au-delà d'un groupe (Décision clé, « Nœud à une seule
          section : pas d'accordéon ni de barre de chips »). Même registre `aria-pressed` que les boutons
          segmentés du champ `enum` ci-dessus (A9) plutôt que le pattern ARIA `tab`/`tablist` — celui-ci
          suppose une navigation clavier (flèches, roving tabindex) que ce composant n'implémente pas ; un
          rôle `tab` sans ce comportement serait une promesse d'accessibilité non tenue. */}
      {accordeon && (
        <div className="criteria-form__group-nav" role="group" aria-label="Sections du formulaire">
          {groupes.map((groupe, index) => {
            const cle = clesGroupes[index]
            const compte = compteurAConfirmer(groupe.champs)
            const estOuvert = cle === groupeOuvert
            return (
              <button
                key={cle}
                type="button"
                className="criteria-form__group-nav-item"
                data-on={estOuvert || undefined}
                aria-pressed={estOuvert}
                onClick={() => ouvrirGroupe(cle)}
              >
                {groupe.libelle ?? 'Critères du patient'}
                {compte > 0 && <span className="criteria-form__group-nav-badge">{compte}</span>}
              </button>
            )
          })}
        </div>
      )}

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
              <div className="criteria-form__label">{groupe.libelle ?? 'Critères du patient'}</div>
            ) : (
              // Section repliée : le libellé devient LUI-MÊME un bouton d'ouverture — le « bouton pour
              // l'ouvrir » de la Décision clé, distinct du clic sur la barre de chips (qui couvre déjà
              // l'ouverture, mais depuis le haut du formulaire plutôt que depuis la section elle-même).
              <button
                type="button"
                className="criteria-form__label criteria-form__group-header-bouton"
                onClick={() => ouvrirGroupe(cle)}
              >
                {groupe.libelle ?? 'Critères du patient'}
              </button>
            )}

            {estOuvert ? (
              <>
                <div className="criteria-form__grid">{groupe.champs.map(renderChamp)}</div>

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
