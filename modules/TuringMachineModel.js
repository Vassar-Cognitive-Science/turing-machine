/****** define helper functions and class ******/

function inherit(proto) {
	function F() {}
	F.prototype = proto;
	return new F;
}

if (!String.prototype.capitalize) {
	String.prototype.capitalize = function() {
		return this.charAt(0).toUpperCase() + this.slice(1);
	}
}

/*
Wrapper Class for BST
*/
function MyBST() {
	BinarySearchTree.call(this);
}
MyBST.prototype = inherit(BinarySearchTree.prototype);
/* 
Wrapper function to insert an edge to a vertex
Edge must be an Edge Type defined below
returns True if operation succeeds
*/
MyBST.prototype.insertEdge = function(edge) {
	var z = new BSTNode();
	z.key = edge.read;
	z.val = edge;
	return this.insert(z);
};
/* 
Wrapper function to delete an edge from a vertex
key is the Edge.read, which represents an elt from tape alphabet
returns True if operation succeeds
*/
MyBST.prototype.deleteEdge = function(key) {
	var z = this.search(key);
	return this.delete(z);
};

/****** define helper functions and class ******/


// Runtime Errors
var HEAD_MOVE_RIGHT_ERROR = "Cannot move to right anymore.";
var HEAD_MOVE_LEFT_ERROR = "Cannot move to left anymore.";
var HEAD_STATE_NULL_ERROR = "Internal state needs to be set.";
var NO_SUCH_RULE_ERROR = "Expected rule is not defined.";

// Global variables
var _INITIAL_TAPE_SIZE = 20; // initial 
var LEFT = "L";
var RIGHT = "R";
var HALT = "H";
var BLANK = "#";

/*
Class: Head

tape: must be a Tape type defined below
*/
function Head(tape) {
	this.tape = tape; // tape to which the head belong
	this.state = null; // internal state
	this.index = 0;
}
Head.prototype = {
	/*
	read from tape
	*/
	read: function() {
		return this.tape.cells[this.index];
	},
	/*
	write into tape at designated index
	*/
	write: function(val, index) {
		if (val == BLANK)
			val = "";
		this.tape.cells[index] = val;
	},
	/*
	get internal state
	*/
	getState: function() {
		return this.state;
	},
	/*
	change internal state
	*/
	changeState: function(state) {
		this.state = state;
	},
	/*
	move to left
	*/
	moveLeft: function(val) {
		if (this.index - 1 >= 0) {
			this.write(val, this.index);
			this.index--;
		} else
			throw HEAD_MOVE_LEFT_ERROR;
	},
	/*
	move to right
	*/
	moveRight: function(val) {
		if (this.index + 1 < this.tape.cells.length) {
			this.write(val, this.index);
			this.index++;
		} else
			throw HEAD_MOVE_RIGHT_ERROR;
	},
	/*
	Write and Move
	*/
	writeAndMove: function(val, direction) {
		if (direction == LEFT)
			this.moveLeft(val);
		else
			this.moveRight(val);
	}
}


/*
Class: Tape
A tape that has infinite cells. Using dynamic array here.

*/
function Tape(size = _INITIAL_TAPE_SIZE) {
	this.n = 0; // number of filled cells 
	this.cells = null;
	this.size = size;
	this.initialize(size);

	this.head = new Head(this);
}
Tape.prototype = {
	size: function() {
		return this.size;
	},
	initialize: function(size) {
		this.n = 0;
		this.size = size;
		this.cells = new Array(size);
		for (var i = 0; i < size; i++)
			this.cells[i] = null;
	},
	clear: function() {
		this.initialize(_INITIAL_TAPE_SIZE);
	},
	fill: function(index, val) {
		if (index >= 0 && index < this.cells.length) {
			this.cells[index] = val;
			this.n++;
			this.expand();
		}
	},
	// erase: function(index) {
	// 	if (index >= 0 && index < this.cells.length) {
	// 		this.cells[index] = null;
	// 		this.n--;
	// 		this.resize();
	// 	}
	// },
	/*
	Expands when filled.
	Contracts when not more than 1/4 cells are filled
	*/
	expand: function() {
		if (this.n == this.size) {
			this.cells = this.copyToNewArray(this.size * 2);
		} 
		// else if (this.n <= this.size / 4) {
		// 	this.cells = this.copy(this.size / 2);
		// }
	},
	copyToNewArray: function(newSize) {
		this.size = newSize;
		var arr = new Array(this.size);
		for (var i = 0; i < this.size; i++) {
			if (i < this.cells.length)
				arr[i] = this.cells[i];
			else
				arr[i] = null;
		}
		return arr;
	},
	insertCellAtTail: function() {
		this.size++;
		this.cells.push(null);
	}
}


