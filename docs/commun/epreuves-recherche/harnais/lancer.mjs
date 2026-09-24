#!/usr/bin/env node
// lancer.mjs — sous-commandes du harnais : canari, mesurer, attendre, corriger-pret.
//
// USAGE
//   node lancer.mjs canari
//   node lancer.mjs mesurer --config <1|2|3> --commit <sha> [--cas <E01,E02,…>] [--execution <k>]
//   node lancer.mjs attendre --max <secondes>
//   node lancer.mjs corriger-pret
//
// `mesurer` démarre un lot (concurrence 2, délai 30 min/exécution, une reprise sur erreur technique)
// via un gestionnaire détaché, puis rend la main tout de suite. `attendre` interroge ce gestionnaire,
// au premier plan, jusqu'à « lot terminé » ou l'expiration de `--max` (T5, décision clé « Lots longs
// sans arrière-plan orphelin »). La session appelante ne rend jamais sa réponse finale avec un lot en
// cours (S4.md § Hors périmètre) : elle boucle sur `attendre` jusqu'au bout.

import { spawn } from 'node:child_process';
import {
  mkdirSync, writeFileSync, readFileSync, existsSync, renameSync, openSync, closeSync, cpSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

import { lireTousLesCas } from './cas.mjs';
import {
  construireExport, ExportContamineError, construireReglages, scriptsRecherchePrimaireExistent,
} from './export.mjs';
import { analyserTranscription, parserJSONL } from './transcription.mjs';

const ICI = dirname(fileURLToPath(import.meta.url));
const RACINE_DEPOT = join(ICI, '..', '..', '..', '..');
const DOSSIER_HARNAIS_TMP = join(tmpdir(), 'epreuves-recherche-harnais');
const POINTEUR_LOT = join(DOSSIER_HARNAIS_TMP, 'lot-courant.json');
const CHEMIN_REPO = 'C:\\Users\\Kovu\\Projets\\ebm-msp';
const CHEMIN_INTERFACE_OE = 'C:\\Users\\Kovu\\Projets\\Interface-OE';

const DELAI_MS_PAR_EXECUTION = 30 * 60 * 1000;
const CONCURRENCE = 2;

function opt(args, nom, defaut = null) {
  const i = args.indexOf(nom);
  return i >= 0 ? args[i + 1] : defaut;
}

function ecrireEtatAtomique(cheminEtat, etat) {
  const tmp = `${cheminEtat}.tmp-${process.pid}`;
  writeFileSync(tmp, JSON.stringify(etat, null, 2));
  renameSync(tmp, cheminEtat);
}

function lireEtat(cheminEtat) {
  return JSON.parse(readFileSync(cheminEtat, 'utf8'));
}

// ---------------------------------------------------------------------------------------------
// Invocation d'un `claude -p` isolé
// ---------------------------------------------------------------------------------------------

function lancerClaudeP({ cwd, prompt, modele, cheminTranscription, delaiMs, reglages }) {
  return new Promise((resolve) => {
    const fdOut = openSync(cheminTranscription, 'w');
    const args = [
      '-p',
      '--output-format', 'stream-json',
      '--verbose',
      '--setting-sources', 'project',
      '--permission-mode', 'dontAsk',
      '--model', modele,
      '--forward-subagent-text',
      '--no-session-persistence',
    ];
    // --allowedTools/--disallowedTools (CLI), pas .claude/settings.json : export.mjs § construireReglages
    // explique pourquoi (confiance de workspace, sondée le 2026-09-24).
    if (reglages?.allow?.length) args.push('--allowedTools', ...reglages.allow);
    if (reglages?.deny?.length) args.push('--disallowedTools', ...reglages.deny);
    const enfant = spawn('claude', args, {
      cwd,
      env: { ...process.env, CLAUDE_CODE_SUBAGENT_MODEL: modele },
      stdio: ['pipe', fdOut, 'pipe'],
    });
    let erreurStderr = '';
    enfant.stderr.on('data', (d) => {
      erreurStderr += d.toString();
    });
    enfant.stdin.write(prompt);
    enfant.stdin.end();

    let expire = false;
    const minuteur = setTimeout(() => {
      expire = true;
      enfant.kill('SIGKILL');
    }, delaiMs);

    enfant.on('close', (code) => {
      clearTimeout(minuteur);
      closeSync(fdOut);
      resolve({ code, expire, erreurStderr: erreurStderr.slice(0, 2000) });
    });
  });
}

// ---------------------------------------------------------------------------------------------
// canari
// ---------------------------------------------------------------------------------------------

// `absentAcceptable` : Bash et PowerShell sont refusés au niveau du NOM d'outil (--disallowedTools) —
// constaté (T5, sondé le 2026-09-24) qu'un outil ainsi refusé disparaît carrément de la boîte à
// outils (jamais de tool_use, jamais de refus explicite à assortir). « absent » y vaut donc « refuse ».
// Pour les six autres gestes refusés, l'outil reste disponible (seul un chemin/domaine est refusé) :
// « absent » n'y prouve rien (le modèle a pu juste ne pas essayer) et ne compte pas comme un succès.
const GESTES_CANARI = [
  { n: 1, libelle: 'Read du dépôt', attendu: 'refuse', absentAcceptable: false },
  { n: 2, libelle: 'Grep du dépôt', attendu: 'refuse', absentAcceptable: false },
  { n: 3, libelle: 'Glob du dépôt', attendu: 'refuse', absentAcceptable: false },
  { n: 4, libelle: 'Bash echo', attendu: 'refuse', absentAcceptable: true },
  { n: 5, libelle: 'PowerShell', attendu: 'refuse', absentAcceptable: true },
  { n: 6, libelle: 'WebFetch github.com/kovuthecat', attendu: 'refuse', absentAcceptable: false },
  { n: 7, libelle: 'Read Interface-OE', attendu: 'refuse', absentAcceptable: false },
  { n: 8, libelle: 'sous-agent : Read du dépôt', attendu: 'refuse', absentAcceptable: false },
  { n: 9, libelle: 'Read CLAUDE.md (export)', attendu: 'reussi', absentAcceptable: false },
  { n: 10, libelle: 'WebFetch pubmed.ncbi.nlm.nih.gov', attendu: 'reussi', absentAcceptable: false },
];

function promptCanari() {
  return `Ceci est un test de permissions (canari), pas une tâche réelle : aucune analyse, aucun
jugement à produire. Tente CHACUN des dix gestes numérotés ci-dessous, DANS L'ORDRE, même si l'un
d'eux échoue ou est refusé — ne t'arrête jamais après un refus, continue immédiatement au geste
suivant. N'improvise rien d'autre. À la fin, écris dans epreuve/sortie/canari.md, pour mémoire
humaine seulement (le verdict réel se lit dans les outils, pas ici), une ligne par geste :
« <n>. <succès|refusé|erreur> — <un mot sur ce qui s'est passé> ».

1. Avec l'outil Read, lis le fichier ${CHEMIN_REPO}\\STATUS.md
2. Avec l'outil Grep, cherche le motif "STATUS" dans le dossier ${CHEMIN_REPO}
3. Avec l'outil Glob, liste les fichiers *.md du dossier ${CHEMIN_REPO}
4. Avec l'outil Bash, exécute : echo test
5. Avec l'outil PowerShell, exécute : Write-Output test
6. Avec l'outil WebFetch, récupère https://github.com/kovuthecat/EBM-MSP
7. Avec l'outil Read, lis le fichier ${CHEMIN_INTERFACE_OE}\\out\\cli\\index.js
8. Lance l'outil Agent (sous-agent, type general-purpose) avec cette instruction exacte : « Avec
   l'outil Read, lis le fichier ${CHEMIN_REPO}\\STATUS.md et rapporte ce que tu obtiens, y compris
   une éventuelle erreur. » Rapporte ce que le sous-agent a obtenu.
9. Avec l'outil Read, lis le fichier CLAUDE.md (dans le dossier courant de cet export, pas le dépôt)
10. Avec l'outil WebFetch, récupère https://pubmed.ncbi.nlm.nih.gov/
`;
}

/** Classe chaque geste du canari d'après les tool_use / tool_result / permission_denials de la transcription. */
export function analyserCanari(evenements) {
  const toolUses = [];
  const toolResults = new Map();
  const permissionDenials = [];

  for (const ev of evenements) {
    if (ev?.type === 'assistant' && Array.isArray(ev.message?.content)) {
      for (const bloc of ev.message.content) {
        if (bloc?.type === 'tool_use') toolUses.push({ ...bloc, parentToolUseId: ev.parent_tool_use_id ?? null });
      }
    }
    if (ev?.type === 'user' && Array.isArray(ev.message?.content)) {
      for (const bloc of ev.message.content) {
        if (bloc?.type === 'tool_result' && bloc.tool_use_id) toolResults.set(bloc.tool_use_id, bloc);
      }
    }
    if (ev?.type === 'result' && Array.isArray(ev.permission_denials)) {
      permissionDenials.push(...ev.permission_denials);
    }
  }

  function resultatPour(predicatEntree) {
    const correspondantes = toolUses.filter(predicatEntree);
    if (correspondantes.length === 0) return 'absent';
    for (const tu of correspondantes) {
      const denyMatch = permissionDenials.some(
        (d) => d.tool_name === tu.name && JSON.stringify(d.tool_input ?? {}) === JSON.stringify(tu.input ?? {}),
      );
      if (denyMatch) return 'refuse';
      const res = toolResults.get(tu.id);
      if (res) {
        if (res.is_error) {
          const texte = typeof res.content === 'string' ? res.content : JSON.stringify(res.content ?? '');
          return /permission|refus|denied|not allowed|denied by your permission/i.test(texte) ? 'refuse' : 'erreur';
        }
        return 'reussi';
      }
    }
    return 'indetermine';
  }

  // Geste 8 : l'outil Agent lui-même (sous-agent), puis SON Read imbriqué — repéré par le
  // `parent_tool_use_id` que --forward-subagent-text place sur chaque événement du sous-agent
  // (constaté sur transcription réelle, T5, 2026-09-24), pas par un simple « contient ebm-msp ».
  const agentTU = toolUses.find((tu) => tu.name === 'Agent');
  const resultatGeste8 = !agentTU
    ? 'absent'
    : resultatPour((tu) => tu.parentToolUseId === agentTU.id && tu.name === 'Read' && JSON.stringify(tu.input).includes('STATUS.md'));

  const resultats = [
    { n: 1, r: resultatPour((tu) => tu.name === 'Read' && JSON.stringify(tu.input).includes('STATUS.md') && JSON.stringify(tu.input).includes('ebm-msp') && tu.parentToolUseId === null) },
    { n: 2, r: resultatPour((tu) => tu.name === 'Grep' && JSON.stringify(tu.input).includes('ebm-msp')) },
    { n: 3, r: resultatPour((tu) => tu.name === 'Glob' && JSON.stringify(tu.input).includes('ebm-msp')) },
    { n: 4, r: resultatPour((tu) => tu.name === 'Bash' && JSON.stringify(tu.input).includes('echo')) },
    { n: 5, r: resultatPour((tu) => tu.name === 'PowerShell') },
    { n: 6, r: resultatPour((tu) => tu.name === 'WebFetch' && JSON.stringify(tu.input).includes('github.com')) },
    { n: 7, r: resultatPour((tu) => tu.name === 'Read' && JSON.stringify(tu.input).includes('Interface-OE')) },
    { n: 8, r: resultatGeste8 },
    { n: 9, r: resultatPour((tu) => tu.name === 'Read' && JSON.stringify(tu.input).includes('CLAUDE.md') && !JSON.stringify(tu.input).includes('ebm-msp')) },
    { n: 10, r: resultatPour((tu) => tu.name === 'WebFetch' && JSON.stringify(tu.input).includes('pubmed')) },
  ];

  const detail = GESTES_CANARI.map((g) => {
    const r = resultats.find((x) => x.n === g.n)?.r ?? 'indetermine';
    const ok = g.attendu === 'refuse' ? (r === 'refuse' || (g.absentAcceptable && r === 'absent')) : r === 'reussi';
    return { ...g, obtenu: r, ok };
  });

  return { detail, vert: detail.every((d) => d.ok) };
}

async function commandeCanari() {
  mkdirSync(DOSSIER_HARNAIS_TMP, { recursive: true });
  const casVide = {
    id: 'CANARI',
    cheminDossier: join(DOSSIER_HARNAIS_TMP, 'canari-cas-vide'),
    exclusions: [],
    signatures: [],
  };
  mkdirSync(casVide.cheminDossier, { recursive: true });

  let exportInfo;
  try {
    exportInfo = construireExport({
      racineDepot: RACINE_DEPOT,
      commit: 'HEAD',
      cas: casVide,
      dossierParent: DOSSIER_HARNAIS_TMP,
    });
  } catch (e) {
    console.error(`canari : échec de construction de l'export — ${e.message}`);
    process.exit(1);
  }

  const cheminTranscription = join(DOSSIER_HARNAIS_TMP, `canari-${Date.now()}.jsonl`);
  console.log(`canari : export ${exportInfo.chemin}`);
  console.log(`canari : transcription ${cheminTranscription}`);
  const reglages = construireReglages({
    scriptsRecherchePrimaireExistent: scriptsRecherchePrimaireExistent(exportInfo.chemin),
  });
  const { code, expire, erreurStderr } = await lancerClaudeP({
    cwd: exportInfo.chemin,
    prompt: promptCanari(),
    modele: 'haiku',
    cheminTranscription,
    delaiMs: DELAI_MS_PAR_EXECUTION,
    reglages,
  });

  if (expire) {
    console.error('canari : expiré (30 min) — rouge');
    process.exit(1);
  }

  let evenements;
  try {
    evenements = parserJSONL(readFileSync(cheminTranscription, 'utf8'));
  } catch (e) {
    console.error(`canari : transcription illisible (code sortie ${code}) — ${e.message}`);
    if (erreurStderr) console.error(`stderr : ${erreurStderr}`);
    process.exit(1);
  }

  const { detail, vert } = analyserCanari(evenements);
  console.log('canari : résultat des dix gestes (attendu → obtenu)');
  for (const d of detail) {
    console.log(`  ${d.n}. ${d.libelle} — attendu ${d.attendu}, obtenu ${d.obtenu} — ${d.ok ? 'OK' : 'ÉCART'}`);
  }
  console.log(vert ? 'canari : VERT' : 'canari : ROUGE');
  process.exit(vert ? 0 : 1);
}

// ---------------------------------------------------------------------------------------------
// mesurer / gestionnaire interne / attendre
// ---------------------------------------------------------------------------------------------

function fileDExecutions({ casListe, config, commit, casIds, execution }) {
  const file = [];
  const cible = casIds ? casListe.filter((c) => casIds.includes(c.id)) : casListe;
  for (const c of cible) {
    const executions = execution ? [execution] : [1, 2];
    for (const k of executions) {
      file.push({ casId: c.id, execution: k, statut: 'attente', tentatives: 0 });
    }
  }
  return file;
}

async function commandeMesurer(args) {
  const config = Number(opt(args, '--config'));
  const commit = opt(args, '--commit');
  const casIdsBrut = opt(args, '--cas');
  const casIds = casIdsBrut ? casIdsBrut.split(',').map((s) => s.trim()) : null;
  const execution = opt(args, '--execution') ? Number(opt(args, '--execution')) : null;

  if (!config || !commit) {
    console.error('mesurer : --config et --commit sont requis');
    process.exit(2);
  }

  const casListe = lireTousLesCas(RACINE_DEPOT);
  const file = fileDExecutions({ casListe, config, commit, casIds, execution });

  mkdirSync(DOSSIER_HARNAIS_TMP, { recursive: true });
  const idLot = `lot-${config}-${Date.now()}`;
  const dossierLot = join(DOSSIER_HARNAIS_TMP, idLot);
  mkdirSync(dossierLot, { recursive: true });
  const cheminEtat = join(dossierLot, 'etat.json');

  const etat = {
    id: idLot,
    config,
    commit,
    concurrence: CONCURRENCE,
    delaiMsParExecution: DELAI_MS_PAR_EXECUTION,
    dossierLot,
    dateDebut: new Date().toISOString(),
    file,
    termine: false,
  };
  ecrireEtatAtomique(cheminEtat, etat);
  ecrireEtatAtomique(POINTEUR_LOT, { cheminEtat });

  const gestionnaire = spawn(
    process.execPath,
    [fileURLToPath(import.meta.url), '_gestionnaire-interne', '--etat', cheminEtat],
    { detached: true, stdio: 'ignore' },
  );
  gestionnaire.unref();

  console.log(`mesurer : lot ${idLot} démarré (${file.length} exécutions, concurrence ${CONCURRENCE})`);
  console.log(`mesurer : état ${cheminEtat}`);
  console.log('mesurer : appeler « attendre --max 540 » en boucle jusqu\'à « lot terminé »');
}

async function gestionnaireInterne(args) {
  const cheminEtat = opt(args, '--etat');
  let etat = lireEtat(cheminEtat);
  const casListe = lireTousLesCas(RACINE_DEPOT);
  const parId = Object.fromEntries(casListe.map((c) => [c.id, c]));

  async function traiterUnItem(item) {
    item.statut = 'en-cours';
    item.debut = new Date().toISOString();
    ecrireEtatAtomique(cheminEtat, etat);

    const cas = parId[item.casId];
    const dossierExecution = join(etat.dossierLot, item.casId, `execution-${item.execution}`);
    mkdirSync(dossierExecution, { recursive: true });

    let exportInfo;
    try {
      exportInfo = construireExport({
        racineDepot: RACINE_DEPOT,
        commit: etat.commit,
        cas,
        dossierParent: etat.dossierLot,
      });
    } catch (e) {
      item.statut = e instanceof ExportContamineError ? 'contamine' : 'erreur';
      item.erreur = e.message;
      item.fin = new Date().toISOString();
      ecrireEtatAtomique(cheminEtat, etat);
      return;
    }

    const cheminTranscription = join(dossierExecution, 'transcription.jsonl');
    const reglages = construireReglages({
      scriptsRecherchePrimaireExistent: scriptsRecherchePrimaireExistent(exportInfo.chemin),
    });
    const { code, expire, erreurStderr } = await lancerClaudeP({
      cwd: exportInfo.chemin,
      prompt: cas.enonce,
      modele: 'sonnet',
      cheminTranscription,
      delaiMs: etat.delaiMsParExecution,
      reglages,
    });

    const echecTechnique = expire || (code !== 0 && code !== null);
    if (echecTechnique && item.tentatives < 1) {
      item.tentatives += 1;
      item.statut = 'attente';
      item.dernierEchecTechnique = expire ? 'expire' : `code-${code}`;
      ecrireEtatAtomique(cheminEtat, etat);
      return;
    }

    let analyse = { coutUsd: null, dureeMs: null, invalidee: false, motifInvalidation: null, refus: [] };
    try {
      analyse = analyserTranscription(readFileSync(cheminTranscription, 'utf8'));
    } catch {
      // transcription illisible : compte comme erreur technique définitive après épuisement des reprises.
    }

    const cheminSortieExport = join(exportInfo.chemin, 'epreuve', 'sortie');
    const cheminLivrableRepo = join(dossierExecution, 'livrable');
    mkdirSync(cheminLivrableRepo, { recursive: true });
    if (existsSync(cheminSortieExport)) cpSync(cheminSortieExport, cheminLivrableRepo, { recursive: true });

    item.statut = echecTechnique ? 'erreur' : 'fini';
    item.fin = new Date().toISOString();
    item.transcriptionChemin = cheminTranscription;
    item.exportChemin = exportInfo.chemin;
    item.livrableChemin = cheminLivrableRepo;
    item.coutUsd = analyse.coutUsd;
    item.dureeMs = analyse.dureeMs;
    item.invalidee = analyse.invalidee;
    item.motifInvalidation = analyse.motifInvalidation;
    item.nRefus = analyse.refus.length;
    if (echecTechnique) item.erreur = erreurStderr || `code ${code}`;
    ecrireEtatAtomique(cheminEtat, etat);
  }

  // Boucle de concurrence : tant que des items sont en attente, on en lance jusqu'à `concurrence`.
  // eslint-disable-next-line no-constant-condition
  while (true) {
    etat = lireEtat(cheminEtat);
    const enCours = etat.file.filter((i) => i.statut === 'en-cours').length;
    const attente = etat.file.filter((i) => i.statut === 'attente');
    if (attente.length === 0 && enCours === 0) break;

    const aLancer = attente.slice(0, Math.max(0, etat.concurrence - enCours));
    if (aLancer.length === 0) {
      await new Promise((r) => setTimeout(r, 2000));
      continue;
    }
    await Promise.all(aLancer.map((item) => traiterUnItem(item)));
  }

  etat = lireEtat(cheminEtat);
  etat.termine = true;
  etat.dateFin = new Date().toISOString();
  ecrireEtatAtomique(cheminEtat, etat);
}

function resumeEtat(etat) {
  const parStatut = {};
  for (const i of etat.file) parStatut[i.statut] = (parStatut[i.statut] ?? 0) + 1;
  return parStatut;
}

async function commandeAttendre(args) {
  const maxS = Number(opt(args, '--max', '540'));
  if (!existsSync(POINTEUR_LOT)) {
    console.error('attendre : aucun lot en cours (aucun pointeur écrit par « mesurer »)');
    process.exit(2);
  }
  const { cheminEtat } = JSON.parse(readFileSync(POINTEUR_LOT, 'utf8'));
  const echeance = Date.now() + maxS * 1000;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const etat = lireEtat(cheminEtat);
    const resume = resumeEtat(etat);
    console.log(`attendre : ${JSON.stringify(resume)}`);
    if (etat.termine) {
      console.log('attendre : lot terminé');
      process.exit(0);
    }
    if (Date.now() >= echeance) {
      console.log('attendre : lot toujours en cours (relancer « attendre »)');
      process.exit(1);
    }
    await new Promise((r) => setTimeout(r, 10000));
  }
}

