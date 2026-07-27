# Prompt — recette visuelle du lot 1 (Claude Code Desktop, navigateur intégré)

> À copier tel quel dans Claude Code Desktop, ouvert sur le dépôt `ebm-msp`.
> Rédigé le 2026-07-27 pour le commit `7a14689`.

---

Tu fais la **recette visuelle** d'un outil d'aide à la décision clinique destiné à des médecins
généralistes, sur le nœud « diabète de type 2 ». Utilise ton navigateur intégré.

## Pourquoi c'est sérieux

Cet outil affiche des conduites thérapeutiques à un praticien en consultation. Un écran qui affirme une
chose que le moteur n'a pas conclue, ou qui cache une carte de sécurité, produit une prescription
erronée. Aujourd'hui même, deux défauts de cette famille ont été trouvés :

- un repli d'affichage **cachait la carte de sécurité** d'un patient en état catabolique ;
- le nœud `statine` ne renvoyait **rien du tout** pour un patient de prévention secondaire — le cas le
  plus banal du nœud — parce qu'il attendait une valeur dans un champ qu'il n'affiche jamais.

Les deux étaient en production. Aucun des cinq rapports d'audit du jour ne les avait vus. Ta passe est
la première à regarder l'écran réel.

**Le piège dans lequel je suis tombé ce matin, et que tu dois éviter** : la recette précédente posait la
bonne question — « aucune carte de sécurité n'est-elle repliée ? » — et j'y ai répondu par une
supposition au lieu d'aller voir. Le contre-exemple a coûté deux minutes à produire. **Ne coche jamais
un point sans l'avoir reproduit à l'écran.** Si tu ne parviens pas à monter un cas, écris « non
reproduit » — c'est un résultat utile ; un faux « OK » ne l'est pas.

## Mise en route

```bash
git -C <chemin>/ebm-msp log --oneline -1     # doit afficher 7a14689
npm run dev                                   # Vite, http://localhost:5173
```

Travaille sur le **serveur local**, pas sur `ebm-msp.vercel.app` : le déploiement peut être en retard
d'un commit, et tu dois recetter exactement `7a14689`.

## Trois contraintes de navigation, à connaître avant de commencer

1. **Il n'y a pas de routeur ni d'URL.** La navigation vit dans l'état React (décision D9). Aucun lien
   profond n'existe : tu dois cliquer *Accueil → Décision → (module) → nœud*. N'essaie pas de deviner
   une URL, tu perdras du temps.
2. **Recharger la page renvoie à l'accueil** et efface toute la saisie.
3. **Ressortir d'un nœud et y revenir REMET LE FORMULAIRE À ZÉRO** (le composant est remonté). C'est ta
   façon d'obtenir un formulaire vierge propre entre deux scénarios — utilise-la systématiquement.

Les six nœuds : `Fixer la cible d'HbA1c`, `Traiter : initier, optimiser, intensifier` (= `prescription`),
`Insulinothérapie du DT2` (= `insuline`), `Prescrire une statine dans le DT2` (= `statine`), et deux
nœuds RHD regroupés dans un module (`Alimentation`, `Activité physique`).

## Ce que tu ne dois pas faire

- **Ne modifie aucun fichier** du dépôt : ni code, ni contenu YAML, ni test. Tu observes et tu rapportes.
- **Ne « corrige » rien** que tu trouverais bizarre. Si un libellé te semble faux cliniquement, tu le
  signales — tu ne le réécris pas. Le contenu clinique est validé par un médecin référent, et lui seul.
- **N'invente aucune interprétation médicale.** Si tu ne sais pas si un affichage est cliniquement juste,
  écris-le. Signaler un doute vaut mieux qu'une affirmation.
- **Ne tire aucune conclusion d'un test unitaire** : ils sont tous verts, c'est justement pourquoi cette
  passe existe.

---

# Les scénarios

Ordre de priorité décroissante. Pour chacun : **ce que tu fais**, **ce que tu dois voir**, et
**pourquoi ça compte**.

## 1. Le défaut de production (le plus important)

**Nœud `Prescrire une statine dans le DT2`.** Renseigne un patient de prévention secondaire sans
intolérance : âge ~62, **maladie cardiovasculaire établie = oui**, statine déjà en place = non,
intolérance aux statines = **non**, dialyse = non, diabète compliqué = non, ancienneté ~8 ans,
autres facteurs de risque ~2.

- **Attendu** : la carte **« Statine de haute intensité — prévention secondaire »** s'affiche.
- **Avant ce lot, l'écran ne proposait RIEN** — panneau de résultats vide, le nœud bloqué en attente
  d'une valeur de CK dans un champ qui n'est même pas affiché pour ce patient.
- **Vérifie aussi** qu'aucun champ « CK » n'apparaît tant que l'intolérance est à « non ».
- Puis bascule l'intolérance sur « rapportée » : le champ CK doit **apparaître**. Remets à « non » : il
  doit **disparaître**, et la recommandation doit rester cohérente.

## 2. Défaut A — le primer s'affichait « répondu » sans l'être

**Sur un formulaire vierge, n'importe quel nœud.**

- **Attendu** : **aucun bouton segmenté n'est allumé**, et les listes déroulantes affichent « — ».
- Avant, la première valeur apparaissait sélectionnée sans qu'on ait cliqué, pendant que le moteur, lui,
  tenait le champ pour non répondu. **L'écran affirmait une chose, le moteur en croyait une autre.**
