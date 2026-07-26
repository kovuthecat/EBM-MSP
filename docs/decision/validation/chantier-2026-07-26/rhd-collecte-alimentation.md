# Nœud RHD — refonte axe ALIMENTATION : grille de recueil + bibliothèque de pistes (2026-07-26)

## Révisions (2026-07-26)

Mise à jour en place de ce document suite à deux commandes du référent, dans cet ordre :

**1. Corrections des 4 findings HAUTE du red-team** (`redteam-collectes-rhd.md`, A-1 à A-4), chaque
source rouverte directement (`pdftotext`), pas acceptée sur parole :

- **A-1 — SFD 2025 mal attribuée (S1, U1, B1)** : le verbatim « en évitant… la consommation
  d'aliments ultra-transformés et de boissons sucrées » est bien page 21, mais appartient à la
  section **8.7 / Avis n°15 (MASLD/MASH)**, pas à l'Avis n°14 (obésité, p.17, qui ne mentionne ni
  l'un ni l'autre). Vérifié par extraction complète de `SFD 2025.pdf` : **0 autre occurrence** de
  « ultra-transformé » ou « boissons sucrées » dans tout le document — pas de reco SFD générale DT2
  disponible en repli. Attribution corrigée sur les 3 pistes ; renforcée par une source à portée
  générale (`manger bouger reco.pdf`, PNNS, cf. point 2).
