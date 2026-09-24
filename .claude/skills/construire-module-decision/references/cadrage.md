# Cadrage — fiche de domaine et P1

Autorité : `CONSTRUIRE-UN-MODULE.md` § P1 (A2 amendé, A3 ; fichier commun : D54). Cette page organise
le recueil, elle ne dit pas quoi y écrire. **Tout le contenu clinique vient du référent.**

## 1. Fiche de domaine (étape 0, demande de type « domaine de décision »)

Courte, remplie **avec** le référent, avant P0. Chaque rubrique vide est un manque à nommer.

| Rubrique | Ce qu'on y écrit | Qui |
| --- | --- | --- |
| Utilisateurs et situations de consultation | qui se sert de l'outil, dans quelles consultations | référent |
| Décisions à aider | dépistage, confirmation diagnostique, traitement, surveillance, déprescription… : celles du domaine, **pas** celles du DT2 recopiées | référent |
| Périmètre exclu | ce que le domaine ne traitera pas, et pourquoi | référent |
| Référent compétent | qui valide ; si le référent n'a pas la compétence de fond, le dire : c'est un blocage, pas un détail | référent |
| Sources institutionnelles pertinentes | noms seulement ; la recherche vient en P4 | référent |
| Liens avec les domaines existants | critères qui existent déjà ailleurs (âge, DFG, fragilité…), nœuds voisins | skill (relevé), référent (sens) |
| Compatibilité avec le moteur | les décisions demandées sont-elles des filtrages par règles booléennes (D3) que le moteur sait représenter ? Une démarche diagnostique ou une logique temporelle nouvelle se vérifie d'abord | skill (constat), référent (choix) |

La fiche validée se consigne dans l'état. Si elle conclut qu'une sortie sans module répond mieux, la
présenter : fiche informative, enrichissement d'un existant, périmètre plus étroit, chantier du socle.

## 2. Gabarit P1

Deux livrables écrits par le référent, trois questions tranchées par écrit, un fichier créé :

1. **Intentions du praticien** : les siennes, pour ce domaine. Elles ne se transposent pas depuis un
   autre domaine.
2. **Inventaire de l'existant** (R9, A3) : tout ce que les nœuds devront savoir de ce qui est déjà en
   place chez le patient.
3. **Trois questions de structure** : de quelle mesure parle le nœud ; la cible est déclarée, jamais
   déduite (R1) ; découpage en nœuds, module ou pas, charge de saisie (D22).
4. **Fichier commun du domaine** : `content/decision/criteres-communs/<domaine>.yaml`, même vide, avec la
   règle de cliquet écrite en tête (D54, R15). Précédent : `diabete-type-2.yaml`.

## 3. Interroger sans proposer (A2, amendé)

La skill fait émerger les intentions en posant des questions ; elle n'en propose jamais une.

Questions ouvertes admises :

- « Décrivez une consultation de ce domaine où vous hésitez. Qu'est-ce qui vous fait hésiter ? »
- « À la fin de cette consultation, quelle décision avez-vous prise, ou reportée ? »
- « Quelle situation limite vous a déjà mis en difficulté ? Qu'auriez-vous voulu savoir ? »
- « Que faut-il savoir de ce que le patient a déjà en place avant de vous proposer quoi que ce soit ? »
- « Le fait sur lequel vous décidez dépend-il de la manière dont il a été mesuré ? »

Formulations **interdites**, parce qu'elles proposent le contenu : « Voulez-vous une intention
*confirmer le diagnostic* ? », « Les intentions du DT2 conviennent-elles ? », une liste d'intentions à
cocher, une reformulation qui ajoute ce que le référent n'a pas dit.

## 4. Relire et nommer les manques

Après chaque réponse, relire et nommer ce qui manque, sans le combler :

- une intention sans situation de consultation qui l'illustre ;
- un élément de l'existant nommé dans une intention, absent de l'inventaire ;
- une des trois questions sans réponse écrite ;
- un fait qui peut contre-indiquer, retirer ou alerter, cité en passant : le signaler pour le fichier
  commun ;
- plus d'une douzaine d'items de saisie par nœud envisagé : charge de saisie à arbitrer.

La porte P1 passe quand ces manques sont levés **par le référent**, ou consignés par lui comme hors
périmètre.
