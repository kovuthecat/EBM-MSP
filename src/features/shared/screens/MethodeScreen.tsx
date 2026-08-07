import './MethodeScreen.css'

/**
 * Méthode : résumé fidèle des documents autoritaires, jamais un texte marketing.
 * - Veille : docs/veille/SOP_veille.md (v1.2, en vigueur) — rôles réels (§2), cadence (§3),
 *   sources (§4), routes brève/analyse (§5bis, D38), vérification bi-agents + relecture différée
 *   (§5 étape 5, D39), garde-fous (§9).
 * - Décision : docs/decision/CONSTRUIRE-UN-MODULE.md (procédé P0→P7) + 00-global.md (collecte,
 *   règles de sourcing) + DECISIONS.md D3 (déterminisme), D5 (mise à jour non automatique),
 *   D11 (3 niveaux de lecture), D48 (sources primaires à l'écran), D49 (pas de tuyauterie).
 * Règle T-008 (plans/P1/S1.md) : version affichée = version réelle des documents, aucune date
 * inventée ; l'état annoncé (statuts des algorithmes) = l'état réellement déployé.
 */
const VEILLE_SECTIONS: Array<{ title: string; body: string[] }> = [
  {
    title: 'Une méthode qui décrit ce qui est réellement fait',
    body: [
      "Cette page décrit la veille telle qu'elle est produite, avec les moyens réellement disponibles. Quand une ressource n'existe pas encore, la méthode le dit et décrit le dispositif de remplacement, plutôt que de promettre un contrôle qui n'a pas lieu.",
      "Concrètement : la veille repose aujourd'hui sur un référent unique, qui assure la collecte, le tri, l'analyse, la rédaction et la publication, sur neuf thèmes de médecine générale. Il n'y a donc pas encore de regard humain indépendant sur les analyses. Les dispositifs décrits plus bas — vérification croisée par deux agents, relecture différée — réduisent l'erreur d'extraction et la surinterprétation ; ils ne corrigent pas un angle mort que le référent partagerait avec ses outils. Un second relecteur est la première ressource que le projet cherche à recruter.",
      "Quatre thèmes prévus (santé de la femme et périnatalité, orthophonie, soins infirmiers, éducation thérapeutique) ne font l'objet d'aucune production tant qu'un référent de la profession concernée ne les prend pas en charge : l'absence est déclarée, elle n'est pas masquée par un contenu produit hors compétence.",
    ],
  },
  {
    title: 'Cycle hebdomadaire et traçabilité',
    body: [
      "La veille paraît le lundi et couvre les sept jours précédents. Chaque semaine est archivée intégralement : la liste brute des articles repérés, le journal de tri — ce qui a été retenu, exclu ou reporté, avec le motif — et les entrées publiées. Ce journal est un livrable au même titre que les entrées : c'est lui qui distingue une veille méthodique d'un fil de liens.",
      "Une semaine peut ne rien contenir qui change la pratique, et le dire est une information en soi : la veille ne fabrique pas de la nouveauté pour remplir une page.",
    ],
  },
  {
    title: 'Hiérarchie des sources et règle de balayage',
    body: [
      "Les sources pré-évaluées passent d'abord. Tier 1 — synthèses EBM déjà appréciées : Minerva, Prescrire, Cochrane, NNT.com, McMaster EvidenceAlerts, BMJ EBM, Médicalement Geek/DragiWebdo, Exercer. Tier 2 — recommandations et agences : HAS, Collège de la Médecine Générale, sociétés savantes par thème, ANSM. Ces deux niveaux sont balayés chaque semaine, intégralement.",
      "Les sommaires des grandes revues (Tier 3) et les études primaires (Tier 4) ne sont ouverts que pour vérifier ou approfondir un signal déjà repéré — jamais en balayage systématique. Conséquence assumée : un essai important peut être signalé une à deux semaines après sa parution, quand une source pré-évaluée s'en saisit. C'est le prix d'une veille soutenable, préférable à une veille exhaustive qui s'effondre au bout d'un mois. La liste détaillée des sources, avec leur type et leur accès, est versionnée et publique.",
    ],
  },
  {
    title: 'Brève ou analyse : deux formats, un seuil explicite',
    body: [
      "Au tri, trois questions cumulatives décident du sort de chaque article retenu : déplace-t-il une décision fréquente en soins premiers (peut-on nommer le geste qui changerait en consultation) ? L'effet porte-t-il sur un critère important pour le patient, avec une ampleur absolue non triviale — un critère de substitution seul ne suffit jamais ? La population et le comparateur sont-ils transposables à une patientèle de soins premiers ?",
      "Trois oui : l'article part en analyse complète. Sinon il devient une brève, qui signale, situe et pointe la source — sans porter d'appréciation critique propre, donc sans jamais prétendre qu'un résultat change la pratique. Une analyse peut au contraire conclure « ne change rien », et c'est fréquent : « on a regardé de près, et non » est souvent le résultat le plus utile au lecteur.",
      "Quand plus d'articles franchissent le seuil que la semaine ne peut en absorber, l'excédent est reporté — jamais bâclé : une demi-analyse ne se publie pas. Les reports sont datés et visibles dans le journal de tri.",
    ],
  },
  {
    title: 'Comment une analyse est fiabilisée',
    body: [
      "Chaque article analysé passe une grille d'appréciation complète : risque de biais, critère dur ou de substitution, effet absolu et NNT/NNH plutôt que le seul risque relatif, cohérence avec le corpus de preuves existant, conflits d'intérêt déclarés. La grille se remplit toujours depuis la publication scientifique originale — jamais depuis le résumé qu'en fait une source secondaire : une source pré-évaluée sert à repérer, pas à analyser. Si l'étude d'origine n'est pas identifiable, l'article est exclu.",
      "L'analyse est ensuite vérifiée par deux agents d'intelligence artificielle aux rôles opposés — l'un extrait et chiffre, l'autre est missionné pour contredire — travaillant séparément, chacun ancré sur la source primaire. Leurs désaccords sont escaladés au référent, jamais lissés ; un désaccord non résolu empêche la publication en analyse. Enfin, rien n'est publié le jour où il est écrit : chaque entrée est relue à distance de sa rédaction, avec un regard neuf, avant de paraître.",
    ],
  },
  {
    title: 'Garde-fous, et impact sur les algorithmes',
    body: [
      "Résumé critique et lien vers la source, jamais de reproduction intégrale ni de contournement de paywall. Une étude isolée est toujours replacée dans l'ensemble des preuves. Les rétractations et errata sont vérifiés avant toute intégration ; toute sortie d'un outil d'intelligence artificielle est revérifiée sur l'article original, référence et chiffres compris. Si une entrée publiée est corrigée ou rétractée en amont, un erratum daté est publié.",
      "Aucune modification d'un algorithme d'aide à la décision n'est automatique. Tant que le comité éditorial n'existe pas, aucune n'est même appliquée : quand un article concerne un algorithme, la proposition de mise à jour est enregistrée comme candidate, et elle attend une validation collégiale. Aucune donnée patient n'est collectée par la veille.",
    ],
  },
]

