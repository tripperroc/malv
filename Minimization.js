/**
*@authors Sam Shiffman (sas5057), Selene Chew (sec6971), Nathaniel Mathews (nhm6364), Evan Witz (emw9004)
*
* This file implements DFA Minimization
*/

//main minimization function
function minimize(){

	//grab the string from textbox
	var stringToLoad = document.getElementById("stringText").value; 
	
	
	//update Qstates
	unpackString(stringToLoad);
	

	
	var matrix = [];
	
	for (var i = 0; i < Qstates.length; ++i){
		matrix.push([]);
		for (var j = 0; j <= i; ++j){
			if (isFinalState(Qstates[i]) == isFinalState(Qstates[j])){
				matrix[i].push("");
			}
			else{
				matrix[i].push("epsilon");
			}
		}
	}
	
	
	
	matrix = minimizeHelp(matrix);
	
	
	
	
	//deepcopy
	var QstatesCopy = objectToArray(JSON.parse(JSON.stringify(arrayToObject(Qstates),stringifyHelp)));
	
	for (var i = 0; i < matrix.length; ++i){
		for (var j = 0; j < i; ++j){
			console.log(matrix[i][j], i, j);
			if (matrix[i][j] == ""){
				//merge the i and j
				merge(QstatesCopy[j],QstatesCopy[i]);
				break;
			}
		}
	}
	
	printString = JSON.stringify(Qstates, stringifyHelp);
	console.log(printString);
	clearInputCanvas();
	showString();
	//unpackString();
	
	
}

//recursive minimization function
function minimizeHelp(matrix){
	var didChange = false;
	
	//update matrix
	for (var i = 0; i < matrix.length; ++i){
		for (var j = 0; j < i; ++j){
			if (matrix[i][j] == ""){
				for (c in Qstates[i].transitions){//c is the transition character
					var k = findIndex(Qstates[i].transitions[c]);
					var l = findIndex(Qstates[j].transitions[c]);
					
					if (l<k){
						if (matrix[k][l] != ""){
							didChange = true;
							matrix[i][j] = c;
						}
					}
					else{
						if (matrix[l][k] != ""){
							didChange = true;
							matrix[i][j] = c;
						}
					}
				}
			}
		}
	}
	
	if (didChange){
		return minimizeHelp(matrix);
	}
	else{
		return matrix;
	}
}

function findIndex(state){
	for (var i = 0; i < Qstates.length; ++i){
		if (Qstates[i].id == state.id){
			return i;
		}
	}
}

function merge(state1,state2){
	for (var i = 0; i < Qstates.length; ++i){
		var state = Qstates[i];
		for (var j = 0; j < state.tranList.length; ++j){
			var t = state.tranList[j];
			if (t.endState.id == state2.id){
				var newT = new Transition(state,state1);
				newT.setCharacter(t.getCharacter());
				state.addTransition(newT);
			}
		}
	}
	
	for (var i = 0; i < Qstates.length; ++i){
		var state = Qstates[i];
		if (state.id == state2.id){
			for (var i = 0; i < FStates.length; ++i){
				var fstate = FStates[i];
				if (fstate.id == state.id){
					FStates.splice(i,1);
					break;
				}
			}
			if (state.id == Qzero.id){
				Qzero = null;
				Qzero = state1;
			}
			state.destroy();
			numStates -= 1;
			break;
		}
	}
	
	printString = JSON.stringify(Qstates, stringifyHelp);
	console.log(printString);
	console.log("initial state:", Qzero.id);
	console.log("final states:");
	for (var i = 0; i < FStates.length; ++i){
		var state = FStates[i];
		console.log(state.id);
	}
}

function isFinalState(state){
	for (var i = 0; i < FStates.length; ++i){
		var fstate = FStates[i];
		if (fstate.id == state.id){
			return true;
		}
	}
	return false;
}