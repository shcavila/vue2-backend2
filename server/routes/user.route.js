const express = require('express');
const userRoute = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Org = require('../modules/findOrg');
const User = require('../models/regUser');
const Badges = require('../models/Badges');
const userBadges = require('../models/userBadges');
const mongoose = require('mongoose');
const test = require('../controller/test.save')
var helper = require('../controller/Badges')

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
        test.SaveNewUser(user, res);
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

userRoute.route('/userbadges').post((req, res) => {
  let user = jwt.decode(req.body.user);
  let options = { _id: 0, userID: 0, date: 0 };
  let select = 'badgename venue certificateName description backgroundImg orgID';
  userBadges.find({ userID: mongoose.Types.ObjectId(user._id), status: false }, options).
    populate('badgeID', select).
    exec(function (err, badgeID) {
      if (err) return handleError(err);
      console.log(badgeID);
      res.json(badgeID);
    });
});


userRoute.route('/availbadge').post((req, res) => {
  var user = jwt.decode(req.body.user)
  Badges.findOne({ code: req.body.code })
    .then((badgesData) => {
      let badgeId = badgesData._id;
      let datum = { userID: mongoose.Types.ObjectId(user._id), badgeID: badgeId, status: false }
      userBadges.findOne(datum)
        .then((doc) => {
          if (!doc) {
            console.log(doc)
            let badgeSave = new userBadges(datum)
            badgeSave.save()
              .then((data) => {
                console.log("Availed Succesfully!")
                console.log(data)
                let filter = { orgID: badgesData.orgID, granted: false }
                helper.findPending(filter)
                  .then(resp => {
                    var io = req.app.get("socketio");
                    let data = resp
                    io.emit("onUserAvail", data);
                    console.log(data)
                  })
                  .catch(err => {
                    console.log(err)
                  });
                res.json({ availedBadge: data, })
              })
              .catch((err) => {
                res.send(err)
              })
          }
          else {
            res.send('not found')
            console.log(doc)
          }
        })
        .catch((err) => {
          console.log(err)
        });
    })
    .catch((err) => {
      console.log(err)
      res.end()
    });
});




module.exports = userRoute;