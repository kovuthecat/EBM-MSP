# Passe de rédaction des quatre niveaux d'argumentaire — DT2, 2026-08-05

> **Objet** : relecture puis correction de la rédaction des quatre niveaux de lecture des six nœuds DT2
> — badge de preuve (et le panneau « État des preuves » qu'il ouvre), carte dépliée, argumentaire du
> nœud, argumentaire exhaustif. Objectif : lisibilité, clarté et précision pour un praticien en
> consultation. **Aucun champ moteur n'a été touché** (`conditions`, `prerequis`, `exclusions`,
> `priorite`, `role`, `famille`, `derive`, `visible_si`, clés de `motifs`) — vérifié par diff ciblé.
> **Statut : en attente de relecture clinique.**

## Ce que la relecture a trouvé, et ce qui a été corrigé

Six familles de défaut, présentes dans presque tous les nœuds. Ce n'étaient pas des erreurs de fond —
le contenu clinique est sourcé et gradué — mais des erreurs de **placement** et de **synchronisation** :
chaque niveau contenait du texte appartenant à un autre, et les quatre niveaux avaient été édités à des
rythmes différents.

1. **Contradictions cliniques entre niveaux.** Une carte proposait la sitagliptine 25 mg sous DFG < 30
   quand le reste du nœud dit cette forme non commercialisée en France (vildagliptine retenue) ; deux
   textes proposaient le sémaglutide oral au patient refusant les injections, que le niveau exhaustif
   qualifie de proposition trompeuse (non remboursé, indisponible en officine) ; l'argumentaire exhaustif
   de `statine` tournait au seuil de CK de 4 N quand le nœud fonctionne à 5 N, et sa table de conduite
   prescrivait « ne pas débuter » là où les cartes affichent « débuter à dose plus faible » ; le résumé
   d'entrée de `rhd-alimentation` disait qu'un trouble alimentaire repéré « bloque » les pistes alors
   qu'il ne bloque plus rien ; `insuline` visait une cible pré-prandiale que ses deux références
   affichées contredisaient, sans divergence déclarée. **Toutes corrigées.**

2. **Badge de preuve non interprétable.** Quatre cartes de `prescription` affichent « Preuve faible » sur
   des contre-indications formelles ; la convention (GRADE mesure la certitude de la donnée, pas la force
   de la recommandation) n'existait qu'en commentaire de fichier. Elle est désormais écrite dans
   l'argumentaire de chaque nœud concerné et au niveau exhaustif. Aucun `niveau_preuve` n'a été modifié,
   sauf sur une carte de `statine` dont le badge et le délai qualifiaient le traitement alternatif et non
   le geste titré (« Interrompre la statine ») — aligné sur sa carte jumelle.

3. **Chaque texte à son niveau.** La posologie vivait dans les avantages, les contre-indications ou le
   panneau de preuves ; les chiffres d'essai vivaient dans l'aperçu de posologie. Les cartes portant un
   panneau posologie passent de 16 à 34 sur 84.

4. **Traçabilité.** Les cartes sourcées passent de 40 à 65 sur 84, les délais de bénéfice de 6 à 17 —
   en câblant des références qui existaient déjà. Les essais nommés à l'écran sans entrée bibliographique
   ont été versés ou retirés du texte ; les titres de références servant de mini-critiques sont ramenés au
   gabarit « quel essai », les réserves descendant au niveau exhaustif.

5. **Le contenu parlait de l'outil.** Noms de champs YAML, renvois vers des cartes ou alertes disparues,
   chemins du dépôt, mentions « brouillon », marqueurs `[À VÉRIFIER]`, vocabulaire du moteur, et — dans les
   deux nœuds RHD — 28 listes d'avantages sur 29 s'ouvrant par « Provenance : … ». Corrigés, et **verrouillés
   par un invariant** (voir plus bas).

