const express = require('express');
const orgRoute = express.Router();
const Org = require('../modules/findOrg');
const Organization = require('../models/organization');
const bcrypt = require('bcryptjs');
const config = require('./config');
const jwt = require('jsonwebtoken');
const orgInfo = require('../modules/orgInfo');


orgRoute.route('/orgsignup').post((req, res) => {
    getResult();
    async function getResult() {
      try {
        var result = await Org.findOrg(req.body.orgname);
        if (result.data == 'not found') {
          req.body.password = bcrypt.hashSync(req.body.password, 10);
          const org = new Organization(req.body);
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
              res.status(400).send(err);
            })
        } else {
          res.status(400).json({ message: 'orgname is already taken!' });
        }
      }catch(err) {
        res.status(500).json({ message: 'Unexpected error occured!' });
      }
    }
    tempdata = {};
  });

  orgRoute.route('/offerbadge').post((req, res) => {
    console.log('hello');
    async function offer() {
      var org = jwt.decode(req.body.user);
      try {
        var orginfo = await orgInfo.Info(org.username);
        req.body.badge.organization = orginfo.data.orgName;
        Organization.updateOne({ username: org.username }, { $push: { badges: req.body.badge } })
          .then(() => {
            console.log('UPDATE SUCCESSFUL');
            res.status(200).json({ message: 'successfull added' });
          }).catch(err => {
            res.status(500).json({ message: 'un error occured!' });
            console.log(err);
          })
      } catch(err) {
        res.status(500).json({message: 'Unexpected error occured!'});
      } 
    }
    offer();
  });
   




module.exports = orgRoute;