- **A-2 — M1 (« huile d'olive ou de colza »)** : PREDIMED randomise huile d'olive vierge extra **ou**
  fruits à coque, jamais le colza — confirmé par `H-rhd.md` §3 (sous-dossier H3) que ce document
  citait déjà lui-même en s'auto-contredisant. Colza retiré du geste et de l'étiquette EBM-dur.
  Réserve de sur-attribution renforcée (le bras randomisé est le motif méditerranéen entier
  supplémenté, pas le geste huile isolé) + mention de la rétractation/republication 2018 de
  PREDIMED, absente jusqu'ici (finding MOYENNE A-5, corrigé par la même occasion).
- **A-3 — B2 (édulcorants)** : la référence Salame/NutriNet-Santé citée à l'appui documente les
  **émulsifiants**, pas les édulcorants — vérifié dans `prescrire-dt2.md` P9, qui contient bien deux
  puces distinctes. Référence retirée de B2.
- **A-4 — T1 (repas à heures réguliers)** : aucune lettre de grade n'accompagne « Fixed meal times in
  order to support weight control » dans `Lifestyle education…ebmfrance.pdf` p.6 — vérifié à
  l'extraction texte. Le « A/B » cité venait d'une sous-section voisine (« Tips for implementing a
  recommended diet A B »). Mention de grade retirée.

**Règle appliquée plus largement** (demandée par le référent, pas limitée aux 4 HAUTE) : *le niveau de
preuve affiché doit être celui que la source a elle-même coté, jamais une appréciation du rédacteur.*
Corrections supplémentaires faites par la même règle (findings MOYENNE du red-team, revérifiées
source en main) : **A-5** (rétractation PREDIMED, cf. supra) ; **A-6** (S8 : seule la 3ᵉ des trois
citations relève réellement de la liste « DSM-5 » de l'encadré 11 HAS p.43 — les deux premières
viennent de la liste voisine « perturbations de l'alimentation », non estampillée DSM-5) ; **A-7**
(P1'/P2' : le paragraphe source, `rapport_gtg_glucides_sfd.pdf` p.8, scope explicitement la pesée à
l'insulinothérapie fonctionnelle — tension avec la conclusion générale p.14, signalée, non tranchée) ;
**A-8** (R2 reclassée « savoir-faire (non EBM) » — c'est une inférence de consultation, pas une
recommandation littérale de la source citée).

**2. Intégration de la source PNNS** (`manger bouger reco.pdf`, Santé publique France, « 50 petites
astuces pour manger mieux et bouger plus », 32 p., lu intégralement) + page officielle
<https://www.mangerbouger.fr/manger-mieux/a-tout-age-et-a-chaque-etape-de-la-vie/les-recommandations-alimentaires-pour-les-adultes>
(consultée 2026-07-26 — reprend les mêmes catégories Augmenter/Aller vers/Réduire que la dernière
page du PDF, mais sans détailler les chiffres dans le rendu HTML récupéré ; les repères chiffrés
exploités ici viennent donc du PDF). Étiquette : **« recommandation officielle »**, jamais « EBM
dur » — un PNNS n'est pas un essai contrôlé. Nouvelle section **P0** créée pour héberger ses repères
chiffrés (cap d'en-tête, jamais recueil ni piste — règle référent §4bis-0, cf. ci-dessous) ; renfort
de sourçage sur B1/U1/S1 (cf. point 1) ; 2 nouvelles pistes formées (légumineuses, poisson).

**3. Décisions référent `CONCEPTION-module-rhd.md` §4bis intégrées** :

- **Règle structurelle §4bis-0 (mouvement, jamais cible)** : appliquée à tout ajout — aucune valeur à
  atteindre dans un geste, quantités PREDIMED/MEDAS reléguées à l'argumentaire, recueil en fréquence
  déclarée.
- **Socle hybride §4bis-1** : ajout de 4 items de recueil en fréquence déclarée — **fruits à coque
  (S9, rang 1 — l'un des deux bras PREDIMED, absent jusqu'ici)**, légumineuses (S10), poisson (S11),
  viande rouge/charcuterie (S12) — et de 3 pistes formées (fruits à coque FC1, légumineuses L1,
  poisson PO1 ; viande rouge/charcuterie rattachée à M2 existante). L'huile d'olive n'entre pas en
  quantité au recueil (S4 suffit, cf. règle référent).
- **Vin (§4bis-1 point 2)** : ajouté au recueil (A12, approfondissement) — **jamais proposé en
  piste**. B3 (marqué « À SOURCER » dans la version précédente) est retiré de la bibliothèque de
  pistes : ce n'était pas un manque de source (le vin est bien un item MEDAS, #8) mais un refus
  déjà tranché par le référent, documenté comme tel.

**Non touché** : `H-rhd.md`, tout `content/`, tout `src/`, les autres documents du chantier
(`CONCEPTION-module-rhd.md`, `cible-mediterraneenne-medas.md`, etc.) — lus, jamais modifiés.

---

Document de conception, **lecture seule sur le reste du dépôt** — aucun YAML, aucun code, aucune
modification de fichier existant. Répond à la commande du référent (recadrage 2026-07-26,
`docs/decision/validation/recette-2026-07-25-prescription-intensifier.md`, section « Analyse de
pertinence du module RHD », §1-8) : **l'EBM donne la cible (motif alimentaire méditerranéen), les
recommandations doivent permettre de s'en rapprocher**. Porte exclusivement sur l'**axe
alimentation** — l'axe activité physique (déplacements, sédentarité, pratique structurée) est traité
en parallèle par un autre agent et n'est pas abordé ici, sauf mention explicite d'une variable déjà
partagée entre les deux axes.

**Méthode** : chaque item, chaque piste, chaque garde-fou cite un fichier + une page/section précis
du dépôt. Rien n'est reconstitué de mémoire. Ce qui semble plausible mais n'est étayé nulle part dans
le dépôt est marqué **« À SOURCER »**.

**Sources lues intégralement ou par extraction ciblée pour ce document** (traçabilité complète en
Annexe) :

- `docs/decision/validation/recette-2026-07-25-prescription-intensifier.md` §1-8 (cahier des charges)
- `docs/decision/noeuds/H-rhd.md` (dossier de preuve existant, notamment §0, §1, §8)
- `docs/decision/sources/Lifestyle education in type 2 diabetes _ ebmfrance.pdf` (EBM
  Guidelines/Duodecim, grade A/B) — lu intégralement (6 pages)
- `docs/decision/sources/guide HAS._parcours_surpoids-obesite_de_ladulte.pdf` — §3.4 (p.39-40), §3.5
  (p.41-43), §3.6 (p.43-44), Fiche 4 (p.178-180) — lus intégralement
- `docs/decision/sources/rapport_gtg_glucides_sfd.pdf` (SFD Paramédical + AFDN, 2016) — extraits
  ciblés (p.8-9, 11-12, 14)
- `docs/decision/sources/prescrire-dt2.md` — P9, P10 (déjà en version résumé critique interne)
- `docs/decision/sources/strategie_therapeutique_du_patient_vivant_avec_un_diabete_de_type_2_-_recommandations.pdf`
  (HAS DT2, mai 2024) — Tableau 4 « PEC non médicamenteuse — NUT » (R.30-R.38, p.13-15) et R.44 (p.16)
- `docs/decision/sources/SFD 2025.pdf` — extraits ciblés (p.17 Avis n°14 ; p.21 §8.7/Avis n°15
  MASLD-MASH ; recherche exhaustive « ultra-transformé »/« boissons sucrées » sur les 32 pages,
  2026-07-26)
- `docs/decision/sources/manger bouger reco.pdf` (Santé publique France/PNNS, « 50 petites astuces
  pour manger mieux et bouger plus ») — **ajouté 2026-07-26**, lu intégralement (32 p.) ; page
  officielle
  <https://www.mangerbouger.fr/manger-mieux/a-tout-age-et-a-chaque-etape-de-la-vie/les-recommandations-alimentaires-pour-les-adultes>
  consultée le même jour
- `docs/decision/noeuds/H-rhd.md` §3 (sous-dossier H3) — relu 2026-07-26 pour la citation PREDIMED
  exacte (bras testés, statut de rétractation/republication)
- `docs/decision/validation/chantier-2026-07-26/cible-mediterraneenne-medas.md` — relu 2026-07-26
  (items MEDAS #5, #8, #9, #10, #12 ; régime d'intervention PREDIMED §3)
- `docs/decision/validation/chantier-2026-07-26/CONCEPTION-module-rhd.md` §4bis — relu 2026-07-26
  (décisions référent intégrées, document non modifié)

## 0. Ce que ce document ne tranche pas

Les arbitrages `H-rhd.md` §8-1 à §8-7 (périmètre chirurgie, fenêtre de rémission, objectif de perte de
poids, `motivation`/`capacite_activite` en modulateur jamais en gate, alerte hypoglycémie, voix de la
rémission) sont **déjà tranchés par le référent et ne sont pas rouverts ici**. Ce document porte
uniquement sur la **couche nouvelle** que le recadrage du 2026-07-26 appelle : un recueil alimentaire
structuré (remplaçant le booléen unique `alimentation_equilibree`, `H-rhd.md` §1) et une bibliothèque
de pistes concrètes qui en dépendent. Les variables déjà validées du nœud H (`IMC`,
`anciennete_diabete_annees`, `motivation`, `capacite_activite`) ne sont pas redemandées ici.

**Sur le MEDAS** (screener d'adhérence méditerranéenne à 14 items, utilisé dans PREDIMED, cité comme
candidat non vérifié en `recette…md:1144`) : **recherché explicitement dans les 9 sources du dépôt
(PDF + `prescrire-dt2.md`) et dans tout `docs/decision/` — absent**. Aucun item n'en a été reconstitué
de mémoire. C'est un manque, pas une décision : si l'instrument doit être utilisé, il faut d'abord
obtenir sa source primaire (Schröder et al. 2011, ou l'annexe de méthode PREDIMED) — non fait ici.

**Mise à jour 2026-07-26** : le MEDAS a depuis été récupéré en source primaire
(`cible-mediterraneenne-medas.md`, 14/14 items). Ce document l'utilise comme référence pour situer les
nouveaux items du socle hybride (§4bis-1) et pour le vin (A12), **jamais comme instrument administré
ou scoré** (règle référent §4bis-0 — cf. P0 ci-dessous).

---

## P0 — Repères chiffrés PNNS (matériau pour le cap d'en-tête du module — hors recueil, hors pistes)

**Ajouté 2026-07-26.** Le PNNS (`manger bouger reco.pdf`, Santé publique France) est presque
entièrement écrit en repères chiffrés (« 5 fruits et légumes par jour », « 2 produits laitiers »…).
Règle de placement du référent (`CONCEPTION-module-rhd.md` §4bis-0, prioritaire) : un repère chiffré
n'est **ni un item de recueil, ni une valeur affichée dans une piste** — il vit dans le **cap affiché
en en-tête du module**, dont la forme et l'emplacement définitifs relèvent de
`CONCEPTION-module-rhd.md` §2 (non modifié ici). Cette section rassemble le matériau sourcé, prêt à
y être versé, sans préjuger de sa mise en forme finale.

| Repère chiffré PNNS | Verbatim | Source |
|---|---|---|
| Fruits et légumes | « Il est recommandé de manger au moins 5 fruits et légumes par jour. » (3 portions légumes + 2 fruits, ou l'inverse) | `manger bouger reco.pdf` p.8, p.20 |
| Féculents complets | « Il est recommandé de consommer au moins un féculent complet par jour (pain, pâtes, riz, semoule…). » | `manger bouger reco.pdf` p.10 |
| Légumineuses (légumes secs) | « Il est recommandé de consommer au moins 2 fois par semaine des légumes secs. » | `manger bouger reco.pdf` p.13 |
| Poisson | « Consommez du poisson 2 fois par semaine, dont 1 poisson gras (sardine, maquereau, hareng, saumon). » | `manger bouger reco.pdf` p.8, p.15 |
| Viande (hors volaille) | « Privilégiez la volaille et limitez les autres viandes (porc, bœuf, veau, mouton, agneau, abats) à maximum 500 g par semaine. » | `manger bouger reco.pdf` p.15 |
| Charcuterie | « Limitez la charcuterie à maximum 150 g par semaine. » | `manger bouger reco.pdf` p.24 |
| Produits laitiers | « Il est recommandé de consommer 2 produits laitiers par jour. » | `manger bouger reco.pdf` p.6 |
| Matières grasses de cuisson | « Aller vers l'huile de colza, de noix et d'olive » — « préférez l'huile et réservez le beurre pour les tartines… ou cru en noisette sur des légumes cuits. » | `manger bouger reco.pdf` p.16 |
| Boissons sucrées | « Réduire les boissons sucrées… pas plus d'un verre par jour. » | `manger bouger reco.pdf` p.16 |
| Fruits à coque | « Il est recommandé de consommer une petite poignée par jour de fruits à coque non salés. » | `manger bouger reco.pdf` p.19 |
| Alcool (population générale, distinct du seuil MEDAS) | « Il est recommandé de limiter sa consommation d'alcool à 2 verres maximum par jour et pas tous les jours. » | `manger bouger reco.pdf` p.19 |
| Ultratransformés / Nutri-Score | « Il est recommandé de limiter les boissons sucrées, les aliments gras, salés, sucrés et ultra-transformés » — orienter vers Nutri-Score A/B/C. | `manger bouger reco.pdf` p.23-24 |

**Étiquette** : ces repères sont une **recommandation officielle** (Santé publique France/PNNS,
population adulte générale — pas un essai contrôlé), jamais « EBM dur ». Ils ne se substituent pas
aux repères MEDAS/PREDIMED (population et méthode différentes) ni ne les remplacent — les deux
coexistent, cités séparément, sans être fusionnés en un score commun (règle §4bis-0, point 3).

**Non fait ici** : arbitrer la forme exacte du cap d'en-tête, le choix entre repère PNNS et repère
MEDAS/PREDIMED là où les deux se recoupent, ou la rédaction finale de l'en-tête — cela reste le
périmètre de `CONCEPTION-module-rhd.md` §2, non modifié par ce document.

---

## P1 — Grille de recueil « alimentation »

### Principe d'ordre et de forme

Deux sources structurent directement l'ordre proposé :

1. `ebmfrance` bâtit son parcours en 3 temps — *assess the situation* → *discuss the aims* → *offer
   guidance* (p.2). Le recueil (P1) correspond au premier temps ; les pistes (P2) au deuxième et
   troisième.
2. Le guide HAS séquence lui-même **§3.5 (bilan des habitudes) avant §3.6 (repérage des TCA)**
   (p.41-44) — le repérage sensible vient après le factuel, pas avant. Le socle proposé suit cet
   ordre : les questions neutres et factuelles d'abord, le verrou de sécurité en dernier.

Contrainte dure rappelée par la mission : **utilisable en consultation de médecine générale**. Le
socle vise ~2-3 minutes de recueil oral, pas un questionnaire à remplir. Chaque intitulé est écrit en
« vous », au registre non jugeant demandé par la HAS (« importance de la valorisation de tout
changement… et de la déculpabilisation », guide HAS p.179 ; « dédramatiser la situation,
déculpabiliser la personne », guide HAS §7.9.2 p.69-70) : aucune question n'est formulée de façon à
appeler un jugement implicite dans sa réponse.

### Socle court (8 items)

| # | Intitulé exact (tel qu'affiché) | Type | Valeurs | Source (fichier + page/section) |
|---|---|---|---|---|
| S1 | « Buvez-vous des boissons sucrées (sodas, jus de fruits, boissons énergisantes) ? » | enum fréquence | Jamais / Occasionnellement (< 1×/sem) / 1 à 3×/sem / 4×/sem ou plus, quotidien | `Lifestyle education…ebmfrance.pdf` p.3 (« Consumption of "fast sugars" (sugar-sweetened beverages, energy drinks, sweets, sweet desserts)… ») ; `manger bouger reco.pdf` p.16 (PNNS, population générale : « Réduire les boissons sucrées… pas plus d'un verre par jour »). **Corrigé 2026-07-26** : `SFD 2025.pdf` p.21 cite bien « boissons sucrées », mais dans la section §8.7/Avis n°15 (patients DT2 + MASLD/MASH), pas dans l'Avis n°14 — recherche exhaustive confirmée (0 autre occurrence dans les 32 pages) ; citée ici comme renfort **scopé à la sous-population MASLD/MASH**, pas comme reco DT2 générale (cf. Révisions) |
| S2 | « À quelle fréquence mangez-vous des plats préparés industriels ou des aliments très transformés (plats cuisinés du commerce, snacks industriels, charcuterie industrielle) ? » | enum fréquence | (même échelle) | `guide HAS…obesite.pdf` §3.5.2 p.42 (« habitudes personnelles et familiales, culturelles : … consommation de produits ultratransformés ») ; Fiche 4 p.178 (« proportion d'aliments transformés, ultra transformés ») ; `manger bouger reco.pdf` p.23-24 (PNNS, population générale : « Doucement sur les produits ultra-transformés » + repère Nutri-Score D/E) ; `rapport_gtg_glucides_sfd.pdf` p.11-12 (degré de transformation, classification NOVA). `SFD 2025.pdf` p.21 cité en renfort **scopé MASLD/MASH** (Avis n°15, pas n°14) — **corrigé 2026-07-26**, cf. Révisions |
| S3 | « Vous arrive-t-il de manger en restauration rapide ou "sur le pouce" (fast-food, sandwicherie, snack) ? » | enum fréquence | (même échelle) | `guide HAS…obesite.pdf` §3.5.2 p.42 (« contexte… des prises alimentaires : maison, restaurant d'entreprise, **restauration rapide**, seul/en famille ») |
| S4 | « Pour cuisiner et assaisonner, qu'utilisez-vous le plus souvent : plutôt du beurre/des graisses animales, ou plutôt de l'huile d'olive ou de colza ? » | enum | Surtout beurre/graisses animales · Un mélange des deux · Surtout huile d'olive ou colza | `Lifestyle education…ebmfrance.pdf` p.3 (« foods high in saturated fat ») et p.5 (« Use oil in cooking and soft margarine as spread on bread ») ; `guide HAS…obesite.pdf` Fiche 4 p.180 (« alimentation de type méditerranéen, riche en… huile d'olive ») ; `prescrire-dt2.md` P10 (« huile d'olive/colza ») |
| S5 | « Vos repas sont-ils à des horaires à peu près réguliers, ou très variables selon les jours ? » | bool/enum | Réguliers · Variables / irréguliers | `Lifestyle education…ebmfrance.pdf` p.3 (« at what time ») et p.6 (« Fixed meal times in order to support weight control ») ; `guide HAS…obesite.pdf` §3.5.2 p.42 (« régularité des repas (répartition dans la journée, nombre, durée et horaires) ») |
| S6 | « Grignotez-vous entre les repas, en dehors des repas et sans avoir vraiment faim ? » | enum fréquence | (même échelle) | `guide HAS…obesite.pdf` §3.5.2 p.42 (« repas/collations/grignotage ») ; Fiche 4 p.178 (« prises alimentaires… y compris collations et prises alimentaires en dehors des repas ou sans faim ») ; `Lifestyle education…ebmfrance.pdf` p.3 (« does he/she snack between meals ») |
| S7 | « Avez-vous facilement accès à une alimentation variée (question de budget ou de proximité), et avez-vous ce qu'il faut chez vous pour cuisiner (matériel, rangement) ? » | enum | Oui, sans difficulté · Avec quelques difficultés · Non, difficultés importantes | `guide HAS…obesite.pdf` Fiche 4 p.179 (« l'accès à une alimentation variée (géographique et financier), l'accès à du matériel pour cuisiner (pour le stockage, la cuisson, le service) ») ; `strategie_therapeutique…pdf` R.32 p.14, grade AE (« … niveau socio‑économique… ») |
| S8 | Verrou (chapeau) : « Avant de proposer une piste, quelques repères — l'un de ces éléments vous concerne-t-il ? » — 3 cases : « Je me restreins volontairement en quantité de nourriture, parfois avec des épisodes où je "craque" ensuite » / « Il m'arrive de manger seul(e) ou en cachette, ou de me sentir coupable après avoir mangé » / « J'ai déjà demandé un régime amaigrissant, ou j'ai des habitudes alimentaires très restrictives » | liste (multi-select) | 0 à 3 signes cochés | `guide HAS…obesite.pdf` encadré 11 p.43 (DSM-5 : « restriction cognitive… alternance avec des épisodes de désinhibition, entraînant une prise de poids » ; « manger seul ou en cachette… se sentir dégoûté de soi-même, triste ou coupable après avoir mangé » ; « demande de régime amaigrissant… habitudes alimentaires restrictives, exclusions alimentaires ») ; Fiche 4 p.178 (« le repérage d'éléments en faveur d'un trouble du comportement alimentaire (TCA), d'une restriction cognitive ») |

**S8 — avertissement de sourçage** : ce ne sont **pas** les items d'un instrument validé (type SCOFF,
EDE-Q). Aucun questionnaire de repérage TCA validé n'a été trouvé dans les sources locales (recherché,
absent — cf. Annexe). Les trois questions reformulent directement, en style consultation, les signes
d'appel listés par la HAS. Ce n'est pas un score : une seule case cochée suffit à actionner le
garde-fou (P4).

**S8 — précision de sourçage, corrigée 2026-07-26 (finding red-team A-6)** : l'encadré 11 (p.43)
contient deux listes distinctes chez la HAS — « perturbations de l'alimentation » (non estampillée
DSM-5) et « troubles des conduites alimentaires » (« comme (DSM-5) »). Sur les trois signes de S8,
**seul le troisième** (« j'ai déjà demandé un régime amaigrissant… ») appartient à la liste DSM-5 au
sens strict de la source ; les deux premiers (restriction/désinhibition ; manger seul ou en
cachette/culpabilité) viennent de la liste voisine « perturbations de l'alimentation ». Les trois
restent des signes d'appel HAS légitimes (encadré 11 dans son ensemble) ; seule l'étiquette « DSM-5 »
groupée sur les trois était inexacte — ne plus l'utiliser que pour le 3ᵉ signe.

### Socle — extension hybride (4 items, décision référent 2026-07-26, `CONCEPTION-module-rhd.md` §4bis-1)

**Ajoutée 2026-07-26.** Le socle S1-S8 ci-dessus recueille des habitudes « de bon sens » (moins de
sucre, moins d'ultratransformé, moins de restauration rapide) mais, confronté aux 14 items du MEDAS
(`cible-mediterraneenne-medas.md` §6), ne couvrait **aucun** axe « augmentation » du motif
méditerranéen — alors que c'est l'axe que PREDIMED a testé et que le motif méditerranéen valorise. Le
référent a tranché d'ajouter les axes les plus proches de la preuve randomisée, **en fréquence
déclarée, jamais en quantité comparée à un seuil** (règle §4bis-0) : les quantités PREDIMED/MEDAS/PNNS
vivent dans la colonne Source (argumentaire), jamais dans l'intitulé ni les valeurs de réponse.

| # | Intitulé exact (tel qu'affiché) | Type | Valeurs | Source (fichier + page/section) | Rang §4bis-1 |
|---|---|---|---|---|---|
| S9 | « Mangez-vous des fruits à coque non salés (noix, noisettes, amandes…) ? » | enum fréquence | Jamais / Occasionnellement / Régulièrement (plusieurs fois/sem) | **Bras réellement randomisé de PREDIMED** — `H-rhd.md` §3 sous-dossier H3 (« MedDiet + huile d'olive VE *ou* noix vs conseil pauvre en graisses ») ; `cible-mediterraneenne-medas.md` §2 item #12 (MEDAS, ≥3 portions/sem = cadre de définition, pas un seuil administré) ; `manger bouger reco.pdf` p.19 (PNNS : « une petite poignée par jour ») | **1 — priorité** : axe totalement absent du recueil jusqu'ici |
| S10 | « Mangez-vous des légumineuses (lentilles, pois chiches, haricots secs…) ? » | enum fréquence | Jamais / Occasionnellement / Régulièrement | `cible-mediterraneenne-medas.md` §2 item #9 (MEDAS, ≥3 portions/sem) ; `manger bouger reco.pdf` p.13 (PNNS : « au moins 2 fois par semaine ») | 3 — composante du motif, non randomisée isolément |
| S11 | « Mangez-vous du poisson, y compris gras (sardine, maquereau, saumon…) ? » | enum fréquence | Jamais / Occasionnellement / Régulièrement | `cible-mediterraneenne-medas.md` §2 item #10 (MEDAS, ≥3 portions/sem) ; `manger bouger reco.pdf` p.8, p.15 (PNNS : « 2 fois par semaine, dont 1 poisson gras ») | 3 — idem |
| S12 | « Mangez-vous de la viande rouge ou de la charcuterie, et à quelle fréquence ? » | enum fréquence | Jamais / Occasionnellement / Régulièrement / Quotidien | `cible-mediterraneenne-medas.md` §2 items #5 (<1 portion/j) et #13 (préférence volaille) ; `manger bouger reco.pdf` p.15 et p.24 (PNNS : viande hors volaille ≤500 g/sem, charcuterie ≤150 g/sem — repères, pas gestes, cf. P0) | 3 — idem ; alimente aussi le déclencheur de M2 (existante) |

**Huile d'olive (rang 2 de la table §4bis-1) — pas de nouvel item** : le socle interroge déjà la
matière grasse de cuisson (S4, « plutôt beurre / plutôt huile d'olive ou colza »). Le référent juge ce
recueil qualitatif suffisant ; **la quantité n'entre pas au recueil** — elle n'aurait de sens que pour
la comparer à un seuil (règle §4bis-0), ce que le module ne fait pas.

**Point ouvert, à signaler au référent plutôt qu'à trancher ici** : l'ajout de S9-S12 porte le socle de
8 à 12 items, ce qui tend la contrainte « ~2-3 minutes de recueil oral » posée en tête de ce document
(§ Principe d'ordre et de forme). Le référent a tranché l'ajout lui-même (§4bis-1) ; l'arbitrage entre
« tout en socle » et « S9-S12 en sous-bloc court, éventuellement scindé du reste » reste ouvert — non
tranché ici, faute de mandat.

### Approfondissement optionnel (11 items)

À proposer seulement si le socle laisse une marge de négociation ouverte, ou à la demande du
diététicien de la structure (cf. Fiche 4, situations qui appellent son expertise, p.178).

| # | Intitulé exact | Type | Valeurs | Source |
|---|---|---|---|---|
| A1 | « Que mangez-vous et buvez-vous habituellement à chaque repas, et à quelle heure ? » | texte libre | — | `Lifestyle education…ebmfrance.pdf` p.3 |
| A2 | « Salez-vous à table, et consommez-vous souvent des produits salés (charcuterie, plats industriels, snacks apéritifs) ? » | bool/enum | Oui souvent / occasionnellement / rarement-jamais | `Lifestyle education…ebmfrance.pdf` p.3 (« Salt intake ») |
| A3 | « Que buvez-vous d'habitude quand vous avez soif ? » | texte libre | — | `Lifestyle education…ebmfrance.pdf` p.3 |
| A4 | « Trouvez-vous facile ou difficile d'estimer la quantité de nourriture dans votre assiette ? » | enum | Facile · Difficile · Je ne sais pas / je n'y pense pas | `rapport_gtg_glucides_sfd.pdf` p.8-9, p.14 (« l'erreur vient bien plus souvent d'une mauvaise appréciation des quantités d'aliments consommées, que des grammes de glucides comptés en plus ou oubliés ») ; `guide HAS…obesite.pdf` Fiche 4 p.178 (« taille des portions ») |
| A5 | « Quelle est votre cuisine habituelle (origine, plats types) ? » | texte libre | — | `guide HAS…obesite.pdf` §3.5.2 p.42 (« traditions culinaires, goûts alimentaires ») ; Fiche 4 p.179 (« les habitudes alimentaires, les aspects culturels ») |
| A6 | « Suivez-vous un régime d'exclusion (sans gluten, sans lactose, végétarien, végétalien…) ? » | liste | valeurs libres | `guide HAS…obesite.pdf` §3.5.2 p.42 (« existence de régimes d'exclusion ») |
| A7 | « Comment décririez-vous votre rapport à la faim, à la satiété, aux aliments sucrés/salés/gras ? » | texte libre | — | `guide HAS…obesite.pdf` §3.5.2 p.42 (« perceptions liées à l'alimentation : … faim, appétit, satiété, rassasiement » ; « rapport aux aliments sucrés, salés, gras ») ; Fiche 4 p.179 |
| A8 | « Mangez-vous souvent devant un écran (télévision, téléphone) ? » | bool/enum fréquence | — | `guide HAS…obesite.pdf` §3.5.2 p.42 (« activité lors des repas (télévision, usage d'autres écrans, jeux) ») |
| A9 | « Avez-vous déjà suivi des régimes pour perdre du poids ? Dans quel contexte, avec quel résultat ? » | texte libre | — | `guide HAS…obesite.pdf` Fiche 4 p.179 (« les régimes antérieurs et leur contexte », « l'historique du poids ») |
| A10 | « Qu'est-ce qui, pour vous, fait qu'une alimentation est équilibrée ou non ? » | texte libre | — | `guide HAS…obesite.pdf` §3.5.2 p.42 (« connaissances : alimentation et son lien avec la santé, qualité nutritionnelle ») ; `strategie_therapeutique…pdf` R.32 p.14 (« littératie en santé ») |
| A11 | « Vous arrive-t-il de manger sous le coup du stress, de l'ennui, de la fatigue, ou pour vous réconforter ? » | bool/enum fréquence | — | `guide HAS…obesite.pdf` Fiche 4 p.179 (« les dimensions émotionnelles : plaisir, récompense, consolation, stress, fatigue, ennui ») |
| A12 | « Buvez-vous du vin ? Si oui, à peu près combien de verres par semaine ? » | enum fréquence | Jamais / Occasionnellement / 1 à 6 verres/sem / 7 verres/sem ou plus | **Ajouté 2026-07-26**, décision référent `CONCEPTION-module-rhd.md` §4bis-1 point 2 — le vin est un item du MEDAS (`cible-mediterraneenne-medas.md` §2 item #8 : « ≥7 verres/semaine »), donc de la cible EBM que le module opérationnalise ; **recueilli, jamais proposé** (cf. note ci-dessous et famille Boissons, P2) |

**A12 — deux réserves de rédaction (décision référent)** : (1) la question doit être formulée de
façon à ne pas se lire comme une invitation à boire — intitulé neutre, posé au même registre factuel
que les autres items d'approfondissement, jamais présenté comme un « axe à développer ». (2) une
réponse élevée (proche ou au-delà du seuil MEDAS de 7 verres/semaine, ou toute réponse qui inquiète le
praticien) doit renvoyer vers le repérage d'un mésusage — **outil dédié non identifié dans les sources
locales de ce document, à articuler ailleurs dans le domaine DT2** ; non inventé ici (pas de type
d'outil — AUDIT-C ou autre — cité faute de source). Le seuil PNNS de population générale (« 2 verres
maximum par jour et pas tous les jours », `manger bouger reco.pdf` p.19) est un repère différent, à
portée de santé publique générale, pas le seuil d'adhérence méditerranéenne MEDAS — les deux sont
cités séparément dans P0, sans être confondus.

### Écarté du recueil — et pourquoi

| Écarté | Où c'est documenté | Pourquoi |
|---|---|---|
| Sommeil (apnée, ronflement, somnolence) | `ebmfrance` p.3 | Domaine clinique distinct (trouble du sommeil), hors axe alimentation strict. |
| Tabac | `ebmfrance` p.3 | Item terrain cardiovasculaire générique, pas un item alimentaire. |
| ~~Alcool (quantification en unités/sem)~~ — **corrigé 2026-07-26, n'est plus écarté** | `ebmfrance` p.3-4 ; `cible-mediterraneenne-medas.md` §2 item #8 | Ancienne justification (« aucune source locale ne le relie au motif méditerranéen-cible ») **fausse depuis la récupération du MEDAS** : le vin (≥7 verres/sem) en est l'item #8. Déplacé en approfondissement (A12) — **recueilli, jamais proposé en piste** (décision référent §4bis-1 point 2, cf. A12 et B3 en P2). Ligne conservée ici pour traçabilité de la correction, pas comme item toujours écarté. |
| Sel (socle) | — | Gardé en approfondissement (A2, source ebmfrance) mais écarté du **socle** : aucune des 6 familles de pistes ciblées par la recette §4 (boissons, ultratransformés, restauration rapide, matières grasses, structure des repas, portions) ne porte sur le sel. |
| Activité physique (tout `ebmfrance` §1 côté AP, `guide HAS` §3.5.1/Fiche 5, R.16/19/22/24/25/27/28) | — | Explicitement hors mission : axe traité par un autre agent en parallèle. |
| `IMC`, `anciennete_diabete_annees`, `motivation`, `capacite_activite` | `H-rhd.md` §1, §8-2, §8-4 | Déjà des critères/modulateurs **validés et existants** dans le nœud H. Cette grille ne les redemande pas ; elle remplace/affine spécifiquement le booléen unique `alimentation_equilibree` (`H-rhd.md` §1) par un recueil structuré. |
| Bilan clinique/biologique initial (poids, taille, PA, examens) | `ebmfrance` p.3 | Déjà couvert par l'anamnèse générale DT2 (IMC, DFG, etc. — autres nœuds), pas spécifique à l'axe alimentation. |
| **MEDAS** (14 items) | — | Cherché explicitement dans les 9 sources locales d'origine + tout `docs/decision/` — **absent à l'époque**. Non reconstitué de mémoire (cf. §0 et Annexe). **Depuis récupéré en source primaire** (`cible-mediterraneenne-medas.md`, 2026-07-26) et utilisé comme **cadre de définition** de S9-S12/A12/P0 — toujours pas administré comme score (cf. §0, P0, §4bis-1). |
| ONAPS (questionnaire AP cité `guide HAS` p.42) | — | Instrument d'activité physique, hors axe alimentation par construction de la mission. |
| Instrument de repérage TCA validé (SCOFF, EDE-Q, DEBQ…) | — | Cherché, absent des sources locales. Le verrou S8 s'appuie donc sur les signes d'appel HAS (encadré 11), reformulés, pas sur un score validé — annoté comme tel. |

---

## P2 — Bibliothèque de pistes

### Registre de formulation (rappel)

Modèle : `prescrire-dt2.md` P10 (fiche patient, déjà en objectifs concrets) et `ebmfrance` p.4-6
(« The goals should be the patient's own… rather small than big… concrete and observable, related to
behaviour »). Chaque piste ci-dessous est un **point de négociation en consultation**, jamais un
verdict — cf. garde-fou de non-culpabilisation détaillé en P4. Chaque piste porte : déclencheur, geste
(comportement observable), écart comblé vs cible méditerranéenne, provenance (P3), effort patient
(léger/modéré/important — **jugement de conception, non sourcé**, à valider par le référent).

### Famille — Boissons

**B1. Remplacer une boisson sucrée du quotidien par de l'eau**
- Déclencheur : S1 = « 1 à 3×/sem » ou « 4×/sem ou plus »
- Geste : « Remplacer, pour commencer un repas sur deux, une boisson sucrée par de l'eau plate ou
  pétillante (éventuellement aromatisée maison — citron, menthe). »
- Écart comblé : réduit l'apport en « fast sugars » ; rapproche du repère « eau » du motif
  méditerranéen (`prescrire-dt2.md` P10 : « huile d'olive/colza, eau »).
- Provenance : **recommandation officielle** — `ebmfrance` p.4-5 (objectif concret « Stop using soft
  drinks with sugar and energy drinks », dans une intervention globale grade A) ; `manger bouger
  reco.pdf` p.16 (PNNS, population générale : « Réduire les boissons sucrées… pas plus d'un verre par
  jour »). `SFD 2025.pdf` p.21 cité en renfort **scopé MASLD/MASH** (§8.7/Avis n°15, pas Avis n°14) —
  **corrigé 2026-07-26**, cf. Révisions et finding red-team A-1.
- Effort : léger.

**B2. Ne pas remplacer par des édulcorants intenses**
- Déclencheur : réponse indiquant un recours à des boissons/produits « light »/édulcorés (à l'occasion
  de B1 ou en approfondissement)
- Geste : « Si vous réduisez les boissons sucrées, préférer l'eau aux versions "light" (aspartame,
  acésulfame K). »
- Écart comblé : évite de substituer un risque signalé par un autre, sans reproduire l'appétence au
  goût sucré.
- Provenance : **recommandation officielle** — `prescrire-dt2.md` P10 (« Éviter de consommer
  régulièrement des édulcorants "intenses" »), cohérent avec `prescrire-dt2.md` P9 (« Édulcorants
  "intenses"… associés à un risque accru de… diabète de type 2 et à une mortalité accrue »), signal
  présenté par Prescrire **sans référence bibliographique précise** pour ce point-là — à présenter
  comme argument de prudence uniquement, sans revendiquer plus que ce que P9 revendique.
  **Corrigé 2026-07-26 (finding red-team A-3)** : la référence Salame et al. (*Lancet Diabetes
  Endocrinol* 2024;12:339-49, cohorte NutriNet-Santé) citée dans la version précédente documente en
  réalité les **émulsifiants** (polysorbate 80, CMC), un signal distinct dans la même note P9 —
  retirée d'ici, elle ne s'applique pas aux édulcorants.
- Effort : léger.

**B3. Vin/alcool — pas de piste, décision référente 2026-07-26.** Ce n'est **plus** un manque de
sourçage (l'ancien statut « À SOURCER » est retiré) : le vin est bien un item du motif méditerranéen
mesuré par le MEDAS (`cible-mediterraneenne-medas.md` §2, item #8, ≥7 verres/semaine). La consommation
est **recueillie** (A12, P1) parce qu'elle appartient au tableau clinique (interactions hépatiques,
triglycérides, hypoglycémie sous insulinosécréteur — cf. P4 §3) — mais **aucune piste ne propose
jamais d'en boire** : refus délibéré de proposer de l'alcool dans un outil de soins primaires
(`CONCEPTION-module-rhd.md` §4bis-1 point 2). Ce n'est donc pas une case vide dans cette bibliothèque
de pistes, c'est une case qui restera vide par construction.

### Famille — Ultratransformés / plats préparés

**U1. Un repas maison de plus par semaine**
- Déclencheur : S2 = « 1 à 3×/sem » ou plus
- Geste : « Remplacer un plat préparé industriel par semaine par un plat simple fait maison (même
  basique — œufs, féculent, légume). »
- Écart comblé : réduit la part d'aliments ultratransformés (NOVA) au profit d'aliments peu/pas
  transformés, dont la matrice alimentaire est mieux conservée (satiété, index glycémique plus bas).
- Provenance : **recommandation officielle** — `guide HAS…obesite.pdf` Fiche 4 p.178 / §3.5.2 p.42 ;
  `manger bouger reco.pdf` p.23-24 (PNNS, population générale : « Doucement sur les produits
  ultra-transformés »). `SFD 2025.pdf` p.21 cité en renfort **scopé MASLD/MASH** (§8.7/Avis n°15, pas
  Avis n°14) — **corrigé 2026-07-26**, cf. Révisions et finding red-team A-1. Mécanisme complémentaire
  (**savoir-faire diététique**, ne fonde pas la reco) : `rapport_gtg_glucides_sfd.pdf` p.11-12
  (« c'est donc le degré de transformation qui fait sens d'un point de vue nutritionnel » ; plus
  déstructuré = index glycémique plus élevé, moins satiétogène) ; signal de prudence épidémiologique
  `prescrire-dt2.md` P9 (émulsifiants, niveau observationnel).
- Effort : modéré.

*(Charcuterie/fromage industriels très transformés → renvoyés à la famille Matières grasses, piste
M2, pour éviter le doublon.)*

### Famille — Restauration rapide

**R1. Choisir mieux plutôt qu'interdire**
- Déclencheur : S3 = « 1 à 3×/sem » ou plus
- Geste : « Quand vous mangez en restauration rapide, préférer une formule avec crudités/salade et
  éviter de systématiquement associer boisson sucrée + dessert sucré. »
- Écart comblé : réduit la densité énergétique du repas sans viser l'éviction (cohérent avec « éviter
  les régimes… restrictifs » — `guide HAS…obesite.pdf` p.180). Rejoint « avoidance of energy-dense
  nutritional substances (e.g… hamburgers, pizzas…) » (`ebmfrance` p.5).
- Provenance : **recommandation officielle** — `ebmfrance` p.5 (tips list, guideline grade A/B,
  mention explicite hamburgers/pizzas).
- Effort : léger.

**R2. Explorer le contexte avant de juger**
- Déclencheur : S3 élevé + contexte connu (temps de trajet/travail, cf. A1/A5 approfondissement)
- Geste (côté consultation, pas un geste alimentaire) : explorer si la restauration rapide est liée à
  une contrainte de temps/travail plutôt qu'à un choix, avant de proposer une piste — orienter alors
  sur l'organisation plutôt que sur un jugement alimentaire.
- Écart comblé : évite de proposer une piste inadaptée au contexte réel du patient (HAS demande
  explicitement d'explorer « contexte et conditions… restauration rapide… temps consacré aux repas »
  avant tout conseil).
- Provenance : **savoir-faire (non EBM)** — **reclassée 2026-07-26 (finding red-team A-8)**, était
  « recommandation officielle ». `guide HAS…obesite.pdf` §3.5.2 p.42 est une liste d'**items de
  recueil** (« contexte et conditions… des prises alimentaires : maison, restaurant d'entreprise,
  restauration rapide… »), pas une recommandation d'action formulée comme « explorer avant de juger » —
  R2 est une inférence de bonne pratique de consultation, raisonnable mais non littérale dans la
  source ; elle ne doit pas porter la même étiquette que les pistes directement citées par une reco.
- Effort : variable (dépend du contexte, non chiffrable).

### Famille — Matières grasses *(levier le plus proche du bras PREDIMED, cf. recette §4)*

**M1. Huile d'olive en cuisson et assaisonnement**
- Déclencheur : S4 = « surtout beurre/graisses animales » ou « un mélange des deux »
- Geste : « Utiliser de l'huile d'olive pour la cuisson et l'assaisonnement à la place du beurre,
  chaque fois que c'est possible. »
- **Corrigé 2026-07-26 (finding red-team A-2, HAUTE)** : le colza est retiré du geste et de
  l'étiquette EBM-dur. PREDIMED randomise l'ajout d'huile d'olive vierge extra **ou** de fruits à
  coque (`H-rhd.md` §3, sous-dossier H3 : « MedDiet + huile d'olive VE *ou* noix vs conseil pauvre en
  graisses ») — **jamais le colza**. Aucune des sources à l'appui ne fait le lien EBM pour le colza :
  `guide HAS…obesite.pdf` Fiche 4 p.180 ne parle que d'huile d'olive ; `ebmfrance` dit « oil »/
  « vegetable oil » (générique) ; seul `prescrire-dt2.md` P10 mentionne « huile d'olive/colza », mais
  comme repère nutritionnel général (« semble diminuer le risque… »), pas comme bras d'essai. Le
  colza reste un choix légitime de matière grasse (recueilli par S4, encouragé par le PNNS — cf. P0,
  « aller vers l'huile de colza, de noix et d'olive », `manger bouger reco.pdf` p.16), mais **sans
  l'étiquette EBM-dur**. M1 est, avec FC1 (fruits à coque, ajoutée 2026-07-26 ci-dessous), l'une des
  **deux seules** pistes EBM-dur du module — l'enjeu de précision y est maximal.
- Écart comblé : c'est littéralement le bras testé dans PREDIMED (régime méditerranéen **supplémenté
  en huile d'olive vierge extra**) — le levier le plus directement adossé au bénéfice CV dur du motif
  méditerranéen.
- Provenance : **bénéfice EBM sur critère dur** — PREDIMED, bras huile d'olive : HR 0,69 (IC
  0,53-0,91) sur le composite CV dur (`H-rhd.md` §3, sous-dossier H3). **Précision ajoutée 2026-07-26
  (finding red-team A-5, MOYENNE)** : cet essai a été **publié en 2013 (PMID 23432189), rétracté**
  pour irrégularités de randomisation sur certains centres, puis **republié après correction
  méthodologique en 2018** (PMID 29897866, *NEJM* 2018;378:e34 ; avis de rétractation/republication
  29897867) — `H-rhd.md` §3 qualifie le niveau de preuve « DUR — modéré (rétract./republ., ouvert) »,
  pas « DUR » sans réserve ; cette nuance doit rester visible partout où le chiffre HR 0,69 est cité.
  **Nuance à afficher, renforcée 2026-07-26** : PREDIMED randomise l'ajout d'huile d'olive/noix dans le
  cadre d'un **motif alimentaire méditerranéen entier supplémenté**, pas un geste isolé de changement
  d'huile — attribuer l'effet à l'huile seule, sortie du reste du motif, est déjà une extrapolation, et
  la question de savoir si l'étiquette EBM-dur devrait plutôt être portée par le cap du module que par
  cette seule piste est **ouverte, non tranchée ici** (`CONCEPTION-module-rhd.md` §3, « à trancher avec
  le référent avant l'écriture du contenu » — document non modifié). Confirmé par `guide
  HAS…obesite.pdf` Fiche 4 p.180 et `prescrire-dt2.md` P10.
- Effort : léger à modéré.

### Famille — Fruits à coque *(second bras réellement randomisé de PREDIMED — ajouté 2026-07-26, décision référent §4bis-1 rang 1)*

**FC1. Ajouter une petite poignée de fruits à coque non salés**
- Déclencheur : S9 = « Jamais » ou « Occasionnellement »
- Geste : « Ajouter une petite poignée de fruits à coque non salés (noix, noisettes, amandes) plusieurs
  fois par semaine — en encas, au petit-déjeuner, ou dans un plat. »
- Écart comblé : se rapproche du **second** bras réellement randomisé de PREDIMED (l'axe totalement
  absent du recueil avant l'ajout de S9) — jusqu'ici, seul le bras huile d'olive (M1) était représenté
  dans la bibliothèque de pistes, alors que PREDIMED en teste deux.
- Provenance : **bénéfice EBM sur critère dur** — PREDIMED, bras fruits à coque : HR 0,72 (IC
  0,54-0,95) sur le même composite CV dur (`H-rhd.md` §3, sous-dossier H3), **même réserve que M1** :
  essai rétracté/republié 2018 (cf. M1), et même question ouverte sur le niveau — geste isolé vs motif
  entier supplémenté — non tranchée ici. Renforcé par une **recommandation officielle** convergente,
  population générale : `manger bouger reco.pdf` p.19 (PNNS : « il est recommandé de consommer une
  petite poignée par jour de fruits à coque non salés… car ils apportent de bonnes graisses »).
  **Quantité de l'essai (30 g/j : 15 g noix + 7,5 g amandes + 7,5 g noisettes, `cible-mediterraneenne-medas.md`
  §3) volontairement absente du geste** — elle vit dans cet argumentaire, pas dans la piste (règle
  référent §4bis-0).
- Effort : léger.

**M2. Diviser par deux le fromage et la charcuterie**
- Déclencheur : S4 = « surtout beurre/graisses animales » ou approfondissement A1/A2 signalant une
  consommation quotidienne de charcuterie/fromage, **ou S12 = « Régulièrement »/« Quotidien »** (ajout
  2026-07-26, socle hybride §4bis-1 rang 3 — S12 couvre aussi la viande rouge non transformée, que M2
  ne visait pas jusqu'ici en tant que déclencheur explicite)
- Geste : « Diviser par deux, en quantité, la portion habituelle de fromage et de charcuterie — et,
  plus largement, préférer la volaille à la viande rouge quand c'est possible. »
- Écart comblé : réduit les graisses saturées et la viande transformée, dans le sens du motif
  méditerranéen (« peu de viande rouge/charcuterie » — `prescrire-dt2.md` P10) et de l'« avoidance of
  saturated fat » (`ebmfrance` p.4). Rejoint aussi MEDAS #5 (<1 portion viande rouge/j) et #13
  (préférence volaille), cadre de définition seulement — pas de seuil administré.
- Provenance : **recommandation officielle** — `ebmfrance` p.5 (objectif concret « Halve the use of
  cheese and sausages ») ; renforcé par `prescrire-dt2.md` P10 et `manger bouger reco.pdf` p.15/p.24
  (PNNS, repères population générale : viande hors volaille ≤500 g/sem, charcuterie ≤150 g/sem — cités
  en argumentaire, pas comme cible affichée). **Pas** un composant isolément randomisé dans
  PREDIMED/CORDIOPREV → étiquette « officielle », pas « EBM-dur », à la différence de M1/FC1.
- Effort : modéré.
- ⚠ **Gate P4** : quantification explicite d'une portion → bloquer si repérage TCA/restriction
  cognitive positif (S8), cf. P4.

**M3. Passer aux produits laitiers allégés**
- Déclencheur : approfondissement (consommation de laitages entiers)
- Geste : « Remplacer les produits laitiers entiers par des versions allégées/0 %. »
- Écart comblé : réduit les graisses saturées.
- Provenance : **recommandation officielle** — `ebmfrance` p.5 (« Change dairy products… to fat-free
  versions »).
- Effort : léger.

### Famille — Légumineuses & poisson *(composantes du motif, non randomisées isolément — ajouté 2026-07-26, décision référent §4bis-1 rang 3)*

**L1. Un plat de légumineuses de plus par semaine**
- Déclencheur : S10 = « Jamais » ou « Occasionnellement »
- Geste : « Ajouter un plat à base de légumineuses (lentilles, pois chiches, haricots) une fois de plus
  par semaine — même en accompagnement, même à partir de conserves ou surgelés. »
- Écart comblé : rejoint une composante du motif méditerranéen mesurée par MEDAS #9 (≥3 portions/sem,
  cadre de définition, pas un seuil administré) — non randomisée isolément dans PREDIMED, contrairement
  à l'huile d'olive (M1) et aux fruits à coque (FC1).
- Provenance : **recommandation officielle** — `manger bouger reco.pdf` p.13 (PNNS : « il est
  recommandé de consommer au moins 2 fois par semaine des légumes secs car ils sont naturellement
  riches en fibres et contiennent des protéines végétales »).
- Effort : léger.

**PO1. Un poisson de plus par semaine, en alternant gras et maigre**
- Déclencheur : S11 = « Jamais » ou « Occasionnellement »
- Geste : « Prévoir un repas de poisson de plus par semaine — frais, surgelé ou en conserve (maquereau,
  sardine, thon au naturel) — en essayant d'alterner un poisson gras (sardine, maquereau, hareng,
  saumon) et un poisson maigre. »
- Écart comblé : rejoint MEDAS #10 (≥3 portions/sem, cadre de définition) — composante du motif, non
  randomisée isolément.
- Provenance : **recommandation officielle** — `manger bouger reco.pdf` p.8, p.15 (PNNS : « Consommez
  du poisson 2 fois par semaine, dont 1 poisson gras… car les poissons gras sont riches en oméga 3 » ;
  « il est recommandé de varier les espèces » en raison des polluants).
- Effort : léger à modéré (accès/coût variable, cf. S7).

### Famille — Structure des repas

**T1. Fixer des repas à heures régulières**
- Déclencheur : S5 = « variables/irréguliers »
- Geste : « Se fixer 3 repas par jour à des horaires à peu près stables, à négocier ensemble selon vos
  contraintes. »
- Écart comblé : prévient le grignotage compensatoire et les prises alimentaires non planifiées liées
  à la faim (« hunger will easily lead to extra snacks » — `ebmfrance` p.6).
- Provenance : **recommandation officielle** — `ebmfrance` p.6 (« Fixed meal times in order to support
  weight control »). **Corrigé 2026-07-26 (finding red-team A-4, HAUTE)** : la mention de grade
  « guideline A/B » est retirée — vérifié à l'extraction texte (deux passages, mode normal et mode
  layout, concordants) qu'**aucune lettre de grade n'accompagne cette sous-section** dans la source,
  contrairement à des sous-sections voisines qui, elles, affichent explicitement leur grade (« Tips for
  implementing a recommended diet A B », « Increasing physical activity A A A »). Le « A/B »
  précédemment cité semble recopié de la sous-section sur le choix des aliments, pas de « Fixed meal
  times » elle-même. Traité désormais comme T2/T3 : repère pratique issu d'un guide EBM, non gradé
  formellement pour ce point précis.
- Effort : modéré.
- Note : en cas de TCA avéré (pas seulement un signe isolé), structurer les repas reste une mesure
  positive — HAS la cite même comme mesure d'accompagnement en centre spécialisé (« contrôler les
  accès à la nourriture et stabiliser le comportement alimentaire en instaurant un rythme, un cadre
  alimentaire », `guide HAS…obesite.pdf` p.40) — donc **non bloquée** par le gate P4, mais à articuler
  avec l'orientation spécialisée plutôt qu'à proposer seule (cf. P4).

**T2. Manger sans se presser**
- Déclencheur : approfondissement A1/A11 (repas rapides, tachyphagie)
- Geste : « Essayer de manger plus lentement (viser au moins 20 minutes), sans écran, pour mieux
  percevoir la satiété. »
- Écart comblé : aide à la reconnaissance des signaux de satiété.
- Provenance : **recommandation officielle** — `ebmfrance` p.6 (« Unhurried eating pace helps in
  recognizing the feeling of fullness ») ; `guide HAS…obesite.pdf` Fiche 4 p.180 (« manger lentement,
  20 minutes au minimum »).
- Effort : léger.
- ⚠ Attention de formulation : la tachyphagie est aussi listée par la HAS comme signe d'appel de TCA
  (encadré 11, p.43). Si S8 signale par ailleurs une restriction/désinhibition, ne pas isoler ce
  conseil — l'articuler à l'orientation (cf. P4), pas le retirer (source HAS elle-même : la lenteur du
  repas reste pertinente).

**T3. Repas-type illustré comme repère**
- Déclencheur : approfondissement A10 (faible littéralité déclarée sur l'équilibre alimentaire)
- Geste (côté outil, pas patient) : proposer/fournir un repas-type ou une photo de repas recommandé
  comme repère visuel.
- Écart comblé : rend concret l'équilibre alimentaire visé.
- Provenance : **recommandation officielle** — `ebmfrance` p.6 (« Provide a sample meal or a picture
  of a recommended meal »). Le support concret (photo/repas-type) lui-même **n'existe pas encore**
  dans le dépôt — à produire (cf. recette §5, « supports patient »).
- Effort : léger côté patient / à construire côté outil.

**T4. Réduire le grignotage**
- Déclencheur : S6 = « 1 à 3×/sem » ou « quotidien »
- Geste : « Repérer un moment de grignotage récurrent (ex. fin d'après-midi) et proposer une
  alternative (fruit, eau, activité) ou un repas structuré à cette heure-là. »
- Écart comblé : rejoint la structuration des repas visée par le motif méditerranéen (repas réguliers
  plutôt que prises dispersées).
- Provenance : **recommandation officielle** — `guide HAS…obesite.pdf` §3.5.2 p.42 ; `ebmfrance` p.3.
- Effort : modéré.
- ⚠ **Gate P4** : geste de réduction explicite → bloquer/reformuler en orientation si repérage TCA
  positif (le grignotage peut être le seul espace de spontanéité alimentaire d'un patient déjà très
  contrôlant ; le réduire davantage aggrave la restriction, cf. P4).

### Famille — Portions

**P1'. Peser deux ou trois fois pour construire l'œil**
- Déclencheur : approfondissement A4 = « difficile » ou « je ne sais pas »
- Geste : « Peser deux ou trois fois les féculents les plus consommés, pour apprendre ensuite à
  reconnaître la bonne quantité à l'œil. »
- Écart comblé : corrige l'erreur la plus fréquente selon la SFD — pas les grammes de glucides, mais
  l'estimation des quantités.
- Provenance : **savoir-faire diététique (non EBM)** — `rapport_gtg_glucides_sfd.pdf` p.14 (« l'erreur
  vient bien plus souvent d'une mauvaise appréciation des quantités d'aliments consommées… que des
  grammes de glucides comptés en plus ou oubliés » ; « développer la "balance des yeux" »).
  **⚠ Tension de source signalée 2026-07-26 (finding red-team A-7, MOYENNE)** : la même page (p.8),
  juste avant l'extrait cité, précise que « ce degré de précision dans la quantification des glucides
  n'est pas requis pour les patients diabétiques de type 2 » et que la pesée « il semble pertinent de
  peser au moins deux ou trois fois… » est introduite dans un paragraphe scopé à l'**insulinothérapie
  fonctionnelle** (et aux « assistants bolus des pompes ou des lecteurs ») — alors que la conclusion
  générale p.14 (citée ci-dessus) réemploie la formule plus largement pour « l'éducation nutritionnelle
  dispensée aux patients diabétiques ». La source elle-même est donc en tension entre un scope étroit
  (p.8) et une généralisation (p.14) — **non tranché ici** : à soumettre au référent pour décider si
  P1'/P2' doivent être réservées aux patients sous schéma insulinique nécessitant un comptage précis,
  ou confirmées comme générales.
- Effort : modéré (nécessite une balance, quelques essais).
- ⚠ **Gate P4 — BLOQUER si repérage TCA positif** : la pesée alimentaire est un comportement
  classiquement à risque de renforcement du contrôle chez un patient en restriction cognitive.

**P2'. Repères visuels de portion (vaisselle)**
- Déclencheur : approfondissement A4
- Geste : « Utiliser des repères sur votre vaisselle habituelle (une fraction d'assiette, un bol, une
  cuillère) plutôt que de peser systématiquement. »
- Écart comblé : rend l'estimation des portions praticable au quotidien sans matériel spécialisé.
- Provenance : **savoir-faire diététique (non EBM)** — `rapport_gtg_glucides_sfd.pdf` p.9 (« l'utilisation
  de repères visuels gravés sur les ustensiles de cuisine, de vaisselle (bol, cuillère, fraction
  d'assiette…) peut être judicieuse »). **Même tension de source que P1'** (p.8 vs p.14, cf. ci-dessus)
  — signalée 2026-07-26, non tranchée.
- Effort : léger.
- ⚠ **Gate P4 — BLOQUER si repérage TCA positif** (même registre de quantification que P1').

**P3'. Adapter la taille du repas au poids**
- Déclencheur : approfondissement A4, ou suivi de poids en cours
- Geste : suivre les changements de poids comme indicateur indirect que la taille des repas est
  adaptée, plutôt que d'imposer une portion fixe a priori.
- Écart comblé : individualise la taille de repas sans grille chiffrée rigide.
- Provenance : **recommandation officielle** — `ebmfrance` p.6 (« Appropriate meal size in proportion
  to the patient's weight… weight changes indicate whether meal sizes are correct »).
- Effort : léger.
- ⚠ **Gate P4 — BLOQUER si repérage TCA positif** (même registre — la surveillance du poids comme
  levier de contrôle des apports peut aggraver une restriction cognitive déjà présente).

### Famille transverse — Orientation / ressource locale

**O1. Orienter vers le diététicien de la structure**
- Déclencheur : S7 = « difficultés importantes » (accès alimentation/matériel), OU besoins complexes
  détectés en approfondissement (régimes d'exclusion multiples, TCA suspecté, échecs répétés des
  pistes proposées)
- Geste : proposer un bilan diététique personnalisé plutôt qu'une piste alimentaire isolée.
- Écart comblé : passe le relais quand le levier dépasse ce qu'une consultation MG peut négocier
  seule.
- Provenance : **ressource locale** — recoupe le projet `annuaire-msp` (mémoire projet — pas encore en
  prod) ; `guide HAS…obesite.pdf` Fiche 4 p.178 (situations qui appellent l'expertise d'un
  diététicien : « besoin d'une évaluation plus fine des habitudes de vie », « difficultés à créer un
  environnement favorable aux changements »).
- Effort : faible pour le patient (prendre le RDV) — dépend de la disponibilité réelle de la ressource.

---

## P3 — Provenance

Quatre étiquettes possibles, définies par la recette (§5) : *bénéfice EBM sur critère dur* /
*recommandation officielle* / *savoir-faire diététique (non EBM)* / *ressource locale*. Logique de
classement retenue, explicitée pour rester **stricte** sur la première étiquette : elle n'est
attribuée qu'aux gestes qui sont la **traduction directe d'un composant randomisé** de PREDIMED —
**mise à jour 2026-07-26** : huile d'olive **ou** fruits à coque (jamais le colza, cf. finding A-2) —
pas au motif méditerranéen entier décomposé par extrapolation, réserve qui reste ouverte pour ces deux
pistes elles-mêmes (cf. M1, FC1).

**Table mise à jour 2026-07-26** : 3 pistes ajoutées (FC1, L1, PO1), 1 retirée de la bibliothèque
(B3 — n'était pas une piste « à sourcer » mais un refus délibéré, cf. Boissons ci-dessus), 1
reclassée (R2 : recommandation officielle → savoir-faire).

| Piste | Famille | Étiquette |
|---|---|---|
| M1 — Huile d'olive en cuisson | Matières grasses | **Bénéfice EBM sur critère dur** |
| FC1 — Fruits à coque | Fruits à coque | **Bénéfice EBM sur critère dur** *(nouveau 2026-07-26)* |
| B1 — Remplacer boisson sucrée par eau | Boissons | Recommandation officielle |
| B2 — Pas d'édulcorants intenses | Boissons | Recommandation officielle |
| U1 — Un repas maison de plus/sem | Ultratransformés | Recommandation officielle |
| R1 — Choisir mieux en restauration rapide | Restauration rapide | Recommandation officielle |
| R2 — Explorer le contexte | Restauration rapide | Savoir-faire (non EBM) *(reclassé 2026-07-26)* |
| M2 — Diviser par deux fromage/charcuterie | Matières grasses | Recommandation officielle |
| M3 — Laitages allégés | Matières grasses | Recommandation officielle |
| L1 — Légumineuses, un plat de plus/sem | Légumineuses & poisson | Recommandation officielle *(nouveau 2026-07-26)* |
| PO1 — Poisson, un repas de plus/sem | Légumineuses & poisson | Recommandation officielle *(nouveau 2026-07-26)* |
| T1 — Repas à heures régulières | Structure | Recommandation officielle |
| T2 — Manger sans se presser | Structure | Recommandation officielle |
| T3 — Repas-type illustré | Structure | Recommandation officielle |
| T4 — Réduire le grignotage | Structure | Recommandation officielle |
| P1' — Peser 2-3 fois | Portions | Savoir-faire diététique (non EBM) |
| P2' — Repères visuels vaisselle | Portions | Savoir-faire diététique (non EBM) |
| P3' — Taille du repas / poids | Portions | Recommandation officielle |
| O1 — Orientation diététicien | Transverse | Ressource locale |

*(B3 — vin/alcool : plus de ligne ici, cf. note dans la famille Boissons ; ce n'est plus « à sourcer »
mais un refus délibéré, documenté, pas une piste manquante.)*

**Total pistes formées : 19** (0 « À SOURCER » — B3 n'en est plus une, cf. supra).

- Bénéfice EBM sur critère dur : **2** (M1, FC1)
- Recommandation officielle : **13** (B1, B2, U1, R1, M2, M3, L1, PO1, T1, T2, T3, T4, P3')
- Savoir-faire diététique (non EBM) : **3** (R2, P1', P2')
- Ressource locale : **1** (O1)
- À SOURCER : **0**

Ce ratio (2 EBM-dur pour 13 « officielles ») matérialise le constat central du dossier de preuve
`H-rhd.md` §3 (H3) : **le bénéfice CV dur ne se trouve que dans le régime méditerranéen dans son
ensemble** (2 ECR : PREDIMED, CORDIOPREV), et parmi ses composants, **deux** sont réellement
randomisés dans PREDIMED — huile d'olive (M1) et fruits à coque (FC1), corrigé/complété le 2026-07-26.
Tout le reste — utile, sourcé, mais de niveau de preuve inférieur — ne doit pas être présenté au
praticien avec la même force que ces deux composants-là. **Réserve inchangée pour M1 et FC1** : les
deux portent la même mise en garde de sur-attribution (bras testé = motif entier supplémenté, pas le
geste isolé) et la même mention de rétractation/republication 2018 — cf. M1, FC1 en P2.

---

## P4 — Garde-fous

### 1. TCA et restriction cognitive — gating dur (le seul endroit où il est justifié)

**Règle** : si au moins une case de S8 est cochée, **bloquer toute piste qui vise explicitement une
réduction de quantité ou une quantification/pesée des portions** — proposer plus de contrôle
volontaire des apports à un patient qui en pratique déjà un est contre-indiqué (`guide
HAS…obesite.pdf` encadré 11, p.43 : la restriction cognitive s'entend comme « réduire volontairement
la quantité de nourriture ingérée », avec un risque d'« alternance avec des épisodes de
désinhibition »).

| Piste | Effet du gate S8 positif |
|---|---|
| M2 (diviser par deux fromage/charcuterie) | **Bloquée** |
| T4 (réduire le grignotage) | **Bloquée / reformulée en orientation** |
| P1' (peser 2-3 fois) | **Bloquée** |
| P2' (repères visuels de portion) | **Bloquée** |
| P3' (taille du repas / poids) | **Bloquée** |
| T1 (repas réguliers), T2 (manger lentement) | **Non bloquées** — la HAS les cite elle-même comme
mesures d'accompagnement TCA en structure spécialisée (« instaurer un rythme, un cadre alimentaire »,
p.40) — mais à articuler avec l'orientation ci-dessous, pas à proposer isolément par le MG seul. |
| B1, B2, U1, R1, R2, M1, M3, T3 (substitutions qualitatives, pas de quantification) | Non bloquées |
| **FC1, L1, PO1 (ajout 2026-07-26)** — gestes d'ajout (fruits à coque, légumineuses, poisson), pas de réduction ni de quantification | **Non bloquées** — même registre que B1/M1 : on ajoute, on ne restreint ni ne pèse rien |
| O1 (orientation diététicien) | **Renforcée / prioritaire** |

**Orientation systématique** (au-delà du blocage de pistes) : `guide HAS…obesite.pdf` p.44 — « pour
les perturbations de l'alimentation : un accompagnement psychologique en plus d'une approche
nutritionnelle… » ; « pour les TCA : les soins proposés doivent inclure une prise en charge des TCA…
des approches psychothérapiques adaptées ». Le rôle du MG s'arrête au repérage (S8) et à
l'orientation — pas au diagnostic ni au traitement du TCA (cohérent avec le recadrage « outil d'aide à
la recommandation », `H-rhd.md` §0).

**Limite assumée** : S8 est un repérage minimal (3 signes d'appel HAS reformulés), pas un diagnostic.
Un résultat négatif ne garantit pas l'absence de TCA ; un résultat positif ne le confirme pas non plus
— il ouvre une orientation, pas un verdict.

### 2. Dénutrition / sarcopénie (HAS R.37)

**Source du seuil réglementaire** : `strategie_therapeutique…pdf` R.37, p.15, grade AE : « Il est
recommandé de toujours prendre en compte le rapport bénéfices/risques lors de la prescription d'une
restriction calorique. Les régimes de restriction quantitative ou qualitative sont **fortement
déconseillés** chez les personnes à risque de dénutrition et de sarcopénie, en particulier chez les
personnes âgées en situation de fragilité. »

**Point clinique complémentaire, souvent oublié** : `guide HAS…obesite.pdf` §3.4, p.40 — « **Un IMC ≥
30 kg/m² n'exclut pas une dénutrition.** Une personne en surpoids ou en obésité **de tout âge** peut
être dénutrie selon les critères de la Haute Autorité de Santé. » Autrement dit, le filtre ne peut pas
être « IMC bas » : un patient obèse peut être la cible exacte de ce garde-fou. Les critères précis de
dénutrition HAS (seuils chiffrés) **ne sont pas détaillés dans les pages lues ici** — **À SOURCER**
séparément si un seuil numérique est voulu ; à ce stade, seul le principe qualitatif est disponible.

**Application proposée** : réutiliser les variables **déjà existantes et partagées** dans le domaine
DT2 plutôt que d'en recréer — `fragilite` (bool), `esperance_vie` (enum), `age` (nombre) sont déjà des
critères d'autres nœuds (`H-rhd.md` §1 les cite comme « candidat alerte » pour H lui-même). Règle :
si `fragilite == true` (ou situation de fragilité déclarée par ailleurs), **bloquer** les pistes de
réduction/quantification identiques à celles bloquées pour TCA (M2, T4, P1', P2', P3') et reformuler
en « maintien, pas de restriction sans avis diététicien » ; orienter vers le diététicien de la
structure (O1) plutôt que de laisser une piste de réduction s'afficher seule.

### 3. Hypoglycémie sous insuline / sulfamide / glinide

**Ce garde-fou existe déjà pour le nœud H** — `H-rhd.md` §8-5 (tranché 2026-07-24) : alerte conservée,
renvoi vers les nœuds C/D/E pour l'allègement du traitement en cas de perte de poids rapide. Le
mécanisme de collecte (`traitements_en_cours`) existe déjà ailleurs dans le domaine DT2 et n'est pas
recréé ici.

**Application aux pistes de cette grille** : toute piste qui réduit l'apport en sucres/glucides
rapides ou l'apport calorique global (B1, B2, U1, T4, et — dans une moindre mesure — R1) doit, chez un
patient dont `traitements_en_cours` contient insuline, sulfamide ou glinide, être **accompagnée d'un
rappel** (pas un blocage — cf. distinction déjà actée dans `H-rhd.md` §8-5, où c'est une alerte, pas
une exclusion) : signaler le risque d'hypoglycémie si les apports baissent, et renvoyer vers les nœuds
concernés pour envisager un allègement du traitement en parallèle.

### 4. Ce qui reste hors de portée de ce document

- **Validation clinique référent** : l'ensemble P1-P4 est une proposition de conception, pas un
  contenu validé (CLAUDE.md invariants 4 et 6). Aucune piste n'est encodable telle quelle sans passage
  par le référent.
- **Articulation avec les arbitrages `H-rhd.md` §8 déjà tranchés** : ce document ne redécide pas la
  place de la rémission, de la chirurgie, ni le statut modulateur (non gating) de `motivation` —
  il ajoute une couche de recueil/pistes en amont, cohérente avec ces arbitrages, mais leur
  intégration technique (comment le socle S1-S8 cohabite avec `IMC`, `motivation`,
  `capacite_activite` dans un même nœud multi-options) reste à concevoir.
- **Volume de contenu, mis à jour 2026-07-26** : **19 pistes formées** (3 de plus depuis la version
  précédente : FC1, L1, PO1 ; 1 de moins : B3 n'est plus une piste candidate), **12 items socle**
  (8 + S9-S12) et **12 items approfondissement** (11 + A12), sur l'axe alimentation seul. Le socle
  hybride §4bis-1
  tend encore davantage la contrainte « ~2-3 minutes de recueil oral » posée en tête de ce document —
  point ouvert signalé en P1, non tranché ici. La recette (§6) recommandait un périmètre pilote
  restreint — à arbitrer avec le référent avant tout encodage (par exemple : démarrer avec le socle +
  les familles Boissons, Matières grasses et Fruits à coque, qui portent désormais les deux pistes
  EBM-dur du module).
- **Traditions culinaires** (§5-2 de la recette, cas d'école du « savoir-faire diététique non EBM »)
  : aucune donnée de substitution par tradition culinaire n'a été trouvée dans le dépôt — la question
  A5 collecte l'information, mais **aucune bibliothèque de pistes par tradition n'est proposée ici**,
  faute de source (nécessite un apport du diététicien de la MSP, cf. `H-rhd.md` §8 / recette §8-Q2).

---

## Annexe — traçabilité des recherches négatives

Recherches effectuées sur l'ensemble des PDF de `docs/decision/sources/` (extraction texte complète
via `pdftotext`) et sur tout `docs/decision/*.md`, pour éviter de reconstituer quoi que ce soit de
mémoire :

- **MEDAS** / « Mediterranean Diet Adherence Screener » / « 14-item » : **0 occurrence** dans les 9
  PDF sources d'origine ni dans les fichiers markdown de `docs/decision/` à l'époque de la première
  version de ce document (hors la mention du candidat non vérifié dans la recette elle-même). **Depuis
  récupéré en source primaire** (`cible-mediterraneenne-medas.md`, 2026-07-26, hors mission de ce
  document) et utilisé ici comme cadre de définition (P0, S9-S12, A12) — cf. Révisions.
- **SCOFF** / « EDE-Q » / « DEBQ » / instrument de repérage TCA nommé : **0 occurrence**.
- Confirmé présent en revanche : **ONAPS** (`guide HAS…obesite.pdf` p.42, URL donnée) — instrument
  d'activité physique, hors axe alimentation, non traité ici.
- **Recherche exhaustive « ultra-transformé » / « boissons sucrées »** dans `SFD 2025.pdf` (2026-07-26,
  finding red-team A-1) : **2 occurrences au total sur 32 pages**, toutes deux dans le même passage
  p.21 (§8.7/Avis n°15, MASLD/MASH) — confirme l'absence d'une reco SFD générale DT2 sur ces deux
  sujets, en dehors de cette sous-population.
- **PNNS/Santé publique France** (`manger bouger reco.pdf`) : ajouté 2026-07-26 comme nouvelle source
  (mission), lu intégralement (32 p.) ; page officielle correspondante récupérée par URL (cf.
  Révisions) — contenu HTML sans le détail chiffré, les repères exploités viennent du PDF.
