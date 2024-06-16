import '../styles/App.scss';
import TodoItem from '../components/TodoItem';
import { RecoilRoot, useRecoilState } from 'recoil';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react';
import { createTodo, getTodos } from '../api/todoAPI';
import RetracLogo from "../assets/logo-retrac.png";
import { DndContext, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';

function AppContainer() {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await getTodos();
      setTodos(response);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  const addTodo = async (newTodo) => {
    try {
      const response = await createTodo(newTodo);
      setTodos(prevTodos => [...prevTodos, response]); // Use the response which includes the new todo with id
      return response;
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const handleAddTodo = async () => {
    let dateVal = new Date();
    let statusText = "In Progress";
    let len = todos.length;
    const dataToSend = {
      title: `Todo ${len+1}`,
      date: dateVal,
      status: statusText,
    };

    addTodo(dataToSend);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setTodos((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor)
  );

  return (
    <div className="App">
      <div className='todo-header'>
        <div id='appName'>
          <h3>Todo Planner</h3>
        </div>
        <div id='logo'>
          <img src={RetracLogo} alt="Brand Logo" />
        </div>
      </div>
      <div className='todo-body'>
        <div id='todoList'>
          <DndContext sensors={sensors} onDragEnd={handleDragEnd} modifiers={[restrictToVerticalAxis]}>
            <SortableContext items={todos.map(todo => todo.id)} strategy={verticalListSortingStrategy}>
              {todos.map((todo) => (
                <TodoItem key={todo.id} id={todo.id} description={todo.description} title={todo.title} date={todo.date} status={todo.status} />
              ))}
            </SortableContext>
          </DndContext>
        </div>
        <div id='addTodoRow' onClick={handleAddTodo}>
          <div id='addIcon'></div>
          <div id='clickText'>
            <p>Click here to add</p>
          </div>
        </div>
      </div>
    </div>
  );
}

const App = () => {
  return (
    <RecoilRoot>
      <AppContainer />
    </RecoilRoot>
  );
}

export default App;
