import { combineReducers } from 'redux';
import records from './records';
import timestamps from './timestamps';
import prices from './prices';
import entries from './entries';
import auth from './auth';
import sorting from './sorting';

export default combineReducers({
	records,
	timestamps,
	prices,
	entries,
	auth,
	sorting
});
