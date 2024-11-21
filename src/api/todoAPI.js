import axios from 'axios';

const api = axios.create({
  // baseURL: 'http://localhost:8080/', // Updated port
  baseURL: 'http://3.81.134.14:8080',
});

// The rest of your API methods remain the same
export const getTodos = async () => {
  const response = await api.get('/todos');
  return response.data;
};

export const createTodo = async (todo) => {
  try {
    const response = await api.post('/todos', todo);
    return response.data;
  } catch (error) {
    console.error('Error creating todo:', error);
    throw error;
  }
};

export const updateTodo = async (id, todo) => {
  try {
    console.log(id, todo);
    const response = await api.patch(`/todos/${id}`, todo); // Use api.patch instead of axios.patch
    return response.data;
  } catch (error) {
    console.error('Error updating todo:', error);
    throw error;
  }
};

export const deleteTodo = async (id) => {
  try {
    const response = await api.delete(`/todos/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting todo:', error);
    throw error;
  }
};
