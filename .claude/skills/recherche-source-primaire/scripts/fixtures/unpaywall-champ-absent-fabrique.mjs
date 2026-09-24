// Fixture FABRIQUÉE à la main — PAS une réponse enregistrée.
// Sert uniquement au test « champ absent → erreur nommée » (T7, étape 4) : reproduit la forme
// générale d'une réponse Unpaywall (cf. unpaywall-empa-reg.mjs, réponse réelle) mais en retirant le
// champ `oa_status`, qu'identite.mjs doit lire pour qualifier l'accès. Toute autre valeur est
// inventée sans conséquence (DOI factice).
export default {
  url: 'FABRIQUÉ — ne correspond à aucun appel réel',
  date: '2026-09-24',
  body: {
    doi: '10.9999/fabrique.test',
    is_oa: true,
    // oa_status volontairement absent : c'est le champ que identite.mjs doit signaler comme manquant
    best_oa_location: {
      host_type: 'publisher',
      url: 'https://example.invalid/fabrique.pdf',
      version: 'publishedVersion',
      license: null,
    },
    oa_locations: [],
    title: 'Titre fabriqué pour le test d’échec',
    journal_name: 'Revue fabriquée',
    year: 2026,
  },
};
