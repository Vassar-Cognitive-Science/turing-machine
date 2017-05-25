#Documentation for reducer/gui.js 
##General
This module handles any (model, view) changes of the machine tape and tape head. Also, it deals with extracting from app state or loading into app state the target tape state.<br>
The supposed infinitely long tape is represented here with a redux adapted doubly linked list structure.<br>
Here is the overview of tape structure:
```
/*
*** NOTE ***
tapeHead and tapeTail serve as sentinel, and there is never a corresponding cell
with id = tapeTail or tapeHead in the state

For a tape of length 0, tapeHead = tapeTail = 0
For a tape of length 1, tapeHead = -1, tapeTail = 1, the only cell is with id 0
For a tape of length k > 1, tapeHead and tapeTail depend on to which direction we expand 

const initialStateForTape = {
	anchorCell: 0, // information for mapping virtual tape cells to presentational cell

	tapeHead: 0, // Tape head, see linked list structure 
	tapeTail: 0, // Tape tail, see linked list structure
	tapePointer: 0, // Tells where is the Tape Head in Tape
	tapeCellsById: [], // array of virtual cells' ids
	tapeInternalState: "0", // Tape Head state
	
	A cell is an plain object, similar to linked list Node structure
	{ 
		val: val, // value
		prev: prev, // id to prev cell 
		next: next, // id to next cell
		highlight: flag, // boolean indicates whether the cell is highlighted
	}
	
}
*/
```
##Dependence
###constants/SpecialCharacters.js
###constants/components/Head.js
###reducers/gui.js 
## Date structure related functions
###createCell(cur, prev = null, next = null, val = null)
```
/*
Create a cell, that holds its:
current id
previous cell id,
next cell id,
value
*/
```
###appendAfterTailHelper(state, val = null)
```
/*
Claim: P(n) == this function appends a cell after tail for a tape of length n, for all n >= 0
Proof:
	Base: the tape length is 0 and we expand it by 1.
		  We want (a) a tape cell (0,  -1,   null,    val), and (b) tapeHead = -1, tapeTail = 1
							       cur prev  next  value

		  The function satisfies above by following operations
		  
		  // 0. decrease tapeHead by 1 = -1, as a senitinel for later calling of insertBeforeHead // (gives (b))

		  1. Find previous cell, in this case it will sure be null
		  2. Take the current tapeTail value to create the cell, which
		     makes the new tail
		     Since initial tapeTail = 0, we have cell (0, 0-1=-1, null,  val) // (gives (a))

		  // 3. Finally, increase the tapeTail by 1, as a sentinel // (gives (b))

	I.H.: Assume P(k), for all k >= 1, i.e., tapeTail >= 1
		  Show P(k+1)

		  For the result of appending a cell after tail of a tape of length k to get to length of k+1,
		  we will want the cell x to satisfy the following:
		  	1. It is the new tail, and so x.next = null
		  	2. It is the next of previous tail, say, oldTail, so  
		  		x.prev = oldTail and oldTail.next = x
		  
		  The function does the following to satisfy above:

		  	a. To satisfy (1) and (2), we first try to find a previous cell,
		  	   In this case, because we assume k > 0, so there is a previous cell.
		  	   We set its next to be state.tapeTail.
		  	   Then we create a cell with current id = state.tapeTail
		  	   							  prev = state.tapeTail - 1
										  next = null
										  val = val
			b. increase the tapeTail by 1, as a sentinel
*/
```
###insertBeforeHeadHelper(state, val = null)
```
/*
Correctness proof similar to the above
*/
```
###expandBeforeHeadHelper(state, n = 1)
Wrapper function than expand any number of cells before head.
##Exported helper functions
**Note that *id* is generated from prefix `const CELL_ID_PREFIX = "TAPE-CELL "`**
###standardizeCellId = (id) =>
A function that standardizes input with defined prefix as shown above.
###isTapeEmpty(state)
Return if the tape is empty.
###findCell(state, id)
Return target cell.
###read(state)
Return value in cell pointed by the tape head. If it is empty, return "#". If the cell is not defined yet, return *null*.
###standardizeInputToTape(val, oldVal)
Standardize user's input to wanted format.<br>
Trim any whitespace trailing.<br>
* --> original value in the tape.<br>
\# --> empty string.<br>
###standardizeReadFromTape(val)
Standardize the way to read value in cell. If it is empty or null, return "#".
###cloneCellById(state, id)
Clone a cell found by its id.
###cloneCell(tar)
Clone inputed cell.
###extractTape(state)
Extract attributes necessary for constructing a complete tape.
###loadTape(state, tape)
Load tape into the app state.
###lstrip(arr)
Get rid of any cell whose value is empty (#) from the left.
###rstrip(arr)
Get rid of any cell whose value is empty (#) from the right.
###strip(arr)
Get rid of any cell whose value is empty (#) from the both side.
###tapeToArray(tape)
Compress tape data structure to an array.
##Functions
The following functions are all commented in reducers/tape.js<br>
**Reducer related functions**<br>
appendAfterTail(state, action)<br>
insertBeforeHead(state, action)<br>
expandAfterTailHelper(state, n = 1)<br>
expandAfterTail(state, action)<br>
expandBeforeHead(state, action)<br>
initializeTape(state, action)<br>
writeIntoTapeHelper(state, pointer, val)<br>
writeIntoTape(state, action)<br>
fillTape(state, action)<br>
moveTapeRightHelper(state, action)<br>
moveTapeRight(state, action)<br>
moveTapeLeftHelper(state, action)<br>
moveTapeLeft(state, action)<br>
moveLeftHelper(state)<br>
moveLeft(state, action)<br>
moveRightHelper(state)<br>
moveRight(state, action)<br>
highlightCorrespondingCellHelper(state, flag)<br>
highlightCorrespondingCell(state, action)<br>
highlightCellAt(state, action)<br>
setInternalStateHelper(state, text)<br>
setInternalState(state, action)<br>
