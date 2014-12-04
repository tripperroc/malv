Instructions for use:

1. Navigate to main.html

2. construct a DFA either graphically or but inputting a string in the textbox.
	a. if you construct it graphically, you need to hit the "Display String" button
	to display the string in the textbox
	b. if you are loading from string, you must hit "Load from String" button
	and add final states

NOTE: the DFA must be in proper form in the textbox for the Minimization to work.

3. Hit the "Minimize" button.

4. Hit the "Display String" button.

NOTE: The textbox is now populated with the minimized DFA in JSON format,
however, there is a graphical error causing it to be displayed on top of the previous
DFA.

TO DISPLAY THE MINIMIZED DFA PROPERLY:
	1. copy the string in the textbox.
	2. refresh the page. (to clear the canvas)
	3. paste the copied string back into the textbox
	4. Hit the "Load from String" button.


Test 1: (from HW 6, 1A)


NOTE: it must be all on one line for copy/paste purposes

Original DFA:

{"0":{"tranList":[{"character":"A","endState":2},{"character":"B","endState":3}],"id":1,"label":1,"x":196,"y":231},"1":{"tranList":[{"character":"A","endState":4},{"character":"B","endState":5}],"id":2,"label":2,"x":312,"y":167},"2":{"tranList":[{"character":"A","endState":6},{"character":"B","endState":7}],"id":3,"label":3,"x":291,"y":354},"3":{"tranList":[{"character":"A","endState":4},{"character":"B","endState":5}],"id":4,"label":4,"x":502,"y":54},"4":{"tranList":[{"character":"A","endState":6},{"character":"B","endState":7}],"id":5,"label":5,"x":490,"y":209},"5":{"tranList":[{"character":"A","endState":4},{"character":"B","endState":5}],"id":6,"label":6,"x":470,"y":336},"6":{"tranList":[{"character":"A","endState":6},{"character":"B","endState":7}],"id":7,"label":7,"x":497,"y":450}}

Minimized DFA:

{"0":{"tranList":[{"character":"A","endState":2},{"character":"B","endState":3}],"id":1,"label":1,"x":196,"y":231},"1":{"tranList":[{"character":"A","endState":4},{"character":"B","endState":5}],"id":2,"label":2,"x":312,"y":167},"2":{"tranList":[{"character":"A","endState":6},{"character":"B","endState":7}],"id":3,"label":3,"x":291,"y":354},"3":{"tranList":[{"character":"A","endState":4},{"character":"B","endState":5}],"id":4,"label":4,"x":502,"y":54},"4":{"tranList":[{"character":"A","endState":6},{"character":"B","endState":7}],"id":5,"label":5,"x":490,"y":209},"5":{"tranList":[{"character":"A","endState":4},{"character":"B","endState":5}],"id":6,"label":6,"x":470,"y":336},"6":{"tranList":[{"character":"A","endState":6},{"character":"B","endState":7}],"id":7,"label":7,"x":497,"y":450}}

{"0":{"tranList":[{"character":"A","endState":3},{"character":"B","endState":2}],"id":1,"label":1,"x":232,"y":140},"1":{"tranList":[{"character":"B","endState":2},{"character":"A","endState":3}],"id":2,"label":2,"x":446,"y":326},"2":{"tranList":[{"character":"A","endState":3},{"character":"B","endState":2}],"id":3,"label":3,"x":485,"y":151}}

{"0":{"tranList":[{"character":"A","endState":3},{"character":"B","endState":2}],"id":1,"label":1,"x":232,"y":140},"1":{"tranList":[{"character":"B","endState":2},{"character":"A","endState":3}],"id":2,"label":2,"x":482,"y":338},"2":{"tranList":[{"character":"A","endState":3},{"character":"B","endState":2}],"id":3,"label":3,"x":505,"y":148}}