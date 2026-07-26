/**
 * CARACTÉRISATION (golden master) de la sortie actuelle du moteur de décision, nœud par nœud.
 *
 * POURQUOI CE TEST EXISTE. `docs/decision/validation/recette-2026-07-25-prescription-intensifier.md`
 * (§ « Synthèse — ce que ces anomalies ont en commun », capture 12 ; § « Synthèse — comparaison avec le
 * nœud `insuline` », capture 13) a mis au jour une cause racine GÉNÉRIQUE, commune aux nœuds explorés,
 * pas un défaut isolé d'un seul nœud : **le moteur ne distingue pas « non renseigné » de « zéro »**. Un
 * critère `nombre` vide vaut `0` et entre tel quel dans les comparaisons — tantôt lu comme rassurant
 * (`HbA1c_actuelle <= HbA1c_cible`), tantôt comme alarmant (`DFG < 45`), parfois en division par zéro
 * (`over_basalisation`). Le formulaire VIERGE du nœud `statine` (capture 13.1) affiche même, en mode
 * `ordered-first-match`, une recommandation UNIQUE et DÉFINITIVE construite entièrement sur des champs
 * à `0`/`false` jamais saisis. Une REFONTE de la sémantique des valeurs manquantes est prévue pour
 * corriger cette cause racine (cf. aussi `docs/decision/GRAMMAIRE-NOEUD.md`, R5 : « un critère qu'on
 * demande doit agir »).
 *
 * Ce fichier NE JUGE PAS si la sortie actuelle est correcte — il la FIGE telle quelle, nœud par nœud,
 * pour que la refonte à venir puisse être MESURÉE contre un état de référence connu plutôt que contre
 * le souvenir de qui l'a écrite. Le profil VIERGE (`buildDefaultCriteria`, profil n° 0 de chaque
 * fichier) est délibérément le premier profil de chaque snapshot : c'est le cas que 13.1/12.1
 * désignent comme le plus trompeur (« le nœud affirme une recommandation sur des champs qu'il déclare
 * par ailleurs ne pas savoir »), donc le premier que la refonte doit faire bouger de façon visible.
 *
 * ⚠ UN DIFF DE SNAPSHOT N'EST PAS UNE RÉGRESSION EN SOI. Ce test ne vérifie AUCUNE propriété clinique ;
 * il compare une sortie à elle-même. Le jour où la refonte des valeurs manquantes fera diverger un
 * `__snapshots__/caracterisation.<id>.txt`, ce diff est le LIVRABLE attendu de cette tâche — il doit
 * être RELU nœud par nœud (référent clinique), jamais accepté à l'aveugle par une régénération
 * automatique, et jamais traité comme un échec de test à « corriger » en modifiant le moteur pour que
 * l'ancien texte revienne. C'est l'inverse exact de `couverture.test.ts`/`invariants.test.ts` (couches
 * 2/3 du banc, `docs/decision/GRAMMAIRE-NOEUD.md` § « Le banc d'un nœud — trois couches »), qui vérifient
 * des PROPRIÉTÉS et sont censés rester au vert.
 *
 * GÉNÉRIQUE (CLAUDE.md invariant 5 / DECISIONS.md D8) : itère sur `noeuds`, aucun id de nœud ni nom de
 * critère codé en dur — un futur domaine (hors DT2) obtient sa caractérisation sans modification de ce
 * fichier.
 *
 * UN SNAPSHOT PAR NŒUD (`__snapshots__/caracterisation.<id>.txt`, un fichier par `describe.each`) : un
 * diff se lit nœud par nœud, sans le bruit des quatre autres nœuds mélangés dans un seul fichier —
 * même logique que la demande de tâche, cf. aussi comment `couverture.test.ts`/`invariants.test.ts`
 * séparent déjà leurs assertions par nœud via `describe.each`.
 *
 * COÛT : n'appelle JAMAIS `criteresPertinents`/`engine/relevance.ts` (perturbation coûteuse — ~23 s
 * pour le banc couverture + invariants complet, dont l'essentiel est R5, cf. `GRAMMAIRE-NOEUD.md`) ;
 * seulement `construireVueDecision` (un `evaluateNode` par profil), la même brique que l'écran.
 *
 * DÉTERMINISME : profils tirés par `genererProfils` (PRNG mulberry32 à graine fixe, cf. `profils.ts`) ;
 * le profil n° 0 vient de `buildDefaultCriteria`, une fonction pure sans aléa. Aucune horloge, aucun
 * `Math.random`, aucun `Set`/`Map` itéré dans un ordre non déterministe dans ce fichier. À contenu
 * inchangé, deux exécutions consécutives produisent des fichiers de snapshot BYTE À BYTE identiques.
 */
