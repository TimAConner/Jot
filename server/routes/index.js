'use strict';

const { Router } = require('express');
const router = Router();

// pipe all requests that must be authenticated through auth route
router.use(require('./authRoute'));

router.use(require('./notesRoute'));
router.use(require('./userRoute'));

module.exports = router;
