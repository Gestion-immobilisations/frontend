import React, { useEffect, useState } from 'react';
import { Search, Filter, ChevronRight, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import maintenancesService from '../../services/maintenances';
import { useNotifications } from '../../context/NotificationContext';
import '../../styles/technicien/maintenance.css';

const weekDays = ['LU', 'MA', 'ME', 'JE', 'VE', 'SA', 'DI'];

const formatDate = (d) => {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('fr-FR');
};

const GestionMaintenances = () => {
  const { notify } = useNotifications();
  const [activeTab, setActiveTab] = useState('planning');
  const [items, setItems] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const data = activeTab === 'planning'
      ? maintenancesService.getPlanifiees()
      : maintenancesService.getHistorique();
    setItems(data);
    setSelected(data[0] || null);
  }, [activeTab]);

  const handleStart = () => {
    if (!selected) return;
    maintenancesService.update(selected.id, { statut: 'en_cours' });
    notify.info('Intervention démarrée.');
    setItems(maintenancesService.getPlanifiees());
  };

  const prioriteLabel = (p) => {
    if (p === 'HAUTE' || p === 'CRITIQUE') return { text: 'CRITIQUE', className: 'text-critical' };
    return { text: 'MODÉRÉ', className: 'text-moderate' };
  };

  return (
    <div className="page">
      <div className="page__header">
        <h1 className="page__title">Gestion des maintenances</h1>
        <Link to="/pannes/declaration" className="btn btn--primary">
          + Nouvelle intervention
        </Link>
      </div>

      <div className="tabs">
        <button
          type="button"
          className={`tabs__btn ${activeTab === 'planning' ? 'tabs__btn--active' : ''}`}
          onClick={() => setActiveTab('planning')}
        >
          Planning
        </button>
        <button
          type="button"
          className={`tabs__btn ${activeTab === 'historique' ? 'tabs__btn--active' : ''}`}
          onClick={() => setActiveTab('historique')}
        >
          Historique
        </button>
      </div>

      <div className="grid-main-sidebar" style={{ gridTemplateColumns: 'minmax(0, 3fr) minmax(0, 2fr)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card">
            <div className="card__header">
              <h3>{activeTab === 'planning' ? 'Prochaines interventions' : 'Historique'}</h3>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button type="button" className="btn btn--secondary btn--sm" aria-label="Filtrer">
                  <Filter size={16} />
                </button>
                <button type="button" className="btn btn--secondary btn--sm" aria-label="Rechercher">
                  <Search size={16} />
                </button>
              </div>
            </div>
            {items.length === 0 ? (
              <p className="empty-state">Aucune maintenance {activeTab === 'planning' ? 'planifiée' : 'terminée'}.</p>
            ) : (
              items.map((item) => {
                const prio = prioriteLabel(item.priorite);
                return (
                  <button
                    key={item.id}
                    type="button"
                    className={`intervention-list__item ${selected?.id === item.id ? 'intervention-list__item--selected' : ''}`}
                    onClick={() => setSelected(item)}
                  >
                    <span className="intervention-list__icon">
                      <ShieldCheck size={20} aria-hidden />
                    </span>
                    <span className="intervention-list__content">
                      <p className="intervention-list__title">{item.title}</p>
                      <p className="intervention-list__meta">{item.subtitle}</p>
                      <p className="intervention-list__date">{formatDate(item.date_prevue)}</p>
                    </span>
                    <span className={prio.className}>{prio.text}</span>
                    <ChevronRight size={16} style={{ color: '#94a3b8' }} aria-hidden />
                  </button>
                );
              })
            )}
          </div>

          <div className="card">
            <div className="card__body">
              <h3 style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                Chronologie hebdomadaire
              </h3>
              <div className="week-timeline">
                {weekDays.map((day, idx) => (
                  <div key={day} className="week-timeline__day">
                    <span className={`week-timeline__label ${idx === 1 ? 'week-timeline__label--active' : ''}`}>{day}</span>
                    <span className={`week-timeline__dot ${idx === 0 ? 'week-timeline__dot--filled' : idx === 1 ? 'week-timeline__dot--ring' : idx === 3 ? 'week-timeline__dot--blue' : ''}`} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          {selected ? (
            <>
              <div className="panel-navy">
                <h3>Détails de l&apos;intervention</h3>
                <p>Référence : #{selected.id}</p>
              </div>
              <div className="card__body" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <span style={{ padding: '0.5rem', borderRadius: 'var(--radius-lg)', background: '#f0fdf4', color: '#16a34a' }}>
                    <ShieldCheck size={20} aria-hidden />
                  </span>
                  <div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Type de maintenance</p>
                    <p style={{ fontWeight: 500 }}>{selected.type === 'preventive' ? 'Préventive' : 'Corrective'}</p>
                  </div>
                </div>
                <div className="grid-2">
                  <div>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Date prévue</p>
                    <p style={{ fontWeight: 500 }}>{formatDate(selected.date_prevue)}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Coût estimé</p>
                    <p style={{ fontWeight: 500 }}>
                      {selected.cout_estime != null ? `${Number(selected.cout_estime).toLocaleString('fr-FR')} €` : '—'}
                    </p>
                  </div>
                </div>
                <div>
                  <p style={{ fontWeight: 600, marginBottom: '0.75rem', fontSize: '0.875rem' }}>Observations et tâches</p>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {(selected.tasks || []).map((task, i) => (
                      <li key={i} style={{ display: 'flex', gap: '0.5rem', fontSize: '0.875rem', color: task.done ? '#94a3b8' : 'inherit', textDecoration: task.done ? 'line-through' : 'none' }}>
                        <input type="checkbox" checked={task.done} readOnly aria-label={task.label} />
                        {task.label}
                      </li>
                    ))}
                  </ul>
                </div>
                {activeTab === 'planning' && (
                  <button type="button" className="btn btn--primary btn--block" onClick={handleStart}>
                    Démarrer l&apos;intervention
                  </button>
                )}
              </div>
            </>
          ) : (
            <p className="empty-state">Sélectionnez une intervention.</p>
          )}
        </div>
      </div>

      <div className="grid-3">
        <div className="card card__body" style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '1.875rem', fontWeight: 700 }}>94 %</p>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Taux de complétion</p>
          <p style={{ fontSize: '0.75rem', color: '#16a34a', marginTop: '0.25rem' }}>+2,4 % vs mois dernier</p>
        </div>
        <div className="card card__body" style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '1.875rem', fontWeight: 700 }}>12 h</p>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Temps d&apos;arrêt prévu</p>
        </div>
        <div className="card card__body" style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '1.875rem', fontWeight: 700 }}>8,2 k€</p>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Budget maintenance consommé</p>
        </div>
      </div>
    </div>
  );
};

export default GestionMaintenances;
