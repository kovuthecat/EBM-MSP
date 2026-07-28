# Prompt — recette navigateur

> **Conçu pour être REJOUÉ**, pas pour un lot. À copier tel quel dans une session Claude disposant
> d'un navigateur intégré (Claude Desktop, Claude Code + navigateur in-app, sous-agent).
> Rédigé le 2026-07-28, complété le 2026-07-28 (§0, §4bis, §6 P0, §7 axes A/B/C).
> Mettre à jour §2 (sonde de version), §6 P0 (non-régressions du dernier lot) et §6 (profils) après
> chaque gros lot.
>
> Pourquoi ce fichier existe : sur ce projet, **la recette navigateur trouve ce que cinq rapports
> d'audit et 769 tests unitaires ne trouvent pas**. Le 2026-07-27, elle a trouvé deux défauts en
> production qu'aucun audit n'avait vus.

---

Tu fais la **recette navigateur** d'un outil d'aide à la décision clinique destiné à des médecins
généralistes (diabète de type 2), sur `https://ebm-msp.vercel.app`. Utilise ton navigateur intégré.

## 0. Tes trois missions, dans cet ordre

Cette passe a **trois objets distincts**. Ne fonds pas l'un dans l'autre : chacun a sa section de
rapport (§9).

1. **Trouver des défauts** — dont, explicitement, des défauts *pas encore vus* et des **familles de
   défaut qui ne sont pas dans la liste du §4** (méthode : §4bis). Les huit familles connues sont un
   point de départ, pas un plafond.
2. **Valider à l'écran ce que le dernier lot a livré** — six mécanismes livrés les 2026-07-27/28 que
   **personne n'a jamais regardés dans un navigateur** (§6, P0 à P3, P6).
3. **Juger l'outil en situation de consultation** — trois axes transverses, chacun mesuré et non
   commenté à vue : **ergonomie de saisie** (A), **lisibilité et compréhension de la réponse** (B),
   **fidélité au raisonnement de consultation** (C). Voir §7. Ces trois axes ne cherchent pas des
   bugs : ils cherchent ce qui fera que le praticien **n'ouvrira pas l'outil** ou **le fermera avant
   la réponse** — un risque au moins aussi coûteux qu'une régression.

**Répartis ton temps** : environ la moitié sur 1+2 (profils P0→P6, factuels et rapides), l'autre
moitié sur 3 (les axes, qui demandent de jouer des consultations entières et de compter).

### Outils : ce qui marche le mieux ici

- **`read_page` / `get_page_text` d'abord**, pour tout ce qui est verbatim, comptage, présence ou
  absence d'un champ. Un rapport qui recopie l'écran vaut dix qui le résument.
- **`javascript_tool` pour mesurer, jamais pour agir** : compter des éléments, lire un
  `getBoundingClientRect()`, relire l'état d'un champ. **Ne monte pas un scénario par script** :
  React groupe les mises à jour et tu obtiens un état de formulaire différent de celui que tu crois
  (piège tombé lors d'une passe précédente, qui a produit un faux verdict). **Clique et tape comme un
  humain**, puis relis l'état avant de conclure.
- **`computer{action:"screenshot"}` pour la hiérarchie visuelle** : saillance, couleur, ce que l'œil
  attrape en premier. C'est le seul outil qui répond aux questions de l'axe B.
- **`resize_window`** : fais l'axe A et l'axe B **aux deux largeurs**, `desktop` (1280×800) et
  `mobile` (375×812). Un médecin en visite lit sur un téléphone.
- **`read_console_messages`** en fin de passe : signale toute erreur JS.

## 1. Pourquoi c'est sérieux

Cet outil affiche des conduites thérapeutiques à un praticien **en consultation**. Un écran qui affirme
une chose que le moteur n'a pas conclue, ou qui cache une carte de sécurité, produit une prescription
erronée. Ce sont des défauts déjà survenus ici, en production, plusieurs fois.

**Ta passe est la seule qui regarde l'écran réel.** Les tests unitaires sont tous verts — c'est
précisément pourquoi cette recette existe. N'en tire aucune conclusion rassurante.

**La règle qui prime, apprise à la dure** : *ne valide jamais un point sans l'avoir reproduit à
l'écran.* Lors de la passe précédente, un point a été « vérifié » par supposition et s'est révélé faux.
Si tu ne parviens pas à monter un cas, écris **« non reproduit »** — c'est un résultat utile. Un faux
« OK » ne l'est pas, il coûte une régression.

## 2. Sonde de version — à faire EN PREMIER

Le déploiement peut être en retard sur le dépôt. Va dans **Aide à la décision → Diabète de type 2 →
Règles hygiéno-diététiques → Alimentation** et regarde les intitulés des champs.

- Tu lis **« Boissons sucrées », « Fréquence des repas », « Signes d'appel… »** (accentués, en français
  lisible) → **build à jour**, continue.
