import React, { useState } from 'react';
import { Plus, ChevronRight, Shield, AlertTriangle } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';
import Badge from '../components/ui/Badge';

const ROLES = [
  { id: 'admin', label: 'Administrateur', desc: 'Accès total au système', system: true },
  { id: 'comptable', label: 'Comptable', desc: 'Finances & Audit', system: false },
  { id: 'technicien', label: 'Technicien', desc: 'Maintenance & inventaire', system: false },
  { id: 'auditeur', label: 'Auditeur', desc: 'Lecture seule uniquement', system: false },
];

const PERMISSION_SECTIONS = [
  {
    title: 'Gestion des actifs',
    items: [
      { id: 'create', label: 'Créer/Éditer Actifs', desc: 'Ajouter et modifier les immobilisations', on: true },
      { id: 'delete', label: 'Supprimer Actifs', desc: 'Retirer des biens du registre', on: true },
      { id: 'transfer', label: 'Transfert de Propriété', desc: 'Réaffecter les actifs entre services', on: true },
      { id: 'import', label: 'Importation de masse', desc: 'Importer via fichier CSV/Excel', on: true },
    ],
  },
  {
    title: 'Configuration système',
    items: [
      { id: 'settings', label: 'Modifier Paramètres', desc: 'Configurer les options globales', on: true },
      { id: 'api', label: 'Intégrations API', desc: 'Gérer les connexions externes', on: false },
    ],
  },
  {
    title: 'Audit & Reporting',
    items: [
      { id: 'export', label: "Exportation de rapports d'audit", desc: 'Exporter les journaux et rapports', on: true, highlight: true },
    ],
  },
];

const Toggle = ({ checked, onChange }) => (
  <label className="af-toggle">
    <input type="checkbox" checked={checked} onChange={(e) => onChange?.(e.target.checked)} />
    <span className="af-toggle-slider" />
  </label>
);

const GestionRoles = () => {
  const [selectedRole, setSelectedRole] = useState('admin');
  const [permissions, setPermissions] = useState(() => {
    const map = {};
    PERMISSION_SECTIONS.forEach((s) =>
      s.items.forEach((i) => {
        map[i.id] = i.on;
      })
    );
    return map;
  });

  const role = ROLES.find((r) => r.id === selectedRole);

  return (
    <>
      <PageHeader
        title="Gestion des Rôles"
        subtitle="Configurez les niveaux d'accès et les permissions de sécurité pour l'ensemble de l'organisation AssetFlow."
        actions={
          <div style={{ display: 'flex', gap: 12 }}>
            <div className="af-stat-card" style={{ padding: '14px 18px', minWidth: 160, background: 'var(--af-navy)', borderColor: 'var(--af-navy)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <Shield size={16} color="white" />
                <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.9)' }}>12 RÔLES DÉFINIS</span>
              </div>
              <Badge variant="system">ACTIF</Badge>
            </div>
            <div className="af-stat-card" style={{ padding: '14px 18px', borderColor: 'var(--af-red)', minWidth: 160 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <AlertTriangle size={16} color="var(--af-red)" />
                <span style={{ fontSize: 11, fontWeight: 700 }}>0 CONFLITS DE PERMS</span>
              </div>
              <span className="af-badge af-badge-inactif">ALERTE</span>
            </div>
          </div>
        }
      />

      <div className="af-grid-roles">
        <div className="af-card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 className="af-card-title">Rôles Existants</h3>
            <button type="button" className="af-icon-btn" aria-label="Ajouter un rôle">
              <Plus size={18} />
            </button>
          </div>
          {ROLES.map((r) => (
            <button
              key={r.id}
              type="button"
              className={`af-role-list-item ${selectedRole === r.id ? 'selected' : ''}`}
              onClick={() => setSelectedRole(r.id)}
              style={{ width: '100%', textAlign: 'left' }}
            >
              <div className="af-brand-icon" style={{ width: 36, height: 36 }}>
                <Shield size={18} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, color: 'var(--af-navy)' }}>{r.label}</div>
                <div style={{ fontSize: 12, color: 'var(--af-text-muted)' }}>{r.desc}</div>
              </div>
              <ChevronRight size={18} color="var(--af-text-light)" />
            </button>
          ))}
        </div>

        <div className="af-card">
          <div className="af-card-header" style={{ flexWrap: 'wrap', gap: 12 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                <h3 className="af-card-title">Permissions : {role?.label}</h3>
                {role?.system && <Badge variant="system">SYSTÈME</Badge>}
              </div>
              <p style={{ fontSize: 12, color: 'var(--af-text-muted)', margin: 0 }}>
                Dernière modification par Admin le 24 Oct 2023
              </p>
            </div>
            <div style={{ display: 'flex', gap: 8, marginLeft: 'auto' }}>
              <button type="button" className="af-btn af-btn-ghost">Annuler</button>
              <button type="button" className="af-btn af-btn-primary">Enregistrer</button>
            </div>
          </div>

          <div style={{ padding: '20px 22px' }}>
            {PERMISSION_SECTIONS.map((section) => (
              <div key={section.title} style={{ marginBottom: 28 }}>
                <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 14, color: 'var(--af-navy)' }}>
                  {section.title}
                </h4>
                <div className="af-perm-grid">
                  {section.items.map((item) => (
                    <div
                      key={item.id}
                      className="af-perm-item"
                      style={
                        item.highlight
                          ? { borderStyle: 'dashed', borderColor: 'var(--af-blue)', background: 'var(--af-blue-bg)' }
                          : undefined
                      }
                    >
                      <div>
                        <h4>{item.label}</h4>
                        <p>{item.desc}</p>
                      </div>
                      <Toggle
                        checked={permissions[item.id]}
                        onChange={(v) => setPermissions((p) => ({ ...p, [item.id]: v }))}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <button type="button" className="af-fab" aria-label="Ajouter">
        <Plus size={24} />
      </button>
    </>
  );
};

export default GestionRoles;
