/**
 * Banc de vignettes EXÉCUTABLE du nœud `rhd-alimentation`
 * (`content/noeuds/diabete-type-2/rhd-alimentation.yaml`). Dette **S8**, ouverte le 2026-07-27 par la
 * passe adversariale RHD : *« les deux nœuds RHD n'ont AUCUNE vignette exécutable »*. Modèle de style :
 * `evaluateNode.insuline.test.ts` (nœud en `multi-options`, même moteur réel).
 *
 * ⚠ LEUR STATUT N'EST PAS CELUI DES VIGNETTES F-01…F-09 DU NŒUD STATINE, et il faut le dire avant de les
 * lire. Celles-là viennent d'un tableau que le référent a écrit puis relu, patient par patient. Celles-ci
 * n'ont PAS été relues une à une : chacune verrouille un **arbitrage déjà rendu et déjà consigné**, dont
 * l'en-tête du YAML porte la trace, et le commentaire de chaque `describe` cite lequel. C'est une base
 * honnête — l'attente ne vient pas du moteur exécuté a posteriori — mais c'est une base PLUS FAIBLE : ces
 * vignettes prouvent que le nœud fait ce qui a été décidé, pas qu'un médecin a regardé chacun de ces
 * quinze patients. Une relecture référent reste due, et jusque-là ce fichier ne la remplace pas.
 *
 * POURQUOI CES SIX-LÀ ET PAS QUINZE AUTRES. La couche « couverture » du banc vérifie déjà, mécaniquement,
 * que chaque option se déclenche et s'exclut au moins une fois : refaire cela en vignettes n'apprendrait
 * rien et coûterait six relectures cliniques. Les vignettes ci-dessous sont choisies pour ce qu'elles
 * seules peuvent dire — les endroits où une régression serait CLINIQUEMENT fausse tout en restant
 * mécaniquement cohérente, donc invisible aux trois autres couches :
 *
 *  - R-A-01 · `fragilite` BLOQUE, et exactement deux pistes — un garde-fou qui déborde affame le patient
 *    de conseils, un garde-fou qui rétrécit lui retire sa protection nutritionnelle ;
 *  - R-A-02 · le repérage TCA NE BLOQUE PLUS RIEN — c'est la décision référent la plus récente du nœud,
 *    et le contenu porte encore les traces de l'état antérieur ;
 *  - R-A-03 · l'hypoglycémie ALERTE sans retirer (R8) — la confusion des deux canaux est le défaut que
 *    D21 nomme ;
 *  - R-A-04 · l'alcool n'est JAMAIS proposé — un refus délibéré, qu'aucune règle mécanique n'exprime ;
 *  - R-A-05 · le « Continuer ce qui fonctionne » exige les DEUX axes randomisés de PREDIMED, pas un ;
 *  - R-A-06 · la `priorite` conditionnelle du diététicien (D14) place l'orientation au bon rang.
 */
import { describe, expect, it } from 'vitest'
import { getNoeudById } from '../content/loadNodes.ts'
import { buildDefaultCriteria } from '../lib/formLayout.ts'
import { construireVueDecision } from '../lib/vueDecision.ts'
import { calculerCriteresDerives } from './deriveCritere.ts'
import { evaluateNode } from './evaluateNode.ts'
import type { Criteria } from './conditions.ts'

const node = getNoeudById('rhd-alimentation')
if (!node) {
  throw new Error('Nœud "rhd-alimentation" introuvable (content/noeuds/diabete-type-2/rhd-alimentation.yaml).')
}

