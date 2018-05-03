'use strict';

const { Router } = require('express');
const router = Router();
const passport = require('passport');
const { isLoggedIn } = require('./routeHelpers');

const {
  getOneNote,
  getAllNotes,
} = require('../controllers/noteCtrl.js');

router.get('/notes/:id', isLoggedIn, getOneNote);
router.get('/notes/', isLoggedIn, getAllNotes);

module.exports = router;