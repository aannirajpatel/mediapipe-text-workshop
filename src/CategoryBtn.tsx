import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import { Tooltip } from '@mui/material';
import Button from '@mui/material/Button';
import React from 'react';

export function CategoryBtn({ setOpenCategoryDialog }: { setOpenCategoryDialog: React.Dispatch<React.SetStateAction<boolean>>; }) {
  return (
    <Tooltip title="Update category">
      <Button onClick={() => setOpenCategoryDialog(true)}>
        <AppRegistrationIcon />
      </Button>
    </Tooltip>
  );
}
