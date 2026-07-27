/**
 * Banc — invariants INTER-NŒUDS (chantier 2026-07-27, causes racines S7 et S8 du `PLAN-CORRECTION.md`).
 *
 * CE QUE CE FICHIER AJOUTE, ET QUI N'EXISTAIT PAS. Tous les autres invariants du banc sont **locaux à un
 * nœud** — par construction, pas par oubli : `describe.each(noeuds)` les instancie un nœud à la fois, et
 * I4 (« un concept, un encodage ») ne peut donc voir que l'intérieur d'un fichier. Le contrôle qui
 * manquait est celui d'à côté : **deux nœuds qui nomment le même critère le décrivent-ils pareil ?**
 *
 * La passe adversariale transverse du 2026-07-27 a compté 4 divergences sur 13 critères partagés. Elles
 * ne sont pas cosmétiques :
 *  - `traitements_en_cours` déclare `insuline_basale`/`insuline_rapide` dans un nœud et `insuline` dans
 *    les trois autres — une règle écrite `traitements_en_cours contient insuline` est donc TOUJOURS
 *    fausse dans le premier, en silence ;
 *  - `preference_injection` déclare les mêmes valeurs dans un ORDRE différent — or `valeurParDefaut`
 *    (`lib/formLayout.ts`) renvoie la PREMIÈRE valeur déclarée : les deux nœuds présument donc des
 *    réponses par défaut opposées pour le même champ.
 *
 * Aucun de ces deux défauts n'est visible en lisant un nœud. C'est la définition d'un angle mort.
 *
 * GÉNÉRIQUE (CLAUDE.md invariant 5) : aucun nom de critère dans la logique — seules les tables de dette
 * en nomment, avec leur motif, exactement comme les autres constantes de dette du banc.
 */
import { existsSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { noeuds } from '../../content/loadNodes.ts'
import type { CritereEntree } from '../../content/node.types.ts'

// ---------------------------------------------------------------------------------------------------
// S7 — un critère partagé, un seul encodage
// ---------------------------------------------------------------------------------------------------

/**
 * Signature d'un critère : tout ce qui, s'il diffère d'un nœud à l'autre sous le MÊME nom, produit un
 * comportement différent pour la même question posée au praticien.
 *
 * `groupe` et `visible_si` en sont volontairement ABSENTS : ce sont des choix de mise en page propres à
 * chaque formulaire (un critère peut légitimement vivre dans une section différente, ou n'être
 * pertinent que sous condition dans un nœud et pas dans l'autre). Les inclure produirait du bruit sans
 * signaler aucune divergence de SENS.
 *
 * L'ordre de `valeurs` EST significatif et n'est donc pas normalisé : cf. `preference_injection` et
 * `valeurParDefaut` — c'est précisément une des divergences que cet invariant a mises au jour.
 */
function signatureCritere(critere: CritereEntree): string {
  return JSON.stringify({
    type: critere.type,
    valeurs: critere.valeurs,
    derive: critere.derive,
    min: critere.min,
    max: critere.max,
    confirmation_requise: critere.confirmation_requise ?? false,
  })
}

/**
 * Divergences CONNUES, nommées une par une avec leur nature et l'endroit où elles se corrigent. Ce ne
 * sont pas des dispenses : ce sont des constats datés, à résorber au lot 2 du `PLAN-CORRECTION.md`.
 *
 * Les quatre sont issues du même mouvement — le domaine DT2 a été écrit nœud par nœud, sur trois
 * semaines, sans qu'aucun mécanisme ne compare jamais deux nœuds. Deux d'entre elles demandent un
 * ARBITRAGE (quel vocabulaire, quelle définition), les deux autres sont de pure forme.
 */
const CRITERES_DIVERGENTS_CONNUS = new Map<string, string>([
  [
    'traitements_en_cours',
    'DIVERGENCE DE VOCABULAIRE, la plus grave des quatre. `insuline` déclare 9 valeurs dont ' +
      '`insuline_basale` et `insuline_rapide` (il a besoin de distinguer les deux agents) ; ' +
      '`prescription`, `rhd-alimentation` et `rhd-activite-physique` en déclarent 8 dont `insuline` ' +
      'indifférencié. Conséquence : une règle `traitements_en_cours contient insuline` est ' +
      'structurellement fausse dans le nœud `insuline`. Demande un ARBITRAGE (unifier sur 9 valeurs et ' +
      "adapter les règles des 3 autres nœuds, ou introduire un dérivé `insuline` = basale OU rapide). " +
      'Recoupe le défaut F de la recette référent (`visible_si` par valeur de liste).',
  ],
  [
    'cible_atteinte',
    'DIVERGENCE DE DÉFINITION. `insuline` dérive `HbA1c_actuelle <= HbA1c_cible` (comparaison directe) ; ' +
      '`prescription` dérive `position_vs_cible == a_l_objectif OR position_vs_cible == sous_objectif` ' +
      "(via un enum intermédiaire). Le même nom porte deux encodages d'un même concept — I4 exactement, " +
      "mais entre deux fichiers, là où l'invariant local ne peut pas le voir. Demande un ARBITRAGE : les " +
      'deux définitions coïncident-elles réellement sur tous les profils ?',
  ],
  [
    'terrain_cible_assouplie',
    "DIVERGENCE DE FORME, introduite le 2026-07-27 par la scission de `terrain_fragile` dans " +
      '`prescription` : les deux `derive` sont logiquement ÉQUIVALENTS mais écrits dans un ordre ' +
      "différent (`age >= 75 OR fragilite == true OR esperance_vie == limitee` contre " +
      '`fragilite OR esperance_vie == limitee OR age >= 75`), et l’un teste `fragilite` en booléen nu ' +
      "quand l'autre écrit `fragilite == true`. Aucun effet sur la sortie ; à unifier par hygiène (I4).",
  ],
  [
    'preference_injection',
    "DIVERGENCE D'ORDRE, à effet RÉEL malgré les apparences. Mêmes trois valeurs, mais " +
      '`insuline` déclare `[accepte, refuse, indifferent]` et `prescription` ' +
      '`[indifferent, accepte, refuse]`. Or `valeurParDefaut` (`lib/formLayout.ts`) renvoie la PREMIÈRE ' +
      'valeur déclarée : le primer affiché diffère donc entre les deux nœuds pour la même question. ' +
      "Aggravé par le défaut A de la recette (le primer s'affiche comme répondu sans l'être) — les deux " +
      'se corrigent au lot 1.',
  ],
])

describe('S7 — un critère partagé entre nœuds a un encodage unique', () => {
  const parNom = new Map<string, { noeud: string; signature: string }[]>()
  for (const node of noeuds) {
    for (const critere of node.criteres_entree) {
      if (!parNom.has(critere.nom)) parNom.set(critere.nom, [])
      parNom.get(critere.nom)!.push({ noeud: node.id, signature: signatureCritere(critere) })
    }
  }
  const partages = [...parNom.entries()].filter(([, occurrences]) => occurrences.length > 1).sort()

  it('le domaine partage bien des critères entre nœuds (sinon ce test ne teste rien)', () => {
    // Garde-fou de vacuité : si un jour plus aucun critère n'était partagé, les assertions ci-dessous
    // passeraient toutes pour la mauvaise raison. Déjà arrivé sur un autre test de ce banc.
    expect(partages.length).toBeGreaterThan(5)
  })

  it.each(partages.map(([nom, occurrences]) => [nom, occurrences] as const))(
    'critère partagé "%s" — même type, mêmes valeurs, même dérivation dans tous les nœuds',
    (nom, occurrences) => {
      const signatures = new Set(occurrences.map((o) => o.signature))
      const coherent = signatures.size === 1
      const motif = CRITERES_DIVERGENTS_CONNUS.get(nom)

      if (motif) {
        // Une dette qui se résorbe doit se SIGNALER, pas s'endormir : le jour où le contenu est unifié,
        // ce test échoue et réclame le retrait de l'entrée.
        expect(
          coherent,
          `Le critère "${nom}" est désormais COHÉRENT entre nœuds : retirer son entrée de ` +
            `CRITERES_DIVERGENTS_CONNUS (dette résorbée).`,
        ).toBe(false)
        return
      }

      expect(
        coherent,
        `Le critère "${nom}" est déclaré différemment selon les nœuds :\n` +
          occurrences.map((o) => `  ${o.noeud} → ${o.signature}`).join('\n') +
          `\nUn même nom doit porter un même encodage (I4, étendu à l'inter-nœuds). Unifier le contenu, ` +
          `ou — si la divergence est délibérée — la nommer et la motiver dans CRITERES_DIVERGENTS_CONNUS.`,
      ).toBe(true)
    },
  )
})

// ---------------------------------------------------------------------------------------------------
// S8 — tout nœud publié a des vignettes exécutables
// ---------------------------------------------------------------------------------------------------

/**
 * Nœuds SANS fichier de vignettes exécutables. Constat du 2026-07-27, relevé par la passe adversariale
 * RHD (« les deux nœuds RHD n'ont AUCUNE vignette exécutable ») et étendu ici par la mesure.
 *
 * POURQUOI CE N'EST PAS UNE DISPENSE. Les trois couches du banc (caractérisation, couverture,
 * invariants) sont MÉCANIQUES : elles vérifient que le contenu est cohérent avec lui-même, jamais qu'il
 * dit le vrai. Une vignette est le seul artefact qui affirme « pour CE patient, on attend CETTE
 * conduite » — c'est-à-dire la seule chose qu'un référent puisse relire cliniquement. Un nœud sans
 * vignette est un nœud dont aucune sortie n'a jamais été formulée comme une attente.
 *
 * L'écrire ici ne corrige rien ; ça rend l'absence VISIBLE et datée, là où elle ne l'était nulle part.
 *
 * ⚠ UNE DES TROIS ENTRÉES ÉTAIT FAUSSE, et le défaut est instructif. `cible-glycemique` y figurait sous
 * le motif « jamais doté de vignettes » — il en portait 19, contre le nœud RÉEL, depuis l'origine. Ce
 * test ne mesure pas l'absence de vignettes : il mesure la présence d'un FICHIER PORTANT UN NOM, et ce
 * nœud est le seul dont le banc précédait la convention de nommage (`evaluateNode.test.ts`, sans suffixe
 * — c'était alors le seul). La passe adversariale RHD le disait d'ailleurs noir sur blanc au même moment
 * (« les vignettes de `cible-glycemique` dans `evaluateNode.test.ts` », `verif-finale-rhd.md` §E) ; la
 * dette a été écrite sans confronter les deux. Résorbé le 2026-07-27 en RENOMMANT le fichier à la
 * convention : le nœud n'a rien gagné en couverture, l'inventaire a cessé de mentir.
 *
 * ✅ DETTE S8 SOLDÉE le 2026-07-27. Les deux entrées RHD, elles, étaient réelles — aucun profil-patient
 * nommé n'existait pour ces nœuds. Elles sont levées par `evaluateNode.rhd-alimentation.test.ts` et
 * `evaluateNode.rhd-activite-physique.test.ts` (56 assertions, 12 vignettes). ⚠ AVEC UNE RÉSERVE QUI DOIT
 * SURVIVRE À LA FERMETURE DE LA DETTE : ces vignettes-là verrouillent des ARBITRAGES CONSIGNÉS, elles
 * n'ont pas été relues patient par patient comme F-01…F-09 sur `statine`. Le fichier vide est comblé, la
 * relecture clinique reste due — cf. l'en-tête de chacun des deux bancs, qui le dit avant toute autre
 * chose. La table ci-dessous reste en place, vide : la prochaine absence sera de nouveau visible.
 */
const NOEUDS_SANS_VIGNETTES_CONNUS = new Map<string, string>([])

/** Convention du dépôt : un fichier de vignettes par nœud, nommé d'après son id. */
function cheminVignettes(id: string): string {
  return `src/features/decision/engine/evaluateNode.${id}.test.ts`
}

describe('S8 — tout nœud publié porte des vignettes exécutables', () => {
  it.each(noeuds.map((node) => [node.id] as const))('nœud %s', (id) => {
    const existe = existsSync(cheminVignettes(id))
    const motif = NOEUDS_SANS_VIGNETTES_CONNUS.get(id)

    if (motif) {
      expect(
        existe,
        `Le nœud "${id}" a désormais des vignettes (${cheminVignettes(id)}) : retirer son entrée de ` +
          `NOEUDS_SANS_VIGNETTES_CONNUS (dette résorbée).`,
      ).toBe(false)
      return
    }

    expect(
      existe,
      `Le nœud "${id}" n'a aucun fichier de vignettes (${cheminVignettes(id)} attendu). Une vignette ` +
        `est le seul artefact qui formule une ATTENTE clinique sur une sortie — sans elle, aucune ` +
        `relecture référent n'a de prise. À écrire, ou à déclarer dans NOEUDS_SANS_VIGNETTES_CONNUS.`,
    ).toBe(true)
  })
})