- Tu lis **« Frequence boissons sucrees », « Retinopathie non stabilisee ou proliferante »** (sans
  accents, noms de variables) → **le déploiement est ANTÉRIEUR au 2026-07-28.** Arrête-toi et signale-le :
  tout le reste de la passe porterait sur une version périmée.

**Seconde sonde, à faire dans la foulée** (elle date le lot le plus récent, celui que tu dois valider) :
va dans **Traiter : initier, optimiser, intensifier**, saisis HbA1c actuelle **9** et HbA1c cible **7**.

- Le champ « Par rapport à l'objectif fixé pour ce patient » se remplit tout seul sur « Nettement
  au-dessus de l'objectif » avec la mention **« · calculé, à vérifier »** → **le lot du 2026-07-28 est
  bien déployé**, la passe est valide de bout en bout.
- Rien ne se remplit → **le pré-remplissage (K6/D28) n'est pas en ligne**. Signale-le, puis **continue
  quand même** : tout le reste de la passe (§4, §7 axes A/B/C) reste valide et utile. Marque seulement
  P1 et P2 en **NON REPRODUIT — build antérieur**.

**Troisième sonde, spécifique au lot P4 (2026-07-28, commit `036f4aa`)** : va dans **Règles
hygiéno-diététiques → Activité physique**, **ne saisis rien**.

- **Zéro carte affichée**, uniquement un bloc « en attente » → **le lot P4 (D30) est bien déployé**,
  continue.
