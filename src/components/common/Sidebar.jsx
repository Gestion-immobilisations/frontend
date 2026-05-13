// frontend/src/components/common/Sidebar.jsx
import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import "../../styles/components/sidebar.css";

const Sidebar = () => {
  const { user, hasRole, hasAnyRole } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(window.innerWidth >= 1024);
  const [activeSubmenu, setActiveSubmenu] = useState(null);

  // ✅ Fonction intelligente pour vérifier les rôles (insensible à la casse et aux espaces)
  const hasRequiredRole = (roles) => {
    if (!roles || roles.length === 0) return true;
    if (!user || !user.roles) return false;
    
    // Normaliser les rôles de l'utilisateur
    let userRoles = [];
    if (Array.isArray(user.roles)) {
      userRoles = user.roles;
    } else if (typeof user.roles === 'string') {
      userRoles = [user.roles];
    } else if (user.role) {
      userRoles = [user.role];
    }
    
    // Normaliser : trim + uppercase
    userRoles = userRoles.map(r => String(r).trim().toUpperCase());
    
    // Vérifier si au moins un rôle correspond
    return roles.some(requiredRole => {
      const normalizedRequired = String(requiredRole).trim().toUpperCase();
      return userRoles.includes(normalizedRequired);
    });
  };

  // Gestion de l'ouverture/fermeture sur mobile
  useEffect(() => {
    const handleToggle = () => setIsOpen(prev => !prev);
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };

    window.addEventListener('toggle-sidebar', handleToggle);
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('toggle-sidebar', handleToggle);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Fermer le menu sur mobile après un clic
  const handleNavClick = () => {
    if (window.innerWidth < 1024) {
      setIsOpen(false);
    }
  };

  // Menu items avec permissions par rôle
  const menuItems = [
    {
      title: 'Tableau de bord',
      path: '/dashboard',
      icon: '📊',
      roles: ['ADMIN', 'DG', 'COMPTABLE', 'TECHNICIEN', 'CAISSE', 'MAGASINIER'],
    },
    {
      title: 'Utilisateurs',
      path: '/utilisateurs',
      icon: '👥',
      roles: ['ADMIN'],
    },
    {
      title: 'Biens',
      icon: '🏷️',
      roles: ['ADMIN', 'DG', 'COMPTABLE', 'TECHNICIEN'],
      children: [
        { title: 'Tous les biens', path: '/biens', roles: ['ADMIN', 'DG', 'COMPTABLE', 'TECHNICIEN'] },
        {title: 'Save Biens', path: '/biens/nouveau', roles: ['ADMIN']},
        {title: 'voir bien', path: '/biens', roles: ['ADMIN']},
        {title: 'modifier bien', path: '/biens', roles: ['ADMIN']},
        { title: 'Véhicules', path: '/biens/vehicules', roles: ['ADMIN', 'DG', 'COMPTABLE', 'TECHNICIEN'] },
        { title: 'Machines', path: '/biens/machines', roles: ['ADMIN', 'DG', 'COMPTABLE', 'TECHNICIEN'] },
        { title: 'Ordinateurs', path: '/biens/ordinateurs', roles: ['ADMIN', 'DG', 'COMPTABLE', 'TECHNICIEN'] },
      ]
    },
    {
      title: 'Pannes',
      path: '/pannes',
      icon: '⚠️',
      roles: ['ADMIN', 'TECHNICIEN', 'DG'],
    },
    {
      title: 'Maintenances',
      path: '/maintenances',
      icon: '🔧',
      roles: ['ADMIN', 'TECHNICIEN', 'DG'],
    },
    {
      title: 'Amortissements',
      path: '/amortissements',
      icon: '📈',
      roles: ['ADMIN', 'COMPTABLE', 'DG'],
    },
    {
      title: 'Validations',
      path: '/validations',
      icon: '✅',
      roles: ['ADMIN', 'DG', 'COMPTABLE'],
    },
    {
      title: 'Pièces',
      path: '/pieces',
      icon: '🔩',
      roles: ['ADMIN', 'TECHNICIEN', 'COMPTABLE', 'MAGASINIER'],
    },
    // ========== 🆕 NOUVEAU MENU POUR LE MAGASINIER ==========
    {
      title: 'Gestion des stocks',
      icon: '📦',
      roles: ['MAGASINIER'],  // Uniquement pour le magasinier
      children: [
        { 
          title: 'Aperçu du stock', 
          path: '/stock/apercu', 
          roles: ['MAGASINIER'],
          icon: '📊'
        },
        { 
          title: 'Entrées en stock', 
          path: '/stock/entrees', 
          roles: ['MAGASINIER'],
          icon: '📥'
        },
        { 
          title: 'Sorties de stock', 
          path: '/stock/sorties', 
          roles: ['MAGASINIER'],
          icon: '📤'
        },
        { 
          title: 'Mouvements', 
          path: '/stock/mouvements', 
          roles: ['MAGASINIER'],
          icon: '🔄'
        },
        { 
          title: 'Inventaire', 
          path: '/stock/inventaire', 
          roles: ['MAGASINIER'],
          icon: '📋'
        },
        { 
          title: 'Alerte stock', 
          path: '/stock/alertes', 
          roles: ['MAGASINIER'],
          icon: '⚠️'
        },
      ]
    },
    {
      title: 'Pièces de rechange',
      icon: '🔧',
      roles: ['MAGASINIER', 'ADMIN', 'TECHNICIEN'],  // Accessible aussi aux autres rôles
      children: [
        { 
          title: 'Toutes les pièces', 
          path: '/pieces', 
          roles: ['MAGASINIER', 'ADMIN', 'TECHNICIEN', 'COMPTABLE'],
          icon: '🔩'
        },
        { 
          title: 'Ajouter une pièce', 
          path: '/pieces/nouveau', 
          roles: ['MAGASINIER', 'ADMIN'],
          icon: '➕'
        },
        { 
          title: 'Catégories', 
          path: '/pieces/categories', 
          roles: ['MAGASINIER', 'ADMIN'],
          icon: '📁'
        },
        { 
          title: 'Fournisseurs', 
          path: '/pieces/fournisseurs', 
          roles: ['MAGASINIER', 'ADMIN'],
          icon: '🏢'
        },
        { 
          title: 'Pièces critiques', 
          path: '/pieces/critiques', 
          roles: ['MAGASINIER', 'ADMIN', 'TECHNICIEN'],
          icon: '⚠️'
        },
      ]
    },
    // ========== FIN NOUVEAU MENU MAGASINIER ==========
    
    {
      title: 'Rapports',
      icon: '📑',
      roles: ['ADMIN', 'DG', 'COMPTABLE', 'MAGASINIER'], // ✅ Ajout MAGASINIER pour les rapports de stock
      children: [
        { title: 'Rapports généraux', path: '/rapports', roles: ['ADMIN', 'DG', 'COMPTABLE'] },
        { title: 'Rapports de stock', path: '/rapports/stock', roles: ['ADMIN', 'DG', 'COMPTABLE', 'MAGASINIER'] },
        { title: 'Rapports de mouvements', path: '/rapports/mouvements', roles: ['ADMIN', 'DG', 'MAGASINIER'] },
        { title: 'Valeur du stock', path: '/rapports/valeur-stock', roles: ['ADMIN', 'DG', 'COMPTABLE', 'MAGASINIER'] },
      ]
    },
    {
      title: 'Audit',
      path: '/audit',
      icon: '🔍',
      roles: ['ADMIN', 'DG'],
    },
     {
      title: 'Paramètres',
      icon: '⚙️',
      roles: ['ADMIN', 'MAGASINIER'], // ✅ Ajout MAGASINIER pour paramètres stock
      children: [
        { title: 'Paramètres généraux', path: '/parametres', roles: ['ADMIN'] },
        { title: 'Paramètres stock', path: '/parametres/stock', roles: ['ADMIN', 'MAGASINIER'] },
        { title: 'Unités de mesure', path: '/parametres/unites', roles: ['ADMIN', 'MAGASINIER'] },
        { title: 'Emplacements', path: '/parametres/emplacements', roles: ['ADMIN', 'MAGASINIER'] },
      ]
    },
  ];

  // ✅ Fonction de filtrage CORRIGÉE
  const filterByRole = (item) => {
    if (!item.roles || item.roles.length === 0) return true;
    if (!user) return false;
    
    // Utiliser la fonction intelligente
    const hasAccess = hasRequiredRole(item.roles);
    
    // Debug (à supprimer en production)
    if (item.title === 'Utilisateurs') {
      console.log(`🔍 Sidebar - ${item.title}:`, { 
        requiredRoles: item.roles, 
        userRoles: user.roles,
        hasAccess 
      });
    }
    
    return hasAccess;
  };

  const toggleSubmenu = (index) => {
    setActiveSubmenu(activeSubmenu === index ? null : index);
  };

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  if (!isOpen) {
    return (
      <aside className="sidebar sidebar-collapsed">
        <button className="sidebar-toggle" onClick={() => setIsOpen(true)}>
          ☰
        </button>
        <nav className="sidebar-nav">
          {menuItems.filter(filterByRole).map((item, index) => (
            item.path ? (
              <NavLink
                key={index}
                to={item.path}
                className="nav-icon-only"
                title={item.title}
                onClick={handleNavClick}
              >
                <span className="nav-icon">{item.icon}</span>
              </NavLink>
            ) : (
              <div key={index} className="nav-icon-only" title={item.title}>
                <span className="nav-icon">{item.icon}</span>
              </div>
            )
          ))}
        </nav>
      </aside>
    );
  }

  return (
    <>
      {/* Overlay pour mobile */}
      {window.innerWidth < 1024 && isOpen && (
        <div className="sidebar-overlay" onClick={() => setIsOpen(false)}></div>
      )}
      
      <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        <button className="sidebar-close" onClick={() => setIsOpen(false)}>
          ✕
        </button>
        
        <nav className="sidebar-nav">
          {menuItems.filter(filterByRole).map((item, index) => {
            if (item.children) {
              const hasActiveChild = item.children.some(child => 
                filterByRole(child) && isActive(child.path)
              );
              const isSubmenuOpen = activeSubmenu === index || hasActiveChild;

              return (
                <div key={index} className="menu-item has-children">
                  <div 
                    className={`menu-title ${isSubmenuOpen ? 'open' : ''}`}
                    onClick={() => toggleSubmenu(index)}
                  >
                    <span className="menu-icon">{item.icon}</span>
                    <span className="menu-text">{item.title}</span>
                    <span className="menu-arrow">{isSubmenuOpen ? '▼' : '▶'}</span>
                  </div>
                  {isSubmenuOpen && (
                    <div className="submenu">
                      {item.children.filter(filterByRole).map((child, childIndex) => (
                        <NavLink
                          key={childIndex}
                          to={child.path}
                          className={({ isActive }) => 
                            `submenu-item ${isActive ? 'active' : ''}`
                          }
                          onClick={handleNavClick}
                        >
                          {child.title}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <NavLink
                key={index}
                to={item.path}
                className={({ isActive }) => 
                  `menu-item ${isActive ? 'active' : ''}`
                }
                onClick={handleNavClick}
              >
                <span className="menu-icon">{item.icon}</span>
                <span className="menu-text">{item.title}</span>
              </NavLink>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;