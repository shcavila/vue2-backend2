const Badges = require('../models/Badges');

function findGrant(Collection,filter) {
    return new Promise((resolve, reject) => {
        Collection.find(filter)
            .then(doc => {
                resolve(doc)
            })
            .catch(err => {
                reject(err)
            });
    })
}
function findPending(filter) {
    return new Promise((resolve, reject) => {
        Badges.find(filter)
            .then(doc => {
                resolve(doc)
            })
            .catch(err => {
                reject(err)
            });
    })
}
function addNewBadge(Model) {
    return new Promise((resolve, reject) => {
        Model.save()
            .then(() => {
                resolve({ data: 'Added successfully' })
            })
            .catch(err => {
                reject(err)
            });
    })
}

function addrecipient(badgeID,recipient) {
    return new Promise((resolve, reject) => {
        Badges.findByIdAndUpdate(badgeID, { $push: { recipients: recipient } }, { new: true })
        .then(doc => {resolve({badges: doc})})
        .catch(err => {reject(err)})
    })
}


module.exports = {
            findPending,
            findGrant,
            addNewBadge,
            addrecipient
}