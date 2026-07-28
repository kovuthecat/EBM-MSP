# Prompt — recette navigateur (Claude Desktop)

> **Conçu pour être REJOUÉ**, pas pour un lot. À copier tel quel dans Claude Desktop.
> Rédigé le 2026-07-28. Mettre à jour §2 (sonde de version) et §6 (profils) après chaque gros lot.
>
> Pourquoi ce fichier existe : sur ce projet, **la recette navigateur trouve ce que cinq rapports
> d'audit et 769 tests unitaires ne trouvent pas**. Le 2026-07-27, elle a trouvé deux défauts en
> production qu'aucun audit n'avait vus.

---

Tu fais la **recette navigateur** d'un outil d'aide à la décision clinique destiné à des médecins
généralistes (diabète de type 2), sur `https://ebm-msp.vercel.app`. Utilise ton navigateur intégré.

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

Ordre de priorité **décroissante**. Les trois premiers portent des mécanismes livrés il y a deux jours
que **personne n'a jamais regardés à l'écran**.

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

## 7. Ce que tu ne dois pas faire

- **Ne modifie aucun fichier.** Tu observes et tu rapportes.
- **Ne corrige rien**, même un libellé qui te semble faux. Le contenu clinique est validé par un médecin
  référent, lui seul.
- **Ne juge pas la justesse médicale d'une recommandation.** Tu n'es pas compétent pour ça et ce n'est
  pas demandé. Signale ce qui est *incohérent* (l'écran se contredit, un champ est inatteignable, une
  alerte contredit une carte) ; pour le reste, écris « question clinique » et laisse le référent trancher.

## 8. Format du rapport

Pour **chaque** point, dans cet ordre :

| champ | contenu |
|---|---|
| **Verdict** | `DÉFAUT` · `DOUTE` · `QUESTION CLINIQUE` · `CONFORME` · `NON REPRODUIT` |
| **Reproduction** | le nœud + **la valeur exacte de chaque champ saisi**, pour que ce soit rejouable |
| **Observé** | ce qui s'affiche, **verbatim** (recopie le texte de l'écran, ne le résume pas) |
| **Pourquoi ça compte** | une phrase, en termes de conséquence pour le praticien |

Termine par :

1. **Les trois points les plus graves**, classés, avec pourquoi.
2. **Ce que tu n'as pas pu tester** et pourquoi (aussi utile que le reste).
3. **Ton impression d'ensemble en praticien** : ouvrirais-tu cet outil en consultation ? Sur quel nœud
   as-tu décroché ?
