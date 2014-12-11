/**
 * Will be used to convert from a regular expression to an NFA.
 *
 * - by Michael Schug (mss9627) 
 */

/* Used for creating states. */
var nextX, nextY;
var startingX = 75;
var startingY = 100;
var stateCount = 0;
var EPS = '\u03B5'; // Unicode for the epsilon character.

var head, tail;             // Storage for the current start and end nodes for the NFA.
var kleeneSkip, kleeneHead, kleeneTail; // Storage for start and end nodes within a Kleene star section.
var splitHead, splitTail;   // Storage for start and end nodes when selecting from branches.
var currentTransition;      // Used to create temporary transitions.

/* 
 * Main function for the solver.
 * Takes an input string and reads through each character,
 * creating states and transitions in the NFA as necessary.
 * 
 * As of now, only linear RE's are accepted (no grouping or Kleene star).
 */
function regexToNFA( input ){
    
    // Reset the variables used for the last conversion.
    // Prevents bugs from submitting multiple expressions.
    nextX = startingX;
    nextY = 100;
    stateCount = 0;
    head = null;
    tail = null;
    
    this.currentChar = ''; // Stores transition character.
    this.isCreating = false;  
    this.inKleeneStar = false; // Currently unused.
    this.inGroup = false;      // Currently unused.

    resetMachine();
    
    if( ! /[a-zA-Z0-9|*()]+/.test(input) ){
        // Input contains invalid characters
        alert("Invalid input.");
    } else {
    
        isCreating = true;
        while( isCreating ){
            
            // read first character from input
            currentChar = input.charAt(0);
            if( /[a-zA-Z0-9]/.test(currentChar) ){
                // pop first character and make a transition
                input = input.substr(1);
                attachCharacter( currentChar );
            } else {
                // Machine is invalid.
                isCreating = false;
                resetMachine();
            }
            
            if( input.length == 0 ){
                isCreating = false;
            }
            
        }
        
        if( input.length == 0 ){
            attachEnds();
            alert("Regular expression successfully converted.");
        } else {
            alert("Possibly valid input, functionality not yet finished.");
        }
        
    }
    
}

/* Clears the machine in case the regular expression is invalid. */
function resetMachine(){
    Qstates = [];
    Qzero = null;
    FStates = [];
}

/* 
 * Connects a single character in the NFA. 
 * Will work alone, inside a branch, or inside a Kleene star loop.
 */
function attachCharacter( input ){

    // Create 2 new states
    stateCount++;
    shiftRight();
    this.tempLeft = new State( nextX, nextY, stateCount );
    Qstates.push( tempLeft );
    clearAccepted();
    
    stateCount++;
    shiftRight();
    this.tempRight = new State( nextX, nextY, stateCount );
    Qstates.push( tempRight );
    clearAccepted();
    
    // Create new transitions
    lastKeyCode = input;
    makeNewTran(tempLeft, tempRight);
    
    // Set the head and tail as needed
    if( head == null ){
        head = tempLeft;
    }
    if( tail != null ){
        lastKeyCode = EPS;
        makeNewTran(tail, tempLeft);
    }
    tail = tempRight;
    
}

/* Used on the finished NFA to connect the initial and final states. */
function attachEnds(){
    
    // Create start state
    this.tempBegin = new State( 75, 100, '0' );
    
    // Create end state
    shiftRight();
    stateCount++;
    this.tempEnd = new State( nextX, nextY, stateCount );
    Qstates.push(tempBegin);
    Qstates.push(tempEnd);
    
    // Link start and end to head and tail, respectively
    lastKeyCode = EPS;
    makeNewTran(tempBegin, head);
    lastKeyCode = EPS;
    
    // Relink the list (not necessary but more readable)
    head = tempBegin;
    tail = tempEnd;
    
    // Set up start and end states for drawing
    Qzero = head;
    selectedState = tail;
    setSelectedAsAccept();
    selectedState = null;
    
    // Change public state number 
    // If more states are added after converting, the numbers on them will be correct.
    numStates = stateCount;
    
}

/* These are used to shift the position where states are drawn. */
function shiftRight(){
    nextX += 75;
    console.log($('#machineSpace').width() + ' ' + nextX);
    if(nextX >= $('#machineSpace').width() ){
        returnToLeft();
    }
}

function shiftDown(){
    nextY += 100;
}

function returnToLeft(){
    nextX = 75;
    shiftDown();
}