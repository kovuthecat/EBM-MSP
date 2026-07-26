/**
 * JEU DE PROFILS FIGÉ pour `banc/caracterisation.test.ts` (golden master de couche 1) — chargement,
 * persistance, et justification de conception. `banc/profils.ts` reste le seul GÉNÉRATEUR (dynamique, à
 * graine fixe mais recalculé à chaque exécution depuis le contenu) ; ce module lit/écrit sa CAPTURE
 * FIGÉE, un fichier JSON versionné par nœud (`fixtures/profils.<id>.json`), jamais recalculée au fil
 * d'une exécution de test normale.
 *
 * ---------------------------------------------------------------------------------------------------
 * LE PROBLÈME (constaté en recette, cf. la tâche qui a introduit ce fichier). `genererProfils`
 * (`profils.ts`) tire ses valeurs candidates DEPUIS LE CONTENU — notamment les seuils numériques présents
 * dans les règles du nœud (`seuilsNumeriques`). Ajouter un critère, une alerte, ou modifier UN SEUL seuil
 * change cet ensemble de candidats, donc les séquences stratifiées/le produit cartésien qui en découlent,
 * donc **quel patient tombe à quel index** — alors même que `NB_PROFILS_CARACTERISATION` et la graine
 * n'ont pas bougé. Un golden master relu INDEX PAR INDEX (`__snapshots__/caracterisation.<id>.txt`) perd
 * alors toute lisibilité : le profil #1 d'avant et le profil #2 d'après peuvent être le MÊME patient
 * (permutation), ou deux patients totalement différents partageant accidentellement le même index — dans
 * les deux cas, le diff textuel ne dit plus rien d'interprétable sur un changement de COMPORTEMENT.
 *
 * ---------------------------------------------------------------------------------------------------
 * LE CHOIX DE CONCEPTION : un jeu de profils VERSIONNÉ, pas régénéré. `banc/fixtures/profils.<id>.json`
 * est une CAPTURE ponctuelle de `genererProfilsBruts` (critères SAISISSABLES uniquement, PAS encore
 * dérivés), écrite une fois par la procédure de maintenance (`geler-profils.maintenance.test.ts`) puis
 * commitée comme n'importe quel autre golden master. `caracterisation.test.ts` ne appelle plus JAMAIS le
 * générateur : il LIT cette fixture (`profilsFigesPourNoeud` ci-dessous), point final. Un patient à
 * l'index 7 aujourd'hui est le MÊME patient à l'index 7 dans six mois, quoi que le contenu ait changé
 * entre-temps — la propriété qui manquait.
 *
 * Alternative écartée : sérialiser les profils DÉJÀ dérivés (post-`calculerCriteresDerives`). Rejetée
 * parce qu'un critère dérivé est un CALCUL, pas une donnée du patient (cf. `deriveCritere.ts`) — le figer
 * aurait aussi figé la LOGIQUE de dérivation au moment de la capture. Si un `derive` change (ex. le seuil
 * d'`over_basalisation` passe de 0,5 à 0,6), ce module doit continuer de recalculer la valeur dérivée
 * FRAÎCHE à chaque lecture (`calculerCriteresDerives`, appelé ici, jamais dans la fixture) : c'est un
 * changement de COMPORTEMENT réel, il DOIT apparaître dans le diff de sortie. Seules les valeurs
 * SAISIES (celles qu'un praticien aurait tapées) sont donc figées ; tout ce qui est calculé depuis elles
 * reste vivant.
 *
 * ---------------------------------------------------------------------------------------------------
 * LE POINT DÉCISIF : QUE SE PASSE-T-IL QUAND UN CRITÈRE EST AJOUTÉ AU CONTENU ?
 *
 * Un dispositif qui exigerait de tout régénérer dès qu'un critère apparaît reproduirait le problème sous
 * une autre forme (retour à la case départ : nouveau tirage, donc nouvelle permutation). Le choix retenu
 * distingue deux moments, VOLONTAIREMENT différents :
 *
 * 1. IMMÉDIATEMENT, SANS AUCUNE ACTION (ce que fait `profilsFigesPourNoeud` ci-dessous À CHAQUE LECTURE) :
 *    le critère absent de `fixture.criteresColonnes` est purement et simplement ABSENT du profil figé —
 *    `profilsFigesPourNoeud` le comble avec sa valeur par défaut générique (`buildDefaultCriteria`,
 *    `formLayout.ts` : 0 / false / première valeur d'énum / tableau vide), FUSIONNÉE par-dessus les
 *    critères réellement figés (qui, eux, l'emportent partout où ils existent). Rien ne casse, rien ne
 *    permute : tous les profils déjà figés gardent EXACTEMENT leurs valeurs déjà figées, à l'index où ils
 *    étaient. Le diff de sortie qui en résulte est aussi étroit que possible — une ligne "+ critère =
 *    valeur par défaut" par profil dans la section « en clair », plus tout changement de comportement que
 *    ce nouveau critère déclenche RÉELLEMENT à sa valeur par défaut (signal réel, pas un artefact).
 *
 * 2. PLUS TARD, DÉLIBÉRÉMENT (procédure de mise à jour, `geler-profils.maintenance.test.ts`, DÉSACTIVÉE
 *    par défaut) : quand on veut que ce nouveau critère soit RÉELLEMENT exploré (pas juste laissé à sa
 *    valeur neutre sur 179 profils), `completerFixtureProfils` (`profils.ts`) lui tire UNE colonne de
 *    valeurs, tirée INDÉPENDAMMENT de toutes les autres colonnes (même mécanique que la stratégie 2 —
 *    échantillonnage stratifié par critère — de `construireSequences`, JAMAIS la stratégie 1 — produit
 *    cartésien couplé — qui mélangerait la nouvelle dimension avec toutes les existantes). Les colonnes
 *    déjà figées ne sont RELUES NULLE PART par cette étape : `completerFixtureProfils` les recopie telles
 *    quelles, n'ajoute que la ou les colonnes manquantes, et rien de plus. Le patient à l'index 7 garde
 *    donc sa valeur d'`age`, de `DFG`, etc. — seul le nouveau critère change, POUR TOUT LE MONDE, ce qui
 *    reste un diff interprétable ("le patient #7 a maintenant une valeur réelle pour ce critère, voici ce
 *    que ça change") et non un brassage.
 *
 * Un critère RETIRÉ du contenu suit le chemin inverse sans code dédié : `profilsFigesPourNoeud` ignore
 * silencieusement toute colonne de la fixture absente de `Noeud.criteres_entree` courant (elle ne peut
 * plus influencer aucune règle) — la fixture n'a pas besoin d'être « nettoyée » pour rester utilisable,
 * seulement recomplétée un jour si on veut purger le JSON de colonnes mortes (confort, jamais un
 * correctif obligatoire).
 *
 * ---------------------------------------------------------------------------------------------------
 * NŒUD SANS AUCUNE FIXTURE (nœud NOUVEAU — cas des deux nœuds RHD en cours d'encodage au moment d'écrire
 * ce module) : PAS de bootstrap silencieux. `lireFixtureProfils` (ci-dessous) LÈVE une erreur explicite,
 * qui nomme la procédure de maintenance à lancer. Créer une toute première ligne de base est un acte tout
 * aussi délibéré qu'en compléter une existante (même esprit que DECISIONS.md D4/D5 : jamais de mise à
 * jour — ni de création — automatique et silencieuse d'un golden master) ; la première fixture d'un nœud
 * EST son golden master initial, et mérite d'être relue comme tel au moment de son commit.
 *
 * ---------------------------------------------------------------------------------------------------
 * CE QUE CE MODULE NE TOUCHE PAS. Les couches 2 (couverture) et 3 (invariants) du banc continuent
 * d'appeler `genererProfils`/`genererPairesBooleennes` (`profils.ts`) DIRECTEMENT, dynamiquement, à
 * chaque exécution — ce module n'est importé NULLE PART par `couverture.test.ts` / `invariants.test.ts` /
 * `invariants-contenu.test.ts`. Ces couches ont besoin d'explorer largement un espace qui bouge avec le
 * contenu (c'est même leur raison d'être : détecter une règle morte, un critère jamais décisif) ; figer
 * leur échantillon les rendrait aveugles à tout contenu nouveau. Seule la couche 1 (caractérisation,
 * golden master textuel comparé À LUI-MÊME) a besoin d'un patient STABLE — c'est elle, et uniquement
 * elle, que ce module sert.
 *
 * ---------------------------------------------------------------------------------------------------
 * DÉTERMINISME : aucune horloge, aucun `Math.random`, ici comme dans `profils.ts`. La fixture elle-même
 * est un fichier statique versionné (git) : sa lecture n'introduit par construction aucun aléa — le seul
 * moment où le PRNG à graine fixe de `profils.ts` intervient est la capture/complétion, un acte de
 * maintenance explicite, jamais une lecture de test.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import type { Noeud } from '../../content/node.types.ts'
import type { Criteria } from '../conditions.ts'
import { calculerCriteresDerives } from '../deriveCritere.ts'
import { buildDefaultCriteria } from '../../lib/formLayout.ts'
import type { FixtureProfils } from './profils.ts'

/**
 * Nombre TOTAL de profils du golden master de caractérisation, profil #0 VIERGE compris (donc
 * `NB_PROFILS_FIGES - 1` profils bruts attendus dans chaque fixture, cf. `profilsFigesPourNoeud`).
 * SEULE source de vérité pour ce nombre : importée à la fois par `caracterisation.test.ts`
 * (consommation) et `geler-profils.maintenance.test.ts` (capture/complétion), pour qu'ils ne puissent
 * jamais diverger silencieusement — un changement de valeur ici enclenche mécaniquement, à la prochaine
 * exécution de la procédure de maintenance, la capture des profils supplémentaires nécessaires (jamais
 * une régénération des profils déjà figés, cf. tête de fichier).
 */
