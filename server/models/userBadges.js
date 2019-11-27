var mongoose = require('mongoose');

var userBadgesSchema = new mongoose.Schema({
    badgeID: {
      type: Object,
      ref:'Badge',
      required: true,
    },
    status: {
      type: Boolean,
      required: true,
    },
    userID: {
      type: Object,
      required: true,
    },
    date:{
      type:Date,
      default: Date.now()
    }
})

module.exports = mongoose.model('userBadge', userBadgesSchema);