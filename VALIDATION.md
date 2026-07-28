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
