var express = require('express');
var router = express.Router();
var {mongoose} = require('../db/mongoose');
const {CourseEvent} = require('../models/CourseEvent');

router.get('/', (req, res) => {
  CourseEvent.find().then((courseEvents) => {
    if (!courseEvents) {
      return res.send('No course events');
    }
    return res.send({courseEvents});
  })
});

router.post('/', (req, res) => {
  var event = new CourseEvent({
    advertiser: 'kfinch',
    time: 'Monday at 6pm',
    location: 'Butler ISpace',
    description: 'Lets work on the 340 pset',
    course: 'COS 340'
  });

  event.save().then((doc) => {
    res.send(doc);
  }, (e) => {
    res.status(400).send(e);
  });
});

module.exports = router;
