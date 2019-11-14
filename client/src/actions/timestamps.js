import fetchDefaults from 'fetch-defaults';
import axios from 'axios';
import {
	GET_TIMESTAMPS,
	GET_ENTRIES_FOR_TIMESTAMP,
	ENTRIES_LOADING
} from './types';

const apiFetch = fetchDefaults(fetch, { headers: {
	'Content-Type': 'application/json',
	'x-auth-token': localStorage.aisaToken
}});

// get all unique timestamps
export const getTimestamps = () => async dispatch => {
	console.log('getTimestamps() action fired');

	try {
		const res = await apiFetch('/api/subscriptions/timestamps', {
			method: 'POST'
		});
		// const res = await axios.post('/api/subscriptions/timestamps');

		const data = await res.json();

		dispatch({
			type: GET_TIMESTAMPS,
			payload: data
		});
	} catch(ex) {
		console.log('error fetching all timestamps from DB:', ex);
	}
};

// get number of entries for a timestamp
export const getEntriesForTimestamp = () => async dispatch => {
	dispatch(setEntriesLoading());

	try {
		const timestampsRes = await apiFetch('/api/subscriptions/timestamps', {
			method: 'POST'
		});
		// const timestampsRes = axios.post('/api/subscriptions/timestamps',);
		const timestamps = await timestampsRes.json();
		console.log('timestamps from getEntriesForTimestamp action:', timestampsRes);
		console.log('JSON.stringify({ timestampsRes }):', JSON.stringify({ timestampsRes }));

		const entriesRes = await apiFetch('/api/subscriptions/entries', {
			method: 'POST',
			body: JSON.stringify({ timestamps })
		});
		/* const entriesRes = await axios.post('/api/subscriptions/entries',
			JSON.stringify({ timestamps: timestampsRes.data })
		); */
		const entries = await entriesRes.json();

		dispatch({
			type: GET_ENTRIES_FOR_TIMESTAMP,
			payload: entries
		})
	} catch(ex) {
		console.log('timestamp action. error fetching number of entries for a timestamp:', ex);
	}
};

// set entries for timestamps loading
export const setEntriesLoading = () => {
	return {
		type: ENTRIES_LOADING
	}
};