/*
Class: Vertex 
Representing state

state: String
*/
function Vertex(state) {
	this.state = state;
}


/*
Class: Edge
Representing rule

source: must be Vertex type
read: String
write: String
direction: LEFT or RIGHT defined above
targe: must be Vertex type
*/
function Edge(source, read, write, direction, target) {
	this.source = source; // source vertex representing internal state
	this.read = read; // an elt of tape alphabet
	this.write = write;
	this.direction = direction; // to which direction the head should move
	this.target = target; // change internal state to
}
Edge.prototype.toArray = function() {
	return [this.source.state, this.read, this.write, this.direction, this.target.state];
};


/*
Class: Transition Graph
*/
function Transition_Graph() {
	this.V = {}; // the set of vertices representing state informations
	this.adj = {}; // the adjacency list
}
Transition_Graph.prototype = {
	/*
	returns all states in the graph
	*/
	getAllStates: function() {
		return Object.keys(this.V);
	},
	/*
	returns all vertices in the graph
	*/
	getAllVertices: function() {
		return Object.values(this.V);
	},
	/*
	returns all edges (rules) in the graph
	*/
	getAllEdges: function() {
		var trees = Object.values(this.adj);
		var edges = new Array(0);
		for (var i = 0; i < trees.length; i++) {
			var tree = trees[i];
			var nodes = tree.inOrderToArray();
			for (var j = 0; j < nodes.length; j++)
				edges.push(nodes[i]);
		}
		return edges;
	},
	/*
	state: String
	*/
	getVertex: function(state) {
		return this.V[state];
	},
	/*
	state: String
	*/
	addVertex: function(state) {
		if (!this.vertexExists(state)) {
			this.V[state] = new Vertex(state);
			this.adj[state] = new MyBST();
		}
	},
	/*
	state: String
	*/
	deleteVertex: function(state) {
		if (this.vertexExists(state)) {
			delete this.adj[state];
			delete this.V[state];
		}
	},
	/*
	state: String

	returns True if vertex (state) exists
	*/
	vertexExists: function(state) {
		return this.V[state] != undefined;
	},
	/*
	in_state: String
	read: String
	write: String
	direction: LEFT or RIGHT defined above
	new_state: String

	returns True if operation succeeds
	*/
	addEdge: function(in_state, read, write, direction, new_state) {
		if (this.edgeExists(in_state, read))
			return false;

		// will add vertex to the graph if vertex not existed
		this.addVertex(in_state);
		this.addVertex(new_state);

		var u = this.getVertex(in_state),
			v = this.getVertex(new_state);

		return this.adj[in_state].insertEdge(new Edge(
			u, read, write, direction, v
		));
	},
	/*
	in_state: String
	read: String
	*/
	edgeExists: function(in_state, read) {
		if (!this.vertexExists(in_state))
			return false;
		var tree = this.adj[in_state];
		return tree.search(read) != null;
	},
	/*
	in_state: String
	read: String
	write: String
	direction: LEFT or RIGHT defined above
	new_state: String
	*/
	modifyEdge: function(in_state, read, write, direction, new_state) {
		if (!this.edgeExists(in_state, read))
			return;

		var tree = this.adj[in_state];
		var rule = tree.search(read);
		rule.val.write = write;
		rule.val.direction = direction;
		this.addVertex(new_state);
		rule.val.target = this.getVertex(new_state);
	},
	/*
	in_state: String
	read: String

	returns True if operation succeeds
	*/
	deleteEdge: function(in_state, read) {
		if (!this.edgeExists(in_state, read))
			return false;

		var tree = this.adj[in_state];
		return tree.deleteEdge(read);
	},
	/*
	returns wanted edge (rule), if not existed return Null
	*/
	getEdge: function(in_state, read) {
		if (!this.edgeExists(in_state, read))
			return null;
		return this.adj[in_state].search(read).val;
	},
	toTable: function() {
		var rules = this.getAllEdges();
		var table = new Array(rules.length);
		for (var i = 0; i < rules.length; i++)
			table[i] = rules[i].val.toArray();
		return table;
	}
}


