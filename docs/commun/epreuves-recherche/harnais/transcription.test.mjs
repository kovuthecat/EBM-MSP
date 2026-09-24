import { describe, it, expect } from 'vitest';
import { analyserTranscription, parserJSONL } from './transcription.mjs';

function ligne(obj) {
  return JSON.stringify(obj);
}

describe('parserJSONL', () => {
  it('ignore les lignes vides et parse chaque ligne restante', () => {
    const texte = `${ligne({ type: 'system' })}\n\n${ligne({ type: 'result', total_cost_usd: 0.1 })}\n`;
    const ev = parserJSONL(texte);
    expect(ev.length).toBe(2);
  });
});

describe('analyserTranscription — coût, durée, refus', () => {
  it('lit le coût et la durée du message result final', () => {
    const texte = [
      ligne({ type: 'system', subtype: 'init' }),
      ligne({ type: 'assistant', message: { content: [{ type: 'text', text: 'ok' }] } }),
      ligne({ type: 'result', subtype: 'success', total_cost_usd: 0.42, duration_ms: 12345, permission_denials: [] }),
    ].join('\n');
    const r = analyserTranscription(texte);
    expect(r.coutUsd).toBe(0.42);
    expect(r.dureeMs).toBe(12345);
    expect(r.refus).toEqual([]);
    expect(r.invalidee).toBe(false);
  });

  it('collecte les permission_denials du message result', () => {
    const texte = [
      ligne({
        type: 'result',
        total_cost_usd: 0.1,
        duration_ms: 1000,
        permission_denials: [{ tool_name: 'Bash', tool_input: { command: 'echo hi' } }],
      }),
    ].join('\n');
    const r = analyserTranscription(texte);
    expect(r.refus.length).toBe(1);
    expect(r.refus[0].tool_name).toBe('Bash');
  });

  it('collecte un tool_result en erreur mentionnant un refus', () => {
    const evenements = [
      {
        type: 'user',
        message: {
          content: [
            { type: 'tool_result', tool_use_id: 't1', is_error: true, content: 'Permission denied: PowerShell' },
          ],
        },
      },
      { type: 'result', total_cost_usd: 0.05, duration_ms: 500, permission_denials: [] },
    ];
    const r = analyserTranscription(evenements);
    expect(r.refus.length).toBe(1);
    expect(r.refus[0].extrait).toMatch(/Permission denied/);
  });
});

describe('analyserTranscription — invalidation', () => {
  it('invalide une tentative d\'outil vers un chemin du dépôt (Windows)', () => {
    const evenements = [
      {
        type: 'assistant',
        message: {
          content: [
            { type: 'tool_use', name: 'Read', input: { file_path: 'C:\\Users\\Kovu\\Projets\\ebm-msp\\STATUS.md' } },
          ],
        },
      },
      { type: 'result', total_cost_usd: 0.1, duration_ms: 100, permission_denials: [] },
    ];
    const r = analyserTranscription(evenements);
    expect(r.invalidee).toBe(true);
    expect(r.motifsBruts).toContain('chemin du dépôt ebm-msp');
  });

  it('invalide une tentative de lecture sous Interface-OE', () => {
    const evenements = [
      {
        type: 'assistant',
        message: {
          content: [{ type: 'tool_use', name: 'Read', input: { file_path: '/c/Users/Kovu/Projets/Interface-OE/out/cli/index.js' } }],
        },
      },
      { type: 'result', total_cost_usd: 0.1, duration_ms: 100, permission_denials: [] },
    ];
    const r = analyserTranscription(evenements);
    expect(r.invalidee).toBe(true);
    expect(r.motifsBruts).toContain('chemin Interface-OE');
  });

  it('invalide une URL github.com/kovuthecat, même en résultat d\'outil', () => {
    const evenements = [
      {
        type: 'user',
        message: {
          content: [
            {
              type: 'tool_result',
              tool_use_id: 't2',
              is_error: false,
              content: 'contenu récupéré depuis https://github.com/kovuthecat/EBM-MSP/blob/main/STATUS.md',
            },
          ],
        },
      },
      { type: 'result', total_cost_usd: 0.1, duration_ms: 100, permission_denials: [] },
    ];
    const r = analyserTranscription(evenements);
    expect(r.invalidee).toBe(true);
    expect(r.motifsBruts).toContain('github.com/kovuthecat');
  });

  it('une transcription propre (pubmed, chemins de l\'export) n\'est pas invalidée', () => {
    const evenements = [
      {
        type: 'assistant',
        message: {
          content: [
            { type: 'tool_use', name: 'WebFetch', input: { url: 'https://pubmed.ncbi.nlm.nih.gov/12345/' } },
            { type: 'tool_use', name: 'Read', input: { file_path: 'CLAUDE.md' } },
          ],
        },
      },
      { type: 'result', total_cost_usd: 0.2, duration_ms: 5000, permission_denials: [] },
    ];
    const r = analyserTranscription(evenements);
    expect(r.invalidee).toBe(false);
    expect(r.motifInvalidation).toBeNull();
  });
});