/**
 * PROFIL NEUTRE — un patient chez qui AUCUNE piste de rapprochement ne se déclenche : il cuisine déjà à
 * l'huile d'olive, mange des fruits à coque, des légumineuses et du poisson régulièrement, des repas
 * réguliers, pas de boisson sucrée, pas d'ultratransformé, pas de grignotage, pas de difficulté d'accès,
 * pas de fragilité, aucun traitement pourvoyeur d'hypoglycémie.
 *
 * PART DE `buildDefaultCriteria` PAR CONSTRUCTION, pas par confort : un profil écrit entièrement à la
 * main devient faux dès qu'un critère est ajouté au contenu, et la première dérivation qui le lit lève.
 * C'est exactement le défaut qui a fait tomber 76 vignettes de `prescription` d'un coup le 2026-07-26 —
 * corrigé là-bas de la même façon. ⚠ Les valeurs nommées ci-dessous ÉCRASENT le défaut, et il le faut :
 * `valeurParDefaut` rend le PREMIER cran d'une énumération, ce qui pour ce nœud vaut `beurre_graisses_
 * animales` et `jamais` sur les fruits à coque — soit un profil qui déclenche déjà quatre pistes.
 *
 * ⚠ CE PROFIL N'EST PAS MUET pour autant : les deux axes PREDIMED étant tenus, il déclenche « Continuer
 * ce qui fonctionne déjà » (R-A-05). Les vignettes assertent donc des PRÉSENCES et des ABSENCES ciblées,
 * jamais une égalité de liste — une égalité serait fausse au premier ajout d'option et n'apprendrait rien.
 */
const BASE: Criteria = {
  ...buildDefaultCriteria(node.criteres_entree),
  fragilite: false,
  insuline_ou_insulinosecreteur: false,
  frequence_boissons_sucrees: 'jamais',
  frequence_ultratransformes: 'jamais',
  frequence_restauration_rapide: 'jamais',
  matiere_grasse_cuisson: 'huile_olive_ou_colza',
  regularite_repas: 'reguliers',
  frequence_grignotage: 'jamais',
  acces_alimentation: 'sans_difficulte',
  frequence_fruits_a_coque: 'regulier',
  frequence_legumineuses: 'regulier',
  frequence_poisson: 'regulier',
  frequence_viande_rouge_charcuterie: 'occasionnel',
  signes_appel_tca: false,
  difficulte_estimation_portions: 'facile',
  alimentation_emotionnelle: 'jamais',
  consommation_vin: 'jamais',
}

/**
 * Intitulés résolus AU CHARGEMENT, et non comparés à l'assertion. Un intitulé reformulé fait alors
 * échouer le fichier ENTIER avec un message qui nomme le fragment introuvable — au lieu de rendre
 * silencieusement fausses toutes les assertions qui le cherchaient (« un test vacant est un test qui
 * ment », `PLAN-CORRECTION.md` S8). Fragments choisis sans apostrophe : le YAML porte des apostrophes
 * typographiques, une comparaison sur la mauvaise variante passerait à côté sans rien dire.
 */
function intitule(fragment: string): string {
  const trouvees = node!.options.filter((o) => o.intitule.includes(fragment))
  if (trouvees.length !== 1) {
    throw new Error(
      `Fragment d'intitulé "${fragment}" : ${trouvees.length} option(s) correspondante(s) dans ` +
        `rhd-alimentation.yaml, 1 attendue. Intitulé reformulé ou fragment devenu ambigu — corriger ICI.`,
    )
  }
  return trouvees[0].intitule
}

const EAU = intitule('Remplacer une boisson sucrée')
const HUILE_OLIVE = intitule('à la place du beurre')
const VIANDE = intitule('Réduire la charcuterie et la viande rouge')
const FRUITS_A_COQUE = intitule('fruits à coque non salés')
const GRIGNOTAGE = intitule('moment de grignotage récurrent')
const PROPORTIONS = intitule('Se repérer aux proportions')
const DIETETICIEN = intitule('Orienter vers le diététicien')
const AVIS_TCA = intitule('avis spécialisé en trouble du comportement alimentaire')
const MAINTIEN = intitule('Continuer ce qui fonctionne déjà')

function evalProfil(overrides: Partial<Criteria>) {
  const criteria = calculerCriteresDerives(node!.criteres_entree, { ...BASE, ...overrides } as Criteria)
  return evaluateNode(node!, criteria)
}

