import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import '../styles/OffCanvasForm.scss';
import CloseCanvasBtn from '../assets/logout_icon.png';
import DescriptionEditor from './Editor';
import { deleteTodo } from '../api/todoAPI';
import { useRecoilState } from 'recoil';
import { updateTodo } from '../api/todoAPI';
import { todoState } from '../store/todoStates';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';


function OffCanvasExample({ text, title, status, date, id, description, ...props }) {
  const [show, setShow] = useState(false);
  const [todo, setTodo] = useRecoilState(todoState(id));

  useEffect(() => {
    // Initialize todo state with props
    setTodo({ title, date: new Date(date), status, description });
  }, [title, date, status, description, setTodo]);

  const handleClose = async () => {
    try {
      console.log(todo);
      const response = await updateTodo(id, todo);
      console.log(response);
      setShow(false);
    } catch (error) {
      console.error('Error updating todo:', error);
      if (error.response) {
        console.error('Server responded with status code:', error.response.status);
        console.error('Response data:', error.response.data);
      }
    }
  };

  const handleShow = () => setShow(true);

  const handleClick = async () => {
    console.log(id);
    const res = await deleteTodo(id);
    console.log(res);
    handleClose();
  }

  const handleDateChange = (date) => {
    setTodo(prevTodo => ({ ...prevTodo, date }));
  };

  // const handleDateClick = (event) => {
  //   event.stopPropagation();
  // };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    handleClose();
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
        <Offcanvas.Header>
          <Offcanvas.Title>
            <h3>{title}</h3>
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
                    dateFormat="yyyy-MM-dd"
                    id='dueDate'
                    name='dueDate'
                  />
              </div>
            </div>
            <div className='todo-descriptors'>
              <label htmlFor="priority">Priority</label>
              <div>
                -
              </div>
            </div>
            <div className='todo-descriptors'>
              <label htmlFor="status">Status</label> 
              {status === "In Progress" && (<div >
                To-do
              </div>)}
            </div>
            <div className="todo-descriptors" id='descriptionRow'>
              <label htmlFor="description">Description</label> 
                <DescriptionEditor id={id}></DescriptionEditor>
            </div>
            <div className='todo-status-bar'>
              <div id='statusCol'>
                <div id='tickIcon'>
                </div>
                <button type="button" id='statusBtn' onClick={handleClick}>
                  Mark complete
                </button>
              </div>
              <div id='exitCol'>
                <button type="button" id='exitBtn' onClick={
                  handleClose
                }>
                  <img src={CloseCanvasBtn} alt="Close Button" />
                </button>
              </div> 
            </div>
          </form>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}

function OffcanvasForm({text, title, status, date, id, description}) {
  return (
    <div className='offcanvas-btn'>
      {['end'].map((placement, idx) => (
        <OffCanvasExample key={idx} placement={placement} name={placement} text={text} title={title} status={status} date={date} id={id} description={description} />
      ))}
    </div>
  );
}

export default OffcanvasForm;