const express = require('express');
const passport = require('passport');

const sessionHandlers = require('./handlers/session');

const UserModel = require('./models/User');
const RecsController = require('./controllers/Recs');

const router = express.Router();

const isLoggedIn = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    if (req.session) {
      req.session.destroy(function() {
        res.clearCookie('connect.sid', { path: '/' });
        res.status(401);
        res.json({});
      });
    } else {
      res.status(401);
      res.json({});
    }
  }
}

/**
* Check user session.
* @route session
*/
router.get('/session', isLoggedIn, (req, res) => {
  const { username, email, _id, tags } = req.user;
  res.json({ _id, username, email, tags });
});

router.delete('/session', (req, res) => {
  if (req.session) {
     req.session.destroy(function() {
       res.clearCookie('connect.sid', { path: '/' });
       res.json({});
     });
 } else {
   res.json({})
   res.status(500);
  }
});


/**
* Register user in application.
* @route register
*/
router.post('/login', passport.authenticate('local'), async (req, res) => {
  const { email } = req.body;
  const user = await UserModel.findOne({ email }, 'username email');
  res.json(user);
});

/**
* Register user in application.
* @route register
*/
router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  try {
    await sessionHandlers.createUser(email, password);

    const user = await UserModel.findOne({ email }, 'email');
    res.json(user);
  } catch (err) {
    console.log(err);
    res.status(422);
    res.send({});
  }
});

router.put('/me', isLoggedIn, async (req, res) => {
  const { tags } = req.body;
  const { _id } = req.user;

  try {
    UserModel.findOneAndUpdate({ _id }, {
      $set: { tags }
    }, { new: true }, (err, event) => {

      res.json(event);
    });
  } catch (err) {
    res.status(422);
  };
});

router.get('/recs', isLoggedIn, RecsController.get);

module.exports = router;
