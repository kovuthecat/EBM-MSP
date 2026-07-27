/**
 * Banc d'un nœud — COUCHE 3 « invariants », lot RÉDACTIONNEL. Invariant I20 : **tout identifiant de
 * contenu qu'un praticien peut lire à l'écran a un libellé RÉDIGÉ**, jamais le repli mécanique.
 *
 * POURQUOI CET INVARIANT EXISTE — un constat de recette, pas une précaution théorique. Les deux nœuds du
 * module RHD sont arrivés en recette avec ZÉRO de leurs 29 critères catalogué dans `labels.ts`. À l'écran,
 * le praticien lisait « Frequence boissons sucrees », « Retinopathie non stabilisee ou proliferante »,
 * « Quatre a huit h » — le repli `humanize` remplace les `_` par des espaces et met une majuscule, il ne
 * peut pas restituer les accents (rien dans le slug ne permet de les déduire, c'est écrit dans sa
 * docstring). Rien n'a échoué : le repli est un `??`, il réussit toujours. Un défaut qui ne se voit qu'à
 * l'œil, sur un écran qu'on n'ouvre pas à chaque `npm test`, est exactement ce qu'un invariant doit tenir.
 *
 * PORTÉE — les DEUX dictionnaires, sur TOUS les nœuds publiés. Un critère dérivé compte autant qu'un
 * critère saisi : depuis R6, la ligne « Proposé parce que » ne cite que les termes vrais, donc un dérivé
 * non catalogué s'affiche sous son nom de variable au même titre. Un cran d'énumération compte autant
 * qu'un critère : c'est ce que le praticien coche.
 *
 * CE QUE CET INVARIANT NE DIT PAS, et qu'aucun test ne peut dire : que le libellé soit JUSTE. Il vérifie
 * qu'une phrase a été écrite, pas qu'elle décrit le bon item — cette relecture-là reste humaine. Il ne
 * vérifie pas non plus l'orthographe du libellé rédigé ; il retire seulement le cas où PERSONNE n'a
 * rédigé, qui était la totalité du défaut constaté.
 *
 * GÉNÉRIQUE (CLAUDE.md invariant 5) : itère sur `noeuds` sans nommer aucun nœud, aucun domaine, aucun
 * critère. Un nouveau domaine hérite de l'invariant sans qu'on y touche — et le repli `humanize` reste en
 * place pour le runtime, il cesse simplement d'être une sortie acceptable pour du contenu publié.
 */
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { noeuds } from '../../content/loadNodes.ts'
import { libelleCritereCatalogue, libelleValeurCatalogue } from '../../lib/labels.ts'

describe('I20 — tout identifiant affiché a un libellé rédigé', () => {
  it.each(noeuds.map((noeud) => [noeud.id, noeud] as const))(
    '%s — chaque critère d’entrée a un libellé',
    (_id, noeud) => {
      const sansLibelle = noeud.criteres_entree
        .filter((critere) => !libelleCritereCatalogue(critere.nom))
        .map((critere) => critere.nom)
      expect(sansLibelle, `critères sans libellé rédigé dans lib/labels.ts : ${sansLibelle.join(', ')}`).toEqual([])
    },
  )

  it.each(noeuds.map((noeud) => [noeud.id, noeud] as const))(
    '%s — chaque valeur d’énumération a un libellé',
    (_id, noeud) => {
      const sansLibelle = new Set<string>()
      for (const critere of noeud.criteres_entree) {
        for (const valeur of critere.valeurs ?? []) {
          if (!libelleValeurCatalogue(valeur)) sansLibelle.add(`${critere.nom}.${valeur}`)
        }
      }
      const manquantes = [...sansLibelle]
      expect(manquantes, `valeurs sans libellé rédigé dans lib/labels.ts : ${manquantes.join(', ')}`).toEqual([])
    },
  )
})

/**
 * GARDE-FOU DU GARDE-FOU. L'invariant ci-dessus se satisferait d'un dictionnaire qui contiendrait la
 * terre entière : il teste une présence, pas une pertinence. Ce test vérifie qu'il n'est pas satisfait
 * par excès de zèle — un identifiant catalogué mais qu'aucun nœud ne déclare est du libellé mort, et il
 * masquerait le jour où le contenu renomme un critère (l'ancienne clé resterait, la nouvelle manquerait,
 * mais on ne verrait que la seconde).
 *
 * ⚠ IL NE S'AGIT PAS D'UN ÉCHEC : les clés mortes sont TOLÉRÉES et seulement DÉNOMBRÉES, avec un plafond
 * qui ne peut que descendre. Certaines sont légitimes — `UPCOMING_DOMAINS` annonce des domaines sans
 * contenu, et le dictionnaire a été transcrit du cadrage des 8 nœuds, dont un (G) a été retiré. Le
 * plafond fige l'existant et interdit d'en ajouter.
 */
