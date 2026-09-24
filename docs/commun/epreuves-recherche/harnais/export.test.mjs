import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, existsSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import {
  construireExport,
  construireReglages,
  scriptsRecherchePrimaireExistent,
  gitFichiersSuivis,
  neutraliserTexte,
  verifierContamination,
  ExportContamineError,
} from './export.mjs';

// Petit dépôt git jetable, indépendant du dépôt réel : liste blanche minimale (un fichier, un
// dossier), pour tester construireExport sans reproduire tout le corpus réel (PDF compris).
let fx;
let commit;
let dossiersACReclamer = [];

beforeAll(() => {
  fx = mkdtempSync(join(tmpdir(), 'epreuve-fixture-'));
  writeFileSync(join(fx, 'CLAUDE.md'), 'contenu CLAUDE de test');
  mkdirSync(join(fx, 'dossier-b'), { recursive: true });
  writeFileSync(
    join(fx, 'dossier-b', 'fichier.md'),
    'voir Interface-OE/out/cli/index.js pour le CLI OE, chemin Windows Interface-OE\\out\\cli\\index.js aussi.',
  );
  mkdirSync(join(fx, 'docs/commun/epreuves-recherche'), { recursive: true });
  writeFileSync(
    join(fx, 'docs/commun/epreuves-recherche/README.md'),
    ['# fixture', '```liste-blanche', 'CLAUDE.md', 'dossier-b/', '```', ''].join('\n'),
  );
  execFileSync('git', ['init', '-q'], { cwd: fx });
  execFileSync('git', ['config', 'user.email', 'test@example.com'], { cwd: fx });
  execFileSync('git', ['config', 'user.name', 'test'], { cwd: fx });
  execFileSync('git', ['add', '-A'], { cwd: fx });
  execFileSync('git', ['commit', '-q', '-m', 'init'], { cwd: fx });
  commit = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: fx, encoding: 'utf8' }).trim();
});

afterAll(() => {
  for (const d of dossiersACReclamer) rmSync(d, { recursive: true, force: true });
  rmSync(fx, { recursive: true, force: true });
});

function casFictif(overrides = {}) {
  const dossierCas = mkdtempSync(join(tmpdir(), 'epreuve-fixture-cas-'));
  dossiersACReclamer.push(dossierCas);
  return {
    id: 'EFX',
    cheminDossier: dossierCas,
    exclusions: [],
    signatures: [{ valeur: 'AUCUNE-SIGNATURE-XYZ-JAMAIS-PRESENTE', note: 'témoin' }],
    ...overrides,
  };
}

describe('gitFichiersSuivis', () => {
  it('rend les fichiers suivis sous un chemin, vide si le chemin est absent au commit', () => {
    expect(gitFichiersSuivis(fx, commit, 'CLAUDE.md')).toEqual(['CLAUDE.md']);
    expect(gitFichiersSuivis(fx, commit, 'dossier-b')).toEqual(['dossier-b/fichier.md']);
    expect(gitFichiersSuivis(fx, commit, 'inexistant.md')).toEqual([]);
  });
});

describe('neutraliserTexte (fonction pure)', () => {
  it('remplace le chemin du CLI OE, slash et antislash, par le chemin neutralisé', () => {
    const avant = 'a: Interface-OE/out/cli/index.js, b: Interface-OE\\out\\cli\\index.js';
    const apres = neutraliserTexte(avant);
    expect(apres).not.toMatch(/Interface-OE/);
    expect(apres.match(/CHEMIN-OE-NEUTRALISE\/index\.js/g)?.length).toBe(2);
  });

  it('laisse un texte sans mention OE inchangé', () => {
    expect(neutraliserTexte('rien à voir ici')).toBe('rien à voir ici');
  });
});

describe('construireReglages (rendu en --allowedTools/--disallowedTools, pas en settings.json)', () => {
  it('ajoute le motif Bash scripts seulement si les scripts existent au commit', () => {
    expect(construireReglages({ scriptsRecherchePrimaireExistent: false }).allow).not.toContainEqual(
      expect.stringContaining('Bash'),
    );
    expect(construireReglages({ scriptsRecherchePrimaireExistent: true }).allow).toContainEqual(
      expect.stringContaining('Bash(node .claude/skills/recherche-source-primaire/scripts/*)'),
    );
  });

  it("refuse la lecture du dépôt, d'Interface-OE, PowerShell, Bash nu, et github.com", () => {
    const deny = construireReglages({ scriptsRecherchePrimaireExistent: false }).deny;
    expect(deny).toContain('Read(//c/Users/Kovu/Projets/ebm-msp/**)');
    expect(deny).toContain('Read(//c/Users/Kovu/Projets/Interface-OE/**)');
    expect(deny).toContain('PowerShell');
    expect(deny).toContain('Bash');
    expect(deny).toContain('WebFetch(domain:github.com)');
    expect(deny).toContain('WebFetch(domain:raw.githubusercontent.com)');
  });
});

