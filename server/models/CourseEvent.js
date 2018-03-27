var mongoose = require('mongoose');

var CourseEvent = mongoose.model('CourseEvent', {
  advertiser: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  time: {
    type: String,
    required: false,
    trim: true
  },
  location: {
    type: String,
    required: false,
    minlength: 1,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  course: {
    type: String, // Will most likely be the _id of the course that corresponds to this course in the courses collection
    required: true,
    trim: true
  }
});

module.exports = {CourseEvent};
