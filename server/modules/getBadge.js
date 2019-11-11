module.exports.getBadges = function (username) {
    return new Promise(function (resolve, reject) {
        Organization.find({}, "badges").then(docs => {
            resolve(docs);
        }).catch(err => {
            console.log(err);
            reject(error);
        });
    });
}