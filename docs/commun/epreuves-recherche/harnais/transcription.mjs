// transcription.mjs — lit une transcription `claude -p --output-format stream-json` (JSONL) et en
// tire coût, durée, refus, et le motif d'invalidation éventuel (T5, décision clé « Invalidation »).
//
// Le verdict d'invalidation ne se lit JAMAIS dans la réponse du modèle (anti-raccourci, § Validation
// de T5) : il se lit dans les résultats d'outils et les refus de permission de la transcription. On
// scrute donc la totalité de la transcription sérialisée, pas seulement les blocs « assistant ».

const RACINE_DEPOT_MOTIFS = [
  /C:\\Users\\Kovu\\Projets\\ebm-msp\b/i,
  /\/c\/Users\/Kovu\/Projets\/ebm-msp\b/i,
  /C:\/Users\/Kovu\/Projets\/ebm-msp\b/i,
];
const INTERFACE_OE_MOTIF = /Interface-OE/i;
const GITHUB_MOTIF = /github\.com\/kovuthecat/i;

/** Parse un contenu JSONL brut (une ligne = un événement JSON) en tableau d'objets. Lignes vides ignorées. */
export function parserJSONL(texte) {
  return texte
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0)
    .map((l) => JSON.parse(l));
}

/**
 * Analyse une transcription déjà parsée (tableau d'événements) ou son texte brut JSONL.
 * Rend { coutUsd, dureeMs, refus, invalidee, motifInvalidation, motifsBruts }.
 */
export function analyserTranscription(entree) {
  const evenements = typeof entree === 'string' ? parserJSONL(entree) : entree;
  if (!Array.isArray(evenements)) throw new TypeError('entrée invalide : ni texte JSONL ni tableau');

  let coutUsd = null;
  let dureeMs = null;
  const refus = [];

  for (const ev of evenements) {
    if (ev && ev.type === 'result') {
      if (typeof ev.total_cost_usd === 'number') coutUsd = ev.total_cost_usd;
      if (typeof ev.duration_ms === 'number') dureeMs = ev.duration_ms;
      if (Array.isArray(ev.permission_denials)) {
        for (const d of ev.permission_denials) refus.push(d);
      }
    }
    // Un refus peut aussi apparaître comme résultat d'outil en erreur (is_error) mentionnant un
    // refus de permission, indépendamment du message `result` final.
    if (ev && ev.type === 'user' && Array.isArray(ev.message?.content)) {
      for (const bloc of ev.message.content) {
        if (bloc?.type === 'tool_result' && bloc.is_error) {
          const texte = typeof bloc.content === 'string' ? bloc.content : JSON.stringify(bloc.content ?? '');
          if (/permission|refus|denied/i.test(texte)) {
            refus.push({ tool_use_id: bloc.tool_use_id ?? null, extrait: texte.slice(0, 300) });
          }
        }
      }
    }
  }

  // JSON.stringify double les antislashs (chemins Windows) : on les ramène à un seul pour que les
  // motifs ci-dessus, écrits en antislash simple, matchent aussi bien un chemin Windows échappé
  // qu'un chemin déjà en antislash simple (POSIX-style git-bash, ou texte déjà décodé).
  const texteComplet = JSON.stringify(evenements).replace(/\\\\/g, '\\');
  const motifsBruts = [];
  if (RACINE_DEPOT_MOTIFS.some((re) => re.test(texteComplet))) motifsBruts.push('chemin du dépôt ebm-msp');
  if (INTERFACE_OE_MOTIF.test(texteComplet)) motifsBruts.push('chemin Interface-OE');
  if (GITHUB_MOTIF.test(texteComplet)) motifsBruts.push('github.com/kovuthecat');

  return {
    coutUsd,
    dureeMs,
    refus,
    invalidee: motifsBruts.length > 0,
    motifInvalidation: motifsBruts.length > 0 ? motifsBruts.join(' ; ') : null,
    motifsBruts,
  };
}
