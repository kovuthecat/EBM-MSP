/**
 * Banc de vignettes EXÉCUTABLE du nœud `rhd-activite-physique`
 * (`content/noeuds/diabete-type-2/rhd-activite-physique.yaml`). Second volet de la dette **S8**, ouverte
 * le 2026-07-27 par la passe adversariale RHD. Même statut et mêmes limites que
 * `evaluateNode.rhd-alimentation.test.ts` — lire son en-tête : ces vignettes verrouillent des
 * **arbitrages déjà rendus et consignés**, elles n'ont PAS été relues patient par patient par le
 * référent, et elles ne remplacent pas cette relecture.
 *
 * CE QUE CE NŒUD A DE PARTICULIER, et qui justifie de le traiter séparément plutôt que d'étendre le banc
 * de l'alimentation : `fragilite` y joue le rôle INVERSE. Dans `rhd-alimentation`, c'est le seul garde-fou
 * qui BLOQUE (motif nutritionnel, HAS R.37) ; ici, c'est une ALERTE qui ne retire rien (chaleur,
 * hydratation). Même critère, même domaine, deux rôles opposés — délibérément. R-P-05 le fige, parce que
 * c'est exactement le genre d'asymétrie qu'une harmonisation bien intentionnée casserait en croyant bien
 * faire.
 *
 * LES SIX VIGNETTES, et ce que chacune seule peut dire :
 *  - R-P-01 · le verrou d'effort bloque la pratique structurée ET RIEN D'AUTRE ;
 *  - R-P-02 · chacun des quatre signes ferme le verrou À LUI SEUL ;
 *  - R-P-03 · la neuropathie : une sur-restriction ASSUMÉE, tenue honnête par son alerte ;
 *  - R-P-04 · l'hypoglycémie à l'effort alerte sans retirer (R8) ;
 *  - R-P-05 · la fragilité alerte sans retirer — l'inverse de l'autre nœud RHD ;
 *  - R-P-06 · les deux options de maintien et le rang de l'orientation.
 */
import { describe, expect, it } from 'vitest'
import { getNoeudById } from '../content/loadNodes.ts'
import { buildDefaultCriteria } from '../lib/formLayout.ts'
import { construireVueDecision } from '../lib/vueDecision.ts'
import { calculerCriteresDerives } from './deriveCritere.ts'
import { evaluateNode } from './evaluateNode.ts'
import type { Criteria } from './conditions.ts'

const node = getNoeudById('rhd-activite-physique')
if (!node) {
  throw new Error(
    'Nœud "rhd-activite-physique" introuvable (content/noeuds/diabete-type-2/rhd-activite-physique.yaml).',
  )
}

/**
 * PROFIL NEUTRE — un patient déjà actif et peu sédentaire : 2 à 3 séances par semaine de plus de
 * 30 minutes, déplacements courts à pied ou à vélo, moins de 4 h assis par jour, interrompt habituellement
 * les longues périodes assises, aucun signe de sécurité à l'effort, offre de proximité connue, pas de
 * difficulté d'accès, pas d'expérience négative, non fragile, aucun traitement pourvoyeur d'hypoglycémie.
 *
 * Part de `buildDefaultCriteria` pour la même raison que le banc de l'alimentation (résistance à la
 * croissance du contenu) — et écrase le défaut pour la même raison aussi : `valeurParDefaut` rend le
 * PREMIER cran d'une énumération et `false` pour tout booléen, ce qui donnerait ici un patient totalement
 * inactif dont `offre_proximite_connue` serait faux. Soit sept pistes déclenchées d'emblée.
 *
 * Ce profil déclenche « Poursuivre les habitudes actuelles » (R-P-06). Comme dans l'autre banc, les
 * assertions portent sur des présences et des absences ciblées, jamais sur une égalité de liste.
 */
const BASE: Criteria = {
  ...buildDefaultCriteria(node.criteres_entree),
  fragilite: false,
  insuline_ou_insulinosecreteur: false,
  frequence_activite_structuree: 'deux_a_trois_fois_semaine',
  duree_seance: 'plus_30_min',
  mode_deplacement_courts_trajets: 'actif_pied_ou_velo',
  temps_assis_quotidien: 'moins_4h',
  rupture_sedentarite_habituelle: true,
  limitation_physique_connue: false,
  symptomes_ischemie_effort: false,
  retinopathie_non_stabilisee_ou_proliferante: false,
  neuropathie_ou_mal_perforant_plantaire: false,
  difficulte_acces_activite: false,
  offre_proximite_connue: true,
  experience_activite_negative: false,
}

