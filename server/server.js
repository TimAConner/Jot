'use strict';

const express = require('express');
const app = express();
const passport = require('passport')
var session = require('express-session');
let bodyParser = require('body-parser');
// flash depend on session module to set temp values that persist briefly so we can set a value, kick off a new request, then have that value accessible on the request
const flash = require('express-flash');
const cookieParser = require('cookie-parser');
const path = require('path');

const { createToken } = require('./helpers');

const port = process.env.PORT || 8080;

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated() && (req.user)) {
    return next();
  } else {

    /* Go to login page */
    res.redirect('/loginRouter');
  }
}

app.set('models', require('../sequelize/models'));

// let routes = require('./routes/');

// Begin middleware stack
// Inject session persistence into middleware stack
app.use(session({
  secret: '254bd6709c025dc4044c08290386ec60',
  resave: true,
  saveUninitialized: true
})); // session secret

app.use(cookieParser());

//execute passport strategies file
require('./authentication/passport-strat.js');
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(passport.authenticate('remember-me'));
app.use(flash());

app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(flash());



app.get('/logout', (req, res) => {
  req.session.destroy(function (err) {
    res.clearCookie('remember_me');
    res.status(201).send('Logged out');
  });
});

app.post('/register', (req, res, next) => {
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
});

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

app.get('/login',
  (req, res, next) => {
    res.sendFile(path.join(__dirname + '/../client/login.html'));
  });

// TOOD: Look into failure rediret.  That might be one of the issues.
app.post('/', passport.authenticate('local-signin', { successRedirect: '/loginRouter', failureRedirect: '/loginRouter', failureFlash: true }));


// TODO: Right now if you login with a cookie, it goes to check.  How can i do this differently?
// Possibly have a middleware that checks if login failed but if req.user has info on it?

// '/loginRouter' is used to see if a user is logged in instead of built in express because
// express hijacks remmeber-me and says the user has not sent in credentials
// even if a cook with information is found
// since the request object is blank when the user comes to the page without loggin in
app.get('/loginRouter', createCookie, (req, res, next) => {
  if (!req.user) {
    res.redirect('/login');
  }
  res.sendFile(path.join(__dirname + '/../client/index.html'));
});

app.get('/', isLoggedIn, (req, res) => {
  res.sendFile(path.join(__dirname + '/../client/index.html'));
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
