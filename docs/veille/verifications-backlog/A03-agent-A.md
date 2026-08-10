# A03 — Agent A (Analyste/Extracteur) — LODESTAR (BMJ 2023;383:e075837)

Analyse indépendante, sans consultation du travail de l'Agent B (Contradicteur).

---

## 1. Identification

| Champ | Réponse |
|---|---|
| Titre | Rosuvastatin versus atorvastatin treatment in adults with coronary artery disease: secondary analysis of the randomised LODESTAR trial |
| Source (revue/site) | *The BMJ* (open access) |
| DOI / lien | 10.1136/bmj-2023-075837 ; PMID 37852649 ; PMC10583134 |
| Année | 2023 |
| Type de publication | ECR, **analyse secondaire** d'un essai factoriel 2×2 (LODESTAR mère) |
| Financement & conflits d'intérêt | Financé par **Sam Jin Pharmaceutical** et **Chong Kun Dang Pharmaceutical** (laboratoires coréens fabricants de génériques statines). Un auteur (M-K Hong) déclare honoraires de conférencier (Medtronic, Edward Lifesciences, Viatris Korea) et subventions institutionnelles des deux financeurs du trial. |
| Registre / protocole pré-enregistré ? | Oui — NCT02579499 (ClinicalTrials.gov), essai mère LODESTAR. **Mais** pas d'estimation a priori de taille d'échantillon ni de marge pré-spécifiée pour la comparaison rosuvastatine vs atorvastatine elle-même (cf. §3, §5). |

### Vérification d'identité (piège signalé)
Confirmé : ECR ouvert, multicentrique (12 centres coréens), **randomisation factorielle 2×2 authentique** — chaque patient était randomisé indépendamment sur deux axes : (a) stratégie treat-to-target vs intensité fixe élevée, ET (b) rosuvastatine vs atorvastatine. Citation méthodes : « Participants were randomly assigned to receive a statin using either a treat-to-target strategy or a high intensity statin strategy; participants were also randomly assigned to receive either rosuvastatin or atorvastatin. » n=4400 (2204 rosuvastatine / 2196 atorvastatine), suivi 3 ans. Ce n'est **pas** la cohorte rétrospective coréenne n≈49 034 (revue MDPI) — écartée avec certitude.

---

## 2. Question (PICO)

- **P** : adultes coréens avec maladie coronarienne (SCA <1 an 26,2 %, angor stable/ancien 55,1 %, dépistage asymptomatique 18,5 %), âge moyen 65 ans (ET 10), 27,9 % femmes, 33,4 % diabétiques à l'inclusion.
- **I** : rosuvastatine (dose moyenne atteinte à 3 ans : 17,1 mg, ET 5,2 mg).
- **C** : atorvastatine (dose moyenne atteinte à 3 ans : 36,0 mg, ET 12,8 mg).
- **O** : composite décès toutes causes / IDM / AVC / revascularisation coronaire à 3 ans (principal) ; diabète de novo, cataracte, insuffisance cardiaque, événements thromboemboliques, néphropathie terminale, anomalies biologiques (secondaires, cf. §4).
- Population ≈ patientèle MSP ? **Partiellement** — prévention secondaire post-coronarienne, situation rencontrée en MSP (suivi partagé avec cardiologie), mais population 100 % est-asiatique (cf. §6).

---

## 3. Risque de biais (ECR — RoB2)

