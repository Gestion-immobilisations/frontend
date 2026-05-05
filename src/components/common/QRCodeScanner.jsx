// frontend/src/components/common/QRCodeScanner.jsx
import React, { useState, useRef, useEffect } from 'react';
import {
  Box, Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Typography, Alert, CircularProgress
} from '@mui/material';
import { QrCodeScanner, Close, CheckCircle } from '@mui/icons-material';
import { Html5Qrcode } from 'html5-qrcode';
import api from '../../services/api';

const QRCodeScanner = ({ open, onClose, onScanSuccess }) => {
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const scannerRef = useRef(null);
  const html5QrCodeRef = useRef(null);

  useEffect(() => {
    if (open) {
      startScanning();
    } else {
      stopScanning();
    }

    return () => {
      stopScanning();
    };
  }, [open]);

  const startScanning = async () => {
    try {
      setScanning(true);
      setError(null);
      setScanResult(null);

      // Initialisation du scanner
      const html5QrCode = new Html5Qrcode("qr-reader");
      html5QrCodeRef.current = html5QrCode;

      await html5QrCode.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 }
        },
        onScanSuccessInternal,
        onScanFailure
      );
    } catch (err) {
      console.error('Erreur démarrage scanner:', err);
      setError('Impossible d\'accéder à la caméra. Vérifiez les permissions.');
      setScanning(false);
    }
  };

  const stopScanning = () => {
    if (html5QrCodeRef.current) {
      html5QrCodeRef.current.stop().catch(err => {
        console.error('Erreur arrêt scanner:', err);
      });
      html5QrCodeRef.current = null;
    }
    setScanning(false);
  };

  const onScanSuccessInternal = async (decodedText) => {
    try {
      setLoading(true);
      stopScanning();
      
      // Recherche du bien dans la base
      const response = await api.post('/qr-code/scan', { qr_data: decodedText });
      
      setScanResult(response.data);
      
      if (onScanSuccess) {
        onScanSuccess(response.data);
      }
    } catch (err) {
      setError(`Aucun bien trouvé avec ce QR code: ${decodedText}`);
      // Redémarrer le scanner après une erreur
      setTimeout(() => startScanning(), 2000);
    } finally {
      setLoading(false);
    }
  };

  const onScanFailure = (error) => {
    // Les erreurs de scan sont normales (pas de QR code détecté)
    // console.warn('Scan failure:', error);
  };

  const handleClose = () => {
    stopScanning();
    setScanResult(null);
    setError(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">
            <QrCodeScanner sx={{ mr: 1, verticalAlign: 'middle' }} />
            Scanner un QR Code
          </Typography>
          <IconButton onClick={handleClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ py: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {scanResult && (
          <Alert 
            severity="success" 
            icon={<CheckCircle />}
            sx={{ mb: 2 }}
          >
            <Typography variant="body1" fontWeight={500}>
              Bien trouvé !
            </Typography>
            <Typography variant="body2">
              {scanResult.bien.marque} {scanResult.bien.modele}
            </Typography>
            <Typography variant="caption">
              QR Code: {scanResult.bien.qr_code}
            </Typography>
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 5 }}>
            <CircularProgress />
          </Box>
        ) : scanning ? (
          <Box>
            <div 
              id="qr-reader" 
              ref={scannerRef}
              style={{ width: '100%', borderRadius: '8px', overflow: 'hidden' }}
            />
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2, textAlign: 'center' }}>
              Positionnez le QR code dans le cadre pour le scanner
            </Typography>
          </Box>
        ) : (
          <Box sx={{ textAlign: 'center', py: 5 }}>
            <QrCodeScanner sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="body1" color="text.secondary">
              Le scanner va démarrer automatiquement...
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={handleClose} color="inherit">
          Fermer
        </Button>
        {!scanning && !loading && (
          <Button onClick={startScanning} variant="contained" startIcon={<QrCodeScanner />}>
            Redémarrer
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default QRCodeScanner;