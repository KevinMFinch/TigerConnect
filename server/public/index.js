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

function handleCourses(course) {
  var innerHTMLChange = "";
  for(var i = 0; i < course.length; i++) {
    innerHTMLChange += "<div class=\"class slideRight\" id=\"" + course[i]['_id'] + "\"><div class=\"pin glyphicon glyphicon-pushpin\" />" + "</div>";
    innerHTMLChange += "<h1 class=\"class-title\">" + course[i]['department'] + course[i]['courseNumber'] + "</h1>";
    innerHTMLChange += "<h2 class=\"hidden-sm\">" + course[i]['name'] + "</h2>" + "<p class=\"groups-online\">click to search for groups...</p></div>";
  }
  document.getElementById("class-placement").innerHTML = innerHTMLChange;
  // getCourseGroupSize(course);
}

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
}

function searchCourses(value) {
  getSearchedCourses(value);
}

getAllCourses();
