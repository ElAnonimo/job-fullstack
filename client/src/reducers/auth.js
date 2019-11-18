import {
	LOGIN_SUCCESS,
	LOGIN_FAIL,
	LOGOUT,
	USER_LOADED,
	AUTH_ERROR
} from '../actions/types';

const initialState = {
	token: localStorage.getItem('aisaToken'),
	isAutenticated: false,
	loading: true,
	message: ''
};

const auth = (state = initialState, action) => {
	switch(action.type) {
		case USER_LOADED:
			console.log('USER_LOADED from auth reducer:', USER_LOADED);
			return {
				...state,
				isAutenticated: true,
				loading: false
			};
		case LOGIN_SUCCESS:
			localStorage.setItem('aisaToken', action.payload.token);

			console.log('action.payload from auth reducer:', action.payload);
			console.log('action.type from auth reducer:', action.type);

			return {
				...state,
				token: action.payload.token,		// token
				isAutenticated: true,
				// message: '',
				loading: false
			};
		case LOGIN_FAIL:
		case LOGOUT:
		case AUTH_ERROR:	
			localStorage.removeItem('aisaToken');
			
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
