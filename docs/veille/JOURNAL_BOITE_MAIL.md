# Journal de la boîte mail — articles individuels

> **Ce que ce fichier fait que les labels Gmail ne font pas.** Le tri de `TRI_BOITE_MAIL.md`
> s'applique à l'e-mail entier ; un digest multi-articles retagué `piste-a-verifier-source-primaire`
> ne dit pas *lesquels* de ses articles ont un potentiel, ni où en est la recherche de chacun. Ce
> journal descend au niveau **article** : sans lui, rouvrir un digest déjà lu pour retrouver « où on
> en était » revient à le relire en entier — ce qui s'est déjà produit une fois dans cette veille.
>
> **Se remplit au fil de l'eau**, pas reconstitué a posteriori. Un article change de section quand son
> statut change (jamais dupliqué). Un article `publié` reste comme trace (lien vers l'entrée), pas
> supprimé du journal.

- **Champ d'application actuel :** boîte `ebmmsp@gmail.com`, backlog accumulé au 2026-08-09 (avant tout
  cycle hebdomadaire réel — cf. `TRI_BOITE_MAIL.md`). Au premier lundi de production, ce mécanisme est
  remplacé par `docs/veille/semaines/AAAA-Www/screening.md` (SOP §10) ; ce journal-ci continue de
  couvrir uniquement le repérage au niveau article dans les mails déjà tagués
  `piste-a-verifier-source-primaire`.
- **Identifiants `Ann`**, attribués ici et jamais réattribués — même principe que les `Cnn` de
  `moisson.md`.

---

## 0. Sources retrouvées — résultats de recherche (2026-08-09)

Recherche web (`WebSearch`/`WebFetch`) menée sur les 12 items de la section 1. **Ceci n'est pas un
screening.md** (pas de lecture du texte intégral pour tous, pas de vérification bi-/tri-agents) : c'est
la première passe qui permet de confirmer l'identité de la source et de donner un avis C1/C2/C3
provisoire, à trancher formellement au screening réel.

