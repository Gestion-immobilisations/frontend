// frontend/src/components/common/QRCodeGenerator.jsx
import React, { useEffect, useState } from 'react';
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, Typography, IconButton } from '@mui/material';
import { Download, Close, Print } from '@mui/icons-material';
import api from '../../services/api';

const QRCodeGenerator = ({ bienId, qrCode, open, onClose }) => {
  const [qrImage, setQrImage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && bienId) {
      fetchQRCode();
    }
  }, [open, bienId]);

  const fetchQRCode = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/qr-code/${bienId}/view`);
      setQrImage(response.data.image_base64);
    } catch (error) {
      console.error('Erreur chargement QR code:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await api.get(`/qr-code/${bienId}/download`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `QR-${qrCode || bienId}.png`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erreur téléchargement QR code:', error);
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>QR Code - ${qrCode}</title>
          <style>
            body { 
              display: flex; 
              justify-content: center; 
              align-items: center; 
              height: 100vh; 
              margin: 0;
              font-family: Arial, sans-serif;
            }
            .container { text-align: center; }
            img { max-width: 300px; }
            .info { margin-top: 20px; font-size: 14px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <img src="${qrImage}" alt="QR Code" />
            <div class="info">
              <p><strong>QR Code:</strong> ${qrCode}</p>
              <p>Scan pour accéder aux informations du bien</p>
            </div>
          </div>
          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() {
                window.close();
              };
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">QR Code du Bien</Typography>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      
      <DialogContent sx={{ textAlign: 'center', py: 3 }}>
        {loading ? (
          <Typography>Génération du QR code...</Typography>
        ) : qrImage ? (
          <Box>
            <img 
              src={qrImage} 
              alt="QR Code" 
              style={{ 
                maxWidth: '250px', 
                width: '100%',
                border: '2px solid #e0e0e0',
                borderRadius: '8px',
                padding: '10px'
              }}
            />
            {qrCode && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                {qrCode}
              </Typography>
            )}
          </Box>
        ) : (
          <Typography color="error">Erreur de génération du QR code</Typography>
        )}
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} color="inherit">
          Fermer
        </Button>
        <Button 
          onClick={handlePrint} 
          variant="outlined" 
          startIcon={<Print />}
          disabled={!qrImage}
        >
          Imprimer
        </Button>
        <Button 
          onClick={handleDownload} 
          variant="contained" 
          startIcon={<Download />}
          disabled={!qrImage}
        >
          Télécharger
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default QRCodeGenerator;