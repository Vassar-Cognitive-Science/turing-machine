export const N_CELLS = 21;
export const INIT_HEAD_WIDTH = 30;
export const INIT_HEAD_HEIGHT = 30;
export const INIT_HEAD_LEFT_OFFSET = 0;
export const ANIMATION_SPEED = 100; // 100ms


export const HEAD_MOVE_INTERVAL = 49;
export const HEAD_LEFT_BOUNDARY = 9;
export const HEAD_RIGHT_BOUNDARY = HEAD_LEFT_BOUNDARY + (N_CELLS - 1) * HEAD_MOVE_INTERVAL;
export const HEAD_X = HEAD_LEFT_BOUNDARY + Math.floor(N_CELLS/2) * HEAD_MOVE_INTERVAL;


export const INIT_HAIR_STYLES = {
  width: INIT_HEAD_WIDTH,
  left: INIT_HEAD_LEFT_OFFSET,
}

export const INIT_HEAD_STYLES = {
  width: INIT_HEAD_WIDTH,
  left: INIT_HEAD_LEFT_OFFSET,
  height: INIT_HEAD_HEIGHT
}