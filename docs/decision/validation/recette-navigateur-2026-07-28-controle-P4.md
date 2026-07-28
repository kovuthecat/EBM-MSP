# Recette navigateur — passe de contrôle du plan P4 (T-030)

> **Nom de fichier** : la date système du jour de cette passe est aussi 2026-07-28, date déjà prise par
> le rapport de la passe précédente (`recette-navigateur-2026-07-28.md`, celle qui a trouvé les 21
> défauts corrigés par P4). Pour ne pas écraser ce rapport de référence, celui-ci est suffixé
> `-controle-P4`. Les deux documents coexistent : l'un est l'audit d'origine, celui-ci est son contrôle.

**URL testée** : `https://ebm-msp.vercel.app`
**Date** : 2026-07-28 (session de contrôle exécutée après le commit `036f4aa`, poussé sur `main` et
déployé). Heure non horodatée automatiquement par l'environnement de test — passe continue, sans
interruption longue.
**Largeurs de fenêtre utilisées** : desktop (1280×800, taille native du navigateur intégré) et mobile
(375×812, via `resize_window`).
**Erreurs console** : aucune (`read_console_messages` avec filtre erreurs → « No console logs »).
**Ce que j'ai pu faire** : les trois sondes de version, le protocole P0→P7 dans son ordre, les six
contrôles ciblés des correctifs P4, le contrôle bonus de la dette `prescription`/naïf, les trois
vignettes V1/V2/V3 avec mesures d'axes A/B/C, un passage en largeur mobile.
**Ce que je n'ai pas pu faire** : cliquer un `window.confirm()` natif comme le ferait un humain (l'outil
navigateur de la session supprime automatiquement les dialogues natifs et répond « Annuler ») — j'ai dû
surcharger `window.confirm` par script pour observer la suite du clic réel (détail en D33 ci-dessous) ;
je n'ai pas rejoué systématiquement le test des 20 secondes sur les trois vignettes complètes (fait sur
V1 et sur le profil D32/statine ; pas refait spécifiquement sur V2/V3, faute de temps, cf. clôture).

---

## En-tête — les trois sondes de version

| # | Sonde | Attendu | Observé | Verdict |
|---|---|---|---|---|
| 1 | RHD → Alimentation, formulaire vierge, intitulés des champs | Libellés accentués et lisibles | « Boissons sucrées », « Matière grasse de cuisson », « Régularité des repas », « Grignotage » — zéro nom de variable brut, zéro terme sans accent | CONFORME |
| 2 | Traiter, HbA1c actuelle 9 / cible 7 | Segment « Nettement au-dessus de l'objectif » pré-sélectionné + « · calculé, à vérifier » | Segment sélectionné visuellement ET `aria-pressed="true"` confirmé par `javascript_tool` (les 3 autres boutons à `"false"`) | CONFORME |
| 3 (sonde P4, ajoutée pour cette passe) | RHD → Activité physique, formulaire **vierge**, ne rien saisir | Zéro carte, un bloc d'attente uniquement | « Aucune option n'est proposée pour l'instant : la décision est suspendue... » + bloc « EN ATTENTE — CRITÈRES À RENSEIGNER » listant 12 pistes, 9 critères décisifs non confirmés annoncés. **Aucune carte « Recommandée » nulle part sur l'écran.** | CONFORME |

**Conclusion des sondes** : le lot P4 (D30 inclus) est bien déployé. La passe continue dans son
intégralité, aucun arrêt nécessaire.

---

## Partie 1 — Défauts et non-régressions

### Tableau de synthèse

