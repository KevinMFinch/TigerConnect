var express = require('express');
var router = express.Router();


var {mongoose} = require('../db/mongoose');
const {ChatRoom} = require('../models/ChatRoom');

// get message logs for a specific chat roomID
router.get('/messages/:roomID', (req, res) => {
  var roomID = req.params.roomID;
  ChatRoom.findOne({roomID}).then((chatRoom) => {
    if (!chatRoom) {
      return res.json({message: "No chat room for that groupID"});
    }
    res.json({messages: chatRoom.messages});
  });
});


module.exports = router;