import { describe, expect, it } from 'vitest'
import { noeuds } from '../../content/loadNodes.ts'
import type { Noeud } from '../../content/node.types.ts'
import type { Criteria, CriteriaValue } from '../conditions.ts'
import { buildDefaultCriteria } from '../../lib/formLayout.ts'
import { construireVueDecision, signatureVue } from '../../lib/vueDecision.ts'
import type { OptionVue, VueDecision } from '../../lib/vueDecision.ts'
import { genererProfils, genererProfilsPartiels } from './profils.ts'
import type { ProfilPartiel } from './profils.ts'

/**
 * Taille du banc de caractérisation : PROFIL VIERGE (index 0) compris — un volume délibérément
 * MODESTE, pas `tailleBanc(node)` (qui vise jusqu'à 2000 profils sur un nœud riche comme
 * `prescription`, cf. `profils.ts`) : ce test ne porte PAS la couverture exhaustive, déjà à la charge
 * de `couverture.test.ts`/`invariants.test.ts` — seulement une empreinte assez large pour qu'une
 * refonte des valeurs manquantes fasse apparaître un diff visible sur chaque nœud qu'elle touche.
 *
 * Choisi à 180, PAS 300 (la cible initiale de tâche) : mesuré une fois à 300, le total des 5 fichiers
 * de snapshot atteignait 3,0 Mo — au-dessus du budget de 2 Mo — parce que `signatureVue` (non modifiée
 * ici, cf. contrainte de tâche) produit des lignes bien plus longues sur les nœuds riches en options
 * que sur un petit nœud : ~4,5 Ko/profil sur `prescription` (23 options), ~2,7 Ko sur `insuline`, contre
 * ~160 o sur `cible-glycemique`. 180 ramène le total mesuré à ~1,9 Mo (marge conservée), en restant
 * proche de la cible qualitative « quelques centaines de profils » de la tâche.
 */
const NB_PROFILS_CARACTERISATION = 180

/**
 * Parmi les `NB_PROFILS_CARACTERISATION` profils, nombre de profils rendus EN CLAIR (critères saisis +
 * familles/options/badges/alertes/écartées) en tête de fichier — au-delà, seule la signature compacte
 * de `signatureVue` est listée. Le profil n° 0 (VIERGE) est TOUJOURS dans cette fenêtre (cf. exigence de
 * tâche : « c'est le cas le plus important à surveiller »). 10 profils en clair suffisent à interpréter
 * un diff de signature sans dérouler les 300 profils à la main.
 */
const NB_PROFILS_DETAILLES = 10

/** Rendu textuel d'une valeur de critère saisie (nombre / booléen / énumération / liste). */
function formatValeurCritere(valeur: CriteriaValue): string {
  if (Array.isArray(valeur)) return valeur.length > 0 ? `[${valeur.join(', ')}]` : '[]'
  return String(valeur)
}

