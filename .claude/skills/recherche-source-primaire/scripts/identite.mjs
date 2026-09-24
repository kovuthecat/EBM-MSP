#!/usr/bin/env node
// identite.mjs — pour un DOI ou un PMID : identifiants recoupés (PMID, PMCID, DOI), accès ouvert
// légal, rétractation ou correction, publications du même essai, préprint lié. Outillage de
// recherche du module Décision et de la veille (invariant 1 : jamais appelé depuis l'application).
// Contrat : docs/commun/2026-09-16-propositions-skills-recherche.md §14.2 (l.639-646).
//
// SOURCES (sondées le 2026-09-24, cf. fixtures/ pour les réponses enregistrées) :
//   - idconv PMC          : identifiants recoupés quand l'article est indexé dans PMC
//   - E-utilities PubMed  : esearch (DOI -> PMID, NCT -> famille d'essai), efetch (notice complète :
//                           titre, DOI canonique, numéro(s) ClinicalTrials.gov)
//   - Unpaywall           : accès ouvert légal (oa_status, meilleure copie)
//   - Crossref            : rétractation / correction / erratum / expression of concern
//                           (filter=updates:<DOI>, intègre Retraction Watch)
//   - Europe PMC          : lien préprint <-> version publiée (commentCorrectionList, type
//                           "Preprint of" / "Preprint in") — lien sondé et confirmé le 2026-09-24
//                           sur RECOVERY dexaméthasone (medRxiv 10.1101/2020.06.22.20137273 <->
//                           NEJM PMID 32678530). Absence de l'entrée dans la réponse ne prouve rien
//                           (Crossref Pre-print loader ne couvre pas tout) : jamais rapportée comme
//                           « aucun préprint », toujours comme « non vérifiable par API ».
//
// DISCIPLINE (§14.2, échouer bruyamment) : une voie fermée constatée (pas dans PMC, aucun avis
// Crossref, aucune entrée Preprint chez Europe PMC) est un RÉSULTAT, jamais une erreur. Une réponse
// de forme inattendue — champ attendu absent, statut HTTP inattendu, JSON invalide, erreur réseau —
// EST une erreur : elle nomme l'API et le champ, code de sortie non nul. `fetch` est injectable
// (paramètre `fetchImpl`) pour que les tests passent des réponses enregistrées, jamais le réseau.
//
// USAGE
//   node identite.mjs <DOI|PMID> [--json]
//   node identite.mjs --sonde-contrat     (réseau réel, hors N0 — à lancer quand une API est suspecte)

// ---------------------------------------------------------------------------------------------
// Erreur nommée
// ---------------------------------------------------------------------------------------------

// Fonctions par API exportées : usage interne (orchestrateur `identifier` ci-dessous) ET tests
// ciblés (`identite.test.mjs`) — un test peut exercer une seule API sans reconstituer tout le
// routage réseau d'un scénario complet.

export class ErreurApi extends Error {
  constructor(source, champ, detail) {
    const message = champ
      ? `${source} : champ "${champ}" absent ou de forme inattendue${detail ? ' — ' + detail : ''}`
      : `${source} : ${detail}`;
    super(message);
    this.name = 'ErreurApi';
    this.source = source;
    this.champ = champ ?? null;
  }
}

function exiger(valeur, source, champ) {
  if (valeur === undefined || valeur === null) throw new ErreurApi(source, champ);
  return valeur;
}

// ---------------------------------------------------------------------------------------------
// Normalisation de l'identifiant demandé
// ---------------------------------------------------------------------------------------------

export function normaliserIdentifiant(brut) {
  if (typeof brut !== 'string' || brut.trim() === '') {
    throw new Error("identifiant vide : donner un DOI (10.xxxx/...) ou un PMID (chiffres)");
  }
  let valeur = brut.trim();
  valeur = valeur.replace(/^https?:\/\/(dx\.)?doi\.org\//i, '');
  valeur = valeur.replace(/^doi:\s*/i, '');
  if (/^\d+$/.test(valeur)) {
    return { type: 'pmid', valeur };
  }
  if (/^10\.\d{4,9}\/\S+$/.test(valeur)) {
    return { type: 'doi', valeur };
  }
  throw new Error(
    `identifiant "${brut}" reconnu ni comme DOI (10.xxxx/...) ni comme PMID (chiffres seuls)`,
  );
}

// ---------------------------------------------------------------------------------------------
// Décodage minimal d'entités XML (pas de dépendance XML : extraction ciblée par expression
// régulière, suffisante pour les balises lues ici — jamais un parseur XML général)
// ---------------------------------------------------------------------------------------------

function decoderEntitesXml(texte) {
  return texte
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(parseInt(dec, 10)))
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/<[^>]+>/g, '');
}

