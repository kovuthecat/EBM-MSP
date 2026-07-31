# 2026-07-28 — D33 · La mémoire de session a un geste de sortie (complète D28)

### Décision

Un bouton **« Nouveau patient »** (`src/features/shared/layout/Header.tsx`), placé à droite de la barre,
hors du chemin de lecture clinique, purge explicitement la mémoire de session (`reinitialiserSession()`,
`src/features/decision/lib/sessionCriteres.ts`) et force le remontage de tous les écrans montés par
`key` — y compris **sans** changer de nœud, pour que rouvrir le même nœud reparte vierge. Confirmation
(`window.confirm`) avant purge : le geste est destructif et à portée d'un clic parasite en consultation.
Orchestré par `App.tsx`, seul composant qui connaît à la fois `sessionCriteres.ts` et le mécanisme de
remontage par `key` (D28) — via un compteur `resetEpoch` injecté dans chaque `key` d'écran, jamais lu
pour sa valeur.

**Ce que ce n'est pas** : ni une purge implicite au retour à l'accueil, ni au changement de nœud.
L'accueil reste le trajet normal **à l'intérieur** d'une même consultation (D9 : pas de navigation
directe d'un nœud à l'autre) — y purger détruirait exactement ce que D28 sert à préserver (reprendre
l'HbA1c ou le DFG d'un nœud à l'autre du même patient).

### Contexte

Recette du 2026-07-28 (D-13) : après une vignette (HbA1c actuelle 8,4 / cible 7), l'ouverture d'un nœud
pour un **autre** patient pré-remplissait « HbA1c cible · repris de votre saisie » à 7, et cette valeur
entrait dans le raisonnement affiché (« Proposé parce que : … HbA1c à la cible : non »). Aucun bouton de
sortie n'existait : seul un rechargement complet (F5), que rien à l'écran ne mentionne, vidait la
mémoire. C'est le seul défaut de la recette capable de faire raisonner l'outil sur les données d'un
autre patient.

### Raison du choix

D28 est respectée à la lettre par le mécanisme lui-même (aucune valeur ne survit à un F5) : le trou
n'était pas dans la mémoire de session, il était dans l'**absence de geste de fin de consultation** qui
la vide **sans** recharger la page. Un bouton explicite, plutôt qu'une purge automatique à un point de
navigation existant, évite de réinterpréter silencieusement un trajet (l'accueil) qui a déjà un autre
sens établi (D9).

### Conséquences

- `sessionCriteres.ts` expose une fonction de purge triviale (vide la `Map` de module, aucun événement,
  aucun abonnement).
- Aucune nouvelle persistance introduite (`localStorage`/réseau toujours absents, invariant `CLAUDE.md`
  1 inchangé) : le bouton vide une mémoire déjà volatile, il n'en crée pas de nouvelle.
- Un nœud ré-ouvert après purge n'affiche plus aucune mention « · repris de votre saisie » — vérifié par
  test.
