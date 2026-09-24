# Gabarit — état de chantier

Un seul par chantier (A12 ; `CONSTRUIRE-UN-MODULE.md` §6, item 1) :
`docs/decision/validation/chantier-<AAAA-MM-JJ>-<domaine>/ETAT.md`. On le met à jour, on ne le
duplique pas. Une décision s'y écrit puis migre : vers `DECISIONS.md` si elle est transverse, vers
`docs/decision/noeuds/` si elle est clinique. La ligne de migration reste dans l'état.

```markdown
# État du chantier — <domaine ou module> (ouvert le <AAAA-MM-JJ>)

## Qualification
- Nature de la demande : <domaine de décision | module de nœuds (D22) | nœud dans <domaine> | thème de veille (renvoyé) | sortie sans module : <laquelle>>
- Fiche de domaine : <chemin> — validée par le référent le <date> (<trace : conversation du …, commit …>)
- Mode de la skill : <prescrit | orientation>, lu dans l'en-tête de CONSTRUIRE-UN-MODULE.md le <date>

## Où on en est
- Phase courante : <P0…P7>, porte <franchie | en cours | bloquée>
- Prochaine action : <une seule, avec qui la fait>

## Livrables
| Pièce | Chemin | Commit | Date | Statut |
| --- | --- | --- | --- | --- |
| Bilan des prérequis (P0) | … | … | … | … |
| Intentions, inventaire, trois questions (P1) | … | … | … | écrit par le référent |
| Fichier commun du domaine (P1) | content/decision/criteres-communs/<domaine>.yaml | … | … | … |
| Vignettes (P2) | …/vignettes.md | … | … | gelées le … |
| … | | | | |

## Validations obtenues
| Objet | Par | Date | Trace |
| --- | --- | --- | --- |
| gel des vignettes V1-V18 | référent | … | … |

## Blocages
| Depuis | Nature | Question précise | Débloque |
| --- | --- | --- | --- |
| … | attente référent / prérequis / accès / budget / socle | … | … |

## Chaîne traçable
| Intention | Vignette | Sous-question | Conclusion validée | Option | Vérification |
| --- | --- | --- | --- | --- | --- |
| … | V3 | SQ2 | …-consolidation.md l.… | <id option> | vignette verte / I… |

Orphelins relevés : sous-question sans décision servie ; option sans vignette.

## Réouvertures
| Date | Déclencheur | Pièce rouverte | Décision du référent | Pièces restées acquises |
| --- | --- | --- | --- | --- |

## Reprises
| Date | Phase annoncée | Première porte sans preuve | Pièces manquantes |
| --- | --- | --- | --- |
```

Règles de tenue :

- **Une** prochaine action, jamais une liste.
- Une validation sans trace (qui, quand, où) ne compte pas : elle se redemande.
- Une proposition de la skill (vignette, reformulation) porte la mention « proposée, non validée »
  jusqu'à la validation du référent.
- Un état « reconstitué » (pièces trouvées sans état) le dit en tête, et liste les validations à
  faire confirmer.
