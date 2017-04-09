import { AUTO_COMPLETE_MAX_LENGTH } from '../GeneralAppSettings';
import grey900 from 'material-ui/styles/colors';

// General
export const HEAD_INPUT_MAXLENGTH = AUTO_COMPLETE_MAX_LENGTH;

// Head width and style
export const INIT_HEAD_WIDTH = 30;
export const INIT_HEAD_HEIGHT = 30;
export const INIT_HEAD_LEFT_OFFSET = 0;

export const INIT_HAIR_STYLES = {
  width: INIT_HEAD_WIDTH,
  left: INIT_HEAD_LEFT_OFFSET,
};

const INIT_HEAD_STYLES = {
  width: INIT_HEAD_WIDTH,
  left: INIT_HEAD_LEFT_OFFSET,
  height: INIT_HEAD_HEIGHT,
  color: grey900,
};

export const generate_head_style = (shape=INIT_HEAD_STYLES) => ({
	width: shape.width,
  	left: shape.left,
  	height: shape.height,
  	color: shape.color,
  	textAlign: 'center',
  	outlineWidth: 0,
})

// Head movement
export const HEAD_MOVE_INTERVAL = 49;
export const HEAD_LEFT_BOUNDARY = 57;