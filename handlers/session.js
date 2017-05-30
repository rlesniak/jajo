/**
 * Session handlers.
 * @module Handlers/Session
 * @copyright (c) 2017-present RL
 */

const bcrypt = require('bcrypt-nodejs');
const uuid = require('uuid/v4');

const UserModel = require('../models/User');

/**
 * Serialize user into session object.
 * @method serializeUser
 * @param {object} user User object.
 * @param {function} done Sucess callback.
 */
function serializeUser(user, done) {
  done(null, user.id);
}

/**
 * Deserialize user based on session object.
 * @method deserializeUser
 * @param {string} id User identifier.
 * @param {function} done Sucess callback.
 */
function deserializeUser(id, done) {
  UserModel.findById(id, (error, user) => {
      if (error) return done(error);
      done(null, user);
  });
}

/**
 * Create application user.
 * @method createUser
 * @param {string} email E-mail address.
 * @param {string} password User password.
 * @async
 */
async function createUser(email, password) {
  const salt = bcrypt.genSaltSync();
  const password_hash = bcrypt.hashSync(password, salt);

  const user = new UserModel({
     username: uuid(),
     password: password_hash,
     email
  });

  return await user.save();
};

/**
* Authorize user in application.
* @method authenticate
* @param {string} email User email.
* @param {string} password User password.
* @param {Function} done Callback function.
*/
function authenticate(email, password, done) {
  UserModel.findOne({ email }, (error, user) => {
     if (error) return done(error);
     if (!user) return done(null, false);

     const syncPassword = bcrypt.compareSync(password, user.password);
     if (!syncPassword) return done(null, false);
     return done(null, user);
  });
};

module.exports = {
  authenticate,
  createUser,
  serializeUser,
  deserializeUser,
};
