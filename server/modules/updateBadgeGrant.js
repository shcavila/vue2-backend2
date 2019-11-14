const Badges = require('../models/badges')

module.exports.getBadge = function (code) {
    return new Promise(function (resolve, reject) {
        Badges.findOneAndUpdate({ code: code }, { grant: true })
        .then(doc => {
            resolve(doc);
        }).catch(err => {
            console.log(err);
            reject(err);
        });
    });
}