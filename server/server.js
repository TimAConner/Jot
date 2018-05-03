'use strict';

const express = require('express');
const app = express();
const passport = require('passport')
const session = require('express-session');
const bodyParser = require('body-parser');

// flash depend on session module to set temp values that persist briefly so we can set a value, kick off a new request, then have that value accessible on the request
const flash = require('express-flash');
const cookieParser = require('cookie-parser');
const path = require('path');

const routes = require('./routes');

const port = process.env.PORT || 8080;

app.set('models', require('../sequelize/models'));

// Begin middleware stack
app.use(session({
  secret: '254bd6709c025dc4044c08290386ec60',
  resave: true,
  saveUninitialized: true
}));
app.use(cookieParser());

require('./authentication/passport-strat.js');
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.authenticate('remember-me'));
app.use(flash());

app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(flash());

app.use(routes);

app.use((err, req, res, next) => {
  err = err || new Error("Internal Server Error");
  res.status(err.status || 500).json({ error: err.message });
});

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
