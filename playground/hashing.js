const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var password = '123abc!';
var hashed
//bcrypt stuff
bcrypt.genSalt(10, (err, salt) => {
//  var hash;
  bcrypt.hash(password, salt, (err, hash) => {
    console.log(hash)
    hashed = hash
  })

});
setTimeout(() => console.log(hashed), 1000);

setTimeout(
 () => bcrypt.compare(password, hashed, (err, result) => {
   console.log(result)

 }), 2000)

/***SHA 256 testing *********/
// const message = 'I am user number 3';
// var hash = SHA256(message).toString();
//
// console.log(`Message: ${message}
//   hash: ${hash}`);
//
// var data = {
//   id: 4
// }
// var token = {
//   data,
//   hash: SHA256(JSON.stringify(data) +'somesecret').toString()
// }

// bad guy in the middle changes the id and hash...
//token.data.id = 5
//token.hash = SHA256(JSON.stringify(token.data)).toString();

// var resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString()
// if(resultHash === token.hash){
//     console.log('data not changed')
// }else {
//   console.log("bad hash")
// }

/***********jwt stuff***********/
// const data_jwt = {
//   id: 10
// }
//
// var token_jwt = jwt.sign(data_jwt, 'mySalt123');
// console.log('token', token_jwt)
//
// var decoded = jwt.verify(token_jwt, 'mySalt123')
// console.log('decoded', decoded)
