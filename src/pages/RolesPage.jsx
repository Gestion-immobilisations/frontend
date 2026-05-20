import React, { useState } from 'react';
import PageHeader from '../components/ui/PageHeader';
import Toggle from '../components/ui/Toggle';
import Fab from '../components/ui/Fab';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import AddIcon from '@mui/icons-material/Add';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import '../styles/pages/roles.css';

const ROLES = [
  { id: 'admin', nom: 'Administrateur', description: 'Accès total au système', systeme: true },
  { id: 'comptable', nom: 'Comptable', description: 'Finances & Audit', systeme: false },
  { id: 'technicien', nom: 'Technicien', description: 'Opérations & Maintenance', systeme: false },
  { id: 'auditeur', nom: 'Auditeur', description: 'Lecture seule uniquement', systeme: false },
];

const PERMISSION_GROUPS = [
  {
    title: 'Gestion des actifs',
    icon: Inventory2OutlinedIcon,
    permissions: [
      { id: 'create', label: 'Créer/Éditer Actifs', default: true },
      { id: 'delete', label: 'Supprimer Actifs', default: true },
      { id: 'transfer', label: 'Transfert de Propriété', default: true },
      { id: 'import', label: 'Importation de masse', default: true },
    ],
  },
  {
    title: 'Configuration système',
    icon: SettingsOutlinedIcon,
    permissions: [
      { id: 'params', label: 'Modifier Paramètres', default: true },
      { id: 'api', label: 'Intégrations API', default: false, disabled: true },
    ],
  },
  {
    title: 'Audit & Reporting',
    icon: AssessmentOutlinedIcon,
    permissions: [
      { id: 'export', label: 'Exportation de rapports d\'audit', default: true, highlight: true },
    ],
  },
];

const RolesPage = () => {
  const [selectedRole, setSelectedRole] = useState(ROLES[0]);
  const [permissions, setPermissions] = useState(() => {
    const initial = {};
    PERMISSION_GROUPS.forEach((g) => {
      g.permissions.forEach((p) => {
        initial[p.id] = p.default;
      });
    });
    return initial;
  });

  const togglePermission = (id, value) => {
    setPermissions((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <div className="af-page">
      <PageHeader
        title="Gestion des Rôles"
        subtitle="Configurez les niveaux d'accès et les permissions de sécurité pour l'ensemble de l'organisation AssetFlow."
        actions={
          <div className="af-roles__summary">
            <div className="af-roles__summary-card af-roles__summary-card--primary">
              <ShieldOutlinedIcon sx={{ mb: 0.5 }} />
              <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>12</div>
              <div style={{ fontSize: '0.6875rem', opacity: 0.9 }}>RÔLES DÉFINIS · ACTIF</div>
            </div>
            <div className="af-roles__summary-card af-roles__summary-card--alert">
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--af-danger)' }}>0</div>
              <div style={{ fontSize: '0.6875rem', color: 'var(--af-danger)' }}>CONFLITS DE PERMS · ALERTE</div>
            </div>
          </div>
        }
      />

      <div className="af-roles__layout">
        <div className="af-card">
          <div className="af-role-list__head">
            <h3>Rôles Existants</h3>
            <button type="button" className="af-btn af-btn-ghost" aria-label="Ajouter un rôle">
              <AddIcon fontSize="small" />
            </button>
          </div>
          {ROLES.map((role, i) => (
            <button
              key={role.id}
              type="button"
              className={`af-role-item ${
                selectedRole.id === role.id ? 'af-role-item--selected' : ''
              }`}
              onClick={() => setSelectedRole(role)}
            >
              <div
                className={`af-role-item__icon ${
                  i > 0 ? 'af-role-item__icon--muted' : ''
                }`}
              >
                <ShieldOutlinedIcon fontSize="small" />
              </div>
              <div className="af-role-item__info">
                <strong>{role.nom}</strong>
                <span>{role.description}</span>
              </div>
              <ChevronRightIcon fontSize="small" color="action" />
            </button>
          ))}
        </div>

        <div className="af-card af-permissions">
          <div className="af-permissions__head">
            <div>
              <h3 style={{ margin: '0 0 6px', fontSize: '1.125rem' }}>
                Permissions : {selectedRole.nom}
                {selectedRole.systeme && (
                  <span className="af-badge af-badge-neutral" style={{ marginLeft: 8 }}>
                    SYSTÈME
                  </span>
                )}
              </h3>
              <p style={{ margin: 0, fontSize: '0.8125rem', color: 'var(--af-text-muted)' }}>
                Dernière modification par Admin le 24 Oct 2023
              </p>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button type="button" className="af-btn af-btn-ghost">
                Annuler
              </button>
              <button type="button" className="af-btn af-btn-primary">
                Enregistrer
              </button>
            </div>
          </div>

          {PERMISSION_GROUPS.map((group) => {
            const Icon = group.icon;
            return (
              <div key={group.title} className="af-permissions__group">
                <h4>
                  <Icon fontSize="small" />
                  {group.title}
                </h4>
                {group.permissions.map((perm) => (
                  <div
                    key={perm.id}
                    className={`af-permission-row ${
                      perm.highlight ? 'af-permission-row--highlight' : ''
                    }`}
                  >
                    <span>{perm.label}</span>
                    <Toggle
                      id={`perm-${perm.id}`}
                      checked={permissions[perm.id]}
                      onChange={(v) => togglePermission(perm.id, v)}
                      disabled={perm.disabled}
                    />
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      <Fab ariaLabel="Nouveau rôle" />
    </div>
  );
};

export default RolesPage;
