# Tri de la boîte mail de collecte — règles et labels Gmail

**Statut :** preuve de faisabilité (2026-08-09), pas encore un cycle hebdomadaire réel au sens de la
SOP (§3 `SOP_veille.md`). Ce document ne remplace ni `SOP_veille.md` ni `SOURCES.md` : il décrit
comment leurs règles s'appliquent concrètement au tri de `ebmmsp@gmail.com` (étape 1 « collecte » /
étape 2 « présélection » de `SOP_veille.md` §5), avant même l'écriture d'un `moisson.md`/`screening.md`
de semaine.

> **Skill `tri-boite-mail`** (`.claude/skills/`) encode cette procédure — à exécuter **en sous-agent**
> pour ne pas exposer le contenu brut des digests à la session principale. L'invoquer directement.

## Principe

Chaque mail entrant est un **candidat brut**, jamais un contenu publié. Le tri applique, dans l'ordre :

1. **Le thème est-il dans le périmètre de production ?** (`SOP_veille.md` §3bis — 11 thèmes en
   production : les 9 thèmes MG, plus `orthophonie` (D60) et `sante-femme-perinatalite` (D61) depuis le
   2026-08-09, ces deux derniers avec la restriction §7bis — analyse jamais tranchée par le seul
   référent, publication marquée `relecture_referent: false`. `ETP` et `soins-infirmiers` restent au
   modèle de données seulement, sans production).
2. **La source est-elle balayée en routine ?** (`SOP_veille.md` §4, « Règle de balayage » — Tier 1-2
   balayés chaque semaine ; Tier 3 (sommaires NEJM/JAMA/Lancet/BMJ/Annals) et Tier 4 seulement pour
   vérifier un signal déjà repéré ailleurs, jamais en balayage systématique ; Retraction Watch = hors
   Tier, contrôle ponctuel seulement, jamais en parcours hebdomadaire).
3. **Le seuil « brève vs analyse » (`SOP_veille.md` §6bis, D38)** — pour ce qui reste après 1-2 : les
   trois conditions cumulatives C1 (déplace une décision fréquente) / C2 (effet absolu sur critère
   patient important) / C3 (population transposable MSP). Une seule réponse « non » → brève.

## Labels Gmail

| Label | Signifie | Correspond à |
|---|---|---|
| `veille/breve` | Candidat retenu, route **brève** — signale/situe/lie, aucune appréciation critique | `SOP_veille.md` §5bis |
| `veille/analyse` | Candidat retenu, route **analyse** — franchit C1+C2+C3, grille complète à faire | `SOP_veille.md` §5bis, §6bis |
| `veille/non-pertinent` | Hors balayage routine ou hors critères d'inclusion §6 : Tier 3/4, hors-Tier (Retraction Watch), bulletins régionaux hors Île-de-France, alertes sécurité/compte, animal/préclinique, doublons | `SOP_veille.md` §6, §9 |
| `veille/piste-a-verifier-source-primaire` | Un e-mail d'une source de **repérage seul** (Tier 3, presse « -pratique.com ») mentionne un sujet qui *semble* franchir C1/C2/C3 — **la classification brève/analyse ne peut pas se faire sur l'article de presse lui-même** ; il faut retrouver et lire la publication originale, puis classer *cette source-là* | `SOP_veille.md` §9 (garde-fou repérage ≠ analyse) |
| `veille/hors-perimetre-orthophonie` | Historique (avant D60) : source orthophonie légitime mais thème hors périmètre de production. Depuis le 2026-08-09, l'orthophonie est en périmètre (D60) — ce label ne devrait plus être appliqué à de nouveaux e-mails, conservé pour traçabilité | `BRIEF_VEILLE.md` §3bis, D40, D60 |

Un mail traité **quitte l'INBOX** (retire le label système `INBOX`) et garde son statut lu/non lu
inchangé. Le label `veille/traite-2026-W33` (première passe, 2026-08-01/05) reste tel quel pour
mémoire ; il ne distinguait pas encore brève/analyse — c'est cette distinction que ce document introduit
pour la suite.

## Règle : une source de repérage ne détermine jamais la route elle-même

**Une source Tier 3 ou presse « -pratique.com » ne peut jamais, à elle seule, justifier un classement
`breve` ou `analyse`** — dans les deux sens, pas seulement vers `analyse`. Elle sert de **repérage** :
- pour une **brève** aussi bien que pour une **analyse** — une brève n'a pas besoin d'appréciation
  critique (§5bis), mais elle a quand même besoin d'une référence correcte, et le garde-fou §9 interdit
  de citer la presse « -pratique.com » même comme référence bibliographique. Le sujet peut très bien ne
  mériter au final qu'une brève ; ce n'est pas le résumé de presse qui le décide, c'est la publication
  retrouvée.
