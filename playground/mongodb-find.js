//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

//var obj = new ObjectID();
//console.log(obj)

MongoClient.connect("mongodb://localhost:27017/TodoApp", (err, db) => {
  if(err) {
    return console.log('error connecting to the database server')
  }
  console.log('Connected at 27017');

  //db.collection('Todos').find({completed: false}).toArray()
  db.collection('Users').find({
    name:'george'
  }).toArray()
    .then((docs) => {
      console.log('Users');
      console.log(JSON.stringify(docs, undefined, 2));
    }, (err) => {
      console.log('unable to getch users', err);
    });

  //db.close();
})
