The new code in this branch is for the Regex to NFA converter by Michael Schug.

+------------------+
| Use Instructions |
+------------------+

 - Open the main.html file on some web browser. The regular expression box
   should be above the main drawing canvas.
 - Enter a regular expression into the box and hit the convert button.
 - The regular expression (if valid) will be displayed in the canvas box
   at the bottom of the screen. Any states and transitions in the box before
   converting the regular expression are erased once the button is pressed.
 - Although NFA support has not been enabled on this branch, the epsilon
   transitions required to perform an NFA search are all in place.

+-----------------+
| Tests Performed |
+-----------------+

 - Words (without any special characters) are all processed correctly.
 - The Kleene star function works on its own, or in combination with words.
 - The branching operation currently works inside of parentheses, but
   can create incorrect transitions in words.
 - Parentheses have been implemented but are not fully functional yet.

