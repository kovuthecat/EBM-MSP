# A02 — Réconciliation (§7 bi-agents) — Desbiens et al., *Hypertension* 2023;80(10):2209-2217

**Item** : « Mesure de la PA en consultation, trois fois valent mieux qu'une » (relais presse) — Desbiens LC,
Nadeau-Fredette AC, Madore F, Agharazii M, Goupil R. *Impact of Successive Office Blood Pressure Measurements
During a Single Visit on Cardiovascular Risk Prediction: Analysis of CARTaGENE*. Hypertension. 2023 Oct;
80(10):2209-2217. DOI 10.1161/HYPERTENSIONAHA.123.21510 · PMID 37615094.
**Thème** : `cardiovasculaire-prevention` → circuit **§7 bi-agents**, réconciliation par le référent (moi-même),
`meta.relecture_referent: true`.
**Réconciliateur** : Claude Code (Opus), sur pièces — rapports finaux d'Agent A (`epreuve/entrees/A02-agent-A.md`)
et Agent B (`epreuve/entrees/A02-agent-B.md`), sans requête OpenEvidence (exclue pour ce travail). Une tentative
de vérification complémentaire du texte exact de l'abstract via l'outil PubMed a été refusée par la politique de
permissions de la session ; la réconciliation repose donc entièrement sur les citations déjà rapportées par A et
B, qui convergent sur la phrase-clé du « 2× » (cf. §2).

---

## 1. Accord entre A et B (non re-débattu)

Les deux agents, en contextes séparés, convergent sur l'ensemble des points suivants — aucun arbitrage requis :

- **Identification et accès** : PMID/DOI confirmés, 403 sur `ahajournals.org` (vérifié indépendamment par les
  deux), aucun dépôt PMC (`isOpenAccess: N`, `inPMC: N`). Périmètre réel de vérification = **abstract structuré
  seul**.
- **Chiffres bruts exacts** : HR SBP₃ 1,10 [1,05-1,15]/écart-type ; HR SBP₁ 1,06 [1,01-1,10]/écart-type ;
  17 966 participants ; 2 378 MACE ; suivi 10 ans ; CARTaGENE, 40-70 ans. Aucune fabrication, aucune troncature
  d'IC détectée.
- **Rien de chiffré sur la discrimination ni le reclassement** : le C-statistique est mentionné qualitativement
  (« highest », « significantly higher than most other SBP measures ») sans valeur ; aucun NRI/IDI ; **aucun
  chiffre de reclassement hypertendu ↔ non hypertendu** — le chiffre qui rendrait l'article actionnable au
  cabinet est absent des éléments consultables.
- **Résultat diastolique discordant** : « all diastolic BP readings yielded similar results » — l'effet est
  systolique-only, non expliqué dans l'abstract.
- **Nature du critère** : association statistique + performance discriminante d'un modèle prédictif, **pas** un
  effet testé d'une stratégie de mesure comme intervention. Aucun bénéfice patient démontré (reclassement,
  changement de décision thérapeutique) par cette étude.
- **Spin identifié** : la conclusion des auteurs (« reinforce the necessity of using multiple office BP
  readings ») emploie un langage prescriptif/causal sur une analyse observationnelle de performance de modèle —
  glissement de registre.
- **Financement/conflits** : CIHR (public), « Disclosures: None » — rassurant.
- **Niveau de preuve** : **Faible** dans les deux rapports, pour les mêmes raisons (cohorte observationnelle,
  critère de performance de modèle et non un effet clinique, ajustements et méthodes non vérifiables sans texte
  intégral).
- **Verdict de fond (`niveau_impact`)** : **`informatif`** dans les deux rapports — l'étude conforte un protocole
  de mesure déjà recommandé (ESC/ESH, HAS : mesures répétées, ne pas se fier à la 1ʳᵉ) plutôt qu'elle ne le
  modifie. Aucun nœud de décision déplacé (`concerne_decision : non`) dans les deux rapports.

---

## 2. Divergences tranchées sur pièces

### 2.1 Le « 2× » — mécanisme de construction (divergence d'interprétation, pas de citation)

Les deux agents citent la **même phrase source** (« At a given SBP value, the excess MACE risk conferred by
SBP₃ was 2× greater than SBP₁ »), mais en tirent deux lectures différentes :

- **Agent A** avance que le facteur vient de l'écart entre les deux HR par écart-type publiés (excès HR₃ = 0,10 ;
  excès HR₁ = 0,06 → ratio ≈ 1,67, « arrondi en ~2× dans le texte »).
