# 2026-08-09 — D59 · Tri de la boîte mail de collecte en 4 labels Gmail

### Décision

Le tri manuel de `ebmmsp@gmail.com` (avant tout `moisson.md`/`screening.md` de semaine) applique 4
labels Gmail, à l'e-mail entier (pas à l'article individuel d'un digest) :

- `veille/breve` — candidat retenu, route brève.
- `veille/analyse` — candidat retenu, route analyse (seuil C1+C2+C3, `SOP_veille.md` §6bis).
- `veille/non-pertinent` — hors balayage routine ou hors critères d'inclusion (§6 SOP).
- `veille/hors-perimetre-orthophonie` — source légitime mais thème hors périmètre de production
  (D40) ; distinct de `non-pertinent`, pour ne pas confondre « mauvaise source » et « thème pas
  encore couvert ».

Détail des règles et des cas tranchés : `docs/veille/TRI_BOITE_MAIL.md`.

### Contexte

Une passe Gmail antérieure (labels `veille/traite-2026-W33` / `veille/non-pertinent`, 2026-08-01 au
2026-08-05) avait posé un tri binaire, sans distinguer brève/analyse ni isoler le cas orthophonie
(quelques NEJM Evidence/Clinician avaient été gardés en `traite`, avant que `SOURCES.md` ne tranche
explicitement leur exclusion le 2026-07-31). Cette session traite le reliquat de l'INBOX (60 threads,
2026-08-05 12h → 2026-08-09) et aligne le tri sur `SOP_veille.md` §4/§5bis/§6bis, déjà écrites mais
pas encore appliquées à la boîte mail elle-même.

### Alternatives envisagées

- **Garder le tri binaire existant** — écartée : ne reflète pas la distinction brève/analyse déjà
  actée en D38, qui est le cœur du modèle de données de la veille.
- **Fusionner l'orthophonie dans `non-pertinent`** — écartée : Glossa et unadreo sont des sources
  valides (revue scientifique, société savante), pas du bruit ; les y mélanger rendrait invisible le
  jour où un référent orthophonie ouvrirait le thème (D40).
- **Trier chaque article d'un digest multi-articles individuellement** — écartée pour cette passe :
  coût disproportionné pour un tri de boîte mail (pas encore un `screening.md`) ; le balayage Tier 1-2
  hebdomadaire retrouvera un signal important via une source pré-appréciée s'il l'est vraiment (limite
  déclarée dans `TRI_BOITE_MAIL.md`).

### Conséquences

- Aucun e-mail de la passe 2026-08-09 n'a franchi le seuil analyse (uniquement des digests/bulletins,
  pas d'étude isolée avec effet absolu chiffré) — cohérent avec `SOP_veille.md` §5bis : « une semaine
  peut ne rien contenir de pratique ».
- Le prochain cycle hebdomadaire réel (premier lundi de production) pourra réutiliser ces 4 labels
  directement pour l'étape 1-2 de `SOP_veille.md` §5.
- Écart assumé avec la première passe (`veille/traite-2026-W33`) sur NEJM Evidence/Clinician : motif
  documenté dans `TRI_BOITE_MAIL.md`, pas de retraitement rétroactif des 15 threads de cette première
  passe.
