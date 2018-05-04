var mongoose = require('mongoose');

var ChatRoom = mongoose.model('ChatRoom', {
  messages: {
    type: Array,
    require: true,
    default: []
  },
  roomID: {
    type: String,
    required: true,
    minlength: 1,
    trim: true
  }
});

module.exports = {ChatRoom};
