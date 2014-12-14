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
    this.accept = [];
};

//Clears all data from the PDA
//Does not reset EPSILON
PDA.prototype.resetPDA = function() {
    this.start = null;
    this.current = null;
    this.states = {};
    this.accept = [];
}

//Redefine the EPSILON character
//This operation should be called before adding transitions
//Otherwise it will break the PDA
//char is the new character to represent epsilon
PDA.prototype.setEPSILON = function(char) {
    this.EPSILON = char;
};

//Adds a state to the PDA if q is a new name
//Returns true if newState added, false if a state with the name already existed
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
//Does nothing if state was already an accepting state
PDA.prototype.setAccept = function(q) {
    var b = this.addState(q);
    if(!this.accept.hasOwnProperty(q))
        this.accept.push(q);
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
};

//Returns a list of all the states. Start state is first
//Returns null if there are no states
PDA.prototype.getStates = function() {
    if(this.start === null)
        return null;
    var l = [];
    for(var q in this.states)
        if(this.states.hasOwnProperty(q) && q !== this.start)
            l.push(q);
    l.sort();
    l.unshift(this.start);
    return l;
};

//Returns a list of all input characters the transition function is defined under
//Does not include the EPSILON character
PDA.prototype.getSigma = function() {
    var l = [];
    for(var q in this.states){
        if(this.states.hasOwnProperty(q)){
            for(var c in this.states[q]){
                if(this.states[q].hasOwnProperty(c)){
                    if(c !== this.EPSILON && l.indexOf(c) == -1)
                        l.push(c)
                }
            }
        }
    }
    l.sort();
    return l;
};

//Returns a list of all stack characters the transition function is defined under
//Does not include the EPSILON character
PDA.prototype.getGamma = function() {
    var l = [];
    for(var q in this.states){
        if(this.states.hasOwnProperty(q)){
            for(var c in this.states[q]){
                if(this.states[q].hasOwnProperty(c)){
                    for(var s in this.states[q][c]){
                        if(this.states[q][c].hasOwnProperty(s)){
                            if(s !== this.EPSILON && l.indexOf(s) == -1)
                                l.push(s);
                            for(var i = 0; i<this.states[q][c][s].length; i++){
                                var x = this.states[q][c][s][i][1];
                                if(x !== this.EPSILON && l.indexOf(x) == -1)
                                    l.push(x);
                            }
                        }
                    }
                }
            }
        }
    }
    l.sort();
    return l;
};

//Returns the start state
PDA.prototype.getStart = function() {
    return this.start;
};

//Returns the accepting states in sorted order
PDA.prototype.getAccept = function() {
    this.accept.sort();
    return this.accept;
};

//Returns an array of strings representing all the transitions.
PDA.prototype.getDelta = function() {
    var l = [];
    for(var q in this.states){
        if(this.states.hasOwnProperty(q)){
            for(var c in this.states[q]){
                if(this.states[q].hasOwnProperty(c)){
                    for(var s in this.states[q][c]){
                        if(this.states[q][c].hasOwnProperty(s)){
                            for(var i = 0; i<this.states[q][c][s].length; i++){
                                var x = this.states[q][c][s][i];
                                l.push("("+q+","+c+","+s+") -> ("+x[0]+","+x[1]+")");
                            }
                        }
                    }
                }
            }
        }
    }
    l.sort();
    return l;
};

//Converts the PDA into a string for the purpose of storing on the server
//Fails if control characters are used as part of state names or transition characters
//Orphaned states (those with no transitions to/from) are not included)
PDA.prototype.serialize = function() {
    var s = "{["+this.EPSILON;
    
    s+="]["+this.getStart()+"][";
    
    var d = this.getDelta();
    
    var i=0;
    
    for(k in d){
        i++;
        s+=d[k]+";";
    }
    
    if(i==0)
        s+=";;";
    else
        s=s.substring(0,s.length-1);
    
    s+="][";
    
    var a = this.getAccept();
    
    i=0;
    
    for(k in a){
        i++;
        s+=a[k]+",";
    }
    
    if(i==0)
        s+=";;";
    else
        s=s.substring(0,s.length-1);
    
    s+="]}";
    return s;
};

//Loads a PDA from a serialized string
PDA.prototype.loadPDA = function(s){
    this.resetPDA();
    
    var i = s.indexOf(']');
    var e = s.slice(2,i);
    s = s.slice(i+1);
    
    this.setEPSILON(e);
    
    i = s.indexOf(']');
    var c = s.slice(1,i);
    s = s.slice(i+1);
    
    this.setStart(c);
    
    i = s.indexOf(']');
    var d = s.slice(1,i);
    s = s.slice(i+1);
    
    if(d.indexOf(";;")==-1){
        d+=";";
        i = d.indexOf(';');
        while(i!=-1 ){
            var t = d.slice(0,i);
            
            var a = t.indexOf(",");
            
            var q1 = t.slice(1,a);
            t = t.slice(a+1);
            
            a = t.indexOf(",");
            
            var c = t.slice(0,a);
            t = t.slice(a+1);
            
            a = t.indexOf(")");
            
            var s1 = t.slice(0,a);
            t = t.slice(a+6);
            
            a = t.indexOf(",");
            
            var q2 = t.slice(0,a);
            t = t.slice(a+1);
            
            a = t.indexOf(")");
            
            var s2 = t.slice(0,a);
            
            this.addTransition(q1,c,s1,q2,s2);
            
            d = d.slice(i+1);
            i = d.indexOf(';');
        }
    }
    
    i = s.indexOf(']');
    var f = s.slice(1,i);
    
    if(f.indexOf(";;")==-1){
        f+=",";
        i = f.indexOf(',');
        while(i!=-1){
            
            this.setAccept(f.slice(0,i));
            
            f = f.slice(i+1);
            i = f.indexOf(',');
        }
    }
    
};

var m = new PDA();

m.addTransition('q','_','_','r','$');
m.addTransition('r','a','_','r','a');
m.addTransition('r','_','_','s','_');
m.addTransition('s','b','a','s','_');
m.addTransition('s','_','$','t','_');
m.setAccept('t');

var s = m.serialize();

var m2 = new PDA();

m2.loadPDA(s);

console.log(m.getDelta());
console.log(m2.getDelta());
