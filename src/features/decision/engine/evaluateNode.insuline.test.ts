/**
 * Banc de vignettes EXÉCUTABLE du nœud `insuline` (`content/noeuds/diabete-type-2/insuline.yaml`).
 * Modèle de style : `evaluateNode.prescription.test.ts`. Ce nœud n'avait jusqu'ici AUCUNE vignette
 * clinique — celles-ci sont les premières, validées par le référent (tableau `E-01` à `E-09` du rapport
 * de tâche du 2026-07-26).
 *
 * LA RÈGLE QUI PRIME : la sortie attendue de chaque `it` vient du RÉFÉRENT, jamais du moteur exécuté a
 * posteriori pour en déduire l'attente. Quand attente et comportement divergent, la vignette est écrite
 * `it.fails` — elle DOIT échouer, et c'est le livrable : elle fige la divergence pour le chantier qui la
 * lèvera, au lieu de figer (à tort) le comportement actuel.
 *
 * Trois décisions référent du 2026-07-26 (2ᵉ lot) ont été implémentées dans `insuline.yaml` — les 4
 * vignettes ci-dessous sont passées d'`it.fails` à `it` en conséquence (cf. `DECISIONS.md` D20/D21 pour le
 * mécanisme `enAttente`/`exclusions` déjà en place par ailleurs, et `docs/decision/validation/
 * recette-2026-07-25-prescription-intensifier.md`, captures 7-10 et 12.1-12.12, pour le constat qui les
 * avait fait remonter ; changelog `insuline.yaml` v0.7 pour le détail de l'implémentation) :
 *  - E-02 — une situation « naïf » ET une « insuline basale » cochée dans les traitements est une
 *    incohérence de SAISIE ; une alerte de nœud le DIT désormais, plutôt que de seulement s'abstenir de
 *    proposer.
 *  - E-03 — le pivot de la situation « basale seule » devient le PROFIL NOCTURNE (`profil_glycemique`,
 *    renommé `profil_nocturne` le 2026-07-30, P8/S7 — cf. changelog `insuline.yaml` v0.34)
 *    quand `mcg_disponible == true` ; la glycémie à jeun (`gaj_a_cible`) reste le pivot du repli sans MCG.
 *  - E-06 (et le second volet d'E-04) — sécurité (réduire la basale / ne pas sur-titrer) et efficacité
 *    (traitement non insulinique ou ajout d'un bolus) sont désormais CUMULABLES : les 2 options
 *    d'intensification de « basale_plus_bolus » sont réutilisées en « basale seule » sur les 2 signaux
 *    nommés par le référent (hypoglycémie/variabilité nocturne, sur-basalisation).
 *
 * 4ᵉ lot (2026-07-26) — 3 vignettes supplémentaires (blocs `F2`/`F3`/`F4` ci-dessous), correctifs issus du
 * red-team clinique « silence et omission » (`docs/decision/validation/chantier-2026-07-26/
 * redteam-clinique-silences.md`), profils EXACTS du rapport. F3 (priorité, situation « basale_plus_bolus »
 * sans AUCUN garde-fou d'hypoglycémie sur ses options d'escalade), F2 (même situation, silence total une
 * fois les 2 options d'escalade épuisées malgré une cible non atteinte), F4 (`hypo_severe_recurrente`
 * absent du choix de la molécule à l'initiation, alors qu'il pilote déjà la désintensification plus loin
 * dans le même nœud — fusionné dans `risque_hypoglycemique_eleve`, cf. changelog `insuline.yaml` v0.10).
 *
 * Ce fichier n'exécute et ne modifie que ce nœud + le moteur RÉEL (`evaluateNode` + `deriveCritere`) ;
 * aucun autre fichier du dépôt n'est touché par cette tâche (trois agents écrivent en parallèle sur
 * d'autres nœuds).
 */
import { describe, expect, it } from 'vitest'
import { getNoeudById } from '../content/loadNodes.ts'
import { calculerCriteresDerives } from './deriveCritere.ts'
import { evaluateNode } from './evaluateNode.ts'
import { contraintesViolees } from './contraintes.ts'
import type { Criteria } from './conditions.ts'

const node = getNoeudById('insuline')
if (!node) throw new Error('Nœud "insuline" introuvable (content/noeuds/diabete-type-2/insuline.yaml).')

/**
 * Profil « neutre » cliniquement plausible : situation « basale seule », valeurs jamais à zéro par
 * accident (over_basalisation, gaj_a_cible… dépendent toutes de divisions/bornes sensibles à 0 — cf.
 * `docs/decision/validation/recette-2026-07-25-prescription-intensifier.md` 12.1-12.5). Les critères
 * dérivés (`cible_atteinte`, `risque_hypoglycemique_eleve`, `gaj_a_cible`, `over_basalisation`) sont recalculés par
 * `calculerCriteresDerives` à chaque appel ; les valeurs ici ne servent qu'à la lecture du profil neutre
 * (même convention que `evaluateNode.prescription.test.ts`).
 */
const BASE: Criteria = {
  situation_insuline: 'basale_seule',
  age: 60,
  HbA1c_actuelle: 7,
  HbA1c_cible: 7,
  DFG: 70,
  fragilite: false,
  esperance_vie: 'longue',
  risque_hypoglycemie_schema: 'faible',
  hypo_severe_recurrente: false,
  symptomes_glucotoxicite: false,
  traitements_en_cours: [],
  preference_injection: 'indifferent',
  mcg_disponible: false,
  TBR: 2,
  TBR_severe: 0,
  CV_glycemique: 20,
  // P8/S7 (2026-07-30) : `profil_glycemique` (liste) scindé en deux `enum` — `profil_nocturne` (masqué ici
  // par `mcg_disponible: false`) et `profil_entre_repas` (masqué ici par `situation_insuline:
  // 'basale_seule'`, ex-`hypo_interprandiale`, qui accuse le BOLUS et n'est donc recueilli que dans les
  // schémas qui en comportent un). Valeurs inertes.
  profil_nocturne: 'courbe_plate',
  profil_entre_repas: 'pas_de_signal',
  GAJ: 1.0,
  // Pivot « avant les repas » (arbitrage référent B, 2026-07-29). ⚠ CE CHAMP DOIT FIGURER ICI même
  // quand la vignette ne s'y intéresse pas : les dérivés `pre_repas_haute`/`pre_repas_basse` le
  // comparent numériquement, et `deriveCritere` résout un nom ABSENT du jeu de critères en la CHAÎNE de
  // son propre nom — d'où un `ConditionError` sur `>` entre valeurs non numériques, et non un simple
  // « faux ». Le formulaire réel ne rencontre pas ce cas (`buildDefaultCriteria` déclare tous les
  // critères) ; c'est le profil neutre écrit à la main qui doit rester exhaustif. Valeur À LA CIBLE,
  // donc inerte : ni `pre_repas_haute` ni `pre_repas_basse` ne se déclenchent.
  glycemie_pre_repas: 1.0,
  poids: 75,
  dose_basale_actuelle: 20,
  dose_rapide_actuelle: 5,
  cible_atteinte: true,
  risque_hypoglycemique_eleve: false,
  // Terrain justifiant une CIBLE relâchée — distinct de `risque_hypoglycemique_eleve` depuis le
  // 2026-07-27 : une hypo sévère appelle une correction du traitement, pas une cible plus permissive
  // (principe référent, déjà appliqué au nœud A).
  terrain_cible_assouplie: false,
  gaj_a_cible: true,
  over_basalisation: false,
}