- **Une ou plusieurs cartes « Recommandée » s'affichent** sur ce formulaire vierge → le déploiement est
  **ANTÉRIEUR à P4** (le correctif D30 n'est pas en ligne). Arrête-toi et signale-le : tout le reste de
  la passe porterait sur une version périmée, c'est le même cas d'arrêt que la première sonde.

Note dans ton rapport, en en-tête, **ce que les trois sondes ont montré** et l'heure de la passe.

## 3. Contraintes de navigation (à connaître avant de commencer)

1. **Il n'y a ni routeur ni URL profonde** (décision D9). Tu dois cliquer : *Accueil → Aide à la décision
   → Diabète de type 2 → (module) → nœud*. Ne cherche pas à deviner une URL.
2. **Recharger la page revient à l'accueil et efface toute la saisie** — y compris la mémoire de session
   (§6, profil P1). C'est voulu.
3. **Sortir d'un nœud et y revenir remet le formulaire à zéro.** C'est ta façon d'obtenir un formulaire
   vierge propre entre deux scénarios — utilise-la systématiquement. ⚠ Sauf pour les deux critères
   partagés, cf. P1.

Les six nœuds : **Fixer la cible d'HbA1c** · **Traiter : initier, optimiser, intensifier** ·
**Insulinothérapie du DT2** · **Prescrire une statine dans le DT2** · et deux nœuds groupés sous le
module **Règles hygiéno-diététiques** (*Alimentation*, *Activité physique*).

## 4. Les huit familles de défaut à CHASSER

**C'est le cœur de ta mission.** Ne te contente pas de vérifier les profils du §6 : ce sont des points
d'entrée. Une fois dedans, **cherche activement** ces huit familles — ce sont celles qui reviennent sur
ce projet, lot après lot, malgré les correctifs.

1. **L'écran affirme ce que le moteur n'a pas conclu.** Une carte, un badge ou une phrase qui dit plus
   que ce que la saisie permet. Quatre régressions successives ont eu cette seule cause.
2. **Le vide lu comme une réponse** — dans les DEUX sens. Un champ non renseigné qui produit un
   affichage rassurant (« objectif atteint ») ou alarmant (« insuffisance rénale »). Cherche les deux ;
   l'asymétrie était le cœur du défaut d'origine.
3. **Un fait de sécurité sans pouvoir de retrait.** Une alerte qui *interdit* un geste affiché juste
   au-dessus par une carte. Exemple réel : « ne pas initier de statine » au-dessus de « Statine de haute
   intensité ». Si tu vois une alerte et une carte se contredire à l'écran, c'est un défaut grave.
4. **Un mécanisme d'affichage qui cache de la sécurité.** Le repli « Autres pistes possibles (N) », le
   dépli de carte, le masquage de champ. Vérifie systématiquement qu'aucune carte de sécurité, aucune
   contre-indication, aucune option écartée ne se retrouve derrière un pli.
5. **Un champ réclamé mais invisible ou impossible à fournir.** L'écran attend une valeur qu'il
   n'affiche pas, ou qu'un praticien français ordinaire ne peut pas obtenir (mesure de capteur continu
   chez un patient non équipé).
6. **Charge de saisie.** C'est le risque n°1 déclaré du projet. `Insulinothérapie` déclare une trentaine
   de champs. Compte les champs visibles à l'ouverture, dis combien d'écrans il faut faire défiler, et
   dis si tu abandonnerais en consultation.
7. **Sortie muette.** Un écran qui ne propose RIEN. Essaie activement d'en produire un : c'est le défaut
   le plus grave et le plus discret. Note le profil exact si tu y arrives.
8. **Du langage machine à l'écran.** Un nom de variable (`traitements_en_cours`), un opérateur
   (`ne_contient_pas`), un mot sans accent, une expression logique brute — partout, y compris dans
   « Proposé parce que », les alertes, les options écartées.

Trois familles ajoutées le 2026-07-28, jamais chassées jusqu'ici :

9. **Une réponse qu'on ne peut pas défaire.** Un bouton segmenté cliqué par erreur qu'on ne peut plus
   dé-sélectionner, une case « Rien à signaler » qui répond pour huit champs d'un coup sans dire
   lesquels ni comment revenir en arrière, un champ chiffré qu'on ne peut pas re-vider. En
   consultation, on se trompe de clic ; si l'écran ne pardonne pas, le praticien repart d'un formulaire
   neuf — et perd tout le reste de sa saisie.
10. **L'écran change sous les doigts.** Une saisie qui fait disparaître ou apparaître des champs
    au-dessus du point où on lit, une page qui raccourcit et déplace ce qu'on était en train de
    remplir, une carte qui se substitue à une autre sans que rien ne signale le changement. Le risque
    n'est pas esthétique : le praticien croit avoir lu une carte qui n'est plus là.
11. **La réponse arrive trop tard ou pas au bon endroit.** Le geste à faire est en bas de deux écrans
    de justification ; la contre-indication qui l'interdit est encore plus bas ; le champ manquant est
    nommé à un endroit et se remplit deux écrans plus haut, sans lien cliquable. Une information juste,
    placée hors de portée du regard, est une information perdue.

## 4bis. Trouver une famille QUI N'EST PAS DANS CETTE LISTE

C'est le point où cette passe se distingue d'une simple vérification. Méthode :

1. **Tiens un journal de surprises** pendant toute la passe : chaque fois que l'écran fait autre chose
   que ce que tu attendais — même une seconde, même sans gravité — note-le en une ligne, sans juger.
2. **À la fin, relis ton journal et regroupe.** Deux surprises différentes qui ont la même cause
   mécanique = une famille candidate.
3. Une famille candidate ne se rapporte que si tu peux donner **au moins deux occurrences observées sur
   des nœuds ou des profils différents**, plus une phrase disant *quelle propriété de l'outil* les
   produit toutes les deux. En dessous, ce n'est pas une famille : rapporte les occurrences comme
   défauts isolés, c'est très bien aussi.
4. **Ce que tu ne dois pas faire** : inventer une famille par symétrie (« il y a bien un cas où… »).
   Une famille non observée vaut moins que zéro — elle occupe la place d'un vrai défaut dans la
   lecture du référent.

## 5. Ce qui N'EST PAS un défaut (ne le rapporte pas)

Ces comportements sont **délibérés et tranchés**. Les signaler ferait du bruit et masquerait le reste.

- **Un formulaire vierge n'affiche aucune recommandation**, seulement un bloc « en attente » listant les
  champs à renseigner. C'est le correctif majeur du projet : l'outil ne se prononce pas sur ce qu'il
  ignore.
- **Un champ dont la condition d'affichage est indéterminée reste VISIBLE.** ⚠ Ce point exact a produit
  un faux défaut à la passe précédente. Un champ n'est masqué que si sa condition est *fausse*, jamais
  si elle est *inconnue*. Exemple : sur `Insulinothérapie` vierge, le bloc de mesures continues
  s'affiche — c'est correct, la situation n'est pas encore déclarée.
- **L'ordre des sections de résultats varie selon le patient.** Connu, arbitrage en attente.
- **Le bloc gris en tête de nœud** (« cadrage ») n'est pas une alerte : il est volontairement neutre,
  sans couleur ni bordure de vigilance. S'il ressemble à une alerte, ÇA c'est un défaut — l'inverse non.
- **Aucune persistance entre deux rechargements de page.** Voulu (zéro donnée patient).
- **Les nœuds en `brouillon`** : cinq des six le sont, la validation clinique est en cours. Ne le
  signale pas.

## 6. Les profils à jouer

Ordre de priorité **décroissante**. P0 à P3 portent des mécanismes livrés il y a un à deux jours que
**personne n'a jamais regardés à l'écran**.

### P0 — Les six non-régressions du dernier lot (rapide, à faire en premier)

Six mécanismes ont été livrés le 2026-07-28 (plan P4, commit `036f4aa`) — mise à jour du 2026-07-28
après contrôle (session P4/S8/T-030). Deux d'entre eux corrigent des **défauts constatés à l'écran lors
de la passe précédente** (D32 = sortie muette ; T-025 = contre-indications jamais retenues) : ce sont
les plus importants, parce qu'un correctif non vérifié vaut un correctif absent. Rapporte chacun avec
son verdict, même quand c'est `CONFORME` — la liste sert de preuve de non-régression pour les passes
suivantes.

| # | Ce qui a été livré | Ce que tu dois voir à l'écran |
|---|---|---|
| **P0-a (D30)** | *Un drapeau non répondu ne vaut plus « non »* — formulaires vierges de `rhd-activite-physique` et `cible-glycemique` ne doivent proposer aucune carte. | Ouvre les deux nœuds **vierges**, ne saisis rien. **Attendu** : zéro carte « Recommandée », seulement un bloc « en attente ». Vérifie aussi que le compteur du bandeau (« N critères décisifs non confirmés ») correspond aux champs effectivement marqués « à confirmer » dans le formulaire — pas de divergence entre les deux couches. |
| **P0-b (D32)** | *Halte ordered-first-match ne bloque plus la sécurité* — le défaut le plus grave de la passe du 2026-07-28 (sortie muette sur un patient réel). | Sur **`statine`** : maladie CV établie **oui**, intolérance aux statines **avérée**, statine déjà en place **non**, en laissant **ancienneté du diabète** et **autres facteurs de risque CV** VIDES. **Attendu** : la carte « Statine indisponible — alternatives hypolipémiantes » doit s'afficher (ézétimibe, acide bempédoïque, anti-PCSK9). Si l'écran reste muet, c'est une régression grave. |
| **P0-c (D31)** | *Contrainte violée suspend les résultats* — une combinaison de réponses impossible doit se voir ET bloquer toute carte. | Sur **`insuline`** (Insulinothérapie), situation **autre que « naïf »**, **TBR = 1** et **TBR sévère = 95**. **Attendu** : un message de contradiction s'affiche ET **aucune carte** n'apparaît nulle part sur la page (ni applicable, ni écartée, ni en attente). |
| **P0-d (D-06)** | *Le pré-remplissage calculé applique ce qu'il annonce* — livré-testé-déclaré fait une première fois sans jamais fonctionner à l'écran. | Sur **`Traiter`** : HbA1c actuelle **9** / cible **7** → le champ « Par rapport à l'objectif » doit avoir un segment RÉELLEMENT sélectionné (vérifie `aria-pressed="true"` par `javascript_tool`, pas seulement le texte) + la mention « · calculé, à vérifier ». Puis HbA1c actuelle **6,5** / cible **8,5** (sous l'objectif) → RIEN ne doit être pré-rempli. Vérifie aussi qu'un choix manuel n'est **jamais** écrasé par un recalcul ultérieur (change l'HbA1c après avoir choisi toi-même un segment). |
| **P0-e (D33)** | *« Nouveau patient » vide la mémoire de session* — geste destructif, doit demander confirmation. | Ouvre `Traiter`, saisis HbA1c actuelle **8,4** / cible **7**, clique **« Nouveau patient »** (barre du haut). **Attendu** : une confirmation est demandée (texte explicite sur la perte des valeurs) avant toute purge. ⚠ Le navigateur de test peut supprimer automatiquement les dialogues natifs `confirm()` — vérifie via `read_console_messages` que le dialogue a bien été déclenché avec le bon texte ; si tu dois observer la suite du clic, une surcharge `window.confirm = () => true` par script est acceptable ici (ce n'est pas monter un scénario, c'est contourner une limite de l'outil de test), à condition que le clic sur le bouton reste un vrai clic. Après confirmation : ouvre `Insulinothérapie`, les champs HbA1c ne doivent porter aucune valeur ni mention « · repris de votre saisie ». |
| **P0-f (T-025)** | *Contre-indications remontées et mises en registre de sécurité* — vérifie que la remontée sert à quelque chose. | Refais le **test des 20 secondes** sur une carte avec contre-indication (ex. `statine`, prévention secondaire, profil P0-b ci-dessus). Regarde l'écran 20 secondes, détourne-toi, écris ce que tu prescris/surveilles/ne dois pas faire, puis compare. **Attendu** : « ce que je ne dois surtout pas faire » est retenu. Vérifie aussi que le bloc de contre-indications est bien juste après le titre/badges, avant l'effet attendu. |

**Anciens P0-a/b/c/d/e/f (labels D29, Nature de l'intolérance, Dose metformine liée D26, contraintes
D27, plafond 5 pistes D25, `aria-pressed` A9)** : vérifiés CONFORMES lors du contrôle P4 (session
2026-07-28, rapport `recette-navigateur-2026-07-28-controle-P4.md`) — dégradés en non-régressions
ordinaires, à revérifier dans la chasse libre (P7) plutôt qu'en tête de liste, sauf régression suspectée.

### P1 — La mémoire de session (jamais vue par un humain)

Deux critères, et deux seulement, circulent d'un nœud à l'autre : **HbA1c actuelle** et **HbA1c cible**.
Uniquement entre **Traiter** et **Insulinothérapie**.

1. Ouvre **Traiter**, saisis HbA1c actuelle **9,0** et HbA1c cible **7,0**, plus de quoi obtenir des
   cartes (intention *Initier*, DFG 80, IMC 32).
2. Reviens à la liste, ouvre **Insulinothérapie**.
3. **Attendu** : les deux champs HbA1c sont **déjà remplis** (9,0 et 7,0) et portent la mention
   **« · repris de votre saisie »**.
4. Modifie-en un à la main → la mention doit disparaître, ta valeur doit gagner.
5. **Recharge la page** (F5) → tout doit être vide, sur les deux nœuds.
6. **À chasser** : un champ repris qui serait *impossible à modifier* ; une valeur reprise qui ne
   correspond pas à ce que tu avais saisi ; une reprise sur un autre champ que ces deux-là ; une reprise
   qui survit au rechargement.

### P2 — Le pré-remplissage calculé (jamais vu par un humain)

Sur **Traiter**, le champ « Par rapport à l'objectif fixé pour ce patient » se déduit de l'écart HbA1c.

1. HbA1c actuelle **9,0**, cible **7,0** → le champ doit se pré-remplir sur **« Nettement au-dessus de
   l'objectif »**, avec la mention **« · calculé, à vérifier »**.
2. Passe la cible à **8,5** (écart 0,5) → il doit basculer sur **« Au-dessus de l'objectif »**.
3. Choisis toi-même une valeur → la mention disparaît, et **plus rien ne doit écraser ton choix**, même
   si tu changes ensuite l'HbA1c. C'est le point critique : une saisie du praticien ne doit jamais être
   remplacée par un calcul.
4. **Attendu explicitement** : quand l'HbA1c est *sous* la cible, **rien n'est pré-rempli** (le seuil de
   déprescription n'a pas été tranché par le référent). Un pré-remplissage « à l'objectif » ou « en
   dessous » serait un défaut.

### P3 — Le repli, et la sécurité qu'il ne doit pas cacher

Sur **Alimentation** (module Règles hygiéno-diététiques), construis un patient qui déclenche beaucoup de
pistes : boissons sucrées *quotidien*, ultra-transformés *quotidien*, restauration rapide *fréquent*,
matière grasse *beurre*, repas *irréguliers*, grignotage *quotidien*, fruits à coque *jamais*,
légumineuses *jamais*, poisson *jamais*.

- Au-delà de **5 pistes**, un bouton **« Autres pistes possibles (N) »** doit apparaître.
- **Le point qui coûte le plus cher** : coche ensuite **Fragilité** puis, séparément, **Signes d'appel
  d'un trouble du comportement alimentaire**. Les cartes d'**orientation** (diététicien, avis spécialisé)
  et les options **écartées** doivent rester **visibles, jamais repliées**.
- Vérifie aussi qu'avec peu de pistes, **aucun bouton « Autres pistes possibles (1) »** ne s'affiche.

### P4 — Statine, les bandes de CK

- Prévention secondaire simple : âge 62, **maladie CV établie = oui**, statine en place = non,
  intolérance = **non** → la carte « Statine de haute intensité » doit s'afficher, et **aucun champ CK ne
  doit apparaître**.
- Passe l'intolérance sur **« rapportée »** → le champ CK apparaît. Saisis **4,5** → « Débuter la statine
  à dose plus faible ». Saisis **6** → « Interrompre… ». Saisis **20** → alerte fonction rénale. Saisis
  **60** → l'alerte doit basculer sur rhabdomyolyse/avis urgent, **et l'alerte rénale doit disparaître**
  (les deux ensemble seraient graves).
- Intolérance **« avérée »** + CK 6 → « Interrompre — la classe reste indisponible ».

### P5 — Insulinothérapie : la charge de saisie

Ouvre le nœud vierge. **Compte les champs**, dis combien d'écrans, et dis si le repère bleu
« · détermine la suite » sur *Situation d'insulinothérapie* suffit à savoir par où commencer. Clique
« Naïf d'insuline » et regarde ce qui se masque. **Juge en praticien pressé** : est-ce utilisable entre
deux patients ?

### P6 — « Pourquoi pas d'autres options »

Sur **Traiter**, déplie la liste des options non retenues. Chaque ligne doit donner un motif qui parle
du **patient** (« le DFG est inférieur à 30 »), jamais réciter une règle générale ni un fragment de
code. C'est le défaut corrigé en dernier, et jamais vu à l'écran.

### P7 — Chasse libre (garde du temps pour ça)

Parcours les six nœuds avec des profils de ton choix, en cherchant les huit familles du §4. **C'est
souvent ici que sortent les vrais défauts** — les profils ci-dessus ne trouvent que ce qu'on soupçonnait
déjà.

## 7. Les trois axes de consultation (moitié de ton temps)

Les profils du §6 vérifient des mécanismes. Ces trois axes-là jugent **l'outil tel qu'un médecin le
vivra**, entre deux patients, avec quatre minutes devant lui. Ils ne se traitent pas à vue : chacun
demande de **jouer une consultation entière et de compter**. Un chiffre relevé vaut dix impressions.

### Le matériel commun : trois vignettes, en prose

Ne pars **pas** d'une liste de champs — c'est justement ce qu'on veut tester. Pars de l'histoire, comme
en consultation, et vois ce que tu arrives à en faire.

- **V1 — Mme R., 64 ans.** DT2 depuis 9 ans. Sous metformine 2000 mg et gliclazide. Dernière HbA1c
  **8,4 %**. DFG **52**. IMC **31**. HTA traitée. Pas d'antécédent cardiovasculaire. Se plaint de
  malaises en fin de matinée depuis un mois. *(nœud : Traiter)*
- **V2 — M. B., 71 ans.** Sous insuline basale **38 U** le soir depuis deux ans, plus metformine.
  HbA1c **8,9 %**. Glycémies capillaires du matin entre **1,10 et 1,30 g/L**. **Pas de capteur de
  glucose.** DFG **61**. Vit seul. *(nœud : Insulinothérapie)*
- **V3 — M. K., 55 ans.** DT2 découvert il y a 3 mois. HbA1c **7,6 %**. LDL **1,42 g/L**. Fumeur.
  IMC **34**. Aucun traitement hypolipémiant. Mange à l'extérieur le midi, ne fait pas de sport.
  *(nœuds : Statine, puis Règles hygiéno-diététiques)*

Pour chaque vignette, note **ce que tu n'as pas pu renseigner faute de le savoir** — et ce que l'outil
a fait de ces trous.

### Axe A — Ergonomie de saisie

À mesurer, vignette par vignette, **chiffres à l'appui** :

1. **Combien d'interactions** entre l'ouverture du nœud et la première carte utile ? (compte : clics +
   champs tapés ; donne le total, pas une estimation).
2. **Combien de champs faut-il remplir avant que quoi que ce soit s'affiche** — et combien y en a-t-il
   en tout dans le nœud ?
3. **Le tri qui compte** : parmi les valeurs demandées, lesquelles un généraliste a-t-il **sous les
   yeux** (dossier ouvert, biologie récente), lesquelles doit-il **aller chercher** (rappeler un
   laboratoire, ouvrir un autre logiciel), lesquelles **n'a-t-il tout simplement pas** (TBR, coefficient
   de variation, espérance de vie estimée, poids si le patient n'a pas été pesé) ? Donne les trois
   listes. C'est la mesure la plus utile de tout l'axe.
4. **Le premier champ** : l'écran désigne-t-il par où commencer ? Le repère bleu « · détermine la
   suite » se voit-il sans le chercher ?
5. **Le droit à l'erreur** (famille 9) : clique un bouton segmenté par erreur — peux-tu revenir à « pas
   répondu » ? Vide un champ chiffré — l'écran revient-il à « non renseigné » ou garde-t-il une trace ?
   Que fait exactement « Rien à signaler », et sait-on **quels** champs il vient de répondre ?
6. **La stabilité sous les doigts** (famille 10) : pendant que tu remplis, note chaque fois que la page
   bouge, qu'un champ apparaît ou disparaît **au-dessus** de l'endroit où tu écris.
7. **Aux deux largeurs.** Refais la saisie de V1 en **mobile (375 px)** : combien d'écrans de
   défilement pour le seul formulaire ?

**Conclus par une phrase carrée** : en consultation de 15 minutes, ce nœud est-il remplissable ? Sur
lequel abandonnerais-tu, et à quel champ précisément ?

### Axe B — Lisibilité et compréhension de la réponse

Le test central, à faire **une fois par vignette**, sans tricher :

> **Le test des 20 secondes.** Une fois les cartes affichées, regarde l'écran **20 secondes**, puis
> détourne-toi et écris, sans relire : (a) ce que tu prescris, (b) ce que tu surveilles, (c) ce que tu
> ne dois surtout pas faire. **Ensuite** relis l'écran en entier et compare. **Ce que tu as manqué ou
> compris de travers est le résultat** — recopie-le tel quel dans le rapport. Un point manqué qui est
> une contre-indication est un défaut grave, pas une remarque de confort.

Puis, sur les mêmes écrans :

1. **La hiérarchie** : ce que l'œil attrape en premier (prends une capture et décris l'ordre réel de
   lecture) est-il ce qui compte le plus ? Le paragraphe coloré d'effet attendu passe-t-il devant les
   contre-indications ?
2. **Le départage.** Quand deux cartes sont « à égalité — même niveau de priorité », l'écran donne-t-il
   de quoi **choisir** ? Si non, dis ce que le praticien fait à cet instant précis.
3. **Les badges** : « Recommandée » + « Preuve très faible » sur la même carte — que comprend un
   lecteur pressé ? Les niveaux de preuve sont-ils compréhensibles **sans glossaire** ?
4. **Le vocabulaire de la preuve** : « RR ~0,79 par 1 mmol/L de LDL abaissé », « NNT ~12-20 » — dis
   franchement si c'est exploitable en 30 secondes, ou si c'est un texte qu'on saute.
5. **Le volume** : combien de mots et combien d'écrans pour une carte, aux deux largeurs ? Combien de
   cartes affichées d'un coup au maximum sur tes vignettes ?
6. **Ce qu'on emporte** : si tu devais dicter la conclusion dans le dossier en deux lignes, l'écran te
   les donne-t-il, ou faut-il les fabriquer ?
7. **Ce qui est loin de son objet** (famille 11) : mesure la distance à l'écran entre une mention du
   type « à renseigner : Poids » et le champ qu'elle désigne.

### Axe C — Fidélité au raisonnement de consultation

C'est l'axe le plus difficile et le plus important : l'outil **reproduit-il la façon dont un médecin
raisonne**, ou impose-t-il l'ordre de sa propre mécanique ?

1. **L'ordre des questions.** Le nœud *Traiter* ouvre sur « Intention thérapeutique »
   (initier / optimiser / intensifier / déprescrire). Or l'intention est souvent la **conclusion** du
   raisonnement, pas son point de départ : le médecin part d'un patient et d'un problème. Joue V1 et dis
   si tu as pu répondre à cette première question **avant** d'avoir réfléchi au reste — et ce que tu as
   fait si non. Regarde aussi ce que ce premier choix **verrouille** (des champs disparaissent : lesquels,
   et est-ce récupérable si tu t'es trompé d'intention ?).
2. **Trancher avant de savoir.** Repère tous les endroits où l'écran te demande de te prononcer sur
   quelque chose que tu es justement venu chercher.
3. **Le coût du découpage en six nœuds.** Une consultation DT2 réelle croise plusieurs questions.
   Joue **V3 sur la statine, puis sur les règles hygiéno-diététiques** pour le même patient, et
   **compte le nombre de valeurs que tu dois ressaisir à l'identique** (rappel : seules HbA1c actuelle
   et cible circulent, et seulement entre deux nœuds). Donne le chiffre. Fais le même compte entre
   *Traiter* et *Insulinothérapie* avec V2.
4. **Le point d'entrée.** Un médecin qui ne sait pas encore ce qu'il cherche trouve-t-il par où entrer ?
   La liste des six nœuds parle-t-elle sa langue (une question de consultation) ou celle du contenu
   (un titre de chapitre) ?
5. **Le périmètre, dit au bon moment.** Quand l'outil ne traite pas quelque chose (par exemple un
   patient sans capteur de glucose sur V2), le dit-il **là où le praticien bute**, ou le laisse-t-il
   devant un formulaire qui réclame une mesure qu'il n'aura jamais ? V2 est faite pour ça : rapporte
   précisément ce qui se passe.
