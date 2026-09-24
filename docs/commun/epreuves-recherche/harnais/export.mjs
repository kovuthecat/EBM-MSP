// export.mjs — construit un export isolé d'une épreuve : liste blanche du README, au commit mesuré,
// moins les exclusions du cas, plus les pièces (`epreuve/entrees/`) et un livrable vide
// (`epreuve/sortie/`). Toujours sous `os.tmpdir()`, jamais dans le dépôt (T5, décision clé).
//
// Deux gardes de sécurité, avant de rendre l'export utilisable :
// - neutralisation du chemin du CLI OE dans les fichiers texte (double garde avec le refus de Bash) ;
// - refus si une signature du cas figure dans un fichier texte de la liste blanche copiée (rejoue,
//   par export, le contrôle d'admissibilité documenté dans le README).

import { execFileSync } from 'node:child_process';
import {
  mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, readdirSync, cpSync, rmSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname, relative, sep } from 'node:path';
import { lireListeBlanche } from './cas.mjs';

// docs/decision/sources/ : les PDF y sont ignorés par git (droit d'auteur, .gitignore) — un export
// tiré du commit ne contiendrait que prescrire-dt2.md. Ce sont pourtant la matière légitime de la
// recherche (README § Liste blanche) : on copie ce dossier depuis l'arbre de travail, pas depuis git.
export const CHEMINS_ARBRE_DE_TRAVAIL = ['docs/decision/sources/'];

const CHEMIN_OE_CLI = /Interface-OE[\\/]+out[\\/]+cli[\\/]+index\.js/g;
export const CHEMIN_OE_NEUTRALISE = 'CHEMIN-OE-NEUTRALISE/index.js';

const EXTENSIONS_BINAIRES = new Set(['.pdf', '.png', '.jpg', '.jpeg', '.gif', '.ico', '.woff', '.woff2']);

export class ExportContamineError extends Error {
  constructor(idCas, trouvailles) {
    super(
      `export du cas ${idCas} refusé : signature(s) trouvée(s) dans la liste blanche — ` +
        trouvailles.map((t) => `« ${t.signature} » dans ${t.fichier}`).join(', '),
    );
    this.name = 'ExportContamineError';
    this.idCas = idCas;
    this.trouvailles = trouvailles;
  }
}

function estBinaire(cheminRelatif) {
  const i = cheminRelatif.lastIndexOf('.');
  if (i < 0) return false;
  return EXTENSIONS_BINAIRES.has(cheminRelatif.slice(i).toLowerCase());
}

function versPosix(cheminRelatif) {
  return cheminRelatif.split(sep).join('/');
}

function listerFichiersRecursif(dir) {
  if (!existsSync(dir)) return [];
  const resultats = [];
  for (const entree of readdirSync(dir, { withFileTypes: true })) {
    const chemin = join(dir, entree.name);
    if (entree.isDirectory()) resultats.push(...listerFichiersRecursif(chemin));
    else if (entree.isFile()) resultats.push(chemin);
  }
  return resultats;
}

/** Fichiers suivis par git sous `chemin`, au `commit` donné (vide si le chemin n'existe pas à ce commit). */
export function gitFichiersSuivis(racineDepot, commit, chemin) {
  const sortie = execFileSync('git', ['ls-tree', '-r', '--name-only', commit, '--', chemin], {
    cwd: racineDepot,
    encoding: 'utf8',
  });
  return sortie
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);
}

function copierDepuisGit(racineDepot, commit, chemin, destinationRacine) {
  const fichiers = gitFichiersSuivis(racineDepot, commit, chemin);
  for (const f of fichiers) {
    const contenu = execFileSync('git', ['show', `${commit}:${f}`], {
      cwd: racineDepot,
      maxBuffer: 64 * 1024 * 1024,
    });
    const dest = join(destinationRacine, f);
    mkdirSync(dirname(dest), { recursive: true });
    writeFileSync(dest, contenu);
  }
  return fichiers;
}

function copierDepuisArbreDeTravail(racineDepot, chemin, destinationRacine) {
  const source = join(racineDepot, chemin);
  if (!existsSync(source)) return [];
  const dest = join(destinationRacine, chemin);
  mkdirSync(dirname(dest), { recursive: true });
  cpSync(source, dest, { recursive: true });
  return listerFichiersRecursif(dest).map((f) => versPosix(relative(destinationRacine, f)));
}

/** Applique la neutralisation du chemin CLI OE à un texte. Fonction pure, testable sans disque. */
export function neutraliserTexte(texte) {
  return texte.replace(CHEMIN_OE_CLI, CHEMIN_OE_NEUTRALISE);
}

function neutraliserExport(destinationRacine) {
  for (const chemin of listerFichiersRecursif(destinationRacine)) {
    const relatif = versPosix(relative(destinationRacine, chemin));
    if (estBinaire(relatif)) continue;
    const contenu = readFileSync(chemin, 'utf8');
    const remplace = neutraliserTexte(contenu);
    if (remplace !== contenu) writeFileSync(chemin, remplace);
  }
}

/**
 * Rejoue, sur les fichiers déjà copiés dans l'export, le contrôle d'admissibilité du README : aucune
 * signature du cas ne doit figurer dans un fichier texte de la liste blanche (PDF exclus — la
 * recherche doit justement y trouver la réponse). Rend la liste des trouvailles (vide = admissible).
 */
