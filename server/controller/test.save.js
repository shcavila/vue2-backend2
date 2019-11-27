// user.save()
// .then(() => {
//   var token = jwt.sign({
//     username: user.username,
//     _id: user._id,
//     type: user.type
//   }, config.secret, {
//       expiresIn: 86400
//     });
//   res.status(200).send({
//     auth: true,
//     token: token
//   });
// })
// .catch((err) => {
//   console.log(err);
//   res.status(400).send(err);
// });

module.exports = {
 
    SaveNewUser: function(Model) {
        return new Promise(function (resolve, reject) {
          Model.save()
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