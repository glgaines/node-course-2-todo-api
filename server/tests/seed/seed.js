const {ObjectID} = require('mongodb');
const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');
const jwt = require('jsonwebtoken');

const userOneId =  new ObjectID();
const userTwoId = new ObjectID();
const users = [{
  _id: userOneId,
  email: 'andrew@example.com',
  password: 'userOnePass',
  tokens: [{
    access: 'auth',
    token: jwt.sign({ _id: userOneId, access: 'auth'}, 'abc123').toString()
  }]
},{
  _id: userTwoId,
  email: 'jen@example.com',
  password: 'userTwoPass'
}];

const todos = [{
  _id: new ObjectID(),
  text:'first test todo'
}, {
  _id: new ObjectID(),
  text:' second text todo',
  completed: true,
  completedAt: 4444
}];

const populateTodos = (done) => {
  Todo.remove({})
    .then(() => {
      Todo.insertMany(todos)  // primes the database with the two todos above
    }).then(() => done());
};

const populateUsers = (done) => {
  User.remove({}).then(() => {
    var userOne = new User(users[0]).save();
    var userTwo = new User(users[1]).save();
    //need to wait for save actions to complete
    return Promise.all([userOne, userTwo])
  }).then(() => done());
};

module.exports = {todos, populateTodos, populateUsers, users}
