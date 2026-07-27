# VALIDATION.md — checklist visuelle / UX (passe humaine) — ebm-msp

> Validation **visuelle** déléguée à l'humain, **non bloquante** pour les commits.
> L'exécutant consigne ici la ligne « visuel : » de chaque tâche du plan — il ne la vérifie PAS
> lui-même (pas de navigateur, pas de capture). Légende : [ ] à valider · [x] OK · [!] à corriger.
> **Purge** : supprimer les blocs entièrement `[x]` après la passe humaine.
> Un bloc par écran/module courant. Passage à l'échelle : router la validation propre à un
> sous-domaine dans `docs/<sous-domaine>/VALIDATION.md` si ce fichier gonfle.

## Familles explicites + badge « le plan complet » (2026-07-25)

> Nœud `prescription` (seul nœud à déclarer `Noeud.familles` pour l'instant). Build + typecheck + 231
> tests unitaires OK ; **visuel à valider par le référent.**

- [ ] Ordre des sections respecté : « À faire d'emblée — sécurité » → « Socle du traitement » → « Agent à
  ajouter » → « Traitement à corriger ou remplacer » → « Traitement à alléger » → « Aucun geste —
  surveiller » (urgence d'abord, décision référent) — stable quel que soit le profil patient.
- [ ] Mention « — en choisir un » visible UNIQUEMENT à côté du titre de la section « Agent à ajouter »
  (seule famille `exclusive: true`) ; aucune autre section ne porte de mention (les 5 autres sont
  cumulables, silencieuses par défaut).
- [ ] Badge « Recommandée » présent sur TOUS les gestes cumulables affichés dans une même section (ex.
  « À faire d'emblée — sécurité », « Traitement à alléger »), même si leurs rangs internes diffèrent.
- [ ] Dans « Agent à ajouter », le badge « Recommandée » reste limité au groupe de tête (à égalité de
  meilleur rang) ; les options de rang inférieur de cette même section n'ont pas de badge.
- [ ] Scénario référent : patient sous AR GLP‑1 mal toléré + indication rénale (DFG < 60) → « Réduire la
  posologie de l'AR GLP‑1 » ET « Introduire un iSGLT2 » portent TOUS LES DEUX le badge « Recommandée »
  (le plan se lit comme deux gestes à faire en parallèle, pas un choix entre les deux).

## Refonte UI — estompage + reco provisoire (P3 · S7‑ui, Lots 1‑3)

> Générique (tous nœuds). Build + typecheck + tests unitaires OK ; **visuel à valider par le référent.**

- [ ] Champs SANS effet sur la reco du patient courant **estompés** (opacity ~0,45) + note « · sans effet
  sur la reco actuelle » sur les champs nombre/enum. Vérifier sur un nœud riche : cocher/décocher une
  comorbidité (dé)clarifie bien les champs liés en temps réel.
- [ ] Bandeau **« Reco provisoire — N critère(s) décisif(s) non confirmé(s) : … »** (liseré ambre) tant que
  des critères décisifs restent non renseignés ; disparaît quand tous confirmés (reco définitive).
- [ ] Pas de régression A/E/F/H (estompage additif, prop optionnelle `pertinents`).
- [ ] Lot 4 NON fait (primer traitements→position, rail de groupes, argumentaires courts/tiering) — à venir.

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

## Refonte du flux de saisie + correctif du gate bloquant (2026-07-25, P3 · S7-ui Lot 2/3)

Suite recette référent sur le nœud « Traiter ». **Bug corrigé** : l'écran exigeait tous les nombres
référencés par une règle avant d'afficher quoi que ce soit (`age`, via le dérivé `terrain_fragile`) alors
que le moteur de pertinence estompait ces mêmes champs « sans effet sur la reco » — un champ pouvait être
à la fois estompé et bloquant, sans issue. Réclamé et estompé dérivent désormais de la **même** source
(`criteresPertinents`), la contradiction est impossible par construction.

**Ordre de saisie porté par le CONTENU** : nouveaux champs optionnels `groupe` (section d'affichage, ordre =
1re apparition) et `visible_si` (condition DSL de visibilité) dans `criteres_entree`. Un intitulé ou un ordre
qui ne convient pas se corrige en YAML, sans toucher au code. Nœuds sans `groupe` (A/E/F/H) : rendu à plat
inchangé, aucune régression. 178 tests (+20, `lib/formLayout.test.ts`) + build + typecheck OK.

- [ ] Nœud « Traiter » — sections dans cet ordre : **Intention thérapeutique** → **Traitement actuel et
  contrôle** → **Ce qui oriente le choix** → **Signaux d'alerte et tolérance** → **Terrain et préférences**.
- [ ] `Intention` en **boutons segmentés** (4 valeurs visibles d'un coup, plus de menu déroulant).
- [ ] Intention = **Initier** → la section « Traitement actuel et contrôle » ne montre **que l'HbA1c** :
  `Traitements en cours` est **masqué** (patient naïf par définition), pas seulement estompé.
- [ ] Intention = **Intensifier / Optimiser / Déprescrire** → `Traitements en cours` réapparaît en
  **2e élément à renseigner**, juste sous l'intention (et non plus tout en bas de la page).
- [ ] **Sûreté** : cocher « Metformine » en Intensifier → repasser en **Initier** → revenir en Intensifier :
  la case est **décochée** (une valeur masquée ne doit jamais continuer à piloter la reco en silence).
- [ ] `Nature de l'intolérance` n'apparaît **que** si « Intolérance à un traitement en cours » est cochée.
- [ ] Trois états de champ lisibles et **jamais cumulés** : *estompé* « sans effet sur la reco actuelle » ·
  *bord jaune* « à confirmer » (décisif, pas encore renseigné) · neutre.
- [ ] La reco s'affiche **en direct dès l'ouverture** (plus de « Renseignez … pour afficher les options »),
  badgée « Options applicables — provisoire » tant qu'il reste des critères à confirmer.
- [ ] Le bandeau provisoire donne un **compte** et renvoie aux champs marqués (plus de liste de 10 libellés
  en prose, illisible en consultation).
- [ ] Profil témoin (Initier, HbA1c 8,5, DFG 80, IMC 32) → metformine socle + AR GLP-1 + iSGLT2 +
  tirzépatide + gliptine + sulfamide, sans écran blanc ni erreur console.
- [ ] **RESTE** : `groupe`/`visible_si` non appliqués aux nœuds A/E/F/H (rendu à plat conservé) — à faire
  nœud par nœud, c'est un arbitrage de contenu.

## Correctifs de recette n°2 (2026-07-25, P3 · S7-ui Lot 3)

Quatre points remontés par le référent sur le nœud « Traiter », traités dans l'ordre.

**Bug corrigé (le plus important)** : sur le profil (Initier, HbA1c 8,6, DFG 74, IMC 25, albuminurie normo,
ASCVD non, IC non), `insuffisance_cardiaque` était estompé à tort. Cause racine : à ce profil, les options
iSGLT2 et AR GLP-1 tombent toutes deux sur leur rang « default » (2 = égalité), départagées par l'ordre du
CONTENU (iSGLT2 déclaré avant AR GLP-1) — pas par une préférence clinique. Cocher IC fait passer AR GLP-1 à
un rang moins bon (3) SANS jamais dépasser le rang d'iSGLT2 (resté à 2) : l'ORDRE final affiché ne change
donc jamais, alors que le calcul interne, si. `criteresPertinents` (`engine/relevance.ts`) ne comparait que
l'ordre des intitulés et manquait ce cas. Correctif MOTEUR (générique, aucun nom de critère/option en dur) :
`evaluateNode` expose désormais le rang retenu par option (`EvaluateNodeResult.rangs`), et la signature de
pertinence l'inclut — un critère qui change un rang interne est désormais détecté même si l'ordre affiché,
par coïncidence, ne bouge pas. Aucune valeur clinique du contenu n'a été modifiée.

- [ ] Profil (Initier, HbA1c 8,6, DFG 74, IMC 25, albuminurie normo, ASCVD non, IC non) : `Insuffisance
  cardiaque` n'est **plus estompé** (case pleinement lisible, pas de mention « sans effet »).
- [ ] Sur ce même profil, `Albuminurie` non plus (même mécanisme de rang à égalité).
- [ ] Intention = **Initier** : `Intolérance à un traitement en cours` et `Hypoglycémie récente` sont
  **masqués** (sans objet chez un patient naïf) ; `Nature de l'intolérance` l'est aussi, en cascade.
- [ ] Les cases à cocher NON cochées (`bool`) ne portent **plus** de bord ambre ni de mention « à
  confirmer » — seuls les champs **numériques** (HbA1c, DFG, IMC…) non renseignés le portent.
- [ ] Dans une section comportant **au moins 2** drapeaux (`bool`) décisifs non renseignés, un bouton
  discret **« Rien à signaler »** apparaît en pied de section ; cliquer le fait disparaître (les cases
  restent décochées, juste confirmées).
- [ ] En pied de section, une ligne discrète rappelle les champs **numériques** encore à renseigner (ex.
  « À renseigner dans cette section : HbA1c actuelle, DFG ») ; elle cohabite proprement avec le bouton
  « Rien à signaler » quand les deux sont présents.
- [ ] **Estompage sans à-coup** : modifier un champ (ex. l'IMC) ne fait plus « clignoter » (saut d'opacité)
  les champs plus haut dans le formulaire ; seule la mention textuelle grise signale un champ sans effet,
  avec un léger temps de latence (dixième de seconde) assumé — l'important est l'absence de saut visuel.
- [ ] Un champ déjà renseigné (coché/rempli) reste **toujours pleinement lisible**, même s'il redevient
  sans effet suite à une autre saisie (jamais estompé une fois `touched`).
- [ ] Aucune régression sur les profils déjà validés (metformine socle + comorbidités, désintensification,
  intolérance) : mêmes options, mêmes alertes, mêmes libellés qu'avant ce correctif.

## Correctifs de recette n°3 (2026-07-25, P3 · S7-ui Lot 3 bis — égalité affichée côte à côte)

Suite du correctif précédent : le référent a tranché que deux options à égalité de rang (ex. iSGLT2 /
AR GLP-1 sur le profil témoin) doivent être présentées **littéralement côte à côte**, pas empilées comme
si l'ordre du contenu valait hiérarchie. La signature de pertinence est passée de « rang brut » (trop
sensible : un rang qui change de 2 à 3 SANS jamais créer/rompre une égalité aurait été vu à tort comme
décisif) à « groupes d'égalité » (`groupesExAequo`, `engine/evaluateNode.ts`) — la même structure pilote
maintenant le rendu ET le calcul de pertinence, pour qu'un défaut de ce type ne puisse plus réapparaître
sous une autre forme. Aucune valeur clinique du contenu n'a été modifiée.

- [ ] Profil témoin (Initier, HbA1c 8,6, DFG 74, IMC 25, albuminurie normo, ASCVD non, IC non) : les
  options **« Introduire un iSGLT2 »** et **« Introduire un AR GLP-1 »** sont rendues **côte à côte**
  dans un encadré commun portant la mention « À égalité — aucune de ces options n'est préférable à
  l'autre » (pas empilées comme les autres options).
- [ ] Sur ce même profil, la case **« Insuffisance cardiaque »** n'est **pas estompée** (elle départage
  réellement l'égalité, cf. correctif n°2 ci-dessus).
- [ ] Cocher **« Insuffisance cardiaque »** fait passer l'affichage d'un encadré « à égalité » (iSGLT2 +
  AR GLP-1 côte à côte) à un affichage **ordonné classique** (empilé), iSGLT2 en tête — l'égalité
  disparaît visiblement, cohérente avec le rang interne qui vient de se rompre.
- [ ] Le badge **« Recommandée »** est porté par LES DEUX options du groupe de tête à égalité (iSGLT2 ET
  AR GLP-1), jamais par une seule des deux — sinon le badge contredirait l'égalité montrée à l'écran.
- [ ] Largeur réduite de la carte en 2 colonnes : le contenu (avantages/inconvénients/contre-indications)
  reste lisible ; sur écran étroit, les listes internes de la carte peuvent repasser en 1 colonne, ce qui
  est attendu (pas un bug).
- [ ] Responsive : sur écran étroit, les deux cartes à égalité repassent en pile, mais la mention
  « à égalité » reste visible au-dessus (elle ne dépend pas de la largeur d'écran).
- [ ] **Aucun changement d'affichage sur les autres nœuds** (A « Cible glycémique », B, E, F, H) : ces
  nœuds n'ont pas d'options à rang strictement égal pour les profils déjà validés, donc aucun encadré
  « à égalité » ne doit apparaître dessus — à vérifier en parcourant chaque nœud rapidement.

## Nœud « prescription » — sections par FAMILLE clinique (correctif « priorité multi-natures », 2026-07-25)

L'axe `priorite` seul mélangeait des natures d'actes différentes (rang partagé par un « ajout » et un
« allègement » de nature distincte), ce que l'encadré « à égalité » présentait à tort comme un choix
exclusif alors que ces gestes se CUMULENT (ex. « Introduire un iSGLT2 » + « Réduire la posologie du
sulfamide »). Ajout d'un champ CONTENU `Option.famille` (présentation pure, aucun effet moteur) : les 23
options du nœud `prescription` sont qualifiées (`content/noeuds/diabete-type-2/prescription.yaml`), l'écran
rend une section par famille, et le calcul d'égalité (`groupesParFamille`, `engine/evaluateNode.ts`) est
désormais CONFINÉ à l'intérieur d'une même famille. Build + typecheck + tests unitaires OK ; **visuel à
valider par le référent**, notamment le point badge non tranché ci-dessous.

- [ ] **Ordre des sections — NE peut PAS être garanti fixe, contrairement à ce qu'on pourrait attendre** :
  `groupesParFamille` ordonne les familles par leur PREMIÈRE apparition dans `applicable`, qui est déjà
  trié par `priorite` CROISSANT (rang le plus bas d'abord). Or une même famille contient des options à des
  rangs différents (ex. « Traitement à alléger » va de rang 1 à rang 4 ; « À faire d'emblée — sécurité » va
  de rang 1 à rang 3) : l'ordre des sections dépend donc du rang MINIMUM atteint, parmi les options
  applicables de chaque famille, POUR CE PATIENT PRÉCIS — pas d'un ordre unique valable pour tous les
  profils. Vérifié empiriquement (évaluation directe du moteur, 5 profils) :
  - Profil « déjà traité, metformine seule, intensifier » (socle + options d'ajout seulement) :
    **Socle → Agent à ajouter** — Sécurité et Alléger absentes (aucune option applicable), donc invisibles.
  - Profil BASE `intensifier` (test existant) : **Socle → Agent à ajouter**.
  - Profil DFG 25 sous metformine+sulfamide (vignette S1) : **Sécurité → Agent à ajouter** (Metformine
    socle EXCLUE par DFG < 30, donc absente).
  - Profil complexe (IC, ASCVD, gliptine+sulfamide en place, intolérance) : **Socle → Agent à ajouter →
    Alléger → Sécurité → Corriger/remplacer** — Sécurité arrive ICI en 4e position, après Alléger, parce
    que sa seule option applicable pour ce patient (« Réduire la posologie de la metformine ») est de rang
    3, alors qu'Alléger a des options de rang 1-2 applicables.
  Conclusion : l'ordre « Socle → Sécurité → Agent à ajouter → Corriger/remplacer → Alléger → Aucun geste »
  demandé par la consigne n'est vérifié QUE pour certains profils (ceux où le membre de rang le plus bas de
  chaque famille est bien atteint dans cet ordre) ; il peut être différent pour d'autres patients bien
  réels (ex. le profil complexe ci-dessus). Le YAML n'a volontairement PAS été réordonné (hors périmètre :
  aucun ordre fixe n'existerait de toute façon avec l'implémentation demandée, `groupesParFamille` triant
  par 1re apparition dans `applicable`). **Décision référent nécessaire** : soit accepter un ordre de
  section VARIABLE selon le patient (actuel), soit demander un ordre de section FIXE indépendant du rang
  (ex. trié par 1re apparition dans `node.options` plutôt que dans `applicable` — changement d'implémentation
  hors périmètre de cette tâche, à ne PAS faire sans validation).
- [ ] Sur un profil DFG < 30 sous metformine + sulfamide (ex. vignette S1/S2 des tests, DFG 25) :
  **« Introduire un iSGLT2 »** et **« Réduire la posologie du sulfamide / du glinide »** ne sont PLUS
  jamais présentées comme équivalentes/à égalité même si leur rang coïncide (elles apparaissent dans des
  sections différentes : « Agent à ajouter » vs « Traitement à alléger »).
- [ ] Profil témoin recette référent (Initier, HbA1c 8,6, DFG 74, IMC 25, albuminurie normo, ASCVD non, IC
  non) : **« Introduire un iSGLT2 »** et **« Introduire un AR GLP-1 »** restent à égalité, mais désormais
  À L'INTÉRIEUR de la section « Agent à ajouter — en choisir un » (pas de changement visible pour ce cas).
- [ ] La mention de l'encadré d'égalité est désormais **neutre** : « À égalité — même niveau de priorité »
  (remplace « aucune de ces options n'est préférable à l'autre », faux pour des gestes cumulables). La
  nuance clinique (« en choisir un » vs « cumulables ») est maintenant portée par le TITRE DE SECTION
  (libellé de famille), pas par l'encadré.
- [ ] **Badge « Recommandée » — à trancher par le référent** : la politique de badge (1re option non-socle
  de la liste triée par rang) N'A PAS été modifiée, mais peut désormais atterrir sur une option de la
  famille « Sécurité » plutôt que sur le choix d'agent visé. Exemple concret : profil DFG 25, sous
  metformine + sulfamide, intention intensifier, HbA1c 8 → la metformine socle est exclue (DFG < 30), donc
  la 1re option non-socle de la liste triée est **« Arrêter la metformine (DFG < 30) »** (rang 1, famille
  Sécurité) — le badge « Recommandée » atterrit sur ce groupe (avec « Arrêter le sulfamide », même rang),
  jamais sur une option de la famille « Agent à ajouter ». Ce défaut est ANTÉRIEUR à cette tâche (il existe
  dès que `priorite` place une option de sécurité en tête) ; il devient simplement plus visible avec les
  sections par famille. Décision demandée : la politique de badge doit-elle exclure la famille « Sécurité »
  (comme elle exclut déjà le socle « toujours ») ?
- [ ] **Aucun changement visuel sur les 4 autres nœuds** (« Cible glycémique », insuline, statine, rhd) :
  aucun ne déclare `famille` sur ses options → repli « famille unique sans libellé », rendu identique à
  avant cette tâche (pas de titre de section supplémentaire, pas de changement de regroupement).

## Cadrage de nœud (D24) + scission sulfamide/glinide (2026-07-26, 5e série)

> Build + typecheck + **498 tests unitaires OK, aucun `expected fail`** ; **visuel à valider par le
> référent.** Nœuds concernés : `insuline` et `statine` (cadrage), `prescription` (scission).

- [ ] **Bloc de cadrage** sur `insuline` et `statine` : il apparaît **sous le titre du nœud, AVANT le
  formulaire** — pas sous le formulaire là où sont les alertes. C'est le point de D24 : on le lit avant
  de saisir quoi que ce soit.
- [ ] **Il ne ressemble PAS à une alerte** : pas de fond coloré, pas de bordure de vigilance — un simple
  filet latéral et un texte en gris. Si l'œil le prend pour un avertissement, le correctif a échoué :
  c'est exactement le défaut qu'il devait supprimer (un avertissement affiché à tout le monde, qui
  dévalue les vraies alertes juste en dessous).
- [ ] **Les alertes conditionnelles n'ont pas bougé** : sur `insuline` comme sur `statine`, la zone
  d'alertes sous le formulaire contient toujours ce qu'elle contenait, moins l'énoncé déplacé. Vérifier
  qu'elle ne s'est pas vidée à tort (`statine` : l'alerte dialyse doit rester ; `insuline` : les alertes
  MCG et DFG < 45 doivent rester).
- [ ] **Lisibilité du cadrage sur mobile / petite largeur** : le filet latéral et l'indentation ne doivent
  pas écraser le texte ni créer de débordement horizontal.
- [ ] **Scission sulfamide/glinide** (`prescription`) : profil *glinide seul, DFG 25, hypoglycémie
  récente* → la carte **« Réduire la posologie du glinide »** est proposée, avec son alerte d'option sur
  l'exposition doublée ; aucune carte sulfamide. Même profil avec *sulfamide seul* → la réduction est
  **écartée** (visible avec son motif, R4) et **« Arrêter le sulfamide »** prend le relais.
- [ ] **Les deux cartes ne se confondent pas** : leurs intitulés ne diffèrent que par le nom de la
  molécule — vérifier qu'un praticien pressé ne peut pas les lire comme un doublon. Si c'est le cas,
  c'est un point à corriger en libellé, pas en logique.

## Écran de module RHD (D22) — réalisation (2026-07-27)

> Build + typecheck + **511 tests OK** (dont 5 sur l'écran de module et 8 sur l'intégrité module ↔ nœuds) ;
> **visuel à valider par le référent.** Nouveau chemin : Aide à la décision → « Règles hygiéno-diététiques »
> → un des deux axes.

- [ ] **La liste du domaine montre UNE entrée « Règles hygiéno-diététiques »** (avec, en sous-titre, les
  deux nœuds qu'elle contient) — et non plus deux entrées séparées. Les quatre autres nœuds sont
  inchangés, à plat.
- [ ] **L'ordre de la liste n'a pas bougé** : le module prend la place qu'occupait le premier nœud RHD.
- [ ] **L'écran de module affiche le cadrage partagé** (3 énoncés) au-dessus de la question d'orientation,
  dans le même style neutre que le cadrage d'un nœud — c'est le même objet, seule la portée change.
- [ ] **La phrase « cette question oriente, elle ne verrouille rien » est lisible** et comprise comme
  telle. Point à surveiller : deux gros boutons se lisent spontanément comme un choix exclusif. Si vous
  avez l'impression de devoir choisir un axe et de renoncer à l'autre, le texte a échoué.
- [ ] **Les indices d'orientation aident réellement à choisir** — ce sont des repères de consultation, pas
  des critères. Ils viennent d'une rédaction non clinique : à corriger si l'un d'eux sonne faux.
- [ ] **Depuis un nœud RHD, le retour pointe vers le module** (« ← Module : Règles hygiéno-diététiques »)
  et non vers le domaine : travailler les deux axes dans la même consultation doit rester fluide.
- [ ] **Aucune saisie sur l'écran de module** — c'est le garde-fou R1 (le module oriente, il n'enchaîne
  pas). Un test le tient, mais confirmez que rien ne suggère à l'écran qu'une saisie serait attendue ici.
- [ ] **Arbitrage à rendre** : D22 prévoyait aussi un *socle de critères de terrain partagé*
  (`fragilite`, `age`…) saisi une seule fois. Il n'est **pas** livré, car il suppose de transmettre une
  saisie d'un écran à l'autre — exactement le chaînage que le garde-fou R1 interdit. Le vouloir suppose
  de rouvrir ce garde-fou. À trancher.

## Arbitrages référent — 2ᵉ lot d'incertitudes (2026-07-27)

> Build + typecheck + **515 tests OK** ; **visuel à valider par le référent.**

- [ ] **`insuline` — six sections au lieu d'une liste à plat** : « Sécurité — à corriger d'abord » →
  « Instaurer l'insuline » → « Intensifier le traitement » → « Ajuster le schéma en place » →
  « Alléger le schéma » → « Aucun geste — surveiller ». Vérifier que la mention « à égalité » ne
  rapproche plus jamais un geste de sécurité et un geste d'escalade.
- [ ] **Aucune section d'`insuline` ne porte « en choisir un »** : toutes les familles sont déclarées
  cumulables. Point à trancher à l'usage — « Instaurer l'insuline » regroupe « Envisager un GLP-1
  avant/avec », « Initier une basale » et « Choisir un analogue de 2ᵉ génération » : si à l'écran ces
  trois cartes se lisent comme trois routes concurrentes plutôt qu'un geste et ses modalités, la famille
  doit passer `exclusive: true`.
- [ ] **`rhd-alimentation` — la carte de pesée a disparu**, remplacée par « Se repérer aux proportions
  dans l'assiette plutôt qu'aux quantités pesées ». Vérifier que le texte ne suggère aucune fraction
  chiffrée (aucune n'est sourcée) et qu'il reste négociable en une phrase.
- [ ] **`rhd-activite-physique` — patient avec neuropathie ou mal perforant plantaire** : la famille
  « Pratique structurée » disparaît (verrou d'effort) ET une alerte explique ce qui reste possible
  (membres supérieurs, travail en décharge). Le point à juger : un praticien lisant cet écran
  comprend-il qu'il reste des pistes, ou l'écran donne-t-il l'impression d'un patient sans solution ?
- [ ] **`prescription` — position « au-dessus » + intention « optimiser »** : l'outil propose toujours
  socle + poursuite, mais une alerte dit maintenant pourquoi et indique l'issue (« déclarer intensifier »).
  Vérifier que le ton n'est pas culpabilisant — c'est une explication, pas un reproche de saisie.

## Arbitrages référent — 3ᵉ lot : preuve + red-team (2026-07-27)

> Build + typecheck + **532 tests OK** ; **visuel à valider par le référent.**
>
> Ce lot applique 8 arbitrages pris après une collecte de preuve puis une re-vérification adversariale
> (`docs/decision/validation/chantier-2026-07-27/`). Trois nœuds touchés : `statine`, `prescription`,
> `rhd-alimentation`.

### `statine` — le point le plus lourd du lot

- [ ] **Patient avec ASCVD établie + intolérance déclarée « avérée »** : l'écran ne doit plus proposer
      « atorvastatine 40-80 mg », mais la carte « Statine indisponible — alternatives hypolipémiantes ».
      C'est le cœur du lot : jusqu'ici l'outil prescrivait un médicament que le dossier du patient
      déclare impossible, avec une simple alerte à côté.
- [ ] **Le même patient, mais intolérance « rapportée »** : l'écran doit au contraire proposer la
      statine, avec l'alerte de réintroduction. Vérifier que la différence entre les deux écrans se lit
      immédiatement — c'est toute la valeur du passage de 2 à 3 valeurs.
- [ ] **La carte terminale** : son ton est-il utilisable en consultation ? Elle porte beaucoup
      d'information (ézétimibe, acide bempédoïque, anti-PCSK9, remboursement, divergence France/ESC).
      Si elle est illisible en situation, c'est le signe qu'il faut la scinder — dites-le.
- [ ] **Nouveau champ « CK > 5 N »** dans le groupe « Statine en cours » : il n'apparaît QUE si vous
      déclarez qu'aucune statine n'est en place. Vérifier que le libellé est clair sur ce qu'il demande
      (CK avant initiation, pas sous traitement) et que sa présence ne surcharge pas le formulaire.
- [ ] **Point à trancher à l'usage** : la carte terminale s'affiche aussi pour un patient dont la seule
      anomalie est un CK élevé, avec une alerte disant que la conduite est d'abord diagnostique. Est-ce
      le bon geste, ou faudrait-il une carte distincte « explorer avant de conclure » ?

### `prescription`

- [ ] **Sujet déclaré fragile, palette glycémique ouverte** : le sulfamide doit avoir disparu des
      propositions et apparaître dans les options écartées, avec son motif. ⚠ Sur-blocage assumé : la
      SFD dit « éviter » chez le fragile et « ne jamais » chez le dépendant, et le nœud n'a pas de
      catégorie « dépendant ». Si le blocage vous paraît trop large en consultation, c'est le signal
      qu'il faut créer un statut gériatrique à trois valeurs.
- [ ] **Patient à DFG 25 sous répaglinide, HbA1c 6,8 %** : la désintensification doit désormais être
      proposée (plancher SFD à 7 %). Contre-épreuve à faire : le même patient à DFG 50 ne doit RIEN
      déclencher à 6,8 %.
- [ ] **La vildagliptine remplace la sitagliptine sous DFG 30**, en trois endroits. ⚠ **Point de fait à
      confirmer par vous** : la SFD écrit que la forme sitagliptine 25 mg n'est pas commercialisée en
      France. Le red-team n'a pas pu ouvrir la BDPM. Si le dosage existe bien en officine, ces trois
      libellés sont à reverser en bloc.

### `rhd-alimentation`

- [ ] **Patient avec un signe d'appel TCA** : deux cartes d'orientation doivent maintenant coexister —
      le diététicien ET l'avis spécialisé en TCA. Vérifier qu'elles se lisent comme complémentaires
      (c'est ce qu'écrit la HAS) et non comme deux options concurrentes entre lesquelles choisir.

## Repli d'affichage + reprise du nœud alimentation (2026-07-27, 4ᵉ lot)

> Build + typecheck + **540 tests OK** ; **visuel à valider par le référent.**

- [ ] **Le repli, sur `rhd-alimentation` avec un patient qui déclenche beaucoup de pistes** : les pistes
      du meilleur rang restent dépliées, les autres passent sous « Autres pistes possibles (N) ». Le
      point à juger : le bouton se voit-il assez ? Un praticien doit comprendre qu'il reste des pistes,
      pas croire que l'écran est complet.
- [ ] **Le seuil de 4 options** : en dessous, rien n'est replié. Vérifier sur un patient peu chargé que
      l'écran ne montre pas un bouton « Autres pistes possibles (1) », qui serait ridicule.
- [ ] **`prescription` et `insuline` sont aussi concernés** — le repli est générique, il ne connaît aucun
      nœud par son nom. À vérifier en priorité : qu'aucune carte de SÉCURITÉ ne se retrouve repliée.
      Elles sont toutes au rang 1, donc dépliées par construction, mais c'est le point qui coûterait le
      plus cher s'il était faux.
- [ ] **`statine` ne doit RIEN replier** (nœud à sortie unique, `priorite` ignoré). Contre-épreuve.
- [ ] **La piste viande/charcuterie** : « Réduire la charcuterie et la viande rouge (porc, bœuf, veau,
      mouton, agneau, abats) ». Le fromage a disparu, le chiffre aussi, la volaille aussi. Vérifier que
      l'intitulé se négocie en une phrase et qu'il ne se lit pas comme une interdiction.
- [ ] **Patient avec un signe d'appel TCA** : il reçoit désormais les mêmes pistes que les autres, PLUS
      ses deux orientations (diététicien, avis spécialisé). Le point à juger : cet écran vous paraît-il
      cliniquement juste, ou manque-t-il une mise en garde maintenant que plus rien n'est bloqué ?

## Garde-fou CK repris sur source primaire (2026-07-27, 5ᵉ lot)

> Build + typecheck + **547 tests OK** ; **visuel à valider par le référent.**
>
> Les deux documents NICE que vous avez récupérés ont corrigé quatre points du lot précédent, dans la
> même journée. Le champ CK n'est plus le même, et une option nouvelle passe devant toutes les autres.

- [ ] **Le champ CK n'apparaît plus par défaut.** Il ne se montre qu'après avoir déclaré une intolérance
      « rapportée » ou « avérée » — le parcours NHS écrit de ne pas doser les CK chez un asymptomatique.
      Vérifier que son libellé (« CK, en multiples de la normale — 0 = non dosé ») est sans ambiguïté :
      un praticien doit pouvoir le laisser à 0 sans croire qu'il affirme une CK normale.
- [ ] **Patient sous statine, CK à 6 fois la normale** : l'écran doit afficher « Interrompre la statine
      4 à 6 semaines et réévaluer » **et rien d'autre** — même chez un patient avec ASCVD établie, pour
      qui la carte de haute intensité serait normalement la première. C'est voulu : cette option est
      placée en tête du nœud.
- [ ] **Le même patient à 20 N** : une alerte demande de vérifier la fonction rénale. **À 60 N** : elle
      bascule sur la rhabdomyolyse et l'avis urgent, et l'alerte rénale disparaît. Les deux ne doivent
      jamais s'afficher ensemble — un message de temporisation dans une situation urgente serait grave.
- [ ] **La carte d'interruption porte la divergence France / NHS** sur l'arrêt définitif au-delà de 10 N.
      Le point à juger : le texte dit-il clairement que l'outil a tranché, et dans quel sens ? Il ne doit
      pas laisser croire à un consensus.
- [ ] **Le protocole de réintroduction** (arrêt 4-6 semaines, CK normalisées, 2 semaines sans symptôme,
      reprise à atorvastatine 10-20 ou rosuvastatine 5-10, titration à 8 semaines) est-il lisible en
      consultation, ou faut-il le scinder ? Il porte aussi sa réserve de provenance — document de 2022,
      date de révision dépassée. Vérifier que cette réserve ne noie pas la conduite à tenir.

## Lot 1 du chantier — la détermination (2026-07-27, soir)

> Build + typecheck + **604 tests OK** ; **visuel à valider par le référent.**
>
> Ce lot corrige les défauts **A, B, G, J** de votre recette sur le déployé, et **un défaut de
> production qu'aucun des cinq rapports n'avait vu** — trouvé par un invariant écrit le même soir.
> Rien de clinique n'a bougé : ce sont des corrections de PORTÉE et d'AFFICHAGE.

### Le défaut de production, à vérifier en premier

- [ ] **`statine`, patient de prévention secondaire sans intolérance déclarée** (ASCVD établie, pas de
      statine en cours, aucun symptôme musculaire). **Avant ce lot, l'écran ne proposait RIEN** : le nœud
      s'arrêtait en attendant une valeur de CK dans un champ qu'il ne montre pas. Vérifier qu'il affiche
      désormais « Statine de haute intensité — prévention secondaire ». *(Défaut introduit le matin même
      avec le critère CK ; il était déployé.)*

### Défaut A — le primer n'était jamais « répondu »

- [ ] **Formulaire vierge, n'importe quel nœud** : aucun bouton segmenté n'est allumé, et les listes
      déroulantes affichent « — ». Avant, la première valeur s'affichait sélectionnée sans qu'on ait
      cliqué, et le moteur, lui, tenait le champ pour non répondu.
- [ ] **`insuline`, formulaire vierge puis clic sur « Naïf d'insuline »** : le bloc MCG (GAJ, TBR, doses)
      doit être **masqué** dans les deux cas — c'est ce que les 8 `visible_si` du 26/07 demandaient, et
      qu'ils ne faisaient plus.
- [ ] **`prescription`, intention « Initier »** : « Traitements en cours » doit disparaître.
- [ ] Les champs `enum` décisifs non répondus portent maintenant le marqueur ambre « · à confirmer ».
      Le point à juger : est-ce trop présent sur un formulaire vierge ?

### Défaut B — l'écran concluait pendant que le moteur suspendait son jugement

- [ ] **`insuline`, formulaire vierge** : la carte « Poursuivre le schéma d'insuline en cours »,
      badge « Recommandée », **ne doit plus apparaître**. Seul le bloc « en attente » s'affiche, avec les
      champs à renseigner. Même chose sur `prescription` avec « Poursuivre le traitement en cours ».
- [ ] Le point à juger : **un écran qui ne montre que « en attente » est-il acceptable en consultation**,
      ou faut-il une phrase d'accueil qui explique pourquoi rien n'est encore proposé ?

### Défaut J — une dose non calculable disparaissait en silence

- [ ] **`insuline`, « Initier une insuline basale », sans avoir saisi le poids** : la carte doit afficher
      « Doses non calculées : Dose initiale (0,1 U/kg) — à renseigner : Poids ». Avant, elle s'affichait
      sans aucune dose et sans rien dire.
- [ ] Le point à juger : le libellé et la couleur (ambre, le même registre que « à confirmer ») sont-ils
      justes, ou faut-il un lien cliquable vers le champ ?

### Défaut G — « en attente » sur un champ que l'écran n'affiche pas

- [ ] **`prescription`, aucune intolérance déclarée** : plus aucune option ne doit réclamer « Nature de
      l'intolérance ». Vérifier notamment « Réduire la posologie de la metformine ».

### Un effet de bord à juger

- [ ] Le « pourquoi » de certaines cartes de `statine` s'allonge d'un terme (« une intolérance est
      rapportée ET les CK dépassent… »). C'est le garde de portée, désormais visible dans la
      justification. À juger : information utile, ou bruit à masquer à l'affichage ?

## Recette visuelle du lot 1 — PASSÉE le 2026-07-27

Menée par un agent muni d'un navigateur, sur le serveur local au commit `7a14689`.
Rapport : `docs/decision/validation/chantier-2026-07-27/recette-visuelle-lot1.md`.

**Les points ci-dessus sont vérifiés à l'écran**, sauf deux, tous deux instruits depuis :

- le bloc MCG visible sur un formulaire `insuline` **vierge** : **comportement voulu** (R7, un
  `visible_si` indéterminé s'affiche). C'est mon énoncé de recette qui était faux, pas l'application.
  La question d'ergonomie qu'il soulève est portée en arbitrage **A7**.
- « Nature de l'intolérance » encore réclamé (défaut G) : **défaut réel**, moitié résiduelle que le
  lot 1 n'avait pas vue — **corrigé**, avec l'invariant **I11** qui l'interdit désormais.

### Reste à valider à l'œil après le correctif du défaut G

- [ ] **`prescription`** — patient DFG 45, metformine seule, « Rien à signaler » sur les intolérances,
      dose de metformine laissée vide : le bloc « en attente » doit réclamer **« Dose metformine »
      seule**, plus « Nature de l'intolérance ».
- [ ] **`insuline`, formulaire vierge** — le bloc « en attente » ne doit plus réclamer que
      **« Situation d'insulinothérapie »** sur chacune de ses lignes, au lieu d'énumérer jusqu'à
      9 champs. C'est l'effet de bord attendu du correctif ; il répond en partie à la question ouverte
      n° 3 du rapport (densité de ce bloc).
- [ ] L'ordre des champs dans « à renseigner : … » suit désormais **l'ordre du formulaire**. À juger :
      se remplit-il de haut en bas sans revenir en arrière ?

## Passage `statine` — A1 + A2 (2026-07-27, soir)

Seuil CK porté de 4 N à 5 N, bande 4‑5 N ouverte, option « Interrompre » scindée.
Mesure sur les 180 profils figés : **27 changent d'option**, **0 patient à CK > 5 ne gagne une
prescription de statine**, et les **9 profils de la bande 4‑5 N passent de « aucune conduite » à une
conduite**. C'est la sous‑prescription corrigée.

- [ ] **Le défaut principal** — intolérance « rapportée », CK **4,5**, statine déjà en place **non**,
      ASCVD **oui** : la carte **« Débuter la statine à dose plus faible »** doit s'afficher.
      Avant ce passage, l'écran affichait « Statine indisponible ».
- [ ] **Sous traitement** — mêmes valeurs mais statine déjà en place **oui** : plus d'interruption ; la
      carte habituelle s'affiche, accompagnée de l'alerte bleue **« CK élevées mais au‑dessous de 5 fois
      la normale : il n'y a pas lieu d'interrompre »**.
- [ ] **CK 6, statine en place, intolérance rapportée** : « Interrompre 4 à 6 semaines et réévaluer ».
      Avec intolérance **avérée** : « Interrompre — la classe reste indisponible », et cette carte doit
      porter **elle‑même** l'orientation ézétimibe / acide bempédoïque / anti‑PCSK9.
- [ ] Les textes annonçant « 5 fois la normale » sont désormais cohérents avec le seuil appliqué
      (incohérence relevée à l'écran par la recette visuelle, hors périmètre 1).

### ⚠ Un point d'ergonomie à juger, conséquence du passage

- [ ] **Formulaire `statine` vierge** : le nœud halte désormais plus tôt, sur la nouvelle option, et
      affiche « **Débuter la statine à dose plus faible** — à renseigner : Intolérance aux statines,
      CK ». C'est correct au sens du moteur (on n'affirme rien avant de savoir) et `applicable` reste
      vide comme avant — mais cet intitulé est la **première chose que lit le praticien en ouvrant le
      nœud**, alors qu'il ne le concerne probablement pas. Avant, il lisait « Discuter la statine ».
      À juger : acceptable, ou faut‑il repenser ce que montre un formulaire vierge ?

## A8 + A9 (2026-07-27, soir)

- [ ] **A8 — compteur et marqueurs congruents.** Le nombre annoncé par le bandeau est désormais
      TOUJOURS le nombre de mentions « · à confirmer » visibles (invariant testé). Vérifier sur
      `statine` que le cas relevé en recette a disparu : plus de compteur sans repère.
- [ ] **Densité à juger sur pièce.** Sur un formulaire VIERGE, la part de champs marqués monte
      (`insuline` 64 % → 95 %, `rhd-alimentation` 89 % → 100 %). Après un clic « Rien à signaler » par
      section, elle redevient **exactement** ce qu'elle était avant A8 — le surcoût est entièrement
      transitoire (`mesure-densite-marqueurs.md`). Le point de jugement est donc : **l'ouverture d'un
      nœud décourage-t-elle ?**
- [ ] **A9 — lecteur d'écran.** Les boutons segmentés portent `aria-pressed`. À vérifier avec un
      lecteur d'écran : la valeur retenue est annoncée, et aucune ne l'est tant que rien n'est cliqué.
      Aucun changement visuel attendu.

## A7 — repère de départ (2026-07-27, soir)

Le champ dont la réponse commande l'affichage des autres porte un **liseré bleu en haut** et la
mention **« · détermine la suite »**, tant qu'il n'a pas reçu sa réponse. Entièrement dérivé du
contenu : est pilote tout critère qu'un autre cite dans son `visible_si`. Détecté sans un seul nom en
dur — `intention` sur `Traiter…`, `situation_insuline` sur `insuline`, `intolerance_statine` sur
`statine`.

- [ ] **`insuline` vierge** : « Situation d'insulinothérapie » doit se distinguer des 32 autres champs.
      Le repère disparaît dès qu'une situation est cliquée.
- [ ] **`Traiter…` vierge** : idem sur « Intention thérapeutique ». Une fois répondu, « Traitements en
      cours » apparaît et porte à son tour le repère (il commande d'autres champs).
- [ ] **`statine` vierge** : « Intolérance aux statines » est marqué — c'est le champ dont l'absence de
      réponse fait halter le nœud depuis le passage A1+A2. À juger : cela suffit-il à corriger le point
      d'ergonomie signalé plus haut (l'écran ouvre sur « Débuter la statine à dose plus faible ») ?
- [ ] **Deux registres de couleur** : bleu = « commencez par là », ambre = « il manque une réponse ».
      Un champ peut porter les deux. À juger : se distinguent-ils bien ?
- [ ] **`cible-glycemique` et les deux nœuds RHD** n'ont aucun `visible_si` : aucun repère ne doit
      apparaître, l'écran est inchangé.

## A5 — carte allégée (2026-07-27, soir)

Le corps de la carte passe derrière un dépli natif (`<details>`, ouverture au clic/tap, jamais au
survol). **Fermé par défaut** — une carte ouverte n'allège rien.

**Reste toujours visible** : intitulé, badges, contre-indications, alertes d'option, doses (calculées
**et** « non calculées »), « Proposé parce que », motif du rang.
**Passe dans le dépli** : effet attendu, délai du bénéfice, avantages, inconvénients.

Le dépli est placé **en fin de carte** : l'ouvrir ajoute du contenu SOUS le socle de sécurité, sans
jamais le repousser hors de l'écran.

- [ ] **`Traiter…`, intensification banale** (metformine seule, HbA1c 8,5, DFG 80, sans comorbidité) —
      le profil que la recette a mesuré à 5 cartes de ~1 écran chacune. Mesurer à nouveau : combien
      d'écrans pour les 5 cartes ? L'estimation était 0,3 écran par carte.
- [ ] **Le dépli s'ouvre-t-il au doigt sans difficulté ?** Le libellé « Effet attendu, délai, avantages
      et inconvénients » est-il assez clair pour donner envie de l'ouvrir quand il le faut ?
- [ ] **Aucune contre-indication, alerte ou dose ne doit se trouver dans le dépli.** C'est garanti par
      l'invariant I12 sur les six nœuds, mais à vérifier une fois de l'œil.
- [ ] **Deux arbitrages que j'ai pris et qu'il faut confirmer** : les « Doses indicatives » restent
      visibles (incohérent de montrer « dose non calculée » et de cacher la dose calculée) ; « Ce rang
      tient compte de » aussi (une ligne, et c'est ce qui rend le tri auditable).
- [ ] **Cartes ouvertes en même temps** : le navigateur garde chaque dépli indépendant. Faut-il un
      « tout déplier » ? À juger à l'usage.
