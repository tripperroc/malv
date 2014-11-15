/**
*@authors Sam Shiffman (sas5057), Selene Chew (sec6971), Nathaniel Mathews (nhm6364), Evan Witz (emw9004)
*
* This file implements DFA Minimization
*/


function minimize(){

	//grab the string from textbox
	var stringToLoad = document.getElementById("stringText").value; 
	
	//test if it works
	console.log("it works");
	console.log(stringToLoad);
	
	//update Qstates
	unpackString(stringToLoad);
}