# A02 — Réconciliation §7 (bi-agents) — Desbiens et al., *Hypertension* 2023 (CARTaGENE)

**Item** : cohorte CARTaGENE, mesures successives de PA en consultation, relayée sous le titre presse
« Mesure de la PA en consultation, trois fois valent mieux qu'une ».
**Circuit** : §7 bi-agents — `cardiovasculaire-prevention` est un des 10 thèmes de médecine générale
(confirmé `SOP_veille.md` §3bis et `CLAUDE.md`) ⇒ réconciliation par le référent (moi-même), pas de
3ᵉ agent. `meta.relecture_referent: true`.
**Sources réconciliées** : `epreuve/entrees/A02-agent-A.md` (analyste), `epreuve/entrees/A02-agent-B.md`
(contradicteur). Aucune requête OpenEvidence utilisée, conformément à la consigne de ce travail.

---

## 1. Vérification complémentaire faite en réconciliation

Avant de statuer sur la `route`, épuisement de l'accès (skill `recherche-source-primaire`, §7 :
« avant de reporter pour inaccessibilité ») :

- `ahajournals.org` : 403 confirmé par A et B, indépendamment, à deux reprises.
- Europe PMC REST (`EXT_ID:37615094`) interrogé une **troisième fois** en réconciliation :
  `isOpenAccess: N`, `inPMC: N`, `inEPMC: N`, aucun `pmcid`. Confirme A et B à l'identique.
- CIHR (financeur, Canada) n'impose pas de mandat de dépôt PMC comparable au NIH : rien n'indique
  qu'un accès s'ouvrira par embargo dans un délai prévisible, à la différence du cas SELECT
  (`JOURNAL_BOITE_MAIL.md` §2bis) où un document de registre attendu justifiait un report.
- **Signal de fiabilité à consigner** : une recherche web généraliste (WebSearch) affirmée en cours de
  réconciliation a prétendu que l'article était « disponible en texte intégral gratuit sur PubMed
  Central » — affirmation **fausse**, contredite par la vérification directe de l'API Europe PMC
  (ci-dessus) et par les deux agents. Un résumé générique d'outil de recherche n'est jamais une preuve
  d'accès ; seule l'interrogation directe de la source (PubMed/Europe PMC/éditeur) fait foi. À garder
  en mémoire de méthode pour la veille.

**Conclusion sur l'accès** : épuisé, à trois vérifications indépendantes concordantes. L'absence de
texte intégral n'est pas un report « par réflexe » — aucune voie d'accès alternative n'existe ni ne
semble devoir apparaître à court terme.

---

## 2. Divergences tranchées sur pièces

