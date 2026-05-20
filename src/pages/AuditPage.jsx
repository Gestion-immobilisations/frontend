import React, { useState } from 'react';
import PageHeader from '../components/ui/PageHeader';
import Fab from '../components/ui/Fab';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import RestartAltOutlinedIcon from '@mui/icons-material/RestartAltOutlined';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import CloudSyncOutlinedIcon from '@mui/icons-material/CloudSyncOutlined';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import '../styles/pages/audit.css';

const AUDIT_ENTRIES = [
  {
    id: 1,
    time: '14:42 AUJ.',
    title: 'Asset supprimé',
    description: 'Le serveur de production a été retiré de l\'inventaire.',
    entityId: '#SRV-PROD-01',
    module: 'Gestion d\'actifs',
    color: 'var(--af-danger)',
    icon: DeleteOutlineIcon,
    iconBg: 'var(--af-danger-bg)',
  },
  {
    id: 2,
    time: '12:15 AUJ.',
    title: 'Profil mis à jour',
    description: 'Modification des permissions pour l\'utilisateur Marie Martin.',
    entityId: '#USR-2847',
    module: 'Utilisateurs',
    color: 'var(--af-info)',
    icon: EditOutlinedIcon,
    iconBg: 'var(--af-info-bg)',
  },
  {
    id: 3,
    time: 'Hier 18:50',
    title: 'Réinitialisation forcée',
    description: 'Mot de passe réinitialisé par l\'administrateur système.',
    entityId: '#USR-1092',
    module: 'Sécurité',
    color: 'var(--af-warning)',
    icon: RestartAltOutlinedIcon,
    iconBg: 'var(--af-warning-bg)',
  },
  {
    id: 4,
    time: 'Hier 14:22',
    title: 'Nouvel Asset créé',
    description: 'MacBook Pro M2 ajouté à l\'inventaire du département IT.',
    entityId: '#AST-MC-84',
    module: 'Gestion d\'actifs',
    color: 'var(--af-success)',
    icon: AddCircleOutlineIcon,
    iconBg: 'var(--af-success-bg)',
  },
  {
    id: 5,
    time: 'Hier 09:00',
    title: 'Synchronisation cloud',
    description: 'Synchronisation automatique des données terminée avec succès.',
    entityId: '#SYNC-2024',
    module: 'Système',
    color: 'var(--af-navy)',
    icon: CloudSyncOutlinedIcon,
    iconBg: 'var(--af-accent-bg)',
  },
];

const AuditPage = () => {
  const [dateFilter, setDateFilter] = useState('24h');
  const [moduleFilter, setModuleFilter] = useState('all');
  const [userFilter, setUserFilter] = useState('all');

  return (
    <div className="af-page">
      <PageHeader
        title="Journal d'audit"
        subtitle="Suivi chronologique de l'activité du système et des modifications d'actifs."
      />

      <div className="af-audit__layout">
        <div>
          <div className="af-audit__filters">
            <div className="af-audit__filter">
              <label htmlFor="audit-date">Date</label>
              <select
                id="audit-date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              >
                <option value="24h">Dernières 24 heures</option>
                <option value="7d">7 derniers jours</option>
                <option value="30d">30 derniers jours</option>
              </select>
            </div>
            <div className="af-audit__filter">
              <label htmlFor="audit-module">Module</label>
              <select
                id="audit-module"
                value={moduleFilter}
                onChange={(e) => setModuleFilter(e.target.value)}
              >
                <option value="all">Tous les modules</option>
                <option value="actifs">Gestion d&apos;actifs</option>
                <option value="users">Utilisateurs</option>
              </select>
            </div>
            <div className="af-audit__filter">
              <label htmlFor="audit-user">Utilisateur</label>
              <select
                id="audit-user"
                value={userFilter}
                onChange={(e) => setUserFilter(e.target.value)}
              >
                <option value="all">Tous les responsables</option>
                <option value="admin">Admin Admin</option>
              </select>
            </div>
          </div>

          <div className="af-card">
            {AUDIT_ENTRIES.map((entry) => {
              const Icon = entry.icon;
              return (
                <div key={entry.id} className="af-audit-entry">
                  <div
                    className="af-audit-entry__bar"
                    style={{ background: entry.color }}
                  />
                  <span className="af-audit-entry__time">{entry.time}</span>
                  <div
                    className="af-audit-entry__icon"
                    style={{ background: entry.iconBg, color: entry.color }}
                  >
                    <Icon fontSize="small" />
                  </div>
                  <div className="af-audit-entry__body">
                    <h4>{entry.title}</h4>
                    <p>{entry.description}</p>
                  </div>
                  <div className="af-audit-entry__meta">
                    <strong>ID: {entry.entityId}</strong>
                    Module: {entry.module}
                  </div>
                </div>
              );
            })}
            <div style={{ padding: '14px 20px', fontSize: '0.8125rem', color: 'var(--af-text-muted)' }}>
              Affichage de 5 sur 1,240 entrées
            </div>
          </div>
        </div>

        <aside className="af-audit-sidebar">
          <h3>Résumé de l&apos;activité</h3>

          <div className="af-card af-audit-sidebar__stat">
            <div style={{ fontSize: '0.8125rem', color: 'var(--af-text-muted)' }}>
              Actions ce jour
            </div>
            <div className="af-audit-sidebar__stat-value">124</div>
            <span className="af-stat-card__trend">
              <TrendingUpIcon sx={{ fontSize: 14, verticalAlign: 'middle' }} /> +12%
            </span>
          </div>

          <div className="af-audit-sidebar__section-title">Alertes critiques</div>
          <div
            className="af-card"
            style={{
              padding: 14,
              borderColor: '#fecaca',
              background: 'var(--af-danger-bg)',
            }}
          >
            <WarningAmberOutlinedIcon sx={{ color: 'var(--af-danger)', mb: 1 }} />
            <strong style={{ color: 'var(--af-danger)' }}>3 suppressions</strong>
            <p style={{ margin: '4px 0 0', fontSize: '0.8125rem', color: 'var(--af-danger-text)' }}>
              Nécessite vérification
            </p>
          </div>

          <div className="af-audit-sidebar__section-title">Répartition</div>
          {[
            { label: 'Modifications', pct: 65, color: 'var(--af-navy)' },
            { label: 'Créations', pct: 25, color: 'var(--af-accent)' },
            { label: 'Suppressions', pct: 10, color: 'var(--af-danger)' },
          ].map((row) => (
            <div key={row.label} className="af-distribution-row">
              <div className="af-distribution-row__head">
                <span>{row.label}</span>
                <span>{row.pct}%</span>
              </div>
              <div className="af-progress">
                <div
                  className="af-progress__bar"
                  style={{ width: `${row.pct}%`, background: row.color }}
                />
              </div>
            </div>
          ))}

          <div className="af-audit-cta">
            <h4>Audit Mensuel</h4>
            <p>Le rapport automatique de Juillet est prêt à être consulté.</p>
            <button type="button" className="af-btn af-btn-primary" style={{ width: '100%' }}>
              Consulter
            </button>
          </div>
        </aside>
      </div>

      <Fab ariaLabel="Nouvelle entrée" />
    </div>
  );
};

export default AuditPage;
