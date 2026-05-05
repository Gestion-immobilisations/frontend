// frontend/src/routes/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { authenticated, user, loading } = useAuth();
  const location = useLocation();

  console.log('🔍 ProtectedRoute - État:', { authenticated, user, loading, allowedRoles });

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Chargement...</p>
      </div>
    );
  }

  if (!authenticated) {
    console.log('❌ Non authentifié - Redirection vers login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // ✅ Si aucun rôle n'est requis, accès accordé
  if (!allowedRoles || allowedRoles.length === 0) {
    console.log('✅ Accès accordé - Aucun rôle requis');
    return children;
  }

  // ✅ Fonction pour normaliser un rôle
  const normalizeRole = (role) => {
    if (!role) return '';
    return String(role).trim().toUpperCase();
  };

  // ✅ Récupération et normalisation des rôles utilisateur
  let userRoles = [];
  
  if (user) {
    // Cas 1: user.roles est un tableau
    if (Array.isArray(user.roles)) {
      userRoles = user.roles;
    }
    // Cas 2: user.roles est une chaîne
    else if (typeof user.roles === 'string') {
      userRoles = [user.roles];
    }
    // Cas 3: user.role existe
    else if (user.role) {
      userRoles = [user.role];
    }
  }
  
  // ✅ Si userRoles est vide, essayer depuis localStorage directement
  if (userRoles.length === 0) {
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        if (Array.isArray(parsedUser.roles)) {
          userRoles = parsedUser.roles;
        } else if (typeof parsedUser.roles === 'string') {
          userRoles = [parsedUser.roles];
        } else if (parsedUser.role) {
          userRoles = [parsedUser.role];
        }
      }
    } catch (e) {
      console.error('Erreur lecture localStorage:', e);
    }
  }
  
  // ✅ Normalisation des rôles
  userRoles = userRoles.map(normalizeRole).filter(r => r !== '');
  const normalizedAllowedRoles = allowedRoles.map(normalizeRole).filter(r => r !== '');
  
  // ✅ Vérifier si l'utilisateur a au moins un des rôles requis
  const hasAccess = normalizedAllowedRoles.some(allowedRole => 
    userRoles.includes(allowedRole)
  );
  
  console.log('🔍 Vérification accès:', {
    userRolesRaw: user.roles,
    userRolesNormalized: userRoles,
    allowedRolesRaw: allowedRoles,
    allowedRolesNormalized: normalizedAllowedRoles,
    hasAccess
  });
  
  if (!hasAccess) {
    console.log('❌ Accès refusé - Rôles insuffisants');
    return <Navigate to="/unauthorized" replace />;
  }
  
  console.log('✅ Accès accordé - Rôles valides');
  return children;
};

export default ProtectedRoute;