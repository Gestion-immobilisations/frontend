import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  AlertTriangle,
  Calendar,
  Wrench,
  Package,
  ClipboardList,
  DollarSign,
  ShoppingCart,
  Gauge,
  Settings,
  LogOut,
  Plus,
  X,
  Menu,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { title: 'Tableau de bord', path: '/dashboard', icon: LayoutDashboard },
  { title: 'Pannes', path: '/pannes', icon: AlertTriangle },
  { title: 'Maintenances', path: '/maintenances', icon: Calendar },
  { title: 'Réparations', path: '/reparations', icon: Wrench },
  { title: 'Stock pièces', path: '/pieces/stock', icon: Package },
  { title: 'Inventaire', path: '/pieces/inventaire', icon: ClipboardList },
  { title: 'Prix marché', path: '/pieces/prix-marche', icon: DollarSign },
  { title: 'Demandes pièces', path: '/pieces/demandes', icon: ShoppingCart },
  { title: 'Évaluation état', path: '/evaluation', icon: Gauge },
];

const Sidebar = ({ open, onClose }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <>
      <div
        className={`app-sidebar__overlay ${open ? 'app-sidebar__overlay--visible' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside className={`app-sidebar ${open ? 'app-sidebar--open' : ''}`}>
        <div className="app-sidebar__brand">
          <h1>Gestion Maintenance</h1>
          <p>Portail technicien</p>
        </div>

        <nav className="app-sidebar__nav">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/dashboard'}
              onClick={onClose}
              className={({ isActive }) =>
                `app-sidebar__link ${isActive ? 'app-sidebar__link--active' : ''}`
              }
            >
              <item.icon aria-hidden />
              {item.title}
            </NavLink>
          ))}
        </nav>

        <div className="app-sidebar__footer">
          <NavLink to="/pannes/declaration" className="app-sidebar__cta" onClick={onClose}>
            <Plus size={16} aria-hidden />
            Nouvelle intervention
          </NavLink>
          <button type="button" className="app-sidebar__btn" onClick={() => navigate('/dashboard')}>
            <Settings size={20} aria-hidden />
            Paramètres
          </button>
          <button type="button" className="app-sidebar__btn" onClick={handleLogout}>
            <LogOut size={20} aria-hidden />
            Déconnexion
          </button>
        </div>
      </aside>
    </>
  );
};

export const SidebarToggle = ({ onClick }) => (
  <button type="button" className="app-header__icon-btn app-sidebar__toggle" onClick={onClick} aria-label="Menu">
    <Menu size={20} />
  </button>
);

export const SidebarClose = ({ onClick }) => (
  <button type="button" className="app-header__icon-btn" onClick={onClick} aria-label="Fermer le menu" style={{ display: 'none' }}>
    <X size={20} />
  </button>
);

export default Sidebar;