const DECISION_SECTIONS: Array<{ title: string; body: string[] }> = [
  {
    title: 'Partir de la consultation, pas de la littérature',
    body: [
      "Avant toute recherche documentaire, le référent clinique écrit ce que l'outil devra savoir faire : les intentions possibles du praticien (initier, intensifier, alléger…), l'inventaire de ce qui peut déjà être en place chez le patient (traitements, doses, tolérance), puis quinze à vingt-cinq cas de patients réels, chacun avec la conduite attendue, rédigée en langage clinique. Ces cas sont gelés et deviennent le contrat : l'algorithme est correct s'il produit ces conduites — pas seulement s'il retranscrit fidèlement la littérature.",
      "Cet ordre vient d'une leçon chèrement acquise sur le premier domaine : lors de la grande recette clinique, aucune des anomalies relevées n'était une erreur de données — pas un chiffre faux, pas une référence erronée. Toutes tenaient au comportement de l'outil face à une situation réelle : donnée manquante, geste déjà fait, deux règles justes qui interagissent mal. La méthode vérifie donc le comportement avec autant de rigueur que les preuves.",
    ],
  },
  {
    title: 'La collecte de preuve, et sa contre-vérification systématique',
    body: [
      "Pour chaque décision que les cas exigent, sont lues les recommandations officielles (HAS, sociétés savantes, ANSM), les synthèses indépendantes (Prescrire, Cochrane, Minerva, Médicalement Geek/DragiWebdo, Collège de la Médecine Générale), puis les essais pivots. Chaque dossier de preuve est vérifié par deux agents indépendants : l'un extrait et chiffre, l'autre — contradicteur — traque le biais de présentation et revérifie chaque référence et chaque chiffre sur la source primaire.",
      "Les outils d'intelligence artificielle servent au débroussaillage, jamais de source : toute sortie est revérifiée sur l'article original — cette règle a notamment permis de détecter des identifiants d'articles erronés rendus par un de ces outils. Et aucun résultat de collecte n'entre dans le contenu sans sa passe contradictoire, y compris quand la collecte affirme avoir trouvé une erreur dans le contenu existant : sur quatre accusations de ce type examinées un même jour, trois se sont révélées infondées, et c'est la contre-vérification qui a rétabli les faits.",
    ],
  },
  {
    title: 'Règles de sourcing',
    body: [
      "Aucune référence, aucun chiffre, aucun NNT n'est inventé : tout élément non vérifié est marqué comme tel et n'entre pas dans l'algorithme tant qu'il n'est pas confirmé sur la source primaire. L'effet absolu et le NNT/NNH sont préférés au seul risque relatif, avec leur horizon temporel ; la nature du critère — dur ou de substitution — est toujours explicite.",
      "Une distinction ne pilote l'algorithme que si des données d'essais la soutiennent ; un accord d'experts est affiché comme recommandation officielle mais ne commande pas la sélection des options. De même, une molécule précise n'est nommée à la place de sa classe que si les données le justifient pour l'indication. Face à un doute clinique qu'aucune source ne tranche : signaler, jamais trancher seul.",
    ],
  },
  {
    title: "Ce que l'écran cite",
    body: [
      "Deux choses différentes : ce qui est lu pour construire une position, et ce qui est cité à l'appui de ce qu'elle affirme. À l'écran ne sont citées que des sources primaires — les essais et les textes de recommandation officiels. Les synthèses qui ont orienté une lecture restent tracées dans le dépôt public du projet, hors de l'écran de consultation : écrire « d'après telle revue » sous une position reviendrait à substituer un nom à un argument. Le praticien qui lit doit pouvoir vérifier, pas faire confiance.",
    ],
  },
  {
    title: "L'algorithme est vérifié, pas seulement ses données",
    body: [
      "Une fois le dossier de preuve validé par le référent clinique, l'encodage passe deux vérifications distinctes. La première contrôle la fidélité : une seconde double lecture, dédiée, confronte le fichier encodé au dossier validé, option par option, chiffre par chiffre. La seconde contrôle le comportement : une batterie de tests automatisée rejoue les cas de patients gelés au départ, puis vérifie des propriétés de sécurité sur des milliers de profils générés — un formulaire vierge ne produit jamais de recommandation, une contre-indication avérée retire toujours l'option concernée, une alerte qui interdit un geste a toujours son garde-fou effectif, deux cartes affichées ensemble ne se contredisent pas. Cette batterie est rejouée en totalité à chaque modification du contenu, correctifs compris.",
      "Vient enfin une recette en conditions réelles, dans le navigateur : la page est lue comme un praticien la lit, allers-retours et retours en arrière compris. C'est cette passe qui a trouvé les défauts que ni les relectures ni les tests n'avaient vus, et elle est obligatoire avant qu'un algorithme soit déclaré validé.",
    ],
  },
  {
    title: "Transparence à l'écran, et garde-fous",
    body: [
      "Le moteur qui sélectionne les options est entièrement déterministe : des règles booléennes lisibles, aucun score caché, jamais de modèle prédictif. Chaque algorithme s'expose sur trois niveaux : la recommandation et son niveau de preuve, l'argumentaire dépliable — avec, le cas échéant, chaque divergence vis-à-vis d'une recommandation officielle présentée en trois faces : ce que dit la recommandation, ce que fait l'outil, sur quelles données —, et l'argumentaire exhaustif, essai par essai. Les incertitudes affichées portent sur les données ou sur leur absence, jamais sur la fabrication interne de l'outil.",
      "Chaque algorithme est versionné, avec un journal des modifications daté. Aucune mise à jour n'est automatique, y compris depuis la veille : toute proposition est validée par un humain avant d'être intégrée. La saisie des critères d'un patient reste locale à la session, sans persistance ni réseau.",
    ],
  },
]

