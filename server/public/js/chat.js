// From socket.io library, creates connection
var socket = io();

function scrollToBottom () {
  // Selectors
  // var messages = jQuery('#messages');
  // var newMessage = messages.children('li:last-child');
  // // Heights
  // var clientHeight = messages.prop('clientHeight');
  // var scrollTop = messages.prop('scrollTop');
  // var scrollHeight = messages.prop('scrollHeight');
  // var newMessageHeight = newMessage.innerHeight();
  // var lastMessageHeight = newMessage.prev().innerHeight();
  //
  // if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
  //   messages.scrollTop(scrollHeight);
  // }

  // var objDiv = document.getElementById("chat__messages");
  // objDiv.scrollTop = objDiv.scrollHeight;
}

function handleMessages(messages) {
  for(var i = 0; i < messages['messages'].length; i++) {
    var formattedTime = moment(messages['messages'][i]['createdAt']).format('MMMM Do YYYY, h:mm:ss a');
    var params = jQuery.deparam(window.location.search);
    var netid = params.name;
    var className = '';
    if (messages['messages'][i]['from'] === netid) {
      className = 'speech-bubble-send';
    } else {
      className = 'speech-bubble-receive';
    }

    var html = `<li class="message mt-2 ${className}">` +
                 '<div class="message__title">' +
                    '<h4>' + messages['messages'][i]['from'] + '</h4>' +
                    '<span>' + formattedTime + '</span>' +
                 '</div>' +
                '<div class="message__body">' +
                  '<p>' + messages['messages'][i]['text'] + '</p>' +
                '</div>' +
              '</li>';
    jQuery('#messages').append(html);
  }
  scrollToBottom();
}

socket.on('connect', function() {
  var params = jQuery.deparam(window.location.search);

  socket.emit('join', params, function (err) {
    if (err) {
      alert(err);
      window.location.href = '/';
    } else {
      console.log(`joined room ${params.room}`);
      console.log('no error');
      fetch('/api/chatRoom/messages/' + params.room)
        .then(res => res.json())
        .then(messages => handleMessages(messages))
    }
  });
});

socket.on('disconnect', function() {
  console.log('Disconnected from server');
});

socket.on('updateUserList', function(users) {
  var ol = jQuery('<ol></ol>');

  users.forEach(function (user) {
    ol.append(jQuery('<li></li>').text(user));
  });

  jQuery('#users').html(ol);
});

socket.on('newMessage', function(message) {
  console.log(JSON.stringify(message));
  var formattedTime = moment(message.createdAt).format('MMMM Do YYYY, h:mm:ss a');
  var params = jQuery.deparam(window.location.search);
  var netid = params.name;
  var className = '';
  if (message.from === netid) {
    className = 'speech-bubble-send';
  } else {
    className = 'speech-bubble-receive';
  }

  var html = `<li class="message mt-2 ${className}">` +
               '<div class="message__title">' +
                  '<h4>' + message.from + '</h4>' +
                  '<span>' + formattedTime + '</span>' +
               '</div>' +
              '<div class="message__body">' +
                '<p>' + message.text + '</p>' +
              '</div>' +
            '</li>';
  jQuery('#messages').append(html);
  scrollToBottom();
});

jQuery('#message-form').on('submit', function (e) {
  e.preventDefault();

  var messageTextBox = jQuery('[name=message]');
  socket.emit('createMessage', {
    text: messageTextBox.val()
  }, function() {
    messageTextBox.val('');
  });
});
