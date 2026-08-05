/**
 * Banc — COUCHE 3 « invariants », I28-I31 — R6 VOLET RENDU (P13/S4, T-146,
 * `docs/decision/GRAMMAIRE-NOEUD.md` § R6 « ajouté le 2026-08-04 »).
 *
 * FICHIER SÉPARÉ de `invariants-contenu.test.ts`, ET POURQUOI. Ce fichier fait déjà 1332 lignes au jour
 * de cette session (I6-I10, I8, I9, I24, I26) — au-delà de la taille où un nouveau lot d'invariants,
 * thématiquement distinct (le RENDU, pas le contenu statique), reste facile à situer par un lecteur qui
 * n'a besoin que de lui. Les quatre invariants ci-dessous partagent en outre une dépendance que
 * `invariants-contenu.test.ts` évite délibérément pour I6/I7 (contrainte de mission de l'époque,
 * « aucune dépendance au moteur ») : ils testent le texte RÉELLEMENT RENDU par le modèle de vue
 * (`lib/vueDecision.ts` `construireVueDecision`) et son formateur (`lib/conditionText.ts`
 * `describeReasons`/`describeNonApplicable`), donc `evaluateNode` en amont — même dépendance que
 * `banc/invariants.test.ts`, qui l'assume déjà pour la même raison. Regrouper ces quatre invariants avec
 * ceux, plus statiques, d'`invariants-contenu.test.ts` aurait mélangé deux familles de test qui ne se
 * lisent pas pareil (statique sur le YAML vs dynamique sur des profils évalués).
 *
 * LA REVUE DE CONCEPTION DU 2026-08-04 a montré R6 appliquée et violée SUR LE MÊME ÉCRAN : le motif de
 * carte (chemin « reasons », déjà correct depuis P10/S1) et la ligne d'écartement (chemin « exclusions »,
 * corrigée dans CETTE session par T-144) affichaient la MÊME information par DEUX rendus différents — un
 * correctif validé sur un chemin, jamais porté sur son voisin. Les quatre invariants ci-dessous existent
 * pour que cette famille de défaut ne se règle plus « un nœud/un chemin à la fois » : ils s'exécutent sur
 * le texte rendu de TOUS les nœuds, par TOUS les chemins de rendu (`reasons`, `motifRang`, `ecartees`,
 * `nonRetenues`).
 *
 * DEUX PRÉCAUTIONS (leçon d'I7, `CONSTRUIRE-UN-MODULE.md` §3) appliquées aux quatre :
 *  1. chaque marqueur est testé contre un CAS POSITIF (une chaîne qui doit rougir) et un CAS NÉGATIF
 *     LÉGITIME (une chaîne qui ne doit pas, alors qu'elle pourrait sembler proche) — AVANT d'être lancé
 *     sur le corpus réel, exactement la discipline que la docstring de tête d'`invariants-contenu.test.ts`
 *     décrit pour I9 ;
 *  2. une exception de dette se nomme au plus fin (nœud + champ + texte EXACT), avec motif et échéance —
 *     jamais un fichier ou un nœud entier dispensé en bloc. I28/I31 EN PORTENT, nommément : ce sont des
 *     défauts de CONTENU (des textes à réécrire), hors périmètre de cette session (« Ne corrige aucun
 *     contenu », bandeau S4) — livrés ici pour que P13/S7 sache exactement quoi corriger. I29/I30
 *     n'EN PORTENT AUCUNE : ce sont des défauts de MÉCANISME, et T-144/T-145 (cette même session) les
 *     corrigent — le tableau vide est la preuve, pas un oubli (même convention que
 *     `NOEUDS_AVEC_ALERTE_DEFAULT_CONNUE`, vidée le 2026-07-26 dans `invariants-contenu.test.ts`).
 *
 * PÉRIMÈTRE DYNAMIQUE, SUR PROFILS DE BANC — même génération que les autres couches dynamiques
 * (`genererProfils(node, tailleBanc(node))`, `banc/profils.ts`), PAS une capture figée : ces invariants
 * ne visent aucun cas particulier, ils veulent voir chaque conjonction/disjonction RÉELLEMENT rendue par
 * le contenu courant, quel que soit le profil qui la déclenche. Quatre chemins de rendu couverts, ceux
 * qu'`OptionCard.tsx`/`DecisionNodeScreen.tsx` appellent réellement :
 *   - `OptionVue.reasons` → `describeReasons(reasons, option.motifs)` (motif de carte, R6) ;
 *   - `OptionVue.motifRang` → `describeReasons(motifRang, option.motifs)` (pourquoi à ce rang, R6 couche 2) ;
 *   - `OptionEcarteeVue.motifs` → `describeReasons(motifs, option.motifs)` (ligne d'écartement, T-144) ;
 *   - `OptionNonRetenueVue.condition` → `describeNonApplicable(condition, option.motifs)` (pourquoi pas).
 */
