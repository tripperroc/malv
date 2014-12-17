/**
* DFA to Regex Converter
*
* Converts the DFA into a Generalized Finite Automota (GFA)
* Uses Kleene's algorithm and state removal
* To convert a GFAto a regular expression
*
* Currently only handles DFA's
* The GFA is meant to be somewhat temporary, to be combined into a DFA/NFA/GFA all in one
* Focused more on the expression algorithm
*/

////
//Vars
////
var gfa = null;
var EMPTY = "\u00F8";
var EPSILON = "\u03B5"; //used for displaying epsilon in the expression not the value of the transition

////////////////////////////////////////////////////////////
/////////////////////////CLASSES////////////////////////////
////////////////////////////////////////////////////////////

//GFA - Generalized transtion graph
function GFA() {
    //vars
    this.GFAstates = [];
    this.GFAstartState =null;
    this.GFAfinalStates = [];

    //construct
    var newState = null;
    var oldState = null;
    for(var i=0; i<Qstates.length; i++) { //makes states
        oldState = Qstates[i];
        var final = ($.inArray(oldState, FStates) == -1 )? false : true;
        var init = (oldState != Qzero ? false : true);
        newState = new GFAState(oldState, init, final);
        this.GFAstates.push(newState);
        if (final) { this.GFAfinalStates.push(newState); }
        if (init) { this.GFAstartState = newState; }
    }
   
    //make transitions
    for (var i = 0; i < this.GFAstates.length; i++) {
        var start = this.GFAstates[i];
        var end;
        for (var j = 0; j < start.orginial.tranList.length; j++) {
            end = start.orginial.tranList[j].endState;
            for (var k = 0; k < this.GFAstates.length; k++) {
                if (this.GFAstates[k].orginial == end) {
                    var newTran = new GFATransition(start.orginial.tranList[j].character,start,this.GFAstates[k]);
                    start.addGFATransition(newTran);
                }
            }
        }

        
    }


    //functions
    this.makeNewStates = makeNew;
    this.convertToGFA = convertGFA;
    this.removeState = removeState;
    this.combineTransitions = combineTrans;
    this.getTranstionsForStateRemoval = getTranstionsForStateRemoval;
    this.getExpression = getExpression;
    this.addAllNewTransitions = addAllNewTransitions;
    this.removeAllTransitions = removeAllTransitions;
    this.getFinalExpression = getFinalExpression;
    this.getII = getII;
    this.getIJ = getIJ;
    this.getJJ = getJJ;
    this.getJI = getJI;
    


}

//GFA State
function GFAState(oldState,init,final) {
    //vars
    this.final = final;
    this.initial = init;
    this.transitions = [];
    this.orginial = oldState;
    
    //functions
    this.addGFATransition = addGFATran;
    this.hasTranTo = hasTranTo;
}

//GFA Transition
function GFATransition(char,start,end) {
    //vars
    this.transitionValue = char;
    this.startState = start;
    this.endState = end;
}

//Regex Expression
//??


///////////////////////////////////////////////////////////
/////////////////////FUNCTIONS/////////////////////////////
///////////////////////////////////////////////////////////



//adds a transition to a GFA state
function addGFATran(transition) {

    this.transitions.push(transition);

}

//Coverts DFA to a regular expression and outputs it
//Is called when the button is pushed
function convertToRegularExp() {
    // Check if its a valid DFA before proceeding 
    if (!checkValidMachine()) {
        alert("Invalid Machine state: " + error);
        return;
    }
    //start the convertion into a generalized finite automota
    gfa = new GFA();
    if (gfa.GFAfinalStates.length > 1 ||gfa.GFAfinalStates[0] == gfa.GFAstartState ) { //make new initial and final states
        gfa.makeNewStates();
    }
    gfa.convertToGFA(); //finishes the GFA by adding any missing empty transitions

    //start removing states
    while (gfa.GFAstates.length > 2) {
        for (var i = 0; i < gfa.GFAstates.length; i++) {
            var removingState = gfa.GFAstates[i];
            if (removingState != gfa.GFAstartState && removingState != gfa.GFAfinalStates[0]) {
                gfa.removeState(removingState);
                i = 0; //restart so we don't skip any states
            }
        }
    }
        
    //get the final regular expression from the simplified GFA
    if (gfa.GFAstates.length == 2) {
        var exp = gfa.getFinalExpression();
        alert(exp);
    }



}