- **Agent B** objecte, à raison, que cette lecture **ignore la clause « at a given SBP value »** — c'est-à-dire
  une réexpression **par unité de pression (mmHg)**, et non par écart-type — et démontre que 0,10/0,06 = 1,67,
  pas 2. Un ratio de 1,67 « arrondi » en « 2-fold » sans justification n'est pas une pratique de rédaction
  scientifique standard ; c'est une reconstruction d'Agent A non étayée par le texte. B propose une
  reconstruction alternative (à partir d'écarts-types hypothétiques de SBP₁ et SBP₃, non publiés) donnant ≈1,9×,
  mais la qualifie lui-même d'**invérifiable**, faute des écarts-types réels dans l'abstract.

**Tranché en faveur d'Agent B** : la lecture la plus rigoureuse de la phrase source est celle qui prend en
compte « at a given SBP value ». Le « 2× » **n'est pas reconstructible** à partir des deux HR par écart-type
publiés — présenter le calcul d'Agent A (« 1,67 arrondi à 2× ») comme l'explication du chiffre serait inexact.
Conséquence rédactionnelle : cf. §3.

### 2.2 Message réel de l'étude — moyenner ou écarter la première mesure ? (omission d'Agent A, non contestée)

**Agent B** relève, citation à l'appui (« all models including SBP₁ … were underperformed », « especially when
the first reading is discarded »), que le résultat le mieux classé est **SBP₃ seule**, et que **toutes les
combinaisons incluant SBP₁** (y compris la moyenne SBP₁₋₂₋₃) sont moins performantes. Le message opérationnel de
l'article est donc « **écarter la première mesure** », pas « en faire trois et moyenner ». Agent A ne relève pas
ce point et ne le contredit pas non plus.

**Tranché en faveur d'Agent B**, faute de contestation et sur citation directe de la source : c'est une omission
d'extraction d'Agent A, pas une divergence de fond. Le titre de presse « trois fois valent mieux qu'une » **dit
l'inverse** du résultat rapporté. C'est le point le plus important pour la rédaction — cf. §3.

### 2.3 Synthèse du risque de biais — « non déterminable » (A) vs « modéré à élevé » (B)

Agent A reste volontairement flou (« non déterminable avec précision — modéré par défaut »). Agent B arrive à
« modéré à élevé », étayé par des mécanismes nommés et non contredits par A : circularité possible de
l'ajustement (modèles ASCVD contenant déjà les facteurs qui expliquent la PA), ampleur d'effet anormalement
faible vs littérature classique (HR ~1,2-1,4/écart-type usuel, ici 1,06-1,10), multiplicité non corrigée
(≥12 modèles comparés), causalité inverse/effet blouse blanche non écarté, biais du volontaire sain.

**Tranché en faveur d'Agent B** : c'est la même incertitude que celle nommée par A, mais argumentée et
localisée plutôt que déclarée par défaut. Retenu : **risque de biais modéré à élevé**, avec les réserves
explicites de B (hypothèses non tranchables sans texte intégral, à ne pas présenter comme des faits établis —
cf. conditions §3).

### 2.4 Portée pratique en France — absente chez A, ajoutée par B (non contestée)

Agent B ajoute un élément absent du rapport d'Agent A et non contredit par lui : en France, le diagnostic
d'HTA **n'est pas fondé sur la seule mesure au cabinet** — la HAS impose une confirmation hors cabinet
(automesure ou MAPA, seuil ≥ 135/85) avant instauration de traitement. Optimiser le classement des mesures
*internes* au cabinet répond donc à une question déjà court-circuitée, en pratique française, par l'étape
suivante du parcours HAS.

**Retenu tel quel** : c'est une précision, sourcée (HAS), qui renforce — sans la contredire — la conclusion
commune « informatif », et doit figurer dans l'entrée pour un lectorat MSP français.

### 2.5 La route — divergence procédurale, tranchée par le référent

C'est la seule divergence de fond sur la **décision**, pas seulement sur le contenu. Agent B propose
explicitement **`route : reporte`**, en distinguant lui-même le fond (« informatif ») de la procédure
(vérification incomplète faute d'accès au texte intégral — construction exacte du « 2× », ampleur du gain de
C-statistique, liste des covariables d'ajustement, tous jugés « matériels au jugement »). Agent A ne prend pas
position sur la route ; son rapport, très prudent, ne pousse pas non plus vers une clôture sans réserve — c'est
une omission relative à sa mission (le gabarit attendait une proposition de route), pas un désaccord actif avec
B.

**Décision du référent : `route = analyse`, publiée, `niveau_impact = informatif` — pas de report.**

Motifs :

1. **L'accès est de fait épuisé pour ce cycle**, pas simplement non tenté. Le 403 est confirmé deux fois,
   indépendamment ; l'absence de dépôt PMC est confirmée par les métadonnées Europe PMC (`isOpenAccess: N`,
   `inPMC: N`, `inEPMC: N`), ce qui est une réponse négative définitive et non une panne de récupération.
   Il n'existe pas de registre d'essai applicable ici (CARTaGENE est une cohorte populationnelle, pas un essai
   avec SAP déposé) — la voie qui a débloqué un report précédent (`JOURNAL_BOITE_MAIL.md` §2bis, essai SELECT)
   ne s'applique pas à ce design. La seule voie restante (courriel à l'auteur correspondant, confrère avec accès
   institutionnel) est une voie lente, incompatible avec la cadence hebdomadaire, et ne justifie pas un report
   au sens du §6bis (le report vise un obstacle levable dans le cycle suivant, pas une attente indéfinie).
