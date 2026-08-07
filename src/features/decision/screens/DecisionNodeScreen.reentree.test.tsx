// @vitest-environment jsdom

/**
 * T-057 (P8 · S2, 2026-07-30) — UNE RE-ENTRÉE DANS UN NŒUD NE PEUT PLUS RENDRE LA RECO DU PATIENT
 * PRÉCÉDENT.
 *
 * Reproduit exactement le DÉFAUT MAJEUR de la recette du 2026-07-30 (« entre N2 et N3 », 3 clics) : un
 * nœud RE-OUVERT, dont TOUS les critères renseignés viennent de la mémoire de session (D28,
 * `lib/sessionCriteres.ts`), affichait une recommandation BADGÉE ET FINIE construite pour le patient
 * PRÉCÉDENT, avec « repris de votre saisie » — sans que rien n'ait été saisi sur CET écran.
 *
 * MÊME CONVENTION que `sessionCriteres.remount.test.tsx` (nœuds SYNTHÉTIQUES, un critère `partage`
 * commun, `unmount()`/`render()` pour simuler la sortie/ré-ouverture d'un nœud — pas de rechargement de
 * page, D28 reste vivant). Un SECOND critère, non `partage`, laissé à sa valeur par défaut : une option
 * en dépend RÉELLEMENT, pour que la carte affichée ne soit pas qu'un socle « toujours » indépendant de
 * la valeur reprise — fidèle au nœud réel `cible-glycemique`, où toutes les options décisives dépendent
 * de critères `partage: true`.
 */
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { Noeud, Option } from '../content/node.types'
import { reinitialiserSession } from '../lib/sessionCriteres'
import { DecisionNodeScreen } from './DecisionNodeScreen'

