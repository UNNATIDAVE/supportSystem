var router = require('express').Router();

//call the user and ticket controllers
router.use('/',require('./users.js'));
router.use('/user', require('./ticket.js'));

module.exports = router;