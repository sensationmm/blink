import { combineReducers } from 'redux';
import { loader } from './loader';
import { layout } from './layout';
import { auth } from './auth';
import { screening } from './screening';

export default combineReducers({
  layout,
  loader,
  screening,
  auth
});
