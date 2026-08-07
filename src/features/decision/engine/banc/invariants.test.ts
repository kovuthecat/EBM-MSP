/**
 * Banc d'un nœud — COUCHE 3 « invariants » (docs/decision/GRAMMAIRE-NOEUD.md, section « Le banc d'un
 * nœud — trois couches »). Sept propriétés validées par le référent clinique le 2026-07-25 : les deux
 * premières valent pour TOUT nœud (moteur générique) ; les cinq suivantes sont des propriétés CLINIQUES
 * du domaine DT2 et ne concernent QUE le nœud `prescription`.
 *
 * Chaque propriété se valide UNE FOIS (relecture clinique du référent sur l'énoncé lui-même), puis se
 * revérifie mécaniquement sur un échantillon de profils tiré à graine fixe (`profils.ts`) — c'est le
 * point décisif de soutenabilité de cette couche (cf. tableau du document : « une propriété se valide
 * une fois et couvre tout l'espace »).
 *
 * ⚠ CE FICHIER (et lui seul, avec `evaluateNode.prescription.test.ts`) connaît du contenu clinique par
 * son NOM (`famille`, fragments d'`intitule`) : c'est volontaire — ces invariants EXPRIMENT des
 * propriétés cliniques du domaine DT2, pas de la logique de moteur. `profils.ts`, `couverture.test.ts`
 * et le reste du moteur restent strictement génériques (invariant CLAUDE.md 5 / DECISIONS.md D8) ; toute
 * connaissance de nom est isolée ici, dans les constantes ci-dessous.
 *
 * Traits d'union insécables (U+2011) dans les intitulés (ex. « AR GLP‑1 ») : comme le banc de vignettes
 * existant (`evaluateNode.prescription.test.ts`), on s'en affranchit en tronquant les fragments AVANT le
 * caractère problématique (ex. `'Introduire un AR GLP'` plutôt que `'... GLP‑1'`) — un simple copier-coller
 * du libellé complet échouerait silencieusement selon l'encodage de la source.
 */
import { describe, expect, it } from 'vitest'
import { getNoeudById, noeuds } from '../../content/loadNodes.ts'
import type { Noeud, Option } from '../../content/node.types.ts'
import type { Criteria } from '../conditions.ts'
import { INDETERMINE, evaluateCondition } from '../conditions.ts'
import { evaluateNode, groupesParFamille } from '../evaluateNode.ts'
import { determinesEffectifs } from '../deriveCritere.ts'
import { computeBadges } from '../../lib/optionBadges.ts'
import { genererPairesBooleennes, genererProfils, tailleBanc } from './profils.ts'

// ---------------------------------------------------------------------------------------------------
// Constantes de contenu (nœud `prescription`, domaine DT2) — SEUL endroit du dépôt autorisé à nommer
// des options par fragment d'intitulé / famille, cf. avertissement en tête de fichier.
// ---------------------------------------------------------------------------------------------------
// Constante nommée « ...AJOUTER » pour rester lisible dans son historique git ; la VALEUR est le
// libellé réel de la famille, renommée deux fois (P12/S5, T-124) : « Agent à ajouter » (verbe parfois
// faux) → « Agent glycémique » (mécanisme faux, démenti par le motif d'« Introduire un iSGLT2 » chez un
// coronarien) → « Le choix de l'agent » — ne revendique plus ni verbe ni mécanisme, seulement ce que la
// famille EST structurellement (cf. prescription.yaml, commentaire du bloc `familles`).
const FAMILLE_AGENT_A_AJOUTER = "Le choix de l'agent"

/**
 * FRAGMENTS DEVENUS PRÉDICATS (2026-08-04) — la simplification des intitulés (demande utilisateur : « le
 * badge d'action suffit, le titre peut se limiter au nom de la molécule ») a rendu plusieurs options
 * TEXTUELLEMENT IDENTIQUES alors qu'elles restent cliniquement distinctes (ex. « iSGLT2 » nomme désormais
 * aussi bien l'option qui l'INTRODUIT que celle qui le SUSPEND — deux options mutuellement exclusives sur
 * un même profil, distinguées à l'écran par la seule pastille d'action). Un simple `.includes(fragment)`
 * ne les départage plus : chaque prédicat ci-dessous combine le fragment de texte ET le champ qui portait
 * déjà la distinction à l'écran (`action`/`bas_rang`) — jamais un simple renommage de constante.
 */
