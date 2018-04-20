var express = require('express');
var router = express.Router();
var {mongoose} = require('../db/mongoose');
var {ObjectID} = require('mongodb');
const {CourseEvent} = require('../models/CourseEvent');

router.get('/', (req, res) => {
  CourseEvent.find().then((courseEvents) => {
    if (!courseEvents) {
      return res.send('No course events');
    }
    return res.send({courseEvents});
  }, (e) => {
    console.log(e);
    res.json({message: 'Error occured when looking for groups'})
  })
});

router.get('/:courseID', (req, res) => {
  var courseID = req.params.courseID;
  if (!ObjectID.isValid(courseID)) {
    return res.status(404).send('Invalid courseID');
  }
  CourseEvent.find({courseID}).then((courseEvents) => {
    if (!courseEvents) {
      return res.json({message: 'No course events for that courseID'});
    }
    return res.json({courseEvents});
  }, (e) => {
    console.log(e);
    res.json({message: 'Error occured when looking for groups'});
  })
});

router.post('/join', (req, res) => {
  var courseEventID = req.body.courseEventID;
  var joiningNetid = req.body.netid;
  if (!ObjectID.isValid(courseEventID)) {
    return res.status(404).send('Invalid courseEventID');
  }

  // Update object to increment members field by one and push netid to array
  var update = {
    $inc: {members: 1},
    $addToSet: {memberNetids: joiningNetid}
  };
  CourseEvent.findByIdAndUpdate(courseEventID, update, {new:true}).then((courseEvent) => {
    if(!courseEvent) {
      return res.json({message: 'No course event with that courseEventID'});
    }
    return res.json(courseEvent);
  }, (e) => {
    console.log(e);
    res.json({message: 'Error when searching for course'});
  });
});

router.post('/', (req, res) => {
  console.log(req.body);
  var {title, advertiser, time, location, description, courseID} = req.body; // ES6 object destructuring
  if (!ObjectID.isValid(courseID)) {
    return res.status(404).send('Invalid courseID');
  }

  var event = new CourseEvent({
    title,
    advertiser,
    time,
    location,
    description,
    courseID,
    memberNetids: [advertiser]
  });

  event.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.send(e);
  });
});

module.exports = router;
