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
   * marquer une case comme « à confirmer » suggère à tort qu'il faut la cocher. `decisifsAConfirmer` reste
   * lui-même générique (tous types confondus) — c'est le RENDU ici qui filtre par type, pas la fonction.
   */
  aConfirmer?: ReadonlySet<string>
  /**
   * Confirme d'un coup une liste de critères `bool` décisifs comme « rien à signaler » (tâche 4) : ils
   * passent `touched` SANS changer leur valeur (ils restent à `false`, qui EST la réponse). Optionnel :
   * absent → le bouton de pied de section ne s'affiche pas (rétro‑compatible).
   */
  onConfirmerChamps?: (noms: string[]) => void
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
  onChange,
}: CriteriaFormProps) {
  const groupes = grouperChamps(criteresEntree, criteriaGroupement ?? criteria)

  // Estompage (remarque 6) : un critère hors de `pertinents` n'a, pour CE patient, aucun effet sur la reco.
  // Absent (`pertinents` non fourni) → jamais estompé. Un champ déjà `touched` n'est JAMAIS estompé (tâche
  // 6b) : la valeur saisie par le praticien reste pleinement lisible même redevenue non décisive. Générique :
  // aucun nom de critère connu d'avance.
  const estDim = (nom: string) => pertinents != null && !pertinents.has(nom) && !touched.has(nom)
  // Marqueur visuel restreint aux `nombre` (tâche 3) : seul un défaut `0` n'est jamais une réponse
  // clinique valide (`bool` faux = « non » ; `enum`/`liste` défaut = valeur déclarée par le contenu).
  const estAConfirmer = (critere: CritereEntree) => critere.type === 'nombre' && aConfirmer?.has(critere.nom) === true

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
          <span className="criteria-form__checkbox-label">{labelForCritere(critere.nom)}</span>
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
            // Champ non touché : reste vide (pas de "0" trompeur pris pour une valeur saisie).
            value={touched.has(critere.nom) ? Number(criteria[critere.nom] ?? 0) : ''}
            onChange={(event) => onChange(critere.nom, Number(event.target.value))}
          />
        ) : segmente ? (
          <div className="criteria-form__segmented" role="group" aria-label={labelForCritere(critere.nom)}>
            {valeurs.map((valeur) => (
              <button
                key={valeur}
                type="button"
                className="criteria-form__segment"
                data-on={String(criteria[critere.nom] ?? '') === valeur || undefined}
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
            value={String(criteria[critere.nom] ?? '')}
            onChange={(event) => onChange(critere.nom, event.target.value)}
          >
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
        //  - les `bool` décisifs non renseignés, au nombre d'AU MOINS 2 → bouton « Rien à signaler » (un
        //    seul drapeau isolé se coche aussi vite qu'un bouton dédié ; le bouton ne vaut que passé ce seuil).
        const nombresARenseigner = aConfirmer
          ? groupe.champs.filter((c) => c.type === 'nombre' && aConfirmer.has(c.nom))
          : []
        const boolsAConfirmer = aConfirmer
          ? groupe.champs.filter((c) => c.type === 'bool' && aConfirmer.has(c.nom))
          : []
        const confirmerBools = boolsAConfirmer.length >= 2 ? onConfirmerChamps : undefined
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