const { NOEUD_A, NOEUD_B, NOEUD_ESP_A, NOEUD_ESP_B, NOEUD_CIBLE_A, NOEUD_CIBLE_B } = vi.hoisted(() => {
  const SOCLE: Option = {
    intitule: 'Socle',
    role: 'socle',
    conditions: ['toujours'],
    avantages: [],
    inconvenients: [],
    effet_attendu: 'non chiffrable',
    niveau_preuve: 'faible',
  }
  const OPTION_CIBLE: Option = {
    intitule: 'Option cible',
    role: 'geste',
    conditions: ['cible_partagee >= 5'],
    avantages: [],
    inconvenients: [],
    effet_attendu: 'non chiffrable',
    niveau_preuve: 'faible',
  }

  function buildNode(id: string): Noeud {
    return {
      id,
      domaine: 'test',
      titre: `Nœud de test (${id})`,
      population_cible: 'test',
      selection: 'multi-options',
      criteres_entree: [{ nom: 'cible_partagee', type: 'nombre', min: 0, max: 20, partage: true }],
      options: [SOCLE, OPTION_CIBLE],
      argumentaire: 'x',
      sources: {
        references_primaires: [],
        synthese_critique: { donnee: '' },
        reco_officielle: { source: '', position: '', divergence: false, explication: '' },
      },
      incertitudes: [],
      veille_liee: [],
      meta: { date_revue: '2026-01-01', auteur: 'test', statut: 'valide', version: '1.0', changelog: [] },
    }
  }

  // T-061 x T-057 (défaut signalé en recette P8 2026-07-30, §Scénario A/C) — SECOND couple de nœuds
  // synthétiques, DÉDIÉ à la suggestion d'espérance de vie : NOEUD_A/NOEUD_B ci-dessus n'ont qu'un seul
  // champ (`cible_partagee`) et `champCiblePartagee()` (plus bas) suppose un SEUL spinbutton à l'écran —
  // ajouter `age` à ces nœuds casserait ce sélecteur pour les quatre tests existants. Mêmes quatre drivers
  // que `DecisionNodeScreen.esperanceVie.test.tsx` (`age`/`fragilite`/`comorbidite_grave`/`ASCVD_etablie`),
  // déclarés `partage: true` cette fois (contrairement à ce fichier de test, qui n'exerce jamais la
  // reprise) — plus `esperance_vie` elle-même, également `partage: true` : nécessaire pour le second test
  // ci-dessous (un praticien qui l'a déjà choisie sur le nœud précédent), sans effet sur le premier (elle
  // n'est jamais `touched` sur NOEUD_ESP_A dans ce cas, donc jamais mémorisée ni reprise, cf.
  // `sessionCriteres.ts` `memoriserCriteres`).
  function buildNoeudEsperanceVie(id: string): Noeud {
    return {
      id,
      domaine: 'test',
      titre: `Nœud de test espérance de vie (${id})`,
      population_cible: 'test',
      selection: 'multi-options',
      criteres_entree: [
        { nom: 'age', type: 'nombre', min: 0, max: 110, partage: true },
        { nom: 'fragilite', type: 'bool', partage: true },
        { nom: 'comorbidite_grave', type: 'bool', partage: true },
        { nom: 'ASCVD_etablie', type: 'bool', partage: true },
        { nom: 'esperance_vie', type: 'enum', valeurs: ['longue', 'intermediaire', 'limitee'], partage: true },
      ],
      options: [SOCLE],
      argumentaire: 'x',
      sources: {
        references_primaires: [],
        synthese_critique: { donnee: '' },
        reco_officielle: { source: '', position: '', divergence: false, explication: '' },
      },
      incertitudes: [],
      veille_liee: [],
      meta: { date_revue: '2026-01-01', auteur: 'test', statut: 'valide', version: '1.0', changelog: [] },
    }
  }

  // P12/S1 (2026-08-02) — TROISIÈME couple synthétique, à l'origine un miroir FIDÈLE de l'encodage réel
  // du nœud `cible-glycemique` sur les quatre drivers d'espérance de vie — pas une approximation, VRAI
  // au moment de l'écriture. NE L'EST PLUS EXACTEMENT depuis le 2026-08-07 (décision référent, arbitrage
  // 1 de S14, P14/S17) : le nœud réel a remplacé `antecedent_cv` par `ASCVD_etablie`, cette fois déclaré
  // `partage: true` — précisément parce que l'asymétrie ci-dessous causait ce bug. Le champ a été
  // renommé ici pour rester reconnu par `ESPERANCE_VIE_DRIVERS`, MAIS l'absence délibérée de `partage`
  // est CONSERVÉE : ce couple reste une protection GÉNÉRIQUE contre la classe de bug (un driver
  // repris/mémoire de session incomplet), même si elle ne mime plus l'encodage actuel du nœud réel :
  //  - `ASCVD_etablie`/`comorbidite_grave` NE PORTENT PAS `partage: true` ici (contrairement à
  //    `NOEUD_ESP_A`/`NOEUD_ESP_B` ci-dessus, et contrairement au nœud réel depuis le 2026-08-07) : c'est
  //    l'absence qui amputait un dossier repris ;
  //  - `ASCVD_etablie`/`comorbidite_grave` portent `presomption_non: true`, `fragilite` NON (même
  //    répartition que le nœud réel) : c'est CETTE asymétrie précise qui a fait qu'une garde de
  //    complétude des drivers `touched` ne pouvait JAMAIS être satisfaite sur le nœud réel (un `bool`
  //    présumé est déterminé sans jamais être `touched`) — cf. `esperanceVieDefault.ts` pour l'historique
  //    complet. `OPTION_FRAGILE` rend `fragilite` DÉCISIVE (seul booléen qui peut apparaître dans
  //    `aConfirmer`, donc seul que « Rien à signaler » touche jamais) — nécessaire au test de couverture
  //    ci-dessous (régression exacte mesurée au navigateur sur la vignette N2 : Âge → Ancienneté →
  //    « Rien à signaler » → plus aucune carte).
  function buildNoeudCible(id: string): Noeud {
    const OPTION_FRAGILE: Option = {
      intitule: 'Option fragile',
      role: 'geste',
      conditions: ['fragilite == true'],
      avantages: [],
      inconvenients: [],
      effet_attendu: 'non chiffrable',
      niveau_preuve: 'faible',
    }
    return {
      id,
      domaine: 'test',
      titre: `Nœud de test cible (${id})`,
      population_cible: 'test',
      selection: 'multi-options',
      criteres_entree: [
        { nom: 'age', type: 'nombre', min: 0, max: 110, partage: true },
        { nom: 'fragilite', type: 'bool', partage: true },
        { nom: 'comorbidite_grave', type: 'bool', presomption_non: true },
        { nom: 'ASCVD_etablie', type: 'bool', presomption_non: true },
        { nom: 'esperance_vie', type: 'enum', valeurs: ['longue', 'intermediaire', 'limitee'], partage: true },
      ],
      options: [SOCLE, OPTION_FRAGILE],
      argumentaire: 'x',
      sources: {
        references_primaires: [],
        synthese_critique: { donnee: '' },
        reco_officielle: { source: '', position: '', divergence: false, explication: '' },
      },
      incertitudes: [],
      veille_liee: [],
      meta: { date_revue: '2026-01-01', auteur: 'test', statut: 'valide', version: '1.0', changelog: [] },
    }
  }

  return {
    NOEUD_A: buildNode('noeud-A'),
    NOEUD_B: buildNode('noeud-B'),
    NOEUD_ESP_A: buildNoeudEsperanceVie('noeud-esp-A'),
    NOEUD_ESP_B: buildNoeudEsperanceVie('noeud-esp-B'),
    NOEUD_CIBLE_A: buildNoeudCible('noeud-cible-A'),
    NOEUD_CIBLE_B: buildNoeudCible('noeud-cible-B'),
  }
})