/** Profil du patient SÉDENTAIRE, base des vignettes de sécurité : c'est chez lui que la pratique
 *  structurée est proposée, donc le seul chez qui son retrait se mesure. */
const SEDENTAIRE: Partial<Criteria> = {
  frequence_activite_structuree: 'jamais',
  duree_seance: 'moins_10_min',
  mode_deplacement_courts_trajets: 'motorise_ou_assis',
  temps_assis_quotidien: 'plus_8h',
  rupture_sedentarite_habituelle: false,
}

/** Voir la note du banc `rhd-alimentation` : résolution AU CHARGEMENT, échec bruyant sur reformulation. */
function intitule(fragment: string): string {
  const trouvees = node!.options.filter((o) => o.intitule.includes(fragment))
  if (trouvees.length !== 1) {
    throw new Error(
      `Fragment d'intitulé "${fragment}" : ${trouvees.length} option(s) correspondante(s) dans ` +
        `rhd-activite-physique.yaml, 1 attendue. Intitulé reformulé ou fragment devenu ambigu — corriger ICI.`,
    )
  }
  return trouvees[0].intitule
}

const PROGRAMME_APA = intitule('Envisager un programme')
const TRAJET_ACTIF = intitule('Remplacer un trajet motorisé')
const SE_LEVER = intitule('Se lever et bouger quelques minutes')
const MOUVEMENT_QUOTIDIEN = intitule('Intégrer du mouvement dans les tâches')
const NOMBRE_DE_PAS = intitule('Suivre son nombre de pas')
const MAINTENIR_PRATIQUE = intitule('Maintenir la pratique actuelle')
const POURSUIVRE = intitule('Poursuivre les habitudes actuelles')
const ORIENTER_STRUCTURE = intitule('Orienter vers une structure')

function evalProfil(overrides: Partial<Criteria>) {
  const criteria = calculerCriteresDerives(node!.criteres_entree, { ...BASE, ...overrides } as Criteria)
  return evaluateNode(node!, criteria)
}

const proposees = (o: Partial<Criteria>) => evalProfil(o).applicable.map((opt) => opt.intitule)
const ecartees = (o: Partial<Criteria>) => [...evalProfil(o).excluded.keys()].map((opt) => opt.intitule)
const alertes = (o: Partial<Criteria>) => evalProfil(o).alertes.map((a) => a.message)

/** Vue d'une option APPLICABLE, avec son rang résolu et ses alertes propres — telle que la carte la rend. */
function vueOption(o: Partial<Criteria>, titre: string) {
  const vue = construireVueDecision(node!, { ...BASE, ...o } as Criteria)
  for (const famille of vue.familles) {
    for (const groupe of famille.groupes) {
      const trouvee = groupe.find((v) => v.option.intitule === titre)
      if (trouvee) return trouvee
    }
  }
  return undefined
}

// ═══════════════════════════════════════════════════════════════════════════════════════════════════
// R-P-00 — ANTI-VACUITÉ : le profil neutre ne propose AUCUNE des pistes que les vignettes assertent
//
// « Un test vacant est un test qui ment » (`PLAN-CORRECTION.md` S8). Une vignette qui vérifie qu'une
// option est proposée n'apprend rien si cette option est proposée à TOUT LE MONDE : elle resterait verte
// après une régression qui élargirait sa condition jusqu'à l'absurde. Ce test est le contre-exemple
// commun à toutes les autres — il tombe dès qu'une piste se met à s'afficher chez un patient déjà actif,
// et c'est lui qui donne leur valeur aux `toContain` qui suivent.
// ═══════════════════════════════════════════════════════════════════════════════════════════════════
describe('rhd-activite-physique — R-P-00 : le profil neutre est bien neutre', () => {
  it.each([
    ['pratique structurée', PROGRAMME_APA],
    ['déplacements actifs', TRAJET_ACTIF],
    ['rupture de sédentarité', SE_LEVER],
    ['mouvement quotidien', MOUVEMENT_QUOTIDIEN],
    ['nombre de pas', NOMBRE_DE_PAS],
    ['orientation vers une structure', ORIENTER_STRUCTURE],
  ])('%s n’est PAS proposée au patient déjà actif', (_libelle, titre) => {
    expect(proposees({})).not.toContain(titre)
  })

  it('seul le maintien lui est proposé, et rien n’est écarté', () => {
    expect(proposees({})).toEqual([POURSUIVRE])
    expect(ecartees({})).toEqual([])
    expect(alertes({})).toEqual([])
  })
})

