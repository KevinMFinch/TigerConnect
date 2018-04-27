var express = require('express');
var router = express.Router();
var {ObjectID} = require('mongodb');

var {mongoose} = require('../db/mongoose');
const {User} = require('../models/User');
const {CourseEvent} = require('../models/CourseEvent');
const {Course} = require('../models/Course');

router.get('/groups/:netid', (req, res) => {
  var netid = req.params.netid;

  CourseEvent.find(
    {memberNetids: netid}
  ).then((events) => {
    res.json(events);
  }, (e) => {
    console.log(e);
    res.sendStatus(500);
  })
});

router.get('/pinnedCourses/:netid', (req, res) => {
  var netid = req.params.netid;

  User.findOne({netid}).then((user) => {
    if (!netid) {
      return res.json({message: "no user found with that netid"});
    }
    var pinnedIDs = user.pinnedCourses;
    var objectIDs = []
    pinnedIDs.forEach((id) => {
      objectIDs.push(new ObjectID(id));
    });

    Course.find({
      '_id': { $in: objectIDs}
    }).then((courses) => {
      res.json(courses);
    }, (e) => {
      res.sendStatus(500);
    });
  }, (e) => {
    console.log(e);
    res.sendStatus(500);
  })
});

router.get('/:netid', (req, res) => {
  var netid = req.params.netid;
  console.log(req);
  User.findOne({netid}).then((user) => {
    if (!user) {
      return res.json({message: "no user found"});
    }
    res.json(user);
  }, (e) => {
    res.status(404).send(e);
  });
});

router.get('/', (req, res) => {
  User.find({}).then((users) => {
    if (!users) {
      return res.json({message: "No users"});
    } else {
      res.json(users);
    }
  }, (e) => {
    console.log('error');
    res.send(e);
  });
});

router.post('/pincourse', (req, res) => {
  var netid = req.body.netid;
  var courseID = req.body.courseID;

  if (!ObjectID.isValid(courseID)) {
    return res.status(404).send('Invalid courseID');
  }

  User.findOneAndUpdate(
    {netid},
    {$addToSet: {pinnedCourses: courseID}},
    {new:true}
  ).then((user) => {
    console.log(user);
    res.json(user);
  }, (e) => {
    res.sendStatus(500);
  });
});

module.exports = router;
