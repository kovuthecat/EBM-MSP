import { useState } from 'react'
import type { Navigation } from '../navigation'
import { seConnecter, useUtilisateur } from '../lib/auth'
import { MEMBER_LOGINS, emailForPrenom } from '../lib/memberLogins'
import { Icon } from '../icons/Icon'
import './AuthScreen.css'

interface AuthScreenProps {
  go: Navigation['go']
}

/**
 * S5 — Connexion (D51, 2026-08-06) : PRÉNOM (menu déroulant) + mot de passe, même mécanisme et
 * mêmes comptes que `annuaire-msp` (même projet Supabase — cf. `lib/supabase.ts`,
 * `lib/memberLogins.ts` : « reprends le système », demande utilisateur). Le prénom choisi est
 * traduit en email avant `signInWithPassword` — Supabase Auth reste par email en interne, comme
 * dans l'annuaire. Concerne UNIQUEMENT le module Veille (garder/masquer une entrée, retour signé) :
 * le module Décision reste utilisable sans connexion, aucune fonctionnalité clinique n'en dépend.
 *
 * Écran CHROMELESS (`isChromeless`, `shared/navigation.ts`, comme `home`) : pas de header ni de
 * bandeau disclaimer, un simple lien de retour porte la sortie.
 */
export function AuthScreen({ go }: AuthScreenProps) {
  const utilisateur = useUtilisateur()
  const [prenom, setPrenom] = useState('')
  const [motDePasse, setMotDePasse] = useState('')
  const [enCours, setEnCours] = useState(false)
  const [erreur, setErreur] = useState<string | null>(null)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setErreur(null)
    const email = emailForPrenom(prenom)
    if (!email) {
      setErreur('Choisissez votre prénom dans la liste.')
      return
    }
    setEnCours(true)
    const message = await seConnecter(email, motDePasse)
    setEnCours(false)
    if (message) {
      setErreur(
        message === 'Invalid login credentials'
          ? 'Mot de passe incorrect.'
          : message,
      )
      return
    }
    go('veilleList')
  }

  return (
    <div className="auth-screen">
      <button type="button" className="auth-screen__back" onClick={() => go('home')}>
        <Icon nom="chevron-gauche" taille={16} />
        Accueil
      </button>

      <div className="auth-screen__card">
        <h1 className="auth-screen__title">Connexion</h1>
        <p className="auth-screen__subtitle">
          Réservée aux professionnels de santé de la MSP — mêmes identifiants que l'annuaire.
        </p>

        {utilisateur ? (
          <p className="auth-screen__connecte">
            Déjà connecté(e) en tant que <strong>{utilisateur.email}</strong>.
          </p>
        ) : (
          <form className="auth-screen__form" onSubmit={handleSubmit}>
            <label className="auth-screen__field">
              <span>Prénom</span>
              <select
                required
                value={prenom}
                onChange={(event) => setPrenom(event.target.value)}
              >
                <option value="" disabled>
                  Choisissez votre prénom…
                </option>
                {MEMBER_LOGINS.map((membre) => (
                  <option key={membre.email} value={membre.prenom}>
                    {membre.prenom}
                  </option>
                ))}
              </select>
            </label>
            <label className="auth-screen__field">
              <span>Mot de passe</span>
              <input
                type="password"
                autoComplete="current-password"
                required
                value={motDePasse}
                onChange={(event) => setMotDePasse(event.target.value)}
              />
            </label>

            {erreur && <p className="auth-screen__erreur">{erreur}</p>}

            <button type="submit" className="auth-screen__submit" disabled={enCours}>
              {enCours ? 'Connexion…' : 'Se connecter'}
            </button>
          </form>
        )}

        <p className="auth-screen__note">
          Pas encore de compte ? Un référent de la MSP peut vous inviter depuis l'annuaire — les
          deux outils partagent les mêmes comptes.
        </p>
      </div>
    </div>
  )
}
