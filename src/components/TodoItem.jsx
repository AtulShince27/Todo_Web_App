import React from 'react'
import '../styles/TodoItem.scss';
import OffCanvasForm from '../components/OffCanvasForm';
import { useState } from 'react';
import { deleteTodo } from '../api/todoAPI';
function TodoItem({ id, title, date, status, description }) {
  const [isHovered, setIsHovered] = useState(false);
  const titleText = title;
  const statusText = status;
  const dateText = date;

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleCompletion = async () => {
    try {
      const response = await deleteTodo(id);
      console.log(response);
    } catch (error) {
      console.error('Error updating todo:', error);
      if (error.response) {
        console.error('Server responded with status code:', error.response.status);
        console.error('Response data:', error.response.data);
      }
    }
  }
  return (
    <div>
        <div className='todo-item' onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          <div>
            <input type="checkbox" name='markComplete' id='markComplete' onClick={handleCompletion}/>
          </div>
          <div>
            <h4>{title}</h4>
          </div>
          <div id="completionStatus">
            {!isHovered && <div id="progressText">
              {status}
            </div>}
            <div>
              {isHovered ? (
                <div id="offcanvasEl">
                  <OffCanvasForm text="Details" title={titleText} status={statusText} date={dateText} id={id} description={description}/>
                  <OffCanvasForm text="Todo" title={titleText} status={statusText} date={dateText} id={id} description={description}/>
                </div>
              ) : (
                <div>
                </div>
              )}
            </div>
          </div>
          <div>
            {date}
          </div>
      </div>
    </div>
  )
}

export default TodoItem