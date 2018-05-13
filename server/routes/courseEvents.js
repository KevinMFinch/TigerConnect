var express = require('express');
var router = express.Router();
var {mongoose} = require('../db/mongoose');
var {ObjectID} = require('mongodb');
const {CourseEvent} = require('../models/CourseEvent');
const {Course} = require('../models/Course');
const {ChatRoom} = require('../models/ChatRoom');

// courseEvents connotes "groups"

// _GET all groups
router.get('/', (req, res) => {
  CourseEvent.find().sort({members: -1}).then((courseEvents) => {
    if (!courseEvents) {
      return res.send('No course events');
    }
    return res.send({courseEvents});
  }, (e) => {
    console.log(e);
    res.json({message: 'Error occured when looking for groups'})
  })
});

// _GET group by id
router.get('/byID/:courseEventID', (req, res) => {
  var courseEventID = req.params.courseEventID;

  if (!ObjectID.isValid(courseEventID)) {
    return res.json({message: "no course event with that ID"});
  }

  CourseEvent.findOne({_id: courseEventID}).then((event) => {
    if (!event) {
      return res.json({message: "no course event with that ID"});
    }
    res.json(event);
  }, (e) => {
    console.log(e);
    res.sendStatus(500);
  });
});

// _GET groups for specific courseID
router.get('/:courseID', (req, res) => {
  var courseID = req.params.courseID;
  if (!ObjectID.isValid(courseID)) {
    return res.status(404).send('Invalid courseID');
  }
  CourseEvent.find({courseID}).sort({timeCreated: -1, members: -1}).then((courseEvents) => {
    if (!courseEvents) {
      return res.json({message: 'No course events for that courseID'});
    }
    return res.json({courseEvents});
  }, (e) => {
    console.log(e);
    res.json({message: 'Error occured when looking for groups'});
  })
});

// _POST create new group
router.post('/', (req, res) => {
  console.log(req.body);
  var {title, advertiser, time, location, description, courseID} = req.body; // ES6 object destructuring
  if (!ObjectID.isValid(courseID)) {
    return res.status(404).send('Invalid courseID');
  }

  Course.findById(courseID).then((course) => {
    if (!course) {
      return res.json({message: "Course not found for that ID"});
    }
    var event = new CourseEvent({
      title,
      advertiser,
      time,
      location,
      description,
      courseID,
      courseName: course.department + course.courseNumber,
      memberNetids: [advertiser]
    });

    event.save().then((doc) => {
      res.send(doc);
    }, (e) => {
      res.send(e);
    });

  });
});

// _DELETE a group
router.delete('/deleteGroup/:courseEventID', (req, res) => {
  console.log('params', req.params);
  var courseEventID = req.params.courseEventID;
  if (!ObjectID.isValid(courseEventID)) {
    return res.status(404).send('Invalid courseEventID');
  }
  // Delete course event and also a chat room associated with it
  CourseEvent.findOneAndRemove({_id: courseEventID}, function (err) {
    ChatRoom.findOneAndRemove({roomID: courseEventID}, function(err) {
      if (err) {
        console.log(err);
      }
    });
    if (err) {
      console.log(err);
    }
    res.json({'message': 'Deleted'});
  });
});

// _POST join a group
router.post('/join', (req, res) => {
  var courseEventID = req.body.courseEventID;
  var joiningNetid = req.body.netid;
  if (!ObjectID.isValid(courseEventID)) {
    return res.status(404).send('Invalid courseEventID');
  }

  // Update object to increment members field by one and push netid to array
  var update = {
    $addToSet: {memberNetids: joiningNetid},
  };
  CourseEvent.findByIdAndUpdate(courseEventID, update, {new:true}).then((courseEvent) => {
    if(!courseEvent) {
      return res.json({message: 'No course event with that courseEventID'});
    }
    console.log(courseEvent);
    courseEvent.members = courseEvent.memberNetids.length;
    console.log(courseEvent);
    courseEvent.save();
    return res.json(courseEvent);
  }, (e) => {
    console.log(e);
    res.json({message: 'Error when searching for course'});
  });
});

// _POST leave a group
router.post('/leave', (req, res) => {
  var courseEventID = req.body.courseEventID;
  var netid = req.body.netid;
  console.log(netid);
  console.log(courseEventID);

  if (!ObjectID.isValid(courseEventID)) {
    return res.status(404).send('Invalid courseEventID');
  }

  CourseEvent.findOne({_id: courseEventID}).then((event) => {
    var memberNetids = event.memberNetids;

    memberNetids = memberNetids.filter((item) => {
      return item != netid;
    });
    console.log(memberNetids);
    event.memberNetids = memberNetids;
    event.members = event.memberNetids.length;
    event.save();
    res.json(event);
  }, (e) => {
    console.log(e);
    res.sendStatus(500);
  });
})

module.exports = router;
