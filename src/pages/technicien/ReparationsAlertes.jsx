import React, { useEffect, useState } from 'react';
import { AlertOctagon, AlertTriangle, Download, CheckCircle, Package, Wrench } from 'lucide-react';
import reparationsService from '../../services/reparations';
import piecesService from '../../services/pieces';
import { useNotifications } from '../../context/NotificationContext';
import '../../styles/technicien/reparations.css';

const ReparationsAlertes = () => {
  const { notify } = useNotifications();
  const [repairs, setRepairs] = useState([]);
  const [stockFaible, setStockFaible] = useState([]);
  const [repairForm, setRepairForm] = useState({ asset: '', cout: '', parts: '', description: '' });

  useEffect(() => {
    setRepairs(reparationsService.getAll());
    const low = piecesService.getStockFaible();
    setStockFaible(low);
    if (!sessionStorage.getItem('stock_alerts_shown')) {
      low.forEach((p) => notify.stockFaible(p.designation));
      sessionStorage.setItem('stock_alerts_shown', '1');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const alertCards = [
    ...stockFaible.slice(0, 2).map((p, i) => ({
      key: p.id,
      border: 'alert-card--critical',
      icon: AlertOctagon,
      iconColor: '#ef4444',
      time: 'Stock faible',
      title: p.designation,
      description: `Quantité : ${p.quantite} (seuil : ${p.seuil_alerte})`,
      action: 'Commander des pièces',
    })),
    {
      key: 'demo-1',
      border: 'alert-card--warning',
      icon: AlertTriangle,
      iconColor: '#eab308',
      time: 'Il y a 2 h',
      title: 'Pompe hydraulique — pression basse',
      description: 'Pression en dessous du nominal. Planifier une inspection.',
      action: 'Planifier réparation',
    },
  ];

  const handleRepairSubmit = (e) => {
    e.preventDefault();
    if (!repairForm.asset.trim()) {
      notify.error('Indiquez le nom de l\'équipement.');
      return;
    }
    reparationsService.create({
      asset: repairForm.asset.trim(),
      cout: Number(repairForm.cout) || 0,
      parts: repairForm.parts.split(',').map((p) => p.trim()).filter(Boolean),
      description: repairForm.description.trim(),
    });
    notify.interventionEnregistree();
    setRepairForm({ asset: '', cout: '', parts: '', description: '' });
    setRepairs(reparationsService.getAll());
  };

  const timeline = [
    { icon: CheckCircle, variant: 'green', title: 'Réparation terminée', time: '24 oct., 14:30', desc: 'Compresseur AX-90 remis en service' },
    { icon: Package, variant: 'blue', title: 'Pièces reçues', time: '24 oct., 10:15', desc: 'VALVE-SET-B livré à l\'atelier' },
    { icon: Wrench, variant: 'gray', title: 'Réparation initiée', time: '23 oct., 09:00', desc: 'Technicien affecté au ticket BK-8821' },
  ];

  return (
    <div className="page">
      <div className="page__header">
        <h2 className="page__title reparations-page-title">
          Alertes équipements critiques
        </h2>
        {alertCards.length > 0 && (
          <span className="stat-card__badge stat-card__badge--critical">
            {alertCards.length} action{alertCards.length > 1 ? 's' : ''} requise{alertCards.length > 1 ? 's' : ''}
          </span>
        )}
      </div>

      <div className="grid-3">
        {alertCards.map((card) => (
          <article key={card.key} className={`alert-card ${card.border}`}>
            <div className="alert-card__head">
              <card.icon size={20} style={{ color: card.iconColor }} aria-hidden />
              <span className="alert-card__time">{card.time}</span>
            </div>
            <h3 className="alert-card__title">{card.title}</h3>
            <p className="alert-card__desc">{card.description}</p>
            <button type="button" className="btn btn--primary btn--block alert-card__action">
              {card.action}
            </button>
          </article>
        ))}
      </div>

      <article className="card card__body repair-form-card">
        <h3>Enregistrer une réparation</h3>
        <form className="form" onSubmit={handleRepairSubmit}>
          <div className="form__row">
            <div className="form__group">
              <label className="form__label form__label--required">Équipement</label>
              <input
                className="form__input"
                value={repairForm.asset}
                onChange={(e) => setRepairForm({ ...repairForm, asset: e.target.value })}
                required
              />
            </div>
            <div className="form__group">
              <label className="form__label">Coût final (€)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                className="form__input"
                value={repairForm.cout}
                onChange={(e) => setRepairForm({ ...repairForm, cout: e.target.value })}
              />
            </div>
          </div>
          <div className="form__group">
            <label className="form__label">Pièces (séparées par des virgules)</label>
            <input
              className="form__input"
              value={repairForm.parts}
              onChange={(e) => setRepairForm({ ...repairForm, parts: e.target.value })}
              placeholder="REF-A, REF-B"
            />
          </div>
          <div className="form__group">
            <label className="form__label">Description</label>
            <textarea
              className="form__textarea"
              rows={2}
              value={repairForm.description}
              onChange={(e) => setRepairForm({ ...repairForm, description: e.target.value })}
            />
          </div>
          <button type="submit" className="btn btn--primary">Enregistrer la réparation</button>
        </form>
      </article>

      <div className="grid-main-sidebar grid-main-sidebar--2-1">
        <div className="card">
          <div className="card__header">
            <h3>Journal détaillé des réparations</h3>
            <button type="button" className="btn btn--secondary btn--sm">
              <Download size={14} aria-hidden />
              Exporter CSV
            </button>
          </div>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Actif / n° ticket</th>
                  <th>Date de fin</th>
                  <th>Pièces détachées</th>
                  <th>Coût final</th>
                </tr>
              </thead>
              <tbody>
                {repairs.map((row) => (
                  <tr key={row.id}>
                    <td>
                      <p style={{ fontWeight: 500 }}>{row.asset}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Ticket #{row.ticket}</p>
                    </td>
                    <td>{new Date(row.date).toLocaleDateString('fr-FR')}</td>
                    <td>
                      {(row.parts || []).map((p) => (
                        <span key={p} className="tag" style={{ marginRight: '0.25rem' }}>{p}</span>
                      ))}
                    </td>
                    <td style={{ fontWeight: 500 }}>
                      {Number(row.cout).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="reparations-sidebar">
          <div className="card card__body">
            <h3 style={{ fontWeight: 600, marginBottom: '1rem' }}>Chronologie des interventions</h3>
            <div className="timeline">
              {timeline.map((ev, i) => (
                <div key={i} className="timeline__item">
                  <span className={`timeline__icon timeline__icon--${ev.variant}`}>
                    <ev.icon size={16} aria-hidden />
                  </span>
                  <div>
                    <p className="timeline__title">{ev.title}</p>
                    <p className="timeline__time">{ev.time}</p>
                    <p className="timeline__desc">{ev.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mttr-card">
            <p className="mttr-card__label">Temps moyen de réparation (MTTR)</p>
            <p className="mttr-card__value">4,2 h</p>
            <p className="mttr-card__trend">↓ 12 % vs mois dernier</p>
            <div className="mttr-card__bar">
              <div className="mttr-card__bar-fill" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReparationsAlertes;