| # | Point | Verdict |
|---|---|---|
| P0-a | Libellés rédigés partout (D29), 6 nœuds | CONFORME |
| P0-b | Nature de l'intolérance non réclamée sans exister (Traiter) | CONFORME |
| P0-c | Dose metformine liée au cochage du traitement (D26) | CONFORME |
| P0-c bis | Carte « Optimiser l'agent mal toléré » sans traitement en cours coché | DOUTE |
| P0-d / D31 | Contrainte TBR/TBR sévère (Insulinothérapie) | CONFORME |
| P0-d bis | Traiter, intention Initier verrouille « Traitements en cours » | CONFORME (comportement voulu) |
| P0-f | `aria-pressed` sur boutons segmentés | CONFORME |
| D30 | RHD vierge → zéro carte, bloc d'attente | CONFORME |
| D32 | Statine indisponible — sortie muette corrigée | CONFORME |
| D-06 | Pré-remplissage calculé (au-dessus / sous l'objectif / override) | CONFORME |
| P1 | Mémoire de session Traiter ↔ Insulinothérapie | CONFORME |
| P2 | Pré-remplissage calculé, non-écrasement du choix manuel | CONFORME |
| P3 | Repli « Autres pistes possibles », sécurité jamais repliée | CONFORME |
| P4 | Statine, bandes de CK | CONFORME (évolution de comportement notée) |
| P6 | « Pourquoi pas d'autres options », partie dépliée | **DÉFAUT** (langage machine) |
| T-025 | Test des 20 secondes, contre-indication retenue | CONFORME (amélioration) |
| D33 | Nouveau patient — confirmation + purge | CONFORME (avec réserve méthodo) |
| — | Réflow de page après « Rien à signaler » → clic mal dirigé | **DÉFAUT** (familles 9+10) |
| — | Bouton segmenté 2 valeurs ne revient jamais à « non répondu » | **DÉFAUT** (famille 9) |
| — | Débordement horizontal mobile sur « Intention thérapeutique » | **DÉFAUT** (isolé, pas une famille) |
| Bonus | Dette `prescription`/naïf — volet positif (intolérance résolu) | CONFORME |
| Bonus | Dette `prescription`/naïf — volet connu (8 options bloquées) | CONFIRMÉ (dette assumée, pas un nouveau défaut) |

### Détail des points

---

**Point : P0-a — Libellés rédigés partout (D29)**

| champ | contenu |
|---|---|
| **Verdict** | CONFORME |
| **Reproduction** | Les 6 nœuds, formulaire vierge : Alimentation, Activité physique, Fixer la cible d'HbA1c, Traiter, Insulinothérapie, Statine |
| **Observé** | Aucune occurrence de texte sans accent ou en style identifiant sur les 6 nœuds. Exemples de libellés lus : « Boissons sucrées », « Matière grasse de cuisson », « Régularité des repas », « Suggestion auto (âge, fragilité, comorbidité grave, antécédent CV) — à valider », « Situation d'insulinothérapie », « Intolérance aux statines (non / rapportée / avérée) » |
| **Pourquoi ça compte** | Un praticien pressé qui lit un nom de variable brut perd confiance dans tout le reste de l'écran. |

---

**Point : P0-b — Nature de l'intolérance non réclamée sans exister**

| champ | contenu |
|---|---|
| **Verdict** | CONFORME |
| **Reproduction** | Traiter, intention **Optimiser**, traitements en cours **Metformine** seule, HbA1c actuelle **7,8**, position **Au-dessus de l'objectif** (manuel), DFG **45**, IMC **27**, section « Signaux d'alerte et tolérance » → **« Rien à signaler »**, « Dose metformine » laissée vide |
| **Observé** | Volet 1 : bloc « EN ATTENTE » ne mentionne plus que « Dose de metformine (mg/j) », **plus aucune trace de « Nature de l'intolérance »**. Volet 2 : coche « Intolérance à un traitement en cours » → le champ « Nature de l'intolérance » réapparaît réellement dans le formulaire (menu déroulant actif, pas un fantôme dans le texte) |
| **Pourquoi ça compte** | Le défaut d'origine (reproduit le 2026-07-27) réclamait un champ absent de l'écran — sortie de piste sans solution visible pour le praticien. |

---

**Point : P0-c — Dose de metformine liée au cochage du traitement (D26)**

| champ | contenu |
|---|---|
| **Verdict** | CONFORME |
| **Reproduction** | Traiter, intention Optimiser. Cocher Metformine → décocher Metformine |
| **Observé** | Coché : « Dose de metformine (mg/j) » apparaît. Décoché : le champ disparaît entièrement du formulaire, et le bloc de résultats ne le réclame plus dans son « à renseigner » |
| **Pourquoi ça compte** | Un champ qui reste demandé pour un traitement qu'on a retiré est une charge de saisie inutile et déroutante. |

---

**Point : P0-c bis — carte « Optimiser l'agent mal toléré » sans traitement coché (DOUTE, non demandé explicitement mais observé en chassant P0-c)**

| champ | contenu |
|---|---|
| **Verdict** | DOUTE |
| **Reproduction** | Traiter, intention Optimiser, Metformine décochée (aucun traitement en cours coché), Intolérance à un traitement en cours = oui (coché avant le décochage de Metformine) |
| **Observé** | La carte « Optimiser l'agent mal toléré : réduire la posologie (intolérance non majeure) ou remplacer » reste affichée, motif : « Intention thérapeutique ≠ Initier un traitement et Intolérance à un traitement en cours » — **aucun traitement n'est pourtant déclaré en cours** |
| **Pourquoi ça compte** | Proposer d'« optimiser » ou de « remplacer » un agent alors qu'aucun agent n'est déclaré est une incohérence logique visible ; pas un défaut de sécurité grave, mais une carte qui ne devrait probablement pas apparaître sans traitement associé. Signalé comme doute — le référent tranchera si `intolerance_traitement` doit être conditionné à `traitements_en_cours non vide`. |

---

**Point : P0-f — État accessible des boutons segmentés**

| champ | contenu |
|---|---|
| **Verdict** | CONFORME |
| **Reproduction** | Traiter, groupe « Par rapport à l'objectif », avant et après clic ; contrôle croisé sur Statine (« Intolérance aux statines ») |
| **Observé** | `aria-pressed="false"` sur les 4 boutons avant réponse ; après sélection, `aria-pressed="true"` uniquement sur le bouton choisi, confirmé par `javascript_tool` à plusieurs reprises tout au long de la passe |
| **Pourquoi ça compte** | Un lecteur d'écran doit connaître l'état réel du formulaire, pas seulement son apparence visuelle. |

---

## Contrôle des correctifs P4 (étape 4 du mandat)

### 1. D30 — un drapeau non répondu ne vaut plus « non »

| champ | contenu |
|---|---|
| **Verdict** | CONFORME |
| **Reproduction** | `rhd-activite-physique` ET `cible-glycemique` (nœud Fixer la cible d'HbA1c), formulaires **vierges** |
| **Observé** | Activité physique vierge : « Aucune option n'est proposée pour l'instant : la décision est suspendue, faute de critères renseignés » + bloc « EN ATTENTE » listant 12 pistes ; 9 critères décisifs annoncés dans le bandeau « Reco provisoire ». Fixer la cible d'HbA1c vierge : même mécanisme, « Cible < 9 % — à renseigner : Espérance de vie, Fragilité », 2 critères décisifs annoncés. **Zéro carte « Recommandée » dans les deux cas.** |
| **Marqueur cohérent avec le moteur** | Sur Activité physique vierge, chaque champ chiffré/à choix porte « · à confirmer », chaque drapeau (Fragilité, Rien à signaler…) porte « · à confirmer » tant qu'il n'a pas été touché. Le compteur du bandeau (« 9 critères décisifs non confirmés ») correspond bien aux champs effectivement marqués « à confirmer » dans le formulaire au-dessus — pas de divergence observée entre les deux couches. |
| **Pourquoi ça compte** | C'est le correctif majeur de tout le lot : l'outil ne doit jamais se prononcer sur ce qu'il ignore. |

### 2. D32 — halte ordered-first-match ne bloque plus la sécurité

| champ | contenu |
|---|---|
| **Verdict** | CONFORME |
| **Reproduction** | Nœud `statine`, âge **62**, maladie CV établie **oui**, intolérance aux statines **avérée**, statine déjà en place **non**, **ancienneté du diabète VIDE**, **autres facteurs de risque cardiovasculaire VIDE** |
| **Observé** | Carte « **Statine indisponible (intolérance avérée ou contre-indication) — alternatives hypolipémiantes** » affichée, badge Recommandée / Preuve modérée, citant explicitement ézétimibe (2ᵉ ligne), anti-PCSK9 (3ᵉ ligne), acide bempédoïque (« traitement de dernier recours » en France, avec mention de la divergence ESC 2024/2025 qui le place plus tôt). Bloc distinct : « Ce patient a une maladie cardiovasculaire ÉTABLIE... Ne pas laisser ce patient sans traitement hypolipémiant au motif que la statine est écartée. » Et « Statine de haute intensité » apparaît en « écarté : Intolérance aux statines = Avérée » |
| **Pourquoi ça compte** | C'était le défaut le plus grave de la passe précédente — une sortie muette sur un patient réel en prévention secondaire. Il est corrigé et vérifié à l'écran, pas seulement dans le code. |

### 3. D31 — contrainte violée suspend les résultats

| champ | contenu |
|---|---|
| **Verdict** | CONFORME |
| **Reproduction** | Nœud `Insulinothérapie du DT2`, situation **« Basale seule »** (pas naïf), **TBR = 1**, **TBR sévère = 95** |
| **Observé** | Verbatim exact : « **SAISIE À CORRIGER AVANT DE POURSUIVRE** — Le temps passé sous 54 mg/dL (TBR sévère) est par définition INCLUS dans le temps passé sous 70 mg/dL (TBR) : il ne peut pas lui être supérieur. Vérifier laquelle des deux valeurs est erronée. Champs concernés : Situation d'insulinothérapie, TBR — temps sous 70 mg/dL (%), TBR sévère — temps sous 54 mg/dL (%) ». **Aucune section « Options applicables » n'apparaît nulle part sur la page** — ni carte recommandée, ni écartée, ni en attente. |
| **Observation annexe** | Le bloc de contradiction est en bleu neutre, dans le même registre visuel que le bloc de cadrage juste au-dessus — pas de couleur d'alerte distincte (rouge/ambre). Pas un défaut au sens strict (le texte est très clair et lisible), mais une occasion manquée de hiérarchie visuelle pour l'axe B. |
| **Pourquoi ça compte** | Avant ce correctif, une saisie impossible aurait pu produire des cartes « Recommandée » sur des données contradictoires. |

### 4. D-06 — le pré-remplissage calculé applique ce qu'il annonce

| champ | contenu |
|---|---|
| **Verdict** | CONFORME |
| **Reproduction** | Nœud `Traiter`, HbA1c actuelle **9** / cible **7**, puis HbA1c actuelle **6,5** / cible **8,5** |
| **Observé** | Cas 1 (9/7) : segment « Nettement au-dessus de l'objectif » sélectionné avec mention « · calculé, à vérifier » ; `aria-pressed="true"` confirmé par script sur ce seul bouton, `"false"` sur les 3 autres ; le critère absent des « à renseigner ». Cas 2 (6,5/8,5, sous l'objectif) : **aucun** segment sélectionné, `aria-pressed="false"` sur les 4 boutons, aucune mention « calculé ». Test complémentaire (override) : sélection manuelle de « À l'objectif » sur le cas 9/7 → mention disparaît ; puis HbA1c actuelle changée à **12** (cible inchangée) → « À l'objectif » **reste sélectionné**, le calcul ne l'écrase jamais. |
| **Pourquoi ça compte** | C'est le mécanisme qui avait été « livré, testé, déclaré fait, et ne fonctionnait pas » lors du lot précédent — vérifié ici pour de vrai, à l'écran, y compris son cas limite le plus dangereux (ne jamais écraser une saisie du praticien). |

### 5. D33 — « Nouveau patient » vide la mémoire de session

| champ | contenu |
|---|---|
| **Verdict** | CONFORME, avec réserve méthodologique |
| **Reproduction** | Traiter, HbA1c actuelle **8,4** / cible **7** (intention non choisie), clic sur « Nouveau patient » (barre du haut) |
| **Observé** | Le clic déclenche un `window.confirm()` **natif** avec le texte exact : « Vider la session en cours et repartir avec un nouveau patient ? Les valeurs saisies non enregistrées seront perdues. » (confirmé par `read_console_messages`, log « Page dialog suppressed (confirm) »). **Le navigateur de test supprime automatiquement les dialogues natifs et répond « Annuler »** — impossible de cliquer « OK » comme le ferait un humain. J'ai surchargé `window.confirm = () => true` par `javascript_tool` (contournement d'une limite d'outillage, pas un montage de scénario par script : le clic réel sur le bouton a ensuite été fait par `computer`) pour observer la suite. Après confirmation forcée : le formulaire Traiter redevient entièrement vierge, et le nœud Insulinothérapie ouvert ensuite montre HbA1c actuelle ET cible vides, « à confirmer », **zéro mention « repris de votre saisie »**. |
| **Pourquoi ça compte** | Le geste est destructif — la confirmation existe et le texte est clair, ce qui est vérifié. Mais je n'ai pas pu reproduire le clic « OK » exactement comme un humain le ferait ; c'est une limite de l'environnement de test, à signaler pour que le lecteur du rapport ne prenne pas ce point pour un « reproduit à l'écran » au sens strict du protocole. |

### 6. T-025 — contre-indications remontées et mises en registre de sécurité

| champ | contenu |
|---|---|
| **Verdict** | CONFORME (amélioration confirmée) |
| **Reproduction** | Test des 20 secondes sur la carte « Statine indisponible » du profil D32 ci-dessus (prévention secondaire, intolérance avérée) |
| **Observé** | Lu l'écran une fois, détourné, écrit de mémoire : (a) je prescris — ézétimibe 2ᵉ ligne puis anti-PCSK9 3ᵉ ligne, bempédoïque en dernier recours ; (b) je surveille — rien de spécifique retenu sur cette carte précise (cohérent, elle n'en porte pas) ; (c) à ne surtout pas faire — « **ne pas laisser ce patient sans traitement hypolipémiant au motif que la statine est écartée** », recopié quasiment mot pour mot. Relecture : conforme au texte réel. Le message « ne pas faire » est dans un bloc bleu distinct, juste après le bloc contre-indications, avant « Proposé parce que ». |
| **Pourquoi ça compte** | C'est la seule mesure qui dit si la remontée des contre-indications a servi à quelque chose. Lors de la passe précédente, ce type de message n'était **jamais** retenu au test des 20 secondes — il l'est ici. |

