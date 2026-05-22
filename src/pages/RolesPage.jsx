import React, { useEffect, useState } from 'react';
import PageHeader from '../components/ui/PageHeader';
import Toggle from '../components/ui/Toggle';
import Fab from '../components/ui/Fab';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import AddIcon from '@mui/icons-material/Add';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import roleService from '../services/roleService';
import {
  getRoleLabel,
  ROLE_DESCRIPTIONS,
  SYSTEM_ROLES,
} from '../utils/roleConfig';
import '../styles/pages/roles.css';

const PERMISSION_GROUPS = [
  {
    title: 'Gestion des actifs',
    icon: Inventory2OutlinedIcon,
    permissions: [
      { id: 'create', label: 'Créer/Éditer Actifs', default: false },
      { id: 'delete', label: 'Supprimer Actifs', default: false },
      { id: 'transfer', label: 'Transfert de Propriété', default: false },
      { id: 'import', label: 'Importation de masse', default: false },
    ],
  },
  {
    title: 'Configuration système',
    icon: SettingsOutlinedIcon,
    permissions: [
      { id: 'params', label: 'Modifier Paramètres', default: false },
      { id: 'api', label: 'Intégrations API', default: false, disabled: true },
    ],
  },
  {
    title: 'Audit & Reporting',
    icon: AssessmentOutlinedIcon,
    permissions: [
      { id: 'export', label: "Exportation de rapports d'audit", default: false, highlight: true },
    ],
  },
];

const DEFAULT_PERMISSIONS_BY_ROLE = {
  ADMIN: {
    create: true,
    delete: true,
    transfer: true,
    import: true,
    params: true,
    export: true,
  },
  COMPTABLE: { create: true, delete: false, transfer: true, import: true, export: true },
  TECHNICIEN: { create: false, delete: false, transfer: false, import: false, export: false },
  MAGASINIER: { create: false, delete: false, transfer: false, import: false, export: false },
  DG: { create: false, delete: false, transfer: false, import: false, export: true },
};

function buildPermissionsForRole(roleNom) {
  const code = String(roleNom || '').toUpperCase();
  const defaults = DEFAULT_PERMISSIONS_BY_ROLE[code] || {};
  const initial = {};
  PERMISSION_GROUPS.forEach((g) => {
    g.permissions.forEach((p) => {
      initial[p.id] = defaults[p.id] ?? p.default;
    });
  });
  return initial;
}

const RolesPage = () => {
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [permissions, setPermissions] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await roleService.getAll();
        const mapped = data.map((r) => ({
          id: String(r.id_role ?? r.nom),
          nom: getRoleLabel(r.nom),
          code: r.nom,
          description: r.description || ROLE_DESCRIPTIONS[r.nom] || '—',
          systeme: SYSTEM_ROLES.has(String(r.nom).toUpperCase()),
        }));
        setRoles(mapped);
        if (mapped.length) {
          setSelectedRole(mapped[0]);
          setPermissions(buildPermissionsForRole(mapped[0].code));
        }
      } catch (err) {
        setError(err?.response?.data?.detail || err.message || 'Erreur de chargement');
        setRoles([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const selectRole = (role) => {
    setSelectedRole(role);
    setPermissions(buildPermissionsForRole(role.code));
  };

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
              <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                {loading ? '…' : roles.length}
              </div>
              <div style={{ fontSize: '0.6875rem', opacity: 0.9 }}>RÔLES DÉFINIS · ACTIF</div>
            </div>
            <div className="af-roles__summary-card af-roles__summary-card--alert">
              <div style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--af-danger)' }}>0</div>
              <div style={{ fontSize: '0.6875rem', color: 'var(--af-danger)' }}>
                CONFLITS DE PERMS · ALERTE
              </div>
            </div>
          </div>
        }
      />

      {error && (
        <p className="af-empty-message" style={{ marginBottom: 16, color: 'var(--af-danger)' }}>
          {error}
        </p>
      )}

      <div className="af-roles__layout">
        <div className="af-card">
          <div className="af-role-list__head">
            <h3>Rôles Existants</h3>
            <button type="button" className="af-btn af-btn-ghost" aria-label="Ajouter un rôle">
              <AddIcon fontSize="small" />
            </button>
          </div>
          {loading ? (
            <p className="af-empty-message">Chargement…</p>
          ) : roles.length === 0 ? (
            <p className="af-empty-message">Aucune donnée disponible</p>
          ) : (
            roles.map((role, i) => (
              <button
                key={role.id}
                type="button"
                className={`af-role-item ${
                  selectedRole?.id === role.id ? 'af-role-item--selected' : ''
                }`}
                onClick={() => selectRole(role)}
              >
                <div className={`af-role-item__icon ${i > 0 ? 'af-role-item__icon--muted' : ''}`}>
                  <ShieldOutlinedIcon fontSize="small" />
                </div>
                <div className="af-role-item__info">
                  <strong>{role.nom}</strong>
                  <span>{role.description}</span>
                </div>
                <ChevronRightIcon fontSize="small" color="action" />
              </button>
            ))
          )}
        </div>

        <div className="af-card af-permissions">
          {selectedRole ? (
            <>
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
                    Rôle backend : {selectedRole.code} — permissions indicatives (API permissions non
                    branchée)
                  </p>
                </div>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button type="button" className="af-btn af-btn-ghost">
                    Annuler
                  </button>
                  <button type="button" className="af-btn af-btn-primary" disabled>
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
                          disabled={perm.disabled || selectedRole.systeme}
                        />
                      </div>
                    ))}
                  </div>
                );
              })}
            </>
          ) : (
            <p className="af-empty-message">Sélectionnez un rôle</p>
          )}
        </div>
      </div>

      <Fab ariaLabel="Nouveau rôle" />
    </div>
  );
};

export default RolesPage;
