var express = require('express');
var router = express.Router();
var {mongoose} = require('../db/mongoose');
const {Course} = require('../models/Course');


router.get('/', (req, res) => {
  Course.find().then((courses) => {
    res.send(courses);
  });
});

router.get('/:query', (req, res) => {
  var query = decodeURIComponent(req.params.query);
  // Matches something like COS333
  const oneWordRegexp = /([A-Z]{3})(\d{1,3})/;
  // Matches something like COS 333
  const twoWordRegexp = /([A-Z]{3})(\s+)(\d{1,3})/;
  var matches = []
  // Check for first case
  if ((matches = oneWordRegexp.exec(query.toUpperCase())) !== null) {
    var department = matches[1];
    var number = matches[2];
    var crossList = department + number;
    Course.find().or([
      { department, courseNumber: {$regex: '^' + number, $options: 'i'} },
      { crossListings: {$regex: crossList, $options: 'i'}}
    ]).then((courses) => {
      if (courses.length === 0) {
        return res.json({message: 'No courses found'});
      }
      res.json(courses);
    }, (e) => {
      console.log(e);
    });
  }
  // Check for second case
  else if ((matches = twoWordRegexp.exec(query.toUpperCase())) !== null) {
    var department = matches[1];
    var number = matches[3];
    var crossList = department + number;
    Course.find().or([
      { department, courseNumber: {$regex: '^' + number, $options: 'i'} },
      { crossListings: {$regex: crossList, $options: 'i'}}
    ]).then((courses) => {
      if (courses.length === 0) {
        return res.json({message: 'No courses found'});
      }
      res.json(courses);
    }, (e) => {
      console.log(e);
    });
  } else {
    // If not a course search, do a regex on the fields of the Course documents.
    Course.find().or([
      {department: query.toUpperCase()},
      {name: {$regex: query, $options: 'i'}},
      {courseNumber: {$regex: query}},
      {crossListings: {$regex: query, $options: 'i'}}
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
