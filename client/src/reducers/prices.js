import { GET_PRICES, PRICES_LOADING } from '../actions/types';

const initialState = {
	prices: [],
	loading: true
};

const prices = (state = initialState, action) => {
	switch(action.type) {
		case PRICES_LOADING:
			return {
				...state,
				loading: true
			};
		case GET_PRICES:
			return {
				...state,
				prices: action.payload,
				loading: false
			};
		default:
			return state;
	}
};

export default prices;
