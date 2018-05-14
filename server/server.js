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

app.options("/*", function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS,PATCH');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, dataType, contentType');
  res.status(200).json();
});

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.header('Access-Control-Allow-Credentials', true);
  res.header("Access-Control-Allow-Headers", "Origin, X-AUTHENTICATION, X-Requested-With, X-IP, Content-Type, Accept, dataType, contentType");
  next();
});

require('./authentication/passport-strat.js');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(routes);

app.use(({ status = 500, message = "Internal Server Error" }, req, res, next) => {
  console.log('ERROR', status, message)
  res.status(status).json(message);
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
