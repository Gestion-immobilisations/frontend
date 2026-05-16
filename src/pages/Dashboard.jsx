import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Download, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import StatCard from '../components/ui/StatCard';
import Badge from '../components/ui/Badge';
import { biensService } from '../services/biens';
import { useAuth } from '../context/AuthContext';

const DEMO_ACTIVITIES = [
  { asset: 'MacBook Pro M2 (MC-84)', action: 'Attribution', user: 'L. Petit', date: "Aujourd'hui, 09:42", status: 'success', label: 'SUCCÈS' },
  { asset: 'Foreuse Caterpillar (FR-88)', action: 'Maintenance', user: 'J. Durand', date: 'Hier, 16:15', status: 'progress', label: 'EN COURS' },
  { asset: 'Camion Logistique (VH-89)', action: 'Retrait', user: 'M. Lefebvre', date: '05 Mai, 14:00', status: 'rejected', label: 'REJETÉ' },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState({ total: 0, maintenance: 0 });

  useEffect(() => {
    biensService
      .getStatistics()
      .then((data) => {
        setStats({
          total: data?.total ?? data?.total_biens ?? 0,
          maintenance: data?.en_maintenance ?? data?.maintenance ?? 0,
        });
      })
      .catch(() => {});
  }, []);

  const roleWidgets = {
    ADMIN: { users: '24', alerts: '12' },
    DG: { users: '24', alerts: '2' },
    COMPTABLE: { users: '18', alerts: '5' },
    TECHNICIEN: { users: '8', alerts: '3' },
    CAISSE: { users: '6', alerts: '4' },
  };
  const w = roleWidgets[user?.roles?.[0]] || roleWidgets.TECHNICIEN;

  return (
  <>
    <PageHeader
      title="Tableau de bord"
      subtitle="Aperçu global de l'infrastructure et de la flotte."
      actions={
        <>
          <button type="button" className="af-btn af-btn-outline">
            <Download size={16} />
            Exporter Rapport
          </button>
          <button
            type="button"
            className="af-btn af-btn-primary"
            onClick={() => navigate('/biens/nouveau')}
          >
            <Plus size={16} />
            Nouvel Actif
          </button>
        </>
      }
    />

    <div className="af-stats-grid">
      <StatCard label="Utilisateurs" value={w.users} trend="+2 ↑" />
      <StatCard
        label="Immobilisations"
        value={stats.total.toLocaleString('fr-FR')}
        meta="Total actifs"
        link={{ label: 'Voir les biens', onClick: () => navigate('/biens') }}
      />
      <StatCard label="Maintenances" value={String(stats.maintenance || 38)} meta="En cours" />
      <StatCard label="Alertes" value={w.alerts} meta="Critiques" />
    </div>

    <div className="af-grid-2">
      <div className="af-card">
        <div className="af-card-header">
          <h3 className="af-card-title">Alertes Critiques</h3>
          <span className="af-badge af-badge-rejected" style={{ fontSize: 10, letterSpacing: '0.05em' }}>
            ACTION REQUISE
          </span>
        </div>
        <div style={{ padding: '16px 22px 22px' }}>
          <div className="af-alert-item urgent">
            <div className="af-alert-title">Serveur Rack-04 urgent</div>
            <p className="af-alert-desc">Surchauffe détectée sur le rack principal — intervention immédiate requise.</p>
            <button type="button" className="af-alert-action red">INTERVENIR</button>
          </div>
          <div className="af-alert-item warning">
            <div className="af-alert-title">Véhicule #AB-202 retard</div>
            <p className="af-alert-desc">Maintenance préventive dépassée de 12 jours.</p>
            <button type="button" className="af-alert-action orange">PLANIFIER</button>
          </div>
          <div
            style={{
              marginTop: 16,
              padding: 20,
              borderRadius: 10,
              background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)',
              color: 'white',
            }}
          >
            <div style={{ fontWeight: 600, marginBottom: 4 }}>Audit Annuel 2024</div>
            <p style={{ fontSize: 13, opacity: 0.85, margin: 0 }}>Prochain audit complet dans 14 jours</p>
          </div>
        </div>
      </div>

      <div className="af-card">
        <div className="af-card-header">
          <h3 className="af-card-title">Activités Récentes</h3>
          <Link to="/audit" style={{ fontSize: 13, color: 'var(--af-blue)', textDecoration: 'none', fontWeight: 500 }}>
            Voir tout
          </Link>
        </div>
        <div className="af-table-wrap">
          <table className="af-table">
            <thead>
              <tr>
                <th>ACTIF / ID</th>
                <th>ACTION</th>
                <th>UTILISATEUR</th>
                <th>DATE</th>
                <th>STATUT</th>
              </tr>
            </thead>
            <tbody>
              {DEMO_ACTIVITIES.map((row) => (
                <tr key={row.asset}>
                  <td style={{ fontWeight: 500, color: 'var(--af-navy)' }}>{row.asset}</td>
                  <td>{row.action}</td>
                  <td>{row.user}</td>
                  <td style={{ color: 'var(--af-text-muted)' }}>{row.date}</td>
                  <td>
                    <Badge variant={row.status}>{row.label}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="af-table-footer">
          <span>Affichage de 3 sur 142 activités</span>
          <div className="af-pagination">
            <button type="button" className="af-page-btn" disabled aria-label="Page précédente">
              <ChevronLeft size={16} />
            </button>
            <button type="button" className="af-page-btn" aria-label="Page suivante">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>

    <button
      type="button"
      className="af-fab"
      onClick={() => navigate('/biens/nouveau')}
      aria-label="Nouvel actif"
    >
      <Plus size={24} />
    </button>
  </>
  );
};

export default Dashboard;

