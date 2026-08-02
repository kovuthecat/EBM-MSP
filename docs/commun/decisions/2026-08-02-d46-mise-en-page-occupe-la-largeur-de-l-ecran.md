# 2026-08-02 — D46 · La mise en page occupe la largeur de l'écran

### Décision

`.decision-node` passe de `max-width: 900px` à `max-width: 1600px` (`DecisionNodeScreen.css`, P11/S10,
T-118). Les deux colonnes (critères / recommandations, grille `minmax(420px, 1fr) minmax(380px, 1fr)`)
grandissent à parts égales sur un écran large ; le rapport 1fr/1fr n'est pas changé. Un plafond demeure à
1600 px : au-delà, les lignes de texte clinique (intitulés d'option, libellés de critère, argumentaires)
deviendraient illisibles au-delà d'environ 90 caractères par ligne, dans un contenu lu vite en
consultation.

### Contexte

S7 avait mesuré que `.decision-node` à 900 px ne laissait que ~20 px de jeu au-dessus du minimum requis
par la grille (420 + 380 + 32 = 832 px), soit ~390 px réels pour la colonne de recommandations — 10 px
au-dessus du plancher sur lequel la carte compacte de D45/S6 a été calibrée. La mise en page était donc au
bord de la rupture. L'arbitrage référent du 2026-08-02, rendu après lecture du code livré par S1→S7 (pas
sur maquette) : « les deux colonnes doivent occuper la largeur de l'écran, l'usage principal est le
desktop grand écran ».

### Raison du choix

1600 px, retenu comme plafond plutôt qu'un élargissement sans borne : sur un écran 1920 px courant, la
mise en page occupe la largeur utile ; au-delà, elle cesse de s'étirer plutôt que de dégrader la lecture.
**Ce chiffre n'est pas issu d'une mesure** — à la différence des 900 px qu'il remplace (mesurés par S7) —
c'est un jugement de lisibilité, explicitement soumis à la recette.

### Conséquences

- `DecisionNodeScreen.css` l.1-5 seulement ; aucun breakpoint (480/640/960) ni `LARGEUR_ETROITE_MAX`
  changé — la bascule une colonne/deux colonnes reste au même seuil.
- Referme l'item N2 qu'avait ouvert T-114 (S7) sur la largeur de 900 px : tranché par l'arbitrage.
- **Le plafond de 1600 px lui-même reste soumis au jugement N2**, consigné dans `VALIDATION.md`
  (item T-118) : la mise en page paraît-elle vide au centre sur très grand écran, ou encore contrainte ?
  Le rapport 1fr/1fr tient-il une fois étiré ? La recette S8 n'a pas pu produire de capture d'écran
  (panneau navigateur non compositant) : l'inspection DOM/console/réseau ne tranche pas un jugement de
  lisibilité au pixel — ce point reste ouvert au sens plein du terme, pas seulement en attente de
  signature.
