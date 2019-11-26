var mongoose = require('mongoose');

var userBadgesSchema = new mongoose.Schema({
    userID: {
      type: Object,
      required: true,
    },
    badgeID: [{
      type: Object,
      ref:'Badge',
      required: true,
    }],
    status: {
      type: Boolean,
      required: true,
    },
    date:{
      type:Date,
      default: Date.now()
    }
})

module.exports = mongoose.model('userBadge', userBadgesSchema);