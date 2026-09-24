# Mesure finale à trois configurations — RAPPORT PARTIEL (arrêté sur arbitrage de coût)

Plan P16, session S10/T19. Commit mesuré : `ece2d5eba67300f36e8435e7a66b813ba8fb6064`. Harnais :
`docs/commun/epreuves-recherche/harnais/` (configurations 2/3, T18). Modèle : `sonnet` (les trois
configurations).

**ARRÊTÉE avant la fin, sur deux arbitrages utilisateur reçus en cours de session** (détail complet
dans « Écarts au plan » du bilan de session) :

1. **Circuit Veille exclu** : seuls les cas qui exercent `recherche-preuve-triangulee` (circuit
   Décision) sont mesurés — E02, E03, E04, E08, E09, E12. E01, E05, E06, E07, E10, E11 ne sont **pas
   mesurés** ici.
2. **Arrêt de coût** : sur ces 6 cas, seuls E02, E03 et E04 sont **corrigés** (grading.json produit et
   vérifié). E08, E09 et E12 ont leurs 2×2 exécutions **déjà mesurées** (livrables et coûts réels
   acquis, dans ce dossier) mais **pas corrigées** — l'arrêt est arrivé avant leur correction. Ne pas
   lire un verdict là où il n'y en a pas : ce rapport marque explicitement chaque case non mesurée.

**Aucune exécution `claude -p` n'a été interrompue en cours** : l'arrêt est arrivé après que le dernier
lot (configuration 3, 12 exécutions) a atteint « lot terminé » — vérifié sur le pointeur de lot avant
d'écrire ce rapport (aucun lot actif, aucun processus détaché du harnais en cours). Rien n'a donc été
rejoué ni compté à tort.

## Table des verdicts (sous-ensemble Décision, 6 cas)

| Cas | Config 1 (référence, S4) | Config 2 | Config 3 | Régression (1→3) |
| --- | --- | --- | --- | --- |
| E02 | réussi | **réussi** (4/4 · 4/4) | **réussi** (4/4 · 4/4) | **non** |
| E03 | échoué | **échoué** (1/4 · 1/4) | **échoué** (0/4 · 0/4) | non (déjà échoué en config 1) |
| E04 | échoué | **incomplet, 1/2** (4/4 · 2/4) — 3ᵉ exécution requise, non jouée | **incomplet, 1/2** (0/4 · 2/4) — 3ᵉ exécution requise, non jouée | non applicable (déjà échoué en config 1 ; ne peut pas régresser par définition) |
| E08 | réussi | **mesuré, non corrigé** (exécution 1 : **0 livrable produit**, constat direct, pas un jugement de correcteur ; exécution 2 : livrable présent, non lu) | **mesuré, non corrigé** (2 exécutions, livrables présents, non lus) | **indéterminée — seul cas réussi en config 1 dont la config 3 n'est pas corrigée : c'est la lacune la plus importante de ce rapport partiel** |
| E09 | échoué | mesuré, non corrigé (2 livrables présents) | mesuré, non corrigé (2 livrables présents) | non applicable (déjà échoué en config 1) |
| E12 | échoué | mesuré, non corrigé (2 livrables présents) | mesuré, non corrigé (2 livrables présents) | non applicable (déjà échoué en config 1) |

## Régressions

