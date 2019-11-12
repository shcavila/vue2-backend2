const Badges = require("../models/Badges");

module.exports.findSameCode = function(bcode) {
    return new Promise(function(resolve, reject) {
      console.log("finding in record in org with the code======> " + bcode);
      Badges.findOne({code:bcode
      }).then((doc) => {
        if (doc) {
          console.log(doc.badges)
          console.log(doc.badges.length + " data found........");
          resolve("Taken");
        } else {
          resolve("notTaken");
        }
      }).catch((err) => {
        reject(err);
        console.log(err);
      })
    })
  }
