import { SORT } from './types';

export const sort = (sortBy = 'price', sortOrder = 'asc') => {
	console.log('sort action sortOrder:', sortOrder);

	return {
		type: SORT,
		payload: {
			sortBy,
			sortOrder
		}
	};
};
