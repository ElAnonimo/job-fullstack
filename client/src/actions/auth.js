import jwt from 'jsonwebtoken';
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

		jwt.sign(payload, 'jwtSecretWord', { expiresIn: 60 * 60 * 1000 }, (err, token) => {
			if (err) {
				throw err;
			}

			dispatch({
				type: LOGIN_SUCCESS,
				payload: { token }
			});

			dispatch(loadUser());
		});
	} else {
		dispatch({
			type: LOGIN_FAIL,
			message: 'имя пользователя или пароль неверны'
		});
	}
};

// load user from localStorage token on application start
export const loadUser = () => async dispatch => {
	if (localStorage.aisaToken) {
		setAuthToken(localStorage.aisaToken);

		const decodedToken = jwt.decode(localStorage.aisaToken, 'jwtSecretWord');

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
