# 2026-08-06 — D54 · Les faits de sécurité d'un domaine se déclarent AU DOMAINE, pas au nœud

### Décision

Reprend le principe **P2** de la revue de conception du 2026-08-04
(`docs/decision/validation/revue-conception-fable-2026-08-04.md` §7), arbitré le 2026-08-06.

Un fait qui peut **contre-indiquer, retirer ou alerter** se déclare **une seule fois pour le domaine**,
dans `content/decision/criteres-communs/<domaine>.yaml`, et les nœuds le **référencent** par
`{ ref: <nom> }` dans leur `criteres_entree`. La déclaration de domaine porte `concerne` : la liste des
classes ou gestes qu'elle rend pertinents. **Tout nœud qui prescrit une de ces classes déclare le fait,
ou le range dans `criteres_hors_perimetre: [{ nom, motif }]` avec un motif clinique écrit.** Il n'existe
pas de troisième statut.

**Le partage porte sur la DÉFINITION, jamais sur la mise en scène.** Le fichier commun porte `type`,
`valeurs`, `min`/`max`, `paliers`, `derive`, `partage`, `aide`, `concerne` — ce qui dit *quel fait
clinique ce nom désigne*. Chaque nœud garde, à côté de son `{ ref }`, tout ce qui relève de la
présentation : `groupe`, `visible_si`, `valeurs_visible_si`, `debut_de_ligne`, `libelle_masque`,
`masque_si_indetermine`, `preremplissage`. Le schéma (`critereEntreeRef`, `additionalProperties: false`)
**refuse** une entrée qui porterait `ref` **et** un champ de définition, plutôt que de réintroduire en
silence la divergence que le mécanisme élimine.

**`presomption_non` reste LOCAL au nœud, et c'est une exception voulue, pas un oubli.** Il ressemble à un
champ de définition, mais **D30** fait dépendre son éligibilité de l'usage du critère **dans ce nœud**
(participe-t-il à un canal de sécurité ?), jamais de la nature du fait. Le rendre global le rendrait
impossible à poser : c'est l'asymétrie voulue de `traitements_en_cours` — `presomption_non: true` sur
`insuline`, absent sur `prescription`, parce que le même fait y alimente des cartes `role: securite`.
Vérifié par l'invariant T-165 (`engine/banc/invariants-contenu.test.ts`).

### Contexte — les trois cas qui l'ont motivée

| Cas | Ce qui se passait |
| --- | --- |
| **D9** — `hypo_severe_recurrente` | Déclarée dans `insuline` (deux alertes de nœud). Dans `prescription`, elle n'existait **nulle part** comme critère : le fait vivait en prose, dans l'`aide` de saisie d'un **autre** critère (« Élevé si … hypoglycémie sévère antérieure »). Or `prescription` prescrit ou poursuit **sulfamide et glinide**, les deux classes qui exposent à l'hypoglycémie sévère. L'outil demandait au praticien de faire la traduction, puis raisonnait sur sa traduction. |
| **D5** — `cetonemie` | Déclarée dans `prescription`, où elle porte **deux** cartes `role: securite`. **Absente d'`insuline`** — un patient en cétonémie confirmée, vu sur le nœud Insulinothérapie pour un ajustement de dose, n'obtenait **aucune** alerte d'urgence catabolique. |
| **N4** — `antecedent_cv` vs `ASCVD_etablie` | Deux **noms** pour un fait voisin, définis chacun dans son nœud, sans qu'aucun `derive` ni aucun commentaire n'affirme l'équivalence — et sans que rien ne dise s'ils recouvrent le même périmètre clinique. |

Ordre de grandeur du terrain : sur le premier domaine, **41 faits de sécurité, dont 36 mono-nœud**
(`docs/decision/validation/criteres-communs-2026-08-06.md`). Quatre d'entre eux étaient fautifs, et
**aucune étape du procédé n'avait été sautée**.

### Raison du choix — ce que la décision rend VÉRIFIABLE

