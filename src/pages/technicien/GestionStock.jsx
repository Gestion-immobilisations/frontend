import React, { useEffect, useState } from 'react';
import { Package, Plus, Minus } from 'lucide-react';
import piecesService from '../../services/pieces';
import { useNotifications } from '../../context/NotificationContext';
import { validatePieceForm } from '../../utils/validation';
import '../../styles/technicien/stock.css';

const GestionStock = () => {
  const { notify } = useNotifications();
  const [pieces, setPieces] = useState([]);
  const [form, setForm] = useState({ reference: '', designation: '', quantite: '', seuil_alerte: '5' });
  const [errors, setErrors] = useState({});

  const refresh = () => setPieces(piecesService.getAll());

  useEffect(() => {
    refresh();
  }, []);

  const handleAdjust = (id, delta) => {
    piecesService.ajusterStock(id, delta);
    const piece = piecesService.getAll().find((p) => p.id === id);
    if (piece && piece.quantite <= piece.seuil_alerte) {
      notify.stockFaible(piece.designation);
    }
    refresh();
  };

  const handleAdd = (e) => {
    e.preventDefault();
    const validationErrors = validatePieceForm(form);
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }
    piecesService.create({
      reference: form.reference.trim(),
      designation: form.designation.trim(),
      quantite: Number(form.quantite),
      seuil_alerte: Number(form.seuil_alerte),
      prix_marche: 0,
      unite: '€',
    });
    notify.success('Pièce ajoutée au stock.');
    setForm({ reference: '', designation: '', quantite: '', seuil_alerte: '5' });
    setErrors({});
    refresh();
  };

  const stockPercent = (p) => Math.min(100, (p.quantite / (p.seuil_alerte * 2 || 1)) * 100);
  const stockClass = (p) =>
    p.quantite <= p.seuil_alerte / 2 ? 'stock-meter__fill--critical' : p.quantite <= p.seuil_alerte ? 'stock-meter__fill--low' : 'stock-meter__fill--ok';

  return (
    <div className="page">
      <div className="page__header">
        <div>
          <h1 className="page__title">Gestion du stock des pièces</h1>
          <p className="page__subtitle">Suivi des quantités et alertes de stock faible.</p>
        </div>
      </div>

      <div className="grid-main-sidebar grid-main-sidebar--2-1">
        <div className="card">
          <div className="card__header">
            <h3>Inventaire en stock</h3>
          </div>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Référence</th>
                  <th>Désignation</th>
                  <th>Quantité</th>
                  <th>Niveau</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pieces.map((p) => (
                  <tr key={p.id}>
                    <td><code>{p.reference}</code></td>
                    <td>{p.designation}</td>
                    <td>
                      {p.quantite}
                      {p.quantite <= p.seuil_alerte && (
                        <span className="chip-low-stock" style={{ marginLeft: '0.5rem' }}>Stock faible</span>
                      )}
                    </td>
                    <td style={{ minWidth: '120px' }}>
                      <div className="stock-meter">
                        <div className={`stock-meter__fill ${stockClass(p)}`} style={{ width: `${stockPercent(p)}%` }} />
                      </div>
                    </td>
                    <td>
                      <button type="button" className="btn btn--secondary btn--sm" onClick={() => handleAdjust(p.id, -1)} aria-label="Retirer">
                        <Minus size={14} />
                      </button>
                      <button type="button" className="btn btn--secondary btn--sm" onClick={() => handleAdjust(p.id, 1)} aria-label="Ajouter" style={{ marginLeft: '0.25rem' }}>
                        <Plus size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card card__body">
          <h3 style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Package size={18} aria-hidden />
            Ajouter une pièce
          </h3>
          <form className="form" style={{ marginTop: '1rem' }} onSubmit={handleAdd} noValidate>
            <div className="form__group">
              <label className="form__label form__label--required">Référence</label>
              <input className={`form__input ${errors.reference ? 'form__input--error' : ''}`} value={form.reference} onChange={(e) => setForm({ ...form, reference: e.target.value })} />
              {errors.reference && <p className="form__error">{errors.reference}</p>}
            </div>
            <div className="form__group">
              <label className="form__label form__label--required">Désignation</label>
              <input className={`form__input ${errors.designation ? 'form__input--error' : ''}`} value={form.designation} onChange={(e) => setForm({ ...form, designation: e.target.value })} />
              {errors.designation && <p className="form__error">{errors.designation}</p>}
            </div>
            <div className="form__row">
              <div className="form__group">
                <label className="form__label form__label--required">Quantité</label>
                <input type="number" min="0" className={`form__input ${errors.quantite ? 'form__input--error' : ''}`} value={form.quantite} onChange={(e) => setForm({ ...form, quantite: e.target.value })} />
                {errors.quantite && <p className="form__error">{errors.quantite}</p>}
              </div>
              <div className="form__group">
                <label className="form__label form__label--required">Seuil d&apos;alerte</label>
                <input type="number" min="0" className={`form__input ${errors.seuil_alerte ? 'form__input--error' : ''}`} value={form.seuil_alerte} onChange={(e) => setForm({ ...form, seuil_alerte: e.target.value })} />
                {errors.seuil_alerte && <p className="form__error">{errors.seuil_alerte}</p>}
              </div>
            </div>
            <button type="submit" className="btn btn--primary btn--block">Ajouter au stock</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GestionStock;
