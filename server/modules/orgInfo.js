function Info(username) {
    return new Promise(function (resolve, reject) {
      Organization.findOne({
        username: username
      }, { '_id': 0 }).then(doc => {
        if (doc) {
          resolve({ data: doc });
        }
      }).catch(err => {
        reject(err)
        console.log(err);
      })
    })
  }
