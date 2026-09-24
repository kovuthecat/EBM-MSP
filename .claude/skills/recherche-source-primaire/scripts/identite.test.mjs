import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import {
  normaliserIdentifiant,
  detecterDivergences,
  identifier,
  formaterMarkdown,
  ErreurApi,
  appelIdconv,
  appelUnpaywall,
  appelCrossref,
  appelEfetch,
  appelEuropePmc,
} from './identite.mjs';
import { lireTousLesCas } from '../../../../docs/commun/epreuves-recherche/harnais/cas.mjs';

const ICI = dirname(fileURLToPath(import.meta.url));
const FIXTURES = join(ICI, 'fixtures');

async function chargerFixtureJson(nom) {
  const mod = await import(`./fixtures/${nom}.mjs`);
  return mod.default.body;
}

function reponseJson(body, { status = 200 } = {}) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body,
    text: async () => JSON.stringify(body),
  };
}

function reponseTexte(texte, { status = 200 } = {}) {
  return { ok: status >= 200 && status < 300, status, text: async () => texte };
}

// Faux fetch mono-route : une seule API en jeu, une seule route suffit — pas besoin de router par
// URL quand le test exerce une fonction `appelXxx` isolée plutôt que l'orchestrateur `identifier`.
function fetchUnique(reponse) {
  return async () => reponse;
}

// Faux fetch multi-route pour les scénarios complets (`identifier`) : route par sous-chaîne d'URL,
// jamais le réseau. Un seul appel par famille d'API dans une session `identifier()`, la sous-chaîne
// suffit à désambiguïser.
function fauxFetch(routes) {
  return async (url) => {
    for (const [sousChaine, corps] of routes) {
      if (url.includes(sousChaine)) {
        return typeof corps === 'function' ? corps(url) : corps;
      }
    }
    throw new Error(`fauxFetch: aucune route pour ${url}`);
  };
}

describe('normaliserIdentifiant', () => {
  it('reconnaît un DOI', () => {
    expect(normaliserIdentifiant('10.1056/NEJMoa1504720')).toEqual({
      type: 'doi',
      valeur: '10.1056/NEJMoa1504720',
    });
  });
  it('reconnaît un PMID', () => {
    expect(normaliserIdentifiant('26378978')).toEqual({ type: 'pmid', valeur: '26378978' });
  });
  it('dépouille un préfixe https://doi.org/', () => {
    expect(normaliserIdentifiant('https://doi.org/10.1056/NEJMoa1504720')).toEqual({
      type: 'doi',
      valeur: '10.1056/NEJMoa1504720',
    });
  });
  it("refuse un identifiant qui n'est ni DOI ni PMID", () => {
    expect(() => normaliserIdentifiant('pas-un-identifiant')).toThrow();
  });
});

describe("detecterDivergences — divergence d'identifiants signalée", () => {
  it('ne signale rien quand tout concorde (casse ignorée pour un DOI)', () => {
    const d = detecterDivergences([
      { champ: 'doi', valeur: '10.1/a', source: 'saisie' },
      { champ: 'doi', valeur: '10.1/A', source: 'idconv (PMC)' },
    ]);
    expect(d).toEqual([]);
  });
  it('signale une divergence avec la source de chaque valeur', () => {
    const d = detecterDivergences([
      { champ: 'doi', valeur: '10.1/a', source: 'saisie' },
      { champ: 'doi', valeur: '10.1/b', source: 'efetch (E-utilities)' },
    ]);
    expect(d).toHaveLength(1);
    expect(d[0].champ).toBe('doi');
    const valeurs = d[0].valeurs.map((v) => v.valeur).sort();
    expect(valeurs).toEqual(['10.1/a', '10.1/b']);
    expect(d[0].valeurs.find((v) => v.valeur === '10.1/a').sources).toEqual(['saisie']);
  });
});

describe('accès ouvert hors PMC → pas "fermé"', () => {
  it("EMPA-REG OUTCOME : idconv dit « absent de PMC », ce n'est pas une fermeture d'accès", async () => {
    const idconv = await chargerFixtureJson('idconv-empa-reg');
    const res = await appelIdconv(fetchUnique(reponseJson(idconv)), '10.1056/NEJMoa1504720');
    expect(res.trouve).toBe(false);
    expect(res.motif).toMatch(/not found in PMC/i);
  });

  it('EMPA-REG OUTCOME : Unpaywall qualifie un accès ouvert (bronze) chez l\'éditeur', async () => {
    const unpaywall = await chargerFixtureJson('unpaywall-empa-reg');
    const res = await appelUnpaywall(fetchUnique(reponseJson(unpaywall)), '10.1056/NEJMoa1504720');
    expect(res.connu).toBe(true);
    expect(res.is_oa).toBe(true);
    expect(res.oa_status).toBe('bronze');
    expect(res.meilleure_copie).not.toBeNull();
    // L'absence de PMC (test précédent) et l'accès ouvert réel (celui-ci) sont deux faits distincts :
    // le premier ne doit jamais être lu comme une preuve du second.
  });
});

