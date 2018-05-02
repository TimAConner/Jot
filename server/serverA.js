'use strict';
const express = require('express');
const passport = require('passport');
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const flash = require('express-flash');

const app = express();
const port = process.env.PORT || 8080;

const { generateToken } = require('./authentication/generateToken');

app.set('models', require('../sequelize/models'));

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
}));

require('./authentication/passportTest.js')(passport);
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.authenticate('remember-me'));

app.use(flash());

const login = (req, res, next) => {
  // Note we're using different strategy, this time for logging in
  passport.authenticate('local-login', (err, user, msgObj) => {
    // If login fails, the error is sent back by the passport strategy as { message: "some msg"}
    if(msgObj){
      console.log('error msg?', msgObj);
    }

    if (err) {
      console.log('ERROR ON LOGIN', err);
    } //or return next(err) once handler set up in app.js
    if (!user) {
      console.log('No user object in login()');
    }
    if (user) {
      console.log('Logged in in login()', user);
      console.log('req.user in login()', req.user);
      // req.user = user; 
      // req.user = user;
    }
    // next();

    req.logIn(user, err => {
      if (err) {
        return next(err);
      }
      console.log('authenticated. Rerouting to welcome!', user);
      next();
    });
  })(req, res, next);
};

const register = (req, res, next) => {
  // Note we're using different strategy, this time for logging in
  passport.authenticate('local-signup', (err, user, msgObj) => {
    // If login fails, the error is sent back by the passport strategy as { message: "some msg"}
    console.log('error msg?', msgObj);

    if (err) {
      console.log('ERROR ON SIGN UP', err);
    } //or return next(err) once handler set up in app.js
    if (!user) {
      console.log('SIGN UP');
    }
    if (user) {
      req.user = user;
      console.log(user);
      console.log('LOGGED IN IN SIGN UP');
    }
    next();

    // req.logIn(user, err => {
    //   if (err) {
    //     return next(err);
    //   }
    //   console.log('authenticated. Rerouting to welcome!', user);
    //   req.flash('welcomeBackMsg', `Welcome back, `);
    //   res.redirect('/welcome');
    // });
  })(req, res, next);
};



app.post('/register', register, (req, res, next) => {
  console.log('REGISTERED');
  res.status(201).send('Register Endpoint!');
});

app.use(login, (req, res, next) => {

  console.log('req.user', req.user);

  if (req.user) {
    const { User, Token } = req.app.get("models");

    console.log('logged in');

    const twoWeeksFromNow = new Date(Date.now() + 12096e5).getTime();
    const token = generateToken(64);
    Token.create({
      value: token,
      expire_date: twoWeeksFromNow,
      user_email: req.user.email,
    }).then((newToken, _) => {
      console.log("NEW TOKEN", newToken);
      res.cookie('remember_me', token, { path: '/', httpOnly: true, maxAge: 604800000 }); // 7 days
      res.status(201).send('Logged In');
    });
  } else {
    res.status(201).send('No User!');
  }
});

app.post('/login', (req, res, next) => {
  res.status(201).send('Login Endpoinnt');
});

app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});
