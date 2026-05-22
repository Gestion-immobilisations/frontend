/**
 * Libellés d'affichage UI pour les codes rôles backend (ADMIN, DG, etc.).
 * Les valeurs backend ne sont pas modifiées.
 */
export const ROLE_LABELS = {
  ADMIN: 'Administrateur',
  DG: 'Directeur Général',
  COMPTABLE: 'Comptable',
  TECHNICIEN: 'Technicien',
  MAGASINIER: 'Magasinier',
  CAISSE: 'Caisse',
};

export const ROLE_DESCRIPTIONS = {
  ADMIN: 'Accès complet au système et supervision globale',
  DG: 'Vision stratégique, rapports analytiques et lecture des opérations',
  COMPTABLE: 'Gestion financière des immobilisations et amortissements',
  TECHNICIEN: 'Maintenance, pannes et demandes de pièces',
  MAGASINIER: 'Gestion des stocks et pièces de rechange',
  CAISSE: 'Validation des dépenses et paiements',
};

export const ROLE_BADGE_CLASS = {
  ADMIN: 'af-badge-admin',
  COMPTABLE: 'af-badge-comptable',
  DG: 'af-badge-manager',
  TECHNICIEN: 'af-badge-inventaire',
  MAGASINIER: 'af-badge-inventaire',
  CAISSE: 'af-badge-neutral',
};

/** Rôles masqués dans l'interface (conservés en base si présents) */
export const HIDDEN_ROLES = new Set(['AUDITEUR']);

export const SYSTEM_ROLES = new Set(['ADMIN']);

export function getRoleLabel(roleCode) {
  if (!roleCode) return '—';
  const code = String(roleCode).trim().toUpperCase();
  return ROLE_LABELS[code] || code;
}

export function isRoleHidden(roleCode) {
  return HIDDEN_ROLES.has(String(roleCode || '').trim().toUpperCase());
}
