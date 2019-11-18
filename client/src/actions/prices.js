import fetchDefaults from 'fetch-defaults';
import { GET_PRICES, PRICES_LOADING } from './types';

const apiFetch = fetchDefaults(fetch, { headers: {
	'Content-Type': 'application/json'
}});

// get `price`s sum for each timestamp
export const getPrices = (timestamp = '', limit = 100) => async dispatch => {
	dispatch(setPricesLoading());

	try {
		const timestampsRes = await apiFetch('/api/subscriptions/timestamps', {
			method: 'POST',
			headers: { 'x-auth-token': localStorage.aisaToken }
		});

		const timestamps = await timestampsRes.json();

		const pricesRes = await apiFetch(`/api/subscriptions/prcs/${limit}`, {
			method: 'POST',
			headers: { 'x-auth-token': localStorage.aisaToken },
			body: JSON.stringify({ timestamps	})
		});

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
