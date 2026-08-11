# Passe OpenEvidence — titration de l'insuline basale pilotée par la MCG (DT2)

> **Date** : 2026-08-11 · **Nœud concerné** : `insuline` (diabète de type 2)
> **Statut** : prompt prêt à coller — retour non encore collecté.
> **Nature** : passe de DÉBROUSSAILLAGE, exécutée manuellement par le référent. OpenEvidence n'est
> jamais une source primaire (`.claude/skills/recherche-preuve-triangulee/SKILL.md`). Elle sert ici à
> trancher une seule question : **y a-t-il quelque chose à chercher, oui ou non ?** Si le retour est
> vide, on s'arrête là et on écrit l'absence de preuve dans le nœud plutôt qu'un protocole inventé.

## Pourquoi cette recherche

Le nœud `insuline` sélectionne l'option « Titrer la basale » **en lisant la courbe nocturne MCG**
(`profil_nocturne_permet_titration`, dérivé de `profil_nocturne == hausse_continue`), puis affiche une
posologie qui dit : *« +2 U si la glycémie à jeun reste haute 3 matins de suite »* — c'est-à-dire la
règle de **repli des patients sans capteur**. La doctrine du nœud, écrite trois fois par le référent
dans les commentaires YAML, dit l'inverse : « la GAJ est le cas de repli quand il n'y a pas de MCG »,
« quand il y a une MCG on regarde rarement les mesures de glycémie isolée ».

Le texte du bras MCG **n'existe nulle part** dans le contenu. Cette passe cherche s'il existe dans la
littérature.

## Ce que le projet possède DÉJÀ — ne pas le faire reformuler

Base MCG côté **résultats**, déjà collectée, appréciée et câblée dans le nœud :

| id | source | ce qu'elle porte |
| --- | --- | --- |
| `mobile` | MOBILE, ECR, DT2 sous basale seule — PMID 34077499 | HbA1c −0,4 % ; TIR +15 pts (substitution) |
| `freedm2` | FreeDM2, ECR, DT2 basale + iSGLT2/AR GLP-1 — doi 10.1016/S2213-8587(26)00076-8 | HbA1c −0,6 %/−0,5 % ; hypo sévère 0 vs 2 |
| `jancev` | Méta-analyse 12 ECR, MCG dans le DT2 — PMID 38363342 | HbA1c −0,31 % ; TIR +6,4 pts ; hypo sévère RR 0,66 NS ; **aucun critère dur** |
| `battelino` | Consensus ATTD 2019 — PMID 31177185 | cibles TIR/TBR/TAR/CV — **consensus d'experts, sans essai** |
| `beck` | Ré-analyse DCCT, DT1 — PMID 30352896 | validation du TIR (observationnel) |
| `lu` | Cohorte DT2 n=6 225 — PMID 33097560 | TIR ≤ 50 % : mortalité HR 1,83 (observationnel) |
| `treat-to-target` | Riddle 2003 — PMID 14578243 | titration **sur GAJ**, hebdomadaire, paliers 2→8 U |

La question n'est donc **pas** « la MCG améliore-t-elle le contrôle » (réglé), mais « **existe-t-il un
algorithme de titration de la basale piloté par le capteur** ».

Sources **pré-appréciées par le projet, à exclure explicitement du retour** (elles ont déjà été lues,
les faire ressortir ne produit rien) : HAS, SFD, CMG, Prescrire, Médicalement Geek / DragiWebdo,
Minerva, ebmfrance.

---

## PROMPT À COLLER DANS OPENEVIDENCE

