import fetchDefaults from 'fetch-defaults';
import {
	GET_TIMESTAMPS,
	GET_ENTRIES_FOR_TIMESTAMP,
	ENTRIES_LOADING
} from './types';

const apiFetch = fetchDefaults(fetch, { headers: {
	'Content-Type': 'application/json',
	Authorization: localStorage.aisaToken
}});

// get all unique timestamps
export const getTimestamps = () => async dispatch => {
	console.log('getTimestamps() action fired');

	try {
		const res = await apiFetch('/api/subscriptions/timestamps', {
			method: 'POST'
		});

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
	// let timestamps = [];
	const urls = [];

	dispatch(setEntriesLoading());

	try {
		const timestampsRes = await apiFetch('/api/subscriptions/timestamps', {
			method: 'POST'
		});
		const timestamps = await timestampsRes.json();
		console.log('timestamps from getEntriesForTimestamp action:', timestamps);
		// timestamps.forEach(tms => urls.push(`/api/subscriptions/entries/${tms}`));
		console.log('JSON.stringify({ timestamps }):', JSON.stringify({ timestamps }));

		const entriesRes = await apiFetch('/api/subscriptions/entries', {
			method: 'POST',
			body: JSON.stringify({ timestamps })
		});
		const entries = await entriesRes.json();

		dispatch({
			type: GET_ENTRIES_FOR_TIMESTAMP,
			payload: entries
		})
		
		/* Promise.all(urls.map(u => apiFetch(u, {
			method: 'POST',
			// headers: { 'Content-Type': 'application/json' },
			// body: JSON.stringify({ username: 'mikki', password: 'test' })
		})))
		.then(responses => Promise.all(responses.map(res => res.json())))
		.then(entries => {
			dispatch({
				type: GET_ENTRIES_FOR_TIMESTAMP,
				payload: entries
			})
		});	*/
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
