import { GET_RECORDS, RECORDS_LOADING } from '../actions/types';

const initialState = {
	records: [],
	loading: true,
	sortBy: '',
	sortOrder: ''
};

const records = (state = initialState, action) => {
	switch(action.type) {
		case RECORDS_LOADING:
			return {
				...state,
				loading: true
			};
		case GET_RECORDS:
			return {
				...state,
				records: action.payload,
				loading: false,
				sortByFromAction: action.sortBy,
				sortOrderFromAction: action.sortOrder
			};
		default:
			return state;
	}
};

export default records;
