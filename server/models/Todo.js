const mongoose = require('mongoose');

const TodoSchema = new mongoose.Schema({
  task: String,
  done: {
    type: Boolean,
    default: false,
  },
  createdDate: {
    type: Date,
    default: new Date(+new Date() + 7 * 24 * 60 * 60 * 1000),
  },
  orderIndex: Number,
});

const TodoModel = mongoose.model('todos', TodoSchema);

module.exports = TodoModel;
