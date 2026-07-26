# MEDAS (Mediterranean Diet Adherence Screener) — récupération en source primaire (2026-07-26)

Mission ciblée, distincte de la conception du recueil (`rhd-collecte-alimentation.md`) : récupérer
l'instrument qui opérationnalise la cible EBM du module RHD (motif alimentaire méditerranéen, seul
motif à bénéfice CV dur documenté — PREDIMED). `rhd-collecte-alimentation.md` §0 et Annexe avaient déjà
établi que le MEDAS est **absent des 9 PDF sources locales et de tout `docs/decision/`** et l'avaient
donc écarté du recueil, en le signalant comme manque à combler par une recherche en source primaire —
c'est cette recherche qui est faite ici.

**Méthode et garde-fou anti-fabrication** : chaque item ci-dessous est soit une citation directe d'une
page effectivement récupérée (URL + extrait verbatim entre guillemets), soit explicitement marqué
**« NON VÉRIFIÉ »**. Rien n'est reconstitué de mémoire. Ce document ne traite pas des populations
d'inclusion PREDIMED/CORDIOPREV ni de l'unité de randomisation (traité par un autre agent en
parallèle).

---

## 1. La publication de validation du MEDAS

**Référence complète** (page PubMed effectivement ouverte : <https://pubmed.ncbi.nlm.nih.gov/21508208/>) :

> Schröder H, Fitó M, Estruch R, Martínez-González MA, Corella D, Salas-Salvadó J, Lamuela-Raventós R,
> Ros E, Salaverría I, Fiol M, Lapetra J, Vinyoles E, Gómez-Gracia E, Lahoz C, Serra-Majem L, Pintó X,
> Ruiz-Gutierrez V, Covas MI. **« A short screener is valid for assessing Mediterranean diet adherence
> among older Spanish men and women. »** *The Journal of Nutrition*, 2011;141(6):1140–1145.
> DOI: 10.3945/jn.110.135566. PMID: 21508208.

Abstract, cité verbatim depuis la fiche PubMed :

> « The present study assessed the relative and construct validity of the 14-point Mediterranean Diet
> Adherence Screener (MEDAS) used in the Prevención con Dieta Mediterránea (PREDIMED) study, a primary
> prevention nutrition-intervention trial. A validated FFQ and the MEDAS were administered to 7146
> participants of the PREDIMED study. […] The MEDAS is a valid instrument for rapid estimation of
> adherence to the Mediterranean diet and may be useful in clinical practice. »

**Limite transparente sur l'accès** : le texte intégral de cet article (J Nutr, Oxford
Academic/ScienceDirect) a été systématiquement bloqué (HTTP 403) sur les trois miroirs testés
(`academic.oup.com/jn`, `jn.nutrition.org`, ResearchGate). Il n'a donc **pas été possible de vérifier
directement, sur cet article, le libellé exact du Tableau 1**. Les 14 items rapportés en §2 proviennent
d'une source secondaire directement affiliée et en accès libre confirmé (voir §2), qui présente
explicitement le même instrument et cite Schröder 2011 comme sa validation — la référence bibliographique
elle-même (titre/auteurs/DOI/abstract ci-dessus) est en revanche vérifiée de première main.

---

## 2. Les 14 items du MEDAS — verbatim et seuils

**Source effectivement récupérée** (texte intégral en accès libre, format HTML avec tableau textuel,
pas une image) :

