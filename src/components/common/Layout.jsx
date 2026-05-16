import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from '../ui/TopBar';
import '../../styles/assetflow.css';

const SEARCH_PLACEHOLDERS = {
  '/dashboard': 'Rechercher un actif, un utilisateur...',
  '/utilisateurs': 'Rechercher un utilisateur, un rôle...',
  '/roles': 'Rechercher des rôles ou permissions...',
  '/audit': 'Rechercher une action, un utilisateur ou un ID...',
  '/parametres': 'Rechercher des paramètres...',
  '/biens': 'Rechercher un bien, une immobilisation...',
};

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState('');
  const location = useLocation();

  const basePath = '/' + (location.pathname.split('/')[1] || 'dashboard');
  const searchPlaceholder = SEARCH_PLACEHOLDERS[basePath] || SEARCH_PLACEHOLDERS['/dashboard'];

  return (
    <div className="af-app">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="af-main">
        <TopBar
          placeholder={searchPlaceholder}
          searchValue={search}
          onSearchChange={setSearch}
          onMenuToggle={() => setSidebarOpen((o) => !o)}
        />
        <main className="af-content">
          <Outlet context={{ search }} />
        </main>
      </div>
    </div>
  );
};

export default Layout;
