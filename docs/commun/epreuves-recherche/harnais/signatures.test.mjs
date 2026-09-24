// signatures.test.mjs — rejoue en continu, sous N0, le contrôle d'admissibilité du README
// (docs/commun/epreuves-recherche/README.md § Contrôle d'admissibilité) : aucune signature d'aucun
// cas ne doit figurer dans un fichier texte de la liste blanche de l'ARBRE DE TRAVAIL courant (pas
// seulement au commit de référence T5/T6). Ce test reste vert jusqu'à la fin du plan P16 (T5, étape
// 7) : il empêche S6 à S11 d'écrire, par inadvertance, une réponse du corpus dans une skill ou un
// agent — ce qui rendrait la mesure finale de S10/S12 non aveugle.
//
// Portée identique au script bash du README : les fichiers texte suivis par git dans la liste
// blanche ; les PDF de docs/decision/sources/ en sont exclus (la recherche doit y trouver la
// réponse, ce n'est pas une fuite si un PDF source contient la valeur qu'il faut trouver).

import { describe, it, expect } from 'vitest';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { lireListeBlanche, lireTousLesCas } from './cas.mjs';

const RACINE = join(import.meta.dirname, '..', '..', '..', '..');

function fichiersSuivisArbreDeTravail(chemin) {
  const c = chemin.endsWith('/') ? chemin.slice(0, -1) : chemin;
  const sortie = execFileSync('git', ['ls-files', '--', c], { cwd: RACINE, encoding: 'utf8' });
  return sortie
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)
    .filter((f) => !f.toLowerCase().endsWith('.pdf'));
}

describe("signatures — aucune fuite dans la liste blanche de l'arbre de travail", () => {
  const listeBlanche = lireListeBlanche(RACINE);
  const cas = lireTousLesCas(RACINE);
  const fichiers = [...new Set(listeBlanche.flatMap((c) => fichiersSuivisArbreDeTravail(c)))];

  it('la liste blanche du README résout au moins un fichier texte suivi par git', () => {
    expect(fichiers.length).toBeGreaterThan(0);
  });

  for (const c of cas) {
    it(`${c.id} : aucune de ses signatures ne figure dans la liste blanche`, () => {
      const trouvailles = [];
      for (const fichier of fichiers) {
        const contenu = readFileSync(join(RACINE, fichier), 'utf8');
        for (const sig of c.signatures) {
          if (sig.valeur && contenu.includes(sig.valeur)) {
            trouvailles.push(`« ${sig.valeur} » dans ${fichier}`);
          }
        }
      }
      expect(trouvailles, trouvailles.join(' ; ')).toEqual([]);
    });
  }
});