// ---------------------------------------------------------------------------------------------
// Appels réseau, chacun isolé pour que les tests injectent une réponse enregistrée
// ---------------------------------------------------------------------------------------------

async function appelJson(fetchImpl, url, source) {
  let reponse;
  try {
    reponse = await fetchImpl(url);
  } catch (e) {
    throw new ErreurApi(source, null, `erreur réseau : ${e.message}`);
  }
  if (!reponse.ok) {
    throw new ErreurApi(source, null, `statut HTTP inattendu ${reponse.status}`);
  }
  try {
    return await reponse.json();
  } catch (e) {
    throw new ErreurApi(source, null, `réponse non JSON : ${e.message}`);
  }
}

const SOURCE_IDCONV = 'idconv (PMC)';
const SOURCE_ESEARCH_DOI = 'esearch (E-utilities, DOI -> PMID)';
const SOURCE_ESEARCH_NCT = "esearch (E-utilities, famille d'essai)";
const SOURCE_EFETCH = 'efetch (E-utilities)';
const SOURCE_UNPAYWALL = 'Unpaywall';
const SOURCE_CROSSREF = 'Crossref';
const SOURCE_EPMC = 'Europe PMC';

function urlIdconv(identifiant) {
  return `https://pmc.ncbi.nlm.nih.gov/tools/idconv/api/v1/articles/?ids=${encodeURIComponent(identifiant)}&format=json&tool=ebm-msp&email=ebmmsp@gmail.com`;
}

export async function appelIdconv(fetchImpl, identifiant) {
  const json = await appelJson(fetchImpl, urlIdconv(identifiant), SOURCE_IDCONV);
  const records = exiger(json.records, SOURCE_IDCONV, 'records');
  const rec = records[0];
  if (!rec) throw new ErreurApi(SOURCE_IDCONV, 'records[0]');
  if (rec.status === 'error') {
    // Voie fermée normale : l'identifiant n'est simplement pas indexé dans PMC — pas une erreur.
    return { trouve: false, motif: rec.errmsg ?? 'non trouvé dans PMC' };
  }
  return {
    trouve: true,
    doi: rec.doi,
    pmid: rec.pmid !== undefined && rec.pmid !== null ? String(rec.pmid) : undefined,
    pmcid: rec.pmcid,
  };
}

function urlEsearchDoi(doi) {
  return `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${encodeURIComponent(doi)}[doi]&format=json`;
}

export async function appelEsearchParDoi(fetchImpl, doi) {
  const json = await appelJson(fetchImpl, urlEsearchDoi(doi), SOURCE_ESEARCH_DOI);
  const result = exiger(json.esearchresult, SOURCE_ESEARCH_DOI, 'esearchresult');
  const idlist = exiger(result.idlist, SOURCE_ESEARCH_DOI, 'esearchresult.idlist');
  return idlist[0]; // undefined si aucun résultat : voie fermée normale (pas indexé dans PubMed)
}

function urlEsearchNct(nct) {
  return `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${encodeURIComponent(nct)}[si]&format=json`;
}

export async function appelEsearchParNct(fetchImpl, nct) {
  const json = await appelJson(fetchImpl, urlEsearchNct(nct), SOURCE_ESEARCH_NCT);
  const result = exiger(json.esearchresult, SOURCE_ESEARCH_NCT, 'esearchresult');
  const idlist = exiger(result.idlist, SOURCE_ESEARCH_NCT, 'esearchresult.idlist');
  const compte = exiger(result.count, SOURCE_ESEARCH_NCT, 'esearchresult.count');
  return { compte: Number(compte), pmids: idlist };
}

function urlEfetch(pmid) {
  return `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=${encodeURIComponent(pmid)}&rettype=xml`;
}