/** Mode « tout est renseigné » (D20, repli) : comportement booléen strict, comme avant le chantier. */
function evalProfile(overrides: Partial<Criteria>) {
  const criteria = calculerCriteresDerives(node!.criteres_entree, { ...BASE, ...overrides } as Criteria)
  return evaluateNode(node!, criteria)
}

/**
 * Primitifs SAISISSABLES du nœud (tous types). Sert à construire un `renseignes` réaliste pour les
 * vignettes E-05/E-09.
 *
 * MISE À JOUR (2026-07-28, P4/S1, T-018, D30) : couvrait auparavant SEULEMENT `nombre`/`enum` — les
 * seuls types réellement indéterminables tant que non saisis sous l'ANCIEN régime (D20 : `bool`/`liste`
 * restaient déterminés par leur défaut). Depuis D30, `bool`/`liste` sont indéterminés par défaut EUX
 * AUSSI, sauf `presomption_non: true` — et `insuline` en déclare désormais un seul (`traitements_en_cours`) ;
 * `profil_entre_repas`, qui a succédé à `hypo_interprandiale` (P8/S7, 2026-07-30), est un `enum` — ce
 * mécanisme ne s'applique jamais à ce type (`critereEstDetermine`, `engine/deriveCritere.ts`) — les autres
 * (`mcg_disponible`, `profil_nocturne`…) restant indéterminables.
 * Ne couvrir que `nombre`/`enum` ici aurait rendu ces critères PERPÉTUELLEMENT indéterminés dans TOUTE
 * vignette utilisant ce helper, quelle que soit la valeur passée en `overrides` — défaut réel diagnostiqué
 * sur E-05 (`profil_nocturne`/`mcg_disponible` explicitement renseignés dans la vignette, mais jamais
 * marqués `renseignes`). Toutes les primitives sont donc désormais couvertes ; `presomption_non: true`
 * les rend de toute façon déterminées qu'elles soient ou non dans `renseignes` (`critereEstDetermine`),
 * donc les y inclure ne change rien pour elles — seul le comportement des critères SANS présomption est
 * corrigé par cet élargissement.
 */
const CRITERES_SAISISSABLES = node!.criteres_entree.filter((c) => c.derive == null).map((c) => c.nom)

/**
 * Mode TERNAIRE (D20/D30) : simule un formulaire où seuls les champs NON listés dans `nonRenseignes` ont
 * été effectivement saisis par le praticien — même convention que `evaluateNode.indetermine.test.ts` (une
 * valeur placeholder dans `overrides` ne rend pas le champ « renseigné » ; seule son absence de l'ensemble
 * `renseignes` compte).
 */
function evalProfileTernaire(overrides: Partial<Criteria>, nonRenseignes: string[]) {
  const criteria = calculerCriteresDerives(node!.criteres_entree, { ...BASE, ...overrides } as Criteria)
  const renseignes = new Set(CRITERES_SAISISSABLES.filter((nom) => !nonRenseignes.includes(nom)))
  return evaluateNode(node!, criteria, renseignes)
}

const titles = (o: Partial<Criteria>) => evalProfile(o).applicable.map((opt) => opt.intitule)
const excludedTitles = (o: Partial<Criteria>) => [...evalProfile(o).excluded.keys()].map((opt) => opt.intitule)
const alertMsgs = (o: Partial<Criteria>) => evalProfile(o).alertes.map((a) => a.message)
/** Contraintes de SAISIE violées par un profil (canal `Noeud.contraintes`, distinct des alertes). */
const violations = (o: Partial<Criteria>) =>
  contraintesViolees(node!, calculerCriteresDerives(node!.criteres_entree, { ...BASE, ...o } as Criteria))
const has = (list: string[], sub: string) => list.some((t) => t.includes(sub))

// Intitulés exacts (substrings sans apostrophe ni exposant, pour éviter tout piège de codage de
// caractère — même précaution que `GLP1` dans `evaluateNode.prescription.test.ts`).
const GLP1_NAIF = 'Envisager un GLP-1'
const INITIER_BASALE = 'Initier une insuline basale'
const ANALOGUE_2G = 'Choisir un analogue basal'
const CORRIGER_HYPO = "Corriger l'hypoglycémie ou la variabilité"
// T-067 (P12/S4, 2026-08-02) : nouvelle carte, déclenchée par le seul signal `profil_nocturne ==
// baisse_continue` — retiré des déclencheurs de `CORRIGER_HYPO` ci-dessus (qui garde TBR/CV/GAJ basse).
const REDUIRE_BASALE = 'Réduire la basale'
const NE_PAS_SURTITRER = 'Ne pas sur-titrer la basale'
const TITRER = 'Titrer la basale'
const AJOUTER_GLP1_BB = 'Ajouter un GLP-1 / une association fixe'
const AJOUTER_BOLUS = 'Ajouter un bolus au repas principal'
const DESINTENSIFIER = 'Désintensifier / alléger le schéma'
const OPTIMISER_BB = 'Optimiser la répartition du basal-bolus'
const POURSUIVRE = 'Poursuivre le schéma'

describe('insuline — E-01 : naïf, HbA1c au-dessus de la cible, pas de GLP-1 en cours', () => {
  it('GLP-1 (avant/avec l\'insuline) ET initiation d\'une basale sont TOUTES DEUX applicables (gestes cumulables, pas une alternative)', () => {
    const o = {
      situation_insuline: 'naif',
      HbA1c_actuelle: 9,
      HbA1c_cible: 7,
      traitements_en_cours: [],
      symptomes_glucotoxicite: false,
    } as Partial<Criteria>
    const t = titles(o)
    expect(has(t, GLP1_NAIF)).toBe(true)
    expect(has(t, INITIER_BASALE)).toBe(true)
    // Un naïf fragile n'est pas ce profil (âge 60, non fragile, EV longue) : pas d'analogue 2ᵉ génération ici.
    expect(has(t, ANALOGUE_2G)).toBe(false)
  })
})

