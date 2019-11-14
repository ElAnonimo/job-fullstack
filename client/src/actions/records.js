import fetchDefaults from 'fetch-defaults';
import axios from 'axios';
import { GET_RECORDS, RECORDS_LOADING } from './types';

const apiFetch = fetchDefaults(fetch, { headers: {
	'Content-Type': 'application/json',
	'x-auth-token': localStorage.aisaToken
}});

// get all records from DB
export const getRecords = (sortby = 'price', order = 1, limit = 100) => async dispatch => {
	console.log('sortby from getRecords:', sortby);
	console.log('order from getRecords:', order);
	console.log('limit from getRecords:', limit);

	dispatch(setRecordsLoading());

	try {
		const res = await apiFetch(`/api/subscriptions/subs/${sortby}/${order}/${limit}`, {
			method: 'POST'
		});

		/* const res = await axios.post(`/api/subscriptions/subs/${sortby}/${order}/${limit}`,
			null,
			{ headers: { 'Content-Type': 'application/json' } }
		); */

		const data = await res.json();

		dispatch({
			type: GET_RECORDS,
			payload: data
		});
	} catch(ex) {
		console.log('error fetching all records from DB:', ex);
	}
};

// set records loading
export const setRecordsLoading = () => {
	return {
		type: RECORDS_LOADING
	};
};
