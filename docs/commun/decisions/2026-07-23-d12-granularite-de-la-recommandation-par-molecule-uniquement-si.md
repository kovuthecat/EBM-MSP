# 2026-07-23 — D12 · Granularité de la recommandation par molécule uniquement si EBM (transverse)

### Décision

Extension de la directive « granularité si appuyée sur EBM » (référent, 2026-07-22 ; cf.
`docs/decision/00-global.md` §Règles de sourcing) **au grain de la recommandation** : l'outil ne
recommande une **molécule précise** (plutôt que sa **classe**) **que si des données EBM (ECR/méta) le
justifient** pour l'indication considérée. Sinon, recommander **au niveau de la classe**, la reco
officielle (qui, comme la HAS 2024, raisonne souvent par classe) restant **affichée**.

**Vaut pour tout l'outil** (tous nœuds, tous domaines), pas seulement le nœud B.

### Exemple d'application (nœud B, iSGLT2)

- **HHF + néphroprotection** : effet-classe démontré (cana/dapa/empa cohérents) → recommandation **au
  niveau de la classe** « iSGLT2 ».
- **Mortalité / MACE** : démontré **molécule par molécule** (empagliflozine ++ ; canagliflozine et
  dapagliflozine non significatives isolément ; ertugliflozine neutre — VERTIS CV) → si l'on met en avant
  un bénéfice de mortalité, **nommer la molécule** qui l'a prouvé, sans le généraliser à la classe.

### Raison

Cohérence avec l'exactitude médicale (invariant CLAUDE.md §6) et la règle EBM : ne pas sur-généraliser un
bénéfice d'une molécule à toute sa classe, ni encoder une finesse non étayée. Le schéma porte déjà
`niveau_preuve` par option ; une option peut donc se formuler « classe X » ou « molécule Y » selon le grain
que l'EBM autorise.
