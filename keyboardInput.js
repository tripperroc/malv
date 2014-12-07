
// Handle Keyboard input

var lastKeyCode = "X";			//variable to track the last key pressed

// Called on key press
$(document).ready(function(){
  $(this).keydown(function(e){
	// DEBUG
    // console.log("Keycode set to " + lastKeyCode);
    if(e.keyCode !== 38 && e.keyCode !== 40) {
        lastKeyCode = String.fromCharCode(e.keyCode);		// Changes lastKeyCode
        changeSelectedStateLabel();							// Changes the Label of the selected state
    }
  });
  $("input").keyup(function(){
  });
});



function changeSelectedStateLabel(){
	if( selectedState != null ){
		if( distance(mouseX, mouseY, selectedState.x, selectedState.y) < 42 ){
			selectedState.label = lastKeyCode;
		}
	}
}