// ═══════════════════════════════════════════════════════════════════════════════════════════════════
// R-P-01 — Le verrou d'effort bloque la pratique structurée, ET RIEN D'AUTRE
//
// Arbitrage consigné (en-tête du YAML, § GARDE-FOUS) : le verrou « bloque UNIQUEMENT la montée
// d'intensité/pratique structurée (décision de bucketing du référent, CONCEPTION-module-rhd.md §4) ; il
// laisse passer l'activité quotidienne, les déplacements actifs et la rupture de sédentarité ».
//
// LA MOITIÉ QUI COMPTE EST LA SECONDE. Qu'un signe d'alerte retire le programme d'activité encadrée est
// intuitif, et une régression irait rarement dans ce sens. Le risque réel est le verrou qui DÉBORDE : un
// patient avec une rétinopathie se verrait alors refuser jusqu'à « se lever quelques minutes par heure »,
// c'est-à-dire précisément le geste que la HAS gradue le plus haut et qu'aucun de ces quatre signes ne
// contre-indique. L'écran deviendrait muet là où il devait être le plus simple.
// ═══════════════════════════════════════════════════════════════════════════════════════════════════
describe('rhd-activite-physique — R-P-01 : patient sédentaire avec symptômes d’ischémie à l’effort', () => {
  const PROFIL: Partial<Criteria> = { ...SEDENTAIRE, symptomes_ischemie_effort: true }

  it('la pratique structurée est ÉCARTÉE (canal exclusion)', () => {
    expect(ecartees(PROFIL)).toContain(PROGRAMME_APA)
    expect(proposees(PROFIL)).not.toContain(PROGRAMME_APA)
  })

  it('les trois autres familles passent — le verrou ne déborde pas', () => {
    const p = proposees(PROFIL)
    expect(p).toContain(SE_LEVER) // rupture de sédentarité
    expect(p).toContain(MOUVEMENT_QUOTIDIEN) // activité quotidienne
    expect(p).toContain(NOMBRE_DE_PAS) // activité quotidienne
    expect(p).toContain(TRAJET_ACTIF) // déplacements actifs
  })

  it('la pratique structurée est bien proposée au MÊME patient sans signe de sécurité', () => {
    // Sans ce contre-exemple, le premier `it` passerait aussi si l'option n'était jamais applicable.
    expect(proposees(SEDENTAIRE)).toContain(PROGRAMME_APA)
    expect(ecartees(SEDENTAIRE)).toEqual([])
  })
})

// ═══════════════════════════════════════════════════════════════════════════════════════════════════
// R-P-02 — Chacun des quatre signes ferme le verrou À LUI SEUL
//
// `verrou_effort` est une DISJONCTION de quatre signes. La grammaire du DSL n'a pas de parenthèses et
// AND lie plus fort que OR : une réécriture qui glisserait un AND au milieu de la chaîne transformerait
// silencieusement « l'un des quatre » en « celui-ci et celui-là », et le nœud continuerait de valider.
// Quatre profils à un seul signe sont le seul moyen de le voir.
// ═══════════════════════════════════════════════════════════════════════════════════════════════════
describe('rhd-activite-physique — R-P-02 : les quatre signes de sécurité à l’effort', () => {
  const SIGNES = [
    'limitation_physique_connue',
    'symptomes_ischemie_effort',
    'retinopathie_non_stabilisee_ou_proliferante',
    'neuropathie_ou_mal_perforant_plantaire',
  ] as const

  it.each(SIGNES)('%s seul suffit à écarter la pratique structurée', (signe) => {
    expect(ecartees({ ...SEDENTAIRE, [signe]: true })).toContain(PROGRAMME_APA)
  })

  it('aucun des quatre → la pratique structurée reste proposée', () => {
    expect(proposees(SEDENTAIRE)).toContain(PROGRAMME_APA)
  })
})

