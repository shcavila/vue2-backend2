const express = require('express');
const userRoute = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Org = require('../modules/findOrg');
const User = require('../models/regUser');
const Badges = require('../models/Badges');
const userBadges = require('../models/userBadges');
const mongoose = require('mongoose');
const test = require('../controller/User');
var badgeHelper = require('../controller/Badges');
const update = require('../modules/updateProfile');

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
        let user = new User(req.body);
       test.SaveNewUser(user)
       .then((resp) =>{
         res.json(resp);
       })
       .catch(err =>{
         res.status(400).send(err);
       })
      } else {
        res.status(400).json({
          message: 'Username is already taken!'
        });
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

// userRoute.route('/userbadges').post((req, res) => {
//   let user = jwt.decode(req.body.user);
//   let options = { _id: 0, userID: 0, date: 0 };
//   let select = 'badgename venue certificateName description backgroundImg orgID';
//   userBadges.find({ userID: mongoose.Types.ObjectId(user._id), status: false }, options).
//     populate('badgeID')
//     .exec(function (err, badgeID) {
//       if (err) return handleError(err);
//       console.log(badgeID);
//       res.json({pendingBadges:badgeID});
//     });
// });

userRoute.route('/view-userbadges').post((req, res) => {
  let userid = req.body.id
  let options = { _id: 0, userID: 0, date: 0 };
  let select = 'badgename venue certificateName description backgroundImg orgID';
  userBadges.find({ userID: mongoose.Types.ObjectId(userid), status:true }, options).
    populate('badgeID')
    .exec(function (err, badgeID) {
      if (err) return handleError(err);
      console.log(badgeID);
      res.json({badges:badgeID});
    });
});

//GETTING THE PENDIGN BADGES OF THE USER
function getPending(select, options, user) {
  return new Promise(function (resolve, reject) {
    userBadges.find({ userID: mongoose.Types.ObjectId(user._id), status: false }, options).
      populate('badgeID', select).
      exec(function (err, badgeID) {
        if (err) {
          reject(err)
        };
        resolve(badgeID);
      })
  })
}
//NAUSAB NI
userRoute.route('/userbadges').post((req, res) => {
  async function check() {
    try {
      let user = jwt.decode(req.body.user);
      let options = { _id: 0, userID: 0, date: 0 };
      let select = 'badgename date venue certificateName organization approvedBy descriptions backgroundImg orgID';
      var pendings = await getPending(select, options, user);
      console.log(pendings)
      userBadges.find({ userID: mongoose.Types.ObjectId(user._id), status: true }, options).
        populate('badgeID', select).
        exec(function (err, badgeID) {
          if (err) return handleError(err);
          console.log(badgeID);
          res.status(200).json({ badges: badgeID, pendingbadges: pendings });
        });
    } catch (err) {
      res.status(400).json(err);
    }
  }
  check();

});

//giusab ======================================
userRoute.route('/availbadge').post((req, res) => {
  var user = jwt.decode(req.body.user);
  async function availbadge() {
    try {
      let badge = await badgeHelper.findPending({ code: req.body.code });
      if (badge.length > 0) {
        console.log('decoded', badge)
        let datum = { userID: mongoose.Types.ObjectId(user._id), badgeID: badge[0]._id, status: false };
        let availed = await badgeHelper.findGrant(userBadges, datum);
        if (availed.length == 0) {
          let newBadge = new userBadges(datum);
          let addBadge = await badgeHelper.addNewBadge(newBadge);
          if (addBadge.data == "Added successfully") {
            let userInfo = await badgeHelper.findGrant(User, { _id: mongoose.Types.ObjectId(user._id) });
            let recipient = { username: userInfo[0].username, fullname: `${userInfo[0].firstname} ${userInfo[0].lastname}` }
            badgeHelper.addrecipient(badge[0]._id, recipient)
              .then(resp => {
                console.log(resp)
                res.status(200).json({badgename: badge[0].badgename});
              })
              .catch(err => {
                res.send(err);
              });

          } else {
            res.status(400).send('error in saving');
          }

        } else {
          res.status(400).json({ message: "You are already in the list!" });
        }

      } else {
        res.status(404).json({ message: "Cannot find badge"});
      }

    } catch (err) {
      console.log(err);
      res.status(500).send(err)
    }
  }
  availbadge();
});



userRoute.route('/updateUser').post((req, res) => {
  let user = jwt.decode(req.body.data)
  User.findOne({ _id: user._id })
    .then((data) => {
      res.status(200).json(data)
    })
    .catch((err) => {
      res.status(500).json({ err: err.message })
    })
});

userRoute.route('/saveUpdate').post((req, res) => {
  console.log(req.body)
  let user = jwt.decode(req.body.user)
  let date = {
    month: req.body.month,
    day: req.body.day,
    year: req.body.year
  }
  if (req.file != undefined) {
    req.body.profilePic = req.file.filename
  }
  req.body.birthdate = date;
  update.updateInformation(User, user, req, res)
});



module.exports = userRoute;
