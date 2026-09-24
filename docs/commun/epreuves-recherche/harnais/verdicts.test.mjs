import { describe, it, expect } from 'vitest';
import { etatCas, verdictsConfiguration, regressions } from './verdicts.mjs';

const OK = { reussie: true, invalidee: false };
const KO = { reussie: false, invalidee: false };
const INVALIDE = { reussie: false, invalidee: true };

describe('etatCas — table de vérité', () => {
  it('2/2 réussi', () => {
    expect(etatCas([OK, OK]).statut).toBe('reussi');
  });

  it('0/2 échoué', () => {
    expect(etatCas([KO, KO]).statut).toBe('echoue');
  });

  it('1/2 → attente-3e', () => {
    const e = etatCas([OK, KO]);
    expect(e.statut).toBe('attente-3e');
    expect(e.executionsSupplementairesRequises).toBe(1);
  });

  it('2/3 (après un 1/2) → réussi', () => {
    expect(etatCas([OK, KO, OK]).statut).toBe('reussi');
  });

  it('1/3 (après un 1/2) → échoué', () => {
    expect(etatCas([OK, KO, KO]).statut).toBe('echoue');
  });

  it('une exécution invalidée ne compte ni pour ni contre : 2/2 valides malgré une 3e invalidée', () => {
    const e = etatCas([OK, OK, INVALIDE]);
    expect(e.statut).toBe('reussi');
    expect(e.nInvalidees).toBe(1);
  });

  it('moins de deux exécutions valides → incomplet', () => {
    expect(etatCas([OK]).statut).toBe('incomplet');
    expect(etatCas([]).statut).toBe('incomplet');
    expect(etatCas([INVALIDE, OK]).statut).toBe('incomplet');
  });

  it('toutes invalidées → incomplet, deux de plus requises', () => {
    const e = etatCas([INVALIDE, INVALIDE]);
    expect(e.statut).toBe('incomplet');
    expect(e.executionsSupplementairesRequises).toBe(2);
  });
});

describe('verdictsConfiguration', () => {
  it('compte réussis/échoués/en-attente et signale un corpus discriminant à 3 échecs', () => {
    const executionsParCas = {
      E01: [OK, OK],
      E02: [KO, KO],
      E03: [KO, KO],
      E04: [KO, KO],
      E05: [OK, KO, OK],
    };
    const v = verdictsConfiguration(executionsParCas);
    expect(v.reussis).toBe(2);
    expect(v.echoues).toBe(3);
    expect(v.total).toBe(5);
    expect(v.corpusDiscriminant).toBe(true);
  });

  it('corpus plat (moins de 3 échecs) : corpusDiscriminant à false', () => {
    const executionsParCas = { E01: [OK, OK], E02: [KO, KO], E03: [OK, OK] };
    expect(verdictsConfiguration(executionsParCas).corpusDiscriminant).toBe(false);
  });
});

describe('regressions', () => {
  it('détecte un cas réussi en config 1 puis échoué en config 3', () => {
    const config1 = verdictsConfiguration({ E01: [OK, OK], E02: [KO, KO] }).parCas;
    const config3 = verdictsConfiguration({ E01: [KO, KO], E02: [KO, KO] }).parCas;
    expect(regressions(config1, config3)).toEqual(['E01']);
  });

  it('aucune régression quand config 3 reste au moins aussi bonne', () => {
    const config1 = verdictsConfiguration({ E01: [OK, OK], E02: [KO, KO] }).parCas;
    const config3 = verdictsConfiguration({ E01: [OK, OK], E02: [OK, OK] }).parCas;
    expect(regressions(config1, config3)).toEqual([]);
  });

  it('ignore les cas absents d\'une des deux configurations', () => {
    const config1 = verdictsConfiguration({ E01: [OK, OK], E02: [OK, OK] }).parCas;
    const config3 = verdictsConfiguration({ E01: [KO, KO] }).parCas;
    expect(regressions(config1, config3)).toEqual(['E01']);
  });
});