- [x] **Randomisation adéquate** : séquence générée par système web interactif (blocs permutés mixtes de 4 ou 6), stratifiée sur LDL basal (seuil 2,6 mmol/L), SCA, diabète — allocation dissimulée correcte (assignation par site via IRT).
- [ ] **Aveugle** : essai **ouvert** (« open label »), non aveugle patients/soignants. Évaluateurs : atténué par un **comité d'adjudication indépendant en aveugle** de l'assignation ET des résultats principaux du trial pour les critères principaux et secondaires (« An independent clinical endpoint committee blinded to the treatment assignments and primary results of the trial adjudicated both the primary and the secondary outcomes »). Ceci limite le biais sur les critères durs adjudiqués, mais la décision clinique de *déclencher* une revascularisation ou de prescrire un antidiabétique/opérer une cataracte reste prise par un soignant non aveugle → biais résiduel possible sur les composants « mous ».
- [x] **Données de sortie complètes** : 98,7 % des participants ont terminé le suivi ; analyse en ITT pour le critère principal (non vérifiable en détail sur le nombre exact de perdus de vue par bras — non localisé précisément).
- [ ] **Pas de sélection du résultat rapporté** : critère principal = celui pré-enregistré (composite CV). En revanche, cette **comparaison rosuvastatine/atorvastatine était un axe secondaire pré-spécifié du design factoriel**, pas l'hypothèse principale historique du trial (qui portait sur treat-to-target vs intensité fixe, publiée séparément). Signal d'alerte modéré : absence d'estimation a priori de la taille d'échantillon spécifique à cette comparaison de molécules (« no a priori sample size estimation was performed on the basis of testing the different statin types »).
- [x] **Pas d'arrêt précoce** : non mentionné, rien n'indique un arrêt anticipé pour bénéfice.

