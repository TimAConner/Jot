'use strict';

const passport = require('passport');
const jwt = require('jsonwebtoken');

module.exports.isLoggedIn = () => passport.authenticate('jwt', {session: false});