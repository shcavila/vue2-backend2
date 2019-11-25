const UserBadges = require('../models/userBadges')

module.exports.getBadge = function (id) {
    return new Promise(function (resolve, reject) {
        UserBadges.findOne({badgeID:id}).then(doc => {
            console.log('recepients')
            resolve(doc);
        }).catch(err => {
            console.log(err);
            reject(err);
        });
    });
}