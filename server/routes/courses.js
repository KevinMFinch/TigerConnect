var express = require('express');
var router = express.Router();
var {mongoose} = require('../db/mongoose');

router.get('/', (req, res) => {
  res.json({courses:'/Courses'});
});

module.exports = router;
