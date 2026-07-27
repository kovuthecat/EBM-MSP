import { useDeferredValue, useMemo, useState } from 'react'
import type { Navigation } from '../../shared/navigation'
import { AlertList } from '../components/AlertList'
import { ArgumentPanel } from '../components/ArgumentPanel'
import { CadrageList } from '../components/CadrageList'
import { CriteriaForm } from '../components/CriteriaForm'
import { OptionCard } from '../components/OptionCard'
import { getModuleDuNoeud } from '../content/loadModules'
import { getNoeudById } from '../content/loadNodes'
import type { Criteria, CriteriaValue } from '../engine/conditions'
import { criteresPertinents } from '../engine/relevance'
import { describeReasons } from '../lib/conditionText'
import { ESPERANCE_VIE_DRIVERS, hasEsperanceVieCritere, suggestEsperanceVie } from '../lib/esperanceVieDefault'
import { buildDefaultCriteria, decisifsAConfirmer, reinitialiserChampsMasques, valeurParDefaut } from '../lib/formLayout'
import { partitionnerAffichage } from '../lib/replierAffichage'
import type { FamilleVue } from '../lib/vueDecision'
import { construireVueDecision } from '../lib/vueDecision'
import { formatDateRevue, labelForCritere, labelForDomaine } from '../lib/labels'
import './DecisionNodeScreen.css'

interface DecisionNodeScreenProps {
  nodeId: string | undefined
  go: Navigation['go']
}

/**
 * D3 — nœud interrogeable (S4.md T-006) : formulaire de critères → options applicables (moteur S3)
 * → argumentaire dépliable. Recalcule `construireVueDecision` à chaque changement de critère (état
 * éphémère, `criteria`/`argOpen` en `useState` — aucune persistance, CLAUDE.md invariant 1). Tout ce
 * qui est affiché vient strictement du modèle de vue (`lib/vueDecision.ts` `construireVueDecision`,
 * T-006 "Décision clé") ; si le contenu et les critères sont incohérents (variable inconnue, etc.),
 * le moteur sous-jacent (`evaluateNode`) lève une `ConditionError` qui n'est volontairement pas
 * capturée ici — propager l'erreur plutôt que masquer un écart moteur/contenu (S4.md règle "Si
 * bloqué" ; `engine/conditions.ts`).
 *
 * VALEUR INDÉTERMINÉE EN VIGUEUR (DECISIONS.md D20, `docs/decision/validation/chantier-2026-07-26/
 * SPEC-valeur-indeterminee.md` §2) : cet écran est celui qui alimente enfin `renseignes` — le moteur
 * (`evaluateNode`/`construireVueDecision`) et le calcul de pertinence (`criteresPertinents`) l'acceptaient
 * déjà en paramètre optionnel, mais aucun appelant ne le fournissait avant ce lot (repli « tout est
 * renseigné », comportement historique). `touched` (déjà présent, T-009) EST cet ensemble `renseignes` :
 * un critère « touché » par le praticien EST un critère « renseigné » — cf. `handleCriteriaChange`/
 * `handleCriteriaEffacer` ci-dessous pour la distinction saisi/vidé/jamais-touché qui rend cette
 * équivalence vraie (sans elle, vider un champ `nombre` laissait `touched` gonflé d'un « 0 » jamais
 * répondu, cf. défauts de recette 12.2/13.3).
 */
