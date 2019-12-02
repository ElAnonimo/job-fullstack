import { SORT } from '../actions/types';

const initialState = {
	sortBy: '',
	sortOrder: 'asc'
};

const sorting = (state = initialState, action) => {
	switch(action.type) {
		case SORT:
			return {
				...state,
				sortBy: action.payload.sortBy,
				sortOrder: action.payload.sortOrder
			};
		default:
			return state;
	}
};

export default sorting;
