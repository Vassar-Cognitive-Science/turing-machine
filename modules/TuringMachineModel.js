/****** define helper functions and class ******/

function inherit(proto) {
	function F() {}
	F.prototype = proto;
	return new F;
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


// Global variables
var _INITIAL_TAPE_SIZE = 20; // initial 
var LEFT = "L";
var RIGHT = "R";

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
	write into tape
	*/
	write: function(val) {
		this.tape.cells[this.index] = val;
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
	moveLeft: function() {
		if (this.index - 1 >= 0)
			this.index--;
	},
	/*
	move to right
	*/
	moveRight: function() {
		if (this.index + 1 < this.tape.cells.length)
			this.index++;
	}
}


/*
Class: Tape
A tape that has infinite cells. Using dynamic array here.

*/
function Tape(size=_INITIAL_TAPE_SIZE) {
	this.n = 0; // number of filled cells 
	this.cells = null;
	this.size = size;
	this.initialize(size);

	this.head = new Head(this);
}
Tape.prototype = {
	initialize: function(size) {
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
			this.resize();
		}
	},
	erase: function(index) {
		if (index >= 0 && index < this.cells.length) {
			this.cells[index]= null;
			this.n--;
			this.resize();
		}
	},
	/*
	Expands when filled.
	Contracts when not more than 1/4 cells are filled
	*/
	resize: function() {
		if (this.n == this.size) {
			this.cells = this.copy(this.size*2);
		} else if (this.n <= this.size / 4) {
			this.cells = this.copy(this.size/2);
		} 
	},
	copy: function(newSize) {
		this.size = newSize;
		var arr = new Array(this.size);
		for (var i = 0; i < this.size; i++) {
			if (i < this.cells.length)
				arr[i] = this.cells[i];
			else
				arr[i] = null;
		}
		return arr;
	}
}


/*
Class: Vertex 

state: String
*/
function Vertex(state) {
	this.state = state;
}


/*
Class: Edge

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
	getStates: function() {
		return Object.keys(this.V);
	},
	/*
	returns all vertices in the graph
	*/
	getVertices: function() {
		return Object.values(this.V);
	},
	/*
	returns all edges (rules) in the graph
	*/
	getEdges: function() {
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
	getState: function(state) {
		return this.V[state];
	},
	/*
	state: String
	*/
	addState: function(state) {
		if (!this.stateExists(state)) {
			this.V[state] = new Vertex(state);
			this.adj[this.V[state]] = new MyBST();
		}
	},
	/*
	state: String
	*/
	deleteState: function(state) {
		if (this.stateExists(state)) {
			delete this.adj[this.V[state]];
			delete this.V[state];
		}
	},
	/*
	state: String
	*/
	stateExists: function(state) {
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
	addRule: function(in_state, read, write, direction, new_state) {
		if (this.ruleExists(in_state, read))
			return false;

		// will add vertex to the graph if vertex not existed
		this.addState(in_state);
		this.addState(new_state);

		var u = this.getState(in_state),
			v = this.getState(new_state);

		return this.adj[u].insertEdge(new Edge(
			u, read, write, direction, v
		));
	},
	/*
	in_state: String
	read: String
	*/
	ruleExists: function(in_state, read) {
		if (!this.stateExists(in_state))
			return false;
		var tree = this.adj[this.V[in_state]];
		return tree.search(read) != null;
	},
	/*
	in_state: String
	read: String
	write: String
	direction: LEFT or RIGHT defined above
	new_state: String
	*/
	modifyRule: function(in_state, read, write, direction, new_state) {
		if (!this.ruleExists(in_state, read))
			return;

		var tree = this.adj[this.V[in_state]];
		var rule = tree.search(read);
		rule.val.write = write;
		rule.val.direction = direction;
		rule.val.new_state = new_state;
	},
	/*
	in_state: String
	read: String

	returns True if operation succeeds
	*/
	deleteRule: function(in_state, read) {
		if (!this.ruleExists(in_state, read))
			return false;

		var tree = this.adj[this.V[in_state]];
		return tree.deleteEdge(read);
	},
	toTable: function() {
		var rules = this.getEdges();
		var table = new Array(rules.length);
		for (var i = 0; i < rules.length; i++)
			table[i] = rules[i].val.toArray();
		return table;
	}
}



// unit test
function test() {

	/* Test for graph
	var G = new Transition_Graph();
	G.addRule("1", "0", "x", LEFT, "0");
	G.addRule("1", "1", "x", LEFT, "1");
	G.deleteRule("1", "1");
	G.modifyRule("1", "0", "y", LEFT, "0");

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

}