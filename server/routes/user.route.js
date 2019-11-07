const express = require("express");
const userRoute = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Org = require('../modules/findOrg');
const config = require('./config')
const User = require('../models/regUser')


userRoute.route("/signup").post((req, res) => {
    tempdata = req.body
    res.status(200).end();
  });
   
  userRoute.route("/signedup").get((req, res) => {
    res.status(200).json(tempdata);
  });

userRoute.route("/fullsignup").post((req, res) => {
    async function signup() {
      try {
        var result = await Org.findOrg(req.body.username);
        console.log("RESULT FROM ORG COLLECTION: " + result.data);
        if (result.data == "not found") {
          req.body.password = bcrypt.hashSync(req.body.password, 10);
          const user = new User(req.body)
          console.log(user)
          user.save()
            .then(() => {
              var token = jwt.sign({
                username: user.username,
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
            })
        } else {
          console.log("RESPOND 400 ALREADY TAKEN")
          res.status(400).json({ message: "Username is already taken!" })
        }
      } catch(err) {
        res.status(500).json({ message: "Unexpected error occured!" });
      }
    }
    signup();
    tempdata = {};
  });

  userRoute.route("/userbadges").post((req, res) => {
    async function getUserBadges() {
      var user = jwt.decode(req.body.user);
      try {
        var result = await getBadges(user.username);
        var badges = [];
        result.forEach(function (b) {
          b.badges.forEach(function (bdg) {
            bdg.recipient.forEach(function (re) {
              if (re.username == user.username) {
                badges.push(bdg);
              }
            })
   
          })
        })
        res.status(200).json({ badges: badges});
      } catch(err) {
        res.status(500).json({
          message: "Unexpected error occured!"
        })
      }
    }
    getUserBadges();
  });
  

  module.exports = userRoute
   