// RETITRÉS le 2026-08-06 (P14/S8, T-171) : intitulés désormais uniques par construction (l'action figure
// dans le titre, cf. `prescription.yaml`) — les prédicats suivent le nouveau texte exact. `action` gardé
// en plus par prudence (même convention que les autres prédicats de ce fichier).
const estIntroISGLT2 = (o: Option) => o.intitule === 'iSGLT2 — introduire' && o.action === 'ajouter'
// `startsWith` plutôt qu'égalité stricte : tronqué avant le trait d'union insécable de « GLP‑1 », même
// esquive que l'ancienne constante `INTRO_GLP1`.
const estIntroGLP1 = (o: Option) => o.intitule.startsWith('AR GLP') && o.action === 'ajouter'
const estIntroTirzepatide = (o: Option) => o.intitule === 'Tirzépatide — introduire' && o.action === 'ajouter'
const AGENTS_A_BENEFICE_ORGANE_INTRO = [estIntroISGLT2, estIntroGLP1, estIntroTirzepatide]

// `bas_rang` (nouveau champ, cf. `node.types.ts`) plutôt que `action === 'ajouter'` seul : c'est
// LITTÉRALEMENT le champ qui porte « option de place résiduelle » — plus précis qu'un simple filtre sur
// le verbe si un jour une AUTRE option `ajouter` non `bas_rang` s'ajoutait sur la même molécule.
// RETITRÉE le 2026-08-06 (P14/S8, T-171) : « Gliptine » (place résiduelle, `ajouter`) porte désormais
// l'action dans le titre (désambiguïsation d'avec le switch ci-dessous, même intitulé nu jusqu'ici).
const estGliptinePlaceResiduelle = (o: Option) => o.intitule === 'Gliptine — introduire' && o.bas_rang === true
// RETITRÉE le 2026-08-06 (contre-relecture rédactionnelle) : « Sulfamide » (place résiduelle, `ajouter`)
// porte désormais l'action dans le titre, comme ses deux cartes sœurs « iSGLT2 — introduire » et
// « Gliptine — introduire » entre lesquelles elle s'affiche. `bas_rang` reste le discriminant réel.
const estSulfamidePlaceResiduelle = (o: Option) => o.intitule === 'Sulfamide — introduire' && o.bas_rang === true
const estInsulineEnvisager = (o: Option) => o.intitule.startsWith("Envisager l'") // texte inchangé, unique
const estInsulineInitiation = (o: Option) => o.intitule === "Insuline d'initiation" // texte inchangé, unique
const AGENTS_PUREMENT_GLYCEMIQUES_INTRO = [
  estGliptinePlaceResiduelle,
  estSulfamidePlaceResiduelle,
  estInsulineEnvisager,
  estInsulineInitiation,
]

// RETITRÉE le 2026-08-06 (P14/S8, T-171) : « Gliptine » (switch, `remplacer`) porte désormais l'action
// dans le titre — cf. commentaire de `estGliptinePlaceResiduelle` ci-dessus, même correctif.
const estSwitchGliptine = (o: Option) => o.intitule === 'Gliptine — remplacer par un agent à bénéfice démontré' && o.action === 'remplacer'
const estArretGliptineRedondante = (o: Option) => o.intitule === 'Gliptine (redondante)' // qualificatif conservé, reste unique
const VERDICTS_GLIPTINE = [estSwitchGliptine, estArretGliptineRedondante]

