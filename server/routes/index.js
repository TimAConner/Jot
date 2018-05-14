'use strict';

const { Router } = require('express');
const router = Router();

router.use(require('./authRoute'));
router.use(require('./notesRoute'));
router.use(require('./userRoute'));

module.exports = router;
