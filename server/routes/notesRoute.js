'use strict';

const { Router } = require('express');
const router = Router();
const passport = require('passport');
const { isLoggedIn } = require('./routeHelpers');

const {
  getNote,
} = require('../controllers/noteCtrl.js');

router.get('/note/:id', isLoggedIn, getNote);

module.exports = router;