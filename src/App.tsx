import { Add, Delete, ExpandMore } from '@mui/icons-material';
import { Accordion, AccordionActions, AccordionDetails, AccordionSummary, CssBaseline, Input } from '@mui/material';
import Button from '@mui/material/Button';
import React from 'react';
import { v4 } from 'uuid';
import './App.css';
import { createEmbedder, getCosineSimilarity } from './MediaPipe.ts';
import { useQuery } from '@tanstack/react-query';
import { MagicBtn } from './MagicBtn.tsx';
import { AddCategoryDialog } from './AddCategoryDialog.tsx';
import { TaskContainer } from './TaskContainer.tsx';

export interface Task {
  id: string;
  content: string;
  categoryId: number;
}

function App() {
  // This query is used to load the MediaPipe embedder. It is a one-time operation.
  const { isLoading, isError, error } = useQuery({
    queryKey: ['loadMediaPipeEmbedder'],
    queryFn: createEmbedder
  });

  // Declare state variables used to store the tasks and categories.
  const [todos, setTodos] = React.useState<Task[]>([{ id: v4(), content: 'Example task', categoryId: 0 }]);
  const [categories, setCategories] = React.useState<string[]>(["Unorganized"]);
  // A 2D array of tasks, where the first dimension is the category index.
  // tasksByCategory[0] is always the list of tasks in the first category, "Unorganized"
  const tasksByCategory: Task[][] = categories.map((_category, categoryIndex) => todos.filter((todo) => todo.categoryId === categoryIndex));

  const [todo, setTodo] = React.useState<Task>({ id: v4(), content: '', categoryId: 0 }); // holds the current task being created
  const [addCategoryDialogOpen, setAddCategoryDialogOpen] = React.useState(false);

  // These are functions that are used to update the tasks and categories.
  const handleAddTask = () => {
    if (todo.content === '') return;
    setTodos([...todos, todo]);
    setTodo({ id: v4(), content: '', categoryId: 0 });
  }

  const handleUpdateTask = (id: string, content: string) => {
    setTodos(todos.map((todo) => todo.id === id ? { ...todo, content: content } : todo));
  };

  const handleDeleteTask = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const handleAddCategory = (category: string) => {
    // if the category already exists, do not add it
    for (let i = 0; i < categories.length; i++) {
      if (categories[i] === category) return;
    }
    setCategories([...categories, category]);
  }

  const handleUpdateCategory = (id: string, categoryId: number) => {
    setTodos(todos.map((todo, index) => todo.id === id ? { ...todo, categoryId: categoryId } : todo));
  };

  const handleDeleteCategory = (id: number) => {
    if (id === 0) return; // cannot remove unorganized category - it is the default category
    setCategories(categories.filter((_category, index) => index !== id));
  }

  /**
   * Utility function that is used to reorganize the tasks based on their similarity to the categories.
   * This function is called when the user clicks on the magic button.
   * @returns void
   */
  const handleSmartReorganize = () => {
    if (isError) { console.error("MediaPipe Error: ", error); }
    if (isLoading || isError) return;
    const newTodos: Task[] = [];
    todos.forEach((todo) => { // find the best matching category for each task
      const bestMatch = { categoryId: 0, similarity: 0 };
      categories.forEach((category, index) => {
        const similarity = getCosineSimilarity(todo.content, category);
        if (similarity > bestMatch.similarity && index !== 0) {
          bestMatch.categoryId = index;
          bestMatch.similarity = similarity;
        }
      });
      newTodos.push({ ...todo, categoryId: bestMatch.categoryId });
    });
    setTodos(newTodos);
  }

  return (
    <React.Fragment>
      <CssBaseline />
      <div style={{ paddingInline: 32, paddingBottom: 32, display: 'flex', flexDirection: 'column' }}>
        <h1>SmarTodos!</h1>
        <div style={{ display: 'flex', gap: 16, flexDirection: 'column' }}>
          <div style={{ display: 'flex', gap: 16 }}>
            <Input // input field for creating a new task
              placeholder="Type a todo"
              fullWidth
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  handleAddTask();
                }
              }}
              onChange={(event) => {
                setTodo((t) => ({ ...t, content: event.target.value }));
              }}
              value={todo.content}
            />
            <Button variant="contained" onClick={handleAddTask}>Create task</Button>
          </div>
          <div>
            <Button variant='contained' startIcon={<Add />} onClick={() => setAddCategoryDialogOpen(true)}>Add category</Button>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', width: '50vw', gap: 16 }}>
              {
                tasksByCategory.map((tasks, index) => { // for each category, show a list of tasks in an accordion
                  return <Accordion key={`category-accordion-${index}`}>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                      <h3>{categories[index]}</h3>
                    </AccordionSummary>
                    { // for all categories except the "Unorganized" category, show a delete button
                      index > 0 &&
                      <AccordionActions>
                        <Button variant="contained" color="error" onClick={() => handleDeleteCategory(index)} startIcon={<Delete />}>Delete</Button>
                      </AccordionActions>
                    }
                    <AccordionDetails>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        {tasks.map((task) => { // for each task, render a TaskContainer
                          return <TaskContainer key={task.id} task={task} handleDeleteTask={handleDeleteTask} handleUpdateTask={handleUpdateTask} categories={categories} handleUpdateCategory={handleUpdateCategory} />
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

export default App;