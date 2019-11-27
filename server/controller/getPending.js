const Badges = require('../models/Badges');

function findPending() {
    return new Promise((resolve, reject) => {
        Badges.find({
                orgID: org._id,
                granted: false
            })
            .then((doc) => {
                if (doc) {
                    resolve(doc)
                }
            })
            .catch(err => {
                reject(err)
            });
    })
}

module.exports = findPending