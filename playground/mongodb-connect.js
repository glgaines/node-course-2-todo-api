//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

//var obj = new ObjectID();
//console.log(obj)

MongoClient.connect("mongodb://localhost:27017/TodoApp", (err, db) => {
  if(err) {
    return console.log('error connecting to the database server')
  }
  console.log('Connected at 27017');

  db.collection('Users').insertOne({
    name:'george',
    age: 59,
    location: 'Boxford, ma.'
  }, (err, result)=> {
    if(err) {
      return console.log('unabel to connect', err)
    }
    console.log(JSON.stringify(result.ops[0]._id.getTimestamp(), undefined, 2))
  })

// db.collection('Todos').insertOne({
//   text:'Something to do',
//   completed:false
// }, (err, result) => {
//   if(err) {
//     return console.log('unable to insert', err)
//   }
//   console.log(JSON.stringify(result.ops, undefined, 2))
// })

  db.close();
})
