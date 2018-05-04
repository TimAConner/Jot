'use strict';

const { Router } = require('express');
const router = Router();
const passport = require('passport');
const { isLoggedIn } = require('./routeHelpers');

const {
  getOneNote,
  getAllNotes,
  deleteNote,
  saveNote,
} = require('../controllers/noteCtrl.js');

router.get('/notes/:id', isLoggedIn, getOneNote);
router.delete('/notes/:id', isLoggedIn, deleteNote);
router.put('/notes/:id', isLoggedIn, saveNote);

router.get('/notes/', isLoggedIn, getAllNotes);

module.exports = router;