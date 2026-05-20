// frontend/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Contexte d'authentification et notifications
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';

// Pages publiques
import LoginPage from './pages/LoginPage';
import UnauthorizedPage from './pages/UnauthorizedPage';

// Layout et protection des routes
import Layout from './components/common/Layout';
import ProtectedRoute from './routes/ProtectedRoute';

// Styles globaux
import './styles/main.css';

// ==================== IMPORTS DES COMPOSANTS ====================

// Dashboard
import Dashboard from './pages/Dashboard';

// Portail Technicien
import GestionPannes from './pages/technicien/GestionPannes';
import GestionMaintenances from './pages/technicien/GestionMaintenances';
import ReparationsAlertes from './pages/technicien/ReparationsAlertes';
import DeclarationIntervention from './pages/technicien/DeclarationIntervention';
import GestionStock from './pages/technicien/GestionStock';
import InventairePieces from './pages/technicien/InventairePieces';
import PrixMarchePieces from './pages/technicien/PrixMarchePieces';
import DemandesPieces from './pages/technicien/DemandesPieces';
import EvaluationEtat from './pages/technicien/EvaluationEtat';

// ✅ Biens (IMPORTÉS et PRÊTS À L'EMPLOI)
import ListeBiens from './components/biens/ListeBiens';
import NouveauBien from './components/biens/nouveau/NouveauBien';
import FicheBien from './components/biens/FicheBien';
import EditBien from './components/biens/EditBien';

// Utilisateurs (Admin uniquement) - À décommenter quand les fichiers existent
// import ListeUtilisateurs from './components/utilisateurs/ListeUtilisateurs';
// import NouveauUtilisateur from './components/utilisateurs/NouveauUtilisateur';
// import FicheUtilisateur from './components/utilisateurs/FicheUtilisateur';

// Pannes (Technicien) - À décommenter quand les fichiers existent
// import ListePannes from './components/pannes/ListePannes';
// import DeclarationPanne from './components/pannes/DeclarationPanne';

// Maintenances - À décommenter quand les fichiers existent
// import PlanningMaintenance from './components/maintenances/PlanningMaintenance';

// Amortissements (Comptable) - À décommenter quand les fichiers existent
// import ListeAmortissements from './components/amortissements/ListeAmortissements';

// Validations (DG) - À décommenter quand les fichiers existent
// import ValidationsEnAttente from './components/validations/ValidationsEnAttente';

// Pièces (Caisse) - À décommenter quand les fichiers existent
// import ListePieces from './components/pieces/ListePieces';

// Rapports - À décommenter quand les fichiers existent
// import RapportsFinanciers from './components/rapports/RapportsFinanciers';

// Audit - À décommenter quand les fichiers existent
// import JournalAudit from './components/audit/JournalAudit';

// Paramètres (Admin) - À décommenter quand les fichiers existent
// import ParametresSysteme from './components/administration/ParametresSysteme';

function App() {
  return (
    <Router>
      <AuthProvider>
        <NotificationProvider>
        <Routes>
          {/* ==================== ROUTES PUBLIQUES ==================== */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          {/* ==================== ROUTES PROTÉGÉES AVEC LAYOUT ==================== */}
          <Route
            element={
              <ProtectedRoute allowedRoles={[]}>
                <Layout />
              </ProtectedRoute>
            }
          >
            {/* Redirection racine vers dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* Dashboard principal - Accessible à tous */}
            <Route path="/dashboard" element={<Dashboard />} />
            
            {/* ==================== ROUTES POUR LES BIENS ==================== */}
            {/* ✅ Route pour la liste des biens */}
            <Route 
              path="/biens" 
              element={
                <ProtectedRoute allowedRoles={[]}>
                  <ListeBiens />
                </ProtectedRoute>
              } 
            />
            
            {/* ✅ Route pour créer un nouveau bien */}
            
            <Route 
              path="/biens/nouveau" 
              element={
                <ProtectedRoute allowedRoles={[]}>
                  <NouveauBien />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/biens/:id" 
              element={
                <ProtectedRoute allowedRoles={[]}>
                  <FicheBien />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/biens/:id/edit" 
              element={
                <ProtectedRoute allowedRoles={[]}>
                  <EditBien />
                </ProtectedRoute>
              } 
            />

            {/* ==================== ROUTES TECHNICIEN ==================== */}
            <Route 
              path="/pannes" 
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'TECHNICIEN']}>
                  <GestionPannes />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/pannes/declaration" 
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'TECHNICIEN']}>
                  <DeclarationIntervention />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/maintenances" 
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'TECHNICIEN']}>
                  <GestionMaintenances />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/reparations" 
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'TECHNICIEN']}>
                  <ReparationsAlertes />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/pieces/stock" 
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'TECHNICIEN']}>
                  <GestionStock />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/pieces/inventaire" 
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'TECHNICIEN']}>
                  <InventairePieces />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/pieces/prix-marche" 
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'TECHNICIEN']}>
                  <PrixMarchePieces />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/pieces/demandes" 
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'TECHNICIEN']}>
                  <DemandesPieces />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/evaluation" 
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'TECHNICIEN']}>
                  <EvaluationEtat />
                </ProtectedRoute>
              } 
            />

            {/* ==================== ROUTES ADMIN UNIQUEMENT ==================== */}
            {/* À DÉCOMMENTER QUAND LES COMPOSANTS SERONT CRÉÉS */}
            {/* 
            <Route 
              path="/utilisateurs" 
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <ListeUtilisateurs />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/utilisateurs/nouveau" 
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <NouveauUtilisateur />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/utilisateurs/:id" 
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <FicheUtilisateur />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/parametres" 
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <ParametresSysteme />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/audit" 
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <JournalAudit />
                </ProtectedRoute>
              } 
            />
            */}

            {/* ==================== ROUTES DG + ADMIN ==================== */}
            {/* À DÉCOMMENTER QUAND LES COMPOSANTS SERONT CRÉÉS */}
            {/* 
            <Route 
              path="/validations" 
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'DG']}>
                  <ValidationsEnAttente />
                </ProtectedRoute>
              } 
            />
            */}

            {/* ==================== ROUTES COMPTABLE + ADMIN ==================== */}
            {/* À DÉCOMMENTER QUAND LES COMPOSANTS SERONT CRÉÉS */}
            {/* 
            <Route 
              path="/amortissements" 
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'COMPTABLE']}>
                  <ListeAmortissements />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/rapports" 
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'COMPTABLE']}>
                  <RapportsFinanciers />
                </ProtectedRoute>
              } 
            />
            */}

            {/* ==================== ROUTES TECHNICIEN + ADMIN ==================== */}
            {/* À DÉCOMMENTER QUAND LES COMPOSANTS SERONT CRÉÉS */} 
            {/* 
            <Route 
              path="/pannes" 
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'TECHNICIEN']}>
                  <ListePannes />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/pannes/declaration" 
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'TECHNICIEN']}>
                  <DeclarationPanne />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/maintenances" 
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'TECHNICIEN']}>
                  <PlanningMaintenance />
                </ProtectedRoute>
              } 
            />
           

            {/* ==================== ROUTES CAISSE + ADMIN ==================== */}
            {/* À DÉCOMMENTER QUAND LES COMPOSANTS SERONT CRÉÉS */}
            {/* 
            <Route 
              path="/pieces" 
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'CAISSE']}>
                  <ListePieces />
                </ProtectedRoute>
              } 
            />
            */}
          </Route>

          {/* ==================== ROUTE 404 ==================== */}
          <Route path="*" element={<Navigate to="/unauthorized" replace />} />
        </Routes>
        </NotificationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;