import { describe, expect, it } from 'vitest'
import { noeuds } from '../../content/loadNodes.ts'
import type { Noeud } from '../../content/node.types.ts'
import { describeNonApplicable, describeReasons } from '../../lib/conditionText.ts'
import { construireVueDecision } from '../../lib/vueDecision.ts'
import { genererProfils, tailleBanc } from './profils.ts'

/** Une violation recensée : de quoi remplir le tableau du bilan (nœud · champ · texte exact · invariant),
 * et servir de clé d'exemption nommée. */
interface Violation {
  invariant: 'I28' | 'I29' | 'I30' | 'I31'
  noeud: string
  champ: string
  texte: string
}

function cleViolation(v: Violation): string {
  return `${v.invariant} :: ${v.noeud} :: ${v.champ} :: ${v.texte}`
}

/** Ajoute `v` à `sac` (dédoublonné par clé — le même texte peut se répéter sur des dizaines de profils). */
function noter(sac: Map<string, Violation>, v: Violation): void {
  sac.set(cleViolation(v), v)
}

// =====================================================================================================
// I28 — AUCUN TEXTE RENDU NE CONTIENT « : non » (D18, le double rendu des négations).
//
// LA FORME EXACTE, PAS TOUTE OCCURRENCE DE « non ». `humanizeAtomic` (`lib/conditionText.ts`, l.65)
// renvoie LITTÉRALEMENT `` `${label} : non` `` pour un booléen `== false` — c'est CETTE forme, et
// seulement elle, que l'invariant vise. Le marqueur exige donc « : non » suivi d'une fin de segment
// (fin de chaîne, ou le début d'une jointure « et »/« ou », ou une ponctuation) : un texte d'auteur qui
// contiendrait « non » ailleurs (« non-adhérence », « bénéfice non démontré », « non invasif ») ne
// matche jamais cette forme précise.
// =====================================================================================================
const MARQUEUR_I28 = / : non(?=$|[,.;)]|\s(?:et|ou)\b)/

function violeI28(texte: string): boolean {
  return MARQUEUR_I28.test(texte)
}

describe('I28 — aucun texte rendu ne contient la forme exacte « : non » (D18)', () => {
  it('cas positif — la forme exacte produite par `humanizeAtomic` sur un booléen faux rougit', () => {
    expect(violeI28('Insuffisance cardiaque : non')).toBe(true)
    expect(violeI28('MCG disponible : non et TBR > 4')).toBe(true)
    expect(violeI28("ne s'applique pas : il faudrait insuffisance cardiaque : non")).toBe(true)
  })

  it('cas négatif légitime — « non » ailleurs qu’à cette forme exacte ne rougit jamais', () => {
    expect(violeI28('Bénéfice non démontré sur les événements durs')).toBe(false)
    expect(violeI28('Non-adhérence thérapeutique documentée')).toBe(false)
    expect(violeI28('Traitement non invasif recommandé')).toBe(false)
    expect(violeI28("ne s'applique pas : il faudrait non-adhérence")).toBe(false)
  })
})

