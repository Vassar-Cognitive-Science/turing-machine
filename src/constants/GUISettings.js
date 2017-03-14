import React from 'react';
import {
	blue400 as drawerSubheadColor,
	cyan300 as calculationColor
 } from 'material-ui/styles/colors';

import Play from 'material-ui/svg-icons/av/play-arrow';
import Next from 'material-ui/svg-icons/av/skip-next';
import Last from 'material-ui/svg-icons/av/skip-previous';
import Pause from 'material-ui/svg-icons/av/pause';
import Restore from 'material-ui/svg-icons/action/restore';
import Visibility from 'material-ui/svg-icons/action/visibility';
import VisibilityOff from 'material-ui/svg-icons/action/visibility-off';

// General
export const MAX_STEP_LIMIT = 10000;
export const MAX_TEST_STEP_LIMIT = 100000;
export const MAX_CELL_NUM = 21;
export const MIN_CELL_NUM = 5;
export const BREAK_POINT = 1168; // for responsive tape

// Animation speed
export const ANIMATION_SPEED = 600.0; // 600ms
export const ANIMATION_MIN_SPEED_FACTOR = 0.1;
export const ANIMATION_MAX_SPEED_FACTOR = 3;

// Tape
export const TAPE_ICON_STYLES = {
  mediumIcon: {
    width: 36,
    height: 36,
    margin: -10
  },
  style: {
    height: 50.7
  }

}

// Head width and style
export const INIT_HEAD_WIDTH = 30;
export const INIT_HEAD_HEIGHT = 30;
export const INIT_HEAD_LEFT_OFFSET = 0;

export const INIT_HAIR_STYLES = {
  width: INIT_HEAD_WIDTH,
  left: INIT_HEAD_LEFT_OFFSET,
};

export const INIT_HEAD_STYLES = {
  width: INIT_HEAD_WIDTH,
  left: INIT_HEAD_LEFT_OFFSET,
  height: INIT_HEAD_HEIGHT
};

// Head movement
export const HEAD_MOVE_INTERVAL = 49;
export const HEAD_LEFT_BOUNDARY = 9;

// Table settings
export const AUTO_COMPLETE_MAX_LENGTH = 30;
export const TABLE_HEIGHT = 230;

export const TABLE_STATE_COL_STYLE = {
	style: {
		width: "12vw"
	},
	maxLength: AUTO_COMPLETE_MAX_LENGTH
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


// Appbar
const desktopBreakPoint = 780;
const ipadBreakPoint = 550;
const bigPhoneBreakPoint = 450;

export const APPBAR_STYLES = {
	breakPoints: {
		desktop: {
			minWidth: desktopBreakPoint
		},
		ipad: {
			maxWidth: desktopBreakPoint,
			minWidth: ipadBreakPoint
		},
		bigPhone: {
			maxWidth: ipadBreakPoint,
			minWidth: bigPhoneBreakPoint
		},
		smallPhone: {
			maxWidth: bigPhoneBreakPoint,
			titleStyle: {fontSize: 20}
		}

	},
	// only define reused ones, other button please see Appbar.js
	buttons: {
		last: {
			tip: "Last",
			tipPosition: "bottom-right",
			icon: < Last / >
		},
		next: {
			tip: "Next",
			tipPosition: "bottom-right",
			icon: < Next / >
		},
		play: {
			tip: "Run",
			tipPosition: "bottom-right",
			icon: < Play / > ,
		},
		pause: {
			tip: "Pause",
			tipPosition: "bottom-right",
			icon: < Pause / > ,
			progressCirlcSize: 36,
			progressCirlcColor: calculationColor
		},
		restore: {
			tip: "Restore",
			tipPosition: "bottom-right",
			icon: < Restore / > ,
		},
		animationToggle: {
			onTip: "Animation Turned On",
			offTip: "Animation Turned Off",
			tipPosition: "bottom-right",
			onIcon: < Visibility />,
			offIcon: < VisibilityOff />
		},
		sliderInBar: {
			style: {
				width: "7.2vw"
			},
			range: {
				axis: 'x',
				min: ANIMATION_MIN_SPEED_FACTOR,
				max: ANIMATION_MAX_SPEED_FACTOR,
				step: 0.1,
				default: 1,
			},
			label: "SPEED",
			sliderLabelStyle: {
				paddingLeft: 10,
				paddingRight: 10,
				paddingTop: 5,
				color: "#424242", 
				fontWeight: 100,
			},
			sliderStyle: {
				bottom: -12
			},

		}
	}
};

export const DRAWER_STYLE = {
	style: {
		minWidth: 140,
		width: "18%"
	},
	subheadText: "Tests",
	subheadStyle: {
		fontSize: 24,
		color: drawerSubheadColor
	},
	listStyle: {
		height: "50%",
		overflowY: "auto"
	},
	controlStyle: {
		paddingTop: "8%"
	}
};