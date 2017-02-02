export function DLNode() {
	this.val = null;
	this.prev = null;
	this.next = null;
}

export function DoublyLinkedList(n=0) {
	this.n = n;
	this.head = null;
	this.tail = null;
	while (n--) {
		this.insertBeforeHead(null);
	}
}
DoublyLinkedList.prototype = {
	size: function() {
		return this.n;
	},
	isEmpty: function() {
		return this.n == 0;
	},
	insertBeforeHead: function(val) {
		var x = new DLNode();
		x.val = val;
		x.next = this.head;

		if (this.head != null)
			this.head.prev = x;
		this.head = x;

		if (this.tail == null)
			this.tail = x;

		this.n++;
	},
	appendAfterTail: function(val) {
		var x = new DLNode();
		x.val = val;
		x.prev = this.tail;

		if (this.tail != null)
			this.tail.next = x;
		this.tail = x;

		if (this.head == null)
			this.head = x;

		this.n++;
	},
	popFirst: function() {
		if (this.isEmpty())
			return null;

		var first = this.head;
		this.n--;
		if (this.n == 0) {
			this.head = null;
			this.tail = null;
			return first;
		}
		this.head = this.head.next;
		this.head.prev = null;
		return first;
	},
	popLast: function() {
		if (this.isEmpty())
			return null;

		var last = this.tail;
		this.n--;
		if (this.n == 0) {
			this.head = null;
			this.tail = null;
			return last;
		}
		this.tail = this.tail.prev;
		this.tail.next = null;
		return last;
	},
	toArray: function() {
		var arr = new Array(0);
		var temp = this.head;
		while (temp != null) {
			arr.push(temp.val);
			temp = temp.next;
		}
		return arr;
	},
	getNodeAt: function(index) {
		if (index >= this.size())
			return null;
		var cur = this.head;
		while (index-- && cur != null) {
			cur = cur.next;
		} 
		return cur;
	}
}


// function test() {
// 	var l = new DoublyLinkedList();
// 	l.appendAfterTail("a");
// 	l.appendAfterTail("b");
// 	l.insertBeforeHead("s");
// 	console.log(l.popFirst());
// 	console.log(l.popLast());
// 	var cur = l.head;
// 	while (cur != null) {
// 		console.log(cur.val);
// 		cur = cur.next;
// 	}
// 	console.log(l.size());
// 	l.popLast();
// 	console.log(l.size());
// 	l.popLast();

// }