export function MethodeScreen() {
  return (
    <div className="methode">
      <h1 className="methode__title">Méthode</h1>

      <section className="methode__group">
        <h2 className="methode__group-title">Veille scientifique</h2>
        <p className="methode__version">
          Procédure de veille clinique — version 1.2 · en vigueur, validée par le référent veille ·
          périmètre : 9 thèmes de médecine générale
        </p>

        {VEILLE_SECTIONS.map((section) => (
          <section key={section.title} className="methode__section">
            <div className="methode__section-title">{section.title}</div>
            {section.body.map((paragraph, i) => (
              <p key={i} className="methode__section-body">
                {paragraph}
              </p>
            ))}
          </section>
        ))}
      </section>

      <section className="methode__group">
        <h2 className="methode__group-title">Algorithmes d'aide à la décision</h2>
        <p className="methode__version">
          Procédé issu du premier domaine construit — Diabète de type 2 : six algorithmes en ligne,
          deux validés par le référent clinique, quatre en brouillon (relecture clinique finale en
          cours)
        </p>

        {DECISION_SECTIONS.map((section) => (
          <section key={section.title} className="methode__section">
            <div className="methode__section-title">{section.title}</div>
            {section.body.map((paragraph, i) => (
              <p key={i} className="methode__section-body">
                {paragraph}
              </p>
            ))}
          </section>
        ))}
      </section>
    </div>
  )
}
