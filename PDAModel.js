//Push Down Automata Object
//Constuctor (var Machine = new PDA())
var PDA = function () {
    //The start state of the machine
    //This will default to the first state referenced.
    this.start = null;
    //The set of all state/stack pairs the machine is in nondeterministically
    this.current = null;
    //The character to denote epsilon transitions, and for reading/writing nothing to the stack
    this.EPSILON = '_';
    //The states and transitions between them
    this.states = {};
    //Set of all Accept States
    this.accept = new Set();
};

//Redefine the EPSILON character
//This operation should be called before adding transitions
//Otherwise it will break the PDA
//char is the new character to represent epsilon
PDA.prototype.setEPSILON = function(char) {
    this.EPSILON = char;
};

//Adds a state to the PDA if q is a new name
//Returns true if newState added, false otherwise
//This method is automatically invoked by addTransition if needed
//If no start states has been set,q will be the new start state
PDA.prototype.addState = function(q) {
    if(this.states.hasOwnProperty(q))
        return false;
    this.states[q] = {};
    if(this.start == null)
        this.start = q;
    return true;
};

//Sets the start state to state q
//If q does not exist, create it
//Returns false if q existed previously, true otherwise
PDA.prototype.setStart = function(q) {
    var b = this.addState(q);
    this.start = q;
    return b;
};

//Makes state q an accepting state
//If q does not exist, create it
//Return false if q existed previously, true otherwise
PDA.prototype.setAccept = function(q) {
    var b = this.addState(q);
    this.accept.add(q);
    return b;
};

//Makes state q not an accepting state
//Return false if q wasn't an accept state in the first place, true otherwise
PDA.prototype.unsetAccept = function(q) {
    if(!this.accept.has(q))
        return false;
    this.accept.delete(q);
    return true;
};

//Adds a new transition to the machine
//q1 is the initial state
//c is the input character
//s1 is the popped stack character
//q2 is the resulting state
//s2 is the pushed stack character
//Returns false if transtion existed already, true otherwise
PDA.prototype.addTransition = function(q1,c,s1,q2,s2) {
    //Adds the states if they do not exist
    this.addState(q1);
    this.addState(q2);
    if(!(this.states[q1].hasOwnProperty(c)))
        this.states[q1][c] = {};
    if(!(this.states[q1][c].hasOwnProperty(s1)))
        this.states[q1][c][s1] = [];
    
    for(i=0;i<this.states[q1][c][s1].length;i++)
        if(this.states[q1][c][s1][i][0]==q2 && this.states[q1][c][s1][i][1] == s2)
            return false;
    
    this.states[q1][c][s1].push([q2,s2]);
    return true;
};

//Removes a transition from the machine
//q1 is the initial state
//c is the input character
//s1 is the popped stack character
//q2 is the resulting state
//s2 is the pushed stack character
//Returns false if transtion never already, true otherwise
PDA.prototype.deleteTransition = function(q1,c,s1,q2,s2) {
    if(!this.states.hasOwnProperty(q1))
        return false;
    if(!this.states[q1].hasOwnProperty(c))
        return false;
    if(!this.states[q1][c].hasOwnProperty(s1))
        return false;
    
    for(i=0;i<this.states[q1][c][s1].length;i++)
        if(this.states[q1][c][s1][i][0]==q2 && this.states[q1][c][s1][i][1] == s2){
            this.states[q1][c][s1].splice(i,1);
            if(this.states[q1][c][s1].length==0){
                delete this.states[q1][c][s1];
                if(Object.keys(this.states[q1][c]).length==0)
                    delete this.states[q1][c];
            }
            return true;
        }
    
    return false;
};

//Removes a state from the PDA and all transtiotns to/from it
//returns false if the sate doesn't exist, true otherwise
PDA.prototype.deleteState = function(q) {
    if(!this.states.hasOwnProperty(q))
        return false;
    delete this.states[q];
    for(var k in this.states){
        if(this.states.hasOwnProperty(k)){
            for(var c in this.states[k]){
                if(this.states[k].hasOwnProperty(c)){
                    for(var s in this.states[k][c]){
                        if(this.states[k][c].hasOwnProperty(s)){
                            l = this.states[k][c][s].length;
                            while(l-- > 0){
                                if(this.states[k][c][s][l][0]==q){
                                    this.states[k][c][s].splice(l,1);
                                }
                            }
                            if(this.states[k][c][s].length==0){
                                delete this.states[k][c][s];
                                if(Object.keys(this.states[k][c]).length==0)
                                    delete this.states[k][c];
                            }
                        }
                    }
                }
            }
        }
    }
    return true;
}

var m = new PDA();

m.addTransition('q','a','_','r','_');
m.addTransition('q','a','_','r','a');
m.addTransition('q','b','_','r','a');
m.addTransition('q','b','a','s','_');
console.log(m);
