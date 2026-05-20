import React from 'react';

const StatCard = ({ label, value, meta, trend, icon, className = '' }) => (
  <div className={`af-card af-stat-card ${className}`}>
    <span className="af-stat-card__label">{label}</span>
    <div className="af-stat-card__row">
      <div>
        <div className="af-stat-card__value">{value}</div>
        {meta && <div className="af-stat-card__meta">{meta}</div>}
        {trend && <div className="af-stat-card__trend">{trend}</div>}
      </div>
      {icon && <div className="af-stat-card__icon">{icon}</div>}
    </div>
  </div>
);

export default StatCard;
