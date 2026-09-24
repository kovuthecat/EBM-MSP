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

---

## Marche à suivre

Ce qui suit dit **quand** et **comment** tenir le registre au fil d'un chantier. Le format reste
défini par la section Format ci-dessus, et par elle seule. Le vocabulaire de la colonne `Accès` est
défini dans `acces-identite.md` § 2.

### Quand et comment remplir le registre

- **Dès la première affirmation extraite**, pas en fin de chantier : chaque agent qui lit une source
  y ajoute ses lignes au moment où il lit. Un registre reconstitué après coup recopie le dossier au
  lieu de le vérifier.
- **Une ligne par affirmation, pas par étude** : si une étude porte trois affirmations, trois lignes ;
  si une affirmation s'appuie sur deux études, une ligne par couple affirmation-étude.
- `Affirmation` reprend la phrase **telle qu'elle figurera dans le dossier**. Si la phrase change en
  cours de rédaction, la ligne change avec elle — sinon la porte vérifie une phrase qui n'existe plus.
- `Étude` porte l'identifiant sorti d'`identite.mjs` (`acces-identite.md` § 6), jamais un identifiant
  recopié d'un résumé généré.
- `Accès` porte l'état **de la voie par laquelle le passage a été lu** ; `Localisation`, la page, le
  tableau ou le paragraphe.
- `Vérification` : `vérifiée` seulement après lecture du passage ; `non vérifiée` tant que la
  lecture manque ; `non vérifiable` quand toutes les voies de `acces-identite.md` § 7 ont été
  essayées sans succès, ou qu'aucune source ne peut porter la phrase ; `contredite` quand une source
  lue dit autre chose. Un chiffre qui n'a été trouvé que dans des résumés secondaires concordants
  reste `non vérifiée`.
- `Contradiction` reçoit aussi un avis de rétractation ou de correction relevé par `identite.mjs`.
- Une affirmation essentielle qui reste `non vérifiée` ou `non vérifiable` ne disparaît pas du
  registre : elle bloque, ou elle est retirée ou reformulée **avec validation humaine** (renvoi :
  `docs/decision/00-global.md` § Garde-fous de vérification, règle du `[À VÉRIFIER]`).

### La porte : `verifier-registre.mjs`

```bash
node .claude/skills/recherche-source-primaire/scripts/verifier-registre.mjs <dossier>/<registre>.md [--json]
```

- Code `0` : registre conforme. Code `1` : au moins une erreur, une par ligne (`L<n> — message`, avec
  le numéro de ligne du fichier). Code `2` : fichier absent ou illisible.
- **À lancer avant de déclarer un dossier consolidé** (`references/consolidation.md`), et avant de
  transmettre un dossier au référent. Un dossier dont le registre sort en code `1` n'est pas
  consolidé : on corrige les lignes, on ne contourne pas la porte en affaiblissant une valeur
  (passer une ligne de `vérifiée` à `non vérifiée` est légitime seulement si le passage n'a
  effectivement pas été lu).
- La porte contrôle la **forme** : localisation présente, état d'accès compatible, statut de calcul
  de tout NNT. Elle ne dit pas que le passage soutient la phrase — c'est l'objet de la contradiction
  (`references/contradiction.md`).

### Familles d'essai

- Un essai enregistré produit souvent plusieurs publications : princeps, analyses secondaires ou de
  sous-groupes, suivi prolongé, préprint. `identite.mjs` les rattache par le numéro d'enregistrement
  (PubMed, champ `[si]`) ; la section « Famille d'essai » de son rapport en donne la liste.
- **Une famille n'est pas N confirmations.** Deux publications du même essai qui disent la même chose
  comptent pour une source, pas deux. Le registre l'écrit dans `Étude` (« princeps », « sous-groupe
  de … », « suivi à N ans de … ») pour que la parenté se voie.
