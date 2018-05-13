function testprint(course){
  alert(JSON.stringify(course));
}

window.onload = function() {
  var params = jQuery.deparam(window.location.search);
  getPinned();
  getOnboardOrDash();
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
