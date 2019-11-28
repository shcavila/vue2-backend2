module.exports = {

  Badge: function (Collection, filter, res) {
      Collection.find(filter)
      .then(doc => {
          if (doc) {
            res.json({ badges: doc });
            console.log('org badges'+doc)
          } else {
            res.send('not found')
          }
        }).catch(err => {
          res.send(err)
          console.log(err)
        })
    }
  }

