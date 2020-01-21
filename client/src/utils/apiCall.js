import { getRecordsForPage } from '../actions/records';

export const apiCall = (
	currentPage, nameFilter, min, max, startDate, endDate, resultsPerPage, sortInComponent
) => getRecordsForPage(currentPage, nameFilter, min, max, startDate, endDate, resultsPerPage, sortInComponent);
