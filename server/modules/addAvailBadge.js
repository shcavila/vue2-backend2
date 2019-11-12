function addAndAvailBadge(data, User) {
    return new Promise(function (resolve, reject) {
      var newRecipient = { username: User.username, fullname: User.firstname + " " + User.lastname };
      Organization.findOne({ badges: { $elemMatch: { code: data.code, granted: false } } })
        .then((doc) => {
          if (doc) {
            console.log(doc)
            var badges = doc.badges;
            for (var i = 0; i < badges.length; ++i) {
              if (badges[i].code == data.code) {
                var obadge = badges[i].recipient;
                var existed = false;
                for (var j = 0; j < obadge.length; ++j) {
                  if (obadge[j].username == User.username) {
                    existed = true;
                    resolve("User already exist in the list");
                  }
                }
                if (!existed) {
                  doc.badges[i].recipient.push(newRecipient);
                  console.log(doc.badges[i].recipient);
                  Organization.updateOne({ badges: { $elemMatch: { code: data.code } } }, doc, { new: true })
                    .then(() => {
                      resolve("Successful");
                    }).catch((err) => {
                      console.log(err);
                      reject(err);
                    });
                }
              }
            }
          } else {
            resolve("Badge is not found");
          }
        }).catch((err) => {
          console.log(err)
          reject(err);
        })
    })
  }