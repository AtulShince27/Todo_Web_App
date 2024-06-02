import React from 'react'
import '../styles/Modal.scss';
import { useRecoilState } from 'recoil';
import { useState, useEffect } from 'react';
import { isModalVisible } from '../store/todoStates';
import { createTodo } from '../api/todoAPI';

function CustomModal({ addTodo, closeModal }) {

  const [isVisible, setVisibility] = useRecoilState(isModalVisible);
  const [cancelClicked, setCancelClicked] = useState(false);

  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [status, setStatus] = useState('In Progress');

  const cancelBtnHandler = ()=>{
    setCancelClicked(true);
    console.log("Cancelled: ", cancelClicked);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    // Convert date to ISO string with time set to 00:00:00.000Z
    // const isoDateString = new Date(date).toISOString().split('T')[0] + 'T00:00:00.000Z';

    console.log(date, typeof(date));
    const newTodo = { title, date, status };
    addTodo(newTodo);
    const dataToSend = {
      title,
      status,
      date,
    }
    const response = await createTodo(dataToSend);
    console.log(response);
    closeModal()
  };

  useEffect(()=>{
    if(cancelClicked === true){
      setVisibility(false);
    }
  }, [cancelClicked, setVisibility])
  console.log(isVisible);
  return (
    <div className='modal'>
      <div className="modal-form">
        <h3>What's on your mind?</h3>
        <form onSubmit={handleSubmit}>
          <label htmlFor="todoItem">What do you wish to do?</label> <br />
          <input type="text" name='todoItem' id='todoItem' value={title} onChange={(e) => setTitle(e.target.value)}/> <br /><br />

          <label>
            Due Date:
          </label> <br />
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} /> <br /><br />

          <label>
            Status:
          </label>
          <br />
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
          <br /><br />
          <div className="btn-container">
            <div id="submitBtnCol">
              <button id='submitBtn' type='submit'>Submit</button>
            </div>
            <div id="cancelBtnCol">
              <button id='cancelBtn' onClick={cancelBtnHandler}>Cancel</button>
            </div>
          </div>
        </form>
        </div>
    </div>
  )
}

export default CustomModal