/** Intitulés PROPOSÉS au praticien. */
const proposees = (o: Partial<Criteria>) => evalProfil(o).applicable.map((opt) => opt.intitule)
/** Intitulés ÉCARTÉS par une `exclusion` (canal de sécurité, D13/R4 — toujours visibles à l'écran). */
const ecartees = (o: Partial<Criteria>) => [...evalProfil(o).excluded.keys()].map((opt) => opt.intitule)
const alertes = (o: Partial<Criteria>) => evalProfil(o).alertes.map((a) => a.message)
/**
 * Rang RÉSOLU d'une option pour ce patient (D13/D14), tel que l'écran le lit. Passe par
 * `construireVueDecision` et non par `evaluateNode.rangs` : c'est la vue qui pilote le repli d'affichage,
 * donc la seule couche où « à quel rang cette option apparaît » a la signification qu'on veut verrouiller.
 * Une famille range ses options en GROUPES d'égalité de rang (`groupes: OptionVue[][]`), d'où le double
 * parcours.
 */
function rang(o: Partial<Criteria>, titre: string): number | undefined {
  const vue = construireVueDecision(node!, { ...BASE, ...o } as Criteria)
  for (const famille of vue.familles) {
    for (const groupe of famille.groupes) {
      const trouvee = groupe.find((v) => v.option.intitule === titre)
      if (trouvee) return trouvee.rang
    }
  }
  return undefined
}

// ═══════════════════════════════════════════════════════════════════════════════════════════════════
// R-A-00 — ANTI-VACUITÉ : le profil neutre ne propose AUCUNE des pistes que les vignettes assertent
//
// « Un test vacant est un test qui ment » (`PLAN-CORRECTION.md` S8). Vérifier qu'une piste est proposée
// n'apprend rien si elle est proposée à TOUT LE MONDE : la vignette resterait verte après une régression
// qui élargirait sa condition. Ce test est le contre-exemple commun à toutes les autres, et c'est lui qui
// donne leur valeur aux `toContain` qui suivent.
// ═══════════════════════════════════════════════════════════════════════════════════════════════════
describe('rhd-alimentation — R-A-00 : le profil neutre est bien neutre', () => {
  it.each([
    ['boisson sucrée → eau', EAU],
    ['huile d’olive', HUILE_OLIVE],
    ['viande rouge et charcuterie', VIANDE],
    ['fruits à coque', FRUITS_A_COQUE],
    ['grignotage', GRIGNOTAGE],
    ['proportions dans l’assiette', PROPORTIONS],
    ['orientation diététicien', DIETETICIEN],
    ['avis spécialisé TCA', AVIS_TCA],
  ])('%s n’est PAS proposée au patient déjà proche du repère', (_libelle, titre) => {
    expect(proposees({})).not.toContain(titre)
  })

  it('seul le maintien lui est proposé, et rien n’est écarté', () => {
    expect(proposees({})).toEqual([MAINTIEN])
    expect(ecartees({})).toEqual([])
    expect(alertes({})).toEqual([])
  })
})

