import type { CritereEntree } from '../content/node.types'
import type { Criteria, CriteriaValue } from '../engine/conditions'
import { labelForCritere, labelForEnumValue } from '../lib/labels'
import './CriteriaForm.css'

interface CriteriaFormProps {
  criteresEntree: CritereEntree[]
  criteria: Criteria
  /** Noms des critères déjà modifiés par l'utilisateur (T-009 : distingue « valeur par défaut » de « valeur saisie »). */
  touched: ReadonlySet<string>
  /** Texte d'aide optionnel par nom de critère (ex. suggestion auto d'`esperance_vie`) — générique, le contenu du texte est décidé par l'appelant (D8). */
  hints?: Partial<Record<string, string>>
  onChange: (nom: string, value: CriteriaValue) => void
}

/**
 * Construit l'état initial des critères depuis `criteres_entree` : une valeur de départ générique
 * par type (T-006 étape 1 : « état local des critères, valeurs de départ raisonnables »). Générique
 * et sans connaissance clinique du critère (CLAUDE.md invariant 5) : `nombre` → 0, `bool` → false,
 * `enum` → la première valeur déclarée dans `valeurs` (donc pilotée par le contenu, pas par une
 * hypothèse clinique). Garantit que chaque critère du nœud est présent dans l'objet renvoyé, pour
 * que `evaluateNode`/`evaluateCondition` ne lève jamais une "variable de critère inconnue"
 * (`ConditionError`, `engine/conditions.ts`) sur un critère simplement pas encore modifié à l'écran.
 */
export function buildDefaultCriteria(criteresEntree: CritereEntree[]): Criteria {
  const criteria: Criteria = {}
  for (const critere of criteresEntree) {
    if (critere.type === 'nombre') {
      criteria[critere.nom] = 0
    } else if (critere.type === 'bool') {
      criteria[critere.nom] = false
    } else {
      criteria[critere.nom] = critere.valeurs?.[0] ?? ''
    }
  }
  return criteria
}

/**
 * Formulaire de critères (T-006 étape 1) : un champ par entrée de `criteres_entree`, dont le type
 * d'input dérive du `type` de contenu (`nombre` → input number, `enum` → select, `bool` →
 * checkbox). Générique : ne connaît aucun nom de critère par avance, fonctionne pour n'importe quel
 * nœud futur sans modification (DECISIONS.md D8).
 */
export function CriteriaForm({ criteresEntree, criteria, touched, hints, onChange }: CriteriaFormProps) {
  const champs = criteresEntree.filter((critere) => critere.type !== 'bool')
  const facteurs = criteresEntree.filter((critere) => critere.type === 'bool')

  return (
    <div className="criteria-form">
      <div className="criteria-form__label">Critères du patient</div>
      <div className="criteria-form__grid">
        {champs.map((critere) => (
          <div key={critere.nom} className="criteria-form__field">
            <div className="criteria-form__field-label">{labelForCritere(critere.nom)}</div>
            {critere.type === 'nombre' ? (
              <input
                type="number"
                className="criteria-form__input"
                placeholder="—"
                // Champ non touché : reste vide (pas de "0" trompeur pris pour une valeur saisie).
                value={touched.has(critere.nom) ? Number(criteria[critere.nom] ?? 0) : ''}
                onChange={(event) => onChange(critere.nom, Number(event.target.value))}
              />
            ) : (
              <select
                className="criteria-form__input"
                value={String(criteria[critere.nom] ?? '')}
                onChange={(event) => onChange(critere.nom, event.target.value)}
              >
                {(critere.valeurs ?? []).map((valeur) => (
                  <option key={valeur} value={valeur}>
                    {labelForEnumValue(valeur)}
                  </option>
                ))}
              </select>
            )}
            {hints?.[critere.nom] && <div className="criteria-form__hint">{hints[critere.nom]}</div>}
          </div>
        ))}
      </div>

      {facteurs.length > 0 && (
        <div className="criteria-form__checkboxes">
          {facteurs.map((critere) => (
            <label key={critere.nom} className="criteria-form__checkbox-row">
              <input
                type="checkbox"
                checked={Boolean(criteria[critere.nom])}
                onChange={(event) => onChange(critere.nom, event.target.checked)}
              />
              <span className="criteria-form__checkbox-label">{labelForCritere(critere.nom)}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  )
}
