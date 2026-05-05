// frontend/src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/auth';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// ✅ Fonction de normalisation des rôles
const normalizeRoles = (userData) => {
  if (!userData) return [];
  
  let roles = [];
  
  if (Array.isArray(userData.roles)) {
    roles = userData.roles;
  } else if (typeof userData.roles === 'string') {
    roles = [userData.roles];
  } else if (userData.role) {
    roles = [userData.role];
  } else if (userData.role_nom) {
    roles = [userData.role_nom];
  }
  
  // Normalisation : trim + uppercase
  return roles.map(r => String(r).trim().toUpperCase());
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('access_token');
    
    if (token) {
      try {
        const result = await authService.getCurrentUser();
        if (result.success && result.data) {
          const userData = {
            ...result.data,
            roles: normalizeRoles(result.data)
          };
          setUser(userData);
          setAuthenticated(true);
          // ✅ Mettre à jour localStorage avec rôles normalisés
          localStorage.setItem('user', JSON.stringify(userData));
        } else {
          handleLogout();
        }
      } catch (error) {
        console.error('Erreur vérification auth:', error);
        handleLogout();
      }
    }
    setLoading(false);
  };

  const login = async (email, mot_de_passe) => {
    const result = await authService.login(email, mot_de_passe);
    
    if (result.success && result.data && result.data.user) {
      // ✅ Normaliser les rôles
      const userData = {
        ...result.data.user,
        roles: normalizeRoles(result.data.user)
      };
      
      // ✅ Nettoyage complet avant stockage
      localStorage.clear();
      localStorage.setItem('access_token', result.data.token.access_token);
      localStorage.setItem('refresh_token', result.data.token.refresh_token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      setUser(userData);
      setAuthenticated(true);
      
      console.log('✅ Connexion réussie:', { 
        email: userData.email, 
        roles: userData.roles 
      });
      
      return { success: true };
    }
    return result;
  };

  const handleLogout = async () => {
    await authService.logout();
    setUser(null);
    setAuthenticated(false);
    localStorage.clear();
  };

  const hasRole = (role) => {
    if (!user || !user.roles || !Array.isArray(user.roles)) return false;
    const normalizedRole = String(role).trim().toUpperCase();
    return user.roles.some(r => String(r).trim().toUpperCase() === normalizedRole);
  };

  const hasAnyRole = (roles) => {
    if (!user || !user.roles || !Array.isArray(user.roles)) return false;
    if (!Array.isArray(roles)) roles = [roles];
    
    const normalizedRoles = roles.map(r => String(r).trim().toUpperCase());
    return normalizedRoles.some(role => hasRole(role));
  };

  const value = {
    user,
    authenticated,
    loading,
    login,
    logout: handleLogout,
    hasRole,
    hasAnyRole,
    checkAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;