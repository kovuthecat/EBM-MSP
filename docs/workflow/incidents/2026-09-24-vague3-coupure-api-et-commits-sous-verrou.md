# Incident workflow — 2026-09-24 — vague 3 de P16 : session coupée par l'API, commits sous verrou (récidive)

- Projet : ebm-msp · Workflow : v0.43.0 · Plan : P16/S4 (vague 3 parallèle S4 · S5)
- Environnement : Desktop · sous-agent (`session-high`, modèle sonnet)
- Étape : `/orchestrer-plan` Étape 1, collecte · Nature : orchestration

## Symptôme
1. S4 s'est arrêtée en cours de T6 sur une erreur API `rate_limit` (HTTP 429, « session limit »),
   sans `VERDICT:` ni rapport `.echec.md`. Le script, rappelé, a rendu `pousser` (T5 commitée, locale
   en avance sur l'amont) alors que la vague était ouverte, sous verrou, avec un arbre sale.
2. Comme en vague 2 (incident `2026-09-24-commit-sous-verrou-de-vague.md`), S4 a commité ses tâches
   elle-même pendant que `.claude/wave.lock` était posé : `b69052b` (T5), `fb96bc4`, `8dae263` (T6),
   `7dc6355` (bilan). S5, elle, a respecté le verrou.

## Preuve
- Notification de fin de S4 : `Agent terminated early due to an API error: You've hit your session limit`.
- `node .claude/workflow/bin/prochaine-action.mjs P16` → `pousser`, `git status --short` → fichiers
  non commités de S4 et S5, `Test-Path .claude/wave.lock` → `True`.
- `git log --oneline` : les quatre commits de S4 ci-dessus, antérieurs au retrait du verrou.

## Sur place
- `pousser` non exécuté : `git pull --rebase` aurait refusé l'arbre sale, et pousser en milieu de
  vague publiait un demi-résultat. Push différé à la fin de la vague.
- Reprise par `SendMessage` vers l'agent de S4, **hors des trois conditions du canal court** (N0 était
  rouge, code 1, probablement à cause de `transcription.mjs` en cours d'édition). Motif : il s'agit
  d'une interruption et non d'un échec, et aucun `.echec.md` n'existait pour une reprise à froid.
  Reprise demandée par l'utilisateur (« Reprends »). S4 a ensuite rendu `PASS` avec N0 vert.
- Rien d'annulé : les commits de S4 portent les messages et repères de l'index.

## À trancher côté workflow
- `prochaine-action.mjs` ne distingue pas une coupure d'API d'un échec, et ne connaît pas le verrou
  quand il rend `pousser` : il devrait rendre `reprendre` (ou `question`) tant que `wave.lock` existe.
- Voie de reprise d'une session interrompue sans rapport : à écrire dans `references/remediation.md`.
