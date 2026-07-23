import './DisclaimerBar.css'

/** Bandeau disclaimer permanent (chrome), non intrusif mais toujours visible. */
export function DisclaimerBar() {
  return (
    <div className="disclaimer-bar">
      <span className="disclaimer-bar__icon" aria-hidden="true">
        i
      </span>
      <p className="disclaimer-bar__text">
        Outil d'aide à la décision fondé exclusivement sur les données de la science (EBM). Le
        praticien, par son jugement clinique, reste le lien avec le patient et sa situation
        individuelle — et le seul responsable de la décision médicale.
      </p>
    </div>
  )
}