- **À juger** : est-ce que « — » se lit bien comme « pas encore répondu » ? Est-ce que le formulaire
  vierge donne envie de commencer, ou paraît cassé ?

### 2b — la cascade que ça débloquait

- **`Insulinothérapie du DT2`, formulaire vierge, puis clic sur « Naïf d'insuline »** : le bloc MCG
  (glycémie à jeun, TBR, temps en cible, doses en cours) doit être **masqué dans les deux cas**.
- **`Traiter…`, intention « Initier »** : le champ « Traitements en cours » doit **disparaître**.
- **À juger** : quand ces champs disparaissent, la mise en page tient-elle, ou l'écran sautille-t-il ?

### 2c — le marqueur « à confirmer »

Les champs à choix (`enum`) décisifs et non répondus portent maintenant une mention ambre
« · à confirmer ».

- **À juger, et c'est une vraie question** : sur un formulaire vierge, combien de champs le portent ?
  Si c'est la moitié de l'écran, le signal se dévalue. Compte-les et dis-le.

## 3. Défaut B — l'écran concluait pendant que le moteur suspendait son jugement

**`Insulinothérapie du DT2`, formulaire entièrement vierge.**

- **Attendu** : la carte **« Poursuivre le schéma d'insuline en cours et réévaluer »**, qui portait le
  badge « Recommandée », **ne doit plus apparaître du tout**. Seul le bloc « en attente » s'affiche,
  listant les champs à renseigner.
- Avant, elle s'affichait — y compris pour un patient **naïf d'insuline**, à qui elle proposait de
  poursuivre une insuline qu'il ne prend pas.
- **Même vérification sur `Traiter…`** avec « Poursuivre le traitement en cours et réévaluer ».
- **À juger, question ouverte au référent** : un écran qui ne montre que « en attente » est-il
  acceptable en consultation, ou faut-il une phrase d'accueil qui explique pourquoi rien n'est encore
  proposé ? Décris ce que tu vois exactement, capture comprise.

## 4. Défaut J — une dose non calculable disparaissait en silence

**`Insulinothérapie du DT2`** : monte un patient qui rend applicable la carte **« Initier une insuline
basale »** (situation « naïf d'insuline », HbA1c au-dessus de la cible), **sans renseigner le poids**.

- **Attendu** : la carte affiche une ligne **« Doses non calculées : Dose initiale (0,1 U/kg) — à
  renseigner : Poids »** (et une seconde ligne pour 0,2 U/kg).
- Avant, la carte s'affichait **sans aucune dose et sans rien dire** — rien n'indiquait qu'un poids les
  ferait apparaître.
- Renseigne le poids : les deux doses chiffrées doivent apparaître et la mention disparaître.
- **À juger** : la couleur ambre est la même que « à confirmer ». Est-ce lisible, ou faudrait-il un lien
  cliquable vers le champ ?

## 5. Défaut G — « en attente » sur un champ que l'écran n'affiche pas

**`Traiter…`, aucune intolérance déclarée** (le champ « Intolérance à un traitement » sur « non »).

- **Attendu** : **aucune option ne réclame « Nature de l'intolérance »**. Regarde en particulier
  « Réduire la posologie de la metformine ».
- Avant, l'écran demandait de renseigner un champ qu'il ne montrait nulle part — sans issue.

## 6. Non-régression — rien n'est caché

Le repli d'affichage (« Autres pistes possibles (N) ») a été **neutralisé** ce matin après qu'il a caché
une carte de sécurité.

- **Attendu** : sur tous les nœuds, **toutes les cartes applicables sont visibles**, aucun bouton
  « Autres pistes possibles ».
- Cas de contrôle, `Traiter…` : patient ~58 ans, sous metformine + sulfamide, **cétonémie = oui**,
  maladie cardiovasculaire établie, insuffisance cardiaque, HbA1c 9. La carte d'insuline d'initiation
  (état catabolique) doit être **visible sans avoir à déplier quoi que ce soit**.

## 7. Effet de bord à juger

Sur `statine`, le « pourquoi » de certaines cartes s'est allongé d'un terme
(« une intolérance est rapportée ET les CK dépassent… »). C'est un garde de portée, maintenant visible
dans la justification.

- **À juger** : information utile au praticien, ou bruit à masquer ?

---

# Ce que tu rends

Écris ton rapport dans un fichier **neuf** :
`docs/decision/validation/chantier-2026-07-27/recette-visuelle-lot1.md`

Structure attendue :

1. **En-tête** : commit recetté, date, navigateur, ce que tu as pu et n'as pas pu faire.
2. **Un tableau de synthèse** : un point par scénario, verdict `conforme` / `écart` / `non reproduit`.
3. **Pour chaque écart** : ce que tu as saisi (la liste exacte des champs et valeurs), ce que tu
   attendais, ce que tu as vu, et une capture. **Un écart sans profil reproductible n'est pas
   exploitable** — c'est le premier soin à prendre.
4. **Les questions ouvertes** (points « à juger ») : ton observation factuelle, sans trancher. Ces
   points reviennent au référent médical.
5. **Ce que tu as remarqué hors périmètre** : tout ce qui t'a paru douteux et qui n'est dans aucun
   scénario. C'est souvent là que se trouve le prochain défaut.

Ne modifie aucun autre fichier. Ne commite pas — le référent relit d'abord.
