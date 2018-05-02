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

// This custom middleware adds the logged-in user's info to the 'locals' variable,
// so we can access it in the Pug templates
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(flash());

const login = (req, res, next) => {
  // Note we're using different strategy, this time for logging in
  passport.authenticate('local-signin', (err, user, msgObj) => {
    // If login fails, the error is sent back by the passport strategy as { message: "some msg"}
    console.log('user in login', user);
    console.log('error msg?', msgObj);

    if (err) {
      console.log(err);
    } //or return next(err) once handler set up in app.js
    if (!user) {
      return res.status(201).send('Login Failure');
    }

    req.logIn(user, err => {
      if (err) {
        return next(err);
      }
      console.log('authenticated. Rerouting to welcome!', user);

      const { Token } = req.app.get("models");
      
      const twoWeeksFromNow = new Date(Date.now() + 12096e5).getTime();
      const token = generateToken(64);
      Token.create({
        value: token,
        expire_date: twoWeeksFromNow,
        user_email: user.email,
      }).then((newToken, _) => {
        console.log('GENERATE TOKEN FROM req.login', token);
        res.cookie('remember_me', token, { path: '/', httpOnly: true, maxAge: 604800000 }); // 7 days
        res.status(201).send('Login Success');
      });


    });
  })(req, res, next);
};

app.post('/login', login);

// Add a 404 error handler
// Add error handler to pipe all server errors to from the routing middleware

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
