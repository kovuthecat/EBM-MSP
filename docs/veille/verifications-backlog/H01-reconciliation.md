# H01 — Réconciliation bi-agents (SOP §7)

**Item** : IPP chez le jeune enfant et risque d'infections graves.
**Source primaire** : Lassalle M, Zureik M, Dray-Spira R. *Proton Pump Inhibitor Use and Risk of
Serious Infections in Young Children.* **JAMA Pediatrics** 2023;177(10):1028-1038.
DOI 10.1001/jamapediatrics.2023.2900 · PMID 37578761 · texte intégral open access PMC10425862.
**Agents** : A (analyste, contextes séparés) · B (contradicteur, contextes séparés).
**Réconciliateur** : Claude Code (Opus), orchestrateur — SOP §7.
**Date** : 2026-08-10.

> **Statut : NON PUBLIABLE EN L'ÉTAT.** Le §7 impose une **escalade humaine obligatoire**. Ce rapport
> est l'entrant de cette escalade, pas sa conclusion. Trois points ci-dessous relèvent du référent.

---

## 1. Consensus vérifié (A et B concordants, sur pièces)

- **Identité de la source** : identique chez A et B, texte intégral lu par les deux via PMC. Aucune
  ambiguïté d'identification (contrairement à A03, cf. incident LODESTAR).
- **Les 8 aHR relayés par la presse sont exacts au centième**, IC compris. A et B les confirment
  indépendamment sur Table 2/3. **Aucune divergence de chiffre.**
- **Comparateur actif** : la cohorte entière est composée d'enfants recevant un premier traitement
  anti-reflux — IPP d'un côté, anti-H2 / antiacides-alginate de l'autre. Ce n'est **pas** « traité vs
  non traité ». Analyse de sensibilité excluant les anti-H2 : inchangée (1,34 [1,31-1,36]).
- **Critère dur et correctement nommé** : première **hospitalisation** avec infection en **diagnostic
  principal** (CIM-10). Le mot « serious » du titre est adossé à une définition opérationnelle, ce
  n'est pas du *spin*.
- **Pas de conflit d'intérêt commercial, pas de financement industriel** (EPI-PHARE = GIS ANSM+CNAM).
- **`niveau_preuve` : modéré** — atteint indépendamment par A et B, avec des justifications qui se
  recoupent (remontée depuis « faible » au titre du comparateur actif, du critère dur, du contrôle
  négatif et de la précision).
- **Glissement normatif de la phrase de conclusion** des auteurs (« PPIs should not be used without a
  clear indication ») : relevé par A **et** par B. B le juge défendable comme recommandation de
  prudence ; A le juge plus catégorique que le design ne l'autorise. Nuance, pas désaccord.

## 2. Divergences tranchées sur pièces (par le réconciliateur)

### D1 — Effet absolu / NNH : **A est en erreur, B retenu**

A dérive son NNH des **incidences brutes** (9,27 vs 2,64 / 100 PA), soit ≈ 1 événement / 15
années-enfant. B démontre que ces deux taux **ne sont pas comparables** : l'échelle de temps du modèle
de Cox est **l'âge en jours**, et le temps-personne exposé est concentré dans la première année de vie,
là où les hospitalisations pour bronchiolite et gastro-entérite culminent. C'est précisément pourquoi
le rapport brut vaut 3,5 alors que le HR brut vaut 1,42 et l'aHR 1,34.

A reconnaît d'ailleurs lui-même que son chiffre repose sur « les incidences brutes non ajustées » — ce
qui est exactement le défaut identifié par B.

**Recalcul de B, vérifié pas à pas par le réconciliateur** :

| Étape | Calcul | Résultat |
|---|---|---|
| Taux observé chez les exposés | 25 191 / 271 874 PA | 9,27 / 100 PA |
| Taux contrefactuel | 9,27 ÷ 1,34 | 6,92 / 100 PA |
| Excès | 9,27 − 6,92 | **2,35 / 100 PA** |
| Durée moyenne d'exposition | 271 874 PA ÷ 606 645 enfants | 0,448 an ≈ 164 j |
| Excès par enfant traité | 2,35 × 0,448 | 1,05 / 100 enfants |
| **NNH** | 100 ÷ 1,05 | **≈ 95** |

