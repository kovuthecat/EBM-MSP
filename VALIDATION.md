# VALIDATION.md — jugement humain en attente (N2 uniquement) — ebm-msp

> **Ce fichier ne contient que du N2** : jugement esthétique/UX/ton. Tout ce qu'un navigateur peut
> constater seul (rendu correct, élément présent/absent, comportement d'écran) est du **N1** —
> vérifié par Claude via `/verif-visuelle`, jamais consigné ici. Cf. `WORKFLOW.md` §6.
> Plafond : 120 lignes (appliqué par hook). Légende : `[ ]` à valider · `[x]` OK · `[!]` à corriger.
> Un bloc par écran/module courant, état actuel uniquement — un écran réécrit **remplace** ses
> anciens critères.

## Purge du 2026-07-29 (migration workflow N0/N1/N2)

Les recettes P4/P5/P6 (2026-07-22 → 2026-07-29) consignées ici étaient en réalité du **N1**
(rendu d'écran, comportement, contre-indications affichées) — pas du jugement humain N2. Purgées :
détail entier dans `git log -- VALIDATION.md` et `docs/decision/validation/`. Les 3 items restés
ouverts (T-032/033/034, vérification sur le déployé) sont du N1 également → déplacés dans
`TASKS.md` comme tâche de vérification navigateur, pas comme checklist humaine.

**Aucun item N2 en attente antérieur au 2026-07-30.**

## Plan P8 (2026-07-30) — jugement humain reversé par S1-S8, recette `docs/decision/validation/recette-P8-2026-07-30.md`

- [ ] **T-055** — la confirmation « Nouveau patient » en deux temps sur le bouton (au lieu d'une boîte
      native) est-elle assez visible sans être gênante ?
- [ ] **T-056** — le compteur « Session : N valeur(s) » dans le header est-il rassurant ou anxiogène ?
- [ ] **T-057** — un clic de plus (« Reprendre » / « Repartir de zéro ») par nœud ré-ouvert dans la même
      consultation est-il acceptable en pratique ?
- [ ] **T-058** — un champ estompé **et muet** (sans mention « sans effet ») se lit-il comme
      « probablement pas utile » ou comme un bug d'affichage ?
- [ ] **T-063** — la carte « Remplacer le glinide » (et son exclusion sur DFG/IMC) dit-elle la bonne
      chose chez un patient sous répaglinide en insuffisance rénale sévère (DFG 28, niche rénale,
      scénario non rejoué en recette) ?
- [ ] **T-064/T-065** — les libellés « Baisse/Hausse continue de la glycémie nocturne » sont-ils
      symétriques et lisibles sur un AGP réel ? Deux sections repliables (nocturne / entre les repas) :
      plus lisible ou un clic de trop ?
- **T-067 non livrée** (voir recette P8, « Constat préalable ») : aucun jugement N2 à recueillir tant
  que la carte « Réduire la basale » n'existe pas — reste dans `TASKS.md`.

## Plan P9 (2026-07-30) — jugement humain reversé par S1-S9, recette `docs/decision/validation/recette-P9-2026-07-30.md`

- [ ] **T-068** — une contre-indication levée (bloc « Ne s'applique pas à ce patient », estompé + barré)
      est-elle assez visible pour rester vérifiable, mais assez discrète pour ne plus alerter à tort ?
- [ ] **T-075** — le protocole de titration de la metformine (mémo Ameli) reflète-t-il fidèlement la
      pratique courante, et sa présentation économise-t-elle vraiment le temps que la recette réclamait ?
- [ ] **T-076** — l'aperçu dans le titre de dépli (ex. « atorvastatine 40-80 mg / rosuvastatine
      10-20 mg ») reste-t-il lisible sur mobile, sans écraser le compte de contre-indications ?
- **T-074 (S7)** : issue = investigation sans correctif (statu quo documenté) — pas un item N2, mais une
  question d'arbitrage clinique renvoyée au référent, cf. `TASKS.md`.

## Plan P10 (2026-08-01) — jugement humain reversé par S1-S11, recette `docs/decision/validation/recette-P10-2026-08-01.md`

- [ ] **T-080** (prescription) — la liste « ce que ce nœud ne prend pas en compte » (fonction hépatique,
      kaliémie, hémoglobine, poids sec/état volémique, refus global) est-elle juste et complète ? Et la
      redite de la hiérarchie de valeur des classes en tête de nœud est-elle utile ou superflue ?
- [ ] **T-081** (insuline) — cadrage étendu (TIR, heure des hypos, vit seule, métier, refus vs
      indisponibilité du capteur) juste et complet ?
- [ ] **T-082** (statine + cible-glycémique) — cadrage statine (LDL, molécule/dose actuelle, autres
      hypolipémiants, historique) et cadrage cible-glycémique (répartition des rôles entre nœuds) justes ?
- [ ] **T-083** (RHD ×2) — cadrage alimentation (demande du patient sur le poids en tête, tour de
      taille/TA/SAOS) et cadrage activité physique (projet du patient, ECG, tabac, éval. médicale non
      définie) justes ? Registre du motif « séances déjà pratiquées, mais courtes » adapté ?
- [ ] **T-084** — molécules/doses iSGLT2 (dapagliflozine/empagliflozine/canagliflozine) et AR GLP-1
      (liraglutide/sémaglutide/dulaglutide) : celles que le référent prescrirait ?
- [ ] **T-085** — descente d'insuline laissée sans chiffre (« jugement clinique, surveillance
      rapprochée », aucune source FR trouvée) : convient tel quel, ou une source a-t-elle échappé ?
- [ ] **T-086** — l'aide sur « Risque hypoglycémique du schéma » permet-elle de répondre sans hésiter ?

## Plan P11 (2026-08-01) — S3, `PastilleInfo` (T-105)

- [ ] **T-105** — la zone cliquable de la pastille (bouton-icône, 32×32px CSS actuellement) est-elle une
      cible tactile confortable au doigt en consultation ? Composant sans consommateur dans cette
      session (créé seul) : jugement à rejouer une fois câblé dans `CriteriaForm` (S4) ou `OptionCard`
      (S6), en conditions réelles de mise en page plutôt que sur le composant isolé. **Câblé dans
      `OptionCard` depuis S6** (2026-08-02) : rejouable dès maintenant en conditions réelles.

## Plan P11 (2026-08-02) — S6, `OptionCard` carte compacte à pastilles (T-111)

- [ ] **T-111 (a)** — la posologie derrière un clic (pastille « Posologie ») est-elle acceptable en
      consultation réelle, ou manque-t-elle à chaque prescription ? C'est la question centrale de P11 :
      l'arbitrage référent (« carte en une ligne, tout au clic », amende D34) a été pris sur maquette, pas
      sur usage — ce jugement est ce qui le confirme ou le remet en cause.
- [ ] **T-111 (b)** — la pastille de posologie en ton « attention » (ambre) se comprend-elle, sans ouvrir
      le panneau, comme « une dose manque, à renseigner » ? C'est ce qui doit préserver l'esprit du
      défaut J (2026-07-27, « la carte dit ce qu'elle attend ») maintenant que la ligne correspondante a
      quitté le socle visible.

## Plan P11 (2026-08-02) — S4, tons sémantiques des champs de saisie (T-107)

- [ ] **T-107 (a)** — la couleur sur un champ de SAISIE se lit-elle comme une information, ou comme un
      jugement de l'outil sur le patient ?
- [ ] **T-107 (b)** — faut-il finalement colorer « Refuse » (préférence vis-à-vis de l'injectable),
      laissé neutre par cette session ?

## Plan P11 (2026-08-02) — S7, colonne recommandations et écran (T-112, T-113)

- [ ] **T-112** — la légende des couleurs d'action (puce + mot par verbe, en tête de colonne des
      recommandations) est-elle utile en consultation, ou redevient-elle du bruit une fois le code
      couleur appris ? N'apparaît que sur les nœuds qui emploient ce vocabulaire (`prescription`,
      `insuline`) — jamais sur `cible-glycemique`/`statine`/`rhd-*`, où elle ne rend rien du tout.

## Plan P11 (2026-08-02) — S10, arbitrages référent (T-118)

- [ ] **T-118** — remplace l'item N2 de T-114 (largeur 900px), tranché par l'arbitrage référent du
      2026-08-02. Le plafond retenu, **1600px**, est-il le bon — la mise en page paraît-elle vide au
      centre sur très grand écran, ou au contraire encore contrainte ? Et le rapport 1fr/1fr entre les
      deux colonnes tient-il une fois étiré ?
