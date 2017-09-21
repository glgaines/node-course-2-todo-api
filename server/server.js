// server.js is just resonsible for routes.
require('./config/config');

const _ = require('lodash')
const {ObjectID} = require('mongodb');
const express = require('express');
const bodyParser = require('body-parser');

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');

const app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
  var todo = new Todo({
    text: req.body.text
  });
  todo.save()
    .then((doc) => {
      res.send(doc);
    }, (e) => {
      res.status(400).send(e);
    })
});

app.get('/todos', (req, res) => {
  Todo.find()
    .then((todos) => {
      res.send({todos});
    }, (e) => {
      res.status(400).send(e)
    })
});

app.get('/todos/:id', (req, res) => {
  var id = req.params.id;
  if(!ObjectID.isValid(id)) {
    console.log("ID is not valid")
    return res.status(404).send();

  }
  //validate id using isValid (mongoose-queries)
    // not valid - respond with 404 - send back empty body
  //findById
      //success
      //if todo - send back
      //if no todo - id not found  404 with empty body
      //Error
        //400 and send empty bldy
  Todo.findById(id)
    .then((todo) => {
      if(!todo) {
        return res.status(404).send();
      }
      res.send({todo});
    }).catch((e) => {
      res.status(400).send();
    })
});

app.delete('/todos/:id', (req, res) => {
  //get id
  var id = req.params.id;
  if(!ObjectID.isValid(id)) {
    console.log("deleting ID is not valid")
    return res.status(404).send();
  }
  //remove todo by id
  Todo.findByIdAndRemove(id)
    .then((todo) => {
      if(!todo) {
        return res.status(404).send();
      }
      res.send({todo})
    }).catch((e) => res.status(400).send());
});

app.patch('/todos/:id', (req, res) => {
  var id = req.params.id;
  var body = _.pick(req.body, ['text', 'completed']);
  if(!ObjectID.isValid(id)) {
    console.log("deleting ID is not valid")
    return res.status(404).send();
  }
  if (_.isBoolean(body.completed) && body.completed){
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findByIdAndUpdate(id,{$set: body}, {new: true})
    .then((todo) => {
      if(!todo) {
        return res.status(404).send();
      }
      res.send({todo});
    }).catch((e) => res.status(400).send())
});

//app.post('/user')

app.listen(3000, () => {
  console.log('Started on port 3000')
});

module.exports = {app};
