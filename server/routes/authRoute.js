'use strict';

const { Router } = require('express');
const router = Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');


// const
const {
  logout,
  register,
  loginSuccess,
  authenticate,
} = require('../controllers/authCtrl.js');

// const { createToken } = require('../helpers');
const { isLoggedIn } = require('./routeHelpers');

// const createCookie = (req, res, next) => {
//   const { Token } = req.app.get('models');
//   createToken(req.user).then((newToken, _) => {

//     // TODO: make sure that tokens are deleted after they are used.  How should this be done/
//     // Somehow by default a token is generated and the consume route is not taken, which 
//     // creates more tokens.
//     res.cookie('remember_me', newToken.value, { path: '/', httpOnly: true, maxAge: 604800000 }); // 7 days
//     next()
//   });
// };

// new user
router.post('/logout', logout);
router.post('/register', register);

// When you go to /, it will run the passport authenticatoin code
router.post('/login', function (req, res, next) {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    console.log(err);
    if (err || !user) {
      next(err);
    }
    req.login(user, { session: false }, (err) => {
      if (err) {
        res.send(err);
      }
      // generate a signed son web token with the contents of user object and return it in the response
      const token = jwt.sign(user, 'your_jwt_secret');
      return res.json({ user, token });
    });
  })(req, res);
});

// router.get('/user', passport.authenticate('jwt', {session: false}), (req, res, next) =>  {
//   res.json(200).json('YOURE IN USER');
// });


// router.get('/loginRouter', (req, res, next) => {
//   console.log('success login from passport');
//   console.log(req.body, req.user);
//   console.log('req.session', req.session);
//   next();
// }, isLoggedIn, createCookie, loginSuccess);
// router.get('/loginRouterB', (req, res, next) => {
//   console.log('failure login from passport');
//   console.log(req.body, req.user);
//   console.log('req.session', req.session);
//   next();
// }, isLoggedIn, createCookie, loginSuccess);

// '/jot' is used to see if a user is logged in instead of built in express because
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