const express = require('express');
const path = require('path');
const http = require('http');
const socketIO = require('socket.io');

const hbs = require('hbs');

const {mongoose} = require('./db/mongoose');
const {CourseEvent} = require('./models/CourseEvent');
const {ChatRoom} = require('./models/ChatRoom');

var bodyParser = require('body-parser');
var session = require('cookie-session');

const app = express();

// Socket chat things
const {generateMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');
var server = http.createServer(app);
var io = socketIO(server);
var users = new Users();

var courseEvents = require('./routes/courseEvents');
var courses = require('./routes/courses');
var auth = require('./routes/auth');
var usersRoute = require('./routes/users');
var chatRoom = require('./routes/chatRoom');
var control = require('./routes/control');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials');

app.use(express.static(path.join(__dirname, 'public')));
// Configure the app to save a cookie with two attributes (for netid and status)
app.use(session({ keys: ['key1', 'key2'] }));

// Enable bodyParser
app.use(bodyParser.json());

// Set up routes to be handled in other files
app.use('/api/courses', courses);
app.use('/api/courseEvents', courseEvents);
app.use('/api/auth', auth.router);
app.use('/api/users', usersRoute);
app.use('/api/chatRoom', chatRoom);
app.use('/api/control', control);

/*------------- Routing stuff ----------*/
app.get('/', (req, res) => {
  if (auth.userIsAuthenticated(req)) {
    return res.redirect('/main');
  }
  res.render('landing');
});

app.get('/chat', (req, res) => {
  if (!auth.userIsAuthenticated(req)) {
    return res.redirect('/api/auth/login?redirect=' + req.originalUrl);
  }
  res.render('chat', {netid: req.session.cas.netid});
});

app.get('/main', (req, res) => {
  if (!auth.userIsAuthenticated(req)) {
    return res.redirect('/api/auth/login?redirect=' + req.originalUrl);
  }
  res.render('main2', {netid: req.session.cas.netid});
});

app.get('*', (req, res) => {
  console.log(req.url);
  res.redirect('/');
});

/*------------- Chat stuff ----------*/
io.on('connection', (socket) => {
  console.log('New user connected');

  socket.on('join', (params, callback) => {
    if (!isRealString(params.name) || !isRealString(params.room)) {
      return callback('Name and room name are required.')
    }

    console.log(`joined room ${JSON.stringify(params)}`);

    socket.join(params.room);
    ChatRoom.findOne({roomID: params.room}).then((chatRoom) => {
      console.log('cr', chatRoom);
      if (!chatRoom) {
        var cR = new ChatRoom({
          roomID: params.room
        });
        cR.save();
      }
    }, (e) => {
      console.log(500);
    });
    // Remove from all other rooms, may be a problem? Not sure
    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.room);

    io.to(params.room).emit('updateUserList', users.getUserList(params.room));

    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat app'));
    socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined the room`));

    callback();
  });

  socket.on('createMessage', (message, callback) => {
      var user = users.getUser(socket.id);

      if (user && isRealString(message.text)) {
        var createdMessage = generateMessage(user.name, message.text);
        // Save message to DB
        ChatRoom.findOneAndUpdate(
          {roomID: user.room},
          {$push: {messages: createdMessage}},
          {new:true}
        ).then((chatRoom) => {
          io.to(user.room).emit('newMessage', createdMessage);
          callback();
        }, (e) => {
          console.log(e);
          callback();
        });
      }
      callback();
  });

  socket.on('disconnect', () => {
    var user = users.removeUser(socket.id);

    if (user) {
      io.to(user.room).emit('updateUserList', users.getUserList(user.room));
      io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left the room.`));
    }
  });
});


// Listen
const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(`Server listening on ${port}`);
});