describe('insuline — décisions référent 2026-07-26 implémentées (E-02/E-03/E-06, cf. changelog insuline.yaml v0.7)', () => {
  it.each([['insuline_basale'], ['insuline_rapide']])(
    'E-02 — naïf ET « %s » déjà cochée dans les traitements : incohérence de SAISIE, l\'outil le DIT. ' +
      'Référent (2026-07-26) : « si il est naïf, il ne peut pas avoir une basale dans son traitement. » ' +
      'Le prérequis 12.10 (recette 2026-07-25) fait déjà taire SILENCIEUSEMENT « Initier une insuline ' +
      'basale » — correct pour l\'absence de l\'option, mais insuffisant seul : le praticien doit être ' +
      'averti que sa SAISIE est contradictoire. ' +
      'CANAL CHANGÉ le 2026-07-27 : ce fait vivait dans une alerte de nœud faute de mieux — son propre ' +
      'commentaire disait « c\'est une incohérence de SAISIE, pas une observation clinique sur le ' +
      'patient ». Il est désormais porté par `Noeud.contraintes`, donc affiché DANS LE FORMULAIRE, à côté ' +
      'des deux champs qui se contredisent, plutôt que dans le panneau de résultats entre des conduites ' +
      'cliniques. Portée élargie au passage : l\'alerte ne couvrait que `insuline_basale` — d\'où les deux ' +
      'cas de ce test.',
    (traitement) => {
      const o = {
        situation_insuline: 'naif',
        traitements_en_cours: [traitement],
        HbA1c_actuelle: 9,
        HbA1c_cible: 7,
      } as Partial<Criteria>
      // Le fait est dit — et il nomme la contradiction, sans laisser deviner laquelle des deux valeurs
      // corriger (l'outil ne peut pas le savoir). VRAI DES DEUX CÔTÉS, c'est l'élargissement de portée.
      const violees = violations(o)
      expect(violees).toHaveLength(1)
      expect(violees[0].message).toMatch(/contradictoires/i)

      // L'OPTION, elle, ne se comporte pas pareil selon l'insuline cochée, et c'est CORRECT — vérifié
      // plutôt que supposé au moment d'élargir ce test. Sous BASALE : « Initier une insuline basale » se
      // tait (prérequis 12.10, 2026-07-25) — on n'initie pas ce qui est déjà là. Sous RAPIDE seule : elle
      // reste proposée, et c'est un geste légitime (un patient sous bolus sans basale peut en recevoir
      // une) ; ce qui cloche dans ce profil est la déclaration « naïf », que la contrainte dit déjà.
      expect(has(titles(o), INITIER_BASALE)).toBe(traitement === 'insuline_rapide')
    },
  )

  it(
    'E-03 — le pivot est le PROFIL NOCTURNE (MCG), pas la glycémie à jeun. ' +
      'Référent (2026-07-26, répété 3 fois, dont recette capture 8) : « titrer sur la courbe nocturne, pas ' +
      'la GAJ ; la GAJ est le cas de repli quand il n\'y a pas de MCG, ce qui est maintenant rare. » ' +
      'Refonte implémentée : `mcg_disponible == true` → le profil nocturne (`profil_nocturne_permet_titration` / ' +
      '`profil_nocturne_a_cible`) gouverne le choix titrer / ne-pas-titrer ; repli sur la GAJ (`gaj_a_cible`) ' +
      'seulement si `mcg_disponible == false` (cf. `insuline.yaml`, changelog v0.7). ' +
      'Ici : MCG disponible, profil nocturne en HAUSSE CONTINUE (couverture insuffisante), HbA1c au-dessus ' +
      'de la cible → la titration est admise sur ce motif nocturne, alors même que la GAJ, par ailleurs ' +
      'déclarée « à la cible », aurait routé vers « Ne pas sur-titrer » sous l\'ancien pivot — c\'est ' +
      'exactement le renversement demandé par le référent. ⚠ VALEUR MISE À JOUR le 2026-07-30 (P8/S7) : ' +
      'l\'ancien profil « stable » (ex-`profil_glycemique`) admettait AUSSI la titration jusqu\'à cette ' +
      'session ; ce n\'est plus le cas (la courbe PLATE route désormais vers « Ne pas sur-titrer... », cf. ' +
      'changelog `insuline.yaml` v0.34) — la hausse continue reste la valeur qui isole proprement le pivot ' +
      'NOCTURNE testé ici, indépendamment de ce changement.',
    () => {
      const o = {
        situation_insuline: 'basale_seule',
        mcg_disponible: true,
        profil_nocturne: 'hausse_continue',
        HbA1c_actuelle: 8,
        HbA1c_cible: 7,
        GAJ: 1.0, // « à la cible » : c'est justement ce qui, aujourd'hui, empêche la titration
        TBR: 2,
        TBR_severe: 0,
        CV_glycemique: 20,
        dose_basale_actuelle: 20,
        poids: 75,
      } as Partial<Criteria>
      expect(has(titles(o), TITRER)).toBe(true)
    },
  )

  it(
    'E-06 — sécurité/ajustement ET efficacité sont désormais CUMULABLES (défaut recette capture 9, corrigé ' +
      '2026-07-26). Référent (2026-07-26) : « oui, action de contrôle glycémique en fonction des autres ' +
      'critères : soit un traitement non insulinique, soit ajouter un bolus. » En situation « basale seule ' +
      '», une hypoglycémie nocturne continue d\'exclure À LA FOIS « Titrer la basale » ET « Ne pas ' +
      'sur-titrer… » (leurs deux jeux d\'`exclusions` portent la même clause `profil_nocturne == ' +
      'baisse_continue`, ex-`profil_glycemique contient hypo_nocturne`) — mais le geste « Réduire la ' +
      'basale » (ex-« Corriger l\'hypoglycémie… », déplacé T-067/P12-S4 le 2026-08-02) n\'est plus seul : ' +
      'une option d\'efficacité cumulable (traitement non insulinique OU ajout d\'un bolus), réutilisée ' +
      'telle quelle depuis la situation « basale_plus_bolus », répond désormais à l\'HbA1c (8 % vs cible ' +
      '7 %) restée au-dessus de la cible.',
    () => {
      const o = {
        situation_insuline: 'basale_seule',
        // T-033 (P5/S2, 2026-07-28, BILAN-P4 §3bis) : `profil_nocturne` (ex-`profil_glycemique`, P8/S7
        // 2026-07-30) est une lecture AGP — un signal MCG au même titre que TBR/TBR_severe/CV_glycemique.
        // Sans `mcg_disponible: true` explicite ici, cette vignette décrirait un patient incohérent (profil
        // AGP renseigné sans capteur), et les 4 champs de capteur sont désormais masqués (donc inertes)
        // dans ce cas — cf. `visible_si` du nœud.
        mcg_disponible: true,
        profil_nocturne: 'baisse_continue',
        HbA1c_actuelle: 8,
        HbA1c_cible: 7,
        GAJ: 1.0,
        TBR: 2,
        TBR_severe: 0,
        CV_glycemique: 20,
        dose_basale_actuelle: 20,
        poids: 75,
      } as Partial<Criteria>
      const t = titles(o)
      // T-067 (P12/S4, 2026-08-02) : ce signal (baisse continue nocturne, seul) ne déclenche plus
      // « Corriger l'hypoglycémie… » (qui garde TBR/CV/GAJ basse) mais la carte dédiée « Réduire la
      // basale », chiffrée — le cas de non-régression demandé par `plans/P8/S9.md` étape 1.
      expect(has(t, REDUIRE_BASALE)).toBe(true)
      expect(has(t, CORRIGER_HYPO)).toBe(false)
      // Manquant : aucun geste d'efficacité cumulé (non insulinique ou bolus) n'accompagne l'ajustement.
      expect(t.some((intitule) => /GLP-1|bolus/i.test(intitule))).toBe(true)
    },
  )

  // MIROIR du cas ci-dessus (P8/S9 étape 1) : un TBR élevé SANS baisse continue nocturne doit toujours
  // afficher « Corriger l'hypoglycémie ou la variabilité » — le déplacement du seul déclencheur de FORME
  // ne doit rien retirer aux trois déclencheurs de SEUIL qui restent sur cette option.
  it(
    'T-067 (P12/S4, 2026-08-02) — miroir de non-régression : TBR > 4 SANS baisse continue nocturne ' +
      'continue de déclencher « Corriger l\'hypoglycémie ou la variabilité » (déclencheur de SEUIL, ' +
      'inchangé), et PAS « Réduire la basale » (déclencheur de FORME, absent ici).',
    () => {
      const o = {
        situation_insuline: 'basale_seule',
        mcg_disponible: true,
        TBR: 5,
        CV_glycemique: 20,
        profil_nocturne: 'courbe_plate',
        HbA1c_actuelle: 8,
        HbA1c_cible: 7,
        dose_basale_actuelle: 20,
        poids: 75,
      } as Partial<Criteria>
      const t = titles(o)
      expect(has(t, CORRIGER_HYPO)).toBe(true)
      expect(has(t, REDUIRE_BASALE)).toBe(false)
    },
  )
})

