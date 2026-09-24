#!/usr/bin/env node
// verifier-registre.mjs — contrôle le format du registre des affirmations d'un dossier de preuve.
// Contrat complet : .claude/skills/recherche-source-primaire/references/registre-affirmations.md
// §Format (contrat de verifier-registre.mjs). Résumé de la règle qui motive ce script (§14.2) :
// l'erreur la plus fréquente n'est pas la référence inventée mais la référence réelle qui ne
// soutient pas la phrase — relier une affirmation au passage lu n'est tenu que si une porte le
// vérifie. Imposé aux NOUVEAUX dossiers seulement : aucun registre existant n'est converti.
//
// USAGE
//   node verifier-registre.mjs <fichier.md> [--json]
//
// SORTIE : une ligne par erreur (« L<n> — message »), avec le numéro de ligne du fichier source ;
// code de sortie 1 si au moins une erreur, 0 si le registre est valide, 2 en cas d'usage incorrect
// (fichier manquant ou illisible).

import { readFileSync, existsSync } from 'node:fs';

// ---------------------------------------------------------------------------------------------
// Contrat de forme (cf. registre-affirmations.md §Format — domicile de ces valeurs, pas ce script)
// ---------------------------------------------------------------------------------------------

export const COLONNES = [
  'ID',
  'Sous-question',
  'Affirmation',
  'Étude',
  'Localisation',
  'Accès',
  'Donnée extraite',
  'Calcul',
  'Vérification',
  'Contradiction',
  'Destination',
];

export const VERIFICATIONS_ADMISES = new Set(['vérifiée', 'non vérifiée', 'non vérifiable', 'contredite']);

// Accès qui interdisent une ligne « vérifiée » (le passage n'a, par construction, pas été lu).
const ACCES_QUI_BLOQUENT_VERIFIEE = new Set([
  'non récupéré',
  'échec technique',
  'accès restant à vérifier',
  'paywall constaté sur cette voie',
]);

const REGEX_SEPARATEUR = /^\s*\|?\s*:?-{1,}:?\s*(\|\s*:?-{1,}:?\s*)*\|?\s*$/;
const REGEX_RECALCULE = /^recalcul[ée]\s*:\s*risque bras A\s*([\d.,]+)\s*,\s*risque bras B\s*([\d.,]+)\s*(?:,\s*horizon\s*[^-]*?)?->\s*NNT\s*([\d.,]+)\s*$/i;

export class ErreurLigne {
  constructor(ligne, message) {
    this.ligne = ligne;
    this.message = message;
  }
  toString() {
    return `L${this.ligne ?? '?'} — ${this.message}`;
  }
}

function estVide(cellule) {
  const t = (cellule ?? '').trim();
  return t === '' || t === '-' || t === '—';
}

function decouperLigneTableau(ligne) {
  const parts = ligne.trim().split('|').map((s) => s.trim());
  if (parts.length && parts[0] === '') parts.shift();
  if (parts.length && parts[parts.length - 1] === '') parts.pop();
  return parts;
}

function parseNombre(texte) {
  const n = Number(String(texte).trim().replace(',', '.'));
  return Number.isFinite(n) ? n : null;
}

// ---------------------------------------------------------------------------------------------
// Analyse d'un fichier : renvoie { lignes, erreurs } — `lignes` = tableau d'objets {colonne: valeur,
// __ligne: numéroDeLigne1Based}, `erreurs` = ErreurLigne[] déjà accumulées à l'étape de parsing
// (en-tête absent/modifié, séparateur invalide, nombre de colonnes inattendu).
// ---------------------------------------------------------------------------------------------

export function analyserTableau(texte) {
  const erreurs = [];
  const brutes = texte.split(/\r?\n/);

  const iEntete = brutes.findIndex((l) => l.trim().startsWith('|'));
  if (iEntete === -1) {
    erreurs.push(new ErreurLigne(null, "aucun tableau Markdown trouvé (une ligne d'en-tête doit commencer par « | »)"));
    return { lignes: [], erreurs };
  }

  const entete = decouperLigneTableau(brutes[iEntete]);
  const enteteAttendue = COLONNES.join(' | ');
  if (entete.length !== COLONNES.length || entete.some((c, i) => c !== COLONNES[i])) {
    erreurs.push(
      new ErreurLigne(
        iEntete + 1,
        `en-tête modifié — attendu « ${enteteAttendue} », obtenu « ${entete.join(' | ')} »`,
      ),
    );
    // L'en-tête est le contrat lui-même : pas de suite plausible s'il est faux, mais on continue à
    // tenter de lire les lignes de données pour ne pas cacher d'éventuelles autres erreurs.
  }

  const ligneSeparateur = brutes[iEntete + 1];
  if (ligneSeparateur === undefined || !REGEX_SEPARATEUR.test(ligneSeparateur)) {
    erreurs.push(new ErreurLigne(iEntete + 2, 'ligne de séparation du tableau absente ou invalide (attendu une ligne de tirets)'));
  }

  const lignes = [];
  for (let i = iEntete + 2; i < brutes.length; i++) {
    const brute = brutes[i];
    if (brute === undefined || brute.trim() === '') break;
    if (!brute.trim().startsWith('|')) break;
    const cellules = decouperLigneTableau(brute);
    if (cellules.length !== COLONNES.length) {
      erreurs.push(
        new ErreurLigne(i + 1, `nombre de colonnes inattendu (attendu ${COLONNES.length}, obtenu ${cellules.length})`),
      );
      continue;
    }
    const objet = { __ligne: i + 1 };
    COLONNES.forEach((nom, idx) => {
      objet[nom] = cellules[idx];
    });
    lignes.push(objet);
  }

  return { lignes, erreurs };
}

