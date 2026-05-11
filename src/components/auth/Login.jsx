// frontend/src/components/auth/Login.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Login.css';

const MailIcon = () => (
  <svg className="af-login__field-icon" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
  </svg>
);

const LockIcon = () => (
  <svg className="af-login__field-icon" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
    <path
      fillRule="evenodd"
      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
      clipRule="evenodd"
    />
  </svg>
);

const ShieldIcon = () => (
  <svg className="af-login__sso-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const Login = () => {
  const [email, setEmail] = useState('');
  const [mot_de_passe, setMotDePasse] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, mot_de_passe);

    if (result.success) {
      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
        localStorage.setItem('rememberedEmail', email);
      } else {
        localStorage.removeItem('rememberMe');
        localStorage.removeItem('rememberedEmail');
      }
      navigate(from, { replace: true });
    } else {
      setError(result.error || 'Email ou mot de passe incorrect');
    }

    setLoading(false);
  };

  useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, []);

  return (
    <div className="af-login">
      <div className="af-login__card" role="main">
        <aside className="af-login__hero" aria-label="Présentation">
          <div className="af-login__hero-overlay" />
          <div className="af-login__hero-inner">
            <div className="af-login__logo" aria-hidden />
            <h1 className="af-login__hero-title">Optimisez la gestion de vos actifs</h1>
            <p className="af-login__hero-text">
              Une solution complète pour le suivi, l&apos;inventaire et l&apos;amortissement de vos
              immobilisations en temps réel.
            </p>
          </div>
        </aside>

        <div className="af-login__panel">
          <div className="af-login__panel-body">
            <header className="af-login__header">
              <h2 className="af-login__title">Bienvenue sur AssetFlow</h2>
              <p className="af-login__subtitle">Connectez-vous pour gérer vos immobilisations</p>
            </header>

            <form onSubmit={handleSubmit} className="af-login__form" noValidate>
              {error && (
                <div className="af-login__alert" role="alert">
                  <svg className="af-login__alert-icon" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {error}
                </div>
              )}

              <div className="af-login__field">
                <label className="af-login__label" htmlFor="email">
                  Adresse e-mail
                </label>
                <div className="af-login__input-wrap">
                  <MailIcon />
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nom@entreprise.fr"
                    required
                    autoComplete="email"
                    autoFocus
                    disabled={loading}
                    className="af-login__input"
                  />
                </div>
              </div>

              <div className="af-login__field">
                <div className="af-login__label-row">
                  <label className="af-login__label" htmlFor="mot_de_passe">
                    Mot de passe
                  </label>
                  <Link to="/forgot-password" className="af-login__link-forgot">
                    Mot de passe oublié ?
                  </Link>
                </div>
                <div className="af-login__input-wrap">
                  <LockIcon />
                  <input
                    type="password"
                    id="mot_de_passe"
                    value={mot_de_passe}
                    onChange={(e) => setMotDePasse(e.target.value)}
                    placeholder="••••••••"
                    required
                    autoComplete="current-password"
                    disabled={loading}
                    className="af-login__input"
                  />
                </div>
              </div>

              <label className="af-login__remember">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={loading}
                  className="af-login__checkbox"
                />
                <span>Rester connecté</span>
              </label>

              <button type="submit" className="af-login__submit" disabled={loading}>
                {loading ? (
                  <span className="af-login__spinner-wrap" aria-live="polite">
                    <svg className="af-login__spinner" viewBox="0 0 24 24" aria-hidden>
                      <circle
                        className="af-login__spinner-circle"
                        cx="12"
                        cy="12"
                        r="10"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                      />
                    </svg>
                  </span>
                ) : (
                  'Se connecter'
                )}
              </button>

              <div className="af-login__divider">
                <span className="af-login__divider-line" />
                <span className="af-login__divider-text">OU</span>
                <span className="af-login__divider-line" />
              </div>

              <button
                type="button"
                className="af-login__sso"
                disabled={loading}
                title="SSO non configuré pour le moment"
              >
                <ShieldIcon />
                Continuer avec SSO d&apos;entreprise
              </button>
            </form>
          </div>

          <footer className="af-login__footer">
            <span className="af-login__copyright">© 2026 AssetFlow Inc.</span>
            <nav className="af-login__footer-links" aria-label="Liens pied de page">
              <a href="#" className="af-login__footer-link">
                Confidentialité
              </a>
              <a href="#" className="af-login__footer-link">
                Conditions
              </a>
              <a href="#" className="af-login__footer-link">
                Support
              </a>
            </nav>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Login;