- Une analyse secondaire ne s'écrit jamais comme l'essai princeps : critère, population et caractère
  préspécifié peuvent différer. En cas de doute, c'est un problème d'identité (`acces-identite.md`
  § 4).
- Un préprint et sa version publiée sont une seule étude ; si leurs chiffres divergent, la ligne cite
  la version publiée et signale la divergence dans `Contradiction`.

### Chiffres dérivés

- Tout chiffre du dossier est l'un de trois : **publié** (lu tel quel dans la source), **recalculé**
  (calculé par nous, données d'entrée, horizon et méthode écrits), **non calculable** (motif écrit).
  La syntaxe exacte pour un NNT est dans la section Format (§ Syntaxe du Calcul) ; la même
  distinction vaut pour tout autre chiffre dérivé (réduction absolue du risque, différence de
  moyennes, pourcentage recalculé).
- **Un chiffre recalculé ne se présente jamais comme extrait de l'article.**
- **HR, RR et OR ne sont pas interchangeables** : conserver le type d'estimation de la source, tel
  qu'elle le nomme. Distinguer risque cumulé et taux d'événements. Une conversion d'une mesure à
  l'autre ne s'improvise pas : sans risques absolus publiés, le NNT est `non calculable`, et c'est
  une sortie valide.
- Conserver aussi le cadre du test tel que la source le déclare (unilatéral ou bilatéral, seuil,
  préspécifié ou exploratoire) : le reformuler, c'est changer le chiffre.
- Pour un recalcul, l'horizon temporel est obligatoire (renvoi : `docs/decision/00-global.md`
  § Règles de sourcing, effet absolu et horizon).

### Journal de recherche

Chaque dossier tient, à côté du registre, un journal qui permet à un autre lecteur de **rejouer** la
recherche — y compris celles qui n'ont rien donné. Une ligne par requête :

```markdown
| Date | Base / interface | Requête exacte | Filtres | Résultats affichés | Examinés | Retenus | Exclus (motif) |
|---|---|---|---|---|---|---|---|
```

- `Requête exacte` : la chaîne telle que tapée, termes contrôlés et opérateurs compris.
- `Résultats affichés` : le total que l'outil annonce ; s'il n'en donne pas, écrire
  `non disponible` — jamais une estimation.
- `Examinés` : ce qu'on a réellement ouvert ou lu (titres, résumés, textes), distinct du total.
- `Retenus` / `Exclus` : les références, et pour chaque exclusion son motif.
- `Filtres` : seulement ceux que la question impose, et pourquoi ; une recherche de repérage part
  sans filtre.
- Deux interfaces qui interrogent le même corpus ne valent pas deux recherches indépendantes : le
  noter plutôt que de compter deux bases.
- Prévoir synonymes, termes contrôlés, études citées et citantes (`acces-identite.md` § 5) ; vérifier
  qu'une étude repère connue ressort de la requête — sinon la requête est trop étroite.
- Les questions posées à un outil d'IA figurent aussi au journal (outil, modèle, date, prompt ;
  `references/openevidence.md` § Fiche de retour).

### Réutiliser un dossier

Ne pas refaire un travail déjà vérifié — mais ne pas figer une preuve périmée. Un dossier réutilisé
porte en tête :

- **la date de la dernière recherche** et **le périmètre couvert** (question, PICO, bases, période) ;
- ce qui est **repris** tel quel (extractions déjà vérifiées et toujours pertinentes), ce qui a été
  **actualisé**, et ce qui reste **hors périmètre**.

Une mise à jour s'impose — par une recherche de nouveautés datée, pas par une relecture complète du
corpus — quand survient l'un de ces événements : nouvelle publication sur la question, résultats
d'un essai attendu, correction ou rétractation d'une étude du dossier, changement de recommandation,
extension du PICO. Les recommandations françaises restent à vérifier pour l'applicabilité locale,
même si elles sont hors du périmètre d'OpenEvidence (renvoi : `docs/decision/00-global.md`
§ Règles de sourcing).
