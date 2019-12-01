//up for testing
const express = require('express');
const orgRoute = express.Router();
const Org = require('../modules/findOrg');
const Organization = require('../models/organization');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Code = require('../modules/checkCode');
const Badges = require('../models/Badges');
const getBadge = require('../modules/findBadge');
const badgeInfo = require('../modules/getBadge');
const userBadges = require('../models/userBadges');
const mongoose = require('mongoose');
const test = require('../modules/test');
const test2 = require('../controller/test.save');
var helper = require('../controller/Badges')
const update = require('../modules/updateProfile');


orgRoute.route('/orgsignup').post((req, res) => {
  getResult();
  async function getResult() {
    try {
      var result = await Org.findOrg(req.body.username);
      if (result.data == 'not found' || result.data == undefined) {
        req.body.password = bcrypt.hashSync(req.body.password, 10);
        let org = new Organization(req.body);
        test2.SaveNewUser(org, res);
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
});



orgRoute.route('/validatecode').post((req, res) => {
  async function checkCode() {
    var status = await Code.findSameCode(req.body.code);
    if (status == 'notTaken') {
      res.status(200).json({ message: 'Ok' });
    } else {
      res.status(400).json({ message: 'Code is taken, regenerate new!' });
    }
  }
  checkCode();

});

orgRoute.route('/badges-org').post((req, res) => {
  console.log('request from the org')
  let org = jwt.decode(req.body.data);
  let filter = { orgID: org._id, granted: true }
  helper.findGrant(Badges,filter)
    .then(resp => {
      res.json({ badges: resp });
    })
    .catch(err => {
      res.send(err);
    });
});

orgRoute.route('/offerbadge').post((req, res) => {
 
  let user = jwt.decode(req.body.user);
  let filename;
  if (req.file == undefined) {
    filename = 'certificateBG.jpg';
  }else{
    filename = req.file.filename;
  }
  let date = {
    month: req.body.month,
    day: req.body.day,
    year: req.body.year
  };
  req.body.date = date;
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
  //Object.assign(req.body, { backgroundImg: req.file.filename, orgID: user._id})

  let badges = new Badges(badgeData);
  helper.addNewBadge(badges)
    .then(resp => {
      res.json({ data: resp });
    })
    .catch(err => {
      res.send(err);
    });
});


orgRoute.route('/addrecipient').post((req, res) => {
  getResult();
  async function getResult() {
    try {
      let projection = {username: 1,firstname: 1, lastname: 1}
      let result = await test.findUser(req.body.username, projection);
      let badge = await badgeInfo.getBadge(req.body.code);
      let badgeResult = await getBadge.findBadge(result.data._id, badge._id);

      if (result.data != 'not found' || result.data == undefined) {
        if (badgeResult.data == 'not found') {
          let recipient = { username: result.data.username, fullname: `${result.data.firstname} ${result.data.lastname}` }
          let data = {userID: result.data._id, badgeID: badge._id, status: false};
          let newBadge = new userBadges(data);
          helper.addrecipient(Badges,badge._id,recipient)
          .then(resp => {
            res.json({ data: resp });
          })
          .catch(err => {
            res.send(err);
            console.log(err)
          });
          helper.addNewBadge(newBadge)
            .then(resp => {
                res.json({ data: resp });
            })
          .catch(err => {
                res.send(err)
            console.log(err)
          });

        } else {
          res.status(400).json({err: 'already added'})
        }
      } else {
        res.status(400).json({message: 'not found'});
      }
    } catch (err) {
      res.status(500).json({  message: 'Unexpected error occured!'});
    }
  }

});

orgRoute.route("/pendingbadges").post((req, res) => {
  let org = jwt.decode(req.body.data);
  let filter = { orgID: org._id, granted: false }
  helper.findPending(filter)
    .then(resp => {
      res.json({ badges: resp });
      console.log(resp)
    })
    .catch(err => {
      res.send(err);
    });
});

orgRoute.route("/certify").post((req, res) => {
  let id = req.body.badgeInfo.id
  Badges.findByIdAndUpdate(mongoose.Types.ObjectId(id), { granted: true }, { new: true })
    .then(doc => { res.end() })
    .catch(err => { res.send(err) });

  userBadges.updateMany({
    badgeID: mongoose.Types.ObjectId(id)
  }, { status: true })
    .then((doc) => { res.end() })
    .catch((err) => { res.send(err) })
})

orgRoute.route('/updateOrg').post((req, res) => {
  console.log('Organization Update Retrieve')
  let org = jwt.decode(req.body.data)
  Organization.findOne({ _id: org._id })
    .then((data) => {
      res.status(200).json(data)
    })
    .catch((err) => {
      res.status(500).json({ err: err.message })
    })
});

orgRoute.route('/saveUpdate').post((req, res) => {
  let org = jwt.decode(req.body.org)
  if (req.file != undefined) {
    req.body.profilePic = req.file.filename
  }
  update.updateInformation(Organization, org, req, res)
})

module.exports = orgRoute;