function TuringMachine(startState) {
	this.tape = new Tape();
	this.head = this.tape.head;
	this.transitionGraph = new Transition_Graph();

	//
	// this.setHeadState(startState);
	// this.transitionGraph.addVertex(startState);
	//
}
TuringMachine.prototype = {
	/*
	Get tape
	*/
	getTape: function() {
		return this.tape;
	},
	/*
	Get head
	*/
	getHead: function() {
		return this.head;
	},
	/*
	Get transition graph
	*/
	getTransitionGraph: function() {
		return this.transitionGraph;
	},
	/*
	Check if halted
	*/
	isHalted: function() {
		return this.head.getState().capitalize() == HALT;
	},
	/*
	Set internal state
	*/
	setHeadState: function(state) {
		this.head.changeState(state);
	},
	/*
	Step forward
	*/
	step: function() {
		if (this.isHalted())
			return;

		if (this.head.getState() == null) {
			throw HEAD_STATE_NULL_ERROR;
		}
		var edge = this.getRule(this.head.getState(), this.head.read());
		if (edge == null) {
			throw NO_SUCH_RULE_ERROR;
		}
		this.head.writeAndMove(edge.write, edge.direction)
		this.head.changeState(edge.target.state);
	},
	/*
	Run the machine until error or halt
	*/
	run: function() {

		while (!this.isHalted()) {
			this.step();
		}

	},
	/*
	Wrapper function, add a state to the machine

	state: String

	returns True if operation succeeds
	*/
	addState: function(state) {
		return this.transitionGraph.addVertex(state);
	},
	/*
	Wrapper function, delete a state from the machine

	state: String

	returns True if operation succeeds
	*/
	deleteState: function(state) {
		return this.transitionGraph.deleteVertex(state);
	},
	/*
	Wrapper function, add rule to the machine

	in_state: String
	read: String
	write: String
	direction: LEFT or RIGHT defined above
	new_state: String

	returns True if operation succeeds
	*/
	addRule: function(in_state, read, write, 
		direction, new_state) {
		return this.transitionGraph.addEdge(in_state, read, 
			write, direction, new_state);
	},
	/*
	Wrapper function, modify rule in the machine

	in_state: String
	read: String
	write: String
	direction: LEFT or RIGHT defined above
	new_state: String
	*/
	modifyRule: function(in_state, read, write, direction, new_state) {
		this.transitionGraph.modifyEdge(in_state, read, write, 
			direction, new_state);
	},
	/*
	Wrapper function, delete rule from the machine

	in_state: String
	read: String

	returns True if operation succeeds
	*/
	deleteRule: function(in_state, read) {
		return this.transitionGraph.deleteEdge(in_state, read);
	},
	/*
	Wrapper function, get rule from the machine

	returns wanted rule, if not existed return Null
	*/
	getRule: function(in_state, read) {
		return this.transitionGraph.getEdge(in_state, read);
	},
	/*
	Wrapper function, turn the transition graph into table

	returns a 2D array
	*/
	transitionGraphToTable: function() {
		return this.transitionGraph.toTable();
	}
}



// unit test
function test() {

	/*Test for graph
	var G = new Transition_Graph();
	G.addEdge("1", "0", "x", LEFT, "0");
	G.addEdge("1", "1", "x", LEFT, "1");
	G.deleteEdge("1", "1");
	G.modifyEdge("1", "0", "y", LEFT, "0");
	console.log(G.getEdge("1", "0"));
	var table = G.toTable();
	for (var i = 0; i < table.length; i++) {
		for (var j = 0; j < table[i].length; j++) {
			console.log(table[i][j]);
		}
	}
	*/

	/* Test for Tape and Head
    var T = new Tape(2);
    T.fill(0, 1);
    T.fill(1, 2);
    console.log(T.head.read(1));
    T.head.moveRight();
	T.head.write(3);
    console.log(T.head.read(1));
    console.log(T.cells);
    T.erase(1);
    console.log(T.cells);
    T.clear();
    console.log(T.cells);
    */

	try {
		var M = new TuringMachine(null);
		M.setHeadState("0");
		var G = M.transitionGraph;
		var T = M.tape;
		T.fill(0, 0);
		T.fill(1, 1);
		T.fill(2, 2);
		M.addRule("0", "0", "x", RIGHT, "1");
		// M.modifyRule("0", "0", "t", RIGHT, "H");
		M.addRule("1", "1", "y", RIGHT, "0");
		M.addRule("0", "2", "y", LEFT, "H");

		M.step();
		// M.run();
		console.log(M.head);
		console.log(T.cells);

	} catch (e) {
		console.log(e);
	}

}