// ═══════════════════════════════════════════════════════════════════════════════════════════════════
// R-A-01 — La fragilité est le SEUL garde-fou bloquant, et elle bloque exactement deux pistes
//
// Arbitrage consigné (en-tête `rhd-alimentation.yaml`, § GARDE-FOUS CLINIQUES) : « dénutrition/
// sarcopénie (`fragilite`, réutilisé du domaine — HAS R.37 : un IMC élevé n'exclut pas une dénutrition) :
// SEUL garde-fou bloquant qui subsiste sur les pistes alimentaires. Motif NUTRITIONNEL et non
// comportemental — réduire la viande retire une source de protéines, déplacer la part relative de
// l'assiette vers les légumes réduit l'apport énergétique. »
//
// Ce que la vignette verrouille dans les DEUX SENS : qu'il bloque bien ces deux pistes-là (une régression
// qui les rouvrirait proposerait à un patient dénutri de manger moins), et qu'il ne déborde PAS sur les
// autres (un garde-fou étendu par mégarde à tout le nœud priverait un patient fragile de tout conseil).
// ═══════════════════════════════════════════════════════════════════════════════════════════════════
describe('rhd-alimentation — R-A-01 : patient fragile, viande rouge quotidienne, portions mal estimées', () => {
  const PROFIL: Partial<Criteria> = {
    fragilite: true,
    frequence_viande_rouge_charcuterie: 'quotidien',
    difficulte_estimation_portions: 'difficile',
    frequence_boissons_sucrees: 'quotidien',
  }

  it('les deux pistes à effet NUTRITIONNEL sont ÉCARTÉES (canal exclusion, pas alerte)', () => {
    const e = ecartees(PROFIL)
    expect(e).toContain(VIANDE)
    expect(e).toContain(PROPORTIONS)
    expect(proposees(PROFIL)).not.toContain(VIANDE)
  })

  it('le garde-fou ne DÉBORDE pas : les pistes sans effet nutritionnel restent proposées', () => {
    const p = proposees(PROFIL)
    expect(p).toContain(EAU)
    expect(ecartees(PROFIL)).not.toContain(EAU)
  })

  it('la fragilité DÉCLENCHE en outre l’orientation vers le diététicien', () => {
    expect(proposees(PROFIL)).toContain(DIETETICIEN)
  })
})

// ═══════════════════════════════════════════════════════════════════════════════════════════════════
// R-A-02 — Le repérage TCA NE BLOQUE PLUS RIEN : il ORIENTE
//
// Décision référent du 2026-07-27, citée dans l'en-tête du YAML : « il me semblait qu'on utilisait plus
// les signes de TCA puisqu'on proposait uniquement des recommandations et pas de restriction », sur le
// principe « dans le cadre des RHD en médecine générale on ne propose pas de restriction calorique […] ;
// on propose des modifications d'habitudes alimentaires, jamais de régime ».
//
// C'EST LA VIGNETTE LA PLUS UTILE DU FICHIER. Le critère portait AVANT trois `exclusions` (grignotage,
// proportions, viande) ; elles ont été retirées le même jour. Rien de mécanique ne distingue « ce verrou
// a été délibérément levé » de « ce verrou a été perdu dans une réécriture » — seule une attente écrite
// le fait. La passe adversariale avait dû le vérifier À LA MAIN, ligne par ligne (`verif-finale-rhd.md`
// § CE QUI EST CONFIRMÉ, point 5) ; à partir d'ici, la suite le vérifie.
// ═══════════════════════════════════════════════════════════════════════════════════════════════════
describe('rhd-alimentation — R-A-02 : signes d’appel de TCA, patient NON fragile', () => {
  const PROFIL: Partial<Criteria> = {
    signes_appel_tca: true,
    fragilite: false,
    frequence_grignotage: 'quotidien',
    difficulte_estimation_portions: 'difficile',
    frequence_viande_rouge_charcuterie: 'quotidien',
  }

  it('AUCUNE piste n’est écartée — le repérage ne porte plus une seule exclusion', () => {
    expect(ecartees(PROFIL)).toEqual([])
  })

  it('les trois pistes autrefois verrouillées sont bien PROPOSÉES', () => {
    const p = proposees(PROFIL)
    expect(p).toContain(GRIGNOTAGE)
    expect(p).toContain(PROPORTIONS)
    expect(p).toContain(VIANDE)
  })

  it('il DÉCLENCHE les deux orientations, et c’est désormais son seul rôle', () => {
    const p = proposees(PROFIL)
    expect(p).toContain(DIETETICIEN)
    expect(p).toContain(AVIS_TCA)
  })

  it('sans signe d’appel, l’avis spécialisé en TCA n’est pas proposé', () => {
    expect(proposees({ signes_appel_tca: false })).not.toContain(AVIS_TCA)
  })
})

