'use strict';

const { Router } = require('express');
const router = Router();
const passport = require('passport');
const { isLoggedIn } = require('./routeHelpers');


const {
  fetchUser,
  updateOption,
} = require('../controllers/userCtrl.js');

router.get('/currentUser/', isLoggedIn(), fetchUser);
router.patch('/currentUser/', isLoggedIn(), updateOption);

module.exports = router;