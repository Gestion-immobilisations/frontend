import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Shield,
  History,
  Settings,
  Building2,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const NAV_ITEMS = [
  { title: 'Tableau de bord', path: '/dashboard', icon: LayoutDashboard, roles: ['ADMIN', 'DG', 'COMPTABLE', 'TECHNICIEN', 'CAISSE'] },
  { title: 'Utilisateurs', path: '/utilisateurs', icon: Users, roles: ['ADMIN'] },
  { title: 'Rôles', path: '/roles', icon: Shield, roles: ['ADMIN'] },
  { title: 'Audit', path: '/audit', icon: History, roles: ['ADMIN', 'DG'] },
  { title: 'Paramètres', path: '/parametres', icon: Settings, roles: ['ADMIN'] },
];

const hasRequiredRole = (user, roles) => {
  if (!roles?.length) return true;
  if (!user?.roles) return false;
  const userRoles = (Array.isArray(user.roles) ? user.roles : [user.roles]).map((r) =>
    String(r).trim().toUpperCase()
  );
  return roles.some((r) => userRoles.includes(String(r).trim().toUpperCase()));
};

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const initials = `${user?.prenom?.charAt(0) || ''}${user?.nom?.charAt(0) || 'A'}`.toUpperCase();
  const displayName = [user?.prenom, user?.nom].filter(Boolean).join(' ') || 'Admin User';
  const roleLabel = user?.roles?.[0] || 'Utilisateur';

  return (
    <>
      {isOpen && <div className="af-sidebar-overlay" onClick={onClose} aria-hidden="true" />}
      <aside className={`af-sidebar ${isOpen ? 'open' : ''}`}>
        <div className="af-sidebar-brand">
          <div className="af-brand-row">
            <div className="af-brand-icon">
              <Building2 size={22} />
            </div>
            <div>
              <div className="af-brand-name">AssetFlow</div>
              <div className="af-brand-sub">Enterprise Management</div>
            </div>
          </div>
        </div>

        <nav className="af-nav">
          {NAV_ITEMS.filter((item) => hasRequiredRole(user, item.roles)).map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) => `af-nav-link ${isActive ? 'active' : ''}`}
                onClick={onClose}
              >
                <Icon size={20} />
                <span>{item.title}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="af-sidebar-footer">
          <div className="af-user-card">
            <div className="af-avatar">{initials}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="af-user-name">{displayName}</div>
              <div className="af-user-role">{roleLabel}</div>
            </div>
            <button
              type="button"
              className="af-icon-btn"
              onClick={handleLogout}
              aria-label="Déconnexion"
              style={{ border: 'none', width: 36, height: 36 }}
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
