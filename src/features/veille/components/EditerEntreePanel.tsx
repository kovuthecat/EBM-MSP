import { useEffect, useState } from 'react'
import type { EntreeVeille, NiveauImpact, NiveauPreuveVeille } from '../content/entree.types'
import type { VeilleOverride } from '../lib/overrides'
import { deleteOverride, saveOverride } from '../lib/overrides'
import './EditerEntreePanel.css'

/**
 * Formulaire d'édition référent d'une entrée de veille (D64, 2026-08-14) — corrige un sous-ensemble
 * de champs (titre, résumé, analyse, badges, tags) SANS toucher au YAML source, via
 * `public.veille_entree_overrides` (`src/features/veille/lib/overrides.ts`, cf. sa docstring pour
 * l'articulation avec le contenu versionné).
 *
 * Conventions calquées sur `FeedbackWidget.tsx` (même overlay, mêmes tokens, mêmes états
 * submitting/error) — seul le contenu du formulaire diffère.
 *
 * `entreeFusionnee` = la valeur ACTUELLEMENT affichée (YAML + override déjà appliqué), jamais le YAML
 * brut : le formulaire s'ouvre sur ce que le référent voit à l'écran, pas sur une version qu'un
 * override précédent aurait déjà corrigée sous ses yeux.
 */
const THEME_LABELS: Record<string, string> = {
  'soins-premiers': 'Soins premiers',
  'diabete-metabolisme': 'Diabète et métabolisme',
  'cardiovasculaire-prevention': 'Cardiovasculaire et prévention',
  'bpco-pneumo': 'BPCO et pneumologie',
  'infectiologie-antibiotherapie': 'Infectiologie et antibiothérapie',
  'geriatrie-deprescription': 'Gériatrie et déprescription',
  pediatrie: 'Pédiatrie',
  'prevention-depistage-vaccination': 'Prévention, dépistage, vaccination',
  'sante-mentale-addictologie': 'Santé mentale et addictologie',
  'douleur-soins-palliatifs': 'Douleur et soins palliatifs',
  ETP: 'Éducation thérapeutique',
  'sante-femme-perinatalite': 'Santé de la femme et périnatalité',
  orthophonie: 'Orthophonie',
  'soins-infirmiers': 'Soins infirmiers',
}

const NIVEAU_PREUVE_LABELS: Record<NiveauPreuveVeille, string> = {
  eleve: 'Élevée',
  modere: 'Modérée',
  faible: 'Faible',
  tres_faible: 'Très faible',
}

interface EditerEntreePanelProps {
  entreeFusionnee: EntreeVeille
  /** `true` si un override existe déjà pour cette entrée — affiche le bouton « Rétablir l'origine ». */
  aUnOverride: boolean
  professionsConnues: string[]
  onFermer: () => void
  /** Notifie le parent une fois l'enregistrement (ou le retrait) réussi, pour mettre à jour son état local. */
  onEnregistre: (override: VeilleOverride | null) => void
}

