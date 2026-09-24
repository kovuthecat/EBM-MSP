// cas.mjs — lecture et validation du corpus d'épreuve (docs/commun/epreuves-recherche/).
//
// Fonctions pures (aucune écriture) : lisent le README pour la liste blanche, et chaque cas.md
// pour ses rubriques fixes (format documenté dans README.md § Format d'un cas). Un cas incomplet
// (rubrique absente, zéro assertion, zéro signature) est rejeté bruyamment — jamais toléré en
// silence, puisqu'une mesure sur un cas mal formé ne vaudrait rien (T5, étape 2).

import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, basename } from 'node:path';

const RUBRIQUES_ENTETE = ["Mode d'échec", 'Rôle joué', 'Circuit', 'Incident source'];
const RUBRIQUES_SECTION = ['Énoncé', 'Entrées', 'Résultat attendu', 'Exclusions', 'Signatures'];

export class CasIncompletError extends Error {
  constructor(id, motif) {
    super(`cas ${id} incomplet : ${motif}`);
    this.name = 'CasIncompletError';
    this.id = id;
    this.motif = motif;
  }
}

/**
 * Lit le bloc ```liste-blanche du README et rend ses chemins (relatifs à la racine du dépôt).
 * `corpus` (T18, S10, `--corpus`) : `'cas'` (défaut) lit le README partagé ; tout autre dossier
 * (`cas-module/` de S11 par exemple) lit son propre `README.md`, sous
 * `docs/commun/epreuves-recherche/<corpus>/README.md`.
 */
export function lireListeBlanche(racineDepot, corpus = 'cas') {
  const cheminReadme = corpus === 'cas'
    ? join(racineDepot, 'docs/commun/epreuves-recherche/README.md')
    : join(racineDepot, 'docs/commun/epreuves-recherche', corpus, 'README.md');
  const texte = readFileSync(cheminReadme, 'utf8');
  const m = texte.match(/```liste-blanche\n([\s\S]*?)\n```/);
  if (!m) throw new Error(`liste blanche introuvable dans ${cheminReadme}`);
  return m[1]
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0);
}

function parseEnTete(id, lignes) {
  const entete = {};
  for (const ligne of lignes) {
    const m = ligne.match(/^-\s*([^:]+?)\s*:\s*(.+)$/);
    if (!m) continue;
    const cle = m[1].trim();
    if (RUBRIQUES_ENTETE.includes(cle)) entete[cle] = m[2].trim();
  }
  for (const cle of RUBRIQUES_ENTETE) {
    if (!entete[cle]) throw new CasIncompletError(id, `rubrique d'en-tête absente : « ${cle} »`);
  }
  return entete;
}

function decouperSections(texte) {
  const sections = {};
  const regex = /^##\s+(.+)$/gm;
  const matches = [...texte.matchAll(regex)];
  for (let i = 0; i < matches.length; i++) {
    const titre = matches[i][1].trim();
    const debut = matches[i].index + matches[i][0].length;
    const fin = i + 1 < matches.length ? matches[i + 1].index : texte.length;
    sections[titre] = texte.slice(debut, fin).trim();
  }
  return sections;
}

function parseEntrees(bloc) {
  if (!bloc) return [];
  return bloc
    .split('\n')
    .filter((l) => l.trim().startsWith('- '))
    .map((l) => {
      const contenu = l.replace(/^-\s*/, '');
      const [chemin, ...reste] = contenu.split(' — ');
      return { chemin: chemin.trim(), description: reste.join(' — ').trim() };
    });
}

function parseResultatAttendu(id, bloc) {
  if (!bloc) return [];
  const assertions = bloc
    .split('\n')
    .filter((l) => /^-\s*R\d+\s*:/.test(l.trim()))
    .map((l) => {
      const contenu = l.trim().replace(/^-\s*/, '');
      const mId = contenu.match(/^(R\d+)\s*:\s*/);
      const idAssertion = mId[1];
      const reste = contenu.slice(mId[0].length);
      const iFondee = reste.indexOf(' — fondée sur ');
      const texte = iFondee >= 0 ? reste.slice(0, iFondee).trim() : reste.trim();
      const fondeeSur = iFondee >= 0 ? reste.slice(iFondee + ' — fondée sur '.length).trim() : null;
      return { id: idAssertion, texte, fondeeSur };
    });
  return assertions;
}

function parseExclusions(bloc) {
  if (!bloc) return [];
  return bloc
    .split('\n')
    .filter((l) => l.trim().startsWith('- '))
    .map((l) => l.trim().replace(/^-\s*/, '').trim());
}

