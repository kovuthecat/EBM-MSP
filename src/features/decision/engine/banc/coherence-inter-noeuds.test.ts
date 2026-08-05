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
    // Renommé le 2026-07-28 (P4/S1, T-018), ex-`confirmation_requise` : même rôle dans la signature —
    // deux nœuds qui présument différemment le même critère partagé encodent le même concept
    // différemment (I4, étendu à l'inter-nœuds).
    presomption_non: critere.presomption_non ?? false,
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
    "DIVERGENCE REDUITE A UNE SEULE DIMENSION, ASSUMEE, le 2026-07-29 — et la moitie de cette entree " +
      "etait devenue FAUSSE. Ce qu'elle affirmait : « `insuline` declare 9 valeurs, `prescription` 8 dont " +
      "`insuline` indifferencie, donc `traitements_en_cours contient insuline` est structurellement " +
      "fausse dans `insuline` ». CE N'EST PLUS VRAI : les deux noeuds declarent aujourd'hui LES MEMES " +
      "9 VALEURS (`insuline_basale`/`insuline_rapide` inclus des deux cotes) ; seul l'ORDRE differait, " +
      "et il a ete aligne le 2026-07-29. Divergence de vocabulaire resorbee, sans arbitrage.\n" +
      "CE QUI RESTE, ET QUI EST UN CHOIX : `presomption_non` — `true` sur `insuline`, ABSENT sur " +
      "`prescription`, ou ce critere gate plusieurs conditions d'option `role: securite` et des " +
      "exclusions renales/cetose (D30/T-018). Une liste non repondue doit y rester INDETERMINEE ; " +
      "l'aligner modifierait une posture de SECURITE que personne n'a demande de changer.\n" +
      "POURQUOI CE RESIDU N'EMPECHE PAS `partage: true` (marque sur les deux noeuds le 2026-07-29). Les " +
      "deux mecanismes sont DISJOINTS — verifie dans le code, pas suppose : `lib/sessionCriteres.ts` ne " +
      "memorise que les criteres `partage` dont le nom est dans `touched` (`memoriserCriteres`), et ne " +
      "reprend que si `valeurCompatible` l'accepte — or celle-ci ne regarde que `type`, `valeurs`, `min` " +
      "et `max`, JAMAIS `presomption_non`. Celui-ci ne sert qu'a `determinesEffectifs` (determinisme du " +
      "moteur) et ne regit donc que le cas NON touche, precisement celui qui n'est jamais memorise. Une " +
      "valeur cochee est une reponse reelle : la propager n'affaiblit aucune presomption.\n" +
      "NB SUR LA PORTEE DE CET INVARIANT : il s'applique a tout nom declare par au moins 2 noeuds, " +
      "INDEPENDAMMENT de `partage` (cf. la construction de `partages` ci-dessous, qui ne filtre pas sur " +
      "ce drapeau). Marquer `partage` ne l'a donc ni declenche ni contourne : ce critere y etait deja " +
      "soumis.\n" +
      "PERIMETRE REDUIT DE MOITIE LE 2026-07-29 (volet anterieur) : les deux noeuds RHD ne declarent " +
      "PLUS ce nom — ils ne lisaient que l'exposition a l'hypoglycemie et le disent par un bool a eux, " +
      "`insuline_ou_insulinosecreteur` (R5).",
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
// I32 (P13/S5, T-147) — un critère `partage: true` a le même encodage partout où il est partagé
// ---------------------------------------------------------------------------------------------------

/**
 * PORTÉE DISTINCTE DE S7 CI-DESSUS, MÊME SI LE RECOUVREMENT EST LARGE AUJOURD'HUI. S7 vérifie la
 * signature COMPLÈTE (`type`, `valeurs`, `derive`, `min`, `max`, `presomption_non`) de TOUT nom porté
 * par plus d'un nœud, `partage` ou non — un filet de sûreté sur le CONTENU en général, qui existait
 * déjà avant cette tâche. I32 vérifie une propriété plus étroite, mais avec une conséquence RUNTIME
 * précise et DIFFÉRENTE : c'est exactement ce que lit `valeurCompatible` (`lib/sessionCriteres.ts`) pour
 * décider si une valeur MÉMORISÉE peut être REPRISE par l'autre nœud — `type` et, pour un `enum`/
 * `liste`, les `valeurs` déclarées. Ni `min`/`max` (qui bornent une VALEUR à l'instant de la reprise,
 * pas la définition du critère — une valeur hors bornes du nœud lecteur est refusée au cas par cas,
 * silencieusement, sans que l'encodage soit fautif pour autant) ni `presomption_non` (qui ne régit que
 * le cas NON touché, jamais mémorisé — cf. l'entrée `traitements_en_cours` de
 * `CRITERES_DIVERGENTS_CONNUS` ci-dessus, où c'est exactement le raisonnement qui autorise `partage`
 * malgré une divergence de `presomption_non`) n'entrent dans cette signature réduite. Un critère qui
 * échoue I32 promet un partage que `valeurCompatible` refusera TOUJOURS en silence (`type` différent) ou
 * PARFOIS en silence (`valeurs` d'un `enum`/`liste` qui ne se recouvrent pas totalement) — c'est
 * exactement le piège nommé par `plans/P13/S5.md` (« le partage sera refusé en silence »).
 */
function signaturePartage(critere: CritereEntree): string {
  return JSON.stringify({ type: critere.type, valeurs: critere.valeurs })
}

describe('I32 — un critère `partage: true` a le même type (et les mêmes `valeurs`) dans tous les nœuds qui le partagent', () => {
  const parNom = new Map<string, { noeud: string; signature: string }[]>()
  for (const node of noeuds) {
    for (const critere of node.criteres_entree) {
      if (critere.partage !== true) continue
      if (!parNom.has(critere.nom)) parNom.set(critere.nom, [])
      parNom.get(critere.nom)!.push({ noeud: node.id, signature: signaturePartage(critere) })
    }
  }
  const partages = [...parNom.entries()].filter(([, occurrences]) => occurrences.length > 1).sort()

  it('au moins un critère `partage: true` est déclaré par plus d’un nœud (sinon ce test ne teste rien)', () => {
    // Même garde-fou de vacuité que S7 ci-dessus. `poids` (T-147) suffit déjà à lui seul à le tenir vrai.
    expect(partages.length).toBeGreaterThan(0)
  })

  it.each(partages.map(([nom, occurrences]) => [nom, occurrences] as const))(
    'critère `partage: true` "%s" — même `type`, mêmes `valeurs` partout où il est partagé',
    (nom, occurrences) => {
      const signatures = new Set(occurrences.map((o) => o.signature))
      expect(
        signatures.size === 1,
        `Le critère "${nom}" est déclaré \`partage: true\` avec un encodage différent selon les nœuds :\n` +
          occurrences.map((o) => `  ${o.noeud} → ${o.signature}`).join('\n') +
          `\nLe partage est alors promis et refusé en silence (\`valeurCompatible\`, ` +
          `\`lib/sessionCriteres.ts\`) : aligner l'encodage, ou retirer \`partage\` d'un des deux côtés.`,
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
