var mongoose = require('mongoose');

var orgSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    unique: false,
  },
  email: {
    type: String,
    required: true,
    unique: false,
  },
  address: {
    type: String,
    required: true,
    unique: false,
  },

  orgName: {
    type: String,
    required: true,
    unique: false,
  },
  description: {
    type: String,
    required: true,
    unique: false,
  },
  type: {
    type: String,
    required: true,
    unique: false,
  },
  post: {
    type: String,
    required: false,
    unique: false,
  },
  years: {
    type: Number,
    required: false,
    unique: false,
  },
  profilePic:{
    type: String,
    default: "profile.png",
    required: false
  }


});

module.exports = mongoose.model('Organization', orgSchema);

