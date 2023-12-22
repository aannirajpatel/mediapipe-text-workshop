import { Add, AutoFixHigh, Check, Delete, Edit, ExpandMore } from '@mui/icons-material';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import { Accordion, AccordionActions, AccordionDetails, AccordionSummary, CssBaseline, Dialog, Fab, Input, List, ListItemButton, ListItemText, Paper, Tooltip } from '@mui/material';
import Button from '@mui/material/Button';
import React from 'react';
import { v4 } from 'uuid';
import './App.css';
import { createEmbedder, getCosineSimilarity } from './MediaPipe.ts';
import { useQuery } from '@tanstack/react-query';

interface Task {
  id: string;
  content: string;
  categoryId: number;
}

function App() {
  const { isLoading, isError, error } = useQuery({queryKey: ['embedder'], queryFn: createEmbedder});
  const [todos, setTodos] = React.useState<Task[]>([{ id: v4(), content: 'Example task', categoryId: 0 }]);
  const [categories, setCategories] = React.useState<string[]>(["Unorganized"]);

  const handleDeleteTask = (id: string) => {
    setTodos(todos.filter((todo, index) => todo.id !== id));
  };

  const handleUpdateTask = (id: string, content: string) => {
    setTodos(todos.map((todo, index) => todo.id === id ? { ...todo, content: content } : todo));
  };

  const handleUpdateCategory = (id: string, categoryId: number) => {
    setTodos(todos.map((todo, index) => todo.id === id ? { ...todo, categoryId: categoryId } : todo));
  };

  const handleAddCategory = (category: string) => {
    setCategories([...categories, category]);
  }

  const handleDeleteCategory = (id: number) => {
    if (id === 0) return; // cannot remove unorganized category - it is the default category
    setCategories(categories.filter((_category, index) => index !== id));
  }

  const handleSmartReorganize = () => {
    if(isError) {console.error("MediaPipe Error: ",error);}
    if(isLoading || isError) return;
    const newTodos:Task[] = [];
    todos.forEach((todo) => {
      const maxMatch = { categoryId: 0, similarity: 0 };
      categories.forEach((category, index) => {
        const similarity = getCosineSimilarity(todo.content, category);
        if (similarity > maxMatch.similarity && index !== 0) {
          maxMatch.categoryId = index;
          maxMatch.similarity = similarity;
        }
      });
      // console.log("MAX:",maxMatch.categoryId, categories[maxMatch.categoryId], maxMatch.similarity, todo.content);
      newTodos.push({ ...todo, categoryId: maxMatch.categoryId });
    });
    setTodos(newTodos);
  }

  const tasksByCategory: Task[][] = categories.map((_category, categoryIndex) => todos.filter((todo) => todo.categoryId === categoryIndex));

  const [task, setTask] = React.useState<Task>({ id: v4(), content: '', categoryId: 0 });

  const handleAddTask = () => {
    if (task.content === '') return;
    setTodos([...todos, task]);
    setTask({ id: v4(), content: '', categoryId: 0 });
  }

  const [addCategoryDialogOpen, setAddCategoryDialogOpen] = React.useState(false);

  return (
    <React.Fragment>
      <CssBaseline />
      <div style={{ paddingInline: 32, paddingBottom: 32, display: 'flex', flexDirection: 'column' }}>
        <h1>SmarTodos!</h1>
        <div style={{ display: 'flex', gap: 16, flexDirection: 'column' }}>
          <div style={{ display: 'flex', gap: 16 }}>
            <Input placeholder="Type a todo" fullWidth onChange={(event) => { setTask(t => ({ ...t, content: event.target.value })); }} value={task.content} />
            <Button variant="contained" onClick={handleAddTask}>Create task</Button>
          </div>
          <div>
            <Button variant='contained' startIcon={<Add />} onClick={() => setAddCategoryDialogOpen(true)}>Add category</Button>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', width: '50vw', gap: 16 }}>
              {
                tasksByCategory.map((tasks, index) => {
                  return <Accordion>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <h3>{categories[index]}</h3>
                    </AccordionSummary>
                    {index > 0 && <AccordionActions>
                      <Button variant="contained" color="error" onClick={() => handleDeleteCategory(index)} startIcon={<Delete />}>Delete</Button>
                    </AccordionActions>}
                    <AccordionDetails>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {tasks.map((task) => {
                          return <TaskContainer task={task} handleDeleteTask={handleDeleteTask} handleUpdateTask={handleUpdateTask} categories={categories} handleUpdateCategory={handleUpdateCategory} />
                        })}
                      </div>
                    </AccordionDetails>
                  </Accordion>
                })
              }
            </div>
          </div>
        </div>
        <MagicBtn onClick={handleSmartReorganize} />
      </div>
      <AddCategoryDialog addCategoryDialogOpen={addCategoryDialogOpen} setAddCategoryDialogOpen={setAddCategoryDialogOpen} handleAddCategory={handleAddCategory} />
    </React.Fragment>
  );
}

const TaskContainer = (props: { task: Task, handleDeleteTask: (id: string) => void, handleUpdateTask: (id: string, content: string) => void, categories: string[], handleUpdateCategory: (id: string, categoryId: number) => void }) => {
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
          <Button variant="contained" onClick={() => { props.handleUpdateTask(props.task.id, editedTaskContent); setOpenEditDialog(false) }}>Save</Button>
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
  </div>
};

export default App;

const MagicBtn = ({onClick}: {onClick: ()=>void}) => (
  <div style={{ position: 'fixed', bottom: '20px', right: '20px' }}>
    <Tooltip title="Smart re-organize tasks">
      <Fab color="primary" aria-label="Magic organize" variant="extended" onClick={onClick}>
        <AutoFixHigh />
      </Fab>
    </Tooltip>
  </div>
);
function AddCategoryDialog({ addCategoryDialogOpen, setAddCategoryDialogOpen, handleAddCategory }: { addCategoryDialogOpen: boolean, setAddCategoryDialogOpen: React.Dispatch<React.SetStateAction<boolean>>, handleAddCategory: (category: string) => void }) {
  const [category, setCategory] = React.useState('');
  return <Dialog open={addCategoryDialogOpen} onClose={() => setAddCategoryDialogOpen(false)}>
    <Paper style={{ minWidth: 300, paddingInline: 16, paddingBottom: 16 }}>
      <h3>Add a new category</h3>
      <div style={{ display: 'flex', gap: 8 }}>
        <Input placeholder="Type a category name" fullWidth onChange={(event) => { setCategory(event.target.value); }} value={category} />
        <Button variant="contained" onClick={() => { handleAddCategory(category); setAddCategoryDialogOpen(false); }} startIcon={<Check />}>Done</Button>
      </div>
    </Paper>
  </Dialog>;
}

function CategoryBtn({ setOpenCategoryDialog }: { setOpenCategoryDialog: React.Dispatch<React.SetStateAction<boolean>> }) {
  return (
    <Tooltip title="Update category">
      <Button onClick={() => setOpenCategoryDialog(true)}>
        <AppRegistrationIcon />
      </Button>
    </Tooltip>
  );
}

function EditBtn({ setOpenEditDialog }: { setOpenEditDialog: React.Dispatch<React.SetStateAction<boolean>> }) {
  return (
    <Tooltip title="Edit">
      <Button onClick={() => setOpenEditDialog(true)}>
        <Edit />
      </Button>
    </Tooltip>
  );
}

function DeleteBtn(props: {
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