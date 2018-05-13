function togglePinnedExpandedState() {
  var currExpState = document.getElementById("pinned-bar-desk").getAttribute("aria-expanded");
  var isExpanded = !(currExpState === "true");

  var isExp = {netid: document.getElementById("netid").value, expanded: isExpanded.toString()};

  fetch('/api/users/setPinnedExpanded', {
    method: 'POST',
    body: JSON.stringify(isExp),
    headers: new Headers ({
      'Content-Type': 'application/json'
    })
  });
}

function getPinned() {
  getPinnedExpanded(document.getElementById("netid").value);
  getPinnedCourses(document.getElementById("netid").value);
}

getPinnedCourses = query => {
    var searchQuery = '/api/users/pinnedCourses/' + query;

    fetch(searchQuery)
      .then(res => res.json())
      .then(courses => handlePinned(courses));
}

getPinnedExpanded = query => {
  var searchQuery = '/api/users/getPinnedExpanded/' + query;

  fetch(searchQuery)
    .then(res => res.json())
    .then(expanded => handlePinnedExpanded(expanded));
}

function handlePinned(courses) {
  var innerHTMLChange = "";
  if (courses.length == 0) {
      innerHTMLChange = innerHTMLChange + "<div class=\"class pinnedCourse\" style=\"cursor: auto\">";
      innerHTMLChange = innerHTMLChange + "<p class=\"hidden-sm ml-4 pl-1 mt-2 mr-4 small text-white\">" + "No pinned courses yet." + "</p></div>";
  } else {
    // alert(courses[0]['_id'] + " " + courses[0]['department'] + courses[0]['courseNumber'] + " " + courses[0]['name']);
    for(var i = 0; i < courses.length; i++) {
      innerHTMLChange = innerHTMLChange + "<div class=\"class pinnedCourse\" id=\"" + courses[i]['_id'] + " " + courses[i]['department'] + courses[i]['courseNumber'] + "\" onclick=\"searchCourseGroups(this.id); setSelected(this)\">";
      innerHTMLChange = innerHTMLChange + "<button  id=\"" + courses[i]['_id'] + "\" class=\"pin pinned mt-2 ml-auto mr-2\" onclick=\"unpinClass(this.id);\"><i class=\"fas fa-thumbtack\"></i></button>" + "<h5 class=\"class-title ml-4 pl-1 mt-2\">" + courses[i]['department'] + courses[i]['courseNumber'] + "</h5>";
      innerHTMLChange = innerHTMLChange + "<p class=\"hidden-sm ml-4 pl-1 mt-2 mr-4 small text-white\">" + courses[i]['name'] + "</p></div>";
    }
  }
  document.getElementById("pinned-placement-mobile").innerHTML = innerHTMLChange;
  document.getElementById("pinned-placement").innerHTML = innerHTMLChange;
}

function handlePinnedExpanded(expanded) {
  var expanded = expanded['pinnedExpanded'];
  var isShow = "";
  var aria = "false";

  if (expanded.toString() === "true") {
    isShow = "show"
    aria = "true";
  } else {
    isShow = "";
    aria = "false";
  }

  document.getElementById("pinned-bar-desk").setAttribute("aria-expanded", aria);
  document.getElementById("pinned-toggle-expand-sub").innerHTML = "<div class=\"collapsePinned collapse " + isShow + " vertical-center\" id=\"pinned-placement\"><div class=\"container-fluid p-0\"></div></div>";
}

function addPinnedClass(id) {
  var coursePin = {courseID: id, netid: document.getElementById("netid").value};

  fetch('/api/users/pincourse', {
    method: 'POST',
    body: JSON.stringify(coursePin),
    headers: new Headers ({
      'Content-Type': 'application/json'
    })
  });

  getPinned();
}

function unpinClass(id) {
  var coursePin = {netid: document.getElementById("netid").value, courseID: id};

  fetch('/api/users/unpincourse', {
    method: 'POST',
    body: JSON.stringify(coursePin),
    headers: new Headers ({
      'Content-Type': 'application/json'
    })
  });

  getPinned();
}
