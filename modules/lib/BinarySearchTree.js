export function BSTNode() {
	this.key = null;
	this.val = null;
	this.left = null;
	this.right = null;
	this.parent = null;
}

/*
Note:
Each node is kept unique in the tree
*/

export function BinarySearchTree() {
	this.n = 0; // size
	this.root = null;
}
BinarySearchTree.prototype = {
	size: function() {
		return this.size;
	},
	height: function() {
		return parseInt(Math.log2(this.size));
	},
	// z must be a BSTNode 
	insert: function(z) {
		var y = null;
		var x = this.root;

		while (x != null) {
			y = x;
			if (z.key < x.key)
				x = x.left;
			else if (z.key == x.key) // keep the node unique
				return false;
			else
				x = x.right;
		}

		z.parent = y;
		if (y == null) {
			this.root = z;
		} else if (z.key < y.key) {
			y.left = z;
		} else {
			y.right = z;
		}
		this.n++;
		return true;
	},
	// wanted is the key of wanted BSTNode, best be String
	search: function(wanted) {
		var x = this.root;
		while (x != null && x.key != wanted) {
			if (wanted < x.key)
				x = x.left;
			else
				x = x.right;
		}
		return x;
	},
	// u, v must be BSTNodes
	transplant: function(u, v) {
		if (u.parent == null)
			this.root = v;
        else if (u == u.parent.left)
            u.parent.left = v;
        else
            u.parent.right = v
        if (v != null)
            v.parent = u.parent;
	},
	// x must b a BSTNode
	miniumSince: function(x) {
		while (x != null && x.left != null)
            x = x.left;
        return x;
	},
	// x must b a BSTNode
	minium: function(x) {
		return this.miniumSince(this.root);
	},
	// x must b a BSTNode
	maximumSince: function(x) {
		while (x != null && x.right != null)
            x = x.right;
        return x;
	},
	// x must b a BSTNode
	maximum: function(x) {
		return this.maximumSince(this.root);
	},
	// z must b a BSTNode
	delete: function(z) {
		if (z == null) return false;
		if (z.left == null)
            this.transplant(z, z.right);
        else if (z.right == null)
            this.transplant(z, z.left);
        else {
            var y = this.miniumSince(z.right);
            if (y.parent != z) {
                this.transplant(y, y.right);
                y.right = z.right;
                y.right.parent = y;
            }
            this.transplant(z, y);
            y.left = z.left;
            y.left.parent = y;
        }
        this.n--;
        return true;
	},
	inOrderToArray() {
		var arr = new Array(0);
		this.inOrderToArrayHelper(this.root, arr);
		return arr;
	},
	inOrderToArrayHelper: function(x, arr) {
		if (x != null) {
			this.inOrderToArrayHelper(x.left, arr);
			arr.push(x);
			this.inOrderToArrayHelper(x.right, arr);
		}
	},
	// test function
	inOrderTraversal: function(x) {
		if (x != null) {
			this.inOrderTraversal(x.left);
			console.log(x.key);
			this.inOrderTraversal(x.right);
		}
	}
}

/*
function test() {
	var t = [5, 4, 8, 7, 9, 3, 3];
	var tree = new BinarySearchTree();
	for (var i = 0; i < t.length; i++) {
		var temp = new BSTNode();
		temp.key = t[i];
		tree.insert(temp);
	}
	tree.inOrderTraversal(tree.root);
	tree.delete(tree.search(3));
	tree.inOrderTraversal(tree.root);
}
*/