**Aucune régression constatée sur les données corrigées** (E02 : réussi partout). **Une case reste
ouverte et prioritaire pour la suite** : **E08**, seul autre cas réussi en configuration 1, n'est pas
corrigé en configuration 3 — sa régression éventuelle est **indéterminée**, pas écartée. Un fait brut
est cependant déjà acquis, sans jugement de correcteur : l'exécution 1 de configuration **2** n'a
produit **aucun livrable** (0 fichier sous `epreuve/sortie/`, transcript lu directement — la session a
utilisé un outil PubMed MCP refusé par les réglages, lu des PDF qui sont revenus tronqués
(« [media removed: request limit] »), puis s'est arrêtée sans écrire de rapport, `stop_reason:
end_turn`, coût 5,00 $, durée 204 s). Cela ne prouve rien sur la configuration 3, dont les deux
livrables existent et n'ont pas été lus.

## Attribution du gain par couche

**Non conclusible sur ce rapport partiel.** Seuls E02 (réussi partout, aucune variation à attribuer)
et E03 (échoué partout, aucune variation à attribuer) sont pleinement corrigés dans les deux
configurations. E04 est corrigé mais incomplet (1/2 dans les deux configurations, 3ᵉ exécution non
jouée). E08, E09, E12 ne sont pas corrigés. Sur les seuls cas exploitables, aucune différence 1→2 ni
2→3 n'apparaît (E02 et E03 ont le même verdict dans les trois configurations) — ce sous-ensemble ne
permet donc pas de conclure à un gain, dans un sens ou dans l'autre ; ce n'est pas une conclusion
« gain nul », c'est une absence de données suffisantes.

## Exécutions invalidées

**Aucune** parmi les 24 exécutions mesurées (E02, E03, E04, E08, E09, E12 × 2 configurations ×
2 exécutions) : aucune tentative d'outil vers le dépôt ou Interface-OE, aucune URL
`github.com/kovuthecat`, constaté sur chaque `enregistrement.json` (`invalidee: false`).

**7 exécutions techniquement échouées, rejouées** (limite de débit de l'API, code 429 — « You've hit
your session limit », fenêtre de 5 h, `resetsAt` 17:50 UTC) : E04/config-2/exécution-2, E08 et E09 et
E12 (les deux exécutions de chacun) en configuration 2, lors du premier lot de mesure. Coût nul pour
ces 7 tentatives (échec instantané, ~400 ms). Rejouées après le retour de capacité (vérifié par une
sonde d'une seule exécution avant de relancer le reste) ; les 7 rejeux ont abouti, comptés dans la
table ci-dessus.

## Coût et durée

| Poste | Coût | Durée cumulée |
| --- | --- | --- |
| Configuration 2 (12 exécutions retenues + 7 rejouées après 429, coût nul pour les échecs) | 27,72 $ | 2 774 833 ms |
| Configuration 3 (12 exécutions) | 23,85 $ | 3 500 431 ms |
| **Total mesure T19 (configs 2+3)** | **≈ 56,62 $** | **≈ 6 275 264 ms (≈ 1 h 44)** |

Plafond de dépense (`estimation.md`) : estimation 35,64 $, plafond (le double) 71,27 $. **56,62 $ reste
sous le plafond** — l'arrêt n'est pas dû au plafond de coût de T19, mais à un arbitrage utilisateur
distinct, reçu en cours de session (voir bilan). Coût moyen par exécution retenue sur ce sous-ensemble :
2,36 $ (24 exécutions) — nettement au-dessus des 1,48 $/exécution de la référence S4 (configuration 1) :
les exports de configuration 2/3 sont plus riches (socle `recherche-source-primaire`, deux skills
réécrites), ce qui allonge le contexte de chaque exécution.

Coût du déroulé à blanc (T18, hors plafond T19, déjà rapporté séparément) :
`mesures/2026-09-24-deroule/rapport.md` — 5,77 $.

## Erreurs résiduelles, par mode d'échec (constatées, pas jugées)

- **Livrable non produit malgré un coût réel** (E08/config-2/exécution-1) : la session a rencontré une
  limite technique (lecture de PDF tronquée par l'outil, « [media removed: request limit] »), a
  exprimé le doute dans son dernier message, puis s'est arrêtée sans écrire le fichier attendu. Motif
  d'échec distinct d'une erreur de contenu clinique — à distinguer dans une future passe de correction.
- **Livrable tronqué, deux fois** (E03/config-3, les deux exécutions) : les deux rapports s'arrêtent
  avant la section de confrontation attendue (l'un explicitement « section à compléter… en cours de
  rédaction », l'autre juste après l'ouverture des pièces d'A et d'OE, sans suite). Corrigé 0/4 les deux
  fois — pas une divergence de contenu, une interruption avant d'atteindre le contenu à évaluer.
- **7 échecs techniques (429, limite de session API)**, tous rejoués avec succès — voir § Exécutions
  invalidées. Sans rapport avec la qualité des skills mesurées.

## Ce qui reste à mesurer (pour une reprise)

- Corriger E08, E09, E12 en configurations 2 et 3 (6 correcteurs, ~12 grading.json).
- Jouer la 3ᵉ exécution d'E04 en configurations 2 et 3 (2 exécutions + 2 corrections).
- Si le référent lève l'exclusion Veille : mesurer E01, E05, E06, E07, E10, E11 (12 × 2 configurations
  = 24 exécutions de plus).
- Recalculer l'attribution 1→2 / 2→3 une fois E08/E09/E12 corrigés (E08 est prioritaire : seul cas
  réussi en configuration 1 dont la régression reste indéterminée).