// ═══════════════════════════════════════════════════════════════════════════════════════════════════
// R-P-03 — La neuropathie : une sur-restriction ASSUMÉE, tenue honnête par son alerte
//
// Le contenu le déclare lui-même, dans le texte de l'alerte : « la source HAS restreint la limitation aux
// activités en CHARGE des membres inférieurs […] L'outil retire ici la famille "pratique structurée" dans
// son ensemble, faute de recueillir de quoi distinguer les pistes par segment corporel : orienter vers une
// pratique adaptée plutôt que de conclure à l'absence d'activité possible. »
//
// L'EXCLUSION ET L'ALERTE FORMENT UN COUPLE, et c'est ce couple que la vignette verrouille. L'exclusion
// seule ferait dire à l'outil quelque chose de plus restrictif que sa source, sans le dire. L'alerte seule
// ne protégerait personne. Une régression qui retirerait l'alerte en gardant l'exclusion laisserait un
// patient sans aucune pratique encadrée proposée alors que le vélo assis, le renforcement du haut du corps
// et l'activité aquatique lui restent ouverts — et personne à l'écran ne saurait pourquoi.
// ═══════════════════════════════════════════════════════════════════════════════════════════════════
describe('rhd-activite-physique — R-P-03 : neuropathie périphérique / mal perforant plantaire', () => {
  const PROFIL: Partial<Criteria> = { ...SEDENTAIRE, neuropathie_ou_mal_perforant_plantaire: true }

  it('la pratique structurée est écartée', () => {
    expect(ecartees(PROFIL)).toContain(PROGRAMME_APA)
  })

  it('ET l’alerte qui EXPLIQUE la sur-restriction est présente', () => {
    const m = alertes(PROFIL)
    expect(m.some((a) => a.includes('activités en CHARGE'))).toBe(true)
    expect(m.some((a) => a.includes('faute de recueillir'))).toBe(true)
  })

  it('les pistes de mouvement quotidien restent proposées — « pas d’absence d’activité possible »', () => {
    expect(proposees(PROFIL)).toContain(MOUVEMENT_QUOTIDIEN)
  })
})

// ═══════════════════════════════════════════════════════════════════════════════════════════════════
// R-P-04 — L'hypoglycémie à l'effort ALERTE, elle ne retire pas (R8, D21)
//
// Arbitrage consigné, et le message de l'alerte le répète : « arbitrage référent : alerte simple, pas un
// blocage des pistes proposées ». Le red-team avait laissé ce point ouvert (finding B-3) ; il a été
// tranché. Même forme que R-A-03 sur l'autre nœud RHD : les deux moitiés sont vérifiées ensemble.
// ═══════════════════════════════════════════════════════════════════════════════════════════════════
describe('rhd-activite-physique — R-P-04 : sous insuline ou insulinosécréteur, patient sédentaire', () => {
  const PROFIL: Partial<Criteria> = { ...SEDENTAIRE, insuline_ou_insulinosecreteur: true }

  it('l’alerte d’hypoglycémie à l’effort se déclenche', () => {
    expect(alertes(PROFIL).some((m) => m.includes("hypoglycémie À L'EFFORT"))).toBe(true)
  })

  it('et RIEN n’est retiré — y compris la pratique structurée', () => {
    expect(ecartees(PROFIL)).toEqual([])
    expect(proposees(PROFIL)).toContain(PROGRAMME_APA)
  })
})

// ═══════════════════════════════════════════════════════════════════════════════════════════════════
// R-P-05 — La fragilité ALERTE ici, alors qu'elle BLOQUE dans le nœud « alimentation »
//
// Les deux nœuds RHD déclarent `fragilite` à l'identique (I4, « un concept, un encodage ») et en font
// deux usages opposés — parce que les motifs le sont : là-bas le risque est NUTRITIONNEL (réduire la
// viande retire des protéines à un patient dénutri, HAS R.37), ici il est THERMIQUE et
// d'HYDRATATION (HAS, guide des connaissances sur l'activité physique).
//
// Cette vignette existe pour être lue en même temps que R-A-01. Un lot d'harmonisation qui verrait la même
// variable traitée de deux façons et voudrait « uniformiser » casserait l'un des deux nœuds — en retirant
// à un patient fragile toute proposition de mouvement, ou en levant sa protection nutritionnelle.
// ═══════════════════════════════════════════════════════════════════════════════════════════════════
describe('rhd-activite-physique — R-P-05 : sujet fragile, sédentaire', () => {
  const PROFIL: Partial<Criteria> = { ...SEDENTAIRE, fragilite: true }

  it('l’alerte chaleur / hydratation se déclenche', () => {
    expect(alertes(PROFIL).some((m) => m.includes('forte chaleur'))).toBe(true)
  })

  it('la fragilité ne retire AUCUNE piste dans ce nœud — contrairement à `rhd-alimentation`', () => {
    expect(ecartees(PROFIL)).toEqual([])
    expect(proposees(PROFIL)).toContain(PROGRAMME_APA)
    expect(proposees(PROFIL)).toContain(MOUVEMENT_QUOTIDIEN)
  })
})

