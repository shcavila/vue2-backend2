const express = require('express');
const userRoute = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Org = require('../modules/findOrg');
const config = require('./config');
const User = require('../models/regUser');
const Badge = require('../modules/Badge');
var tempdata = {};

userRoute.route('/signup').post((req, res) => {
  tempdata = req.body;
  res.status(200).end();
});

userRoute.route('/signedup').get((req, res) => {
  res.status(200).json(tempdata);
});

userRoute.route('/fullsignup').post((req, res) => {
  async function signup() {
    try {
      var result = await Org.findOrg(req.body.username);
      if (result.data == 'not found' || result.data == undefined) {
        req.body.password = bcrypt.hashSync(req.body.password, 10);
        const user = new User(req.body);
        user.save()
          .then(() => {
            var token = jwt.sign({
              _id: user.username,
              type: user.type
            }, config.secret, {
              expiresIn: 86400
            });
            res.status(200).send({
              auth: true,
              token: token
            });
          })
          .catch((err) => {
            console.log(err);
            res.status(400).send(err);
          });
      } else {
        console.log('RESPOND 400 ALREADY TAKEN')
        res.status(400).json({
          message: 'Username is already taken!'
        })
      }
    } catch (err) {
      res.status(500).json({
        message: 'Unexpected error occured!'
      });
    }
  }
  signup();
  tempdata = {};
});

userRoute.route('/userbadges').post((req, res) => {
  console.log('hello');

   async function getUserBadges() {
     var user = jwt.decode(req.body.user);
    try {
      var result = await Badge.getBadges(user._id);
      var badges = [];
      console.log('query result');
      console.log(result);
      result.forEach(function (b) {
        b.badges.forEach(function (bdg) {
          bdg.recipient.forEach(function (re) {
            if (re.username == user.username) {
              badges.push(bdg);
            }
          });
        });
      });
      res.status(200).json({
        badges: badges
      });
    } catch (err) {
      res.status(500).json({
        message: err
      });
    }
  }
  getUserBadges();
  
});
  


// userRoute.route('/availbadge').post((req, res) => {
//   async function avail() {
//     var data = req.body;
//     var User = jwt.decode(data.credentials);
//     try {
//       var userinfo = await findUser(User.username);
//       if (userinfo != 'not found') {
//         try {
//           var result = await Badge.addAndAvailBadge(data, userinfo);
//           if (result == 'Successful') {
//             console.log('You successfully availed the badge with the code' + data.code)
//             res.status(200).json({
//               message: 'You successfully availed the badge with the code' + data.code
//             });
//           } else if (result == 'Badge is not found') {
//             console.log('Cannot find badge with the code ' + data.code)
//             res.status(404).json({
//               message: 'Cannot find badge with the code ' + data.code
//             });
//           } else if (result == 'User already exist in the list') {
//             console.log('You are already in the list!')
//             res.status(400).json({
//               message: 'You are already in the list!'
//             });
//           }
//         } catch (err) {
//           res.status(500).json({
//             message: 'Unexpected error occured!'
//           });
//         }
//       } else {
//         res.status(200).json({
//           message: 'User not found!'
//         });
//       }
//     } catch (err) {
//       console.log('Error occured!!!');
//       res.status(500).json({
//         message: 'Unexpected error occured'
//       });
//     }
//   }
//   avail();

// });




module.exports = userRoute;