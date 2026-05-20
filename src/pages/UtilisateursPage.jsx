import React, { useState } from 'react';
import PageHeader from '../components/ui/PageHeader';
import StatCard from '../components/ui/StatCard';
import Fab from '../components/ui/Fab';
import FilterListIcon from '@mui/icons-material/FilterList';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import AddIcon from '@mui/icons-material/Add';
import '../styles/pages/utilisateurs.css';

const MOCK_USERS = [
  {
    id: 1,
    prenom: 'Jean',
    nom: 'Dupont',
    email: 'jean.dupont@assetflow.com',
    role: 'ADMIN',
    statut: 'Actif',
    derniere_connexion: 'Il y a 12 minutes',
  },
  {
    id: 2,
    prenom: 'Marie',
    nom: 'Martin',
    email: 'marie.martin@assetflow.com',
    role: 'COMPTABLE',
    statut: 'Actif',
    derniere_connexion: 'Hier, 16:45',
  },
  {
    id: 3,
    prenom: 'Pierre',
    nom: 'Leroy',
    email: 'pierre.leroy@assetflow.com',
    role: 'TECHNICIEN',
    statut: 'Inactif',
    derniere_connexion: '02 Oct. 2023',
  },
  {
    id: 4,
    prenom: 'Sophie',
    nom: 'Bernard',
    email: 'sophie.bernard@assetflow.com',
    role: 'DG',
    statut: 'Actif',
    derniere_connexion: 'Il y a 2 heures',
  },
];

const ROLE_BADGE = {
  ADMIN: 'af-badge-admin',
  COMPTABLE: 'af-badge-comptable',
  DG: 'af-badge-manager',
  TECHNICIEN: 'af-badge-inventaire',
  MAGASINIER: 'af-badge-inventaire',
  CAISSE: 'af-badge-neutral',
};

const ROLE_LABEL = {
  ADMIN: 'Administrateur',
  COMPTABLE: 'Comptable',
  DG: 'Manager',
  TECHNICIEN: 'Technicien',
  MAGASINIER: 'Inventaire',
  CAISSE: 'Caisse',
};

const UtilisateursPage = () => {
  const [activeTab, setActiveTab] = useState('tous');

  const filtered =
    activeTab === 'tous'
      ? MOCK_USERS
      : MOCK_USERS.filter((u) => {
          if (activeTab === 'administrateurs') return u.role === 'ADMIN';
          if (activeTab === 'managers') return u.role === 'DG';
          return true;
        });

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

      <div className="af-grid-stats">
        <StatCard label="Total utilisateurs" value="1,284" trend="↑ 12%" />
        <StatCard label="Utilisateurs actifs" value="942" meta="73% du total" />
        <StatCard label="Nouveaux ce mois" value="48" meta="+5 aujourd'hui" />
        <StatCard
          label="Rôles configurés"
          value="12"
          meta={<a href="/roles" style={{ color: 'var(--af-accent)' }}>Voir les rôles</a>}
        />
      </div>

      <div className="af-card">
        <div className="af-users__toolbar">
          <div className="af-users__tabs">
            {[
              { id: 'tous', label: 'Tous' },
              { id: 'administrateurs', label: 'Administrateurs' },
              { id: 'managers', label: 'Managers' },
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
              {filtered.map((u) => (
                <tr key={u.id}>
                  <td>
                    <div className="af-user-cell">
                      <div className="af-avatar">
                        {u.prenom.charAt(0)}
                        {u.nom.charAt(0)}
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
                    <span className={`af-badge ${ROLE_BADGE[u.role] || 'af-badge-neutral'}`}>
                      {ROLE_LABEL[u.role] || u.role}
                    </span>
                  </td>
                  <td>
                    <span className="af-badge af-badge-neutral">
                      <span
                        className={`af-status-dot ${
                          u.statut === 'Actif' ? 'af-status-dot--active' : 'af-status-dot--inactive'
                        }`}
                      />
                      {u.statut}
                    </span>
                  </td>
                  <td>{u.derniere_connexion}</td>
                  <td>
                    <button type="button" className="af-btn af-btn-ghost" aria-label="Actions">
                      <MoreVertIcon fontSize="small" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="af-users__pagination">
          <span>Affichage de 1 à {filtered.length} sur 1,284 utilisateurs</span>
          <div className="af-pagination__pages">
            <button type="button" className="af-pagination__page af-pagination__page--active">
              1
            </button>
            <button type="button" className="af-pagination__page">
              2
            </button>
            <button type="button" className="af-pagination__page">
              3
            </button>
          </div>
        </div>
      </div>

      <Fab ariaLabel="Ajouter un utilisateur" />
    </div>
  );
};

export default UtilisateursPage;
