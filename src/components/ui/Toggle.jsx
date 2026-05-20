import React from 'react';

const Toggle = ({ checked, onChange, disabled = false, id }) => (
  <label className="af-toggle" htmlFor={id}>
    <input
      type="checkbox"
      id={id}
      checked={checked}
      onChange={(e) => onChange?.(e.target.checked)}
      disabled={disabled}
    />
    <span className="af-toggle__slider" />
  </label>
);

export default Toggle;
