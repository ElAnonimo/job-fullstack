import jwt from 'jsonwebtoken';
import {
	LOGIN_SUCCESS,
	LOGIN_FAIL,
	LOGOUT,
	USER_LOADED,
	AUTH_ERROR
} from './types';

// log user in
export const login = (username, password) => dispatch => {
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

			// console.log('token from login action:', token);

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
	console.log('localStorage.aisaToken from loadUser action:', localStorage.aisaToken);
	if (localStorage.aisaToken) {
		const decodedToken = jwt.decode(localStorage.aisaToken, 'jwtSecretWord');
		console.log('decodedToken from loadUser action:', decodedToken);

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
	}
};

// log user out
export const logout = () => dispatch => {
	dispatch({
		type: LOGOUT
	});
};
