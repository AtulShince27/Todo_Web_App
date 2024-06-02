import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080', // Updated port
});

// The rest of your API methods remain the same
export const getTodos = async () => {
  const response = await api.get('/todos');
  return response.data;
};

export const createTodo = async (todo) => {
  const response = await api.post('/todos', todo);
  return response.data;
};

export const updateTodo = async (id, todo) => {
  const response = await api.patch(`/todos/${id}`, todo);
  return response.data;
};

export const deleteTodo = async (id) => {
  const response = await api.delete(`/todos/${id}`);
  return response.data;
};
