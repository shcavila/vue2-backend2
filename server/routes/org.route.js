//up for testing
const express = require('express');
const orgRoute = express.Router();
const Org = require('../modules/findOrg');
const Organization = require('../models/organization');
const bcrypt = require('bcryptjs');
const config = require('./config');
const jwt = require('jsonwebtoken');
const Code = require('../modules/checkCode');
const Badges = require('../models/Badges');
const checkuser = require('../modules/findUser');
const getBadge = require('../modules/findBadge');
const badgeInfo = require('../modules/getBadge');
const userBadges = require('../models/userBadges');
const mongoose = require('mongoose')


orgRoute.route('/orgsignup').post((req, res) => {
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
              _id: org._id,
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
            res.status(400).json({
              err: err.message
            });
          });
      } else {
        res.status(400).json({
          message: 'orgname is already taken!'
        });
        console.log('exist');
      }
    } catch (err) {
      res.status(500).json({
        message: 'Unexpected error occured!'
      });
      console.log(err);
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
      });
    } else {
      res.status(400).json({
        message: 'Code is taken, regenerate new!'
      });
    }
  }
  checkCode();

});

orgRoute.route('/badges-org').post((req, res) => {
  console.log('request from the org')
  let org = jwt.decode(req.body.data);
  Badges.find({
    orgID: org._id,
    granted: true
  })
    .then((doc) => {
      if (doc) {
        res.json({
          badges: doc
        });
        console.log(doc)
      };
    })
    .catch(err => {
      res.send(err);
    });
});

orgRoute.route('/offerbadge').post((req, res) => {
  let filename;
  if (req.file == undefined) {
    filename = 'default.jpg';
  } else {
    filename = req.file.filename;
  }
  let user = jwt.decode(req.body.user);
  let date = {
    month: req.body.month,
    day: req.body.day,
    year: req.body.year
  };
  let badgeData = {
    date: date,
    granted: req.body.granted,
    code: req.body.code,
    badgename: req.body.badgename,
    venue: req.body.venue,
    recipient: req.body.recipient,
    certificateName: req.body.certificateName,
    descriptions: req.body.descriptions,
    backgroundImg: filename,
    orgID: user._id
  };
  let badges = new Badges(badgeData);
  badges.save()
    .then(() => {
      res.json({
        data: "Successfull"
      });
      console.log('saved')
    }).catch((err) => {
      res.status(400).json({
        err: err.message
      })
      console.log(err);
    });
});


orgRoute.route('/addrecipient').post((req, res) => {
  console.log(req.body)
  getResult();
  async function getResult() {
    try {
      let result = await checkuser.findUser(req.body.username);
      let badge = await badgeInfo.getBadge(req.body.code);
      let badgeResult = await getBadge.findBadge(result.data._id, badge._id);
      if (result.data != 'not found' || result.data == undefined) {
        if (badgeResult.data == 'not found') {
          let recepient = req.body.username
          Badges.findByIdAndUpdate(badge._id, { $push: { recepients: recepient } }, { new: true })
            .then(doc => {
              console.log('the recepient')
              res.json({ badges: doc })
              console.log(doc)
            })
            .catch(err => {
              console.log(err)
            })
          let data = {
            userID: result.data._id,
            badgeID: badge._id,
            status: false
          };
          let newBadge = new userBadges(data);
          newBadge.save()
            .then(() => {
             console.log('saved')
            })
            .catch(err => {
              res.status(400).json({
                err: err.message
              });
              console.log(err);
            });

        } else {
          res.status(400).json({
            err: 'already added'
          })
        }
      } else {
        res.status(400).json({
          message: 'not found'
        });
      }
    } catch (err) {
      res.status(500).json({
        message: 'Unexpected error occured!'
      });
      console.log(err);
    }
  }

});

orgRoute.route("/pendingbadges").post((req, res) => {
  let org = jwt.decode(req.body.data);
  // socket io
  Badges.find({
    orgID: org._id,
    granted: false
  })
    .then((doc) => {
      if (doc) {
        res.json({
          badges: doc
        });
      }
    })
    .catch(err => {
      res.status(500).json({
        message: err.message
      });
    });
});

orgRoute.route("/certify").post((req, res) => {
  console.log(req.body)
  let id = req.body.badgeInfo.id
  Badges.findByIdAndUpdate(mongoose.Types.ObjectId(id),{granted:true},{new:true})
  .then(doc =>{
    console.log(doc)
    res.end()  
  })
  .catch(err =>{
    console.log(err)
    res.send(err)  
  })
  userBadges.updateMany({ badgeID: mongoose.Types.ObjectId(id) }, { status: true })
  .then((doc) => {
    console.log("test");
    console.log(doc)
    res.end()
  })
  .catch((err) => {
    console.log("Err::>>>>> " + err)
    res.end()
  })
})












module.exports = orgRoute;