```text
Question clinique : chez l'adulte diabétique de type 2 sous insuline BASALE (hors DT1, hors grossesse,
hors pompe et hors boucle fermée), existe-t-il un algorithme de TITRATION DE LA DOSE DE BASALE piloté
par les métriques de mesure continue du glucose (temps dans la cible, temps sous la cible, temps
au-dessus de la cible, tendance nocturne du profil AGP), plutôt que par la glycémie capillaire à jeun ?

Réponds aux six sous-questions SÉPARÉMENT, dans cet ordre, en les numérotant.

Q1. Existe-t-il un essai randomisé ayant comparé une titration de basale PILOTÉE PAR LES MÉTRIQUES DE
MESURE CONTINUE DU GLUCOSE à une titration pilotée par la glycémie capillaire à jeun, chez le DT2 ?
Pour chaque essai : population exacte (âge, ancienneté du diabète, schéma insulinique, comorbidités
incluses et exclues), intervention exacte, critère de jugement en précisant DUR ou SUBSTITUTION, effet
ABSOLU chiffré avec intervalle de confiance et horizon temporel, PMID ou DOI exact.

Q2. À défaut d'essai comparatif : existe-t-il un algorithme de titration de basale guidé par la mesure
continue du glucose qui soit PUBLIÉ et évalué PROSPECTIVEMENT chez le DT2 ? Je cherche des valeurs
chiffrées et actionnables : quel déclencheur, quel pas de dose, quel palier, quel rythme de
réévaluation. Un algorithme publié sans évaluation prospective doit être signalé comme tel.

Q3. Dans les essais randomisés de mesure continue du glucose chez le DT2 sous basale — MOBILE
(PMID 34077499), FreeDM2 (doi 10.1016/S2213-8587(26)00076-8), et les 12 essais de la méta-analyse
Jancev (PMID 38363342) — quel protocole de titration d'insuline a été RÉELLEMENT appliqué dans le bras
capteur ? Était-il piloté par le capteur ou par la glycémie capillaire à jeun ? Cite le protocole
verbatim quand il est accessible, et indique quand il ne l'est pas.

Q4. Existe-t-il des SEUILS de mesure continue du glucose validés comme DÉCLENCHEUR D'UNE MAJORATION DE
DOSE de basale (par exemple temps dans la cible sous un seuil, temps au-dessus de la cible nocturne,
tendance nocturne ascendante), associés à un pas de dose ? Distingue explicitement un seuil
d'INTERPRÉTATION (comme les cibles du consensus ATTD, PMID 31177185) d'un seuil d'ACTION POSOLOGIQUE :
ce ne sont pas la même chose et je cherche le second.

Q5. Existe-t-il des données spécifiques sur la lecture du PROFIL NOCTURNE (courbe AGP) comme
déclencheur de titration de la basale, par comparaison avec la glycémie à jeun ? Y compris les données
sur le risque de SUR-BASALISATION détecté par la courbe nocturne.

Q6. Les recommandations internationales indexées postérieures à 2019 (ADA Standards of Care, EASD,
ATTD, Endocrine Society, NICE) définissent-elles un algorithme de titration de basale sur mesure
continue du glucose, ou seulement des cibles d'interprétation ? Cite le paragraphe exact et son grade.

CONSIGNES IMPÉRATIVES.
1. Si aucun essai randomisé ne répond précisément à une sous-question, ÉCRIS-LE EXPLICITEMENT
(« aucun ECR trouvé pour Q_n ») au lieu de substituer silencieusement une étude observationnelle, un
avis d'expert ou une recommandation, présentés comme un niveau de preuve équivalent.
2. NE COMBLE PAS PAR ANALOGIE AVEC LE DIABÈTE DE TYPE 1, ni avec la pompe ou la boucle fermée. Si une
donnée provient de ces populations, dis-le et marque-la comme non transposable par défaut.
3. N'utilise PAS et ne reformule PAS les sources suivantes, déjà lues et appréciées : HAS, SFD, CMG,
Prescrire, Médicalement Geek / DragiWebdo, Minerva, ebmfrance. Je cherche les essais primaires et les
recommandations internationales indexées.
4. Pour tout chiffre avancé, donne la source précise (PMID/DOI) et l'effet ABSOLU, pas seulement
relatif. Un chiffre que tu ne peux pas rattacher à une source précise doit être signalé comme tel.
```

---

## Retour OpenEvidence — collecté le 2026-08-11

Brut verbatim : `OE-titration-mcg-brut-2026-08-11.txt` (même dossier).

