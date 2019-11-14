const Badges = require('../models/Badges')

module.exports.getBadge = function (code) {
    return new Promise(function (resolve, reject) {
        Badges.findOne({code:code}).then(doc => {
            resolve(doc);
        }).catch(err => {
            console.log(err);
            reject(err);
        });
    });
}