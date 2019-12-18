import fetchDefaults from 'fetch-defaults';
import { GET_RECORDS, RECORDS_LOADING } from './types';

const apiFetch = fetchDefaults(fetch, { headers: {
	'Content-Type': 'application/json'
}});

// get records for table page
export const getRecordsForPage = (currentPage = 1, nameFilter = '', min = '', max = '', startDate = '', endDate = '', resultsPerPage = '', sortInComponent = {}) => async dispatch => {
	console.log('getRecordsForPage action min:', min);
	console.log('getRecordsForPage action nameFilter:', nameFilter);
	console.log('getRecordsForPage action resultsPerPage:', resultsPerPage);
	console.log('getRecordsForPage action sortInComponent:', sortInComponent);

	const unixStartTimestamp = parseInt((new Date(startDate).getTime() / 1000).toFixed(0), 10) || '';
	const unixEndTimestamp = parseInt((new Date(endDate).getTime() / 1000).toFixed(0), 10) || '';
	const sortBy = sortInComponent.sortBy;
	const sortOrder = sortInComponent.sortOrder;
	
	dispatch(setRecordsLoading());
	
	try {
		const res = await apiFetch(`/api/subscriptions/test/subs?page_number=${currentPage}&name_filter=${nameFilter}&min=${min}&max=${max}&unix_start_timestamp=${unixStartTimestamp}&unix_end_timestamp=${unixEndTimestamp}&per_page=${resultsPerPage}&sort_by=${sortBy}&sort_order=${sortOrder}`, {
			method: 'GET',
			headers: { 'x-auth-token': localStorage.aisaToken }
		});

		const data = await res.json();

		console.log('records action data:', data);

		dispatch({
			type: GET_RECORDS,
			payload: data,
			sortByFromAction: sortBy,
			sortOrderFromAction: sortOrder
		});
	} catch(ex) {
		console.log('getRecordsForPage action. Error fetching records for page from DB:', ex);
	}
};

// get all records from DB
export const getRecords = (sortby = 'price', order = 1, limit = 100) => async dispatch => {
	dispatch(setRecordsLoading());

	try {
		const res = await apiFetch(`/api/subscriptions/subs/${sortby}/${order}/${limit}`, {
			method: 'POST',
			headers: { 'x-auth-token': localStorage.aisaToken }
		});

		const data = await res.json();

		dispatch({
			type: GET_RECORDS,
			payload: data
		});
	} catch(ex) {
		console.log('error fetching all records from DB:', ex);
	}
};

// set records loading
export const setRecordsLoading = () => {
	return {
		type: RECORDS_LOADING
	};
};
