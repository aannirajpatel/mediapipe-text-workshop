import { AutoFixHigh } from '@mui/icons-material';
import { Fab, Tooltip } from '@mui/material';
import React from 'react';

export const MagicBtn = ({ onClick }: { onClick: () => void; }) => (
  <div style={{ position: 'fixed', bottom: '20px', right: '20px' }}>
    <Tooltip title="Smart re-organize tasks">
      <Fab color="primary" aria-label="Magic organize" variant="extended" onClick={onClick}>
        <AutoFixHigh />
      </Fab>
    </Tooltip>
  </div>
);