// RETITRÉES le 2026-08-06 (P14/S6, T-169) : « Sulfamide » (remplacer/réduire) portait le même intitulé nu
// que la place résiduelle (`estSulfamidePlaceResiduelle` ci-dessus) — désambiguïsé par l'action dans le
// titre. Les prédicats suivent le nouveau texte exact (plus robuste : `startsWith` sur le radical commun,
// même esquive que `estDesintensifier`/`estInsulineEnvisager` ci-dessus).
const estSwitchSulfamide = (o: Option) => o.intitule.startsWith('Sulfamide — remplacer') && o.action === 'remplacer'
const estArretSulfamideDFG = (o: Option) => o.intitule === 'Sulfamide (DFG < 30)' // qualificatif conservé, reste unique
const estReduireSulfamide = (o: Option) => o.intitule.startsWith('Sulfamide — réduire') && o.action === 'reduire'
// AJOUTÉE le 2026-08-06 (P14/S6, T-185) : « Sulfamide — arrêter » (nouvelle carte) reprend, POUR LE
// SULFAMIDE, le premier item de déclencheur que « Désintensifier » portait avant sa restriction aux
// insulines (cf. `prescription.yaml`, changelog v0.67) — elle doit donc rejoindre les verdicts sulfamide,
// sans quoi l'invariant 5 (agent sans bénéfice dur en cours + ajout d'un agent protecteur ⇒ verdict
// proposé aussi) perdrait sa couverture sur les profils où SEULE cette carte porte le verdict (HbA1c sous
// la cible, sans DFG < 30 ni hypoglycémie/intolérance déclenchant switch/réduction).
const estArretSulfamide = (o: Option) => o.intitule === 'Sulfamide — arrêter'
const estDesintensifier = (o: Option) => o.intitule.startsWith('Désintensifier') // texte inchangé, unique
const VERDICTS_SULFAMIDE = [estSwitchSulfamide, estArretSulfamideDFG, estReduireSulfamide, estArretSulfamide, estDesintensifier]

/** Agent sans bénéfice dur → ses options de « verdict » (remplacement / arrêt / allègement), invariant 5. */
const VERDICTS_PAR_AGENT: Record<string, ((o: Option) => boolean)[]> = {
  gliptine: VERDICTS_GLIPTINE,
  sulfamide: VERDICTS_SULFAMIDE,
}

function optionsApplicables(node: Noeud, profil: Criteria): Option[] {
  return evaluateNode(node, profil).applicable
}

// ---------------------------------------------------------------------------------------------------
// Invariants 1-2 : GÉNÉRIQUES, valent pour tout nœud du dépôt (moteur, aucune connaissance de contenu).
// ---------------------------------------------------------------------------------------------------

/**
 * Nœuds pour lesquels l'invariant 2 (sortie jamais vide) est une DETTE DE CONTENU DÉJÀ CONNUE — PAS une
 * propriété de moteur à masquer sur les autres nœuds. Vide depuis le 2026-07-25 : `insuline.yaml` a reçu
 * une option de repli (« Poursuivre le schéma d'insuline en cours et réévaluer », `["default"]`, en
 * dernière position) qui bouche le trou « sortie muette » de la situation `basale_seule` sans clause de
 * sécurité déclenchée et déjà à l'objectif (arbitrage référent). Cette liste ne doit grossir que si un
 * nouveau trou est diagnostiqué et commenté — jamais pour faire taire une régression inattendue sur un
 * autre nœud (prescription, cible-glycémique, rhd, statine passent normalement).
 */
const NOEUDS_AVEC_SORTIE_VIDE_CONNUE = new Set<string>([])

/**
 * Délai par test, relevé du défaut vitest (5 000 ms) le 2026-07-27. NON un contournement d'un test lent :
 * la conséquence directe et voulue du relèvement de `PLAFOND_ENUMERATION_EXHAUSTIVE` (20 000 → 60 000,
 * cf. `banc/profils.ts`), qui a rendu la couverture EXHAUSTIVE à `statine` (47 520 profils) et
 * `rhd-activite-physique` (55 296) là où elles étaient échantillonnées sur 720 et 1 120. Les invariants
 * ci-dessous parcourent donc 50 fois plus de patients qu'avant — c'est le prix de la garantie, et il est
 * payé une fois par exécution, pas par test.
 *
 * Mesuré après relèvement : 24 tests, 25,8 s au total. Le filet est dimensionné très au-dessus pour ne
 * jamais rendre un verdict DÉPENDANT DE LA CHARGE MACHINE — un test dont le résultat varie avec la
 * machine apprend à ignorer le rouge (même raison que le budget de `couverture.test.ts`, R5).
 *
 * RELEVÉ 120 000 → 300 000 ms le 2026-08-02 (P11), en phase avec les 3 autres fichiers du banc :
 * `securite-atteignable.test.ts` avait fini par mordre (~115 s pour 120 s de budget), donnant un verdict
 * fonction de la charge — exactement ce que le paragraphe ci-dessus interdit. Ce fichier-ci gardait de la
 * marge, mais un budget de banc tenu en phase à dessein ne se relève pas à un seul endroit.
 */
