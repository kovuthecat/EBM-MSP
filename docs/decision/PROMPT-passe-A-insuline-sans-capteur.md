# Prompt — Passe de recherche A : ajuster l'insuline sans capteur de glucose

> **À copier tel quel** en premier message d'une session Claude Code neuve, ouverte sur `ebm-msp`.
> Rédigé le 2026-07-29. Se lance **en parallèle** de tout autre chantier : cette passe ne touche à
> aucun fichier de code, uniquement au contenu clinique du nœud `insuline`, et rien ne doit y être
> câblé avant validation du référent.
>
> Pourquoi une session neuve : c'est un travail clinique lourd (Opus, effort xhigh), sans rapport avec
> l'UI. Il n'a besoin d'aucun contexte accumulé par les plans P4/P5/P6 — le rouvrir à froid coûte moins
> cher que de le poursuivre dans une session chargée.

---

Projet `ebm-msp` (`c:\Users\kovu\SynologyDrive\Thibault\Projets\ebm-msp`). Lis d'abord `CLAUDE.md` à la
racine (invariants, commandes, fichiers de référence).

Je veux cadrer et lancer la **Passe A**, backlog `TASKS.md` §« recherche clinique » — reclassée
**bloquante pour l'usage** le 2026-07-28 : sur le nœud `insuline` (Insulinothérapie du DT2), un patient
non naïf **sans capteur de glucose (MCG)** est aujourd'hui une impasse. Le volet mécanique est déjà livré
(les 4 champs de capteur se masquent sans `mcg_disponible`, P5/S2 T-033) ; il manque le volet clinique :
comment ajuster une insuline sur la seule glycémie capillaire.

**À lire avant toute proposition** (dans cet ordre) :

1. `docs/decision/GRAMMAIRE-NOEUD.md` — les règles R1→R9, non négociables pour tout nœud.
2. `docs/decision/validation/chantier-2026-07-27/ARBITRAGES-2026-07-27-nuit.md` §1 — le cadrage déjà posé.
3. `docs/decision/validation/chantier-2026-07-27/diagnostic-K2-mesures-mcg.md` — le diagnostic technique
   d'origine (pourquoi le nœud suppose un capteur partout).
4. `docs/decision/validation/BILAN-P4-2026-07-28.md` §3bis — la voie concrète donnée par le référent le
   2026-07-28 : `TBR` est obtenable au lecteur capillaire, `TBR_severe` ne l'est pas (un lecteur ne
   distingue pas les deux seuils) ; piste de répartition horaire des hypoglycémies en 4 créneaux
   (nuit 0-6 h / matinée 6-12 h / après-midi 12-18 h / soir 18-24 h), analogue capillaire de ce que
   `profil_glycemique` lit déjà par AGP.
5. `TASKS.md`, entrée « Passe A » — **précision du référent, 2026-07-29** : `TBR_severe` reste hors de
   portée en consultation **même chez un patient équipé** d'un capteur. La répartition TBR / TBR sévère
   ne se lit pas sur le lecteur lui-même : elle suppose de télécharger les données sur un ordinateur,
   geste rarement fait pendant la consultation. Le champ n'est donc pas seulement inatteignable *sans*
   capteur — il l'est aussi en pratique *avec* capteur, au moment où la décision se prend. C'est un
   élément neuf et important : il peut justifier de retirer `TBR_severe` du nœud plutôt que de
   simplement le masquer.
6. `content/noeuds/diabete-type-2/insuline.yaml` — **en entier**, en particulier les champs `TBR`,
   `TBR_severe`, `GAJ`, `profil_glycemique` et les critères dérivés qui les lisent (`gaj_a_cible`,
   `profil_nocturne_a_cible`, `profil_nocturne_permet_titration`, `over_basalisation`).

**Hors périmètre de cette passe** (déjà logué séparément, ne le corrige pas ici) : `GAJ` reste réclamé
même quand `mcg_disponible` est coché — correctif mécanique indépendant, backlog `TASKS.md`.

**Ce que j'attends de cette session.** Pas une proposition clinique inventée seule : je suis le référent
clinique de ce projet, cette passe se construit avec moi.

1. Commence par me **résumer ce que les cinq documents disent et ne disent pas**, en séparant nettement
   ce qui est déjà tranché de ce qui reste ouvert. Ce qui reste ouvert, à ma connaissance : le pivot de
   décision sans capteur, les seuils de titration et de plafonnement de la basale sur glycémie à jeun,
   les seuils post-prandiaux pour le bolus (champ à créer), l'encodage exact des 4 créneaux horaires, et
   la correspondance avec `profil_glycemique`. Vérifie cette liste plutôt que de la reprendre telle
   quelle.
2. Puis **propose un déroulé de travail** : cadrage `/nouveau-plan` si le périmètre est clair, ou d'abord
   une collecte de preuve EBM si la littérature sur le pilotage capillaire de l'insuline basale/bolus
   doit être posée avant que je tranche les seuils. Dis-moi franchement laquelle des deux, et pourquoi.
3. **Ne câble rien dans le YAML avant que j'aie validé le contenu.** En cas de doute clinique, signale
   plutôt qu'invente (invariant 6 de `CLAUDE.md`), et re-vérifie toute sortie sur la source primaire.