| # | Source retrouvée | Chiffres clés | C1/C2/C3 provisoire | Verdict provisoire |
|---|---|---|---|---|
| A01 | Prise de position SFD, 25/11/2025 (sfdiabete.org) | 3 catégories (bon état/fragile/dépendant) ; fragile : HbA1c ≤8 % (>7 % si ttt hypoglycémiant) ; dépendant : 7,5-9 % ; sulfamides/glinides à éviter (fragile), jamais (dépendant) ; nouveau chapitre déprescription | C1 o · C2 o · C3 o | **Analyse** — consensus national, très actionnable |
| A02 | *Impact of Successive Office BP Measurements... CARTaGENE*, Hypertension (AHA) | Cohorte 40-70 ans, 10 ans suivi. 3ᵉ mesure la plus prédictive (HR 1,10 [1,05-1,15]/DS) vs 1ʳᵉ (HR 1,06 [1,01-1,10]) ; risque MACE conféré 2× supérieur pour SBP3 vs SBP1 | C1 o · **C2 fragile** (critère = performance prédictive d'un modèle, pas un événement clinique évité par l'action) · C3 o | **À trancher** — C2 discutable : améliore la prédiction, ne démontre pas qu'agir dessus change le devenir |
| A03 | **LODESTAR**, *BMJ* 2023;383:e075837 (Lee YJ et al.) — pas la cohorte initialement mal identifiée | RCT, n=4 400 (2204/2196). Critère composite 3 ans : 8,7 % vs 8,2 %, HR 1,06 [0,86-1,30] p=0,58 (équivalence). Nouveau diabète : 7,2 % vs 5,3 %, HR 1,39 [1,03-1,87]. Cataracte : 2,5 % vs 1,5 %, HR 1,66 [1,07-2,58] | C1 o · C2 o (effet absolu net sur 2 critères de sécurité) · C3 o | **Analyse** — RCT solide, effet absolu chiffré |
| A04 | Essai **SELECT**, analyse exploratoire, *JAMA Cardiol* (Nicholls et al.) | RCT, n=17 604, suivi médian 41,8 mois. Hospitalisations totales -10 % (MR 0,90 [0,85-0,95] p<,001). ⚠ analyse **exploratoire**, non préspécifiée primaire, événements non adjudiqués centralement, période Covid | C1 o · C2 o · C3 o | **Analyse, avec réserve** — franchit le seuil mais niveau de preuve à nuancer (exploratoire) |
| A05 | Reid-McCann et al., *Lancet Child Adolesc Health* 2025 (cohorte ALSPAC, UK) | n=1 157. Douleur sévère à 15 ans → +76 % risque douleur chronique à 26 ans ; douleur modérée → +65 % | **C1 fragile** (association longitudinale, pas d'essai d'intervention — aucun geste précis déclenché) · C2 o · C3 o | **Brève probable** — signal épidémiologique fort, mais ne déplace aucune décision concrète |
| A06 | CNGOF, *Consensus Formalisé d'Experts* « Diabète antérieur à la grossesse », 2025/2026 | Dépistage rétinopathie (ophtalmo trimestriel), néphropathie (bilan rénal préconception puis mensuel si atteinte), objectif TA <140/90 | C1 o · C2 o · C3 o | **Analyse** — consensus national, hautement actionnable |
| A07 | Mokraoui et al., cohorte **ComPaRe-Endométriose** (Inserm/AP-HP) | n=7 700. 7 profils descriptifs (aucune comorbidité, douleur chronique/fibromyalgie/SII, dépression/anxiété, allergies, kystes ovariens/SOPK, thyroïde, migraines) | **C1 non** (typologie descriptive, aucune décision précise déplacée) · C2 non (pas de critère comparatif chiffré) | **Brève** — informatif, pas de seuil franchi |
| A08 | Méta-analyse en réseau, *AJOG* 2025 (recherche jusqu'à 01/2025), antisepsie vaginale chlorhexidine avant césarienne | 50 essais. Sans antisepsie vs chlorhexidine : OR 3,53 [2,09-6,57] (endométrite, césarienne avant travail) ; OR 2,79 [1,32-5,88] (en cours de travail) | C1 o · C2 o (effet absolu marqué) · C3 o (avec réserve : contexte hospitalier/maternité, pas ambulatoire MSP direct) | **Analyse** — méta-analyse en réseau, effet net ; noter la limite méthodologique des comparaisons indirectes |
| A09 | HAS, recommandation du 17/06/2025, dépistage CMV grossesse | Dépistage systématique T1 (femmes séronégatives/statut inconnu), sérologie IgG/IgM + avidité, réévaluation à 3 ans | C1 o · C2 o (prévention transmission materno-fœtale, séquelles graves) · C3 o (recommandation française directe) | **Analyse** — recommandation de santé publique majeure, la plus directement transposable de la liste |
| A10 | *Collaborative Perinatal Project* (USA, 1959-65), *Lancet* 2023 (Bond et al.) | n=46 042 (presse : « 49 000 », écart mineur). Suivi médian 52 ans. Gain pondéral >recommandations NAM 2009 → +9 % mortalité toutes causes (poids normal), +12 % (surpoids) | C1 o · **C2 modéré** (effet relatif faible, ampleur à discuter) · **C3 fragile** (cohorte USA 1959-65, contexte très différent, confusion résiduelle sur 52 ans) | **À trancher, réserve forte sur C3** |
| A11 | Meta-analyse DHS, *BMC*/pubmed 37734798, 692 402 grossesses, 113 enquêtes/46 pays | HR 2,72 [2,52-2,93] mortalité périnatale, intervalle <6 mois vs 18-23 mois (référence OMS). ⚠ Le titre de presse (« 18 mois = meilleur écart ») déforme : l'étude compare un intervalle **court** à la référence OMS, ne teste pas 18 mois contre d'autres seuils | C1 o · C2 o (effet massif) · **C3 fragile** (population DHS = surtout pays à revenu faible/intermédiaire, Afrique subsaharienne surreprésentée — transposabilité patientèle Paris 20ᵉ à nuancer) | **À trancher, réserve sur C3 + reformulation presse trompeuse** |
| A12 | Étude italienne, cohorte prospective (probable Maiorana et al. ou équivalent, *Medicine* 2024, pubmed 38968535) | Diénogest seul > diénogest+œstrogène sur la dysménorrhée (chiffres presse : -2,63 vs -2,04) | C1 o · C2 o (effet chiffré disponible) · **C3 o mais design cohorte, pas RCT** | **Brève ou analyse à niveau de preuve faible** — selon lecture complète |
| H01 | EPI-PHARE (SNDS), *JAMA Pediatrics* 2023 | Cohorte n=1 262 424 (606 645 exposés IPP / 655 779 non exposés), enfants nés 2010-2018, âge médian 82-88 j. Infections graves toutes causes : aHR 1,34 [1,32-1,36]. Par site : digestif 1,52 [1,48-1,55], ORL 1,47 [1,41-1,52], respiratoire basse 1,22 [1,19-1,25], rénal/urinaire 1,20 [1,15-1,25], neuro 1,31 [1,11-1,54]. Bactérien 1,56 [1,50-1,63], viral 1,30 [1,28-1,33] | C1 o (prescription IPP nourrisson pour RGO = décision fréquente en soins primaires) · C2 o (effet absolu net, IC étroits, cohorte nationale très puissante) · C3 o (cohorte française SNDS, directement transposable) | **Analyse** — cohorte observationnelle (pas RCT, confusion résiduelle possible malgré la puissance), mais C1+C2+C3 clairement franchis |

> **Non vérifié à ce stade** : ces verdicts sont **provisoires**, fondés sur des résumés/abstracts trouvés
> par recherche web, pas sur une lecture intégrale ni une vérification bi-/tri-agents (SOP §7/§7bis).
> Aucune entrée ne doit être publiée sur cette seule base.

---

## 1. À faire — sources primaires à récupérer

Un article dont un sujet plausible a été repéré dans un mail de repérage (Tier 3, presse
« -pratique.com »), mais dont la publication d'origine n'est pas encore retrouvée — cf. la procédure
« Recherche de la source primaire » de `TRI_BOITE_MAIL.md`.

*(vide — H01 collecté le 2026-08-09, source retrouvée en §0, verdict `analyse` provisoire → §3)*

> A01-A12 et H01 ont tous quitté ce tableau : source retrouvée par la recherche du 2026-08-09 (§0). Statut
> actuel de chacun : §2 (brèves : A05→B02, A07→B03, A10→B04, A11→B05), §3 (candidats analyse : A02, A03,
> A04, A06, A08, A12, H01), ou hors suivi de ce journal (A01, A09 — cf. note §3 : donnée déjà connue,
> pas retraitée ici).

## 2. À faire — brèves à rédiger

Référence identifiable directement (pas de traque nécessaire) : reste seulement l'écriture de l'entrée.

| # | Article | Thread Gmail | Thème(s) | Référence | Ajouté le |
|---|---|---|---|---|---|
| B01 | Recommandations étatsuniennes pour le dépistage des maladies hypertensives de la grossesse | `19fd1cc26f39cb41` (Gynéco Obstétrique Pratique/Actualités) | sante-femme-perinatalite | USPSTF Final Recommendation Statement | 2026-08-09 |
| B02 | Dysménorrhée à l'adolescence → douleurs pelviennes chroniques adulte | `19fd1cdae8acc271` (Sage-Femme Pratique) | sante-femme-perinatalite | Reid-McCann et al., *Lancet Child Adolesc Health* 2025 (§0, A05) — signal fort mais aucun geste précis à en tirer, C1 fragile | 2026-08-09 |
| B03 | 7 profils de comorbidité des patientes endométriosiques | `19fd1cdae8acc271` (Sage-Femme Pratique) | sante-femme-perinatalite | Cohorte ComPaRe-Endométriose, Mokraoui et al. (§0, A07) — typologie descriptive, ne franchit pas C1/C2 | 2026-08-09 |
| B04 | Prise de poids lors de la grossesse et survie à long terme | `19fd1cc26f39cb41` (Gynéco Obstétrique Pratique/Actualités) | sante-femme-perinatalite, cardiovasculaire-prevention | Cohorte Collaborative Perinatal Project, Bond et al., *Lancet* 2023 (§0, A10) — tranché `brève` par le référent malgré la réserve C3 relevée en §0 (cohorte USA 1959-65) | 2026-08-09 |
| B05 | 18 mois entre 2 grossesses semble le meilleur écart | `19fd1cc26f39cb41` (Gynéco Obstétrique Pratique/Actualités) | sante-femme-perinatalite | Méta-analyse DHS (§0, A11) — tranché `brève` par le référent ; **attention à la reformulation presse trompeuse** relevée en §0 (l'étude compare un intervalle court à la référence OMS, ne teste pas « 18 mois » comme optimum) — le titre de la brève doit refléter l'étude, pas le titre de presse

## 2bis. Vérification bi-/tri-agents — état d'avancement (SOP §7 / §7bis)

Lancée le 2026-08-09, interrompue par un plafond de quota le soir même ; reprise **article par
article** le 2026-08-10. Rapports dans `docs/veille/verifications-backlog/`.

| # | Circuit | Agent A | Agent B | Agent C | Réconciliation | Statut |
|---|---|---|---|---|---|---|
| H01 | §7 bi-agents | ✅ | ✅ | *(sans objet)* | ✅ `H01-reconciliation.md` | **Réconcilié** — `analyse`/`pratique`/preuve `modere`. Classement tranché par le référent (D63). Reste l'escalade humaine de fond du §7. |
| A04 | §7 bi-agents | ✅ | ✅ | *(sans objet)* | ✅ `A04-reconciliation.md` | **`reporte` (report 1/2, 2026-08-10)** — accès aux Suppléments 1-4 manquant, question du SAP non tranchable. Route `analyse` maintenue. |
| A03 | §7 bi-agents | ✅ | ✅ | *(sans objet)* | ✅ `A03-reconciliation.md` | **Réconcilié** — `analyse`/`informatif`/preuve `faible`, sous 7 conditions de rédaction. Vérification complète, **ne pas reporter**. |
| A02 | §7 bi-agents | ✅ | ✅ | *(sans objet)* | ✅ `A02-reconciliation.md` | **`reporte` (report 1/2, 2026-08-10)** — article inaccessible (403, aucun PMC), 3 points invérifiables. **Sortie de repli en `breve` déjà rédigée**, tenant entièrement sur l'abstract. |
| A06 | §7bis tri-agents | ✅ | ✅ | ✅ | ✅ `A06-agent-C-reconciliation.md` | **Tranché par C** — `analyse`/`informatif`/preuve `tres_faible`, 15 conditions de rédaction. Licence **CC BY 4.0 confirmée** (B s'était trompé). |
| A08 | §7bis tri-agents | ✅ | ✅ | ✅ | ✅ `A08-agent-C-reconciliation.md` | **Tranché par C : `reporte`, dernier rang de la file** — plafond `informatif` même avec le texte intégral, ne pas retraiter sauf accès gratuit fortuit. Les OR relayés (3,53 / 2,79) sont **introuvables** (triple concordance A/B/C) ; seul un OR global 3,65 [2,36-5,90]. |
| A12 | §7bis tri-agents | ✅ | ✅ | ✅ | ✅ `A12-agent-C-reconciliation.md` | **Tranché par C : NE PAS PUBLIER** (ni `analyse`, ni `breve`, ni `reporte`) — vérification complète, item sans valeur ajoutée : des ECR répondent déjà à la question. Source : Del Forno S. *et al.*, *Arch Gynecol Obstet* 2023, PMID 37433947 — **cohorte rétrospective**, pas prospective comme annoncé. Les 3 pistes du §0 étaient fausses. |

> **Enseignement de méthode (2026-08-09/10)** : 12 agents lancés en parallèle ont saturé le quota et
> 10 se sont arrêtés en vol — mais **7 avaient déjà écrit leur fichier**, donc rien n'a été perdu de ce
> qui était produit. La leçon n'est pas « ne pas paralléliser » : c'est **faire écrire le livrable au
> fil de l'eau plutôt qu'en fin de course**, et lancer par paires (A+B d'un même item) plutôt que par
> vagues, pour qu'une interruption laisse des paires complètes et non des moitiés.

### ORTHO01 — candidat hors backlog boîte mail, trouvé par recherche directe (2026-08-10)

Repéré via les connecteurs de recherche (`recherche-source-primaire`) plutôt que via la boîte mail :
Kohmäscher A *et al.*, essai KIDS (modification du bégaiement, enfant d'âge scolaire), *JSLHR* 2023,
PMID 37801699. Circuit §7bis tri-agents complet (thème `orthophonie`). **Réconcilié par l'agent C** :
`analyse`/`informatif`/preuve `faible`, sous 8 conditions de rédaction opposables (C1-C8) et 7 interdits
(N1-N7) — dont un **conflit d'intérêt confirmé sur trois casquettes** (autrice du manuel évalué,
traductrice de l'instrument du critère principal, autrice de l'enquête justifiant le comparateur) et un
recalcul montrant le critère principal à p≈.052 en bilatéral (non significatif). Détail complet :
`verifications-backlog/ORTHO01-agent-{A,B,C-reconciliation}.md`. **Publié** :
`content/veille/2026-W33/begaiement-kids-enfant-age-scolaire.yaml`.

### Bilan du lot — 7 items vérifiés, 0 publié

| Issue | Items |
|---|---|
| Prêt à rédiger (après escalade humaine §7) | **H01** (`analyse`/`pratique`/`modere`) · **A03** (`analyse`/`informatif`/`faible`) · **A06** (`analyse`/`informatif`/`tres_faible`, §7bis) |
| Reporté faute d'accès | ~~A04~~ · ~~A02~~ **— les deux reports soldés le 2026-08-10, voir ci-dessous** · **A08** (report, **dernier rang** — ne pas retraiter) |
| Ne pas publier | **A12** — vérification complète, sans valeur ajoutée (des ECR répondent déjà à la question) |

**Ce que le dispositif a effectivement attrapé** — aucun de ces points n'était visible sans remonter à la source :

- **A03** : le chiffre du diabète qui circule est le plus favorable des **trois** lignes du tableau ; la ligne
  méthodologiquement correcte (bon dénominateur, définition principale) est **non significative** (HR 1,26 [0,99-1,60]).
- **A08** : les deux OR relayés sont **introuvables** dans la source, et leurs IC se chevauchent presque
  intégralement — même exacts, ils n'établiraient aucune différence entre sous-groupes.
- **A02** : le titre de presse déplace le message opératoire (le gain vient d'**écarter la première mesure**,
  pas d'en faire trois) ; le « 2× » est amputé de « **excess** ».
- **A12** : la presse annonce une supériorité là où les auteurs concluent à une **équivalence** ; design
  rétrospectif présenté comme prospectif ; un résultat de sens inverse (dysurie) omis du relais.
- **A06** : les trois « recommandations » relayées sont **une seule proposition votée en bloc**, en avis
  d'experts, Delphi à un tour ; et le consensus convertit un seuil de déclenchement (CHAP) en objectif tensionnel.

**Ce que le circuit s'est corrigé à lui-même** — c'est la justification empirique du §7/§7bis :

- Trois agents ont **contredit le brief de commande** plutôt que de s'y conformer (A03 : l'hypothèse « effet de
  dose » est fausse, doses quasi équipotentes ; A08 : l'antibioprophylaxie est un **critère d'inclusion**, pas un
  confondant oublié ; A12 : la DMCI supposée « 1,0-2,0 » était mauvaise).
- **A06** : le contradicteur s'est trompé sur la licence (filigrane EM-consulte pris pour la notice de
  copyright) — rattrapé par l'agent C, qui a aussi corrigé son propre jugement provisoire.
- **A08** : l'agent C a vu ce que ni A ni B n'avaient vu (chevauchement des IC).
- **A12** : l'agent C a donné raison à B sur le verdict mais **tort sur l'argument** (le seuil « 4 points »
  n'est pas validé dans l'endométriose ; la seule DMCI étudiée chez ces patientes est ≈1,0 pt).

### Reprise du 2026-08-10 — les deux reports soldés en une passe

Les reports A04 et A02 supposaient un accès qu'on n'avait pas cherché à obtenir. Recherche menée, les
deux sont soldés le jour même — dans des directions opposées.

**A04 : report levé, la pièce manquante était publique.** Le **plan d'analyse statistique de SELECT
est déposé sur ClinicalTrials.gov** (`SAP_003.pdf`, NCT03574597), en accès libre. On visait le
Supplément 1 de la revue, derrière paywall, alors que le document décisif était sur le registre — et
il est meilleur, car daté et versionné. SAP v3.0 du **22 avril 2022**, section 2.5 « Exploratory
endpoints » : les hospitalisations toutes causes y sont **définies comme deux critères exploratoires**,
avec le modèle spécifié (moyenne marginale pour événements récurrents, décès en risque compétitif,
résultat en *mean ratio*). L'auto-qualification de l'article est donc exacte, et l'hypothèse d'une
analyse post-hoc tombe. En sens inverse, le SAP établit que le `p < 0,001` **n'a aucun statut
confirmatoire** : il sépare les critères confirmatoires, « under multiplicity control » via un schéma
hiérarchique, des non-confirmatoires à intervalles nominaux. L'objection du contradicteur perd son
versant le plus grave et gagne en précision.

> ⚠ **Piège d'extraction à retenir** : le PDF encode les caractères espacés (« S e m a gl uti d e »).
> Une recherche plein texte naïve renvoie **zéro occurrence** de « hospitalisation » — faux négatif qui
> aurait pu passer pour un résultat. Normaliser (supprimer les espaces) avant de chercher. Le contrôle
> qui a détecté l'artefact : « semaglutide » lui-même ne matchait pas.

**A02 : report soldé par le repli, l'accès n'existe pas.** API Europe PMC interrogée directement :
`isOpenAccess: No`, `inEPMC: No`, `inPMC: No`, `hasPDF: No`, seule URL « subscription required » ;
aucun manuscrit accepté en dépôt institutionnel (Université Laval, Université de Montréal, Maisonneuve-
Rosemont, CHU de Québec). Quatrième vérification indépendante. Le report existe pour éviter de bâcler,
pas pour attendre un accès dont on a établi qu'il n'arrivera pas — la sortie de repli en brève, rédigée
d'avance dans la réconciliation, a donc été appliquée immédiatement plutôt qu'au cycle suivant.

**Leçon de procédure, à porter à la revue de SOP** : avant de reporter un item pour inaccessibilité,
épuiser les **sources primaires parallèles** — registre d'essais (protocole et SAP y sont souvent
déposés, comme ici), PROSPERO pour une méta-analyse, dépôt institutionnel, API Europe PMC. Le réflexe
« le supplément est derrière le paywall, donc on reporte » a coûté un report inutile sur A04.

### Notes pour le gel du schéma (S5) — frictions rencontrées

1. **`niveau_preuve` est un champ unique et il ne suffit pas** (révélé par A03) : un même article peut porter
   une conclusion d'efficacité `modere` et deux signaux de sécurité `faible`/`tres_faible`. Convention retenue
   provisoirement : le champ porte le niveau **du message principal de l'entrée**, la graduation va dans
   `appreciation_critique`.
2. **Aucune valeur de `route` n'encode « vérifié, et sans valeur »** (révélé par A12). `reporte` dit « pas pu
   vérifier », `breve` et `analyse` supposent une publication. Un item entièrement vérifié dont la conclusion
   est qu'il ne mérite pas d'entrée n'a aujourd'hui **nulle part où être rangé** — il n'existe que dans ce
   journal. À trancher en S5.
3. **`niveau_preuve` porte la certitude atteinte, pas la qualité présumée du design** — arbitrage rendu deux
   fois indépendamment (A08, A12) : le champ est lu par le praticien comme « à quel point je peux m'appuyer
   là-dessus ». Un article bien conçu mais vérifié seulement sur son abstract est `faible`, pas `modere`.

---

## 3. Candidats forts pour la route `analyse` (arbitrage référent 2026-08-09 — reste lecture intégrale + vérification)

Tranché par le référent le 2026-08-09, sur la base des verdicts provisoires §0 — **reste la lecture
intégrale et la vérification bi-agents (§7, thèmes MG) ou tri-agents (§7bis,
`sante-femme-perinatalite`)** avant toute publication. Aucun de ces items n'est publiable sur la seule
base de la recherche web.

- **A02** — mesure de la PA en consultation (CARTaGENE) — bi-agents §7. Tranché **analyse** malgré le
  doute C2 relevé en §0 (critère = performance prédictive d'un modèle) : à instruire en lecture intégrale,
  pas à écarter d'office.
- **A03** — LODESTAR, rosuvastatine vs atorvastatine (RCT n=4400, effet net sur diabète/cataracte) —
  bi-agents §7
- **A04** — SELECT, sémaglutide et hospitalisations (RCT n=17 604) — bi-agents §7, **avec réserve** :
  analyse exploratoire non préspécifiée, à signaler dans `niveau_preuve`/`appreciation_critique`
- **A06** — CNGOF, diabète préexistant et grossesse (consensus formel) — tri-agents §7bis
- **A08** — antisepsie vaginale chlorhexidine avant césarienne (méta-analyse en réseau, 50 essais) —
  tri-agents §7bis
- **A12** — diénogest seul vs associé (cohorte italienne) — tri-agents §7bis. Tranché **analyse** malgré
  le design cohorte (pas RCT, §0) : niveau de preuve à qualifier `faible`/`modéré` en lecture intégrale,
  pas motif d'écarter la route.
- **H01** — IPP chez l'enfant, risque infectieux grave (Lassalle *et al.*, *JAMA Pediatrics* 2023,
  n=1 262 424, PMID 37578761) — bi-agents §7 **exécuté et réconcilié** (§2bis). Requalifié dans le
  périmètre MG le 2026-08-09, puis **D63 (2026-08-10)** : création du thème `pediatrie` (14ᵉ de la
  taxonomie, 12ᵉ en production), l'item n'ayant aucun thème pour le porter. `themes: [pediatrie,
  soins-premiers]` · `professions: [MG, IPA, sage-femme]` · `relecture_referent: true` (thème MG,
  pas de §7bis).

**A01** (SFD, diabète du sujet âgé) et **A09** (HAS, dépistage CMV grossesse) : **donnée déjà connue du
référent, pas nouvelle** — sur instruction du 2026-08-09, retirées du suivi actif de ce journal ; pas de
vérification bi-/tri-agents à engager sur ces deux-là depuis ce circuit.

## 4. Hors périmètre actuel — piste non poursuivie

Signal repéré mais thème non couvert par la production (`SOP_veille.md` §3bis). Conservé pour mémoire :
si le thème ouvre un jour, ces pistes ne sont pas reperdues.

*(vide — H01 requalifié le 2026-08-09, cf. note ci-dessous)*

> **H01** (IPP chez l'enfant : gare au risque infectieux grave, thread `19fd1cc4f5c3d818`, Pédiatrie
> Pratique/Actualités) — le référent juge que ce sujet **peut entrer dans le périmètre MG** (prescription
> d'IPP en soins primaires, pas un acte de pédiatrie spécialisée). À reclasser en §1 (source primaire à
> récupérer) une fois le thème/la source primaire identifiés — pas encore fait, l'article n'a pas été
> relu sous cet angle.

## 5. Publié

Publiées en `meta.statut: brouillon` — le gabarit réserve `valide` à l'après-relecture différée J+3
(SOP §5 étape 5). L'escalade humaine du §7 a été faite par le référent le 2026-08-10.

| # | Slug de l'entrée | Semaine | Route | Impact / preuve | Publié le |
|---|---|---|---|---|---|
| H01 | `ipp-nourrisson-risque-infectieux` | 2026-W33 | `analyse` | `pratique` / `modere` | 2026-08-10 |
| A03 | `rosuvastatine-atorvastatine-coronarien` | 2026-W33 | `analyse` | `informatif` / `faible` | 2026-08-10 |
| A06 | `cnfe-diabete-anterieur-grossesse` | 2026-W33 | `analyse` | `informatif` / `tres_faible` · **`relecture_referent: false`** | 2026-08-10 |
| B01 | `uspstf-depistage-hta-grossesse` | 2026-W33 | `breve` | `informatif` | 2026-08-10 |
| B02 | `dysmenorrhee-adolescence-douleur-chronique` | 2026-W33 | `breve` | `informatif` | 2026-08-10 |
| B04 | `poids-gestationnel-mortalite-50-ans` | 2026-W33 | `breve` | `informatif` | 2026-08-10 |
| B05 | `intervalle-intergenesique-mortalite-perinatale` | 2026-W33 | `breve` | `informatif` | 2026-08-10 |
| A04 | `semaglutide-select-hospitalisations` | 2026-W33 | `analyse` | `informatif` / `modere` | 2026-08-10 (report levé) |
| A02 | `mesures-successives-pa-consultation-cartagene` | 2026-W33 | `breve` | `informatif` (repli) | 2026-08-10 (report soldé) |

> **B03 (profils de comorbidité de l'endométriose, ComPaRe) n'a pas été publiée.** Vérification de la
> source au moment de la rédaction : il ne s'agit pas d'une publication à comité de lecture mais d'un
> **résumé de congrès** (European Endometriosis Congress 2024, Mokraoui Mohamed N. *et al.*, équipe
> M. Kvaskoff). Une brève doit *signaler, situer et lier* — elle ne peut pas renvoyer le lecteur à un
> abstract de congrès comme s'il s'agissait d'une source consultable et stabilisée. À reprendre si la
> publication paraît. *(Ne pas confondre avec les travaux voisins parus en 2023-2025 sur des bases de
> données médico-administratives — clusters de comorbidités de l'endométriose, *Biomedicines* 2023,
> *Cell Reports Medicine* 2025 : autres cohortes, autres méthodes, autre nombre de profils.)*
>
> **Note de sérendipité, à ne pas perdre** : ces deux publications sur les clusters de comorbidités
> traitent la même question que B03 avec un design supérieur. Si le sujet mérite une entrée, c'est
> l'une d'elles qu'il faut instruire — pas le résumé ComPaRe. Candidat pour une prochaine moisson.

> **Sur les dates de publication** : six des sept entrées portent une `meta.date_publication` de 2023 à
> 2025 — ce sont des sources de backlog, pas de l'actualité de la semaine. Avec le tri par date devenu
> le tri par défaut (**D62**), elles apparaîtront **en bas du flux**, sous les 14 entrées de W33 datées
> du 2026-08-05. C'est le comportement correct et honnête, mais il faut le savoir : ce lot ne se verra
> pas en tête de liste.

## 6. Écarté définitivement

Threads/articles déjà lus et classés `non-pertinent` de façon définitive — **ne pas rouvrir sans motif
nouveau** (rétractation, republication, nouvelle donnée). Liste par thread (pas par article : le volume
des narrations/comptes rendus de congrès non retenus ne justifie pas un suivi article par article,
contrairement aux repérages ci-dessus).

| Thread Gmail | Sujet du digest | Date de lecture | Motif |
|---|---|---|---|
| `19fd1cdae8acc271` | Sage-Femme Pratique (16 art.) | 2026-08-09 | 12 articles narratifs/congrès sans étude primaire citable ou hors transposabilité (Antilles) — 4 en §1 |
| `19fd1cc26f39cb41` | Gynéco Obstétrique Pratique/Actualités (10 art.) | 2026-08-09 | 6 articles oncologie spécialisée/hôpital ou design faible — 3 en §1, 1 en §2 |
| `19fd1cd2841de323` | Gynéco Obstétrique Pratique/All items (15 art.) | 2026-08-09 | 14 synthèses narratives/congrès sans étude primaire — 1 en §1 |
| `19fd1ccff2e908ba` | Diabétologie Pratique (4 art.) | 2026-08-05 | 3 articles hors décision fréquente ou hospitaliers — 1 en §1 |
| `19fd1cbfeba8412d` | Cardiologie Pratique/Actualités (9 art.) | 2026-08-05 | 7 articles spécialisés/hospitaliers — 2 en §1 |
| `19fd1ccd7e20044d` | Cardiologie Pratique/All items (16 art.) | 2026-08-05 | 15 revues narratives/congrès (ACC, ESC) — 1 en §1 |
| `19fd1cc4f5c3d818` | Pédiatrie Pratique/Actualités (9 art.) | 2026-08-05 | Thème hors périmètre (pédiatrie) — 1 en §4 |
