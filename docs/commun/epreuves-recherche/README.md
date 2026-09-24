# Épreuves des skills de recherche

Ce corpus mesure, sur des incidents réels du dépôt dont on connaît la bonne réponse, ce que valent
les circuits de recherche de preuve (`recherche-source-primaire`, `recherche-preuve-triangulee`,
`verif-source-veille`) avant et après leur refonte (plan P16).

## Format d'un cas

Un cas vit dans `cas/E<nn>-<slug>/` : son `cas.md` et ses pièces figées dans `entrees/`. Exemple
complet : [`cas/E01-acces-pmc-surbasalisation/cas.md`](cas/E01-acces-pmc-surbasalisation/cas.md).

Le `cas.md` porte exactement ces rubriques, lues mécaniquement par le harnais :

- l'en-tête : `Mode d'échec`, `Rôle joué` (A, B, C, `orchestrateur-decision`, `orchestrateur-veille`),
  `Circuit`, `Incident source` ;
- `## Énoncé` : le texte exact donné à l'exécution. Les pièces y sont désignées sous
  `epreuve/entrees/`, le livrable sous `epreuve/sortie/` ;
- `## Entrées` : chaque pièce, sa nature, et le fichier du dépôt dont elle est la copie ;
- `## Résultat attendu` : des assertions `R1`, `R2`… sur le livrable. Chacune est fondée sur des
  lignes du rapport correcteur (`— fondée sur <chemin:lignes>`) ;
- `## Exclusions` : les fichiers du dépôt qui portent la réponse ;
- `## Signatures` : des chaînes exactes qui trahissent la réponse (la bonne valeur, le bon
  identifiant, le fait correctif). Elles servent au contrôle d'admissibilité et à repérer une fuite.
  Ce ne sont pas des assertions : un bon livrable n'est pas tenu de les contenir toutes. Quand une
  signature figure aussi dans une pièce du cas, le `cas.md` le dit.

Un cas marqué `FICTIF` (E12) repose sur une pièce fabriquée, faute d'incident réel.

## Liste blanche de l'export

L'exécution d'une épreuve ne voit que ces chemins du dépôt, plus les pièces du cas. Chemins relatifs,
résolus au commit mesuré ; un chemin qui finit par `/` désigne un dossier.

```liste-blanche
CLAUDE.md
.claude/skills/recherche-source-primaire/
.claude/skills/recherche-preuve-triangulee/
.claude/skills/verif-source-veille/
.claude/skills/tri-boite-mail/
.claude/agents/extracteur-preuve.md
.claude/agents/contradicteur-preuve.md
.claude/agents/reconciliateur-preuve.md
docs/decision/00-global.md
docs/decision/sources/
docs/veille/SOP_veille.md
docs/veille/GRILLE_APPRECIATION.md
docs/commun/OUTIL-INTERFACE-OE.md
```

Tout le reste est hors export. C'est le cas en particulier de ce dossier, du rapport de propositions,
de `content/`, `plans/`, `docs/decision/validation/`, `docs/veille/verifications-backlog/`,
`docs/veille/JOURNAL_BOITE_MAIL.md`, `STATUS.md`, `VALIDATION.md` et `DECISIONS.md`.

Deux points à connaître pour construire l'export :

- les trois agents `.claude/agents/*-preuve.md` n'existent pas au commit de référence : leur absence
  est sans effet ;
