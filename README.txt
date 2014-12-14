Branch vxb4825-ams8560-cxk1506 was created by: 
Val Booth <vxb4825@rit.edu>,
Aaron Stadler <ams8560@rit.edu> and
Caleb Kofahl <cxk1506@rit.edu>.

We created the following files:
NFA.js - Script for the Nondeterministic Finite Automata
NFA.html - HTML page for the Nondeterministic Finite Automata

We made the following changes:

We added a radio button and prompt for state naming. The user
can chose to autonumber states, in which case every created
state is q#, where # is one number higher than the last created
state name. If the user chooses to prompt for state name, a
javascript prompt will ask the user to name each state they
create. State naming convention can be changed at any time.

We removed the first rectangular text box on original versions
of the HTML pages, and added the instructions: "Please enter a 
string to be run through the DFA(NFA) here:" above the long,
rectangular box right above the canvas.

We added an epsilon transition button on nfa.html, to generate
epsilon transitions so the user didn't have to enter the 
epsilon character themselves.

    State.js Changes:
      We changed the addTransition attribute to the new
      addNFATransition function. We also added the
      addNFATransition function which allows for multiple
      transitions with the same character. Instead of just an
      array of transitions, each transition is now an array of
      states.
      
    NFA.js Info:
      We added the file NFA.js which was a copy of the DFA.js file.
      Then we added a variable for the unicode value of the epsilon
      character. We also made currentStates and prevStates arrays of
      states, since NFAs can be in multiple states at once. 
      Modified the step function to allow for using an array of
      current states and getting an array of next states. Also 
      added code to allow for epsilon transitions. In addition we
      changed the readInput and readInputAnimated functions to
      allow for starting in multiple transitions if q_0 has epsilon
      transitions in it.
      
  
