const express = require('express');
const authRoute = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('./config');
const Org = require('../modules/findOrg');

authRoute.route('/getuser').post(function (req, res) {
  getUer();
  async function getUer(){
    try {
      var fuser = await Org.findOrg(req.body.username);
      if(fuser != 'not found'){
        res.status(200).send({status: true,type: fuser.data.type, user: fuser.data})
      }
    } catch (error) {
      
    }
  }
})


authRoute.route('/login').post(function (req, res) {
  getResult();
  async function getResult() {
    try {
      var fuser = await Org.findOrg(req.body.username);
      if (fuser != 'not found') {
        bcrypt.compare(req.body.password, fuser.data.password)
          .then(match => {
            if (match) {
              var token = jwt.sign({
                _id: fuser.data._id,
                username: fuser.data.username,
                type: fuser.data.type,
              }, config.secret, {
                expiresIn: 86400 // expires in 24 hours
              });
              res.status(200).send({
                auth: true,
                token: token,
                type: fuser.data.type,
                message: 'login successful'
              });
            } else {
              res.status(401).json({
                message: 'Wrong password'
              });
            }
          })
          .catch(err => {
              res.status(400).json(err);
          });
      } else if (fuser.data == 'not found') {
        res.status(404).json({
          message: 'user not found!'
        });
      }
    } catch (err) {
      res.status(500).json({
        message: err.message

      });
    }
  }
});


authRoute.route('/userInfo').post((req, res) => {
  var user = jwt.decode(req.body.data);

  getResult();
  async function getResult() {
    try {
      var result = await Org.findOrg(user.username);
      if (result.data != 'not found' || result.data == undefined) {
        res.status(200).json({
          data: result.data
        });
      } else {
        res.status(400).json({
          message: 'User not found!'
        });
      }
    } catch (err) {
      res.status(500).json({
        message: 'Unexpected error occured!'
      });
    }
  }
});

authRoute.route('/userType').post((req, res) => {
  var user = jwt.decode(req.body.credential);
  var type = user.type;  //example the user type is 'Regular user'
  res.status(200).json({
    userType: type
  });
});

var tempdata = {
  username: '',
  password: ''
};

authRoute.route('signup').post((req, res) => {
  tempdata = req.body;
  res.status(200).end();
});

authRoute.route('/signedup').get((req, res) => {
  res.status(200).json(tempdata);
});

module.exports = authRoute;