export async function appelEfetch(fetchImpl, pmid) {
  let reponse;
  try {
    reponse = await fetchImpl(urlEfetch(pmid));
  } catch (e) {
    throw new ErreurApi(SOURCE_EFETCH, null, `erreur réseau : ${e.message}`);
  }
  if (!reponse.ok) {
    throw new ErreurApi(SOURCE_EFETCH, null, `statut HTTP inattendu ${reponse.status}`);
  }
  const xml = await reponse.text();
  const mPmid = xml.match(/<PMID[^>]*>(\d+)<\/PMID>/);
  if (!mPmid) throw new ErreurApi(SOURCE_EFETCH, 'PMID', `notice introuvable pour PMID ${pmid}`);
  const mTitre = xml.match(/<ArticleTitle>([\s\S]*?)<\/ArticleTitle>/);
  if (!mTitre) throw new ErreurApi(SOURCE_EFETCH, 'ArticleTitle', `notice sans titre pour PMID ${pmid}`);
  const mDoi = xml.match(/<ELocationID[^>]*EIdType="doi"[^>]*>([^<]+)<\/ELocationID>/);
  const nct = [];
  const mBanque = xml.match(
    /<DataBankName>ClinicalTrials\.gov<\/DataBankName>\s*<AccessionNumberList>([\s\S]*?)<\/AccessionNumberList>/,
  );
  if (mBanque) {
    for (const m of mBanque[1].matchAll(/<AccessionNumber>([^<]+)<\/AccessionNumber>/g)) {
      nct.push(m[1]);
    }
  }
  return {
    pmid: mPmid[1],
    titre: decoderEntitesXml(mTitre[1]),
    doi: mDoi ? mDoi[1] : undefined,
    nct,
  };
}

function urlUnpaywall(doi) {
  return `https://api.unpaywall.org/v2/${encodeURIComponent(doi)}?email=ebmmsp@gmail.com`;
}

export async function appelUnpaywall(fetchImpl, doi) {
  let reponse;
  try {
    reponse = await fetchImpl(urlUnpaywall(doi));
  } catch (e) {
    throw new ErreurApi(SOURCE_UNPAYWALL, null, `erreur réseau : ${e.message}`);
  }
  if (reponse.status === 404) {
    // Comportement documenté d'Unpaywall pour un DOI qu'il ne connaît pas : un résultat, pas une
    // erreur — on ne sait rien de l'accès par cette voie, ce n'est pas une preuve de fermeture.
    return { connu: false, motif: "DOI inconnu d'Unpaywall" };
  }
  if (!reponse.ok) {
    throw new ErreurApi(SOURCE_UNPAYWALL, null, `statut HTTP inattendu ${reponse.status}`);
  }
  let json;
  try {
    json = await reponse.json();
  } catch (e) {
    throw new ErreurApi(SOURCE_UNPAYWALL, null, `réponse non JSON : ${e.message}`);
  }
  const estOuvert = exiger(json.is_oa, SOURCE_UNPAYWALL, 'is_oa');
  const statut = exiger(json.oa_status, SOURCE_UNPAYWALL, 'oa_status');
  const meilleure = json.best_oa_location ?? null;
  return {
    connu: true,
    is_oa: estOuvert,
    oa_status: statut,
    meilleure_copie: meilleure
      ? {
          url: meilleure.url ?? null,
          host_type: meilleure.host_type ?? null,
          version: meilleure.version ?? null,
          licence: meilleure.license ?? null,
        }
      : null,
  };
}

function urlCrossrefUpdates(doi) {
  return `https://api.crossref.org/works?filter=updates:${encodeURIComponent(doi)}`;
}

export async function appelCrossref(fetchImpl, doi) {
  const json = await appelJson(fetchImpl, urlCrossrefUpdates(doi), SOURCE_CROSSREF);
  const message = exiger(json.message, SOURCE_CROSSREF, 'message');
  const items = exiger(message.items, SOURCE_CROSSREF, 'message.items');
  const doiNorm = doi.toLowerCase();
  const avis = [];
  for (const item of items) {
    const updates = item['update-to'];
    if (!Array.isArray(updates)) continue;
    for (const u of updates) {
      if (typeof u.DOI === 'string' && u.DOI.toLowerCase() === doiNorm) {
        const dateParts = u.updated?.['date-parts']?.[0];
        avis.push({
          type: exiger(u.type, SOURCE_CROSSREF, 'update-to[].type'),
          source: exiger(u.source, SOURCE_CROSSREF, 'update-to[].source'),
          date: Array.isArray(dateParts) ? dateParts.join('-') : null,
          doi_avis: item.DOI,
        });
      }
    }
  }
  return avis; // [] : aucun avis connu de Crossref — résultat normal, pas une erreur
}

