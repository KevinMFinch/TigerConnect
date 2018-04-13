function createGroup() {
	fetch("/api/courseEvents/", {
		method : 'POST',
		headers: {
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			title: document.getElementById("courseEvent-title").value,
			advertiser: document.getElementById("netid").value,
			time: document.getElementById("courseEvent-time").value,
			location: document.getElementById("courseEvent-location").value,
			description: document.getElementById("courseEvent-description").value,
			courseID: document.getElementById("courseid").value
		})
	}).then(res => res.json()).then(response => console.log(response));
}