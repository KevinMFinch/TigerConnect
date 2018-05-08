function validateGroup(){
	return (document.getElementById("courseEvent-title").value.length != 0);
}

function createGroup() {
	if (!validateGroup()) {
		document.getElementById("courseEvent-title").classList.add("form-invalid");
		document.getElementById("title-notice").innerHTML = "A title is required!"
	}
	else {
		$('#createGroupModal').modal('hide');

		var timeVal;
		var locationVal;

		(document.getElementById("courseEvent-time").value == "")? timeVal = "N/A" : timeVal = document.getElementById("courseEvent-time").value;
		(document.getElementById("courseEvent-location").value == "")? locationVal = "N/A" : locationVal = document.getElementById("courseEvent-location").value;

		fetch("/api/courseEvents/", {
			method : 'POST',
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				title: document.getElementById("courseEvent-title").value,
				advertiser: document.getElementById("netid").value,
				time: timeVal,
				location: locationVal,
				description: document.getElementById("courseEvent-description").value,
				courseID: document.getElementById("courseid").value
			})
		}).then(res => res.json()).then(response => console.log(response));
	document.getElementById("courseEvent-title").value = "";
	document.getElementById("courseEvent-time").value = "";
	document.getElementById("courseEvent-location").value = "";
	document.getElementById("courseEvent-description").value = "";
	document.getElementById("courseEvent-title").classList.remove("form-invalid");
	}
}
