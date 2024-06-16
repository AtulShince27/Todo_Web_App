import React, { useEffect, useState } from 'react';
import '../styles/TodoItem.scss';
import OffCanvasForm from '../components/OffCanvasForm';
import { updateTodo } from '../api/todoAPI';
import ThreeDotImg from '../assets/drag-and-drop.png';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { todoState } from '../store/todoStates';
import { useRecoilState } from 'recoil';

function TodoItem({ id, title, date, status, description }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [todoInput, setTodoInput] = useState(title);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const [todo, setTodo] = useRecoilState(todoState(id));
  const [todoStatus, setTodoStatus] = useState(status);

  useEffect(() => {
    setTodoStatus(status);
    setTodoInput(title);
    setTodo({
      title,
      date: new Date(date),
      status,
      description,
    });
  }, [date, description, setTodo, status, title]);

  useEffect(() => {
    return () => {
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
    };
  }, [typingTimeout]);

  const handleInputChange = (e) => {
    setTodoInput(e.target.value);

    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    const newTypingTimeout = setTimeout(async () => {
      setTodo(prevTodo => ({
        ...todo,
        title: e.target.value,
      }));

      const dataToSend = {
        title: e.target.value,
        description,
        status,
        date,
      };
      console.log(dataToSend);
      try{
        const res = await updateTodo(id, dataToSend);
        console.log(res);
      } catch(error){
        console.error("Bad Request: ", error);
        return
      }

    }, 1000);

    setTypingTimeout(newTypingTimeout);
  };

  const currDate = new Date(todo.date);
  const day = currDate.getDate();
  const month = currDate.getMonth() + 1;
  const year = currDate.getFullYear();

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
    cursor: isDragging ? 'grabbing' : 'grab',
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleCompletion = async (ev) => {
    // ev.stopPropagation();
    try {
      const newStatus = todo.status === "Completed" ? "In Progress" : "Completed";

      setTodo(prevTodo => ({
        ...prevTodo,
        status: newStatus,
      }));

      setTodoStatus(newStatus);

      const dataToSend = {
        ...todo,
        status: newStatus,
      };

      const response = await updateTodo(id, dataToSend);
      console.log(response);

    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const handleDragStart = (event) => {
    if (event.target === event.currentTarget.querySelector('#dragDropImg')) {
      setIsDragging(true);
    } else {
      event.preventDefault();
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return (
    <div style={style} {...attributes} ref={setNodeRef}>
      <div className='todo-item' onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div>
          {isHovered && (
            <img src={ThreeDotImg} alt="Three Dot" id='dragDropImg' {...listeners} onDragStart={handleDragStart} onDragEnd={handleDragEnd}/>
          )}
        </div>
        <div>
          <input type="checkbox" name='markComplete' id='markComplete' onChange={handleCompletion} checked={todoStatus==="Completed"} />
        </div>
        <div id='inlineEditCol'>
          <input type="text" name='listItemEdit' id='listItemEdit' value={todoInput} onChange={handleInputChange}/>
        </div>
        <div id="completionStatus">
          {!isHovered && <div id="progressText">{todoStatus}</div>}
          {isHovered && (
            <div id="offcanvasEl">
              <OffCanvasForm text="Details" title={title} status={status} date={date} id={id} description={description} onClick={handleCompletion}/>
              <OffCanvasForm text="Todo" title={title} status={status} date={date} id={id} description={description} onClick={handleCompletion}/>
            </div>
          )}
        </div>
        <div>{day}-{month}-{year}</div>
      </div>
    </div>
  );
}

export default TodoItem;
