import './MethodeScreen.css'

/**
 * S1 — Méthode : résumé de docs/veille/SOP_veille.md (contenu autoritaire),
 * pas le texte illustratif du prototype (cf. plans/P1/S1.md T-008 Décision clé).
 * Version affichée = version réelle de la SOP (v1.0), sans date inventée.
 */
const VEILLE_SECTIONS: Array<{ title: string; body: string }> = [
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

/**
 * Résumé de docs/decision/00-global.md (contenu autoritaire : pipeline de construction des nœuds
 * d'algorithme) + DECISIONS.md D3 (moteur déterministe), D5 (mise à jour non automatique), D11
 * (3 niveaux de lecture). Même traitement que VEILLE_SECTIONS : prose fidèle au doc source, pas le
 * texte du doc recopié tel quel.
 */
const DECISION_SECTIONS: Array<{ title: string; body: string }> = [
  {
    title: "Pipeline de construction d'un nœud",
    body: "Sept étapes tracées, du dossier de preuve à l'algorithme : cadrer la question clinique et les critères d'entrée → collecter en priorité les sources pré-appréciées (Prescrire, Médicalement Geek, Cochrane, HAS, ADA/EASD), puis les essais pivots — les outils d'IA (OpenEvidence, web) servent uniquement au débroussaillage, jamais de source primaire → apprécier chaque étude clé (biais, critère dur vs substitution, effet absolu/NNT-NNH, cohérence, conflits d'intérêt, GRADE) → vérifier à deux (un agent extrait et chiffre, un second traque le biais de présentation et revérifie chaque DOI et chaque chiffre sur la source primaire) → distiller en options + conditions + effet attendu + niveau de preuve dans le nœud, et en argumentaire exhaustif lisible → valider par une relecture clinique humaine (le référent) → encoder et versionner.",
  },
  {
    title: 'Sources interrogées systématiquement',
    body: "Pour chaque nœud, au minimum : Prescrire (analyse indépendante, ancre la « position critique »), HAS (recommandations officielles françaises, ancre la « reco officielle »), le Collège de la Médecine Générale, Cochrane, et Médicalement Geek/DragiWebdo (EBM francophone), puis les essais primaires pivots pour vérification. Reco officielle et position critique sont affichées côte à côte dans l'algorithme, toute divergence entre elles étant explicitement signalée plutôt que masquée.",
  },
  {
    title: 'Règles de sourcing',
    body: "Aucune référence, aucun chiffre, aucun NNT/NNH n'est inventé : tout élément non vérifié est marqué « à vérifier » et n'entre pas dans l'algorithme tant qu'il n'est pas confirmé sur la source primaire. L'effet absolu et le NNT/NNH sont préférés au seul risque relatif, avec l'horizon temporel précisé, et la nature du critère (dur vs substitution) est toujours explicite. Une distinction n'est encodée dans le moteur que si des données EBM (essais, méta-analyses) la soutiennent ; un simple accord d'experts reste affiché en reco officielle sans piloter le moteur. Face à un doute clinique qu'aucune source ne tranche : signaler, ne jamais trancher seul.",
  },
  {
    title: 'Trois niveaux de lecture',
    body: "Chaque nœud expose une transparence graduée : la recommandation (options, avantages/inconvénients, niveau de preuve, effet attendu), l'argumentaire détaillé dépliable (reco officielle face à la position critique, drapeau de divergence, incertitudes, sources principales), et l'argumentaire exhaustif accessible en un clic (toutes les preuves détaillées, essai par essai, et la liste complète des sources) — du survol jusqu'à la preuve complète.",
  },
  {
    title: 'Garde-fous',
    body: "Le moteur qui sélectionne les options est entièrement déterministe : des règles booléennes transparentes, jamais de score caché ni de modèle prédictif. Aucune mise à jour d'un algorithme n'est automatique, y compris depuis la veille : toute proposition est signalée puis validée par le référent avant d'être intégrée, de façon tracée et versionnée (numéro de version + changelog daté). La saisie des critères d'un patient reste locale à la session, sans persistance ni réseau.",
  },
]

export function MethodeScreen() {
  return (
    <div className="methode">
      <h1 className="methode__title">Méthode</h1>

      <section className="methode__group">
        <h2 className="methode__group-title">Veille scientifique</h2>
        <p className="methode__version">
          SOP de veille clinique — version 1.0 · statut : à valider par le comité éditorial
        </p>

        {VEILLE_SECTIONS.map((section) => (
          <section key={section.title} className="methode__section">
            <div className="methode__section-title">{section.title}</div>
            <p className="methode__section-body">{section.body}</p>
          </section>
        ))}
      </section>

      <section className="methode__group">
        <h2 className="methode__group-title">Algorithmes d'aide à la décision</h2>
        <p className="methode__version">
          Méthode de construction des nœuds — version 1.0 · statut : appliquée sur le domaine
          Diabète de type 2 (nœud « Cible glycémique » validé et encodé ; autres nœuds en cours)
        </p>

        {DECISION_SECTIONS.map((section) => (
          <section key={section.title} className="methode__section">
            <div className="methode__section-title">{section.title}</div>
            <p className="methode__section-body">{section.body}</p>
          </section>
        ))}
      </section>
    </div>
  )
}
