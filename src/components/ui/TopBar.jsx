import React from 'react';
import { Search, Bell, HelpCircle, Menu } from 'lucide-react';

const TopBar = ({
  placeholder = 'Rechercher...',
  searchValue = '',
  onSearchChange,
  onMenuToggle,
  showNotifications = true,
}) => (
  <header className="af-topbar">
    <button
      type="button"
      className="af-mobile-menu-btn"
      onClick={onMenuToggle}
      aria-label="Menu"
    >
      <Menu size={22} />
    </button>

    <div className="af-search">
      <Search size={18} className="af-search-icon" />
      <input
        type="search"
        placeholder={placeholder}
        value={searchValue}
        onChange={(e) => onSearchChange?.(e.target.value)}
      />
    </div>

    <div className="af-topbar-actions">
      {showNotifications && (
        <button type="button" className="af-icon-btn" aria-label="Notifications">
          <Bell size={18} />
          <span className="af-notif-dot" />
        </button>
      )}
      <button type="button" className="af-icon-btn" aria-label="Aide">
        <HelpCircle size={18} />
      </button>
    </div>
  </header>
);

export default TopBar;
