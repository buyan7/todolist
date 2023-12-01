const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const TodoModel = require('./models/Todo');

const app = express();

app.use(cors());

app.use(express.json());

mongoose.connect('mongodb://127.0.0.1:27017/todolist');

app.get('/get', (req, res) => {
  console.log('getall');
  TodoModel.find()
    .sort('orderIndex')
    .then((result) => res.json(result))
    .catch((err) => {
      console.log(error);
      res.json(err);
    });
});

app.put('/update/:id', (req, res) => {
  const { id } = req.params;
  TodoModel.findById({ _id: id })
    .then((todo) => {
      TodoModel.findByIdAndUpdate({ _id: id }, { done: !todo.done })
        .then((result) => res.json(result))
        .catch((err) => res.json(err));
    })
    .catch((err) => res.json(err));
});

app.post('/editTodo', (req, res) => {
  const todo = req.body.todo;
  TodoModel.findByIdAndUpdate({ _id: todo._id }, { task: todo.task })
    .then((result) => res.json(result))
    .catch((err) => res.json(err));
});

app.put('/changeOrder/:todos', (req, res) => {
  const todos = JSON.parse(req.params.todos);
  todos.forEach((value, index) => {
    TodoModel.findByIdAndUpdate({ _id: value._id }, { orderIndex: value.orderIndex })
      .then((result) => {
        if (index === todos.length - 1) res.json(result);
      })
      .catch((err) => res.json(err));
  });
});

app.delete('/delete/:id', (req, res) => {
  const { id } = req.params;
  TodoModel.findByIdAndDelete({ _id: id })
    .then((result) => res.json(result))
    .catch((err) => res.json(err));
});

app.post('/add', (req, res) => {
  const task = req.body.task;
  const order = req.body.index;

  TodoModel.create({
    task: task,
    orderIndex: order,
  })
    .then((result) => res.json(result))
    .catch((err) => res.json(err));
});

app.listen(3001, () => {
  console.log('Server is Running localhost 3001');
});
