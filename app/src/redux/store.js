import { applyMiddleware, compose, createStore } from 'redux'
import { routerMiddleware } from 'connected-react-router'
import thunk from 'redux-thunk';
import rootReducer from './reducers';

const initialState = {};
const enhancers = [];
export const middleware = [thunk, routerMiddleware()];

const loadDevTools = () =>
    process.env.NODE_ENV === 'development' && window.__REDUX_DEVTOOLS_EXTENSION__
        ?
        window.__REDUX_DEVTOOLS_EXTENSION__()
        : f => f;

if (typeof devToolsExtension === 'function') {
    enhancers.push(loadDevTools());
}

const composedEnhancers = compose(applyMiddleware(...middleware), ...enhancers);

export default createStore(rootReducer, initialState, composedEnhancers);