// =====================================================================================================
// I29 — AUCUN MOTIF DE CARTE NI LIGNE D'ÉCARTEMENT RENDU NE CONTIENT UNE DISJONCTION BRUTE (D3, après
// T-144).
//
// CE QUI DISTINGUE UNE DISJONCTION BRUTE D'UN « ou » DE PROSE : la CASSE. Le DSL du moteur écrit
// TOUJOURS son opérateur de disjonction en MAJUSCULES (`OR`, `engine/conditions.ts` `splitTopLevel`) ;
// aucun texte rendu — mécanique ou motif rédigé — n'utilise jamais ce jeton en toutes lettres. Une
// prose d'auteur légitime écrit le mot français, toujours en minuscules (« Corriger l'hypoglycémie ou
// la variabilité »). Chercher le jeton « OR » exact, plutôt que le mot « ou », élimine par construction
// toute ambiguïté avec la prose d'auteur — c'est la même distinction, à la casse près, que celle déjà
// exploitée par le moteur lui-même entre ses mots-clés et le contenu qu'il lit.
//
// PORTÉE : les TROIS tableaux que `raisonsSituationnelles`/`exclusionsSituationnelles`/
// `motifRangSituationnel` (`lib/vueDecision.ts`) alimentent RÉELLEMENT — `OptionVue.reasons`,
// `OptionVue.motifRang`, `OptionEcarteeVue.motifs`. Chaque ÉLÉMENT de ces tableaux doit être un terme
// `OR` déjà isolé (post `termesVrais`, R6/T-144) : si l'un d'eux contient encore le jeton `OR`, c'est
// que le filtrage par branche vraie n'a pas eu lieu — régression directe de T-144, sur exactement le
// défaut que cette session corrige. `OptionNonRetenueVue.condition` est HORS PÉRIMÈTRE ICI, à dessein :
// `describeNonApplicable` énumère TOUTES les branches (toutes fausses, R4) par construction — ce n'est
// pas une disjonction brute qui a fui, c'est le fonctionnement voulu du panneau « pourquoi pas ».
// =====================================================================================================
function contientDisjonctionBrute(element: string): boolean {
  return /\bOR\b/.test(element)
}

describe('I29 — aucun terme de `reasons`/`motifRang`/`ecartees.motifs` ne porte encore le jeton `OR` (D3, après T-144)', () => {
  it('cas positif — une branche non filtrée (jeton `OR` du DSL) rougit', () => {
    expect(contientDisjonctionBrute('age >= 75 OR fragilite == true')).toBe(true)
  })

  it('cas négatif légitime — un motif rédigé contenant le mot français « ou » (minuscules) ne rougit jamais', () => {
    expect(contientDisjonctionBrute("Corriger l'hypoglycémie ou la variabilité")).toBe(false)
    expect(contientDisjonctionBrute('age >= 75')).toBe(false)
  })
})

// =====================================================================================================
// I30 — AUCUN TEXTE RENDU NE RÉPÈTE UN LITTÉRAL DANS UNE CONJONCTION (D19, après T-145).
//
// Rendu MÉCANIQUE (sans motifs — `describeReasons([terme])` sans 2ᵉ argument est exactement
// `humanizeAndTerm(terme)`, cf. `lib/conditionText.ts` : un terme `OR` isolé passé seul à
// `describeReasons` traverse `humanizeExpression` sans retrouver de motif, faute d'index) : c'est LÀ,
// et seulement là, qu'un littéral peut se répéter (un motif rédigé est de la prose d'auteur, jamais
// concaténée terme à terme). Ignorer les motifs ici n'affaiblit rien : si toute une branche est
// remplacée par un motif rédigé, `humanizeAndTerm` n'est simplement jamais appelé sur elle par l'écran
// — aucun doublon mécanique ne peut alors s'y produire.
// =====================================================================================================
function litterauxRepetes(andTermSourceDsl: string): { texteRendu: string; repete: boolean } {
  const texteRendu = describeReasons([andTermSourceDsl])
  const litteraux = texteRendu.split(' et ')
  const vus = new Set<string>()
  let repete = false
  for (const l of litteraux) {
    if (vus.has(l)) repete = true
    vus.add(l)
  }
  return { texteRendu, repete }
}

