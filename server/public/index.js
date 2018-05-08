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

getSearchedCourses = (query) => {
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

getPinnedExpanded = query => {
  var searchQuery = '/api/users/getPinnedExpanded/' + query;

  fetch(searchQuery)
    .then(res => res.json())
    .then(expanded => handlePinnedExpanded(expanded));
}

getUserCreatedGroups = query => {
    var searchQuery = '/api/users/createdGroups/' + query;

    fetch(searchQuery)
      .then(res => res.json())
      .then(groups => handleDashCreated(groups));
}

getUserJoinedGroups = query => {
    var searchQuery = '/api/users/joinedGroups/' + query;

    fetch(searchQuery)
      .then(res => res.json())
      .then(groups => handleDashJoined(groups));
}

getUserTotalGroups = query => {
  var searchQuery = '/api/users/groups/' + query;

  fetch(searchQuery)
    .then(res => res.json())
    .then(groups => chooseOnboardOrDash(groups));
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
  document.getElementById("pinned-toggle-expand-sub").innerHTML = "<div class=\"collapsePinned collapse " + isShow + " vertical-center\" id=\"pinned-placement\"><div class=\"container-fluid p-0\">HI</div></div>";
}

function handleDashCreated(groups) {
  var events = groups['events'];
  if (events.length == 0) {
    document.getElementById("dash-user-created").innerHTML = "<div class=\"mx-auto\" align=\"center\"><h5 class=\"text-center mx-auto\" style=\"padding-top:20%;\">No groups created yet.</h5></div>";
  } else {
    populateGroups(events, "dash-user-created");
  }
}

function handleDashJoined(groups) {
  var events = groups['events'];
  if (events.length == 0) {
    document.getElementById("dash-user-joined").innerHTML = "<div class=\"mx-auto\" align=\"center\"><h5 class=\"text-center mx-auto\" style=\"padding-top:20%;\">No groups joined yet.</h5></div>";
  } else {
    populateGroups(events, "dash-user-joined");
  }
}

function populateGroups(events, idToPopulate) {
  console.log('populate', events, idToPopulate);
  var innerHTMLChange = "";
  for(var i = 0; i < events.length; i++) {
    var memberPlural = " members ";
    if (events[i]['members'] == 1) {
      memberPlural = " member ";
    }
    var date = new Date(events[i]['timeCreated']);
    var m = moment(date);
    var timeCreated = m.fromNow();
    innerHTMLChange = innerHTMLChange + "<div class=\"group-container\"><div class=\"group slideUp\">";
    innerHTMLChange = innerHTMLChange + "<div class=\"group-header\"><p class=\"group-header-text\">" + events[i]['title'];
    innerHTMLChange = innerHTMLChange + "<button data-toggle=\"modal\" data-target=\"#shareLinkModal\" id=\"" + events[i]['_id'] + "\" class=\"share-link\" onclick=\"showShareableLinkModal(this.id)\">" + events[i]['courseName'] + " <i class=\"fa fa-link\" aria-hidden=\"true\"></i></button></p></div><div class=\"group-desc-text font-weight-light\"><p>" + events[i]['description'];
    innerHTMLChange = innerHTMLChange + "</p><span class=\"font-weight-bold\">Location: </span><span>" + events[i]['location'];
    innerHTMLChange = innerHTMLChange + "</span><br><span class=\"font-weight-bold\">Time: </span><span>" + events[i]['time'];
    innerHTMLChange = innerHTMLChange + "</span><br><span>" + events[i]['members'] + memberPlural + "joined</span></div>";
    innerHTMLChange = innerHTMLChange + "<div class=\"group-footer\"><p class=\"group-desc-text\" title=\"" + m.format('dddd, LL [at] LT') + "\">Created by " + events[i]['advertiser'] + " • " + timeCreated + "</p></div>";
    var status = getButtonStatus(events[i]);

// <button type="button" class="ml-auto mr-4 btn btn-primary" data-toggle="modal" data-target="#createGroupModal" id="create-groups" aria-disabled="true" style="visibility: hidden">

    innerHTMLChange = innerHTMLChange + getButtonStatusHTML(events[i], status, idToPopulate);
  }

  /* whitespace at bottom of page */
  innerHTMLChange = innerHTMLChange + `<div class="row" style="height:100px"></div>`;

  if (idToPopulate == 'shareable')
    document.getElementById('main-panel-content').innerHTML = innerHTMLChange;
  else
    document.getElementById(idToPopulate).innerHTML = innerHTMLChange;
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

function testprint(course){
  alert(JSON.stringify(course));
}

function handleGroups(groups) {
  // var innerHTMLChange = "";
  var events = groups['courseEvents'];
  if (events.length == 0) {
    document.getElementById("main-panel-content").innerHTML = "<div class=\"main-panel-empty mx-auto\" align=\"center\"><h1 class=\"text-center mx-auto\" style=\"padding-top:20%;\">Be the first to create a group for " + document.getElementById("coursename").value + "!</h1></div>";
  }
  else {
    populateGroups(events, "main-panel-content");
  }
  document.getElementById("currentCourse").innerHTML = document.getElementById("coursename").value;
}

function joinGroup(id) {
  var netid = document.getElementById("netid").value;

  split = id.indexOf(" ");
  courseID = id.substring(0, split);
  idToRefresh = id.substring(split + 1);

  var courseEvent = {courseEventID: courseID, netid };

  fetch('/api/courseEvents/join', {
    method: 'POST',
    body: JSON.stringify(courseEvent),
    headers: new Headers ({
      'Content-Type': 'application/json'
    })
  }).then(() => {
    if (idToRefresh == 'shareable')
      refreshShareable(courseID);
    else
      refresh(idToRefresh);
  });
}

function chatGroup(id) {
  (window.location = '/chat?room=' + id);
}

function leaveGroup(id) {
  var netid = document.getElementById("netid").value;

  split = id.indexOf(" ");
  courseID = id.substring(0, split);
  idToRefresh = id.substring(split + 1);

  var courseEvent = {courseEventID: courseID, netid };

  fetch('/api/courseEvents/leave', {
    method: 'POST',
    body: JSON.stringify(courseEvent),
    headers: new Headers ({
      'Content-Type': 'application/json'
    })
  }).then(() => {
    if (idToRefresh == 'shareable')
      refreshShareable(courseID);
    else
      refresh(idToRefresh);
  });
}

function deleteGroup(id) {
  split = id.indexOf(" ");
  courseID = id.substring(0, split);
  idToRefresh = id.substring(split + 1);

  var query = '/api/courseEvents/deleteGroup/' + courseID;

  fetch(query, {
    method: 'DELETE'
  }).then(() => {
    if (idToRefresh == 'shareable')
      refreshShareable(courseID);
    else
      refresh(idToRefresh);
  });
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

function searchCourses(value) {
  getSearchedCourses(value);
}

function getPinned() {
  getPinnedExpanded(document.getElementById("netid").value);
  getPinnedCourses(document.getElementById("netid").value);
}

function getDashCreated() {
  getUserCreatedGroups(document.getElementById("netid").value);
}

function getDashJoined() {
  getUserJoinedGroups(document.getElementById("netid").value);
}

function getOnboardOrDash() {
  getUserTotalGroups(document.getElementById("netid").value);
}

function searchCourseGroups(value) {
  document.getElementById("create-groups").style.visibility = "visible";

  split = value.indexOf(" ");
  id = value.substring(0, split);
  name = value.substring(split + 1);

  document.getElementById("courseid").value = id;
  document.getElementById("coursename").value = name;

  getSearchedCourseGroups(id);
}

function getButtonStatus(event) {
  var netid = document.getElementById("netid").value;

  if (event['advertiser'] == netid) {
    return 'owner';
  }
  else if(event['memberNetids'].includes(netid)) {
    return 'member';
  }
  else {
    return 'unaffiliated';
  }
}

function getButtonStatusHTML(event, status, idToPopulate) {
  if (status == 'owner') {
    return ("<button class=\"chat\" id=\"" + event['_id'] + "\" onclick=\"chatGroup(this.id)\">CHAT</button><button class=\"join-del-leave\" id=\"" + event['_id'] + " " + idToPopulate + "\" data-toggle=\"modal\" data-target=\"#deleteGroupModal\" onclick=\"handleDelete(this.id)\">DELETE</button></div></div>");
  }
  else if (status == 'member') {
   return ("<button class=\"chat\" id=\"" + event['_id'] + "\" onclick=\"chatGroup(this.id)\">CHAT</button><button class=\"join-del-leave\" id=\"" + event['_id'] + " " + idToPopulate + "\" onclick=\"leaveGroup(this.id)\">LEAVE</button></div></div>");
  }
  else {
    return ("<button class=\"join-del-leave join\" id=\"" + event['_id'] + " " + idToPopulate + "\" onclick=\"joinGroup(this.id)\">JOIN</button></div></div>");
  }
}

function handleDelete(id) {
  document.getElementById('delete-button').value = id;
}

function refresh(idToRefresh) {
  console.log('refresh');
  console.log(idToRefresh);
  if (idToRefresh == 'main-panel-content') {
    getSearchedCourseGroups((document.getElementById("courseid").value));
  }
  else if (idToRefresh == 'dash-user-created') {
    getUserCreatedGroups(document.getElementById("netid").value);
  }
  else {
    getUserJoinedGroups(document.getElementById("netid").value);
  }
}

function refreshShareable(courseID) {
  document.getElementById("toolbar-coursename").innerHTML = "Shareable Link"

  // main-panel-content
  fetch('/api/courseEvents/byID/' + courseID).then(res => res.json()).then((event) => {
    if (!event.hasOwnProperty('message')) {
      var arr = [];
      arr.push(event)
      populateGroups(arr, 'shareable');
    }
    else
      document.getElementById("main-panel-content").innerHTML = "<div class=\"main-panel-empty mx-auto\" align=\"center\"><h1 class=\"text-center mx-auto\" style=\"padding-top:20%;\">Course link does not exist.</h1></div>";
  });
}

function chooseOnboardOrDash(groups) {
  if (groups.length > 0) {
    document.getElementById("dashboard").setAttribute("style", "display: inline;");
    document.getElementById("onboarding").setAttribute("style", "display: none;");
  } else {
    document.getElementById("dashboard").setAttribute("style", "display: none;");
    document.getElementById("onboarding").setAttribute("style", "display: inline;");
  }
}

window.onload = function() {
  // getAllCourses();
  var params = jQuery.deparam(window.location.search);
  getOnboardOrDash();
  getPinned();
  if (params.groupID) {
    refreshShareable(params.groupID);
  }
  else {
    getDashCreated();
    getDashJoined();
  }

  var textarea = document.getElementById("courseEvent-description");

  textarea.addEventListener("input", function(){
      var maxlength = this.getAttribute("maxlength");
      var currentLength = this.value.length;

      if( currentLength >= maxlength ){
          document.getElementById("charNum").innerHTML = "No more characters left." ;
      }else if (maxlength - currentLength == 1){
          document.getElementById("charNum").innerHTML = maxlength - currentLength + " character left" ;
      }
      else{
          document.getElementById("charNum").innerHTML = maxlength - currentLength + " characters left" ;
      }
  });
}
