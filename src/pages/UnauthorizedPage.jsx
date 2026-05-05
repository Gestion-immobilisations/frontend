// frontend/src/pages/UnauthorizedPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/unauthorized.css';

const UnauthorizedPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="unauthorized-page">
      <div className="unauthorized-container">
        <div className="error-icon">🔒</div>
        <h1>Accès non autorisé</h1>
        <p>
          Désolé, vous n'avez pas les permissions nécessaires 
          pour accéder à cette page.
        </p>
        
        {user && (
          <div className="user-info">
            <p><strong>Rôles assignés :</strong></p>
            <ul>
              {user.roles?.map((role) => (
                <li key={role}>{role}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="action-buttons">
          <button 
            onClick={() => navigate(-1)} 
            className="btn btn-secondary"
          >
            ← Retour
          </button>
          <button 
            onClick={() => navigate('/dashboard')} 
            className="btn btn-primary"
          >
            Aller au tableau de bord
          </button>
        </div>
      </div>
    </div>
  );
};

export default UnauthorizedPage;