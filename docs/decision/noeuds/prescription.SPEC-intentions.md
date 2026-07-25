# Nœud `prescription` — SPEC S8 : refonte « par intention » (addendum au SPEC de fusion)

> **Statut : BROUILLON DE SPEC — à geler par le référent.** Addendum à
> [`prescription.SPEC.md`](prescription.SPEC.md) (fusion B+C+D, gelé) : ne remplace pas les garde-fous durs
> ni les valeurs cliniques, il **réorganise l'interrogation autour de l'intention du praticien** et **comble
> quelques trous de logique glycémique** révélés par la relecture (M3). Décisions référent intégrées
> (2026-07-25). Plan : session **S8** de `plans/P3-fusion/`.

## 1. Principe directeur (à ne jamais enfreindre)

**L'intention ORGANISE** (le flux de saisie + le cadrage/l'ordre d'affichage) ; **les critères cliniques
DÉTERMINENT ce qui est applicable.** L'intention ne **filtre jamais durement** les options → les gestes
**transverses** restent affichés (en second). C'est la robustesse « non-étanche » voulue par le référent :
intensifier peut révéler un switch à faire ; déprescrire pour un risque peut aboutir à un switch vers une
molécule sûre et bénéfique ; etc. On ne masque jamais un geste indiqué.

## 2. Modèle de saisie

1. **`intention`** — nouveau critère enum `[initier, intensifier, optimiser, deprescrire]`, **primer n°1**.
   **Remplace `position_vs_cible`** (qui disparaît : l'HbA1c seule ne donne pas le « vs cible » sans être
   passé par le nœud A — décision référent).
2. **Flux** (ordre exact, décision référent) : `intention` → *si ≠ initier* `traitements_en_cours` →
   drapeaux (bool) → critères positifs (ASCVD, IC, DFG, albuminurie, IMC…) → critères d'affinage. Le moteur de
   pertinence (`engine/relevance.ts`, déjà livré) estompe les champs sans effet.
3. **Position dérivée de l'intention** (plus de saisie de position) :
   `cible_atteinte` (dérivé) = `intention == optimiser OR intention == deprescrire` (à/au-dessous de la cible) ;
   `intention == intensifier` ou `initier` ⇒ `cible_atteinte = false` (objectif non atteint).
4. **`hba1c_sous_cible`** = **drapeau SAISI** « HbA1c < 6,5 % » (garde-fou ABSOLU, ne dépend pas de la cible du
   nœud A ; défaut false = sûr). `HbA1c_actuelle` reste saisissable (gate insuline catabolique HbA1c ≥ 10).

## 3. Les 4 intentions

