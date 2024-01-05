import { Delete } from '@mui/icons-material';
import { Tooltip } from '@mui/material';
import Button from '@mui/material/Button';
import React from 'react';
import { Task } from './App.tsx';

export function DeleteBtn(props: {
  task: Task;
  handleDeleteTask: (id: string) => void;
  handleUpdateTask: (id: string, content: string) => void;
  categories: string[];
  handleUpdateCategory: (id: string, categoryId: number) => void;
}) {
  return (
    <Tooltip title="Delete">
      <Button onClick={() => { props.handleDeleteTask(props.task.id); }}>
        <Delete />
      </Button>
    </Tooltip>
  );
}