// ---------------------------------------------------------------------------------------------
// Règles (registre-affirmations.md §Format)
// ---------------------------------------------------------------------------------------------

function verifierLigneVerifiee(ligne, erreurs) {
  const statut = (ligne['Vérification'] ?? '').trim();
  if (!VERIFICATIONS_ADMISES.has(statut)) {
    erreurs.push(
      new ErreurLigne(
        ligne.__ligne,
        `Vérification "${statut}" non admise (valeurs admises : ${[...VERIFICATIONS_ADMISES].join(', ')})`,
      ),
    );
    return;
  }
  if (statut === 'vérifiée') {
    if (estVide(ligne['Localisation'])) {
      erreurs.push(new ErreurLigne(ligne.__ligne, 'Vérification = "vérifiée" mais Localisation vide'));
    }
    const acces = (ligne['Accès'] ?? '').trim();
    if (ACCES_QUI_BLOQUENT_VERIFIEE.has(acces)) {
      erreurs.push(
        new ErreurLigne(
          ligne.__ligne,
          `Vérification = "vérifiée" incompatible avec Accès = "${acces}" (le passage n'a pas été lu)`,
        ),
      );
    }
  }
}

function ligneMentionneNnt(ligne) {
  return COLONNES.some((nom) => /\bnnt\b/i.test(ligne[nom] ?? ''));
}

function verifierCalculNnt(ligne, erreurs) {
  if (!ligneMentionneNnt(ligne)) return;
  const calcul = (ligne['Calcul'] ?? '').trim();
  const estPublie = /^publié/i.test(calcul);
  const estRecalcule = /^recalcul[ée]\s*:/i.test(calcul);
  const estNonCalculable = /^non calculable\s*:\s*\S/i.test(calcul);
  if (!estPublie && !estRecalcule && !estNonCalculable) {
    erreurs.push(
      new ErreurLigne(
        ligne.__ligne,
        'un NNT est mentionné sans statut de calcul (Calcul doit commencer par "publié", "recalculé :" ou "non calculable :")',
      ),
    );
    return;
  }
  if (estRecalcule) {
    const m = calcul.match(REGEX_RECALCULE);
    if (!m) {
      erreurs.push(
        new ErreurLigne(
          ligne.__ligne,
          'Calcul "recalculé :" ne respecte pas la syntaxe attendue (« recalculé : risque bras A <p1>, risque bras B <p2>[, horizon <texte>] -> NNT <n> »)',
        ),
      );
      return;
    }
    const p1 = parseNombre(m[1]);
    const p2 = parseNombre(m[2]);
    const nntEcrit = parseNombre(m[3]);
    if (p1 === null || p2 === null || nntEcrit === null) {
      erreurs.push(new ErreurLigne(ligne.__ligne, 'Calcul "recalculé :" contient une valeur non numérique'));
      return;
    }
    const difference = Math.abs(p1 - p2);
    if (difference === 0) {
      erreurs.push(new ErreurLigne(ligne.__ligne, 'Calcul "recalculé :" : risques identiques dans les deux bras, NNT indéfini'));
      return;
    }
    const nntCalcule = Math.ceil(1 / difference);
    if (nntCalcule !== Math.round(nntEcrit)) {
      erreurs.push(
        new ErreurLigne(
          ligne.__ligne,
          `NNT recalculé incohérent : à partir des risques donnés, NNT attendu ${nntCalcule}, écrit ${nntEcrit}`,
        ),
      );
    }
  }
}

export function verifierRegistre(texte) {
  const { lignes, erreurs } = analyserTableau(texte);
  for (const ligne of lignes) {
    verifierLigneVerifiee(ligne, erreurs);
    verifierCalculNnt(ligne, erreurs);
  }
  erreurs.sort((a, b) => (a.ligne ?? 0) - (b.ligne ?? 0));
  return { valide: erreurs.length === 0, lignes, erreurs };
}

// ---------------------------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------------------------

async function main() {
  const args = process.argv.slice(2);
  const veutJson = args.includes('--json');
  const fichier = args.find((a) => !a.startsWith('--'));
  if (!fichier) {
    console.error('verifier-registre: usage : node verifier-registre.mjs <fichier.md> [--json]');
    process.exit(2);
  }
  if (!existsSync(fichier)) {
    console.error(`verifier-registre: fichier introuvable : ${fichier}`);
    process.exit(2);
  }
  let texte;
  try {
    texte = readFileSync(fichier, 'utf8');
  } catch (e) {
    console.error(`verifier-registre: lecture impossible de ${fichier} : ${e.message}`);
    process.exit(2);
  }

  const { valide, lignes, erreurs } = verifierRegistre(texte);

  if (veutJson) {
    process.stdout.write(
      JSON.stringify({ fichier, valide, nbLignes: lignes.length, erreurs: erreurs.map((e) => ({ ligne: e.ligne, message: e.message })) }, null, 2) + '\n',
    );
  } else if (valide) {
    process.stdout.write(`verifier-registre: ${fichier} — ${lignes.length} ligne(s), 0 erreur\n`);
  } else {
    for (const e of erreurs) process.stdout.write(`${e.toString()}\n`);
    process.stdout.write(`verifier-registre: ${fichier} — ${erreurs.length} erreur(s)\n`);
  }
  process.exit(valide ? 0 : 1);
}

let estAppelDirect = false;
try {
  const { pathToFileURL } = await import('node:url');
  estAppelDirect = process.argv[1] !== undefined && import.meta.url === pathToFileURL(process.argv[1]).href;
} catch {
  estAppelDirect = false;
}

if (estAppelDirect) {
  await main();
}
