Pushdown automata have been programmatically implemented under an object-
oriented design pattern.

Using the functions in PDAModel.js, one can easily create and simulate
Pushdown automata of any complexity.

There is currently no way for a user to run the functions, nor is there an
associated GUI, but it will be a simple task to design a rudimentary interface
which can be developed independently of the logical code in PDAModel.

PDAModel also allows for the serialization and deserialization of PDA objects,
meaning any machine created can be converted to a text string for easy storage
and back for later use. This can be stored server side, or given to the client
for reuse.

main.html was edited only to import PDAModel.js. Loading main.html with a
developer's console open will reveal the test output of PDAModel.js, which
is the creation of a machine, formal notiation, serialization, and running the
machine on various inputs.

Documentation on function use is inside PDAModel.