Arithmétique conforme. **NNH ≈ 95 [90-100] enfants traités ~5 mois pour une hospitalisation pour
infection supplémentaire.** À publier **explicitement comme un recalcul de la veille, absent de
l'article**, avec ses réserves (le HR n'est pas un rapport de taux ; durée moyenne approximée ; valable
sous hypothèse d'absence de confusion résiduelle).

> Conséquence notable : l'objection réflexe « grand risque relatif sur petit risque de base, donc NNH
> énorme, donc négligeable » **ne fonctionne pas ici**. L'incidence de base des hospitalisations
> infectieuses du nourrisson est élevée, et l'effet absolu est cliniquement significatif.

### D2 — Biais de détection : **A le laisse ouvert, B le referme — B retenu**

A porte le biais de détection en réserve non résolue (« enfant sous IPP = suivi plus rapproché, non
quantifié par les auteurs »). B montre qu'il est neutralisé par deux traits de conception que A n'a pas
reliés à cette question :
1. le critère est une **hospitalisation en diagnostic principal** — on ne fait pas hospitaliser un
   enfant parce que ses parents consultent davantage ;
2. le **contrôle négatif** (traumatismes hors fractures) est **négatif** : aHR 0,96 [0,90-1,02]. Si une
   propension parentale au recours aux soins portait le résultat, ce contrôle serait positif.

**Tranché : le biais de détection n'est pas l'objection à retenir.** A n'avait pas exploité le contrôle
négatif ; B l'a fait.

### D3 — Relation durée-effet : **A la présente comme un point fort, à tort — B retenu**

A cite une « cohérence dose-durée » à l'appui du niveau modéré. Les chiffres de l'article, que les deux
agents rapportent pourtant à l'identique, sont : ≤6 mois **1,34** · 7-12 mois **1,33** · >12 mois
**1,38**. C'est **plat**. B a raison : l'absence de gradient biologique (critère de Bradford Hill)
**affaiblit** l'argument causal au lieu de le renforcer.

Divergence factuelle tranchable sur pièces, comme le prévoit le §7. **Le niveau `modéré` survit
néanmoins** : B y parvient indépendamment sans s'appuyer sur ce gradient, en s'appuyant sur la
réversibilité à l'arrêt et la topographie des sites.

### D4 — Cohérence externe : **A ne l'a pas faite, B l'a faite — élément déterminant**

A a explicitement décliné cette rubrique (« hors mandat strict de lecture de la source primaire »).
C'est une lacune, pas un désaccord — mais elle est lourde, car B y trouve l'élément le plus important
du dossier après le NNH :

- **Méta-analyse d'ECR 2025 sur *C. difficile*** (8 ECR, 29 880 participants) : **RR 1,19 [0,75-1,89],
  non significatif** — population **adulte**, germe unique. **Sur le seul terrain où l'on a randomisé,
  le signal IPP-infection ne se retrouve pas.** Élément à mentionner obligatoirement.
- Convergent en pédiatrie observationnelle : Canani 2006, Terrin 2012 (même sens, effets plus grands).
- **Aucune réfutation, aucun erratum, aucune correspondance critique** publiés contre Lassalle 2023 au
  2026-08-09.

## 3. Objections qui subsistent après réconciliation

1. **Channeling par sévérité** (GRAVE, non résolue) — le comparateur actif règle « traité vs non
   traité » mais pas « pourquoi un IPP plutôt qu'un alginate ». Le SNDS ne contient pas l'indication.
   Non captés : sévérité du reflux, APLV, troubles de l'oralité, cassure pondérale, allaitement, mode
   de garde. **E-value 2,01** : franchissable par la sévérité du reflux ou un handicap neurologique
   pas encore codé — pas par le mode de garde, qui est un confondant fort de l'infection mais faible
   de l'exposition.
