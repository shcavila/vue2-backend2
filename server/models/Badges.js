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
     
    },
    certificateName: {
      type: String,
      
    },
    descriptions    : {
      type: String,
    },
    date:{month: String, day: Number, year: Number}
    
    
  });

  module.exports = mongoose.model('Badge', BadgeSchema);