---

## Partie 2 — Les trois axes de consultation

### Axe A — Ergonomie de saisie

| Mesure | V1 (Traiter) | V2 (Insulinothérapie) | V3 (Statine → RHD) |
|---|---|---|---|
| Interactions avant la première carte utile | ~14 clics/saisies (intention, 2 traitements, dose, HbA1c, DFG, IMC, ASCVD×2, hypoglycémie, âge, fragilité×2, risque hypo — dont 1 clic erroné, cf. défaut ci-dessous) | ~9 (situation, âge, HbA1c actuelle, DFG, 2 traitements, MCG×2, glycémie à jeun, dose basale) — cible restée vide, blocage résiduel sur 1 carte | Statine : ~7 (âge, ancienneté, autres FDR, rien à signaler, statine en place×2, intolérance) ; RHD ensuite : 0 valeur commune, nœud entièrement reparti de zéro |
| Champs remplis avant 1er affichage / total déclaré dans le nœud | Traiter déclare environ 25 champs/groupes ; premier affichage après ~8 champs | Insulinothérapie déclare ~21 groupes de champs (dont 2 groupes de cases à cocher de 9 et 4 éléments — proche de la « trentaine » annoncée par le protocole si on compte chaque case) ; premier affichage bloqué tant que cible HbA1c absente | Statine ~6 champs ; premier affichage après 5 |
| Valeurs sous les yeux / à aller chercher / non disponibles | Sous les yeux : HbA1c, traitements en cours, âge. À aller chercher : DFG, IMC (biologie/dossier). **Non disponible dans le vignette** : HbA1c cible (jamais donnée) | Sous les yeux : doses, HbA1c. **Non disponibles** : TBR, TBR sévère, coefficient de variation, AGP (nécessitent un capteur que M. B. n'a pas) | Sous les yeux : âge, LDL. À coder : « autres facteurs de risque » en **chiffre** (pas de case « fumeur ») — ambiguïté sur ce qu'il faut compter |
| Le premier champ, repère bleu visible | Oui, « · détermine la suite » visible sans le chercher sur Intention thérapeutique | Oui, sur Situation d'insulinothérapie | Oui, mais Statine n'a pas de champ « détermine la suite » aussi marqué — l'Âge est juste « à confirmer » |
| Droit à l'erreur | **DÉFAUT trouvé** : bouton segmenté 2 valeurs, une fois répondu, ne revient jamais à « non répondu » (cf. détail plus bas) | Non testé spécifiquement | Non testé spécifiquement — mais le pattern checkbox « Statine déjà en place » permet lui 3 états (indéterminé → oui → non) via 2 clics, contrairement au bouton 2-segments |
| Stabilité sous les doigts | **DÉFAUT trouvé** : réflow de page après « Rien à signaler » a dévié un clic suivant vers un autre champ (cf. détail) | Non observé | Non observé |
| Mobile (375 px) | **DÉFAUT trouvé** : débordement horizontal de toute la page (`scrollWidth` 444 vs 375) localisé au champ « Intention thérapeutique » | Pas de débordement (même style de libellé, se retourne correctement sur 2 lignes) | Non testé en mobile |

**Phrase carrée** : en consultation de 15 minutes, Traiter et Statine restent remplissables — le
praticien s'arrête surtout sur des valeurs qu'il n'a pas (HbA1c cible si elle n'a jamais été fixée
formellement). Insulinothérapie est le nœud où j'ai le plus hésité : le bloc « Sans MCG » sauve la mise
pour la plupart des cartes, mais un praticien pressé face à ~21 groupes de champs pourrait bien
abandonner avant d'atteindre le fond du formulaire — surtout si, comme moi, il se fait piéger par un
clic mal dirigé après un « Rien à signaler ».

