import React, { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import '../styles/OffCanvasForm.scss';
import CloseCanvasBtn from '../assets/logout_icon.png';
import DescriptionEditor from './Editor';
import { deleteTodo, updateTodo } from '../api/todoAPI';
import { useRecoilState } from 'recoil';
import { todoState } from '../store/todoStates';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function OffCanvasExample({ text, title, status, date, id, description, onClick, ...props }) {
  const [show, setShow] = useState(false);
  const [todo, setTodo] = useRecoilState(todoState(id));
  const [priorityInput, setPriorityInput] = useState("-");
  const [typingTimeout, setTypingTimeout] = useState(null);

  const handleClose = async (MODE = "UPDATE") => {
    console.log("ID: ", id);
    console.log(todo);
    setShow(false);
    if(MODE === "DELETE"){
      return;
    } else if(MODE === "UPDATE"){
      await updateTodo(id, todo);
    }
  };

  const handleShow = (event) => {
    // event.stopPropagation(); 
    // Prevent drag-and-drop event from interfering
    console.log('Opening Offcanvas:', text);
    setShow(true);
  };

  // const handleClick = async (MODE) => {
  //   try {
  //     const res = await deleteTodo(id);
  //     console.log('Delete response:', res);
  //     handleClose(MODE);
  //   } catch (error) {
  //     console.error('Error deleting todo:', error);
  //   }
  // };

  const handleDateChange = async (date) => {
    const dataToSend = {
      ...todo,
      date,
    }

    const res = await updateTodo(id, dataToSend);
    console.log(res);

    setTodo(prevTodo => ({ ...prevTodo, date }));
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    handleClose();
  };

  const handleInputChange = (e) => {
    
    setPriorityInput(e.target.value);
    if (typingTimeout) {
      clearTimeout(typingTimeout);
      }
      
    const newTypingTimeout = setTimeout(async () => {
      console.log(priorityInput)
    }, 1000);

    setTypingTimeout(newTypingTimeout);
  };

  return (
    <>
      {text === "Details" && (
        <Button onClick={handleShow} className="me-2" id='detailsBtn'>
          {text} ->
        </Button>
      )}
      {text === "Todo" && (
        <Button onClick={handleShow} className="me-2" id='todoBtn'>
          {text}
        </Button>
      )}
      <Offcanvas show={show} onHide={handleClose} {...props} className="offcanvas-form">
        <div className='todo-status-bar'>
          <div id='statusCol'>
            <div id='tickIcon'></div>
            <button type="button" id='statusBtn' onClick={()=> {onClick(); handleClose("DELETE")}}>
              Mark complete
            </button>
          </div>
          <div id='exitCol'>
            <button type="button" id='exitBtn' onClick={handleClose}>
              <img src={CloseCanvasBtn} alt="Close Button" />
            </button>
          </div>
        </div>
        <Offcanvas.Header>
          <Offcanvas.Title>
            <h3>{todo.title}</h3>
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <form id='descriptor-form' onSubmit={handleFormSubmit}>
            <div className='todo-descriptors'>
              <label htmlFor="dueDate">Due Date</label>
              <div>
                <DatePicker
                  selected={todo.date}
                  onChange={handleDateChange}
                  dateFormat="dd-MM-yyyy"
                  id='dueDate'
                  name='dueDate'
                />
              </div>
            </div>
            <div className='todo-descriptors'>
              <label htmlFor="priority">Priority</label>
              <input type="text" name='priorityInput' id='priorityInput' value={priorityInput} onChange={handleInputChange}/>
            </div>
            <div className='todo-descriptors'>
              <label htmlFor="status">Status</label>
              {todo.status === "In Progress" && (<div>To-do</div>)}
              {todo.status === "Completed" && (<div>Completed</div>)}
            </div>
            <div className="todo-descriptors" id='descriptionRow'>
              <label htmlFor="description">Description</label>
              <DescriptionEditor id={id} description={description}></DescriptionEditor>
            </div>
          </form>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

function OffcanvasForm({ text, title, status, date, id, description, onClick }) {
  return (
    <div className='offcanvas-btn'>
      {['end'].map((placement, idx) => (
        <OffCanvasExample key={idx} placement={placement} name={placement} text={text} title={title} status={status} date={date} id={id} description={description} onClick={onClick}/>
      ))}
    </div>
  );
}

export default OffcanvasForm;