export function verifierContamination(destinationRacine, fichiersRelatifs, signatures) {
  if (!signatures || signatures.length === 0) return [];
  const trouvailles = [];
  for (const f of fichiersRelatifs) {
    if (estBinaire(f)) continue;
    const chemin = join(destinationRacine, f);
    if (!existsSync(chemin)) continue;
    const contenu = readFileSync(chemin, 'utf8');
    for (const sig of signatures) {
      if (sig.valeur && contenu.includes(sig.valeur)) trouvailles.push({ fichier: f, signature: sig.valeur });
    }
  }
  return trouvailles;
}

/**
 * Réglages de l'export — decision clé de T5. Rendus en `--allowedTools`/`--disallowedTools` (CLI),
 * PAS en `.claude/settings.json` : constaté empiriquement (T5, sondé le 2026-09-24) qu'un export
 * fraîchement créé sous `os.tmpdir()` est un « workspace non approuvé » pour `claude -p` — ses
 * `permissions.allow` de settings.json sont silencieusement ignorées (avertissement stderr :
 * « this workspace has not been trusted »), alors que `permissions.deny` continue de s'appliquer.
 * Établir la confiance suppose d'écrire dans `~/.claude.json` (hors de l'export, hors du dépôt) —
 * hors de portée d'un harnais qui ne doit modifier ni l'un ni l'autre. Les indicateurs CLI
 * `--allowedTools`/`--disallowedTools`, déjà nommés dans S4.md § Lire, n'ont pas ce besoin de
 * confiance : mêmes motifs (`Read(//chemin/**)`, `WebFetch(domain:x)`…), portés par l'invocation
 * plutôt que par un fichier du workspace. `lancer.mjs` les passe donc directement au processus
 * `claude -p`, cet objet ne fait que les calculer.
 */
export function construireReglages({ scriptsRecherchePrimaireExistent }) {
  const allow = ['Read', 'Grep', 'Glob', 'Write', 'Edit', 'WebFetch(domain:*)', 'WebSearch', 'Skill', 'Agent'];
  if (scriptsRecherchePrimaireExistent) {
    allow.push('Bash(node .claude/skills/recherche-source-primaire/scripts/*)');
  }
  const deny = [
    'Read(//c/Users/Kovu/Projets/ebm-msp/**)',
    'Read(//c/Users/Kovu/Projets/Interface-OE/**)',
    'WebFetch(domain:github.com)',
    'WebFetch(domain:raw.githubusercontent.com)',
    'PowerShell',
    'Bash',
  ];
  return { allow, deny };
}

/** Les scripts de `recherche-source-primaire/scripts/` existent-ils dans cet export (S5, en parallèle) ? */
export function scriptsRecherchePrimaireExistent(destinationRacine) {
  const dossier = join(destinationRacine, '.claude', 'skills', 'recherche-source-primaire', 'scripts');
  return existsSync(dossier) && readdirSync(dossier).length > 0;
}

/**
 * Construit l'export isolé d'un cas, au commit donné. Lève ExportContamineError si une signature du
 * cas figure dans un fichier texte de la liste blanche copiée : dans ce cas, l'export est déjà
 * supprimé du disque avant que l'erreur remonte.
 */
export function construireExport({ racineDepot, commit, cas, dossierParent }) {
  if (!commit) throw new Error('construireExport : commit requis');
  const listeBlanche = lireListeBlanche(racineDepot);
  const destinationRacine = mkdtempSync(join(dossierParent ?? tmpdir(), 'epreuve-export-'));

  let fichiers = [];
  for (const entree of listeBlanche) {
    const chemin = entree.endsWith('/') ? entree.slice(0, -1) : entree;
    if (CHEMINS_ARBRE_DE_TRAVAIL.includes(entree)) {
      fichiers.push(...copierDepuisArbreDeTravail(racineDepot, chemin, destinationRacine));
    } else {
      fichiers.push(...copierDepuisGit(racineDepot, commit, chemin, destinationRacine));
    }
  }

  // Exclusions du cas : défense en profondeur si l'une recoupait la liste blanche (aucune ne le fait
  // dans le corpus au 2026-09-24, cf. README).
  const exclusionsRetirees = [];
  for (const excl of cas.exclusions ?? []) {
    for (const f of fichiers) {
      if (f === excl || f.startsWith(excl.endsWith('/') ? excl : `${excl}/`)) {
        rmSync(join(destinationRacine, f), { force: true });
        exclusionsRetirees.push(f);
      }
    }
  }
  fichiers = fichiers.filter((f) => !exclusionsRetirees.includes(f));

  const contamination = verifierContamination(destinationRacine, fichiers, cas.signatures);
  if (contamination.length > 0) {
    rmSync(destinationRacine, { recursive: true, force: true });
    throw new ExportContamineError(cas.id, contamination);
  }

  // Pièces du cas (epreuve/entrees/) et livrable vide (epreuve/sortie/)
  const entreesDestination = join(destinationRacine, 'epreuve', 'entrees');
  mkdirSync(entreesDestination, { recursive: true });
  const entreesSource = join(cas.cheminDossier, 'entrees');
  if (existsSync(entreesSource)) cpSync(entreesSource, entreesDestination, { recursive: true });
  mkdirSync(join(destinationRacine, 'epreuve', 'sortie'), { recursive: true });

  neutraliserExport(destinationRacine);

  return { chemin: destinationRacine, fichiers, exclusionsRetirees };
}
