var express = require('express');
var router = express.Router();
var {ObjectID} = require('mongodb');

var {mongoose} = require('../db/mongoose');
const {User} = require('../models/User');
const {CourseEvent} = require('../models/CourseEvent');
const {Course} = require('../models/Course');

/* ============ USERS ============ */

// _GET all users
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

// _GET user with netid
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


/* ============ GROUPS ============ */

// _GET all groups (created AND joined) for user with netid
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

// _GET groups (ONLY created) by user with netid
router.get('/createdGroups/:netid', (req, res) => {
  var netid = req.params.netid;

  CourseEvent.find({advertiser: netid}).then((events) => {
    res.json({events});
  }, (e) => {
    console.log(e);
    res.sendStatus(500);
  });
});

// _GET groups (ONLY joined) by user with netid
router.get('/joinedGroups/:netid', (req, res) => {
  var netid = req.params.netid;
  // Groups that a user is in but has not created
  CourseEvent.find({
    memberNetids: {$in: [netid]},
    advertiser: {$ne: netid}
  }).then((events) => {
    res.json({events});
  });
});


/* ============ PINNED ============ */

// _POST user's current pinned bar expansion state
router.post('/setPinnedExpanded', (req, res) => {
  var netid = req.body.netid;
  var expanded = req.body.expanded;
  expanded = (expanded === 'true');

  console.log(netid);
  console.log(expanded);

  User.findOne({netid}).then((user) => {
    if (!netid) {
      return res.json({message: "No user found with that netid"});
    }
    user.pinnedExpanded = expanded;
    user.save();
    res.json(user);
  }, (e) => {
    console.log(e);
    res.sendStatus(500);
  });
});

// _GET user's most recent pinned bar expansion state
router.get('/getPinnedExpanded/:netid', (req, res) => {
  var netid = req.params.netid;

  User.findOne({netid}).then((user) => {
    if (!netid) {
      return res.json({message: "No user found with that netid"});
    }
    res.json({pinnedExpanded: user.pinnedExpanded});
  }, (e) => {
    console.log(e);
    res.sendStatus(500);
  });
});

// _GET courses pinned by user with netid
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

// _POST pin course for user netid
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

// _POST unpin course for user netid
router.post('/unpincourse', (req, res) => {
  var netid = req.body.netid;
  var courseID = req.body.courseID;
  console.log(netid);
  console.log(courseID);

  if (!ObjectID.isValid(courseID)) {
    return res.status(404).send('Invalid courseID');
  }

  User.findOneAndUpdate(
    {netid},
    {$pull : {pinnedCourses: courseID}},
    {new:true}
  ).then((user) => {
    console.log(user);
    res.json(user);
  }, (e) => {
    res.sendStatus(500);
  });
});

module.exports = router;
