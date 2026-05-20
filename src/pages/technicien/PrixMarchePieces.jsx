import React, { useEffect, useState } from 'react';
import { DollarSign, Save } from 'lucide-react';
import piecesService from '../../services/pieces';
import { useNotifications } from '../../context/NotificationContext';
import '../../styles/technicien/stock.css';

const PrixMarchePieces = () => {
  const { notify } = useNotifications();
  const [pieces, setPieces] = useState([]);
  const [edits, setEdits] = useState({});

  useEffect(() => {
    const data = piecesService.getAll();
    setPieces(data);
    const initial = {};
    data.forEach((p) => { initial[p.id] = String(p.prix_marche ?? ''); });
    setEdits(initial);
  }, []);

  const handleSave = (id) => {
    const val = Number(edits[id]);
    if (Number.isNaN(val) || val < 0) {
      notify.error('Prix invalide.');
      return;
    }
    piecesService.updatePrixMarche(id, val);
    notify.success('Prix marché enregistré.');
    setPieces(piecesService.getAll());
  };

  return (
    <section className="page">
      <header className="page__header">
        <div>
          <h1 className="page__title">Prix marché des pièces</h1>
          <p className="page__subtitle">Enregistrement et mise à jour des prix de référence fournisseurs.</p>
        </div>
      </header>

      <article className="card">
        <header className="card__header">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <DollarSign size={18} aria-hidden />
            Grille tarifaire
          </h3>
        </header>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Référence</th>
                <th>Désignation</th>
                <th>Prix actuel (€)</th>
                <th>Nouveau prix (€)</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {pieces.map((p) => (
                <tr key={p.id}>
                  <td><code>{p.reference}</code></td>
                  <td>{p.designation}</td>
                  <td>{Number(p.prix_marche || 0).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €</td>
                  <td>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      className="form__input"
                      style={{ maxWidth: '120px' }}
                      value={edits[p.id] ?? ''}
                      onChange={(e) => setEdits({ ...edits, [p.id]: e.target.value })}
                    />
                  </td>
                  <td>
                    <button type="button" className="btn btn--primary btn--sm" onClick={() => handleSave(p.id)}>
                      <Save size={14} aria-hidden />
                      Enregistrer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </article>
    </section>
  );
};

export default PrixMarchePieces;
