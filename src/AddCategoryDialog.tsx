import { Check } from '@mui/icons-material';
import { Dialog, Input, Paper } from '@mui/material';
import Button from '@mui/material/Button';
import React from 'react';

export function AddCategoryDialog({ addCategoryDialogOpen, setAddCategoryDialogOpen, handleAddCategory }: { addCategoryDialogOpen: boolean; setAddCategoryDialogOpen: React.Dispatch<React.SetStateAction<boolean>>; handleAddCategory: (category: string) => void; }) {
  const [category, setCategory] = React.useState('');
  return <Dialog open={addCategoryDialogOpen} onClose={() => setAddCategoryDialogOpen(false)}>
    <Paper style={{ minWidth: 300, paddingInline: 16, paddingBottom: 16 }}>
      <h3>Add a new category</h3>
      <div style={{ display: 'flex', gap: 8 }}>
        <Input placeholder="Type a category name" fullWidth
          onKeyDown={
            (event) => {
              if (event.key === 'Enter') {
                setCategory('');
                handleAddCategory(category);
              }
            }
          }
          onChange={(event) => {setCategory(event.target.value); }}
          value={category} />
        <Button variant="contained"
          onClick={
            () => {
              if(category === '') return;
              handleAddCategory(category);
              setAddCategoryDialogOpen(false);
            }} startIcon={<Check />}>
          Done
        </Button>
      </div>
    </Paper>
  </Dialog>;
}
