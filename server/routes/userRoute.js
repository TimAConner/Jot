'use strict';

const { Router } = require('express');
const router = Router();
const passport = require('passport');
const { isLoggedIn } = require('./routeHelpers');

const {
  getUserInfo,
} = require('../controllers/userCtrl.js');

router.get('/currentUser/', isLoggedIn, getUserInfo);

module.exports = router;