vi.mock('../content/loadNodes', () => ({
  getNoeudById: (id: string) =>
    [NOEUD_A, NOEUD_B, NOEUD_ESP_A, NOEUD_ESP_B, NOEUD_CIBLE_A, NOEUD_CIBLE_B].find((n) => n.id === id),
  getNoeudsByDomaine: () => [NOEUD_A, NOEUD_B, NOEUD_ESP_A, NOEUD_ESP_B, NOEUD_CIBLE_A, NOEUD_CIBLE_B],
  noeuds: [NOEUD_A, NOEUD_B, NOEUD_ESP_A, NOEUD_ESP_B, NOEUD_CIBLE_A, NOEUD_CIBLE_B],
  noeudsParDomaine: { test: [NOEUD_A, NOEUD_B, NOEUD_ESP_A, NOEUD_ESP_B, NOEUD_CIBLE_A, NOEUD_CIBLE_B] },
}))

vi.mock('../content/loadModules', () => ({
  getModuleDuNoeud: () => undefined,
  getModuleById: () => undefined,
  entreesListe: () => [],
}))

afterEach(() => {
  cleanup()
  reinitialiserSession()
})

function champCiblePartagee(): HTMLInputElement {
  return screen.getByRole('spinbutton') as HTMLInputElement
}

function titresCartes(container: HTMLElement): string[] {
  return [...container.querySelectorAll('.option-card__title')].map((el) => el.textContent ?? '')
}

// Helpers du couple NOEUD_ESP_A/NOEUD_ESP_B (T-061 x T-057 ci-dessous) — mêmes sélecteurs que
// `DecisionNodeScreen.esperanceVie.test.tsx`, dupliqués plutôt qu'importés : ce sont de simples fonctions
// de requête DOM sans dépendance partagée, et les deux fichiers ciblent des nœuds synthétiques distincts.
function champAge(): HTMLInputElement {
  return screen.getByRole('spinbutton') as HTMLInputElement
}

