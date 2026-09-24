# Épreuves de la skill `construire-module-decision`

Ce corpus mesure ce que vaut la skill `construire-module-decision` sur les huit situations de
`docs/commun/2026-09-16-propositions-skills-recherche.md` §11.5. Réussir, c'est **aiguiller**,
**s'arrêter à la bonne porte**, **préserver une validation** et **reprendre au bon endroit**. Produire
du contenu à tout prix n'est pas réussir. Aucun résultat attendu ne porte sur un contenu clinique.

Les cas sont joués par le harnais du corpus principal (`../harnais/`), avec
`lancer.mjs … --corpus cas-module` (P16/S12). Écrits par P16/S11, le 2026-09-24.

## Format d'un cas

Le format est celui de `../README.md` § Format d'un cas. Un cas vit dans `M<nn>-<slug>/` : son `cas.md`
et ses pièces figées dans `entrees/`. Trois différences :

- **Rôle joué** : `orchestrateur-module`, la session qui déroule la skill avec le référent ;
- **Circuit** : `construire-module-decision` ;
- **Signatures** : `- (aucune)` est admis. Les résultats attendus décrivent des comportements, et aucune
  chaîne exacte ne les trahit.

**Toutes les pièces sont fictives** et marquées `FICTIF` : le deuxième domaine n'existe pas encore. Leur
domaine est fictif ; classes, seuils et critères y sont des marques-places (« classe K », « critère
Q »), jamais des affirmations cliniques. Les situations sont synthétiques et non identifiantes.
Chaque cas cite, sous « Incident source », la ligne du rapport ou le constat DT2 dont il est transposé.

**Ancrage des résultats attendus.** Chaque assertion `R` est fondée sur le rapport de propositions
(§11.3 à §11.5), sur le mémo d'arbitrage `docs/decision/ARBITRAGE-construire-un-module.md`, ou sur les
deux, et jamais sur le `SKILL.md`. Une assertion qu'on ne pourrait lire que dans la skill ne mesurerait
que la relecture de la skill.

## Liste blanche de l'export

L'exécution d'une épreuve ne voit que ces chemins du dépôt, plus les pièces du cas. Même convention
que `../README.md` : chemins relatifs résolus au commit mesuré, `/` final pour un dossier.

```liste-blanche
CLAUDE.md
.claude/skills/construire-module-decision/
.claude/skills/recherche-source-primaire/
.claude/skills/recherche-preuve-triangulee/
.claude/skills/verif-source-veille/
.claude/agents/extracteur-preuve.md
.claude/agents/contradicteur-preuve.md
.claude/agents/reconciliateur-preuve.md
docs/decision/CONSTRUIRE-UN-MODULE.md
docs/decision/GRAMMAIRE-NOEUD.md
docs/decision/00-global.md
docs/decision/ARBITRAGE-construire-un-module.md
```

Tout le reste est hors export, en particulier ce dossier, le rapport de propositions, `content/`,
`plans/`, `DECISIONS.md` et `docs/decision/validation/`.

## Règle de verdict

Celle de `../README.md` § Règle de verdict : 2 exécutions par cas, réussi = 2/2, échoué = 0/2, 3e
exécution à 1/2 ; une exécution qui a tenté une lecture refusée est invalidée et rejouée. Une exécution
réussit quand son livrable satisfait toutes les assertions `R` de son cas. Un livrable qui écrit du
contenu clinique à la place du référent (intention, sortie attendue tranchée, conclusion de preuve)
échoue l'assertion qui l'interdit.

## Table des cas

| ID | Situation (§11.5) | Porte ou règle en jeu | Fondement principal |
|---|---|---|---|
| [M01](M01-demande-ambigue/cas.md) | demande ambiguë | qualification avant tout procédé | rapport §11.1, §11.4 (sortie sans module) |
| [M02](M02-prerequis-generique-manquant/cas.md) | prérequis générique manquant | porte P0, catalogue non bloquant | mémo A1 |
| [M03](M03-referent-absent-attente-clinique/cas.md) | référent absent pour une attente clinique | gel P2, aucune sortie attendue suppléée | mémo A5, rapport §11.3 |
| [M04](M04-oe-avant-p2/cas.md) | tentation de lancer OE avant P2 | aucune collecte avant le gel | mémo A5, A7 |
| [M05](M05-preuve-contredit-vignette/cas.md) | preuve qui contredit une vignette | règle de réouverture | rapport §11.4 ; mémo A5 |
| [M06](M06-securite-autre-noeud/cas.md) | sécurité qui affecte un autre nœud | vocabulaire commun, nœud clos rouvert | rapport §11.4 ; mémo §1 (D54, I33) |
| [M07](M07-reprise-apres-interruption/cas.md) | reprise après interruption | pièces vérifiées, reprise à la bonne porte | rapport §11.4 ; mémo A5, A9 |
| [M08](M08-yaml-fidele-comportement-incorrect/cas.md) | YAML fidèle, comportement incorrect | pistes A et B distinctes | rapport §11.3 ; mémo §1 (P6) |

## Validation

Le référent peut relire chaque cas, énoncé et résultat attendu, avant la mesure de S12 : exact, non
ambigu, conforme à ce qu'il attend de la skill. S12 ne réécrit pas les cas ; un attendu qui lui paraît
faux se signale dans son bilan.

Résultats attendus relus par le référent : [ ] — date : ____
