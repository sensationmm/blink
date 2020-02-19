import { mockStore } from '../../test-utils/test-utils';

import { SET_WIDTH } from '../constants';
import { setWidth } from './layout'

describe('Loader actions', () => {
  let store;

  beforeEach(() => {
    store = mockStore({})();
  });

  test('showLoader returns an action with type `SET_WIDTH`', () => {
    store.dispatch(setWidth());
    expect(store.getActions()).toEqual([{ type: SET_WIDTH }]);
  });
});
