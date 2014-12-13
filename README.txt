Instructions for use:

1. Navigate to main.html

2. construct a DFA either graphically or by inputting a string in the textbox.
	a. if you construct it graphically, you need to hit the "Display String" button
	to display the string in the textbox
	b. if you are loading from string from the textbox, you must hit "Load from String" button
	and add initial and final states

NOTE: the DFA must be in proper form in the textbox for the Minimization to work.

3. Hit the "Minimize" button.

4. Hit the "Display String" button.

NOTE: The textbox is now populated with the minimized DFA in JSON format,
however, there is a graphical error causing it to be displayed on top of the previous
DFA.

NOTE: The JSON does not include initial and final states of the minimized DFA,
however, we print them in the console to confirm that they are correct.


TO DISPLAY THE MINIMIZED DFA PROPERLY:
	1. copy the string in the textbox.
	2. refresh the page. (to clear the canvas)
	3. paste the copied string back into the textbox
	4. Hit the "Load from String" button.

NOTE: sometimes when deleting multiple states in the minimize function, the resulting
string DFA will fail to appear properly, but upon inspection the string is correct.
	-this bug can be replicated without minimize by constructing a 3 state DFA, creating
	a transition from the 1st state to the 3rd state, deleting the 2nd state, clicking
	"Display String" button, which should display the DFA shown in the canvas in the
	textbox. Click "Load from String" button to recreate error. (the transition between
	states 1 and 3 fails to display)



Test 1: (from HW 6, 1A)

NOTE: it must be all on one line for copy/paste purposes

Original DFA: Make state 1 initial state, states 2 and 6 final states

{"0":{"tranList":[{"character":"A","endState":2},{"character":"B","endState":3}],"id":1,"label":1,"x":196,"y":231},"1":{"tranList":[{"character":"A","endState":4},{"character":"B","endState":5}],"id":2,"label":2,"x":312,"y":167},"2":{"tranList":[{"character":"A","endState":6},{"character":"B","endState":7}],"id":3,"label":3,"x":291,"y":354},"3":{"tranList":[{"character":"A","endState":4},{"character":"B","endState":5}],"id":4,"label":4,"x":502,"y":54},"4":{"tranList":[{"character":"A","endState":6},{"character":"B","endState":7}],"id":5,"label":5,"x":490,"y":209},"5":{"tranList":[{"character":"A","endState":4},{"character":"B","endState":5}],"id":6,"label":6,"x":470,"y":336},"6":{"tranList":[{"character":"A","endState":6},{"character":"B","endState":7}],"id":7,"label":7,"x":497,"y":450}}

Minimized DFA: check console, state 1 should be initial and state 2 should be final
compare the string in your textbox with the string below.

{"0":{"tranList":[{"character":"A","endState":2},{"character":"B","endState":1}],"id":1,"label":1,"x":216,"y":224},"1":{"tranList":[{"character":"A","endState":4},{"character":"B","endState":1}],"id":2,"label":2,"x":324,"y":169},"2":{"tranList":[{"character":"A","endState":4},{"character":"B","endState":1}],"id":4,"label":4,"x":502,"y":54}}


Test 2: (from HW 6, 1B)

Original DFA: Make 1 initial state, states 5, 6, 9 final states

{"0":{"tranList":[{"character":"A","endState":2},{"character":"B","endState":3}],"id":1,"label":1,"x":242,"y":205},"1":{"tranList":[{"character":"A","endState":4},{"character":"B","endState":9}],"id":2,"label":2,"x":304,"y":319},"2":{"tranList":[{"character":"A","endState":5},{"character":"B","endState":4}],"id":3,"label":3,"x":333,"y":150},"3":{"tranList":[{"character":"A","endState":6},{"character":"B","endState":4}],"id":4,"label":4,"x":452,"y":183},"4":{"tranList":[{"character":"A","endState":5},{"character":"B","endState":7}],"id":5,"label":5,"x":493,"y":44},"5":{"tranList":[{"character":"A","endState":9},{"character":"B","endState":7}],"id":6,"label":6,"x":618,"y":188},"6":{"tranList":[{"character":"A","endState":8},{"character":"B","endState":5}],"id":7,"label":7,"x":652,"y":70},"7":{"tranList":[{"character":"A","endState":7},{"character":"B","endState":6}],"id":8,"label":8,"x":707,"y":273},"8":{"tranList":[{"character":"A","endState":9},{"character":"B","endState":8}],"id":9,"label":9,"x":573,"y":386}}

Minimized DFA: check console, state 1 should be the initial state and state 5 should be final
compare the string in your textbox with the string below

{"0":{"tranList":[{"character":"A","endState":2},{"character":"B","endState":3}],"id":1,"label":1,"x":242,"y":205},"1":{"tranList":[{"character":"A","endState":3},{"character":"B","endState":5}],"id":2,"label":2,"x":304,"y":319},"2":{"tranList":[{"character":"A","endState":5},{"character":"B","endState":3}],"id":3,"label":3,"x":333,"y":150},"3":{"tranList":[{"character":"A","endState":5},{"character":"B","endState":7}],"id":5,"label":5,"x":493,"y":44},"4":{"tranList":[{"character":"B","endState":5},{"character":"A","endState":7}],"id":7,"label":7,"x":652,"y":70}}





