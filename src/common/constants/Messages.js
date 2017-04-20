import { MAX_STEP_LIMIT, MAX_TEST_STEP_LIMIT } from './GeneralAppSettings';

export const REACH_HALT = "Machine is halted!";
export const UNDEFINED_RULE = "No rule is matched!";
export const NO_MORE_BACK = "No more last step!";
export const RULE_TABLE_ERROR = "Rule Table is not ready. Machine is locked!";
export const IS_IN_EDITTING_ERROR = "We are in editting mode. Machine is locked!";

export const DUPLICATED_RULE_ERROR = "Rule already exists.";
export const REQUIRED_FIELD_ERROR = "This field is required.";

export const EXCEED_MAX_STEP_LIMIT = "Exceed max step limits (" + MAX_STEP_LIMIT +") !";
export const EXCEED_MAX_TEST_STEP_LIMIT = "Exceed max step limits (" + MAX_TEST_STEP_LIMIT +") !";
export const DIFF_FINAL_STATE = "Final state is not as expected.";
export const DIFF_FINAL_TAPE = "Final tape is not as expected.";