// ═══════════════════════════════════════════════════════════════════════════════════════════════════
// R-P-06 — Les deux maintiens, l'alerte qui voyage avec sa carte, et le rang de l'orientation
//
// Trois propriétés d'affichage, groupées parce qu'elles répondent à la même question : ce que le praticien
// voit une fois les options retenues.
//
//  - DEUX options de maintien, non interchangeables : « Poursuivre les habitudes actuelles » (2-3 séances
//    par semaine) et « Maintenir la pratique actuelle ; envisager de diversifier » (4 séances ou plus).
//    Toutes deux exigent EN OUTRE la rupture de sédentarité habituelle — un patient qui court quatre fois
//    par semaine mais reste assis huit heures par jour n'est pas un patient « à maintenir » ;
//  - l'alerte d'OPTION du programme d'APA (`quand: default`, HAS R.19/R.28) accompagne la carte partout où
//    elle s'affiche : une évaluation médicale minimale avant de commencer. Elle est portée par l'option et
//    non par le nœud, précisément pour ne pas s'afficher chez un patient à qui le programme n'est PAS
//    proposé ;
//  - la `priorite` conditionnelle de l'orientation (D14) : rang 1 devant une limitation physique connue,
//    rang de repli sinon. Le rang décide de ce qui est déplié ou replié à l'écran depuis K5.
// ═══════════════════════════════════════════════════════════════════════════════════════════════════
describe('rhd-activite-physique — R-P-06 : maintien, alerte de carte, rang de l’orientation', () => {
  it('2 à 3 séances par semaine + rupture de sédentarité → « Poursuivre les habitudes actuelles »', () => {
    const p = proposees({ frequence_activite_structuree: 'deux_a_trois_fois_semaine', rupture_sedentarite_habituelle: true })
    expect(p).toContain(POURSUIVRE)
    expect(p).not.toContain(MAINTENIR_PRATIQUE)
  })

  it('4 séances ou plus + rupture de sédentarité → « Maintenir la pratique actuelle »', () => {
    const p = proposees({
      frequence_activite_structuree: 'quatre_fois_ou_plus_semaine',
      rupture_sedentarite_habituelle: true,
    })
    expect(p).toContain(MAINTENIR_PRATIQUE)
    expect(p).not.toContain(POURSUIVRE)
  })

  it('actif mais sédentaire → AUCUN maintien, et les pistes de rupture s’ouvrent', () => {
    const PROFIL: Partial<Criteria> = {
      frequence_activite_structuree: 'quatre_fois_ou_plus_semaine',
      rupture_sedentarite_habituelle: false,
      temps_assis_quotidien: 'plus_8h',
    }
    const p = proposees(PROFIL)
    expect(p).not.toContain(MAINTENIR_PRATIQUE)
    expect(p).not.toContain(POURSUIVRE)
    expect(p).toContain(SE_LEVER)
  })

  it('l’alerte « évaluation médicale minimale » voyage avec la carte du programme', () => {
    const vue = vueOption(SEDENTAIRE, PROGRAMME_APA)
    expect(vue).toBeDefined()
    expect(vue!.alertes.some((a) => a.message.includes('évaluation médicale minimale'))).toBe(true)
  })

  it('l’orientation vers une structure remonte au rang 1 devant une limitation physique connue', () => {
    // Le signe ferme aussi le verrou : c'est le patient chez qui l'orientation compte le plus, puisque
    // la pratique structurée en autonomie vient de lui être retirée.
    expect(vueOption({ ...SEDENTAIRE, limitation_physique_connue: true }, ORIENTER_STRUCTURE)?.rang).toBe(1)
  })

  it('et reste au rang de repli quand seule l’offre de proximité fait défaut', () => {
    expect(vueOption({ ...SEDENTAIRE, offre_proximite_connue: false }, ORIENTER_STRUCTURE)?.rang).toBe(5)
  })
})
