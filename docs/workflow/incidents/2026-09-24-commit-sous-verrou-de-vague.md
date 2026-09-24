# Incident workflow — 2026-09-24 — commits de session passés sous `.claude/wave.lock`

- Projet : ebm-msp · Workflow : v0.43.0 au lancement de la vague (v0.44.0 à la collecte) · Plan : P16/S2
- Environnement : Desktop · sous-agent (`session-high`, vague 2 parallèle S2 · S3)
- Étape : `/orchestrer-plan` Étape 1, collecte de fin de vague · Nature : orchestration

## Symptôme
Pendant la vague 2 (verrou posé à 11:31), S2 a créé deux commits de tâche (11:55, puis T3) alors que
`pretooluse-git.mjs` doit refuser tout `git commit` sous verrou. Un troisième commit,
`chore(workflow): synchronisation v0.44.0` (12:01), a été fait par une autre session pendant la vague
et a poussé les commits de S2 sur `origin/main`. L'orchestrateur ne l'a constaté qu'à la collecte.

## Preuve
- `ls -la .claude/wave.lock` → présent, horodaté `Sep 24 11:31` (posé avant le lancement de S2).
- `git log --format='%h %ad %s' --date=iso` → `f01fa2d 11:55:19 docs(epreuves): corpus d'épreuve…`,
  `5483fbc docs(epreuves): admissibilité des cas…`, `dad267d 12:01:56 chore(workflow): synchronisation v0.44.0`.
- `git status -sb` après `git fetch` → `## main...origin/main` : les trois commits sont sur l'amont.
- Verdict de S2 : « deux commits locaux non poussés (verrou de vague) ». La session savait qu'un verrou
  était posé, et son commit est passé quand même.
- `pretooluse-git.mjs:55` teste `/\bgit\s+(commit|push)\b/`. Hypothèse non vérifiée : une commande de
  la forme `git -C <dir> commit` ou `git -c k=v commit` ne correspond pas à ce motif.

## Sur place
Rien d'annulé : les commits de S2 portent les messages et repères prévus par l'index (T2, T3). La
collecte n'a committé que S3/T4 et les bilans. La synchronisation v0.44.0 concurrente est gardée
telle quelle, en l'absence de conflit avec la zone de la vague.
