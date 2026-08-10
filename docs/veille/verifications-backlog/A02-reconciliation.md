# A02 — Réconciliation bi-agents (SOP §7)

**Item** : valeur prédictive comparée des mesures successives de pression artérielle en consultation.
**Source primaire** : Desbiens *et al.*, *Hypertension* (AHA) 2023;80(10):2209-2217 ·
DOI 10.1161/HYPERTENSIONAHA.123.21510 · PMID 37615094 · cohorte **CARTaGENE** (Québec).
**Titre de presse relayé** : « Mesure de la PA en consultation, trois fois valent mieux qu'une ».
**Agents** : A (analyste) · B (contradicteur), contextes séparés.
**Réconciliateur** : Claude Code (Opus) — SOP §7.
**Date** : 2026-08-10.

> **Statut initial : `reporte` (report 1/2).** Accès au texte intégral impossible sans contournement de
> paywall ; trois points matériels invérifiables.
>
> **REPLI DÉCLENCHÉ LE 2026-08-10 — route `breve`.** Recherche d'accès menée après le report :
> interrogation de l'API Europe PMC (`isOpenAccess: No`, `inEPMC: No`, `inPMC: No`, `hasPDF: No`, seule
> URL « subscription required »), recherche de manuscrit accepté en dépôt institutionnel (Université
> Laval, Université de Montréal, Hôpital Maisonneuve-Rosemont, CHU de Québec) — **aucune version libre
> n'existe**. Quatrième vérification indépendante, après l'Agent B, l'Agent C et le premier passage.
>
> Le report existe pour éviter de bâcler, pas pour attendre un accès dont on a établi qu'il n'arrivera
> pas : un second cycle serait une formalité sans objet. La **sortie de repli du §5 est appliquée
> maintenant** — elle est solide, car elle ne repose que sur l'abstract, intégralement vérifié.

---

## 1. Accès — établi de façon concordante et définitive

`ahajournals.org` renvoie **403** (trois tentatives, deux agents). Europe PMC confirme
`isOpenAccess: N`, `inPMC: N`, **aucun PMCID**. Les deux agents ont travaillé **sur le seul abstract
structuré**. Ce n'est pas un défaut d'effort : l'article n'est pas accessible légitimement.

Conséquence directe : les rubriques 3 (risque de biais), 5 (résultats détaillés) et 7 (esprit
critique) de `GRILLE_APPRECIATION.md` sont **non renseignables**, et la règle d'or (« chaque chiffre
relié à sa page/son tableau ») ne peut pas être satisfaite.

## 2. Consensus vérifié

- **Chiffres exacts**, IC compris : HR **1,10 [1,05-1,15]** (SBP₃) et **1,06 [1,01-1,10]** (SBP₁) par
  écart-type · **17 966** sujets · **2 378** MACE · ~10 ans de suivi.
- **`niveau_preuve` : faible** — les deux agents.
- **`niveau_impact` : informatif** — les deux agents.
- **Critère dur** (MACE), puissance sérieuse, protocole de mesure standardisé, « Disclosures: None ».
- **Aucune donnée de reclassement** (hypertendu ↔ non hypertendu) — le chiffre qui rendrait l'article
  actionnable en consultation est absent. Les deux agents le constatent.
- **Pas de test formel de différence entre les deux HR**, dont les IC se chevauchent largement.

## 3. Divergences tranchées

### D1 — La C-statistique : **les deux ont raison sur un point différent**

A écrit qu'« aucune valeur chiffrée de C-statistique, aucun NRI/IDI » n'apparaît. B écrit que « la
C-statistique **existe** et a fait l'objet d'une comparaison formelle », et retire honnêtement sa
propre objection « pas de discrimination ».

Ce n'est pas contradictoire, et la formulation exacte compte : **une comparaison formelle de
discrimination a bien été conduite** (B a raison contre l'implication de A qu'elle n'existerait pas),
mais **son amplitude n'est pas extractible de l'abstract** (A a raison sur le fait qu'aucun chiffre
n'est disponible). C'est précisément un des trois points qui motivent le report.

### D2 — Le « 2× » : **B est plus précis, retenu**

A note que le « 2× » figure littéralement dans l'abstract et qu'il porte sur l'excès de risque, pas
sur le HR. B va plus loin et établit deux choses :
- l'original dit « **excess** MACE risk » — **supprimer « excess » dans le relais rend l'énoncé faux** ;
- **0,10 / 0,06 = 1,67, pas 2**. Le facteur 2 provient d'une **re-expression par mmHg** (« at a given
  SBP value ») qui suppose les écarts-types des distributions, **absents de l'abstract**.

**Tranché : le « 2× » est à proscrire cité seul.** Il est vrai dans son cadrage d'origine, faux dès
qu'on le sort. Et sa construction exacte est invérifiable sans le texte intégral.

### D3 — L'inversion du titre de presse : **B l'a trouvée, A non — mais B la surqualifie**

B écrit que « le titre de presse dit **l'inverse** du résultat » : l'article conclut « surtout quand la
première mesure est écartée », toutes les moyennes contenant SBP₁ sous-performent, et le meilleur
prédicteur est **SBP₃ seule** — une mesure unique.

**Le fond est juste et A l'avait manqué. Mais « l'inverse » est trop fort**, et le réconciliateur
corrige : pour disposer de SBP₃, il faut bien avoir mesuré trois fois. Le titre n'est donc pas
littéralement inversé.

Ce qu'il fait, plus précisément : **il déplace le message opératoire**. Le gain ne vient pas de
*combiner* trois mesures — il vient d'**écarter la première**. C'est une nuance qui a des
conséquences concrètes, car la pratique recommandée (ESC 2024 : moyenne des deux dernières) **contient
encore SBP₂**, et le résultat de l'article suggère que même cette moyenne est moins performante que
SBP₃ seule. Autrement dit, l'article ne confirme pas la recommandation, il la **nuance sur un point
précis** — ce que ni « trois fois valent mieux qu'une » ni « ça ne change rien » ne restituent.

Formulation retenue : **le titre de presse ne restitue pas le message opératoire de l'article** (qui
est « écarter la première mesure », pas « en faire trois »).