describe(
  'insuline — vignette N11 (recette praticien naïf 2026-08-02, critère de fin de plans/P12/S4.md) : ' +
    'insuline + capteur, basal-bolus COMPLET, baisse continue nocturne',
  () => {
    it(
      'Mme Renard (68 ans, capteur, hypoglycémies nocturnes) — le moteur connaît déjà la branche ' +
        '(profil AGP = baisse continue), et « Réduire la basale » nomme désormais le geste ET le chiffre, ' +
        'au lieu de laisser le praticien apparier lui-même dans « Optimiser la répartition du ' +
        'basal-bolus ». « Corriger l\'hypoglycémie… » reste fermée en `basal_bolus` (bénéfice de bord de ' +
        'B3a : la nouvelle carte, ouverte partout où il y a une basale, comble ce trou aussi ici).',
      () => {
        const o = {
          situation_insuline: 'basal_bolus',
          mcg_disponible: true,
          profil_nocturne: 'baisse_continue',
          HbA1c_actuelle: 8,
          HbA1c_cible: 7,
          TBR: 2,
          CV_glycemique: 20,
          dose_basale_actuelle: 24,
          dose_rapide_actuelle: 10,
          poids: 80,
        } as Partial<Criteria>
        const t = titles(o)
        expect(has(t, REDUIRE_BASALE)).toBe(true)
        // Bénéfice de bord de B3a : `basal_bolus` reste hors périmètre de `CORRIGER_HYPO` (inchangé).
        expect(has(t, CORRIGER_HYPO)).toBe(false)
        // La carte générale continue de s'afficher à côté : pas de doublon retiré, coexistence voulue.
        expect(has(t, OPTIMISER_BB)).toBe(true)
        // Le chiffre est bien câblé sur l'option (patron exact de « Basale après +2 U »), condition
        // nécessaire à ce que la carte porte un chiffre à l'écran (le rendu lui-même est hors périmètre
        // moteur, cf. `lib/vueDecision.ts`/`OptionCard.tsx`).
        const option = evalProfile(o).applicable.find((opt) => opt.intitule === REDUIRE_BASALE)
        expect(option?.calculs).toEqual([
          { libelle: 'Basale réduite (−2 U)', expression: 'dose_basale_actuelle - 2', unite: 'U/j' },
        ])
      },
    )
  },
)

describe('insuline — E-04 : sur-basalisation réelle (dose 40 U / poids 70 kg), GAJ hors cible', () => {
  // ATTENTE RÉVISÉE le 2026-07-27 (arbitrage référent, après collecte + red-team). Cette vignette
  // exigeait que « Titrer la basale » soit ÉCARTÉE au-dessus de 0,5 U/kg. Le seuil ne porte plus cette
  // exclusion : issu d'un post-hoc non pré-spécifié, retiré des Standards ADA en 2025 (maintenu par
  // l'AACE), jamais testé comme règle de décision, et coupant au milieu de la plage de doses d'entretien
  // réellement atteintes à la cible (0,34-0,78 U/kg). Les DEUX cartes coexistent désormais et le rang
  // hiérarchise : le praticien voit la lecture « titrer » et la lecture « intensifier autrement », et
  // arbitre — ce qu'il est le seul à pouvoir faire chez un patient dont la nuit reste hors cible (ici
  // GAJ 1,5 g/L). Le geste alternatif reste poussé, ce qui était l'objet réel du correctif de la veille.
  it('E-04a — « Titrer la basale » et « Ne pas sur-titrer… » coexistent (exclusion retirée le 2026-07-27)', () => {
    const o = {
      situation_insuline: 'basale_seule',
      poids: 70,
      dose_basale_actuelle: 40, // 40/70 ≈ 0,571 U/kg > 0,5 U/kg → over_basalisation vrai
      GAJ: 1.5, // hors cible [0,70-1,20]
      HbA1c_actuelle: 8,
      HbA1c_cible: 7,
      TBR: 2,
      TBR_severe: 0,
      CV_glycemique: 20,
      profil_nocturne: 'courbe_plate', // mcg_disponible non défini ici (BASE: false) : champ inerte.
    } as Partial<Criteria>
    expect(has(titles(o), TITRER)).toBe(true)
    expect(has(excludedTitles(o), TITRER)).toBe(false)
    // Le point qui compte cliniquement n'a pas changé : l'alternative est POUSSÉE, pas laissée en prose.
    expect(has(titles(o), NE_PAS_SURTITRER)).toBe(true)
  })

  it(
    'E-04b — la sur-basalisation « suggère désormais d\'autres pistes de contrôle glycémique » (référent ' +
      '2026-07-26, même décision implémentée que E-06). En situation « basale seule », la carte ' +
      '« Ne pas sur-titrer… » continue de s\'afficher, mais elle n\'est plus seule : le levier GLP-1/bolus, ' +
      'qui ne figurait qu\'en PROSE (dans `avantages`), est désormais aussi une option distincte et ' +
      'actionnable — réutilisée depuis la situation « basale_plus_bolus », qui portait déjà « Ajouter un ' +
      'GLP-1 / une association fixe ».',
    () => {
      const o = {
        situation_insuline: 'basale_seule',
        poids: 70,
        dose_basale_actuelle: 40,
        GAJ: 1.5,
        HbA1c_actuelle: 8,
        HbA1c_cible: 7,
        TBR: 2,
        TBR_severe: 0,
        CV_glycemique: 20,
        profil_nocturne: 'courbe_plate', // mcg_disponible non défini ici (BASE: false) : champ inerte.
      } as Partial<Criteria>
      expect(has(titles(o), AJOUTER_GLP1_BB)).toBe(true)
    },
  )
})

