import React from 'react';
import {
	ANIMATION_MAX_SPEED_FACTOR,
	ANIMATION_MIN_SPEED_FACTOR,
	DESKTOP_BREAK_POINT,
	IPAD_BREAK_POINT,
	BIG_PHONE_BREAK_POINT
} from '../GeneralAppSettings';

/*Drawer*/
import AddTest from 'material-ui/svg-icons/content/add-circle';
import RunAllTests from 'material-ui/svg-icons/av/play-circle-filled';
import UploadTests from 'material-ui/svg-icons/file/file-upload';
import ExportTests from 'material-ui/svg-icons/file/cloud-download';
/*Drawer*/

/*Toolbar*/
import Play from 'material-ui/svg-icons/av/play-arrow';
import Next from 'material-ui/svg-icons/av/skip-next';
import Last from 'material-ui/svg-icons/av/skip-previous';
import Pause from 'material-ui/svg-icons/av/pause';
import Restore from 'material-ui/svg-icons/action/restore';
import Visibility from 'material-ui/svg-icons/action/visibility';
import VisibilityOff from 'material-ui/svg-icons/action/visibility-off';
import Redo from 'material-ui/svg-icons/content/redo';
import Undo from 'material-ui/svg-icons/content/undo';
import Test from 'material-ui/svg-icons/action/bug-report';
import Save from 'material-ui/svg-icons/content/save';
import Clear from 'material-ui/svg-icons/content/delete-sweep';
import Hamburger from 'material-ui/svg-icons/navigation/menu';
/*Toolbar*/

import {
	blue400 as drawerSubheadColor,
	cyan300 as calculationColor,
	pink500 as addTrialColor,
	blue600 as runAllTrialsColor,
	orange500 as uploadTestsColor,
	teal300 as saveTestsColor,
	pink400 as snackBarSuccessFulColor,
	grey50 as snackBarNothingChangeColor,
 } from 'material-ui/styles/colors';


// const screenSize_Enum = {
// 	desktop: "DESKTOP",
// 	ipad: "IPAD",
// 	bigPhone: "BIG_PHONE",
// 	smallPhone: "SMALL_PHONE"
// }

// export const catagorizeScreenSize = (width) => {
// 	if (width > DESKTOP_BREAK_POINT) {
// 		return screenSize_Enum.desktop;
// 	} else if (width <= DESKTOP_BREAK_POINT && width > IPAD_BREAK_POINT) {
// 		return screenSize_Enum.ipad;
// 	} else if (width <= IPAD_BREAK_POINT && width > BIG_PHONE_BREAK_POINT) {
// 		return screenSize_Enum.bigPhone;
// 	} else {
// 		return screenSize_Enum.smallPhone;
// 	}
// }

export const APPBAR_STYLES = {
	breakPoints: {
		desktop: {
			minWidth: DESKTOP_BREAK_POINT
		},
		ipad: {
			maxWidth: DESKTOP_BREAK_POINT-0.01,
			minWidth: IPAD_BREAK_POINT
		},
		bigPhone: {
			maxWidth: IPAD_BREAK_POINT-0.01,
			minWidth: BIG_PHONE_BREAK_POINT
		},
		smallPhone: {
			maxWidth: BIG_PHONE_BREAK_POINT-0.01,
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
			onTip: "Animation On",
			offTip: "Animation Off",
			tipPosition: "bottom-right",
			onIcon: < Visibility />,
			offIcon: < VisibilityOff />
		},
		undo: {
			tip: "Undo",
			tipPosition: "bottom-right",
			icon: < Undo / > ,
		},
		redo: {
			tip: "Redo",
			tipPosition: "bottom-right",
			icon: < Redo / > ,
		},
		test: {
			tip: "Test",
			tipPosition: "bottom-right",
			icon: < Test / > ,
		},
		save: {
			tip: "Save",
			tipPosition: "bottom-right",
			icon: < Save / > ,
		},
		clearTape: {
			tip: "Clear Tape",
			tipPosition: "bottom-right",
			icon: < Clear / > ,
		},
		moreTools: {
			tip: "More tools",
			tipPosition: "bottom-left",
			icon: < Hamburger / > ,
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
		},
		sliderInMenu: {
			range: {
				axis: 'x',
				min: ANIMATION_MIN_SPEED_FACTOR,
				max: ANIMATION_MAX_SPEED_FACTOR,
				step: 0.1,
				default: 1,
			},
			label: "SPEED: ",
			sliderStyle: {
				width: "50%", 
				paddingBottom:12
			}
		},
		moreToolsPopover: {
			anchorOrigin: {horizontal: 'right', vertical: 'bottom'},
			targetOrigin: {horizontal: 'right', vertical: 'top'}
		},
		snackBar: {
			timeout: 2000,
			contentStyleGenerator: (flag) => ({
				textAlign: "center",
				color: (flag) ? snackBarSuccessFulColor : snackBarNothingChangeColor,
				fontWeight: "bold"
			})
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
	},
	buttons: {
		runTrial: {
			label: "Run Tests",
			runningLabel: "Running All Tests...",
			icon: <RunAllTests color={runAllTrialsColor}/>
		},
		addTrial: {
			label: "Add Test",
			icon: <AddTest color={addTrialColor} />
		},
		uploadTests: {
			label: "Upload Tests",
			icon: <UploadTests color={uploadTestsColor} />,
			uploadInput: {
				cursor: 'pointer',
				position: 'absolute',
				top: 0,
				bottom: 0,
				right: 0,
				left: 0,
				width: '100%',
				opacity: 0,
			}
		},
		saveTests: {
			label: "Download Tests",
			icon: <ExportTests color={saveTestsColor} />
		}
	}
};