/**
 * Critères SAISISSABLES (non `derive`) d'un profil, en clair — les critères dérivés sont un CALCUL, pas
 * une saisie, cf. `formLayout.ts`/`deriveCritere.ts` ; les montrer laisserait croire qu'ils ont été
 * entrés à la main.
 *
 * `renseignes` (R7, DECISIONS.md D20) : OPTIONNEL, AJOUTÉ pour la caractérisation de l'indétermination
 * (`construireContenuCaracterisationIndeterminee` ci-dessous) — SANS EFFET sur les appels existants (la
 * caractérisation « profils complets » ne le passe jamais, cf. `construireContenuCaracterisation`) :
 * marque chaque ligne `■` (renseigné) / `○` (NON renseigné → indéterminé, SPEC §2.2) quand fourni, sinon
 * ne préfixe rien — texte STRICTEMENT identique à avant ce paramètre, aucun risque pour les snapshots
 * `caracterisation.<id>.txt` déjà commités.
 */
function rendreCriteresSaisisEnClair(node: Noeud, criteria: Criteria, renseignes?: ReadonlySet<string>): string[] {
  return node.criteres_entree
    .filter((critere) => critere.derive == null)
    .map((critere) => {
      const marque = renseignes === undefined ? '' : renseignes.has(critere.nom) ? '■ ' : '○ '
      return `  ${marque}- ${critere.nom} = ${formatValeurCritere(criteria[critere.nom])}`
    })
}

/** Rendu en clair d'une option affichée (badge, raisons situationnelles, doses, motif de rang, alertes). */
function rendreOptionEnClair(ov: OptionVue): string[] {
  const lignes = [`  - [${ov.badge ?? '(sans badge)'}] ${ov.option.intitule}`]
  if (ov.reasons.length > 0) lignes.push(`      proposé parce que : ${ov.reasons.join(' ; ')}`)
  if (ov.motifRang) lignes.push(`      rang motivé par : ${ov.motifRang}`)
  if (ov.calculs.length > 0) {
    lignes.push(`      calculs : ${ov.calculs.map((c) => `${c.libelle} = ${c.valeur}${c.unite ?? ''}`).join(' ; ')}`)
  }
  if (ov.alertes.length > 0) {
    lignes.push(`      alertes d'option : ${ov.alertes.map((a) => `${a.message} [${a.niveau ?? 'info'}]`).join(' ; ')}`)
  }
  return lignes
}

/** Rendu en clair d'une `VueDecision` complète : familles/options/badges, alertes de nœud, écartées. */
function rendreVueEnClair(vue: VueDecision): string[] {
  const lignes: string[] = []
  const famillesAvecOptions = vue.familles.filter((famille) => famille.groupes.length > 0)

  if (famillesAvecOptions.length === 0) {
    lignes.push('  (aucune option applicable — sortie vide)')
  }
  for (const famille of famillesAvecOptions) {
    lignes.push(`  Famille « ${famille.libelle ?? '(repli à plat)'} » (exclusive: ${famille.exclusive ?? 'n/a'}) :`)
    famille.groupes.forEach((groupe, gi) => {
      if (famille.groupes.length > 1) lignes.push(`    -- groupe d'égalité #${gi} --`)
      for (const ov of groupe) lignes.push(...rendreOptionEnClair(ov))
    })
  }

  if (vue.alertes.length > 0) {
    lignes.push('  Alertes de nœud :')
    for (const alerte of vue.alertes) lignes.push(`    - ${alerte.message} [${alerte.niveau ?? 'info'}]`)
  }

  if (vue.ecartees.length > 0) {
    lignes.push('  Options écartées (sécurité, R4) :')
    for (const ecartee of vue.ecartees) lignes.push(`    - ${ecartee.option.intitule} :: ${ecartee.motifs.join(' ; ')}`)
  }

  // Registre EN ATTENTE (R7, DECISIONS.md D20, SPEC §2.5) : NI proposée NI écartée — toujours vide sur
  // la caractérisation « profils complets » (jamais de `renseignes` passé, cf. `construireVueDecision`
  // sans 3e argument ci-dessous) donc SANS EFFET sur les snapshots déjà commités ; non vide sur la
  // caractérisation de l'indétermination, où c'est précisément ce que ce chantier doit rendre lisible.
  if (vue.enAttente.length > 0) {
    lignes.push('  Options EN ATTENTE (indétermination, R7/D20) :')
    for (const attente of vue.enAttente) {
      lignes.push(`    - ${attente.option.intitule} :: à renseigner : ${attente.manquants.join(', ')}`)
    }
  }

  return lignes
}