describe('insuline — E-05 : même sur-basalisation qu\'E-04, mais poids NON renseigné (D20)', () => {
  // ATTENTE RÉVISÉE le 2026-07-27, en même temps qu'E-04a : `over_basalisation` n'étant plus une
  // exclusion de « Titrer la basale », un poids non renseigné ne met plus CETTE option en attente. Le
  // mécanisme D20 qu'elle démontrait reste vérifié, mais sur l'option qui dépend RÉELLEMENT du poids —
  // « Ne pas sur-titrer… », dont `over_basalisation` est le déclencheur. La vignette gagne au change :
  // elle vérifie désormais les deux bords à la fois, l'option retenue en attente ET celle qui ne doit
  // plus l'être. Le défaut qu'elle protégeait à l'origine (écarter une option sur une exclusion qu'on ne
  // peut pas trancher) reste couvert.
  it('un poids non renseigné met « Ne pas sur-titrer… » EN ATTENTE, et ne retient plus « Titrer la basale »', () => {
    const o = {
      situation_insuline: 'basale_seule',
      dose_basale_actuelle: 40,
      GAJ: 1.5, // hors cible, renseignée
      HbA1c_actuelle: 8,
      HbA1c_cible: 7,
      TBR: 2,
      TBR_severe: 0,
      CV_glycemique: 20,
      // `hausse_continue`, et non `courbe_plate` : depuis le 2026-07-30 (P8/S7), une courbe PLATE rend
      // `profil_nocturne_a_cible` VRAI, ce qui résoudrait « Ne pas sur-titrer... » de façon déterminée
      // (indépendamment du poids manquant) et casserait cette vignette — elle teste spécifiquement la
      // dépendance au poids via `over_basalisation`, donc a besoin d'un profil qui ne déclenche NI
      // `profil_nocturne_a_cible` NI l'exclusion sur `baisse_continue`.
      profil_nocturne: 'hausse_continue',
      mcg_disponible: true,
    } as Partial<Criteria>
    const res = evalProfileTernaire(o, ['poids'])
    const optTitrer = node!.options.find((opt) => opt.intitule.includes(TITRER))!
    const optNePasSurtitrer = node!.options.find((opt) => opt.intitule.includes(NE_PAS_SURTITRER))!

    // L'option qui DÉPEND du poids est retenue en attente, avec le critère à renseigner nommé —
    // ni écartée à tort sur une condition qu'on ne peut pas trancher, ni proposée en silence.
    expect(res.enAttente.get(optNePasSurtitrer)).toEqual(['poids'])
    expect(res.applicable.map((o2) => o2.intitule)).not.toContain(optNePasSurtitrer.intitule)
    expect([...res.excluded.keys()].map((o2) => o2.intitule)).not.toContain(optNePasSurtitrer.intitule)

    // L'option qui n'en dépend plus n'est plus retenue en otage par un poids manquant.
    expect(res.enAttente.has(optTitrer)).toBe(false)
    expect([...res.excluded.keys()].map((o2) => o2.intitule)).not.toContain(optTitrer.intitule)
  })
})

describe('insuline — E-07/E-08 : « risque_hypoglycemique_eleve » inclut l\'âge (arbitrage référent 2026-07-26, D20/D21 2ᵉ série)', () => {
  it('E-07 — 80 ans, HbA1c 6 % pour une cible de 7 %, basal-bolus, case « fragile » NON cochée : « Désintensifier / alléger le schéma » apparaît quand même', () => {
    const o = {
      situation_insuline: 'basal_bolus',
      age: 80,
      HbA1c_actuelle: 6,
      HbA1c_cible: 7,
      fragilite: false,
      esperance_vie: 'longue',
      risque_hypoglycemie_schema: 'faible',
      hypo_severe_recurrente: false,
    } as Partial<Criteria>
    expect(has(titles(o), DESINTENSIFIER)).toBe(true)
  })

  it('E-08 — basal-bolus, à l\'objectif, ni hypoglycémie ni variabilité : repli « Poursuivre le schéma… et réévaluer »', () => {
    const o = {
      situation_insuline: 'basal_bolus',
      age: 60,
      HbA1c_actuelle: 7,
      HbA1c_cible: 7,
      fragilite: false,
      esperance_vie: 'longue',
      risque_hypoglycemie_schema: 'faible',
      hypo_severe_recurrente: false,
      TBR: 2,
      TBR_severe: 0,
      CV_glycemique: 20,
      profil_nocturne: 'courbe_plate', // mcg_disponible non défini ici (BASE: false) : champ inerte.
    } as Partial<Criteria>
    const t = titles(o)
    expect(has(t, POURSUIVRE)).toBe(true)
    expect(has(t, DESINTENSIFIER)).toBe(false)
    expect(has(t, OPTIMISER_BB)).toBe(false)
  })
})

/**
 * E-09 — VIGNETTE RÉVISÉE le 2026-07-27, et le motif de la révision vaut d'être lu.
 *
 * Sa dernière assertion exigeait que le repli « Poursuivre le schéma d'insuline en cours » RESTE ACTIF
 * sur formulaire vierge (« ses conditions sont vacuité pure »). C'était l'attente référent du
 * 2026-07-26, et elle décrivait fidèlement le moteur d'alors.
 *
 * La recette référent du 2026-07-27 sur le déployé l'a renversée, en classant le fait observé en
 * 🔴 SÉCURITÉ (défaut B, symptôme A4) : **« Poursuivre le schéma d'insuline en cours » proposé à un
 * patient NAÏF d'insuline**, avec le badge « Recommandée », pendant que les 9 options du nœud étaient
 * en attente. Deux énoncés du référent se contredisent ; le plus récent tranche, et il tranche sur
 * pièces — il décrit ce que l'écran a réellement montré en consultation.
 *
 * Ce que la première rédaction n'avait pas vu : « les conditions du repli sont vacuité pure » est vrai
 * du MOTEUR et faux du SENS. Le repli ne dit pas « rien d'autre ne s'applique », il dit « objectif
 * atteint, sans hypoglycémie ni variabilité » — une affirmation sur un patient dont, à cet instant, on
 * ne sait rien. Cf. `engine/evaluateNode.ts`, révision de D20.
 */
describe('insuline — E-09 : formulaire vierge (`renseignes` vide, D20 révisé 2026-07-27)', () => {
  it('les options qui dépendent de `situation_insuline` passent EN ATTENTE, et le repli est SUSPENDU avec elles', () => {
    const res = evalProfileTernaire({}, CRITERES_SAISISSABLES)
    const optNaif = node!.options.find((opt) => opt.intitule.includes(GLP1_NAIF))!
    const optTitrer = node!.options.find((opt) => opt.intitule.includes(TITRER))!
    const optDesintensifier = node!.options.find((opt) => opt.intitule.includes(DESINTENSIFIER))!
    const optAjouterBolus = node!.options.find((opt) => opt.intitule.includes(AJOUTER_BOLUS))!

    expect(res.enAttente.has(optNaif)).toBe(true)
    expect(res.enAttente.has(optTitrer)).toBe(true)
    expect(res.enAttente.has(optDesintensifier)).toBe(true)
    expect(res.enAttente.has(optAjouterBolus)).toBe(true)
    // Le cœur de la révision : plus aucune conduite n'est PROPOSÉE tant que le moteur est en attente.
    expect(has(res.applicable.map((opt) => opt.intitule), POURSUIVRE)).toBe(false)
    expect(res.applicable).toEqual([])
    // I2′ reste tenu : la sortie n'est pas vide au sens de l'écran — le bloc EN ATTENTE prend le relais,
    // et il est non vide par construction dans cette branche.
    expect(res.enAttente.size).toBeGreaterThan(0)
  })
})

