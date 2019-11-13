import {
	LOGIN_SUCCESS,
	LOGIN_FAIL,
	LOGOUT,
	USER_LOADED
} from '../actions/types';

const initialState = {
	// token: localStorage.getItem('aisaToken'),
	isAutenticated: false,
	// user: null
	message: null
};

const auth = (state = initialState, action) => {
	switch(action.type) {
		case USER_LOADED:
			console.log('USER_LOADED from auth reducer:', USER_LOADED);
			return {
				...state,
				isAutenticated: true
			};
		case LOGIN_SUCCESS:
			localStorage.setItem('aisaToken', action.payload.token);

			console.log('action.payload from auth reducer:', action.payload);
			console.log('action.type from auth reducer:', action.type);

			return {
				...state,
				// ...action.payload.token,		// token
				isAutenticated: true,
				message: null
			};
		case LOGIN_FAIL:
		case LOGOUT:	
			localStorage.removeItem('aisaToken');
			
			return {
				...state,
				token: null,
				isAutenticated: false,
				message: action.message
			};
		default:
			return state;
	}
};

export default auth;