### D4 — Deux omissions du relais, relevées par B seul

- **Les PA brutes** : 122,5-126,5 mmHg — population **quasi normotendue**. Transposer à une patientèle
  hypertendue suivie en MSP n'est pas acquis.
- **Le résultat sur la diastolique est négatif** — jamais mentionné dans le relais.

## 4. Objection décisive pour le classement : la pratique est déjà recommandée

Documenté par B, sourcé :
- **ESC 2024** : 3 mesures, moyenne des 2 dernières.
- **HAS** : ≥ 2 mesures **et confirmation obligatoire par automesure ou MAPA**.

Ce second point est le plus important pour le lecteur français : **en soins premiers, le diagnostic
d'HTA ne repose de toute façon pas sur la mesure de consultation**, mais sur l'automesure ou la MAPA.
L'enjeu de la 1ʳᵉ vs 3ᵉ mesure de consultation en est largement court-circuité. `informatif` est donc
solidement établi, indépendamment du report.

## 5. Arbitrage sur la route — `reporte`, avec une sortie de repli déjà définie

**Retenu : `reporte`, report 1/2 au 2026-08-10.** B distingue correctement les deux cas que la doctrine
du projet sépare : « l'article ne change rien » est un **verdict** (`informatif`), « je n'ai pas pu
vérifier » est un **report** (SOP §6bis, « on reporte, on ne bâcle pas »). Ici les deux coexistent, et
c'est le second qui commande la route.

**Trois points invérifiables** motivant le report : construction exacte du « 2× » ; amplitude du gain
de C-statistique ; covariables d'ajustement — **avec un risque de circularité** si le modèle est ajusté
sur un score de type ASCVD qui contient déjà la PA systolique.

**Condition de levée** : accès légitime au texte intégral (voie institutionnelle, copie auteur,
demande aux auteurs). **Aucun contournement de paywall** (SOP §8).

### Sortie de repli, si l'accès échoue au second passage

Ne pas laisser l'item mourir en report : **reclasser en `breve`**, avec un contenu qui tient
entièrement sur l'abstract — donc intégralement vérifié, sans appréciation critique :

> Grande cohorte québécoise (n=17 966, ~10 ans, 2 378 MACE) : parmi les mesures successives de PA en
> consultation, **la troisième prédit mieux les événements cardiovasculaires que la première**, et les
> moyennes incluant la première mesure sont moins performantes. Population quasi normotendue
> (122,5-126,5 mmHg) ; résultat **négatif sur la diastolique**. En France, le diagnostic d'HTA repose
> de toute façon sur l'automesure ou la MAPA (HAS).

Cette brève est publiable telle quelle : elle **signale, situe et lie** sans porter de jugement de
solidité — ce qui est exactement le contrat de la route brève (gabarit §3). Elle corrige au passage
le cadrage du relais sans avoir besoin de le commenter.

**Ne jamais reprendre** : le titre « trois fois valent mieux qu'une », ni le « 2× » sorti de son
cadrage (« excess risk at a given SBP value »).

## 6. Classement provisoire

| Champ | Valeur | Statut |
|---|---|---|
| `route` | `reporte` → `breve` en repli | report 1/2 |
| `niveau_impact` | `informatif` | A et B concordants |
| `niveau_preuve` | `faible` (→ `non_apprecie` si brève) | A et B concordants |
| `themes` | `[cardiovasculaire-prevention]` | A et B concordants |
| `professions_concernees` | `[MG, IPA]` | mesure de PA en protocole IPA |
| `concerne_decision` | `false` | — |
| `meta.relecture_referent` | `true` | thème MG, circuit §7 |

## 7. Ce que ce dossier valide, au-delà de l'item

A02 est la **démonstration du garde-fou** de `TRI_BOITE_MAIL.md` (« une source de repérage ne détermine
jamais la route ») et de `SOP_veille.md` §9. Le signal de presse était plausible et les chiffres
relayés étaient **exacts** — et pourtant le cadrage était faux sur deux points (le message opératoire,
le « 2× » amputé de « excess »), et deux résultats défavorables avaient disparu du relais (population
normotendue, diastolique négative). **Aucune de ces distorsions n'aurait été visible sans remonter à
la source.** À citer en exemple lors de la prochaine revue de SOP.

---

*Réconciliation produite par l'orchestrateur (Opus) à partir de `A02-agent-A.md` et `A02-agent-B.md`,
rédigés en contextes isolés. D1 tranchée en montrant que les deux agents avaient raison sur des points
distincts ; D2 par supériorité de précision ; **D3 en corrigeant le contradicteur**, dont le constat
était juste sur le fond mais surqualifié dans sa formulation. Escalade humaine obligatoire — SOP §7.*
