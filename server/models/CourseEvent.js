var mongoose = require('mongoose');

var CourseEvent = mongoose.model('CourseEvent', {
  title: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
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
    required: false,
    trim: true
  },
  courseID: {
    type: String, // Will most likely be the _id of the course that corresponds to this course in the courses collection
    required: true,
    trim: true
  },
  timeCreated: {
    type: Date,
    required: true,
    default: Date.now
  },
  members: {
    type: Number,
    required: true,
    default: 1
  },
  memberNetids: {
    type: Array,
    required: true,
    default: []
  }
});

module.exports = {CourseEvent};
