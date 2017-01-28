/****** import helper functions ******/

function include(filePath) {
	var js = document.createElement("script");
	js.type = "text/javascript";
	js.src = filePath;
	document.head.appendChild(js);
}

include('./lib/BinarySearchTree.js');

/****** import helper functions ******/