describe('I20bis — le dictionnaire ne se remplit pas de libellés morts', () => {
  const declares = new Set<string>()
  const valeursDeclarees = new Set<string>()
  for (const noeud of noeuds) {
    for (const critere of noeud.criteres_entree) {
      declares.add(critere.nom)
      for (const valeur of critere.valeurs ?? []) valeursDeclarees.add(valeur)
    }
  }

  /**
   * MESURÉ le 2026-07-27, pas estimé — un plafond avec du mou ne mesure rien. Ne peut que DESCENDRE.
   *
   * Les 11 critères : `IRC`, `prevention`, `SCORE2`, `contrainte_cout`, `motivation`, `capacite_activite`,
   * `alimentation_equilibree`, `activite_physique_reguliere`, `TIR`, `TAR`, `GMI`. Tous transcrits du
   * dictionnaire de cadrage des 8 nœuds ; certains ont été explicitement RETIRÉS depuis (`contrainte_cout`,
   * décision référent Q1 du nœud D : le coût n'est pas un critère en France), d'autres attendent un nœud
   * qui les déclare. Les 4 valeurs : `primaire`/`secondaire` (l'énumération `prevention`, du même lot),
   * `insuline` (`traitements_en_cours` distingue basale et rapide depuis la fusion) et `hypo_interprandiale`
   * — celui-là n'est pas un reliquat de cadrage mais un DÉPLACEMENT que ce test vient de mettre au jour :
   * c'était un cran de `profil_glycemique`, c'est devenu un booléen propre du nœud E. Le libellé d'énum est
   * resté derrière lui. On le garde (il ne nuit pas, et le cran peut revenir) ; on le sait, maintenant.
   */
  const PLAFOND_CRITERES_MORTS = 11
  const PLAFOND_VALEURS_MORTES = 4

  it('ne catalogue pas plus de critères morts qu’au jour du relevé', () => {
    const morts = [...cataloguesCriteres()].filter((nom) => !declares.has(nom))
    expect(morts.length, `critères catalogués que plus aucun nœud ne déclare : ${morts.join(', ')}`).toBeLessThanOrEqual(
      PLAFOND_CRITERES_MORTS,
    )
  })

  it('ne catalogue pas plus de valeurs mortes qu’au jour du relevé', () => {
    const morts = [...cataloguesValeurs()].filter((valeur) => !valeursDeclarees.has(valeur))
    expect(morts.length, `valeurs cataloguées que plus aucun nœud ne déclare : ${morts.join(', ')}`).toBeLessThanOrEqual(
      PLAFOND_VALEURS_MORTES,
    )
  })
})

/**
 * Les deux dictionnaires ne sont pas exportés (ils n'ont aucune raison de l'être hors de leur module) et
 * on ne va pas les exporter pour un test. On relit donc le SOURCE — ce que ce banc fait déjà ailleurs pour
 * mesurer une propriété du code plutôt que du contenu. Volontairement rustique : si la forme du fichier
 * change, la lecture renvoie un ensemble vide et les deux tests ci-dessus passent trivialement, ce qui est
 * le bon sens de la défaillance pour un test de dénombrement (il ne doit jamais bloquer une évolution de
 * forme, seulement compter tant qu'il sait compter).
 */
function clefsDuDictionnaire(nom: string): Set<string> {
  const source = sourceLabels()
  const debut = source.indexOf(`const ${nom}: Record<string, string> = {`)
  if (debut === -1) return new Set()
  const corps = source.slice(debut).split('\n}')[0]
  return new Set([...corps.matchAll(/^ {2}([A-Za-z_][A-Za-z0-9_]*)\s*:/gm)].map((m) => m[1]))
}

let cacheSource: string | undefined
function sourceLabels(): string {
  if (cacheSource === undefined) {
    try {
      cacheSource = readFileSync(new URL('../../lib/labels.ts', import.meta.url), 'utf8')
    } catch {
      cacheSource = ''
    }
  }
  return cacheSource
}

function cataloguesCriteres(): Set<string> {
  return clefsDuDictionnaire('CRITERE_LABELS')
}

function cataloguesValeurs(): Set<string> {
  return clefsDuDictionnaire('ENUM_VALUE_LABELS')
}