function checkbox(nom: RegExp): HTMLInputElement {
  return screen.getByRole('checkbox', { name: nom }) as HTMLInputElement
}

function segmentEsperanceVie(libelle: string): HTMLButtonElement {
  const groupe = screen.getByRole('group', { name: 'Espérance de vie' })
  return within(groupe).getByRole('button', { name: libelle }) as HTMLButtonElement
}

describe('DecisionNodeScreen — frontière de re-entrée (T-057, P8 · S2)', () => {
  it('un nœud ré-ouvert dont TOUT vient de la reprise ne rend AUCUNE carte tant que rien n’a été saisi ici', () => {
    const { unmount } = render(<DecisionNodeScreen nodeId={NOEUD_A.id} go={() => {}} />)
    fireEvent.change(champCiblePartagee(), { target: { value: '7' } })
    unmount()

    const { container } = render(<DecisionNodeScreen nodeId={NOEUD_B.id} go={() => {}} />)
    // Repris, bien affiché dans le FORMULAIRE (D28, inchangé) :
    expect(champCiblePartagee().value).toBe('7')
    expect(screen.getByText('· repris de votre saisie', { exact: false })).toBeTruthy()
    // ... mais AUCUNE carte badgée dans la colonne résultats — c'est le défaut corrigé — et le choix
    // explicite est proposé à la place.
    expect(titresCartes(container)).toEqual([])
    expect(screen.getByText('Reprendre les valeurs de ce patient')).toBeTruthy()
    expect(screen.getByText('Repartir de zéro')).toBeTruthy()
  })

  // T-129 (P12/S7, 2026-08-02) — LE TITRE NE DOIT PLUS AFFIRMER « CE NŒUD A DÉJÀ ÉTÉ OUVERT » : ce
  // nœud (B) n'a JAMAIS été ouvert avant dans cette consultation, seules ses valeurs sont pré-remplies
  // depuis un AUTRE nœud (A). L'ancien titre était donc faux dans le cas le plus fréquent (recette du
  // 02/08). Le composant ne distingue pas « déjà ouvert » de « alimenté par un autre écran » (mémoire de
  // session par NOM de critère seulement, cf. `lib/sessionCriteres.ts` — aucun id de nœud mémorisé) : un
  // titre unique, vrai dans les deux cas, est donc le bon niveau de correction.
  it('le titre du bandeau de re-entrée décrit ce qui est vrai, y compris quand ce nœud précis n’a jamais été ouvert', () => {
    const { unmount } = render(<DecisionNodeScreen nodeId={NOEUD_A.id} go={() => {}} />)
    fireEvent.change(champCiblePartagee(), { target: { value: '7' } })
    unmount()

    render(<DecisionNodeScreen nodeId={NOEUD_B.id} go={() => {}} />)
    expect(screen.getByText('Des valeurs de cette consultation pré-remplissent cet écran')).toBeTruthy()
    expect(screen.queryByText('Ce nœud a déjà été ouvert dans cette consultation')).toBeNull()
  })

  it('« Reprendre les valeurs de ce patient » lève la frontière, une fois, pour ce montage', () => {
    const { unmount } = render(<DecisionNodeScreen nodeId={NOEUD_A.id} go={() => {}} />)
    fireEvent.change(champCiblePartagee(), { target: { value: '7' } })
    unmount()

    const { container } = render(<DecisionNodeScreen nodeId={NOEUD_B.id} go={() => {}} />)
    fireEvent.click(screen.getByText('Reprendre les valeurs de ce patient'))

    expect(titresCartes(container).sort()).toEqual(['Option cible', 'Socle'])
    // La reprise elle-même n'est pas défaite : la valeur et sa mention restent affichées.
    expect(champCiblePartagee().value).toBe('7')
    expect(screen.getByText('· repris de votre saisie', { exact: false })).toBeTruthy()
    // Le choix a disparu : un clic suffit, pas un par re-rendu.
    expect(screen.queryByText('Reprendre les valeurs de ce patient')).toBeNull()
  })

  it('« Repartir de zéro » vide le formulaire ET purge la mémoire de session (même geste que « Nouveau patient »)', () => {
    const { unmount } = render(<DecisionNodeScreen nodeId={NOEUD_A.id} go={() => {}} />)
    fireEvent.change(champCiblePartagee(), { target: { value: '7' } })
    unmount()

    const { container } = render(<DecisionNodeScreen nodeId={NOEUD_B.id} go={() => {}} />)
    fireEvent.click(screen.getByText('Repartir de zéro'))

    expect(champCiblePartagee().value).toBe('')
    expect(screen.queryByText('· repris de votre saisie', { exact: false })).toBeNull()
    // Formulaire vide → `cible_partagee` reste sous 5 → seul le socle reste applicable.
    expect(titresCartes(container)).toEqual(['Socle'])

    // La mémoire de session est bien purgée : un nœud A ré-ouvert ensuite ne retrouve plus rien non plus.
    cleanup()
    render(<DecisionNodeScreen nodeId={NOEUD_A.id} go={() => {}} />)
    expect(champCiblePartagee().value).toBe('')
    expect(screen.queryByText('· repris de votre saisie', { exact: false })).toBeNull()
  })

  it('une saisie normale (navigation en avant) n’est jamais interceptée, même quand des valeurs sont reprises', () => {
    const { unmount } = render(<DecisionNodeScreen nodeId={NOEUD_A.id} go={() => {}} />)
    fireEvent.change(champCiblePartagee(), { target: { value: '7' } })
    unmount()

    const { container } = render(<DecisionNodeScreen nodeId={NOEUD_B.id} go={() => {}} />)
    // Le praticien MODIFIE la valeur reprise sur ce nœud : un geste réel, pas une ré-ouverture passive.
    fireEvent.change(champCiblePartagee(), { target: { value: '12' } })

    expect(screen.queryByText('Reprendre les valeurs de ce patient')).toBeNull()
    expect(titresCartes(container).sort()).toEqual(['Option cible', 'Socle'])
  })

  it('un nœud SANS aucune reprise (premier patient) ne montre jamais le choix', () => {
    // NOEUD_A, jamais ouvert avant dans cette session : rien à reprendre.
    const { container } = render(<DecisionNodeScreen nodeId={NOEUD_A.id} go={() => {}} />)
    expect(screen.queryByText('Reprendre les valeurs de ce patient')).toBeNull()
    expect(titresCartes(container)).toEqual(['Socle'])
  })
})

