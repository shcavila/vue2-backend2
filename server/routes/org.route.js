const express = require('express');
const orgRoute = express.Router();
const Org = require('../modules/findOrg');
const Organization = require('../models/organization');
const bcrypt = require('bcryptjs');
const config = require('./config');
const jwt = require('jsonwebtoken');
const orgInfo = require('../modules/orgInfo');
const Code = require('../modules/checkCode')
const Badges = require('../models/Badges')


orgRoute.route('/orgsignup').post((req, res) => {
  console.log(req.body)
  
    getResult();
    async function getResult() {
      try {
        var result = await Org.findOrg(req.body.username);
        if (result.data =='not found' || result.data == undefined) {
          req.body.password = bcrypt.hashSync(req.body.password, 10);
          let org = new Organization(req.body);
          org.save()
            .then(() => {
              var token = jwt.sign({
                orgname: org.username,
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
              res.status(400).json({err:err.message});
              console.log(err)
            })
        } 
        else{
            res.status(400).json({ message: 'orgname is already taken!' });
            console.log('exist') 
        }
      }catch(err) {
        res.status(500).json({ message: 'Unexpected error occured!' });
        console.log(err)
      }
    }
    tempdata = {};
  });



  orgRoute.route('/validatecode').post((req,res) =>{
    async function checkCode() {
      var status = await Code.findSameCode(req.body.code);
      console.log("RESULT FROM ORG COLLECTIN: " + status);
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
    checkCode();

  });

  orgRoute.route('/offerbadge').post((req, res) => {
    orgID = jwt.decode(req.body.user)
    req.body.badge.orgID = orgID._id
    let badge = new Badges (req.body.badge);
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


  orgRoute.route("/badges-org").post((req, res) => {
    console.log('test')
    console.log(jwt.decode(req.body.data))
    // async function getOrgBadges() {
    //   var user = jwt.decode(req.body.data);
    //   try {
    //     var org = await orgInfo(user.username);
    //     res.status(200).json({
    //       badges: org.data.badges
    //     })
    //   } catch(err) {
    //     res.status(500).json({
    //       message: "an error has occured!"
    //     })
    //   }
    // }
    // getOrgBadges();
  });

  

   




module.exports = orgRoute;