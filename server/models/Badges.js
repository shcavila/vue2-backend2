var mongoose = require('mongoose');

var BadgeSchema = new mongoose.Schema({
  orgID: {
    type: Object,
    required: true,
  },
  code: {
    type: String,
    required: true,
    unique: true,
  },
  badgename: {
    type: String,
    required: true,

  },
  venue: {
    type: String,
    required: false

  },
  certificateName: {
    type: String,
    required: false

  },
  descriptions: {
    type: String,
    required: false
  },
  granted: {
    type: Boolean,
    required: true
  },
  date: {
    month: String,
    day: Number,
    year: Number,
  },
  backgroundImg: {
    type: String,
    required: false
  },
  recipients:[{
    _id:false,
    username:{type:String,required:false},
    fullname:{type:String,required:false}
  }]


});

module.exports = mongoose.model('Badge', BadgeSchema);