// ═══════════════════════════════════════════════════════════════════════════════════════════════════
// R-A-03 — L'hypoglycémie ALERTE, elle ne retire pas (R8, D21)
//
// Arbitrage consigné : « hypoglycémie sous insuline/sulfamide/glinide (`insuline_ou_insulinosecreteur`,
// bool propre au nœud depuis le 2026-07-29 — il remplace la liste `traitements_en_cours`, dont ce nœud ne
// lisait que ces quatre valeurs) :
// ALERTE de nœud (pas un blocage — arbitrage référent), vraie quel que soit le geste retenu (R8). »
//
// R8 dit qu'une alerte ne retire rien. La vignette vérifie les deux moitiés ensemble : l'alerte est bien
// là, ET la piste qu'elle commente reste proposée. Vérifier seulement la première laisserait passer une
// régression qui doublerait l'alerte d'une exclusion — le geste disparaîtrait de l'écran en même temps
// que le praticien lirait pourquoi y faire attention.
// ═══════════════════════════════════════════════════════════════════════════════════════════════════
describe('rhd-alimentation — R-A-03 : sous insuline ou insulinosécréteur, boissons sucrées quotidiennes', () => {
  const PROFIL: Partial<Criteria> = {
    insuline_ou_insulinosecreteur: true,
    frequence_boissons_sucrees: 'quotidien',
  }

  it('l’alerte hypoglycémie du nœud se déclenche', () => {
    expect(alertes(PROFIL).some((m) => m.includes('hypoglycémie'))).toBe(true)
  })

  it('et la piste qu’elle commente reste PROPOSÉE — une alerte ne retire rien', () => {
    expect(proposees(PROFIL)).toContain(EAU)
    expect(ecartees(PROFIL)).toEqual([])
  })

  it('sans traitement pourvoyeur d’hypoglycémie, l’alerte ne se déclenche pas', () => {
    const sansTraitement = alertes({
      insuline_ou_insulinosecreteur: false,
      frequence_boissons_sucrees: 'quotidien',
    })
    expect(sansTraitement.some((m) => m.includes('hypoglycémie'))).toBe(false)
  })
})

// ═══════════════════════════════════════════════════════════════════════════════════════════════════
// R-A-04 — L'alcool n'est JAMAIS proposé ; au-delà du seuil, il alerte
//
// Arbitrage consigné : « VIN : recueilli (`consommation_vin`, approfondissement — item #8 du MEDAS),
// JAMAIS proposé par aucune piste (refus délibéré de proposer de l'alcool en soins primaires). Une
// consommation élevée déclenche une alerte de repérage de mésusage, pas une piste. »
//
// L'ASSERTION « aucune option ne parle de vin » EST FAIBLE ET JE L'ASSUME : elle ne peut pas prouver
// l'intention, seulement l'absence du mot. C'est néanmoins le seul filet possible ici — le refus vit dans
// une phrase d'en-tête, il n'a par nature aucune contrepartie mécanique. Une piste « boire un verre de vin
// rouge par jour » ajoutée un jour serait attrapée ; une piste qui dirait la même chose sans le mot ne le
// serait pas. Écrit ainsi plutôt que pas écrit.
// ═══════════════════════════════════════════════════════════════════════════════════════════════════
describe('rhd-alimentation — R-A-04 : consommation de vin', () => {
  it('au-delà du seuil MEDAS, une alerte de repérage — et aucune piste sur le vin', () => {
    const PROFIL: Partial<Criteria> = { consommation_vin: 'sept_verres_ou_plus_semaine' }
    expect(alertes(PROFIL).some((m) => m.includes('vin'))).toBe(true)
    const p = proposees(PROFIL)
    expect(p.some((t) => /vin|alcool/i.test(t))).toBe(false)
  })

  it('en deçà du seuil, aucune alerte', () => {
    expect(alertes({ consommation_vin: 'un_a_six_verres_semaine' }).some((m) => m.includes('vin'))).toBe(false)
  })

  it('AUCUNE option du nœud, quel que soit le patient, ne propose de boire du vin', () => {
    // Porte sur le CONTENU et non sur un profil : c'est une propriété du nœud entier.
    expect(node!.options.filter((o) => /boire.*vin|verre de vin|consommer.*alcool/i.test(o.intitule))).toEqual([])
  })
})

