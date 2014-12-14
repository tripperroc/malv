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
var isCreating = false;
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
    
    var currentChar = ''; // Stores transition character.
    var tempLeft = null;
    var tempRight = null;

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
                
                if( scanRightOne(input) == null || /[a-zA-Z0-9()]/.test( scanRightOne(input) ) ){
                    // pop first character and make a transition
                    input = input.substr(1);
                    
                    // Create 2 new states
                    tempLeft = createNewState();
                    tempRight = createNewState();
    
                    // Create new transition
                    lastKeyCode = currentChar;
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
                    
                } else if( /\*/.test( scanRightOne( input ) ) ){
                
                    input = input.substr(2);
                    // Create Kleene star section
                    var tempKleeneStates = attachKleeneStar( currentChar );
                    
                    // link with main list
                    if( head == null ){
                        head = tempKleeneStates[0];
                    } 
                    if( tail != null ){
                        lastKeyCode = EPS;
                        makeNewTran(tail, tempKleeneStates[0]);
                    }
                    tail = tempKleeneStates[1];
                    
                }
            
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

/* Checks the second character of the current input string. */
function scanRightOne( input ){
    if( input.length >= 2 ){
        return input.charAt(1);
    } else {
        return null;
    }
}

/* Clears the machine in case the regular expression is invalid. */
function resetMachine(){
    Qstates = [];
    Qzero = null;
    FStates = [];
}

/* Creates a new state to use in the machine. */
function createNewState(){
    stateCount++;
    shiftRight();
    this.tempState = new State( nextX, nextY, stateCount );
    Qstates.push( tempState );
    clearAccepted();
    
    return tempState;
}

function attachKleeneStar( input ){

    var currentChar = '';
    var isLooping = true;

    // Create 2 new (framework) states
    var tempFirst = createNewState();
    var tempHead = createNewState();
    
    // Placeholders for states to follow
    var tempTail = null;
    var tempLeft = null;
    var tempRight = null;
    
    // Link together
    lastKeyCode = EPS;
    makeNewTran(tempFirst, tempHead);
    
    // TODO - Link center
    while( isLooping ){
    
        // read first character from input
        currentChar = input.charAt(0);
        if( /[a-zA-Z0-9]/.test(currentChar) ){
                
            if( scanRightOne(input) == null || /[a-zA-Z0-9()]/.test( scanRightOne(input) ) ){
                // pop first character and make a transition
                input = input.substr(1);
                    
                tempLeft = createNewState();
                lastKeyCode = EPS;
                
                // link first state to end of current chain
                if( tempRight != null ){
                    makeNewTran(tempRight, tempLeft);
                } else {
                    makeNewTran(tempHead, tempLeft);
                }
                
                tempRight = createNewState();
    
                // link second state to end of current chain
                lastKeyCode = currentChar;
                makeNewTran(tempLeft, tempRight);
    
                // Set the tail as needed
                if( tempTail != null ){
                    lastKeyCode = EPS;
                    makeNewTran(tempTail, tempLeft);
                }
                tempTail = tempRight;  
            
            } 
            
        } else {
                // Machine is invalid.
                isCreating = false;
                isLooping = false;
                resetMachine();
        }
        
        if( input.length == 0 ){
            isLooping = false;
        }
        
    }
    
    // Link connecting loop
    lastKeyCode = EPS;
    makeNewTran(tempFirst, tempTail);
    lastKeyCode = EPS;
    makeNewTran(tempTail, tempHead);
    
    tail = tempTail;
    
    return [tempFirst, tempTail];
    
}

/* Used on the finished NFA to connect the initial and final states. */
function attachEnds(){
    
    // Create start and end states
    var tempBegin = new State( 75, 100, '0' );
    var tempEnd = createNewState();
    Qstates.push(tempBegin);
    
    // Link start and end to head and tail, respectively
    lastKeyCode = EPS;
    makeNewTran(tempBegin, head);
    lastKeyCode = EPS;
    makeNewTran(tail, tempEnd);
    
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