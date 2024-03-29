var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
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
    firstname: {
      type: String,
      required: true,
      unique: false,
    },
    lastname: {
      type: String,
      required: true,
      unique: false,
    },
    birthdate: {month: String, day: Number, year: Number},
    email: {
      type: String,
      required: true,
      unique: false,
    },
    profession: {
      type: String,
      required: false,
      unique: false,
    },
    gender: {
      type: String,
      required: true,
      unique: false,
    },
    address: {
      type: String,
      required: true,
      unique: false,
    },
    age: {
      type: Number,
      required: true,
      unique: false,
    },
    type:{
      type: String,
      required: true,
      unique: false,
    },
    profilePic:{
      type:String,
      required: true,
      default: 'profile.png'
    },
    school:{
      type: String,
      requried:false
    }
    
    
  });

  module.exports = mongoose.model('regUser', userSchema);

