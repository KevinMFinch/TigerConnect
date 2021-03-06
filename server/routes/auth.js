var express = require('express');
var router = express.Router();

var {User} = require('../models/User');

// Load external dependencies
require('cookie-session');
var CentralAuthenticationService = require('cas');

// Load internal modules
var config = require('../config.js');

console.log('host', config.host);

// Configure CAS authentication
var casURL = 'https://fed.princeton.edu/cas/'
var cas = new CentralAuthenticationService({
  base_url: casURL,
  service: config.host + '/api/auth/verify'
});

router.use('*', function (req, res, next) {
  next()
});

// Redirect the user to Princeton's CAS server
router.get('/login', function (req, res) {
  // Save the user's redirection destination to a cookie
  if (typeof (req.query.redirect) === 'string') {
    req.session.redirect = req.query.redirect;
  }

  // Redirect the user to the CAS server
  res.redirect(`${casURL}login?service=${encodeURIComponent(config.host + '/api/auth/verify')}`);
});

// Handle replies from Princeton's CAS server about authentication
router.get('/verify', function (req, res) {
  let redirectDestination = req.session.redirect || '/'

  // If the user already has a valid CAS session then send them to their destination
  console.log("Verify function...");
  if (req.session.cas) {
    res.redirect(redirectDestination);
    return;
  }

  var ticket = req.query.ticket

  // If the user does not have a ticket then send them to the homepage
  if (typeof (ticket) === 'undefined') {
    res.redirect('/');
    return;
  }

  // Check if the user's ticket is valid
  cas.validate(ticket, function (err, status, netid) {
    if (err) {
      console.log(err);
      res.sendStatus(500);
      return;
    }

    // Save the user's session data
    req.session.cas = {
      status: status,
      netid: netid
    };

    // Find the user in the database with this netid
    User.findOne({netid}).then((user) => {
      // If the user doesn't exist, create a new user
      if (!user) {
        var newUser = new User({
          netid
        });
        newUser.save().then((us) => {
          res.redirect(redirectDestination);
        }, (e) => {
          res.json({message: "could not create user"});
        });
      } else {
        res.redirect(redirectDestination);
      }
    }, (e) => {
      console.log(e);
      res.sendStatus(500);
    });
  });
});

// Log the user out
router.get('/logout', function (req, res) {
  req.session = null;
  res.redirect(`${casURL}logout`);
});

// Export the routes on this router (/login, /verify, and /logout)
module.exports.router = router

// Determine whether the user sending this request is authenticated
var userIsAuthenticated = function (req) {
  if (!req.session.cas || req.session.cas == null) {
    return false;
  }
  return true;
}
module.exports.userIsAuthenticated = userIsAuthenticated
