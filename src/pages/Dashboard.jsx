// frontend/src/pages/Dashboard.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/pages/dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();

  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bon matin';
    if (hour < 18) return 'Bon après-midi';
    return 'Bonsoir';
  };

  const getDashboardWidgets = () => {
    const role = user?.roles?.[0];
    
    const widgets = {
      'ADMIN': [
        { title: 'Utilisateurs actifs', value: '24', icon: '👥', color: '#667eea' },
        { title: 'Biens enregistrés', value: '156', icon: '🏷️', color: '#4ecdc4' },
        { title: 'Pannes en cours', value: '3', icon: '⚠️', color: '#ff6b6b' },
        { title: 'Validations en attente', value: '7', icon: '✅', color: '#f9ca24' },
      ],
      'DG': [
        { title: 'Valeur du parc', value: '2.4M €', icon: '💰', color: '#667eea' },
        { title: 'Taux d\'utilisation', value: '87%', icon: '📊', color: '#4ecdc4' },
        { title: 'Alertes stratégiques', value: '2', icon: '🔔', color: '#ff6b6b' },
        { title: 'Renouvellements', value: '5', icon: '🔄', color: '#a55eea' },
      ],
      'COMPTABLE': [
        { title: 'Amortissements du mois', value: '12.5K €', icon: '📈', color: '#667eea' },
        { title: 'Écritures en attente', value: '8', icon: '📝', color: '#4ecdc4' },
        { title: 'Dép validations', value: '3', icon: '✅', color: '#f9ca24' },
        { title: 'Prévisions Q2', value: '45K €', icon: '🔮', color: '#a55eea' },
      ],
      'TECHNICIEN': [
        { title: 'Mes interventions', value: '5', icon: '🔧', color: '#667eea' },
        { title: 'Pannes assignées', value: '2', icon: '⚠️', color: '#ff6b6b' },
        { title: 'Maintenances cette semaine', value: '3', icon: '📅', color: '#4ecdc4' },
        { title: 'Pièces en stock', value: '24', icon: '🔩', color: '#f9ca24' },
      ],
      'CAISSE': [
        { title: 'Paiements à valider', value: '4', icon: '💳', color: '#667eea' },
        { title: 'Dépenses du mois', value: '8.2K €', icon: '📊', color: '#4ecdc4' },
        { title: 'Validations en attente', value: '2', icon: '✅', color: '#f9ca24' },
        { title: 'Solde disponible', value: '125K €', icon: '💰', color: '#a55eea' },
      ],
    };
    
    return widgets[role] || widgets['TECHNICIEN'];
  };

  const widgets = getDashboardWidgets();

  return (
    <div className="dashboard">
      <div className="page-header">
        <h2>{getWelcomeMessage()}, {user?.prenom} 👋</h2>
        <p>Tableau de bord - {user?.roles?.[0] || 'Utilisateur'}</p>
      </div>

      {/* Widgets KPI */}
      <div className="dashboard-widgets">
        {widgets.map((widget, index) => (
          <div key={index} className="widget-card">
            <div className="widget-icon" style={{ background: widget.color }}>
              {widget.icon}
            </div>
            <div className="widget-content">
              <span className="widget-value">{widget.value}</span>
              <span className="widget-label">{widget.title}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Section principale */}
      <div className="dashboard-main">
        <div className="info-card">
          <h3>📋 Activités récentes</h3>
          <p>Aucune activité récente à afficher.</p>
        </div>
        
        <div className="info-card">
          <h3>🔔 Alertes</h3>
          <p>Aucune alerte pour le moment.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;