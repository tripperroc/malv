/**
*@authors Sam Shiffman (sas5057), Selene Chew (sec6971), Nathaniel Mathews (nhm6364), Evan Witz (emw9004)
*
* This file implements DFA Minimization
*/

//main minimization function
function minimize(){

	//grab the string from textbox
	var stringToLoad = document.getElementById("stringText").value; 
	
	//test if it works
	console.log("it works");
	console.log(stringToLoad);
	
	//update Qstates
	unpackString(stringToLoad);
	
	/*
	jFstates = arrayToObject(FStates); // turn collection of states into an object
	printString = JSON.stringify(jFstates, stringifyHelp);
	console.log(printString);
	*/
	
	var matrix = [];
	
	for (var i = 0; i < Qstates.length; ++i){
		matrix.push([]);
		for (var j = 0; j <= i; ++j){
			if (isFinalState(Qstates[i]) == isFinalState(Qstates[j])){
				matrix[i].push("");
			}
			else{
				console.log("attempting to add epsilon");
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
				console.log("ij", i, j);
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
	console.log("in merge");
	console.log("state1", state1,"state2", state2);
	for (var i = 0; i < Qstates.length; ++i){
		var state = Qstates[i];
		console.log("state", state);
		for (var j = 0; j < state.tranList.length; ++j){
			var t = state.tranList[j];
			console.log("t", t);
			if (t.endState.id == state2.id){
				console.log("id equals");
				var newT = new Transition(state,state1);
				newT.setCharacter(t.getCharacter());
				state.addTransition(newT);
			}
		}
	}
	
	for (var i = 0; i < Qstates.length; ++i){
		var state = Qstates[i];
		console.log("i", i)
		console.log("state", state);
		console.log("stateid", state.id);
		console.log("state2id", state2.id);
		if (state.id == state2.id){
			console.log("in if");
			console.log("tranlist", state.tranList);
			state.destroy();
			break;
		}
	}
	
	printString = JSON.stringify(Qstates, stringifyHelp);
	console.log(printString);
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