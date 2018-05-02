'use strict';

const { Router } = require('express');
const router = Router();

// pipe all other requests through the route modules
router.use(require('./authRoute'));

module.exports = router;