const DELAI_BANC_MS = 300_000

describe.each(noeuds.map((node) => [node.id, node] as const))('banc — invariants génériques · nœud %s', (_id, node) => {
  const profils = genererProfils(node, tailleBanc(node))

  it('1 — jamais une option APPLICABLE dont une `exclusions` est vraie', () => {
    const violations: string[] = []
    profils.forEach((profil, i) => {
      for (const option of evaluateNode(node, profil).applicable) {
        for (const expr of option.exclusions ?? []) {
          if (evaluateCondition(expr, profil)) {
            violations.push(`profil #${i} :: option "${option.intitule}" applicable malgré exclusion "${expr}"`)
          }
        }
      }
    })
    expect(violations).toEqual([])
  }, DELAI_BANC_MS)

  /**
   * I2′ (reformulation actée le 2026-07-26, DECISIONS.md D20, `docs/decision/validation/
   * chantier-2026-07-26/SPEC-valeur-indeterminee.md` §2.7/§4) — REMPLACE l'ancien invariant n°2
   * (« jamais `applicable` vide »), gardé ci-dessous à dessein plutôt que supprimé : cf. avertissement de
   * méthode `GRAMMAIRE-NOEUD.md` (« un invariant trop large est pire qu'absent »).
   *
   * POURQUOI L'ANCIEN ÉNONCÉ EST DEVENU FAUX : depuis R7, une sortie `applicable` vide est désormais
   * CORRECTE sur un profil dont un critère décisif n'est pas renseigné — c'est exactement ce que Q1/Q2
   * du référent demandent (l'outil ne se prononce pas sur ce qu'il ignore, ni dans le sens rassurant ni
   * dans le sens alarmant). Le remplacer par « jamais vide » tout court aurait forcé à encoder une
   * fausseté (masquer l'indétermination) pour repasser au vert — précisément le piège que la grammaire
   * signale. La reformulation retenue est : *jamais `applicable` vide LORSQUE TOUS LES CRITÈRES
   * PERTINENTS SONT RENSEIGNÉS*.
   *
   * CE QUE LE TEST CHANGE, ET POURQUOI CE N'EST PAS UN AFFAIBLISSEMENT DÉGUISÉ : l'ancien corps passait
   * `evaluateNode(node, profil)` SANS 3e argument — ce qui, avant R7, était la SEULE forme possible, et
   * qui reste aujourd'hui le repli « tout est renseigné » (`engine/evaluateNode.ts`, docstring de tête).
   * Le corps ci-dessous passe désormais EXPLICITEMENT `renseignes = tous les critères saisissables du
   * nœud` plutôt que de compter sur l'omission implicite du paramètre : cela exerce RÉELLEMENT le chemin
   * de code ternaire (D20) introduit par R7 — avec la garantie qu'aucun critère n'y est indéterminé —
   * plutôt que de contourner ce chemin de code entièrement (ce que l'omission aurait fait). C'est la
   * forme la plus littérale de « tous les critères sont renseignés », et elle revérifie au passage que
   * R7 n'a rien changé au comportement sur un formulaire intégralement rempli (non-régression).
   */
  const testInvariant2 = NOEUDS_AVEC_SORTIE_VIDE_CONNUE.has(node.id) ? it.fails : it
  testInvariant2(
    'I2′ — jamais `applicable` VIDE quand tous les critères sont renseignés (remplace l’ancien invariant n°2, cf. commentaire ci-dessus)',
    () => {
      const tousLesNoms = new Set(node.criteres_entree.filter((c) => c.derive == null).map((c) => c.nom))
      const profilsMuets: number[] = []
      profils.forEach((profil, i) => {
        if (evaluateNode(node, profil, tousLesNoms).applicable.length === 0) profilsMuets.push(i)
      })
      expect(profilsMuets).toEqual([])
    },
    DELAI_BANC_MS,
  )
})