describe('rétractation détectée avec sa source', () => {
  it('Mehra et al. 2020 (Surgisphere) : avis de type retraction, avec sa source et sa date', async () => {
    const crossref = await chargerFixtureJson('crossref-retraction-lancet');
    const doi = '10.1016/S0140-6736(20)31180-6'; // casse mixte, comme réellement saisi
    const avis = await appelCrossref(fetchUnique(reponseJson(crossref)), doi);
    expect(avis.length).toBeGreaterThan(0);
    const retractation = avis.find((a) => a.type === 'retraction');
    expect(retractation).toBeTruthy();
    expect(retractation.source).toBe('publisher');
    expect(retractation.date).toBe('2020-5-22');
    // Une correction et une expression of concern sont aussi présentes dans ce dossier réel —
    // le filtrage ne doit pas les perdre.
    expect(avis.some((a) => a.type === 'correction')).toBe(true);
    expect(avis.some((a) => a.type === 'expression_of_concern')).toBe(true);
  });

  it('EMPA-REG OUTCOME : aucun avis Crossref (résultat normal, pas une erreur)', async () => {
    const crossref = await chargerFixtureJson('crossref-updates-empa-reg');
    const avis = await appelCrossref(fetchUnique(reponseJson(crossref)), '10.1056/NEJMoa1504720');
    expect(avis).toEqual([]);
  });
});

describe('PMID → DOI (efetch)', () => {
  it("lit le DOI canonique et le numéro d'essai (NCT) dans la notice PubMed d'un PMID", async () => {
    const efetchXml = readFileSync(join(FIXTURES, 'efetch-empa-reg.xml'), 'utf8');
    const notice = await appelEfetch(fetchUnique(reponseTexte(efetchXml)), '26378978');
    expect(notice.pmid).toBe('26378978');
    expect(notice.doi).toBe('10.1056/NEJMoa1504720');
    expect(notice.nct).toEqual(['NCT01131676']);
    expect(notice.titre).toContain('Empagliflozin');
  });
});

describe('préprint lié — RECOVERY dexaméthasone', () => {
  it('côté préprint : Europe PMC porte "Preprint of" -> PMID de la version publiée', async () => {
    const epmc = await chargerFixtureJson('europepmc-preprint-of-recovery');
    const res = await appelEuropePmc(fetchUnique(reponseJson(epmc)), { doi: '10.1101/2020.06.22.20137273' });
    expect(res.statut).toBe('lié');
    expect(res.type_relation).toBe('Preprint of');
    expect(res.id_epmc).toBe('32678530');
  });

  it('côté version publiée : Europe PMC porte "Preprint in" -> id du préprint medRxiv', async () => {
    const epmc = await chargerFixtureJson('europepmc-preprint-in-recovery');
    const res = await appelEuropePmc(fetchUnique(reponseJson(epmc)), { pmid: '32678530' });
    expect(res.statut).toBe('lié');
    expect(res.type_relation).toBe('Preprint in');
    expect(res.id_epmc).toBe('PPR179288');
  });

  it("EMPA-REG OUTCOME : aucune entrée Preprint -> « non vérifiable par API », jamais « aucun »", async () => {
    const epmc = await chargerFixtureJson('europepmc-preprint-absent-empa-reg');
    const res = await appelEuropePmc(fetchUnique(reponseJson(epmc)), { doi: '10.1056/NEJMoa1504720' });
    expect(res.statut).toBe('non vérifiable par API');
  });
});

describe("champ absent → erreur nommée", () => {
  it('Unpaywall sans `oa_status` : ErreurApi nommant la source et le champ', async () => {
    const corps = await chargerFixtureJson('unpaywall-champ-absent-fabrique');
    await expect(
      appelUnpaywall(fetchUnique(reponseJson(corps)), '10.9999/fabrique.test'),
    ).rejects.toMatchObject({ name: 'ErreurApi', source: 'Unpaywall', champ: 'oa_status' });
  });
});

