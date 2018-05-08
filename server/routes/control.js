var express = require('express');
var router = express.Router();

var {mongoose} = require('../db/mongoose');

const {CourseEvent} = require('../models/CourseEvent');
const {ChatRoom} = require('../models/ChatRoom');

// Used for cleaning the database (for demo day)
router.get('/deleteAll', (req, res) => {
  // Only allow admins to do it
  var admins = ['kfinch', 'lmeng', 'ttahmed', 'jedouard'];
  console.log(admins);
  console.log(req.session.cas.netid);
  if (admins.includes(req.session.cas.netid)) {
    CourseEvent.deleteMany({}).then(() => {
      ChatRoom.deleteMany({}).then(() => {
        console.log('Deleted chat rooms and course events');
        res.send('Deleted chat rooms and course events');
      });
    });
  };
});

module.exports = router;