// ---------------------------------------------------------------------------------------------------
// Invariant I3 (D20, SPEC-valeur-indeterminee.md §2.4/§4, Q1/Q2 référent) — GÉNÉRIQUE, vaut pour tout
// nœud (moteur, aucune connaissance de contenu). Revérifie, EXTERNEMENT et avec les seules briques
// génériques du moteur (`evaluateCondition`, `determinesEffectifs`), que rien de ce qu'`evaluateNode` a
// classé `applicable` ne reposait sur une expression restée INDÉTERMINÉE faute de critère renseigné —
// même esprit que l'invariant 1 ci-dessus (« jamais applicable dont une exclusion est vraie ») : une
// propriété que `classerOption` (engine/evaluateNode.ts) garantit déjà EN INTERNE, revérifiée
// MÉCANIQUEMENT de l'extérieur (cf. tête de fichier : « une propriété se valide une fois et couvre tout
// l'espace »).
//
// ⚠ CE QUE CET INVARIANT NE FAIT PAS (piège signalé par la tâche, cf. avertissement de méthode
// `GRAMMAIRE-NOEUD.md`) : il ne dit PAS « une option qui MENTIONNE TEXTUELLEMENT le critère masqué doit
// être en attente ». Une disjonction dont une branche est vraie reste vraie même si une autre est
// indéterminée (SPEC §2.3 : « propriété décisive qui limite le mutisme ») — ex.
// `DFG < 60 OR ASCVD_etablie == true` avec `DFG` masqué mais `ASCVD_etablie` vraie reste VRAIE, l'option
// reste normalement `applicable` (cf. `evaluateNode.indetermine.test.ts`, même propriété testée au niveau
// unitaire). Un invariant qui exigerait « en attente » dès qu'une expression MENTIONNE le critère masqué
// violerait ce principe et échouerait massivement sur du contenu correct — exactement l'invariant « trop
// large » contre lequel la grammaire met en garde (ex. `prescription`, option iSGLT2 :
// `insuffisance_cardiaque == true OR DFG < 60 OR ... OR ASCVD_etablie == true OR ...` — masquer `DFG`
// seul ne doit PAS mettre cette option en attente pour un patient dont `ASCVD_etablie` est vraie). C'est
// pour cette raison que le corps ci-dessous n'a JAMAIS été écrit comme une recherche textuelle du nom du
// critère masqué dans l'expression — seulement comme une revérification du VERDICT ternaire
// (`evaluateCondition`), la même brique que le moteur.
// ---------------------------------------------------------------------------------------------------
describe.each(noeuds.map((node) => [node.id, node] as const))(
  'banc — invariant I3 (D20) — indétermination · nœud %s',
  (_id, node) => {
    const saisissables = node.criteres_entree.filter((c) => c.derive == null)
    // Seuls les critères dont l'OMISSION peut réellement produire une indétermination (SPEC §2.2, cf.
    // `deriveCritere.ts` `critereEstDetermine`) : DEPUIS LE 2026-07-28 (D30, amende D20, P4/S1, T-018),
    // `nombre`/`enum`/`bool`/`liste` sont TOUS indéterminés dès qu'absents de `renseignes`, SAUF
    // `presomption_non: true` (ex-`confirmation_requise`, sens INVERSÉ — c'est désormais l'EXCEPTION qui
    // rend `bool`/`liste` déterminés PAR DÉFAUT, plutôt que l'exception qui les rendait indéterminés).
    // Les seuls critères qui restent déterminés par leur défaut sont donc les `bool`/`liste` portant
    // `presomption_non: true` : les retirer de `renseignes` ne changerait rien à `evaluateNode`.
    const criteresIndeterminables = saisissables.filter(
      (c) => c.type === 'nombre' || c.type === 'enum' || c.presomption_non !== true,
    )

    const testI3 = criteresIndeterminables.length > 0 ? it : it.skip
    testI3(
      'I3 — aucune option APPLICABLE ne repose sur une condition/prérequis/exclusion indéterminée ; ' +
        'aucune alerte de nœud au `quand` indéterminé ne s’affiche',
      () => {
        const tousLesNoms = new Set(saisissables.map((c) => c.nom))
        // Volume MODÉRÉ (pas `tailleBanc`, jusqu'à 2000) : I3 boucle aussi sur CHAQUE critère
        // indéterminable, le coût total est `profils × critères indéterminables` — cf. commentaire de
        // tête sur le coût de perturbation déjà observé côté `relevance.ts`/`couverture.test.ts`.
        const echantillon = genererProfils(node, 50).slice(0, 50)

        const violations: string[] = []
        for (const critere of criteresIndeterminables) {
          const renseignesPartiel = new Set([...tousLesNoms].filter((nom) => nom !== critere.nom))
          echantillon.forEach((profil, i) => {
            const effectifs = determinesEffectifs(node.criteres_entree, profil, renseignesPartiel)!
            const { applicable, excluded, alertes } = evaluateNode(node, profil, renseignesPartiel)

            // Q1/Q2 référent : ni une condition/prérequis ni une exclusion indéterminés ne doivent
            // laisser l'option `applicable` (Q2 est le point le plus sensible : un garde-fou
            // indéterminé doit mettre l'option EN ATTENTE, jamais la laisser passer, cf. le défaut réel
            // « metformine proposée sans vérifier le DFG »).
            for (const option of applicable) {
              // Les sentinelles `["default"]`/`["toujours"]` (D11/D16) ne sont PAS des expressions
              // évaluables — `evaluateCondition` lève dessus (`ConditionError`), exactement comme le
              // moteur les traite à part (`isDefaultOption`/`isToujoursOption`, `engine/evaluateNode.ts`).
              // Un `prerequis`/`exclusions` propre à une option sentinelle, lui, RESTE une expression
              // réelle (R6) : seul `conditions` est exclu ici quand il vaut exactement l'une des deux.
              const estSentinelle =
                option.conditions.length === 1 && (option.conditions[0] === 'default' || option.conditions[0] === 'toujours')
              const expressions = [
                ...(estSentinelle ? [] : option.conditions),
                ...(option.prerequis ?? []),
                ...(option.exclusions ?? []),
              ]
              for (const expr of expressions) {
                if (evaluateCondition(expr, profil, effectifs) === INDETERMINE) {
                  violations.push(
                    `profil #${i}, critère masqué "${critere.nom}" :: option "${option.intitule}" ` +
                      `APPLICABLE malgré "${expr}" indéterminée`,
                  )
                }
              }
            }

            // Sanity symétrique côté `excluded` : le motif RENVOYÉ par `evaluateNode` (celui qui a
            // justifié le retrait) doit rester STRICTEMENT vrai sous le même `renseignes` partiel —
            // jamais une exclusion qui ne serait, en réalité, qu'indéterminée.
            for (const [option, motifs] of excluded) {
              for (const expr of motifs) {
                if (evaluateCondition(expr, profil, effectifs) !== true) {
                  violations.push(
                    `profil #${i}, critère masqué "${critere.nom}" :: option "${option.intitule}" ÉCARTÉE ` +
                      `sur un motif "${expr}" qui n'est plus strictement vrai`,
                  )
                }
              }
            }

            // Aucune alerte de nœud affichée ne doit avoir un `quand` indéterminé (D20 §2.4 : « une
            // alerte dont le quand est indéterminé ne s'affiche pas »).
            for (const alerte of node.alertes ?? []) {
              if (alerte.quand === 'default') continue
              if (alertes.includes(alerte) && evaluateCondition(alerte.quand, profil, effectifs) !== true) {
                violations.push(
                  `profil #${i}, critère masqué "${critere.nom}" :: alerte "${alerte.message}" affichée ` +
                    `malgré un "quand" non strictement vrai`,
                )
              }
            }
          })
        }
        expect(violations).toEqual([])
      },
    )
  },
)

