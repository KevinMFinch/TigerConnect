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
    innerHTMLChange = innerHTMLChange + "<div class=\"class slideRight\" id=\"" + course[i]['_id'] + " " + course[i]['name'] + "\" onclick=\"searchCourseGroups(this.id)\"><div class=\"pin glyphicon glyphicon-pushpin\" />" + "</div>";
    innerHTMLChange = innerHTMLChange + "<h1 class=\"class-title\">" + course[i]['department'] + course[i]['courseNumber'] + "</h1>";
    innerHTMLChange = innerHTMLChange + "<h2 class=\"hidden-sm\">" + course[i]['name'] + "</h2>" + "<p class=\"hidden-sm groups-online\">Click to see online groups...<p></div>";
  }
  document.getElementById("class-placement").innerHTML = innerHTMLChange;
}

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

}

function searchCourses(value) {
  getSearchedCourses(value);
}

function searchCourseGroups(value) {
  split = value.indexOf(" ");
  document.getElementById("courseid").value = value.substring(0, split);
  getSearchedCourseGroups("coursename").value = value.substring(split + 1);
}

getAllCourses();
