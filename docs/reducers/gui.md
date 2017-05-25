#Documentation for reducer/gui.js 
##General
In general, this module handles all GUI changes in the app, including<br>
**1. Tape Head moving**<br>
**2. Display different tape cell numbers according to outer frame size**<br>
**3. Auto-adjust tape head width according to entered text**<br>
**4. Toolbar: play button, speed slide bar, test drawer, show animation of simulating process**<br>
##Dependence
###constants/GeneralAppSettings.js
###constants/components/Head.js
###reducers/tape.js 
##Functions
###adjustHeadWidthHelper(state, text)
Helper called by adjustHeadWidth(state, action) that decides the width of tape head according to the text length entered.
Parameter | Type | Default Value | Description
----------|------|---------------|------------
state|object|initial state|Redux state
text|string|null|Current state of turing machine
###adjustHeadWidth(state, action)
A reducer function.
Parameter | Type | Default Value | Description
----------|------|---------------|------------
state|object|initial state|Redux state
action|object|{}|Should be in form of {text: string}
###setPlayStateHelper(state, flag)
Helper called by setPlayState(state, action) that set if turing machine is running.
Parameter | Type | Default Value | Description
----------|------|---------------|------------
state|object|initial state|Redux state
flag|boolean|passed in|if turing machine is running
###setPlayState(state, action)
A reducer function.
Parameter | Type | Default Value | Description
----------|------|---------------|------------
state|object|initial state|Redux state
action|object|{}|Should be in form of {flag: boolean (if TM is running, true)}
###setAnimationSpeed(state, action)
A reducer function that sets how fast should the turing machine runs.
Parameter | Type | Default Value | Description
----------|------|---------------|------------
state|object|initial state|Redux state
action|object|{}|Should be in form of {percentage: double (default is 1.0, decides speed)}
###moveHeadHelper(state, moveLeft)
Helper called by moveHead(state, action) that handles state changes if head moves. 
Parameter | Type | Default Value | Description
----------|------|---------------|------------
state|object|initial state|Redux state
flag|boolean|passed in|if turing machine is running
###moveHead(state, action)
A reducer function.
Parameter | Type | Default Value | Description
----------|------|---------------|------------
state|object|initial state|Redux state
action|object|{}|Should be in form of {moveLeft: boolean (if head will move left, true)}
###resizeScreenAndTape(state, action)
A reducer function that decides number of displayed cells in the tape.
```
/*
Resize the screen and tape according to screen size
newScreenSize * 0.9 - 96; look at tape.css (90% = 0.9 is from class card-of-tape, 96 is the widthes of two buttons)
always center the Head (and tapePointer) to center of the tape by following calculations:

midPoint = cell numbers // 2 (floor it)
headX: left boundary + move_interval * midPointer, --- for correctness, see view
tapePointer: anchor cell + midPointer.  
--- correctness proof: 
	since anchor cell always denotes the id of leftmost cell, then anchor cell + midPointer
	is always the value of the corresponding pointer to the midpoint cell of the tape

General correctness proof:
	And because this reducer only changes:
		cellNum,
		screenSize,
		headX,
		tapePointer,
		rightBoundary,
	We are assured that it won't affect other properties 
*/
```
Parameter | Type | Default Value | Description
----------|------|---------------|------------
state|object|initial state|Redux state
action|object|{}|Should be in form of {screenWidth: number (browser window size)}
###toggleTrialDrawer(state, action)
A reducer function.
Parameter | Type | Default Value | Description
----------|------|---------------|------------
state|object|initial state|Redux state
action|object|{}|Should be in form of {flag: boolean (if show the drawer for test)}
###toggleAnimation(state, action)
A reducer function.
Parameter | Type | Default Value | Description
----------|------|---------------|------------
state|object|initial state|Redux state
action|object|{}|Should be in form of {flag: boolean (if show animation)}