# P6 · SB7 — Le CTA flottant recouvre le bouton « Suivant » en mobile (défaut mineur S6, point 1c)   (ajoutée en cours de plan, suite au rapport S6 du 2026-07-29)

> **Modèle : Sonnet · effort : medium · Vague : 4 bis (parallèle : oui, avec SB6)**
> Exécutant : UNIQUEMENT la tâche ci-dessous ; fichiers sous « Lire » / « Modifier ».
> Design fixé — ne reconçois pas au-delà de ce cadrage. Doute ou blocage → STOP, signale, rends la main.

- Date : 2026-07-29 · Branche : —

## Contexte (pourquoi cette session existe)

`plans/P6/S6.md` (rapport : `docs/decision/validation/recette-navigateur-2026-07-29-P6.md`, point 1c) a
trouvé qu'en mobile (375×812), sur un nœud à accordéon multi-sections (`Insulinothérapie` reproduit,
mais le mécanisme est générique — `Traiter` et les deux nœuds RHD ont le même bouton), le bouton flottant
« Voir les recommandations (N) ↓ » (`.decision-node__floating-recos`, fixe en bas d'écran) **recouvre**
le bouton « Suivant : … → » de fin de section d'accordéon (`.criteria-form__group-suivant-bouton`).
Mesure exacte du rapport : bouton « Suivant » `top 709 / bottom 757` (hauteur 48px), bouton flottant
`top 724 / bottom 796` — chevauchement sur 33 des 48px (≈ 69 %). `document.elementFromPoint(200, 740)`
renvoie le bouton flottant, pas « Suivant » : cette zone est réellement inatteignable au clic, seule une
fine bande en haut du bouton (`elementFromPoint(200, 712)`) reste cliquable.

Pas destructif (aucune perte de saisie), mais un geste de navigation naturel — taper en bas d'écran pour
avancer à la section suivante — est très majoritairement bloqué. Thibault a demandé de corriger
maintenant, dans la même passe que SB6, avant de repousser au push.

## Lire (commun à la session)

- `src/features/decision/screens/DecisionNodeScreen.css` — `.decision-node__floating-recos` (~ligne
  51-70) : `position: fixed`, `bottom: 16px`, hauteur réelle ≈48px (padding 12px 22px + texte), `z-index:
  10`. Actif uniquement `< 960px` (cf. commentaire juste au-dessus, `isNarrow`).
- `src/features/decision/screens/DecisionNodeScreen.tsx` — le rendu conditionnel du bouton flottant
  (cherche `floating-recos`), pour comprendre à quelles conditions il est monté/démonté.
- `src/features/decision/components/CriteriaForm.css` — le style de `.criteria-form__group-suivant` /
  `.criteria-form__group-suivant-bouton` (cherche `group-suivant`) : le bouton de fin de section
  d'accordéon, celui qui se fait recouvrir.
- `src/features/decision/components/CriteriaForm.tsx` — ~ligne 559-616 : rendu du bouton « Suivant »
  (`groupeSuivant`), pour situer sa place dans le flux du DOM (fin de la section d'accordéon ouverte).

## Hors périmètre

- Ne touche pas au comportement du bouton flottant en desktop (`≥ 960px` — il est masqué, ce point ne le
  concerne pas).
- Ne change pas la logique d'ouverture/fermeture de l'accordéon, ni le contenu du bouton « Suivant ».
- Ne touche à aucun autre nœud ni composant hors de ces deux fichiers CSS/TSX.
- Ne mets à jour ni `STATUS.md`, ni `TASKS.md`, ni `plans/P6/index.md`. Ne lance jamais `git commit` ni
  `git push` — consolidation en fin de plan.

---

## T-046 — Éliminer le chevauchement, en mobile, entre le CTA flottant et le bouton « Suivant »

### Objectif

Qu'aucune interaction utile (bouton « Suivant » de section) ne soit recouverte par le bouton flottant
fixe, sur toute la plage `< 960px`, sans supprimer ni déplacer le raccourci flottant lui-même (il reste
utile pour sauter directement aux résultats depuis n'importe quelle section).

### Décision clé

Pas de solution imposée — plusieurs pistes raisonnables, à toi de choisir la plus simple et la plus
robuste (pas de JS si un ajustement CSS suffit) :
- Réserver, en bas de la zone de formulaire scrollable (`< 960px` uniquement), un espace équivalent à
  l'empreinte du bouton flottant (hauteur ≈48px + `bottom: 16px` + une marge de respiration) pour que
  le contenu du formulaire (dont le bouton « Suivant ») ne défile jamais derrière.
- Ou toute autre approche qui élimine le chevauchement mesuré, sans cacher le bouton flottant quand il
  est utile, et sans casser le layout desktop (`≥ 960px`, où ce bouton n'existe pas).

### Étapes

1. Reproduis le défaut : mobile 375×812, un nœud à accordéon (`Insulinothérapie` ou `Traiter`),
   fais défiler jusqu'au bouton « Suivant » de la première section vierge.
2. Applique le correctif choisi, limité à `< 960px` (media query existante ou nouvelle, cohérente avec
   celle déjà utilisée pour `isNarrow`/le bouton flottant).
3. Vérifie numériquement l'absence de chevauchement : les rectangles des deux boutons (`getBoundingClientRect`
   en test, ou raisonnement géométrique direct si le correctif est une marge fixe suffisamment large) ne
   doivent plus se recouvrir. Si un test existant couvre déjà la mise en page mobile de ce bouton,
   étends-le ; sinon, un test n'est pas obligatoire ici si le correctif est une constante CSS simple et
   vérifiable par lecture (mais documente ton raisonnement numérique dans le rapport de tâche).
4. Vérifie que le bouton flottant reste pleinement cliquable et visible par ailleurs (il ne doit pas
   disparaître ni devenir inatteignable lui non plus).
5. Fais tourner la suite COMPLÈTE en foreground (`npm test`, pas un sous-ensemble), `npx tsc --noEmit`,
   `npm run build`.

### Validation

- **N0 auto (bloque le commit)** : `npm test` (suite complète) → tout vert · `npx tsc --noEmit` → 0
  erreur · `npm run build` → OK.
- **N1 visuel** : `—` (pas de navigateur dans cette session — une session de contrôle séparée revérifiera
  à l'écran).
- **N2 humain** : `—`.

### Si bloqué

Si éliminer le chevauchement semble exiger de la logique JS complexe (ex. masquer le bouton flottant
seulement quand « Suivant » est visible, via `IntersectionObserver`) : ne te lance pas dans cette
direction sans STOP — signale que la piste CSS simple ne suffit pas et pourquoi, laisse trancher.

### Message de commit (appliqué en fin de plan)

`fix(ui): mobile — le CTA flottant ne recouvre plus le bouton « Suivant » de l'accordéon (P6, défaut S6 point 1c)`

### Statut

Suivi dans `plans/P6/index.md`.

---

## Fin de session

Dérouler `/fin-de-tache` (mode parallèle : signale la fin sans bloquer, une autre session — SB6 — tourne
en parallèle sur des fichiers disjoints).

---

## Bilan de session (T-046, exécuté 2026-07-29)

**Fichiers modifiés** : `src/features/decision/screens/DecisionNodeScreen.css` (seul fichier touché —
aucun autre, ni `.tsx`, ni `CriteriaForm.*`).

**Résumé** : piste retenue = réserver de l'espace en bas de `.decision-node` (le conteneur qui porte tout
le contenu défilable de l'écran, y compris le formulaire à accordéon), uniquement `< 960px` (media query
`max-width: 959px`, même seuil que `isNarrow` côté JS et que le `min-width: 960px` déjà présent dans ce
fichier). `padding-bottom` passe de 80px (règle de base, tous écrans) à 140px sur mobile. Aucune ligne JS
touchée, aucun changement sur le bouton flottant lui-même (position, taille, comportement, visibilité) ni
sur l'accordéon/le bouton « Suivant ». Choix par élimination : la seconde piste esquissée en "Si bloqué"
(masquer le CTA via `IntersectionObserver` quand « Suivant » est visible) est de la logique JS non
nécessaire ici — écartée d'emblée, la piste CSS suffit.

**Raisonnement numérique (pas de navigateur dans cette session, cf. N1 — vérifié par calcul, à confirmer
visuellement par la session de contrôle)** :

- Empreinte réelle du CTA (mesurée en S6, inchangée par cette session) : top 724 / bottom 796 dans un
  viewport 375×812, soit 88px depuis le bas du viewport (72px de hauteur + 16px de `bottom`).
- `.decision-node` est le conteneur racine de tout le contenu défilable de l'écran (pas de scroll-container
  intermédiaire avec `overflow` restreint — vérifié : `AppShell.css`/`global.css` n'utilisent que
  `min-height: 100vh`, le défilement est celui du document). Augmenter son `padding-bottom` augmente donc
  d'autant la hauteur totale défilable, et repousse d'autant tout point de contenu qui se serait
  retrouvé épinglé au bas du viewport en fin de défilement — dont le bouton « Suivant » mesuré par S6.
- Cas le plus défavorable (le plus prudent à vérifier) : si le bouton « Suivant » était immédiatement suivi
  de rien d'autre que ce padding (aucun contenu réel entre les deux — pas le cas réel, où suivent au
  minimum les sections repliées suivantes + le pied de page, mais c'est le plancher de garantie) : en fin
  de défilement, le bord inférieur de « Suivant » se retrouve à `812 − 140 = 672`. Le bord supérieur du CTA
  reste à 724 (inchangé). Marge de dégagement garantie : `724 − 672 = 52px` — élimine largement le
  chevauchement mesuré par S6 (33 des 48px). Tout contenu réel intercalé (sections repliées, colonne
  résultats empilée, pied de page) ne peut qu'AUGMENTER cette marge, jamais la réduire.
- Aucun test unitaire ajouté : correctif = une seule constante CSS dans une media query déjà utilisée
  ailleurs dans ce fichier, vérifiable par lecture (cf. SB7.md Étape 3, clause d'exemption explicite).
  `jsdom` (moteur des tests existants) ne calcule pas de vraie mise en page CSS — un test
  `getBoundingClientRect` y aurait été un théâtre de vérification, pas une preuve.

**N0 (bloque le commit — commit non fait, réservé à la fin du plan)** :

- `npm test` (suite COMPLÈTE, foreground, PAS un fichier ciblé) → **825 passed, 11 skipped, 0 failed**
  (44 fichiers passés, 1 skip-file).
- `npx tsc --noEmit` → **0 erreur**.
- `npm run build` → **OK** (seul warning : chunk JS > 500kB, préexistant, sans rapport avec ce correctif).

**N1** : `—`, comme prévu par le cadrage (pas de navigateur dans cette session). Raisonnement numérique
documenté ci-dessus en attendant la vérification visuelle par la session de contrôle annoncée dans SB7.md.

**N2** : `—` (rien qui relève du jugement humain au-delà de la vérification visuelle déjà prévue en N1).

**Écarts par rapport au cadrage** : aucun. Un seul des deux fichiers CSS listés en lecture a été modifié
(`DecisionNodeScreen.css`) — `CriteriaForm.css`/`.tsx` et `DecisionNodeScreen.tsx` n'ont pas eu besoin
d'être touchés, la piste retenue se suffisant d'une seule règle dans un seul fichier. Pas de STOP
nécessaire : la piste CSS simple a suffi, la branche « Si bloqué » (JS) ne s'est pas appliquée.

**Prochaine action** : néant côté SB7 — en attente de la session de contrôle visuel (N1) et de la
consolidation de fin de plan (statuts, commit avec le message prévu, push).
