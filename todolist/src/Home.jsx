import React, { useState, useEffect, useRef } from 'react';
import Create from './Create';
import axios from 'axios';
import { BsCircleFill, BsFillCheckCircleFill } from 'react-icons/bs';
import { FaRegListAlt } from 'react-icons/fa';
import { CiTrash } from 'react-icons/ci';
import { LuPencil } from 'react-icons/lu';
import { AiTwotoneDelete } from 'react-icons/ai';

function Home() {
  const [todos, setTodos] = useState([]);
  const dragItem = useRef(null);
  const dragOverItem = useRef(null);
  const [edit, setEdit] = useState();

  const fetchData = () => {
    axios
      .get('http://localhost:3001/get')
      .then((result) => setTodos(result.data))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchData();
  }, [edit]);

  const handleConfirm = (id) => {
    axios
      .put('http://localhost:3001/update/' + id)
      .then((result) => fetchData())
      .catch((err) => console.log(err));
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete?')) {
      axios
        .delete('http://localhost:3001/delete/' + id)
        .then((result) => fetchData())
        .catch((err) => console.log(err));
    }
  };
  const handleEdit = (todo) => {
    axios
      .post('http://localhost:3001/editTodo/', { todo })
      .then((result) => setEdit(null))
      .catch((err) => console.log(err));
  };

  const handleSort = () => {
    axios
      .put(
        'http://localhost:3001/changeOrder/' +
          JSON.stringify([
            { _id: dragItem.current.id, orderIndex: dragOverItem.current.orderIndex },
            { _id: dragOverItem.current.id, orderIndex: dragItem.current.orderIndex },
          ])
      )
      .then((result) => {
        dragItem.current = null;
        dragOverItem.current = null;
        fetchData();
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className='flex flex-col items-center w-screen h-screen bg-gradient-to-tr from-fuchsia-300 to-sky-500 '>
      <div className='w-3/4  bg-sky-100  shadow-md rounded px-12 py-10 mt-24 pb-20 min-h-fit '>
        <div className='flex justify-between items-center py-4 w-full'>
          <div className='flex'>
            <FaRegListAlt className='text-pink-600 text-4xl mr-2' />
            <h2 className='tracking-wide text-3xl text-gray-900'>Todo List</h2>
          </div>
        </div>
        <Create listIndex={todos.length} />
        {todos.length === 0 ? (
          <div className='py-4'>No Record</div>
        ) : (
          <div>
            {todos.map((todo, index) => (
              <div
                key={index}
                className='flex w-full p-2  text-sm shadow-sm cursor-move items-center'
                draggable
                onDragStart={(e) => (dragItem.current = { id: todo._id, orderIndex: todo.orderIndex })}
                onDragEnter={(e) => (dragOverItem.current = { id: todo._id, orderIndex: todo.orderIndex })}
                onDragEnd={handleSort}
                onDragOver={(e) => e.preventDefault()}
              >
                <div className='w-1/12 p-1'>
                  {todo.done ? (
                    <i>
                      <BsFillCheckCircleFill
                        className='text-pink-600 text-xl mr-4 cursor-pointer'
                        onClick={() => handleConfirm(todo._id)}
                      />
                    </i>
                  ) : (
                    <i>
                      <BsCircleFill
                        className='text-pink-600 text-xl mr-4 cursor-pointer'
                        onClick={() => handleConfirm(todo._id)}
                      />
                    </i>
                  )}
                </div>
                <div className='w-9/12 p-3'>
                  {edit === todo._id ? (
                    <textarea
                      className='p-1 border border-gray-300  text-sm shadow-sm w-full rounded-md bg-transparent'
                      value={todo.task}
                      onChange={(e) => {
                        let temp = todos;
                        temp[index].task = e.target.value;
                        setTodos([...temp]);
                      }}
                      onBlur={() => handleEdit(todo)}
                    />
                  ) : (
                    <p className={todo.done ? 'line-through' : ''}>{todo.task}</p>
                  )}
                </div>
                <div className='flex w-2/12 justify-end'>
                  {!todo.done ? (
                    <LuPencil
                      className='text-green-500 text-3xl p-1  cursor-pointer'
                      onClick={() => setEdit(todo._id)}
                    />
                  ) : null}
                  <AiTwotoneDelete
                    className='text-red-600 text-3xl p-1 cursor-pointer  '
                    onClick={() => handleDelete(todo._id)}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
