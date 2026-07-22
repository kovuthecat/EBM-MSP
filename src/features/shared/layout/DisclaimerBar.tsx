import './DisclaimerBar.css'

/** Bandeau disclaimer permanent (chrome), non intrusif mais toujours visible. */
export function DisclaimerBar() {
  return (
    <div className="disclaimer-bar">
      <span className="disclaimer-bar__icon" aria-hidden="true">
        i
      </span>
      <p className="disclaimer-bar__text">
        Aide à la réflexion clinique — le praticien reste responsable de la décision médicale.
      </p>
    </div>
  )
}
