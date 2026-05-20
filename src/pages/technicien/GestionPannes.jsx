import React, { useEffect, useState } from 'react';
import { Filter, Plus, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SeverityBadge, StatusBadge } from '../../components/ui/Badge';
import biensService from '../../services/biens';
import interventionsService from '../../services/interventions';
import { useNotifications } from '../../context/NotificationContext';
import { validatePanneForm } from '../../utils/validation';
import '../../styles/technicien/pannes.css';

const GestionPannes = () => {
  const { notify } = useNotifications();
  const [biens, setBiens] = useState([]);
  const [interventions, setInterventions] = useState([]);
  const [form, setForm] = useState({ id_bien: '', urgence: 'MOYENNE', description: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const loadData = () => {
    biensService.getAll({ limit: 100 }).then((data) => {
      setBiens(data.biens || []);
    }).catch(() => {});
    setInterventions(interventionsService.getAll());
  };

  useEffect(() => {
    loadData();
  }, []);

  const getBienLabel = (bien) => {
    const name = bien.marque || bien.fabricant || bien.modele || `Bien #${bien.id_bien || bien.id}`;
    const ref = bien.numero_serie || bien.immatriculation || bien.localisation || '';
    return { name, ref };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validatePanneForm({
      id_bien: form.id_bien,
      urgence: form.urgence,
      description: form.description,
    });
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    setErrors({});
    const idBien = Number(form.id_bien);
    const bien = biens.find((b) => (b.id_bien || b.id) === idBien);
    const { name } = bien ? getBienLabel(bien) : { name: `Bien #${idBien}` };

    try {
      await biensService.updateEtat(idBien, 'PANNE');
      interventionsService.create({
        id_bien: idBien,
        equipement: name,
        gravite: form.urgence,
        description: form.description.trim(),
        statut: 'declaree',
      });
      notify.panneDeclaree();
      setForm({ id_bien: '', urgence: 'MOYENNE', description: '' });
      loadData();
    } catch (err) {
      const msg = err.response?.data?.detail || 'Impossible de déclarer la panne.';
      notify.error(typeof msg === 'string' ? msg : 'Erreur lors de la déclaration.');
    } finally {
      setSubmitting(false);
    }
  };

  const displayList = interventions.length
    ? interventions.map((item) => ({
        id: item.id,
        equipement: item.equipement || 'Équipement',
        ref: item.description?.slice(0, 40) || '—',
        date: new Date(item.created_at).toLocaleDateString('fr-FR'),
        heure: new Date(item.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        gravite: item.gravite || item.priorite || 'MOYENNE',
        statut: item.statut === 'resolue' ? 'Résolue' : item.statut === 'en_cours' ? 'En cours' : 'Déclarée',
        statutKey: item.statut || 'declaree',
      }))
    : [];

  const actives = displayList.filter((i) => i.statutKey !== 'resolue').length;

  return (
    <div className="page">
      <div className="page__header">
        <div>
          <h1 className="page__title">Gestion des pannes</h1>
          <p className="page__subtitle">
            Suivi en temps réel des interruptions et interventions correctives.
          </p>
        </div>
        <div className="page__actions">
          <button type="button" className="btn btn--secondary">
            <Filter size={16} aria-hidden />
            Filtrer
          </button>
          <Link to="/pannes/declaration" className="btn btn--primary">
            <Plus size={16} aria-hidden />
            Nouvelle intervention
          </Link>
        </div>
      </div>

      <div className="grid-main-sidebar grid-main-sidebar--2-1">
        <div className="card">
          <div className="card__header">
            <h3>Interventions récentes</h3>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              {actives} panne{actives > 1 ? 's' : ''} active{actives > 1 ? 's' : ''}
            </span>
          </div>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Équipement</th>
                  <th>Date</th>
                  <th>Gravité</th>
                  <th>Statut</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {displayList.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="empty-state">
                      Aucune intervention enregistrée. Déclarez une panne ou créez une intervention.
                    </td>
                  </tr>
                ) : (
                  displayList.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <p style={{ fontWeight: 500 }}>{item.equipement}</p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{item.ref}</p>
                      </td>
                      <td>
                        <p>{item.date}</p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{item.heure}</p>
                      </td>
                      <td>
                        <SeverityBadge level={item.gravite} />
                      </td>
                      <td>
                        <StatusBadge status={item.statutKey} label={item.statut} />
                      </td>
                      <td>
                        <button type="button" className="link-action">
                          {item.statutKey === 'resolue' ? 'Rapport' : 'Détails'}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="card__footer">
            <Link to="/maintenances" className="link-action">
              Consulter l&apos;historique des maintenances
            </Link>
          </div>
        </div>

        <div className="card">
          <div className="card__body">
            <h3 style={{ fontWeight: 600 }}>Déclarer une panne</h3>
            <p className="page__subtitle" style={{ marginTop: '0.25rem' }}>
              Signalez une interruption pour déclencher une intervention.
            </p>
            <form className="form" style={{ marginTop: '1.25rem' }} onSubmit={handleSubmit} noValidate>
              <div className="form__group">
                <label className="form__label form__label--required">Équipement</label>
                <select
                  className={`form__select ${errors.id_bien ? 'form__input--error' : ''}`}
                  value={form.id_bien}
                  onChange={(e) => setForm({ ...form, id_bien: e.target.value })}
                >
                  <option value="">Sélectionner un actif...</option>
                  {biens.map((b) => {
                    const { name, ref } = getBienLabel(b);
                    return (
                      <option key={b.id_bien || b.id} value={b.id_bien || b.id}>
                        {name}{ref ? ` — ${ref}` : ''}
                      </option>
                    );
                  })}
                </select>
                {errors.id_bien && <p className="form__error">{errors.id_bien}</p>}
              </div>

              <div className="form__group">
                <label className="form__label form__label--required">Urgence</label>
                <div className="form__segmented">
                  {[
                    { v: 'BASSE', l: 'Basse' },
                    { v: 'MOYENNE', l: 'Moyenne' },
                    { v: 'HAUTE', l: 'Haute' },
                  ].map(({ v, l }) => (
                    <button
                      key={v}
                      type="button"
                      className={`form__segmented-btn ${form.urgence === v ? 'form__segmented-btn--active' : ''}`}
                      onClick={() => setForm({ ...form, urgence: v })}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              <div className="form__group">
                <label className="form__label form__label--required">Description</label>
                <textarea
                  className={`form__textarea ${errors.description ? 'form__input--error' : ''}`}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Décrivez le problème observé..."
                  rows={4}
                />
                {errors.description && <p className="form__error">{errors.description}</p>}
              </div>

              <button type="submit" className="btn btn--primary btn--block" disabled={submitting}>
                {submitting ? 'Envoi en cours...' : 'Soumettre le rapport'}
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="kpi-row">
        <div className="kpi-inline">
          <div className="kpi-inline__icon kpi-inline__icon--red">
            <AlertCircle size={24} aria-hidden />
          </div>
          <div>
            <p className="kpi-inline__label">MTTR moyen</p>
            <p className="kpi-inline__value">2,4 h</p>
          </div>
        </div>
        <div className="kpi-inline">
          <div className="kpi-inline__icon kpi-inline__icon--blue">
            <Clock size={24} aria-hidden />
          </div>
          <div>
            <p className="kpi-inline__label">Pannes ce mois</p>
            <p className="kpi-inline__value">{displayList.length || '—'}</p>
          </div>
        </div>
        <div className="kpi-inline">
          <div className="kpi-inline__icon kpi-inline__icon--blue">
            <CheckCircle size={24} aria-hidden />
          </div>
          <div>
            <p className="kpi-inline__label">Taux de résolution</p>
            <p className="kpi-inline__value">94 %</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GestionPannes;
