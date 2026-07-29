# Passe A — prompts OpenEvidence (débroussaillage référent)

> Rédigés le 2026-07-29. Même convention que l'annexe OE de [`H-rhd.md`](../../noeuds/H-rhd.md) et
> `00-global.md` étape 4 : **triangulation A × B × OE**.
>
> **OE = débroussaillage, jamais source primaire.** Tout PMID / DOI / chiffre renvoyé sera re-vérifié
> contre la source primaire au red-team (agent B) avant d'entrer dans `content/**`. Rappel du précédent
> le plus coûteux : sur les nœuds H et E, **la totalité des PMID rendus par OE étaient faux** — ils
> pointaient sur de la parasitologie, de la physique et de la bariatrie. On lance OE pour le *périmètre*
> et pour les *essais qu'on aurait manqués*, jamais pour les *chiffres*.
>
> **Périmètre — sources FR proscrites du prompt** : ne jamais demander à OpenEvidence d'explorer ou de
> citer **HAS, SFD, CMG, Prescrire, Médicalement Geek / DragiWebdo, Minerva, ebmfrance** (accès non
> fiable → il hallucine PMID, URL et positions). Ces sources sont curées **par les agents** à partir de
> `docs/decision/sources/` + web + référent. Cf. `00-global.md` et `BRIEF_DECISION.md` §14bis. La clause
> d'exclusion est écrite **dans** chaque prompt ci-dessous — ne pas la retirer en copiant.
>
> **Ordre de priorité si tu n'en lances que deux** : **OE-A1** (la seule question réellement bloquante,
> cf. exigence E3 des vignettes) puis **OE-A2**.

---

## OE-A1 — Cibles post-prandiales capillaires et conduite du bolus ⚠ *prioritaire*

> Motif : c'est le seul point de la passe A qu'aucune source du dépôt ne couvre. Le nœud affiche
> aujourd'hui « ajuster sur la glycémie post-prandiale (< 1,80 g/L à 2 h) » **sans aucune référence
> primaire** — la seule trace du chiffre est un relais francophone des Standards ADA 2020.

> In adults with **type 2 diabetes treated with basal insulin**, what **self-monitored capillary
> post-prandial glucose** threshold should trigger the **introduction of a prandial (bolus) insulin**, and
> what threshold should guide its **dose titration**? Report, per source (with **PMID/DOI, year,
> journal**): the exact numeric target (mg/dL and mmol/L), the **timing of the measurement** (1 h vs 2 h
> post-meal, pre-next-meal), and whether it comes from a **randomised trial**, a post-hoc analysis, or
> expert consensus. Cover in particular the **basal-plus / stepwise prandial** trials — **FullSTEP**
> (Rodbard), **OPAL**, **PROLOGUE / Lankisch (1-2-3 study)**, **AT.LANTUS**, **4T (Holman)** — and any
> trial that **randomised patients to a post-prandial-guided vs a fasting-guided titration strategy**
> (e.g. the **HEART2D** trial comparing prandial vs basal targeting): report its primary endpoint,
> absolute event rates per arm, HR/CI and follow-up. Then answer explicitly: **is there any evidence that
> targeting post-prandial glucose improves hard outcomes** (cardiovascular events, mortality,
> microvascular endpoints), or only surrogates (HbA1c, glycaemic excursions)? Give the **absolute effect
> and NNT/NNH with the horizon** wherever an outcome is reported, clearly label each endpoint **hard vs
> surrogate**, and give a **GRADE** appraisal per body of evidence. **If a numeric threshold cannot be
> traced to a primary published document, say so explicitly rather than reporting it.** **Do NOT attempt
> to cover, summarise or cite French or independent-EBM sources (HAS, SFD, CMG/Collège de la Médecine
> Générale, Prescrire, Médicalement Geek/DragiWebdo, Minerva, ebmfrance): those are curated separately.**

---

## OE-A2 — Titration de la basale sur glycémie à jeun capillaire : monter **et descendre**

> Motif : le nœud encode la **montée** (Treat-to-Target : +2 U si la GAJ reste au-dessus 3 matins de
> suite, cible 0,70-1,20 g/L) et pas la **descente**. Une glycémie à jeun basse y produit aujourd'hui une
> majoration de dose.

