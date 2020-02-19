import { layout, initialState } from './layout'
import {
  SET_WIDTH
} from '../constants';

describe('layout reducer', () => {
  it('sets isMobile to true when width < 800', () => {
    const action = {
      type: SET_WIDTH,
      payload: 10
    }

    const expectedState = {
      isMobile: true
    }

    const newState = layout(initialState, action)
    expect(newState).toEqual(expectedState);
  })

  it('sets isMobile to false when width > 800', () => {
    const state = {
      ...initialState,
      isMobile: true
    }

    const action = {
      type: SET_WIDTH,
      payload: 1000000
    }

    const expectedState = {
      isMobile: false
    }
    const newState = layout(state, action)
    expect(newState).toEqual(expectedState);
  })
})
