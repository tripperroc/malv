/**
 *  Controls mouse input
 */


 // Mouse position
mouseX = 0;
mouseY = 0;

// Offsets for drawing canvas and detecting input
var y;
var Yoffset;
var Xoffset = 5;



numStates = 0;
clickedState = null;
tranStartState = null;
selectedState = null;
selectedTran = null;

addEventListeners = function(){
	c.addEventListener('mousedown', moveState, false);
	c.addEventListener('mouseup', stopMoveState, false);
	c.onmousemove = updateMousePos;
	
	y = c.offsetTop;
	Yoffset = y;
}


// Called on mouseDown event
moveState = function(e){	
	handleEvent(e);
	
	console.log(Qstates[0] + "," + $.inArray(selectedState, Qstates));
	
	if( selectedState != null && pm.value == PlacementMode.STATE.value && selectedTran == null){
		selectedState.moving = true;
	}
	
	console.log(Qstates[0] + "," +  $.inArray(selectedState, Qstates));
}

// Called on mouseUp event
stopMoveState = function(e){
	
	if( selectedState != null && pm.value == PlacementMode.STATE.value ){
		selectedState.moving = false;
	}
}

// Called on any mouse Click
handleEvent = function(e){
	
	console.log("handling event");
	console.log(Turing);
	
	var evt = e ? e:window.event;
	var clickX=0, clickY=0;

	// Determine location of click
	if ((evt.clientX || evt.clientY) &&
		document.body &&
		document.body.scrollLeft!=null) {
		
		clickX = evt.clientX + $(window).scrollLeft();
		clickY = evt.clientY + $(window).scrollTop();
		clickX -= Xoffset;
		clickY -= Yoffset;
  
		clickedState = null;
  
		// Check each state
		for(var i=0;i<numStates;i++){
			var tempState = Qstates[i];
	  
			// Successful click on a state
			if(distance(tempState.x,tempState.y,clickX,clickY) < 42){
				console.log("State " + tempState.label + " clicked");
				clickedState = Qstates[i];
				break;
			}
		}
  
		// A state is already selected
		if( selectedState != null){
			console.log("selectedState != null")
			// Check transitions belonging to selected state
			for(var j=0; j < selectedState.tranList.length; j++){
				tempTran = selectedState.tranList[j];
		  
				// Successful click on a transition
				if( distance( tempTran.entX, tempTran.entY, clickX, clickY) < 30 ){
					// DEBUG
					//console.log("Transition " +  tempTran.character + " from State " + selectedState.label + " clicked");
					lastKeyCode = tempTran.character;
					selectedTran = tempTran;
					if( Turing ){
						populateRWS();
					}
					selectedState.moving = false;	
					toggleSelect(selectedState);
					selectedState = null;
					
					
					return;
				}
			}
		}
 	
 
  
		if(pm.value == PlacementMode.TRANSITION.value){
			console.log("placement mode is transition");
			if(drawingTran == false){
				drawingTran = true;
				tranStartState = clickedState;
			}
			else{
				if( clickedState != null && tranStartState != null ){
					makeNewTran(tranStartState, clickedState);
					clickedState = null;
					tranStartState = null;
				}
				drawingTran = false;
			}
		}
  
		if(pm.value == PlacementMode.STATE.value){
			console.log("placement mode is state");
			if( selectedState != null ){
				console.log(selectedState.label);
				toggleSelect(selectedState);
				selectedState = null;
			}	  
			if( clickedState == null ){
				numStates += 1;
				var newState;
				if( Turing ){
					newState = new TuringState(clickX,clickY, numStates);
				}
				else{
					newState = new State(clickX,clickY, numStates);
				}
				Qstates.push(newState);
				clearAccepted();
			}
			else{
				selectedState = clickedState;
				toggleSelect(selectedState);
				selectedTran = null;
				if(Turing){
					document.getElementById('RWS').style.visibility = "hidden";
				}
			}
		}
	}
 
	// DEBUG
	// alert (evt.type.toUpperCase() + ' mouse event:'
	//  +'\n pageX = ' + clickX
	//  +'\n pageY = ' + clickY 
	//  +'\n clientX = ' + evt.clientX
	//  +'\n clientY = '  + evt.clientY 
	//  +'\n screenX = ' + evt.screenX 
	//  +'\n screenY = ' + evt.screenY
	// );
	return false;
}

// Updates the variables tracking the mouse's position
updateMousePos = function(e){	
	y = c.offsetTop;
	Yoffset = y;
	Xoffset = 5;
	mouseX = e.clientX -= Xoffset;
	mouseY = e.clientY -= Yoffset;
	
}

// Make a new transition with start and end states as params
function makeNewTran( start, end ){
	
	var newTran = new Transition(start, end);
	if( Turing ){
		newTran.writeCharacter = Alphabet[0];
		newTran.tapeShift = 0;
	}
	addTransition(start, newTran);
	clearAccepted();
}

// removes selcted objects from the machine
deleteSelected = function(){
		
	// If current selection is a state
	if( selectedState != null ){
		console.log("Deleting State " + selectedState.label);
		StateDestroy(selectedState);
		selectedState = null;
		numStates -= 1;
	}
	
	// If current selection is a transition
	if( selectedTran != null ){
		console.log("Deleting Transition " + selectedTran.character);
		selectedTran.destroy();
	}
}