2. **Absence de gradient durée-effet** (cf. D3).
3. **Multiplicité non corrigée** : sans conséquence sur l'estimation principale (centaines de milliers
   d'événements), **décisive** pour ostéo-articulaire 1,17 [1,01-1,37] et neurologique 1,31 [1,11-1,54]
   — à ne jamais citer isolément.
4. **Aucun protocole pré-enregistré retrouvé** (ni A ni B) ; déclaration de financement explicite
   introuvable dans la version PMC. Faiblesses de procédure, pas de preuves de sélection.

## 4. Ce qui reste non vérifiable

- Existence d'un protocole pré-enregistré (EnCePP / autre) : ni confirmée ni infirmée par les deux
  agents.
- Section « Funding/Support » distincte du JAMA : non isolée sur la version PMC.
- Le rapport EPI-PHARE en français n'a été consulté par aucun des deux agents (source primaire =
  publication JAMA Pediatrics).

## 5. Classement proposé au référent

| Champ | Valeur réconciliée | Origine |
|---|---|---|
| `route` | `analyse` | A et B concordants |
| `niveau_impact` | `pratique` | A et B concordants |
| `niveau_preuve` | `modere` | A et B concordants, justifications convergentes |
| `pertinence_pratique` | `forte` | A et B concordants |
| `professions_concernees` | `[MG, IPA, sage-femme]` | tranché par le référent 2026-08-10 (E2) |
| `themes` | `[pediatrie, soins-premiers]` | tranché par le référent 2026-08-10 — **D63** (E1) |
| `meta.relecture_referent` | `true` | `pediatrie` = thème MG, circuit §7 standard (D63) |
| `concerne_decision` | `false` | aucun nœud DT2 concerné ; candidat de premier rang si un domaine « RGO du nourrisson » ouvre un jour — à porter en réserve de contenu, pas en modification |

### Conditions de rédaction opposables (issues de B, validées par le réconciliateur)

1. **Donner l'effet absolu** : NNH ≈ 95, présenté comme recalcul de la veille, avec ses réserves.
2. **Ne jamais reproduire les taux bruts 9,27 vs 2,64 sans avertissement** — le rapport « ×3,5 » est
   faux. Si on les cite, citer le HR brut 1,42 dans la même phrase.
3. **Restituer les trois résultats omis par la presse** : cutané non significatif (1,08 [0,97-1,21]),
   ostéo-articulaire limite, et surtout **exposition passée 1,07 [1,06-1,09]** — ce dernier en position
   visible : c'est le résultat le plus utile en consultation (« ça régresse à l'arrêt »), et il coupe
   dans les deux sens (argument causal le plus fort du papier *et* chiffrage du plancher de biais).
