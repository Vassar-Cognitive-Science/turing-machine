export const cellNumShowed = (w=window.innerWidth) => (Math.floor((w*0.8)))
console.log(window.innerWidth)

export const N_CELLS = 21;
export const INIT_HEAD_WIDTH = 0.02149 * window.innerWidth;
export const INIT_HEAD_HEIGHT = 30;
export const INIT_HEAD_LEFT_OFFSET = 0;
export const ANIMATION_SPEED = 1000.0; // 500ms


export const HEAD_MOVE_INTERVAL = 0.0351;
export const HEAD_LEFT_BOUNDARY = 9;
export const head_move_interval = (w=window.innerWidth) => HEAD_MOVE_INTERVAL * w;
export const head_right_boundary = (w=window.innerWidth) => HEAD_LEFT_BOUNDARY + (N_CELLS - 1) * HEAD_MOVE_INTERVAL * w;
export const head_x = (w=window.innerWidth) => HEAD_LEFT_BOUNDARY + Math.floor(N_CELLS/2) * HEAD_MOVE_INTERVAL * w;

export const AUTO_COMPLETE_MAX_LENGTH = 30;
export const TABLE_HEIGHT = 230;
export const TABLE_HEAD_BLANK_WIDTH = 50;
export const TABLE_ROW_DELETE_WIDTH = 90;
export const TABLE_ROW_STATE_WIDTH = 180;
export const TABLE_ROW_INPUT_WIDTH = 80;

export const INIT_HAIR_STYLES = {
  width: INIT_HEAD_WIDTH,
  left: INIT_HEAD_LEFT_OFFSET,
}

export const INIT_HEAD_STYLES = {
  width: INIT_HEAD_WIDTH,
  left: INIT_HEAD_LEFT_OFFSET,
  height: INIT_HEAD_HEIGHT
}