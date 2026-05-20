import React, { useEffect, useState } from 'react';
import { ClipboardList } from 'lucide-react';
import piecesService from '../../services/pieces';
import '../../styles/technicien/stock.css';

const InventairePieces = () => {
  const [pieces, setPieces] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    setPieces(piecesService.getAll());
  }, []);

  const filtered = pieces.filter(
    (p) =>
      p.reference.toLowerCase().includes(search.toLowerCase()) ||
      p.designation.toLowerCase().includes(search.toLowerCase())
  );

  const totalValeur = filtered.reduce((s, p) => s + p.quantite * (p.prix_marche || 0), 0);

  return (
    <section className="page">
      <header className="page__header">
        <div>
          <h1 className="page__title">Inventaire des pièces</h1>
          <p className="page__subtitle">Consultation complète du catalogue et valorisation du stock.</p>
        </div>
      </header>

      <article className="card">
        <header className="card__header">
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ClipboardList size={18} aria-hidden />
            Catalogue ({filtered.length} références)
          </h3>
          <input
            type="search"
            className="form__input"
            style={{ maxWidth: '280px' }}
            placeholder="Rechercher une pièce..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </header>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Référence</th>
                <th>Désignation</th>
                <th>Quantité</th>
                <th>Prix unitaire</th>
                <th>Valeur totale</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id}>
                  <td><code>{p.reference}</code></td>
                  <td>{p.designation}</td>
                  <td>{p.quantite}</td>
                  <td>{Number(p.prix_marche || 0).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</td>
                  <td>{(p.quantite * (p.prix_marche || 0)).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</td>
                  <td>
                    {p.quantite <= p.seuil_alerte ? (
                      <span className="chip-low-stock">Stock faible</span>
                    ) : (
                      <span className="tag">OK</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <footer className="card__footer">
          <strong>Valeur totale inventoriée : </strong>
          {totalValeur.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
        </footer>
      </article>
    </section>
  );
};

export default InventairePieces;
