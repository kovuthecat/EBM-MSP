# 2026-07-29 — D36 · Un critère partagé se réduit, dans un nœud, à ce que ce nœud en consomme

### Décision

Quand un nœud réutilise un critère du dictionnaire de domaine mais n'en lit qu'une **partie** — une poignée
de valeurs d'une `liste`, toujours ensemble, dans une seule condition — il déclare à la place un critère
**propre, du type que la règle appelle réellement**, sous un **nom différent** disant ce qu'il signifie
ici. Il ne conserve pas la déclaration complète « par cohérence de domaine ».

Ce n'est pas une exception à I4 (« un concept, un encodage ») : c'est son application. I4 interdit qu'un
**même nom** porte deux sens ; il n'a jamais demandé qu'un nœud recueille des données qu'il n'utilise pas.
Le nom nouveau est la preuve que le concept est autre — « ce patient est-il exposé à l'hypoglycémie ? »
n'est pas « quelles classes ce patient prend-il ? ».

Garde-fou, pour que cette décision ne devienne pas un permis d'amputer : **la réduction se démontre
mécaniquement**, jamais au jugé. Elle suppose d'avoir établi, par recherche exhaustive dans le fichier, que
le critère n'est cité **nulle part ailleurs** dans le nœud, et que les valeurs retirées n'apparaissent dans
**aucune** condition, `exclusions`, `prerequis`, `visible_si` ou `derive`. Le jour où une règle du nœud a
besoin de la classe exacte, c'est la liste complète qui revient — pas un second critère à côté.

### Contexte

Premier cas : les deux nœuds du module RHD (`rhd-alimentation`, `rhd-activite-physique`). Tous deux
déclaraient `traitements_en_cours`, la `liste` à 9 classes du domaine, et tous deux ne la lisaient qu'à
**un seul endroit** — le `quand` de leur alerte d'hypoglycémie — sur **4 valeurs** (insuline basale,
insuline rapide, sulfamide, glinide) réunies dans la même disjonction. Les 5 autres cases (metformine,
iSGLT2, AR GLP-1, tirzépatide, gliptine) n'apparaissaient dans aucune condition de ces nœuds : le
praticien les cochait à chaque consultation sans qu'elles puissent jamais changer une sortie. C'est
exactement ce que R5 (`GRAMMAIRE-NOEUD.md`, « un critère qu'on demande doit agir ») proscrit, à ceci près
que R5 se lit d'ordinaire critère par critère — ici la moitié d'un critère agissait et l'autre non, ce
qu'aucun invariant ne regardait.

Remplacé, dans les deux nœuds, par le `bool` `insuline_ou_insulinosecreteur`. Le nom écarte
« hypoglycémiant », ambigu en français : metformine et gliptine sont des **anti**hyperglycémiants et
n'exposent pas à l'hypoglycémie en monothérapie ; on nomme donc les deux mécanismes réellement en cause
(insuline exogène, insulinosécréteurs). `presomption_non: true` est conservé — l'éligibilité mécanique
posée par T-018/D30 est inchangée par un renommage : le critère ne conditionne qu'une **alerte de nœud**,
canal distinct des `exclusions` et des options `role: securite` (R8).

`prescription.yaml` et `insuline.yaml` gardent, eux, la liste complète (`partage: true`) : ils prescrivent,
la classe exacte y est décisive (non-duplication, non-association gliptine + AR GLP-1, sécurité rénale).
La dette de vocabulaire connue sur ce nom (`banc/coherence-inter-noeuds.test.ts`, 8 valeurs contre 9 selon
le nœud) n'est pas résolue par ce lot, mais son périmètre passe de 4 nœuds à 2 — et à 2 nœuds qui ont
tous deux un besoin réel de la granularité, ce qui rend l'arbitrage restant plus simple, pas moins.

### Conséquence inattendue, et pourquoi elle est consignée

Une `liste` n'est **pas** énumérable par le banc synthétique (`banc/profils.ts`, `domaineEnumerable`
renvoie `null` — les listes sont traitées à part) ; un `bool` l'est, et vaut ×2 au produit cartésien.
Retirer 8 cases à cocher au praticien a donc **doublé** le produit cartésien de `rhd-activite-physique`
(55 296 → 110 592) et lui a fait franchir `PLAFOND_ENUMERATION_EXHAUSTIVE`, ce qui l'aurait fait basculer,
en silence, d'une couverture de banc **prouvée** (stratégie 1, énumération exhaustive) à une couverture
**probabiliste** (stratégie 2).

En silence : c'est précisément ce qui était arrivé à `statine` le 2026-07-27, et c'est pour cela que G3
(`banc/grammaire.test.ts`) avait été écrit. Il a fonctionné — l'échec est tombé à la première exécution du
lot, avec le chiffre et les deux issues possibles. Plafond relevé de 60 000 à 120 000, conformément à sa
propre consigne (relever tant que le produit reste de cet ordre ; ne déclarer un nœud probabiliste que
lorsque aucun plafond réaliste ne le ramène), d'autant que ce nœud porte une alerte de sécurité dont on
veut la couverture prouvée.

**La leçon générale, qui vaut au-delà de ce lot** : simplifier la saisie n'allège pas mécaniquement le
banc — le coût de vérification d'un nœud ne suit pas le nombre de questions posées, mais la forme des
types déclarés. Un `bool` en dit moins qu'une `liste` de 9 valeurs à l'écran, et davantage au banc.

### Vérification

Golden master de caractérisation (180 profils × 2 nœuds) rejoué : le diff est **entièrement** contenu dans
la ligne du critère et la présence de l'alerte d'hypoglycémie. Aucune option proposée, écartée ou en
attente ne bouge — ce qui est la démonstration exécutable que les 5 classes retirées étaient bien inertes.
