import React from 'react';

const PageHeader = ({ title, subtitle, actions, children }) => (
  <div className="af-page-header">
    <div>
      <h1>{title}</h1>
      {subtitle && <p>{subtitle}</p>}
      {children}
    </div>
    {actions && <div className="af-page-actions">{actions}</div>}
  </div>
);

export default PageHeader;