- le critère qui déclenche l'escalade n'est donc pas « est-ce potentiellement une analyse ? » mais
  « **le thème est-il dans le périmètre de production (§3bis) et le sujet a-t-il une pertinence
  décisionnelle plausible ?** » Si oui → `piste-a-verifier-source-primaire`, indépendamment de la route
  finale. Si le thème est hors périmètre (rhumatologie hospitalière, pédiatrie spécialisée, soins
  infirmiers, ETP...) ou le sujet clairement non actionnable (congrès, revue narrative, épidémiologie
  descriptive sans levier décisionnel) → `non-pertinent` directement, sans détour par la case repérage.
  Sur `orthophonie`/`sante-femme-perinatalite`, un item qui franchirait le seuil part en `analyse` **via
  le circuit tri-agents** (`SOP_veille.md` §7bis, D61), jamais tranché par le seul référent.

Procédure une fois qu'un item d'une source de repérage est retenu comme candidat plausible :

1. Ne **pas** appliquer `breve` ou `analyse` sur la base de l'article de presse/du sommaire lui-même —
   même si son résumé donne déjà un effet chiffré (le résumé peut survendre, changer le critère, ou
   omettre un biais que seule la publication primaire révèle).
2. Taguer l'e-mail `veille/piste-a-verifier-source-primaire` et noter le sujet + la référence
   apparente (revue, auteurs, si mentionnés) pour retrouver la publication.
3. Retrouver la **publication scientifique originale** (DOI/PMID) — jamais via un résumé secondaire
   supplémentaire.
4. Appliquer le seuil C1/C2/C3 et la grille (`GRILLE_APPRECIATION.md` si route analyse) **sur la
   publication primaire**, pas sur l'article qui l'a signalée.
5. Le classement `breve`/`analyse` final porte sur *la publication retrouvée*, indépendamment de la
   provenance qui l'a fait repérer.

