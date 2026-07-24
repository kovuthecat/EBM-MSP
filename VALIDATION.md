# VALIDATION.md — checklist visuelle / UX (passe humaine) — ebm-msp

> Validation **visuelle** déléguée à l'humain, **non bloquante** pour les commits.
> L'exécutant consigne ici la ligne « visuel : » de chaque tâche du plan — il ne la vérifie PAS
> lui-même (pas de navigateur, pas de capture). Légende : [ ] à valider · [x] OK · [!] à corriger.
> **Purge** : supprimer les blocs entièrement `[x]` après la passe humaine.
> Un bloc par écran/module courant. Passage à l'échelle : router la validation propre à un
> sous-domaine dans `docs/<sous-domaine>/VALIDATION.md` si ce fichier gonfle.

## Shell (S1 · T-001)

- [ ] Header sticky : logo + libellé, pills Décision/Veille (transparent inactif / plein actif), lien
  Méthode, menu compte (`?` + « Invité », dropdown Profil/Pour mémoire/Se connecter) — fidèles au
  prototype `MSP Menilmontant.dc.html` (lignes ~19–54).
- [ ] Bandeau disclaimer sous le header, visible sur tous les écrans sauf `home`/`auth`.
- [ ] Responsive : pas de débordement horizontal en mobile étroit (le menu compte à droite wrap en premier).
- [ ] Menu compte : pas de fermeture au clic extérieur (stub minimal assumé) — noter si gênant.

## Accueil / Méthode (S1 · T-008)

- [ ] Accueil : mini-header interne (distinct du header sticky), hero centré, disclaimer encadré, 2
  cartes cliquables (indigo Décision / teal Veille). CTA carte Décision lit comme un libellé neutre
  (« voir les algorithmes disponibles → »), sans chiffre inventé, non tronqué/mal aligné.
  Token `--c-badge-preuve-tres-faible` non fixé en S1 (valeur absente du prototype relu) — à compléter.
- [ ] Méthode : 5 sections lisibles, max-width ~760px, cohérentes avec `docs/veille/SOP_veille.md`
  (pas le texte illustratif du prototype).

## Contenu DT2 — nœud A « Cible glycémique » (T-007bis, VALIDÉ v2.0)

Ré-encodé depuis le dossier de preuve après double vérification indépendante (2ᵉ passe) ; corrections
actées, `meta.statut: valide`. Reste la **relecture visuelle** sur l'écran D3 (contenu à jour) :

- [ ] Cas patient → **une seule** cible cohérente : jeune récent sans MCV → « ~6,5 % (6,5–7 %) » ;
  défaut → « ≤ 7 % » ; âgé (78) robuste récent → « ≤ 7 % » (pas ~6,5) ; fragile / CV grave → « ≤ 8 % » ;
  âgé dépendant (EV limitée + fragile/comorbidité grave) → « < 9 % ».
- [ ] `divergence` **affichée** sur la cible ~6,5 % (reco officielle HAS vs position critique Prescrire/MG).
- [ ] Argumentaire déplié : reco officielle vs position critique, incertitudes, sources (DOIs réels).
- [ ] Champs de critères présents et lisibles, dont `antecedent_cv` et `comorbidite_grave` (cases à cocher).

## Décision D2 (S4 · T-005)

- [ ] Chips domaine (DT2 actif indigo ; CV/BPCO/Gériatrie « à venir » pointillés/désactivés) et cartes
  nœud (titre, population, date de revue, badge veille si `veille_liee` non vide) fidèles au prototype.
- [ ] Redondance assumée à juger : avec un seul nœud réel, l'intitulé de groupe (thème = `titre` du
  nœud, faute de champ dédié) et le titre de carte affichent le même texte — acceptable en P1
  (1 nœud/thème), à revisiter si plusieurs nœuds par thème (P3+).
- [ ] Responsive mobile.

## Critères du patient — ergonomie D3 (T-009, 2026-07-23)

- [ ] Grille 2 colonnes pour Âge / Ancienneté / Espérance de vie / Risque hypoglycémique : pas de champ
  seul décalé sur sa ligne, y compris en mobile (1 colonne < 480px).
- [ ] Cases à cocher (Fragilité, Antécédent cardiovasculaire, Comorbidité grave) regroupées à part sous
  un séparateur, libellés accentués correctement.