// ---------------------------------------------------------------------------------------------------
// Invariants 3-7 : SPÉCIFIQUES au domaine DT2 (nœud `prescription` uniquement) — propriétés cliniques,
// pas des propriétés de moteur. Ne s'appliquent à aucun autre nœud (statine, insuline, rhd, cible
// glycémique n'ont pas la notion de « gliptine »/« sulfamide »/famille « Le choix de l'agent »).
// ---------------------------------------------------------------------------------------------------
describe('banc — invariants spécifiques au domaine DT2 (nœud prescription, validés référent 2026-07-25)', () => {
  const node = getNoeudById('prescription')
  if (!node) throw new Error('Nœud "prescription" introuvable (content/noeuds/diabete-type-2/prescription.yaml).')
  const taille = tailleBanc(node)
  const profils = genererProfils(node, taille)

  // NB : `applicable` seul ne convient PAS pour « simultanément proposés » — la famille « Agent à
  // ajouter » est `exclusive: true` PAR CONCEPTION (menu d'alternatives : plusieurs agents peuvent être
  // des candidats visibles à la fois, un seul est LE choix mis en avant). Gliptine et AR GLP-1 co-listés
  // comme alternatives quand aucun des deux n'est encore prescrit est donc NORMAL (constaté sur ce banc :
  // 3 profils), pas une association. Ce qui compte cliniquement (R3/D16) est qu'un seul des deux porte le
  // badge « recommandee » (`computeBadges`, réservé au groupe de TÊTE d'une famille exclusive) : c'est ce
  // que ce test vérifie, via les mêmes fonctions que l'écran (`groupesParFamille` + `computeBadges`).
  it('3a — jamais gliptine (place résiduelle) ET AR GLP-1 (introduction) recommandés SIMULTANÉMENT (badge « recommandee »)', () => {
    const violations: string[] = []
    profils.forEach((profil, i) => {
      const { applicable, rangs } = evaluateNode(node, profil)
      const badges = computeBadges(groupesParFamille(node, applicable, rangs))
      const gliptineRecommandee = applicable.some((o) => estGliptinePlaceResiduelle(o) && badges.get(o) === 'recommandee')
      const glp1Recommande = applicable.some((o) => estIntroGLP1(o) && badges.get(o) === 'recommandee')
      if (gliptineRecommandee && glp1Recommande) violations.push(`profil #${i}`)
    })
    expect(violations).toEqual([])
  }, DELAI_BANC_MS)

  it('3b — gliptine + (AR GLP-1 OU tirzépatide) déjà en place ⇒ un geste correctif est applicable', () => {
    const violations: string[] = []
    profils.forEach((profil, i) => {
      const traitements = profil.traitements_en_cours
      if (!Array.isArray(traitements)) return
      const dejaCombine = traitements.includes('gliptine') && (traitements.includes('aGLP1') || traitements.includes('tirzepatide'))
      if (!dejaCombine) return
      const opts = optionsApplicables(node, profil)
      if (!opts.some(estArretGliptineRedondante)) violations.push(`profil #${i}`)
    })
    expect(violations).toEqual([])
  }, DELAI_BANC_MS)

  it('4 — jamais de sulfamide (place résiduelle) proposé si DFG < 30', () => {
    const violations: string[] = []
    profils.forEach((profil, i) => {
      const dfg = profil.DFG
      if (typeof dfg !== 'number' || dfg >= 30) return
      const opts = optionsApplicables(node, profil)
      if (opts.some(estSulfamidePlaceResiduelle)) violations.push(`profil #${i} (DFG=${dfg})`)
    })
    expect(violations).toEqual([])
  }, DELAI_BANC_MS)

  // DETTE REFERMÉE (2026-07-25, levée du verrou gliptine) : le profil « IMC < 22 + gliptine + athérome »
  // introduisait un iSGLT2 (bénéfice d'organe, indiqué par ASCVD_etablie) SANS qu'aucun verdict sur la
  // gliptine ne soit applicable — le switch « Remplacer la gliptine » était EXCLU par le garde-fou de
  // terrain (IMC < 22, alors propre au seul remplaçant AR GLP-1). Résorbé en contenu (pas en test) : les
  // exclusions IMC < 22 / dénutrition — celles du remplaçant, pas du verdict (R3) — ont été retirées de
  // l'option de switch de la gliptine, désormais généralisée (remplaçant choisi parmi iSGLT2/AR GLP-1
  // selon la comorbidité, comme pour le sulfamide) ; le verrou `ne_contient_pas gliptine` de l'option
  // « Introduire un AR GLP-1 » est levé (R4 livré). Le verdict sur la gliptine se déclenche donc
  // désormais dans tous les cas où un agent à bénéfice d'organe devient applicable pendant qu'elle est en
  // cours — c'est l'invariant ci-dessous, qui passe maintenant au vert.
  it(
    '5 — agent sans bénéfice dur en cours + introduction d’un agent à bénéfice d’organe ⇒ un verdict sur le premier est aussi applicable',
    () => {
      const violations: string[] = []
      profils.forEach((profil, i) => {
        const traitements = profil.traitements_en_cours
        if (!Array.isArray(traitements)) return
        const opts = optionsApplicables(node, profil)
        const introduitAgentOrgane = AGENTS_A_BENEFICE_ORGANE_INTRO.some((pred) => opts.some(pred))
        if (!introduitAgentOrgane) return
        for (const agent of Object.keys(VERDICTS_PAR_AGENT)) {
          if (!traitements.includes(agent)) continue
          const verdictApplicable = VERDICTS_PAR_AGENT[agent].some((pred) => opts.some(pred))
          if (!verdictApplicable) violations.push(`profil #${i} :: agent "${agent}" sans verdict applicable`)
        }
      })
      expect(violations).toEqual([])
    },
    DELAI_BANC_MS,
  )

  it('6 — à `fragilite` près (toutes choses égales par ailleurs), fragilite=true ne produit jamais PLUS d’options « Le choix de l’agent » que fragilite=false', () => {
    const paires = genererPairesBooleennes(node, taille, 'fragilite')
    const violations: string[] = []
    const compteAgentAAjouter = (profil: Criteria) =>
      evaluateNode(node, profil).applicable.filter((option) => option.famille === FAMILLE_AGENT_A_AJOUTER).length
    paires.forEach((paire, i) => {
      const nbVrai = compteAgentAAjouter(paire.aVrai)
      const nbFaux = compteAgentAAjouter(paire.aFaux)
      if (nbVrai > nbFaux) violations.push(`paire #${i} : fragilite=true -> ${nbVrai} options, fragilite=false -> ${nbFaux}`)
    })
    expect(violations).toEqual([])
  }, DELAI_BANC_MS)

  // PARTIELLEMENT corrigé le 2026-07-25 (arbitrage référent, tâche F) : la place résiduelle gliptine/
  // sulfamide se déclenchait aussi via `classes_a_benefice_indisponibles == true`, un booléen SAISI
  // indépendamment de `position_vs_cible` — rien n'empêchait un profil `sous_objectif` (sur-contrôle,
  // cf. `cible_atteinte`) de porter aussi ce drapeau. Corrigé en contenu par l'ajout de la garde
  // `position_vs_cible != sous_objectif` aux DEUX options de place résiduelle nommées par l'arbitrage
  // (gliptine, sulfamide) — c'est tout ce que la tâche F a demandé de toucher.
  //
  // RESTRICTION DE L'INVARIANT (arbitrage référent, 2026-07-25) — c'est l'invariant qui était trop
  // large, pas le contenu. « Insuline d'initiation (état catabolique) » se déclenche sur
  // `HbA1c_actuelle >= 10 AND symptomes_glucotoxicite == true OR cetonemie == true`, SANS clause sur la
  // position, par conception (cf. son `effet_attendu` : « distinct du gate catabolique, qui ne dépend
  // pas de l'atteinte de l'objectif »). Or un patient PEUT être à sa cible, voire en dessous, ET en
  // cétose : c'est l'acidocétose euglycémique sous iSGLT2, entité reconnue. L'insuline y est
  // indispensable, et ce n'est pas « un agent glycémique de plus » — c'est un traitement d'urgence.
  //
  // C'est la DEUXIÈME fois que cet invariant doit être resserré : il disait d'abord « aucun ajout »,
  // corrigé une 1re fois parce qu'un iSGLT2 en insuffisance cardiaque reste indiqué quelle que soit la
  // glycémie. Même motif les deux fois — LES GARDE-FOUS D'URGENCE SONT ORTHOGONAUX À LA POSITION
  // GLYCÉMIQUE. Un invariant qui les ignore force à encoder une règle fausse pour passer au vert.
  it(
    '7 — aucun agent purement glycémique (gliptine, sulfamide, insuline) proposé à l’introduction si position_vs_cible == sous_objectif, HORS gate catabolique',
    () => {
      const violations: string[] = []
      profils.forEach((profil, i) => {
        if (profil.position_vs_cible !== 'sous_objectif') return
        // Gate catabolique : urgence métabolique, hors du champ de cet invariant (voir ci-dessus).
        if (profil.symptomes_glucotoxicite === true || profil.cetonemie === true) return
        const opts = optionsApplicables(node, profil)
        for (const pred of AGENTS_PUREMENT_GLYCEMIQUES_INTRO) {
          const trouve = opts.find(pred)
          if (trouve) violations.push(`profil #${i} :: "${trouve.intitule}"`)
        }
      })
      expect(violations).toEqual([])
    },
    DELAI_BANC_MS,
  )
})