/** Bloc complet (titre + critères saisis + sortie) d'un profil rendu en clair. */
function rendreProfilEnClair(index: number, node: Noeud, criteria: Criteria, vue: VueDecision): string {
  const titre = index === 0 ? 'Profil #0 — VIERGE (buildDefaultCriteria — cas le plus surveillé)' : `Profil #${index}`
  const lignes = [`### ${titre}`, '', 'Critères saisis :', ...rendreCriteresSaisisEnClair(node, criteria)]
  lignes.push('', 'Sortie :', ...rendreVueEnClair(vue))
  return lignes.join('\n')
}

/**
 * Construit le contenu texte complet du snapshot d'un nœud : en-tête, `NB_PROFILS_DETAILLES` profils en
 * clair (profil 0 = VIERGE compris), puis la signature compacte des `NB_PROFILS_CARACTERISATION`
 * profils (les mêmes premiers profils inclus, pour qu'un diff de signature soit repérable même sans
 * dérouler la section « en clair »).
 */
function construireContenuCaracterisation(node: Noeud): string {
  const profilVierge = buildDefaultCriteria(node.criteres_entree)
  // `genererProfils` peut renvoyer PLUS que demandé si le produit cartésien des critères énumérables du
  // nœud le dépasse (plancher de couverture exhaustive, cf. `profils.ts` `tailleEffective`) : `slice`
  // borne le volume ICI, indépendamment de ce plancher — exigence de tâche « ~300, pas tailleBanc si
  // celui-ci est beaucoup plus grand ». Déterministe : mêmes premiers éléments à chaque exécution.
  const profilsGeneres = genererProfils(node, NB_PROFILS_CARACTERISATION - 1).slice(0, NB_PROFILS_CARACTERISATION - 1)
  const profils: Criteria[] = [profilVierge, ...profilsGeneres]
  const vues: VueDecision[] = profils.map((criteria) => construireVueDecision(node, criteria))

  const lignes: string[] = [
    `# CARACTÉRISATION (golden master) — nœud « ${node.id} » (${node.titre})`,
    '#',
    "# Un diff ICI n'est PAS une régression en soi : il doit être RELU, cf. le docstring de tête de",
    '# caracterisation.test.ts (référence : docs/decision/validation/recette-2026-07-25-...md,',
    '# § synthèses des captures 12 et 13, et docs/decision/GRAMMAIRE-NOEUD.md).',
    `# ${profils.length} profils au total (index 0 = profil VIERGE) ; les ${NB_PROFILS_DETAILLES} premiers`,
    '# sont rendus en clair ci-dessous, tous sont ensuite listés en signature compacte.',
    '',
    '## Profils détaillés (en clair)',
    '',
  ]

  profils.slice(0, NB_PROFILS_DETAILLES).forEach((criteria, i) => {
    lignes.push(rendreProfilEnClair(i, node, criteria, vues[i]))
    lignes.push('')
  })

  lignes.push('## Signatures compactes (toutes les entrées, y compris les profils détaillés ci-dessus)', '')
  vues.forEach((vue, i) => lignes.push(`${i} :: ${signatureVue(vue)}`))

  return `${lignes.join('\n')}\n`
}

describe.each(noeuds.map((node) => [node.id, node] as const))(
  'banc — caractérisation (golden master) · nœud %s',
  (_id, node) => {
    it(
      `${NB_PROFILS_CARACTERISATION} profils, snapshot __snapshots__/caracterisation.${node.id}.txt ` +
        '(diff à RELIRE, jamais accepté à l’aveugle — cf. docstring de tête)',
      async () => {
        const contenu = construireContenuCaracterisation(node)
        await expect(contenu).toMatchFileSnapshot(`./__snapshots__/caracterisation.${node.id}.txt`)
      },
    )
  },
)

