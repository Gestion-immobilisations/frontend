import React, { useState } from 'react';
import { Trash2, Pencil, RefreshCw, Plus, Cloud } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';

const AUDIT_ENTRIES = [
  { type: 'delete', icon: Trash2, color: '#dc2626', title: 'Asset supprimé', desc: "Le serveur de production a été retiré de l'inventaire.", time: '14:42 AUJ.', id: '#SRV-8842', module: "Gestion d'actifs" },
  { type: 'update', icon: Pencil, color: '#2563eb', title: 'Profil mis à jour', desc: "Les permissions d'accès au coffre-fort numérique ont été modifiées.", time: '12:15 AUJ.', id: '#USR-1204', module: 'Sécurité' },
  { type: 'reset', icon: RefreshCw, color: '#ea580c', title: 'Réinitialisation forcée', desc: "Mot de passe expiré pour l'accès aux APIs de facturation.", time: '10:02 AUJ.', id: '#AUTH-992', module: 'Authentification' },
  { type: 'create', icon: Plus, color: '#16a34a', title: 'Nouvel Asset créé', desc: "Enregistrement d'un lot de 50 stations de travail mobiles Dell Precision.", time: 'Hier 18:50', id: '#AST-5501', module: 'Inventaire' },
  { type: 'sync', icon: Cloud, color: '#0f172a', title: 'Synchronisation cloud', desc: 'Mise à jour réussie des données avec le serveur de sauvegarde secondaire.', time: 'Hier 09:12', id: '#SYNC-44', module: 'Infrastructure' },
];

const JournalAudit = () => {
  const [dateFilter, setDateFilter] = useState('24h');
  const [moduleFilter, setModuleFilter] = useState('');
  const [userFilter, setUserFilter] = useState('');

  return (
    <>
      <PageHeader
        title="Journal d'audit"
        subtitle="Suivi chronologique de l'activité du système et des modifications d'actifs."
      />

      <div className="af-grid-main-side">
        <div>
          <div className="af-filter-bar">
            <div className="af-filter-group" style={{ flex: 1 }}>
              <label>Date</label>
              <select className="af-select" value={dateFilter} onChange={(e) => setDateFilter(e.target.value)}>
                <option value="24h">Dernières 24 heures</option>
                <option value="7d">7 derniers jours</option>
                <option value="30d">30 derniers jours</option>
              </select>
            </div>
            <div className="af-filter-group" style={{ flex: 1 }}>
              <label>Module</label>
              <select className="af-select" value={moduleFilter} onChange={(e) => setModuleFilter(e.target.value)}>
                <option value="">Tous les modules</option>
                <option value="actifs">Gestion d'actifs</option>
                <option value="sec">Sécurité</option>
              </select>
            </div>
            <div className="af-filter-group" style={{ flex: 1 }}>
              <label>Utilisateur</label>
              <select className="af-select" value={userFilter} onChange={(e) => setUserFilter(e.target.value)}>
                <option value="">Tous les responsables</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          {AUDIT_ENTRIES.map((entry) => {
            const Icon = entry.icon;
            return (
              <div key={entry.id} className="af-audit-item" style={{ borderLeftColor: entry.color }}>
                <div className="af-audit-icon" style={{ background: `${entry.color}18`, color: entry.color }}>
                  <Icon size={20} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: entry.color }}>{entry.time}</span>
                    <span style={{ fontSize: 11, color: 'var(--af-text-muted)' }}>
                      ID: {entry.id} · Module: {entry.module}
                    </span>
                  </div>
                  <div style={{ fontWeight: 600, marginTop: 4, color: 'var(--af-navy)' }}>{entry.title}</div>
                  <p style={{ fontSize: 13, color: 'var(--af-text-muted)', margin: '4px 0 0' }}>{entry.desc}</p>
                </div>
              </div>
            );
          })}

          <p style={{ fontSize: 13, color: 'var(--af-text-muted)', marginTop: 16 }}>
            Affichage de 5 sur 1,240 entrées
          </p>
        </div>

        <div>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16, color: 'var(--af-navy)' }}>
            Résumé de l'activité
          </h3>

          <div className="af-stat-card" style={{ marginBottom: 16 }}>
            <div className="af-stat-label">Actions ce jour</div>
            <div className="af-stat-value">124</div>
            <div className="af-stat-trend">+12%</div>
          </div>

          <div className="af-card" style={{ padding: 16, marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.06em', color: 'var(--af-text-muted)', marginBottom: 10 }}>
              ALERTES CRITIQUES
            </div>
            <div style={{ padding: 12, background: 'var(--af-red-bg)', borderRadius: 8, fontSize: 13, color: 'var(--af-red)', fontWeight: 500 }}>
              3 suppressions — Nécessite vérification
            </div>
          </div>

          <div className="af-card" style={{ padding: 16, marginBottom: 16 }}>
            <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 14 }}>Répartition</h4>
            {[
              { label: 'Modifications', pct: 65, color: 'var(--af-navy)' },
              { label: 'Créations', pct: 25, color: 'var(--af-blue)' },
              { label: 'Suppressions', pct: 10, color: 'var(--af-red)' },
            ].map((row) => (
              <div key={row.label} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                  <span>{row.label}</span>
                  <span style={{ fontWeight: 600 }}>{row.pct}%</span>
                </div>
                <div className="af-progress-bar">
                  <div className="af-progress-fill" style={{ width: `${row.pct}%`, background: row.color }} />
                </div>
              </div>
            ))}
          </div>

          <div className="af-card" style={{ padding: 20, background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)', color: 'white' }}>
            <h4 style={{ margin: '0 0 8px', fontSize: 16 }}>Audit Mensuel</h4>
            <p style={{ fontSize: 13, opacity: 0.85, margin: '0 0 16px' }}>
              Le rapport automatique de Juillet est prêt à être consulté.
            </p>
            <button type="button" className="af-btn af-btn-primary" style={{ width: '100%' }}>
              Consulter
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default JournalAudit;
