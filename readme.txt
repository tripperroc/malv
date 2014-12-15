Josh Wight

For my project, I converted MaLV to use Meteor as a backend. 

Meteor broke absolutely everything, and my initial attempts 
at fixing things just made things worse. Pretty much all of my 
work went into making anything at all work.

I converted functions and variables that are shared between javascript files
to the notation needed for them to be visible.

I changed the html pages into templates. The templates are all on the main
html page, but only one is displayed at a time. Clicking the links to travel
between pages changes which one is displayed. Going forward, it sounds like
you could use Meteor-router or similar to make it work with URLs

I moved most of the files around. Most of the HTML, CSS, and JavaScript is
in the client folder, while the images are in the public folder.

I made sure that the basic drawing tools work. You can add states, move them,
delete them, add transitions, move those, and set initial and final states.

Most other features are still broken, though I made some progress toward fixing
them.

To run the server, simply navigate your terminal to the top-level malv folder
and enter "meteor".
