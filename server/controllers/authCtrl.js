'use strict';
const passport = require('passport');
const path = require('path');

module.exports.logout = (req, res) => {
  req.session.destroy(function (err) {
    res.clearCookie('remember_me');
    res.redirect('/login');
  });
}

module.exports.register = (req, res, next) => {
  if (req.body.password === req.body.confirmation) {
    console.log('Trying to register new user');

    // first argument is name of the passport strategy we created in passport-strat.js
    passport.authenticate('local-signup', (err, user, msgObj) => {
      console.log('Where are we? session.js', user);

      if (err) {
        console.log(err);
      } //or return next(err)
      if (!user) {
        res.status(400).send('No user');
        // return res.render('register', msgObj);
      }

      // Go ahead and login the new user once they are signed up
      req.logIn(user, err => {
        if (err) {
          return next(err);
        }
        console.log('authenticated. Rerouting to welcome page!');

        res.redirect('/loginRouter');
      });
    })(req, res, next);
  } else {
    res.status(400).send('Password & password confirmation do not match');
  }
}

module.exports.renderLogin = (req, res, next) => {
  res.sendFile(path.join(__dirname + '/../../client/login.html'));
};

module.exports.renderHome = (req, res, next) => {
  res.sendFile(path.join(__dirname + '/../../client/index.html'));
};

module.exports.authenticate = () => {
  console.log('in authenticate');
  return passport.authenticate('local-signin', { successRedirect: '/loginRouter', failureRedirect: '/loginRouter', failureFlash: true });
}