4. **Mentionner la discordance randomisée** (méta-analyse d'ECR 2025, adultes, *C. difficile*, NS).

---

## 6. Escalade au référent — trois points qui ne relèvent pas des agents

> **TRANCHÉS PAR LE RÉFÉRENT LE 2026-08-10.** Les trois points ci-dessous sont conservés dans leur
> formulation d'origine (ce qui a été remonté, et pourquoi) ; la décision figure sous chacun.
> Elles sont consolidées en **D63**
> (`docs/commun/decisions/2026-08-10-d63-theme-pediatrie-ajoute-taxonomie-et-production.md`).
>
> **Il reste l'escalade humaine de fond du §7** — la validation du contenu de la réconciliation
> elle-même (chiffres, niveau de preuve, conditions de rédaction) — avant toute rédaction d'entrée.
> Ce qui est tranché ici, c'est le classement, pas l'appréciation critique.

### E1 — Il n'existe pas de thème `pediatrie` dans la taxonomie *(bloquant)*

La taxonomie compte **13 thèmes** (`BRIEF_VEILLE.md` §4), dont aucun n'est pédiatrique. L'Agent A a
proposé « pédiatrie ; iatrogénie ; RGO nourrisson » — **aucune de ces valeurs n'existe**. Le référent a
requalifié H01 « dans le périmètre MG » le 2026-08-09, ce qui est juste sur le fond (la prescription
d'IPP au nourrisson est un acte de soins primaires), mais le modèle de données ne sait pas le porter.

Options, aucune satisfaisante :
- `[soins-premiers]` seul — exact mais le signal pédiatrique disparaît du filtrage par thème ;
- `[soins-premiers, infectiologie-antibiotherapie]` — le second thème vise les durées d'antibiothérapie
  et la résistance, pas le risque infectieux iatrogène : ajustement discutable ;
- `[soins-premiers, geriatrie-deprescription]` — **à exclure** : le thème est nommé « gériatrie », y
  ranger un nourrisson serait une erreur de classement visible par le lecteur ;
- ouvrir un 14ᵉ thème `pediatrie` — décision de périmètre, donc une décision `D` à part entière, pas
  un arbitrage de veille.

**Recommandation du réconciliateur** : `[soins-premiers]` pour cette entrée, **et** ouvrir la question
du thème pédiatrique comme décision distincte. H01 ne peut pas servir de prétexte à élargir le
périmètre en silence.

> ✅ **Tranché : création du thème `pediatrie`** (D63), 14ᵉ valeur de la taxonomie, répercutée dans les
> 4 points de duplication (BRIEF §4, `ARCHITECTURE.md`, SOP §3bis, `THEME_LABELS`). La recommandation
> de repli du réconciliateur n'a pas été suivie, et à raison : elle aurait reporté le problème au
> prochain item pédiatrique. `themes: [pediatrie, soins-premiers]`.

### E2 — `professions_concernees` déborde le périmètre

A propose « médecine générale, pédiatrie, sage-femme ». L'énumération du modèle est
`MG | IPA | sage-femme | orthophoniste | IDEL` — « pédiatrie » n'en fait pas partie. `[MG, IPA]` est
retenu par défaut ; l'inclusion de `sage-femme` (suivi du nourrisson) est un appel au référent.

> ✅ **Tranché : `sage-femme` incluse.** `professions_concernees: [MG, IPA, sage-femme]`.

### E3 — Un item classé `pratique` dont le thème est hors production

C'est la question de fond, et elle est antérieure à la rédaction : publier une analyse à impact
pratique sur un sujet pédiatrique, dans une veille dont le périmètre de production ne couvre pas la
pédiatrie, engage la crédibilité de l'ensemble. Soit le périmètre s'ouvre explicitement (décision),
soit l'item est tenu hors production malgré sa qualité. **Le réconciliateur ne tranche pas ce point :
il est de nature éditoriale, pas méthodologique.**

> ✅ **Tranché : la pédiatrie fait partie du champ MG**, donc `pediatrie` entre au **périmètre de
> production** (12 thèmes) comme **10ᵉ thème MG** — et non comme un thème hors compétence.
>
> **Conséquence sur le circuit, qui est le vrai enjeu de cet arbitrage** : le référent étant compétent,
> H01 relève du **§7 bi-agents** (déjà exécuté, ci-dessus) avec arbitrage du référent au §5 étape 5, et
> **`relecture_referent: true`**. Le §7bis tri-agents ne s'applique pas. L'y soumettre « par prudence »
> aurait été une erreur de signal : le bandeau « aucune relecture par un référent de profession »
> aurait annoncé au lecteur une lacune qui n'existe pas ici. Le §7bis contient un angle mort, il n'est
> pas un supplément de rigueur.

---

*Réconciliation produite par l'orchestrateur (Opus) à partir des rapports `H01-agent-A.md` et
`H01-agent-B.md`, rédigés en contextes isolés. Les divergences D1, D3 ont été tranchées sur pièces
(recalcul arithmétique vérifié, chiffres de l'article) ; D2 et D4 par supériorité de couverture
documentée. Escalade humaine obligatoire — SOP §7.*
