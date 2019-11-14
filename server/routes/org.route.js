const express = require('express');
const orgRoute = express.Router();
const Org = require('../modules/findOrg');
const Organization = require('../models/organization');
const bcrypt = require('bcryptjs');
const config = require('./config');
const jwt = require('jsonwebtoken');
const orgInfo = require('../modules/orgInfo');
const userFind = require('../modules/findUser');
const badgeGrant = require('../modules/updateBadgeGrant');
const Code = require('../modules/checkCode')
const Badges = require('../models/badges');
const userBadges = require('../models/userBadges');


orgRoute.route('/orgsignup').post((req, res) => {
  console.log(req.body)
  getResult();
  async function getResult() {
    try {
      var result = await Org.findOrg(req.body.username);
      if (result.data == 'not found' || result.data == undefined) {
        req.body.password = bcrypt.hashSync(req.body.password, 10);
        let org = new Organization(req.body);
        org.save()
          .then(() => {
            var token = jwt.sign({
              orgname: org.orgname,
              type: org.type
            }, config.secret, {
              expiresIn: 86400
            });
            res.status(200).send({
              auth: true,
              token: token
            });
          })
          .catch((err) => {
            res.status(400).json({ err: err.message });
            console.log(err)
          })
      }
      else {
        res.status(400).json({ message: 'orgname is already taken!' });
        console.log('exist')
      }
    } catch (err) {
      res.status(500).json({ message: 'Unexpected error occured!' });
      console.log(err)
    }
  }
  tempdata = {};
});

orgRoute.route('/offerbadge').post((req, res) => {
  orgID = jwt.decode(req.body.user)
  req.body.badge.orgID = orgID._id
  console.log(req.body)
  let badge = new Badges(req.body.badge);
  badge.save()
    .then(() => {
      res.status(200).send({
        message: "Succesfully added!"
      });
    })
    .catch((err) => {
      res.status(400).json({ err: err.message });
      console.log(err)
    })
});

orgRoute.route('/validatecode').post((req, res) => {
  checkCode();
  async function checkCode() {
    var status = await Code.findSameCode(req.body.code);
    console.log("RESULT FROM ORG COLLECTIN: " + status)
    console.log("STATUsdgsdfgfsdgSSSS" + status)
    if (status == "notTaken") {
      console.log("THE CODE " + req.body.code + "IS NOT YET TAKEN!");
      res.status(200).json({
        message: "Ok"
      })
    } else {
      console.log("THE CODE " + req.body.code + "IS ALREADY TAKEN!");
      res.status(400).json({
        message: "Code is taken, regenerate new!"
      })
    }
  }
})

orgRoute.route('/addrecipient').post((req, res) => {
  console.log("Add Recepient!")
  orgID = jwt.decode(req.body.org)
  console.log(req.body)
  console.log(orgID)
  async function add() {
    var data = req.body;
    try {
      var User = await userFind.findUser(data.username);
      if (User != "not found") {
        var result = await addAndAvailBadge(req.body, User);
        if (result == "Successful") {
          console.log("User successfully added")
          res.status(200).json({ message: "User successfully added" });
        } else if (result == "User already exist in the list") {
          console.log("User already exist in the list!")
          res.status(400).json({ message: "User already exist in the list!" });
        } else if (result == "Error") {
          res.status(500).json({ message: "Unexpected error occured" });
        } else {
          console.log("Badge not found!");
          res.status(404).json({ message: "Badge not found" });
        }
      } else if (User == "not found") {
        res.status(404).json({ message: "User not found!" });
      }

    } catch (err) {
      console.log("ERRROR IN ADDING!!")
      res.status(500).json({ message: "Unexpected error occured" });
    }

  }
  add();
})

orgRoute.route("/certify").post((req, res) => {
  async function run() {
    try {
      let badgeInfo = await badgeGrant.getBadge('kyortv2')
      console.log(badgeInfo)
      userBadges.updateMany({ badgeID: 'badgeInfo._id' }, { status: truasdfasde })
        .then((doc) => {
          console.log("test");
          console.log(doc)
        })
        .catch((err) => {
          console.log("Err::>>>>> " + err)
        })
    } catch (err) {
      console.log("Err::>>>>> " + err)
    }
  }
  //console.log(req.body.badgeInfo)
  run();
})


module.exports = orgRoute;