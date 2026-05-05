// frontend/src/services/auth.js
import api from './api';

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
  
  return roles.map(r => String(r).trim().toUpperCase());
};

const authService = {
  login: async (email, mot_de_passe) => {
    try {
      const response = await api.post('/auth/login', null, {
        params: { email, mot_de_passe }
      });

      console.log('📡 Réponse login:', response.data);
      
      if (response.data.token && response.data.user) {
        // ✅ Normaliser les rôles avant stockage
        const normalizedUser = {
          ...response.data.user,
          roles: normalizeRoles(response.data.user)
        };
        
        localStorage.setItem('access_token', response.data.token.access_token);
        localStorage.setItem('refresh_token', response.data.token.refresh_token);
        localStorage.setItem('user', JSON.stringify(normalizedUser));
        
        console.log('✅ Utilisateur stocké avec rôles:', normalizedUser.roles);
      }

      return { success: true, data: response.data };
    } catch (error) {
      console.error('❌ Erreur login:', error);
      return {
        success: false,
        error: error.response?.data?.detail || 'Erreur de connexion'
      };
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Erreur logout:', error);
    } finally {
      localStorage.clear();
    }
  },

  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/me');
      
      const normalizedUser = {
        ...response.data,
        roles: normalizeRoles(response.data)
      };
      
      return { success: true, data: normalizedUser };
    } catch (error) {
      console.error('Erreur getCurrentUser:', error);
      return {
        success: false,
        error: error.response?.data?.detail || 'Erreur de récupération'
      };
    }
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('access_token');
  },

  getUser: () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        // ✅ S'assurer que les rôles sont un tableau normalisé
        if (!Array.isArray(user.roles)) {
          user.roles = normalizeRoles(user);
        }
        return user;
      } catch (e) {
        return null;
      }
    }
    return null;
  },

  hasRole: (role) => {
    const user = authService.getUser();
    if (!user || !user.roles || !Array.isArray(user.roles)) return false;
    
    const normalizedRole = String(role).trim().toUpperCase();
    return user.roles.some(r => String(r).trim().toUpperCase() === normalizedRole);
  },

  hasAnyRole: (roles) => {
    const user = authService.getUser();
    if (!user || !user.roles || !Array.isArray(user.roles)) return false;
    
    if (!Array.isArray(roles)) roles = [roles];
    const normalizedRoles = roles.map(r => String(r).trim().toUpperCase());
    
    return normalizedRoles.some(role => 
      user.roles.some(r => String(r).trim().toUpperCase() === role)
    );
  }
};

export default authService;