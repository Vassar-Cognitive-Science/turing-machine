#Documentation for reducer/gui.js 
##General
This module powers the running of turing machien and it handles<br>
**1. Step forward (and run until the halt or fail)**<br>
**2. Step back (and retore the last run)**<br>
**3. Change url for a successful save of the machine to server**<br>
**4. Side effects: highlight the matched rule, check if the rule table is ready for running**<br>
In general the machine runs like this:<br>
It will maintain an array called the *runhistory*, which enables stepping back. It will be cleared if any change is made to the tape or the tape head.<br> 
Each step forward, the machine will try to find matched rule. If it finds, update itself. If it fails to do so, stop.<br>
Before a successful step forward, the relevant current TM state will be recorded in *runhistory*<br>
A step back or retore fetches history from *runhistory* and loads it to the state.<br>
Finally, if a machine is successfully saved to the server, change app's url accordingly.
##Dependence
###constants/GeneralAppSettings.js
###constants/SpecialCharacters.js
###reducers/tape.js 
###reducers/gui.js 
##Functions
###matchRule(state, in_state, read)
```
/*
Helper function that matches in_state and read to rule, and return its id.
Parameter:
state --- a state object from store
in_state --- string
read --- string, (should be from tape.read function

**** Responsible for handling special character * Here **** 
*/
```
###cachedLastStep = (lastState) =>
```
/*
Helper function that saves relevant data to restore to last step
save the following data

*** MODEL INFO ***
tapePointer
tape cell
tape internal state

tape head
tape tail
tape cell id array
anchor cell

step count

*** GUI INFO ***
headX, head position
headWidth
headLeftOffset

highlighted rule (row) id
highlighted cell order


*/
```
###preStep(state, action)
```
/*
Prepare for a step forward
Check all rules validity
Set play button according to if it is a single step
Highlight Corresponding Cell
Highlight Corresponding Rule
*/
```
###checkRuleTable(state)
```
/*
Check if the rule table is ready.
If it is, return true
*/
```
###stepHelper(state, silent)
```
/*
Step forward
Find rule (handled by highlightCorrespondingRule)
If not find, stop

Push cachedLastStep to runHistory
Write value into tape
Set internal state
Adjust head width
Move Head according to rule.isLeft 
*/
```
###step(state, action)
Wrapper reducer function that calls stepHelper.
###silentRun(state, action)
```
/*
Run with out animation
*/
```
###recordInterval(state, action)
Record interval (of stepping forward), which is set by setInterval and will be used in clearInterval.
###highlightCorrespondingRuleHelper(state, flag, rule)
```
/*
Highlight Corresponding Rule
*/
```
###highlightCorrespondingRule(state, action)
Wrapper reducer function that calls highlightCorrespondingRuleHelper.
###stop(state, action)
```
/*
Handles what happends when paused

handles clearInterval
cancel highlight on corresponding cell
cancel highlight on corresponding rule
add possible error message
*/
```
###stepBack(state, action)
```
/*
Restore to last step
Data is fetched from runHistory 
*/
```
###restore(state, action)
```
/*
Restore to first step
Data is fetched from runHistory (by pop)
---Preserve edited rules (if there are changes)
---More priority here than undo edit
*/
```
###goodMachineSave(state, action)
Change app's url accordingly if there is a successful save.