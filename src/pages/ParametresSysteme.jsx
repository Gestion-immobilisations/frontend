import React, { useState } from 'react';
import { Info, Shield, Bell, Building2, Zap, Save } from 'lucide-react';
import PageHeader from '../components/ui/PageHeader';

const Toggle = ({ checked, onChange }) => (
  <label className="af-toggle">
    <input type="checkbox" checked={checked} onChange={(e) => onChange?.(e.target.checked)} />
    <span className="af-toggle-slider" />
  </label>
);

const ParametresSysteme = () => {
  const [activeTab, setActiveTab] = useState('info');
  const [twoFa, setTwoFa] = useState(true);
  const [notifs, setNotifs] = useState({ critical: true, weekly: true, assets: false });

  const tabs = [
    { id: 'info', label: 'Informations', icon: Info },
    { id: 'security', label: 'Sécurité', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ];

  return (
    <>
      <PageHeader
        title="Paramètres système"
        subtitle="Gérez les configurations globales et la sécurité de votre plateforme AssetFlow."
      />

      <div style={{ display: 'flex', gap: 8, marginBottom: 24, borderBottom: '1px solid var(--af-border)' }}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '12px 16px',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                fontWeight: activeTab === tab.id ? 600 : 500,
                color: activeTab === tab.id ? 'var(--af-navy)' : 'var(--af-text-muted)',
                borderBottom: activeTab === tab.id ? '2px solid var(--af-navy)' : '2px solid transparent',
                marginBottom: -1,
              }}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="af-grid-main-side">
        <div>
          {(activeTab === 'info' || activeTab === 'security') && (
            <div className="af-card" style={{ padding: 24, marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <Building2 size={20} color="var(--af-navy)" />
                <h3 className="af-card-title">Informations de l'institution</h3>
              </div>
              <div className="af-form-group">
                <label>Nom de l'institution</label>
                <input className="af-input" defaultValue="AssetFlow Enterprise Solutions" />
              </div>
              <div className="af-form-group">
                <label>Adresse du siège social</label>
                <textarea className="af-textarea" defaultValue="15 Avenue de la République, 75011 Paris, France" />
              </div>
              <div className="af-form-row">
                <div className="af-form-group">
                  <label>Structure juridique</label>
                  <select className="af-select" defaultValue="sa">
                    <option value="sa">Société Anonyme (SA)</option>
                    <option value="sarl">SARL</option>
                  </select>
                </div>
                <div className="af-form-group">
                  <label>Identifiant fiscal (SIRET)</label>
                  <input className="af-input" defaultValue="123 456 789 00012" />
                </div>
              </div>
            </div>
          )}

          {(activeTab === 'security' || activeTab === 'info') && (
            <div className="af-card" style={{ padding: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                <Shield size={20} color="var(--af-navy)" />
                <h3 className="af-card-title">Sécurité &amp; Authentification</h3>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: 16,
                  background: 'var(--af-gray-bg)',
                  borderRadius: 8,
                  marginBottom: 12,
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>Changement de mot de passe</div>
                  <p style={{ fontSize: 12, color: 'var(--af-text-muted)', margin: '4px 0 0' }}>
                    Dernière modification il y a 3 mois
                  </p>
                </div>
                <button type="button" className="af-btn af-btn-primary">Modifier</button>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: 16,
                  background: 'var(--af-gray-bg)',
                  borderRadius: 8,
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>Authentification à deux facteurs (2FA)</div>
                  <p style={{ fontSize: 12, color: 'var(--af-text-muted)', margin: '4px 0 0' }}>
                    Sécurisez l'accès avec un code temporaire
                  </p>
                </div>
                <Toggle checked={twoFa} onChange={setTwoFa} />
              </div>
            </div>
          )}
        </div>

        <div>
          <div
            className="af-card"
            style={{
              padding: 20,
              marginBottom: 16,
              background: 'var(--af-navy)',
              color: 'white',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <Zap size={18} />
              <h3 style={{ margin: 0, fontSize: 16 }}>Actions rapides</h3>
            </div>
            <button
              type="button"
              className="af-btn"
              style={{
                width: '100%',
                background: 'white',
                color: 'var(--af-navy)',
                marginBottom: 10,
              }}
            >
              <Save size={16} />
              Sauvegarder les modifications
            </button>
            <button
              type="button"
              className="af-btn"
              style={{ width: '100%', background: 'transparent', border: '1px solid rgba(255,255,255,0.4)', color: 'white' }}
            >
              Annuler
            </button>
          </div>

          <div className="af-card" style={{ padding: 20, marginBottom: 16 }}>
            <h3 className="af-card-title" style={{ marginBottom: 16 }}>
              Préférences de notification
            </h3>
            {[
              { key: 'critical', label: 'Alertes critiques' },
              { key: 'weekly', label: 'Rapports hebdomadaires' },
              { key: 'assets', label: 'Nouveaux actifs' },
            ].map((item) => (
              <div
                key={item.key}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}
              >
                <span style={{ fontSize: 14 }}>{item.label}</span>
                <Toggle
                  checked={notifs[item.key]}
                  onChange={(v) => setNotifs((n) => ({ ...n, [item.key]: v }))}
                />
              </div>
            ))}
          </div>

          <div
            className="af-card"
            style={{
              padding: 24,
              minHeight: 120,
              background: 'linear-gradient(rgba(15,23,42,0.7), rgba(15,23,42,0.85)), url(https://images.unsplash.com/photo-1497366216548-37526070297c?w=400) center/cover',
              color: 'white',
            }}
          >
            <p style={{ margin: 0, fontSize: 14, fontWeight: 500 }}>
              Besoin d'aide ? Consultez la documentation technique
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ParametresSysteme;