async function commandeCorrigerPret() {
  if (!existsSync(POINTEUR_LOT)) {
    console.log('corriger-pret : aucun lot connu');
    return;
  }
  const { cheminEtat } = JSON.parse(readFileSync(POINTEUR_LOT, 'utf8'));
  const etat = lireEtat(cheminEtat);
  const pretes = etat.file.filter((i) => i.statut === 'fini' && !i.invalidee);
  for (const i of pretes) {
    console.log(`${i.casId} exécution ${i.execution} — livrable : ${i.livrableChemin}`);
  }
  const invalidees = etat.file.filter((i) => i.invalidee);
  if (invalidees.length > 0) {
    console.log('--- invalidées (à rejouer, ne pas corriger) ---');
    for (const i of invalidees) console.log(`${i.casId} exécution ${i.execution} — ${i.motifInvalidation}`);
  }
}

// ---------------------------------------------------------------------------------------------

async function main() {
  const [, , commande, ...reste] = process.argv;
  if (commande === 'canari') return commandeCanari();
  if (commande === 'mesurer') return commandeMesurer(reste);
  if (commande === '_gestionnaire-interne') return gestionnaireInterne(reste);
  if (commande === 'attendre') return commandeAttendre(reste);
  if (commande === 'corriger-pret') return commandeCorrigerPret();
  console.error('usage : lancer.mjs canari | mesurer | attendre | corriger-pret');
  process.exit(2);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}
