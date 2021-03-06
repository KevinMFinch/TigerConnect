var mongoose = require('mongoose');

var Course = mongoose.model('Course', {
  name: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  department: {
    type: String,
    required: true,
    trim: true
  },
  courseNumber: {
    type: String,
    required: true
  },
  crossListings: {
    type: String,
    required: false
  }
});

module.exports = {Course};
