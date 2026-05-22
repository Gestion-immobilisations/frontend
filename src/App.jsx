// frontend/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Contexte d'authentification
import { AuthProvider } from './context/AuthContext';

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

// ✅ Biens (IMPORTÉS et PRÊTS À L'EMPLOI)
import ListeBiens from './components/biens/ListeBiens';
import NouveauBien from './components/biens/nouveau/NouveauBien';
import FicheBien from './components/biens/FicheBien';
import EditBien from './components/biens/EditBien';

// 🆕 IMPORT DES COMPOSANTS POUR LE MAGASINIER
// Gestion des stocks
import StockApercu from './components/stock/StockApercu';
import StockEntrees from './components/stock/StockEntrees';
import StockSorties from './components/stock/StockSorties';
import StockMouvements from './components/stock/StockMouvements';
import StockInventaire from './components/stock/StockInventaire';
import StockAlertes from './components/stock/StockAlertes';

// Gestion des pièces de rechange
import PiecesListe from './components/pieces/PiecesListe';
import PieceForm from './components/pieces/PieceForm';
import CategoriesListe from './components/pieces/CategoriesListe';
import FournisseursListe from './components/pieces/FournisseursListe';
import PiecesCritiques from './components/pieces/PiecesCritiques';

// Rapports pour le magasinier
import RapportStock from './components/rapports/RapportStock';
import RapportMouvements from './components/rapports/RapportMouvements';
import RapportValeurStock from './components/rapports/RapportValeurStock';

// Paramètres pour le magasinier
import ParametresStock from './components/parametres/ParametresStock';
import UnitesMesure from './components/parametres/UnitesMesure';
import Emplacements from './components/parametres/Emplacements';

// Pages administration (design AssetFlow)
import UtilisateursPage from './pages/UtilisateursPage';
import RolesPage from './pages/RolesPage';
import AuditPage from './pages/AuditPage';
import ParametresPage from './pages/ParametresPage';

// Pannes (Technicien) - À décommenter quand les fichiers existent
// import ListePannes from './components/pannes/ListePannes';
// import DeclarationPanne from './components/pannes/DeclarationPanne';

// Maintenances - À décommenter quand les fichiers existent
// import PlanningMaintenance from './components/maintenances/PlanningMaintenance';

// Amortissements (Comptable) - À décommenter quand les fichiers existent
// import ListeAmortissements from './components/amortissements/ListeAmortissements';

// Validations (DG) - À décommenter quand les fichiers existent
// import ValidationsEnAttente from './components/validations/ValidationsEnAttente';


