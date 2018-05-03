'use strict';

const { Router } = require('express');
const router = Router();
const passport = require('passport');
// const
const {
  logout,
  register,
  renderLogin,
  renderHome,
  authenticate,
} = require('../controllers/authCtrl.js');

const { createToken } = require('../helpers');
const { isLoggedIn } = require('./routeHelpers');

const createCookie = (req, res, next) => {
  const { Token } = req.app.get('models');
  createToken(req.user).then((newToken, _) => {

    // TODO: make sure that tokens are deleted after they are used.  How should this be done/
    // Somehow by default a token is generated and the consume route is not taken, which 
    // creates more tokens.
    res.cookie('remember_me', newToken.value, { path: '/', httpOnly: true, maxAge: 604800000 }); // 7 days
    next()
  });
};

// new user
router.get('/logout', logout);
router.post('/register', register);
router.get('/login', renderLogin);

// When you go to /, it will run the passport authenticatoin code
router.post('/', authenticate());
router.get('/', authenticate());
router.get('/loginRouter', isLoggedIn, createCookie, renderHome);

// '/loginRouter' is used to see if a user is logged in instead of built in express because
// express hijacks remmeber-me and says the user has not sent in credentials
// even if a cook with information is found
// since the request object is blank when the user comes to the page without loggin in
// TODO: Change login router to say something else in search bar
// router.get('/notes', isLoggedIn, createCookie, (req, res, next) => {

//   console.log(req.user);
//   res.status(200).json({
//     "value": "25"
//   });
// });

module.exports = router;