Ce n'est pas une nuance : c'est directement le garde-fou §9 de `SOP_veille.md` (« toute source de
repérage, jamais une source d'analyse ») appliqué à la boîte mail elle-même, pas seulement à la
rédaction d'une entrée de veille.

**Cas concrets déjà rencontrés (2026-08-05)**, tous tagués `veille/piste-a-verifier-source-primaire` —
thème en périmètre + sujet à pertinence décisionnelle plausible, mais résumé de presse insuffisant pour
trancher brève/analyse :
- *Pédiatrie Pratique* — « IPP chez l'enfant : gare au risque infectieux grave » (registre EPI-MERES,
  >1 million d'enfants, *JAMA Pediatrics*). Prescription d'IPP chez le nourrisson = décision fréquente.
- *Diabétologie Pratique* — « La gestion du diabète de type 2 chez les personnes âgées à la lumière de
  l'actualisation de la prise de position de la SFD ». Recommandation de société savante (Tier 2)
  relayée par la presse : à retrouver directement sur sfdiabete.org, pas via ce résumé.
- *Cardiologie Pratique/Actualités* — « Mesure de la PA en consultation, trois fois valent mieux
  qu'une » (cohorte CARTaGENE, n = 17 966) et « Rosuvastatine contre atorvastatine en cas de
  coronaropathie » (analyse secondaire d'ECR, n = 4 400) : deux décisions de pratique courante
  (technique de mesure tensionnelle, choix de statine).
- *Cardiologie Pratique* — « Le sémaglutide 2,4 mg réduit les hospitalisations en cas d'obésité ou de
  maladie cardiovasculaire » (analyse exploratoire de l'essai SELECT, *JAMA Cardiol* 2026;11:156-64).

À l'inverse, la majorité des items de ces mêmes flux (comptes rendus de congrès EULAR/SFD/ACC, revues
narratives, séries hospitalières monocentriques, épidémiologie descriptive sans levier décisionnel, ou
simplement hors des thèmes en production — rhumatologie, pédiatrie spécialisée) restent classés
`non-pertinent` directement, sans passer par la case repérage. Les items Gynécologie
Obstétrique/Sage-Femme Pratique lus le 2026-08-09 (cancer de l'ovaire, HPV, dépistage prééclampsie
USPSTF...) l'ont été **avant** l'ouverture de `sante-femme-perinatalite` (D61) et n'ont pas été
retranchés rétroactivement — à reprendre à la prochaine passe sur cette boîte.

## Recherche de la source primaire

Étape 3 de la procédure ci-dessus (« retrouver la publication scientifique originale »), détaillée —
c'était la partie non écrite avant le 2026-08-09, faite jusqu'ici de façon ad hoc :

1. **Partir des éléments cités par la source de repérage** : nom de revue, année, auteurs, DOI/PMID si
   donné. Une presse « -pratique.com » cite souvent l'essai/la cohorte par son nom (« essai SELECT »,
   « cohorte CARTaGENE ») sans DOI direct.
2. **Chercher par le nom + la revue**, pas par le titre reformulé de l'article de presse (le titre de
   presse n'est presque jamais le titre de la publication). Recherche web ciblée revue+auteurs+année, ou
   directement sur le site de la revue si nommée.
3. **Confirmer que c'est bien la bonne publication** avant toute lecture : revue, année, effectif,
   design concordent avec ce que rapporte la source de repérage. Une réplique/lettre/commentaire n'est
   **pas** l'étude princeps.
4. **Si la publication n'est pas identifiable avec une confiance raisonnable** : ne pas deviner, ne pas
   construire une appréciation critique sur un résumé de résumé. L'item reste `piste-a-verifier-source-
   primaire` non résolue, ou redescend en `non-pertinent` avec le motif « étude princeps non
   identifiable » (`SOP_veille.md` §9, même motif que pour une source secondaire sans étude primaire
   retrouvable).
5. **Accès au texte** : abstract/open access suffisent souvent pour trancher C1/C2/C3 et remplir les
   rubriques factuelles (effectif, design, effet chiffré) de `GRILLE_APPRECIATION.md` ; paywall total →
   compléter manuellement si accès légitime, sinon rester au niveau que l'abstract permet (§8, pas de
   contournement de paywall).
6. Sur `orthophonie`/`sante-femme-perinatalite`, cette recherche est le point de départ des **Agents A
   et B** du circuit tri-agents (`SOP_veille.md` §7bis) — pas seulement du référent.

## Cas tranchés à l'usage (2026-08-09)

- **EvidenceAlerts** (Tier 1) : balayé, mais chaque alerte quotidienne de cette boîte n'a porté jusqu'ici
  qu'un seul article ; aucun n'a franchi C1+C2+C3 sur l'échantillon traité (population trop spécifique
  ou pas de décision MG fréquente identifiable) → `breve` par défaut, `analyse` seulement si un article
  franchit clairement le seuil.
- **Presse « -pratique.com »** (Cardiologie/Rhumatologie/Pédiatrie/Gynéco-Obstétrique/Sage-Femme/
  Diabétologie Pratique) : conflit d'intérêt nommé au §9 de la SOP (rédacteur nommé, comptes rendus de
  congrès, symposia sponsorisés) → **repérage seul, jamais analyse**, donc `non-pertinent` en routine
  même quand un titre semble pertinent (ex. un item Pédiatrie Pratique sur le repérage des troubles du
  langage n'a pas été retenu tel quel : à re-chercher, le cas échéant, via une source primaire).
- **Bulletins régionaux Santé publique France** hors Île-de-France (Centre-Val de Loire, Hauts-de-France,
  La Réunion, Nouvelle-Aquitaine, Occitanie, Guadeloupe, Bouches-du-Rhône…) → `non-pertinent` (patientèle
  MSP = Paris 20ᵉ) ; les éditions **Île-de-France** et les bulletins **nationaux** (Oscour/SOS Médecins,
  bulletin thématique sans ancrage régional) restent en `breve`.
- **NEJM (tous formats : Weekend Briefing, TOC hebdo, NEJM AI, NEJM Evidence, NEJM Clinician), JAMA (tous
  déclinaisons), Developmental Medicine & Child Neurology** : Tier 3 ou hors liste `SOURCES.md` →
  `non-pertinent` en balayage routine. *Écart assumé avec la toute première passe Gmail
  (`veille/traite-2026-W33`), qui avait gardé quelques NEJM Evidence/Clinician avant que `SOURCES.md` ne
  tranche explicitement leur exclusion (§ « Non retenues », paywall + redondance) — ce document prime
  pour la suite.*
- **Retraction Watch** : jamais en balayage hebdomadaire (SOP §9/§4) → `non-pertinent` systématique en
  entrée d'INBOX ; reste consultable ponctuellement au moment d'intégrer un item spécifique.

## Limite connue

Ce tri de boîte mail reste **au niveau de l'e-mail**, pas de l'article individuel : un digest
multi-articles (ex. « JAMA Network Open New Online ») est classé dans son ensemble. Certains articles
isolés d'un digest par ailleurs classé `non-pertinent` pourraient mériter un second regard — c'est
justement le rôle du balayage Tier 1-2 hebdomadaire (qui, lui, retrouvera l'info via une source
pré-appréciée si elle est importante) plutôt que du dépouillement systématique de ces digests.

**Suivi au niveau article** : quand un digest retagué `piste-a-verifier-source-primaire` contient
plusieurs articles à potentiel, leur suivi individuel (source à récupérer, brève à rédiger, candidat
analyse) se fait dans `docs/veille/JOURNAL_BOITE_MAIL.md` — pas dans ce document, qui reste au niveau
du tri d'e-mail.
