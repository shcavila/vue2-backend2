const Organization = require("../models/organization");
const user = require('./findUser');


module.exports.findOrg = async function (username) {
  try {
    var status = await user.findUser(username);
    return new Promise(function (resolve, reject) {
      if (status.data == "not found") {
        Organization.findOne({
          username: username
        })
          .then(doc => {
            if (doc) {
              resolve({data:doc});
            } else {
              resolve("not found" );
            }
          }).catch(err => {
            reject(err);
            console.log(err);
          });
      } else {
        resolve( status );
      }
    });
  } catch (err) {
    console.log(err)
    console.log("Unexpected error occured!!!");
  }
};