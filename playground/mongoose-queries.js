const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

var id = '59c1a2dfd2fb6b2058a06876';
var userId = '59c05529339e7b36b8f06119';

if (!ObjectID.isValid(id)) {
  console.log('id is not valid')
}

Todo.find({
  _id: id
}).then((todos) => {
  console.log('Todos', todos)
});

Todo.findOne({
  _id: id
}).then((todo) => {
  console.log('Todo', todo)
});

Todo.findById(id).then((todo) => {
  if(!todo) {
    return console.log('id not found')
  }
  console.log('TodoBy Id', todo)
}).catch((e) => console.log(e));

User.findById(userId)
  .then((user) =>{
    if(!user) {
      return console.log('user not found')
    }
    console.log('User id is ', user)
  }).catch((e) => console.log(e));
