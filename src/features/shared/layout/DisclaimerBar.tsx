import './DisclaimerBar.css'

/** Bandeau disclaimer permanent (chrome), non intrusif mais toujours visible. */
export function DisclaimerBar() {
  return (
    <div className="disclaimer-bar">
      <span className="disclaimer-bar__icon" aria-hidden="true">
        i
      </span>
      <p className="disclaimer-bar__text">
        <strong className="disclaimer-bar__lead">
          Outil d'aide à la décision fondé exclusivement sur les données de la science (EBM).
        </strong>
        <br />
        Le praticien, par son jugement clinique, reste <strong>le lien avec le patient</strong> et sa
        situation individuelle — et <strong>le seul responsable</strong> de la décision médicale.
      </p>
    </div>
  )
}
