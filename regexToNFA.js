/**
 * Will be used to convert from a regular expression to an NFA.
 * Works by reading the input string from left to right,
 * checking both the current and next characters, then creating
 * states and transitions based on what is read.
 *
 *
 *
 */

var isCreating = false;
var currentChar;

function regexToNFA( input ){
    if( ! /[a-zA-Z0-9|*()]+/.test(input) ){
        alert("Invalid input.");
    } else {
    
        isCreating = true;
        while( isCreating ){
            
            currentChar = input.charAt(0);
            if( /[a-zA-Z0-9]/.test(currentChar) ){
                input = input.substr(1);
            } else {
                isCreating = false;
            }
            
            if( input.length == 0 ){
                isCreating = false;
            }
            
        }
        
        if( input.length == 0 ){
            alert("Valid input.");
        } else {
            alert("Possibly valid input, functionality not yet finished.");
        }
        
    }
}