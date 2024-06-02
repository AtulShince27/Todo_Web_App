import { atom } from 'recoil';
import { atomFamily } from 'recoil';

export const todoState = atomFamily({
  key: 'todoState',
  default: {
    title: '',
    date: '',
    status: '',
    description: ''
  }
});

export const isModalVisible = atom({
    key: "isModalVisibleAtom",
    default: false,
})