describe('construireExport — sous-ensemble jetable', () => {
  it('copie la liste blanche complète (fichier + dossier)', () => {
    const cas = casFictif();
    const { chemin, fichiers } = construireExport({ racineDepot: fx, commit, cas, dossierParent: tmpdir() });
    dossiersACReclamer.push(chemin);
    expect(fichiers.sort()).toEqual(['CLAUDE.md', 'dossier-b/fichier.md']);
    expect(existsSync(join(chemin, 'CLAUDE.md'))).toBe(true);
    expect(existsSync(join(chemin, 'epreuve', 'sortie'))).toBe(true);
    expect(existsSync(join(chemin, 'epreuve', 'entrees'))).toBe(true);
  });

  it('retire un fichier exclu par le cas, même s\'il recoupe la liste blanche', () => {
    const cas = casFictif({ exclusions: ['CLAUDE.md'] });
    const { chemin, fichiers, exclusionsRetirees } = construireExport({
      racineDepot: fx,
      commit,
      cas,
      dossierParent: tmpdir(),
    });
    dossiersACReclamer.push(chemin);
    expect(fichiers).not.toContain('CLAUDE.md');
    expect(exclusionsRetirees).toContain('CLAUDE.md');
    expect(existsSync(join(chemin, 'CLAUDE.md'))).toBe(false);
  });

  it('neutralise le chemin OE dans les fichiers copiés', () => {
    const cas = casFictif();
    const { chemin } = construireExport({ racineDepot: fx, commit, cas, dossierParent: tmpdir() });
    dossiersACReclamer.push(chemin);
    const contenu = readFileSync(join(chemin, 'dossier-b', 'fichier.md'), 'utf8');
    expect(contenu).not.toMatch(/Interface-OE/);
    expect(contenu).toMatch(/CHEMIN-OE-NEUTRALISE\/index\.js/);
  });

  it('refuse (ExportContamineError) et supprime l\'export si une signature figure dans la liste blanche', () => {
    const cas = casFictif({ signatures: [{ valeur: 'contenu CLAUDE', note: 'présente dans CLAUDE.md' }] });
    let chemin;
    try {
      construireExport({ racineDepot: fx, commit, cas, dossierParent: tmpdir() });
      throw new Error('aurait dû lever ExportContamineError');
    } catch (e) {
      expect(e).toBeInstanceOf(ExportContamineError);
      expect(e.trouvailles[0].signature).toBe('contenu CLAUDE');
      chemin = null;
    }
  });

  it('copie les pièces du cas dans epreuve/entrees/', () => {
    const cas = casFictif();
    mkdirSync(join(cas.cheminDossier, 'entrees'), { recursive: true });
    writeFileSync(join(cas.cheminDossier, 'entrees', 'piece.md'), 'contenu de la pièce');
    const { chemin } = construireExport({ racineDepot: fx, commit, cas, dossierParent: tmpdir() });
    dossiersACReclamer.push(chemin);
    expect(readFileSync(join(chemin, 'epreuve', 'entrees', 'piece.md'), 'utf8')).toBe('contenu de la pièce');
  });
});

describe('scriptsRecherchePrimaireExistent', () => {
  it('rend false quand un export n\'a pas de scripts/ pour recherche-source-primaire', () => {
    const cas = casFictif();
    const { chemin } = construireExport({ racineDepot: fx, commit, cas, dossierParent: tmpdir() });
    dossiersACReclamer.push(chemin);
    expect(scriptsRecherchePrimaireExistent(chemin)).toBe(false);
  });
});

describe('verifierContamination', () => {
  it('rend une liste vide quand aucune signature ne figure dans les fichiers', () => {
    const t = verifierContamination(fx, ['CLAUDE.md'], [{ valeur: 'INTROUVABLE', note: '' }]);
    expect(t).toEqual([]);
  });

  it('rend la trouvaille (fichier, signature) quand une signature figure dans un fichier', () => {
    const t = verifierContamination(fx, ['CLAUDE.md'], [{ valeur: 'contenu CLAUDE', note: '' }]);
    expect(t).toEqual([{ fichier: 'CLAUDE.md', signature: 'contenu CLAUDE' }]);
  });
});