> Martínez-González MA, García-Arellano A, Toledo E, et al. **« A 14-Item Mediterranean Diet Assessment
> Tool and Obesity Indexes among High-Risk Subjects: The PREDIMED Trial. »** *PLoS ONE*. 2012;7(8):e43134.
> DOI: 10.1371/journal.pone.0043134. URL récupérée : <https://pmc.ncbi.nlm.nih.gov/articles/PMC3419206/>
> (miroir PMC de l'article original PLOS ONE).

Cet article présente son Tableau 1 sous le titre exact : **« Validated 14-item Questionnaire of
Mediterranean diet adherence »** (titre vérifié sur la version journals.plos.org — cette version-là rend
le tableau en image, sans texte alternatif ; le texte a donc été extrait via le miroir PMC, qui le rend
en HTML textuel). Le tableau est explicitement présenté comme l'instrument validé par Schröder et al.
2011, utilisé pour le suivi et le feedback des participants PREDIMED.

**⚠ Nuance sur le statut « verbatim »** : ce tableau est celui reproduit dans l'article PREDIMED de 2012
(co-auteurs communs avec Schröder 2011, dont Martínez-González et Estruch), **pas** une extraction du
texte de Schröder 2011 lui-même (bloqué, cf. §1). C'est la reproduction la plus fiable et la plus citée
de l'instrument dans la littérature ouverte, mais un contrôle croisé direct avec le texte original 2011
reste à faire si une exactitude absolue au mot près est requise avant encodage clinique.

| # | Question (verbatim) | Critère pour 1 point (verbatim) |
|---|---|---|
| 1 | « Do you use olive oil as main culinary fat? » | « Yes » |
| 2 | « How much olive oil do you consume in a given day (including oil used for frying, salads, out-of-house meals, etc.)? » | « ≥4 tbsp » |
| 3 | « How many vegetable servings do you consume per day? (1 serving : 200 g [consider side dishes as half a serving]) » | « ≥2 (≥1 portion raw or as a salad) » |
| 4 | « How many fruit units (including natural fruit juices) do you consume per day? » | « ≥3 » |
| 5 | « How many servings of red meat, hamburger, or meat products (ham, sausage, etc.) do you consume per day? (1 serving: 100–150 g) » | « <1 » |
| 6 | « How many servings of butter, margarine, or cream do you consume per day? (1 serving: 12 g) » | « <1 » |
| 7 | « How many sweet or carbonated beverages do you drink per day? » | « <1 » |
| 8 | « How much wine do you drink per week? » | « ≥7 glasses » |
| 9 | « How many servings of legumes do you consume per week? (1 serving : 150 g) » | « ≥3 » |
| 10 | « How many servings of fish or shellfish do you consume per week? (1 serving 100–150 g of fish or 4–5 units or 200 g of shellfish) » | « ≥3 » |
| 11 | « How many times per week do you consume commercial sweets or pastries (not homemade), such as cakes, cookies, biscuits, or custard? » | « <3 » |
| 12 | « How many servings of nuts (including peanuts) do you consume per week? (1 serving 30 g) » | « ≥3 » |
| 13 | « Do you preferentially consume chicken, turkey, or rabbit meat instead of veal, pork, hamburger, or sausage? » | « Yes » |
| 14 | « How many times per week do you consume vegetables, pasta, rice, or other dishes seasoned with sofrito (sauce made with tomato and onion, leek, or garlic and simmered with olive oil)? » | « ≥2 » |

**Bilan de récupération : 14/14 items retrouvés et sourcés** — 0 item reconstitué de mémoire, 0 item
manquant. Le score total va de 0 à 14 ; les publications qui l'utilisent en clinique citent généralement
un seuil d'adhésion « haute » à **≥9** (mentionné dans plusieurs sources secondaires convergentes, mais
**ce seuil n'a pas été confirmé verbatim sur une source primaire ouverte** dans cette recherche — à
vérifier avant tout usage d'un seuil de décision clinique).

---

## 3. Le régime d'intervention effectivement testé dans PREDIMED

Le MEDAS est l'outil de *mesure* de l'adhérence ; ce qui suit est la description du régime **prescrit**
aux bras méditerranéens de l'essai — la formulation la plus proche de « ce qui a été testé ».

**Sources effectivement récupérées** (texte intégral en accès libre) :

> Ros E, Martínez-González MA, Estruch R, Salas-Salvadó J, Fitó M, Martínez JA, Corella D.
> **« Mediterranean Diet and Cardiovascular Health: Teachings of the PREDIMED Study. »**
> *Advances in Nutrition*. 2014;5(3):330S–336S. DOI: 10.3945/an.113.005389. Open access (© 2014 American
> Society for Nutrition). URL récupérée : <https://pmc.ncbi.nlm.nih.gov/articles/PMC4013190/>

> Kargin D, Tomaino L, Serra-Majem L. **« Experimental Outcomes of the Mediterranean Diet: Lessons
> Learned from the PREDIMED Randomized Controlled Trial. »** *Nutrients*. 2019;11(12):2991.
> DOI: 10.3390/nu11122991. Open access (MDPI). URL récupérée : <https://pmc.ncbi.nlm.nih.gov/articles/PMC6949939/>

Éléments verbatim récupérés sur les 3 bras :

> « Participants were randomly assigned into 1 of 3 interventions: 1) MeDiet supplemented with
> extra-virgin olive oil (EVOO); 2) MeDiet supplemented with nuts; and 3) control diet (advice on a
> low-fat diet). » (Ros 2014)

