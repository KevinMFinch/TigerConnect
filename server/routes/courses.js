var express = require('express');
var router = express.Router();
var {mongoose} = require('../db/mongoose');
const {Course} = require('../models/Course');


router.get('/', (req, res) => {
  Course.find().then((courses) => {
    res.send(courses);
  })
});

router.get('/:query', (req, res) => {
  // Query contains a number, probably a search like COS333 or COS 333
  var query = decodeURIComponent(req.params.query);
  const oneWordRegexp = /([A-Z]{3})(\d{1,3})/;
  const twoWordRegexp = /([A-Z]{3})(\s+)(\d{1,3})/;
  var matches = []
  if ((matches = oneWordRegexp.exec(query.toUpperCase())) !== null) {
    var department = matches[1];
    var number = matches[2];
    Course.find({department, courseNumber: number}).then((courses) => {
      if (courses.length === 0) {
        return res.json({message: 'No courses found'});
      }
      res.json(courses);
    }, (e) => {
      console.log(e);
    });
  }
  else if ((matches = twoWordRegexp.exec(query.toUpperCase())) !== null) {
    var department = matches[1];
    var number = matches[3];
    Course.find({department, courseNumber: number}).then((courses) => {
      if (courses.length === 0) {
        return res.json({message: 'No courses found'});
      }
      res.json(courses);
    }, (e) => {
      console.log(e);
    });
  } else {
    Course.find().or([
      {name: {$regex: query, $options: 'i'}},
      {courseNumber: {$regex: query}},
      {department: query.toUpperCase()}
    ]).then((courses) => {
      if (courses.length === 0) {
        return res.json({message: 'No courses found'});
      }
      res.json(courses);
    }, (e) => {
      console.log(e);
    })
  }
});

module.exports = router;
