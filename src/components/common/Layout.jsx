import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import '../../styles/technicien/layout.css';

const pageTitles = {
  '/dashboard': 'Tableau de bord',
  '/pannes': 'Gestion des pannes',
  '/pannes/declaration': 'Nouvelle intervention',
  '/maintenances': 'Gestion des maintenances',
  '/reparations': 'Réparations et alertes',
  '/pieces/stock': 'Stock des pièces',
  '/pieces/inventaire': 'Inventaire des pièces',
  '/pieces/prix-marche': 'Prix marché des pièces',
  '/pieces/demandes': 'Demandes de pièces',
  '/evaluation': 'Évaluation de l\'état',
  '/biens': 'Biens',
  '/biens/nouveau': 'Nouveau bien',
};

const searchPlaceholders = {
  '/pannes': 'Rechercher une panne...',
  '/maintenances': 'Rechercher une maintenance...',
  '/reparations': 'Rechercher une réparation...',
  '/pieces/stock': 'Rechercher une pièce...',
  '/pieces/inventaire': 'Rechercher dans l\'inventaire...',
};

const Layout = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const basePath = '/' + location.pathname.split('/').filter(Boolean)[0];
  const title = pageTitles[location.pathname] || pageTitles[basePath] || 'Gestion Maintenance';
  const searchPlaceholder =
    searchPlaceholders[location.pathname] ||
    searchPlaceholders[basePath] ||
    'Rechercher un actif ou une intervention...';

  return (
    <div className="app-layout">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="app-layout__body">
        <Header
          title={title}
          searchPlaceholder={searchPlaceholder}
          onMenuToggle={() => setSidebarOpen((v) => !v)}
        />
        <main className="app-layout__main">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
