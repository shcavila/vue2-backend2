module.exports = {
 
    UserBadge: function(Collection,filter) {
        return new Promise(function (resolve, reject) {
          Collection.findOne(
           filter
          )
            .then(doc => {
              if (doc) {
                resolve({data:doc});
              } else {
                resolve({data:"not found"})
              }
            }).catch(err => {
              reject(err);
              console.log(err)
            })
        })
      }
    
}