function urlEpmcParDoi(doi) {
  return `https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=DOI:${encodeURIComponent(doi)}&format=json&resultType=core`;
}
function urlEpmcParPmid(pmid) {
  return `https://www.ebi.ac.uk/europepmc/webservices/rest/search?query=EXT_ID:${encodeURIComponent(pmid)}%20AND%20SRC:MED&format=json&resultType=core`;
}

export async function appelEuropePmc(fetchImpl, { doi, pmid }) {
  const url = doi ? urlEpmcParDoi(doi) : urlEpmcParPmid(pmid);
  const json = await appelJson(fetchImpl, url, SOURCE_EPMC);
  const resultList = exiger(json.resultList, SOURCE_EPMC, 'resultList');
  const resultats = exiger(resultList.result, SOURCE_EPMC, 'resultList.result');
  if (resultats.length === 0) {
    return { statut: 'non vérifiable par API', motif: "identifiant absent d'Europe PMC" };
  }
  const rec = resultats[0];
  const corrections = rec.commentCorrectionList?.commentCorrection ?? [];
  const lien = corrections.find(
    (c) => typeof c.type === 'string' && c.type.toLowerCase().startsWith('preprint'),
  );
  if (!lien) {
    return {
      statut: 'non vérifiable par API',
      motif: 'aucune entrée de type Preprint dans Europe PMC (absence non probante : le rattachement dépend du CrossRef Pre-print loader)',
    };
  }
  return {
    statut: 'lié',
    type_relation: lien.type,
    source_epmc: lien.source ?? null,
    id_epmc: lien.id ?? null,
    reference: lien.reference ?? null,
  };
}

// ---------------------------------------------------------------------------------------------
// Recoupement des identifiants
// ---------------------------------------------------------------------------------------------

function normaliserPourComparaison(champ, valeur) {
  return champ === 'doi' ? String(valeur).toLowerCase() : String(valeur);
}

export function detecterDivergences(identifiants) {
  const parChamp = new Map();
  for (const id of identifiants) {
    if (!parChamp.has(id.champ)) parChamp.set(id.champ, new Map());
    const parValeur = parChamp.get(id.champ);
    const norm = normaliserPourComparaison(id.champ, id.valeur);
    if (!parValeur.has(norm)) parValeur.set(norm, []);
    parValeur.get(norm).push(id);
  }
  const divergences = [];
  for (const [champ, parValeur] of parChamp) {
    if (parValeur.size > 1) {
      divergences.push({
        champ,
        valeurs: [...parValeur.values()].map((occurrences) => ({
          valeur: occurrences[0].valeur,
          sources: occurrences.map((o) => o.source),
        })),
      });
    }
  }
  return divergences;
}

// ---------------------------------------------------------------------------------------------
// Orchestrateur
// ---------------------------------------------------------------------------------------------

