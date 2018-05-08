'use strict';
const passport = require('passport');
const path = require('path');



module.exports.logout = (req, res, next) => {
  req.session.destroy(function (err) {
    res.clearCookie('remember_me');
    module.exports.loginFailure(req, res, next);
  });
}

module.exports.register = (req, res, next) => {
  if (req.body.password === req.body.confirm) {

    // first argument is name of the passport strategy we created in passport-strat.js
    passport.authenticate('local-signup', (err, user, msgObj) => {

      if (err) {
        err.status = 400;
        return next(err);
      }
      if (!user) {
        const error = new Error('User could not be logged in after creation.');
        return next(error);
      }

      // Go ahead and login the new user once they are signed up
      req.logIn(user, err => {
        if (err) {
          return next(err);
        }
        res.redirect('/loginRouter');
      });
    })(req, res, next);
  } else {
    const error = new Error('Passwords did not match.');
    error.status = 400;
    return next(error);
  }
}

module.exports.loginFailure = (req, res, next) => {
  const error = new Error('Please login');
  error.status = 401;
  next(error);
};

module.exports.loginSuccess = (req, res, next) => {
  const { password, creation_date, ...rest } = req.user;
  res.status(200).json(rest);
};

module.exports.authenticate = () => {
  return passport.authenticate('local-signin', { successRedirect: '/loginRouter', failureRedirect: '/loginRouter', failureFlash: true });
}