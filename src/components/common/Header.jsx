import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, HelpCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import { SidebarToggle } from './Sidebar';

const Header = ({
  title = 'Tableau de bord',
  searchPlaceholder = 'Rechercher un actif ou une intervention...',
  onMenuToggle,
}) => {
  const { user } = useAuth();
  const { notifications, unreadCount, markAllRead } = useNotifications();
  const [search, setSearch] = useState('');
  const [panelOpen, setPanelOpen] = useState(false);
  const panelRef = useRef(null);

  const roleLabel = user?.roles?.[0] || 'TECHNICIEN';

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setPanelOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const togglePanel = () => {
    if (!panelOpen) markAllRead();
    setPanelOpen((v) => !v);
  };

  return (
    <header className="app-header">
      <div className="app-header__left">
        <SidebarToggle onClick={onMenuToggle} />
        <h2 className="app-header__title">{title}</h2>
      </div>

      <div className="app-header__search hide-tablet">
        <div className="app-header__search-wrap">
          <Search aria-hidden />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={searchPlaceholder}
            aria-label="Recherche"
          />
        </div>
      </div>

      <div className="app-header__actions">
        <button type="button" className="app-header__icon-btn hide-mobile" aria-label="Support">
          <HelpCircle size={18} />
        </button>

        <div ref={panelRef} className="notification-wrapper">
          <button
            type="button"
            className="app-header__icon-btn"
            onClick={togglePanel}
            aria-label="Notifications"
            aria-expanded={panelOpen}
          >
            <Bell size={20} />
            {unreadCount > 0 && <span className="app-header__badge-dot" />}
          </button>

          {panelOpen && (
            <div className="notification-dropdown" role="dialog" aria-label="Notifications">
              <div className="notification-dropdown__header">Notifications</div>
              {notifications.length === 0 ? (
                <p className="notification-dropdown__empty">Aucune notification</p>
              ) : (
                notifications.slice(0, 10).map((n) => (
                  <div
                    key={n.id}
                    className={`notification-dropdown__item ${!n.read ? 'notification-dropdown__item--unread' : ''}`}
                  >
                    <p>{n.message}</p>
                    <p className="notification-dropdown__time">
                      {formatDistanceToNow(new Date(n.time), { addSuffix: true, locale: fr })}
                    </p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <div className="app-header__user">
          <div className="app-header__avatar">
            {user?.prenom?.charAt(0)}
            {user?.nom?.charAt(0)}
          </div>
          <div className="app-header__user-info hide-mobile">
            <p>
              {user?.prenom} {user?.nom}
            </p>
            <p>{roleLabel}</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
