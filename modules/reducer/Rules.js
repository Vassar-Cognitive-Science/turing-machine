/* Constants */

export const RULE_PREFIX = "RULE - ";

// error info
export const DUPLICATED_RULE_ERROR = "Rule already exists.";

/* Constants */


/* 
What initialState should look like

initialState = {
	rulesById: []
}
*/


/* Useful functions */

export const standardizeRuleId = (stateId, readId) => {
	if (readId == null) return null;
	return RULE_PREFIX + stateId + "-" + readId;
}

export const ruleExists = (state, id) => {
	return findRuleById(state, id) != null;
}

export const findRuleById = (state, id) => {
	var rule = state[id];
	if (rule == undefined)
		return null;
	return rule;
}

export const ruleSize = (state) => {
	return state.rulesById.length;
}

/* Useful functions */


/* Reducer functions */

export const addRule = (state, action) => {
	var new_state = Object.assign({}, state, {
		rulesById: state.rulesById.slice()
	});
	addRuleHelper(new_state, action.in_state, action.read, action.write, action.direction, action.new_state);
	return new_state;
}

export const setRule = (state, action) => {
	var new_state = Object.assign({}, state);
	setRuleHelper(new_state, action.in_state, action.read, action.write, action.direction, action.new_state);
	return new_state;
}

export const deleteRule = (state, action) => {
	var new_state = Object.assign({}, state, {
		rulesById: state.rulesById.slice()
	});
	deleteRuleHelper(new_state, action.in_state, action.read);
	return new_state;
}

export const createRule = (in_state, read, write, direction, new_state) => {
	return {
		in_state: in_state,
		read: read,
		write: write,
		direction: direction,
		new_state: new_state
	};
}

/* Reducer functions */


/* Helper functions */

export const addRuleHelper = (state, in_state, read, write, direction, new_state) => {
	var id = standardizeRuleId(in_state, read);
	if (ruleExists(state, id)) {
		state.rulesById.push(id);
		state[id] = createRule(in_state, read, write, direction, new_state);
	} else {
		throw DUPLICATED_RULE_ERROR;
	}
}

export const setRuleHelper = (state, in_state, read, write, direction, new_state) => {
	var id = standardizeRuleId(in_state, read);
	state[id] = createRule(in_state, read, write, direction, new_state);
}

export const deleteRuleHelper = (state, in_state, read) => {
	var id = standardizeRuleId(in_state, read);
	if (ruleExists(state, id)) {
		state.rulesById = state.rulesById.filter(rid => rid != id);
		delete state[id];
	}
}

/* Helper functions */