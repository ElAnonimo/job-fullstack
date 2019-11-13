import { GET_TIMESTAMPS } from '../actions/types';

const initialState = [];

const timestamps = (state = initialState, action) => {
	switch(action.type) {
		case GET_TIMESTAMPS:
			return {
				...state,
				timestamps: action.payload
			};
		default:
			return state;
	}
};

export default timestamps;
