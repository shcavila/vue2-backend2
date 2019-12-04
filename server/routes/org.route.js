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
const userHelper = require('../controller/User')
var badgeHelper = require('../controller/Badges');

const update = require('../modules/updateProfile');


orgRoute.route('/orgsignup').post((req, res) => {
  getResult();
  async function getResult() {
    try {
      var result = await Org.findOrg(req.body.username);
      if (result.data == 'not found' || result.data == undefined) {
        req.body.password = bcrypt.hashSync(req.body.password, 10);
        let org = new Organization(req.body);
        userHelper.SaveNewUser(org)
        .then(resp =>{
          res.json(resp);
        })
        .catch(err =>{
          res.status(500).send(err);
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
  let org = jwt.decode(req.body.data);
  let filter = {
    orgID: org._id,
    granted: true
  }
  badgeHelper.findGrant(Badges, filter)
    .then(resp => {
      res.json({
        badges: resp
      });
    })
    .catch(err => {
      res.send(err);
    });
});

orgRoute.route('/view-badges-org').post((req, res) => {
  console.log('request from the org')
  let idi = req.body.id
  let filter = {
    orgID: idi,
    granted: true
  }
  badgeHelper.findGrant(Badges, filter)
    .then(resp => {
      res.json({
        badges: resp
      });
    })
    .catch(err => {
      res.send(err);
    });
});

orgRoute.route('/offerbadge').post((req, res) => {
  console.log(req.body);
  let user = jwt.decode(req.body.user);
  let filename;
  if (req.file == undefined) {
    filename = 'certificateBG.jpg';
  } else {
    filename = req.file.filename;
  }
  let date = {month: req.body.month, day: req.body.day, year: req.body.year };
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

  let badges = new Badges(badgeData);
  badgehelper.addNewBadge(badges)
    .then(resp => {
      res.json({
        data: resp
      });
    })
    .catch(err => {
      res.status(400).send(err)
    });
});
orgRoute.route('/addrecipient').post((req, res) => {
  getResult();
  async function getResult() {
    try {
      let projection = {
        username: 1,
        firstname: 1,
        lastname: 1
      };
      let result = await test.findUser(req.body.username, projection);
      let badge = await badgeInfo.getBadge(req.body.code);
      let badgeResult = await getBadge.findBadge(result.data._id, badge._id);

      if (result.data != 'not found' || result.data == undefined) {
        if (badgeResult.data == 'not found') {
          let recipient = {
            username: result.data.username,
            fullname: `${result.data.firstname} ${result.data.lastname}`
          };
          let data = {
            userID: result.data._id,
            badgeID: badge._id,
            status: false
          };
          let newBadge = new userBadges(data);

          badgeHelper.addrecipient(badge._id, recipient)
            .then(resp => {
              badgeHelper.addNewBadge(newBadge)
                .then(resp => {
                  res.json({
                    data: resp
                  });
                  res.status(200).json(resp);
                })
                .catch(err => {
                  res.status(500).send(err);
                });
            })
            .catch(err => {
              res.status(500).send(err);
            });

        } else {
          res.status(400).json({
            message: 'already added'
          });
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
    }
  }

});

orgRoute.route("/pendingbadges").post((req, res) => {
  let org = jwt.decode(req.body.data);
  let filter = {
    orgID: org._id,
    granted: false
  }
  badgeHelper.findPending(filter)
    .then(resp => {
      res.json({
        badges: resp
      });
      console.log(resp)
    })
    .catch(err => {
      res.send(err);
    });
});

orgRoute.route("/certify").post((req, res) => {
  console.log(req.body, 'test')
  let id = req.body.badgeInfo.id
  let update = {
    granted: true,
    certificateName: req.body.badgeInfo.certificateName,
    descriptions: req.body.badgeInfo.descriptions,
    approvedBy: req.body.badgeInfo.approvedBy

  }
  Badges.findByIdAndUpdate(mongoose.Types.ObjectId(id), update, {
      new: true
    })
    .then(doc => {
      res.json({
        data: doc
      })
    })
    .catch(err => {
      res.send(err)
    });

  userBadges.updateMany({badgeID: mongoose.Types.ObjectId(id)}, {status: true})
    .then((doc) => {
      res.json({messsage:"Certified Succesfully"})
    })
    .catch((err) => {
      res.send(err)
    })
});

orgRoute.route('/deletebadge/:id').post((req, res) => {
  let id = req.params.id
  Badges.findByIdAndRemove({
      _id: id
    })
    .then(doc => {
      let deleteID = mongoose.Types.ObjectId(id)
      userBadges.deleteMany({
          "badgeID": deleteID
        })
        .then(doc => {
          res.status(200).json(doc)
        })
    })
    .catch(err => {
      res.status(500).json({
        err: err.message
      })
    })
})


orgRoute.route('/updateOrg').post((req, res) => {
  console.log('Organization Update Retrieve')
  let org = jwt.decode(req.body.data)
  Organization.findOne({_id: org._id})
    .then((data) => {
      res.status(200).json(data)
    })
    .catch((err) => {
      res.status(500).json({
        err: err.message
      })
    })
});

// orgRoute.post('/removerecipient', (req, res) =>{
//   let
// })

orgRoute.route('/saveUpdate').post((req, res) => {
  let org = jwt.decode(req.body.org)
  if (req.file != undefined) {
    req.body.profilePic = req.file.filename
  }
  update.updateInformation(Organization, org, req, res)
});

orgRoute.post('/removerecipient',(req, res)=>{
  console.log(req.body, 'body');
  let badgeID = req.body.badge_id;
  let recipient = { username:req.body.recipient_username, fullname: req.body.recipient_name }
  badgehelper.removerecipient(badgeID, recipient)
  .then( resp =>{
    res.json(resp);
  })
  .catch(err =>{
    res.status(500).send(err)
  });
  
   
});


module.exports = orgRoute;