describe(
  'insuline — F3 (redteam-clinique-silences.md, 2026-07-26, PRIORITÉ) : « basale_plus_bolus », ' +
    'aucun garde-fou d\'hypoglycémie sur les 2 options d\'escalade — 401/401 profils à risque du banc',
  () => {
    it(
      'profil EXACT du rapport (âge 105, TBR=1 %, hypo_severe_recurrente=true, GLP-1/tirzépatide déjà ' +
        'en place) — ATTENTE RÉÉCRITE le 2026-07-29 : « Ajouter un bolus » n\'est PLUS exclue. Un ' +
        'antécédent d\'hypoglycémie sévère sous un schéma antérieur ne présume pas du risque sous le ' +
        'schéma actuel et ne retire plus aucun geste (arbitrage référent, passe A). L\'escalade reste ' +
        'donc offerte, et « Corriger l\'hypoglycémie... » ne l\'est plus sur ce seul signal ; c\'est ' +
        'désormais une ALERTE de nœud qui porte la prudence.',
      () => {
        const o = {
          situation_insuline: 'basale_plus_bolus',
          age: 105,
          HbA1c_actuelle: 6.86,
          HbA1c_cible: 6,
          fragilite: false,
          hypo_severe_recurrente: true,
          TBR: 1,
          traitements_en_cours: ['iSGLT2', 'tirzepatide', 'sulfamide'],
        } as Partial<Criteria>
        const t = titles(o)
        const excl = excludedTitles(o)
        // ─────────────────────────────────────────────────────────────────────────────────────────
        // POURQUOI CETTE VIGNETTE A CHANGÉ DE SENS, et pourquoi ce n'est pas un affaiblissement.
        // Écrite le 2026-07-26 (finding F3), elle figeait le fait que `hypo_severe_recurrente` EXCLUAIT
        // les 2 options d'escalade en « basale_plus_bolus ». Cette extension portait dès son écriture la
        // mention « choix référent À CONFIRMER (invariant 6) » — elle n'a jamais été confirmée, et le
        // référent l'a INFIRMÉE le 2026-07-29 : « un antécédent d'hypoglycémie sévère sous un ANCIEN
        // schéma ne présume pas du risque sous le schéma ACTUEL. Il ne doit pas empêcher de titrer. »
        // Le fait de sécurité n'a pas disparu : il a changé de canal (R8) — d'`exclusions`, qui retire,
        // vers une `alertes` de nœud, qui qualifie. Le patient de ce profil voit donc l'escalade ET
        // l'avertissement, au lieu de voir l'escalade retirée sans pouvoir la rouvrir.
        // ─────────────────────────────────────────────────────────────────────────────────────────
        expect(has(excl, AJOUTER_BOLUS)).toBe(false)
        expect(has(t, AJOUTER_BOLUS)).toBe(true)
        // Inchangé et indépendant de l'arbitrage : jamais candidate, tirzépatide déjà en cours (prérequis).
        expect(has(t, AJOUTER_GLP1_BB)).toBe(false)
        // Le geste correctif n'est plus déclenché par le seul antécédent (arbitrage A) ; l'optimisation
        // des doses actuelles (finding F2, même lot de 2026-07-26) reste offerte — jamais un silence.
        expect(has(t, CORRIGER_HYPO)).toBe(false)
        expect(has(t, OPTIMISER_BB)).toBe(true)
      },
    )
  },
)

describe(
  'insuline — F2 (redteam-clinique-silences.md, 2026-07-26) : « basale_plus_bolus », GLP-1 ET bolus ' +
    'déjà en place, cible non atteinte — 60/92 profils du banc réduits au seul repli avant ce lot',
  () => {
    it(
      'profil du rapport (« un patient déjà sous metformine + aGLP1 + insuline basale + insuline rapide, ' +
        'HbA1c 9 % pour une cible à 7 %, sans hypoglycémie ») : « Optimiser la répartition du ' +
        'basal-bolus » — réutilisée depuis la situation « basal_bolus » — comble le silence, le repli ' +
        '« Poursuivre... » ne s\'active plus.',
      () => {
        const o = {
          situation_insuline: 'basale_plus_bolus',
          traitements_en_cours: ['metformine', 'aGLP1', 'insuline_basale', 'insuline_rapide'],
          HbA1c_actuelle: 9,
          HbA1c_cible: 7,
          TBR: 2,
          TBR_severe: 0,
          CV_glycemique: 20,
          profil_nocturne: 'courbe_plate', // mcg_disponible non défini ici (BASE: false) : champ inerte.
          hypo_severe_recurrente: false,
          dose_basale_actuelle: 30,
          dose_rapide_actuelle: 10,
          poids: 80,
        } as Partial<Criteria>
        const t = titles(o)
        // Les 2 gestes d'ajout sont bien épuisés (prérequis : classes déjà en cours) — pas rouverts par ce lot.
        expect(has(t, AJOUTER_GLP1_BB)).toBe(false)
        expect(has(t, AJOUTER_BOLUS)).toBe(false)
        // Le silence est comblé : dose totale quotidienne = 30 + 10 = 40 U/j (calcul déjà câblé).
        expect(has(t, OPTIMISER_BB)).toBe(true)
        expect(has(t, POURSUIVRE)).toBe(false)
      },
    )
  },
)

describe(
  'insuline — F4 (redteam-clinique-silences.md, 2026-07-26) : `hypo_severe_recurrente` absent du choix ' +
    'de la molécule à l\'initiation — arbitrage I3, fusionné dans `risque_hypoglycemique_eleve`',
  () => {
    it(
      'profil EXACT du rapport (naïf, 74 ans, non fragile, EV longue, risque de schéma faible, SEUL ' +
        'signal = hypo_severe_recurrente) : « Choisir un analogue basal de 2ᵉ génération » devient ' +
        'applicable — auparavant silencieuse malgré ce signal, alors qu\'il pilotait déjà (en OR littéral) ' +
        'la désintensification du basal-bolus plus loin dans ce même nœud.',
      () => {
        const o = {
          situation_insuline: 'naif',
          age: 74,
          HbA1c_actuelle: 14.27,
          HbA1c_cible: 8.25,
          fragilite: false,
          esperance_vie: 'longue',
          risque_hypoglycemie_schema: 'faible',
          hypo_severe_recurrente: true,
          traitements_en_cours: ['aGLP1', 'sulfamide', 'gliptine'],
        } as Partial<Criteria>
        const t = titles(o)
        expect(has(t, ANALOGUE_2G)).toBe(true)
        expect(has(t, INITIER_BASALE)).toBe(true)
        // Déjà sous aGLP1 : cette option reste hors jeu (prérequis), non contestée par cette vignette.
        expect(has(t, GLP1_NAIF)).toBe(false)
      },
    )
  },
)

