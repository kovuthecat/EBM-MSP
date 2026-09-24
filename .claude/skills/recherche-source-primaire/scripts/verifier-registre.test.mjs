import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import { verifierRegistre, analyserTableau, COLONNES } from './verifier-registre.mjs';

const ICI = dirname(fileURLToPath(import.meta.url));
const DOC_FORMAT = join(ICI, '..', 'references', 'registre-affirmations.md');

const ENTETE = `| ${COLONNES.join(' | ')} |`;
const SEPARATEUR = `|${COLONNES.map(() => '---').join('|')}|`;

function tableau(lignes) {
  return [ENTETE, SEPARATEUR, ...lignes].join('\n') + '\n';
}

function ligne({
  id = 'A1',
  sq = 'Sous-question ?',
  affirmation = 'Affirmation fictive.',
  etude = 'DOI 10.9999/exemple',
  localisation = 'p. 1',
  acces = 'texte intégral accessible',
  donnee = 'donnée fictive',
  calcul = 'publié',
  verif = 'vérifiée',
  contradiction = 'aucune',
  destination = 'Nœud X',
} = {}) {
  return `| ${id} | ${sq} | ${affirmation} | ${etude} | ${localisation} | ${acces} | ${donnee} | ${calcul} | ${verif} | ${contradiction} | ${destination} |`;
}

describe('registre valide accepté', () => {
  it('une ligne "vérifiée" bien formée, sans NNT, ne produit aucune erreur', () => {
    const res = verifierRegistre(tableau([ligne()]));
    expect(res.valide).toBe(true);
    expect(res.erreurs).toEqual([]);
    expect(res.lignes).toHaveLength(1);
  });

  it("l'exemple documenté dans registre-affirmations.md (§Format) est lui-même valide", () => {
    const texteDoc = readFileSync(DOC_FORMAT, 'utf8');
    const lignesDoc = texteDoc.split(/\r?\n/);
    let dernierEntete = -1;
    for (let i = 0; i < lignesDoc.length; i++) {
      if (lignesDoc[i].trim() === ENTETE) dernierEntete = i;
    }
    expect(dernierEntete).toBeGreaterThanOrEqual(0);
    const texteExemple = lignesDoc.slice(dernierEntete).join('\n');
    const res = verifierRegistre(texteExemple);
    expect(res.erreurs.map(String)).toEqual([]);
    expect(res.valide).toBe(true);
    expect(res.lignes.length).toBeGreaterThanOrEqual(4); // A1..A4 dans l'exemple documenté
  });
});

describe('"vérifiée" sans localisation refusé', () => {
  it('cite la ligne en cause', () => {
    const texte = tableau([ligne({ localisation: '-' })]);
    const res = verifierRegistre(texte);
    expect(res.valide).toBe(false);
    expect(res.erreurs.some((e) => e.ligne === 3 && /Localisation vide/.test(e.message))).toBe(true);
  });

  it('"vérifiée" avec un Accès fermé est aussi refusé', () => {
    const texte = tableau([ligne({ acces: 'paywall constaté sur cette voie' })]);
    const res = verifierRegistre(texte);
    expect(res.valide).toBe(false);
    expect(res.erreurs.some((e) => /incompatible avec Accès/.test(e.message))).toBe(true);
  });
});

describe('Vérification hors des quatre valeurs admises', () => {
  it('est refusée', () => {
    const texte = tableau([ligne({ verif: 'probable' })]);
    const res = verifierRegistre(texte);
    expect(res.valide).toBe(false);
    expect(res.erreurs.some((e) => /non admise/.test(e.message))).toBe(true);
  });
});

