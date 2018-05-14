'use strict';

const express = require('express');
const app = express();
const passport = require('passport')
const bodyParser = require('body-parser');

const jwt = require('jsonwebtoken');

// flash depend on session module to set temp values that persist briefly so we can set a value, kick off a new request, then have that value accessible on the request
const path = require('path');

const routes = require('./routes');

const port = process.env.PORT || 8080;

app.set('models', require('../sequelize/models'));


app.use((req, res, next) => {
  console.log('req:', req.method);
  // req.body = { email: 'a@a.com', password: 'password123' };
  next();
});

app.options("/*", function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS,PATCH');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, dataType, contentType');
  res.status(200).json();
});

// LEFT OFF
// the user is serialized
// successRedirect is called
// but it never desserializing and sends it through
// enable and disalbe headers in the post

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Credentials', true);
  res.header("Access-Control-Allow-Headers", "Origin, X-AUTHENTICATION, X-Requested-With, X-IP, Content-Type, Accept, dataType, contentType");
  next();
});

// // Begin middleware stack
// app.use(session({
//   secret: '254bd6709c025dc4044c08290386ec60',
//   resave: true,
//   saveUninitialized: true,
//   // cookie : { secure : true, maxAge : (4 * 60 * 60 * 1000) }, // 4 hours
// }));
// app.use(cookieParser());

require('./authentication/passport-strat.js');
// app.use(passport.initialize());
// app.use(passport.session());
// // app.use(passport.authenticate('remember-me'));
// app.use(flash());

// app.use((req, res, next) => {
//   res.locals.session = req.session;
//   next();
// }); 



app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  console.log('req.body:', req.body);
  // req.body = { email: 'a@a.com', password: 'password123' };
  next();
});

// app.use(flash());

app.use(routes);

// app.use(express.static(path.join(__dirname, '../build')));


app.use(({ status = 500, message = "Internal Server Error" }, req, res, next) => {
  console.log('ERROR', status, message)
  res.status(status).json(message);
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
