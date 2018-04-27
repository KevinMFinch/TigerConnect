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

getPinnedCourses = query => {
    var searchQuery = '/api/users/pinnedCourses/' + query;

    fetch(searchQuery)
      .then(res => res.json())
      .then(courses => handlePinned(courses));
}

function handleCourses(course) {
  var innerHTMLChange = "";
  for(var i = 0; i < course.length; i++) {
    innerHTMLChange = innerHTMLChange + "<div class=\"class slideRight\" id=\"" + course[i]['_id'] + " " + course[i]['department'] + course[i]['courseNumber'] + "\" onclick=\"searchCourseGroups(this.id); setSelected(this)\">";
    innerHTMLChange = innerHTMLChange + "<button  id=\"" + course[i]['_id'] + "\" class=\"pin mt-2 ml-auto mr-2\" onclick=\"addPinnedClass(this.id)\"><i class=\"fas fa-thumbtack\"></i></button>" + "<h5 class=\"class-title ml-4 pl-1 mt-2\">" + course[i]['department'] + course[i]['courseNumber'] + "</h5></button>";
    innerHTMLChange = innerHTMLChange + "<p class=\"hidden-sm ml-4 pl-1 mt-2 mr-4 small text-white\">" + course[i]['name'] + "</p></div>";
  }
  document.getElementById("class-placement").innerHTML = innerHTMLChange;
}

function handlePinned(courses) {
  var innerHTMLChange = "";
  if (courses.length == 0) {
    innerHTMLChange = innerHTMLChange + "<div class=\"pinned-bar\" data-toggle=\"collapse\" href=\"#collapseExample\" role=\"button\" aria-expanded=\"true\" aria-controls=\"collapseExample\ style=\"color:white\">None</div>;"
    alert("none!");
  }
  else {
    // alert(courses[0]['_id'] + " " + courses[0]['department'] + courses[0]['courseNumber'] + " " + courses[0]['name']);
    for(var i = 0; i < courses.length; i++) {
      innerHTMLChange = innerHTMLChange + "<div class=\"class slideRight\" id=\"" + courses[i]['_id'] + " " + courses[i]['department'] + courses[i]['courseNumber'] + "\" onclick=\"searchCourseGroups(this.id); setSelected(this)\">";
      innerHTMLChange = innerHTMLChange + "<button  id=\"" + courses[i]['_id'] + "\" class=\"pin mt-2 ml-auto mr-2\" onclick=\"addPinnedClass(this.id)\"><i class=\"fas fa-thumbtack\"></i></button>" + "<h5 class=\"class-title ml-4 pl-1 mt-2\">" + courses[i]['department'] + courses[i]['courseNumber'] + "</h5>";
      innerHTMLChange = innerHTMLChange + "<p class=\"hidden-sm ml-4 pl-1 mt-2 mr-4 small text-white\">" + courses[i]['name'] + "</p></div>";
    }
  }
  document.getElementById("pinned-placement").innerHTML = innerHTMLChange;
}

function setSelected(item) {
  var divItems = document.getElementsByClassName("class");
  for(var i=0; i < divItems.length; i++){
   divItems[i].classList.remove('track');
  }
  item.classList.add('track');
}

function testprint(course){
  alert(JSON.stringify(course));
}

function handleGroups(groups) {
  var innerHTMLChange = "";
  var events = groups['courseEvents'];
  if (events.length == 0) {
    innerHTMLChange = innerHTMLChange + "<div class=\"main-panel-empty mx-auto\" align=\"center\"><h1 class=\"text-center mx-auto\" style=\"padding-top:20%;\">Be the first to create a group for this class!</h1></div>";
  }
  else {
    for(var i = 0; i < events.length; i++) {
      var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      var dayOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      var memberPlural = " members ";
      if (events[i]['members'] == 1) {
        memberPlural = " member ";
      }
      var date = new Date(events[i]['timeCreated']);
      var dateFormatted = dayOfWeek[date.getDay()] + " " + months[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear();
      innerHTMLChange = innerHTMLChange + "<div class=\"group-container\"><div class=\"group slideUp\">";
      innerHTMLChange = innerHTMLChange + "<div class=\"group-header\"><p class=\"group-header-text\">" + events[i]['title'];
      innerHTMLChange = innerHTMLChange + "</p></div><div class=\"group-desc-text font-weight-light\"><p>" + events[i]['description'];
      innerHTMLChange = innerHTMLChange + "</p><span class=\"font-weight-bold\">Location: </span><span>" + events[i]['location'];
      innerHTMLChange = innerHTMLChange + "</span><br><span class=\"font-weight-bold\">Time: </span><span>" + events[i]['time'];
      innerHTMLChange = innerHTMLChange + "</span><br><span>" + events[i]['members'] + memberPlural + "joined</span>";
      innerHTMLChange = innerHTMLChange + "<div class=\"group-footer\"><p class=\"group-desc-text\">Created by " + events[i]['advertiser'] + " • " + dateFormatted + "</p></div>";
      innerHTMLChange = innerHTMLChange + "</div></p><button class=\"join\" id=\"" + events[i]['_id'] + "\" onclick=\"joinGroup(this.id)\">JOIN</button></div></div>";
    }
  }
  document.getElementById("main-panel-content").innerHTML = innerHTMLChange;
  document.getElementById("currentCourse").innerHTML = document.getElementById("coursename").value;
}

function joinGroup(id) {
  var courseEvent = {courseEventID: id, netid: document.getElementById("netid").value};

  fetch('api/courseEvents/join', {
    method: 'POST',
    body: JSON.stringify(courseEvent),
    headers: new Headers ({
      'Content-Type': 'application/json'
    })
  });
}

function addPinnedClass(id) {
  var coursePin = {courseID: id, netid: document.getElementById("netid").value};

  fetch('api/users/pincourse', {
    method: 'POST',
    body: JSON.stringify(coursePin),
    headers: new Headers ({
      'Content-Type': 'application/json'
    })
  });
}

function searchCourses(value) {
  getSearchedCourses(value);
}

function getPinned() {
  // var netid = document.getElementById("netid").value;

  // document.getElementById("pinned-placement").innerHTML = "<p>lololol</p>";
  getPinnedCourses(document.getElementById("netid").value);
}

function searchCourseGroups(value) {
  split = value.indexOf(" ");
  id = value.substring(0, split);
  name = value.substring(split + 1);
  document.getElementById("courseid").value = id;
  document.getElementById("coursename").value = name;
  getSearchedCourseGroups(id);
}

function refreshGroups() {
  getSearchedCourseGroups((document.getElementById("courseid").value));
}

function mainPanel() {

}

getAllCourses();
