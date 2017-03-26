// var MongoClient = require('mongodb').MongoClient,
//   co = require('co'),
//   assert = require('assert');

// export function insertState(state) {
//   co(function*() {
//     // Connection URL
//     var db = yield MongoClient.connect('mongodb://localhost:27017/turingMachine');
//     console.log("Connected correctly to server");

//     // Insert a single document
//     var r = yield db.collection('inserts').insertOne(state);
//     console.log("Insert " + state + " correctly");

//     // Close connection
//     db.close();
//   }).catch(function(err) {
//     console.log(err.stack);
//   });
// }