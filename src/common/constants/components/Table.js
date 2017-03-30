import { AUTO_COMPLETE_MAX_LENGTH } from '../GeneralAppSettings';

export const TABLE_STATE_COL_MAX_LENGTH = AUTO_COMPLETE_MAX_LENGTH;

// Table settings
export const TABLE_HEIGHT = 230;

export const TABLE_ROW_NO_COL_STYLE = {
	style: {
		display: 'inline-block',
		fontSize: "13px",
		fontWeight: "bold",
		verticalAlign: "text-bottom",
		marginBottom: 3
	}
}

export const TABLE_STATE_COL_STYLE = {
	style: {
		width: "12vw"
	},
	maxLength: TABLE_STATE_COL_MAX_LENGTH
}

export const TABLE_INPUT_COL_STYLE = {
	style: {
		width: "5vw"
	},
	maxLength: 1
}

export const DIRECTION_BUTTON_STYLE = {
	style: {
		width: "9vw",
		textAlign: "left",
		top: 5
	},
	leftLabel: "LEFT",
	rightLabel: "RIGHT"
};

export const TABLE_AUTO_COMPLETE_STYLE = {
	popoverProps: {
		canAutoPosition: true,
		overflowY: "auto"
	},
	style: {
		width: "13vw"
	}
};