### Axe B — Lisibilité et compréhension de la réponse

| Mesure | V1 / profil D32 (Statine) |
|---|---|
| Test des 20 secondes | Fait deux fois (V1 : Traiter, 5 cartes ; D32 : Statine, 1 carte). Dans les deux cas, le point « à ne pas faire » a été **retenu et recopié fidèlement** — changement net par rapport à la passe précédente où ce type de message n'était jamais retenu |
| Hiérarchie visuelle | Sur la carte « Statine indisponible », les contre-indications arrivent bien juste après le titre/les badges, avant l'effet attendu — conforme à l'attendu du protocole |
| Volume | La carte « Statine indisponible » porte un bloc « Contre-indications » très long (histoire du remboursement, divergence ESC/reco française, séquence complète) — plusieurs paragraphes avant d'arriver au message de sécurité central. Sur V1 (Traiter), 5 cartes s'affichent d'un coup, nécessitant ~3 écrans de défilement en desktop pour tout voir |
| Ce qu'on emporte | Sur les deux écrans testés, le motif « Proposé parce que » et le paragraphe de sécurité en bloc bleu donnent de quoi dicter une conclusion en 1-2 lignes sans reformuler depuis zéro |
| Registre du bloc de contradiction (D31) | Bleu neutre, non distinct du bloc de cadrage informatif au-dessus — observation, pas un défaut caractérisé |

