
// Handle Keyboard input

var lastKeyCode = "X";			//variable to track the last key pressed

// Called on key press
$(document).ready(function(){
  $(this).keydown(function(e){
	// DEBUG
    // console.log("Keycode set to " + lastKeyCode);

    //If you press the up key and a tran is selected, move the spline up
    if(e.keyCode === 38){
      if(selectedTran) {
        e.preventDefault();
        selectedTran.splineSize+=.1;
      }
    } else if(e.keyCode === 40) {
      //If you press the down key and a tran is selected, move the spline down
      if(selectedTran) {
        e.preventDefault();
        selectedTran.splineSize-=.1;
      }
    } else {
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
