const Badges = require('../models/Badges');

function findGrant(Collection,filter) {
    return new Promise((resolve, reject) => {
        Collection.find(filter)
            .then(doc => {
                console.log("dbres == ", doc)
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
                console.log("dbres == ", doc)
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
                console.log('daved')
                resolve({ data: 'Added successfully' })
            })
            .catch(err => {
                reject(err)
                console.log(err)
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