6. **Redites moteur ↔ contenu et lisibilité.** Les `avantages` qui recopiaient les critères déclencheurs
   déjà rendus par « Proposé parce que » (règle R6) ; les phrases de plus de 100 mots ; les sigles jamais
   développés (AGP, MACE, ULN, MCG, CK) ; les capitales d'emphase, désormais réservées aux faits de sécurité.

## L'invariant qui empêche la récidive

`engine/banc/jargon-projet.test.ts` gagne **sept marqueurs** (lot du 2026-08-05), appliqués aux champs
affichés des nœuds, des modules et aux six argumentaires exhaustifs : backtick, chemin de dépôt, statut
éditorial (« brouillon »), marqueur de donnée manquante (`[À VÉRIFIER]`), renvoi interne (« dossier de
preuve », « cf. changelog »), vocabulaire du moteur, identifiant de décision parenthésé. **Mesurés à zéro
sur le corpus corrigé, donc sans aucune dette ni exemption** — c'était la quatrième famille de jargon
corrigée à la main, et la troisième fois qu'un lot était ajouté après coup.

## À arbitrer — par ordre d'importance clinique

### Points de fond

1. **`insuline` — garde-fou d'hypoglycémie absent chez le patient sans capteur.** Les exclusions des deux
   options d'escalade (« basale + un bolus », « ajouter un bolus ») sont **toutes** gardées par
   `mcg_disponible == true` : un patient sans mesure continue n'a donc aucun garde-fou sur ces deux
   cartes. L'argumentaire exhaustif promettait le contraire (« le patient sans mesure continue déclenche
   le même garde-fou par une glycémie à jeun sous 0,70 g/L ») — la description a été corrigée, **pas
   l'encodage**, qui sort du mandat d'une passe rédactionnelle. Décision à rendre.

2. **`statine` — conduite d'urgence pour des CK très élevées découvertes avant initiation.** Les cartes
   CK > 10 N et > 50 N exigent toutes `statine_deja_en_place == true` : un patient jamais traité dont les
   CK sont à 60 N atterrit sur la carte terminale, sans avis spécialisé urgent ni réhydratation. Si la
   conduite source existe, c'est un trou du nœud et pas seulement de son argumentaire.

3. **`prescription` — intervalle de confiance à revérifier.** `aHR 1,69 (IC95 % 1,25-2,59)` (Huang & Yeh),
   affiché à trois endroits, n'est pas log-symétrique : √(1,25 × 2,59) = 1,80, quand les trois autres HR du
   même dossier le sont. **Rien n'a été touché.** À revérifier sur PMID 31108137.

4. **`insuline` — `risque_hypoglycemique_eleve` ne contient ni l'insuffisance rénale ni l'hypoglycémie
   nocturne**, alors que les deux sont recueillies par ailleurs. La promesse a été retirée du texte ;
   ajouter ces deux signaux au dérivé demanderait de modifier une expression `derive`.

### Données manquantes qui bloquent un affichage

5. **`prescription`** — l'horizon du NNT 45 de CAROLINA (« NNT 45 / 6,3 ans ») existe dans
   `docs/decision/noeuds/C-intensification.md` mais pas dans le dossier du nœud : autorisation de l'y
   verser ? Un NNT sans durée n'est pas interprétable (règle R2). Manquent aussi : l'horizon de
   SURPASS-CVOT, la molécule et la posologie du tirzépatide, une référence pour l'association
   iSGLT2 + AR GLP-1.
6. **`insuline`** — `delai_benefice` reste vide sur six options de preuve modérée : la durée de suivi des
   essais cités (MOBILE, FreeDM2, Jancev, DUAL VII, Eng, Maiorino, FullSTEP, Treat-to-Target) n'est pas au
   dossier. « Poursuivre le schéma » reste sans référence, et son « réévaluer à 3-6 mois » sans source.
