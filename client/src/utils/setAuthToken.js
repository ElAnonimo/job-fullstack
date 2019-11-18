import axios from 'axios';

const setAuthToken = token => {
	console.log('token from setAuthToken:', token);

  if (token) {
		axios.defaults.headers.common['Authorization'] = token;
  } else {
    delete axios.defaults.headers.common['Authorization'];
	}
};

export default setAuthToken;
