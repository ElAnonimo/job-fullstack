import { combineReducers } from 'redux';
import records from './records';
import timestamps from './timestamps';
import prices from './prices';
import entries from './entries';
import auth from './auth';

export default combineReducers({
	records,
	timestamps,
	prices,
	entries,
	auth
});
