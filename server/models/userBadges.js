var mongoose = require('mongoose');

var userBadgesSchema = new mongoose.Schema({
    userID: {
      type: String,
      required: true,
    },
    badgeID: {
      type: String,
      required: true,
    },
    status: {
      type: Boolean,
      required: true,
    }, 
    date: {
      type: Date,
      default: Date.now()
    }
})

module.exports = mongoose.model('userBadges', userBadgesSchema);