// frontend/src/components/biens/ListeBiens.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { biensService } from '../../services/biens';
import { useAuth } from '../../hooks/useAuth';
import LoadingSpinner from '../common/LoadingSpinner';
import ConfirmDialog from '../common/ConfirmDialog';
import QRCodeGenerator from '../common/QRCodeGenerator';

// Ajouter ces imports pour Material-UI
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import QrCode from '@mui/icons-material/QrCode';


const ListeBiens = () => {
  const navigate = useNavigate();
  const { user, hasPermission } = useAuth();
  
  // État des données
  const [biens, setBiens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

// Ajoutez cet état dans le composant
const [qrDialogOpen, setQrDialogOpen] = useState(false);
const [selectedBien, setSelectedBien] = useState(null);

// Ajoutez cette fonction
const handleViewQR = (bien) => {
  setSelectedBien(bien);
  setQrDialogOpen(true);
};

  
  // État de pagination et filtres
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({
    search: '',
    type_bien: '',
    etat: ''
  });
  
  // État modals
  const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null, nom: '' });

  // Couleurs des états
  const ETAT_COLORS = {
    neuf: '#4caf50',
    bon: '#2196f3',
    usage: '#ff9800',
    panne: '#f44336',
    reforme: '#9e9e9e',
    maintenance: '#ff5722',
    en_service: '#4caf50',
    en_maintenance: '#ff5722',
    hors_service: '#f44336'
  };

  const ETAT_LABELS = {
    neuf: 'Neuf',
    bon: 'Bon état',
    usage: 'En usage',
    panne: 'En panne',
    reforme: 'Réformé',
    maintenance: 'En maintenance',
    en_service: 'En service',
    en_maintenance: 'En maintenance',
    hors_service: 'Hors service'
  };

  const TYPE_LABELS = {
    vehicule: 'Véhicule',
    machine: 'Machine',
    ordinateur: 'Ordinateur',
    autre: 'Autre'
  };

// frontend/src/components/biens/ListeBiens.jsx
// Modifie la partie fetchBiens (vers ligne 68-97)

