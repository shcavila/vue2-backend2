 
const userBadges = require("../models/userBadges");


module.exports.findBadge = function(userID, badgeID) {
    return new Promise(function (resolve, reject) {
      userBadges.findOne({
        userID: userID,
        badgeID: badgeID
      })
        .then(doc => {
          if (doc) {
            console.log('this is the info')
            console.log(doc)
            resolve({data:doc});
          } else {
            resolve({data:"not found"});
          }
        }).catch(err => {
          reject(err);
          console.log(err)
        })
    })
  }