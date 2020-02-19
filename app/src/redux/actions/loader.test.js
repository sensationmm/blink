import { mockStore } from '../../test-utils/test-utils';

import { SHOW_LOADER, HIDE_LOADER } from '../constants';
import { showLoader, hideLoader } from './loader'

describe('Loader actions', () => {
  let store;

  beforeEach(() => {
    store = mockStore({})();
  });

  test('showLoader returns an action with type `SHOW_LOADER`', () => {
    store.dispatch(showLoader());
    expect(store.getActions()).toEqual([{ type: SHOW_LOADER }]);
  });

  test('hideLoader returns an action with type `HIDE_LOADER`', () => {
    store.dispatch(hideLoader());
    expect(store.getActions()).toEqual([{ type: HIDE_LOADER }]);
  });
});
