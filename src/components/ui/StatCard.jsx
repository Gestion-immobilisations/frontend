import React from 'react';

const StatCard = ({
  icon: Icon,
  label,
  value,
  badge,
  badgeVariant,
  sublabel,
  iconVariant = 'danger',
}) => {
  const iconClass = {
    danger: 'stat-card__icon--danger',
    info: 'stat-card__icon--info',
    neutral: 'stat-card__icon--neutral',
  };

  const badgeClass = {
    critical: 'stat-card__badge--critical',
    scheduled: 'stat-card__badge--scheduled',
    active: 'stat-card__badge--active',
  };

  const badgeText = {
    critical: 'Critique',
    scheduled: 'Planifiée',
    active: 'Active',
  };

  return (
    <div className="stat-card">
      {badge && (
        <span className={`stat-card__badge ${badgeClass[badgeVariant] || badgeClass.active}`}>
          {badgeText[badgeVariant] || badge}
        </span>
      )}
      <div className={`stat-card__icon ${iconClass[iconVariant] || iconClass.danger}`}>
        <Icon size={20} />
      </div>
      <p className="stat-card__value">{value}</p>
      <p className="stat-card__label">{label}</p>
      {sublabel && (
        <p className="stat-card__label" style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>
          {sublabel}
        </p>
      )}
    </div>
  );
};

export default StatCard;
