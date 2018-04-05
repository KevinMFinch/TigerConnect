var express = require('express');
var router = express.Router();
var {mongoose} = require('../db/mongoose');
const {Course} = require('../models/Course');


router.get('/', (req, res) => {
  Course.find().then((courses) => {
    res.send(courses);
  })
});

module.exports = router;