export function EditerEntreePanel({
  entreeFusionnee,
  aUnOverride,
  professionsConnues,
  onFermer,
  onEnregistre,
}: EditerEntreePanelProps) {
  const [titre, setTitre] = useState(entreeFusionnee.titre)
  const [resume, setResume] = useState(entreeFusionnee.resultat_resume)
  const [analyse, setAnalyse] = useState(entreeFusionnee.appreciation_critique ?? '')
  const [niveauImpact, setNiveauImpact] = useState<NiveauImpact>(entreeFusionnee.niveau_impact)
  const [niveauPreuve, setNiveauPreuve] = useState<NiveauPreuveVeille | ''>(
    entreeFusionnee.niveau_preuve ?? '',
  )
  const [themes, setThemes] = useState<string[]>(entreeFusionnee.themes)
  const [professions, setProfessions] = useState<string[]>(entreeFusionnee.professions_concernees)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Une BRÈVE ne porte aucune appréciation critique propre (SOP §5bis, `entree.types.ts` docstring) —
  // le champ reste donc masqué à l'édition pour ce format, pas seulement à l'affichage.
  const peutEditerAnalyse = entreeFusionnee.route === 'analyse'

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onFermer()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onFermer])

  const toggleTheme = (slug: string) => {
    setThemes((precedent) =>
      precedent.includes(slug) ? precedent.filter((t) => t !== slug) : [...precedent, slug],
    )
  }

  const toggleProfession = (profession: string) => {
    setProfessions((precedent) =>
      precedent.includes(profession)
        ? precedent.filter((p) => p !== profession)
        : [...precedent, profession],
    )
  }

  const handleEnregistrer = async () => {
    if (!titre.trim() || !resume.trim()) {
      setError('Le titre et le résumé ne peuvent pas être vides.')
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      const champs: VeilleOverride = {
        titre: titre.trim(),
        resultat_resume: resume.trim(),
        appreciation_critique: peutEditerAnalyse ? analyse.trim() || null : null,
        niveau_impact: niveauImpact,
        niveau_preuve: niveauPreuve || null,
        themes,
        professions_concernees: professions,
      }
      await saveOverride(entreeFusionnee.id, champs)
      onEnregistre(champs)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Échec de l'enregistrement. Réessayez.")
    } finally {
      setSubmitting(false)
    }
  }

  const handleRetablirOrigine = async () => {
    setSubmitting(true)
    setError(null)
    try {
      await deleteOverride(entreeFusionnee.id)
      onEnregistre(null)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Échec du retrait. Réessayez.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="editer-entree__overlay" onClick={onFermer}>
      <div className="editer-entree__panel" onClick={(event) => event.stopPropagation()}>
        <div className="editer-entree__title">Modifier cette entrée</div>
        <p className="editer-entree__subtitle">
          Ce correctif s'affiche immédiatement à tous ; il ne modifie pas le fichier source de
          l'entrée.
        </p>

        <label className="editer-entree__champ">
          <span>Titre</span>
          <input type="text" value={titre} onChange={(event) => setTitre(event.target.value)} />
        </label>

        <label className="editer-entree__champ">
          <span>Résumé</span>
          <textarea
            className="editer-entree__textarea"
            value={resume}
            onChange={(event) => setResume(event.target.value)}
          />
        </label>

        {peutEditerAnalyse ? (
          <label className="editer-entree__champ">
            <span>Appréciation critique</span>
            <textarea
              className="editer-entree__textarea editer-entree__textarea--haute"
              value={analyse}
              onChange={(event) => setAnalyse(event.target.value)}
            />
          </label>
        ) : (
          <p className="editer-entree__note">
            Format « brève » : aucune appréciation critique propre n'est éditable ici (SOP §5bis).
          </p>
        )}

        <div className="editer-entree__ligne">
          <label className="editer-entree__champ editer-entree__champ--moitie">
            <span>Impact</span>
            <select
              value={niveauImpact}
              onChange={(event) => setNiveauImpact(event.target.value as NiveauImpact)}
            >
              <option value="pratique">Change la pratique</option>
              <option value="informatif">Informatif</option>
            </select>
          </label>

          <label className="editer-entree__champ editer-entree__champ--moitie">
            <span>Niveau de preuve</span>
            <select
              value={niveauPreuve}
              onChange={(event) => setNiveauPreuve(event.target.value as NiveauPreuveVeille | '')}
            >
              <option value="">— (aucun)</option>
              {(Object.keys(NIVEAU_PREUVE_LABELS) as NiveauPreuveVeille[]).map((niveau) => (
                <option key={niveau} value={niveau}>
                  {NIVEAU_PREUVE_LABELS[niveau]}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="editer-entree__champ">
          <span>Thèmes</span>
          <div className="editer-entree__chips">
            {Object.entries(THEME_LABELS).map(([slug, label]) => (
              <button
                key={slug}
                type="button"
                className={
                  themes.includes(slug)
                    ? 'editer-entree__chip editer-entree__chip--actif'
                    : 'editer-entree__chip'
                }
                onClick={() => toggleTheme(slug)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="editer-entree__champ">
          <span>Professions concernées</span>
          <div className="editer-entree__chips">
            {professionsConnues.map((profession) => (
              <button
                key={profession}
                type="button"
                className={
                  professions.includes(profession)
                    ? 'editer-entree__chip editer-entree__chip--actif'
                    : 'editer-entree__chip'
                }
                onClick={() => toggleProfession(profession)}
              >
                {profession}
              </button>
            ))}
          </div>
        </div>

        {error && <p className="editer-entree__error">{error}</p>}

        <div className="editer-entree__actions">
          {aUnOverride && (
            <button
              type="button"
              className="editer-entree__ghost editer-entree__ghost--danger"
              onClick={() => void handleRetablirOrigine()}
              disabled={submitting}
            >
              Rétablir la version d'origine
            </button>
          )}
          <div className="editer-entree__actions-droite">
            <button
              type="button"
              className="editer-entree__ghost"
              onClick={onFermer}
              disabled={submitting}
            >
              Annuler
            </button>
            <button
              type="button"
              className="editer-entree__primary"
              onClick={() => void handleEnregistrer()}
              disabled={submitting}
            >
              {submitting ? 'Enregistrement…' : 'Enregistrer'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
