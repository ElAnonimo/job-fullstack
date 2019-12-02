import fetchDefaults from 'fetch-defaults';
import {
	GET_TIMESTAMPS,
	GET_ENTRIES_FOR_TIMESTAMP,
	ENTRIES_LOADING
} from './types';

const apiFetch = fetchDefaults(fetch, { headers: {
	'Content-Type': 'application/json'
}});

// get all unique timestamps
export const getTimestamps = () => async dispatch => {
	try {
		const res = await apiFetch('/api/subscriptions/timestamps', {
			method: 'POST',
			headers: { 'x-auth-token': localStorage.aisaToken }
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
export const getEntriesForTimestamp = (displayIndex = {}) => async dispatch => {
	console.log('getEntriesForTimestamp action displayIndex:', displayIndex);
	
	dispatch(setEntriesLoading());

	try {
		const timestampsRes = await apiFetch('/api/subscriptions/timestamps', {
			method: 'POST',
			headers: { 'x-auth-token': localStorage.aisaToken }
		});

		const timestamps = await timestampsRes.json();
		
		const currentTimestampsToDisplay = timestamps.slice(displayIndex.startIndex, displayIndex.endIndex);

		const entriesRes = await apiFetch('/api/subscriptions/entries', {
			method: 'POST',
			headers: { 'x-auth-token': localStorage.aisaToken },
			body: JSON.stringify({ timestamps: currentTimestampsToDisplay })
		});

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
