function searchCourseGroups(value) {
  document.getElementById("create-groups").style.visibility = "visible";

  split = value.indexOf(" ");
  id = value.substring(0, split);
  name = value.substring(split + 1);

  document.getElementById("courseid").value = id;
  document.getElementById("coursename").value = name;

  getSearchedCourseGroups(id);
}

getSearchedCourseGroups = query => {
    var searchQuery = '/api/courseEvents/' + query;

    fetch(searchQuery)
      .then(res => res.json())
      .then(groups => handleGroups(groups));
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

function handleDelete(id) {
  document.getElementById('delete-button').value = id;
}

function chatGroup(id) {
  (window.location = '/chat?room=' + id);
}