export const NB_PROFILS_FIGES = 180

const DOSSIER_FIXTURES = join(dirname(fileURLToPath(import.meta.url)), 'fixtures')

/** Chemin du fichier de fixture d'un nœud (existe ou non — cf. `lireFixtureProfilsSiPresent`). */
export function cheminFixture(nodeId: string): string {
  return join(DOSSIER_FIXTURES, `profils.${nodeId}.json`)
}

/** Lit la fixture d'un nœud si elle existe, sinon `undefined` (pas d'exception — réservé au chemin de
 * maintenance, `geler-profils.maintenance.test.ts`, qui doit pouvoir distinguer "à créer" de "à
 * compléter" sans lever). `caracterisation.test.ts` utilise `lireFixtureProfils` ci-dessous, qui lève. */
export function lireFixtureProfilsSiPresent(nodeId: string): FixtureProfils | undefined {
  const chemin = cheminFixture(nodeId)
  if (!existsSync(chemin)) return undefined
  const fixture = JSON.parse(readFileSync(chemin, 'utf8')) as FixtureProfils
  if (fixture.noeudId !== nodeId) {
    throw new Error(
      `Fixture "${chemin}" porte noeudId="${fixture.noeudId}", attendu "${nodeId}" ` +
        '(fichier renommé/copié depuis un autre nœud ?).',
    )
  }
  return fixture
}

