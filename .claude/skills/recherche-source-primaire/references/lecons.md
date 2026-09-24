# Leçons : incidents, règles, domiciles

Chaque incident de recherche du dépôt, relié à la règle qu'il a fait naître, au **domicile** de
cette règle et au cas d'épreuve qui le rejoue. Deux usages :

- **garde-fou contre la dérive** : quand une page du socle ou d'un circuit contredit une règle, la
  colonne « Domicile » dit laquelle fait foi — on corrige la page, pas le domicile ;
- **index du corpus d'épreuve** (`docs/commun/epreuves-recherche/`) : la colonne « Cas » renvoie à
  l'identifiant du cas, dont la table est dans le README du corpus.

Cette page ne raconte pas les incidents : le rapport se désigne par son chemin, le cas par son
identifiant. Aucun nom d'étude, aucun chiffre, aucun fait correctif n'y figure — ils sont dans les
rapports, et les copier ici ferait lire la réponse au lieu de la chercher.

## Table

Chemins courts : `validation/` = `docs/decision/validation/` ; `backlog/` =
`docs/veille/verifications-backlog/`.

| Incident (date, chemin du rapport) | Règle | Domicile | Cas |
|---|---|---|---|
| 2026-07-27 — `validation/chantier-2026-07-27/redteam-sur-basalisation.md` | Un état d'accès qualifie une voie ; l'absence de PMCID ne ferme que la voie PMC | `acces-identite.md` § 2 | E01 |
| 2026-08-10 — `backlog/A02-reconciliation.md` | Qualifier chaque voie essayée ; aucun constat de fermeture avant les voies de la marche à suivre | `acces-identite.md` § 7 | E10 |
| 2026-08-10 — `docs/veille/JOURNAL_BOITE_MAIL.md` §2bis (reprise des reports) | Registre de l'essai (protocole, plan d'analyse) avant tout report pour accès | `acces-identite.md` § 7 | — |
| 2026-07-27 — `validation/chantier-2026-07-27/redteam-seuils-renaux.md` | Un verdict d'absence exige le corpus local ouvert et deux méthodes d'extraction | `docs/decision/00-global.md` § Règles de sourcing (marche : `acces-identite.md` § 8) | E02 |
| 2026-07-29 — `validation/chantier-2026-07-29/CONCILIATION-passeA.md` | Même règle | `docs/decision/00-global.md` § Règles de sourcing (marche : `acces-identite.md` § 8) | E02 (transposé) |
| 2026-07-29 — `validation/chantier-2026-07-29/OE-passeA-lecture-et-integrite.md`, `validation/chantier-2026-07-29/redteam-B2-chiffres.md` | Ne jamais recopier un PMID rendu par OE ; reprendre DOI ou citation et retrouver l'identifiant soi-même | `docs/decision/00-global.md` § Règles de sourcing (marche : `openevidence.md` § 6, `acces-identite.md` § 6) | — |
| 2026-07-24 — `docs/decision/noeuds/E-insuline.md` (annexe des prompts OE) | Périmètre d'OE : liste des sources à ne pas lui demander | `docs/decision/00-global.md` § Règles de sourcing (marche : `openevidence.md` § 6) | — |
| 2026-07-26 — `validation/chantier-2026-07-26/redteam-preuve-statine-sujet-tres-age.md` ; 2026-08-11 — `validation/chantier-2026-08-11/redteam-titration-mcg-2026-08-11.md` | L'accord de plusieurs modèles n'augmente pas le niveau de preuve ; la contradiction lit la source primaire d'abord | `references/contradiction.md` ; `docs/veille/SOP_veille.md` §7 (accord ≠ vérité) | E03 |
| 2026-08-11 — `validation/chantier-2026-08-11/redteam-titration-mcg-2026-08-11.md` | Chaque affirmation reliée au passage lu, une ligne par affirmation | `registre-affirmations.md` § Format et § Marche à suivre | E04 |
| 2026-08-11 — `validation/chantier-2026-08-11/redteam-titration-mcg-2026-08-11.md` | Une absence affirmée par un outil d'IA est une piste, pas un verdict | `docs/decision/00-global.md` § Règles de sourcing, verdict d'absence (marche : `acces-identite.md` § 8, `openevidence.md` § 7) | E08 |
| 2026-08-10 — `backlog/A12-agent-A.md` ; `docs/veille/JOURNAL_BOITE_MAIL.md` §0 et §2bis | Axe identité : le design s'établit dans les Méthodes, l'étude attendue se confronte à l'étude trouvée | `acces-identite.md` § 4 | E05 |
| 2026-07-29 — `validation/chantier-2026-07-29/CONCILIATION-passeA.md` | L'identité d'une pièce locale se lit dans son contenu | `docs/decision/00-global.md` § Sources locales (marche : `acces-identite.md` § 4) | — |
| 2026-07-29 — `validation/chantier-2026-07-29/redteam-B2-chiffres.md` | Tout chiffre dérivé est publié, recalculé (entrées écrites) ou non calculable | `registre-affirmations.md` § Format (Syntaxe du Calcul) et § Chiffres dérivés ; porte : `verifier-registre.mjs` | — |
| 2026-08-10 — `backlog/ORTHO01-agent-C-reconciliation.md` | Conserver le cadre du test tel que la source le déclare | `registre-affirmations.md` § Chiffres dérivés | E06 |
| 2026-08-10 — `backlog/A08-agent-C-reconciliation.md` | HR, RR, OR non interchangeables ; `non calculable` est une sortie valide | `registre-affirmations.md` § Chiffres dérivés | E11 |
| 2026-08-10 — `backlog/A06-agent-C-reconciliation.md` ; `docs/veille/JOURNAL_BOITE_MAIL.md` §2bis | Une source de repérage ne détermine jamais la route ; remonter à la source primaire | `docs/veille/SOP_veille.md` §9 | E07 |
| 2026-07-29 — `validation/chantier-2026-07-29/OE-passeA-lecture-et-integrite.md` ; récidive 2026-08-11 | Un retour OE se relit contre la conversation ou la source avant d'être retenu | `docs/commun/OUTIL-INTERFACE-OE.md` § Ce que ça change (marche : `openevidence.md` § 7) | E09 |
| 2026-09-24 — `docs/commun/2026-09-16-propositions-skills-recherche.md` §13.1 | Le chemin du CLI s'écrit à un seul endroit et se vérifie avant l'appel | `docs/commun/OUTIL-INTERFACE-OE.md` | — |
| 2026-09-24 — `docs/commun/2026-09-16-propositions-skills-recherche.md` §13.2 | Constater les outils exposés, les nommer `Serveur:outil`, repli sur les voies ouvertes | `acces-identite.md` § 1 et § 5 | — |
| Aucun incident, cas fabriqué — `docs/commun/2026-09-16-propositions-skills-recherche.md` §8 | Un retour OE incomplet, une demande de précision, un modèle `inconnu` se signalent et ne s'exploitent pas sans accord | `openevidence.md` § 3 et § 4 | E12 |
| 2026-09-24 — `docs/commun/2026-09-16-propositions-skills-recherche.md` §14.3 (hook refusé) | Seul l'orchestrateur appelle le CLI, après accord du référent dans la conversation | `openevidence.md` § 1 ; `DECISIONS.md` D65 | — |

## Tenir cette page

- Un nouvel incident de recherche ajoute une ligne **dans le même commit** que la règle qu'il fait
  naître ou corriger.
- Une règle qui change de domicile met à jour sa ligne ; une règle écrite à deux endroits est une
  dérive, à corriger vers le domicile.
- Un nouveau cas d'épreuve se relie ici par son identifiant seulement.
