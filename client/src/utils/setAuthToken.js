import fetchDefaults from 'fetch-defaults';

const apiFetch = token => {
	if (token) {
		return fetchDefaults(fetch, {
			headers: {
				'Content-Type': 'application/json',
				Authorization: token
			}
		});
	} else {
		return fetchDefaults(fetch, {
			headers: {
				'Content-Type': 'application/json',
				Authorization: {}
			}
		});
	}
};

export default apiFetch;