/**
 * Lit la fixture d'un nœud — LÈVE une erreur explicite et actionnable si elle est absente (cf. tête de
 * fichier : « nœud sans aucune fixture », jamais de bootstrap silencieux). C'est cette erreur, et
 * uniquement elle, que `caracterisation.test.ts` doit voir apparaître le jour où les nœuds RHD (ou tout
 * autre nœud futur) atteignent `content/` sans être passés par la procédure de maintenance.
 */
export function lireFixtureProfils(nodeId: string): FixtureProfils {
  const fixture = lireFixtureProfilsSiPresent(nodeId)
  if (fixture !== undefined) return fixture
  throw new Error(
    [
      `Aucune fixture figée pour le nœud "${nodeId}" (${cheminFixture(nodeId)} absent).`,
      "Attendu pour un nœud NOUVEAU (ex. un domaine qui vient d'apparaître dans /content) : la procédure",
      'de mise à jour crée sa ligne de base — lance :',
      '  EBM_FIGER_PROFILS=1 npx vitest run src/features/decision/engine/banc/geler-profils.maintenance.test.ts',
      'puis relis et commite la fixture créée comme un golden master à part entière (une création',
      "n'a rien à comparer, contrairement à une mise à jour de fixture existante).",
    ].join('\n'),
  )
}

