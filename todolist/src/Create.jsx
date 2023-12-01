import React, { useState } from 'react';
import axios from 'axios';

function Create({ listIndex }) {
  const [task, setTask] = useState('');
  const handleAdd = () => {
    if (task === '') alert('write task please');
    else
      axios
        .post('http://localhost:3001/add', { task: task, index: listIndex + 1 })
        .then((response) => location.reload())
        .catch((err) => console.log(err));
  };

  return (
    <div className='flex pb-5'>
      <textarea
        className='w-full p-1 border border-gray-300  text-sm shadow-sm placeholder-gray-400'
        type='text'
        placeholder='Enter Task'
        onChange={(e) => setTask(e.target.value)}
      />
      <button
        className='bg-green-600  rounded-sm text-center px-3 shadow-lg bg-gradient-to-r from-pink-600 to-red-600 font-bold text-3xl text-gray-100 block transition duration-300'
        type='button'
        onClick={handleAdd}
      >
        +
      </button>
    </div>
  );
}

export default Create;
