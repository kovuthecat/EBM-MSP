import type { CritereEntree } from '../content/node.types'
import type { Criteria, CriteriaValue } from '../engine/conditions'
import { grouperChamps } from '../lib/formLayout'
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
  onChange: (nom: string, value: CriteriaValue) => void
}

/** Au‑delà de ce nombre de valeurs, un `enum` est rendu en liste déroulante plutôt qu'en boutons. */
const MAX_VALEURS_SEGMENTE = 4

// `buildDefaultCriteria` vit désormais dans `lib/formLayout.ts` (même préoccupation que la visibilité
// conditionnelle : la remise à zéro d'un champ masqué doit réutiliser EXACTEMENT ces valeurs par défaut).
// Ré-export pour ne pas casser les importateurs existants.
export { buildDefaultCriteria } from '../lib/formLayout'

/**
 * Formulaire de critères (T-006 étape 1, refondu en P3 · S7‑ui Lot 2). Ordonné par le CONTENU : sections
 * `groupe` dans l'ordre de première apparition, champs dans l'ordre de déclaration, champs sans objet
 * masqués par `visible_si` (`lib/formLayout.ts`). Le type d'input dérive du `type` de contenu (`nombre` →
 * input number, `enum` court → boutons segmentés, `enum` long → select, `bool` → case, `liste` → cases
 * multiples). Générique : aucun nom de critère ni de nœud connu d'avance (DECISIONS.md D8) — le
 * raisonnement clinique qui dicte l'ordre vit dans le YAML, pas ici.
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
  onChange,
}: CriteriaFormProps) {
  // `touched` fait aussi office de `renseignes` (D20 R7) pour la VISIBILITÉ (`visible_si`) : un champ dont
  // le `visible_si` porte sur un critère pas encore renseigné doit rester VISIBLE (repli « fail open » de
  // `champEstVisible`, `lib/formLayout.ts`), jamais masqué sur une donnée qu'on ignore encore — cf.
  // `criteriaGroupement`/`touched` ci-dessus : même source que partout ailleurs dans cet écran.
  const groupes = grouperChamps(criteresEntree, criteriaGroupement ?? criteria, touched)

  // Estompage (remarque 6) : un critère hors de `pertinents` n'a, pour CE patient, aucun effet sur la reco.
  // Absent (`pertinents` non fourni) → jamais estompé. Un champ déjà `touched` n'est JAMAIS estompé (tâche
  // 6b) : la valeur saisie par le praticien reste pleinement lisible même redevenue non décisive. Générique :
  // aucun nom de critère connu d'avance.
  const estDim = (nom: string) => pertinents != null && !pertinents.has(nom) && !touched.has(nom)
  // Marqueur visuel : `nombre` (tâche 3), `enum` (2026-07-27, cf. ci-dessous), et un `bool`/`liste`
  // `confirmation_requise` (D20 R7). Un `bool` ORDINAIRE en est exclu — décoché EST la réponse « non ».
  //
  // `enum` AJOUTÉ le 2026-07-27 (défaut A de la recette référent). D20 range `enum` avec `nombre` : non
  // renseigné, il est INDÉTERMINÉ pour le moteur. Rien ne le disait à l'écran, et le rendu affirmait
  // même le contraire — cf. le correctif du `data-on`/`<select>` plus bas.
  // `liste` AJOUTÉ dans le même mouvement (prérequis technique n°1 de l'arbitrage C) : le moteur sait
  // DÉJÀ traiter une `liste` `confirmation_requise` comme indéterminée
  // (`engine/deriveCritere.ts` `critereEstDetermine`, qui teste `bool` ET `liste`) ; seul ce marqueur
  // manquait pour que le praticien le voie.
  const estAConfirmer = (critere: CritereEntree) =>
    aConfirmer?.has(critere.nom) === true &&
    (critere.type === 'nombre' ||
      critere.type === 'enum' ||
      ((critere.type === 'bool' || critere.type === 'liste') && critere.confirmation_requise === true))

  /** Coche/décoche une valeur dans un critère `liste` (tableau de libellés, D13). */
  const toggleListeValeur = (nom: string, valeur: string, coche: boolean) => {
    const actuel = Array.isArray(criteria[nom]) ? (criteria[nom] as string[]) : []
    const suivant = coche ? [...actuel, valeur] : actuel.filter((v) => v !== valeur)
    onChange(nom, suivant)
  }

  const renderChamp = (critere: CritereEntree) => {
    const dim = estDim(critere.nom)
    const confirmer = estAConfirmer(critere)
    const valeurs = critere.valeurs ?? []

    if (critere.type === 'bool') {
      return (
        <label
          key={critere.nom}
          className="criteria-form__field criteria-form__field--flag"
          data-dim={dim || undefined}
          data-confirmer={confirmer || undefined}
        >
          <input
            type="checkbox"
            checked={Boolean(criteria[critere.nom])}
            onChange={(event) => onChange(critere.nom, event.target.checked)}
          />
          <span className="criteria-form__checkbox-label">
            {labelForCritere(critere.nom)}
            {/* `confirmation_requise` seulement (D20 R7) : jamais sur un `bool` ordinaire, cf. `estAConfirmer`. */}
            {confirmer && <span className="criteria-form__field-todo"> · à confirmer</span>}
          </span>
        </label>
      )
    }

    if (critere.type === 'liste') {
      const cochees = Array.isArray(criteria[critere.nom]) ? (criteria[critere.nom] as string[]) : []
      return (
        <div
          key={critere.nom}
          className="criteria-form__field criteria-form__field--wide"
          data-dim={dim || undefined}
          data-confirmer={confirmer || undefined}
        >
          <div className="criteria-form__field-label">
            {labelForCritere(critere.nom)}
            {confirmer && <span className="criteria-form__field-todo"> · à confirmer</span>}
          </div>
          <div className="criteria-form__chips">
            {valeurs.map((valeur) => (
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
      >
        <div className="criteria-form__field-label">
          {labelForCritere(critere.nom)}
          {dim && <span className="criteria-form__field-note"> · sans effet sur la reco actuelle</span>}
          {confirmer && <span className="criteria-form__field-todo"> · à confirmer</span>}
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
            {valeurs.map((valeur) => (
              <button
                key={valeur}
                type="button"
                className="criteria-form__segment"
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
                data-on={(touched.has(critere.nom) && String(criteria[critere.nom] ?? '') === valeur) || undefined}
                title={describeEnumValue(valeur)}
                onClick={() => onChange(critere.nom, valeur)}
              >
                {labelForEnumValue(valeur)}
              </button>
            ))}
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

        {hints?.[critere.nom] && <div className="criteria-form__hint">{hints[critere.nom]}</div>}
      </div>
    )
  }

  return (
    <div className="criteria-form">
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

        return (
          <section key={groupe.libelle ?? `__sans-groupe-${index}`} className="criteria-form__group">
            {/* Repli sans `groupe` déclaré : intitulé historique unique, pour ne pas laisser la section nue. */}
            <div className="criteria-form__label">{groupe.libelle ?? 'Critères du patient'}</div>
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
          </section>
        )
      })}
    </div>
  )
}