| Intention | Suppose | Traitements | Geste(s) principal(aux) mis en avant |
|-----------|---------|-------------|--------------------------------------|
| **Initier** | naïf, objectif non atteint | non demandés (vides) | Metformine socle + agent protecteur selon comorbidité/terrain ; sinon palette glycémique (cf. §4.1). Insuline si catabolisme. |
| **Intensifier** | objectif **non atteint** | demandés | Ajout d'un levier glycémique — **palette élargie** (§4.1) priorisée par la comorbidité ; insuline en repli. |
| **Optimiser** | objectif **atteint**, ttt sous-optimal / intolérance / risque | demandés | Switch (SU/gliptine → agent protecteur), ajout d'un protecteur manquant (comorbidité à cible atteinte), réduction/arrêt d'un agent mal toléré. |
| **Déprescrire** | objectif **dépassé** ou **risque** | demandés | Allègement/arrêt/**réduction** — fort sur les hypoglycémiants ; ciblé sur les agents sans bénéfice/à risque (§4.3). |

## 4. Changements de CONTENU (⚠ ces points changent l'applicabilité → re-test focalisé)

### 4.1 Palette glycémique disponible SANS comorbidité (M3 — décision référent)
iSGLT2 **et** AR GLP-1 sont des leviers **glycémiques** à part entière, pas seulement des agents « de
comorbidité ». La comorbidité **priorise** (versant protecteur), elle ne **gate** plus la disponibilité.
- **O5 (iSGLT2)** : condition `… OR cible_atteinte == false` (dispo pour le contrôle glycémique quand objectif
  non atteint, même sans IC/rein/ASCVD). Priorité : comorbidité → rang protecteur (2-3) ; pur glycémique →
  rang plus bas. Garde-fous inchangés (exclu DFG<20, rétrogradé infections uro).
- **O6 (AR GLP-1)** : condition `… OR cible_atteinte == false`. **Garde-fous terrain inchangés** (exclu
  IMC<22 / dénutrition). Priorité idem.
- **O16** (« intensifier le contrôle glycémique ») : devient largement redondant avec O5/O6 élargis →
  à **fusionner/simplifier** (ou conserver comme cadrage « privilégier un agent sans hypoglycémie »).
- Conséquence M3 (obèse IMC≥30 + dénutrition + sans comorbidité + au-dessus) : **iSGLT2 proposé**
  (glycémique, sans hypo) ; GLP-1/tirzépatide exclus (dénutrition) ; **insuline en repli** (§4.2) ;
  place résiduelle SU/gliptine si demandée. Plus de sortie « poursuivre » muette.

### 4.2 Repli insuline quand la palette orale / GLP-1 est contre-indiquée ou épuisée (décision référent)
Nouvelle option **« Envisager l'insuline (ajustement fin → nœud E) »**, condition (à préciser à
l'implémentation) : `cible_atteinte == false` **ET** palette exhaustée — p. ex. `DFG < 30` (metformine + SU
sortis) **ou** incrétines exclues par le terrain (IMC<22 / dénutrition / refus) **et** pas d'autre agent oral
adapté. Cas type (B2) : **insuffisance rénale sévère + CI aux AR GLP-1 → l'insuline est souvent la seule
option**. Reste distinct du gate catabolique O1 (qui, lui, ne dépend pas de l'objectif).

### 4.3 Déprescrire — nuances (décision référent)
- **Fort sur les hypoglycémiants** (SU, glinide, insuline) : O13 inchangé (déclenché par `hba1c_sous_cible`
  à tout âge, ou hypo récente + terrain fragile). Jamais un agent protecteur.
- **Sinon, ciblé sur les agents ne couvrant pas un risque établi** (ou en **posant** un) : proposition
  d'arrêt/switch d'un agent sans bénéfice pour ce patient (ex. gliptine si un agent à bénéfice est possible ;
  iSGLT2 chez un patient sans IC/rein/ASCVD **et** infections uro récidivantes → switch vers une molécule sûre
  et bénéfique). **Peut aboutir à un switch** (non-étanche). *(Périmètre exact des agents concernés à geler.)*
- **Réduire ≠ arrêter** — **options DISTINCTES ciblées par traitement** (le praticien juge la dose, aucun
  dosage saisi) :
  - **« Réduire l'insuline »** (sur-basalisation, hypo) ;
  - **« Réduire l'AR GLP-1 »** (perte de poids excessive / tolérance digestive) ;
  - **« Réduire la metformine »** (baisse du DFG — O4 existant ; **ou intolérance** — trigger à ajouter).

### 4.4 B2 — Arrêter le sulfamide (DFG < 30)
Nouvelle option dédiée `traitements_en_cours contient sulfamide AND DFG < 30`, priorité 1 (sécurité), par
symétrie avec « Arrêter la metformine (DFG<30) ». Complète l'alerte A2c existante.

## 5. Affichage (UI, non-régressif)
Regroupement par intention : **« Votre intention : X → geste(s) principal(aux) »**, puis **« Par ailleurs,
indiqués aussi : … »** pour les gestes transverses (jamais masqués). Aucune option applicable n'est retirée
par l'intention. Alerte de **cohérence** si l'HbA1c saisie contredit l'intention (ex. intention = optimiser
mais `hba1c_sous_cible` coché → « envisager plutôt une déprescription »).

## 6. Périmètre du RE-TEST focalisé (pas un red-team complet)
Les garde-fous DURS (exclusions terrain, non-association, CI rénales, gate catabolique) **ne changent pas** →
pas de re-red-team intégral. Mais §4.1/§4.2/§4.3 **changent l'applicabilité** → vérifier par banc exécutable :
- palette glycémique élargie : un patient au-dessus **sans** comorbidité voit iSGLT2 (et GLP-1 si terrain ok),
  **jamais** GLP-1/tirzépatide si dénutri/IMC<22 ; pas de sur-proposition absurde.
- repli insuline : se déclenche en rénal sévère + CI GLP-1 ; ne se déclenche pas à tort (patient à cible).
- déprescrire : réductions distinctes bien ciblées ; jamais la déprescription d'un agent protecteur ;
  cohérence intention↔options (déprescrire ne masque pas un switch indiqué).
- non-régression des 21 profils existants + des garde-fous durs.

## 7. Décisions référent — GELÉES (2026-07-25)
1. **Palette glycémique** (§4.1) : **1re ligne = iSGLT2 + AR GLP-1** (bénéfices associés + pas d'hypo) ;
   **agents possibles avec limites = insuline, sulfamide, gliptine**. Pas de plancher (terrain gating suffit).
   ⇒ SU/gliptine ne sont plus DURS-gatés par `classes_a_benefice_indisponibles` : ils deviennent des options
   glycémiques de **bas rang** (dispo si `cible_atteinte == false`), le flag les **remontant** en rang.
2. **Repli insuline** (§4.2) : oui, y compris **metformine + iSGLT2 + AR GLP-1 toujours déséquilibré**
   (palette non-insulinique épuisée) ; + DFG < 20 ; + incrétines exclues par le terrain chez un patient déjà
   sous iSGLT2 et non contrôlé.
3. **Déprescrire — agents « ne couvrant pas un risque »** (§4.3) : **peut concerner TOUS les agents**, par
   priorité : d'abord ceux **sans autre bénéfice que le contrôle glycémique** (SU, gliptine) ; puis ceux à
   **bénéfice associé (rein/CV) mais sans le terrain** correspondant (iSGLT2/GLP-1 prescrits sans IC/rein/ASCVD).
   Jamais un agent couvrant un risque établi.
4. **O16** : **SUPPRIMÉE** (fonction absorbée par la palette élargie O5/O6 + SU/gliptine).
5. **Réductions distinctes par traitement** : insuline, AR GLP-1, **tirzépatide**, **sulfamide**, **glinide**,
   metformine. **PAS l'iSGLT2** (posologie unique en pratique ; empagliflozine titrable mais rare). Le
   praticien juge la dose, aucun dosage saisi.

## 8. Arbitrages post-vérification adversariale — GELÉS (2026-07-25)

Issus de la vérification 4 agents (toutes corrigées : 2 HAUTE + MOYENNE + BASSE, 158 tests verts) :
1. **Séquençage à l'initiation** : la palette glycémique PURE (dérivé `palette_glycemique_ouverte`) n'est
   ouverte à l'INITIATION que si HbA1c ≥ 8,5 % (sinon monothérapie metformine — HAS). En intensification, elle
   est ouverte quelle que soit l'amplitude. Les agents protecteurs par comorbidité restent indépendants de
   l'HbA1c.
2. **Ordre iSGLT2 vs AR GLP-1 en pur glycémique sans comorbidité** : **à égalité** de rang ; **iSGLT2 devant**
   si refus d'injection **ou IMC < 25**. Athérome/obésité → GLP-1 devant ; IC/rénal → iSGLT2 devant (inchangé).
3. **`nature_intolerance`** (digestive / uro_genitale / perte_poids / cutanee / autre) : cible l'agent des
   réductions (AR GLP-1/tirzépatide sur digestive+perte de poids ; metformine sur digestive) et l'alerte A5
   (digestive).
