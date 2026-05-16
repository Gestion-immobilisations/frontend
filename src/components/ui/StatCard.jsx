import React from 'react';

const StatCard = ({ label, value, meta, trend, link }) => (
  <div className="af-stat-card">
    <div className="af-stat-label">{label}</div>
    <div className="af-stat-value">{value}</div>
    {trend && <div className="af-stat-trend">{trend}</div>}
    {meta && !trend && <div className="af-stat-meta">{meta}</div>}
    {link && (
      <div className="af-stat-meta">
        <button
          type="button"
          onClick={link.onClick}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--af-blue)',
            cursor: 'pointer',
            textDecoration: 'underline',
            fontSize: 12,
            padding: 0,
          }}
        >
          {link.label}
        </button>
      </div>
    )}
  </div>
);

export default StatCard;
