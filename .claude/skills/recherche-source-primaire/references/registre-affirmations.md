# Registre des affirmations

Complète la **table maîtresse des preuves** (une ligne par étude, `recherche-preuve-triangulee`
SKILL.md l.84-98) — elle ne la remplace pas. Le registre, lui, tient une ligne par **affirmation**
du dossier : un même article peut soutenir plusieurs affirmations, avec des statuts différents.
Motif (§14.2) : l'erreur la plus fréquente n'est pas la référence inventée mais la référence réelle
qui ne soutient pas la phrase — relier chaque affirmation au passage lu (P1) n'est tenu que si une
porte le vérifie.

## Format (contrat de verifier-registre.mjs)

Un tableau Markdown à en-tête fixe, une ligne par affirmation, dans le dossier du chantier. Le
script `scripts/verifier-registre.mjs <fichier.md>` lit ce tableau et refuse un registre incomplet —
il est la porte, cette section est le contrat qu'il applique. **Domicile de ce format : cette
section, et elle seule.** (La marche à suivre pour tenir un registre au fil d'un chantier vit
ailleurs dans ce même fichier, écrite par S6 — elle ne modifie pas cette section.)

**Imposé aux nouveaux dossiers seulement** : aucun registre déjà existant dans le dépôt n'est
converti à ce format.

### Colonnes (dans cet ordre exact)

| Colonne | Contenu |
| --- | --- |
| `ID` | identifiant court de la ligne (ex. `A1`, `A2`…), unique dans le dossier |
| `Sous-question` | la sous-question du référent que cette affirmation éclaire |
| `Affirmation` | la phrase **telle qu'elle apparaît** dans le dossier — formulation exacte, pas un résumé |
| `Étude` | DOI ou PMID **vérifié** de la source, et sa version (ex. princeps, sous-groupe, suivi) |
| `Localisation` | page, tableau ou paragraphe précis dans la source — jamais « selon l'article » seul |
| `Accès` | état d'accès constaté sur cette voie (vocabulaire P0, `acces-identite.md` — S6) : `non récupéré`, `échec technique`, `résumé accessible`, `texte intégral accessible`, `paywall constaté sur cette voie`, `accès restant à vérifier` |
| `Donnée extraite` | le chiffre ou le fait exact lu dans la source |
| `Calcul` | voir § Syntaxe du Calcul ci-dessous |
| `Vérification` | une des quatre valeurs admises (§ ci-dessous) |
| `Contradiction` | une contradiction connue (autre source, autre lecture), ou vide/`aucune` |
| `Destination` | où cette affirmation va dans le dossier final (nœud, argumentaire, section) |

L'en-tête doit reproduire ces onze noms de colonnes **exactement**, dans cet ordre — une ligne
Markdown pipe-table classique :

```markdown
| ID | Sous-question | Affirmation | Étude | Localisation | Accès | Donnée extraite | Calcul | Vérification | Contradiction | Destination |
|---|---|---|---|---|---|---|---|---|---|---|
```

Un en-tête renommé, réordonné ou incomplet est refusé par `verifier-registre.mjs` — l'en-tête EST
le contrat, pas une simple étiquette.

### Valeurs admises — `Vérification`

`vérifiée` · `non vérifiée` · `non vérifiable` · `contredite`. Toute autre valeur est une erreur.

**Règle** : une ligne `vérifiée` doit avoir une `Localisation` non vide et un `Accès` qui n'est ni
`non récupéré`, ni `échec technique`, ni `accès restant à vérifier`, ni
`paywall constaté sur cette voie` — ces quatre états disent, par construction, que le passage n'a
pas été lu ; « vérifiée » sans lecture n'a pas de sens.

### Syntaxe du `Calcul`

Toute ligne qui mentionne un **NNT** — dans n'importe quelle colonne, pas seulement `Calcul` — doit
avoir un `Calcul` qui commence par l'une de ces trois formes :

- **`publié`** — le NNT est celui de la source, non recalculé (éventuellement suivi d'une précision :
  `publié (Table 3)`).
- **`recalculé : risque bras A <p1>, risque bras B <p2>[, horizon <texte>] -> NNT <n>`** — le script
  recalcule `1 / |p1 − p2|` (arrondi supérieur) et le compare à `<n>` écrit ; un écart est une
  erreur.
- **`non calculable : <motif>`** — le motif est obligatoire (ex. `non calculable : risques absolus
  non publiés, seul le RR est rapporté`).

Une ligne qui mentionne un NNT sans que `Calcul` commence par une de ces trois formes est refusée —
y compris quand le NNT apparaît dans `Donnée extraite` ou `Affirmation` sans qu'aucun statut de
calcul ne l'accompagne (le cas réel qui motive cette règle, §14.2 : un NNT d'ACE écrit à 33 au lieu
de ~40, jamais recalculé ni sourcé comme publié).

## Exemple valide (données fictives, marquées comme telles)

> Toutes les valeurs ci-dessous sont inventées pour l'exemple — aucune ne doit être reprise comme
> preuve dans un dossier réel.

| ID | Sous-question | Affirmation | Étude | Localisation | Accès | Donnée extraite | Calcul | Vérification | Contradiction | Destination |
|---|---|---|---|---|---|---|---|---|---|---|
| A1 | Bénéfice cardiovasculaire à 5 ans ? | « réduit la mortalité cardiovasculaire de 38 % » (fictif) | DOI 10.9999/exemple.a1, princeps | p. 2121, colonne RESULTS | texte intégral accessible | 3,7 % vs 5,9 % à 3,1 ans (fictif) | publié (Table 2) | vérifiée | aucune | Nœud X, argumentaire §2 |
| A2 | Bénéfice cardiovasculaire à 5 ans ? | « NNT d'environ 45 sur la mortalité toutes causes » (fictif) | DOI 10.9999/exemple.a1, princeps | p. 2122, Table 2 | texte intégral accessible | risque 5,7 % vs 8,3 % (fictif) | recalculé : risque bras A 0,057, risque bras B 0,083 -> NNT 39 | vérifiée | aucune | Nœud X, argumentaire §2 |
| A3 | Effet sur l'insuffisance rénale terminale ? | « aucune étude randomisée ne rapporte ce critère à ce jour » (fictif) | — | — | non récupéré | — | non calculable : aucun essai identifié rapportant ce critère | non vérifiable | aucune | Nœud X, §limites |
| A4 | Risque d'infection génitale ? | « risque multiplié par trois » (fictif, relayé par une revue de presse) | DOI 10.9999/exemple.a4 | à vérifier — accès payant, SAP non consulté | paywall constaté sur cette voie | — | non calculable : source non encore consultée | non vérifiée | aucune | à trancher |

`A2` illustre le recalcul : `1 / |0,083 − 0,057| = 1 / 0,026 ≈ 38,46`, arrondi supérieur = `39` —
ce qui est bien le NNT écrit. `A4` illustre une ligne `non vérifiée` : `Accès` porte un état fermé,
donc `Vérification` ne peut pas être `vérifiée` tant que la source n'a pas été ouverte.
