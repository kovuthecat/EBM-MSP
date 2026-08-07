# 2026-08-07 — D58 · Un critère nouvellement saisissable se peuple par FORMULE sur les profils gelés, jamais par tirage indépendant

### Décision

**Décision méthodologique, pas clinique** — elle porte sur le banc, jamais sur le contenu.

Quand un nœud gagne un critère **nouvellement saisissable** dont la valeur est **logiquement dérivable de
champs DÉJÀ gelés** dans les profils figés du banc, la colonne manquante se peuple par un **script
ponctuel qui applique la même formule que le `preremplissage` réel du contenu** — jamais par le tirage
indépendant que la procédure de gel applique par défaut.

Premier cas, et précédent posé : `position_vs_cible` sur `insuline` (P14/S11), dont la valeur se dérive
de `HbA1c_actuelle` et `HbA1c_cible`, tous deux gelés de longue date.

### Contexte — le STOP qui l'a produite

`position_vs_cible` est devenue un critère saisi sur `insuline` (D50/T-180) : sa colonne n'existait pas
dans `banc/fixtures/profils.insuline.json`. La procédure documentée
(`EBM_FIGER_PROFILS=1 npx vitest run geler-profils.maintenance.test.ts`) sait **compléter** une fixture —
nouvelle colonne, colonnes existantes intactes — et elle tire la colonne neuve **indépendamment** des
colonnes déjà figées. Ce comportement est **volontaire et documenté** (`banc/profils.ts`) : il garantit
qu'ajouter un critère ne perturbe **jamais** les patients déjà figés, ce qui est exactement ce qu'on veut
d'un golden master.

Ce qui est bon pour un critère **indépendant** est destructeur pour un critère **dérivable**. Mesuré
avant tout examen du diff, sur les 179 profils :

```text
SYNTHESE COHERENCE position_vs_cible vs HbA1c (fixture insuline, complétion EBM_FIGER_PROFILS) :
  coherent   :  46  (25,7 %)
  incoherent : 133  (74,3 %)
  zone morte :   0
  total      : 179
```

**74,3 % des profils décrivaient des patients cliniquement contradictoires** — profil #0 : HbA1c 18 %,
cible 7,16 % (écart +10,8 points) étiqueté « au-dessus » au lieu de « nettement au-dessus » ; profil
#5 : HbA1c 4 %, cible 8,12 %, donc nettement **sous** l'objectif, étiqueté « au-dessus ». La session S11
a fait ce que son plan prescrivait : **fixture non régénérée**, `git checkout --` immédiat, STOP rendu.
Conséquence assumée sur le moment : trois tests rouges (`caracterisation.insuline.txt`,
`caracterisation-indetermine.insuline.txt`, `paires.insuline.txt`), **sans aucune régression du moteur**
— le contenu et les règles étaient corrects et testés par ailleurs. Seul le **document de relecture**
était bloqué.

### Raison du choix — pourquoi la formule, et pas les autres issues

Trois options étaient sur la table à la clôture de S11 ; deux ont été écartées.

| issue | pourquoi écartée / retenue |
| --- | --- |
| **Régénérer en acceptant le tirage indépendant** | Écartée. Un golden master n'a de valeur que s'il est **relisible** : un diff sur des patients contradictoires est ininterprétable, et un relecteur qui butte sur « HbA1c 4 %, au-dessus de l'objectif » cesse de faire confiance à l'ensemble du fichier. Le golden master aurait survécu comme fichier, pas comme instrument. |
| **Ajouter une `contraintes` liant `position_vs_cible` à l'écart HbA1c**, pour que `reparerFixtureProfils` écarte les incohérences | Écartée. Une `contrainte` est un **objet de contenu** — elle s'affiche au praticien et suspend le rendu (D27/D31). En introduire une pour réparer un banc reviendrait à modifier ce que voit l'utilisateur pour satisfaire un outil de test : l'inversion exacte de la relation entre les deux. |
| **Peupler par script ponctuel, avec la formule du `preremplissage`** | **Retenue.** Elle ne touche ni le contenu, ni le schéma, ni la procédure de gel — et elle produit des profils **cohérents par construction**, puisqu'ils appliquent la règle que l'application appliquerait elle-même à ces mêmes valeurs. |

