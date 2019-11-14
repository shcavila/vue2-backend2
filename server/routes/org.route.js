const express = require('express');
const orgRoute = express.Router();
const Org = require('../modules/findOrg');
const Organization = require('../models/organization');
const bcrypt = require('bcryptjs');
const config = require('./config');
const jwt = require('jsonwebtoken');
const Code = require('../modules/checkCode')
const Badges = require('../models/Badges')
const checkuser = require('../modules/findUser')
const getBadge = require('../modules/findBadge')
const badgeInfo = require('../modules/getBadge')
const userBadges = require('../models/userBadges')




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



orgRoute.route('/validatecode').post((req, res) => {
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
  let badge = new Badges(req.body.badge);
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
  Badges.find({ orgID: org._id })
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
  Badges.find({ orgID: org._id, granted: false })
    .then((doc) => {
      console.log('not granted')
      console.log(doc)
      res.end()
    })
    .catch(err => {
      console.log(err)
      res.end()
    });
});

orgRoute.route('/addrecipient').post((req, res) => {
  getResult();
  async function getResult() {
    try {
      let result = await checkuser.findUser(req.body.username);
      let badge = await badgeInfo.getBadge(req.body.code);
      let badgeResult = await getBadge.findBadge(result._id,badge._id);
      if (result.data != 'not found' || result.data == undefined) {
        if(badgeResult.data == 'not found'){
          let data = {
            userID : result.data._id,
            badgeID : badge._id,
            status: false
          }
          let newBadge = new userBadges(data)
          newBadge.save()
          .then(() =>{
            res.json({message:'Successfully added'})
          })
          .catch(err =>{
            res.status(400).json({err: err.message})
          })
        }
      }
      else {
        res.status(400).json({ message: 'not found' });
      }
    } catch (err) {
      res.status(500).json({ message: 'Unexpected error occured!' });
      console.log(err)
    }
  }

});

orgRoute.route("/certify").post((req, res) => {
  async function run() {
    let badge = await badgeInfo.getBadge('egvm1k3')
    const docs = await userBadges.find({badgeID: badge._id})
    console.log(docs);
  }
  //console.log(req.body.badgeInfo)
  run();
})












module.exports = orgRoute;