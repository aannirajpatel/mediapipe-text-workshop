import { Edit } from '@mui/icons-material';
import { Tooltip } from '@mui/material';
import Button from '@mui/material/Button';
import React from 'react';

export function EditBtn({ setOpenEditDialog }: { setOpenEditDialog: React.Dispatch<React.SetStateAction<boolean>>; }) {
  return (
    <Tooltip title="Edit">
      <Button onClick={() => setOpenEditDialog(true)}>
        <Edit />
      </Button>
    </Tooltip>
  );
}
