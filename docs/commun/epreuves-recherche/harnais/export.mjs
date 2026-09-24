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

// Configuration 2 (T18, S10) : agents dédiés retirés, blocs <!-- lancement:… --> réécrits pour un
// agent general-purpose composé à la volée. Configuration 3 (et 1, réutilisée telle quelle par S4) :
// export du commit tel quel, aucune de ces deux transformations.
export const AGENTS_DEDIES = [
  '.claude/agents/extracteur-preuve.md',
  '.claude/agents/contradicteur-preuve.md',
  '.claude/agents/reconciliateur-preuve.md',
];

const RE_BLOC_LANCEMENT = /<!-- lancement:([\w-]+) -->\n([\s\S]*?)<!-- \/lancement -->/g;
const RE_LIGNE_LANCER = /^\*\*Lancer\*\*.*$/m;
export const LIGNE_LANCER_GENERIQUE = '**Lancer** un agent `general-purpose` (outil Agent). Dans '
  + "cette configuration l'agent dédié n'existe pas : compose toi-même son invite à partir du rôle, "
  + 'des entrées et des références ci-dessous.';

export class ConfigurationDeuxIncohereenteError extends Error {
  constructor(trouves, transformes) {
    super(
      `configuration 2 : ${trouves} bloc(s) « lancement » trouvé(s) dans l'export, ${transformes} `
        + 'transformé(s) — attendu autant de transformés que de trouvés, et au moins un.',
    );
    this.name = 'ConfigurationDeuxIncohereenteError';
    this.trouves = trouves;
    this.transformes = transformes;
  }
}

/** Retire les fichiers des trois agents dédiés d'un export. Rend les chemins relatifs retirés. */
export function retirerAgentsDedies(destinationRacine) {
  const retires = [];
  for (const relatif of AGENTS_DEDIES) {
    const chemin = join(destinationRacine, ...relatif.split('/'));
    if (existsSync(chemin)) {
      rmSync(chemin, { force: true });
      retires.push(relatif);
    }
  }
  return retires;
}

/**
 * Réécrit, dans un texte, chaque bloc `<!-- lancement:X --> … <!-- /lancement -->` : la ligne
 * `**Lancer** …` devient l'invite « compose toi-même », le reste du bloc (rôle, transmis, références,
 * livrable) reste inchangé. Fonction pure, testable sans disque.
 */
export function transformerTexteLancements(texte) {
  let trouves = 0;
  let transformes = 0;
  const texteTransforme = texte.replace(RE_BLOC_LANCEMENT, (blocEntier, nomAgent, corps) => {
    trouves += 1;
    if (!RE_LIGNE_LANCER.test(corps)) return blocEntier;
    transformes += 1;
    const nouveauCorps = corps.replace(RE_LIGNE_LANCER, LIGNE_LANCER_GENERIQUE);
    return `<!-- lancement:${nomAgent} -->\n${nouveauCorps}<!-- /lancement -->`;
  });
  return { texte: texteTransforme, trouves, transformes };
}

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

