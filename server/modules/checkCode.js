const Badges = require("../models/badges");

module.exports.findSameCode = function(bcode) {
    return new Promise(function(resolve, reject) {
      console.log("finding in record in org with the code======> " + bcode);
      Badges.findOne({code:bcode
      }).then((doc) => {
        if (doc) {
          resolve("Taken");
          console.log(doc)
        } else {
          resolve("notTaken");
        }
      }).catch((err) => {
        reject(err);
        console.log(err);
      })
    })
  }