| # | Point | Agent A | Agent B | Tranché | Motif |
|---|---|---|---|---|---|
| 1 | **Route** | Ne propose pas explicitement de route ; traite la grille comme complète et rend un classement fini (`informatif`/`faible`). | Propose `reporte` : la règle d'or de `GRILLE_APPRECIATION.md` (« chaque chiffre relié à sa source ») ne serait pas remplie en rubriques 3/5/7. | **`analyse`, publiée en l'état** | Voir §3. Accès épuisé (aucune attente ne le résoudra) ; **tous les chiffres réellement cités par A et B sont vérifiés mot pour mot contre l'abstract primaire** (HR, IC, n, événements, suivi, bornes de PA) — la règle d'or porte sur les chiffres *utilisés*, pas sur ceux qui manquent et qui sont correctement déclarés absents, pas inventés. Les éléments non vérifiables (valeur du C-statistique, NRI/IDI, covariables d'ajustement) ne peuvent, s'ils étaient connus, que confirmer ou abaisser encore le niveau retenu — jamais le faire remonter à `pratique`. Le verdict `informatif` est donc robuste à l'incertitude résiduelle, ce qui rend un report inutile (skill §7 : « un item reporté par réflexe… est un report inutile »). |
| 2 | **Message réel de l'étude** | Signale le protocole standard (3 mesures) déjà recommandé, sans isoler explicitement que le meilleur prédicteur est **SBP3 seule** (et non la moyenne). | Extrait et cite littéralement : les modèles incluant SBP1 (dont la moyenne des 3) sont sous-performants ; le résultat dit « écarter la 1ʳᵉ mesure », pas « en faire trois et moyenner ». | **Retenu (B)** | Vérifiable sur la même phrase d'abstract que A avait sous les yeux ; A ne le contredit pas, il ne l'a simplement pas extrait. C'est la correction la plus importante à opposer au titre de presse — cf. §4. |
| 3 | **Construction du « 2× »** | Hypothèse : ratio des excès de HR bruts (0,10/0,06 ≈ 1,67, arrondi à « 2× »). | Hypothèse alternative : re-expression par unité de PA (« at a given SBP value »), nécessitant les écarts-types de SBP1/SBP3 (non publiés), reconstruction ≈ 1,9× avec des SD plausibles. | **Aucune des deux reconstructions n'est vérifiée** — les deux sont déclarées comme des inférences, pas des faits, dans l'entrée. Le chiffre « 2× » n'est de toute façon jamais repris seul (§4). | Ni A ni B ne peut trancher sans les écarts-types, absents de l'abstract — désaccord non matériel pour la classification, seulement pour la note méthodologique interne. |
| 4 | **Synthèse du risque de biais** | « Modéré par défaut ». | « Modéré à élevé » — ajoute multiplicité (≥12 modèles, pas de correction mentionnée), causalité inverse plausible (le delta SBP1→SBP3 pourrait être lui-même un marqueur), biais du volontaire sain, population quasi normotendue (122,5-126,5 mmHg), exclusion des >70 ans. | **Retenu (B), « modéré à élevé »** | Objections vérifiables sur le même abstract, non contredites par A (simple différence d'exhaustivité). Cohérent avec le niveau de preuve final `faible` retenu par les deux agents. |
| 5 | **Professions concernées** | MG, infirmier·ère/IPA. | MG, IPA, IDEL. | **Retenu (B), IDEL inclus** | La mesure de PA en suivi de pathologie chronique relève aussi de la pratique infirmière à domicile (profil déjà dans la taxonomie `BRIEF_VEILLE.md` §4) ; aucune raison de l'exclure. |
| 6 | **niveau_preuve / niveau_impact / concerne_decision** | Faible / informatif / non | Faible / informatif / non | **Accord total, pas de divergence** | Les deux analyses convergent indépendamment — signal de robustesse du verdict malgré l'accès limité. |

Aucune de ces divergences n'est restée « non tranchable sur pièces » au sens du skill — chacune est
résolue par retour au texte de l'abstract déjà cité par les deux agents, sans arbitrage d'intuition.

---

## 3. Pourquoi `analyse` et non `reporte` — raisonnement explicite

Le skill impose : *« Une divergence non tranchable sur pièces impose `reporte`. »* Ici, la divergence
port sur l'appréciation *procédurale* de l'incomplétude, pas sur un fait invérifiable qui changerait le
verdict. Trois raisons cumulatives justifient de ne pas reporter :

1. **L'accès est épuisé, pas simplement difficile** (§1) — un report n'achète aucune information
   nouvelle probable, à la différence du cas SELECT où un document de registre était identifiable et
   attendu.
2. **Chaque chiffre effectivement cité dans l'entrée est vérifié mot pour mot contre l'abstract primaire**
   (HR, IC95 %, effectifs, événements, durée de suivi, bornes de PA) — la règle d'or n'est pas
   violée : elle porte sur la traçabilité de ce qui est affirmé, pas sur l'exhaustivité de ce qui est
   disponible.
3. **Les éléments non vérifiables (C-statistique chiffré, NRI/IDI, liste des covariables d'ajustement)
   ne peuvent, s'ils étaient un jour connus, que confirmer ou abaisser davantage le verdict `informatif`
   / `faible` — jamais le faire remonter à `pratique` ou `modéré`.** Le verdict retenu est donc robuste
   à l'incertitude résiduelle, ce qui est précisément le cas où publier une entrée honnête et bornée est
   préférable à un report qui ne se résoudra jamais (§6bis : deux reports maximum, puis décision forcée
   de toute façon).

Rétrograder en `brève` a aussi été écarté : le travail critique déjà produit (correction du sens réel
du résultat — écarter la 1ʳᵉ mesure, pas moyenner trois mesures —, mise en contexte ESC/ESH/HAS,
requalification du « 2× ») constitue une appréciation critique complète, précisément ce qu'une brève ne
porte pas. Le jeter reviendrait à priver le lecteur de la correction la plus utile de cet item.

---

## 4. Classement complet retenu

| Champ | Valeur |
|---|---|
| `route` | **`analyse`** |
| `niveau_impact` | **`informatif`** |
| `niveau_preuve` | **`faible`** (GRADE simplifié) |
| `themes[]` | `cardiovasculaire-prevention` |
| `professions_concernees[]` | `MG`, `IPA`, `IDEL` |
| `concerne_decision` / `impact_algorithme` | **non** — aucun nœud de décision déplacé |
| `meta.relecture_referent` | **`true`** (thème MG, §7 standard) |
| Pertinence pratique | faible à modérée — renfort d'argumentaire sur une pratique déjà recommandée, aucun chiffre actionnable nouveau (pas de reclassification, pas de C-statistique chiffré) |
| Type de critère | Statistique (association + discrimination d'un modèle prédictif), pas un effet d'intervention ; le critère clinique sous-jacent (MACE) est dur, mais ce n'est pas ce que l'étude teste comme effet |

---

## 5. Conditions de rédaction — opposables

### L'entrée DOIT dire

1. Design exact : analyse secondaire d'une cohorte observationnelle populationnelle (CARTaGENE,
   Québec, 40-70 ans, n = 17 966, 2 378 MACE sur 10 ans) — **pas un essai**, pas un test d'une
   intervention.
2. Les deux HR exacts, avec leurs IC95 % et leur unité : SBP3 1,10 [1,05-1,15] et SBP1 1,06
   [1,01-1,10] **par écart-type** — jamais présentés comme des risques absolus.
3. **Le sens réel du résultat** : la mesure la plus prédictive est **SBP3 seule**, et les modèles
   incluant la 1ʳᵉ mesure (y compris la moyenne des trois) sont moins performants — donc le résultat
   va dans le sens « écarter la première mesure », pas « en faire trois et moyenner ». C'est la
   correction centrale à apporter au titre de presse.
4. Que ce protocole (mesures répétées, ne pas se fier à la seule 1ʳᵉ mesure) est, pour l'essentiel,
   **déjà recommandé** par l'ESC 2024/ESH et par la HAS — l'étude apporte un appui sur critère dur
   (MACE) à une pratique déjà en vigueur, elle ne la change pas.
5. Le rappel du contexte français : la HAS exige une **confirmation hors cabinet** (automesure/MAPA)
   avant instauration d'un traitement — ce qui relativise encore la portée pratique d'optimiser la
   seule stratégie de mesure au cabinet.
6. La limite d'accès, explicitement et sans l'euphémiser : analyse fondée sur l'**abstract structuré
   uniquement** (PubMed/Europe PMC) — accès à `ahajournals.org` bloqué (403), aucun dépôt PMC/Europe
   PMC, vérifié à trois reprises indépendantes. Texte intégral, tableaux, méthode complète du
   C-statistique et discussion des auteurs non consultés.
7. Le niveau de preuve (`faible`) et le verdict (`informatif`), avec leur justification résumée :
   observationnel, critère de performance de modèle (et non un bénéfice patient direct), effet modeste,
   éléments quantitatifs clés absents de la source accessible.

### L'entrée NE DOIT JAMAIS reprendre

1. Le chiffre **« 2× » seul ou sans la mention explicite qu'il s'agit d'un excès de risque relatif
   (HR−1)**, jamais un doublement du risque absolu ni du HR lui-même — et jamais présenté comme
   auditable (sa construction exacte dépend d'écarts-types non publiés).
2. Le titre de presse **« trois fois valent mieux qu'une »** tel quel, ni aucune formulation suggérant
   qu'il faudrait moyenner trois mesures — c'est l'inverse du résultat de l'étude (§5.3 ci-dessus).
3. Toute **valeur chiffrée** de C-statistique, NRI, IDI, ou tout nombre de patients reclassés — ces
   données n'existent pas dans les éléments consultés ; ne jamais les estimer ni les approximer.
4. Le langage causal/prescriptif de la conclusion des auteurs (« reinforce the necessity ») sans le
   requalifier explicitement comme un langage normatif appliqué à un résultat associatif/observationnel.
5. Toute affirmation sur les **covariables d'ajustement** du modèle de Cox (liste non disponible) —
   ne pas présumer un ajustement standard ni écarter l'objection de circularité avec le score ASCVD.
6. Le résultat discordant sur la **PA diastolique** (« similaire quelle que soit la mesure ») ne doit
   pas être passé sous silence — il doit être mentionné comme un signal de fragilité potentiel du
   résultat systolique, pas comme un détail secondaire.

---

## 6. Ce que cette procédure ne garantit pas

- **Angle mort d'accès, pas de compétence** : à la différence du §7bis (orthophonie, santé-femme), ce
  thème est bien dans le champ de compétence du référent MG (§3bis). La limite ici est
  d'**accès**, pas de compétence clinique — mais elle reste réelle : aucun des deux agents ni le
  référent n'a lu le texte intégral, les tableaux, ni la discussion des auteurs. Si un accès légal
  s'ouvre un jour (confrère avec accès institutionnel, dépôt tardif), l'entrée devra être revue et,
  au besoin, corrigée (`DECISIONS.md` D5, §10 SOP — erratum daté).
- **Un « 2× » non auditable reste non auditable** : ni A ni B ni le référent ne peuvent reconstruire sa
  formule exacte sans les écarts-types de SBP1/SBP3. Les deux hypothèses proposées (ratio brut des
  excès de HR ≈ 1,67 ; re-expression par mmHg ≈ 1,9 avec des SD supposés) restent des inférences, pas
  des vérifications — elles ne doivent jamais être présentées à l'utilisateur final comme des faits.
- **Pas de double lecture indépendante par un tiers** : c'est le même référent qui a orchestré Agent A,
  Agent B et cette réconciliation, puis relira l'entrée à J+3 (SOP §5 étape 5). Le circuit réduit
  l'erreur d'extraction et le spin non détecté, il ne corrige pas un biais de raisonnement que le
  référent et ses deux agents partageraient.
- **La fiabilité des outils de recherche généralistes n'est pas acquise** : un résumé de recherche web
  a affirmé, à tort, un accès en texte intégral gratuit pendant cette réconciliation, contredit par
  vérification directe de la source. Ce type d'outil ne doit servir qu'au repérage, jamais de preuve
  d'accès ou de contenu — leçon à garder pour les prochaines réconciliations.
- **Aucun garant que l'accès ne s'ouvrira jamais** : l'absence de mandat de dépôt PMC pour un
  financement CIHR rend un déblocage à court terme peu probable, mais ce n'est pas une certitude — ce
  jugement de probabilité, pas de fait vérifié, est ce qui justifie de publier maintenant plutôt que
  de reporter indéfiniment.
