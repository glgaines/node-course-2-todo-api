//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

//var obj = new ObjectID();
//console.log(obj)

MongoClient.connect("mongodb://localhost:27017/TodoApp", (err, db) => {
  if(err) {
    return console.log('error connecting to the database server')
  }
  console.log('Connected at 27017');

//deleteMany
  // db.collection('Todos')
  //   .deleteMany({text: 'eat lunch'})
  //   .then((result) => console.log(result))

  //deleteOne
  // db.collection('Todos')
  //   .deleteOne({text: 'walk the dog'})
  //   .then((result) => console.log(result))

  //findOneAndDelete
  db.collection('Todos')
    .findOneAndDelete({text: 'walk the dog'})
    .then((result) => console.log(result))

  //db.close();
})
