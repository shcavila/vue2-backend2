const Badges = require('../models/Badges');

function findGrant(filter) {
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
            });
    })
}

function addRecepient(Collection, badgeID,recepient) {
    return new Promise((resolve, reject) => {
        Collection.findByIdAndUpdate(badgeID, { $push: { recepients: recepient } }, { new: true })
        .then(doc => {resolve({badges: doc})})
        .catch(err => {reject(err)})
    })
}

module.exports = {
            findPending,
            findGrant,
            addNewBadge,
            addRecepient
}