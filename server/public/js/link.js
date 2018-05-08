function showShareableLinkModal(id) {
  document.getElementById('text-link').value = window.location.origin + '/main?groupID=' + id;
}

function copyShareableLink() {
  var copyText = document.getElementById('text-link');
  copyText.select();
  document.execCommand("Copy");
}
