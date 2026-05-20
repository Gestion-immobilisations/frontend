import React from 'react';
import AddIcon from '@mui/icons-material/Add';

const Fab = ({ onClick, ariaLabel = 'Action rapide' }) => (
  <button type="button" className="af-fab" onClick={onClick} aria-label={ariaLabel}>
    <AddIcon />
  </button>
);

export default Fab;
