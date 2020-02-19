import { combineReducers } from 'redux';
import { loader } from './loader';
import { layout } from './layout';
import { screening } from './screening';

export default combineReducers({
  layout,
  loader,
  screening,
});