/**
 * HISTORIQUE DE CE `describe` — deux corrections successives sur le MÊME mécanisme, à connaître avant
 * de le retoucher (cf. aussi `esperanceVieDefault.ts`, docstring de `suggestionEsperanceVieSiApplicable`,
 * pour le détail complet) :
 *
 *  1. T-061 x T-057 (P8 · S2, 2026-07-30) — « Reprendre les valeurs de ce patient » levait la frontière
 *     de re-entrée SANS jamais relancer la suggestion auto d'espérance de vie : `esperance_vie` restait
 *     « à confirmer » pour un patient dont l'âge et la fragilité venaient pourtant d'être repris. Corrigé
 *     en faisant recalculer CE clic à partir des drivers repris.
 *  2. P12/S1 (2026-08-02) — ce recalcul pouvait faire CHANGER SILENCIEUSEMENT une suggestion déjà
 *     affichée, dès qu'un driver ne circule pas par la mémoire de session (`ASCVD_etablie`/
 *     `comorbidite_grave`, pas `partage: true` sur le nœud réel `cible-glycemique` — constat n° 2 de la
 *     recette du 2026-08-02). Un premier correctif (garde de complétude des 4 drivers) a lui-même cassé
 *     le nœud réel (ses deux critères portent `presomption_non: true`, jamais `touched`) — retiré au
 *     profit du remède retenu : **« Reprendre » ne recalcule plus jamais `esperance_vie`**. Le premier
 *     test ci-dessous, qui verrouillait le comportement (1), est donc ADAPTÉ pour verrouiller (2) à la
 *     place ; le second (garde-fou « choix manuel jamais écrasé ») reste inchangé — sa vérité ne dépend
 *     pas de ce que fait ce clic, seulement de l'état déjà repris à l'ouverture.
 *
 * `esperanceVie.test.tsx` (T-061) ne passe jamais par une reprise de session (nœud monté à neuf) ; les
 * tests du describe précédent ne portent que sur `cible_partagee`, un critère que `hasEsperanceVieCritere`
 * ne reconnaît pas. D'où ce couple de nœuds dédié (`NOEUD_ESP_A`/`NOEUD_ESP_B`, déclarés en tête de
 * fichier) et ce `describe` séparé plutôt que d'étendre le premier.
 */