### Axe C — Fidélité au raisonnement de consultation

| Point | Observation |
|---|---|
| 1. L'ordre des questions (V1) | Sur Traiter, j'ai dû choisir l'intention thérapeutique (« Optimiser ») **avant** d'avoir vu un seul champ clinique de Mme R. — pour une histoire qui évoque une hypoglycémie sous sulfamide, ce choix suppose d'avoir déjà conclu à un problème de tolérance. Le champ « Traitements en cours » disparaît ensuite si on avait choisi « Initier » à tort — récupérable en revenant sur l'intention, mais au prix de re-répondre |
| 2. Trancher avant de savoir | Sur Statine, « Autres facteurs de risque cardiovasculaire » est un champ **numérique** (pas une liste de cases à cocher) — le praticien doit déjà savoir combien il en compte et selon quelle définition, avant même de voir la définition |
| 3. Coût du découpage (V3) | Statine → RHD (M. K.) : **0 valeur ressaisie**, car aucun champ n'est commun aux deux nœuds pour ce profil — mais aussi 0 valeur *transmise* : l'IMC (34) et le tabagisme donnés dans le vignette ne sont interrogés dans aucun des deux nœuds ouverts, ils se perdent entre les mailles du découpage |
| 4. Point d'entrée | La liste des 6 nœuds (« Traiter », « Insulinothérapie », « Prescrire une statine », « Règles hygiéno-diététiques ») parle plutôt le langage du contenu clinique que celui d'une question de consultation (« pourquoi ce patient vient »); un médecin qui ne sait pas encore ce qu'il cherche doit déjà connaître la structure du DT2 pour choisir |
| 5. Le périmètre, dit au bon moment (V2) | **CONFORME** — sur Insulinothérapie, dès que MCG=non est déclaré, un message « Sans MCG : titrer la basale sur la glycémie à jeun... » apparaît immédiatement, au bon endroit. Seule la carte « Corriger l'hypoglycémie ou la variabilité » reste hors d'atteinte sans chemin de repli (cf. dette bonus, distincte de la dette prescription) |
| 6. Actionnabilité | Les cartes testées (Statine, Traiter, Insulinothérapie) sont actionnables en cabinet sans examen supplémentaire, sauf mentions explicites (« avis spécialisé urgent » pour CK>50, « orienter vers le diététicien ») |
| 7. Question sans réponse | Un médecin demanderait volontiers : « et si mon patient a DEUX des trois problèmes à la fois (ex. hypoglycémie sous sulfamide ET insuffisant rénal ET tabagique) », l'outil ne permet pas de poser cette question une seule fois — il faut la reposer nœud par nœud, avec le risque de perdre en route les faits qui ne circulent pas (tabagisme, IMC pour V3) |

