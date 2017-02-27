import {DLNode, DoublyLinkedList} from './lib/DoublyLinkedList.js';
import {BSTNode, BinarySearchTree} from './lib/BinarySearchTree.js';

/****** define helper functions and class ******/

export function inherit(proto) {
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
export function MyBST() {
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


export function copyMyBST(source) {
	var cloned = new MyBST();
	var edges = source.inOrderToArray();
	for (var i = 0; i < edges.length; i++) {
		cloned.insertEdge(edges[i].val.clone());
	}
	return cloned;
}

export function copyDoublyLinkedList(source) {
	var cloned = new DoublyLinkedList();
	var arr = source.toArray();
	for (var i = 0; i < arr.length; i++)
		cloned.insertBeforeHead(arr[i]);
	return cloned;
}

/****** define helper functions and class ******/


// Runtime Errors
export const SET_HEAD_POINTER_ERROR = "Must be a DLNode type."
export const HEAD_STATE_NULL_ERROR = "Internal state needs to be set.";
export const NO_SUCH_RULE_ERROR = "Expected rule is not defined.";

// Global variables
export const _INITIAL_TAPE_SIZE = 21; // initial 
export const LEFT = "L";
export const RIGHT = "R";
export const HALT = "H";
export const BLANK = "#";


/*
Class: Tape
A tape that has infinite cells. Using dynamic array here.

*/
export function Tape() {
	this.cells = new DoublyLinkedList();
	this.initialize();

	this.internalState = null;
	this.pointer = 0;
}
Tape.prototype = {
	clone: function() {
		var cloned = new Tape();
		cloned.cells = copyDoublyLinkedList(this.cells);
		cloned.internalState = this.internalState;
		cloned.pointer = this.pointer;

		return cloned;
	},
	initialize: function(size = _INITIAL_TAPE_SIZE) {
		this.cells = new DoublyLinkedList();
		for (var i = 0; i < size; i++)
			this.cells.appendAfterTail(null);
	},
	/*
	read from tape
	*/
	read: function() {
		return this.cells.getNodeAt(this.pointer).val;
	},
	/*
	write into tape at designated index
	*/
	write: function(val) {
		if (val == BLANK)
			val = "";
		this.cells.getNodeAt(this.pointer).val = val;
	},
	/*
	get internal state
	*/
	getState: function() {
		return this.internalState;
	},
	/*
	change internal state
	*/
	setState: function(state) {
		this.internalState = state;
	},
	insertBeforeHead(val) {
		this.pointer++;
		this.cells.insertBeforeHead(val);
	},
	appendAfterTail(val) {
		this.cells.appendAfterTail(val);
	},
	expandBeforeHead(n = 1) {
		while (n--) {
			this.cells.insertBeforeHead(null);
		}
	},
	expandAfterTail(n = 1) {
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
	},
	/*
	move to left
	*/
	moveLeft: function() {
		if (this.pointer-1 < 0) {
			this.expandBeforeHead();
		}
		this.pointer--;
	},
	/*
	move to right
	*/
	moveRight: function() {
		if (this.pointer+1 >= this.cells.size()) {
			this.expandAfterTail();
		}
		this.pointer++;
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
	setPointer: function(index) {
		if (index >= 0 && index < this.cells.size())
			this.pointer = index;
		else
			throw SET_HEAD_POINTER_ERROR;
	}
}


/*
Class: Edge
Representing rule

source: String
read: String
write: String
direction: LEFT or RIGHT defined above
targe: String
*/
export function Edge(source, read, write, direction, target) {
	this.inState = source; // source state 
	this.read = read; // an elt of tape alphabet
	this.write = write;
	this.direction = direction; // to which direction the head should move
	this.newState = target; // change internal state to
}
Edge.prototype = {
	toArray: function() {
		return [this.inState, this.read, this.write, this.direction, this.newState];
	},
	clone: function() {
		var cloned = new Edge();

		cloned.inState = this.inState;
		cloned.read = this.read;
		cloned.write = this.write;
		cloned.direction = this.direction;
		cloned.newState = this.newState;

		return cloned;
	}
}


/*
Class: Transition Graph
*/
export function Transition_Graph() {
	this.adj = {}; // the adjacency list
}
Transition_Graph.prototype = {
	clone: function() {
		var cloned = new Transition_Graph();
		var keys = this.getAllVertices();
		for (var i = 0; i < keys.length; i++) {
			var key = keys[i];
			cloned.adj[key] = copyMyBST(this.adj[key]);
		}
		return cloned;
	},
	/*
	returns all states in the graph
	*/
	getAllVertices: function() {
		return Object.keys(this.adj);
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
	addVertex: function(state) {
		if (!this.vertexExists(state)) {
			this.adj[state] = new MyBST();
		}
	},
	/*
	state: String
	*/
	deleteVertex: function(state) {
		if (this.vertexExists(state)) {
			delete this.adj[state];
		}
	},
	/*
	state: String

	returns True if vertex (state) exists
	*/
	vertexExists: function(state) {
		return this.adj[state] != undefined;
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

		return this.adj[in_state].insertEdge(new Edge(
			in_state, read, write, direction, new_state
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
		rule.val.newState = new_state;
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


export function TuringMachine(startState) {
	this.tape = new Tape();
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
		return this.tape.getPointer();
	},
	setHead: function(dlNode) {
		this.tape.setPointer(dlNode);
	},
	getHeadState: function() {
		return this.tape.getState();
	},
	/*
	Set internal state
	*/
	setHeadState: function(state) {
		this.tape.setState(state);
	},
	/*
	Get transition graph
	*/
	getTransitionGraph: function() {
		return this.transitionGraph;
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
	Check if halted
	*/
	isHalted: function() {
		return this.tape.getState().capitalize() == HALT;
	},
	/*
	Step forward
	*/
	step: function() {
		if (this.isHalted())
			return;

		if (this.tape.getState() == null) {
			throw HEAD_STATE_NULL_ERROR;
		}
		var edge = this.getRule(this.tape.getState(), this.tape.read());
		if (edge == null) {
			throw NO_SUCH_RULE_ERROR;
		}
		this.tape.writeAndMove(edge.write, edge.direction)
		this.tape.setState(edge.newState);
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

		T.setPointer(0);
		
		console.log(M.getHead());
		console.log(T.cells.toArray());
		M.addRule("0", "0", "x", RIGHT, "1");
		// M.setRule("0", "0", "t", RIGHT, "H");
		M.addRule("1", "1", "y", RIGHT, "0");
		M.addRule("0", "2", "y", LEFT, "H");

		// M.step();
		// M.step();
		M.run();
		console.log(T.cells.toArray());
	} catch (e) {
		console.log(e);
	}

}