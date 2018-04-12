//TODO: Change code to actually use the handlebars templating aspect
//TODO: .......This is HELLA slow


getAllCourses = () => {
  // Get the message and store in state
  fetch('/api/courses/')
    .then(res => res.json())
    .then(course => handleCourses(course));
}

// TODO: SEARCHED COURSES SEEM TO GIVE ALL WHEN NO COURSES ARE FOUND?
getSearchedCourses = query => {
  // Get the message and store in state
  var searchQuery = '/api/courses/' + query;
  console.log("This is the search query: " + searchQuery);
  fetch(searchQuery)
    .then(res => res.json())
    .then(course => handleCourses(course));
}

function handleCourses(course) {
  var innerHTMLChange = "";
  for(var i = 0; i < course.length; i++) {
    innerHTMLChange = innerHTMLChange + "<div class=\"class slideRight\"><div class=\"pin glyphicon glyphicon-pushpin\" />" + "</div>";
    innerHTMLChange = innerHTMLChange + "<h1 class=\"class-title\">" + course[i]['department'] + course[i]['courseNumber'] + "</h1>";
    innerHTMLChange = innerHTMLChange + "<h2 class=\"hidden-sm\">" + course[i]['name'] + "</h2>" + "</div>";
  }
  // console.log(document.getElementById('desktop-course-finder').value);
  document.getElementById("class-placement").innerHTML += innerHTMLChange;
  // return JSON.stringify(course);
  // return "<p>YOOO!!!</p>"
}

function searchCourses(value) {
  getSearchedCourses(value);
}


getAllCourses();