**Synthèse risque de biais : modéré.** Randomisation et allocation solides, adjudication en aveugle pour les critères durs, mais essai ouvert avec critères secondaires en partie sensibles à la connaissance du traitement (revascularisation, prescription d'antidiabétiques, décision opératoire cataracte), et comparaison de molécules non dimensionnée a priori.

---

## 4. Critère de jugement

- **Critère principal** : composite à 3 ans — décès toutes causes, IDM, AVC, revascularisation coronaire. **Dur** dans l'ensemble, mais la revascularisation est un critère plus « mou » (décision clinique).
- **Composite, quel composant porte le résultat ?** Décomposition par composant (source : tableau des résultats, texte) :
  - Décès : 2,6 % (rosuvastatine) vs 2,3 % (atorvastatine)
  - IDM : 1,5 % vs 1,2 %
  - AVC : 1,1 % vs 0,9 %
  - **Revascularisation : 5,3 % vs 5,2 %** — c'est le composant le plus fréquent et qui domine numériquement le composite (≈60 % des événements), sans différence entre bras. Aucun composant pris isolément n'est significativement différent (petits effectifs par composant — limite reconnue par les auteurs : « small number of events for individual components »).
- **Pertinent pour le patient ?** Oui pour décès/IDM/AVC (critères durs) ; la revascularisation reflète en partie une pratique clinique influencée par le caractère ouvert de l'essai.
- **Marge de non-infériorité** : **non vérifiable sur la source primaire** en tant que marge formellement pré-spécifiée pour la comparaison rosuvastatine/atorvastatine — les auteurs indiquent explicitement l'absence de calcul d'échantillon a priori pour cette comparaison de molécules. Le résultat est rapporté et interprété comme une absence de différence statistique (p=0,58), mais **sans cadre formel de non-infériorité avec marge définie**, ce qui affaiblit l'affirmation d'« équivalence ».

---

## 5. Résultats & taille d'effet

| Élément | Valeur | Localisation |
|---|---|---|
| Critère principal | 8,7 % (189/2204) vs 8,2 % (178/2196), HR 1,06 [0,86–1,30], p=0,58 | Résultats/tableau principal |
| Nouveau diabète nécessitant antidiabétique | 7,2 % vs 5,3 %, HR 1,39 [1,03–1,87], p=0,03 | Résultats — critère secondaire |
| Chirurgie de cataracte | 2,5 % vs 1,5 %, HR 1,66 [1,07–2,58], p=0,02 | Résultats — critère secondaire |
| LDL moyen atteint sur 3 ans | 1,8 mmol/L (ET 0,5) rosuvastatine vs 1,9 mmol/L (ET 0,5) atorvastatine, p<0,001 | Résultats |
| Doses moyennes atteintes à 3 ans | Rosuvastatine 17,1 mg (ET 5,2) ; atorvastatine 36,0 mg (ET 12,8), p<0,001 | Résultats |

**Effet absolu et NNH (calcul à partir des pourcentages ci-dessus, horizon 3 ans) :**
- Diabète de novo : différence de risque absolu = 7,2 % − 5,3 % = **1,9 point**, soit **NNH ≈ 53** patients traités par rosuvastatine plutôt qu'atorvastatine pendant 3 ans pour un cas supplémentaire de diabète nécessitant traitement.
- Cataracte : différence de risque absolu = 2,5 % − 1,5 % = **1,0 point**, soit **NNH ≈ 100** patients traités par rosuvastatine plutôt qu'atorvastatine pendant 3 ans pour une chirurgie de cataracte supplémentaire.

**Précision** : les deux IC95% des critères de sécurité ont une borne basse proche de 1 (1,03 et 1,07) — résultats statistiquement fragiles.

**Cohérence sous-groupes/sensibilité** : non vérifiable sur la source primaire (analyses de sensibilité non extraites en détail dans les passages consultés).

---

## 6. Validité externe & applicabilité

- **Population** : coréenne, 100 % est-asiatique. Le métabolisme des statines (notamment rosuvastatine, substrat de transporteurs OATP1B1 avec variants fréquents en population asiatique, exposition plasmatique plus élevée à dose égale) diffère selon l'origine ethnique — limite explicitement reconnue par les auteurs (« Asian population only »). Transposition à une patientèle MSP française : **prudente**, l'ampleur de l'effet dose-dépendant pourrait ne pas se transposer à l'identique, même si le signal qualitatif (diabète/cataracte dose-dépendants) est probablement généralisable.
- **Comparateur et prise en charge réalistes en soins premiers ?** Oui dans le principe (statines de prévention secondaire post-coronarienne, suivi partagé MG/cardiologue), mais la titration fine du dosage pour cibler un LDL précis (design treat-to-target) est plus proche d'un suivi spécialisé que d'une gestion MG isolée.
- **Durée de suivi** : 3 ans — suffisant pour les événements CV et le diabète, **court** pour la cataracte (pathologie à évolution lente) et pour tout signal de sécurité à très long terme ; les auteurs eux-mêmes qualifient le suivi de « relativement court ».

---

## 7. Cohérence & esprit critique

- **Diabète de novo sous statine** : cohérent avec un corpus solide et bien établi (méta-analyses CTT, JUPITER) montrant un effet de classe **dose-dépendant** des statines sur le risque de diabète. Le point clé ici : la rosuvastatine a produit un LDL **plus bas** (1,8 vs 1,9 mmol/L) avec une dose moyenne **beaucoup plus faible en mg** (17,1 vs 36,0 mg) — ce qui, en équivalence de puissance hypolipémiante, signifie que la rosuvastatine était utilisée à une **intensité relative plus forte** dans ce contexte. L'excès de diabète est donc **compatible avec l'hypothèse d'un effet dose/intensité-dépendant plutôt qu'une propriété pharmacologique spécifique de la rosuvastatine** — l'article ne permet pas de trancher formellement entre ces deux hypothèses (pas d'analyse de médiation par le LDL atteint identifiée dans les passages consultés). C'est le nœud d'interprétation signalé en amont : **non tranché par cette seule source**.
- **Cataracte** : signal beaucoup **moins établi** dans la littérature statines en général (résultats contradictoires selon les études, certains même protecteurs). Un signal isolé, HR à borne basse 1,07, sans ajustement pour comparaisons multiples parmi ≥13 critères secondaires testés, est **fragile** et pourrait relever en partie du hasard (inflation du risque alpha).
- **Spin détecté** : le titre et l'abstract mettent en avant l'« équivalence » cardiovasculaire de façon assez affirmative alors que la comparaison n'était pas dimensionnée a priori pour cela (absence de calcul d'échantillon spécifique, absence de marge de non-infériorité formelle) — **franchise partielle** : les auteurs le reconnaissent en limites, mais le message de premier niveau (abstract, conclusion) tend à minimiser ce point.
- **Signaux d'alerte** : financement industriel (deux fabricants de statines génériques coréens) + résultat de sécurité défavorable à la molécule *non financée à l'avantage évident* — configuration qui n'oriente pas franchement vers un biais de sponsor en faveur d'un résultat commercialement favorable évident, mais reste à noter. Absence d'ajustement pour multiplicité sur ≥13 critères secondaires : signal d'alerte méthodologique clair.