export async function identifier(fetchImpl, identifiantBrut, { dateJour } = {}) {
  const date = dateJour ?? new Date().toISOString().slice(0, 10);
  const { type, valeur } = normaliserIdentifiant(identifiantBrut);

  const identifiants = [{ champ: type, valeur, source: 'saisie' }];

  const resIdconv = await appelIdconv(fetchImpl, valeur);
  if (resIdconv.trouve) {
    if (resIdconv.doi) identifiants.push({ champ: 'doi', valeur: resIdconv.doi, source: SOURCE_IDCONV });
    if (resIdconv.pmid) identifiants.push({ champ: 'pmid', valeur: resIdconv.pmid, source: SOURCE_IDCONV });
    if (resIdconv.pmcid) identifiants.push({ champ: 'pmcid', valeur: resIdconv.pmcid, source: SOURCE_IDCONV });
  }

  let doi = identifiants.find((i) => i.champ === 'doi')?.valeur;
  let pmid = identifiants.find((i) => i.champ === 'pmid')?.valeur;

  if (!pmid && doi) {
    const trouve = await appelEsearchParDoi(fetchImpl, doi);
    if (trouve) {
      identifiants.push({ champ: 'pmid', valeur: trouve, source: SOURCE_ESEARCH_DOI });
      pmid = trouve;
    }
  }

  let notice = null;
  if (pmid) {
    notice = await appelEfetch(fetchImpl, pmid);
    identifiants.push({ champ: 'pmid', valeur: notice.pmid, source: SOURCE_EFETCH });
    if (notice.doi) identifiants.push({ champ: 'doi', valeur: notice.doi, source: SOURCE_EFETCH });
    if (!doi) doi = notice.doi;
  }

  const divergences = detecterDivergences(identifiants);

  const acces = doi ? await appelUnpaywall(fetchImpl, doi) : { connu: false, motif: 'aucun DOI résolu' };
  const integrite = doi ? await appelCrossref(fetchImpl, doi) : [];

  let familleEssai = null;
  if (notice?.nct?.length) {
    const nct = notice.nct[0];
    const res = await appelEsearchParNct(fetchImpl, nct);
    familleEssai = { nct, ...res };
  }

  const epmc = doi || pmid ? await appelEuropePmc(fetchImpl, { doi, pmid: doi ? undefined : pmid }) : {
    statut: 'non vérifiable par API',
    motif: 'aucun identifiant résolu',
  };

  return {
    demande: { type, valeur },
    date,
    titre: notice?.titre ?? null,
    identifiants,
    divergences,
    acces,
    integrite,
    familleEssai,
    preprint: epmc,
  };
}

// ---------------------------------------------------------------------------------------------
// Rendu
// ---------------------------------------------------------------------------------------------

function formaterAcces(acces) {
  if (!acces.connu) return `non déterminé (${acces.motif})`;
  const morceaux = [`oa_status Unpaywall : \`${acces.oa_status}\``];
  if (acces.meilleure_copie) {
    morceaux.push(
      `meilleure copie : ${acces.meilleure_copie.url ?? '(url absente)'} (${acces.meilleure_copie.host_type ?? '?'}, ${acces.meilleure_copie.version ?? '?'})`,
    );
  } else {
    morceaux.push('aucune copie ouverte connue d\'Unpaywall');
  }
  return morceaux.join(' — ');
}

function formaterIntegrite(avis) {
  if (avis.length === 0) return 'aucun avis (rétractation/correction/erratum) trouvé chez Crossref.';
  return avis
    .map((a) => `- **${a.type}** (source : ${a.source}, ${a.date ?? 'date inconnue'}) — avis : ${a.doi_avis}`)
    .join('\n');
}

function formaterFamille(famille) {
  if (!famille) return "aucun numéro d'enregistrement d'essai (ClinicalTrials.gov) trouvé dans la notice PubMed.";
  return `${famille.nct} — ${famille.compte} publication(s) indexée(s) sous ce numéro (PMID en tête de liste : ${famille.pmids.slice(0, 5).join(', ')}${famille.pmids.length > 5 ? ', …' : ''}).`;
}

function formaterPreprint(preprint) {
  if (preprint.statut === 'lié') {
    return `lié — ${preprint.type_relation} (Europe PMC ${preprint.id_epmc ?? '?'}, source ${preprint.source_epmc ?? '?'}) : ${preprint.reference ?? ''}`;
  }
  return `préprint : non vérifiable par API (${preprint.motif})`;
}

function formaterDivergences(divergences) {
  if (divergences.length === 0) return 'aucune — tous les identifiants recoupés concordent.';
  return divergences
    .map(
      (d) =>
        `- **${d.champ}** divergent : ` +
        d.valeurs.map((v) => `\`${v.valeur}\` (${v.sources.join(', ')})`).join(' vs '),
    )
    .join('\n');
}

