import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/ui/PageHeader';
import StatCard from '../components/ui/StatCard';
import Fab from '../components/ui/Fab';
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import BuildOutlinedIcon from '@mui/icons-material/BuildOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import AddIcon from '@mui/icons-material/Add';
import { useAuth } from '../context/AuthContext';
import dashboardService from '../services/dashboardService';
import { formatDateTime } from '../utils/formatters';
import '../styles/pages/dashboard.css';

const ACTION_STATUS = {
  CREATE: { label: 'SUCCÈS', className: 'af-badge-success' },
  UPDATE: { label: 'EN COURS', className: 'af-badge-info' },
  DELETE: { label: 'REJETÉ', className: 'af-badge-danger' },
  LOGIN: { label: 'SUCCÈS', className: 'af-badge-success' },
  LOGOUT: { label: 'SUCCÈS', className: 'af-badge-success' },
};

function mapActivityRow(entry) {
  const status = ACTION_STATUS[entry.action] || { label: entry.action, className: 'af-badge-neutral' };
  const recordRef = entry.id_enregistrement
    ? `#${entry.id_enregistrement}`
    : entry.table_concernee || '—';

  return {
    id: String(entry.id),
    name: entry.table_concernee || '—',
    action: entry.action,
    user: entry.utilisateur_nom || '—',
    date: entry.date_action ? formatDateTime(entry.date_action) : '—',
    status: status.label,
    statusClass: status.className,
    recordRef,
  };
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { hasAnyRole } = useAuth();
  const isAdmin = hasAnyRole(['ADMIN']);

  const [stats, setStats] = useState({
    biens: '—',
    utilisateurs: '—',
    maintenances: '—',
    alertes: '—',
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [totalActivities, setTotalActivities] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await dashboardService.loadOverview({ isAdmin });
        setStats({
          biens: data.biens != null ? String(data.biens) : '—',
          utilisateurs: data.utilisateurs != null ? String(data.utilisateurs) : '—',
          maintenances: data.maintenances != null ? String(data.maintenances) : '—',
          alertes: data.alertes != null ? String(data.alertes) : '—',
        });
        setRecentActivities((data.recentActivities || []).map(mapActivityRow));
        setTotalActivities(data.recentActivities?.length ?? 0);
        if (data.errors?.length) {
          setError(data.errors.map((e) => e.message).join(' · '));
        }
      } catch (err) {
        setError(err?.response?.data?.detail || err.message || 'Erreur de chargement');
        setRecentActivities([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [isAdmin]);

  return (
    <div className="af-page af-dashboard">
      <PageHeader
        title="Tableau de bord"
        subtitle="Aperçu global de l'infrastructure et de la flotte."
        actions={
          <>
            <button type="button" className="af-btn af-btn-secondary">
              <FileDownloadOutlinedIcon fontSize="small" />
              Exporter Rapport
            </button>
            <button
              type="button"
              className="af-btn af-btn-primary"
              onClick={() => navigate('/biens/nouveau')}
            >
              <AddIcon fontSize="small" />
              Nouvel Actif
            </button>
          </>
        }
      />

      {error && (
        <p className="af-empty-message" style={{ marginBottom: 16, color: 'var(--af-warning-text)' }}>
          {error}
        </p>
      )}

      <div className="af-dashboard__stats">
        <StatCard
          label="Utilisateurs"
          value={loading ? '…' : stats.utilisateurs}
          icon={<PeopleOutlineIcon />}
        />
        <StatCard
          label="Immobilisations"
          value={loading ? '…' : stats.biens}
          meta="Total actifs"
          icon={<Inventory2OutlinedIcon />}
        />
        <StatCard
          label="Maintenances"
          value={loading ? '…' : stats.maintenances}
          meta="En cours"
          icon={<BuildOutlinedIcon />}
        />
        <StatCard
          label="Alertes"
          value={loading ? '…' : stats.alertes}
          meta={<span style={{ color: 'var(--af-danger)' }}>Critiques</span>}
          icon={<WarningAmberOutlinedIcon sx={{ color: 'var(--af-danger)' }} />}
        />
      </div>

      <div className="af-dashboard__grid">
        <div className="af-dashboard__alerts">
          <h3>
            Alertes Critiques
            <span className="af-badge af-badge-danger">ACTION REQUISE</span>
          </h3>

          {stats.alertes === '—' || stats.alertes === '0' ? (
            <p className="af-empty-message">Aucune alerte critique pour le moment.</p>
          ) : (
            <p className="af-empty-message">
              {stats.alertes} bien(s) en panne ou en maintenance nécessitent une attention.
            </p>
          )}

          {isAdmin && (
            <div className="af-audit-banner">
              <h4>Journal d&apos;audit</h4>
              <p>Consultez l&apos;historique complet des opérations système.</p>
              <button
                type="button"
                className="af-btn af-btn-secondary"
                style={{ marginTop: 8 }}
                onClick={() => navigate('/audit')}
              >
                Voir l&apos;audit
              </button>
            </div>
          )}
        </div>

        <div className="af-card af-activities">
          <div className="af-activities__head">
            <h3>Activités Récentes</h3>
            {isAdmin && (
              <a href="/audit" className="af-activities__link">
                Voir tout
              </a>
            )}
          </div>
          <div className="af-table-wrap">
            <table className="af-table">
              <thead>
                <tr>
                  <th>Table / ID</th>
                  <th>Action</th>
                  <th>Utilisateur</th>
                  <th>Date</th>
                  <th>Statut</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="af-empty-message">
                      Chargement…
                    </td>
                  </tr>
                ) : recentActivities.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="af-empty-message">
                      Aucune donnée disponible
                    </td>
                  </tr>
                ) : (
                  recentActivities.map((row) => (
                    <tr key={row.id}>
                      <td>
                        <div className="af-asset-cell">
                          <div className="af-asset-icon">{row.recordRef}</div>
                          <span>{row.name}</span>
                        </div>
                      </td>
                      <td>{row.action}</td>
                      <td>{row.user}</td>
                      <td>{row.date}</td>
                      <td>
                        <span className={`af-badge ${row.statusClass}`}>{row.status}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="af-activities__footer">
            <span>
              {recentActivities.length === 0
                ? 'Aucune activité récente'
                : `Affichage de ${recentActivities.length} activité(s) récente(s)`}
            </span>
          </div>
        </div>
      </div>

      <Fab onClick={() => navigate('/biens/nouveau')} ariaLabel="Nouvel actif" />
    </div>
  );
};

export default Dashboard;
