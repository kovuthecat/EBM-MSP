# 2026-07-22 — D9 · Choix techniques du câblage P1 (MVP module Décision)

### Décision

Choix verrouillés pour que les sessions P1 n'aient aucune dépendance à trancher (sinon STOP) :

- **Navigation state-based**, sans routeur — on reproduit la machine à écrans du prototype
  (`screen` dans l'état). **Aucune dépendance runtime ajoutée** hors `react`/`react-dom`.
  *Conséquence : pas d'URL partageable par nœud en v1 (acceptable — outil de consultation).*
  react-router pourra être ajouté plus tard si le deep-link devient nécessaire.
- **Contenu YAML importé via plugin Vite** (`@modyfi/vite-plugin-yaml`, **devDep**) → objets JS au build.
- **Validation JSON Schema via Ajv** (**devDep**) : `/schema/*.json` vérifiés contre `/content/**` dans
  un test Vitest (échoue si un nœud est non conforme). Satisfait « validé par JSON Schema » sans
  pipeline de build séparé.
- **Styles = variables CSS OKLCH** (`:root`, un `tokens.css`) + styles co-localisés par composant.
  Pas de framework CSS, pas de CSS-in-JS. Valeurs exactes = prototype `.dc.html`.
- **Icônes** : aucune en MVP (le prototype est sobre) ; `lucide-react` autorisé plus tard si besoin.
- **Tests** : Vitest (déjà prévu).

### Raison du choix

Priorités `CONVENTIONS.md` (simplicité, peu de dépendances, pas d'abstraction prématurée). Le prototype
est déjà state-based ; ne pas ajouter de routeur tant que le besoin (deep-link) n'existe pas. Seules
2 devDeps (`@modyfi/vite-plugin-yaml`, `ajv`) — justifiées par le modèle de contenu du brief.

### Conséquences

Les sessions P1 peuvent installer ces devDeps sans re-trancher. Le module Veille (P2) réévaluera le
besoin d'un routeur et introduira Supabase.