// =======================================================================================================
// R7 · CARACTÉRISATION DE L'INDÉTERMINATION (DECISIONS.md D20, `docs/decision/validation/
// chantier-2026-07-26/SPEC-valeur-indeterminee.md` §2) — FICHIERS DE SNAPSHOT SÉPARÉS, ci-dessous.
//
// POURQUOI UN SECOND JEU DE FICHIERS, ET PAS UNE EXTENSION DU PREMIER. La caractérisation ci-dessus
// (`construireContenuCaracterisation`) n'appelle JAMAIS `construireVueDecision` avec un 3e argument : ses
// 180 profils par nœud sont donc, par construction, toujours COMPLETS (repli « tout est renseigné »,
// `engine/evaluateNode.ts`) — le golden master « profils complets » est la ligne de base HISTORIQUE
// (« qui prescrivait le tier avant R7 ») et DOIT rester directement comparable d'une exécution à l'autre,
// R7 ou pas. R7 ne peut donc STRUCTURELLEMENT rien y faire apparaître (cf. tête de fichier de tâche :
// « diff de 0 profil changé sur 4 nœuds sur 5 » avant ce lot) — ce n'est PAS une preuve que R7 ne fait
// rien, c'est la preuve que ce golden master ne peut pas voir R7 DU TOUT. `__snapshots__/
// caracterisation-indetermine.<id>.txt`, ci-dessous, est le fichier qui peut : chaque profil y a un
// `renseignes` PARTIEL (voire vide), le seul état qui met la sémantique R7 sous test.
//
// DOCUMENT DE RELECTURE CLINIQUE, pas un golden master compact : `NB_PROFILS_PARTIELS` reste MODESTE (à
// la différence de `NB_PROFILS_CARACTERISATION` = 180) et TOUS les profils sont rendus EN CLAIR — aucune
// section « signatures compactes » ici. Le référent doit pouvoir lire, sans dérouler de code, POUR
// CHAQUE profil : quels champs manquent (`■`/`○`, `rendreCriteresSaisisEnClair`) et ce que le moteur en
// fait, notamment le registre `enAttente` (« à renseigner : … », ajouté à `rendreVueEnClair` ci-dessus).
// =======================================================================================================

/** Profils partiels rendus PAR NŒUD, en plus du profil VIERGE (index 0) — cf. `genererProfilsPartiels`
 * (`profils.ts`) pour la construction (un critère critique masqué seul, puis un masque stratifié plus
 * large). Volume modeste À DESSEIN : contrairement au golden master ci-dessus, TOUS ces profils sont
 * rendus en clair (aucune section signature compacte) — un document de relecture, pas un instrument de
 * couverture exhaustive (déjà porté par `couverture.test.ts`/`invariants.test.ts`). */
const NB_PROFILS_PARTIELS = 14

/**
 * Description mécanique (PAS un jugement clinique) de la construction d'un profil partiel — ce que
 * `genererProfilsPartiels` a retiré de `renseignes`, pour que le titre de chaque bloc explique
 * lui-même son intention de test sans avoir à consulter `profils.ts`.
 *
 * Utilise `profil.regime`, PAS `profil.masque.length` : un masque STRATIFIÉ peut, par hasard, retirer
 * exactement UN critère sur un petit nœud (`statine`, 6 critères saisissables) — s'y fier libellerait à
 * tort ce profil « ciblé » (impliquant qu'il a été choisi pour son rôle dans une `exclusions`, ce qui ne
 * serait pas le cas), cf. docstring `ProfilPartiel` (`profils.ts`).
 */
function decrireMasque(profil: ProfilPartiel): string {
  if (profil.masque.length === 0) return 'témoin — entièrement renseigné'
  if (profil.regime === 'critique') {
    return `1 critère masqué (ciblé — cité par une \`exclusions\` du nœud) : ${profil.masque[0]}`
  }
  return `${profil.masque.length} critère(s) masqué(s) (masque stratifié) : ${profil.masque.join(', ')}`
}

