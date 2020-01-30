import jwt from 'jsonwebtoken';
import Cookies from 'js-cookie';
import {
	LOGIN_SUCCESS,
	LOGIN_FAIL,
	LOGOUT,
	USER_LOADED,
	AUTH_ERROR
} from './types';
import setAuthToken from '../utils/setAuthToken';

// log user in
export const login = (username, password) => async dispatch => {
	if (username === 'mikki' && password === 'test') {
		const payload = {
			user: {
				username: username,
				password: password
			}
		};

		// expiresIn is expressed in seconds
		jwt.sign(payload, 'jwtSecretWord', { expiresIn: 60 * 60 }, (err, token) => {
			if (err) {
				throw err;
			}

			Cookies.set('authToken', token);

			dispatch({
				type: LOGIN_SUCCESS,
			});

			dispatch(loadUser());
		});
	} else {
		dispatch({
			type: LOGIN_FAIL,
			message: 'Имя пользователя или пароль неверны'
		});
	}
};

// load user from localStorage token on application start
export const loadUser = () => async dispatch => {
	let authToken = Cookies.get('authToken');

	if (authToken) {
		setAuthToken(authToken);

		const decodedToken = jwt.decode(authToken, 'jwtSecretWord');

		if (decodedToken.user.username === 'mikki') {
			dispatch({
				type: USER_LOADED
			});
		} else {
			dispatch({
				type: AUTH_ERROR,
				message: 'token username or password is incorrect'
			});
		}
	} else {
		dispatch({
			type: AUTH_ERROR
		});
	}
};

// log user out
export const logout = () => dispatch => {
	dispatch({
		type: LOGOUT
	});
};