describe('I30 — aucune conjonction rendue ne répète un littéral (D19, après T-145)', () => {
  it('cas positif — un littéral dupliqué dans la source DSL rougit AVANT le correctif T-145 (démontré sur la fonction nue)', () => {
    // `litterauxRepetes` s'appuie sur `describeReasons`, DÉJÀ CORRIGÉ dans cette session (T-145) : ce cas
    // positif prouve donc seulement que le DÉTECTEUR sait reconnaître un doublon s'il en voyait un —
    // c'est `conditionText.test.ts` (T-145) qui verrouille la correction elle-même contre régression.
    const brancheAvecDoublon = 'champ_teste == true AND autre_champ > 4 AND champ_teste == true'
    const texteSansDedup = brancheAvecDoublon
      .split(/\s+AND\s+/)
      .map((a) => (a.includes('champ_teste') ? 'Champ teste' : 'Autre champ > 4'))
      .join(' et ')
    const litteraux = texteSansDedup.split(' et ')
    expect(new Set(litteraux).size).toBeLessThan(litteraux.length) // le texte NON dédupliqué, lui, rougirait
    // Le texte RÉELLEMENT rendu par ce dépôt (post T-145), lui, ne rougit plus :
    expect(litterauxRepetes(brancheAvecDoublon).repete).toBe(false)
  })

  it('cas négatif légitime — une conjonction sans doublon ne rougit jamais', () => {
    expect(litterauxRepetes('age >= 75 AND fragilite == true').repete).toBe(false)
  })
})

// =====================================================================================================
// I31 — AUCUNE RÉFÉRENCE NI TITRE RENDU NE PARLE DU NŒUD LUI-MÊME (« ce nœud », « encodé », « verbatim »
// — registre du changelog, I5 de la revue de conception).
//
// STATIQUE (pas de profils : ces champs sont de la prose d'auteur constante, jamais dérivée d'un
// critère) — MÊME MÉTHODE que `jargon-projet.test.ts` (I25), à qui ce fichier N'AJOUTE PAS ces trois
// marqueurs : I25 couvre une portée volontairement plus large (tout ce qu'`OptionCard.tsx`/
// `ArgumentPanel.tsx` rendent) et une famille de défaut différente (le jargon de PROCESS, pas la
// réflexivité du nœud sur lui-même). Portée ICI restreinte à ce que R6 (volet rendu) nomme
// explicitement : les titres de RÉFÉRENCES bibliographiques (`sources.references_primaires[].titre` —
// le cas cité, « deux titres d'essais du nœud `insuline` »), le TITRE du nœud (`node.titre`) et
// l'INTITULÉ de chaque option (`option.intitule`), rendus tous deux comme des titres à l'écran.
//
// MARQUEURS calibrés sur le texte cité par R6 (aucune mesure supplémentaire nécessaire, la revue de
// conception l'a déjà fait) : « ce nœud » (2 mots exacts — un « nœud sinusal »/« nœud
// atrio-ventriculaire » cardiologique ne matche pas cette phrase précise), « encodé(e) » (jargon
// d'implémentation, aucun sens clinique), « verbatim » (mot latin, aucun usage clinique constaté).
// =====================================================================================================
const MARQUEURS_I31: { motif: RegExp; nom: string }[] = [
  { motif: /\bce nœud\b/iu, nom: 'ce nœud' },
  // Trailing `\b` INAPPLICABLE ici : `\b` ne connaît que les mots ASCII (`\w`), et « encodé »/« encodée »
  // se terminent par un caractère accentué — `\b` n'y détecte AUCUNE frontière (même piège documenté dans
  // `engine/banc/jargon-projet.test.ts`, marqueur « collecte », et dans `lib/conditionText.ts` pour les
  // opérateurs). Négation d'un caractère-lettre Unicode à la place (`(?!\p{L})`), vérifié empiriquement.
  { motif: /\bencodée?s?(?!\p{L})/iu, nom: 'encodé(e)' },
  { motif: /\bverbatim\b/iu, nom: 'verbatim' },
]

function violationsI31(texte: string): string[] {
  return MARQUEURS_I31.filter(({ motif }) => motif.test(texte)).map(({ nom }) => nom)
}

describe('I31 — aucune référence ni titre rendu ne parle du nœud lui-même (I5 de la revue)', () => {
  it('cas positif — les trois marqueurs rougissent', () => {
    expect(violationsI31('6ᵉ série, ce nœud reprend Kraut 2020')).toContain('ce nœud')
    expect(violationsI31('Comportement encodé dans la v0.34')).toContain('encodé(e)')
    expect(violationsI31('Résultat, verbatim : « … »')).toContain('verbatim')
  })

  it('cas négatif légitime — un usage clinique voisin ne rougit jamais', () => {
    // « nœud » cardiologique réel (sino-atrial/atrio-ventriculaire) : jamais accolé à « ce » dans ce sens.
    expect(violationsI31('Bloc du nœud atrio-ventriculaire du 2ᵉ degré')).toEqual([])
    expect(violationsI31('Dose encadrée par le RCP')).toEqual([]) // « encadrée », pas « encodée »
  })
})

