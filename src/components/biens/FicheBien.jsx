// frontend/src/components/biens/FicheBien.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Box, Paper, Typography, Grid, Chip, Divider, Button,
  IconButton, Tooltip, Alert, CircularProgress, Tabs, Tab,
  Card, CardContent, CardHeader, Avatar, LinearProgress
} from '@mui/material';
import {
  ArrowBack, Edit, Delete, QrCode, History, Warning,
  CheckCircle, Build, AccountBalance, CalendarToday,
  LocationOn, AttachMoney, Info
} from '@mui/icons-material';
import { biensService } from '../../services/biens';
import { useAuth } from '../../hooks/useAuth';
import { formatDate, formatPrice } from '../../utils/formatters';
import { ETAT_BIEN_OPTIONS, TYPE_BIEN_LABELS, ETAT_BIEN_COLORS } from '../../utils/constants';
import QRCodeGenerator from '../common/QRCodeGenerator';
import ConfirmDialog from '../common/ConfirmDialog';

const FicheBien = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, hasPermission } = useAuth();
  
  const [bien, setBien] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState({ open: false });

  // Chargement des données du bien
  useEffect(() => {
    fetchBien();
  }, [id]);

  const fetchBien = async () => {
    try {
      setLoading(true);
      const data = await biensService.getById(id);
      setBien(data);
      setError(null);
    } catch (err) {
      setError('Impossible de charger les informations du bien');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Actions
  const handleEdit = () => navigate(`/biens/${id}/edit`);
  
  const handleDelete = async () => {
    try {
      await biensService.delete(id);
      navigate('/biens');
    } catch (err) {
      setError('Erreur lors de la suppression');
    }
  };

  const handleTabChange = (_, newValue) => setActiveTab(newValue);

  const getEtatInfo = (etat) => {
    return ETAT_BIEN_OPTIONS.find(o => o.value === etat) || { label: etat, color: '#9e9e9e' };
  };

  // Rendu des champs spécifiques selon le type
  const renderSpecificFields = () => {
    if (!bien?.type_bien) return null;

    // === VÉHICULE ===
    if (bien.type_bien === 'vehicule') {
      return (
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}><InfoField label="Type" value={bien.type_vehicule} /></Grid>
          <Grid item xs={12} md={6}><InfoField label="Marque" value={bien.marque} /></Grid>
          <Grid item xs={12} md={6}><InfoField label="Modèle" value={bien.modele} /></Grid>
          <Grid item xs={12} md={6}><InfoField label="Immatriculation" value={bien.immatriculation} copy /></Grid>
          <Grid item xs={12} md={4}><InfoField label="Poids" value={bien.poids ? `${bien.poids} kg` : null} /></Grid>
          <Grid item xs={12} md={4}><InfoField label="Dimensions" value={bien.dimension} /></Grid>
          <Grid item xs={12} md={4}><InfoField label="Carburant" value={bien.type_de_carburant} /></Grid>
          <Grid item xs={12} md={6}><InfoField label="Conso. carburant" value={bien.consommation_carburant ? `${bien.consommation_carburant} L/100km` : null} /></Grid>
          <Grid item xs={12} md={6}><InfoField label="Conso. huile" value={bien.consommation_huile ? `${bien.consommation_huile} L/1000km` : null} /></Grid>
          <Grid item xs={12} md={6}><InfoField label="Propulsion" value={bien.type_propulsion} /></Grid>
        </Grid>
      );
    }

    // === MACHINE ===
    if (bien.type_bien === 'machine') {
      return (
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}><InfoField label="Fabricant" value={bien.fabricant} /></Grid>
          <Grid item xs={12} md={6}><InfoField label="Modèle" value={bien.modele} /></Grid>
          <Grid item xs={12} md={6}><InfoField label="N° de série" value={bien.numero_serie} copy /></Grid>
          <Grid item xs={12} md={6}><InfoField label="Puissance" value={bien.puissance ? `${bien.puissance} kW` : null} /></Grid>
          <Grid item xs={12} md={6}><InfoField label="Alimentation" value={bien.type_alimentation} /></Grid>
          <Grid item xs={12} md={6}><InfoField label="Tension" value={bien.tension_normal} /></Grid>
          <Grid item xs={12} md={6}><InfoField label="Service affecté" value={bien.service_affecte} /></Grid>
          <Grid item xs={12} md={6}><InfoField label="Responsable" value={bien.responsable} /></Grid>
          <Grid item xs={12} md={6}><InfoField label="Conso. élec." value={bien.consommation_elec ? `${bien.consommation_elec} kWh` : null} /></Grid>
          <Grid item xs={12} md={6}><InfoField label="Maintenance" value={bien.frequence_maintenance} /></Grid>
        </Grid>
      );
    }

    // === ORDINATEUR ===
    if (bien.type_bien === 'ordinateur') {
      return (
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}><InfoField label="Marque" value={bien.marque} /></Grid>
          <Grid item xs={12} md={6}><InfoField label="Modèle" value={bien.modele} /></Grid>
          <Grid item xs={12} md={6}><InfoField label="Processeur" value={bien.processeur} /></Grid>
          <Grid item xs={12} md={6}><InfoField label="RAM" value={bien.ram} /></Grid>
          <Grid item xs={12} md={6}><InfoField label="Stockage" value={bien.stockage} /></Grid>
          <Grid item xs={12} md={6}><InfoField label="Adresse IP" value={bien.adresse_ip} copy /></Grid>
          <Grid item xs={12}><InfoField label="Utilisateur affecté" value={bien.utilisateur_affecte} /></Grid>
        </Grid>
      );
    }

    return null;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !bien) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" action={
          <Button color="inherit" size="small" onClick={() => navigate('/biens')}>
            Retour
          </Button>
        }>
          {error || 'Bien non trouvé'}
        </Alert>
      </Box>
    );
  }

  const etatInfo = getEtatInfo(bien.etat);
  const ageAns = bien.date_acquisition ? 
    new Date().getFullYear() - new Date(bien.date_acquisition).getFullYear() : null;

  return (
    <Box sx={{ p: 3 }}>
      {/* En-tête */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <IconButton onClick={() => navigate('/biens')} size="small">
          <ArrowBack />
        </IconButton>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h4">
            {TYPE_BIEN_LABELS[bien.type_bien]} • {bien.marque || bien.fabricant} {bien.modele}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            QR Code: {bien.qr_code}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title="QR Code">
            <IconButton onClick={() => setQrDialogOpen(true)} color="primary">
              <QrCode />
            </IconButton>
          </Tooltip>
          {hasPermission('edit_bien') && (
            <Tooltip title="Modifier">
              <IconButton onClick={handleEdit} color="info">
                <Edit />
              </IconButton>
            </Tooltip>
          )}
          {hasPermission('delete_bien') && (
            <Tooltip title="Supprimer">
              <IconButton onClick={() => setConfirmDelete({ open: true })} color="error">
                <Delete />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </Box>

      {/* Alertes d'état */}
      {(bien.etat === 'panne' || bien.etat === 'maintenance') && (
        <Alert 
          severity={bien.etat === 'panne' ? 'error' : 'warning'} 
          icon={bien.etat === 'panne' ? <Warning /> : <Build />}
          sx={{ mb: 3 }}
        >
          <strong>{bien.etat === 'panne' ? '⚠️ En panne' : '🔧 En maintenance'}</strong>
          {bien.etat === 'panne' 
            ? ' Ce bien ne peut pas être utilisé. Déclarez une intervention.' 
            : ' Maintenance en cours. Prévoyez une date de retour.'}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Colonne gauche : Informations principales */}
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 3 }}>
            <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
              <Tab label="Informations" />
              <Tab label="Historique" />
              <Tab label="Documents" />
            </Tabs>

            {activeTab === 0 && (
              <Box>
                {/* Fiche technique */}
                <Card variant="outlined" sx={{ mb: 3 }}>
                  <CardHeader 
                    title="Fiche technique" 
                    avatar={<Avatar sx={{ bgcolor: 'primary.main' }}><Info fontSize="small" /></Avatar>}
                  />
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={4}>
                        <InfoField label="Type" value={TYPE_BIEN_LABELS[bien.type_bien]} />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <InfoField label="État" value={
                          <Chip 
                            label={etatInfo.label} 
                            size="small"
                            sx={{ 
                              bgcolor: `${etatInfo.color}20`, 
                              color: etatInfo.color,
                              fontWeight: 500 
                            }}
                          />
                        } />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <InfoField label="Âge" value={ageAns ? `${ageAns} an(s)` : 'N/A'} />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <InfoField 
                          label="Date d'acquisition" 
                          value={formatDate(bien.date_acquisition)} 
                          icon={<CalendarToday fontSize="small" />}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <InfoField 
                          label="Prix d'acquisition" 
                          value={formatPrice(bien.prix_acquisition)} 
                          icon={<AttachMoney fontSize="small" />}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <InfoField 
                          label="Localisation" 
                          value={bien.localisation} 
                          icon={<LocationOn fontSize="small" />}
                        />
                      </Grid>
                      {bien.description && (
                        <Grid item xs={12}>
                          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            Description
                          </Typography>
                          <Typography variant="body2">{bien.description}</Typography>
                        </Grid>
                      )}
                    </Grid>
                  </CardContent>
                </Card>

                {/* Champs spécifiques */}
                <Card variant="outlined">
                  <CardHeader 
                    title={`Caractéristiques ${TYPE_BIEN_LABELS[bien.type_bien]?.toLowerCase()}`}
                    avatar={<Avatar sx={{ bgcolor: 'secondary.main' }}><Build fontSize="small" /></Avatar>}
                  />
                  <CardContent>
                    {renderSpecificFields()}
                  </CardContent>
                </Card>
              </Box>
            )}

            {activeTab === 1 && (
              <Box sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
                <History sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
                <Typography>Historique des interventions et modifications</Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Fonctionnalité disponible dans la Phase 3 (Pannes & Audit)
                </Typography>
              </Box>
            )}

            {activeTab === 2 && (
              <Box sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
                <Info sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
                <Typography>Documents attachés au bien</Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Factures, garanties, manuels (Phase 10 - Rapports)
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Colonne droite : QR Code et actions rapides */}
        <Grid item xs={12} lg={4}>
          {/* QR Code Card */}
          <Paper sx={{ p: 3, textAlign: 'center', mb: 3 }}>
            <Typography variant="h6" gutterBottom>QR Code</Typography>
            <Divider sx={{ mb: 2 }} />
            <Box 
              sx={{ 
                bgcolor: 'grey.100', 
                p: 2, 
                borderRadius: 2,
                display: 'inline-block',
                mb: 2
              }}
            >
              <Typography variant="body2" fontFamily="monospace">
                {bien.qr_code}
              </Typography>
            </Box>
            <Button 
              variant="contained" 
              startIcon={<QrCode />}
              onClick={() => setQrDialogOpen(true)}
              fullWidth
            >
              Voir / Télécharger
            </Button>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
              Scannez pour accéder à cette fiche
            </Typography>
          </Paper>

          {/* Valeur résiduelle (Phase 6) */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="subtitle2" gutterBottom>
              <AccountBalance sx={{ mr: 1, verticalAlign: 'middle', fontSize: 'small' }} />
              Valeur comptable
            </Typography>
            <Box sx={{ mb: 1 }}>
              <Typography variant="h4" color="primary">
                {formatPrice(bien.prix_acquisition)}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Valeur d'acquisition
              </Typography>
            </Box>
            <LinearProgress variant="determinate" value={ageAns ? Math.min(ageAns * 10, 100) : 0} sx={{ mb: 1 }} />
            <Typography variant="caption" color="text.secondary">
              Amortissement estimé • Calcul complet disponible dans la Phase 6
            </Typography>
          </Paper>

          {/* Actions rapides */}
          <Paper sx={{ p: 2 }}>
            <Typography variant="subtitle2" gutterBottom>Actions rapides</Typography>
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <Button 
                  variant="outlined" 
                  size="small" 
                  fullWidth
                  startIcon={<Build />}
                  onClick={() => navigate(`/pannes/nouveau?bien_id=${id}`)}
                >
                  Déclarer panne
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button 
                  variant="outlined" 
                  size="small" 
                  fullWidth
                  startIcon={<CheckCircle />}
                  onClick={() => navigate(`/maintenances/nouveau?bien_id=${id}`)}
                >
                  Planifier maintenance
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      {/* Dialog QR Code */}
      <QRCodeGenerator
        bienId={bien.id_bien}
        qrCode={bien.qr_code}
        open={qrDialogOpen}
        onClose={() => setQrDialogOpen(false)}
      />

      {/* Dialog de confirmation suppression */}
      <ConfirmDialog
        open={confirmDelete.open}
        title="Supprimer ce bien ?"
        content={`Cette action est irréversible. Le bien "${bien.marque || bien.fabricant} ${bien.modele}" et toutes ses données associées seront définitivement supprimés.`}
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete({ open: false })}
      />
    </Box>
  );
};

// Composant utilitaire pour afficher un champ d'information
const InfoField = ({ label, value, icon, copy = false }) => {
  const handleCopy = async () => {
    if (copy && value) {
      await navigator.clipboard.writeText(value);
      // Optionnel: afficher un toast de confirmation
    }
  };

  return (
    <Box>
      <Typography variant="caption" color="text.secondary" display="flex" alignItems="center" gap={0.5}>
        {icon}
        {label}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="body1" fontWeight={500}>
          {value || '—'}
        </Typography>
        {copy && value && (
          <Tooltip title="Copier">
            <IconButton size="small" onClick={handleCopy} sx={{ p: 0.5 }}>
              <Info fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </Box>
    </Box>
  );
};

export default FicheBien;