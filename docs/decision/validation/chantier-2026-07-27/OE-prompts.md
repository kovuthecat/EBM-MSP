# Prompts OpenEvidence — chantier 2026-07-27

> **Usage.** Ces prompts sont à passer dans OpenEvidence par le référent, puis à coller en retour dans la
> session. Ils servent de **triangulation** : une collecte d'agent et une réponse OE qui convergent ne
> prouvent rien à elles seules, mais une DIVERGENCE entre les deux est un signal fort qu'il faut
> retourner à la source primaire.
>
> **Rappel de méthode, appris à la dure sur ce dépôt** (`docs/decision/00-global.md`, étape de
> triangulation) : les sorties OE de ce projet ont déjà produit des PMID entièrement faux et deux
> affirmations inventées de toutes pièces (« Prescrire = NPH », « position du CMG »). Une réponse OE
> n'est jamais une source — c'est une piste à vérifier. Tout ce qui en sort doit être re-vérifié sur la
> source primaire avant d'entrer dans un nœud.
>
> Rédigés en anglais : OE répond mieux et cite davantage.

---

## OE-1 · Instrument de repérage des TCA en soins primaires (nœud `rhd-alimentation`)

```
In adults with type 2 diabetes seen in primary care, which brief validated screening
instruments exist for disordered eating and eating disorders? Specifically:

1. What are the diagnostic performance characteristics (sensitivity, specificity) of the
   SCOFF questionnaire, the ESP (Eating disorder Screen for Primary care), and the DEPS-R
   in adult populations?
2. Has any of these been formally validated in FRENCH (linguistic and psychometric
   validation)? Give the validation studies.
3. Has any been validated specifically in adults with TYPE 2 diabetes, as opposed to
   type 1 diabetes or general/psychiatric populations?
4. What do guidelines recommend for eating disorder screening in adults with type 2
   diabetes before advising dietary restriction or portion control?

For each instrument, give the number of items, administration time, and the exact
population in which it was validated. If no French validation exists, say so explicitly.
```

## OE-2 · Intolérance aux statines — conduite à tenir (nœud `statine`)

```
In patients with an indication for statin therapy who report statin intolerance:

1. What is the evidence from blinded n-of-1 or placebo-controlled rechallenge trials
   (e.g. SAMSON, StatinWISE) on the true attributability of muscle symptoms, and what
   proportion of patients successfully resume a statin after structured rechallenge?
2. What is the evidence for non-daily / intermittent statin dosing and for lower-dose
   strategies — on LDL lowering, and on HARD cardiovascular outcomes?
3. In confirmed, complete statin intolerance, what is the evidence for ezetimibe,
   bempedoic acid (CLEAR Outcomes), and PCSK9 inhibitors — distinguishing hard outcomes
   from surrogate endpoints, and giving absolute risk reduction / NNT where available?
4. Specifically in patients with type 2 diabetes, does any of this differ?
5. What sequence do current guidelines recommend (ESC/EAS, NICE, and any French society
   guidance), and do they disagree with each other?

Please distinguish clearly between surrogate (LDL) and hard clinical endpoints throughout,
and give absolute effect sizes rather than relative risk reductions where possible.
```

## OE-3 · Seuil rénal des sulfamides (nœud `prescription`)

```
For sulfonylureas (specifically gliclazide and glimepiride) in adults with type 2 diabetes
and chronic kidney disease:

1. Do guidelines specify a NUMERICAL eGFR threshold below which sulfonylureas should be
   stopped or dose-reduced? Give the exact threshold and the source (KDIGO Diabetes
   Management in CKD, ADA Standards of Care, NICE, and any French guidance from HAS or
   SFD).
2. Does the recommendation differ BETWEEN sulfonylureas — is gliclazide considered safer
   in CKD than glimepiride or glibenclamide, and on what evidence?
3. What is the evidence base for any such threshold: pharmacokinetic data, hypoglycaemia
   outcome data, or expert consensus?

Please quote the threshold exactly as stated in each source, and indicate where a source
uses only qualitative wording such as "severe renal impairment" without a number.
```

## OE-4 · Répaglinide en insuffisance rénale terminale (nœud `prescription`)

```
For repaglinide in adults with type 2 diabetes:

1. What pharmacokinetic or clinical data exist in patients with eGFR below 20 mL/min or
   on dialysis? The EU SmPC reports a pharmacokinetic study in the 20-39 mL/min range but
   is silent below that.
2. Is repaglinide recommended, permitted, or avoided in end-stage kidney disease by
   nephrology or diabetes guidelines (KDIGO, renal drug handbooks, French guidance)?
3. How does its renal safety profile compare with sulfonylureas in advanced CKD, and what
   is the evidence for that comparison?

If no data exist below 20 mL/min, please say so explicitly rather than extrapolating.
```

## OE-5 · Seuil de sur-basalisation à 0,5 U/kg (nœud `insuline`)

```
Regarding "overbasalization" in type 2 diabetes managed with basal insulin:

1. What is the origin and evidence base for the threshold of 0.5 units/kg/day of basal
   insulin as a marker of overbasalization? Which publication or guideline first proposed
   it, and on what data?
2. Is there any randomized trial comparing a strategy of capping basal insulin and
   intensifying by another route, versus continued basal titration — and if so, on what
   endpoints?
3. What other markers of overbasalization are described (bedtime-to-morning glucose
   differential, high HbA1c despite high basal dose, hypoglycaemia frequency), and are any
   of them better validated than the weight-based threshold?
4. Do competing thresholds exist in the literature (0.3, 0.5, 0.7, 1.0 U/kg)?

Please state clearly whether the 0.5 U/kg figure is expert consensus or derived from data,
and identify any trial evidence supporting its use as a decision rule.
```

---

## Comment exploiter les retours

1. Coller la réponse OE dans la session, telle quelle, sans la résumer.
2. Elle sera confrontée au rapport de l'agent de collecte correspondant, dans une section « §5b — apport
   OE » du rapport, comme sur les nœuds D, E et H.
3. Tout PMID cité par OE est **re-vérifié** avant d'entrer où que ce soit. Sur les nœuds précédents, la
   totalité des PMID fournis par OE sur un sujet se sont révélés faux — ce n'est pas une précaution
   théorique.
4. Les divergences OE / agent sont tranchées par la source primaire, jamais par majorité.