Quantités fournies (Ros 2014, verbatim) :
- Groupe EVOO : **« 1 L/wk, including a minimum of 50 mL/d »**.
- Groupe fruits à coque : **« 30 g/d: 15 g of walnuts, 7.5 g of almonds, and 7.5 g of hazelnuts »**.
- Groupe contrôle : cadeaux non alimentaires (« nonfood gifts »), conseil de régime pauvre en graisses.

Composition qualitative du régime méditerranéen visé (Kargin et al. 2019, verbatim) :

> « plentiful use of olive oil, high consumption of fruit, vegetables, legumes, cereals and nuts,
> regular but moderate intake of wine (especially red wine) with meals, moderate consumption of fish,
> seafood, fermented dairy products (yogurt and cheese), poultry and eggs; and limited consumption of
> red and processed meats and sweets »

Absence de restriction calorique (deux sources convergentes, verbatim) :
- Ros 2014 : « The diets were energy unrestricted, and no increase in physical activity was promoted. »
- Kargin et al. 2019 : « None of the three dietary protocols included in the trial provided energy
  restrictions. »

Modalités de suivi (Ros 2014, verbatim) :

> « Throughout the study, participants attended quarterly individual visits and group sessions in which
> they were instructed to follow the allocated diet. »

**Ce qui n'a pas pu être récupéré** : un tableau formel « aliments à augmenter / aliments à diminuer »
distinct du questionnaire MEDAS lui-même n'a été trouvé dans aucune des sources en accès libre
consultées (Ros 2014, Kargin et al. 2019, PLoS ONE 2012). Le protocole d'étude complet
(`predimed.es/…/_1estr_protocol_olf.pdf`), qui contiendrait probablement ce détail, existe mais son
serveur a refusé toute connexion TLS depuis cet environnement (échec de handshake SSL, testé via
WebFetch et via `curl` en ligne de commande — 2 méthodes, même échec). Constat honnête : **le MEDAS
(§2) est de fait la formulation la plus précise et la plus vérifiable disponible de la cible
alimentaire du régime testé** — c'est explicitement ce que confirme Ros 2014 en présentant le tableau
14 items comme l'outil utilisé « to provide immediate feedback to participants and to establish
negotiated changes with them » (cité dans `rhd-collecte-alimentation.md` en paraphrase ; vérifié ici en
première main).

---

## 4. Version française validée : recherche négative

**Recherche menée** : requêtes croisées (français + anglais) sur la validation/adaptation
transculturelle du MEDAS, plus vérification directe des adaptations linguistiques connues.

**Adaptations transculturelles du MEDAS effectivement identifiées et vérifiées** (aucune n'est en
français) :
- Allemande — Gnagnarella P et al., *BMC Cancer*, PMC : <https://pmc.ncbi.nlm.nih.gov/articles/PMC5437541/>
- Anglaise (UK) — Papadaki A et al. 2018, *Nutrients* : <https://pmc.ncbi.nlm.nih.gov/articles/PMC5852714/>
  (vérifié directement : § « Regarding a French MEDAS version: no mention »)
- Arabe marocaine — PMC : <https://pmc.ncbi.nlm.nih.gov/articles/PMC10586530/>
- Étude « telephone-administered » — PMC : <https://pmc.ncbi.nlm.nih.gov/articles/PMC7284796/>
- Étude transnationale à 7 pays d'Europe/Méditerranée (Grèce, Portugal, Italie, Espagne, Chypre,
  Macédoine du Nord, Bulgarie) — PMC : <https://pmc.ncbi.nlm.nih.gov/articles/PMC7601687/> — **la France
  n'y figure pas**.

**Vérification négative complémentaire, en population française** : une étude de cohorte française sur
l'adhésion méditerranéenne et la dépression chez des personnes âgées a été récupérée et lue
(<https://pmc.ncbi.nlm.nih.gov/articles/PMC9614601/>). Elle **n'utilise pas le MEDAS** — verbatim :

> « The dietary survey included a 24 h dietary recall and a food frequency questionnaire (FFQ)
> administered at home by dieticians. » […] « Adherence to the MeDi was assessed once from the FFQ,
> which recorded 148 foods and beverages, and the use of the MeDi-Lite score proposed by Sofi et al. »

C'est-à-dire que la recherche française en population utilise un score alternatif (MeDi-Lite, Sofi et
al.) dérivé d'un FFQ à 148 items — pas le MEDAS à 14 items en administration directe.

