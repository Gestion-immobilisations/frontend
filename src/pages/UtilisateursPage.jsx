import React, { useEffect, useState } from 'react';
import PageHeader from '../components/ui/PageHeader';
import StatCard from '../components/ui/StatCard';
import Fab from '../components/ui/Fab';
import FilterListIcon from '@mui/icons-material/FilterList';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddIcon from '@mui/icons-material/Add';
import utilisateurService from '../services/utilisateurService';
import roleService from '../services/roleService';
import { formatDateTime } from '../utils/formatters';
import { getRoleLabel, ROLE_BADGE_CLASS } from '../utils/roleConfig';
import '../styles/pages/utilisateurs.css';

const UtilisateursPage = () => {
  const [activeTab, setActiveTab] = useState('tous');
  const [users, setUsers] = useState([]);
  const [rolesCount, setRolesCount] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const [usersData, rolesData] = await Promise.all([
          utilisateurService.getAll({ skip: 0, limit: 500 }),
          roleService.getAll(),
        ]);
        setUsers(usersData?.items ?? []);
        setTotal(usersData?.total ?? 0);
        setRolesCount(rolesData?.length ?? 0);
      } catch (err) {
        setError(err?.response?.data?.detail || err.message || 'Erreur de chargement');
        setUsers([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered =
    activeTab === 'tous'
      ? users
      : users.filter((u) => {
          const role = (u.role_nom || '').toUpperCase();
          if (activeTab === 'administrateurs') return role === 'ADMIN';
          if (activeTab === 'managers') return role === 'DG';
          return true;
        });

  const activeCount = users.filter((u) => u.est_actif).length;

  return (
    <div className="af-page">
      <PageHeader
        title="Gestion des Utilisateurs"
        subtitle="Gérez les accès, les rôles et surveillez l'activité des membres de votre organisation."
        actions={
          <button type="button" className="af-btn af-btn-primary">
            <AddIcon fontSize="small" />
            Ajouter un utilisateur
          </button>
        }
      />

      {error && (
        <p className="af-empty-message" style={{ marginBottom: 16, color: 'var(--af-danger)' }}>
          {error}
        </p>
      )}

      <div className="af-grid-stats">
        <StatCard
          label="Total utilisateurs"
          value={loading ? '…' : String(total)}
        />
        <StatCard
          label="Utilisateurs actifs"
          value={loading ? '…' : String(activeCount)}
          meta={total ? `${Math.round((activeCount / total) * 100)}% du total` : ''}
        />
        <StatCard label="Nouveaux ce mois" value="—" meta="Non disponible" />
        <StatCard
          label="Rôles configurés"
          value={loading ? '…' : String(rolesCount)}
          meta={<a href="/roles" style={{ color: 'var(--af-accent)' }}>Voir les rôles</a>}
        />
      </div>

      <div className="af-card">
        <div className="af-users__toolbar">
          <div className="af-users__tabs">
            {[
              { id: 'tous', label: 'Tous' },
              { id: 'administrateurs', label: 'Administrateurs' },
              { id: 'managers', label: 'Directeurs' },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`af-users__tab ${activeTab === tab.id ? 'af-users__tab--active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <button type="button" className="af-btn af-btn-secondary">
            <FilterListIcon fontSize="small" />
            Filtres avancés
          </button>
        </div>

        <div className="af-table-wrap">
          <table className="af-table">
            <thead>
              <tr>
                <th>Nom &amp; Email</th>
                <th>Rôle</th>
                <th>Statut</th>
                <th>Dernière connexion</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="af-empty-message">
                    Chargement…
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="af-empty-message">
                    Aucune donnée disponible
                  </td>
                </tr>
              ) : (
                filtered.map((u) => {
                  const roleCode = (u.role_nom || '').toUpperCase();
                  const statut = u.est_actif ? 'Actif' : 'Inactif';
                  return (
                    <tr key={u.id}>
                      <td>
                        <div className="af-user-cell">
                          <div className="af-avatar">
                            {u.prenom?.charAt(0)}
                            {u.nom?.charAt(0)}
                          </div>
                          <div>
                            <strong>
                              {u.prenom} {u.nom}
                            </strong>
                            <span className="af-user-cell__email">{u.email}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span
                          className={`af-badge ${ROLE_BADGE_CLASS[roleCode] || 'af-badge-neutral'}`}
                        >
                          {getRoleLabel(roleCode)}
                        </span>
                      </td>
                      <td>
                        <span className="af-badge af-badge-neutral">
                          <span
                            className={`af-status-dot ${
                              u.est_actif ? 'af-status-dot--active' : 'af-status-dot--inactive'
                            }`}
                          />
                          {statut}
                        </span>
                      </td>
                      <td>{u.last_login ? formatDateTime(u.last_login) : '—'}</td>
                      <td>
                        <button type="button" className="af-btn af-btn-ghost" aria-label="Actions">
                          <MoreVertIcon fontSize="small" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="af-users__pagination">
          <span>
            {filtered.length === 0
              ? 'Aucun utilisateur'
              : `Affichage de ${filtered.length} sur ${total} utilisateur(s)`}
          </span>
        </div>
      </div>

      <Fab ariaLabel="Ajouter un utilisateur" />
    </div>
  );
};

export default UtilisateursPage;