> In adults with **type 2 diabetes on basal insulin**, what are the published **self-titration algorithms
> based on capillary fasting plasma glucose**? For each algorithm (with **PMID/DOI, year, journal**),
> report: the **fasting glucose target range**, the **increment** and its **frequency**, whether titration
> is patient-led or physician-led, and the proportion reaching target without nocturnal hypoglycaemia.
> Cover **Treat-to-Target (Riddle 2003)**, **AT.LANTUS**, **INSIGHT (Gerstein 2006)**, **LANMET**,
> **PREDICTIVE 303**, **the ATLAS trial**, and any head-to-head comparison of titration algorithms.
> **Three questions the algorithms are usually silent about, and which are the actual object of this
> query:**
> 1. **The down-titration rule.** What fasting glucose value, and what number of occurrences, mandates
>    **reducing** the basal dose, and **by how much** (fixed units vs percentage)? Report the exact rule
>    used in each trial protocol, not only the up-titration arm.
> 2. **Stopping rules.** Is there any evidence-based **ceiling** at which one should stop up-titrating
>    basal insulin and intensify differently, beyond the contested 0.5 U/kg/day marker?
> 3. **The older / frail patient.** Is there any trial or prespecified subgroup supporting a **slower
>    titration step, a longer interval, or a higher fasting target** in patients ≥ 75 years or with
>    frailty — or is this expert consensus only?
>
> For every outcome give **absolute rates per arm, absolute difference, NNT/NNH and the horizon**;
> separate **hard outcomes** (severe hypoglycaemia, CV events, mortality) from **surrogates** (HbA1c,
> fasting glucose, symptomatic hypoglycaemia rates). Give a **GRADE** appraisal. **Flag any figure you
> cannot ground in a primary trial.** **Do NOT attempt to cover, summarise or cite French or
> independent-EBM sources (HAS, SFD, CMG, Prescrire, Médicalement Geek/DragiWebdo, Minerva, ebmfrance).**

---

## OE-A3 — Que vaut l'autosurveillance capillaire comme instrument de pilotage

> Motif : tout l'édifice « sans capteur » repose sur l'autosurveillance. Il faut savoir sur quel niveau de
> preuve on l'adosse — et à quelle densité de mesures elle devient exploitable.

> In adults with **type 2 diabetes**, what is the evidence that **structured self-monitoring of blood
> glucose (SMBG)** improves outcomes, and at **what measurement density** does it become informative?
> Distinguish clearly two populations, because the evidence differs: (a) **non-insulin-treated** T2D —
> cover **ESMON**, **DiGEM**, **STeP (Polonsky 2011)**, **the Malanda Cochrane review**, and the
> **Farmer** trials; (b) **insulin-treated** T2D — cover any RCT or systematic review of SMBG frequency
> and of **structured profiles** (e.g. 7-point profiles, paired pre/post-meal testing) as a guide to
> insulin adjustment. For each: **PMID/DOI, year**, design, population, intervention (**state the exact
> testing schedule**), comparator, follow-up, and the effect on **HbA1c (absolute %, CI)**, on
> **hypoglycaemia**, and on **hard outcomes** if any. Then answer directly: **is there a minimum SMBG
> density below which insulin titration cannot be safely guided**, and is it evidence-based or pragmatic?
> Also report what is known about **capillary SMBG missing nocturnal hypoglycaemia** compared with
> continuous monitoring (proportion of nocturnal events undetected by routine SMBG). Give absolute
> effects with horizon, label **hard vs surrogate**, and give a **GRADE** appraisal. **Flag anything you
> cannot source.** **Do NOT attempt to cover, summarise or cite French or independent-EBM sources (HAS,
> SFD, CMG, Prescrire, Médicalement Geek/DragiWebdo, Minerva, ebmfrance).**

---

## OE-A4 — Localiser l'hypoglycémie dans le nycthémère au lecteur capillaire

> Motif : c'est ta piste des 4 créneaux (nuit / matinée / après-midi / soir). Il faut savoir si elle est
> documentée ou si elle est un raisonnement physiopathologique — ce qui ne l'invalide pas, mais change ce
> que le nœud aura le droit d'en dire.

