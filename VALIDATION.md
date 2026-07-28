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
