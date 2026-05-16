import React from 'react';

const PageHeader = ({ title, subtitle, actions }) => (
  <div className="af-page-header">
    <div>
      <h1 className="af-page-title">{title}</h1>
      {subtitle && <p className="af-page-subtitle">{subtitle}</p>}
    </div>
    {actions && <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>{actions}</div>}
  </div>
);

export default PageHeader;

