import React, { useState } from 'react';
import { Plus, MoreVertical, SlidersHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import StatCard from '../components/ui/StatCard';
import Badge from '../components/ui/Badge';

const DEMO_USERS = [
  { id: 1, prenom: 'Jean', nom: 'Dupont', email: 'j.dupont@assetflow.com', role: 'ADMIN', roleLabel: 'Administrateur', statut: 'actif', lastLogin: 'Il y a 12 minutes' },
  { id: 2, prenom: 'Marie', nom: 'Lambert', email: 'm.lambert@assetflow.com', role: 'COMPTABLE', roleLabel: 'Comptable', statut: 'actif', lastLogin: 'Il y a 2 heures' },
  { id: 3, prenom: 'Pierre', nom: 'Martin', email: 'p.martin@assetflow.com', role: 'DG', roleLabel: 'Manager', statut: 'actif', lastLogin: 'Hier, 16:45' },
  { id: 4, prenom: 'Sophie', nom: 'Bernard', email: 's.bernard@assetflow.com', role: 'TECHNICIEN', roleLabel: 'Inventaire', statut: 'inactif', lastLogin: 'Il y a 5 jours' },
];

const ROLE_BADGE = {
  ADMIN: 'admin',
  COMPTABLE: 'comptable',
  DG: 'manager',
  TECHNICIEN: 'inventaire',
  CAISSE: 'inventaire',
};

const GestionUtilisateurs = () => {
  const [activeTab, setActiveTab] = useState('tous');
  const [page, setPage] = useState(1);

  const filtered =
    activeTab === 'tous'
      ? DEMO_USERS
      : activeTab === 'admin'
        ? DEMO_USERS.filter((u) => u.role === 'ADMIN')
        : DEMO_USERS.filter((u) => u.role === 'DG');

  return (
    <>
      <PageHeader
        title="Gestion des Utilisateurs"
        subtitle="Gérez les accès, les rôles et surveillez l'activité des membres de votre organisation."
        actions={
          <button type="button" className="af-btn af-btn-primary">
            <Plus size={16} />
            Ajouter un utilisateur
          </button>
        }
      />

      <div className="af-stats-grid">
        <StatCard label="Total Utilisateurs" value="1,284" trend="+12%" />
        <StatCard label="Utilisateurs Actifs" value="942" meta="73% du total" />
        <StatCard label="Nouveaux ce mois" value="48" meta="+5 aujourd'hui" />
        <StatCard label="Rôles Configurés" value="12" link={{ label: 'Voir les rôles', onClick: () => window.location.assign('/roles') }} />
      </div>

      <div className="af-card">
        <div className="af-tabs">
          {[
            { id: 'tous', label: 'Tous' },
            { id: 'admin', label: 'Administrateurs' },
            { id: 'managers', label: 'Managers' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`af-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
          <div style={{ marginLeft: 'auto', padding: '0 22px 12px' }}>
            <button type="button" className="af-btn af-btn-outline" style={{ padding: '8px 14px' }}>
              <SlidersHorizontal size={16} />
              Filtres avancés
            </button>
          </div>
        </div>

        <div className="af-table-wrap">
          <table className="af-table">
            <thead>
              <tr>
                <th>NOM &amp; EMAIL</th>
                <th>RÔLE</th>
                <th>STATUT</th>
                <th>DERNIÈRE CONNEXION</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.id}>
                  <td>
                    <div className="af-user-cell">
                      <div className="af-avatar" style={{ width: 36, height: 36, fontSize: 12 }}>
                        {u.prenom[0]}
                        {u.nom[0]}
                      </div>
                      <div className="af-user-cell-info">
                        <div className="name">
                          {u.prenom} {u.nom}
                        </div>
                        <div className="email">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <Badge variant={ROLE_BADGE[u.role] || 'inventaire'}>{u.roleLabel}</Badge>
                  </td>
                  <td>
                    <Badge variant={u.statut} showDot>
                      {u.statut === 'actif' ? 'Actif' : 'Inactif'}
                    </Badge>
                  </td>
                  <td style={{ color: 'var(--af-text-muted)' }}>{u.lastLogin}</td>
                  <td>
                    <button type="button" className="af-icon-btn" aria-label="Actions">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="af-table-footer">
          <span>Affichage de 1 à {filtered.length} sur 1,284 utilisateurs</span>
          <div className="af-pagination">
            <button type="button" className="af-page-btn" disabled onClick={() => setPage((p) => p - 1)} aria-label="Page précédente">
              <ChevronLeft size={16} />
            </button>
            {[1, 2, 3].map((n) => (
              <button
                key={n}
                type="button"
                className={`af-page-btn ${page === n ? 'active' : ''}`}
                onClick={() => setPage(n)}
              >
                {n}
              </button>
            ))}
            <button type="button" className="af-page-btn" onClick={() => setPage((p) => p + 1)} aria-label="Page suivante">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default GestionUtilisateurs;
