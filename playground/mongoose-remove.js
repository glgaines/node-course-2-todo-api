const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// Todo.remove({})  -- this will remove everything....
//Todo.findOneAndRemove  -- gives the doc back
//Todo.findByIdAndRemove()  -- gives the doc back

Todo.findByIdAndRemove('59c2aabbed9c803c4040b8a6')
  .then((todo) => {
    console.log(todo)

  });
