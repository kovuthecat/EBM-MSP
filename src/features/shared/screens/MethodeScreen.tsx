import './MethodeScreen.css'

/**
 * S1 — Méthode : résumé de docs/veille/SOP_veille.md (contenu autoritaire),
 * pas le texte illustratif du prototype (cf. plans/P1/S1.md T-008 Décision clé).
 * Version affichée = version réelle de la SOP (v1.0), sans date inventée.
 */
const SECTIONS: Array<{ title: string; body: string }> = [
  {
    title: 'Hiérarchie des sources (modèle 6S)',
    body: "La veille privilégie les sources pré-évaluées, à haut rendement de lecture. Tier 1 — synthèses EBM pré-appréciées (Minerva, Prescrire, Cochrane, NNT.com, McMaster EvidenceAlerts, BMJ EBM, Médicalement Geek/DragiWebdo, Exercer). Tier 2 — recommandations et agences (HAS, sociétés savantes par thème, ANSM). Tier 3 — sommaires des grandes revues (NEJM, Lancet, JAMA, BMJ, Annals et revues spécialisées par profil). Tier 4 — études primaires, uniquement en vérification ou approfondissement d'un signal déjà repéré. Les outils d'IA (type OpenEvidence, web-fetch) ne servent qu'au débroussaillage complémentaire, jamais de source primaire : toute sortie IA est revérifiée sur l'article original.",
  },
  {
    title: 'Cycle hebdomadaire',
    body: "Cycle fixe et hebdomadaire : collecte sur les sources retenues (alertes automatisées) → présélection selon les critères d'inclusion et d'exclusion, avec un journal de screening → analyse critique de chaque article retenu, fiabilisée par une vérification bi-agents pour les items à impact pratique → classement (thèmes, professions concernées, niveau de preuve, niveau d'impact, temps de lecture, impact sur un algorithme) → double validation par un second contributeur pour tout item à impact pratique → mise en forme et publication (résumé critique + lien, jamais de copie intégrale) → pour les items concernant un algorithme, rédaction d'un diff proposé puis validation du comité éditorial avant toute mise à jour versionnée.",
  },
  {
    title: "Critères d'inclusion",
    body: "Sont retenus : un design pertinent (essai randomisé, méta-analyse, recommandation, cohorte de qualité), une question pertinente pour les soins premiers ou le profil concerné, un critère de jugement important pour le patient. Sont exclus : les études précliniques ou animales, les très petits effectifs non répliqués, les critères purement intermédiaires sans portée clinique, les communiqués de presse sans article, les doublons et le contenu déjà couvert.",
  },
  {
    title: "Grille d'appréciation",
    body: "Chaque article retenu est apprécié sur le risque de biais (sélection, mesure), la distinction critère dur vs critère de substitution, l'effet absolu et le NNT/NNH plutôt que le seul risque relatif, la cohérence avec le corpus de preuves existant, et les conflits d'intérêt déclarés. L'analyse s'ancre sur la source primaire : l'accord entre deux lectures n'est jamais pris pour une vérité en soi.",
  },
  {
    title: 'Garde-fous',
    body: "Aucune étude isolée ne justifie à elle seule un changement de pratique — elle est replacée dans la totalité des preuves. On remonte toujours à la source primaire, jamais à un communiqué ou un réseau social ; on lit les résultats en absolu et les critères pré-enregistrés ; on se méfie de l'absence de preuve prise pour une preuve d'absence. Rétractations et errata sont vérifiés avant toute intégration. Aucune mise à jour d'algorithme n'est automatique : toute proposition issue de la veille est signalée, puis validée par le comité éditorial avant d'être intégrée, de façon tracée et versionnée. Aucune donnée patient n'est collectée par le module de veille.",
  },
]

export function MethodeScreen() {
  return (
    <div className="methode">
      <h1 className="methode__title">Méthode</h1>
      <p className="methode__version">
        SOP de veille clinique — version 1.0 · statut : à valider par le comité éditorial
      </p>

      {SECTIONS.map((section) => (
        <section key={section.title} className="methode__section">
          <div className="methode__section-title">{section.title}</div>
          <p className="methode__section-body">{section.body}</p>
        </section>
      ))}
    </div>
  )
}
