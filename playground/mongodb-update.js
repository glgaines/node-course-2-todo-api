//const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

//var obj = new ObjectID();
//console.log(obj)

MongoClient.connect("mongodb://localhost:27017/TodoApp", (err, db) => {
  if(err) {
    return console.log('error connecting to the database server')
  }
  console.log('Connected at 27017');

  // db.collection('Todos')
  //   .findOneAndUpdate({_id: new ObjectID("59b961cc42fb1a5fc4fd9ac9")},
  //   {
  //     $set: {
  //       completed: true
  //     }
  //   }, {
  //     returnOriginal:false
  //   }
  // ).then((result) => console.log(result))

  db.collection('Users').findOneAndUpdate({
    _id: new ObjectID('59b99904b3b4d553443cdb7e')
  }, {
    $set:{
      name:'gregory'
    },
    $inc: {
      age:1
    }

  }, {
    returnOriginal: false
  }).then((result) => console.log(result))


  //db.close();
})
