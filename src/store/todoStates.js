import { atom } from 'recoil';
import { atomFamily } from 'recoil';
import { selectorFamily } from 'recoil';
import { getTodos } from '../api/todoAPI';

export const todoSelector = selectorFamily({
  key: 'todoSelector',
  get: (id) => async () => {
    const todos = await getTodos();
    return todos.find(todo => todo.id === id) || {
      title: '',
      date: '',
      status: '',
      description: ''
    };
  },
});

export const todoState = atomFamily({
  key: 'todoState',
  default: todoSelector,
});

export const completionSelector = selectorFamily({
  key: "completionSelector",
  get: (id) => async () => {
    const todos = await getTodos();
    return todos.find(todo => todo.id === id) || {
      status: 'In Progress',
    };
  },
})
export const completionStatus = atomFamily({
  key: 'todoState',
  default: completionSelector,
})

