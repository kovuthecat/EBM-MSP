# 2026-08-10 — D63 · Thème `pediatrie` ajouté à la taxonomie et au périmètre de production (14 thèmes, 12 en production)

### Décision

1. **Nouveau thème `pediatrie`** dans la taxonomie partagée décision ↔ veille — la 14ᵉ valeur.
   Périmètre : prescription et déprescription chez l'enfant, suivi du nourrisson. Répercuté dans les
   quatre endroits où la liste est dupliquée : `docs/veille/BRIEF_VEILLE.md` §4, `ARCHITECTURE.md`
   § « Données affichées », `SOP_veille.md` §3bis, et la table `THEME_LABELS` de
   `src/features/veille/screens/VeilleListScreen.tsx` (libellé « Pédiatrie »).
2. **`pediatrie` entre au périmètre de production**, qui passe de 11 à **12 thèmes**.
3. **`pediatrie` est un thème MG, pas un thème « hors compétence ».** La pédiatrie de soins premiers
   fait partie du champ d'exercice du médecin généraliste : le référent est compétent pour trancher.
   Conséquence directe et explicite : **circuit bi-agents §7 standard**, arbitrage par le référent au
   §5 étape 5, et **`meta.relecture_referent: true`**. Le §7bis (tri-agents + mention publiée) ne
   s'applique **pas** — il reste réservé à `orthophonie` et `sante-femme-perinatalite`.
   Le compte des thèmes MG passe donc de 9 à **10**.

### Contexte

La réconciliation bi-agents de l'item H01 (IPP chez le nourrisson et risque d'infections graves,
Lassalle *et al.*, *JAMA Pediatrics* 2023) a buté sur un blocage de modèle de données, pas de méthode :
l'item franchit C1+C2+C3, les deux agents convergent sur `analyse` / `pratique` / preuve `modérée`,
mais **aucun des 13 thèmes existants ne pouvait le porter**. L'agent analyste avait proposé
« pédiatrie ; iatrogénie ; RGO nourrisson » — trois valeurs qui n'existent pas.

Les options de repli étaient toutes mauvaises : `soins-premiers` seul est exact mais fait disparaître
le signal pédiatrique du filtrage par thème (l'item devient introuvable pour qui cherche de la
pédiatrie) ; `geriatrie-deprescription` aurait rangé un nourrisson sous un thème nommé « gériatrie »,
erreur visible par le lecteur ; `infectiologie-antibiotherapie` vise les durées de traitement et la
résistance, pas le risque infectieux iatrogène.

Le référent a tranché les trois points remontés par la réconciliation : créer le thème, inclure
`sage-femme` dans les professions concernées de H01, et acter que **la pédiatrie fait partie du champ
MG** — ce dernier point étant celui qui détermine le circuit de vérification applicable.

### Alternatives envisagées

- **Ranger H01 sous `soins-premiers` et ne rien changer** — écartée : c'était la recommandation
  provisoire du réconciliateur, mais elle revenait à accepter durablement qu'un item pédiatrique soit
  introuvable au filtrage. Le problème se serait reposé au prochain item pédiatrique.
- **Créer le thème mais le laisser hors production** (comme `ETP`/`soins-infirmiers`) — écartée : sans
  objet ici, puisque le motif de mise hors production de ces deux thèmes est l'absence de référent
  compétent, et que la pédiatrie de soins premiers relève justement de la compétence du référent.
- **Créer le thème et le soumettre au circuit tri-agents §7bis**, par prudence — écartée, et c'est
  l'arbitrage de fond : le §7bis n'est pas un supplément de rigueur qu'on ajoute par précaution, c'est
  le dispositif qui **contient un angle mort de compétence** et qui a pour contrepartie une mention
  publiée (`relecture_referent: false`). L'appliquer là où le référent est compétent afficherait au
  lecteur une absence de relecture qui n'existe pas — un signal faux, dans le sens inverse de celui
  que D61 cherchait à donner.
- **Élargir le périmètre en silence, à l'occasion de H01** — explicitement refusée par le
  réconciliateur avant remontée : un item ne doit pas servir de prétexte à un changement de périmètre.
  D'où cette décision distincte.

### Conséquences

- **Aucun changement de type TypeScript nécessaire** : `themes` est typé `string[]` dans
  `entree.types.ts` (pas d'union littérale), la taxonomie n'est donc pas contrainte à la compilation.
  Le commentaire JSDoc (« 13 valeurs ») a été porté à 14. **À faire si `schema/veille/entree.schema.json`
  est créé un jour** : y inscrire l'énumération complète des 14 thèmes — c'est le seul endroit où la
  liste deviendrait opposable, aujourd'hui elle ne l'est nulle part.
- Le libellé « Pédiatrie » n'apparaîtra à l'écran qu'une fois une première entrée `pediatrie` publiée :
  la table `THEME_LABELS` ne sert qu'à traduire les slugs présents dans le contenu. Aucune entrée
  existante n'est concernée, aucune migration de contenu.
- **H01 est débloqué** : `themes: [pediatrie, soins-premiers]`, `professions_concernees: [MG, IPA,
  sage-femme]`, `relecture_referent: true`, circuit bi-agents §7 déjà exécuté et réconcilié
  (`docs/veille/verifications-backlog/H01-reconciliation.md`). Reste l'escalade humaine du §7 —
  la validation du référent — avant rédaction de l'entrée.
- **Le compte « 9 thèmes MG » est périmé partout où il figurait** ; les occurrences de `SOP_veille.md`
  ont été portées à 10. Toute reprise ultérieure de cette formule doit vérifier le compte plutôt que
  le recopier.
- **À revoir** : le périmètre de production a bougé trois fois en deux jours (D60, D61, D63). Ce n'est
  pas un problème en soi — le périmètre initial de D40 était volontairement étroit — mais la règle de
  calibration du seuil (`SOP_veille.md` §6bis) suppose un périmètre stable pour être interprétable.
  Ne pas conclure sur le réglage du seuil avant plusieurs semaines à périmètre constant.
