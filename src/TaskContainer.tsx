import { Dialog, Input, List, ListItemButton, ListItemText, Paper } from '@mui/material';
import Button from '@mui/material/Button';
import React from 'react';
import { CategoryBtn } from './CategoryBtn.tsx';
import { EditBtn } from './EditBtn.tsx';
import { DeleteBtn } from './DeleteBtn.tsx';
import { Task } from './App.tsx';

export const TaskContainer = (props: { task: Task; handleDeleteTask: (id: string) => void; handleUpdateTask: (id: string, content: string) => void; categories: string[]; handleUpdateCategory: (id: string, categoryId: number) => void; }) => {
  const [openEditDialog, setOpenEditDialog] = React.useState(false);
  const [openCategoryDialog, setOpenCategoryDialog] = React.useState(false);
  const [editedTaskContent, setEditedTaskContent] = React.useState(props.task.content);
  return <div style={{ display: 'flex', gap: 16, background: '#eee', padding: 16, borderRadius: 8 }}>
    <p>{props.task.content}</p>
    <DeleteBtn {...props} />
    <EditBtn setOpenEditDialog={setOpenEditDialog} />
    <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
      <Paper style={{ minWidth: 300, paddingInline: 16, paddingBottom: 16 }}>
        <h3>Edit todo</h3>
        <div style={{ display: 'flex', gap: 8 }}>
          <Input placeholder="Replace this todo with a fresh one" fullWidth value={editedTaskContent} onChange={(event) => setEditedTaskContent(event.target.value)} />
          <Button variant="contained" onClick={() => { props.handleUpdateTask(props.task.id, editedTaskContent); setOpenEditDialog(false); }}>Save</Button>
        </div>
      </Paper>
    </Dialog>
    <CategoryBtn setOpenCategoryDialog={setOpenCategoryDialog} />
    <Dialog open={openCategoryDialog} onClose={() => setOpenCategoryDialog(false)}>
      <Paper style={{ minWidth: 300, paddingInline: 16 }}>
        <h3>Update the category for your task</h3>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <List>
            {props.categories.map((category, index) => {
              return (
                <ListItemButton key={index} onClick={() => {
                  props.handleUpdateCategory(props.task.id, index);
                  setOpenCategoryDialog(false);
                }}>
                  <ListItemText primary={category} />
                </ListItemButton>
              );
            })}
          </List>
        </div>
      </Paper>
    </Dialog>
  </div>;
};
