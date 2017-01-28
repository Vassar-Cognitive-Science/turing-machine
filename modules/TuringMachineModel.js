/****** import helper functions ******/

import {
	BSTNode,
	BinarySearchTree
} from './lib/BinarySearchTree.js';

/****** import helper functions ******/


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

var _INITIAL_TAPE_SIZE = 20; // initial 
var LEFT = "L";
var RIGHT = "R";

function Head(tape) {
	this.tape = tape; // tape to which the head belong
	this.state = null; // internal state
	this.index = 0;
}
Head.prototype = {
	read: function() {
		return this.tape.cells[index];
	},
	write: function(val) {
		this.tape.cells[index] = val;
	},
	getState: function() {
		return this.state;
	},
	changeState: function(state) {
		this.state = state;
	},
	moveLeft: function() {
		if (this.index - 1 >= 0)
			this.index--;
	},
	moveRight: function() {
		if (this.index + 1 < this.tape.cells.length)
			this.index++;
	}
}

function Tape() {
	this.n = 0; // number of filled cells 

	this.cells = new Array(_INITIAL_TAPE_SIZE);
	for (var i = 0; i < this.cells.length; i++) // initialization
		this.cells[i] = null;

	this.head = new Head(this);
}

/*
state: String
*/
function Vertex(state) {
	this.state = state;
}

/*
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


function Transition_Graph() {
	this.V = {}; // the set of vertices representing state informations
	this.adj = {}; // the adjacency list
}
Transition_Graph.prototype = {
	/*
	returns all vertices in the graph
	*/
	getVertices: function() {
		return Object.keys(this.adj);
	},
	/*
	returns all edges (rules) in the graph
	*/
	getEdges: function() {
		var vertices = this.getVertices();
		var edges = new Array();
		for (int i = 0; i < vertices.length; i++) {
			var tree = this.adj[vertices[i]];
			edges.push.apply(tree.inOrderToArray());
		}
		return edges;
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

		var u = this.V[in_state], v = this.V[new_state]

		return this.adj[u].insertEdge(new Edge(
			u, read, write, direction, new_state
		));
	},
	/*
	in_state: String
	read: String
	*/
	ruleExists: function(in_state, read) {
		if (!this.stateExists())
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
		rule.write = write;
		rule.direction = direction;
		rule.new_state = new_state;
	},
	/*
	in_state: String
	read: String
	write: String
	direction: LEFT or RIGHT defined above
	new_state: String

	returns True if operation succeeds
	*/
	deleteRule: function(in_state, read, write, direction, new_state) {
		if (!this.ruleExists(in_state, read))
			return false;

		var tree = this.adj[this.V[in_state]];
		return tree.deleteEdge(read);
	},
	toTable: function() {
		var rules = this.getEdges();
		var table = new Array(rules.length);
		for (var i = 0; i < rules.length; i++)
			table[i] = rules[i].toArray();
		return table;
	}
}