describe('DecisionNodeScreen — la reprise ne recalcule plus la suggestion d’espérance de vie (P12/S1)', () => {
  it('« Reprendre les valeurs de ce patient » ne recalcule PLUS esperance_vie, même quand tous les drivers sont repris', () => {
    const { unmount } = render(<DecisionNodeScreen nodeId={NOEUD_ESP_A.id} go={() => {}} />)
    fireEvent.change(champAge(), { target: { value: '88' } })
    fireEvent.click(checkbox(/Fragilité/))
    fireEvent.click(checkbox(/Comorbidité grave/))
    unmount()

    render(<DecisionNodeScreen nodeId={NOEUD_ESP_B.id} go={() => {}} />)
    // Avant le clic : la frontière de re-entrée est affichée, rien n'a encore été (re)posé pour
    // `esperance_vie`.
    expect(screen.getByText('Reprendre les valeurs de ce patient')).toBeTruthy()
    expect(segmentEsperanceVie('Limitée').getAttribute('aria-pressed')).toBe('false')

    fireEvent.click(screen.getByText('Reprendre les valeurs de ce patient'))

    // LE REMÈDE (P12/S1, 2026-08-02) : même avec les QUATRE drivers effectivement repris (ce couple de
    // nœuds les déclare tous `partage: true`, cas le plus favorable qui soit), ce clic NE calcule plus
    // rien pour `esperance_vie` — la fonctionnalité livrée par T-061 x T-057 est délibérément retirée
    // (cf. docstring ci-dessus) au profit de la sûreté : le champ reste vide, le praticien répond
    // directement sur ce nœud.
    expect(segmentEsperanceVie('Limitée').getAttribute('aria-pressed')).toBe('false')
    expect(segmentEsperanceVie('Longue').getAttribute('aria-pressed')).toBe('false')
    expect(screen.queryByText('· calculé, à vérifier', { exact: false })).toBeNull()

    // Le praticien répond directement SUR CE NŒUD (B) : le chemin `handleCriteriaChange`, jamais touché
    // par ce retrait, calcule la suggestion normalement — la fonctionnalité T-061 reste intacte, seule la
    // reprise automatique a été retirée.
    fireEvent.click(checkbox(/Maladie cardiovasculaire/))
    expect(segmentEsperanceVie('Limitée').getAttribute('aria-pressed')).toBe('true')
    expect(screen.getByText('· calculé, à vérifier', { exact: false })).toBeTruthy()
  })

  it('ne recalcule pas esperance_vie si le praticien l’avait déjà choisie sur le nœud précédent', () => {
    const { unmount } = render(<DecisionNodeScreen nodeId={NOEUD_ESP_A.id} go={() => {}} />)
    fireEvent.change(champAge(), { target: { value: '88' } })
    fireEvent.click(checkbox(/Comorbidité grave/)) // driverait seul vers 'limitee'
    fireEvent.click(segmentEsperanceVie('Longue')) // mais le praticien choisit lui-même 'longue'
    unmount()

    render(<DecisionNodeScreen nodeId={NOEUD_ESP_B.id} go={() => {}} />)
    fireEvent.click(screen.getByText('Reprendre les valeurs de ce patient'))

    // La valeur REPRISE est un choix du praticien (D28) : la suggestion ne l'écrase jamais, ici pas plus
    // qu'à la saisie directe (comportement déjà verrouillé par `esperanceVie.test.tsx`, non régressé par
    // ce correctif).
    expect(segmentEsperanceVie('Longue').getAttribute('aria-pressed')).toBe('true')
    expect(segmentEsperanceVie('Limitée').getAttribute('aria-pressed')).toBe('false')
  })
})

