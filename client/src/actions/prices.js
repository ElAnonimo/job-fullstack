import fetchDefaults from 'fetch-defaults';
import axios from 'axios';
import { GET_PRICES, PRICES_LOADING } from './types';

console.log('localStorage.aisaToken from prices action:', localStorage.aisaToken);

const apiFetch = fetchDefaults(fetch, { headers: {
	'Content-Type': 'application/json',
	'x-auth-token': localStorage.aisaToken
}});

// get `price`s sum for each timestamp
export const getPrices = (timestamp = '', limit = 100) => async dispatch => {
	dispatch(setPricesLoading());

	try {
		const timestampsRes = await apiFetch('/api/subscriptions/timestamps', {
			method: 'POST'
		});
		// const timestamps = await axios.post('/api/subscriptions/timestamps');
		const timestamps = await timestampsRes.json();

		const pricesRes = await apiFetch(`/api/subscriptions/prcs/${limit}`, {
			method: 'POST',
			body: JSON.stringify({ timestamps	})
		});
		/* const pricesRes = await axios.post(`/api/subscriptions/prcs/${limit}`,
			JSON.stringify({ timestamps: timestamps.data	}),
			{ headers: { 'Content-Type': 'application/json' } }
		); */
		const prices = await pricesRes.json();

		dispatch({
			type: GET_PRICES,
			payload: prices
		});	
	} catch(ex) {
		console.log('error fetching all timestamps from DB from getPrices:', ex);
	}
};

// set prices loading
export const setPricesLoading = () => {
	return {
		type: PRICES_LOADING
	};
};