2. **La clause de non-nouveauté (SOP §6bis) s'applique directement** et suffit, à elle seule, à fixer
   `informatif` indépendamment des chiffres manquants : l'étude conforte un protocole déjà recommandé
   (ESC 2024/ESH 2023, HAS) sans le déplacer. C'est l'exemple-type donné par la SOP elle-même (« quatrième
   méta-analyse concordante sur un bénéfice déjà recommandé… → informatif, même chiffres manquants »). Les
   éléments non vérifiables (C-statistique chiffré, NRI/IDI, covariables d'ajustement, construction exacte du
   « 2× ») affineraient la confiance mais ne feraient basculer le verdict vers `pratique` dans aucun scénario
   plausible : même dans l'hypothèse la plus favorable au texte intégral, il manquerait encore un chiffre de
   reclassement pour rendre l'étude actionnable, et son absence d'une section Results par ailleurs très
   structurée est en soi un indice (pas une preuve) qu'il n'a pas été jugé assez marquant par les auteurs pour
   y figurer.
3. **Le travail déjà produit n'est pas une demi-analyse.** Les deux agents ont rempli la grille intégralement
   (chaque rubrique traitée, y compris par un « non vérifiable » assumé plutôt qu'un silence) et la vérification
   bi-agents a eu lieu. Le motif qui interdit la publication d'une demi-analyse (SOP §6bis, « règle de file
   d'attente ») ne s'applique pas à un travail complet dont la conclusion honnête est « limité, mais tranchable ».
   Downgrader en brève ferait perdre précisément ce qu'une brève ne peut pas porter : la correction du contre-sens
   de presse (§2.2) et la mise en garde sur le « 2× » (§2.1), qui sont le cœur de la valeur ajoutée de cet item
   pour le lecteur.

La proposition de report d'Agent B n'est donc pas retenue — mais son diagnostic procédural (accès incomplet,
éléments matériels non vérifiés) est intégralement conservé comme limite déclarée de l'entrée, cf. §5.

---

## 3. Tableau de classement complet

| Champ | Valeur retenue |
|---|---|
| `themes[]` | `cardiovasculaire-prevention` |
| `professions_concernees[]` | `MG`, `IPA`, `IDEL` (prise de PA en consultation) |
| `route` | **`analyse`** |
| `niveau_impact` | **`informatif`** |
| `niveau_preuve` | **Faible** — cohorte observationnelle, critère de performance de modèle (association/discrimination) et non un effet clinique testé, risque de biais modéré à élevé (§2.3), ajustements/covariables non vérifiables sans texte intégral |
| `concerne_decision` | **non** — aucun nœud de décision déplacé ; confirme un protocole déjà en vigueur (ESC/ESH, HAS) |
| `temps_lecture_min` | ~5 min |
| `meta.relecture_referent` | **`true`** (thème MG, circuit §7, relecture différée à J+3 du référent applicable normalement) |

---

## 4. Conditions de rédaction opposables

### L'entrée DOIT dire

1. Design exact : cohorte observationnelle prospective (analyse secondaire, CARTaGENE, Québec), n = 17 966,
   40-70 ans, 2 378 MACE sur 10 ans de suivi — critère **dur** (décès CV, AVC, IDM).
2. Les deux HR tels que publiés, sans dramatisation : SBP₃ 1,10 [1,05-1,15]/écart-type vs SBP₁ 1,06
   [1,01-1,10]/écart-type.
3. **Le message opérationnel réel** : la mesure la mieux classée est **SBP₃ seule** ; toute combinaison incluant
   la 1ʳᵉ mesure (y compris la moyenne des trois) est moins performante. L'article dit « écarter la première
   mesure », pas « en faire trois et moyenner » — la formulation de presse doit être explicitement corrigée dans
   l'entrée, pas simplement reprise avec un bémol.
4. Que ce protocole (mesures répétées, ne pas se fier à la 1ʳᵉ) **est déjà celui recommandé** par l'ESC 2024/ESH
   2023 (3 mesures, moyenne des 2 dernières) et par la HAS (minimum 2 mesures) — l'étude conforte une pratique
   existante sur un critère dur, elle ne la change pas.
5. La nuance française : en France, le diagnostic d'HTA n'est pas tranché par la seule mesure de cabinet — la
   HAS impose une confirmation hors cabinet (automesure/MAPA, seuil ≥ 135/85) avant traitement, ce qui limite
   encore la portée opérationnelle de l'article en soins premiers français.
6. Le niveau de preuve (Faible) et sa justification résumée (observationnel, critère de performance de modèle,
   ampleur d'effet modeste, ajustements non vérifiables).
7. La limite d'accès elle-même : appréciation fondée sur l'abstract structuré seul (paywall confirmé, aucune
   version en accès libre) — c'est une limite de l'appréciation, pas un détail technique à taire.
8. Si le « 2× » est cité : uniquement avec le mot **« excès »** (jamais « risque doublé » ou « 2 fois plus de
   risque »), attribué comme formulation des auteurs, et accompagné d'une phrase indiquant qu'il ne se déduit pas
   simplement des deux HR par écart-type publiés.

### L'entrée NE DOIT JAMAIS reprendre

1. Le titre de presse « trois fois valent mieux qu'une » comme accroche ou résumé — il inverse le résultat.
2. « Le risque est doublé » / « risque 2 fois plus élevé » sans le mot « excès » — distorsion d'un ordre de
   grandeur (HR quasi identiques, 1,10 vs 1,06).
3. Toute reconstruction numérique précise du « 2× » (ni le ratio 1,67 d'Agent A présenté comme « l'explication »,
   ni les écarts-types hypothétiques de 17/15 mmHg d'Agent B, qui sont une illustration de plausibilité, pas une
   donnée publiée).
4. Toute valeur chiffrée ou qualificatif de magnitude sur le C-statistique (« gain important », « nette
   amélioration de la discrimination ») — l'abstract ne donne aucun chiffre, et « significantly higher than
   *most* other SBP measures » signifie que certaines comparaisons ne l'étaient pas, sans préciser lesquelles.
5. Tout chiffre de reclassement (« X % de patients reclassés hypertendus/non hypertendus ») — aucune valeur de
   ce type n'existe dans l'abstract ; en inventer une serait une fabrication.
6. La phrase des auteurs « reinforce the necessity of… » reprise telle quelle comme recommandation de pratique
   sourcée — c'est le spin des auteurs eux-mêmes sur une étude observationnelle de performance de modèle, à
   signaler comme tel, pas à relayer comme une injonction fondée sur un effet clinique démontré.
7. Toute affirmation que l'étude démontre un bénéfice de santé (réduction de MACE, meilleure prise en charge)
   lié à une stratégie de mesure — l'étude mesure une association/discrimination statistique, pas l'effet testé
   d'une intervention.

---

## 5. Ce que cette procédure ne garantit pas

- **Le texte intégral reste non vérifié.** Plusieurs éléments matériellement utiles restent inconnus : valeur
  chiffrée exacte du C-statistique par mesure, NRI/IDI s'ils existent, liste complète des covariables
  d'ajustement des modèles de Cox, écarts-types réels de SBP₁/SBP₃ (donc construction exacte du « 2× »), statut
  de pré-enregistrement. Rien n'indique qu'ils changeraient le verdict `informatif` (§2.5), mais ce n'est **pas
  démontré** — c'est une inférence raisonnable, pas une certitude.
- **La réconciliation n'a pas pu re-vérifier la citation source de façon indépendante dans cette session** : une
  tentative d'interroger PubMed pour confirmer le libellé exact de l'abstract a été bloquée par la politique de
  permissions de l'environnement. L'arbitrage du §2.1 repose donc sur la cohérence entre les citations déjà
  rapportées par Agent A et Agent B, pas sur une troisième lecture indépendante de la source.
- **Aucun des deux agents ne mentionne avoir vérifié le statut de rétractation/erratum** (Retraction Watch,
  alertes revue — SOP §9). À faire avant publication effective si ce n'est pas déjà couvert par un contrôle
  amont automatisé.
- **La vérification bi-agents n'est pas une double lecture humaine indépendante** (SOP §5, étape 5) : les deux
  agents partagent la même source (l'abstract) et peuvent partager un même angle mort de lecture qu'aucun des
  deux ne détecterait — en particulier sur un point de statistique fine (construction du « 2× », circularité de
  l'ajustement) où seul le texte intégral trancherait avec certitude.
- **La voie d'accès lente reste ouverte et n'a pas été tentée** : demande à un confrère disposant d'un accès
  institutionnel, ou courriel à l'auteur correspondant. Si le texte intégral devient accessible ultérieurement
  et contredit un point de cette réconciliation, l'entrée publiée devra être corrigée par un erratum daté (SOP
  §10), pas silencieusement ignorée.
- **Le risque de biais « modéré à élevé » (§2.3) repose sur des mécanismes plausibles mais non confirmés**
  (circularité d'ajustement, multiplicité non corrigée) — à présenter dans l'entrée comme des réserves
  méthodologiques, pas comme des défauts établis de l'étude.