/**
 * P12/S1 (2026-08-02) — DEUX RÉGRESSIONS SUR LE MÊME NŒUD RÉEL (`cible-glycemique`), CORRIGÉES L'UNE
 * APRÈS L'AUTRE LE MÊME JOUR. `NOEUD_CIBLE_A`/`NOEUD_CIBLE_B` (déclarés en tête de fichier) miment
 * l'encodage réel EXACT des quatre drivers (`partage` ET `presomption_non`) TEL QU'IL ÉTAIT ALORS, pas
 * une approximation — c'est précisément cette exactitude qui manquait à `NOEUD_ESP_A`/`NOEUD_ESP_B` du
 * describe précédent et qui a laissé passer la seconde régression en recette. **Depuis le 2026-08-07**
 * (arbitrage 1 de S14, P14/S17), le nœud réel a changé : `antecedent_cv` → `ASCVD_etablie`, désormais
 * `partage: true` — la fixture ci-dessous ne mime donc plus l'encodage ACTUEL, mais reste la protection
 * générique du même bug pour tout futur driver qui referait cette même asymétrie.
 *
 * 1. CONSTAT N° 2 (recette 2026-08-02) : nœud cible avec ☑ antécédent cardiovasculaire → espérance de
 *    vie « Intermédiaire ». On quitte le nœud, on y revient, on clique « Reprendre les valeurs de ce
 *    patient » → `ASCVD_etablie` (pas `partage: true` sur le nœud réel) revenait absent, et la
 *    suggestion se recalculait quand même sur ce dossier amputé, faisant flotter silencieusement
 *    l'espérance de vie affichée vers « Longue », badge `Recommandée` inchangé. Corrigé en retirant
 *    l'appel à la suggestion depuis ce chemin (cf. `esperanceVieDefault.ts` pour l'historique complet,
 *    y compris un premier correctif — une garde de complétude des drivers — tenté puis retiré).
 * 2. RÉGRESSION DE CE PREMIER CORRECTIF, mesurée au navigateur sur la vignette N2 (Âge → Ancienneté →
 *    « Rien à signaler ») : la garde de complétude ne pouvait JAMAIS être satisfaite sur le nœud réel,
 *    où `ASCVD_etablie`/`comorbidite_grave` portent `presomption_non: true` (un `bool` présumé est
 *    déterminé sans jamais être `touched` — « Rien à signaler » ne les touche donc jamais,
 *    `CriteriaForm.tsx` `boolsAConfirmer` filtrant sur `aConfirmer`). Le nœud le plus utilisé du produit
 *    ne rendait plus AUCUNE carte. Le second test ci-dessous verrouille exactement ce cas — le trou de
 *    couverture qui a laissé passer cette régression (aucun test existant, avant ce jour, ne combinait
 *    `presomption_non` et « Rien à signaler » sur les drivers d'espérance de vie).
 */
