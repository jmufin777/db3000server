const { Router} = require('express');
const list = require('./list');
const router = Router();
router.use('/list', list);

module.exports = router ;