/**
 * Sérialisation JSON valide, mais mise en page À LA MAIN (un profil par ligne, pas une clé par ligne) :
 * `JSON.stringify(fixture, null, 2)` répandrait chaque critère de chaque profil sur sa propre ligne (des
 * milliers de lignes sur `prescription`/`insuline`, ~25 critères × 179 profils) sans rien gagner en
 * lisibilité ni en facilité de diff par rapport à une ligne par profil — pour un coût en octets bien plus
 * élevé. Ordre des clés PRÉSERVÉ (`JSON.stringify` respecte l'ordre d'insertion des propriétés) :
 * `completerFixtureProfils` (`profils.ts`) AJOUTE toujours ses nouvelles colonnes en fin d'objet, jamais
 * en réordonnant — un `git diff` sur une complétion ne montre donc que les clés ajoutées, jamais un bruit
 * de réordonnancement des clés déjà là.
 */
function serialiserFixture(fixture: FixtureProfils): string {
  const lignes = fixture.profils.map((profil) => `    ${JSON.stringify(profil)}`)
  return (
    [
      '{',
      `  "noeudId": ${JSON.stringify(fixture.noeudId)},`,
      `  "graine": ${fixture.graine},`,
      `  "criteresColonnes": ${JSON.stringify(fixture.criteresColonnes)},`,
      '  "profils": [',
      lignes.join(',\n'),
      '  ]',
      '}',
    ].join('\n') + '\n'
  )
}

/** Écrit une fixture sur disque (crée `fixtures/` au besoin) — SEUL point d'écriture de ce module,
 * appelé UNIQUEMENT par `geler-profils.maintenance.test.ts` (désactivé par défaut). */
export function ecrireFixtureProfils(fixture: FixtureProfils): void {
  mkdirSync(DOSSIER_FIXTURES, { recursive: true })
  writeFileSync(cheminFixture(fixture.noeudId), serialiserFixture(fixture), 'utf8')
}

/**
 * Les `count` premiers profils, PRÊTS pour `evaluateNode`/`construireVueDecision` (dérivés calculés),
 * consommés par `caracterisation.test.ts` — remplace l'ancien appel direct à `genererProfils` (la source
 * de l'instabilité en index, cf. tête de fichier). Chaque profil brut de la fixture (critères SAISISSABLES
 * uniquement) est fusionné PAR-DESSUS `buildDefaultCriteria(node.criteres_entree)` (le critère figé
 * l'emporte partout où il existe ; un critère absent de la fixture — nouveau dans le contenu depuis la
 * capture — retombe sur sa valeur par défaut générique, cf. tête de fichier point 1), puis les critères
 * DÉRIVÉS sont recalculés depuis le contenu COURANT (`calculerCriteresDerives`, jamais lu depuis la
 * fixture — cf. tête de fichier, alternative écartée).
 */
export function profilsFigesPourNoeud(node: Noeud, count: number): Criteria[] {
  const fixture = lireFixtureProfils(node.id)
  if (fixture.profils.length < count) {
    throw new Error(
      `Fixture figée du nœud "${node.id}" ne contient que ${fixture.profils.length} profil(s) bruts, ` +
        `${count} demandés. Relance la procédure de mise à jour : ` +
        'EBM_FIGER_PROFILS=1 npx vitest run src/features/decision/engine/banc/geler-profils.maintenance.test.ts',
    )
  }
  const defaut = buildDefaultCriteria(node.criteres_entree)
  const nomsActuels = new Set(node.criteres_entree.map((c) => c.nom))
  return fixture.profils.slice(0, count).map((brut) => {
    const fusionne: Criteria = { ...defaut }
    for (const nom of Object.keys(brut)) {
      // Colonne obsolète (critère retiré du contenu depuis la capture) ignorée plutôt que propagée : plus
      // aucune règle ne peut la référencer, la garder ne ferait que grossir l'objet sans jamais peser sur
      // une sortie (cf. tête de fichier).
      if (nomsActuels.has(nom)) fusionne[nom] = brut[nom]
    }
    return calculerCriteresDerives(node.criteres_entree, fusionne)
  })
}