6. **L'actionnabilité.** La réponse est-elle faisable **aujourd'hui, dans ce cabinet** ? Si elle
   suppose un examen, un avis ou un délai, l'écran le dit-il ?
7. **La question que tu poserais.** Termine l'axe par : *qu'est-ce qu'un médecin demanderait à cet
   outil et qu'il ne peut pas lui demander ?*

## 8. Ce que tu ne dois pas faire

- **Ne modifie aucun fichier du produit** — rien sous `content/`, `src/`, `schema/`, aucun fichier de
  contexte. Tu observes et tu rapportes. **Seule exception** : ton propre rapport, à écrire dans
  `docs/decision/validation/recette-navigateur-<AAAA-MM-JJ>.md`. Ne commite rien.
- **Ne corrige rien**, même un libellé qui te semble faux. Le contenu clinique est validé par un médecin
  référent, lui seul.
- **Ne juge pas la justesse médicale d'une recommandation.** Tu n'es pas compétent pour ça et ce n'est
  pas demandé. Signale ce qui est *incohérent* (l'écran se contredit, un champ est inatteignable, une
  alerte contredit une carte) ; pour le reste, écris « question clinique » et laisse le référent trancher.
- **Ne conclus jamais depuis le code ou les tests.** Lire un YAML pour comprendre *après coup* ce que tu
  as vu est permis et utile ; en tirer un verdict sans l'avoir vu à l'écran ne l'est pas. C'est l'erreur
  qui a produit le seul faux verdict des passes précédentes.
