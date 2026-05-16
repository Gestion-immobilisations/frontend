// frontend/src/components/biens/ListeBiens.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { biensService } from '../../services/biens';
import { useAuth } from '../../hooks/useAuth';
import LoadingSpinner from '../common/LoadingSpinner';
import ConfirmDialog from '../common/ConfirmDialog';
import QRCodeGenerator from '../common/QRCodeGenerator';

// Ajouter ces imports pour Material-UI
import { Plus, Eye, Pencil, QrCode as QrIcon, Trash2, RefreshCw } from 'lucide-react';
import PageHeader from '../ui/PageHeader';


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
    
    // âœ… CORRECTION: Utiliser les paramètres comme attendu par biensService.getAll
    const params = {
      page: page + 1,  // â† page commence à 0 dans l'état, mais l'API attend page à partir de 1
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
    
    // âœ… CORRECTION: Extraire correctement les données
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
}, [page, rowsPerPage, filters.type_bien, filters.etat, filters.search]); // â† Ajouter search
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
    <>
      <PageHeader
        title="Gestion des Immobilisations"
        subtitle="Consultez, filtrez et gerez l ensemble des biens enregistres."
        actions={
          hasPermission && hasPermission('create_bien') !== false ? (
            <button type="button" className="af-btn af-btn-primary" onClick={() => navigate('/biens/nouveau')}>
              <Plus size={16} />
              Nouveau bien
            </button>
          ) : null
        }
      />

      <div className="af-filter-bar">
        <div className="af-filter-group" style={{ flex: 2 }}>
          <label>Recherche</label>
          <input className="af-input" type="text" placeholder="Nom, marque, serie..." value={filters.search} onChange={(e) => handleFilterChange('search', e.target.value)} />
        </div>
        <div className="af-filter-group" style={{ flex: 1 }}>
          <label>Type</label>
          <select className="af-select" value={filters.type_bien} onChange={(e) => handleFilterChange('type_bien', e.target.value)}>
            <option value="">Tous</option>
            <option value="vehicule">Vehicule</option>
            <option value="machine">Machine</option>
            <option value="ordinateur">Ordinateur</option>
            <option value="autre">Autre</option>
          </select>
        </div>
        <div className="af-filter-group" style={{ flex: 1 }}>
          <label>Etat</label>
          <select className="af-select" value={filters.etat} onChange={(e) => handleFilterChange('etat', e.target.value)}>
            <option value="">Tous</option>
            <option value="NEUF">Neuf</option>
            <option value="BON">Bon etat</option>
            <option value="USAGE">En usage</option>
            <option value="PANNE">En panne</option>
            <option value="REFORME">Reforme</option>
            <option value="MAINTENANCE">En maintenance</option>
          </select>
        </div>
        <div className="af-filter-group">
          <label>&nbsp;</label>
          <button type="button" className="af-btn af-btn-outline" onClick={fetchBiens}><RefreshCw size={16} /></button>
        </div>
      </div>

      {error && <div className="alert alert-error" style={{ marginBottom: 16 }}>{error}</div>}

      <div className="af-card">
        <div className="af-table-wrap">
          <table className="af-table">
            <thead>
              <tr>
                <th>TYPE</th><th>MARQUE / MODELE</th><th>ACQUISITION</th><th>PRIX</th><th>ETAT</th><th>LOCALISATION</th><th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="7" style={{ textAlign: 'center', padding: 40 }}>Chargement...</td></tr>
              ) : biens.length === 0 ? (
                <tr><td colSpan="7" style={{ textAlign: 'center', padding: 40, color: 'var(--af-text-muted)' }}>Aucun bien trouve</td></tr>
              ) : (
                biens.map((bien) => (
                  <tr key={bien.id_bien || bien.id}>
                    <td><span className="af-badge af-badge-comptable">{TYPE_LABELS[bien.type_bien] || bien.type_bien || 'Autre'}</span></td>
                    <td>
                      <div className="name" style={{ fontWeight: 600 }}>{bien.marque || bien.fabricant || 'N/A'} {bien.modele || ''}</div>
                      {(bien.immatriculation || bien.numero_serie) && <div style={{ fontSize: 12, color: 'var(--af-text-muted)' }}>{bien.immatriculation || `S/N: ${bien.numero_serie}`}</div>}
                    </td>
                    <td>{formatDate(bien.date_acquisition)}</td>
                    <td>{formatPrice(bien.prix_acquisition || bien.prix_achat)}</td>
                    <td><span className="af-badge" style={{ background: `${ETAT_COLORS[bien.etat] || '#999'}20`, color: ETAT_COLORS[bien.etat] || '#999' }}>{ETAT_LABELS[bien.etat] || bien.etat || 'Inconnu'}</span></td>
                    <td>{bien.localisation || '-'}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button type="button" className="af-icon-btn" onClick={() => handleView(bien.id_bien || bien.id)}><Eye size={16} /></button>
                        <button type="button" className="af-icon-btn" onClick={() => handleEdit(bien.id_bien || bien.id)}><Pencil size={16} /></button>
                        <button type="button" className="af-icon-btn" onClick={() => handleViewQR(bien)}><QrIcon size={16} /></button>
                        <button type="button" className="af-icon-btn" onClick={() => setConfirmDelete({ open: true, id: bien.id_bien || bien.id, nom: bien.marque || bien.fabricant || bien.nom || 'ce bien' })}><Trash2 size={16} color="var(--af-red)" /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {totalPages > 0 && (
          <div className="af-table-footer">
            <select className="af-select" style={{ width: 'auto' }} value={rowsPerPage} onChange={handleRowsPerPageChange}>
              <option value={5}>5 par page</option><option value={10}>10 par page</option><option value={25}>25 par page</option><option value={50}>50 par page</option>
            </select>
            <div className="af-pagination">
              <button type="button" className="af-page-btn" onClick={() => handlePageChange(page - 1)} disabled={page === 0}>&#8249;</button>
              <span>Page {page + 1} sur {totalPages}</span>
              <button type="button" className="af-page-btn" onClick={() => handlePageChange(page + 1)} disabled={page + 1 >= totalPages}>&#8250;</button>
            </div>
          </div>
        )}
      </div>

      {selectedBien && (
        <QRCodeGenerator bienId={selectedBien.id_bien} qrCode={selectedBien.qr_code} open={qrDialogOpen} onClose={() => { setQrDialogOpen(false); setSelectedBien(null); }} />
      )}

      <ConfirmDialog open={confirmDelete.open} title="Supprimer ce bien ?" content={`Etes-vous sur de vouloir supprimer "${confirmDelete.nom}" ?`} onConfirm={() => { if (confirmDelete.id) handleDelete(confirmDelete.id); setConfirmDelete({ open: false, id: null, nom: '' }); }} onCancel={() => setConfirmDelete({ open: false, id: null, nom: '' })} />
    </>
  );
};

export default ListeBiens;
