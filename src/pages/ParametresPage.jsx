import React, { useState } from 'react';
import PageHeader from '../components/ui/PageHeader';
import Toggle from '../components/ui/Toggle';
import Fab from '../components/ui/Fab';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ShieldOutlinedIcon from '@mui/icons-material/ShieldOutlined';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import SaveOutlinedIcon from '@mui/icons-material/SaveOutlined';
import '../styles/pages/parametres.css';

const ParametresPage = () => {
  const [activeTab, setActiveTab] = useState('informations');
  const [twoFa, setTwoFa] = useState(true);
  const [notifs, setNotifs] = useState({
    alertes: true,
    rapports: true,
    actifs: false,
  });

  const [institution, setInstitution] = useState({
    nom: 'AssetFlow Enterprise Solutions',
    adresse: '15 Avenue de la République, 75011 Paris, France',
    structure: 'SA',
    siret: '123 456 789 00012',
  });

  const tabs = [
    { id: 'informations', label: 'Informations', icon: InfoOutlinedIcon },
    { id: 'securite', label: 'Sécurité', icon: ShieldOutlinedIcon },
    { id: 'notifications', label: 'Notifications', icon: NotificationsOutlinedIcon },
  ];

  return (
    <div className="af-page">
      <PageHeader
        title="Paramètres système"
        subtitle="Gérez les configurations globales et la sécurité de votre plateforme AssetFlow."
      />

      <div className="af-tabs">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              className={`af-tab ${activeTab === tab.id ? 'af-tab--active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <Icon fontSize="small" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="af-settings__layout">
        <div>
          {(activeTab === 'informations' || activeTab === 'securite') && (
            <div className="af-card af-settings__form-card">
              <h3>
                <BusinessOutlinedIcon fontSize="small" />
                Informations de l&apos;institution
              </h3>
              <div className="af-form-field">
                <label htmlFor="nom">Nom de l&apos;institution</label>
                <input
                  id="nom"
                  type="text"
                  value={institution.nom}
                  onChange={(e) => setInstitution({ ...institution, nom: e.target.value })}
                />
              </div>
              <div className="af-form-field">
                <label htmlFor="adresse">Adresse du siège social</label>
                <textarea
                  id="adresse"
                  value={institution.adresse}
                  onChange={(e) => setInstitution({ ...institution, adresse: e.target.value })}
                />
              </div>
              <div className="af-form-field">
                <label htmlFor="structure">Structure juridique</label>
                <select
                  id="structure"
                  value={institution.structure}
                  onChange={(e) => setInstitution({ ...institution, structure: e.target.value })}
                >
                  <option value="SA">Société Anonyme (SA)</option>
                  <option value="SARL">SARL</option>
                  <option value="SAS">SAS</option>
                </select>
              </div>
              <div className="af-form-field">
                <label htmlFor="siret">Identifiant fiscal (SIRET)</label>
                <input
                  id="siret"
                  type="text"
                  value={institution.siret}
                  onChange={(e) => setInstitution({ ...institution, siret: e.target.value })}
                />
              </div>
            </div>
          )}

          {(activeTab === 'securite' || activeTab === 'informations') && (
            <div className="af-card af-settings__form-card">
              <h3>
                <ShieldOutlinedIcon fontSize="small" />
                Sécurité &amp; Authentification
              </h3>
              <div className="af-security-row">
                <div>
                  <strong style={{ display: 'block', marginBottom: 4 }}>Changement de mot de passe</strong>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--af-text-muted)' }}>
                    Dernière modification il y a 3 mois
                  </span>
                </div>
                <button type="button" className="af-btn af-btn-primary">
                  Modifier
                </button>
              </div>
              <div className="af-security-row">
                <div>
                  <strong style={{ display: 'block', marginBottom: 4 }}>
                    Authentification à deux facteurs (2FA)
                  </strong>
                  <span style={{ fontSize: '0.8125rem', color: 'var(--af-text-muted)' }}>
                    Sécurisez l&apos;accès avec un code temporaire.
                  </span>
                </div>
                <Toggle id="2fa" checked={twoFa} onChange={setTwoFa} />
              </div>
            </div>
          )}
        </div>

        <aside>
          <div className="af-settings-sidebar__actions">
            <button type="button" className="af-btn af-btn-primary">
              <SaveOutlinedIcon fontSize="small" />
              Sauvegarder les modifications
            </button>
            <button type="button" className="af-btn af-btn-secondary">
              Annuler
            </button>
          </div>

          <div className="af-card af-notif-pref">
            <h3 style={{ margin: '0 0 16px', fontSize: '1rem' }}>Préférences de notification</h3>
            {[
              { key: 'alertes', label: 'Alertes critiques' },
              { key: 'rapports', label: 'Rapports hebdomadaires' },
              { key: 'actifs', label: 'Nouveaux actifs' },
            ].map((item) => (
              <div key={item.key} className="af-notif-pref__row">
                <span>{item.label}</span>
                <Toggle
                  id={`notif-${item.key}`}
                  checked={notifs[item.key]}
                  onChange={(v) => setNotifs({ ...notifs, [item.key]: v })}
                />
              </div>
            ))}
          </div>

          <div className="af-help-card">
            <p>Besoin d&apos;aide ? Consultez la documentation technique</p>
          </div>
        </aside>
      </div>

      <Fab ariaLabel="Action rapide" />
    </div>
  );
};

export default ParametresPage;
