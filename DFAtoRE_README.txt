DFA To Regular Expression Conversion README

Author: Elliot Allen (epa4566@rit.edu)

This primarily focused on the algorithm on generating the regular expression.
This process copys the existing DFA into a generalized finite automata(GFA) class.
This is meant to be somewhat temporary when combined into a DFA/NFA/GFA class. 

This conversion is only for DFA's at the moment. NFA conversion shouldn't be difficult to add.

To convert to RE simply press the 'Convert to RE' button when you've made a DFA.
A box will pop-up with the generated regular expression.

The process itself uses Kleene's algorithm and state removal to simplify the GFA to that with only
a final and initial state.