//Consolidates multiple final states into one final state
function makeNew() {
    var newFinalState = new GFAState(null, false, true);
    var removeStates = [];
    for (var i = 0; i < this.GFAfinalStates.length; i++) {
        var oldFinal = this.GFAfinalStates[i];
        var newEmptyTran = new GFATransition("",oldFinal,newFinalState);
        oldFinal.addGFATransition(newEmptyTran);
        oldFinal.final = false;
    }
    this.GFAfinalStates = [];
    this.GFAfinalStates.push(newFinalState);
    this.GFAstates.push(newFinalState);

    

}

//Completes the GFA by adding any remaining null transitions that don't exist.
//and combining multiple transitions along the same path
function convertGFA() {
    
    //add missing
    for (var i = 0; i < this.GFAstates.length; i++) {
        var fromState = this.GFAstates[i];
        for (var j = 0; j < this.GFAstates.length; j++) {
            var toState = this.GFAstates[j];
            this.combineTransitions(fromState, toState);
            if(!fromState.hasTranTo(toState)){
                var newEmptyTran = new GFATransition(EMPTY,fromState,toState );
                fromState.addGFATransition(newEmptyTran);
            }
        }
    }
    
}

//if this state has a transition to the given toState
//returns - boolean 
function hasTranTo(toState){
    for (var i=0; i<this.transitions.length; i++){
        if (this.transitions[i].endState == toState){
            return true;
        } 
    }
    return false;
}

//removes the state from the GFA
//redoing any transitions along the way
//@param state - the GFAstate being removed
function removeState(state) {
    var newTransitions = this.getTranstionsForStateRemoval(state);
    this.removeAllTransitions();
    var index = this.GFAstates.indexOf(state);
    if(index != -1){
        this.GFAstates.splice(index,1);
    }
    this.addAllNewTransitions(newTransitions);
    
}

//gets all the transitions needed to remove the given state
//using Kleene's Algorithm it gets the expression between two states that pass through the removal state
//All of the new transitions are added to newTransitions array to be added
//@param state - the state being removed
//@returns GFATransition[] newTransitions
function getTranstionsForStateRemoval(state) {
    var newTransitions = [];
    for (var i = 0; i < this.GFAstates.length; i++) {
        var tState = this.GFAstates[i];
        if (state != tState) {
            for (var j = 0; j < this.GFAstates.length; j++) {
                var fState = this.GFAstates[j];
                if (state != fState) {
                    var exp = this.getExpression(tState, fState, state);
                    var newTran = new GFATransition(exp,fState,tState);
                    newTransitions.push(newTran);
                }
            }
        }
    }
    return newTransitions;
}


//returns the transtion between two states
//@returns - GFAtransition
function getTransitionBetween(fromState, toState) {
    var transitions = fromState.transitions;
    for (var i = 0; i < transitions.length; i++) {
        var tState = transitions[i].endState;
        if (toState == tState) {
            return transitions[i];
        }
    }
}

/*  Gives the expression between two states by going through a third state that is being removed
          It uses the formula from Kleene's algorithm:
*         r(pq) = r(pq) + r(pk)r(kk)*r(kq), where r() is returns the regular expression
*         between states where p, q, k, are the start, end, and removal states respectively
*/
function getExpression(toState, fromState, removeState){
    var pq;
    var pk;
    var kk;
    var kq;

    pq = getTransitionBetween(fromState, toState).transitionValue;
    pk = getTransitionBetween(fromState, removeState).transitionValue;
    kk = getTransitionBetween(removeState, removeState).transitionValue;
    kq = getTransitionBetween(removeState, toState).transitionValue;

    var tempExp1 = star(kk);
    var tempExp2 = concatenate(pk, tempExp1);
    var tempExp3 = concatenate(tempExp2, kq);
    var tempExp4 = or(pq, tempExp3);

    return tempExp4;
}

//removes all transtions from the GFA in order to add the new ones
//post-state-removal
function removeAllTransitions() {
    var states = this.GFAstates;
    for (var i=0;i<states.length;i++){
        states[i].transitions = [];
    }
}

//Adds all new transitions to a GFA
//Used to add the new transitions after state removal
//@param transitions - An array of GFA transitions
function addAllNewTransitions(transitions) {
    var states = this.GFAstates;
    for (var i=0; i<transitions.length;i++){
        var newTran = transitions[i];
        newTran.startState.transitions.push(newTran);
    }
}