- **Ne monte pas un scénario par script** (cf. §0, outils) : clique, puis relis l'état du formulaire
  avant de conclure.

## 9. Format du rapport

Écris le rapport dans `docs/decision/validation/recette-navigateur-<AAAA-MM-JJ>.md`, structuré ainsi.

**En-tête** : URL, date et heure, résultat des **deux sondes du §2**, largeurs de fenêtre utilisées,
erreurs console. Puis : *ce que j'ai pu faire* / *ce que je n'ai pas pu faire*.

**Partie 1 — Défauts et non-régressions.** Un tableau de synthèse (un point par ligne, verdict), puis le
détail. Pour **chaque** point, dans cet ordre :

| champ | contenu |
|---|---|
| **Verdict** | `DÉFAUT` · `DOUTE` · `QUESTION CLINIQUE` · `CONFORME` · `NON REPRODUIT` |
| **Reproduction** | le nœud + **la valeur exacte de chaque champ saisi**, pour que ce soit rejouable |
| **Observé** | ce qui s'affiche, **verbatim** (recopie le texte de l'écran, ne le résume pas) |
| **Pourquoi ça compte** | une phrase, en termes de conséquence pour le praticien |

**Partie 2 — Les trois axes de consultation** (§7), une section par axe, **chiffres en tableau** :
interactions comptées, champs comptés, écrans de défilement, mots par carte, valeurs ressaisies d'un
nœud à l'autre, résultat brut du test des 20 secondes. Pas de commentaire sans mesure à côté.

**Partie 3 — Familles de défaut candidates** (§4bis) : pour chacune, son nom en une phrase, **ses deux
occurrences observées au minimum**, et la propriété de l'outil qui les produit. S'il n'y en a aucune,
écris-le — c'est un résultat.

**Clôture**, dans cet ordre :

1. **Les trois points les plus graves**, classés, avec pourquoi.
2. **Le verdict du dernier lot** : les six lignes de P0, en une phrase chacune.
3. **Ce que tu n'as pas pu tester** et pourquoi (aussi utile que le reste).
4. **Ton impression d'ensemble en praticien** : ouvrirais-tu cet outil en consultation ? Sur quel nœud
   as-tu décroché, à quel champ exactement, et à quelle seconde ?
