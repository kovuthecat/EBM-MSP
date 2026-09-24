# Vignettes — P2

Autorité : `CONSTRUIRE-UN-MODULE.md` § P2 (A4 ; A5 amendé) et ses quatre règles d'écriture ;
`GRAMMAIRE-NOEUD.md` § « Le banc d'un nœud » (couche Vignettes). Fichier du chantier :
`docs/decision/validation/chantier-<AAAA-MM-JJ>-<domaine>/vignettes.md`.

## Qui fait quoi (A5, amendé)

La skill **peut proposer** des vignettes : une situation synthétique et une sortie attendue. Le
référent les valide, les corrige et en ajoute d'autres. Elles sont **gelées après sa validation** et
deviennent le contrat. Une vignette proposée reste « proposée, non validée » tant que le référent ne
l'a pas validée par écrit. Une sortie attendue ne vient jamais du moteur : figer le comportement actuel
ne protège rien.

## Gabarit d'une vignette

```markdown
### V<n> — <titre court de la situation>
- Statut : proposée, non validée | validée le <date> | gelée le <date> (commit <hash>)
- Type : courante | cas tordu (<lequel>)
- Situation (synthétique, non identifiante) : <tranches et catégories, jamais une histoire singulière>
- Saisi : <ce que le praticien renseigne>
- Non renseigné : <ce qu'il ignore — la valeur manquante est un cas à part entière>
- Sortie attendue (langage clinique, ni YAML ni condition) : <ce que l'outil doit dire ou proposer, et ce qu'il ne doit pas dire>
- Rouge attendu : <non | oui : décision du référent, date, ce qui manque, chantier qui le lèvera>
- Épinglage : <comportement correct qui ressemble à un oubli, et qu'il est interdit de « réparer »>
```

Une assertion porte sur un **contenu** (option, alerte, badge), jamais sur un compte de cartes.

## Contrôle non identifiant (A4, D4)

À chaque vignette, proposée ou dictée, vérifier l'absence de :

- date (de naissance, de consultation, d'événement) ;
- lieu (ville, établissement, service) ;
- nom, initiales, profession ou détail de vie qui singularise ;
- histoire singulière (enchaînement d'événements propre à une personne) ;
- valeurs recopiées d'un dossier.

Une vignette qui échoue est **écartée**, pas corrigée en silence. Le référent reformule la situation
type. Les âges et valeurs s'écrivent en tranches ou en catégories, sauf quand un seuil est l'objet
même de la vignette.

## Couverture attendue

15 à 25 vignettes. La liste des cas tordus du § P2 reste obligatoire : patient déjà traité qu'on
n'équilibre pas, sujet âgé en sur-traitement, contre-indication, refus, donnée manquante. Signaler au
référent, sans les écrire à sa place, les intentions et les éléments de l'inventaire qu'aucune
vignette ne couvre. À proposer, sans en faire une porte (aide-mémoire, A11) : pour chaque intention,
une vignette où « rien à faire » est la bonne sortie.

## Gel

La porte P2 passe quand :

- chaque vignette est validée par le référent (trace dans l'état) ;
- le fichier est commité, et la date et le commit du gel sont écrits dans l'état ;
- les rouges attendus sont nommés.

Après le gel, une vignette ne change que par **réouverture** : la preuve la contredit (P4), l'encodage
découvre une situation oubliée (P5), le diff de P6 le demande. La modification est validée par le
référent, et seule la vignette rouverte est dégelée.
