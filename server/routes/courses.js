var express = require('express');
var router = express.Router();
var _ = require('lodash');

var {ObjectID} = require('mongodb');
var {mongoose} = require('../db/mongoose');
const {Course} = require('../models/Course');

// _GET all courses in database
router.get('/', (req, res) => {
  Course.find().then((courses) => {
    res.send(courses);
  });
});

// _GET courses by courseID
router.get('/byID/:courseID', (req, res) => {
  var courseID = req.params.courseID;

  if (!ObjectID.isValid(courseID)) {
    res.sendStatus(400);
  }

  Course.findById(courseID).then((course) => {
    if (!course) {
      return res.json({message: "No course with that ID"});
    }
    res.json(course);
  }, (e) => {
    console.log(e);
    res.sendStatus(500);
  });
});

// _GET courses based on search query
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
    var promises = [];
    promises.push(Course.find({department: query.toUpperCase()}));
    promises.push(Course.find({name: {$regex: query, $options: 'i'}}));
    promises.push(Course.find({courseNumber: {$regex: query}}));
    promises.push(Course.find({crossListings: {$regex: query, $options: 'i'}}));

    Promise.all(promises).then((courses) => {
      // Lodash function to get unique values
      res.json(_.unionWith(courses[0], courses[1], courses[2], courses[3], _.isEqual));
    });
  }
});

module.exports = router;