export function formaterMarkdown(res) {
  const lignes = [];
  lignes.push(`# Identité et intégrité vérifiées le ${res.date} — ${res.demande.valeur}`);
  lignes.push('');
  if (res.titre) lignes.push(`**Titre** (notice PubMed) : ${res.titre}`);
  lignes.push('');
  lignes.push('## Identifiants recoupés');
  for (const id of res.identifiants) lignes.push(`- ${id.champ} : \`${id.valeur}\` — source : ${id.source}`);
  lignes.push('');
  lignes.push('## Divergences');
  lignes.push(formaterDivergences(res.divergences));
  lignes.push('');
  lignes.push('## Accès ouvert légal (Unpaywall)');
  lignes.push(formaterAcces(res.acces));
  lignes.push('');
  lignes.push('## Rétractation / correction (Crossref)');
  lignes.push(formaterIntegrite(res.integrite));
  lignes.push('');
  lignes.push("## Famille d'essai (PubMed, champ [si])");
  lignes.push(formaterFamille(res.familleEssai));
  lignes.push('');
  lignes.push('## Préprint lié (Europe PMC)');
  lignes.push(formaterPreprint(res.preprint));
  lignes.push('');
  return lignes.join('\n');
}

// ---------------------------------------------------------------------------------------------
// Sonde de contrat (réseau réel, hors N0)
// ---------------------------------------------------------------------------------------------

const REFERENCES_SONDE = [
  {
    identifiant: '10.1056/NEJMoa1504720',
    nom: 'EMPA-REG OUTCOME (Zinman 2015) — accès ouvert chez l\'éditeur, absent de PMC',
    verifier(res) {
      const echecs = [];
      if (res.identifiants.some((i) => i.champ === 'pmcid')) echecs.push('un PMCID a été trouvé alors qu\'aucun n\'était attendu');
      if (res.acces.oa_status !== 'bronze') echecs.push(`oa_status attendu "bronze", obtenu "${res.acces.oa_status}"`);
      if (res.familleEssai?.nct !== 'NCT01131676') echecs.push(`NCT attendu "NCT01131676", obtenu "${res.familleEssai?.nct}"`);
      return echecs;
    },
  },
  {
    identifiant: '10.1016/S0140-6736(20)31180-6',
    nom: 'Mehra et al. 2020 (Surgisphere) — rétracté',
    verifier(res) {
      const echecs = [];
      if (!res.integrite.some((a) => a.type === 'retraction')) echecs.push('aucun avis de type "retraction" trouvé');
      return echecs;
    },
  },
  {
    identifiant: '10.1056/NEJMoa2021436',
    nom: 'RECOVERY dexaméthasone (NEJM) — préprint medRxiv lié',
    verifier(res) {
      const echecs = [];
      if (res.preprint.statut !== 'lié') echecs.push(`statut préprint attendu "lié", obtenu "${res.preprint.statut}"`);
      return echecs;
    },
  },
];

async function sondeContrat() {
  const fetchImpl = globalThis.fetch;
  let tout = true;
  for (const ref of REFERENCES_SONDE) {
    try {
      const res = await identifier(fetchImpl, ref.identifiant);
      const echecs = ref.verifier(res);
      if (echecs.length === 0) {
        console.log(`PASS — ${ref.nom}`);
      } else {
        tout = false;
        console.log(`FAIL — ${ref.nom}`);
        for (const e of echecs) console.log(`  - ${e}`);
      }
    } catch (e) {
      tout = false;
      console.log(`FAIL — ${ref.nom} : ${e.message}`);
    }
  }
  process.exit(tout ? 0 : 1);
}

// ---------------------------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------------------------

async function main() {
  const args = process.argv.slice(2);
  if (args.includes('--sonde-contrat')) {
    await sondeContrat();
    return;
  }
  const veutJson = args.includes('--json');
  const identifiantBrut = args.find((a) => !a.startsWith('--'));
  if (!identifiantBrut) {
    console.error('identite: usage : node identite.mjs <DOI|PMID> [--json]  |  node identite.mjs --sonde-contrat');
    process.exit(2);
  }
  try {
    const res = await identifier(globalThis.fetch, identifiantBrut);
    if (veutJson) {
      process.stdout.write(JSON.stringify(res, null, 2) + '\n');
    } else {
      process.stdout.write(formaterMarkdown(res));
    }
    process.exit(0);
  } catch (e) {
    console.error(`identite: ${e.message}`);
    process.exit(1);
  }
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