---

## 8. Niveau de preuve (GRADE simplifié)

**□ Élevé** · **☒ Modéré** (critère principal, composite, HR 1,06 IC large [0,86-1,30]) · **☒ Faible** (pour les critères de sécurité diabète/cataracte : post-hoc pour la définition diabète, pas d'ajustement multiplicité, IC à borne basse proche de 1, essai ouvert)

Justification : ECR bien randomisé avec adjudication en aveugle pour le composite principal (confiance modérée sur l'absence de différence CV, mais large IC et absence de cadre de non-infériorité formel = imprécision). Les signaux de sécurité (diabète, cataracte) sont des critères secondaires pré-spécifiés (diabète) ou partiellement post-hoc (définition élargie du diabète), non ajustés pour multiplicité, dans un contexte ouvert où la déclaration/le diagnostic peut être influencé — niveau de preuve plus faible, à traiter comme **signal à surveiller** plutôt que comme fait établi.

---

## 9. Classement pour l'outil

| Champ | Valeur |
|---|---|
| Thème(s) | `cardiovasculaire-prevention` |
| Profession(s) concernée(s) | `MG` |
| **Niveau d'impact** | **informatif** — le critère cardiovasculaire principal ne montre pas de différence, ce qui ne justifie pas de changer la statine de choix en routine sur cette seule base ; le signal de sécurité (diabète/cataracte) est réel mais trop fragile (non ajusté, IC à borne basse proche de 1, population non occidentale) pour fonder une recommandation ferme de préférer l'atorvastatine. |
| Pertinence pratique | modérée |
| Temps de lecture estimé (min) | 8 |
| Impacte un algorithme ? | non — à mentionner comme élément de contexte/nuance si un nœud statine/prévention secondaire existe, mais ne justifie pas une modification de nœud en l'état. |

---

## Ce que je n'ai pas pu vérifier

- Le nombre exact de perdus de vue par bras (seul le taux global de complétion 98,7 % a été localisé).
- La présence ou non d'analyses de sensibilité/sous-groupes détaillées et leur cohérence avec le résultat principal.
- L'existence d'une analyse de médiation formelle testant si l'excès de diabète/cataracte sous rosuvastatine s'explique statistiquement par le LDL atteint ou la dose plutôt que par la molécule (non identifiée dans les passages du texte intégral consultés — possible qu'elle existe dans le corps de l'article ou en annexe supplémentaire non extraite ici).
- Le détail complet des 13 critères secondaires avec leurs résultats individuels (seuls diabète et cataracte ont été creusés en détail conformément à la demande).
- Une éventuelle marge de non-infériorité mentionnée dans le protocole d'origine (NCT02579499) ou dans le papier JAMA source (treat-to-target vs intensité) qui n'aurait pas été reprise dans cet article secondaire — non consulté directement.
- Le texte exact de la section « Discussion » sur l'articulation entre baisse de LDL et sur-risque métabolique (interprétation des auteurs eux-mêmes sur ce point causal) — accédé de façon indirecte via un outil de résumé, pas de citation directe vérifiée mot à mot.

**Note méthodologique** : l'accès au texte intégral s'est fait via un outil de récupération web avec résumé intermédiaire (pas de lecture PDF brute page par page) ; les chiffres cités correspondent aux citations directes extraites par cet outil et recoupées entre deux requêtes indépendantes (cohérence confirmée sur LDL, doses, HR), mais une vérification humaine directe sur bmj.com/PMC reste recommandée pour les éléments qualitatifs (design factoriel, adjudication).