> In adults with **insulin-treated type 2 diabetes**, is the **time of day of hypoglycaemic episodes**
> established as a guide to **which insulin component to adjust** (basal vs a specific prandial dose)?
> Report: (a) any study, trial protocol or consensus that maps **the timing of a hypoglycaemic event to
> the responsible insulin component**, including the classic pre-breakfast / pre-lunch / pre-dinner /
> nocturnal attribution logic — give **PMID/DOI** and state whether it is empirical or
> physiological reasoning; (b) the published **epidemiology of the timing of hypoglycaemia** in
> insulin-treated T2D (**HAT study**, **Global HAT**, **UK Hypoglycaemia Study Group**, **DEVOTE** and
> **SWITCH 2** nocturnal-event definitions): what proportion of events are **nocturnal**, and how are the
> nocturnal windows defined in each (00:00-06:00 vs 22:00-07:00 — give the exact definition used);
> (c) whether **routine capillary testing reliably detects nocturnal hypoglycaemia**, and what proportion
> it misses versus continuous monitoring. Also report whether any guideline or trial uses a **four-period
> day** division rather than meal-anchored time points. For each item: design, population, absolute
> proportions, **PMID/DOI, year**. Label **hard vs surrogate** outcomes, give a **GRADE** appraisal, and
> **state explicitly where the attribution logic rests on physiological reasoning rather than data.**
> **Do NOT attempt to cover, summarise or cite French or independent-EBM sources (HAS, SFD, CMG,
> Prescrire, Médicalement Geek/DragiWebdo, Minerva, ebmfrance).**

---

## OE-A5 — Recommandations internationales indexées : autosurveillance, cibles, désintensification

> Motif : cadrer ce que les recommandations indexées disent réellement, pour que les agents A ne
> confondent pas « la SFD le dit » et « c'est démontré ». Sert aussi la vignette V-A5 (sujet âgé
> sur-traité, aujourd'hui invisible dans le nœud).

> What do **international clinical guidelines indexed in the peer-reviewed literature** recommend for
> **self-monitoring of blood glucose and glycaemic targets in insulin-treated type 2 diabetes, in
> patients without continuous glucose monitoring**? Cover the **ADA Standards of Care 2026** (chapters on
> Glycemic Goals, Diabetes Technology, Pharmacologic Approaches, and Older Adults) and the **ADA/EASD
> 2022 consensus report**. Report, with **PMID/DOI** for each: (1) the recommended **SMBG frequency** by
> insulin regimen (basal only vs basal-bolus); (2) the recommended **fasting** and **post-prandial**
> capillary targets, with their **grade of recommendation** and whether a trial supports them; (3) what
> is said about **de-intensification / over-treatment in older adults** — the HbA1c and glucose
> thresholds below which insulin should be reduced, and the evidence class behind them; (4) whether any
> guideline defines a **basal insulin dose ceiling** and on what basis. For each recommendation, state
> explicitly its **evidence grade as printed in the source** and whether it rests on a randomised trial
> or on expert consensus — the two must not be conflated. **If you cannot ground a claim in a real
> indexed document, say so — do not invent a reference.** **Do NOT attempt to cover, summarise or cite
> French or independent-EBM sources (HAS, SFD, CMG/Collège de la Médecine Générale, Prescrire,
> Médicalement Geek/DragiWebdo, Minerva, ebmfrance): the analysts curate those separately from the local
> corpus and the référent.**

---

## Après OE — ce qui se passe

1. Les retours OE **ne s'écrivent nulle part dans `content/**`**. Ils alimentent un `§5b` du dossier de
   preuve, comme pour les nœuds C, D, E, H.
2. **Passe adversariale obligatoire** (agent B) sur tout ce qu'OE rend : vérification PMID/DOI/chiffres
   contre source primaire. Discipline `CONSTRUIRE-UN-MODULE.md` §P4 — *aucune correction issue d'une
   collecte n'entre dans le contenu avant sa passe adversariale, surtout quand elle prend la forme
   flatteuse d'« un défaut trouvé chez vous »*.
3. **Ce qui te sera rapporté entre les deux passes est provisoire et sera présenté comme tel.**
