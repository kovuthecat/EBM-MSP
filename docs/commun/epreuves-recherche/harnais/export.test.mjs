import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, writeFileSync, existsSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import {
  construireExport,
  construireReglages,
  scriptsRecherchePrimaireExistent,
  gitFichiersSuivis,
  neutraliserTexte,
  verifierContamination,
  ExportContamineError,
  retirerAgentsDedies,
  transformerTexteLancements,
  transformerLancementsEnAgentsGeneriques,
  ConfigurationDeuxIncohereenteError,
  AGENTS_DEDIES,
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
  it("n'ajoute jamais de motif Bash à allow, même si les scripts existent au commit (correctif localisé T18 : un motif Bash(…) dans --allowedTools ne restreint rien tant que « Bash » ne figure pas dans --disallowedTools — sondé le 2026-09-24, T18/S10)", () => {
    expect(construireReglages({ scriptsRecherchePrimaireExistent: false }).allow).not.toContainEqual(
      expect.stringContaining('Bash'),
    );
    expect(construireReglages({ scriptsRecherchePrimaireExistent: true }).allow).not.toContainEqual(
      expect.stringContaining('Bash'),
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

describe('transformerTexteLancements (fonction pure)', () => {
  const BLOC = [
    '<!-- lancement:extracteur-preuve -->',
    '**Lancer** `extracteur-preuve` (outil Agent, `subagent_type: "extracteur-preuve"`).',
    '- Rôle : Agent A.',
    '- Livrable : `x.md`.',
    '<!-- /lancement -->',
  ].join('\n');

  it('remplace seulement la ligne **Lancer**, garde le reste du bloc', () => {
    const { texte, trouves, transformes } = transformerTexteLancements(BLOC);
    expect(trouves).toBe(1);
    expect(transformes).toBe(1);
    expect(texte).toContain('**Lancer** un agent `general-purpose` (outil Agent)');
    expect(texte).not.toContain('subagent_type: "extracteur-preuve"');
    expect(texte).toContain('- Rôle : Agent A.');
    expect(texte).toContain('- Livrable : `x.md`.');
    expect(texte).toContain('<!-- lancement:extracteur-preuve -->');
    expect(texte).toContain('<!-- /lancement -->');
  });

  it('compte plusieurs blocs indépendamment', () => {
    const deux = `${BLOC}\n\ntexte entre les deux\n\n${BLOC.replace('extracteur-preuve', 'contradicteur-preuve')}`;
    const { trouves, transformes } = transformerTexteLancements(deux);
    expect(trouves).toBe(2);
    expect(transformes).toBe(2);
  });

  it('un texte sans bloc lancement rend trouves=0, transformes=0, texte inchangé', () => {
    const { texte, trouves, transformes } = transformerTexteLancements('rien à voir ici');
    expect(texte).toBe('rien à voir ici');
    expect(trouves).toBe(0);
    expect(transformes).toBe(0);
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

// Second dépôt jetable, dédié aux configurations 2/3 et à --corpus (T18, S10) : porte les trois
// agents dédiés et un fichier de skill avec deux blocs lancement, plus un second dossier de corpus
// avec son propre README/liste-blanche (--corpus). Séparé de `fx` pour ne pas changer la liste de
// fichiers exacte que les tests existants attendent.
describe('configurations 2 et 3, --corpus (T18, S10)', () => {
  let fx2;
  let commit2;
  const dossiersACReclamer2 = [];

  const BLOC_A = [
    '<!-- lancement:extracteur-preuve -->',
    '**Lancer** `extracteur-preuve` (outil Agent, `subagent_type: "extracteur-preuve"`).',
    '- Rôle : Agent A.',
    '<!-- /lancement -->',
  ].join('\n');
  const BLOC_B = [
    '<!-- lancement:contradicteur-preuve -->',
    '**Lancer** `contradicteur-preuve` (outil Agent, `subagent_type: "contradicteur-preuve"`).',
    '- Rôle : Agent B.',
    '<!-- /lancement -->',
  ].join('\n');

  beforeAll(() => {
    fx2 = mkdtempSync(join(tmpdir(), 'epreuve-fixture2-'));
    writeFileSync(join(fx2, 'CLAUDE.md'), 'contenu CLAUDE de test 2');
    for (const relatif of AGENTS_DEDIES) {
      mkdirSync(join(fx2, dirname(relatif)), { recursive: true });
      writeFileSync(join(fx2, relatif), `agent dédié fictif : ${relatif}`);
    }
    mkdirSync(join(fx2, '.claude/skills/circuit-fictif'), { recursive: true });
    writeFileSync(join(fx2, '.claude/skills/circuit-fictif/SKILL.md'), `${BLOC_A}\n\n${BLOC_B}\n`);

    mkdirSync(join(fx2, 'docs/commun/epreuves-recherche'), { recursive: true });
    writeFileSync(
      join(fx2, 'docs/commun/epreuves-recherche/README.md'),
      [
        '# fixture 2',
        '```liste-blanche',
        'CLAUDE.md',
        '.claude/agents/extracteur-preuve.md',
        '.claude/agents/contradicteur-preuve.md',
        '.claude/agents/reconciliateur-preuve.md',
        '.claude/skills/circuit-fictif/',
        '```',
        '',
      ].join('\n'),
    );
    mkdirSync(join(fx2, 'docs/commun/epreuves-recherche/module-x'), { recursive: true });
    writeFileSync(
      join(fx2, 'docs/commun/epreuves-recherche/module-x/README.md'),
      ['# module-x', '```liste-blanche', 'CLAUDE.md', '```', ''].join('\n'),
    );

    execFileSync('git', ['init', '-q'], { cwd: fx2 });
    execFileSync('git', ['config', 'user.email', 'test@example.com'], { cwd: fx2 });
    execFileSync('git', ['config', 'user.name', 'test'], { cwd: fx2 });
    execFileSync('git', ['add', '-A'], { cwd: fx2 });
    execFileSync('git', ['commit', '-q', '-m', 'init'], { cwd: fx2 });
    commit2 = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: fx2, encoding: 'utf8' }).trim();
  });

  afterAll(() => {
    for (const d of dossiersACReclamer2) rmSync(d, { recursive: true, force: true });
    rmSync(fx2, { recursive: true, force: true });
  });

  function casFictif2(overrides = {}) {
    const dossierCas = mkdtempSync(join(tmpdir(), 'epreuve-fixture2-cas-'));
    dossiersACReclamer2.push(dossierCas);
    return {
      id: 'EFX2', cheminDossier: dossierCas, exclusions: [], signatures: [], ...overrides,
    };
  }

  describe('retirerAgentsDedies', () => {
    it('retire les trois fichiers agents dédiés présents, rend leurs chemins relatifs', () => {
      const cas = casFictif2();
      const { chemin } = construireExport({
        racineDepot: fx2, commit: commit2, cas, dossierParent: tmpdir(),
      });
      dossiersACReclamer2.push(chemin);
      // construireExport (config non 2) ne retire rien : les trois fichiers doivent encore exister.
      for (const relatif of AGENTS_DEDIES) expect(existsSync(join(chemin, relatif))).toBe(true);
      const retires = retirerAgentsDedies(chemin);
      expect(retires.sort()).toEqual([...AGENTS_DEDIES].sort());
      for (const relatif of AGENTS_DEDIES) expect(existsSync(join(chemin, relatif))).toBe(false);
    });
  });

  describe('construireExport — configuration 3 (et absente) : tel quel', () => {
    it('sans config, garde les agents dédiés et les blocs lancement intacts', () => {
      const cas = casFictif2();
      const { chemin, config } = construireExport({
        racineDepot: fx2, commit: commit2, cas, dossierParent: tmpdir(),
      });
      dossiersACReclamer2.push(chemin);
      expect(config).toBeNull();
      for (const relatif of AGENTS_DEDIES) expect(existsSync(join(chemin, relatif))).toBe(true);
      const skill = readFileSync(join(chemin, '.claude/skills/circuit-fictif/SKILL.md'), 'utf8');
      expect(skill).toContain('subagent_type: "extracteur-preuve"');
      expect(skill).toContain('subagent_type: "contradicteur-preuve"');
    });

    it('config: 3 se comporte comme sans config : tel quel', () => {
      const cas = casFictif2();
      const { chemin, config, agentsRetires, blocsLancement } = construireExport({
        racineDepot: fx2, commit: commit2, cas, dossierParent: tmpdir(), config: 3,
      });
      dossiersACReclamer2.push(chemin);
      expect(config).toBe(3);
      expect(agentsRetires).toEqual([]);
      expect(blocsLancement).toBeNull();
      for (const relatif of AGENTS_DEDIES) expect(existsSync(join(chemin, relatif))).toBe(true);
    });
  });

  describe('construireExport — configuration 2 : agents retirés, blocs réécrits', () => {
    it('retire les trois agents dédiés et réécrit les deux blocs lancement en general-purpose', () => {
      const cas = casFictif2();
      const {
        chemin, config, agentsRetires, blocsLancement, fichiers,
      } = construireExport({
        racineDepot: fx2, commit: commit2, cas, dossierParent: tmpdir(), config: 2,
      });
      dossiersACReclamer2.push(chemin);
      expect(config).toBe(2);
      expect(agentsRetires.sort()).toEqual([...AGENTS_DEDIES].sort());
      for (const relatif of AGENTS_DEDIES) {
        expect(existsSync(join(chemin, relatif))).toBe(false);
        expect(fichiers).not.toContain(relatif);
      }
      expect(blocsLancement).toEqual({ trouves: 2, transformes: 2 });
      const skill = readFileSync(join(chemin, '.claude/skills/circuit-fictif/SKILL.md'), 'utf8');
      expect(skill).not.toContain('subagent_type: "extracteur-preuve"');
      expect(skill).not.toContain('subagent_type: "contradicteur-preuve"');
      expect(skill.match(/\*\*Lancer\*\* un agent `general-purpose`/g)?.length).toBe(2);
      expect(skill).toContain('<!-- lancement:extracteur-preuve -->');
      expect(skill).toContain('<!-- lancement:contradicteur-preuve -->');
      expect(skill).toContain('- Rôle : Agent A.');
      expect(skill).toContain('- Rôle : Agent B.');
    });

    it('lève ConfigurationDeuxIncohereenteError et supprime l\'export si aucun bloc lancement trouvé', () => {
      const cas = casFictif2({
        exclusions: ['.claude/skills/circuit-fictif'],
      });
      let chemin;
      try {
        construireExport({
          racineDepot: fx2, commit: commit2, cas, dossierParent: tmpdir(), config: 2,
        });
        throw new Error('aurait dû lever ConfigurationDeuxIncohereenteError');
      } catch (e) {
        expect(e).toBeInstanceOf(ConfigurationDeuxIncohereenteError);
        expect(e.trouves).toBe(0);
        chemin = null;
      }
      expect(chemin).toBeNull();
    });
  });

  describe('transformerLancementsEnAgentsGeneriques (sur disque)', () => {
    it('rend les compteurs cumulés sur plusieurs fichiers de l\'export', () => {
      const cas = casFictif2();
      const { chemin } = construireExport({
        racineDepot: fx2, commit: commit2, cas, dossierParent: tmpdir(),
      });
      dossiersACReclamer2.push(chemin);
      const { blocsTrouves, blocsTransformes } = transformerLancementsEnAgentsGeneriques(chemin);
      expect(blocsTrouves).toBe(2);
      expect(blocsTransformes).toBe(2);
    });
  });

  describe('construireExport — cas.corpus sélectionne la liste blanche', () => {
    it('cas.corpus="module-x" copie seulement la liste blanche de module-x/README.md', () => {
      const cas = casFictif2({ corpus: 'module-x' });
      const { chemin, fichiers } = construireExport({
        racineDepot: fx2, commit: commit2, cas, dossierParent: tmpdir(),
      });
      dossiersACReclamer2.push(chemin);
      expect(fichiers).toEqual(['CLAUDE.md']);
      expect(existsSync(join(chemin, '.claude/agents/extracteur-preuve.md'))).toBe(false);
    });
  });
});
