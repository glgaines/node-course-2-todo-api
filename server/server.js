// server.js is just resonsible for routes.
const {ObjectID} = require('mongodb');
var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();

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

//app.post('/user')

app.listen(3000, () => {
  console.log('Started on port 3000')
});

module.exports = {app};
