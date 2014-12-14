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

//Clears the current run of the PDA
PDA.prototype.restart = function(){
    this.current = [[this.start,[]]];
}

//Returns a set of state/stack pairs given from applying the character c to it
PDA.prototype.step = function(s,c){
    var res = [];
    var stack = s[1].slice(0).pop();
    if(this.states.hasOwnProperty(s[0])){
        if(this.states[s[0]].hasOwnProperty(c)){
            if(this.states[s[0]][c].hasOwnProperty(this.EPSILON)){
                for(var i=0;i<this.states[s[0]][c][this.EPSILON].length;i++){
                    var q = this.states[s[0]][c][this.EPSILON][i];
                    var t = s[1].slice(0);
                    if(q[1]!=this.EPSILON)
                        t.push(q[1])
                    res.push([q[0],t]);
                }
            }
            if(typeof stack !== 'undefined'){
                if(this.states[s[0]][c].hasOwnProperty(stack)){
                    for(var i=0;i<this.states[s[0]][c][stack].length;i++){
                        var q = this.states[s[0]][c][stack][i];
                        var t = s[1].slice(0)
                        t.pop();
                        if(q[1]!=this.EPSILON)
                            t.push(q[1])
                        res.push([q[0],t]);
                    }
                }
            }
        }
    }
    return res;
};

//Helper function, returns true if the state stack pair p is NOT in the array a
function ssUnique(a,p){
    for(var i = 0; i < a.length; i++){
        if(a[i][0]==p[0]){
            if(a[i][1].length == p[1].length){
                var t = true;
                for(var j = 0; j < p[1].length; j++){
                    if(a[i][1][j]!=p[1][j]){
                        t=false;
                        break;
                    }
                }
                if(t)
                    return false;
            }
        }
    }
    return true;
}

//Steps through every nondeterministic state by reading character c
PDA.prototype.readChar = function(c){
    var next = [];
    if(c==this.EPSILON){
        for(var i = 0; i < this.current.length; i++){
            next.push(this.current[i].slice(0));
        }
    }
    for(var i = 0; i < this.current.length; i++){
        var r = this.step(this.current[i],c);
        for(var j = 0; j < r.length; j++){
            if(ssUnique(next,r[j]))
                next.push([r[j][0],r[j][1].slice(0)]);
        }
    }
    this.current = next;
};

//Reads the string and returns true if the PDA accepts
//Fails if the PDA requires more than 10 epsilon transitions before reading in a new character.
//This will fail if restart() has yet to be called
PDA.prototype.readString = function(s){
    for(var i in s){
        var l = this.current.length;
        var r = 10;
        while(r>0){
            this.readChar(this.EPSILON);
            
            //Pause here if you want to show each consequtive epsilon transition seperately
            
            var n = this.current.length;
            if(l==n)
                break;
            r--;
            l=n;
        }
        if(r==0){
            //There might be an infinite loop of transitions that neighter consume input nor stack character
        }
        
        //Pause in execution here if you want to show step by step
        
        this.readChar(s[i]);
        
        //Or here. Or both if you want epsilon transitions to register seperately
        
    }
    
    var l = this.current.length;
    var r = 10;
    while(r>0){
        this.readChar(this.EPSILON);
        
        //Pause here if you want to show each consequtive epsilon transition seperately
        
        var n = this.current.length;
        if(l==n)
            break;
        r--;
        l=n;
    }
    if(r==0){
        //There might be an infinite loop of transitions that neighter consume input nor stack character
    }
    
    for(var i = 0; i < this.current.length; i++){
        if(this.accept.indexOf(this.current[i][0]) != -1)
            return true;
    }
    return false;
};

//Accepts is functionally identical to readString except that it refreshes the PDA state before running.
//m.readString('aa');m.readString('bb') will give the same result as m.readString('aabb'),
//but m.accepts('aa');m.accepts('bb') will not give the same resutl as m.accepts('aabb')
//accepts can be called without invoking m.restart
PDA.prototype.accepts = function(s){
    this.restart();
    return this.readString(s);
};


//Test code
//The PDA for the language {a^(i)b^(i) | i>=0} and some test cases

test();

function test(){
    var m = new PDA();
    
    m.addTransition('q','_','_','r','$');
    m.addTransition('r','a','_','r','a');
    m.addTransition('r','_','_','s','_');
    m.addTransition('s','b','a','s','_');
    m.addTransition('s','_','$','t','_');
    m.setAccept('t');
    
    //Formal definition functions
    console.log("(Q,Sigma,Gamma,delta,q0,F)");
    console.log("Q = {"+m.getStates()+"}");
    console.log("Sigma = {"+m.getSigma()+"}");
    console.log("Gamma = {"+m.getGamma()+"}");
    console.log("delta = {"+m.getDelta()+"}");
    console.log("q0 = "+m.getStart());
    console.log("F = {"+m.getAccept()+"}");
    
    
    console.log('--------------------------------------------------------'+
                '--------------------------------------------------------');
    
    
    //String to store on the server for this machine
    var s = m.serialize();
    console.log("Serial form = {[epsilon][start state][transitions (state,input,stackIn) -> (state,stackOut)][accepting]}");
    console.log("Serial form = "+s);
    
    //Loading the string into a new machine
    var m2 = new PDA();
    m2.loadPDA(s);
    
    
    console.log('--------------------------------------------------------'+
                '--------------------------------------------------------');
    
    
    //Running the machine
    console.log("'aaaabbbb' = "+m2.accepts('aaaabbbb'));
    console.log("'aaab' = "+m2.accepts('aaab'));
    console.log("'abbb' = "+m2.accepts('abbb'));
    console.log("'ba' = "+m2.accepts('ba'));
    console.log("'' = "+m2.accepts(''));
    console.log("'abab' = "+m2.accepts('abab'));
    console.log("'aabb' = "+m2.accepts('aabb'));

}