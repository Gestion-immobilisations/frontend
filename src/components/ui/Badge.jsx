import React from 'react';

const severityClass = {
  HIGH: 'badge-severity--high',
  HAUTE: 'badge-severity--high',
  CRITIQUE: 'badge-severity--high',
  MED: 'badge-severity--med',
  MOYENNE: 'badge-severity--med',
  LOW: 'badge-severity--low',
  BASSE: 'badge-severity--low',
};

const severityLabel = {
  HIGH: 'Haute',
  HAUTE: 'Haute',
  CRITIQUE: 'Critique',
  MED: 'Moyenne',
  MOYENNE: 'Moyenne',
  LOW: 'Basse',
  BASSE: 'Basse',
};

export const SeverityBadge = ({ level }) => (
  <span className={`badge-severity ${severityClass[level] || 'badge-severity--low'}`}>
    {severityLabel[level] || level}
  </span>
);

const statusDotClass = {
  declaree: 'badge-status__dot--red',
  en_cours: 'badge-status__dot--blue',
  resolue: 'badge-status__dot--gray',
  critique: 'badge-status__dot--red',
  termine: 'badge-status__dot--gray',
  planifiee: 'badge-status__dot--blue',
};

const statusLabel = {
  declaree: 'Déclarée',
  en_cours: 'En cours',
  resolue: 'Résolue',
  critique: 'Critique',
  termine: 'Terminé',
  planifiee: 'Planifiée',
};

export const StatusBadge = ({ status, label }) => {
  const key = String(status || label || '').toLowerCase().replace(/\s+/g, '_');
  const dotClass = statusDotClass[key] || 'badge-status__dot--gray';
  const display = label || statusLabel[key] || status;

  return (
    <span className="badge-status">
      <span className={`badge-status__dot ${dotClass}`} />
      {display}
    </span>
  );
};

export const PillBadge = ({ children, variant = 'default' }) => {
  const variantClass = {
    critical: 'stat-card__badge--critical',
    scheduled: 'stat-card__badge--scheduled',
    active: 'stat-card__badge--active',
    default: 'stat-card__badge--active',
  };

  return (
    <span className={`stat-card__badge ${variantClass[variant] || variantClass.default}`}>
      {children}
    </span>
  );
};

export default SeverityBadge;
