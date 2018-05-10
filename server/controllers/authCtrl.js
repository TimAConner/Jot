'use strict';
const passport = require('passport');
const path = require('path');
const jwt = require('jsonwebtoken');



module.exports.logout = (req, res, next) => {
  req.session.destroy(function (err) {
    res.clearCookie('remember_me');
    module.exports.loginFailure(req, res, next);
  });
}

module.exports.login = function (req, res, next) {
  passport.authenticate('login', { session: false }, (err, user, info) => {
    if (err || !user) {
      next(err);
    }
    req.login(user, { session: false }, (err) => {
      if (err) {
        res.send(err);
      }
      // generate a signed son web token with the contents of user object and return it in the response
      const token = jwt.sign(user, "363F73AF69F990568B3F5BA68C89546B66BB86BD462465283A08C51AABB7C06");
      return res.json({ user, token });
    });
  })(req, res, next);
};

module.exports.register = (req, res, next) => {
  if (req.body.password === req.body.confirm) {

    // first argument is name of the passport strategy we created in passport-strat.js
    passport.authenticate('register', { session: false }, (err, user, info) => {
      if (err) {
        err.status = 400;
        next(err);
      }

      if (!user) {
        const error = new Error('User could not be logged in after creation.');
        return next(error);
      }

      req.login(user, { session: false }, (err) => {
        if (err) {
          next(err);
        }

        // generate a signed son web token with the contents of user object and return it in the response
        const token = jwt.sign(user, "363F73AF69F990568B3F5BA68C89546B66BB86BD462465283A08C51AABB7C06");
        return res.json({ user, token });
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
  // return passport.authenticate('local-signin', { successRedirect: '/loginRouter', failureRedirect: '/loginRouterB', failureFlash: true });
}