- les PDF de `docs/decision/sources/` sont **ignorés par git** (`.gitignore`, droit d'auteur) : un
  export tiré de `git ls-files` ne contient que `prescrire-dt2.md`. Or ces PDF sont la matière
  légitime de la recherche, et E02 en dépend (SFD 2025, HAS 2024). Ils se copient donc depuis
  l'arbre de travail.

## Règle de verdict

- Une **exécution** réussit quand son livrable satisfait toutes les assertions `R` de son cas.
- Chaque cas tourne **2 fois par configuration**.
- **Réussi** = 2/2 ; **échoué** = 0/2.
- 1/2 impose une 3e exécution : 2/3 réussi, 1/3 échoué.
- **Régression** = réussi en configuration 1 (skills actuelles), puis échoué en configuration 3
  (nouvelles skills et agents dédiés).
- Une exécution **invalidée** est rejouée et ne compte ni pour ni contre. C'est le cas si elle a
  tenté une lecture refusée, ou atteint github.com.

## Contrôle d'admissibilité

Un cas n'est admissible que si aucune de ses signatures ne figure dans la liste blanche : sinon,
l'exécution pourrait lire la réponse au lieu de la trouver. Le contrôle porte sur les fichiers texte
suivis par git dans la liste blanche ; les PDF en sont exclus, puisque la recherche doit justement y
trouver la réponse.

```bash
sig=$(mktemp)
for c in docs/commun/epreuves-recherche/cas/E*/cas.md; do
  sed -n '/^## Signatures/,$p' "$c" | grep -o '^- `[^`]*`' | sed 's/^- `//; s/`$//' > "$sig"
  git ls-files -z -- CLAUDE.md .claude/skills/recherche-source-primaire/ \
    .claude/skills/recherche-preuve-triangulee/ .claude/skills/verif-source-veille/ \
    .claude/skills/tri-boite-mail/ .claude/agents/extracteur-preuve.md \
    .claude/agents/contradicteur-preuve.md .claude/agents/reconciliateur-preuve.md \
    docs/decision/00-global.md docs/decision/sources/ docs/veille/SOP_veille.md \
    docs/veille/GRILLE_APPRECIATION.md docs/commun/OUTIL-INTERFACE-OE.md \
    | grep -zv '\.pdf$' | xargs -0 grep -F -o -f "$sig" | wc -l
done
```

Résultat au 2026-09-24 : **0 occurrence** pour chacun des 12 cas (44 signatures). Le témoin
positif (`NG238`, `Avis n° 19`) est bien trouvé dans `docs/decision/00-global.md`. C'est ce qui a
imposé de transposer E02, et de préférer l'incident A12 au fichier « NICE 2023 » pour E05.

## Table des cas

| ID | Mode d'échec | Rôle | Circuit | Incident source | Admissible |
|---|---|---|---|---|---|
| [E01](cas/E01-acces-pmc-surbasalisation/cas.md) | Accès mal qualifié | A | recherche-source-primaire | `redteam-sur-basalisation.md:197-237` | oui |
| [E02](cas/E02-absence-sfd-seuil-renal/cas.md) | Faux verdict d'absence | B | recherche-preuve-triangulee | `redteam-seuils-renaux.md:36-75` | oui, transposé : l'incident cité par §13.3 (`CONCILIATION-passeA.md:113-133`, seuil 0,5 U/kg de la SFD) est raconté par `00-global.md:112-122`, dans la liste blanche |
| [E03](cas/E03-erreur-partagee-prosper/cas.md) | Même erreur chez A et OE | B | recherche-preuve-triangulee | `redteam-preuve-statine-sujet-tres-age.md:26-68` | oui |
| [E04](cas/E04-mesattribution-cibles-mcg/cas.md) | Référence exacte, affirmation non soutenue | B | recherche-preuve-triangulee | `redteam-titration-mcg-2026-08-11.md:310-361` | oui |
| [E05](cas/E05-identite-dienogest/cas.md) | Mauvaise identité d'étude | A | verif-source-veille | `JOURNAL_BOITE_MAIL.md:43,90` ; `A12-agent-A.md:5-38` | oui ; l'autre incident de la ligne (« NICE 2023 » = NG238) est raconté par `00-global.md:190` |
| [E06](cas/E06-unilateral-kids-reconciliation/cas.md) | Chiffre dérivé ; §7bis | C | verif-source-veille | `ORTHO01-agent-C-reconciliation.md:157-216` | oui |
| [E07](cas/E07-spin-cfe-proposition-unique/cas.md) | Spin du relais | A | verif-source-veille | `A06-agent-C-reconciliation.md:155-200` | oui |
| [E08](cas/E08-faux-aucun-ecr-titration-mcg/cas.md) | Faux « aucun ECR » d'OE | B | recherche-preuve-triangulee | `redteam-titration-mcg-2026-08-11.md:369-374,479-536` | oui |
| [E09](cas/E09-capture-signe-inferieur/cas.md) | Capture qui change le sens | orchestrateur-decision | recherche-preuve-triangulee | `OE-passeA-lecture-et-integrite.md:14-51` | oui |
| [E10](cas/E10-acces-ferme-pa-consultation/cas.md) | Désaccord non résoluble par une recherche ; pression pour conclure malgré un accès partiel (§8) ; veille §7 | orchestrateur-veille | verif-source-veille | `A02-reconciliation.md:11-150` | oui |
| [E11](cas/E11-or-seul-nnt-antisepsie/cas.md) | HR (ici OR) seul, NNT non calculable (§8) | A | verif-source-veille | `A08-agent-C-reconciliation.md:12-72` | oui |
| [E12](cas/E12-oe-incomplet-fictif/cas.md) | OE incomplet, clarification, modèle non identifié (§8) — FICTIF | orchestrateur-decision | recherche-preuve-triangulee | aucun (cas fabriqué) | oui |

Les chemins courts de la colonne « Incident source » se lisent sous `docs/decision/validation/`
(E01-E04, E08, E09), sous `docs/veille/` ou `docs/veille/verifications-backlog/` (E05-E07, E10, E11) ; le chemin complet est dans chaque `cas.md`.

## Validation

Le référent relit chaque cas, énoncé et résultat attendu : exact, non ambigu, et conforme à ce qu'il
attend d'un bon circuit. S4 vérifie la case ci-dessous avant toute mesure.

Résultats attendus validés par le référent : [ ] — date : ____
