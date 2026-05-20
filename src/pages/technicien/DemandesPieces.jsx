import React, { useEffect, useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import piecesService from '../../services/pieces';
import { useNotifications } from '../../context/NotificationContext';
import '../../styles/technicien/stock.css';

const DemandesPieces = () => {
  const { notify } = useNotifications();
  const [pieces, setPieces] = useState([]);
  const [demandes, setDemandes] = useState([]);
  const [form, setForm] = useState({ id_piece: '', quantite: '1', motif: '' });

  const refresh = () => {
    setPieces(piecesService.getAll());
    setDemandes(piecesService.getDemandes());
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.id_piece || !form.motif.trim()) {
      notify.error('Veuillez sélectionner une pièce et indiquer un motif.');
      return;
    }
    const piece = pieces.find((p) => p.id === Number(form.id_piece));
    piecesService.creerDemande({
      id_piece: Number(form.id_piece),
      reference: piece?.reference,
      designation: piece?.designation,
      quantite: Number(form.quantite) || 1,
      motif: form.motif.trim(),
    });
    notify.success('Demande de pièce enregistrée.');
    setForm({ id_piece: '', quantite: '1', motif: '' });
    refresh();
  };

  return (
    <section className="page">
      <header className="page__header">
        <div>
          <h1 className="page__title">Demandes de pièces de rechange</h1>
          <p className="page__subtitle">Formulaire de demande auprès du service achats / caisse.</p>
        </div>
      </header>

      <div className="grid-main-sidebar grid-main-sidebar--2-1">
        <article className="card">
          <header className="card__header">
            <h3>Historique des demandes</h3>
          </header>
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Pièce</th>
                  <th>Qté</th>
                  <th>Motif</th>
                  <th>Statut</th>
                </tr>
              </thead>
              <tbody>
                {demandes.length === 0 ? (
                  <tr><td colSpan={5} className="empty-state">Aucune demande enregistrée.</td></tr>
                ) : (
                  demandes.map((d) => (
                    <tr key={d.id}>
                      <td>{new Date(d.date).toLocaleDateString('fr-FR')}</td>
                      <td>{d.designation || d.reference}</td>
                      <td>{d.quantite}</td>
                      <td>{d.motif}</td>
                      <td><span className="tag">{d.statut === 'en_attente' ? 'En attente' : d.statut}</span></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </article>

        <article className="card card__body">
          <h3 style={{ fontWeight: 600, display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <ShoppingCart size={18} aria-hidden />
            Nouvelle demande
          </h3>
          <form className="form" style={{ marginTop: '1rem' }} onSubmit={handleSubmit}>
            <div className="form__group">
              <label className="form__label form__label--required">Pièce</label>
              <select className="form__select" value={form.id_piece} onChange={(e) => setForm({ ...form, id_piece: e.target.value })} required>
                <option value="">Sélectionner...</option>
                {pieces.map((p) => (
                  <option key={p.id} value={p.id}>{p.reference} — {p.designation}</option>
                ))}
              </select>
            </div>
            <div className="form__group">
              <label className="form__label">Quantité</label>
              <input type="number" min="1" className="form__input" value={form.quantite} onChange={(e) => setForm({ ...form, quantite: e.target.value })} />
            </div>
            <div className="form__group">
              <label className="form__label form__label--required">Motif</label>
              <textarea className="form__textarea" rows={3} value={form.motif} onChange={(e) => setForm({ ...form, motif: e.target.value })} placeholder="Raison de la demande..." required />
            </div>
            <button type="submit" className="btn btn--primary btn--block">Envoyer la demande</button>
          </form>
        </article>
      </div>
    </section>
  );
};

export default DemandesPieces;