> ⚠ **DÉFAUT D'INTÉGRITÉ DE LA CAPTURE, tracé et non corrigé.** Le fichier brut ne contient **aucun
> caractère `<`** (vérifié par comptage : 0 occurrence, contre 4 `>` et 4 `≥`). Tous les « inférieur
> à » ont été perdus au copier-coller, vraisemblablement par échappement HTML. Quatre passages sont
> amputés d'un seuil chiffré, dont **un seuil de SÉCURITÉ** : les cibles TBR/TAR du consensus ATTD
> (l. 32), le seuil de glycémie à jeun sous lequel l'AACE fait RÉDUIRE la dose de 10-20 % (l. 37), et
> la cible TBR de l'AACE (l. 59). Ces nombres **ne doivent pas être reconstruits de mémoire**. Si l'un
> d'eux devait servir, la capture est à refaire.
>
> Cette perte **ne change pas le verdict ci-dessous**, qui est une NÉGATIVE : tous les seuils manquants
> appartiennent soit aux algorithmes fondés sur la glycémie à jeun, soit aux cibles d'interprétation
> que le nœud porte déjà (`battelino`).

### Verdict par sous-question

| | question | verdict |
| --- | --- | --- |
| Q1 | ECR titration MCG vs GAJ, ambulatoire, DT2 | **aucun ECR trouvé** |
| Q2 | algorithme MCG-guidé publié et évalué prospectivement | **aucun** — un seul candidat, rétrospectif |
| Q3 | protocole réel du bras capteur (MOBILE/FreeDM2/Jancev) | **aucun n'a testé une titration pilotée par capteur** |
| Q4 | seuil MCG déclencheur d'une majoration de dose | **aucun** — seuils d'interprétation seulement |
| Q5 | profil nocturne AGP comme déclencheur | **aucun ECR** — un avis narratif |
| Q6 | recommandations internationales post-2019 | **aucune** ne définit un tel algorithme |

**Le pronostic du référent est confirmé : la titration de basale pilotée par les métriques MCG n'existe
pas à l'état de protocole validé.** Le retour n'est pas vide pour autant — il rapporte quatre éléments
qui changent la RÉDACTION du bras MCG, sans jamais fournir de protocole.

### Ce que le retour apporte réellement

1. **Les essais MCG n'ont pas testé de titration MCG-pilotée — et c'est chiffré.** Dans MOBILE la
   titration restait à la discrétion du médecin de soins primaires, et il n'y a eu **aucune différence
   significative de dose totale d'insuline entre les bras** : le gain (TIR +15 pts, IC 95 % 8 à 23) ne
   vient pas d'un algorithme posologique. FreeDM2 : même absence de différence de dose, bénéfice attribué
   par les auteurs aux changements de mode de vie ; l'algorithme d'auto-titration n'est pas spécifié dans
   le texte accessible. Jancev : protocoles de titration non harmonisés ni rapportés uniformément.
   → C'est l'argument le plus solide pour DIRE l'absence dans le nœud, et il est sourçable.
2. **Un pont existe, rétrospectif seulement** — Martens 2025 (`doi 10.1016/j.dsx.2025.103266`,
   PMID 40683222 selon le corps du retour, à confirmer) : sur 7 354 paires GAJ / MCG aveugle chez 68 DT2,
   le **nadir MCG de la 1ʳᵉ heure du matin** (médiane des 3 valeurs les plus basses de l'heure précédant
   la GAJ) est essentiellement équivalent à la GAJ sur trois algorithmes classiques (INSIGHT, Treat2Target,
   AT.LANTUS), erreurs de dose majoritairement entre −10 % et +10 %. Ce n'est **pas** un pilotage par
   TIR/AGP : c'est un SUBSTITUT capteur de la valeur à jeun, qui laisse le pas et le rythme inchangés.
3. **Le déclencheur nocturne du nœud gagne une source — faible.** La revue JAMA Internal Medicine 2026
   (`doi 10.1001/jamainternmed.2026.2772`) écrit que la basale peut être augmentée devant une glycémie
   qui monte pendant la nuit, réduite devant une baisse nocturne ou une hypoglycémie nocturne —
   **qualitatif, sans seuil ni pas de dose**, niveau opinion / revue narrative. C'est exactement le
   `profil_nocturne == hausse_continue` du nœud, qui n'avait aucune source propre.
4. **DIATEC (`doi 10.2337/dc24-2222`) est un faux ami, à ne pas citer comme précédent.** Seul essai
   comparant des algorithmes de titration MCG vs glycémie ponctuelle, mais **hospitalier**, et surtout :
   les algorithmes étaient **IDENTIQUES** dans les deux bras (mêmes cibles, mêmes pas), seule la SOURCE
   de la mesure différait. Ce n'est donc pas un algorithme piloté par métriques MCG.

