import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import SearchIcon from '@mui/icons-material/Search';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import MenuIcon from '@mui/icons-material/Menu';
import '../../styles/components/header.css';

const SEARCH_PLACEHOLDERS = {
  '/dashboard': 'Rechercher un actif, un utilisateur...',
  '/utilisateurs': 'Rechercher un utilisateur, un rôle...',
  '/roles': 'Rechercher des rôles ou permissions...',
  '/audit': 'Rechercher une action, un utilisateur ou un ID...',
  '/parametres': 'Rechercher des paramètres...',
};

const Header = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showMenu, setShowMenu] = useState(false);
  const [search, setSearch] = useState('');

  const placeholder =
    Object.entries(SEARCH_PLACEHOLDERS).find(([path]) => location.pathname.startsWith(path))?.[1] ||
    'Rechercher...';

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const roleLabel = user?.roles?.[0] || 'Utilisateur';
  const displayRole =
    roleLabel === 'ADMIN'
      ? 'Administrator'
      : roleLabel.charAt(0) + roleLabel.slice(1).toLowerCase();

  return (
    <header className="af-topbar">
      <button
        type="button"
        className="af-topbar__menu-btn"
        onClick={onMenuClick}
        aria-label="Ouvrir le menu"
      >
        <MenuIcon fontSize="small" />
      </button>

      <span className="af-topbar__brand-mobile">AssetFlow</span>

      <div className="af-topbar__search-wrap">
        <div className="af-search">
          <SearchIcon sx={{ fontSize: 20, color: '#94a3b8' }} />
          <input
            type="search"
            placeholder={placeholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Recherche"
          />
        </div>
      </div>

      <div className="af-topbar__actions">
        <button type="button" className="af-topbar__icon-btn" aria-label="Notifications">
          <NotificationsOutlinedIcon fontSize="small" />
          <span className="af-topbar__notif-dot" />
        </button>
        <button type="button" className="af-topbar__icon-btn" aria-label="Aide">
          <HelpOutlineIcon fontSize="small" />
        </button>

        <div
          className="af-topbar__user"
          onClick={() => setShowMenu(!showMenu)}
          onKeyDown={(e) => e.key === 'Enter' && setShowMenu(!showMenu)}
          role="button"
          tabIndex={0}
        >
          <div className="af-topbar__user-photo">
            {user?.prenom?.charAt(0)}
            {user?.nom?.charAt(0)}
          </div>
          <div className="af-topbar__user-info">
            <span className="af-topbar__user-name">
              {user?.prenom} {user?.nom}
            </span>
            <span className="af-topbar__user-role">{displayRole}</span>
          </div>
          {showMenu && (
            <div className="af-topbar__dropdown" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                className="af-topbar__dropdown-item"
                onClick={() => {
                  setShowMenu(false);
                  navigate('/parametres');
                }}
              >
                Paramètres
              </button>
              <button
                type="button"
                className="af-topbar__dropdown-item af-topbar__dropdown-item--danger"
                onClick={handleLogout}
              >
                Déconnexion
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