//returns the regex of kleene-star of the given expression
function star(exp) {
    if (exp == EMPTY || exp == "") {
        return "";
    }
    if (exp.length > 1 && !(exp.charAt(0)=="(" && exp.charAt(exp.length-1) ==")")){
        exp = "(" + exp + ")";
    } else {
        if (exp.substring(exp.length - 1, exp.length) == "*") { //already starred
            return exp;
        }
    }

    return exp + "*";
}

//returns the concatenation of two given expressions
function concatenate(exp1, exp2) {
    if (exp1 == EMPTY || exp2 == EMPTY){ //concat w/ nullset = nullset
        return EMPTY;
    }else if (exp1 == ""){//concat with epsilon = orginal
        return exp2;
    }else if (exp2 == ""){
        return exp1;
    }
    if (numSubExpressions(exp1) >1)//Needs parens if one has multipule sub expressions
        exp1 = "(" + exp1 + ")";
    if (numSubExpressions(exp2)>1)
        exp1 = "(" + exp2 + ")";

    return exp1 + exp2;
}

//returns 'or' (union) expression of the two given expressions
function or(exp1, exp2) {
    if (exp1 == EMPTY) return exp2;
    if (exp2 == EMPTY) return exp1;
    if (exp1 == "" && exp2 == "") return "";
    if (exp1 == ""){
        exp1 = EPSILON; //needs to display the epsilon
    }
    if (exp2 == ""){
        exp2 = EPSILON;
    }
    return   exp1+"+"+exp2;
}

//checks if there are multiple transitions from one state to another
//if so it combines them into one transition using '+'
function combineTrans(fromState, toState) {
    var transitions = [];
    for (var i = 0; i < fromState.transitions.length; i++) {
        if (fromState.transitions[i].endState == toState) {
            transitions.push(fromState.transitions[i]);
        }
    }
    if (transitions.length < 2) return;
    var newExp = "(";
    for (var i = 0; i < transitions.length; i++) {
        newExp += transitions[i].transitionValue + "+";
        var index = fromState.transitions.indexOf(transitions[i]);
        if (index != -1) {
            fromState.transitions.splice(index, 1);
        }
    }
    newExp = newExp.substring(0, newExp.length - 1);
    newExp += ")";
    var newSingleTransition = new GFATransition(newExp, fromState, toState);
    fromState.transitions.push(newSingleTransition);


}
//Combines the expressions from the last two states
// using the transitions between i and j which are the inital and final states 
//Again from Kleene's algorithm
function getFinalExpression() {
    var ii = this.getII();
    var ij = this.getIJ();
    var jj = this.getJJ();
    var ji = this.getJI();

    var exp1 = concatenate(star(ii), concatenate(ij, concatenate(star(jj), ji)))
    var exp2 = concatenate(star(ii), concatenate(ij, star(jj)));

    return concatenate(star(exp1), exp2);
}

//gets the transtion between the inital state and itself in the final simple FA
//return exp
function getII() {
    var tran = getTransitionBetween(this.GFAstartState, this.GFAstartState);
    return tran.transitionValue;
}

//gets the transtion between the inital state and the final state in the final simple FA
//return exp
function getIJ() {
    var tran = getTransitionBetween(this.GFAstartState, this.GFAfinalStates[0]);
    
    return tran.transitionValue;
}
//gets the transtion between the final state and itself in the final simple FA
//return exp
function getJJ() {
    var tran = getTransitionBetween(this.GFAfinalStates[0], this.GFAfinalStates[0]);
    return tran.transitionValue;star
}

//gets the transtion between the final state and the inital state in the final simple FA
//return exp
function getJI() {
    var tran = getTransitionBetween(this.GFAfinalStates[0], this.GFAstartState);
    return tran.transitionValue;
}

//counts the number of sub expressions a given expression has
function numSubExpressions(exp) {
    var num;
    var level=0;
    for (var i = 0; i < exp.length; i++) {
        if (exp.charAt(i) == "(")
            level++;
        if (exp.charAt(i) == ")")
            level--;
        if (exp.charAt(i) == "+")
            continue;
        if (level != 0)
            continue;
        num++;

    }

    return num;
}