describe('NNT sans statut refusé — y compris hors de la colonne Calcul', () => {
  it('un NNT dans Affirmation sans Calcul qualifié est refusé (cas réel ACE, §14.2)', () => {
    const texte = tableau([
      ligne({
        affirmation: 'NNT d\'environ 33 sur le critère composite (fictif)',
        calcul: '-',
      }),
    ]);
    const res = verifierRegistre(texte);
    expect(res.valide).toBe(false);
    expect(res.erreurs.some((e) => /NNT est mentionné sans statut de calcul/.test(e.message))).toBe(true);
  });

  it('un NNT dans Donnée extraite sans Calcul qualifié est aussi refusé', () => {
    const texte = tableau([ligne({ donnee: 'NNT 33 (fictif)', calcul: 'non renseigné' })]);
    const res = verifierRegistre(texte);
    expect(res.valide).toBe(false);
    expect(res.erreurs.some((e) => /NNT est mentionné sans statut de calcul/.test(e.message))).toBe(true);
  });
});

describe('NNT recalculé incohérent refusé', () => {
  it('signale l\'écart entre le NNT recalculé et le NNT écrit', () => {
    const texte = tableau([
      ligne({
        affirmation: 'NNT recalculé sur la mortalité (fictif)',
        calcul: 'recalculé : risque bras A 0,057, risque bras B 0,083 -> NNT 33',
      }),
    ]);
    const res = verifierRegistre(texte);
    expect(res.valide).toBe(false);
    const err = res.erreurs.find((e) => /NNT recalculé incohérent/.test(e.message));
    expect(err).toBeTruthy();
    expect(err.message).toContain('attendu 39');
    expect(err.message).toContain('écrit 33');
  });

  it('accepte un NNT recalculé cohérent (exemple A2 de la doc : 39)', () => {
    const texte = tableau([
      ligne({
        affirmation: 'NNT recalculé sur la mortalité (fictif)',
        calcul: 'recalculé : risque bras A 0,057, risque bras B 0,083 -> NNT 39',
      }),
    ]);
    const res = verifierRegistre(texte);
    expect(res.valide).toBe(true);
  });
});

describe('"non calculable : <motif>" accepté', () => {
  it('un NNT mentionné avec un motif de non-calculabilité ne produit pas d\'erreur', () => {
    const texte = tableau([
      ligne({
        affirmation: 'Aucun NNT calculable pour ce critère (fictif)',
        calcul: 'non calculable : seul le RR est rapporté, pas de risque absolu',
      }),
    ]);
    const res = verifierRegistre(texte);
    expect(res.valide).toBe(true);
  });

  it('"non calculable :" sans motif est refusé', () => {
    const texte = tableau([ligne({ affirmation: 'NNT non fourni (fictif)', calcul: 'non calculable :' })]);
    const res = verifierRegistre(texte);
    expect(res.valide).toBe(false);
  });
});

describe('en-tête modifié refusé', () => {
  it('une colonne renommée est détectée et citée', () => {
    const enteteModifie = ENTETE.replace('Étude', 'Source');
    const texte = [enteteModifie, SEPARATEUR, ligne()].join('\n');
    const res = analyserTableau(texte);
    expect(res.erreurs.some((e) => /en-tête modifié/.test(e.message))).toBe(true);
    expect(res.erreurs[0].message).toContain('Source');
  });

  it('une colonne manquante est détectée', () => {
    const enteteTronque = `| ${COLONNES.slice(0, -1).join(' | ')} |`;
    const res = analyserTableau([enteteTronque, SEPARATEUR].join('\n'));
    expect(res.erreurs.some((e) => /en-tête modifié/.test(e.message))).toBe(true);
  });
});

describe('nombre de colonnes inattendu dans une ligne de données', () => {
  it('est signalé avec le numéro de ligne', () => {
    const texte = [ENTETE, SEPARATEUR, '| A1 | trop peu de colonnes |'].join('\n');
    const res = analyserTableau(texte);
    expect(res.erreurs.some((e) => e.ligne === 3 && /nombre de colonnes inattendu/.test(e.message))).toBe(true);
  });
});

describe('aucun tableau trouvé', () => {
  it("un fichier sans ligne '|' est signalé", () => {
    const res = analyserTableau('juste de la prose, aucun tableau ici.');
    expect(res.erreurs.some((e) => /aucun tableau Markdown trouvé/.test(e.message))).toBe(true);
  });
});