**Le point de doctrine, qui vaut au-delà de ce cas.** Le tirage indépendant est le bon défaut *parce
qu'il ne présume rien* : la procédure de gel ne sait pas quelles colonnes sont liées, et deviner
introduirait une dépendance cachée entre critères. C'est donc à **l'auteur du lot** de dire « cette
colonne-ci se dérive de celles-là » — l'information existe déjà, sous forme d'un `preremplissage` écrit
dans le contenu. Réutiliser cette formule, plutôt qu'en écrire une seconde, est ce qui rend le backfill
opposable : si la règle de contenu change un jour, le décalage se voit.

### Ce qui reste interdit

1. **Tirer indépendamment une colonne dérivable** d'autres colonnes déjà gelées. Le résultat n'est pas
   « du bruit » : ce sont des patients qui n'existent pas.
2. **Écrire une seconde formule** pour le backfill. Le script applique celle du `preremplissage` réel,
   sinon le banc valide un comportement que l'application n'a pas.
3. **Ajouter un objet de contenu (contrainte, critère, alerte) pour réparer un banc.** Le contenu répond
   au praticien ; l'outillage de test s'adapte au contenu, jamais l'inverse.
4. **Régénérer une fixture figée sans mesurer la cohérence AVANT de lire le diff.** C'est la mesure — pas
   la lecture du diff — qui dit si le diff est interprétable. Elle a été faite dans cet ordre en S11, et
   c'est ce qui a produit le STOP au bon moment.
5. **Étendre la doctrine à un changement de TYPE.** Une colonne dont le type a changé ne se complète ni ne
   se dérive : elle se **retire à la main**, puis la procédure la recrée à neuf comme une colonne
   manquante (`CONSTRUIRE-UN-MODULE.md` §4 bis, « Changer le TYPE d'un critère n'est pas ajouter un
   critère »).

### Conséquences

- **Banc** : `banc/fixtures/profils.insuline.json` gagne la colonne `position_vs_cible`, peuplée par la
  formule du `preremplissage` de `insuline.yaml` (les bandes de D50 : écart < −0,5 ⇒ `sous_objectif` ·
  [−0,5 ; +0,3] ⇒ `a_l_objectif` · ]+0,3 ; +0,5[ ⇒ aucune suggestion · [+0,5 ; +1,5] ⇒ `au_dessus` ·
  > +1,5 ⇒ `nettement_au_dessus`). Les trois tests rouges du STOP T-180 repassent au vert.
- **Vérification, refaite indépendamment le 2026-08-07** avant de consigner cette décision : les
  **179 profils sur 179** de la fixture sont cohérents avec les bandes ci-dessus (0 incohérent, 0 profil
  tombé en zone morte), contre 25,7 % avant. Le contrôle est reproductible en quelques lignes depuis le
  JSON — c'est le test à refaire avant tout futur backfill du même genre.
- **Précédent** : ce cas fait doctrine pour tout critère dérivable ajouté à un nœud déjà figé, quel que
  soit le domaine.

### Signalement — cette décision n'a PAS de bilan de session écrit

`plans/P14/S11.md` documente le **STOP** en détail (§ « STOP rencontré », § « Blocages / STOP —
récapitulatif pour clôture ») et se termine dessus : *« décision explicite du référent requise avant de
régénérer quoi que ce soit sur cette fixture »*, avec les trois options ci-dessus listées et **aucune
choisie**. La **résolution** a été appliquée ensuite par l'orchestrateur, hors session, et n'a laissé
aucune trace écrite — ni section ajoutée à `S11.md`, ni fichier de bilan dédié, ni commentaire dans
`banc/profils.ts` / `fixtureProfils.ts` / `geler-profils.maintenance.test.ts` (recherche exhaustive
faite). Le présent document est donc, à ce jour, **la seule trace écrite** de la méthode employée ; la
seule preuve matérielle est la fixture elle-même, dont la cohérence a été remesurée ci-dessus. Si le
détail de l'exécution (script exact, ordre des opérations) doit être conservé, il reste à consigner.