/**
 * ARBITRAGES RÉFÉRENT DU 2026-07-27 — trois décisions, trois vignettes. Aucune n'est visible dans le
 * golden master : les 180 profils gelés n'en contiennent pas la combinaison exacte (le générateur
 * cumule volontiers plusieurs signaux d'hypoglycémie à la fois, alors que ces vignettes testent
 * précisément le cas où UN SEUL est présent). C'est la démonstration, sur un cas réel, de ce que le
 * banc de caractérisation ne peut pas montrer — et donc de ce à quoi servent les vignettes.
 */
describe('insuline — arbitrages référent du 2026-07-27', () => {
  // `CORRIGER_HYPO` / `OPTIMISER_BB` sont déjà déclarés en tête de fichier — réutilisés tels quels.
  it(
    'A27-1 — RÉÉCRITE le 2026-07-29 : basale SEULE, antécédent d\'hypo sévère récurrente pour SEUL ' +
      'signal (MCG rassurante) — le geste correctif n\'est PLUS proposé sur ce seul signal, et une ' +
      'ALERTE de nœud porte désormais la prudence',
    () => {
      const o = {
        situation_insuline: 'basale_seule',
        hypo_severe_recurrente: true,
        // Les 4 signaux MCG sont explicitement RASSURANTS : rien d'autre que l'antécédent ne parle.
        mcg_disponible: true, TBR: 1, CV_glycemique: 20,
        profil_nocturne: 'courbe_plate',
      } as Partial<Criteria>
      // ───────────────────────────────────────────────────────────────────────────────────────────
      // DEUX ARBITRAGES SUCCESSIFS SUR LE MÊME PROFIL, et le second amende le premier.
      // 2026-07-27 : « un antécédent d'hypo sévère récurrente est une propriété DU PATIENT, pas du
      //   schéma » → le geste correctif est généralisé à toutes les situations. Cette vignette figeait
      //   ce gain.
      // 2026-07-29 : « un antécédent sous un ANCIEN schéma ne présume pas du risque sous le schéma
      //   ACTUEL. Il ne doit pas empêcher de titrer. » → le signal cesse de COMMANDER une baisse de
      //   dose.
      // Les deux se réconcilient sur la PORTÉE, qui reste universelle : ce qui change est le CANAL.
      // Une alerte de nœud n'est gatée par aucune situation — l'avertissement suit donc le patient
      // partout, ce que voulait l'arbitrage de 2026-07-27, sans prescrire un geste que le seul
      // antécédent ne justifie pas. C'est aussi ce qui lève la contradiction de la vignette V-A2
      // (« réduire la basale » et « +2 U » affichés ensemble).
      // ───────────────────────────────────────────────────────────────────────────────────────────
      expect(has(titles(o), CORRIGER_HYPO)).toBe(false)
      // La prudence n'a pas disparu : elle est passée dans les alertes, et elle y est INCONDITIONNELLE
      // vis-à-vis de la situation.
      expect(alertMsgs(o).some((m) => m.includes('sous un schéma antérieur'))).toBe(true)
    },
  )

  it(
    'A27-2 — hypo INTERPRANDIALE sous basal-bolus : ouvre l\'optimisation de la répartition ' +
      '(le bolus est en cause), et ne bloque PAS la titration de la basale. ' +
      '⚠ RENOMMÉ le 2026-07-30 (P8/S7) : `hypo_interprandiale` (bool propre) → `profil_entre_repas == ' +
      'baisse_entre_repas` (enum) — même signal, même geste, cf. changelog `insuline.yaml` v0.34.',
    () => {
      const o = {
        situation_insuline: 'basal_bolus',
        profil_entre_repas: 'baisse_entre_repas',
        // Tout le reste est rassurant, y compris la cible : seule la baisse entre les repas parle.
        cible_atteinte: true, mcg_disponible: true, TBR: 1, TBR_severe: 0, CV_glycemique: 20,
        profil_nocturne: 'courbe_plate',
      } as Partial<Criteria>
      expect(has(titles(o), OPTIMISER_BB)).toBe(true)
    },
  )

  it(
    'A27-3 — hypo sévère récurrente SANS terrain gériatrique : cibles de MCG STANDARD, jamais assouplies ' +
      '(« une hypo sévère appelle une optimisation du traitement, pas un assouplissement des cibles »)',
    () => {
      const o = {
        situation_insuline: 'basale_seule',
        age: 55, fragilite: false, esperance_vie: 'longue',
        hypo_severe_recurrente: true,
        mcg_disponible: true,
      } as Partial<Criteria>
      const messages = alertMsgs(o)
      // Le sigle « MCG » est développé à sa première apparition dans les textes affichés (passe de
      // lisibilité du 2026-08-05) : ce garde-fou porte sur la CONDUITE — cibles standard, jamais
      // assouplies — et ne doit pas se casser parce que le contenu a gagné en lisibilité. D'où une
      // assertion qui accepte les deux formes du sigle plutôt qu'une chaîne littérale.
      expect(
        messages.some((m) => /Cibles de (?:MCG|mesure continue du glucose) standard/i.test(m)),
      ).toBe(true)
      expect(messages.some((m) => /assouplies/i.test(m))).toBe(false)
    },
  )

  it(
    'A27-4 — basale SEULE, glycémie à jeun DÉJÀ à la cible mais HbA1c au-dessus (écart post-prandial) : ' +
      'les deux gestes concrets sont proposés, pas seulement la prose qui dit « intensifier autrement »',
    () => {
      const o = {
        situation_insuline: 'basale_seule',
        GAJ: 1.0, HbA1c_actuelle: 8.5, HbA1c_cible: 7,
        // Aucun autre signal : ni hypoglycémie, ni variabilité, ni sur-basalisation. Avant l'arbitrage
        // du 2026-07-27, ce patient ne recevait QUE « Ne pas sur-titrer… — intensifier autrement », qui
        // dit d'intensifier sans nommer par quoi.
        mcg_disponible: false, TBR: 1, TBR_severe: 0, CV_glycemique: 20,
        profil_nocturne: 'courbe_plate', // mcg_disponible: false ci-dessus : champ inerte.
        poids: 80, dose_basale_actuelle: 20,
      } as Partial<Criteria>
      const t = titles(o)
      expect(has(t, AJOUTER_GLP1_BB)).toBe(true)
      expect(has(t, AJOUTER_BOLUS)).toBe(true)
      // La carte de cadrage reste affichée : elle dit POURQUOI on n'augmente pas la basale.
      expect(has(t, NE_PAS_SURTITRER)).toBe(true)
      // Et la titration de la basale reste bien fermée — le jeûne est à la cible.
      expect(has(t, TITRER)).toBe(false)
    },
  )

  it(
    'A27-3b — le MÊME antécédent chez un sujet âgé : cibles assouplies, cette fois à raison ' +
      '(c\'est l\'âge qui les relâche, pas l\'hypoglycémie)',
    () => {
      const o = {
        situation_insuline: 'basale_seule',
        age: 82, fragilite: false, esperance_vie: 'longue',
        hypo_severe_recurrente: true,
        mcg_disponible: true,
      } as Partial<Criteria>
      const messages = alertMsgs(o)
      expect(messages.some((m) => m.includes('ASSOUPLIES'))).toBe(true)
      expect(messages.some((m) => m.includes('Cibles de MCG standard'))).toBe(false)
    },
  )
})

