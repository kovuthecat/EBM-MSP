// transcription.mjs — lit une transcription `claude -p --output-format stream-json` (JSONL) et en
// tire coût, durée, refus, et le motif d'invalidation éventuel (T5, décision clé « Invalidation »).
//
// Le verdict d'invalidation ne se lit JAMAIS dans la réponse du modèle (anti-raccourci, § Validation
// de T5) : il se lit dans les résultats d'outils et les refus de permission de la transcription.
//
// Portée volontairement étroite (corrigée après une mesure réelle, T5/T6, 2026-09-24 : les 14
// premières exécutions de la mesure de référence étaient TOUTES invalidées à tort) : « tentative
// d'outil vers un chemin » ne veut dire QUE l'entrée d'un `tool_use` (l'argument passé à l'outil —
// `file_path`, `path`, `command`…), jamais le texte libre (réflexion, réponse, ou contenu d'un
// fichier légitimement lu). `docs/commun/OUTIL-INTERFACE-OE.md` est dans la liste blanche et
// mentionne « Interface-OE » et son chemin en toutes lettres à des fins de documentation : le lire
// n'est pas une tentative d'y accéder. Seul le motif github.com/kovuthecat regarde aussi les
// résultats d'outil (spec T5 : « dans une entrée ou un résultat d'outil »).
const RACINE_DEPOT_MOTIFS = [
  /C:\\Users\\Kovu\\Projets\\ebm-msp\b/i,
  /\/c\/Users\/Kovu\/Projets\/ebm-msp\b/i,
  /C:\/Users\/Kovu\/Projets\/ebm-msp\b/i,
];
// Chemin absolu du dossier réel (constaté sur disque, 2026-09-24), PAS le mot « Interface-OE » nu :
// le nom même du fichier whitelisté OUTIL-INTERFACE-OE.md contient la sous-chaîne « Interface-OE »
// (…IL-INTERFACE-OE.md), et ce fichier documente aussi un chemin ancien (SynologyDrive) qui n'est
// plus celui du disque — un motif nu aurait invalidé toute lecture de ce fichier légitime, ou tout
// chemin qu'il cite en exemple.
const INTERFACE_OE_MOTIFS = [
  /C:\\Users\\Kovu\\Projets\\Interface-OE\b/i,
  /\/c\/Users\/Kovu\/Projets\/Interface-OE\b/i,
  /C:\/Users\/Kovu\/Projets\/Interface-OE\b/i,
];
const GITHUB_MOTIF = /github\.com\/kovuthecat/i;

/** Parse un contenu JSONL brut (une ligne = un événement JSON) en tableau d'objets. Lignes vides ignorées. */
export function parserJSONL(texte) {
  return texte
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0)
    .map((l) => JSON.parse(l));
}

// JSON.stringify double les antislashs (chemins Windows) : on les ramène à un seul pour que les
// motifs ci-dessus, écrits en antislash simple, matchent aussi bien un chemin Windows échappé qu'un
// chemin déjà en antislash simple (POSIX-style git-bash, ou texte déjà décodé).
function normalise(texte) {
  return texte.replace(/\\\\/g, '\\');
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
  const entreesOutils = []; // texte JSON de chaque `input` de tool_use (« tentative », au sens T5)
  const resultatsOutils = []; // texte de chaque tool_result

  for (const ev of evenements) {
    if (ev && ev.type === 'result') {
      if (typeof ev.total_cost_usd === 'number') coutUsd = ev.total_cost_usd;
      if (typeof ev.duration_ms === 'number') dureeMs = ev.duration_ms;
      if (Array.isArray(ev.permission_denials)) {
        for (const d of ev.permission_denials) refus.push(d);
      }
    }
    if (ev && ev.type === 'assistant' && Array.isArray(ev.message?.content)) {
      for (const bloc of ev.message.content) {
        if (bloc?.type === 'tool_use') entreesOutils.push(JSON.stringify(bloc.input ?? {}));
      }
    }
    // Un refus peut aussi apparaître comme résultat d'outil en erreur (is_error) mentionnant un
    // refus de permission, indépendamment du message `result` final.
    if (ev && ev.type === 'user' && Array.isArray(ev.message?.content)) {
      for (const bloc of ev.message.content) {
        if (bloc?.type === 'tool_result') {
          const texte = typeof bloc.content === 'string' ? bloc.content : JSON.stringify(bloc.content ?? '');
          resultatsOutils.push(texte);
          if (bloc.is_error && /permission|refus|denied/i.test(texte)) {
            refus.push({ tool_use_id: bloc.tool_use_id ?? null, extrait: texte.slice(0, 300) });
          }
        }
      }
    }
  }

  const texteEntrees = normalise(entreesOutils.join('\n'));
  const texteResultats = normalise(resultatsOutils.join('\n'));

  const motifsBruts = [];
  if (RACINE_DEPOT_MOTIFS.some((re) => re.test(texteEntrees))) {
    motifsBruts.push('chemin du dépôt ebm-msp');
  }
  if (INTERFACE_OE_MOTIFS.some((re) => re.test(texteEntrees))) {
    motifsBruts.push('chemin Interface-OE');
  }
  if (GITHUB_MOTIF.test(texteEntrees) || GITHUB_MOTIF.test(texteResultats)) {
    motifsBruts.push('github.com/kovuthecat');
  }

  return {
    coutUsd,
    dureeMs,
    refus,
    invalidee: motifsBruts.length > 0,
    motifInvalidation: motifsBruts.length > 0 ? motifsBruts.join(' ; ') : null,
    motifsBruts,
  };
}
