# VALIDATION.md — checklist visuelle / UX (passe humaine) — ebm-msp

> Validation **visuelle** déléguée à l'humain, **non bloquante** pour les commits.
> L'exécutant consigne ici la ligne « visuel : » de chaque tâche du plan — il ne la vérifie PAS
> lui-même (pas de navigateur, pas de capture). Légende : [ ] à valider · [x] OK · [!] à corriger.
> **Purge** : supprimer les blocs entièrement `[x]` après la passe humaine.
> Un bloc par écran/module courant. Passage à l'échelle : router la validation propre à un
> sous-domaine dans `docs/<sous-domaine>/VALIDATION.md` si ce fichier gonfle.

## Purge du 2026-07-28

697 lignes accumulées du 2026-07-22 au 2026-07-27 (Shell/Accueil initiaux, nœuds A/E/F/D, refonte du
flux de saisie en 4 lots, familles cliniques, cadrage D24, module RHD, repli d'affichage, garde-fou CK,
lot de détermination, passage statine) purgées sur demande du référent — **aucune n'avait été cochée
`[x]`**, la règle de purge du fichier ne s'était donc jamais déclenchée d'elle-même. Le contenu réel
(quels écrans, quels profils patients, quels défauts trouvés à chaque lot) reste entier dans l'historique
git (`git log -- VALIDATION.md`) et dans les rapports de `docs/decision/validation/`.

Aucun bloc n'est resté ouvert à recopier ici : tout ce qui restait effectivement à trancher (arbitrages
référent, seuils cliniques, validation finale) est suivi dans `STATUS.md`/`TASKS.md`, pas dans une
checklist visuelle — la nature de ces items n'en est plus une (recette d'écran) mais une décision
clinique ou une passe de recherche.

Prochaine entrée : au prochain lot livré, un bloc daté, avec ce qui est nouveau à l'écran et les
scénarios patients qui le vérifient — comme les blocs purgés ci-dessus, dont c'était la forme.

## 2026-07-28 — Plan P4 (six correctifs D30-D33/T-025)

Vérifié à l'écran sur `ebm-msp.vercel.app` (déploiement du commit `036f4aa`), pas seulement dans le code
— deux passes : recette navigateur de contrôle (S8, protocole `PROMPT-recette-navigateur.md`) et recette
« praticien naïf » complémentaire (8 vignettes patient écrites en aveugle, hors accès `content/`/`src/`).

- [x] D30 (formulaire vierge → zéro carte) — CONFORME
- [x] D32 (halte OFM n'écrase plus une option de sécurité) — CONFORME
- [x] D31 (contrainte violée suspend tous les résultats) — CONFORME
- [x] D-06 (pré-remplissage calculé applique ce qu'il annonce, jamais n'écrase une saisie) — CONFORME
- [x] D33 (« Nouveau patient » purge la mémoire) — CONFORME, réserve méthodo : clic natif non testé tel
      quel (outil de test), et la passe praticien naïf signale l'absence de retour visuel après la purge
      (nouvel item, `TASKS.md`)
- [x] T-025 (contre-indications remontées, registre de sécurité) — CONFORME, test des 20 secondes réussi

Rapports complets : `docs/decision/validation/recette-navigateur-2026-07-28-controle-P4.md`,
`docs/decision/validation/recette-praticien-naif-2026-07-28.md`,
`docs/decision/validation/BILAN-P4-2026-07-28.md` (synthèse + réconciliation). Ce que la clôture a trouvé
en plus (nouveau défaut grave, décisions référent, dette connue confirmée) est suivi dans `STATUS.md` et
`TASKS.md` — ce n'est plus une checklist visuelle, c'est un arbitrage produit/clinique.

## 2026-07-28 (suite) — Plan P5 (trois correctifs mécaniques issus de la clôture P4)

**Non vérifié à l'écran** — poussé directement sur décision de Thibault, sans passe de contrôle navigateur
(chantier plus contenu que P4). Les trois scénarios ci-dessous restent **à valider** dès qu'un passage sur
le déployé est possible.

- [ ] **T-032** — sur n'importe quel nœud, répondre à un champ segmenté puis re-cliquer le même bouton :
      doit redevenir « à confirmer », aucune carte ne doit plus s'appuyer sur cette valeur.
- [ ] **T-033** — `insuline`, cocher « pas de capteur » (`mcg_disponible = false`) : les 4 champs (TBR,
      TBR sévère, CV glycémique, profil glycémique) doivent disparaître de l'écran, résultat cohérent.
- [ ] **T-034** — cliquer « Nouveau patient », confirmer : un retour visuel (« Session vidée » ou
      équivalent) doit être visible ~2 secondes.

Commits : `bc59e2a`, `7657f4a`, `806fdb9`. Détail des sessions : `plans/P5/`.

## 2026-07-29 — Plan P6 (shell accordéon + colonne sticky, badge verbe, 6 nœuds)

Vérifié à l'écran en **local** (`npm run dev`), pas sur le déployé — le code a été poussé après cette
validation, pas avant (à la différence de P4). Deux passes : recette initiale (S6) sur les 6 nœuds, puis
complément ciblé (S7) après correctifs des deux défauts trouvés.

- [x] Shell deux colonnes + accordéon + chips de navigation, 6 nœuds vierges, desktop et mobile (375px) —
      CONFORME
- [x] Badge verbe d'action (bordure colorée) sur `Traiter`/`Insulinothérapie`, absent ailleurs — CONFORME
- [x] Colonne sticky sur nœud à un seul gagnant (`statine`), rejeu du profil de sécurité D32 — CONFORME
- [x] Groupement `Insulinothérapie` en 6 sections (première apparition à l'écran) — CONFORME
- [!] Contre-indications repliées dans le `<details>` (test des 20 secondes) — **DÉFAUT grave initial**
      (rien retenu sur « ce que je ne dois pas faire »), corrigé (icône, couleur d'alerte dédiée,
      décompte) puis **revérifié CONFORME**
- [!] CTA flottant mobile recouvrant le bouton « Suivant » — **DÉFAUT mineur initial**, corrigé (padding
      réservé), **CONFORME en usage normal avec une réserve mineure résiduelle** (défilement forcé
      au-delà du point d'arrêt naturel — suivi dans `TASKS.md`, non bloquant)

Rapport complet : `docs/decision/validation/recette-navigateur-2026-07-29-P6.md`. À faire à la prochaine
occasion (pas bloquant) : confirmer sur le déployé une fois poussé — S6/S7 ont déjà couvert le shell en
détail, une repasse complète n'est pas nécessaire, un contrôle rapide suffit.
