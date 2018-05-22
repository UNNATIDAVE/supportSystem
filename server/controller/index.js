var router = require('express').Router();

router.use('/',require('./users.js'));
router.use('/user', require('./ticket.js'));

module.exports = router;