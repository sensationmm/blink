import React from 'react';
import { shallow } from 'enzyme';

import { createStore, applyMiddleware, compose } from 'redux';

import configureMockStore from 'redux-mock-store'

import { middleware } from '../redux/store';

import rootReducer from '../redux/reducers/index';
import './matchMedia';

export const storeFactory = (initialState) => {
  const composedEnhancers = compose(applyMiddleware(...middleware));
  return createStore(rootReducer, initialState, composedEnhancers);
}

export const mockStore = (initialState) => {
  return configureMockStore(middleware);
}

/**
 * Util for setting up component instance
 * @param {JSXElement} Component - the react component to render
 * @param {Object} props - props to pass to component
 * @param {Object|null} state - initial state to pass to component
 * @return {ShallowWrapper} - configured ShallowWrapper component
 */
export const setup = (Component, props = {}, state = null) => {

  window.scrollTo = () => { };
  const wrapper = shallow(<Component {...props} />)

  if (state) {
    wrapper.setState({ ...wrapper.state(), ...state });
  }

  return wrapper;
}

export const setupWithStore = (Component, props = {}, state = null, reduxState = {}) => {
  const store = storeFactory(reduxState);

  const wrapper = shallow(<Component store={store} {...props} />);

  if (state) {
    wrapper.setState({ ...state });
  }

  return wrapper;
}

/**
* Return ShallowWrapper containing nodes with the given data-test attribute
* @param {ShallowWrapper} wrapper - Enzyme shallow wrapper to search within
* @param {string} val - Value of data-test attribute to search
* @returns {ShallowWrapper} - a ShallowWrapper component
*/
export const findByTestAttr = (wrapper, val) => {
  return wrapper.find(`[data-test="${val}"]`);
}