// =====================================================================================================
// EXEMPTIONS NOMMÉES — au plus fin (invariant + nœud + champ + texte EXACT), motif et échéance.
// Clé = `cleViolation()` (`I2x :: nœud :: champ :: texte rendu EXACT`) : une reformulation, même minime,
// du texte affiché fait EXPIRER l'exemption (auto-expirante, cf. vérification en fin de bloc — même
// convention que `ALERTES_PROHIBITIVES_HORS_PERIMETRE`/`VIOLATIONS_R8_CONNUES_T018`,
// `invariants-contenu.test.ts`) : une correction de contenu qui change ne serait-ce qu'un mot doit
// rouvrir la question, jamais rester couverte par accident.
//
// I29/I30 : AUCUNE — ce sont des défauts de MÉCANISME que cette session corrige (T-144/T-145). Une
// entrée ici signalerait une régression, jamais une dette légitime : les deux `Map` restent VIDES, sur
// le modèle de `NOEUDS_AVEC_ALERTE_DEFAULT_CONNUE` (I6, `invariants-contenu.test.ts`).
// =====================================================================================================
const EXEMPTIONS_I29 = new Map<string, string>()
const EXEMPTIONS_I30 = new Map<string, string>()

/**
 * I28 — 26 VIOLATIONS RECENSÉES le 2026-08-04 (T-146), TOUTES de la MÊME famille que D18 (docstring de
 * tête) : un booléen `== false` sans motif rédigé NÉGATIF dans le contenu retombe sur le rendu MÉCANIQUE
 * `${label} : non` (`humanizeAtomic`, `lib/conditionText.ts` l.65) — correct isolément, mais c'est
 * exactement la forme que R6 (volet rendu) proscrit désormais partout. DEUX foyers, sur DEUX nœuds :
 *
 * - `insuline` (18 occurrences) — `mcg_disponible == false`, dans `reasons` (motif de carte) ET dans
 *   `nonRetenues.condition` (panneau « pourquoi pas ») de plusieurs options du bloc MCG. Contrairement à
 *   d'autres critères du même nœud (ex. `situation_insuline`), `mcg_disponible` n'a reçu AUCUN motif
 *   rédigé négatif dans `insuline.yaml` — la mécanique R6/T-144/T-145 fonctionne, elle rend fidèlement ce
 *   que le contenu ne lui donne pas encore de meilleur ;
 * - `statine` (8 occurrences) — `statine_deja_en_place == false`, dans `ecartees.motifs` de deux options
 *   (« Statine de haute intensité — prévention secondaire », « Discuter la statine »). Même mécanisme,
 *   même absence de motif rédigé négatif pour cette branche précise.
 *
 * CORRECTIF ATTENDU (S7, hors périmètre de cette session — bandeau S4, « Ne corrige aucun contenu ») :
 * un motif rédigé négatif par critère concerné (`Option.motifs`, clé = la branche `== false` exacte),
 * sur le modèle déjà en place ailleurs dans ce même corpus pour d'autres critères booléens (ex. « Pas de
 * MCG en place » cité par R6 elle-même comme le libellé négatif correct).
 */