- [ ] Champs Âge/Ancienneté vides (placeholder `—`) au chargement ; aucune option affichée tant qu'ils
  ne sont pas saisis (message d'invite à la place).
- [ ] Espérance de vie : suggestion auto visible (texte italique sous le champ) tant que non choisie à
  la main ; se met à jour quand âge/fragilité/comorbidité grave/antécédent CV changent ; le texte
  d'aide disparaît et la valeur reste figée dès que l'utilisateur sélectionne une valeur manuellement.

## Disclaimer, Méthode, argumentaire exhaustif (T-010/T-010bis, 2026-07-23)

- [ ] Ton du disclaimer (bandeau permanent, accueil, pied d'écran nœud) : cohérent, rassurant,
  garde la mention de responsabilité du praticien (question MDR encore ouverte, DECISIONS.md).
- [ ] Lisibilité du disclaimer (bandeau + accueil) : 1re phrase en gras bien détachée sur sa propre
  ligne, expressions clés (« le lien avec le patient », « le seul responsable ») repérables au survol.
- [ ] Bandeau disclaimer **absent** des écrans Veille (liste + détail) ; header (logo, pills
  Décision/Veille, Méthode, compte) toujours présent partout.
- [ ] Écran Méthode : bloc « Algorithmes d'aide à la décision » lisible, cohérent avec le bloc
  « Veille scientifique » existant (même structure visuelle, séparateur entre les deux).
- [ ] Nœud A → Déplier l'argumentaire → lien « Argumentaire exhaustif » : s'ouvre, contenu complet et
  fidèle au fichier source (titres, tableau HAS, listes, gras/italique/code), **aucun `**`/`*` brut**
  qui traîne dans le texte affiché.

## Contenu DT2 — nœud F « Statine » (2026-07-23, VALIDÉ v1.0)

Nœud chargé automatiquement (glob Vite, aucun code par nœud, DECISIONS.md D8) : apparaît dans D2/D3 sans
câblage dédié. Seul ajout de code = 2 libellés (`diabete_complique`, `dialyse`, `lib/labels.ts`).

- [ ] D2 : la carte « Prescrire une statine (et à quelle intensité) chez le diabétique de type 2 » apparaît
  dans le domaine DT2, comme un thème distinct des nœuds A/B/C.
- [ ] D3 : les 6 critères s'affichent lisiblement — `Âge`, `Ancienneté du diabète (ans)`, `Autres facteurs
  de risque cardiovasculaire` en grille numérique ; `Maladie cardiovasculaire athéromateuse établie`,
  `Diabète compliqué (…)`, `Dialyse` en cases à cocher regroupées.
- [ ] Cas patient → **une seule** option (ordered-first-match) : ASCVD coché → « Statine de haute
  intensité — prévention secondaire » ; ASCVD non coché + ancienneté < 10 + 0 FDR + non compliqué →
  « Discuter la statine (décision partagée) » ; sinon → « Statine (prévention primaire… ) ».
- [ ] Alertes visibles : > 75 ans sans ASCVD (individualiser) ; dialyse cochée (ne pas initier) ; rappel
  permanent (pas de cible LDL, SCORE2-Diabète en aide).
- [ ] Argumentaire déplié : reco française SFE/SFD/NSFA/SFC 2026 + **note conflits d'intérêt** visible ;
  divergence affichée ; sources avec DOI/PMID.

## Décision D3 (S4 · T-006)

- [ ] Le filtrage réagit aux critères conformément au **contenu validé v2.0** (bandes HAS, sortie unique).
- [ ] Cas fragile + EV limitée : **une seule** option affichée (« < 9 % ») — `selection: ordered-first-match`
  (plus de double option applicable simultanément ; corrigé en T-007bis).
- [ ] Ligne « Pourquoi cette option » : phrase générée depuis les conditions réelles — lisibilité clinique.
- [ ] Divergence/sources/incertitudes affichées ; argumentaire déplié/replié ; mobile.
- [ ] Libellés de critères/valeurs d'énumération non catalogués : repli `humanize()` sans accents
  (limitation assumée, sans impact clinique).

## Contenu DT2 — nœud E « Insuline » + câblage générique (2026-07-24, BROUILLON v0.1)

Nœud encodé + vérifié bi-agents (étape 8, feu vert). Câblage P3 réalisé : **critères dérivés calculés**
(`engine/deriveCritere.ts` + champ `derive` du schéma) et **nombres optionnels** (ne requiert que les nombres
référencés). Labels + **tooltips AGP** ajoutés (`labels.ts`). Ajv 7/7, 136 tests, build OK.

- [ ] D2 : la carte « Insulinothérapie du DT2 : initier, optimiser une basale, ajouter un bolus, adapter un
  basal-bolus » apparaît dans le domaine DT2, comme un thème distinct des nœuds A/B/C/F.
- [ ] D3 : `Situation d'insulinothérapie` en menu ; `Profil glycémique (lecture AGP)` en multi-cases **avec
  infobulle au survol** (lecture de la courbe par profil) ; métriques MCG (TIR/TBR/TBR sévère/TAR/CV/GMI),
  poids, doses en champs numériques ; `Traitements en cours` en multi-cases.
- [ ] **Critères dérivés MASQUÉS** : `HbA1c à la cible`, `Glycémie à jeun à la cible`, `Sur-basalisation`,
  `Terrain fragile` **ne sont PAS des cases à cocher** (calculés depuis HbA1c/GAJ/dose+poids/âge+fragilité).
- [ ] **Nombres optionnels** : le message d'invite ne réclame que les nombres pertinents (~10 : HbA1c
  actuelle/cible, DFG, TBR/TBR sévère/CV, GAJ, poids, dose basale, âge) ; **TIR, TAR, GMI, IMC, dose rapide
  ne bloquent pas** l'affichage des options (informatifs).
- [ ] Routage par situation : sélectionner « Naïf » / « Basale seule » / « Basal-plus » / « Basal-bolus »
  n'affiche QUE les options de la situation choisie (aucune fuite inter-situations).
- [ ] Dérivés à l'œuvre : HbA1c 9 % / cible 7 % (naïf) → « Initier une insuline basale » ; GAJ 1,0 g/L + HbA1c
  au-dessus (basale seule) → « Ne pas sur-titrer » ; dose basale 50 U + poids 80 kg → alerte « > 0,5 U/kg » ;
  âge 80 + MCG → alerte cibles MCG **assouplies** (pas standard).
- [ ] Sécurité : profil « hypoglycémie nocturne » (ou TBR > 4) en basale seule → « Corriger l'hypoglycémie »
  s'affiche et « Titrer la basale » **ne s'affiche PAS** (correctif étape 8).
- [ ] Prémix : « Insuline prémélangée — option dégradée » n'apparaît que si `Préférence… = Refuse`, toujours
  en dernière position (jamais avant GLP-1 / basal-plus).
- [ ] Alertes (AlertList) : orientation spécialiste, arrêt SU/glinide, iSGLT2/acidocétose, DFG bas, cibles
  MCG (standard vs relâchées), sans-MCG → glycémie à jeun, rappel « pas de bénéfice CV » — lisibles.
- [ ] Argumentaire exhaustif (`insuline.argumentaire.md`) : s'ouvre, complet, tableaux/sources avec PMID,
  **aucun `**`/`*` brut**.
- [ ] **RESTE (P3+, non fait)** : affichage du **nombre de dose calculé** (poids × 0,1-0,2 U/kg → « ≈ X U » ;
  −10-20 % de la dose actuelle…) — les ratios sont en texte dans l'`effet_attendu`/argumentaire, mais le
  nombre auto-calculé n'est pas encore affiché (nécessiterait un widget de calcul dédié).

## Contenu DT2 — nœud D « Sulfamides / gliptines » + câblage générique (2026-07-24, BROUILLON v0.1)

Nœud encodé + vérifié bi-agents (étape 8 : 0 HAUTE / 0 MOYENNE). **Dernier nœud du domaine DT2.** Câblage
minimal : nœud auto-chargé (glob Vite, aucun code par nœud) ; **seul ajout de code = 1 libellé**
(`classes_a_benefice_indisponibles`, `lib/labels.ts`). Aucun critère dérivé, aucun nombre optionnel (4 critères
simples). Ajv + 137 tests + build OK.

- [ ] D2 : la carte « Place résiduelle des sulfamides et des gliptines (quand les classes à bénéfice
  cardio-rénal ne sont pas utilisables) » apparaît dans le domaine DT2, comme un thème distinct.
- [ ] D3 : 4 critères rendus — `iSGLT2 et AR GLP-1 tous deux inutilisables (contre-indication, intolérance ou
  refus)` en **case à cocher** (bool) ; `Traitements en cours` en multi-cases ; `DFG` en champ numérique ;
  `Risque hypoglycémique du schéma` en menu (Faible / Élevé).
- [ ] Déclencheur : case `iSGLT2 et AR GLP-1… inutilisables` **décochée** → seule l'option de fond « Ne pas
  privilégier un sulfamide ni une gliptine — préférer metformine + iSGLT2 / AR GLP-1 » s'affiche (gliptine et
  sulfamide **absents**).
