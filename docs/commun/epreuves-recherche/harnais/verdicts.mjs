// verdicts.mjs — règle de verdict du corpus d'épreuve (README § Règle de verdict, index.md § Objectif
// d'ensemble), et rien d'autre. Fonctions pures : aucune lecture disque, aucun réseau.
//
// Une « exécution » entrante est { reussie: boolean, invalidee: boolean }. Une exécution invalidée
// (tentative de lecture refusée, ou github.com atteint — cf. transcription.mjs) ne compte ni pour ni
// contre : elle est d'abord filtrée, avant d'appliquer la règle 2/2, 0/2, 1/2→3e, 2/3, 1/3.

/**
 * État d'un cas d'après ses exécutions valides.
 * - 'incomplet'   : moins de deux exécutions valides — il en faut d'autres avant tout verdict.
 * - 'attente-3e'  : 1/2 exécutions valides réussies — une 3e exécution est requise.
 * - 'reussi'      : 2/2, ou 2/3.
 * - 'echoue'      : 0/2, ou 1/3.
 */
export function etatCas(executions) {
  if (!Array.isArray(executions)) throw new TypeError('executions doit être un tableau');
  const valides = executions.filter((e) => !e.invalidee).map((e) => Boolean(e.reussie));
  const nInvalidees = executions.length - valides.length;

  if (valides.length < 2) {
    return {
      statut: 'incomplet',
      valides,
      nInvalidees,
      executionsSupplementairesRequises: 2 - valides.length,
    };
  }

  if (valides.length === 2) {
    const succes = valides.filter(Boolean).length;
    if (succes === 2) return { statut: 'reussi', valides, nInvalidees };
    if (succes === 0) return { statut: 'echoue', valides, nInvalidees };
    return { statut: 'attente-3e', valides, nInvalidees, executionsSupplementairesRequises: 1 };
  }

  // 3 exécutions valides ou plus (la règle n'en demande jamais plus de 3) : on ne retient que les
  // trois premières, dans l'ordre où elles sont arrivées.
  const troisPremieres = valides.slice(0, 3);
  const succes = troisPremieres.filter(Boolean).length;
  return { statut: succes >= 2 ? 'reussi' : 'echoue', valides: troisPremieres, nInvalidees };
}

/**
 * Verdicts de toute une configuration : { <idCas>: executions[] } → résumé et détail par cas.
 * « corpus discriminant » = au moins 3 cas échoués (index.md § Risques, « Corpus plat »).
 */
export function verdictsConfiguration(executionsParCas) {
  const parCas = {};
  let reussis = 0;
  let echoues = 0;
  let enAttente = 0;
  let incomplets = 0;

  for (const [idCas, executions] of Object.entries(executionsParCas)) {
    const etat = etatCas(executions);
    parCas[idCas] = etat;
    if (etat.statut === 'reussi') reussis += 1;
    else if (etat.statut === 'echoue') echoues += 1;
    else if (etat.statut === 'attente-3e') enAttente += 1;
    else incomplets += 1;
  }

  return {
    parCas,
    reussis,
    echoues,
    enAttente,
    incomplets,
    total: Object.keys(executionsParCas).length,
    corpusDiscriminant: echoues >= 3,
  };
}

/**
 * Régressions entre deux configurations déjà résolues (verdictsConfiguration(...).parCas) :
 * réussi en configuration 1 (skills actuelles), échoué en configuration 3 (nouvelles skills +
 * agents dédiés) — index.md § Règle de verdict des épreuves.
 */
export function regressions(parCasConfig1, parCasConfig3) {
  const idsCommuns = Object.keys(parCasConfig1).filter((id) => id in parCasConfig3);
  return idsCommuns.filter(
    (id) => parCasConfig1[id].statut === 'reussi' && parCasConfig3[id].statut === 'echoue',
  );
}