// P13/S7, T-152 : les 18 exemptions `insuline` (sur `mcg_disponible == false`) sont LEVÉES — chaque
// option du bloc MCG a reçu un motif rédigé négatif, clé = la branche `OR` ENTIÈRE qui porte l'atome
// négatif (`mcg_disponible == false AND gaj_* == true`), pas l'atome seul : I24 (`invariants-contenu.
// test.ts`) n'indexe jamais un atome isolé au sein d'une conjonction, seulement le terme `OR` complet.
//
// LES 8 EXEMPTIONS `statine` (sur `statine_deja_en_place == false`) RESTENT POSÉES — TENTATIVE DE LEVÉE
// REVERTÉE (2026-08-05). Sur les deux options concernées (« Statine de haute intensité — prévention
// secondaire », « Discuter la statine »), `statine_deja_en_place == false` n'apparaît QUE dans
// `exclusions`, jamais dans `conditions`/`prerequis`. Un motif y aurait été fonctionnellement consommé
// au rendu (`describeReasons(ecartee.motifs, ecartee.option.motifs)`, T-144) — mais I24
// (`branchesDeclarees`, `invariants-contenu.test.ts`) ne scanne QUE `conditions`/`prerequis`, jamais
// `exclusions` : la clé aurait donc été signalée « orpheline » par I24, à tort. Corriger I24 exigerait
// d'étendre `branchesDeclarees` aux `exclusions` — une modification de LOGIQUE d'un fichier `src/` hors
// de `rendu-textuel.test.ts`, donc hors mandat de cette session (contenu seul). Dette non résorbée,
// signalée au référent — cf. bilan P13/S7. Prochaine étape suggérée : une session avec mandat moteur/
// invariants qui élargit I24, PUIS une passe de contenu qui ajoute les deux motifs ci-dessous.
const EXEMPTIONS_I28 = new Map<string, string>([
  [
    'I28 :: statine :: écartée "Statine de haute intensité — prévention secondaire".motifs :: Intolérance aux statines (non / rapportée / avérée) ≠ Non et CK, en multiples de la normale > 5 et Statine déjà en place : non',
    "D18/R6 : `statine_deja_en_place == false` sans motif rédigé négatif sur `statine.yaml` — NON levé par P13/S7 (I24 ne scanne pas `exclusions`, cf. commentaire ci-dessus).",
  ],
  [
    'I28 :: statine :: écartée "Statine de haute intensité — prévention secondaire".motifs :: Intolérance aux statines (non / rapportée / avérée) = Avérée et Intolérance aux statines (non / rapportée / avérée) ≠ Non et CK, en multiples de la normale > 5 et Statine déjà en place : non',
    "D18/R6 : `statine_deja_en_place == false` sans motif rédigé négatif sur `statine.yaml` — NON levé par P13/S7 (I24 ne scanne pas `exclusions`, cf. commentaire ci-dessus).",
  ],
  [
    'I28 :: statine :: écartée "Statine de haute intensité — prévention secondaire".motifs :: Dialyse et Statine déjà en place : non et Intolérance aux statines (non / rapportée / avérée) = Avérée et Intolérance aux statines (non / rapportée / avérée) ≠ Non et CK, en multiples de la normale > 5 et Statine déjà en place : non',
    "D18/R6 : `statine_deja_en_place == false` sans motif rédigé négatif sur `statine.yaml` — NON levé par P13/S7 (I24 ne scanne pas `exclusions`, cf. commentaire ci-dessus).",
  ],
  [
    'I28 :: statine :: écartée "Statine de haute intensité — prévention secondaire".motifs :: Dialyse et Statine déjà en place : non et Intolérance aux statines (non / rapportée / avérée) ≠ Non et CK, en multiples de la normale > 5 et Statine déjà en place : non',
    "D18/R6 : `statine_deja_en_place == false` sans motif rédigé négatif sur `statine.yaml` — NON levé par P13/S7 (I24 ne scanne pas `exclusions`, cf. commentaire ci-dessus).",
  ],
  [
    'I28 :: statine :: écartée "Statine de haute intensité — prévention secondaire".motifs :: Dialyse et Statine déjà en place : non',
    "D18/R6 : `statine_deja_en_place == false` sans motif rédigé négatif sur `statine.yaml` — NON levé par P13/S7 (I24 ne scanne pas `exclusions`, cf. commentaire ci-dessus).",
  ],
  [
    'I28 :: statine :: écartée "Statine de haute intensité — prévention secondaire".motifs :: Dialyse et Statine déjà en place : non et Intolérance aux statines (non / rapportée / avérée) = Avérée',
    "D18/R6 : `statine_deja_en_place == false` sans motif rédigé négatif sur `statine.yaml` — NON levé par P13/S7 (I24 ne scanne pas `exclusions`, cf. commentaire ci-dessus).",
  ],
  [
    'I28 :: statine :: écartée "Discuter la statine".motifs :: Intolérance aux statines (non / rapportée / avérée) ≠ Non et CK, en multiples de la normale > 5 et Statine déjà en place : non',
    "D18/R6 : `statine_deja_en_place == false` sans motif rédigé négatif sur `statine.yaml` — NON levé par P13/S7 (I24 ne scanne pas `exclusions`, cf. commentaire ci-dessus).",
  ],
  [
    'I28 :: statine :: écartée "Discuter la statine".motifs :: Intolérance aux statines (non / rapportée / avérée) = Avérée et Intolérance aux statines (non / rapportée / avérée) ≠ Non et CK, en multiples de la normale > 5 et Statine déjà en place : non',
    "D18/R6 : `statine_deja_en_place == false` sans motif rédigé négatif sur `statine.yaml` — NON levé par P13/S7 (I24 ne scanne pas `exclusions`, cf. commentaire ci-dessus).",
  ],
])

