//TODO: Change code to actually use the handlebars templating aspect
//TODO: .......This is HELLA slow


getAllCourses = () => {
  // Get the message and store in state
  fetch('/api/courses/')
    .then(res => res.json())
    .then(course => handleCourses(course));
}

// TODO: SEARCHED COURSES SEEM TO GIVE ALL WHEN NO COURSES ARE FOUND?

var timeout = null;

getSearchedCourses = query => {
  clearTimeout(timeout);

  timeout = setTimeout(function () {
    var searchQuery = '/api/courses/' + query;
    fetch(searchQuery)
      .then(res => res.json())
      .then(course => handleCourses(course));
    }, 150);
}

getSearchedCourseGroups = query => {
    var searchQuery = '/api/courseEvents/' + query;

    fetch(searchQuery)
      .then(res => res.json())
      .then(groups => handleGroups(groups));
}


function handleCourses(course) {
  var innerHTMLChange = "";
  for(var i = 0; i < course.length; i++) {
<<<<<<< HEAD
    innerHTMLChange += "<div class=\"class slideRight\" id=\"" + course[i]['_id'] + "\"><div class=\"pin glyphicon glyphicon-pushpin\" />" + "</div>";
    innerHTMLChange += "<h1 class=\"class-title\">" + course[i]['department'] + course[i]['courseNumber'] + "</h1>";
    innerHTMLChange += "<h2 class=\"hidden-sm\">" + course[i]['name'] + "</h2>" + "<p class=\"groups-online\">click to search for groups...</p></div>";
=======
    innerHTMLChange = innerHTMLChange + "<div class=\"class slideRight\" id=\"" + course[i]['_id'] + "\" onclick=\"searchCourseGroups(this.id)\"><div class=\"pin glyphicon glyphicon-pushpin\" />" + "</div>";
    innerHTMLChange = innerHTMLChange + "<h1 class=\"class-title\">" + course[i]['department'] + course[i]['courseNumber'] + "</h1>";
    innerHTMLChange = innerHTMLChange + "<h2 class=\"hidden-sm\">" + course[i]['name'] + "</h2>" + "</div>";

    // // add num of groups
    console.log(getCourseGroupSize(course[i]['_id']));
>>>>>>> origin/master
  }
  document.getElementById("class-placement").innerHTML = innerHTMLChange;
  // getCourseGroupSize(course);
}

<<<<<<< HEAD
function getCourseGroupSize(course) {
  for(var i = 0; i < course.length; i++) {
    var id = course[i]['_id']
    fetch('/api/courseEvents/' + course[i]['_id'])
      .then(res => res.json())
      .then(courseGroups => Object.keys(courseGroups['courseEvents']).length)
      .then(size => {
        // console.log(document.getElementById(id).getElementsByClassName("groups-online").innerHTML);
        document.getElementById(id).getElementsByClassName("groups-online").text = size + " groups online!";
        // console.log(document.getElementById(id).getElementsByClassName("groups-online").innerHTML);
        // document.getElementById(id).style.backgroundColor = "red";
      }
    );
  }
=======
function handleGroups(groups) {
  document.getElementById("group-placement").innerHTML = "";
  var innerHTMLChange = "";
  var events = groups['courseEvents'];
  if (events.length == 0) {
    innerHTMLChange = innerHTMLChange + "<div class=\"main-panel-empty\"><h1>Be the first to create a group for this class!</h1></div>";
  }
  else {
    for(var i = 0; i < events.length; i++) {
      innerHTMLChange = innerHTMLChange + "<div class=\"group-container\"><div class=\"group slideUp\">";
      innerHTMLChange = innerHTMLChange + "<div class=\"group-header\"><p class=\"group-header-text\">" + events[i]['title'];
      innerHTMLChange = innerHTMLChange + "</p></div><button class=\"join\">JOIN</button></div></div>";
    }
  }

  document.getElementById("group-placement").innerHTML += innerHTMLChange;
}

function getCourseGroupSize(id) {

>>>>>>> origin/master
}

function searchCourses(value) {
  getSearchedCourses(value);
}

<<<<<<< HEAD
=======
function searchCourseGroups(value) {
  getSearchedCourseGroups(value);
}

>>>>>>> origin/master
getAllCourses();
