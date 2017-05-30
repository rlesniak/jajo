const express = require('express');
const session = require('express-session');

const passport = require('passport');
const passportLocal = require('passport-local');

const mongoose = require('mongoose');

const config = require('./config');
const router = require('./routes');

const sessionHandler = require('./handlers/session');

const PORT = 3001;

/**
 * Connect with mongo database.
 * @method connectWithMongo
 * @returns {void}
 */
function initMongoConnection() {
  mongoose.connect(config.mongodb);
  mongoose.Promise = Promise;
  const connection = mongoose.connection;

  connection.on('error', () => {
    throw Error('Database connection error');
  });
}

/**
 * Configure passport middleware.
 * @method configurePassport
 * @returns {void}
 */
function configurePassport() {
  passport.use('local', new passportLocal.Strategy({
    usernameField: 'email',
    session: true,
  },
    sessionHandler.authenticate
  ));

  passport.serializeUser(sessionHandler.serializeUser);
  passport.deserializeUser(sessionHandler.deserializeUser);

  app.use(passport.initialize());
  app.use(passport.session());
}

const app = express();
app.use(session({
  secret: config.secret,
  resave: true,
  saveUninitialized: false,
}));

/* Init application */

configurePassport();
initMongoConnection();

app.use('/', router);

app.listen(PORT, () => {
  console.info(`Server listen on port: ${PORT}`);
})
