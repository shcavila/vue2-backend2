const jwt = require('jsonwebtoken')
const config = require('../routes/config')

module.exports = {

  SaveNewUser: function (Model, res) {
    Model.save()
      .then(() => {
          var token = jwt.sign({
            username: Model.username,
            _id: Model._id,
            type: Model.type
          }, config.secret, {
            expiresIn: 86400
          });
          res.status(200).send({
            auth: true,
            token: token
          });
          console.log(token,'token')
      }).catch(err => {
        res.send(err)
        console.log(err)
      })
    }

  }