---

## Partie 3 — Familles de défaut candidates

1. **Débordement horizontal mobile isolé** (Traiter, champ Intention thérapeutique) : une seule
   occurrence confirmée (Insulinothérapie testé en comparaison, pas de débordement). **Pas promu en
   famille** — reste un défaut isolé, faute d'une deuxième occurrence sur un autre nœud/champ.
2. **Réflow après « Rien à signaler » + bouton 2-segments sans retour à l'indéterminé** : deux occurrences
   liées mais mécaniquement distinctes observées sur le **même** incident (V1, Traiter) — ne compte donc
   que comme une seule occurrence au sens strict du §4bis (il faudrait le revoir sur un autre nœud/écran
   pour promouvoir). Les deux sont déjà couvertes par les familles 9 et 10 existantes du §4 — pas une
   famille nouvelle, mais une confirmation concrète que ces deux familles restent actives sur ce lot.
3. **Aucune nouvelle famille non cataloguée** n'a pu être établie avec deux occurrences indépendantes
   pendant cette passe — c'est un résultat, il est noté comme tel plutôt que d'inventer une famille par
   symétrie.

---

## Section spéciale — Dette connue, `prescription`/naïf (étape 5, commit `e2c112c`)

**Rappel du contexte** : ce point vérifie à l'écran ce que le code documente comme dette *acceptée*
(`IMPASSES_CONNUES_T018` / `VIOLATIONS_R8_CONNUES_T018`). Ce n'est **pas** une découverte — c'est une
confirmation à l'écran de ce que le code annonçait déjà, pour que le référent sache si l'état constaté
correspond à l'état documenté.

