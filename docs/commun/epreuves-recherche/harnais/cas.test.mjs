import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { lireListeBlanche, lireTousLesCas, lireCas, CasIncompletError } from './cas.mjs';

const RACINE = join(import.meta.dirname, '..', '..', '..', '..');

describe('lireListeBlanche', () => {
  it('lit la liste blanche du README (chemins non vides)', () => {
    const liste = lireListeBlanche(RACINE);
    expect(liste.length).toBeGreaterThan(5);
    expect(liste).toContain('CLAUDE.md');
    expect(liste).toContain('docs/decision/sources/');
    for (const p of liste) expect(p.length).toBeGreaterThan(0);
  });
});

describe('lireTousLesCas — corpus réel', () => {
  const cas = lireTousLesCas(RACINE);

  it('parse les douze cas E01 à E12', () => {
    expect(cas.length).toBe(12);
    expect(cas.map((c) => c.id)).toEqual([
      'E01', 'E02', 'E03', 'E04', 'E05', 'E06', 'E07', 'E08', 'E09', 'E10', 'E11', 'E12',
    ]);
  });

  it('chaque cas a au moins une assertion et une signature', () => {
    for (const c of cas) {
      expect(c.resultatAttendu.length).toBeGreaterThan(0);
      expect(c.signatures.length).toBeGreaterThan(0);
    }
  });

  it('chaque cas porte les quatre rubriques d\'en-tête', () => {
    for (const c of cas) {
      expect(c.modeEchec).toBeTruthy();
      expect(c.role).toBeTruthy();
      expect(c.circuit).toBeTruthy();
      expect(c.incidentSource).toBeTruthy();
    }
  });

  it('E01 : trois assertions, cinq signatures PMC, aucune fondée-sur manquante', () => {
    const e01 = cas.find((c) => c.id === 'E01');
    expect(e01.resultatAttendu.length).toBe(4);
    expect(e01.resultatAttendu.every((a) => a.fondeeSur)).toBe(true);
    expect(e01.signatures.length).toBe(5);
    expect(e01.signatures.map((s) => s.valeur)).toContain('PMC11060609');
  });

  it('E06 : signature « .052 » retirée (arbitrage référent), deux signatures restantes', () => {
    const e06 = cas.find((c) => c.id === 'E06');
    expect(e06.signatures.map((s) => s.valeur)).not.toContain('.052');
    expect(e06.signatures.length).toBe(2);
  });

  it('E12 (FICTIF) parse comme les autres, rôle orchestrateur-decision', () => {
    const e12 = cas.find((c) => c.id === 'E12');
    expect(e12.role).toBe('orchestrateur-decision');
    expect(e12.entrees.length).toBe(1);
  });

  it('chaque cas déclare au moins une exclusion', () => {
    for (const c of cas) expect(c.exclusions.length).toBeGreaterThan(0);
  });

  it('chaque cas porte corpus « cas » (défaut, --corpus non passé)', () => {
    for (const c of cas) expect(c.corpus).toBe('cas');
  });
});

describe('--corpus (T18, S10) : un dossier de corpus distinct a sa propre liste blanche et ses cas', () => {
  let racineFx;

  beforeAll(() => {
    racineFx = mkdtempSync(join(tmpdir(), 'epreuve-corpus-fixture-'));
    const base = join(racineFx, 'docs/commun/epreuves-recherche');
    mkdirSync(join(base, 'mon-corpus', 'E01-cas-module', 'entrees'), { recursive: true });
    writeFileSync(
      join(base, 'mon-corpus', 'README.md'),
      ['# corpus de test', '```liste-blanche', 'CLAUDE.md', '```', ''].join('\n'),
    );
    writeFileSync(
      join(base, 'mon-corpus', 'E01-cas-module', 'cas.md'),
      [
        '# E01 — cas de corpus module',
        "- Mode d'échec : test",
        '- Rôle joué : A',
        '- Circuit : recherche-source-primaire',
        '- Incident source : test.md:1-2',
        '## Énoncé',
        'texte',
        '## Entrées',
        '- entrees/x — y',
        '## Résultat attendu',
        '- R1 : ok — fondée sur test.md:1',
        '## Exclusions',
        '- test.md',
        '## Signatures',
        '- (aucune)',
      ].join('\n'),
    );
  });

  afterAll(() => rmSync(racineFx, { recursive: true, force: true }));

  it('lireListeBlanche lit le README du dossier de corpus, pas le README partagé', () => {
    expect(lireListeBlanche(racineFx, 'mon-corpus')).toEqual(['CLAUDE.md']);
  });

  it('lireTousLesCas lit les cas sous le dossier de corpus indiqué, avec cas.corpus posé', () => {
    const cas = lireTousLesCas(racineFx, 'mon-corpus');
    expect(cas.length).toBe(1);
    expect(cas[0].id).toBe('E01');
    expect(cas[0].corpus).toBe('mon-corpus');
  });

  it('« - (aucune) » en Signatures : zéro signature admise, pas de CasIncompletError', () => {
    const cas = lireTousLesCas(racineFx, 'mon-corpus');
    expect(cas[0].signatures).toEqual([]);
  });
});

