import React, { useEffect, useState } from 'react';
import { Gauge } from 'lucide-react';
import biensService from '../../services/biens';
import { useNotifications } from '../../context/NotificationContext';
import '../../styles/technicien/stock.css';

const ETATS = [
  { value: 'NEUF', label: 'Neuf' },
  { value: 'BON', label: 'Bon état' },
  { value: 'USAGE', label: 'Usagé' },
  { value: 'PANNE', label: 'En panne' },
  { value: 'MAINTENANCE', label: 'En maintenance' },
  { value: 'REFORME', label: 'Réformé' },
];

const EvaluationEtat = () => {
  const { notify } = useNotifications();
  const [biens, setBiens] = useState([]);
  const [selected, setSelected] = useState('');
  const [nouvelEtat, setNouvelEtat] = useState('BON');
  const [commentaire, setCommentaire] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    biensService.getAll({ limit: 200 }).then((data) => {
      const list = data.biens || [];
      setBiens(list);
      if (list[0]) setSelected(String(list[0].id_bien || list[0].id));
    }).catch(() => notify.error('Impossible de charger les biens.'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const bien = biens.find((b) => String(b.id_bien || b.id) === selected);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selected) return;
    setLoading(true);
    try {
      await biensService.updateEtat(Number(selected), nouvelEtat);
      notify.success(`État mis à jour : ${ETATS.find((e) => e.value === nouvelEtat)?.label || nouvelEtat}`);
      const data = await biensService.getAll({ limit: 200 });
      setBiens(data.biens || []);
    } catch (err) {
      notify.error(err.response?.data?.detail || 'Erreur lors de la mise à jour de l\'état.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page">
      <header className="page__header">
        <div>
          <h1 className="page__title">Évaluation de l&apos;état du bien</h1>
          <p className="page__subtitle">Diagnostic et mise à jour de l&apos;état opérationnel des équipements.</p>
        </div>
      </header>

      <div className="grid-main-sidebar grid-main-sidebar--2-1">
        <article className="card card__body">
          <h3 style={{ fontWeight: 600, display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <Gauge size={18} aria-hidden />
            Formulaire d&apos;évaluation
          </h3>
          <form className="form" style={{ marginTop: '1rem' }} onSubmit={handleSubmit}>
            <div className="form__group">
              <label className="form__label form__label--required">Équipement</label>
              <select className="form__select" value={selected} onChange={(e) => setSelected(e.target.value)} required>
                {biens.map((b) => (
                  <option key={b.id_bien || b.id} value={b.id_bien || b.id}>
                    {(b.marque || b.fabricant || b.modele || `Bien #${b.id_bien}`)} — État actuel : {b.etat}
                  </option>
                ))}
              </select>
            </div>
            <div className="form__group">
              <label className="form__label form__label--required">Nouvel état</label>
              <select className="form__select" value={nouvelEtat} onChange={(e) => setNouvelEtat(e.target.value)}>
                {ETATS.map((e) => (
                  <option key={e.value} value={e.value}>{e.label}</option>
                ))}
              </select>
            </div>
            <div className="form__group">
              <label className="form__label">Commentaire technique</label>
              <textarea className="form__textarea" rows={4} value={commentaire} onChange={(e) => setCommentaire(e.target.value)} placeholder="Observations, mesures, recommandations..." />
            </div>
            <button type="submit" className="btn btn--primary" disabled={loading}>
              {loading ? 'Enregistrement...' : 'Enregistrer l\'évaluation'}
            </button>
          </form>
        </article>

        {bien && (
          <article className="card card__body">
            <h3 style={{ fontWeight: 600, marginBottom: '1rem' }}>Fiche équipement</h3>
            <p><strong>État actuel :</strong> {bien.etat}</p>
            <p style={{ marginTop: '0.5rem' }}><strong>Localisation :</strong> {bien.localisation || '—'}</p>
            <p style={{ marginTop: '0.5rem' }}><strong>Description :</strong> {bien.description || '—'}</p>
          </article>
        )}
      </div>
    </section>
  );
};

export default EvaluationEtat;
