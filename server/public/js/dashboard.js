/* several references to functions contained group.js */

// if user has no groups yet, display onboard
// otherwise, show dashboard for easy group access
function chooseOnboardOrDash(groups) {
  if (groups.length > 0) {
    document.getElementById("dashboard").setAttribute("style", "display: inline;");
    document.getElementById("onboarding").setAttribute("style", "display: none;");
  } else {
    document.getElementById("dashboard").setAttribute("style", "display: none;");
    document.getElementById("onboarding").setAttribute("style", "display: inline;");
  }
}

function getOnboardOrDash() {
  getUserTotalGroups(document.getElementById("netid").value);
}

function getDashCreated() {
  getUserCreatedGroups(document.getElementById("netid").value);
}

function handleDashCreated(groups) {
  var events = groups['events'];
  if (events.length == 0) {
    document.getElementById("dash-user-created").innerHTML = "<div class=\"mx-auto\" align=\"center\"><h5 class=\"text-center mx-auto\" style=\"padding-top:20%;\">No groups created yet.</h5></div>";
  } else {
    populateGroups(events, "dash-user-created");
  }
}

function getDashJoined() {
  getUserJoinedGroups(document.getElementById("netid").value);
}

function handleDashJoined(groups) {
  var events = groups['events'];
  if (events.length == 0) {
    document.getElementById("dash-user-joined").innerHTML = "<div class=\"mx-auto\" align=\"center\"><h5 class=\"text-center mx-auto\" style=\"padding-top:20%;\">No groups joined yet.</h5></div>";
  } else {
    populateGroups(events, "dash-user-joined");
  }
}

/* ======== REFRESH ======== */

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
