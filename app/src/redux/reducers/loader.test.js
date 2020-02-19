import { loader, initialState } from './loader'
import {
  SHOW_LOADER,
  HIDE_LOADER,
} from '../constants';

describe('loader reducer', () => {
  it('set isLoading to false', () => {
    const state = {
      ...initialState,
      isLoading: true
    }
    const action = {
      type: HIDE_LOADER
    }

    const expectedState = {
      isLoading: false
    }

    const newState = loader(state, action)

    expect(expectedState).toEqual(newState)
  })

  it('set isLoading to true', () => {
    const state = {
      ...initialState,
      isLoading: false
    }

    const action = {
      type: SHOW_LOADER
    }

    const expectedState = {
      isLoading: true
    }

    const newState = loader(state, action)

    expect(expectedState).toEqual(newState)
  })
})