/** Bloc complet (titre + critères saisis marqués ■/○ + sortie) d'un profil PARTIELLEMENT renseigné. */
function rendreProfilPartielEnClair(
  index: number,
  node: Noeud,
  criteria: Criteria,
  renseignes: ReadonlySet<string>,
  vue: VueDecision,
  sousTitre: string,
): string {
  const lignes = [
    `### Profil #${index} — ${sousTitre}`,
    '',
    'Critères saisis (■ renseigné · ○ NON renseigné → indéterminé, D20) :',
    ...rendreCriteresSaisisEnClair(node, criteria, renseignes),
  ]
  lignes.push('', 'Sortie :', ...rendreVueEnClair(vue))
  return lignes.join('\n')
}

/**
 * Construit le contenu texte complet du snapshot d'indétermination d'un nœud : le profil VIERGE
 * (`buildDefaultCriteria`, `renseignes` VIDE — LE cas le plus surveillé du chantier, cf. tâche : « c'est
 * lui qui doit montrer que `statine` cesse d'afficher... et que `prescription` cesse d'écarter la
 * metformine... »), puis `NB_PROFILS_PARTIELS` profils partiels (`genererProfilsPartiels`), TOUS en clair.
 */
function construireContenuCaracterisationIndeterminee(node: Noeud): string {
  const vierge = buildDefaultCriteria(node.criteres_entree)
  const vueVierge = construireVueDecision(node, vierge, new Set())

  const partiels = genererProfilsPartiels(node, NB_PROFILS_PARTIELS)

  const lignes: string[] = [
    `# CARACTÉRISATION — INDÉTERMINATION (R7, DECISIONS.md D20) — nœud « ${node.id} » (${node.titre})`,
    '#',
    '# Fichier SÉPARÉ de caracterisation.<id>.txt (profils COMPLETS, ligne de base stable, jamais',
    "# modifiée par ce lot) : tout profil ci-dessous a un `renseignes` PARTIEL, voire vide — c'est",
    '# STRUCTURELLEMENT ce que le golden master des profils complets ne peut jamais montrer (cf. tête de',
    '# fichier ci-dessus). Document de RELECTURE CLINIQUE (référent) : chaque profil est rendu EN CLAIR,',
    '# jamais seulement en signature ; le registre « en attente » (D20 §2.5) y est lisible avec les',
    '# critères manquants. Référence : docs/decision/validation/chantier-2026-07-26/',
    '# SPEC-valeur-indeterminee.md §2.',
    `# ${1 + partiels.length} profils au total, TOUS rendus en clair (index 0 = profil VIERGE,`,
    '# renseignes = ∅).',
    '',
    rendreProfilPartielEnClair(
      0,
      node,
      vierge,
      new Set(),
      vueVierge,
      'VIERGE — buildDefaultCriteria, renseignes = ∅ (cas le plus surveillé du chantier)',
    ),
    '',
  ]

  partiels.forEach((profil, i) => {
    const vue = construireVueDecision(node, profil.criteria, profil.renseignes)
    lignes.push(rendreProfilPartielEnClair(i + 1, node, profil.criteria, profil.renseignes, vue, decrireMasque(profil)))
    lignes.push('')
  })

  return `${lignes.join('\n')}\n`
}

describe.each(noeuds.map((node) => [node.id, node] as const))(
  'banc — caractérisation de l’INDÉTERMINATION (R7, D20) · nœud %s',
  (_id, node) => {
    it(
      `${1 + NB_PROFILS_PARTIELS} profils partiellement renseignés (VIERGE compris), snapshot ` +
        `__snapshots__/caracterisation-indetermine.${node.id}.txt (document de relecture clinique)`,
      async () => {
        const contenu = construireContenuCaracterisationIndeterminee(node)
        await expect(contenu).toMatchFileSnapshot(`./__snapshots__/caracterisation-indetermine.${node.id}.txt`)
      },
    )
  },
)
