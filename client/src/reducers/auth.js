import Cookies from 'js-cookie';
import {
	LOGIN_SUCCESS,
	LOGIN_FAIL,
	LOGOUT,
	USER_LOADED,
	AUTH_ERROR
} from '../actions/types';

const initialState = {
	isAutenticated: false,
	loading: true,
	message: ''
};

const auth = (state = initialState, action) => {
	switch(action.type) {
		case USER_LOADED:
			return {
				...state,
				isAutenticated: true,
				loading: false
			};
		case LOGIN_SUCCESS:
			return {
				...state,
				...action.payload,		// token
				isAutenticated: true,
				loading: false
			};
		case LOGIN_FAIL:
		case LOGOUT:
		case AUTH_ERROR:	
			Cookies.remove('authToken');
			
			return {
				...state,
				token: null,
				isAutenticated: false,
				message: action.message,
				loading: false
			};
		default:
			return state;
	}
};

export default auth;