export function DecisionNodeScreen({ nodeId, go }: DecisionNodeScreenProps) {
  const node = nodeId ? getNoeudById(nodeId) : undefined
  // Module d'appartenance (D22), s'il existe : pilote UNIQUEMENT le lien de retour. Aucune donnée du
  // module n'entre dans l'évaluation — garde-fou R1, le nœud reste évaluable seul.
  const moduleDuNoeud = node ? getModuleDuNoeud(node) : undefined

  const [criteria, setCriteria] = useState<Criteria>(() =>
    node ? buildDefaultCriteria(node.criteres_entree) : {},
  )
  // Critères déjà modifiés par l'utilisateur (T-009) : distingue une valeur par défaut (0, non
  // fiable cliniquement) d'une valeur réellement saisie, pour ne pas afficher un résultat basé sur
  // un âge/ancienneté resté à 0 sans que le praticien s'en rende compte.
  const [touched, setTouched] = useState<Set<string>>(() => new Set())
  const [argOpen, setArgOpen] = useState(false)
  // R4 (`docs/decision/GRAMMAIRE-NOEUD.md`) : les options NON RETENUES (faute de condition) sont une
  // information d'EXPLICATION, consultée sur demande — fermée par défaut, jamais poussée à l'écran
  // (contrairement aux options ÉCARTÉES par une exclusion, information de SÉCURITÉ, toujours visibles).
  const [nonRetenuesOpen, setNonRetenuesOpen] = useState(false)

  // Les critères dérivés (ex. cible_atteinte = HbA1c_actuelle <= HbA1c_cible ; over_basalisation =
  // dose_basale_actuelle / poids > 0,5) sont recalculés depuis les primitives saisies AVANT l'évaluation
  // du moteur — le DSL de `conditions.ts` ne compare qu'`variable OP littéral` (engine/deriveCritere.ts).
  //
  // La reco est calculée en PERMANENCE (P3 · S7-ui Lot 3, « sans gate dur »). L'ancien gate — exiger que
  // TOUS les nombres référencés soient saisis avant d'afficher quoi que ce soit — contredisait le moteur
  // de pertinence : un champ pouvait être à la fois estompé « sans effet sur la reco » ET bloquant
  // (constaté sur `age`, référencé par le dérivé `terrain_fragile` mais non décisif pour le patient en
  // cours). Les deux notions sont désormais dérivées de la MÊME source — `criteresPertinents` — ce qui
  // rend cette contradiction impossible par construction : estompé ⟺ non pertinent, réclamé ⟺ pertinent.
  //
  // Modèle de vue UNIQUE (`lib/vueDecision.ts`) : l'écran ne calcule plus rien lui-même (ni
  // `groupesParFamille`, ni `computeBadges`, ni les doses `calculs`) — tout vient de `construireVueDecision`,
  // la même fonction pure que sérialise `engine/relevance.ts` pour la signature de pertinence.
  const vue = useMemo(() => {
    if (!node) return undefined
    // `touched` = `renseignes` (D20, cf. docstring de tête) : calculé sur `criteria` IMMÉDIAT, la même
    // source temporelle que `touched` — les deux avancent ensemble, jamais l'un en retard sur l'autre.
    return construireVueDecision(node, criteria, touched)
  }, [node, criteria, touched])

  // TEMPORISATION (tâche 6c, recette référent) : `criteresPertinents` perturbe le moteur une fois par
  // critère saisissable (plusieurs évaluations d'`evaluateNode` chacune) — recalculer à CHAQUE frappe sur
  // un `nombre` (ex. HbA1c) fait bouger l'estompage de champs plus haut dans le formulaire pendant que le
  // praticien tape encore, ce qui est déstabilisant (bug remonté : « modifier l'IMC active/désactive des
  // critères plus haut »). `useDeferredValue` laisse React prioriser la frappe (valeur affichée immédiate,
  // cf. `criteria` passé tel quel à `CriteriaForm`) et ne recalculer la pertinence qu'une fois le rythme de
  // saisie retombé — sans code de temporisation maison, sans changer `relevance.ts` (qui reste synchrone
  // et testable, la temporisation ne vit QUE dans cet écran).
  const criteriaDiffere = useDeferredValue(criteria)

  // Critères PERTINENTS pour ce patient (moteur `engine/relevance.ts`, refonte UI P3) : pilote l'estompage
  // des champs sans effet (remarque 6) et la reco « provisoire » (remarque 7). Calculé sur `criteriaDiffere`
  // (temporisé) : coût borné mais non négligeable (plusieurs évaluations du moteur déterministe par frappe).
  const pertinents = useMemo(() => {
    if (!node || node.criteres_entree.length === 0 || node.options.length === 0) return undefined
    // `touched` = `renseignes` (D20) transmis NON DIFFÉRÉ, comme `decisifsManquants` ci-dessous : seul
    // `criteria` (via `criteriaDiffere`) est temporisé (cf. commentaire au-dessus), `touched` ne l'est
    // jamais — sans quoi un champ tout juste répondu resterait vu « indéterminé » un instant de trop.
    return criteresPertinents(node, criteriaDiffere, touched)
  }, [node, criteriaDiffere, touched])

  // Décisifs encore non confirmés → tant qu'il en reste, la reco est « provisoire » (jamais bloquée).
  // Réclamé et estompé dérivent tous deux de `pertinents` (cf. `decisifsAConfirmer`) : un champ ne peut
  // plus être simultanément « sans effet » et exigé. Calculé sur la MÊME source différée que `pertinents`
  // (`criteriaDiffere`, pas `criteria`) : sinon la visibilité (immédiate) et la pertinence (temporisée)
  // pourraient transitoirement se contredire (ex. un champ tout juste démasqué mais pas encore réévalué).
  const decisifsManquants = useMemo(
    () => decisifsAConfirmer(node?.criteres_entree ?? [], criteriaDiffere, touched, pertinents),
    [node, criteriaDiffere, touched, pertinents],
  )

  if (!node) {
    return (
      <div className="decision-node decision-node--missing">
        <p>Nœud introuvable.</p>
        <button type="button" className="decision-node__back" onClick={() => go('decisionDomains')}>
          ← Retour aux algorithmes
        </button>
      </div>
    )
  }

  // Calculé en synchrone (pas via les updaters de `setState`) : la mise à jour de `touched` dépend du
  // résultat de celle de `criteria`, et faire transiter cette information par une variable mutée entre
  // deux updaters dépendrait de leur ordre d'exécution et casserait en StrictMode (double invocation).
  const handleCriteriaChange = (nom: string, value: CriteriaValue) => {
    const next = { ...criteria, [nom]: value }
    // Suggestion auto d'`esperance_vie` (non sourcée, cf. lib/esperanceVieDefault.ts) : ne
    // s'applique que tant que le praticien n'a pas choisi cette valeur lui-même, et se recalcule
    // seulement quand un critère dont elle dépend change (pas à chaque frappe non liée).
    const espChoisieAMain = touched.has('esperance_vie') || nom === 'esperance_vie'
    const dependClicheEsp = (ESPERANCE_VIE_DRIVERS as readonly string[]).includes(nom)
    if (!espChoisieAMain && dependClicheEsp && hasEsperanceVieCritere(node.criteres_entree)) {
      next.esperance_vie = suggestEsperanceVie(next)
    }

    // `renseignes` APRÈS ce changement (D20) : `nom` vient d'être répondu — calculé AVANT
    // `reinitialiserChampsMasques` pour que la visibilité en cascade voie déjà ce champ comme déterminé
    // (repli « visible » de `champEstVisible` sur un `visible_si` autrement indéterminé, sinon
    // inutilement pessimiste pour le champ qu'on vient tout juste de saisir).
    const renseignesApres = new Set(touched).add(nom)

    // Un champ que ce changement vient de MASQUER (`visible_si`) est remis à sa valeur par défaut : une
    // valeur invisible ne doit jamais continuer à piloter la reco (cf. `formLayout.ts`). Il redevient
    // aussi « non renseigné », sinon il passerait pour confirmé s'il réapparaissait plus tard.
    const { criteria: nettoye, reinitialises } = reinitialiserChampsMasques(node.criteres_entree, next, renseignesApres)
    setCriteria(nettoye)
    setTouched((previous) => {
      const suivant = new Set(previous).add(nom)
      for (const efface of reinitialises) suivant.delete(efface)
      return suivant
    })
  }

  /**
   * Champ `nombre` VIDÉ par le praticien (D20 R7, `CriteriaForm.tsx` `onEffacer` — défauts de recette
   * 12.2/13.3) : DISTINCT de `handleCriteriaChange` — sinon `Number('') = 0` ET `touched` marqué font
   * enregistrer un « 0 » comme une réponse confirmée (« 0 facteur de risque »), alors que le champ vient
   * précisément d'être vidé. `nom` RESSORT de `touched` (donc de `renseignes` transmis au moteur, cf.
   * `vue`/`pertinents` ci-dessus) : il redevient « jamais renseigné », jamais « réponse zéro ». La valeur
   * stockée retombe sur son défaut générique (`valeurParDefaut`, `lib/formLayout.ts`, même définition que
   * l'initialisation du formulaire et que la remise à zéro d'un champ masqué) — cohérence, même si sans
   * effet sur l'évaluation moteur tant que `nom` n'est plus dans `renseignes`.
   */
  const handleCriteriaEffacer = (nom: string) => {
    const critere = node.criteres_entree.find((c) => c.nom === nom)
    const next = critere ? { ...criteria, [nom]: valeurParDefaut(critere) } : criteria

    const renseignesApres = new Set(touched)
    renseignesApres.delete(nom)

    const { criteria: nettoye, reinitialises } = reinitialiserChampsMasques(node.criteres_entree, next, renseignesApres)
    setCriteria(nettoye)
    setTouched((previous) => {
      const suivant = new Set(previous)
      suivant.delete(nom)
      for (const efface of reinitialises) suivant.delete(efface)
      return suivant
    })
  }

  // « Rien à signaler » (tâche 4) : confirme d'un coup les drapeaux (`bool`) décisifs non renseignés
  // d'une section SANS changer leur valeur — ils restent à `false`, qui EST la réponse clinique (« non »).
  // Sans ce raccourci, ces critères resteraient éternellement « non confirmés » dans le compteur de la
  // reco provisoire dès lors que le praticien n'a — légitimement — rien à cocher.
  const handleConfirmerChamps = (noms: string[]) => {
    setTouched((previous) => {
      const suivant = new Set(previous)
      for (const nom of noms) suivant.add(nom)
      return suivant
    })
  }

  // Aucun nœud « à venir » n'existe réellement en contenu (P1 ne livre que cible-glycemique) : la
  // notion de nœud non détaillé du prototype (`detailed: false`, données figées) n'a pas
  // d'équivalent en contenu réel. Repli défensif générique (pas de connaissance d'id de nœud
  // particulier, DECISIONS.md D8) : un nœud sans critère ni option exploitable retombe sur le bloc
  // placeholder du prototype plutôt que de planter (le schéma impose `options.length >= 1`, ce cas
  // ne devrait donc jamais se produire avec un contenu valide — robustesse, pas un chemin attendu).
  const isPlaceholder = node.criteres_entree.length === 0 || node.options.length === 0

  return (
    <div className="decision-node">
      {/* Retour vers le MODULE quand le nœud en fait partie (D22) : sans cela, on quitterait le module
          dès le premier nœud ouvert et le second axe ne serait plus atteignable qu'en repassant par la
          liste — alors que travailler les deux axes dans la même consultation est le cas prévu. */}
      {moduleDuNoeud ? (
        <button
          type="button"
          className="decision-node__back"
          onClick={() => go('decisionModule', { moduleId: moduleDuNoeud.id })}
        >
          ← Module : {moduleDuNoeud.titre}
        </button>
      ) : (
        <button type="button" className="decision-node__back" onClick={() => go('decisionDomains')}>
          ← Domaine : {labelForDomaine(node.domaine)}
        </button>
      )}
      <h1 className="decision-node__title">{node.titre}</h1>
      <p className="decision-node__population">{node.population_cible}</p>

      {/* Cadrage (D24) : positions de lecture du nœud, vraies pour tous ses patients. Rendu AVANT le
          formulaire — donc avant toute saisie — parce qu'elles conditionnent la lecture des options,
          alors que les alertes (`AlertList`, sous le formulaire) dépendent de ce qui vient d'être saisi.
          Cette séparation dans la page est la contrepartie visible de la séparation des deux canaux. */}
      {node.cadrage && <CadrageList cadrage={node.cadrage} />}

      {isPlaceholder ? (
        <div className="decision-node__placeholder">
          <div className="decision-node__placeholder-title">Contenu détaillé à venir</div>
          <p className="decision-node__placeholder-text">
            Ce nœud suivra la même structure que « Cible glycémique » : formulaire de critères,
            options avec preuve et effet attendu, argumentaire déplié avec reco officielle vs
            position critique.
          </p>
        </div>
      ) : (
        <>
          <CriteriaForm
            criteresEntree={node.criteres_entree}
            criteria={criteria}
            criteriaGroupement={criteriaDiffere}
            touched={touched}
            pertinents={pertinents}
            aConfirmer={new Set(decisifsManquants)}
            hints={
              hasEsperanceVieCritere(node.criteres_entree) && !touched.has('esperance_vie')
                ? { esperance_vie: 'Suggestion auto (âge, fragilité, comorbidité grave, antécédent CV) — à valider' }
                : undefined
            }
            onConfirmerChamps={handleConfirmerChamps}
            onEffacer={handleCriteriaEffacer}
            onChange={handleCriteriaChange}
          />

          {vue && <AlertList alertes={vue.alertes} />}

          <div className="decision-node__section-title">
            {decisifsManquants.length > 0 ? 'Options applicables — provisoire' : 'Options applicables'}
          </div>
          {decisifsManquants.length > 0 && (
            <p className="decision-node__provisional">
              <strong>Reco provisoire</strong> — {decisifsManquants.length} critère
              {decisifsManquants.length > 1 ? 's décisifs non confirmés' : ' décisif non confirmé'} dans le
              formulaire ci-dessus : les mesures chiffrées y sont marquées « à confirmer », les drapeaux se
              confirment d'un clic par « Rien à signaler ». La recommandation peut encore changer.
            </p>
          )}
          {vue && vue.familles.some((famille) => famille.groupes.length > 0) ? (
            (() => {
              // Regroupement PAR FAMILLE (`Noeud.familles` si déclarées, sinon repli historique — cf.
              // `lib/vueDecision.ts` `construireVueDecision`, qui compose `groupesParFamille`) : une
              // section par famille, dans l'ORDRE EXPLICITE de `Noeud.familles` (plus un sous-produit de
              // l'ordre d'écriture des options), et à l'intérieur seulement, les groupes d'égalité rendus
              // côte à côte pour un rang fini partagé — jamais deux options de familles différentes, même
              // à rang égal (ce qui suggérerait à tort un choix exclusif entre deux gestes qui en réalité
              // se CUMULENT, ex. « introduire un iSGLT2 » et « réduire la posologie du sulfamide »). Repli
              // sans `famille` déclarée (les 4 autres nœuds actuels) : une unique famille sans libellé,
              // rendu identique à l'ancien comportement à plat. Le badge (« le badge, c'est le plan »,
              // 2026-07-25) et les doses calculées sont déjà résolus dans `vue` — l'écran ne calcule plus
              // rien, il assemble.
              let cle = 0
              // Extrait en fonction le 2026-07-27 (repli d'affichage) : le même rendu sert maintenant DEUX
              // fois — les pistes du meilleur rang, puis celles repliées derrière le bouton. Le corps est
              // rigoureusement inchangé ; seule la source des familles devient un paramètre.
              const rendreFamilles = (familles: FamilleVue[]) => familles.map((famille, indexFamille) => {
                const sectionsGroupes = famille.groupes.map((groupe) => {
                  const cartes = groupe.map((optionVue) => (
                    <OptionCard
                      // `intitule` n'est pas garanti unique (cf. commentaire `EvaluateNodeResult` dans
                      // `engine/evaluateNode.ts`) : on compose avec un compteur pour une clé React sûre.
                      key={`${cle++}-${optionVue.option.intitule}`}
                      option={optionVue.option}
                      badge={optionVue.badge}
                      reasons={optionVue.reasons}
                      calculs={optionVue.calculs}
                      motifRang={optionVue.motifRang}
                      alertes={optionVue.alertes}
                    />
                  ))
                  if (groupe.length < 2) return cartes
                  return (
                    <div className="decision-node__egalite" key={`egalite-${cle}`}>
                      {/* Mention NEUTRE (correctif « priorité multi-natures ») : elle affirmait avant
                          « aucune de ces options n'est préférable à l'autre », faux pour des gestes
                          cumulables. La nuance « en choisir un » / « cumulables » est désormais portée
                          par le TITRE DE FAMILLE (mention générique dérivée de `exclusive`, ci-dessous),
                          jamais par cet encadré générique. */}
                      <p className="decision-node__egalite-mention">À égalité — même niveau de priorité.</p>
                      <div className="decision-node__egalite-grid">{cartes}</div>
                    </div>
                  )
                })
                if (famille.libelle == null) return sectionsGroupes
                return (
                  <div className="decision-node__famille" key={`famille-${indexFamille}-${famille.libelle}`}>
                    <div className="decision-node__famille-titre">
                      {famille.libelle}
                      {/* Mention d'interface GÉNÉRIQUE dérivée de `exclusive` (correctif « libellés
                          sans redondance », 2026-07-25) : jamais un vocabulaire clinique, juste la
                          convention « on choisit un » vs « tout est à faire ». Absente si `exclusive`
                          est `undefined` (nœud sans `familles` déclarées, repli). */}
                      {famille.exclusive === true && (
                        <span className="decision-node__famille-mention"> — en choisir un</span>
                      )}
                      {famille.exclusive === false && (
                        <span className="decision-node__famille-mention"> — gestes cumulables</span>
                      )}
                    </div>
                    {sectionsGroupes}
                  </div>
                )
              })
              // DETTE « PLAFOND D'AFFICHAGE » levée ici (décision référent 2026-07-27). La partition est
              // calculée par `lib/replierAffichage.ts`, testé à part : c'est la seule pièce de cet écran
              // dont une erreur ferait DISPARAÎTRE une option des yeux d'un prescripteur. Rien n'est
              // retiré — `principales ∪ repliees` est exactement `vue.familles`, et le bouton porte le
              // compte exact de ce qu'il cache.
              // ⚠ REPLI NEUTRALISÉ le 2026-07-27 (soir) — DÉFAUT DE SÉCURITÉ AVÉRÉ, dans mon
              // implémentation et non dans la décision référent qui l'a demandé.
              //
              // CE QUI S'EST PASSÉ. `partitionnerAffichage` déplie le MEILLEUR rang et replie le reste.
              // J'avais écrit dans la recette : « les cartes de sécurité sont toutes au rang 1, donc
              // dépliées par construction ». C'est faux : le socle metformine de `prescription` porte
              // `priorite: 0` avec une condition « toujours », si bien que `Math.min` en fait le meilleur
              // rang et que TOUT le reste passe derrière le bouton.
              // Contre-exemple exécuté (58 ans, metformine + sulfamide, cétonémie CONFIRMÉE, ASCVD,
              // insuffisance cardiaque, HbA1c 9) : l'écran n'affichait QU'UNE carte — « Metformine, socle
              // du traitement » — et repliait « Insuline d'initiation (état catabolique) », rang 1, qui
              // est la réponse de sécurité à ce tableau.
              // La cause de fond dépasse le correctif : `priorite` a été écrit comme un ordre de TRI
              // (D13/D14) et je l'ai transformé en porte d'AFFICHAGE, sans relire à cette aune un seul
              // contenu du domaine. Rang 0 n'y veut pas dire « le plus important » mais « socle ».
              //
              // POURQUOI NEUTRALISER PLUTÔT QUE RUSER. Ajouter une heuristique non relue sur un chemin
              // d'affichage de sécurité, le soir, est exactement la manœuvre qui a produit ce défaut.
              // L'écran revient donc au comportement de ce matin — tout est affiché — qui est strictement
              // plus sûr. Le module `lib/replierAffichage.ts` et ses tests restent en place, intacts :
              // la fonction est correcte pour ce qu'elle fait, c'est son USAGE qui était mal fondé.
              // À rouvrir avec le référent, sur la question de fond : quel signal du contenu dit qu'une
              // carte ne peut pas être repliée ? (la famille ? une alerte portée ? un champ dédié ?)
              const REPLI_ACTIF = false
              const { principales, repliees, nbRepliees } = partitionnerAffichage(vue)
              if (!REPLI_ACTIF || nbRepliees === 0) return rendreFamilles(vue.familles)
              return (
                <>
                  {rendreFamilles(principales)}
                  <details className="decision-node__repli">
                    <summary className="decision-node__repli-resume">
                      Autres pistes possibles ({nbRepliees})
                    </summary>
                    <p className="decision-node__repli-mention">
                      Ces pistes sont applicables à ce patient, à un rang moins prioritaire que celles
                      ci-dessus. Elles ne sont pas écartées — elles sont repliées parce qu'une consultation
                      ne permet d'en négocier que deux ou trois.
                    </p>
                    {rendreFamilles(repliees)}
                  </details>
                </>
              )
            })()
          ) : vue && vue.enAttente.length > 0 ? null : ( // le bloc EN ATTENTE ci-dessous explique déjà l'état — jamais les deux messages à la fois (D20 R7, tâche 3).
            <p className="decision-node__empty">Aucune option ne correspond à ces critères.</p>
          )}

          {/* D20 R7 (SPEC-valeur-indeterminee.md §2.5, quatrième registre distinct des trois ci-dessous) —
              EN ATTENTE : ni proposée ni écartée, un ou plusieurs critères manquent pour trancher. Poussé
              comme `ecartees` (jamais replié) : c'est une QUESTION posée au praticien, pas une erreur — sur
              formulaire vierge, c'est ce bloc qui prend le relais du panneau de résultats vide (ci-dessus),
              plutôt qu'un « Aucune option ne correspond » qui affirmerait à tort une conclusion négative. */}
          {vue && vue.enAttente.length > 0 && (
            <div className="decision-node__en-attente">
              <div className="decision-node__en-attente-titre">
                En attente — critère{vue.enAttente.length > 1 ? 's' : ''} à renseigner pour trancher
              </div>
              {vue.enAttente.map((attente, index) => (
                <p key={`${index}-${attente.option.intitule}`} className="decision-node__en-attente-item">
                  <strong>{attente.option.intitule}</strong> — à renseigner :{' '}
                  {attente.manquants.map(labelForCritere).join(', ')}
                </p>
              ))}
            </div>
          )}

          {/* R4 — ÉCARTÉES (sécurité) : l'option était indiquée, une exclusion l'a retirée. Toujours
              visible, discrètement, sous le panneau de résultats — jamais en silence (D13/R4). */}
          {vue && vue.ecartees.length > 0 && (
            <div className="decision-node__ecartees">
              {vue.ecartees.map((ecartee, index) => (
                <p key={`${index}-${ecartee.option.intitule}`} className="decision-node__ecartee">
                  {ecartee.option.intitule} écarté : {describeReasons(ecartee.motifs)}
                </p>
              ))}
            </div>
          )}

          {/* R4 — NON RETENUES (explication) : l'option n'était pas indiquée pour ce patient. Consultée
              sur demande seulement — sur un nœud à 22 options, la pousser rendrait l'écran illisible. */}
          {vue && vue.nonRetenues.length > 0 && (
            <div className="decision-node__non-retenues">
              <button
                type="button"
                className="decision-node__non-retenues-toggle"
                aria-expanded={nonRetenuesOpen}
                onClick={() => setNonRetenuesOpen((open) => !open)}
              >
                {nonRetenuesOpen ? 'Masquer les autres options' : 'Pourquoi pas d’autres options ?'}
              </button>
              {nonRetenuesOpen && (
                <div className="decision-node__non-retenues-liste">
                  {vue.nonRetenues.map((nonRetenue, index) => (
                    <p key={`${index}-${nonRetenue.option.intitule}`} className="decision-node__non-retenue">
                      {nonRetenue.option.intitule} : {describeReasons([nonRetenue.condition])}
                    </p>
                  ))}
                </div>
              )}
            </div>
          )}

          <button
            type="button"
            className="decision-node__toggle-argument"
            onClick={() => setArgOpen((open) => !open)}
          >
            {argOpen ? "Replier l'argumentaire" : "Déplier l'argumentaire"}
          </button>

          {argOpen && <ArgumentPanel node={node} />}
        </>
      )}

      <div className="decision-node__footer">
        Révisé le {formatDateRevue(node.meta.date_revue)} · Aide à la décision fondée sur l'EBM — le
        praticien reste le lien avec le patient et le seul responsable de la décision.
      </div>
    </div>
  )
}
