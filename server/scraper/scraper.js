// Scraper to populate database with current Princeton courses

const fs = require('fs');
const http = require('http');
const process = require('process');
var {mongoose} = require('../db/mongoose');
const {Course} = require('../models/Course');

var courseURL = 'http://etcweb.princeton.edu/webfeeds/courseofferings/?term=current&subject=all&fmt=json';

http.get(courseURL, (res) => {
  res.setEncoding('utf8');
  let rawData = '';
  res.on('data', (chunk) => { rawData += chunk; });
  res.on('end', () => {
    try {
      const parsedData = JSON.parse(rawData);
      Course.remove({}, () => {
        console.log('Deleted');
        addCoursesToDatabase(parsedData);
      });
    } catch (e) {
      console.error(e.message);
    }
  });
});

var addCoursesToDatabase = (courseJSON) => {
  var subjects = courseJSON.term[0].subjects;
  var coursesToPush = []
  var numberOfCourses = 0;
  var numberSaved = 0;
  var promises = []
  subjects.forEach((dept) => {
    // Name, department, course Number
    var code = dept.code;
    var courses = dept.courses;
    courses.forEach((course) => {
      numberOfCourses++;
      var number = course.catalog_number;
      var title = unescape(course.title);
      var crossListings = '';
      if ("crosslistings" in course) {
        var cl = course.crosslistings;
        cl.forEach((listing) => {
          crossListings += listing.subject + listing.catalog_number + ' '
        });
      }
      if (title != '' && number != '' && code != '') {
        var courseRecord = new Course({
          name: title,
          courseNumber: number,
          department: code,
          crossListings
        });
        promises.push(courseRecord.save());
      }
    });
  });
  Promise.all(promises).then((values) => {
    console.log(`Saved ${values.length} courses`);
    mongoose.disconnect();
  });
};
