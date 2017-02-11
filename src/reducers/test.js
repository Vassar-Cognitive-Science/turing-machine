import { initialState } from './index.js';
import reducer from '.';

describe('todos reducer', () => {
  it('should return the initial state', () => {
  	expect(reducer(initialState, {type: 1})).toEqual(initialState);
  })
})
