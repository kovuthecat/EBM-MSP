# Nœud <X> — <titre>   (dossier de preuve)

- **statut** : en cours | vérifié-bi-agents | validé-référent
- **version** : 0.1 · **date** : AAAA-MM-JJ · **auteur** : <toi/Opus + référent>
- **id YAML cible** : `<id>` · domaine `diabete-type-2`

## 1. Question clinique & critères d'entrée

- PICO : P … / I … / C … / O (critères **durs** visés) …
- Variables d'entrée (→ `criteres_entree` du schéma) : `<nom:type[:valeurs]>`, …

## 2. Options envisagées (brouillon)

- Option 1 — `conditions: [...]`
- Option 2 — `conditions: [...]`
- … (default en dernier)

## 3. Base de preuves (grille par étude clé)

### Étude — <nom, année> `[lien/DOI À VÉRIFIER]`
- Type / design · population · comparateur · durée
- **Critère** : principal = … → **dur / substitution**
- **Effet** : relatif (…) · **absolu / NNT-NNH (+ horizon)** · précision (IC)
- Biais / spin / arrêt précoce / conflits d'intérêt
- **GRADE** : eleve | modere | faible | tres_faible — justification
_(répéter par étude)_

## 4. Synthèse critique

- Position raisonnée (evidence-based critique) : …
- **Reco officielle** (source, position) vs position critique — **divergence : oui/non** — explication : …

## 5. Vérification bi-agents

- **Agent A (extraction/chiffres)** : …
- **Agent B (red-team, DOI/chiffres vs source primaire)** : …
- **Réconciliation** : consensus vérifié · divergences escaladées · non-vérifiable (écarté/`[À VÉRIFIER]`)

## 6. Incertitudes

- …

## 7. → YAML (contenu distillé, prêt à encoder)

```yaml
# options[] avec intitule, avantages, inconvenients, effet_attendu, niveau_preuve, conditions, contre_indications
# argumentaire, sources{references_primaires[...], reco_officielle{...}}, incertitudes[]
```

## 8. Demandes au référent

- Textes Prescrire souhaités : …
- Arbitrages cliniques en attente : …
