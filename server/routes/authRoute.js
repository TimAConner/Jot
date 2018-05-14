'use strict';

const { Router } = require('express');
const router = Router();

const {
  logout,
  register,
  login,
} = require('../controllers/authCtrl.js');

const { isLoggedIn } = require('./routeHelpers');

router.post('/logout', logout);
router.post('/register', register);
router.post('/login', login);

module.exports = router;