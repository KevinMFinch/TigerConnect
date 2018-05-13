getAllCourses = () => {
  // Get the message and store in state
  fetch('/api/courses/')
    .then(res => res.json())
    .then(course => handleCourses(course));
}

function searchCourses(value) {
  getSearchedCourses(value);
}

var timeout = null;
var clearForever = false;

getSearchedCourses = (query) => {
  event.preventDefault();

  if (event.keyCode === 13) {
    var searchQuery = '/api/courses/' + query;
    if (query == "") {
      document.getElementById("class-placement").innerHTML = "";
    }
    else {
      fetch(searchQuery)
        .then(res => res.json())
        .then(course => handleCourses(course));
    }
  }
}

function handleCourses(course) {
  var innerHTMLChange = "";
  for(var i = 0; i < course.length; i++) {
    innerHTMLChange = innerHTMLChange + "<div class=\"class\" id=\"" + course[i]['_id'] + " " + course[i]['department'] + course[i]['courseNumber'] + "\" onclick=\"searchCourseGroups(this.id); setSelected(this)\">";
    innerHTMLChange = innerHTMLChange + "<button  id=\"" + course[i]['_id'] + "\" class=\"pin mt-2 ml-auto mr-2\" onclick=\"addPinnedClass(this.id)\"><i class=\"fas fa-thumbtack\"></i></button>" + "<h5 class=\"class-title ml-4 pl-1 mt-2\">" + course[i]['department'] + course[i]['courseNumber'] + "</h5></button>";
    innerHTMLChange = innerHTMLChange + "<p class=\"hidden-sm ml-4 pl-1 mt-2 mr-4 small text-white\">" + course[i]['name'] + "</p></div>";
  }
  document.getElementById("class-placement-mobile").innerHTML = innerHTMLChange;
  document.getElementById("class-placement").innerHTML = innerHTMLChange;
}


// highlight currently selected course
function setSelected(item) {
  var divItems = document.getElementsByClassName("class");
  for(var i=0; i < divItems.length; i++){
   divItems[i].classList.remove('track');
  }
  item.classList.add('track');
  showCourseInToolbar();
}

function showCourseInToolbar() {
  document.getElementById("toolbar-coursename").innerHTML = document.getElementById("coursename").value;
}
