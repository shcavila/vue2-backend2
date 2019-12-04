const jwt = require('jsonwebtoken');
const config = require('../routes/config');


function SaveNewUser(Model) {
  return new Promise((resolve, reject) => {
    Model.save()
      .then(() => {
        var token = jwt.sign({
          username: Model.username,
          _id: Model._id,
          type: Model.type
        }, config.secret, {
          expiresIn: 86400
        });
        resolve({
          auth: true,
          token: token
        });
      }).catch(err => {
       reject(err);
      });
  });
}

module.exports = {
  SaveNewUser
};