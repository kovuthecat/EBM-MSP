import { useMemo, useState } from 'react'
import type { Navigation } from '../../shared/navigation'
import { ArgumentPanel } from '../components/ArgumentPanel'
import { buildDefaultCriteria, CriteriaForm } from '../components/CriteriaForm'
import { OptionCard } from '../components/OptionCard'
import { getNoeudById } from '../content/loadNodes'
import type { Criteria, CriteriaValue } from '../engine/conditions'
import { evaluateNode } from '../engine/evaluateNode'
import { ESPERANCE_VIE_DRIVERS, hasEsperanceVieCritere, suggestEsperanceVie } from '../lib/esperanceVieDefault'
import { formatDateRevue, labelForCritere, labelForDomaine } from '../lib/labels'
import './DecisionNodeScreen.css'

interface DecisionNodeScreenProps {
  nodeId: string | undefined
  go: Navigation['go']
}

/**
 * D3 — nœud interrogeable (S4.md T-006) : formulaire de critères → options applicables (moteur S3)
 * → argumentaire dépliable. Recalcule `evaluateNode` à chaque changement de critère (état éphémère,
 * `criteria`/`argOpen` en `useState` — aucune persistance, CLAUDE.md invariant 1). Les options
 * affichées viennent strictement du moteur (`evaluateNode(node, criteria)`, T-006 "Décision clé") ;
 * si le contenu et les critères sont incohérents (variable inconnue, etc.), `evaluateNode` lève une
 * `ConditionError` qui n'est volontairement pas capturée ici — propager l'erreur plutôt que
 * masquer un écart moteur/contenu (S4.md règle "Si bloqué" ; `engine/conditions.ts`).
 */
export function DecisionNodeScreen({ nodeId, go }: DecisionNodeScreenProps) {
  const node = nodeId ? getNoeudById(nodeId) : undefined

  const [criteria, setCriteria] = useState<Criteria>(() =>
    node ? buildDefaultCriteria(node.criteres_entree) : {},
  )
  // Critères déjà modifiés par l'utilisateur (T-009) : distingue une valeur par défaut (0, non
  // fiable cliniquement) d'une valeur réellement saisie, pour ne pas afficher un résultat basé sur
  // un âge/ancienneté resté à 0 sans que le praticien s'en rende compte.
  const [touched, setTouched] = useState<Set<string>>(() => new Set())
  const [argOpen, setArgOpen] = useState(false)

  const champsNumeriquesRequis = node
    ? node.criteres_entree.filter((critere) => critere.type === 'nombre').map((critere) => critere.nom)
    : []
  const champsNumeriquesManquants = champsNumeriquesRequis.filter((nom) => !touched.has(nom))
  const criteresPretsAEvaluer = champsNumeriquesManquants.length === 0

  const result = useMemo(() => {
    if (!node || !criteresPretsAEvaluer) return undefined
    return evaluateNode(node, criteria)
  }, [node, criteria, criteresPretsAEvaluer])

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

  const handleCriteriaChange = (nom: string, value: CriteriaValue) => {
    setTouched((previous) => new Set(previous).add(nom))
    setCriteria((previous) => {
      const next = { ...previous, [nom]: value }
      // Suggestion auto d'`esperance_vie` (non sourcée, cf. lib/esperanceVieDefault.ts) : ne
      // s'applique que tant que le praticien n'a pas choisi cette valeur lui-même, et se recalcule
      // seulement quand un critère dont elle dépend change (pas à chaque frappe non liée).
      const espChoisieAMain = touched.has('esperance_vie') || nom === 'esperance_vie'
      const dependClicheEsp = (ESPERANCE_VIE_DRIVERS as readonly string[]).includes(nom)
      if (!espChoisieAMain && dependClicheEsp && node && hasEsperanceVieCritere(node.criteres_entree)) {
        next.esperance_vie = suggestEsperanceVie(next)
      }
      return next
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
      <button type="button" className="decision-node__back" onClick={() => go('decisionDomains')}>
        ← Domaine : {labelForDomaine(node.domaine)}
      </button>
      <h1 className="decision-node__title">{node.titre}</h1>
      <p className="decision-node__population">{node.population_cible}</p>

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
            touched={touched}
            hints={
              hasEsperanceVieCritere(node.criteres_entree) && !touched.has('esperance_vie')
                ? { esperance_vie: 'Suggestion auto (âge, fragilité, comorbidité grave, antécédent CV) — à valider' }
                : undefined
            }
            onChange={handleCriteriaChange}
          />

          <div className="decision-node__section-title">Options applicables</div>
          {!criteresPretsAEvaluer ? (
            <p className="decision-node__empty">
              Renseignez {champsNumeriquesManquants.map(labelForCritere).join(', ')} pour afficher les
              options applicables.
            </p>
          ) : result && result.applicable.length > 0 ? (
            result.applicable.map((option, index) => (
              <OptionCard
                // `intitule` n'est pas garanti unique (cf. commentaire `EvaluateNodeResult` dans
                // `engine/evaluateNode.ts`) : on compose avec l'index pour une clé React sûre.
                key={`${index}-${option.intitule}`}
                option={option}
                isPrimary={index === 0}
                reasons={result.reasons.get(option) ?? []}
              />
            ))
          ) : (
            <p className="decision-node__empty">Aucune option ne correspond à ces critères.</p>
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
