import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import biensService from '../../services/biens';
import interventionsService from '../../services/interventions';
import maintenancesService from '../../services/maintenances';
import { useNotifications } from '../../context/NotificationContext';
import { validateInterventionForm } from '../../utils/validation';
import '../../styles/technicien/interventions.css';

const PRIORITES = [
  { value: 'BASSE', label: 'Basse' },
  { value: 'MOYENNE', label: 'Moyenne' },
  { value: 'HAUTE', label: 'Haute' },
  { value: 'CRITIQUE', label: 'Critique' },
];

const TYPES = [
  { value: 'corrective', label: 'Corrective (panne)' },
  { value: 'preventive', label: 'Préventive (maintenance)' },
];

const initialForm = {
  id_bien: '',
  type_intervention: 'corrective',
  date_prevue: '',
  priorite: 'MOYENNE',
  description: '',
  cout_estime: '',
};

const DeclarationIntervention = () => {
  const navigate = useNavigate();
  const { notify } = useNotifications();
  const [biens, setBiens] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingBiens, setLoadingBiens] = useState(true);

  useEffect(() => {
    biensService
      .getAll({ limit: 200 })
      .then((data) => setBiens(data.biens || data.items || []))
      .catch(() => notify.error('Impossible de charger la liste des équipements.'))
      .finally(() => setLoadingBiens(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getBienLabel = (bien) => {
    const name = bien.marque || bien.fabricant || bien.modele || `Bien #${bien.id_bien || bien.id}`;
    const ref = bien.numero_serie || bien.immatriculation || bien.localisation || '';
    return { name, ref };
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
    setSubmitError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateInterventionForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setSubmitError('');

    const idBien = Number(form.id_bien);
    const bien = biens.find((b) => (b.id_bien || b.id) === idBien);
    const { name } = bien ? getBienLabel(bien) : { name: `Bien #${idBien}` };
    const nouvelEtat = form.type_intervention === 'preventive' ? 'MAINTENANCE' : 'PANNE';

    try {
      await biensService.updateEtat(idBien, nouvelEtat);

      const payload = {
        id_bien: idBien,
        equipement: name,
        type: form.type_intervention,
        date_prevue: form.date_prevue,
        priorite: form.priorite,
        description: form.description.trim(),
        cout_estime: form.cout_estime ? Number(form.cout_estime) : null,
        statut: 'declaree',
      };

      interventionsService.create(payload);

      if (form.type_intervention === 'preventive') {
        maintenancesService.create({
          id_bien: idBien,
          title: name,
          subtitle: form.description.trim().slice(0, 80),
          type: 'preventive',
          date_prevue: form.date_prevue,
          priorite: form.priorite,
          cout_estime: payload.cout_estime,
        });
        notify.maintenancePlanifiee();
      } else {
        notify.panneDeclaree();
      }

      notify.interventionEnregistree();
      navigate('/pannes');
    } catch (err) {
      const msg =
        err.response?.data?.detail ||
        (typeof err.response?.data === 'string' ? err.response.data : null) ||
        'Erreur lors de l\'enregistrement. Vérifiez vos droits et les données saisies.';
      setSubmitError(Array.isArray(msg) ? msg.map((m) => m.msg || m).join(', ') : String(msg));
      notify.error(typeof msg === 'string' ? msg : 'Échec de l\'enregistrement.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="page__header">
        <div>
          <h1 className="page__title">Ajouter une nouvelle intervention</h1>
          <p className="page__subtitle">
            Déclarez une panne ou planifiez une maintenance préventive sur un équipement.
          </p>
        </div>
      </div>

      <div className="grid-main-sidebar grid-main-sidebar--2-1">
        <div className="card">
          <div className="card__body">
            <form className="form" onSubmit={handleSubmit} noValidate>
              {submitError && (
                <div className="form-alert form-alert--error" role="alert">
                  <AlertCircle size={18} aria-hidden />
                  <span>{submitError}</span>
                </div>
              )}

              <div className="form__group">
                <label className="form__label form__label--required" htmlFor="id_bien">
                  Équipement
                </label>
                <select
                  id="id_bien"
                  className={`form__select ${errors.id_bien ? 'form__input--error' : ''}`}
                  value={form.id_bien}
                  onChange={(e) => handleChange('id_bien', e.target.value)}
                  disabled={loadingBiens || loading}
                >
                  <option value="">
                    {loadingBiens ? 'Chargement...' : 'Sélectionner un équipement...'}
                  </option>
                  {biens.map((b) => {
                    const { name, ref } = getBienLabel(b);
                    const id = b.id_bien || b.id;
                    return (
                      <option key={id} value={id}>
                        {name}
                        {ref ? ` — ${ref}` : ''}
                      </option>
                    );
                  })}
                </select>
                {errors.id_bien && <p className="form__error">{errors.id_bien}</p>}
              </div>

              <div className="form__group">
                <label className="form__label form__label--required">Type d&apos;intervention</label>
                <div className="form__segmented">
                  {TYPES.map((t) => (
                    <button
                      key={t.value}
                      type="button"
                      className={`form__segmented-btn ${form.type_intervention === t.value ? 'form__segmented-btn--active' : ''}`}
                      onClick={() => handleChange('type_intervention', t.value)}
                      disabled={loading}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
                {errors.type_intervention && <p className="form__error">{errors.type_intervention}</p>}
              </div>

              <div className="form__row">
                <div className="form__group">
                  <label className="form__label form__label--required" htmlFor="date_prevue">
                    Date prévue
                  </label>
                  <input
                    id="date_prevue"
                    type="date"
                    className={`form__input ${errors.date_prevue ? 'form__input--error' : ''}`}
                    value={form.date_prevue}
                    onChange={(e) => handleChange('date_prevue', e.target.value)}
                    disabled={loading}
                  />
                  {errors.date_prevue && <p className="form__error">{errors.date_prevue}</p>}
                </div>

                <div className="form__group">
                  <label className="form__label form__label--required">Priorité</label>
                  <select
                    className={`form__select ${errors.priorite ? 'form__input--error' : ''}`}
                    value={form.priorite}
                    onChange={(e) => handleChange('priorite', e.target.value)}
                    disabled={loading}
                  >
                    {PRIORITES.map((p) => (
                      <option key={p.value} value={p.value}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                  {errors.priorite && <p className="form__error">{errors.priorite}</p>}
                </div>
              </div>

              <div className="form__group">
                <label className="form__label" htmlFor="cout_estime">
                  Coût estimé (€)
                </label>
                <input
                  id="cout_estime"
                  type="number"
                  min="0"
                  step="0.01"
                  className={`form__input ${errors.cout_estime ? 'form__input--error' : ''}`}
                  value={form.cout_estime}
                  onChange={(e) => handleChange('cout_estime', e.target.value)}
                  placeholder="Ex. 1250.00"
                  disabled={loading}
                />
                {errors.cout_estime && <p className="form__error">{errors.cout_estime}</p>}
              </div>

              <div className="form__group">
                <label className="form__label form__label--required" htmlFor="description">
                  Description
                </label>
                <textarea
                  id="description"
                  className={`form__textarea ${errors.description ? 'form__input--error' : ''}`}
                  rows={5}
                  value={form.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Décrivez le problème ou les opérations à réaliser (min. 10 caractères)..."
                  disabled={loading}
                />
                {errors.description && <p className="form__error">{errors.description}</p>}
              </div>

              <div className="intervention-form-actions">
                <button type="submit" className="btn btn--primary" disabled={loading || loadingBiens}>
                  {loading ? 'Enregistrement...' : 'Enregistrer l\'intervention'}
                </button>
                <button
                  type="button"
                  className="btn btn--secondary"
                  onClick={() => navigate('/pannes')}
                  disabled={loading}
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="card intervention-help">
          <div className="card__body">
            <h3>Aide</h3>
            <ul>
              <li>Intervention <strong>corrective</strong> : passe l&apos;équipement à l&apos;état PANNE.</li>
              <li>Intervention <strong>préventive</strong> : passe l&apos;équipement à l&apos;état MAINTENANCE.</li>
              <li>Tous les champs marqués d&apos;un astérisque sont obligatoires.</li>
              <li>La description doit contenir au moins 10 caractères.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeclarationIntervention;