describe('DecisionNodeScreen — suggestion d’espérance de vie sur un nœud fidèle au nœud réel (P12/S1)', () => {
  it('constat n° 2 : aller-retour entre deux nœuds → la cible (l’espérance de vie suggérée) ne change pas', () => {
    const { unmount } = render(<DecisionNodeScreen nodeId={NOEUD_CIBLE_A.id} go={() => {}} />)
    // `age` (partagé, pour que la reprise ait quelque chose à proposer) + `ASCVD_etablie` coché — EXACTEMENT
    // le geste du constat n° 2, rien de plus (`fragilite`/`comorbidite_grave` restent à leur défaut, non
    // touchés : plus besoin de les déterminer explicitement, la garde de complétude a été retirée).
    fireEvent.change(champAge(), { target: { value: '45' } })
    fireEvent.click(checkbox(/Maladie cardiovasculaire/))

    // `ASCVD_etablie` seul (aucun autre facteur de gravité, âge < 75) → palier « intermédiaire »,
    // exactement le constat n° 2 de la recette.
    expect(segmentEsperanceVie('Intermédiaire').getAttribute('aria-pressed')).toBe('true')
    unmount()

    // « On va sur Traiter, on revient » — modélisé, comme le describe précédent, par une sortie/réouverture
    // (nœud à l'identique, id différent : le mécanisme testé est la mémoire de session, pas le contenu).
    render(<DecisionNodeScreen nodeId={NOEUD_CIBLE_B.id} go={() => {}} />)
    // `age` revient (partagé) ; `ASCVD_etablie` NE revient PAS (pas `partage: true`, exactement comme sur
    // `cible-glycemique`). Rien n'est encore (re)posé pour `esperance_vie` sur ce montage frais.
    expect(screen.getByText('Reprendre les valeurs de ce patient')).toBeTruthy()
    expect(segmentEsperanceVie('Intermédiaire').getAttribute('aria-pressed')).toBe('false')

    fireEvent.click(screen.getByText('Reprendre les valeurs de ce patient'))

    // LE REMÈDE : ce clic ne calcule plus RIEN pour `esperance_vie`, quel que soit ce qui a ou n'a pas
    // été repris — le champ reste VIDE, le praticien répond (R7), plutôt que de flotter en silence vers
    // « Longue » (le défaut du constat n° 2, badge `Recommandée` inchangé).
    expect(segmentEsperanceVie('Intermédiaire').getAttribute('aria-pressed')).toBe('false')
    expect(segmentEsperanceVie('Longue').getAttribute('aria-pressed')).toBe('false')
    expect(segmentEsperanceVie('Limitée').getAttribute('aria-pressed')).toBe('false')
    expect(screen.queryByText('· calculé, à vérifier', { exact: false })).toBeNull()
  })

  it('« Rien à signaler » déclenche la suggestion même quand les autres drivers portent presomption_non (trou de couverture qui a laissé passer la régression du 2026-08-02)', () => {
    render(<DecisionNodeScreen nodeId={NOEUD_CIBLE_A.id} go={() => {}} />)

    // Vignette N2 : Âge (59) → « Rien à signaler ». `comorbidite_grave`/`ASCVD_etablie` (presomption_non)
    // ne sont JAMAIS touchés par ce bouton — seule `fragilite` (décisive via `OPTION_FRAGILE`, SANS
    // presomption_non) l'est. Si une garde exigeait un jour que les QUATRE drivers soient `touched`, ce
    // test échouerait : c'est exactement le trou qui a laissé passer la régression mesurée au navigateur.
    fireEvent.change(champAge(), { target: { value: '59' } })
    fireEvent.click(screen.getByText('Rien à signaler'))

    // 59 ans (< 75), aucun facteur de gravité (fragilite confirmée « non » ; comorbidite_grave/
    // ASCVD_etablie présumés « non », jamais touchés) → palier « longue ».
    expect(segmentEsperanceVie('Longue').getAttribute('aria-pressed')).toBe('true')
    expect(screen.getByText('· calculé, à vérifier', { exact: false })).toBeTruthy()
  })
})