const fetchBiens = useCallback(async () => {
  try {
    setLoading(true);
    setError(null);
    
    // ✅ CORRECTION: Utiliser les paramètres comme attendu par biensService.getAll
    const params = {
      page: page + 1,  // ← page commence à 0 dans l'état, mais l'API attend page à partir de 1
      limit: rowsPerPage,
      type_bien: filters.type_bien || undefined,
      etat: filters.etat || undefined,
      search: filters.search || undefined
    };
    
    console.log('Paramètres API (page):', params);
    
    const response = await biensService.getAll(params);
    console.log('Réponse API complète:', response);
    console.log('response.biens:', response?.biens);
    console.log('response.total:', response?.total);
    
    // ✅ CORRECTION: Extraire correctement les données
    const biensData = response?.biens || [];
    const totalCount = response?.total || 0;
    
    console.log('Biens chargés:', biensData.length);
    console.log('Total dans DB:', totalCount);
    
    setBiens(biensData);
    setTotal(totalCount);
  } catch (err) {
    console.error('Erreur fetchBiens:', err);
    console.error('Détails erreur:', err.response?.data);
    setError('Erreur lors du chargement des biens: ' + (err.response?.data?.detail || err.message));
    setBiens([]);
    setTotal(0);
  } finally {
    setLoading(false);
  }
}, [page, rowsPerPage, filters.type_bien, filters.etat, filters.search]); // ← Ajouter search
  useEffect(() => {
    fetchBiens();
  }, [fetchBiens]);

  // Gestionnaires d'événements
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };
  
  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    setPage(0);
  };

  const handleView = (id) => navigate(`/biens/${id}`);
  const handleEdit = (id) => navigate(`/biens/${id}/edit`);
  
  const handleDelete = async (id) => {
    try {
      await biensService.delete(id);
      fetchBiens();
    } catch (err) {
      setError('Erreur lors de la suppression');
    }
  };

  const handleGenerateQR = async (id) => {
    try {
      const blob = await biensService.generateQRCode(id);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `qr-code-bien-${id}.png`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError('Erreur lors de la génération du QR code');
    }
  };

  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('fr-FR');
  };

  const formatPrice = (price) => {
    if (!price) return '-';
    return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
  };

  const totalPages = Math.ceil(total / rowsPerPage);

  return (
    <div className="liste-biens-container">
      <style>{`
        .liste-biens-container {
          padding: 24px;
          max-width: 1400px;
          margin: 0 auto;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          flex-wrap: wrap;
          gap: 16px;
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
          color: #1a1a2e;
        }
        .btn-add {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.3s ease;
        }
        .btn-add:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
        }
        .filters-card {
          background: white;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 24px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }
        .filters-row {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
          align-items: flex-end;
        }
        .filter-group {
          flex: 1;
          min-width: 180px;
        }
        .filter-group label {
          display: block;
          font-size: 12px;
          font-weight: 500;
          color: #666;
          margin-bottom: 6px;
        }
        .filter-group input,
        .filter-group select {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid #ddd;
          border-radius: 8px;
          font-size: 14px;
          transition: all 0.2s ease;
        }
        .filter-group input:focus,
        .filter-group select:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }
        .btn-refresh {
          background: #f0f0f0;
          border: none;
          padding: 10px 16px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 18px;
          transition: all 0.2s ease;
        }
        .btn-refresh:hover {
          background: #e0e0e0;
          transform: rotate(180deg);
        }
        .error-alert {
          background: #fee;
          color: #c00;
          padding: 12px 16px;
          border-radius: 8px;
          margin-bottom: 20px;
          border-left: 4px solid #c00;
        }
        .table-container {
          background: white;
          border-radius: 12px;
          overflow-x: auto;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }
        .biens-table {
          width: 100%;
          border-collapse: collapse;
        }
        .biens-table th {
          text-align: left;
          padding: 16px;
          background: #f8f9fa;
          font-weight: 600;
          color: #333;
          border-bottom: 2px solid #e0e0e0;
        }
        .biens-table td {
          padding: 16px;
          border-bottom: 1px solid #eee;
          vertical-align: middle;
        }
        .biens-table tr:hover {
          background: #f8f9fa;
        }
        .type-chip {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
          background: #e3f2fd;
          color: #1976d2;
        }
        .type-chip.vehicule { background: #e8f5e9; color: #2e7d32; }
        .type-chip.machine { background: #fff3e0; color: #ed6c02; }
        .type-chip.ordinateur { background: #e3f2fd; color: #0288d1; }
        .status-chip {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
        }
        .bien-nom {
          font-weight: 600;
          color: #1a1a2e;
        }
        .bien-detail {
          font-size: 12px;
          color: #999;
          margin-top: 4px;
        }
        .actions {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .action-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 6px;
          border-radius: 6px;
          transition: all 0.2s ease;
          font-size: 18px;
        }
        .action-btn.view { color: #2196f3; }
        .action-btn.view:hover { background: #e3f2fd; }
        .action-btn.edit { color: #ff9800; }
        .action-btn.edit:hover { background: #fff3e0; }
        .action-btn.qr { color: #9c27b0; }
        .action-btn.qr:hover { background: #f3e5f5; }
        .action-btn.delete { color: #f44336; }
        .action-btn.delete:hover { background: #ffebee; }
        .pagination {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 20px;
          padding: 16px;
          background: white;
          border-radius: 12px;
        }
        .pagination-controls {
          display: flex;
          gap: 8px;
          align-items: center;
        }
        .page-btn {
          padding: 8px 12px;
          border: 1px solid #ddd;
          background: white;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .page-btn:hover:not(:disabled) {
          background: #667eea;
          color: white;
          border-color: #667eea;
        }
        .page-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .page-info {
          margin: 0 12px;
          color: #666;
        }
        .rows-select {
          padding: 8px;
          border: 1px solid #ddd;
          border-radius: 6px;
        }
        .empty-row td {
          text-align: center;
          padding: 48px !important;
          color: #999;
        }
        @media (max-width: 768px) {
          .liste-biens-container { padding: 16px; }
          .header { flex-direction: column; align-items: flex-start; }
          .filters-row { flex-direction: column; }
          .filter-group { width: 100%; }
          .actions { flex-wrap: wrap; }
          .pagination { flex-direction: column; gap: 16px; }
        }
      `}</style>

      {/* En-tête */}
      <div className="header">
        <h1>📦 Gestion des Biens</h1>
        {hasPermission && hasPermission('create_bien') !== false && (
          <button className="btn-add" onClick={() => navigate('/biens/nouveau')}>
            + Nouveau bien
          </button>
        )}
      </div>

      {/* Filtres */}
      <div className="filters-card">
        <div className="filters-row">
          <div className="filter-group">
            <label>🔍 Recherche</label>
            <input
              type="text"
              placeholder="Nom, marque, série..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
            />
          </div>
          <div className="filter-group">
            <label>📋 Type</label>
            <select
              value={filters.type_bien}
              onChange={(e) => handleFilterChange('type_bien', e.target.value)}
            >
              <option value="">Tous</option>
              <option value="vehicule">Véhicule</option>
              <option value="machine">Machine</option>
              <option value="ordinateur">Ordinateur</option>
              <option value="autre">Autre</option>
            </select>
          </div>
          <div className="filter-group">
            <label>⚡ État</label>
            <select
              value={filters.etat}
              onChange={(e) => handleFilterChange('etat', e.target.value)}
            >
              <option value="">Tous</option>
              <option value="NEUF">Neuf</option>
              <option value="BON">Bon état</option>
              <option value="USAGE">En usage</option>
              <option value="PANNE">En panne</option>
              <option value="REFORME">Réformé</option>
              <option value="MAINTENANCE">En maintenance</option>
              
            </select>
          </div>
          <div className="filter-group">
            <label>&nbsp;</label>
            <button className="btn-refresh" onClick={fetchBiens} title="Actualiser">
              🔄
            </button>
          </div>
        </div>
      </div>

      {/* Erreur */}
      {error && <div className="error-alert">{error}</div>}

      {/* Tableau */}
      <div className="table-container">
        <table className="biens-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Marque / Modèle</th>
              <th>Acquisition</th>
              <th>Prix</th>
              <th>État</th>
              <th>Localisation</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr className="empty-row">
                <td colSpan="7">Chargement...</td>
              </tr>
            ) : biens.length === 0 ? (
              <tr className="empty-row">
                <td colSpan="7">
                  Aucun bien trouvé
                  {(filters.search || filters.type_bien || filters.etat) && ' avec ces filtres'}
                </td>
              </tr>
            ) : (
              biens.map((bien) => (
                <tr key={bien.id_bien || bien.id}>
                  <td>
                    <span className={`type-chip ${bien.type_bien}`}>
                      {TYPE_LABELS[bien.type_bien] || bien.type_bien || 'Autre'}
                    </span>
                  </td>
                  <td>
                    <div className="bien-nom">
                      {bien.marque || bien.fabricant || 'N/A'} {bien.modele || ''}
                    </div>
                    {(bien.immatriculation || bien.numero_serie) && (
                      <div className="bien-detail">
                        {bien.immatriculation || `S/N: ${bien.numero_serie}`}
                      </div>
                    )}
                  </td>
                  <td>{formatDate(bien.date_acquisition)}</td>
                  <td>{formatPrice(bien.prix_acquisition || bien.prix_achat)}</td>
                  <td>
                    <span 
                      className="status-chip"
                      style={{ 
                        background: (ETAT_COLORS[bien.etat] || '#999') + '20',
                        color: ETAT_COLORS[bien.etat] || '#999'
                      }}
                    >
                      {ETAT_LABELS[bien.etat] || bien.etat || 'Inconnu'}
                    </span>
                  </td>
                  <td>{bien.localisation || '-'}</td>
                  <td className="actions">
                    <button 
                      className="action-btn view"
                      onClick={() => handleView(bien.id_bien || bien.id)}
                      title="Voir"
                    >
                      👁️
                    </button>
                    <button 
                      className="action-btn edit"
                      onClick={() => handleEdit(bien.id_bien || bien.id)}
                      title="Modifier"
                    >
                      ✏️
                    </button>
                    <button 
                      className="action-btn qr"
                      onClick={() => handleGenerateQR(bien.id_bien || bien.id)}
                      title="QR Code"
                    >
                      📱
                    </button>
                    <button 
                      className="action-btn delete"
                      onClick={() => setConfirmDelete({ 
                        open: true, 
                        id: bien.id_bien || bien.id,
                        nom: bien.marque || bien.fabricant || bien.nom || 'ce bien'
                      })}
                      title="Supprimer"
                    >
                      🗑️
                    </button>
                    // Dans le tableau, ajoutez ce bouton dans la colonne Actions
                      <Tooltip title="QR Code">
                        <IconButton size="small" onClick={() => handleViewQR(bien)}>
                          <QrCode fontSize="small" />
                        </IconButton>
                      </Tooltip>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 0 && (
        <div className="pagination">
          <div>
            <select 
              className="rows-select"
              value={rowsPerPage} 
              onChange={handleRowsPerPageChange}
            >
              <option value={5}>5 par page</option>
              <option value={10}>10 par page</option>
              <option value={25}>25 par page</option>
              <option value={50}>50 par page</option>
            </select>
          </div>
          <div className="pagination-controls">
            <button 
              className="page-btn"
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 0}
            >
              ← Précédent
            </button>
            <span className="page-info">
              Page {page + 1} sur {totalPages}
            </span>
            <button 
              className="page-btn"
              onClick={() => handlePageChange(page + 1)}
              disabled={page + 1 >= totalPages}
            >
              Suivant →
            </button>
          </div>
        </div>
      )}
              // Ajoutez ce composant à la fin du rendu
        {selectedBien && (
          <QRCodeGenerator
            bienId={selectedBien.id_bien}
            qrCode={selectedBien.qr_code}
            open={qrDialogOpen}
            onClose={() => {
              setQrDialogOpen(false);
              setSelectedBien(null);
            }}
          />
        )}

      {/* Dialog de confirmation */}
      <ConfirmDialog
        open={confirmDelete.open}
        title="Supprimer ce bien ?"
        content={`Êtes-vous sûr de vouloir supprimer "${confirmDelete.nom}" ? Cette action est irréversible.`}
        onConfirm={() => {
          if (confirmDelete.id) handleDelete(confirmDelete.id);
          setConfirmDelete({ open: false, id: null, nom: '' });
        }}
        onCancel={() => setConfirmDelete({ open: false, id: null, nom: '' })}
      />
    </div>
  );
};

export default ListeBiens;