/** Applique `transformerTexteLancements` à chaque fichier texte de l'export. Rend les compteurs cumulés. */
export function transformerLancementsEnAgentsGeneriques(destinationRacine) {
  let blocsTrouves = 0;
  let blocsTransformes = 0;
  for (const chemin of listerFichiersRecursif(destinationRacine)) {
    const relatif = versPosix(relative(destinationRacine, chemin));
    if (estBinaire(relatif)) continue;
    const contenu = readFileSync(chemin, 'utf8');
    if (!contenu.includes('<!-- lancement:')) continue;
    const { texte, trouves, transformes } = transformerTexteLancements(contenu);
    blocsTrouves += trouves;
    blocsTransformes += transformes;
    if (texte !== contenu) writeFileSync(chemin, texte);
  }
  return { blocsTrouves, blocsTransformes };
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
 *
 * **Correctif localisé (T18, S10, 2026-09-24)** : `scriptsRecherchePrimaireExistent` n'ajoute plus
 * rien à `allow`. Sondé au canari de configuration 3 (rouge sur les gestes 11-12, ajoutés par T18) et
 * confirmé par quatre sondes isolées, hors de l'export (`--permission-mode` en `dontAsk`, `auto` et
 * `manual`, `--permission-prompts none` compris) : dans cette version du CLI, un motif `Bash(…)` dans
 * `--allowedTools` ne restreint RIEN — dès qu'AUCUN motif ne nomme `Bash` dans `--disallowedTools`,
 * TOUTE commande Bash passe (`whoami`, hors motif, a réussi) ; dès qu'un motif nomme `Bash` dans
 * `--disallowedTools` (bare `Bash` ou `Bash(*)`), l'outil disparaît ENTIÈREMENT de la boîte à outils,
 * y compris pour un motif par ailleurs autorisé. Aucune restriction fine n'est donc atteignable :
 * Bash est binaire (tout ou rien). La prémisse de T5 (§ Décision clé : « Bash seulement pour
 * `node .../scripts/*` ») ne tient pas pour cette combinaison, jamais exercée avant T18 (S5 n'avait
 * pas encore écrit les scripts quand S4 a mesuré la configuration 1 : `allow` n'a jamais porté ce
 * motif en pratique). Choix retenu, invariant d'isolement prioritaire sur la fonctionnalité : Bash
 * reste refusé dans les trois configurations, y compris quand les scripts existent au commit exporté
 * — `identite.mjs`/`verifier-registre.mjs` restent hors de portée d'un circuit mesuré ici, dans les
 * trois configurations également (aucun biais différentiel introduit : configuration 1 les avait déjà
 * hors de portée, pour une autre raison). Le paramètre reste accepté (appelants existants, et il governs
 * toujours le nombre de gestes du canari) mais n'influence plus `allow`.
 */
export function construireReglages({ scriptsRecherchePrimaireExistent }) {
  void scriptsRecherchePrimaireExistent; // conservé pour la signature ; n'agit plus sur `allow` (ci-dessus)
  const allow = ['Read', 'Grep', 'Glob', 'Write', 'Edit', 'WebFetch(domain:*)', 'WebSearch', 'Skill', 'Agent'];
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
 *
 * `config` (T18, S10) : 2 retire les trois agents dédiés et réécrit les blocs `lancement` en
 * agent general-purpose ; 1 et 3 (et absent) rendent l'export tel quel. `cas.corpus` (défaut `'cas'`)
 * sélectionne la liste blanche : celle du README partagé pour le corpus par défaut, celle du
 * README du dossier de corpus sinon (`--corpus`, cas-module de S11 par exemple).
 */
export function construireExport({
  racineDepot, commit, cas, dossierParent, config,
}) {
  if (!commit) throw new Error('construireExport : commit requis');
  const listeBlanche = lireListeBlanche(racineDepot, cas.corpus ?? 'cas');
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

  // Configuration 2 : agents dédiés retirés avant le contrôle de contamination (défense en
  // profondeur, même motif que les exclusions ci-dessus).
  let agentsRetires = [];
  if (config === 2) {
    agentsRetires = retirerAgentsDedies(destinationRacine);
    fichiers = fichiers.filter((f) => !agentsRetires.includes(f));
  }

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

  let blocsLancement = null;
  if (config === 2) {
    const { blocsTrouves, blocsTransformes } = transformerLancementsEnAgentsGeneriques(destinationRacine);
    if (blocsTrouves === 0 || blocsTrouves !== blocsTransformes) {
      rmSync(destinationRacine, { recursive: true, force: true });
      throw new ConfigurationDeuxIncohereenteError(blocsTrouves, blocsTransformes);
    }
    blocsLancement = { trouves: blocsTrouves, transformes: blocsTransformes };
  }

  return {
    chemin: destinationRacine, fichiers, exclusionsRetirees, config: config ?? null, agentsRetires, blocsLancement,
  };
}
