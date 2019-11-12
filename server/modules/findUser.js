 
const User = require("../models/regUser");


module.exports.findUser = function(username) {
    return new Promise(function (resolve, reject) {
      User.findOne({
        username: username
      })
        .then(doc => {
          if (doc) {
            resolve({data:doc});
          } else {
            resolve({data:"not found"})
          }
        }).catch(err => {
          reject(err);
          console.log(err)
        })
    })
  }