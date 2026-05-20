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
import { biensService } from '../services/biens';
import '../styles/pages/dashboard.css';

const RECENT_ACTIVITIES = [
  {
    id: 'MC-84',
    name: 'MacBook Pro M2',
    action: 'Attribution',
    user: 'Jean Dupont',
    date: '14:32',
    status: 'SUCCÈS',
    statusClass: 'af-badge-success',
  },
  {
    id: 'SRV-12',
    name: 'Serveur Dell R740',
    action: 'Maintenance',
    user: 'Marie Martin',
    date: '11:15',
    status: 'EN COURS',
    statusClass: 'af-badge-info',
  },
  {
    id: 'VH-09',
    name: 'Véhicule Toyota #AB-202',
    action: 'Transfert',
    user: 'Pierre Leroy',
    date: 'Hier',
    status: 'REJETÉ',
    statusClass: 'af-badge-danger',
  },
  {
    id: 'IMP-03',
    name: 'Imprimante HP LaserJet',
    action: 'Création',
    user: 'Admin Admin',
    date: '02 Oct.',
    status: 'SUCCÈS',
    statusClass: 'af-badge-success',
  },
  {
    id: 'TAB-21',
    name: 'Tablette Samsung Tab',
    action: 'Inventaire',
    user: 'Sophie Bernard',
    date: '01 Oct.',
    status: 'EN COURS',
    statusClass: 'af-badge-info',
  },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    biens: '—',
    utilisateurs: '24',
    maintenances: '38',
    alertes: '12',
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await biensService.getStatistics();
        if (data?.total != null) {
          setStats((s) => ({ ...s, biens: String(data.total) }));
        } else if (data?.total_biens != null) {
          setStats((s) => ({ ...s, biens: String(data.total_biens) }));
        }
      } catch {
        setStats((s) => ({ ...s, biens: '1248' }));
      }
    };
    loadStats();
  }, []);

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

      <div className="af-dashboard__stats">
        <StatCard
          label="Utilisateurs"
          value={stats.utilisateurs}
          trend="↑ +2"
          icon={<PeopleOutlineIcon />}
        />
        <StatCard
          label="Immobilisations"
          value={stats.biens}
          meta="Total actifs"
          icon={<Inventory2OutlinedIcon />}
        />
        <StatCard
          label="Maintenances"
          value={stats.maintenances}
          meta="En cours"
          icon={<BuildOutlinedIcon />}
        />
        <StatCard
          label="Alertes"
          value={stats.alertes}
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

          <div className="af-alert-card">
            <div className="af-alert-card__bar af-alert-card__bar--critical" />
            <div>
              <h4>Serveur Rack-04 urgent</h4>
              <p>Surchauffe détectée. Interruption possible dans les 15 minutes.</p>
              <button type="button" className="af-alert-card__action af-alert-card__action--critical">
                INTERVENIR
              </button>
            </div>
          </div>

          <div className="af-alert-card">
            <div className="af-alert-card__bar af-alert-card__bar--warning" />
            <div>
              <h4>Véhicule #AB-202 retard</h4>
              <p>Maintenance préventive dépassée de 48 heures. Risque de garantie.</p>
              <button type="button" className="af-alert-card__action af-alert-card__action--warning">
                PLANIFIER
              </button>
            </div>
          </div>

          <div className="af-audit-banner">
            <h4>Audit Annuel 2024</h4>
            <p>Prochain audit complet dans 14 jours.</p>
          </div>
        </div>

        <div className="af-card af-activities">
          <div className="af-activities__head">
            <h3>Activités Récentes</h3>
            <a href="/audit" className="af-activities__link">
              Voir tout
            </a>
          </div>
          <div className="af-table-wrap">
            <table className="af-table">
              <thead>
                <tr>
                  <th>Actif / ID</th>
                  <th>Action</th>
                  <th>Utilisateur</th>
                  <th>Date</th>
                  <th>Statut</th>
                </tr>
              </thead>
              <tbody>
                {RECENT_ACTIVITIES.map((row) => (
                  <tr key={row.id}>
                    <td>
                      <div className="af-asset-cell">
                        <div className="af-asset-icon">{row.id}</div>
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
                ))}
              </tbody>
            </table>
          </div>
          <div className="af-activities__footer">
            <span>Affichage de 5 sur 142 activités</span>
          </div>
        </div>
      </div>

      <Fab onClick={() => navigate('/biens/nouveau')} ariaLabel="Nouvel actif" />
    </div>
  );
};

export default Dashboard;
