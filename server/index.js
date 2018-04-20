const express = require('express');
const path = require('path');

const hbs = require('hbs');

const {mongoose} = require('./db/mongoose');
const {CourseEvent} = require('./models/CourseEvent');

var bodyParser = require('body-parser');
var session = require('cookie-session');

const app = express();

var courseEvents = require('./routes/courseEvents');
var courses = require('./routes/courses');
var auth = require('./routes/auth');
var users = require('./routes/users');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
// Configure the app to save a cookie with two attributes (for netid and status)
app.use(session({ keys: ['key1', 'key2'] }));

// Enable bodyParser
app.use(bodyParser.json());

// Set up routes to be handles in other files
app.use('/api/courses', courses);
app.use('/api/courseEvents', courseEvents);
app.use('/api/auth', auth.router);
app.use('/api/users', users);

app.get('/', (req, res) => {
  if (auth.userIsAuthenticated(req)) {
    return res.redirect('/main');
  }
  res.render('landing');
});

app.get('/main', (req, res) => {
  if (!auth.userIsAuthenticated(req)) {
    return res.redirect('/api/auth/login');
  }
  res.render('main', {netid: req.session.cas.netid});
})

// The 'catchall' handler: for any request that doesn't match one above, send back React's index.html
app.get('*', (req, res) => {
  console.log(req.url);
  res.redirect('/');
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server listening on ${port}`);
});
