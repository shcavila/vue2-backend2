var mongoose = require('mongoose');

var userBadgesSchema = new mongoose.Schema({
    userID: {
      type: Object,
      required: true,
    },
    bagdeID: {
      type: Object,
      required: true,
    },
    status: {
      type: Boolean,
      required: true,
    }
})

module.exports = mongoose.model('userBadged', userBadgesSchema);