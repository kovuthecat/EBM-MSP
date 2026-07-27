/**
 * PROCÉDURE DE MISE À JOUR du jeu de profils FIGÉ consommé par `caracterisation.test.ts` — cf. la
 * justification de conception complète en tête de `fixtureProfils.ts` (pourquoi un jeu figé, ce qui se
 * passe quand un critère est ajouté au contenu). CE FICHIER est le SEUL endroit du dépôt qui ÉCRIT les
 * fixtures `banc/fixtures/profils.<id>.json` — `fixtureProfils.ts` ne fait que les LIRE.
 *
 * DÉSACTIVÉ PAR DÉFAUT (`describe.skipIf`) : ce fichier ne fait RIEN pendant `npm test` /
 * `npx vitest run .../banc/` — écrire une fixture est un acte délibéré, jamais une conséquence silencieuse
 * d'une exécution de test normale (même esprit que DECISIONS.md D4/D5 : aucune mise à jour automatique,
 * toujours un geste explicite et relisible). Sûr à laisser dans la suite normale : sans la variable
 * d'environnement `EBM_FIGER_PROFILS`, `describe.skipIf` saute tout le bloc — jamais un échec, jamais une
 * écriture, quel que soit l'état des fixtures sur disque.
 *
 * QUAND LE LANCER (les deux seuls cas où une fixture doit changer) :
 *
 * 1. Un NOUVEAU nœud apparaît dans `/content` sans fixture (`banc/fixtures/profils.<id>.json` absent) —
 *    ex. les nœuds RHD en cours d'encodage par un autre chantier au moment d'écrire ce fichier.
 *    `caracterisation.test.ts` échoue alors avec un message explicite pointant ici
 *    (`fixtureProfils.ts` `lireFixtureProfils`). Lancer la procédure CRÉE sa ligne de base
 *    (`genererFixtureProfils`, bootstrap intégral — le seul cas où repartir de zéro est correct, puisqu'il
 *    n'existe encore RIEN à préserver). Le commit de cette fixture EST le golden master initial de ce
 *    nœud : à relire comme tel — une création n'a rien à comparer, contrairement à une mise à jour.
 *
 * 2. Un nœud déjà pourvu d'une fixture reçoit un NOUVEAU critère saisissable en contenu. Lancer la
 *    procédure AJOUTE uniquement la ou les colonnes manquantes (`completerFixtureProfils`, `profils.ts`) :
 *    toutes les valeurs déjà figées ressortent BYTE À BYTE inchangées — seul le nouveau critère reçoit un
 *    tirage, indépendant des autres colonnes. Le diff qui en résulte dans
 *    `__snapshots__/caracterisation.<id>.txt` se limite alors à la ou les lignes du nouveau critère (et à
 *    tout changement de comportement qu'il déclenche RÉELLEMENT) — jamais à un réordonnancement des
 *    profils déjà là.
 *
 * CE QUE CETTE PROCÉDURE NE FAIT JAMAIS : régénérer une colonne déjà figée, ni changer le NOMBRE de
 * profils d'une fixture existante. Aucune commande « tout refaire » n'existe volontairement ici — un jour,
 * une refonte délibérée du jeu de profils (nouvelle graine, nouveau volume) mérite sa propre revue, pas un
 * bouton. Pour ce cas rare : supprimer À LA MAIN le(s) fichier(s) `banc/fixtures/profils.*.json` concernés,
 * puis relancer cette procédure (elle les traite alors comme des nœuds NOUVEAUX, cas 1 ci-dessus).
 *
 * USAGE :
 *   EBM_FIGER_PROFILS=1 npx vitest run src/features/decision/engine/banc/geler-profils.maintenance.test.ts
 *
 * Chaque cas (créé / complété / déjà à jour) est journalisé sur la sortie standard pour que le lancement
 * documente lui-même ce qu'il a fait — à coller dans le changelog de la modification de contenu qui a
 * rendu la mise à jour nécessaire.
 */
import { describe, expect, it } from 'vitest'
import { noeuds } from '../../content/loadNodes.ts'
import { completerFixtureProfils, genererFixtureProfils, reparerFixtureProfils } from './profils.ts'
import {
  NB_PROFILS_FIGES,
  cheminFixture,
  ecrireFixtureProfils,
  lireFixtureProfilsSiPresent,
  profilsFigesPourNoeud,
} from './fixtureProfils.ts'

describe.skipIf(!process.env.EBM_FIGER_PROFILS)(
  'procédure de mise à jour — geler une fixture manquante / compléter une colonne manquante',
  () => {
    it.each(noeuds.map((node) => [node.id, node] as const))('nœud %s', (_id, node) => {
      const existante = lireFixtureProfilsSiPresent(node.id)

      if (existante === undefined) {
        // Cas 1 — nœud NOUVEAU : bootstrap intégral (rien à préserver).
        const fixture = genererFixtureProfils(node, NB_PROFILS_FIGES - 1)
        ecrireFixtureProfils(fixture)
        console.log(
          `[geler-profils] "${node.id}" : NOUVELLE fixture créée (${fixture.profils.length} profils) -> ` +
            cheminFixture(node.id),
        )
      } else {
        // Cas 2 — nœud déjà figé : ajoute UNIQUEMENT les colonnes manquantes, ne touche à aucune des
        // valeurs déjà présentes (cf. `completerFixtureProfils`, `profils.ts`).
        const completee = completerFixtureProfils(node, existante)
        const ajoutes = completee.criteresColonnes.filter((nom) => !existante.criteresColonnes.includes(nom))
        // Cas 3 — RÉPARATION (ajouté le 2026-07-27) : remplace les seuls profils figés qui violent une
        // `contrainte` du nœud, c'est-à-dire ceux qui décrivent un patient IMPOSSIBLE. Les autres gardent
        // leur identité (cf. `reparerFixtureProfils`). Ce cas n'existait pas parce que les contraintes
        // n'existaient pas : un profil figé était réputé valide par construction. Il ne l'est plus dès
        // qu'un nœud DÉCLARE ce qu'une saisie ne peut pas être — et rien d'autre ne l'aurait rattrapé,
        // le jeu figé ne passant par aucun filtre.
        const { fixture: reparee, remplaces } = reparerFixtureProfils(node, completee)
        if (ajoutes.length > 0 || remplaces > 0) {
          ecrireFixtureProfils(reparee)
          const parts: string[] = []
          if (ajoutes.length > 0) parts.push(`colonne(s) ajoutée(s) : ${ajoutes.join(', ')}`)
          if (remplaces > 0) {
            parts.push(`${remplaces}/${reparee.profils.length} profils REMPLACÉS (violaient une contrainte)`)
          }
          console.log(`[geler-profils] "${node.id}" : ${parts.join(' ; ')}`)
        } else {
          console.log(`[geler-profils] "${node.id}" : déjà à jour, rien à faire.`)
        }
      }

      // Sanity : la fixture doit désormais être consommable par caracterisation.test.ts sans lever.
      expect(() => profilsFigesPourNoeud(node, Math.min(NB_PROFILS_FIGES - 1, 10))).not.toThrow()
    })
  },
)
