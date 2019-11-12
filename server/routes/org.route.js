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
                orgname: org._id,
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
      if (status == 'notTaken') {
        res.status(200).json({
          message: 'Ok'
        })
      } else {
        res.status(400).json({
          message: 'Code is taken, regenerate new!'
        })
      }
    }
    checkCode();

  });

  orgRoute.route('/offerbadge').post((req, res) => {

    let org = jwt.decode(req.body.user)
    req.body.badge.orgID = org._id
    let badge = new Badges (req.body.badge);
    badge.save()
      .then(() => {
        res.status(200).send({
          message: 'Succesfully added!'
        });
      })
      .catch((err) => {
        res.status(400).json({ err: err.message });
        console.log(err)
      })
  });


  orgRoute.route('/badges-org').post((req, res) => {
    let org = jwt.decode(req.body.data);
    Badges.find({orgID:org._id})
    .then((doc) => {
      console.log(doc)
      res.end()
    })
    .catch(err => {
      console.log(err)
      res.end()
    }) 
  });

  orgRoute.route("/pendingbadges").post((req, res) => {
    console.log('this is the pending badge')
    let org = jwt.decode(req.body.data)
    Badges.find({orgID:org._id,granted: false})
    .then((doc) => {
      console.log('not granted')
      console.log(doc)
      res.end()
    })
    .catch(err =>{
      console.log(err)
      res.end()
    })
    // async function getPendingBadges() {
    //   var user = jwt.decode(req.body.data);
    //   var org = await orgInfo(user.username);
    //   try {
    //     var badges = org.data.badges;
    //     var pendingbadges = [];
    //     badges.forEach(function (badge) {
    //       if (!badge.granted) {
    //         var recipient = [];
    //         badge.recipient.forEach(function (re) {
    //           recipient.push({ username: re.username, fullname: re.fullname });
    //         })
    //         badge.recipient = recipient;
    //         // console.log(recipient);
    //         // console.log(badge);
    //         pendingbadges.push(badge);
    //       }
    //     });
    //     console.log("THE ORG HAS " + pendingbadges.length + " PENDING BADGES")
    //     res.status(200).json({
    //       badges: pendingbadges
    //     })
    //   } catch(err) {
    //     res.status(500).json({
    //       message: "unexpected error occured!"
    //     })
    //   }
    // }
    // getPendingBadges();
  })

  

   




module.exports = orgRoute;