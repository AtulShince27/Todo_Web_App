import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import '../styles/DescriptionEditor.scss';
import { useRef } from 'react';
import { useRecoilState } from 'recoil';
import { todoState } from '../store/todoStates';

const DescriptionEditor = ({id}) => {
  const [todo, setTodo] = useRecoilState(todoState(id));
  const quillRef = useRef(null);

  const handleChange = (html) => {
    setTodo(prevTodo => ({
      ...prevTodo,
      description: html
    }));
  };


  useEffect(() => {
    // Access the Quill instance directly if needed
    if (quillRef.current) {
      const quillInstance = quillRef.current.getEditor();
      // You can now use the quillInstance for additional customization or manipulation
    }
  }, []);

  return (
    <div className="description-editor">
      <ReactQuill 
        ref = {quillRef}
        value={todo.description}
        onChange={handleChange}
        modules={DescriptionEditor.modules}
        formats={DescriptionEditor.formats}
        placeholder="Enter the description..."
      />
    </div>
  );
};

DescriptionEditor.modules = {
  toolbar: [
    [{ header: [1, 2, false] }, { 'font': [] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
    ['link', 'image'],
    ['clean']
  ],
};

DescriptionEditor.formats = [
  'header', 'font', 'size',
  'bold', 'italic', 'underline', 'strike',
  'list', 'bullet', 'indent',
  'link', 'image'
];

export default DescriptionEditor;