7. **`cible-glycemique`** — deux chiffres marqués `[À VÉRIFIER]` ont été **retirés** faute de valeur : les
   réductions absolues post-essai d'UKPDS 80 (NEJM 2008;359:1577-1589) et le taux d'hypoglycémie sévère de
   VADT (NEJM 2009;360:129-139). Le NNT ≈ 125 de Ray 2009 a été retiré de la carte « Cible ≤ 7 % » faute
   d'entrée bibliographique : ajouter l'id `ray` (Lancet 2009;373:1765-1772) permettrait de le rétablir.
8. **`statine`** — l'incertitude sur le taux de reprise après réintroduction cite des bornes (72,5 % à
   « plus de 90 % à un an ») qui n'ont aucune source au dossier, alors que le niveau exhaustif donne
   SAMSON (50 %) et StatinWISE (deux tiers). Manquent aussi les posologies des trois alternatives
   (ézétimibe, anti-PCSK9, acide bempédoïque), laissées sans panneau posologie.
9. **`rhd-alimentation`** — l'URL publique de l'affiche Manger-Bouger (réf. DT05-177-24A) manque ; le
   champ `lien` est vide plutôt que de pointer vers un chemin mort (le schéma l'autorise explicitement).

### Choix de rédaction à confirmer

10. **Trois entrées bibliographiques ont été créées** à partir des dossiers de preuve, à contrôler page à
    page : `da-qing` (Yu et al. 2024, PMID 38168886 — bras exercice seul non significatif) et
    `cochrane-exercice-dt2` (CD002968.pub2 — HbA1c −0,6 %) sur `rhd-activite-physique` ; `has-2024-r103` et
    `sfd-2025-avis21` sur `insuline`. Pour la première : le choix de −0,6 % (Cochrane 2006) plutôt que la
    fourchette −0,5 à −0,7 % des méta-analyses ultérieures mérite confirmation.
11. **`rhd-activite-physique` — le parcours APA chiffré (2-3 séances/semaine, 45 min-1 h) n'a pas été
    écrit** dans un panneau posologie : l'afficher contredirait la règle structurelle du nœud (« aucune
    piste n'affiche de valeur à atteindre ») et sa divergence n° 1. La description d'un parcours de soins
    encadré compte-t-elle comme une cible affichée ?
12. **`rhd-alimentation` — une citation attribuée à la HAS** (« la stabilisation d'une bonne habitude est
    déjà un résultat ») n'est pas littérale : les guillemets ont été retirés et le principe reformulé,
    plutôt que d'aligner sur la citation littérale voisine, qui porte sur le *poids* et détonnerait sur une
    carte parlant d'*habitudes alimentaires*.
13. **« Ce nœud » reste employé dans les champs affichés de cinq nœuds** (48 occurrences) ; seul
    `cible-glycemique` dit désormais « cet écran ». C'est un terme interne que le praticien ne voit nulle
    part dans l'interface. Harmonisation à décider — non imposée par invariant, faute d'être tranchée.

## Vérifications passées

- `npm run typecheck` et `npm run build` : **verts**.
- Suite complète : les huit snapshots de caractérisation ont été régénérés et **relus** — le diff est
  purement textuel (reformulations d'alertes, sigles développés) ; les seules lignes de logique qui y
  bougent (levée des exclusions glucotoxicité) **préexistaient** à cette passe et appartiennent à T-148.
- **Quatre assertions de test ont été rendues insensibles à la casse ou à la forme du sigle**
  (`evaluateNode.insuline`, `evaluateNode.statine` ×2, `evaluateNode.rhd-activite-physique` ×2) : elles
  vérifiaient une typographie que cette passe avait justement pour objet de corriger. Leur garde-fou de
  fond est inchangé, et le motif est documenté à chaque endroit.
- **Deux échecs de test ne relèvent pas de cette passe** : `couverture.test.ts` sur `prescription` (angle
  mort de l'échantillonnage du banc, diagnostic déjà écrit dans `engine/banc/profils.ts`, correctif
  explicitement repoussé) et `grammaire.test.ts` (le champ `icone` ajouté par T-149 n'est pas encore classé
  dans `CHAMPS_DU_SCHEMA`).