describe('lireCas — rejet bruyant d\'un cas incomplet', () => {
  function ecrireCasTemporaire(contenu) {
    const dir = mkdtempSync(join(tmpdir(), 'epreuve-cas-'));
    const chemin = join(dir, 'cas.md');
    writeFileSync(chemin, contenu, 'utf8');
    return { dir, chemin };
  }

  const ENTETE_COMPLET = [
    '# E99 — cas de test',
    "- Mode d'échec : test",
    '- Rôle joué : A',
    '- Circuit : recherche-source-primaire',
    '- Incident source : test.md:1-2',
  ].join('\n');

  it('lève CasIncompletError quand une rubrique d\'en-tête manque', () => {
    const contenu = [
      '# E99 — cas de test',
      "- Mode d'échec : test",
      '- Rôle joué : A',
      // Circuit manquant
      '- Incident source : test.md:1-2',
      '## Énoncé',
      'texte',
      '## Entrées',
      '- entrees/x — y',
      '## Résultat attendu',
      '- R1 : ok — fondée sur test.md:1',
      '## Exclusions',
      '- test.md',
      '## Signatures',
      '- `sig1` — note',
    ].join('\n');
    const { chemin, dir } = ecrireCasTemporaire(contenu);
    try {
      expect(() => lireCas(chemin)).toThrow(CasIncompletError);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it('lève CasIncompletError quand une rubrique de section manque', () => {
    const contenu = [
      ENTETE_COMPLET,
      '## Énoncé',
      'texte',
      '## Entrées',
      '- entrees/x — y',
      '## Résultat attendu',
      '- R1 : ok — fondée sur test.md:1',
      '## Signatures',
      '- `sig1` — note',
      // Exclusions manquant
    ].join('\n');
    const { chemin, dir } = ecrireCasTemporaire(contenu);
    try {
      expect(() => lireCas(chemin)).toThrow(CasIncompletError);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it('lève CasIncompletError quand il y a zéro assertion', () => {
    const contenu = [
      ENTETE_COMPLET,
      '## Énoncé',
      'texte',
      '## Entrées',
      '- entrees/x — y',
      '## Résultat attendu',
      '## Exclusions',
      '- test.md',
      '## Signatures',
      '- `sig1` — note',
    ].join('\n');
    const { chemin, dir } = ecrireCasTemporaire(contenu);
    try {
      expect(() => lireCas(chemin)).toThrow(/zéro assertion/);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it('lève CasIncompletError quand il y a zéro signature', () => {
    const contenu = [
      ENTETE_COMPLET,
      '## Énoncé',
      'texte',
      '## Entrées',
      '- entrees/x — y',
      '## Résultat attendu',
      '- R1 : ok — fondée sur test.md:1',
      '## Exclusions',
      '- test.md',
      '## Signatures',
    ].join('\n');
    const { chemin, dir } = ecrireCasTemporaire(contenu);
    try {
      expect(() => lireCas(chemin)).toThrow(/zéro signature/);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it("accepte « - (aucune) » en Signatures sans lever d'erreur (S11, corpus module)", () => {
    const contenu = [
      ENTETE_COMPLET,
      '## Énoncé',
      'texte',
      '## Entrées',
      '- entrees/x — y',
      '## Résultat attendu',
      '- R1 : ok — fondée sur test.md:1',
      '## Exclusions',
      '- test.md',
      '## Signatures',
      '- (aucune)',
    ].join('\n');
    const { chemin, dir } = ecrireCasTemporaire(contenu);
    try {
      const c = lireCas(chemin);
      expect(c.signatures).toEqual([]);
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });

  it('accepte un cas complet minimal', () => {
    const contenu = [
      ENTETE_COMPLET,
      '## Énoncé',
      'texte',
      '## Entrées',
      '- entrees/x — y',
      '## Résultat attendu',
      '- R1 : ok — fondée sur test.md:1',
      '## Exclusions',
      '- test.md',
      '## Signatures',
      '- `sig1` — note',
    ].join('\n');
    const { chemin, dir } = ecrireCasTemporaire(contenu);
    try {
      const c = lireCas(chemin);
      expect(c.resultatAttendu.length).toBe(1);
      expect(c.signatures[0].valeur).toBe('sig1');
    } finally {
      rmSync(dir, { recursive: true, force: true });
    }
  });
});
