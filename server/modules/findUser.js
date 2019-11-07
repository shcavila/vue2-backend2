 
const User = require("../models/regUser");


module.exports.findUser = function(username) {
    return new Promise(function (resolve, reject) {
      console.log("FINDING IN THE USER COLLECTION")
      User.findOne({
        username: username
      })
        .then(doc => {
          if (doc) {
            console.log("THE USER INFO: " + doc)
            resolve(doc);
          } else {
            resolve("not found")
          }
        }).catch(err => {
          reject(err);
          console.log(err)
        })
    })
  }