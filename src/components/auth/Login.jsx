import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import './Login.css';

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

  useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, []);

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

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="gradient-overlay" />
      </div>

      <div className="login-card">
        <header className="login-header">
          <div className="user-icon-container">
            <Lock className="user-icon" aria-hidden />
          </div>
          <h1 className="login-title">Gestion Maintenance</h1>
          <p className="login-subtitle">Portail technicien — Connexion</p>
        </header>

        <form className="login-form" onSubmit={handleSubmit}>
          {error && (
            <div className="alert alert-error" role="alert">
              <AlertCircle size={16} aria-hidden />
              <span>{error}</span>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <div className="input-with-icon">
              <Mail className="input-icon" size={18} aria-hidden />
              <input
                type="email"
                id="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@it.com"
                required
                autoFocus
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="mot_de_passe">Mot de passe</label>
            <div className="input-with-icon">
              <Lock className="input-icon" size={18} aria-hidden />
              <input
                type="password"
                id="mot_de_passe"
                className="form-input"
                value={mot_de_passe}
                onChange={(e) => setMotDePasse(e.target.value)}
                placeholder="••••••••"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-options">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={loading}
              />
              Se souvenir de moi
            </label>
            <Link to="/login" className="forgot-password">Mot de passe oublié ?</Link>
          </div>

          <button type="submit" className="btn-login" disabled={loading}>
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <p className="login-hint">Test : admin@it.com / admin123</p>
      </div>
    </div>
  );
};

export default Login;