C'est là qu'elle se justifie, et pas ailleurs. **Une divergence de définition finit par se voir : il y a
deux choses à comparer**, et un invariant peut les confronter (c'est ce que font I19, I32, puis T-162).
**Une absence, elle, ne se voit jamais** : rien ne manque nulle part, le nœud est simplement muet. Aucun
invariant ne peut réclamer un critère dont il ignore qu'il devrait exister.

`concerne` est ce qui lève l'impossibilité : il transforme une **omission** en **contradiction
mécanique**. Dès qu'un fait déclare « je concerne le sulfamide », tout nœud qui prescrit du sulfamide et
ne le voit pas devient rouge — y compris un nœud écrit **il y a trois mois**, que personne ne pensait à
rouvrir. L'invariant **I33** (P14/S16) porte les trois garde-fous : l'absence silencieuse, la
contradiction (déclaré **et** rangé hors périmètre), et la **déclaration morte** (un
`criteres_hors_perimetre` qu'aucune classe prescrite ne concerne — une dispense qui ne dispense de rien
et qui aveuglerait un ajout futur).

**Corollaire de procédé, et il est indissociable de la décision** : le vocabulaire de sécurité d'un
domaine ne peut pas être dressé exhaustivement à l'avance — on découvre des faits en écrivant les nœuds.
Ce n'est donc pas un travail préalable, **c'est un cliquet** : le fichier commun s'ouvre **avant le
premier nœud**, même quasi vide, et tout fait rencontré ensuite s'y écrit. Le domaine se ré-interroge de
lui-même à chaque ajout. Inscrit en **P1** de `CONSTRUIRE-UN-MODULE.md`, avec un quatrième point de
portée domaine à la porte de sortie **P6**.

### Ce qui reste interdit

1. **Déclarer un fait de sécurité dans un nœud seul**, quand il concerne une classe qu'un autre nœud
   prescrit. Il monte au domaine, avec son `concerne`.
2. **Laisser un fait vivre en prose** — dans une `aide`, un commentaire, un `avantages`. Une consigne
   n'est pas un lecteur : rien ne l'évalue (cf. `GRAMMAIRE-NOEUD.md` R5, corollaire de l'`aide`).
3. **Faire porter au fichier commun la mise en scène.** Le schéma le refuse ; ne pas chercher à le
   contourner par un champ neuf.
4. **Rendre `presomption_non` global.** Son éligibilité est une propriété de l'usage dans un nœud (D30),
   pas du fait.
5. **Dispenser un nœud entier** de l'invariant. Une exception se porte sur le couple exact
   (nœud, fait), avec son motif — sans quoi la dette ne protège plus un cas diagnostiqué, elle aveugle un
   fichier.

### Conséquences

- **Socle (P14/S15, T-188)** : `schema/decision/criteres-communs.schema.json`, `CritereEntreeRef` /
  `CritereCommun` / `FichierCriteresCommuns` dans `node.types.ts`, résolution des `ref` au chargement
  (`content/loadNodes.ts`) — **avant** que quoi que ce soit d'autre voie le nœud : la forme courte
  n'apparaît jamais dans un `Noeud` résolu, le moteur, le formulaire et le banc ignorent tout du
  mécanisme.
- **Invariant (P14/S16, T-189)** : I33, écrit **rouge** (`it.fails`) sur les deux défauts connus, passé
  vert le 2026-08-07 quand le second est tombé.
- **Contenu (P14/S17-S19)** : `cetonemie` déclarée dans `insuline` (T-191), `hypo_severe_recurrente`
  déclarée dans `prescription` (T-192) — et la clause d'`aide` retirée dans le **même** lot, sans quoi la
  même question serait posée deux fois.
- **Grammaire** : **R15** (« un fait de sécurité appartient au domaine, pas au nœud »), qui généralise
  R8 — R8 dit *un canal dans le nœud*, R15 dit *une déclaration dans le domaine*.
- **Le cas N4 n'est PAS clos par ce mécanisme** : deux noms pour un fait voisin demandent un arbitrage
  **clinique**, pas un fichier commun. Tranché séparément — cf. **D56**.
