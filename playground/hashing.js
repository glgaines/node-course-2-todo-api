const {SHA256} = require('crypto-js');

const jwt = require('jsonwebtoken');

/***SHA 256 testing *********/
const message = 'I am user number 3';
var hash = SHA256(message).toString();

console.log(`Message: ${message}
  hash: ${hash}`);

var data = {
  id: 4
}
var token = {
  data,
  hash: SHA256(JSON.stringify(data) +'somesecret').toString()
}

// bad guy in the middle changes the id and hash...
//token.data.id = 5
//token.hash = SHA256(JSON.stringify(token.data)).toString();

var resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString()
if(resultHash === token.hash){
    console.log('data not changed')
}else {
  console.log("bad hash")
}

/***********jwt stuff***********/
const data_jwt = {
  id: 10
}

var token_jwt = jwt.sign(data_jwt, 'mySalt123');
console.log('token', token_jwt)

var decoded = jwt.verify(token_jwt, 'mySalt123')
console.log('decoded', decoded)