### Deux trouvailles incidentes, hors périmètre de la question posée

À arbitrer séparément, elles touchent des arbitrages déjà pris :

- **Le seuil de 0,5 U/kg/j réapparaît.** Le retour rapporte que l'ADA 2026 et l'AACE listent parmi les
  signaux de sur-basalisation : différentiel coucher-réveil ≥ 50 mg/dL (≥ 2,8 mmol/L), hypoglycémie,
  forte variabilité, **dose de basale > 0,5 U/kg/j** — devant conduire à réévaluer le plan plutôt qu'à
  majorer la basale. Or P14/S4 (T-167, 2026-08-06) a précisément rétrogradé ce ratio
  (`ratio_basale_poids_eleve`) en simple alerte limitée à l'absence de capteur, au motif que la
  sur-basalisation se lit sur la courbe nocturne. Les deux lectures ne sont pas incompatibles, mais
  l'arbitrage mérite d'être revu à la lumière de ces deux recommandations.
- **Peters 2019** (`doi 10.1111/dom.13729`) : la variation glucidique nocturne de base prédit la réponse
  à l'intensification PRANDIALE mieux que l'HbA1c — un profil nocturne correct à jeun avec montée
  post-prandiale oriente vers le **bolus**, pas vers une majoration de basale. Appuie directement
  l'option « Ne pas sur-titrer la basale — intensifier autrement ».

### Mésattributions repérées dans le retour — à red-teamer avant tout usage

Le retour présente au moins trois rattachements source/affirmation qui ne tiennent pas en l'état. C'est
le défaut exact qui a déjà frappé ce nœud (« D3 — MÉSATTRIBUTION », passe A du 2026-07-29 : algorithme
faussement attribué à Treat-to-Target) :

- réf. [6] — Aroda & Eckel, *Reconsidering the role of glycaemic control in cardiovascular disease risk*
  — citée à l'appui des **cibles d'interprétation ATTD**. Ce papier n'est pas le consensus ICTR.
- réf. [15] — Irace et al., *Insights From an Italian Expert Group* — citée à l'appui **à la fois** du
  consensus ADA/EASD **et** des recommandations NICE. Un avis d'experts italien ne peut être la source
  ni de l'un ni de l'autre.
- réf. [7] — Anagnostopoulou, *CGM and microvascular complications* — citée pour les mêmes cibles
  d'interprétation ; secondaire, pas le consensus.

Rappel de principe : OpenEvidence est un **débroussaillage**, jamais une source primaire. Rien de
ci-dessus n'entre dans le nœud sans vérification sur le texte primaire.

## Décision après lecture

**Le nœud doit DIRE l'absence, pas inventer un protocole** — issue « retour vide » du cadrage, qui
s'applique malgré un retour riche, puisque aucun protocole validé n'existe. Conséquences :

1. **R1 reste nécessaire.** Il faut le mécanisme conditionnel (`posologie_detail` porteur d'un `quand`)
   pour pouvoir afficher au patient porteur d'une MCG une réserve que le patient sans capteur ne doit pas
   lire. L'absence de preuve ne supprime pas le besoin : elle en fixe le CONTENU.
2. **Contenu du bras MCG, à rédiger** (registre R7 de `GRAMMAIRE-NOEUD.md`, jamais se prononcer sur ce
   qu'on ignore ; même registre que « aucun rythme ni ampleur chiffrés pour un allègement programmé »
   déjà employé dans ce nœud) : le pas (2 U / 10 %) et le rythme (3 jours) ne sont établis que sur la
   glycémie à jeun ; les essais de MCG n'ont pas testé de titration pilotée par le capteur et n'ont
   montré aucune différence de dose ; la transposition à la lecture de la courbe relève du praticien.
3. **Sourçage à confirmer avant écriture** — les trois sources qui porteraient ce texte (Martens 2025,
   JAMA Intern Med 2026, l'absence de différence de dose dans MOBILE/FreeDM2) doivent passer le circuit
   `recherche-preuve-triangulee` étape 2 (Agent B, red-team en contexte isolé), en priorité sur les trois
   mésattributions relevées ci-dessus.
4. **Ne pas citer DIATEC** comme précédent de titration MCG-pilotée.