**Signal supplémentaire (à ne pas utiliser comme source d'items, cité pour mémoire)** : un site grand
public français (zenit.fit) propose une traduction française informelle du score PREDIMED-14, **sans
aucune mention de validation** de cette traduction — vérifié directement sur la page
(<https://zenit.fit/radar/alimentation/>) : aucune déclaration de processus de validation
transculturelle (traduction/rétro-traduction, test psychométrique) n'y figure.

**Conclusion, en tant que résultat et non en tant qu'absence de preuve** : **aucune version française
validée du MEDAS n'a été identifiée** dans cette recherche, malgré des adaptations confirmées dans au
moins 5 langues/populations (allemand, anglais UK, arabe marocain, + les 7 pays de l'étude
transnationale). C'est une réserve méthodologique à afficher explicitement si le module RHD venait à
s'appuyer sur cet instrument traduit en français sans validation locale — exactement le risque que la
mission demandait de vérifier.

---

## 5. Conditions de réutilisation

Aucune des sources consultées ne porte de mention de licence ou de copyright spécifique à
**l'instrument lui-même** (le questionnaire en tant que tel, indépendamment des articles qui le
publient). Ce qui a pu être vérifié, article par article :

- **PLoS ONE 2012** (source du tableau verbatim, §2) : article sous licence **Creative Commons
  Attribution**, vérifiée verbatim sur la page récupérée : « Creative Commons Attribution License,
  which permits unrestricted use, distribution, and reproduction in any medium, provided the original
  author and source are properly credited. » → la reproduction du Tableau 1 faite en §2 de ce document
  est couverte par cette licence, à condition de créditer Martínez-González et al. 2012 (fait ci-dessus).
- **Advances in Nutrition 2014** (Ros et al., §3) : article en accès libre, « © 2014 American Society
  for Nutrition » — statut de licence précis (CC ou non) non vérifié au-delà de la mention « open
  access ».
- **Nutrients 2019** (Kargin et al., §3) : éditeur MDPI, dont la politique standard est CC BY (non
  re-vérifiée verbatim sur cet article spécifique, mais cohérente avec la pratique MDPI systématique).
- **J Nutr 2011** (Schröder et al., publication de validation, §1) : statut de licence **non vérifié** —
  accès au texte intégral bloqué sur les 3 miroirs testés (§1).

**Constat pour l'usage prévu (outil clinique ebm-msp)** : aucune mention trouvée d'un régime
d'autorisation préalable, de redevance, ou d'interdiction de réutilisation du contenu du questionnaire.
La pratique de fait dans la littérature (adaptations en au moins 5 langues, cf. §4, chacune publiant
l'intégralité des 14 items dans son propre article) indique un usage académique largement admis sous
réserve de citation de la source. **Ce n'est cependant pas une autorisation explicite** : aucune source
consultée ne contient de déclaration du type « this instrument is free to use/reproduce ». Si le module
RHD doit afficher tout ou partie des 14 items **verbatim** à l'utilisateur final (pas seulement s'en
inspirer pour formuler des questions différemment), il est recommandé de citer explicitement
Schröder et al. 2011 et Martínez-González et al. 2012 en source, dans la continuité de la pratique
observée dans la littérature — au même titre que `rhd-collecte-alimentation.md` cite déjà
systématiquement ses sources HAS/SFD/ebmfrance.

---

## 6. Axes d'écart exploitables — MEDAS vs recueil socle actuel

Le socle du nœud RHD (`rhd-collecte-alimentation.md`, section « Socle court (8 items) ») recueille :
boissons sucrées (S1), produits ultratransformés (S2), restauration rapide (S3), matière grasse de
cuisson (S4), régularité des repas (S5), grignotage (S6), accès à l'alimentation (S7), verrou TCA (S8).
Confrontation item par item avec les 14 critères MEDAS (§2) :

### Items MEDAS déjà couverts (au moins qualitativement) par le socle

| MEDAS | Socle correspondant | Nature de la couverture |
|---|---|---|
| #1 huile d'olive comme matière grasse principale | S4 | **Couverture qualitative directe** — S4 oppose explicitement « beurre/graisses animales » à « huile d'olive ou colza ». Pas de seuil quantitatif (MEDAS #2 : ≥4 c. à soupe/jour) — S4 ne demande pas de quantité. |
| #6 <1 portion beurre/margarine/crème par jour | S4 | Même item socle, miroir de l'item #1 (c'est la même question posée dans les deux sens dans MEDAS — « utilisez-vous plutôt X ou Y » vs « combien de X »). |
| #7 <1 boisson sucrée/gazeuse par jour | S1 | **Couverture directe** — même thématique, mais échelle différente (S1 : fréquence en bandes hebdomadaires ; MEDAS #7 : seuil strict <1/jour). Pas d'équivalence chiffrée directe entre les deux échelles en l'état. |
| #11 <3 pâtisseries industrielles/semaine | S2 | **Couverture partielle** — S2 est plus large (« plats préparés industriels ou aliments très transformés »), les pâtisseries commerciales en sont un sous-ensemble non isolé spécifiquement. |

### Items MEDAS non couverts par le socle actuel

| MEDAS | Constat |
|---|---|
| #2 quantité précise d'huile d'olive (≥4 c. à soupe/j) | Absent — S4 ne quantifie pas. |
| #3 ≥2 portions légumes/jour | **Absent** — aucun item socle ni approfondissement ne porte sur la consommation de légumes. |
| #4 ≥3 fruits/jour | **Absent** — idem, aucun item sur les fruits. |
| #5 <1 portion viande rouge/charcuterie par jour | Absent du socle en tant qu'item de recueil chiffré (la piste P2 « matières grasses » — famille M2 — agit dessus comme *piste*, mais rien ne la mesure en amont dans S1-S8). |
| #8 ≥7 verres de vin/semaine | **Absent, et explicitement écarté** — `rhd-collecte-alimentation.md`, tableau « Écarté du recueil », justifie l'exclusion de l'alcool par « aucune source locale ne le relie au motif méditerranéen-cible ». **Ce constat doit être révisé** : le vin (rouge, avec les repas, avec seuil de fréquence) est un critère à part entière du MEDAS lui-même (item #8) — donc de la cible EBM que le module vise à opérationnaliser. Point à signaler au référent, pas tranché ici (hors mission : je rapporte l'écart, je ne redécide pas l'arbitrage). |
| #9 ≥3 légumineuses/semaine | **Absent** — aucun item. |
| #10 ≥3 poisson/fruits de mer par semaine | **Absent** — aucun item. |
| #12 ≥3 fruits à coque/semaine | **Absent** — aucun item (alors que c'est, avec l'huile d'olive, l'un des deux bras réellement randomisés dans PREDIMED, cf. §3). |
| #13 préférer volaille/lapin à la viande rouge | Absent comme item de recueil (M2 est une piste, pas une mesure). |
| #14 ≥2 plats avec sofrito/semaine | **Absent** — spécificité culinaire espagnole, aucun équivalent recherché dans le socle. |

### Lecture d'ensemble

Sur les 14 items MEDAS : **2 sont directement recueillis par le socle actuel** (huile vs beurre — #1/#6 ;
boissons sucrées — #7), **1 est partiellement recoupé** (pâtisseries dans le périmètre plus large de
S2 — #11), et **10 ne sont couverts par aucun item du socle** (#2, #3, #4, #5, #8, #9, #10, #12, #13,
#14). Le déséquilibre est structurel : le socle actuel porte presque exclusivement sur l'axe
« restriction » (moins de sucre, moins d'ultratransformé, moins de restauration rapide, moins de
grignotage), qui est un axe de bon sens mais **absent des 14 critères MEDAS eux-mêmes** — alors que
l'axe « augmentation » du motif méditerranéen (légumes, fruits, légumineuses, poisson, fruits à coque,
et — sujet à arbitrage référent — vin avec modération), qui est le cœur de ce que MEDAS mesure et de ce
que PREDIMED a testé, n'a **aucun** item de recueil correspondant dans le socle actuel à 8 items.

Symétriquement, le socle couvre des dimensions comportementales que le MEDAS ne mesure pas du tout :
restauration rapide (S3), régularité des repas (S5), grignotage (S6), accès à l'alimentation (S7),
repérage TCA (S8) — le MEDAS est un outil de composition alimentaire pur, sans volet comportemental ni
contextuel. Les deux instruments sont donc complémentaires plutôt que redondants ; mais si l'objectif
affiché est de « se rapprocher du motif méditerranéen mesuré par MEDAS », le socle actuel ne mesure
aujourd'hui qu'une fraction marginale (2/14, 3 en comptant la couverture partielle) de ce que cet
instrument définit comme la cible.
