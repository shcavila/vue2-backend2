const express = require("express");
const authRoute = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Org = require('../modules/findOrg');
const config = require('./config')
const User = require('../modules/findUser')

authRoute.route("/login").post(function (req, res) {
    tempdata = {};
    console.log("LOGIN USER: " + req.body)
    getResult();
    async function getResult() {
      try {
        var fuser = await User.findUser(req.body.username);
        console.log("result: " + fuser);
        console.log("finalizing request!")
        if (fuser.data != "not found") {
          bcrypt.compare(req.body.password, fuser.password)
            .then(match => {
              if (match) {
                console.log("correct")
                var token = jwt.sign({
                  username: fuser.username,
                  type: fuser.type,
                }, config.secret, {
                    expiresIn: 86400 // expires in 24 hours
                  });
                res.status(200).send({
                  auth: true,
                  token: token,
                  type: fuser.type,
                  message: "login successful"
                });
              } else {
                console.log("wrong password")
                res.status(401).json({
                  message: "Wrong password"
                });
              };
            })
            .catch(err => {
              if (err) {
                console.log(err)
                res.status(500).json(err)
              }
            })
          } else if (fuser.data == "not found") {
            res.status(404).json({
              message: "user not found!"
            })
          }
      } catch(err) {
        console.log("Unexpected error occured!!!!");
        console.log(err)
        res.status(500).json({
          message: "Unexpected error occured!"
          
        });
      };
    };
  });


  authRoute.route("/userInfo").post((req, res) => {
    var user = jwt.decode(req.body.data);
    getResult();
    async function getResult() {
      try {
        var result = await Org.findOrg(user.username);
        if (result.data != "not found") {
          res.status(200).json({ data: result.data });
        } else {
          res.status(400).json({message: "User not found!"});
        };
      } catch(err) {
        res.status(500).json({ message: "Unexpected error occured!" });
      };
    };
  });

  authRoute.route("/userType").post((req, res) => {
    console.log(req.body.credential)
    var user = jwt.decode(req.body.credential)
    console.log(user)
    var type = user.type //example the user type is "Regular user"
    res.status(200).json({
      userType: type
    })
  })
module.exports = authRoute