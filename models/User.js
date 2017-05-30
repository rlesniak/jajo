/**
 * User model.
 * @module Models/User
 * @copyright (c) 2017-present RL
 */

const mongoose = require('mongoose');
const validators = require('validator');

const userSchema = new mongoose.Schema({
    username: {
      type: String,
    },
    email: {
      type: String,
      unique : true,
      dropDups: true,
      validate: {
        validator: function(email) {
          return validators.isEmail(email);
        },
      },
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
});

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;
