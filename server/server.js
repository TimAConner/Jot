'use strict';

const express = require('express');
const app = express();
const passport = require('passport')
var session = require('express-session');
let bodyParser = require('body-parser');
// flash depend on session module to set temp values that persist briefly so we can set a value, kick off a new request, then have that value accessible on the request
const flash = require('express-flash');
const cookieParser = require('cookie-parser');

const { generateToken } = require('./authentication/generateToken');

const port = process.env.PORT || 8080;

// app.use(express.static(__dirname + "/client"));

app.set('models', require('../sequelize/models'));

// let routes = require('./routes/');

// Begin middleware stack
// Inject session persistence into middleware stack
app.use(session({
  secret: 'keyboard cat',
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

        res.status(400).send('Registered and authenticated!');
      });
    })(req, res, next);
  } else {
    res.status(400).send('Password & password confirmation do not match');
  }
});

// TOOD: Look into failure rediret.  That might be one of the issues.
app.post('/login', passport.authenticate('local-signin', { failureRedirect: '/error', failureFlash: true }),
  function (req, res, next) {
    // issue a remember me cookie if the option was checked
    if (!req.body.remember_me) { return next(); }

    const { Token } = req.app.get('models');

    const twoWeeksFromNow = new Date(Date.now() + 12096e5).getTime();
    const token = generateToken(64);
    Token.create({
      value: token,
      expire_date: twoWeeksFromNow,
      user_email: req.user.email,
    }).then((newToken, _) => {

      // TODO: make sure that tokens are deleted after they are used.  How should this be done/
      // Somehow by default a token is generated and the consume route is not taken, which 
      // creates more tokens.
      console.log('GENERATE TOKEN FROM req.login', token);
      res.cookie('remember_me', token, { path: '/', httpOnly: true, maxAge: 604800000 }); // 7 days
      res.status(201).send('Login Success');
    });
  },
  function (req, res) {
    console.log('Already logged in?');
    console.log(req.user);
    res.redirect('/');
  });

app.get('/', (req, res, next) => {
  res.status(201).send('Logged in but no remember me');
});

// TODO: Right now if you login with a cookie, it goes to error.  How can i do this differently?
// Possibly have a middleware that checks if login failed but if req.user has info on it?
app.get('/error', (req, res) => {
  console.log("Error", req.user);
  res.status(201).send('Went to get /login');
});

app.get('/login',
  (req, res, next) => {
    console.log("GET /LOGIN USER", req.user);
    res.status(201).send('Went to get /login');
  });

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