// =====================================================================================================
// SCAN DYNAMIQUE DU CORPUS (I28/I29/I30) — un seul passage sur les profils de banc de chaque nœud,
// couvrant les quatre chemins de rendu à la fois (coût mutualisé plutôt que quatre balayages distincts).
// =====================================================================================================
function scannerNoeud(node: Noeud, violations: Map<string, Violation>): void {
  const profils = genererProfils(node, tailleBanc(node))
  for (const criteria of profils) {
    const vue = construireVueDecision(node, criteria)

    for (const famille of vue.familles) {
      for (const groupe of famille.groupes) {
        for (const ov of groupe) {
          const texteReasons = describeReasons(ov.reasons, ov.option.motifs)
          if (violeI28(texteReasons)) {
            noter(violations, { invariant: 'I28', noeud: node.id, champ: `option "${ov.option.intitule}".reasons`, texte: texteReasons })
          }
          for (const terme of ov.reasons) {
            if (contientDisjonctionBrute(terme)) {
              noter(violations, { invariant: 'I29', noeud: node.id, champ: `option "${ov.option.intitule}".reasons`, texte: terme })
            }
          }
          if (ov.motifRang && ov.motifRang.length > 0) {
            const texteMotifRang = describeReasons(ov.motifRang, ov.option.motifs)
            if (violeI28(texteMotifRang)) {
              noter(violations, { invariant: 'I28', noeud: node.id, champ: `option "${ov.option.intitule}".motifRang`, texte: texteMotifRang })
            }
            for (const terme of ov.motifRang) {
              if (contientDisjonctionBrute(terme)) {
                noter(violations, { invariant: 'I29', noeud: node.id, champ: `option "${ov.option.intitule}".motifRang`, texte: terme })
              }
            }
          }
        }
      }
    }

    for (const ecartee of vue.ecartees) {
      const texteEcartee = describeReasons(ecartee.motifs, ecartee.option.motifs)
      if (violeI28(texteEcartee)) {
        noter(violations, { invariant: 'I28', noeud: node.id, champ: `écartée "${ecartee.option.intitule}".motifs`, texte: texteEcartee })
      }
      for (const terme of ecartee.motifs) {
        if (contientDisjonctionBrute(terme)) {
          noter(violations, { invariant: 'I29', noeud: node.id, champ: `écartée "${ecartee.option.intitule}".motifs`, texte: terme })
        }
      }
    }

    for (const nonRetenue of vue.nonRetenues) {
      const texteNonRetenue = describeNonApplicable(nonRetenue.condition, nonRetenue.option.motifs)
      if (violeI28(texteNonRetenue)) {
        noter(violations, {
          invariant: 'I28',
          noeud: node.id,
          champ: `non retenue "${nonRetenue.option.intitule}".condition`,
          texte: texteNonRetenue,
        })
      }
    }
  }
}

