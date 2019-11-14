import fetchDefaults from 'fetch-defaults';
import axios from 'axios';

const apiFetch = token => {
	if (token) {
		return fetchDefaults(fetch, {
			headers: {
				'Content-Type': 'application/json',
				'x-auth-token': token
			}
		});
	} else {
		return fetchDefaults(fetch, {
			headers: {
				'Content-Type': 'application/json',
				'x-auth-token': {}
			}
		});
	}
};

const setAuthToken = token => {
	console.log('token from setAuthToken:', token);

  if (token) {
		axios.defaults.headers.common['Authorization'] = token;
		// axios.defaults.headers.post['Content-Type'] = 'application/json';
  } else {
    delete axios.defaults.headers.common['Authorization'];
	}

	/* axios.create({
		baseURL: '/api/subscriptions/',
		headers: {
			Authorization: token,
			'Content-Type': 'application/json'
		}
	}); */
	
	/* axios.interceptors.request.use(function(config) {
		config.headers.Authorization = token;
		return config;
	}) */
};

export default setAuthToken;
