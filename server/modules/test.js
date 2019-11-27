 
const User = require("../models/regUser");


module.exports.findUser = function(username,porjection) {
    return new Promise(function (resolve, reject) {
      User.findOne({
        username: username
      },porjection)
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