/**
 * REPLI DE LA SITUATION « NAÏF » (2026-07-30, `insuline.yaml` v0.33) — le nœud comporte désormais DEUX
 * options `conditions: ["default"]`, réparties par une partition de `situation_insuline` sur leurs
 * `prerequis` : « Poursuivre le schéma d'insuline en cours… » (`!= naif`, posé le 2026-07-25/27) et « Pas
 * d'indication à initier une insuline aujourd'hui… » (`== naif`, ajouté le 2026-07-30 pour boucher un
 * écran MUET — profil #1213 du banc, `applicable` et `enAttente` vides simultanément).
 *
 * POURQUOI CES VIGNETTES EXISTENT ALORS QUE I2′ ET I23 COUVRENT DÉJÀ LE DÉFAUT. Ces deux invariants
 * (`banc/invariants.test.ts`, `banc/securite-atteignable.test.ts`) sont GÉNÉRIQUES : ils attrapent
 * l'écran muet, et ils l'attrapaient bien ici. Mais ils ne peuvent pas attraper la faute SYMÉTRIQUE
 * qu'introduit un second repli — les deux replis affichés ENSEMBLE, « poursuivre le schéma en cours » à
 * côté de « pas d'indication à en initier », ce qui se contredit à l'écran. Cette faute ne produit ni
 * silence ni option indûment applicable au sens de I21 : elle serait entièrement invisible au banc. Elle
 * survient dès que la partition cesse d'être une partition (un `prerequis` retiré, élargi, ou les deux
 * options fusionnées). D'où les trois vignettes ci-dessous, qui figent la partition elle-même : la
 * bonne carte de chaque côté de la frontière, et JAMAIS les deux.
 *
 * ⚠ Le TEXTE de la carte « naïf » n'est pas validé cliniquement (cf. bandeau de l'option dans
 * `insuline.yaml`) : ces vignettes ne testent que son APPLICABILITÉ, jamais son libellé au-delà du
 * fragment qui l'identifie — une reformulation par le référent ne doit pas les faire échouer.
 */
const PAS_D_INDICATION_NAIF = "Pas d'indication à initier une insuline"

describe('insuline — repli de la situation « naïf » (v0.33) : la partition des deux replis', () => {
  /** Naïf déjà à l'objectif, sans glucotoxicité ni risque hypoglycémique : la FORME du profil #1213. */
  const NAIF_A_LA_CIBLE = {
    situation_insuline: 'naif',
    HbA1c_actuelle: 6.9,
    HbA1c_cible: 8,
    symptomes_glucotoxicite: false,
    // Aucun terrain à risque hypoglycémique : sinon « Choisir un analogue basal de 2ᵉ génération » se
    // déclenche (option ordinaire), le repli est masqué, et la vignette ne mesurerait plus rien.
    age: 60,
    fragilite: false,
    esperance_vie: 'longue',
    risque_hypoglycemie_schema: 'faible',
    hypo_severe_recurrente: false,
    traitements_en_cours: ['metformine'],
  } as Partial<Criteria>

  it(
    'naïf, objectif atteint, rien à instaurer : la carte « pas d\'indication à initier » s\'affiche — ' +
      'et l\'écran n\'est plus MUET (défaut du 2026-07-30, profil #1213 : ni recommandation ni « à renseigner »)',
    () => {
      const resultat = evalProfile(NAIF_A_LA_CIBLE)
      const t = resultat.applicable.map((o) => o.intitule)
      expect(has(t, PAS_D_INDICATION_NAIF)).toBe(true)
      // Le repli de l'autre branche NE doit PAS s'afficher : ce patient n'a aucun schéma à poursuivre
      // (R9/I15 — c'est précisément le motif du prérequis posé le 2026-07-27).
      expect(has(t, POURSUIVRE)).toBe(false)
      // Aucune option d'instauration : c'est bien un repli, pas une recommandation d'insulinothérapie.
      expect(has(t, GLP1_NAIF)).toBe(false)
      expect(has(t, INITIER_BASALE)).toBe(false)
      expect(has(t, ANALOGUE_2G)).toBe(false)
      expect(resultat.applicable.length).toBe(1)
    },
  )

  it(
    'basale seule, objectif atteint, rien à corriger : c\'est l\'AUTRE repli qui s\'affiche, seul — ' +
      'la partition tient dans les deux sens (jamais les deux replis ensemble, ce qui se contredirait)',
    () => {
      // Le profil neutre BASE est exactement ce cas (basale seule, HbA1c 7 pour une cible de 7, GAJ à la
      // cible, aucun signal de sécurité) : c'est le trou que le repli du 2026-07-25 avait bouché.
      const resultat = evalProfile({})
      const t = resultat.applicable.map((o) => o.intitule)
      expect(has(t, POURSUIVRE)).toBe(true)
      expect(has(t, PAS_D_INDICATION_NAIF)).toBe(false)
      expect(resultat.applicable.length).toBe(1)
    },
  )

  /**
   * LE POINT QUI REND LA PARTITION SÛRE, et il ne se raisonne pas depuis le contenu seul : `prerequis`
   * garde les deux replis par un critère qui peut lui-même être masqué (`situation_insuline`), ce qui
   * ressemble à la recette d'un nouvel écran muet. Deux mécanismes s'y opposent, et l'un ou l'autre
   * s'applique TOUJOURS :
   *  - dès qu'UNE option ordinaire est indéterminée, `evaluateNode` n'évalue même pas la branche des
   *    replis (`if (!anyNonDefaultApplicable && enAttente.size === 0)`) — c'est le cas MESURÉ ici, et il
   *    est plus fort que la garantie recherchée : `enAttente` est déjà non vide avant qu'on y arrive ;
   *  - si aucune ne l'était, les deux replis partiraient eux-mêmes dans `enAttente` (leur `prerequis`
   *    devenant indéterminé), ce qui la rendrait non vide de la même façon.
   * Dans les deux cas `applicable` est vide ET `enAttente` ne l'est pas : exactement ce qu'I23 exige, et
   * l'écran peut nommer le champ manquant au lieu de se taire.
   */
  it(
    '`situation_insuline` NON renseignée : aucun des deux replis ne conclut, et l\'écran a de quoi dire ce ' +
      'qui manque (D20, « le moteur ne se prononce jamais sur ce qu\'il ignore ») — la partition ne peut ' +
      'donc pas rouvrir l\'écran muet quand son propre critère de garde est masqué',
    () => {
      const resultat = evalProfileTernaire(NAIF_A_LA_CIBLE, ['situation_insuline'])
      const t = resultat.applicable.map((o) => o.intitule)
      expect(has(t, PAS_D_INDICATION_NAIF)).toBe(false)
      expect(has(t, POURSUIVRE)).toBe(false)
      expect(resultat.applicable).toEqual([])
      // Le relais qui empêche le silence (cf. docstring ci-dessus).
      expect(resultat.enAttente.size).toBeGreaterThan(0)
      // Et le champ à renseigner est bien nommé au praticien.
      expect([...resultat.enAttente.values()].flat()).toContain('situation_insuline')
    },
  )
})