function App() {
  return (
    <Router>
      <AuthProvider>
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
            
            {/* Dashboard principal - Accessible à tous (y compris MAGASINIER) */}
            <Route path="/dashboard" element={<Dashboard />} />
            
            {/* ==================== ROUTES POUR LES BIENS ==================== */}
            <Route 
              path="/biens" 
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'DG', 'COMPTABLE', 'TECHNICIEN']}>
                  <ListeBiens />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/biens/nouveau" 
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'COMPTABLE']}>
                  <NouveauBien />
                </ProtectedRoute>
              } 
            />
              
            <Route 
              path="/biens/:id" 
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'DG', 'COMPTABLE', 'TECHNICIEN']}>
                  <FicheBien />
                </ProtectedRoute>
              } 
            />
              
            <Route 
              path="/biens/:id/edit" 
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'COMPTABLE']}>
                  <EditBien />
                </ProtectedRoute>
              } 
            />

            {/* ==================== 🆕 ROUTES POUR LE MAGASINIER ==================== */}
            
            {/* 📦 Gestion des stocks */}
            <Route 
              path="/stock/apercu" 
              element={
                <ProtectedRoute allowedRoles={['MAGASINIER', 'ADMIN']}>
                  <StockApercu />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/stock/entrees" 
              element={
                <ProtectedRoute allowedRoles={['MAGASINIER', 'ADMIN']}>
                  <StockEntrees />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/stock/sorties" 
              element={
                <ProtectedRoute allowedRoles={['MAGASINIER', 'ADMIN']}>
                  <StockSorties />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/stock/mouvements" 
              element={
                <ProtectedRoute allowedRoles={['MAGASINIER', 'ADMIN']}>
                  <StockMouvements />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/stock/inventaire" 
              element={
                <ProtectedRoute allowedRoles={['MAGASINIER', 'ADMIN']}>
                  <StockInventaire />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/stock/alertes" 
              element={
                <ProtectedRoute allowedRoles={['MAGASINIER', 'ADMIN', 'DG']}>
                  <StockAlertes />
                </ProtectedRoute>
              } 
            />

            {/* 🔩 Gestion des pièces de rechange */}
            <Route 
              path="/pieces" 
              element={
                <ProtectedRoute allowedRoles={['MAGASINIER', 'ADMIN', 'TECHNICIEN']}>
                  <PiecesListe />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/pieces/nouveau" 
              element={
                <ProtectedRoute allowedRoles={['MAGASINIER', 'ADMIN']}>
                  <PieceForm />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/pieces/:id/edit" 
              element={
                <ProtectedRoute allowedRoles={['MAGASINIER', 'ADMIN']}>
                  <PieceForm />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/pieces/categories" 
              element={
                <ProtectedRoute allowedRoles={['MAGASINIER', 'ADMIN']}>
                  <CategoriesListe />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/pieces/fournisseurs" 
              element={
                <ProtectedRoute allowedRoles={['MAGASINIER', 'ADMIN']}>
                  <FournisseursListe />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/pieces/critiques" 
              element={
                <ProtectedRoute allowedRoles={['MAGASINIER', 'ADMIN', 'TECHNICIEN']}>
                  <PiecesCritiques />
                </ProtectedRoute>
              } 
            />

            {/* 📊 Rapports pour magasinier */}
            <Route 
              path="/rapports/stock" 
              element={
                <ProtectedRoute allowedRoles={['MAGASINIER', 'ADMIN', 'DG', 'COMPTABLE']}>
                  <RapportStock />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/rapports/mouvements" 
              element={
                <ProtectedRoute allowedRoles={['MAGASINIER', 'ADMIN', 'DG']}>
                  <RapportMouvements />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/rapports/valeur-stock" 
              element={
                <ProtectedRoute allowedRoles={['MAGASINIER', 'ADMIN', 'DG', 'COMPTABLE']}>
                  <RapportValeurStock />
                </ProtectedRoute>
              } 
            />

            {/* ⚙️ Paramètres pour magasinier */}
            <Route 
              path="/parametres/stock" 
              element={
                <ProtectedRoute allowedRoles={['MAGASINIER', 'ADMIN']}>
                  <ParametresStock />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/parametres/unites" 
              element={
                <ProtectedRoute allowedRoles={['MAGASINIER', 'ADMIN']}>
                  <UnitesMesure />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/parametres/emplacements" 
              element={
                <ProtectedRoute allowedRoles={['MAGASINIER', 'ADMIN']}>
                  <Emplacements />
                </ProtectedRoute>
              } 
            />

            {/* ==================== ROUTES ADMIN UNIQUEMENT ==================== */}
            <Route 
              path="/utilisateurs" 
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <UtilisateursPage />
                </ProtectedRoute>
              } 
            />

            <Route 
              path="/roles" 
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <RolesPage />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/parametres" 
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <ParametresPage />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/audit" 
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AuditPage />
                </ProtectedRoute>
              } 
            />

            {/* ==================== ROUTES DG + ADMIN ==================== */}
            <Route 
              path="/validations" 
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'DG']}>
                  {/* <ValidationsEnAttente /> */}
                  <div>Validations en attente (à implémenter)</div>
                </ProtectedRoute>
              } 
            />

            {/* ==================== ROUTES COMPTABLE + ADMIN ==================== */}
            <Route 
              path="/amortissements" 
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'COMPTABLE']}>
                  {/* <ListeAmortissements /> */}
                  <div>Amortissements (à implémenter)</div>
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/rapports" 
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'COMPTABLE', 'DG']}>
                  {/* <RapportsFinanciers /> */}
                  <div>Rapports Financiers (à implémenter)</div>
                </ProtectedRoute>
              } 
            />

            {/* ==================== ROUTES TECHNICIEN + ADMIN ==================== */}
            <Route 
              path="/pannes" 
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'TECHNICIEN']}>
                  {/* <ListePannes /> */}
                  <div>Liste des pannes (à implémenter)</div>
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/pannes/nouveau" 
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'TECHNICIEN']}>
                  {/* <DeclarationPanne /> */}
                  <div>Déclaration de panne (à implémenter)</div>
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/maintenances" 
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'TECHNICIEN', 'DG']}>
                  {/* <PlanningMaintenance /> */}
                  <div>Planning maintenance (à implémenter)</div>
                </ProtectedRoute>
              } 
            />
          </Route>

          {/* ==================== ROUTE 404 ==================== */}
          <Route path="*" element={<Navigate to="/unauthorized" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;