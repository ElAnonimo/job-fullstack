import fetchDefaults from 'fetch-defaults';
import { GET_RECORDS, RECORDS_LOADING } from './types';


const apiFetch = fetchDefaults(fetch, { headers: {
	'Content-Type': 'application/json'
}});

// get all records from DB
export const getRecords = (sortby = 'price', order = 1, limit = 100) => async dispatch => {
	dispatch(setRecordsLoading());

	try {
		const res = await apiFetch(`/api/subscriptions/subs/${sortby}/${order}/${limit}`, {
			method: 'POST',
			headers: { 'x-auth-token': localStorage.aisaToken }
		});

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
