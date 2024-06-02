import '../styles/App.scss';
import TodoItem  from '../components/TodoItem';
import { isModalVisible } from '../store/todoStates';
import { RecoilRoot, useRecoilState } from 'recoil';
import '../../node_modules/bootstrap/dist/css/bootstrap.min.css';
import CustomModal from '../components/Modal';
import React, { useEffect, useState } from 'react';
import { getTodos } from '../api/todoAPI';

function AppContainer() {

  const [modalVisibility, setModalVisibility] = useRecoilState(isModalVisible);
  const [todos, setTodos] = useState([]);

  useEffect(()=>{
    fetchTodos();
  })
  const fetchTodos = async () => {
    try {
      const response = await getTodos();
      setTodos(response);
    } catch (error) {
      console.error('Error fetching todos:', error);
      // Handle error if fetching todos fails
    }
  };

  const addTodo = async (newTodo) => {
    try {
      // After adding a new todo, fetch updated todos
      setTodos(prevTodos => [...prevTodos, newTodo]);

    } catch (error) {
      console.error('Error adding todo:', error);
      // Handle error if adding todo fails
    }
  };

  const createTodoModal = async () => {
    setModalVisibility(true);
  }


  return (
    <div className="App">
      {/* Conditional Rendering of the Modal */}
      
      {modalVisibility && <CustomModal addTodo={addTodo} closeModal={()=> setModalVisibility(false)}/>}
    

      <div className='todo-header'>
        <div id='appName'>
          <h1>Todo Planner</h1>
        </div>
        <div id='logo'>
          <h1>Reci</h1>
        </div>
      </div>
      <div className='todo-body'>
      <div id='todoList'>
          {todos.map((todo, index) => (
            <TodoItem key={index} title={todo.title} date={todo.date} status={todo.status} id={todo.id}/>
          ))}
        </div>
      {/* On Click Change the Modal Visibility */}
        <div id='addTodoRow' onClick={createTodoModal}>
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
    <>
      <RecoilRoot>
          <AppContainer />    
      </RecoilRoot>
    </>
  )
}
export default App;