// ═══════════════════════════════════════════════════════════════════════════════════════════════════
// R-A-05 — « Continuer ce qui fonctionne déjà » exige les DEUX axes randomisés, pas un
//
// Arbitrage consigné (en-tête, § PLAFOND D'AFFICHAGE) : « rang 1 = axes réellement randomisés dans
// PREDIMED (huile d'olive, fruits à coque) ». L'option de maintien est conditionnée par une CONJONCTION
// de ces deux axes — et la grammaire du DSL ne porte pas de parenthèses (AND lie plus fort que OR), donc
// une réécriture maladroite en OR passerait la validation de schéma sans broncher.
//
// Ce que la vignette verrouille : féliciter un patient qui ne tient qu'un seul des deux axes reviendrait
// à valider comme « ce qui fonctionne » un motif alimentaire à moitié constitué, tout en LUI RETIRANT la
// piste qui lui manque. Le second `it` vérifie précisément cette conséquence-là.
// ═══════════════════════════════════════════════════════════════════════════════════════════════════
describe('rhd-alimentation — R-A-05 : les deux axes PREDIMED', () => {
  it('les DEUX tenus → le maintien est proposé', () => {
    expect(proposees({ matiere_grasse_cuisson: 'huile_olive_ou_colza', frequence_fruits_a_coque: 'regulier' })).toContain(
      MAINTIEN,
    )
  })

  it('un seul tenu → PAS de maintien, et la piste manquante est proposée à la place', () => {
    const PROFIL: Partial<Criteria> = {
      matiere_grasse_cuisson: 'huile_olive_ou_colza',
      frequence_fruits_a_coque: 'jamais',
    }
    expect(proposees(PROFIL)).not.toContain(MAINTIEN)
    expect(proposees(PROFIL)).toContain(FRUITS_A_COQUE)
  })

  it('l’autre seul tenu → PAS de maintien non plus, et la piste huile d’olive est proposée', () => {
    const PROFIL: Partial<Criteria> = {
      matiere_grasse_cuisson: 'beurre_graisses_animales',
      frequence_fruits_a_coque: 'regulier',
    }
    expect(proposees(PROFIL)).not.toContain(MAINTIEN)
    expect(proposees(PROFIL)).toContain(HUILE_OLIVE)
  })
})

// ═══════════════════════════════════════════════════════════════════════════════════════════════════
// R-A-06 — La `priorite` conditionnelle de l'orientation (D14)
//
// L'orientation vers le diététicien est la seule option du nœud à porter une `priorite` CONDITIONNELLE :
// rang 1 si signes d'appel de TCA, rang 1 si fragilité, rang 6 sinon. Le rang n'est pas décoratif depuis
// le plafond d'affichage du 2026-07-27 (K5) : au-delà de cinq pistes, l'écran DÉPLIE les meilleurs rangs
// et REPLIE le reste. Une orientation retombée au rang 6 chez un patient fragile serait donc repliée
// derrière un « voir plus » — présente, mais pas vue.
// ═══════════════════════════════════════════════════════════════════════════════════════════════════
describe('rhd-alimentation — R-A-06 : rang de l’orientation vers le diététicien', () => {
  it('remonte au rang 1 chez le patient fragile', () => {
    expect(rang({ fragilite: true }, DIETETICIEN)).toBe(1)
  })

  it('remonte au rang 1 devant des signes d’appel de TCA', () => {
    expect(rang({ signes_appel_tca: true }, DIETETICIEN)).toBe(1)
  })

  it('reste au rang de repli quand seul l’accès à l’alimentation est en cause', () => {
    expect(rang({ acces_alimentation: 'difficultes_importantes' }, DIETETICIEN)).toBe(6)
  })
})