describe('erreur réseau ou HTTP inattendue → ErreurApi nommée (code de sortie non nul côté CLI)', () => {
  it('une exception réseau remonte en ErreurApi nommant la source', async () => {
    const fetchImpl = async () => {
      throw new Error('ECONNRESET (simulée)');
    };
    await expect(appelIdconv(fetchImpl, '10.1056/NEJMoa1504720')).rejects.toMatchObject({
      name: 'ErreurApi',
      source: 'idconv (PMC)',
    });
  });

  it('un statut HTTP inattendu remonte aussi en ErreurApi nommée', async () => {
    const fetchImpl = fetchUnique({ ok: false, status: 503, json: async () => ({}) });
    await expect(appelIdconv(fetchImpl, '10.1056/NEJMoa1504720')).rejects.toMatchObject({
      name: 'ErreurApi',
      source: 'idconv (PMC)',
    });
  });

  it("le même échec, propagé par l'orchestrateur `identifier`, reste une ErreurApi (le CLI en tire un code non nul)", async () => {
    const fetchImpl = async () => {
      throw new Error('panne réseau simulée');
    };
    await expect(identifier(fetchImpl, '10.1056/NEJMoa1504720')).rejects.toBeInstanceOf(ErreurApi);
  });
});

describe("scénario complet — EMPA-REG OUTCOME (DOI en entrée), famille d'essai listée", () => {
  async function construireFetch() {
    const idconv = await chargerFixtureJson('idconv-empa-reg');
    const esearchDoi = await chargerFixtureJson('esearch-doi-empa-reg');
    const unpaywall = await chargerFixtureJson('unpaywall-empa-reg');
    const crossref = await chargerFixtureJson('crossref-updates-empa-reg');
    const esearchNct = await chargerFixtureJson('esearch-nct-famille-empa-reg');
    const epmc = await chargerFixtureJson('europepmc-preprint-absent-empa-reg');
    const efetchXml = readFileSync(join(FIXTURES, 'efetch-empa-reg.xml'), 'utf8');

    return fauxFetch([
      ['pmc.ncbi.nlm.nih.gov/tools/idconv', reponseJson(idconv)],
      ['esearch.fcgi', (url) => (url.includes('[si]') ? reponseJson(esearchNct) : reponseJson(esearchDoi))],
      ['efetch.fcgi', reponseTexte(efetchXml)],
      ['api.unpaywall.org', reponseJson(unpaywall)],
      ['api.crossref.org', reponseJson(crossref)],
      ['ebi.ac.uk/europepmc', reponseJson(epmc)],
    ]);
  }

  it("recoupe les identifiants, résout le PMID par DOI, trouve la famille d'essai, ne clôt pas le préprint", async () => {
    const fetchImpl = await construireFetch();
    const res = await identifier(fetchImpl, '10.1056/NEJMoa1504720', { dateJour: '2026-09-24' });

    expect(res.identifiants.some((i) => i.champ === 'pmid' && i.valeur === '26378978')).toBe(true);
    expect(res.identifiants.some((i) => i.champ === 'pmcid')).toBe(false); // absent de PMC
    expect(res.divergences).toEqual([]); // le DOI de la notice PubMed concorde avec le DOI saisi

    expect(res.acces.connu).toBe(true);
    expect(res.acces.oa_status).toBe('bronze');

    expect(res.integrite).toEqual([]); // aucune rétractation connue

    expect(res.familleEssai).not.toBeNull();
    expect(res.familleEssai.nct).toBe('NCT01131676');
    expect(res.familleEssai.compte).toBe(40);
    expect(res.familleEssai.pmids.length).toBeGreaterThan(0);

    expect(res.preprint.statut).toBe('non vérifiable par API');

    const md = formaterMarkdown(res);
    expect(md).toContain('NCT01131676');
    expect(md).toContain('non vérifiable par API');
    expect(md).not.toMatch(/préprint\s*:\s*aucun/i);
  });
});

describe("signatures du corpus d'épreuve — aucun identifiant de fixture ne doit en être une", () => {
  it('les identifiants utilisés ici sont absents des signatures E01-E12', () => {
    const identifiantsUtilises = [
      '10.1056/NEJMoa1504720', '26378978',
      '10.1016/S0140-6736(20)31180-6', '32450107', 'PMC7255293',
      'NCT01131676',
      '10.1101/2020.06.22.20137273', 'PPR179288',
      '10.1056/NEJMoa2021436', '32678530',
    ];
    // Signatures lues dans le corpus lui-même (jamais recopiées ici : ce fichier est dans la liste
    // blanche de l'export, et signatures.test.mjs refuserait toute signature écrite en clair).
    const signaturesCorpus = lireTousLesCas(join(ICI, '..', '..', '..', '..'))
      .flatMap((c) => c.signatures.map((s) => s.valeur))
      .filter(Boolean);
    expect(signaturesCorpus.length).toBeGreaterThan(0);
    for (const id of identifiantsUtilises) {
      expect(signaturesCorpus).not.toContain(id);
    }
  });
});