**Volet positif (résolu)** : Traiter, intention « Initier un traitement ». Le champ « Traitements en
cours » disparaît de l'écran (voulu, D9/R8). Sur profil vierge comme sur profil comorbide riche (HbA1c
11, DFG 15, IMC 38, macroalbuminurie, cétonémie + glucotoxicité cochées), le bloc « EN ATTENTE » ne
mentionne **jamais** « Intolérance à un traitement en cours » ni « Nature de l'intolérance » comme
critère manquant — zéro occurrence, dans les deux profils testés. **Confirmé résolu.**

**Volet connu (dette acceptée, confirmée présente)** : avec le même profil comorbide (cétonémie
confirmée + glucotoxicité + HbA1c 11 % + DFG 15 + IMC 38 + macroalbuminurie — un profil qui justifierait
cliniquement une insuline d'initiation), les huit cartes suivantes restent bloquées dans le bloc « EN
ATTENTE », verbatim exact :

- « Insuline d'initiation (souvent transitoire — état catabolique) — à renseigner : **Traitements en cours** »
- « Introduire un iSGLT2 (protection cardio-rénale et/ou contrôle glycémique) — à renseigner : **Traitements en cours** »
- « Introduire un AR GLP-1 (liraglutide, sémaglutide, dulaglutide) — à renseigner : **Traitements en cours** »
- « Introduire le tirzépatide (obésité — prescription spécialisée) — à renseigner : **Traitements en cours** »
- « Association iSGLT2 + AR GLP-1 (deux indications distinctes) — à renseigner : **Traitements en cours** »
- « Envisager l'insuline (palette non-insulinique épuisée — ajustement fin → nœud E) — à renseigner : **Traitements en cours**, Dénutrition / carence »
- « Gliptine (sitagliptine) — option glycémique orale de bas rang (place résiduelle) — à renseigner : **Traitements en cours** »
- « Sulfamide (gliclazide MR ou glimépiride) — option glycémique de bas rang, derrière la gliptine — à renseigner : **Traitements en cours** »

Le critère cité, « Traitements en cours », **n'existe plus nulle part à l'écran** dès que l'intention
« Initier » est sélectionnée (le champ disparaît, cf. volet positif ci-dessus) — il est donc structurellement
impossible à fournir. Confirmé à l'écran, y compris avec un profil comorbide qui rendrait cliniquement
pertinente au moins « Insuline d'initiation ». **Aucune de ces huit cartes n'est jamais devenue
applicable, ni écartée avec un motif — elle reste bloquée avec un critère fantôme.**

Ce point est **la dette connue et acceptée**, pas une découverte de cette passe — il ne doit pas être
traité comme un défaut urgent à corriger, mais son état à l'écran correspond bien à ce que le code
documente.

---

## Clôture

### 1. Les trois points les plus graves

1. **Réflow de page + clic mal dirigé sur un bouton segmenté 2-valeurs, qui ne pardonne jamais** (V1,
   Traiter). C'est la découverte la plus concrète de cette passe : un geste de correction (« Rien à
   signaler ») déplace le contenu, un clic suivant atterrit sur le mauvais champ, et ce champ — une fois
   touché — **ne peut plus revenir à « non répondu »**. Sur ce cas précis, la valeur erronée
   (« Risque hypoglycémique = Faible ») était cliniquement fausse pour une patiente qui fait des
   hypoglycémies sous sulfamide. Vérifié par script (`aria-pressed`), pas supposé.
