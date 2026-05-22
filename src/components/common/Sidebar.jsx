import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import HistoryOutlinedIcon from '@mui/icons-material/HistoryOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import BuildOutlinedIcon from '@mui/icons-material/BuildOutlined';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import GridViewIcon from '@mui/icons-material/GridView';
import MenuIcon from '@mui/icons-material/Menu';
import '../../styles/components/sidebar.css';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout, hasAnyRole } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState({});

  const hasRequiredRole = (roles) => {
    if (!roles?.length) return true;
    return hasAnyRole(roles);
  };

  const primaryNav = [
    { title: 'Dashboard', path: '/dashboard', icon: DashboardOutlinedIcon, roles: [] },
    { title: 'Users', path: '/utilisateurs', icon: PeopleOutlineIcon, roles: ['ADMIN'] },
    { title: 'Roles', path: '/roles', icon: ShieldOutlinedIcon, roles: ['ADMIN'] },
    { title: 'Audit', path: '/audit', icon: HistoryOutlinedIcon, roles: ['ADMIN'] },
    { title: 'Settings', path: '/parametres', icon: SettingsOutlinedIcon, roles: ['ADMIN'] },
  ];

  const operationsNav = [
    {
      title: 'Biens',
      icon: Inventory2OutlinedIcon,
      roles: ['ADMIN', 'DG', 'COMPTABLE', 'TECHNICIEN'],
      children: [
        { title: 'Tous les biens', path: '/biens', roles: ['ADMIN', 'DG', 'COMPTABLE', 'TECHNICIEN'] },
        { title: 'Nouveau bien', path: '/biens/nouveau', roles: ['ADMIN', 'COMPTABLE'] },
      ],
    },
    { title: 'Pannes', path: '/pannes', icon: BuildOutlinedIcon, roles: ['ADMIN', 'TECHNICIEN'] },
    { title: 'Maintenances', path: '/maintenances', icon: BuildOutlinedIcon, roles: ['ADMIN', 'TECHNICIEN', 'DG'] },
    {
      title: 'Pièces',
      path: '/pieces',
      icon: Inventory2OutlinedIcon,
      roles: ['ADMIN', 'TECHNICIEN', 'MAGASINIER'],
    },
    {
      title: 'Gestion des stocks',
      icon: Inventory2OutlinedIcon,
      roles: ['MAGASINIER', 'ADMIN'],
      children: [
        { title: 'Aperçu', path: '/stock/apercu', roles: ['MAGASINIER', 'ADMIN'] },
        { title: 'Entrées', path: '/stock/entrees', roles: ['MAGASINIER', 'ADMIN'] },
        { title: 'Sorties', path: '/stock/sorties', roles: ['MAGASINIER', 'ADMIN'] },
        { title: 'Mouvements', path: '/stock/mouvements', roles: ['MAGASINIER', 'ADMIN'] },
        { title: 'Inventaire', path: '/stock/inventaire', roles: ['MAGASINIER', 'ADMIN'] },
        { title: 'Alertes', path: '/stock/alertes', roles: ['MAGASINIER', 'ADMIN', 'DG'] },
      ],
    },
    {
      title: 'Amortissements',
      path: '/amortissements',
      icon: AssessmentOutlinedIcon,
      roles: ['ADMIN', 'COMPTABLE'],
    },
    {
      title: 'Rapports',
      icon: AssessmentOutlinedIcon,
      roles: ['ADMIN', 'DG', 'COMPTABLE', 'MAGASINIER'],
      children: [
        { title: 'Rapports financiers', path: '/rapports', roles: ['ADMIN', 'COMPTABLE'] },
        { title: 'Rapports analytiques', path: '/rapports', roles: ['ADMIN', 'DG'] },
        { title: 'Stock', path: '/rapports/stock', roles: ['ADMIN', 'DG', 'COMPTABLE', 'MAGASINIER'] },
        { title: 'Mouvements', path: '/rapports/mouvements', roles: ['ADMIN', 'DG', 'MAGASINIER'] },
        { title: 'Valeur stock', path: '/rapports/valeur-stock', roles: ['ADMIN', 'DG', 'COMPTABLE', 'MAGASINIER'] },
      ],
    },
    {
      title: 'Paramètres stock',
      icon: SettingsOutlinedIcon,
      roles: ['ADMIN', 'MAGASINIER'],
      children: [
        { title: 'Stock', path: '/parametres/stock', roles: ['ADMIN', 'MAGASINIER'] },
        { title: 'Unités', path: '/parametres/unites', roles: ['ADMIN', 'MAGASINIER'] },
        { title: 'Emplacements', path: '/parametres/emplacements', roles: ['ADMIN', 'MAGASINIER'] },
      ],
    },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const toggleExpand = (key) => {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(`${path}/`);

  const renderLink = (item, key) => {
    const Icon = item.icon;
    if (item.children) {
      const visibleChildren = item.children.filter((c) => hasRequiredRole(c.roles));
      if (!visibleChildren.length || !hasRequiredRole(item.roles)) return null;
      const isOpen = expanded[key] || visibleChildren.some((c) => isActive(c.path));

      return (
        <div key={key}>
          <button
            type="button"
            className={`af-sidebar__link ${isOpen ? 'af-sidebar__link--active' : ''}`}
            onClick={() => toggleExpand(key)}
          >
            {Icon && <Icon fontSize="small" />}
            <span>{item.title}</span>
          </button>
          {isOpen && (
            <div className="af-sidebar__submenu">
              {visibleChildren.map((child) => (
                <NavLink
                  key={child.path}
                  to={child.path}
                  className={({ isActive: active }) =>
                    `af-sidebar__sublink ${active ? 'af-sidebar__sublink--active' : ''}`
                  }
                  onClick={onClose}
                >
                  {child.title}
                </NavLink>
              ))}
            </div>
          )}
        </div>
      );
    }

    if (!hasRequiredRole(item.roles)) return null;

    return (
      <NavLink
        key={item.path}
        to={item.path}
        className={({ isActive: active }) =>
          `af-sidebar__link ${active ? 'af-sidebar__link--active' : ''}`
        }
        onClick={onClose}
      >
        {Icon && <Icon fontSize="small" />}
        <span>{item.title}</span>
      </NavLink>
    );
  };

  return (
    <>
      <div
        className={`af-sidebar-overlay ${isOpen ? 'af-sidebar-overlay--visible' : ''}`}
        onClick={onClose}
        aria-hidden={!isOpen}
      />
      <aside className={`af-sidebar ${isOpen ? 'af-sidebar--open' : ''}`}>
        <div className="af-sidebar__brand">
          <div className="af-sidebar__logo-icon">
            <GridViewIcon fontSize="small" />
          </div>
          <div className="af-sidebar__logo-text">
            <h2>AssetFlow</h2>
            <span>Enterprise Management</span>
          </div>
        </div>

        <nav className="af-sidebar__nav">
          {primaryNav
            .filter((item) => hasRequiredRole(item.roles))
            .map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive: active }) =>
                    `af-sidebar__link ${active ? 'af-sidebar__link--active' : ''}`
                  }
                  onClick={onClose}
                >
                  <Icon fontSize="small" />
                  <span>{item.title}</span>
                </NavLink>
              );
            })}

          {operationsNav.some((item) => hasRequiredRole(item.roles)) && (
            <>
              <div className="af-sidebar__section-label">Opérations</div>
              {operationsNav.map((item, i) => renderLink(item, `op-${i}`))}
            </>
          )}
        </nav>

        {hasAnyRole(['ADMIN']) && (
          <div className="af-sidebar__compliance">
            <p className="af-sidebar__compliance-title">Système Sécurisé</p>
            <div className="af-sidebar__compliance-bar">
              <div className="af-sidebar__compliance-fill" style={{ width: '94%' }} />
            </div>
            <span className="af-sidebar__compliance-meta">Conformité Audit: 94%</span>
          </div>
        )}

        <div className="af-sidebar__footer">
          <div className="af-sidebar__user">
            <div className="af-avatar">
              {user?.prenom?.charAt(0)}
              {user?.nom?.charAt(0)}
            </div>
            <div className="af-sidebar__user-info">
              <span className="af-sidebar__user-name">
                {user?.prenom} {user?.nom}
              </span>
              <span className="af-sidebar__user-email">{user?.email || 'admin@assetflow.com'}</span>
            </div>
            <button
              type="button"
              className="af-sidebar__logout"
              onClick={handleLogout}
              aria-label="Déconnexion"
            >
              <LogoutOutlinedIcon fontSize="small" />
            </button>
          </div>
        </div>
      </aside>

      <button
        type="button"
        className="af-sidebar-toggle"
        onClick={() => window.dispatchEvent(new CustomEvent('toggle-sidebar-mobile'))}
        aria-label="Menu"
        style={{ display: 'none' }}
      >
        <MenuIcon />
      </button>
    </>
  );
};

export default Sidebar;
