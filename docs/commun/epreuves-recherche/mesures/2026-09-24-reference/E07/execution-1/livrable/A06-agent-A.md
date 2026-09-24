# A06 — Agent A (Analyste/Extracteur) — Vérification tri-agents §7bis

**Thème :** `sante-femme-perinatalite` → circuit **tri-agents §7bis** (SOP_veille.md, angle mort
assumé, `meta.relecture_referent: false` à la publication).
**Rôle :** Agent A seul, contexte isolé. N'a pas vu le travail de l'Agent B.
**Consigne suivie :** rédaction au fil de l'eau, pas de requête OpenEvidence.

**Source annoncée (à confirmer avant analyse) :**
Garabedian C, Sénat M-V, Sananès N, et al. « Diabète antérieur à la grossesse » — Consensus formalisé
d'experts CNGOF-SFD. *Gynécol Obstét Fertil Sénol* 2026;54:132-164. DOI: 10.1016/j.gofs.2025.12.001.

**Trois éléments relayés à vérifier** (d'après `epreuve/entrees/reperage-A06.md`) :
1. Dépistage de la rétinopathie diabétique — surveillance ophtalmologique trimestrielle pendant la grossesse.
2. Dépistage/suivi de la néphropathie — bilan rénal en préconception, puis surveillance mensuelle si atteinte avérée.
3. Objectif tensionnel < 140/90 mmHg.

---

## Journal de recherche (au fil de l'eau)

- Skill `recherche-source-primaire` chargé. Skill `verif-source-veille` chargé (§7bis confirmé
  applicable : thème `sante-femme-perinatalite`).
- Tentative `mcp__claude_ai_PubMed__lookup_article_by_citation` → refusée par permission
  (« don't ask mode »). Contournement raisonnable : `WebSearch`.
- `WebSearch` sur la citation exacte → localise l'article sur EM-Consulte/ScienceDirect **et** un
  PDF hébergé directement par le CNGOF (`cngof.fr/app/uploads/2026/05/CFE-diabete-anterieur-2026.pdf`).
  C'est le texte intégral publié par la société savante elle-même — accès légitime, pas de
  contournement de paywall (l'article est de toute façon en Open Access CC BY, confirmé plus bas).
- `WebFetch` sur le PDF → échec (contenu binaire non interprétable par le petit modèle de
  résumé), mais le fichier est sauvegardé localement.
- `Read` du PDF sauvegardé → `pdftoppm`/poppler absent, rendu par page impossible.
- `Read` du PDF **sans** paramètre `pages` → **succès**, extraction texte intégrale des 33 pages
  (l'outil a un mode d'extraction de texte qui ne dépend pas de poppler). Le fichier correspond
  bien à *Gynécologie Obstétrique Fertilité & Sénologie* 54 (2026) 132–164, DOI
  10.1016/j.gofs.2025.12.001, auteurs Garabedian C, Sénat M-V, Sananès N et al. — **identité de
  source confirmée**, aucune divergence avec la citation de l'item.
- L'article est **Open Access sous licence CC BY 4.0** (mention explicite p.132 : « 2468-7189/©
  2025 Les Auteurs. Publié par Elsevier Masson SAS. Cet article est publié en Open Access sous
  licence CC BY »). Pas de paywall, pas de question de report pour inaccessibilité.
- Lecture intégrale du texte (33 pages) : méthodologie (§2), Champ 1 à 5, Tableau 1 (synthèse des
  25 propositions), argumentaires détaillés, déclarations de liens d'intérêts, 239 références.
  Les trois éléments relayés se trouvent **tous les trois dans la Proposition 14** (« Champ 2 »,
  p.148 du PDF = p.147-148 de la pagination article), un seul avis d'experts qui couvre
  rétinopathie + néphropathie + HTA.
- Remplissage de la grille ci-dessous à partir du texte primaire uniquement (jamais depuis le
  relais presse ou la ligne de repérage).

---

## Grille d'appréciation critique (`GRILLE_APPRECIATION.md`)

### 1. Identification

| Champ | Réponse |
|---|---|
| Titre | « Diabète antérieur à la grossesse : consensus formalisé d'experts du collège national des gynécologues et obstétriciens français et de la société française de diabétologie » |
| Source (revue/site) | *Gynécologie Obstétrique Fertilité & Sénologie* (GOFS), revue officielle du CNGOF, Elsevier Masson — également mis en ligne en PDF par le CNGOF lui-même (cngof.fr) |
| DOI / lien | 10.1016/j.gofs.2025.12.001 — https://doi.org/10.1016/j.gofs.2025.12.001 (mis en ligne le 7 décembre 2025 ; volume 54, pp.132-164, 2026) |
| Année | 2026 (mise en ligne anticipée 2025-12-07) |
| Type de publication | **Consensus formalisé d'experts (CFE)** — explicitement **pas** une recommandation pour la pratique clinique (RPC) au sens GRADE. Les auteurs le disent eux-mêmes (§2.5, p.136) : « Il n'était donc pas possible d'appliquer la méthode GRADE pour répondre à toutes les questions PICO […] Nous avons ainsi décidé d'appliquer la méthode du Consensus Formalisé d'Experts (CFE) ». Chaque proposition est étiquetée « AVIS D'EXPERTS », jamais « RPC » ou « recommandation forte/faible » GRADE. |
| Financement & conflits d'intérêt | Déclarés en fin d'article (p.157). Plusieurs auteurs ont des liens d'intérêt avec des fabricants de dispositifs de diabétologie (Medtronic, Novo Nordisk, Sanofi, Abbott, Ypsomed, Organon…) — dont C. Garabedian (1er auteur, Organon/Hemosquid/General Electrics) et A. Vambergue (dernier auteur, Ypsomed). Ces liens concernent surtout les propositions sur la mesure continue du glucose / délivrance automatisée d'insuline (Champ 1-2), **pas directement** les trois propositions vérifiées ici (rétinopathie, néphropathie, TA) — aucun lien déclaré avec un fabricant de dispositif ophtalmologique, néphrologique ou antihypertenseur. Financement de la méthode Delphi : URC Robert-Debré (AP-HP) remerciée, pas de financement industriel mentionné pour le CFE lui-même. |
| Registre / protocole pré-enregistré ? | **Non** applicable au sens RoB2/AMSTAR : ce n'est pas un essai ni une revue systématique protocolée (pas de PROSPERO). La méthode Delphi est décrite (§2.9, p.137) mais sans protocole pré-enregistré indépendant. |

### 2. Question (PICO) — adapté à un consensus d'experts, pas à une étude primaire

- **P** (population) : femmes vivant avec un diabète **préexistant** à la grossesse (type 1 ou type 2) ; diabète gestationnel explicitement **exclu** du champ du CFE (§1, p.135 : « La question du diabète gestationnel sera traitée à part »).
- **I** : (a) dépistage/surveillance ophtalmologique de la rétinopathie diabétique (RD) ; (b) bilan rénal préconceptionnel/1er trimestre puis surveillance mensuelle en cas de néphropathie diabétique ; (c) objectif de pression artérielle (PA) < 140/90 mmHg en cas d'HTA chez la femme diabétique.
- **C** : implicite dans les études sources citées — absence de surveillance renforcée, ou seuil tensionnel moins strict (l'essai CHAP cité compare un seuil de traitement à 140/90 mmHg à une abstention jusqu'à HTA sévère ≥160/105 mmHg).
- **O** : progression de la RD, survenue d'une prééclampsie, accouchement prématuré, mortalité périnatale, critère composite de dysfonction placentaire.
- Population ≈ patientèle MSP ? **Partiellement.** Le diabète préexistant à la grossesse concerne ~0,5 % des grossesses françaises en 2021 (0,2 % DT1 + 0,3 % DT2, source ENP2021 citée p.135) — rare en soins premiers, mais le CFE lui-même désigne explicitement le médecin généraliste comme profession concernée (§2.2, p.136 : « gynécologues-obstétriciens, endocrinologues, sages-femmes, médecins généralistes et anesthésistes »), essentiellement pour le repérage préconceptionnel et l'orientation — pas pour la mise en œuvre directe de la surveillance trimestrielle/mensuelle spécialisée, qui relève du diabétologue/ophtalmologue/gynécologue-obstétricien.

### 3. Risque de biais — méthode Delphi (pas RoB2/AMSTAR, mais grille adaptée)

Ce n'est ni un ECR ni une revue systématique formelle : la grille RoB2/AMSTAR ne s'applique pas
telle quelle. Éléments de rigueur méthodologique constatés dans le texte (§2.6-2.9, p.136-137) :

- [x] Questions PICO définies a priori par le président et les coordonnateurs, réparties entre
  membres du groupe de travail rédacteurs par thème.
- [x] Recherche bibliographique déclarée (MedLine, Cochrane, Google Scholar) — mais **pas
  systématique au sens AMSTAR** : pas de protocole publié, pas de double lecture indépendante des
  études sources mentionnée, critère de sélection = jugées « importantes » par le groupe d'experts
  (subjectif, non quantifié).
- [x] Validation externe par Delphi : 65 relecteurs indépendants (gynécologues-obstétriciens,
  endocrinologues, anesthésistes, médecins généralistes), notation 1-9, seuil de validation ≥75 %
  des réponses dans la même section avec médiane ≥7. **Un seul tour de Delphi** a été nécessaire ;
  les 25 propositions ont été validées dès le premier tour (p.137).
- [ ] Pas d'évaluation formelle du risque de biais des études sources incluses (pas de RoB2/Newcastle-Ottawa systématique par item).
- [ ] Pas d'analyse d'hétérogénéité ni de biais de publication (n/a — CFE narratif, pas de méta-analyse propre).

**Synthèse risque de biais : élevé au sens méthodologique strict** (revue narrative non
protocolée, absence GRADE assumée par les auteurs), **mais validation externe multi-disciplinaire
réelle** (Delphi 65 relecteurs) qui limite le risque d'un avis isolé. Pour chacun des trois
sous-items, le risque de biais des **études sources** citées est variable (voir §5) : cohortes
observationnelles anciennes et de petite taille pour la rétinopathie et la néphropathie, un ECR
multicentrique de bonne qualité mais non spécifique au diabète préexistant pour la TA.

### 4. Critère de jugement

- Critère principal (proposition elle-même) : fréquence de surveillance (RD, néphropathie) et
  seuil tensionnel (TA) — ce sont des **critères de processus/structure**, pas des critères de
  résultat. Les critères de résultat des études qui **justifient** ces propositions sont :
  - RD : progression de la rétinopathie (composite apparition + aggravation) — **mixte** : atteinte
    oculaire elle-même pertinente pour la patiente à long terme, mais la proposition ne teste pas
    un critère dur maternofœtal directement.
  - Néphropathie : prééclampsie, prématurité — **durs**, pertinents pour la patiente.
  - TA : critère composite CHAP (prééclampsie sévère, accouchement prématuré médicalement indiqué
    avant 35 SA, décollement placentaire, mort fœtale/néonatale) — **dur**, pertinent, mais c'est
    un critère composite (cf. vigilance composite ci-dessous).
- Composite ? Oui pour le critère CHAP — le texte ne précise pas, pour le sous-groupe diabète
  préexistant, quel composant porte le résultat (non détaillé dans l'article).
- Le critère est-il pertinent pour la patiente ? **Oui** pour les trois (progression RD, prééclampsie/prématurité, morbi-mortalité périnatale).

> Vigilance : **aucun des trois items n'est validé par un essai comparant directement deux
> stratégies de surveillance ou deux seuils d'intervention spécifiques au diabète préexistant**
> (sauf la TA, via un sous-groupe d'un essai plus large — voir §5). Ce sont des avis d'experts
> s'appuyant sur des études de risque (association, pas d'intervention testée) pour la RD et la
> néphropathie.

### 5. Résultats & taille d'effet — chiffre par chiffre, relié à sa localisation

**(a) Rétinopathie diabétique (RD) — Proposition 14, argumentaire p.148, colonne gauche**

| Élément | Valeur | Localisation exacte |
|---|---|---|
| Taux de progression RD (étude prospective, 105 femmes DT1/DT2) | 23,8 % [IC95 % 16,4–32,6] | p.148, réf. [139] (Widyaputri et al.) |
| Facteur DT1 associé à la progression | RRa 4,96 [IC95 % 1,82–13,48] | p.148, réf. [139] |
| Facteur RD préexistante associée à la progression | RRa 3,25 [IC95 % 1,79–5,93] | p.148, réf. [139] |
| Facteur PA systolique élevée associée à la progression | RRa 2,49 [IC95 % 1,10–5,66] | p.148, réf. [139] |
| Progression RD (307 femmes, DT1 72,4 %/DT2 27,6 %) | 25 % | p.148, réf. [140] (Egan et al.) |
| Étude française, 375 femmes DT1 : prévalence RD préexistante | 30,3 % | p.148, réf. [141] (Bourry et al.) |
| Taux de progression/développement/aggravation | 21,8 % / 24,4 % (sans RD préexistante) / 15,9 % (avec RD préexistante) | p.148, réf. [141] |
| Recommandation antérieure SFO-SFD (2016) : suivi min. trimestriel, mensuel si facteur de progression | — | p.148, réf. [142] (Massin & Feldman-Billard, 2016) |

**Point de vigilance majeur** : la fréquence proposée par le CFE (trimestriel, mensualisé en cas de
facteur de progression) **n'est pas une nouveauté de ce CFE** — elle reprend telle quelle la
recommandation SFO-SFD de **2016** [142], explicitement citée comme source. Ce n'est donc pas un
résultat nouveau de ce consensus 2026, mais une **confirmation/reprise** d'une recommandation déjà
en vigueur depuis 10 ans.

**(b) Néphropathie diabétique — Proposition 14, argumentaire p.148 (bas) - p.149**

| Élément | Valeur | Localisation exacte |
|---|---|---|
| Prévalence micro/macroalbuminurie (revue de 33 études) | 6,8 % chez DT1 (n=7966) ; 2,9 % chez DT2 (n=3781) | p.148-149, réf. [5] |
| Prématurité selon atteinte rénale (cohorte prospective, 240 femmes) | 35 % (normoalbuminurie) / 62 % (microalbuminurie) / 91 % (néphropathie), p<0,001 | p.149, réf. [18] (Ekbom et al.) |
| Prééclampsie selon atteinte rénale, même cohorte | 6 % / 42 % / 64 %, p<0,001 | p.149, réf. [18] |
| Microalbuminurie associée à un risque x4 de prééclampsie | RR ≈ 4 (valeur ponctuelle citée sans IC dans le texte) | p.149, réf. [145] (Jensen et al.) |
| Étude non randomisée, 117 femmes DT1, traitement antihypertenseur renforcé (objectif microalbuminurie <300mg/24h, PA<135/85) | PAS moyenne 120 mmHg (normoalbuminurie) / 122 mmHg (microalbuminurie) / 135 mmHg (néphropathie), p=0,0095 ; prématurité 20 %/20 %/71 %, p<0,01 | p.149, réf. [146] (Nielsen, Damm, Mathiesen 2009) |

**Point de vigilance** : le contenu du « bilan rénal préconceptionnel » précisé dans le tableau 1
(p.138, Proposition 2.7.2) — dosage créatinine sérique, estimation DFG, évaluation micro/macro-
albuminurie — est **plus détaillé** dans le Tableau 1 que dans le résumé/abstract, ce qui confirme
qu'il faut bien lire le corps du texte (Proposition 14 §4.7.2) et pas seulement l'abstract pour
avoir le contenu exact du bilan. L'étude [146] qui sert de justification principale au « suivi
renforcé » est **ancienne (2009), non randomisée, petit effectif (117), non contrôlée** (comparaison
à des séries historiques) — limite reconnue par les auteurs eux-mêmes dans le texte : « Cette étude
a toutefois des limites importantes car elle était non randomisée, toutes les femmes n'étaient pas
traitées et les données ont été comparées à d'autres séries » (p.149).

**(c) Objectif tensionnel < 140/90 mmHg — Proposition 14, argumentaire p.149-150**

| Élément | Valeur | Localisation exacte |
|---|---|---|
| HTA chronique plus fréquente chez DT2 que DT1 (méta-analyse de 6 études, effectif non détaillé) | 11,2 % (DT2) vs 5,5 % (DT1) | p.149, réf. [5] |
| Risque de prééclampsie si HTA associée au diabète préexistant (3718 femmes diabète sans HTA vs 433 avec HTA+diabète) | OR ajusté 4,5 [IC95 % 3,5–5,8] | p.149, réf. [148] (Yanit et al.) |
| Risque d'accouchement prématuré <37 SA, même étude | OR ajusté 2,3 [IC95 % 1,8–2,9] | p.149, réf. [148] |
| Risque de petit poids pour l'âge gestationnel, même étude | OR ajusté 2,2 [IC95 % 1,5–3,1] | p.149, réf. [148] |
| **Essai CHAP** (Chronic Hypertension and Pregnancy) : 2408 femmes avec HTA chronique légère, randomisées traitement actif (seuil 140/90 mmHg) vs témoin (jusqu'à HTA sévère ≥160/105) | Critère composite (prééclampsie sévère, accouchement <35 SA médicalement indiqué, décollement placentaire, mort fœtale/néonatale) : **30,2 % vs 37,0 %**, RR ajusté **0,82 [IC95 % 0,74–0,92]**, p<0,001 | p.150, réf. [149] (Tita et al., *NEJM* 2022) |
| Sous-groupe CHAP « diabète préexistant » (16 % de l'échantillon, soit 191 traitement actif / 189 témoin) | RR ajusté **0,75 [IC95 % 0,59–0,94]** — résultat cohérent avec la population générale de l'essai | p.150, réf. [149] |

**Effet absolu et NNT (calcul Agent A à partir des chiffres publiés, population générale de
l'essai — le texte ne fournit pas les effectifs bruts par groupe pour le sous-groupe diabète)** :
différence de risque = 37,0 % − 30,2 % = **6,8 points** → **NNT ≈ 15** (sur la population générale
de CHAP, horizon = durée de la grossesse). Ce NNT n'est **pas recalculable spécifiquement pour le
sous-groupe diabète préexistant** avec les données publiées dans cet article (RR sous-groupe donné,
mais pas les effectifs/événements bruts par bras pour ce sous-groupe) — à signaler comme limite,
pas à extrapoler le NNT global au sous-groupe sans plus de données.

> **Point de vigilance majeur** : l'essai CHAP, la seule preuve de niveau ECR de cette proposition,
> **n'est pas un essai chez des femmes avec diabète préexistant** — c'est un essai sur l'HTA
> chronique de la grossesse en population générale, où le diabète préexistant ne représente qu'un
> sous-groupe de 380/2408 (16 %) inclus. L'extrapolation du seuil 140/90 mmHg au diabète préexistant
> repose sur la **cohérence de l'effet en sous-groupe**, pas sur un essai dédié à cette population.
> Le CFE le signale implicitement (« Seize pour cent de participantes de cette étude avaient un
> diabète préexistant », p.150) mais la Proposition 14 elle-même ne relativise pas ce point.

### 6. Validité externe & applicabilité

- Transposable à la patientèle MSP ? **Indirectement.** Le public cible direct du suivi rapproché
  (ophtalmologue, diabétologue, gynécologue-obstétricien) n'est pas le médecin généraliste de MSP,
  mais celui-ci est une des 5 professions explicitement visées par le CFE (§2.2) pour le repérage
  préconceptionnel, l'orientation et l'information de la patiente — pertinent notamment en amont
  de grossesse (consultation préconceptionnelle) et en coordination de parcours.
- Comparateur et prise en charge réalistes en soins premiers ? Le suivi trimestriel/mensuel
  ophtalmologique et le bilan rénal relèvent du parcours spécialisé (diabétologue/ophtalmologue),
  cohérent avec l'organisation française actuelle de la grossesse diabétique (suivi conjoint
  gynécologue-obstétricien/diabétologue dès le 1er trimestre, Proposition 10).
- Durée de suivi suffisante pour le critère ? Oui pour les études de cohorte citées (suivi pendant
  toute la grossesse) ; pour CHAP, suivi jusqu'à l'accouchement, cohérent avec le critère.

### 7. Cohérence & esprit critique

- Cohérent avec la totalité des preuves antérieures ? **Oui pour la RD** (reprise explicite de la
  recommandation SFO-SFD 2016, pas un résultat nouveau). **Partiellement pour la néphropathie**
  (s'appuie sur des cohortes anciennes convergentes, 2001-2009, mais peu de littérature nouvelle
  citée). **Oui pour la TA**, avec l'appui d'un ECR récent (CHAP, 2022) de bonne qualité mais
  généraliste, pas dédié au diabète préexistant.
- **Spin détecté dans la source elle-même** : aucun — le texte primaire est au contraire **très
  explicite sur ses propres limites** (niveau de preuve non GRADE assumé dès la méthodologie,
  limites de l'étude [146] signalées noir sur blanc, mention du caractère non spécifique du
  sous-groupe CHAP). Le CFE ne survend pas ses propres conclusions.
- **Risque de spin situé en aval, au niveau du relais presse** (pas de la source) : présenter ces
  trois éléments comme des « recommandations » du consensus, sans préciser qu'il s'agit d'
  **avis d'experts non gradés selon GRADE**, ni que deux des trois (RD, néphropathie) reposent sur
  des données anciennes et de faible niveau de preuve méthodologique, risque de leur donner une
  autorité qu'elles n'affichent pas elles-mêmes dans le texte source. C'est le point que
  l'Agent B doit vérifier en priorité côté red-team.
- Signaux d'alerte : pas d'arrêt précoce, pas de financement industriel identifié sur ces items
  précis, pas de changement de critère principal en cours de route, pas d'analyse post-hoc
  présentée comme principale.

### 8. Niveau de preuve (GRADE simplifié — évaluation Agent A, les auteurs du CFE n'en fournissent pas)

**RD : □ Faible.** Cohortes observationnelles convergentes (3 études, effectifs modestes
105-375), critère de progression bien mesuré, mais aucune comparaison directe de stratégies de
surveillance ; recommandation reprise telle quelle d'un avis d'experts 2016 antérieur.

**Néphropathie : □ Très faible à Faible.** Cohortes anciennes (2001, 2009), la seule étude
d'intervention (traitement renforcé) est non randomisée, non contrôlée formellement, petit
effectif (117), limites reconnues par les auteurs eux-mêmes.

**TA < 140/90 mmHg : □ Modéré.** Repose sur un ECR multicentrique de bonne qualité (CHAP, *NEJM*
2022), mais **indirect** : le diabète préexistant n'est qu'un sous-groupe (16 %) d'un essai qui ne
lui était pas dédié — cohérence de sous-groupe rassurante, non un essai princeps sur la population
cible.

Justification globale : le CFE lui-même se positionne en dessous du niveau RPC/GRADE par choix
méthodologique assumé (littérature insuffisante en quantité/qualité sur le diabète préexistant à la
grossesse, §2.5). Les trois propositions vérifiées ici sont cohérentes avec cette auto-évaluation
modeste : aucune n'atteint un niveau de preuve élevé.

### 9. Classement pour l'outil (proposition Agent A)

| Champ | Valeur |
|---|---|
| Thème(s) | `sante-femme-perinatalite` (confirmé — circuit §7bis tri-agents applicable) |
| Profession(s) concernée(s) | Sages-femmes, gynécologues-obstétriciens ; médecins généralistes et endocrinologues/diabétologues en second plan (repérage/orientation/coordination, pas mise en œuvre directe du suivi spécialisé) |
| **Niveau d'impact** | **Informatif**, à trancher en réconciliation — voir argumentaire ci-dessous |
| Pertinence pratique | Faible à modérée (population rare en soins premiers ~0,5 % des grossesses, mais gravité potentielle élevée si présente) |
| Temps de lecture estimé | 4-5 min pour une entrée courte |
| Impacte un algorithme ? | À vérifier avec le référent module Décision — si un nœud DT2/grossesse existe dans `/content`, cet item est candidat `concerne_decision`, mais avec un niveau de preuve modeste qui devrait limiter la portée du diff proposé |

**Argumentaire du niveau d'impact proposé** : selon le seuil C1/C2/C3 cumulatif de
`SOP_veille.md` §6bis, le C1 (geste nommable, patientes concernées identifiables) est recevable
pour un gynécologue-obstétricien/diabétologue mais **plus discutable pour le lecteur MG type de la
veille** (diabète préexistant + grossesse est rare en MSP). Le **C1 est en outre atténué par la
clause de non-nouveauté** : pour la rétinopathie, l'item ne déplace rien (reprise d'un avis 2016
déjà appliqué) ; pour la néphropathie et la TA, le CFE formalise pour la première fois au niveau
CNGOF-SFD une pratique déjà largement admise (bilan rénal en début de grossesse diabétique, seuil
tensionnel <140/90 conforme aux pratiques obstétricales générales en France) plutôt qu'il ne change
un geste. Le C2 (ampleur absolue, pertinence patiente) est solide pour la TA (NNT≈15 en population
générale de l'essai support) mais faible/non quantifiable pour la RD et la néphropathie
(associations de risque, pas d'effet de l'intervention chiffré). **Proposition : `informatif`**,
sauf si l'Agent B ou la réconciliation identifient un changement de pratique concret que ce texte
introduirait par rapport à l'existant (SFO-SFD 2016, pratique obstétricale courante) — point à
trancher collégialement, pas unilatéralement par l'Agent A.

### 10. Message pour la pratique (proposition, 2-3 lignes)

Le consensus CNGOF-SFD 2026 reprend/formalise trois seuils déjà globalement appliqués en pratique
spécialisée pour le diabète préexistant à la grossesse : surveillance ophtalmologique trimestrielle
(mensuelle si facteurs de progression) pour la rétinopathie — reprise d'un avis SFO-SFD 2016 ;
bilan rénal en préconceptionnel/1er trimestre puis suivi mensuel si néphropathie diagnostiquée ;
objectif tensionnel < 140/90 mmHg. Les trois sont des **avis d'experts** (Delphi, médiane 9,
accord 89,5 %), **pas des recommandations gradées GRADE** — la TA s'appuie sur l'essai randomisé
CHAP (2022) mais via un sous-groupe non dédié au diabète ; la RD et la néphropathie s'appuient sur
des cohortes anciennes et de faible niveau de preuve. Rien de nouveau qui déplacerait une décision
de premier recours ; pertinence pour le MG = repérage préconceptionnel et orientation.

---

## Ce que cette vérification ne garantit pas (angle mort Agent A)

- Je ne suis pas sage-femme ni gynécologue-obstétricien : je ne peux pas juger si le contenu de
  ces trois propositions est **présenté de façon acceptable pour un public professionnel de ces
  métiers** sans en trahir les nuances cliniques fines (ex. quels « facteurs de progression »
  précis mensualisent le suivi ophtalmo — le texte source liste HTA, néphropathie, longue durée de
  diabète, grossesse non programmée, baisse rapide d'HbA1c au T1, référence [142] p.148 — mais je
  n'ai pas la compétence de fond pour juger si cette liste est complète ou standard dans la
  pratique spécialisée actuelle).
- Je n'ai pas vérifié les 239 références de l'article une par une — seulement celles portant
  directement sur les trois éléments relayés (citées ci-dessus avec leur numéro et leur page).
- Cette vérification n'a pas cherché de littérature postérieure à la publication du CFE (rétractation, errata, essai plus récent) — à faire si l'item avance vers `analyse`.

---

*Rapport Agent A clos. Attente du rapport Agent B (contexte isolé) et de la réconciliation par
l'Agent C (§7bis).*