2. **P6 — le « Pourquoi pas d'autres options » déplié récite des expressions logiques brutes**
   (opérateurs « ≠ », « comprend », chaînes « et »/« ou » de plusieurs critères), alors que le protocole
   demande explicitement « jamais réciter une règle générale ni un fragment de code ». La ligne
   principale (« écarté : DFG < 30 ») est correcte ; c'est la liste dépliée qui régresse vers le
   langage machine.
3. **Débordement horizontal mobile isolé** sur le champ « Intention thérapeutique » de Traiter — mesuré,
   localisé, mais confirmé limité à ce seul champ (Insulinothérapie n'a pas le même problème avec un
   libellé pourtant comparable).

### 2. Le verdict des six correctifs P4, en une phrase chacun

- **D30** : conforme — formulaires vierges (RHD activité physique, cible HbA1c) n'affichent aucune carte, et le compteur de critères correspond aux champs marqués « à confirmer ».
- **D32** : conforme — la carte « Statine indisponible — alternatives hypolipémiantes » s'affiche enfin sur le profil qui produisait autrefois une sortie muette.
- **D31** : conforme — la contradiction TBR/TBR sévère affiche un message clair et suspend bien toute carte, sans exception.
- **D-06** : conforme — le pré-remplissage calculé se déclenche, se tait sous l'objectif, et ne écrase jamais un choix manuel même après changement de l'HbA1c.
- **D33** : conforme sous réserve méthodologique — la confirmation native existe avec un texte clair et la purge fonctionne, mais je n'ai pas pu cliquer « OK » comme un humain (limite de l'outil de test).
- **T-025** : conforme — le point « à ne surtout pas faire » est désormais retenu au test des 20 secondes, ce qui n'était jamais le cas lors de la passe précédente.

### 3. Ce que je n'ai pas pu tester

- Le clic natif « OK » sur le `window.confirm()` de « Nouveau patient » (limite de l'outil de test, pas
  de l'application — contourné par script, cf. D33).
- Le test des 20 secondes complet sur V2 et V3 (fait sur V1 et sur un profil D32 dédié ; V2/V3 couverts
  par les autres axes mais pas par le test de rappel à 20 secondes, faute de temps dans une passe déjà
  très longue).
- La chasse libre P7 n'a pas été menée comme un bloc séparé — mais la plupart de ses objectifs ont été
  atteints en chemin, par les découvertes organiques (réflow, débordement mobile, carte incohérente
  P0-c bis).
- Le comportement à trois largeurs (seulement desktop et mobile ont été comparés ; pas de tablette).

### 4. Impression d'ensemble en praticien

Le lot P4 tient ses six promesses à l'écran — c'est la première fois que je peux l'écrire aussi
franchement pour un lot entier de correctifs sur ce projet. Le défaut le plus grave de la passe
précédente (la sortie muette sur un patient en prévention secondaire réel) est bel et bien réparé, vérifié
à l'écran et non supposé depuis le code. Le mécanisme de pré-remplissage, qui avait été livré-testé-déclaré
fait sans jamais fonctionner, fonctionne maintenant, y compris sur son cas limite le plus sensible (ne
jamais écraser une saisie du praticien).

Cela dit, j'ouvrirais cet outil en consultation avec une réserve précise : le nœud **Traiter** est celui
où j'ai le plus vite décroché — pas à cause d'un champ manquant, mais parce qu'un clic de correction
routinier (« Rien à signaler ») a fait bouger l'écran sous mes doigts et m'a fait cocher, sans m'en
rendre compte, une donnée cliniquement fausse sur ma patiente. Un praticien entre deux consultations,
qui clique plus vite que je ne l'ai fait ici (je vérifiais chaque champ par script), aurait pu ne jamais
s'en apercevoir. C'est le point sur lequel je conseillerais de revenir en priorité avant la prochaine
passe — pas pour sa gravité clinique isolée (ici, un simple champ « sans effet sur la reco actuelle »
dans mon scénario), mais parce que le même mécanisme, sur un champ qui *compte*, produirait une carte de
sécurité fondée sur une donnée que personne n'a sciemment saisie.
