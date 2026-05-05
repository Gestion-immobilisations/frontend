// frontend/src/components/biens/NouveauBien.jsx
// Dans frontend/src/components/biens/nouveau/NouveauBien.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { biensService } from '../../../services/biens';      // Remonte de 3 niveaux
import { useAuth } from '../../../hooks/useAuth';            // Remonte de 3 niveaux
import ConfirmDialog from '../../common/ConfirmDialog';      // Remonte de 2 niveaux
import QRCodeGenerator from '../../common/QRCodeGenerator';  // Remonte de 2 niveaux


const NouveauBien = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    // Attributs communs
    type_bien: '',
    date_acquisition: new Date().toISOString().split('T')[0],
    prix_acquisition: '',
    etat: 'NEUF',
    localisation: '',
    description: '',
    // Attributs véhicule
    marque: '',
    modele: '',
    immatriculation: '',
    // Attributs machine
    fabricant: '',
    numero_serie: '',
    puissance: '',
    // Attributs ordinateur
    processeur: '',
    ram: '',
    stockage: ''
  });
  
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const steps = ['Informations générales', 'Caractéristiques spécifiques', 'Confirmation'];

  const ETAT_OPTIONS = [
    { value: 'NEUF', label: 'Neuf' },
    { value: 'BON', label: 'Bon état' },
    { value: 'USAGE', label: 'En usage' },
    { value: 'PANNE', label: 'En panne' },
    { value: 'REFORME', label: 'Réformé' }
  ];

  const TYPE_OPTIONS = [
    { value: 'vehicule', label: 'Véhicule' },
    { value: 'machine', label: 'Machine' },
    { value: 'ordinateur', label: 'Ordinateur' },
    { value: 'autre', label: 'Autre' }
  ];

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }));
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 0) {
      if (!formData.type_bien) newErrors.type_bien = 'Le type de bien est requis';
      if (!formData.date_acquisition) newErrors.date_acquisition = 'La date d\'acquisition est requise';
      if (!formData.prix_acquisition || parseFloat(formData.prix_acquisition) <= 0) {
        newErrors.prix_acquisition = 'Un prix valide est requis';
      }
      if (!formData.localisation) newErrors.localisation = 'La localisation est requise';
    }
    
    if (step === 1 && formData.type_bien) {
      if (formData.type_bien === 'vehicule') {
        if (!formData.marque) newErrors.marque = 'La marque est requise';
        if (!formData.immatriculation) newErrors.immatriculation = 'L\'immatriculation est requise';
      } else if (formData.type_bien === 'machine') {
        if (!formData.fabricant) newErrors.fabricant = 'Le fabricant est requis';
        if (!formData.numero_serie) newErrors.numero_serie = 'Le numéro de série est requis';
      } else if (formData.type_bien === 'ordinateur') {
        if (!formData.marque) newErrors.marque = 'La marque est requise';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(1)) return;
    
    setSubmitting(true);
    setSubmitError(null);
    
    try {
      const payload = {
        type_bien: formData.type_bien,
        date_acquisition: formData.date_acquisition,
        prix_acquisition: parseFloat(formData.prix_acquisition),
        etat: formData.etat,
        localisation: formData.localisation,
        description: formData.description
      };
      
      // Ajout des champs spécifiques selon le type
      if (formData.type_bien === 'vehicule') {
        payload.marque = formData.marque;
        payload.modele = formData.modele;
        payload.immatriculation = formData.immatriculation;
      } else if (formData.type_bien === 'machine') {
        payload.fabricant = formData.fabricant;
        payload.numero_serie = formData.numero_serie;
        payload.puissance = formData.puissance;
      } else if (formData.type_bien === 'ordinateur') {
        payload.marque = formData.marque;
        payload.processeur = formData.processeur;
        payload.ram = formData.ram;
        payload.stockage = formData.stockage;
      }
      
      await biensService.create(payload);
      navigate('/biens');
    } catch (err) {
      setSubmitError(err.response?.data?.detail || 'Erreur lors de la création du bien');
    } finally {
      setSubmitting(false);
    }
  };

  const renderSpecificFields = () => {
    const type = formData.type_bien;
    
    if (!type) {
      return (
        <div className="info-message">
          ⚠️ Veuillez d'abord sélectionner un type de bien à l'étape 1
        </div>
      );
    }
    
    if (type === 'vehicule') {
      return (
        <div className="specific-fields">
          <h3>🚗 Informations véhicule</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Marque *</label>
              <input
                type="text"
                value={formData.marque}
                onChange={(e) => handleChange('marque', e.target.value)}
                className={errors.marque ? 'error' : ''}
                placeholder="Ex: Toyota, Renault, Peugeot..."
              />
              {errors.marque && <span className="error-text">{errors.marque}</span>}
            </div>
            <div className="form-group">
              <label>Modèle</label>
              <input
                type="text"
                value={formData.modele}
                onChange={(e) => handleChange('modele', e.target.value)}
                placeholder="Ex: Hilux, Clio, 308..."
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Immatriculation *</label>
              <input
                type="text"
                value={formData.immatriculation}
                onChange={(e) => handleChange('immatriculation', e.target.value)}
                className={errors.immatriculation ? 'error' : ''}
                placeholder="Ex: AB-123-CD"
              />
              {errors.immatriculation && <span className="error-text">{errors.immatriculation}</span>}
            </div>
          </div>
        </div>
      );
    }
    
    if (type === 'machine') {
      return (
        <div className="specific-fields">
          <h3>🏭 Informations machine</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Fabricant *</label>
              <input
                type="text"
                value={formData.fabricant}
                onChange={(e) => handleChange('fabricant', e.target.value)}
                className={errors.fabricant ? 'error' : ''}
                placeholder="Ex: Siemens, Caterpillar, ABB..."
              />
              {errors.fabricant && <span className="error-text">{errors.fabricant}</span>}
            </div>
            <div className="form-group">
              <label>Numéro de série *</label>
              <input
                type="text"
                value={formData.numero_serie}
                onChange={(e) => handleChange('numero_serie', e.target.value)}
                className={errors.numero_serie ? 'error' : ''}
                placeholder="Numéro unique d'identification"
              />
              {errors.numero_serie && <span className="error-text">{errors.numero_serie}</span>}
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Puissance (kW/CV)</label>
              <input
                type="number"
                value={formData.puissance}
                onChange={(e) => handleChange('puissance', e.target.value)}
                placeholder="Ex: 150 kW"
              />
            </div>
          </div>
        </div>
      );
    }
    
    if (type === 'ordinateur') {
      return (
        <div className="specific-fields">
          <h3>💻 Informations ordinateur</h3>
          <div className="form-row">
            <div className="form-group">
              <label>Marque *</label>
              <input
                type="text"
                value={formData.marque}
                onChange={(e) => handleChange('marque', e.target.value)}
                className={errors.marque ? 'error' : ''}
                placeholder="Ex: Dell, HP, Lenovo..."
              />
              {errors.marque && <span className="error-text">{errors.marque}</span>}
            </div>
            <div className="form-group">
              <label>Processeur</label>
              <input
                type="text"
                value={formData.processeur}
                onChange={(e) => handleChange('processeur', e.target.value)}
                placeholder="Ex: Intel i7, AMD Ryzen 5..."
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>RAM</label>
              <input
                type="text"
                value={formData.ram}
                onChange={(e) => handleChange('ram', e.target.value)}
                placeholder="Ex: 16 Go DDR4"
              />
            </div>
            <div className="form-group">
              <label>Stockage</label>
              <input
                type="text"
                value={formData.stockage}
                onChange={(e) => handleChange('stockage', e.target.value)}
                placeholder="Ex: 512 Go SSD"
              />
            </div>
          </div>
        </div>
      );
    }
    
    return (
      <div className="info-message">
        ✅ Aucune information spécifique requise pour ce type de bien
      </div>
    );
  };

  const renderConfirmation = () => {
    return (
      <div className="confirmation-section">
        <h3>📋 Récapitulatif du bien</h3>
        <div className="recap-card">
          <div className="recap-row">
            <span className="recap-label">Type :</span>
            <span className="recap-value">
              {TYPE_OPTIONS.find(t => t.value === formData.type_bien)?.label || formData.type_bien}
            </span>
          </div>
          <div className="recap-row">
            <span className="recap-label">Date acquisition :</span>
            <span className="recap-value">{new Date(formData.date_acquisition).toLocaleDateString('fr-FR')}</span>
          </div>
          <div className="recap-row">
            <span className="recap-label">Prix :</span>
            <span className="recap-value">{parseInt(formData.prix_acquisition).toLocaleString()} FCFA</span>
          </div>
          <div className="recap-row">
            <span className="recap-label">État :</span>
            <span className="recap-value">{ETAT_OPTIONS.find(e => e.value === formData.etat)?.label}</span>
          </div>
          <div className="recap-row">
            <span className="recap-label">Localisation :</span>
            <span className="recap-value">{formData.localisation}</span>
          </div>
          {formData.marque && (
            <div className="recap-row">
              <span className="recap-label">Marque :</span>
              <span className="recap-value">{formData.marque}</span>
            </div>
          )}
          {formData.immatriculation && (
            <div className="recap-row">
              <span className="recap-label">Immatriculation :</span>
              <span className="recap-value">{formData.immatriculation}</span>
            </div>
          )}
          {formData.numero_serie && (
            <div className="recap-row">
              <span className="recap-label">N° Série :</span>
              <span className="recap-value">{formData.numero_serie}</span>
            </div>
          )}
          {formData.description && (
            <div className="recap-row">
              <span className="recap-label">Description :</span>
              <span className="recap-value">{formData.description}</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="nouveau-bien-container">
      <style>{`
        .nouveau-bien-container {
          padding: 24px;
          max-width: 1000px;
          margin: 0 auto;
        }
        .header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 24px;
        }
        .btn-back {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          padding: 8px;
          border-radius: 8px;
          transition: background 0.2s;
        }
        .btn-back:hover {
          background: #f0f0f0;
        }
        h1 {
          margin: 0;
          font-size: 28px;
          color: #1a1a2e;
        }
        .stepper {
          display: flex;
          justify-content: space-between;
          margin-bottom: 32px;
          background: white;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }
        .step {
          flex: 1;
          text-align: center;
          position: relative;
        }
        .step-number {
          width: 32px;
          height: 32px;
          background: #e0e0e0;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          color: #666;
          margin-bottom: 8px;
        }
        .step.active .step-number {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }
        .step.completed .step-number {
          background: #4caf50;
          color: white;
        }
        .step-label {
          font-size: 14px;
          color: #666;
        }
        .step.active .step-label {
          color: #667eea;
          font-weight: 500;
        }
        .step:not(:last-child):after {
          content: '';
          position: absolute;
          top: 16px;
          right: -50%;
          width: 100%;
          height: 2px;
          background: #e0e0e0;
        }
        .step.completed:not(:last-child):after {
          background: #4caf50;
        }
        .form-card {
          background: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 20px;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .form-group label {
          font-weight: 500;
          color: #333;
        }
        .form-group input,
        .form-group select,
        .form-group textarea {
          padding: 10px 12px;
          border: 1px solid #ddd;
          border-radius: 8px;
          font-size: 14px;
          transition: all 0.2s;
        }
        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }
        .form-group input.error {
          border-color: #f44336;
        }
        .error-text {
          font-size: 12px;
          color: #f44336;
        }
        .info-message {
          background: #e3f2fd;
          padding: 16px;
          border-radius: 8px;
          color: #1976d2;
          text-align: center;
        }
        .specific-fields h3 {
          margin: 0 0 20px 0;
          color: #1a1a2e;
        }
        .confirmation-section h3 {
          margin: 0 0 20px 0;
          color: #1a1a2e;
        }
        .recap-card {
          background: #f8f9fa;
          border-radius: 12px;
          padding: 20px;
        }
        .recap-row {
          display: flex;
          padding: 10px 0;
          border-bottom: 1px solid #eee;
        }
        .recap-row:last-child {
          border-bottom: none;
        }
        .recap-label {
          width: 150px;
          font-weight: 500;
          color: #666;
        }
        .recap-value {
          flex: 1;
          color: #333;
        }
        .form-actions {
          display: flex;
          justify-content: space-between;
          margin-top: 32px;
        }
        .btn-back-step {
          padding: 10px 24px;
          background: #f0f0f0;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
        }
        .btn-back-step:hover {
          background: #e0e0e0;
        }
        .btn-next {
          padding: 10px 32px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
        }
        .btn-next:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
        }
        .btn-submit {
          padding: 10px 32px;
          background: #4caf50;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 14px;
        }
        .btn-submit:hover:not(:disabled) {
          background: #45a049;
        }
        .btn-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .btn-cancel {
          padding: 10px 24px;
          background: none;
          border: 1px solid #ddd;
          border-radius: 8px;
          cursor: pointer;
          margin-left: 12px;
        }
        .btn-cancel:hover {
          background: #f5f5f5;
        }
        .error-alert {
          background: #ffebee;
          color: #c62828;
          padding: 12px 16px;
          border-radius: 8px;
          margin-bottom: 20px;
          border-left: 4px solid #c62828;
        }
        @media (max-width: 768px) {
          .form-row {
            grid-template-columns: 1fr;
          }
          .step:not(:last-child):after {
            display: none;
          }
          .recap-row {
            flex-direction: column;
            gap: 4px;
          }
          .recap-label {
            width: auto;
          }
        }
      `}</style>

      <div className="header">
        <button className="btn-back" onClick={() => navigate('/biens')}>←</button>
        <h1>➕ Ajouter un bien</h1>
      </div>

      {/* Stepper */}
      <div className="stepper">
        {steps.map((label, index) => (
          <div 
            key={index} 
            className={`step ${activeStep === index ? 'active' : ''} ${activeStep > index ? 'completed' : ''}`}
          >
            <div className="step-number">{activeStep > index ? '✓' : index + 1}</div>
            <div className="step-label">{label}</div>
          </div>
        ))}
      </div>

      <div className="form-card">
        {submitError && <div className="error-alert">{submitError}</div>}

        {activeStep === 0 && (
          <>
            <div className="form-row">
              <div className="form-group">
                <label>Type de bien *</label>
                <select
                  value={formData.type_bien}
                  onChange={(e) => handleChange('type_bien', e.target.value)}
                  className={errors.type_bien ? 'error' : ''}
                >
                  <option value="">Sélectionnez un type</option>
                  {TYPE_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                {errors.type_bien && <span className="error-text">{errors.type_bien}</span>}
              </div>
              <div className="form-group">
                <label>Date d'acquisition *</label>
                <input
                  type="date"
                  value={formData.date_acquisition}
                  onChange={(e) => handleChange('date_acquisition', e.target.value)}
                  className={errors.date_acquisition ? 'error' : ''}
                />
                {errors.date_acquisition && <span className="error-text">{errors.date_acquisition}</span>}
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Prix d'acquisition (FCFA) *</label>
                <input
                  type="number"
                  value={formData.prix_acquisition}
                  onChange={(e) => handleChange('prix_acquisition', e.target.value)}
                  placeholder="Ex: 1500000"
                  className={errors.prix_acquisition ? 'error' : ''}
                />
                {errors.prix_acquisition && <span className="error-text">{errors.prix_acquisition}</span>}
              </div>
              <div className="form-group">
                <label>État *</label>
                <select
                  value={formData.etat}
                  onChange={(e) => handleChange('etat', e.target.value)}
                >
                  {ETAT_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Localisation *</label>
                <input
                  type="text"
                  value={formData.localisation}
                  onChange={(e) => handleChange('localisation', e.target.value)}
                  placeholder="Ex: Bâtiment A, Bureau 12"
                  className={errors.localisation ? 'error' : ''}
                />
                {errors.localisation && <span className="error-text">{errors.localisation}</span>}
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Description</label>
                <textarea
                  rows="3"
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Description détaillée du bien..."
                />
              </div>
            </div>
          </>
        )}

        {activeStep === 1 && renderSpecificFields()}

        {activeStep === 2 && renderConfirmation()}

        <div className="form-actions">
          <button 
            className="btn-back-step"
            onClick={handleBack}
            disabled={activeStep === 0}
          >
            ← Retour
          </button>
          <div>
            {activeStep === 2 ? (
              <button 
                className="btn-submit"
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? 'Création en cours...' : '✓ Enregistrer le bien'}
              </button>
            ) : (
              <button className="btn-next" onClick={handleNext}>
                Suivant →
              </button>
            )}
            <button className="btn-cancel" onClick={() => navigate('/biens')}>
              Annuler
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NouveauBien;