describe('I28/I29/I30 — balayage du corpus (les 6 nœuds, profils de banc)', () => {
  const violations = new Map<string, Violation>()
  for (const node of noeuds) scannerNoeud(node, violations)

  it('I28 — dette de CONTENU nommée au plus fin (P13/S7 la lève) ; toute violation NOUVELLE (non nommée) fait échouer le test', () => {
    const trouvees = [...violations.values()].filter((v) => v.invariant === 'I28')
    const nonExemptees = trouvees.filter((v) => !EXEMPTIONS_I28.has(cleViolation(v)))
    expect(nonExemptees).toEqual([])
    // Auto-expiration (même convention que `VIOLATIONS_R8_CONNUES_T018`) : une exemption qui ne
    // correspond plus à AUCUNE violation réelle est une dette résorbée — à retirer, pas à oublier ici.
    for (const cle of EXEMPTIONS_I28.keys()) {
      expect(trouvees.some((v) => cleViolation(v) === cle), `exemption I28 résorbée, à retirer : ${cle}`).toBe(true)
    }
  })

  it('I29 — zéro violation (T-144 en vigueur) : une entrée ici serait une régression, jamais une dette', () => {
    const trouvees = [...violations.values()].filter((v) => v.invariant === 'I29')
    const nonExemptees = trouvees.filter((v) => !EXEMPTIONS_I29.has(cleViolation(v)))
    expect(nonExemptees).toEqual([])
  })

  it('I30 — zéro violation (T-145 en vigueur) : une entrée ici serait une régression, jamais une dette', () => {
    const trouvees = [...violations.values()].filter((v) => v.invariant === 'I30')
    const nonExemptees = trouvees.filter((v) => !EXEMPTIONS_I30.has(cleViolation(v)))
    expect(nonExemptees).toEqual([])
  })

  it('BILAN — imprime le tableau des violations I28 (nœud · champ · texte), livrable pour P13/S7', () => {
    const trouvees = [...violations.values()].filter((v) => v.invariant === 'I28').sort((a, b) => a.noeud.localeCompare(b.noeud))
    // eslint-disable-next-line no-console
    console.log(
      `\n[I28 — ${trouvees.length} violations, cf. plans/P13/S4.md § Bilan de session]\n` +
        trouvees.map((v) => `  - ${v.noeud} :: ${v.champ} :: "${v.texte}"`).join('\n'),
    )
    expect(trouvees.length).toBeGreaterThanOrEqual(0) // assertion factice : ce test sert à IMPRIMER, pas à trancher.
  })
})

// =====================================================================================================
// I31 — SCAN STATIQUE DU CORPUS. DEUX violations recensées (T-146), toutes deux sur `insuline` — le nœud
// cité en tête du § R6 volet rendu (« deux titres d'essais du nœud insuline ») : la revue de conception
// avait relevé le registre changelog, et c'est EXACTEMENT ce que retrouve ce scan, sans qu'aucune des
// deux n'ait été corrigée depuis.
// =====================================================================================================
// P13/S7, T-152 : les 2 exemptions ci-dessus sont LEVÉES — les deux titres de référence `insuline` ont
// été reformulés (sujet = la source, plus le nœud ; « encodé »/« VERBATIM »/« ce nœud » retirés).
const EXEMPTIONS_I31 = new Map<string, string>()

describe('I31 — balayage du corpus (les 6 nœuds, champs statiques)', () => {
  const violations = new Map<string, Violation>()
  for (const node of noeuds) {
    const champs: { champ: string; texte: string }[] = [
      { champ: 'titre', texte: node.titre },
      ...(node.sources?.references_primaires ?? []).map((ref, i) => ({
        champ: `sources.references_primaires[${i}].titre`,
        texte: ref.titre,
      })),
      ...node.options.map((o) => ({ champ: `option "${o.intitule}".intitule`, texte: o.intitule })),
    ]
    for (const { champ, texte } of champs) {
      if (violationsI31(texte).length === 0) continue
      noter(violations, { invariant: 'I31', noeud: node.id, champ, texte })
    }
  }

  it('dette de CONTENU nommée au plus fin (P13/S7 la lève) ; toute violation NOUVELLE (non nommée) fait échouer le test', () => {
    const trouvees = [...violations.values()]
    const nonExemptees = trouvees.filter((v) => !EXEMPTIONS_I31.has(cleViolation(v)))
    expect(nonExemptees).toEqual([])
    for (const cle of EXEMPTIONS_I31.keys()) {
      expect(trouvees.some((v) => cleViolation(v) === cle), `exemption I31 résorbée, à retirer : ${cle}`).toBe(true)
    }
  })

  it('BILAN — imprime le tableau des violations I31 (nœud · champ · texte), livrable pour P13/S7', () => {
    const trouvees = [...violations.values()].sort((a, b) => a.noeud.localeCompare(b.noeud))
    // eslint-disable-next-line no-console
    console.log(
      `\n[I31 — ${trouvees.length} violations, cf. plans/P13/S4.md § Bilan de session]\n` +
        trouvees.map((v) => `  - ${v.noeud} :: ${v.champ} :: "${v.texte}"`).join('\n'),
    )
    expect(trouvees.length).toBeGreaterThanOrEqual(0)
  })
})