// `- (aucune)` (T18, S10, corpus module de S11) : marque explicite « zéro signature », distincte
// d'une rubrique simplement vide ou absente — celle-ci reste rejetée par lireCas ci-dessous.
const MARQUEUR_AUCUNE_SIGNATURE = /^-\s*\(aucune\)\s*$/m;

function signaturesExplicitementAucune(bloc) {
  return !!bloc && MARQUEUR_AUCUNE_SIGNATURE.test(bloc);
}

function parseSignatures(bloc) {
  if (!bloc) return [];
  return bloc
    .split('\n')
    .filter((l) => /^-\s*`/.test(l.trim()))
    .map((l) => {
      const m = l.trim().match(/^-\s*`([^`]*)`\s*(?:—\s*(.*))?$/);
      if (!m) return null;
      return { valeur: m[1], note: (m[2] || '').trim() };
    })
    .filter(Boolean);
}

/**
 * Lit et valide un cas.md unique. Lève CasIncompletError sur rubrique/assertion/signature absente.
 * `corpus` (T18, S10) : mémorisé sur le cas rendu (`cas.corpus`), pour que `export.mjs` retrouve la
 * bonne liste blanche sans paramètre séparé. La rubrique Signatures peut y valoir `- (aucune)`
 * (S11, corpus module) : zéro signature devient alors une valeur admise, pas un cas incomplet.
 */
export function lireCas(cheminCasMd, corpus = 'cas') {
  const dossier = basename(join(cheminCasMd, '..'));
  const id = dossier.split('-')[0];
  const texte = readFileSync(cheminCasMd, 'utf8');
  const lignes = texte.split('\n');

  const iPremierTitre = lignes.findIndex((l) => l.startsWith('# '));
  if (iPremierTitre < 0) throw new CasIncompletError(id, 'titre absent (ligne « # … »)');
  const titre = lignes[iPremierTitre].replace(/^#\s*/, '').trim();

  const iPremiereSection = lignes.findIndex((l) => l.startsWith('## '));
  if (iPremiereSection < 0) throw new CasIncompletError(id, 'aucune section « ## … »');

  const entete = parseEnTete(id, lignes.slice(iPremierTitre + 1, iPremiereSection));
  const sections = decouperSections(lignes.slice(iPremiereSection).join('\n'));

  for (const rubrique of RUBRIQUES_SECTION) {
    if (!(rubrique in sections)) throw new CasIncompletError(id, `rubrique de section absente : « ${rubrique} »`);
  }
  if (!sections['Énoncé'] || sections['Énoncé'].length === 0) {
    throw new CasIncompletError(id, 'énoncé vide');
  }

  const entrees = parseEntrees(sections['Entrées']);
  const resultatAttendu = parseResultatAttendu(id, sections['Résultat attendu']);
  const exclusions = parseExclusions(sections['Exclusions']);
  const signatures = parseSignatures(sections['Signatures']);

  if (resultatAttendu.length === 0) throw new CasIncompletError(id, 'zéro assertion (« Résultat attendu »)');
  if (signatures.length === 0 && !signaturesExplicitementAucune(sections['Signatures'])) {
    throw new CasIncompletError(id, 'zéro signature');
  }

  return {
    id,
    dossier,
    titre,
    modeEchec: entete["Mode d'échec"],
    role: entete['Rôle joué'],
    circuit: entete['Circuit'],
    incidentSource: entete['Incident source'],
    enonce: sections['Énoncé'],
    entrees,
    resultatAttendu,
    exclusions,
    signatures,
    corpus,
    cheminCasMd,
    cheminDossier: join(cheminCasMd, '..'),
  };
}

/**
 * Liste et lit tous les cas.md sous docs/commun/epreuves-recherche/<corpus>/E<nn>-.../, triés par id.
 * `corpus` (T18, S10, `--corpus`) : `'cas'` par défaut ; un autre dossier lit ses propres cas et sa
 * propre liste blanche (README.md de ce dossier — `lireListeBlanche`).
 */
export function lireTousLesCas(racineDepot, corpus = 'cas') {
  const racineCas = join(racineDepot, 'docs/commun/epreuves-recherche', corpus);
  if (!existsSync(racineCas)) throw new Error(`dossier de cas introuvable : ${racineCas}`);
  const dossiers = readdirSync(racineCas, { withFileTypes: true })
    .filter((d) => d.isDirectory() && /^E\d+/.test(d.name))
    .map((d) => d.name)
    .sort();
  return dossiers.map((d) => lireCas(join(racineCas, d, 'cas.md'), corpus));
}
