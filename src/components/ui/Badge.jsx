import React from 'react';

const VARIANTS = {
  admin: 'af-badge-admin',
  ADMIN: 'af-badge-admin',
  comptable: 'af-badge-comptable',
  COMPTABLE: 'af-badge-comptable',
  manager: 'af-badge-manager',
  DG: 'af-badge-manager',
  inventaire: 'af-badge-inventaire',
  TECHNICIEN: 'af-badge-inventaire',
  CAISSE: 'af-badge-inventaire',
  actif: 'af-badge-actif',
  inactif: 'af-badge-inactif',
  success: 'af-badge-success',
  progress: 'af-badge-progress',
  rejected: 'af-badge-rejected',
  system: 'af-badge-system',
};

const Badge = ({ children, variant = 'default', showDot = false }) => {
  const cls = VARIANTS[variant] || 'af-badge-inventaire';
  return (
    <span className={`af-badge ${cls}`}>
      {showDot && (
        <span
          className="af-badge-dot"
          style={{
            background: variant === 'inactif' || variant === 'rejected' ? 'var(--af-red)' : 'var(--af-green)',
          }}
        />
      )}
      {children}
    </span>
  );
};

export default Badge;
