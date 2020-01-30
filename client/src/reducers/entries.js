import { GET_ENTRIES_FOR_TIMESTAMP, ENTRIES_LOADING } from '../actions/types';

const initialState = {
	entries: [],
	loading: true
};

const entries = (state = initialState, action) => {
	switch(action.type) {
		case ENTRIES_LOADING:
			return {
				...state,
				loading: true
			};
		case GET_ENTRIES_FOR_TIMESTAMP:
			return {
				...state,
				entries: action.payload,
				loading: false
			};
		default:
			return state;
	}
};

export default entries;
