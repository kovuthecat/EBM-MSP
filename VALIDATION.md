# VALIDATION.md — checklist visuelle / UX (passe humaine) — ebm-msp

> Validation **visuelle** déléguée à l'humain, **non bloquante** pour les commits.
> L'exécutant consigne ici la ligne « visuel : » de chaque tâche du plan — il ne la vérifie PAS
> lui-même (pas de navigateur, pas de capture). Légende : [ ] à valider · [x] OK · [!] à corriger.
> **Purge** : supprimer les blocs entièrement `[x]` après la passe humaine.
> Un bloc par écran/module courant. Passage à l'échelle : router la validation propre à un
> sous-domaine dans `docs/<sous-domaine>/VALIDATION.md` si ce fichier gonfle.

## Shell (S1 · T-001)

- [ ] Header sticky : logo + libellé, pills Décision/Veille (transparent inactif / plein actif), lien
  Méthode, menu compte (`?` + « Invité », dropdown Profil/Pour mémoire/Se connecter) — fidèles au
  prototype `MSP Menilmontant.dc.html` (lignes ~19–54).
- [ ] Bandeau disclaimer sous le header, visible sur tous les écrans sauf `home`/`auth`.
- [ ] Responsive : pas de débordement horizontal en mobile étroit (le menu compte à droite wrap en premier).
- [ ] Menu compte : pas de fermeture au clic extérieur (stub minimal assumé) — noter si gênant.

## Accueil / Méthode (S1 · T-008)

- [ ] Accueil : mini-header interne (distinct du header sticky), hero centré, disclaimer encadré, 2
  cartes cliquables (indigo Décision / teal Veille). CTA carte Décision lit comme un libellé neutre
  (« voir les algorithmes disponibles → »), sans chiffre inventé, non tronqué/mal aligné.
  Token `--c-badge-preuve-tres-faible` non fixé en S1 (valeur absente du prototype relu) — à compléter.
- [ ] Méthode : 5 sections lisibles, max-width ~760px, cohérentes avec `docs/veille/SOP_veille.md`
  (pas le texte illustratif du prototype).

## Contenu DT2 — nœud A « Cible glycémique » (S2 · T-007)

**⚠️ PÉRIMÉ — ne pas valider tel quel.** Ce contenu suit l'ancien `BRIEF_DECISION.md §11` ; un dossier
de preuve + vérification indépendante 2 passes (`docs/decision/noeuds/A-cible-glycemique.md` +
`.verification-p2.md`) conclut « NON prêt à encoder » sur cette version (variable `age` non utilisée,
CV établi mal routé, conditions non disjointes, `divergence` erronée, etc. — détail §2 du rapport).
`meta.statut: brouillon` reflète cet état. **Ne pas faire relire ce YAML par le référent tel quel** —
attendre le ré-encodage (T-007bis, cf. `TASKS.md`) depuis le dossier à jour.

## Décision D2 (S4 · T-005)

- [ ] Chips domaine (DT2 actif indigo ; CV/BPCO/Gériatrie « à venir » pointillés/désactivés) et cartes
  nœud (titre, population, date de revue, badge veille si `veille_liee` non vide) fidèles au prototype.
- [ ] Redondance assumée à juger : avec un seul nœud réel, l'intitulé de groupe (thème = `titre` du
  nœud, faute de champ dédié) et le titre de carte affichent le même texte — acceptable en P1
  (1 nœud/thème), à revisiter si plusieurs nœuds par thème (P3+).
- [ ] Responsive mobile.

## Décision D3 (S4 · T-006)

- [ ] Le filtrage réagit aux critères conformément à l'ancien brief §11 (4 bandes) — **mais rappel** :
  le contenu source est périmé (cf. bloc « Contenu DT2 » ci-dessus), donc cette validation porte sur le
  **comportement du moteur/UI**, pas sur la justesse clinique des bandes affichées.
- [ ] Cas fragile + espérance limitée : « 7,5–8 % » ET « 8–8,5 % » sont toutes deux applicables,
  « 7,5–8 % » recommandée en premier (ordre du YAML) — comportement du moteur tel que spécifié,
  signalé et différé par l'utilisateur ; à revoir avec le ré-encodage T-007bis.
- [ ] Ligne « Pourquoi cette option » : phrase générée depuis les conditions réelles — lisibilité clinique.
- [ ] Divergence/sources/incertitudes affichées ; argumentaire déplié/replié ; mobile.
- [ ] Libellés de critères/valeurs d'énumération non catalogués : repli `humanize()` sans accents
  (limitation assumée, sans impact clinique).
