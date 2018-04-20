var mongoose = require('mongoose');

var User = mongoose.model('User', {
  netid: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  },
  pinnedCourses: {
    type: Array,
    required: true,
    default: []
  }
});

module.exports = {User};