- [ ] Case **cochée**, DFG 70, risque faible → 3 cartes dans l'ordre : socle, puis **Gliptine (sitagliptine)**,
  puis **Sulfamide** (gliptine AVANT sulfamide).
- [ ] **Garde-fou rénal** : case cochée + DFG 25 → la carte **Sulfamide disparaît des options** (exclue,
  DFG < 30) ; la gliptine reste ; alerte rénale (attention) affichée (« sitagliptine 25 mg… ; sulfamide
  contre-indiqué si DFG < 30 »).
- [ ] Risque hypo **Élevé** → alerte (attention) « déconseiller le sulfamide, préférer la gliptine » ; le
  sulfamide reste proposé (choix référent : alerte molle, pas d'exclusion).
- [ ] Déjà sous gliptine (`Traitements en cours` = gliptine coché) → la carte Gliptine **ne se re-propose pas** ;
  idem pour le sulfamide.
- [ ] Alertes (AlertList) : molécules (sitagliptine ; gliclazide/glimépiride jamais glibenclamide ; jamais
  gliptine + AR GLP-1), rénale, hypo, contexte aigu (insuline pivot) — lisibles.
- [ ] Cartes d'options : **aucune revendication de bénéfice CV/mortalité** (les 3 options répètent « aucun
  bénéfice sur critère dur ») ; sitagliptine mise en avant, saxa/lina/alo signalées non commercialisées en France.
- [ ] Argumentaire exhaustif (`sulfamides-gliptines.argumentaire.md`) : s'ouvre, complet, tableaux/sources avec
  PMID, **aucun `**`/`*` brut**.
