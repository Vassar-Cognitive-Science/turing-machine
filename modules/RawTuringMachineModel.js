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
var SET_HEAD_POINTER_ERROR = "Must be a DLNode type."
var HEAD_STATE_NULL_ERROR = "Internal state needs to be set.";
var NO_SUCH_RULE_ERROR = "Expected rule is not defined.";

// Global variables
var _INITIAL_TAPE_SIZE = 21; // initial 
var LEFT = "L";
var RIGHT = "R";
var HALT = "H";
var BLANK = "#";

/*
Class: Head

tape: must be a Tape type defined below
*/
function Head(tape, cell=null) {
	this.tape = tape;
	this.state = null; // internal state
	this.pointer = cell;
}
Head.prototype = {
	/*
	read from tape
	*/
	read: function() {
		return this.pointer.val;
	},
	/*
	write into tape at designated index
	*/
	write: function(val, index) {
		if (val == BLANK)
			val = "";
		this.pointer.val = val;
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
	setState: function(state) {
		this.state = state;
	},
	/*
	move to left
	*/
	moveLeft: function() {
		if (this.pointer.prev == null) {
			this.tape.expandBeforeHead();
		}
		this.pointer = this.pointer.prev;
	},
	/*
	move to right
	*/
	moveRight: function() {
		if (this.pointer.next == null) {
			this.tape.expandAfterTail();
		}
		this.pointer = this.pointer.next;
	},
	/*
	Write and Move
	*/
	writeAndMove: function(val, direction) {
		this.write(val);
		if (direction == LEFT)
			this.moveLeft();
		else
			this.moveRight();
	},
	getPointer: function() {
		return this.pointer;
	},
	setPointer: function(dlNode) {
		if (dlNode instanceof DLNode)
			this.pointer = dlNode;
		else
			throw SET_HEAD_POINTER_ERROR;
	}
}


/*
Class: Tape
A tape that has infinite cells. Using dynamic array here.

*/
function Tape() {
	this.cells = new DoublyLinkedList();
	this.initialize();
}
Tape.prototype = {
	initialize: function(size = _INITIAL_TAPE_SIZE) {
		this.cells = new DoublyLinkedList();
		for (var i = 0; i < size; i++)
			this.cells.appendAfterTail(null);
	},
	insertBeforeHead(val) {
		this.cells.insertBeforeHead(val);
	},
	appendAfterTail(val) {
		this.cells.appendAfterTail(val);
	},
	expandBeforeHead(n=1) {
		while (n--) {
			this.cells.insertBeforeHead(null);
		}
	},
	expandAfterTail(n=1) {
		while (n--) {
			this.cells.appendAfterTail(null);
		}
	},
	getCellHead() {
		return this.cells.head;
	},
	getCellTail() {
		return this.cells.tail;
	},
	getCellMiddle() {
		var tmp = this.cells.head;
		var n = this.cells.size() / 2;
		while (n--) {
			tmp = tmp.next;
		}
		return tmp;
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
	setEdge: function(in_state, read, write, direction, new_state) {
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
	this.head = new Head(this.tape);
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
		this.head.setState(state);
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
	setRule: function(in_state, read, write, direction, new_state) {
		this.transitionGraph.setEdge(in_state, read, write,
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
		this.head.setState(edge.target.state);
	},
	/*
	Run the machine until error or halt
	*/
	run: function() {

		while (!this.isHalted()) {
			this.step();
		}

	}
}



// unit test
function test() {

	/*Test for graph
	var G = new Transition_Graph();
	G.addEdge("1", "0", "x", LEFT, "0");
	G.addEdge("1", "1", "x", LEFT, "1");
	G.deleteEdge("1", "1");
	G.setEdge("1", "0", "y", LEFT, "0");
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
		var node = T.getCellHead();
		var n = 0; 
		while (node != null) {
			node.val = n++;
			node = node.next;
		}

		var H = M.getHead();
		console.log(T.cells.toArray());
		H.pointer = T.getCellTail();
		M.addRule("0", "20", "x", RIGHT, "1");
		// M.setRule("0", "0", "t", RIGHT, "H");
		M.addRule("1", "1", "y", RIGHT, "0");
		M.addRule("0", "2", "y", LEFT, "H");

		M.step();
		// M.run();
		console.log(M.head);
		console.log(T.cells.toArray());

	} catch (e) {
		console.log(e);
	}

}